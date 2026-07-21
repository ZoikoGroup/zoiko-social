import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
  ) {}

  /**
   * Of `candidateIds`, return the set that MUTUALLY follows `actorId` (both
   * directions active). Only mutual-follow users may be added to a group
   * directly; everyone else gets a pending invitation they must accept.
   */
  private async mutualFollowers(actorId: string, candidateIds: string[]): Promise<Set<string>> {
    if (candidateIds.length === 0) return new Set()
    const follows = await this.prisma.follow.findMany({
      where: {
        status: 'active',
        OR: [
          { followerId: actorId, followingId: { in: candidateIds } },
          { followingId: actorId, followerId: { in: candidateIds } },
        ],
      },
      select: { followerId: true, followingId: true },
    })
    const actorFollows = new Set<string>() // actor -> x
    const followsActor = new Set<string>() // x -> actor
    for (const f of follows) {
      if (f.followerId === actorId) actorFollows.add(f.followingId)
      if (f.followingId === actorId) followsActor.add(f.followerId)
    }
    return new Set(candidateIds.filter((id) => actorFollows.has(id) && followsActor.has(id)))
  }

  /**
   * Send a pending group invitation to each id: persist a `group_invite`
   * notification (surfaces in the alerts bell/feed) and push a realtime
   * `group:invited` event (drives the live invites list in Messages).
   */
  private async notifyInvited(
    inviterId: string,
    inviterName: string,
    groupId: string,
    conversationId: string,
    groupName: string,
    inviteeIds: string[],
  ): Promise<void> {
    for (const uid of inviteeIds) {
      await this.notifications.enqueue({
        userId: uid,
        type: 'group_invite',
        title: 'Group invitation',
        body: `${inviterName} invited you to join "${groupName}"`,
        data: { groupId, conversationId, groupName, inviterId, status: 'pending' },
      })
      await this.realtime.publishToUser(uid, 'group:invited', {
        groupId,
        conversationId,
        groupName,
        inviterId,
      })
    }
  }

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

    const allowed = await this.allowedInvitees(ownerId, input.participantIds)
    // Only mutual-follow users join immediately; the rest receive a pending
    // invitation they must accept before they can see the group.
    const mutual = await this.mutualFollowers(ownerId, allowed)
    const directIds = allowed.filter((id) => mutual.has(id))
    const inviteIds = allowed.filter((id) => !mutual.has(id))

    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'group',
        name: input.name,
        createdBy: ownerId,
        members: {
          createMany: {
            // Only the owner + direct (mutual) members get conversation access
            // now. Invitees are added to the conversation on accept.
            data: [
              { userId: ownerId, groupRole: 'owner' },
              ...directIds.map((pid) => ({ userId: pid, groupRole: 'member' as const })),
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

    // Populate GroupMember rows. Direct members are approved; invitees are
    // stored as isApproved=false (pending) until they accept. Group admin ops
    // (updateGroup/addMembers/removeMember) authorize off group_members, so the
    // owner must be written here or every admin op throws NOT_ADMIN.
    await this.prisma.groupMember.createMany({
      data: [
        { groupId: group.id, userId: ownerId, role: 'owner' as const },
        ...directIds.map((pid) => ({ groupId: group.id, userId: pid, role: 'member' as const })),
        ...inviteIds.map((pid) => ({
          groupId: group.id,
          userId: pid,
          role: 'member' as const,
          isApproved: false,
          invitedBy: ownerId,
        })),
      ],
      skipDuplicates: true,
    })

    // Notify direct members that the group now exists.
    for (const pid of directIds) {
      await this.realtime.publishToUser(pid, 'group:created', {
        groupId: group.id,
        conversationId: conversation.id,
        name: input.name,
      })
    }

    // Send pending invitations to the non-mutual users.
    if (inviteIds.length > 0) {
      const owner = await this.prisma.profile.findUnique({
        where: { id: ownerId },
        select: { displayName: true, username: true },
      })
      await this.notifyInvited(
        ownerId,
        owner?.displayName ?? owner?.username ?? 'Someone',
        group.id,
        conversation.id,
        input.name,
        inviteIds,
      )
    }

    return {
      id: group.id,
      conversationId: group.conversationId,
      name: conversation.name,
      description: group.description,
      type: group.type,
      addedCount: directIds.length,
      invitedCount: inviteIds.length,
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
      where: { groupId, userId, isApproved: true },
    })
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      throw new ForbiddenException({ code: 'NOT_ADMIN', message: 'Only admins can add members' })
    }

    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException({ code: 'GROUP_NOT_FOUND', message: 'Group not found' })

    // Skip anyone who has blocked the actor (or whom the actor blocked) — a
    // blocked user must not be force-joined into a group with the person who
    // blocked them.
    const allowed = await this.allowedInvitees(userId, userIds)
    if (allowed.length === 0) return

    const currentCount = await this.prisma.groupMember.count({
      where: { groupId },
    })
    if (currentCount + allowed.length > group.maxMembers) {
      throw new BadRequestException({ code: 'GROUP_FULL', message: 'Group member limit reached' })
    }

    // Only mutual-follow users join directly; the rest get a pending invitation.
    const mutual = await this.mutualFollowers(userId, allowed)
    const directIds = allowed.filter((id) => mutual.has(id))
    const inviteIds = allowed.filter((id) => !mutual.has(id))

    for (const newUserId of directIds) {
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

    if (inviteIds.length > 0) {
      // Record pending invites (skip anyone already a member/invitee).
      await this.prisma.groupMember.createMany({
        data: inviteIds.map((pid) => ({
          groupId,
          userId: pid,
          role: 'member' as const,
          isApproved: false,
          invitedBy: userId,
        })),
        skipDuplicates: true,
      })
      const inviter = await this.prisma.profile.findUnique({
        where: { id: userId },
        select: { displayName: true, username: true },
      })
      const conv = await this.prisma.conversation.findUnique({
        where: { id: group.conversationId },
        select: { name: true },
      })
      await this.notifyInvited(
        userId,
        inviter?.displayName ?? inviter?.username ?? 'Someone',
        groupId,
        group.conversationId,
        conv?.name ?? 'a group',
        inviteIds,
      )
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

  /** Pending group invitations addressed to `userId` (isApproved=false rows). */
  async getMyInvites(userId: string) {
    const invites = await this.prisma.groupMember.findMany({
      where: { userId, isApproved: false },
      include: {
        group: { include: { conversation: { select: { id: true, name: true } } } },
      },
      orderBy: { joinedAt: 'desc' },
    })

    const inviterIds = [...new Set(invites.map((i) => i.invitedBy).filter((v): v is string => !!v))]
    const inviters = inviterIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: inviterIds } },
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        })
      : []
    const inviterMap = new Map(inviters.map((p) => [p.id, p]))

    // Member counts per group (approved members only).
    const groupIds = invites.map((i) => i.groupId)
    const counts = groupIds.length
      ? await this.prisma.groupMember.groupBy({
          by: ['groupId'],
          where: { groupId: { in: groupIds }, isApproved: true },
          _count: { _all: true },
        })
      : []
    const countMap = new Map(counts.map((c) => [c.groupId, c._count._all]))

    return invites.map((i) => ({
      groupId: i.groupId,
      conversationId: i.group.conversationId,
      name: i.group.conversation.name,
      description: i.group.description,
      memberCount: countMap.get(i.groupId) ?? 0,
      invitedBy: i.invitedBy
        ? (() => {
            const p = inviterMap.get(i.invitedBy!)
            return p
              ? {
                  id: p.id,
                  username: p.username,
                  displayName: p.displayName,
                  avatarUrl: p.avatarUrl,
                }
              : null
          })()
        : null,
      createdAt: i.joinedAt.toISOString(),
    }))
  }

  /** Accept a pending invitation: become a full member with conversation access. */
  async acceptInvite(userId: string, groupId: string): Promise<{ conversationId: string }> {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    })
    if (!membership) {
      throw new NotFoundException({ code: 'INVITE_NOT_FOUND', message: 'Invitation not found' })
    }
    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException({ code: 'GROUP_NOT_FOUND', message: 'Group not found' })

    if (!membership.isApproved) {
      await this.prisma.groupMember.update({
        where: { id: membership.id },
        data: { isApproved: true },
      })
      await this.prisma.conversationMember.upsert({
        where: { conversationId_userId: { conversationId: group.conversationId, userId } },
        create: { conversationId: group.conversationId, userId },
        update: { isDeleted: false, deletedAt: null },
      })
      // Tell existing members someone joined, and confirm to the accepter.
      await this.realtime.publish(`conversation:${group.conversationId}`, 'group:member_joined', {
        groupId,
        userId,
      })
      await this.realtime.publishToUser(userId, 'group:added', {
        groupId,
        conversationId: group.conversationId,
      })
    }

    return { conversationId: group.conversationId }
  }

  /** Decline a pending invitation: remove the pending membership row. */
  async rejectInvite(userId: string, groupId: string): Promise<void> {
    await this.prisma.groupMember.deleteMany({
      where: { groupId, userId, isApproved: false },
    })
  }
}
