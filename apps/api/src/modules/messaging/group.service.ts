import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  /**
   * Drop invitees who have blocked the actor (or whom the actor has blocked) and
   * de-duplicate. Force-adding someone into a group with a user they've blocked is
   * a harassment vector, so those ids are silently filtered out.
   */
  private async allowedInvitees(actorId: string, candidateIds: string[]): Promise<string[]> {
    const unique = [...new Set(candidateIds)].filter((id) => id !== actorId)
    if (unique.length === 0) return []
    const blocks = await this.prisma.blockedUser.findMany({
      where: {
        OR: [
          { blockerId: actorId, blockedId: { in: unique } },
          { blockedId: actorId, blockerId: { in: unique } },
        ],
      },
      select: { blockerId: true, blockedId: true },
    })
    const blockedIds = new Set(blocks.flatMap((b) => [b.blockerId, b.blockedId]))
    return unique.filter((id) => !blockedIds.has(id))
  }

  async createGroup(ownerId: string, input: { name: string; participantIds: string[]; description?: string; type?: string }) {
    if (input.participantIds.includes(ownerId)) {
      throw new BadRequestException({ code: 'SELF_IN_GROUP', message: 'Owner is automatically added' })
    }

    const inviteeIds = await this.allowedInvitees(ownerId, input.participantIds)

    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'group',
        name: input.name,
        createdBy: ownerId,
        members: {
          createMany: {
            data: [
              { userId: ownerId, groupRole: 'owner' },
              ...inviteeIds.map((pid) => ({ userId: pid, groupRole: 'member' as const })),
            ],
          },
        },
      },
    })

    const group = await this.prisma.group.create({
      data: {
        conversationId: conversation.id,
        type: (input.type as never) ?? 'private',
        description: input.description ?? null,
      },
      include: {
        conversation: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, username: true, displayName: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    })

    // Populate GroupMember rows for the owner + initial members. Group admin ops
    // (updateGroup/addMembers/removeMember) authorize off group_members, but
    // createGroup previously only wrote ConversationMember.groupRole — so
    // group_members stayed empty and every admin op threw NOT_ADMIN, even for the
    // owner.
    await this.prisma.groupMember.createMany({
      data: [
        { groupId: group.id, userId: ownerId, role: 'owner' as const },
        ...inviteeIds.map((pid) => ({ groupId: group.id, userId: pid, role: 'member' as const })),
      ],
      skipDuplicates: true,
    })

    // Notify all members
    for (const pid of inviteeIds) {
      await this.realtime.publishToUser(pid, 'group:created', {
        groupId: group.id,
        conversationId: conversation.id,
        name: input.name,
      })
    }

    return {
      id: group.id,
      conversationId: group.conversationId,
      name: conversation.name,
      description: group.description,
      type: group.type,
      members: group.conversation.members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        role: m.groupRole,
      })),
      createdAt: group.createdAt.toISOString(),
    }
  }

  async getGroup(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        conversation: {
          include: {
            members: {
              where: { isDeleted: false },
              include: {
                user: {
                  select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
                },
              },
            },
          },
        },
      },
    })

    if (!group) throw new NotFoundException({ code: 'GROUP_NOT_FOUND', message: 'Group not found' })

    const isMember = group.conversation.members.some((m) => m.userId === userId)
    if (!isMember) throw new ForbiddenException({ code: 'NOT_MEMBER', message: 'You are not a member of this group' })

    return {
      id: group.id,
      conversationId: group.conversationId,
      name: group.conversation.name,
      description: group.description,
      coverImageUrl: group.coverImageUrl,
      type: group.type,
      isAnnouncement: group.isAnnouncement,
      slowModeSeconds: group.slowModeSeconds,
      maxMembers: group.maxMembers,
      members: group.conversation.members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        isVerified: m.user.verificationTier === 'professional',
        role: m.groupRole,
        joinedAt: m.joinedAt.toISOString(),
      })),
      createdAt: group.createdAt.toISOString(),
    }
  }

  async updateGroup(userId: string, groupId: string, input: { name?: string; description?: string; coverImageUrl?: string }) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    })
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      throw new ForbiddenException({ code: 'NOT_ADMIN', message: 'Only admins can update the group' })
    }

    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException({ code: 'GROUP_NOT_FOUND', message: 'Group not found' })

    if (input.name) {
      await this.prisma.conversation.update({
        where: { id: group.conversationId },
        data: { name: input.name },
      })
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
      },
    })

    await this.realtime.publish(`conversation:${group.conversationId}`, 'group:updated', {
      groupId,
      ...input,
    })
  }

  async addMembers(userId: string, groupId: string, userIds: string[]) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    })
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      throw new ForbiddenException({ code: 'NOT_ADMIN', message: 'Only admins can add members' })
    }

    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException({ code: 'GROUP_NOT_FOUND', message: 'Group not found' })

    // Skip anyone who has blocked the actor (or whom the actor blocked) — a
    // blocked user must not be force-joined into a group with the person who
    // blocked them.
    const inviteeIds = await this.allowedInvitees(userId, userIds)
    if (inviteeIds.length === 0) return

    const currentCount = await this.prisma.groupMember.count({
      where: { groupId },
    })
    if (currentCount + inviteeIds.length > group.maxMembers) {
      throw new BadRequestException({ code: 'GROUP_FULL', message: 'Group member limit reached' })
    }

    for (const newUserId of inviteeIds) {
      try {
        await this.prisma.groupMember.create({
          data: { groupId, userId: newUserId, role: 'member', invitedBy: userId },
        })
        // Also add to conversation members
        await this.prisma.conversationMember.upsert({
          where: { conversationId_userId: { conversationId: group.conversationId, userId: newUserId } },
          create: { conversationId: group.conversationId, userId: newUserId },
          update: { isDeleted: false, deletedAt: null },
        })
        await this.realtime.publishToUser(newUserId, 'group:added', {
          groupId,
          conversationId: group.conversationId,
        })
      } catch {
        // Already a member — skip
      }
    }
  }

  async removeMember(userId: string, groupId: string, targetUserId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    })
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      throw new ForbiddenException({ code: 'NOT_ADMIN', message: 'Only admins can remove members' })
    }

    // The owner can never be removed, and only the owner may remove another admin
    // — otherwise an admin could evict the owner (or each other) and seize the
    // group.
    const target = await this.prisma.groupMember.findFirst({
      where: { groupId, userId: targetUserId },
    })
    if (target?.role === 'owner') {
      throw new ForbiddenException({ code: 'CANNOT_REMOVE_OWNER', message: 'The group owner cannot be removed' })
    }
    if (target?.role === 'admin' && membership.role !== 'owner') {
      throw new ForbiddenException({ code: 'CANNOT_REMOVE_ADMIN', message: 'Only the owner can remove an admin' })
    }

    await this.prisma.groupMember.deleteMany({
      where: { groupId, userId: targetUserId },
    })
    await this.prisma.conversationMember.updateMany({
      where: { conversationId: (await this.prisma.group.findUnique({ where: { id: groupId } }))!.conversationId, userId: targetUserId },
      data: { isDeleted: true, deletedAt: new Date() },
    })
  }

  async leaveGroup(userId: string, groupId: string) {
    await this.prisma.groupMember.deleteMany({
      where: { groupId, userId },
    })
    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (group) {
      await this.prisma.conversationMember.updateMany({
        where: { conversationId: group.conversationId, userId },
        data: { isDeleted: true, deletedAt: new Date() },
      })
    }
  }
}
