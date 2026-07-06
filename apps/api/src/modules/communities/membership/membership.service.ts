import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { RealtimeService } from '../../realtime/realtime.service'
import { NotificationQueueService } from '../../queue/notification-queue.service'
import { decodeCursor, encodeCursor } from '../../common/utils/cursor-pagination'

export interface MemberItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  role: string
  joinedAt: string
}

const MAX_PAGE = 50

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private effects(label: string, fn: () => Promise<unknown>): void {
    void fn().catch((err) => this.logger.warn(`${label} side effects failed: ${(err as Error).message}`))
  }

  private async loadCommunity(communityId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, slug: true, name: true, privacy: true, isDeleted: true, rulesUpdatedAt: true },
    })
    if (!community || community.isDeleted) {
      throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
    }
    return community
  }

  // ── JOIN / LEAVE ──────────────────────────────────────────────────────────

  async join(userId: string, communityId: string, acceptRules?: boolean): Promise<{ status: string }> {
    const community = await this.loadCommunity(communityId)

    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    })
    if (existing?.status === 'banned') {
      throw new ForbiddenException({ code: 'BANNED', message: 'You are banned from this community' })
    }
    if (existing?.status === 'active') {
      return { status: 'joined' }
    }
    if (existing?.status === 'pending') {
      return { status: 'requested' }
    }

    if (community.privacy === 'invite_only') {
      throw new ForbiddenException({ code: 'INVITE_REQUIRED', message: 'This community is invite-only' })
    }

    // Rules consent when the community has rules
    if (community.rulesUpdatedAt) {
      const ruleCount = await this.prisma.communityRule.count({ where: { communityId } })
      if (ruleCount > 0 && !acceptRules) {
        throw new BadRequestException({ code: 'RULES_NOT_ACCEPTED', message: 'You must accept the community rules to join' })
      }
    }

    if (community.privacy === 'public') {
      await this.prisma.$transaction([
        this.prisma.communityMember.create({
          data: { communityId, userId, role: 'member', status: 'active', acceptedRulesAt: new Date() },
        }),
        this.prisma.community.update({ where: { id: communityId }, data: { membersCount: { increment: 1 } } }),
      ])
      await this.redis.invalidateMembership(communityId, userId)
      await this.redis.invalidateCommunity(communityId)
      this.effects('join', async () => {
        await this.realtime.publish(`community:${communityId}`, 'community:member', { communityId, joined: true })
      })
      return { status: 'joined' }
    }

    // Private → pending request
    await this.prisma.communityMember.upsert({
      where: { communityId_userId: { communityId, userId } },
      create: { communityId, userId, role: 'member', status: 'pending', acceptedRulesAt: acceptRules ? new Date() : null },
      update: { status: 'pending' },
    })
    await this.redis.invalidateMembership(communityId, userId)

    this.effects('join.request', async () => {
      const [requester, admins] = await Promise.all([
        this.prisma.profile.findUnique({ where: { id: userId }, select: { username: true, displayName: true } }),
        this.prisma.communityMember.findMany({
          where: { communityId, status: 'active', role: { in: ['owner', 'admin'] } },
          select: { userId: true },
        }),
      ])
      for (const admin of admins) {
        await this.notifications.enqueue({
          userId: admin.userId,
          type: 'community_join_request',
          title: 'Join Request',
          body: `${requester?.displayName ?? 'Someone'} wants to join ${community.name}`,
          data: { communityId, slug: community.slug, requesterId: userId, username: requester?.username, status: 'pending' },
        })
      }
    })

    return { status: 'requested' }
  }

  async leave(userId: string, communityId: string): Promise<void> {
    const membership = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    })
    if (!membership) {
      throw new NotFoundException({ code: 'NOT_A_MEMBER', message: 'You are not a member' })
    }
    if (membership.role === 'owner') {
      throw new ConflictException({ code: 'OWNER_MUST_TRANSFER', message: 'Transfer ownership before leaving' })
    }

    const wasActive = membership.status === 'active'
    await this.prisma.$transaction([
      this.prisma.communityMember.delete({ where: { communityId_userId: { communityId, userId } } }),
      ...(wasActive
        ? [this.prisma.community.update({ where: { id: communityId }, data: { membersCount: { decrement: 1 } } })]
        : []),
    ])
    await this.redis.invalidateMembership(communityId, userId)
    if (wasActive) await this.redis.invalidateCommunity(communityId)
  }

  // ── REQUESTS (private communities) ────────────────────────────────────────

  async listRequests(communityId: string, cursor: string | null, limit = 20) {
    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null
    const requests = await this.prisma.communityMember.findMany({
      where: {
        communityId,
        status: 'pending',
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), userId: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { userId: 'desc' }],
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      },
    })
    const hasMore = requests.length > take
    const items = hasMore ? requests.slice(0, take) : requests
    return {
      data: items.map((r) => ({
        id: r.user.id,
        username: r.user.username,
        displayName: r.user.displayName,
        avatarUrl: r.user.avatarUrl,
        isVerified: r.user.verificationTier === 'professional',
        requestedAt: r.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.userId) : null,
      hasMore,
    }
  }

  async respondToRequest(
    communityId: string,
    requesterId: string,
    action: 'approve' | 'reject' | 'block',
  ): Promise<void> {
    const community = await this.loadCommunity(communityId)
    const request = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: requesterId } },
    })
    if (!request || request.status !== 'pending') {
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Join request not found' })
    }

    if (action === 'approve') {
      await this.prisma.$transaction([
        this.prisma.communityMember.update({
          where: { communityId_userId: { communityId, userId: requesterId } },
          data: { status: 'active' },
        }),
        this.prisma.community.update({ where: { id: communityId }, data: { membersCount: { increment: 1 } } }),
      ])
      await this.redis.invalidateMembership(communityId, requesterId)
      await this.redis.invalidateCommunity(communityId)
      this.effects('request.approve', async () => {
        await this.syncRequestNotifications(communityId, requesterId, 'approved')
        await this.notifications.enqueue({
          userId: requesterId,
          type: 'community_request_approved',
          title: 'Request Approved',
          body: `Your request to join ${community.name} was approved`,
          data: { communityId, slug: community.slug },
        })
        await this.realtime.publish(`community:${communityId}`, 'community:member', { communityId, joined: true })
      })
    } else if (action === 'reject') {
      await this.prisma.communityMember.delete({
        where: { communityId_userId: { communityId, userId: requesterId } },
      })
      await this.redis.invalidateMembership(communityId, requesterId)
      // Reject notifies nobody (parity with follow-request rejection)
      this.effects('request.reject', () => this.syncRequestNotifications(communityId, requesterId, 'removed'))
    } else {
      // block
      await this.prisma.communityMember.update({
        where: { communityId_userId: { communityId, userId: requesterId } },
        data: { status: 'banned' },
      })
      await this.redis.invalidateMembership(communityId, requesterId)
      this.effects('request.block', () => this.syncRequestNotifications(communityId, requesterId, 'removed'))
    }
  }

  /** Keep admins' join-request notifications in sync (approved → mark read; removed → delete). */
  private async syncRequestNotifications(
    communityId: string,
    requesterId: string,
    outcome: 'approved' | 'removed',
  ): Promise<void> {
    const pending = await this.prisma.notification.findMany({
      where: {
        type: 'community_join_request',
        AND: [
          { data: { path: ['communityId'], equals: communityId } },
          { data: { path: ['requesterId'], equals: requesterId } },
          { data: { path: ['status'], equals: 'pending' } },
        ],
      },
    })
    if (pending.length === 0) return
    if (outcome === 'approved') {
      for (const n of pending) {
        await this.prisma.notification.update({
          where: { id: n.id },
          data: { data: { ...(n.data as Record<string, unknown>), status: 'approved' }, isRead: true },
        })
      }
    } else {
      await this.prisma.notification.deleteMany({ where: { id: { in: pending.map((n) => n.id) } } })
    }
  }

  // ── MEMBERS LIST ──────────────────────────────────────────────────────────

  async listMembers(communityId: string, roleFilter: string | undefined, cursor: string | null, limit = 30) {
    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null
    const members = await this.prisma.communityMember.findMany({
      where: {
        communityId,
        status: 'active',
        ...(roleFilter ? { role: roleFilter as 'owner' | 'admin' | 'moderator' | 'member' } : {}),
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), userId: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      // Owners/admins first, then join order
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }, { userId: 'desc' }],
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      },
    })
    const hasMore = members.length > take
    const items = hasMore ? members.slice(0, take) : members
    return {
      data: items.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        isVerified: m.user.verificationTier === 'professional',
        role: m.role,
        joinedAt: m.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.userId) : null,
      hasMore,
    }
  }

  // ── ROLES / MODERATION (membership side) ──────────────────────────────────

  async setRole(
    communityId: string,
    actorRole: string,
    targetUserId: string,
    newRole: 'admin' | 'moderator' | 'member',
  ): Promise<void> {
    const target = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    })
    if (!target || target.status !== 'active') {
      throw new NotFoundException({ code: 'NOT_A_MEMBER', message: 'Member not found' })
    }
    if (target.role === 'owner') {
      throw new ForbiddenException({ code: 'CANNOT_MODIFY_OWNER', message: "The owner's role cannot be changed" })
    }
    // Only the owner may create/modify admins
    if ((newRole === 'admin' || target.role === 'admin') && actorRole !== 'owner') {
      throw new ForbiddenException({ code: 'OWNER_ONLY', message: 'Only the owner can manage admins' })
    }

    await this.prisma.communityMember.update({
      where: { communityId_userId: { communityId, userId: targetUserId } },
      data: { role: newRole },
    })
    await this.redis.invalidateMembership(communityId, targetUserId)
    this.effects('setRole', async () => {
      await this.notifications.enqueue({
        userId: targetUserId,
        type: 'community_role_changed',
        title: 'Role Updated',
        body: `Your role was changed to ${newRole}`,
        data: { communityId, role: newRole },
      })
      await this.realtime.publish(`community:${communityId}`, 'community:role', { communityId, userId: targetUserId, role: newRole })
    })
  }

  async removeMember(communityId: string, actorRole: string, targetUserId: string, ban: boolean): Promise<void> {
    const community = await this.loadCommunity(communityId)
    const target = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    })
    if (!target) {
      throw new NotFoundException({ code: 'NOT_A_MEMBER', message: 'Member not found' })
    }
    if (target.role === 'owner') {
      throw new ForbiddenException({ code: 'CANNOT_REMOVE_OWNER', message: 'The owner cannot be removed' })
    }
    if (target.role === 'admin' && actorRole !== 'owner') {
      throw new ForbiddenException({ code: 'OWNER_ONLY', message: 'Only the owner can remove admins' })
    }

    const wasActive = target.status === 'active'
    if (ban) {
      await this.prisma.$transaction([
        this.prisma.communityMember.update({
          where: { communityId_userId: { communityId, userId: targetUserId } },
          data: { status: 'banned', role: 'member' },
        }),
        ...(wasActive
          ? [this.prisma.community.update({ where: { id: communityId }, data: { membersCount: { decrement: 1 } } })]
          : []),
      ])
    } else {
      await this.prisma.$transaction([
        this.prisma.communityMember.delete({ where: { communityId_userId: { communityId, userId: targetUserId } } }),
        ...(wasActive
          ? [this.prisma.community.update({ where: { id: communityId }, data: { membersCount: { decrement: 1 } } })]
          : []),
      ])
    }
    await this.redis.invalidateMembership(communityId, targetUserId)
    await this.redis.invalidateCommunity(communityId)
    this.effects('removeMember', async () => {
      await this.notifications.enqueue({
        userId: targetUserId,
        type: ban ? 'community_member_banned' : 'community_member_removed',
        title: ban ? 'Banned from Community' : 'Removed from Community',
        body: ban ? `You were banned from ${community.name}` : `You were removed from ${community.name}`,
        data: { communityId, slug: community.slug },
      })
      await this.realtime.publish(`community:${communityId}`, 'community:member', { communityId, left: true, userId: targetUserId })
    })
  }

  async unban(communityId: string, targetUserId: string): Promise<void> {
    const target = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    })
    if (!target || target.status !== 'banned') {
      throw new NotFoundException({ code: 'NOT_BANNED', message: 'This user is not banned' })
    }
    await this.prisma.communityMember.delete({ where: { communityId_userId: { communityId, userId: targetUserId } } })
    await this.redis.invalidateMembership(communityId, targetUserId)
  }

  async setMute(communityId: string, actorRole: string, targetUserId: string, duration: '1h' | '24h' | '7d' | null): Promise<void> {
    const target = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: targetUserId } },
    })
    if (!target || target.status !== 'active') {
      throw new NotFoundException({ code: 'NOT_A_MEMBER', message: 'Member not found' })
    }
    if (target.role === 'owner' || (target.role === 'admin' && actorRole !== 'owner')) {
      throw new ForbiddenException({ code: 'CANNOT_MUTE', message: 'You cannot mute this member' })
    }

    let mutedUntil: Date | null = null
    if (duration) {
      const ms = duration === '1h' ? 3_600_000 : duration === '24h' ? 86_400_000 : 604_800_000
      mutedUntil = new Date(Date.now() + ms)
    }
    await this.prisma.communityMember.update({
      where: { communityId_userId: { communityId, userId: targetUserId } },
      data: { mutedUntil },
    })
    await this.redis.invalidateMembership(communityId, targetUserId)
    if (mutedUntil) {
      this.effects('mute', () =>
        this.notifications.enqueue({
          userId: targetUserId,
          type: 'community_muted',
          title: 'Muted in Community',
          body: `You were muted for ${duration}`,
          data: { communityId },
        }),
      )
    }
  }

  // ── OWNERSHIP TRANSFER ────────────────────────────────────────────────────

  async transferOwnership(communityId: string, currentOwnerId: string, newOwnerId: string): Promise<void> {
    if (currentOwnerId === newOwnerId) {
      throw new BadRequestException({ code: 'ALREADY_OWNER', message: 'You are already the owner' })
    }
    const target = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: newOwnerId } },
    })
    if (!target || target.status !== 'active') {
      throw new NotFoundException({ code: 'NOT_A_MEMBER', message: 'New owner must be an active member' })
    }

    await this.prisma.$transaction([
      this.prisma.communityMember.update({
        where: { communityId_userId: { communityId, userId: currentOwnerId } },
        data: { role: 'admin' },
      }),
      this.prisma.communityMember.update({
        where: { communityId_userId: { communityId, userId: newOwnerId } },
        data: { role: 'owner' },
      }),
    ])
    await this.redis.invalidateMembership(communityId, currentOwnerId)
    await this.redis.invalidateMembership(communityId, newOwnerId)
    this.effects('transfer', () =>
      this.notifications.enqueue({
        userId: newOwnerId,
        type: 'community_role_changed',
        title: 'You are now the owner',
        body: 'Ownership was transferred to you',
        data: { communityId, role: 'owner' },
      }),
    )
  }
}
