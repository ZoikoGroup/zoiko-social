import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import { z } from 'zod'

// ── Validation Schemas ─────────────────────────────────────────────────────

export const FollowActionSchema = z.object({
  userId: z.string().uuid(),
})

export const SendFollowRequestSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().max(200).optional(),
})

export const RespondFollowRequestSchema = z.object({
  action: z.enum(['accept', 'reject']),
})

export const BlockUserSchema = z.object({
  reason: z.string().max(500).optional(),
})

export type FollowActionInput = z.infer<typeof FollowActionSchema>
export type SendFollowRequestInput = z.infer<typeof SendFollowRequestSchema>
export type RespondFollowRequestInput = z.infer<typeof RespondFollowRequestSchema>
export type BlockUserInput = z.infer<typeof BlockUserSchema>

// ── Response Types ─────────────────────────────────────────────────────────

export interface FollowerResponse {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  isVerified: boolean
  isProfessional: boolean
  followedAt: string
  /** Viewer context — powers Follow/Following buttons in lists */
  isMe: boolean
  viewerFollows: boolean
  viewerRequested: boolean
  /** This account follows the viewer — enables the "Follow Back" label */
  followsViewer: boolean
  isPrivate: boolean
}

export interface FollowRequestItem {
  id: string
  sender: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  }
  message: string | null
  createdAt: string
}

export interface BlockedUserItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  reason: string | null
  blockedAt: string
}

export interface MutedUserItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  mutedAt: string
}

export interface FollowSuggestion {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  mutualConnections: number
  isVerified: boolean
  isProfessional: boolean
  professionalCategory: string | null
}

export interface UserSearchResult extends FollowSuggestion {
  isPrivate: boolean
  viewerFollows: boolean
  viewerRequested: boolean
  followsViewer: boolean
}

const MAX_PAGE_SIZE = 50

// ── Network Service ────────────────────────────────────────────────────────

@Injectable()
export class NetworkService {
  private readonly logger = new Logger(NetworkService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
  ) {}

  // ── FOLLOW / UNFOLLOW ─────────────────────────────────────────────────────

  async followUser(followerId: string, followingId: string): Promise<{ status: string }> {
    if (followerId === followingId) {
      throw new BadRequestException({ code: 'CANNOT_FOLLOW_SELF', message: 'You cannot follow yourself' })
    }

    const [blockedByTarget, blockedByMe, targetProfile] = await Promise.all([
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: followingId, blockedId: followerId } },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: followerId, blockedId: followingId } },
      }),
      this.prisma.profile.findUnique({
        where: { id: followingId },
        select: { id: true, isPrivate: true, state: true },
      }),
    ])

    if (!targetProfile || targetProfile.state !== 'active' || blockedByTarget) {
      // Hide the distinction between "doesn't exist" and "blocked you"
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })
    }
    if (blockedByMe) {
      throw new ForbiddenException({ code: 'BLOCKED', message: 'Unblock this user before following them' })
    }

    // Private account → follow request flow
    if (targetProfile.isPrivate) {
      return this.sendFollowRequest(followerId, followingId)
    }

    // Transaction: create follow + atomic counter increments — all or nothing
    const created = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      })
      if (existing?.status === 'active') return false

      await tx.follow.upsert({
        where: { followerId_followingId: { followerId, followingId } },
        create: { followerId, followingId, status: 'active' },
        update: { status: 'active' },
      })

      if (!existing) {
        await tx.profile.update({
          where: { id: followingId },
          data: { followersCount: { increment: 1 } },
        })
        await tx.profile.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } },
        })
      }
      return true
    })

    if (!created) {
      return { status: 'already_following' }
    }

    await this.afterFollowChange(followerId, followingId, { followers: 1, following: 1 })
    await this.notifyNewFollower(followerId, followingId)

    return { status: 'following' }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const removed = await this.prisma.$transaction(async (tx) => {
      const follow = await tx.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      })
      if (!follow || follow.status !== 'active') return false

      await tx.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      })
      await tx.profile.update({
        where: { id: followingId },
        data: { followersCount: { decrement: 1 } },
      })
      await tx.profile.update({
        where: { id: followerId },
        data: { followingCount: { decrement: 1 } },
      })
      return true
    })

    if (!removed) {
      throw new NotFoundException({ code: 'NOT_FOLLOWING', message: 'You are not following this user' })
    }

    await this.afterFollowChange(followerId, followingId, { followers: -1, following: -1 })
  }

  async removeFollower(userId: string, followerId: string): Promise<void> {
    const removed = await this.prisma.$transaction(async (tx) => {
      const follow = await tx.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId: userId } },
      })
      if (!follow) return false

      await tx.follow.delete({
        where: { followerId_followingId: { followerId, followingId: userId } },
      })
      if (follow.status === 'active') {
        await tx.profile.update({
          where: { id: userId },
          data: { followersCount: { decrement: 1 } },
        })
        await tx.profile.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } },
        })
      }
      return true
    })

    if (!removed) {
      throw new NotFoundException({ code: 'FOLLOWER_NOT_FOUND', message: 'Follower not found' })
    }

    await this.afterFollowChange(followerId, userId, { followers: -1, following: -1 })
  }

  // ── FOLLOW REQUESTS (Private Accounts) ────────────────────────────────────

  private async sendFollowRequest(senderId: string, receiverId: string): Promise<{ status: string }> {
    const [existingRequest, existingFollow] = await Promise.all([
      this.prisma.followRequest.findUnique({
        where: { senderId_receiverId: { senderId, receiverId } },
      }),
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: senderId, followingId: receiverId } },
      }),
    ])

    if (existingFollow?.status === 'active') {
      return { status: 'already_following' }
    }
    if (existingRequest?.status === 'pending') {
      return { status: 'request_pending' }
    }

    const request = await this.prisma.followRequest.upsert({
      where: { senderId_receiverId: { senderId, receiverId } },
      create: { senderId, receiverId, status: 'pending' },
      update: { status: 'pending' },
    })

    await this.redis.invalidateRelationship(senderId, receiverId)

    const sender = await this.prisma.profile.findUnique({
      where: { id: senderId },
      select: { username: true, displayName: true, avatarUrl: true },
    })

    // A re-request reuses the same request row — remove any stale pending
    // notification first so the receiver only ever sees one actionable entry
    await this.prisma.notification.deleteMany({
      where: {
        userId: receiverId,
        type: 'follow_request',
        AND: [
          { data: { path: ['requestId'], equals: request.id } },
          { data: { path: ['status'], equals: 'pending' } },
        ],
      },
    })

    await this.notifications.enqueue({
      userId: receiverId,
      type: 'follow_request',
      title: 'New Follow Request',
      body: `${sender?.displayName ?? 'Someone'} wants to follow you`,
      data: { senderId, username: sender?.username, requestId: request.id, status: 'pending' },
    })
    await this.realtime.publishToUser(receiverId, 'network.request.new', {
      senderId,
      sender: sender ?? null,
    })

    return { status: 'request_sent' }
  }

  /** Instagram behavior: clicking "Requested" cancels the outgoing request. */
  async cancelFollowRequest(senderId: string, receiverId: string): Promise<void> {
    const request = await this.prisma.followRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    })
    if (!request || request.status !== 'pending') {
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'No pending follow request to cancel' })
    }

    await this.prisma.followRequest.delete({
      where: { senderId_receiverId: { senderId, receiverId } },
    })
    await this.redis.invalidateRelationship(senderId, receiverId)
    // A cancelled request vanishes from the receiver's notifications
    await this.syncRequestNotification(receiverId, request.id, 'cancelled')
  }

  /**
   * Keep the receiver's follow_request notification in sync with the request:
   * accepted → notification updates in place and is marked read;
   * rejected / cancelled → the notification is removed entirely.
   */
  private async syncRequestNotification(
    receiverId: string,
    requestId: string,
    outcome: 'accepted' | 'rejected' | 'cancelled',
  ): Promise<void> {
    // Re-requests reuse the same follow_request row (upsert on sender+receiver),
    // so multiple notifications can share one requestId — act on every one
    // still pending, never on already-accepted history entries.
    const pending = await this.prisma.notification.findMany({
      where: {
        userId: receiverId,
        type: 'follow_request',
        AND: [
          { data: { path: ['requestId'], equals: requestId } },
          { data: { path: ['status'], equals: 'pending' } },
        ],
      },
    })
    if (pending.length === 0) return

    if (outcome === 'accepted') {
      for (const notification of pending) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            data: { ...(notification.data as Record<string, unknown>), status: 'accepted' },
            isRead: true,
          },
        })
      }
    } else {
      await this.prisma.notification.deleteMany({
        where: { id: { in: pending.map((n) => n.id) } },
      })
    }
  }

  async getFollowRequests(userId: string, page = 1, limit = 20): Promise<{ data: FollowRequestItem[]; total: number }> {
    const take = Math.min(limit, MAX_PAGE_SIZE)
    const skip = (Math.max(page, 1) - 1) * take

    const [requests, total] = await Promise.all([
      this.prisma.followRequest.findMany({
        where: { receiverId: userId, status: 'pending' },
        skip,
        take,
        include: {
          sender: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.followRequest.count({
        where: { receiverId: userId, status: 'pending' },
      }),
    ])

    return {
      data: requests.map((req) => ({
        id: req.id,
        sender: req.sender,
        message: req.message,
        createdAt: req.createdAt.toISOString(),
      })),
      total,
    }
  }

  async respondToFollowRequest(requestId: string, userId: string, action: 'accept' | 'reject'): Promise<void> {
    const request = await this.prisma.followRequest.findUnique({ where: { id: requestId } })

    if (!request || request.receiverId !== userId) {
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Follow request not found' })
    }
    if (request.status !== 'pending') {
      throw new ConflictException({ code: 'REQUEST_ALREADY_PROCESSED', message: 'This request has already been processed' })
    }

    if (action === 'reject') {
      await this.prisma.followRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' },
      })
      await this.redis.invalidateRelationship(request.senderId, request.receiverId)
      // Instagram: a declined request disappears from the receiver's
      // notifications, and the sender is never notified of the rejection.
      await this.syncRequestNotification(request.receiverId, requestId, 'rejected')
      return
    }

    // Accept — follow row + counters + request status in one transaction
    const created = await this.prisma.$transaction(async (tx) => {
      await tx.followRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
      })

      const existing = await tx.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: request.senderId,
            followingId: request.receiverId,
          },
        },
      })
      if (existing?.status === 'active') return false

      await tx.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: request.senderId,
            followingId: request.receiverId,
          },
        },
        create: { followerId: request.senderId, followingId: request.receiverId, status: 'active' },
        update: { status: 'active' },
      })

      if (!existing) {
        await tx.profile.update({
          where: { id: request.receiverId },
          data: { followersCount: { increment: 1 } },
        })
        await tx.profile.update({
          where: { id: request.senderId },
          data: { followingCount: { increment: 1 } },
        })
      }
      return true
    })

    if (created) {
      await this.afterFollowChange(request.senderId, request.receiverId, { followers: 1, following: 1 })
    }

    // Update the receiver's request notification in place (Instagram parity)
    await this.syncRequestNotification(request.receiverId, requestId, 'accepted')

    const receiver = await this.prisma.profile.findUnique({
      where: { id: request.receiverId },
      select: { username: true, displayName: true },
    })
    await this.notifications.enqueue({
      userId: request.senderId,
      type: 'follow_request_accepted',
      title: 'Follow Request Accepted',
      body: `${receiver?.displayName ?? 'Someone'} accepted your follow request`,
      data: { userId: request.receiverId, username: receiver?.username },
    })
    await this.realtime.publishToUser(request.senderId, 'network.request.accepted', {
      userId: request.receiverId,
    })
  }

  // ── BLOCK / UNBLOCK ──────────────────────────────────────────────────────

  async blockUser(blockerId: string, blockedId: string, reason?: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new BadRequestException({ code: 'CANNOT_BLOCK_SELF', message: 'You cannot block yourself' })
    }

    const target = await this.prisma.profile.findUnique({
      where: { id: blockedId },
      select: { id: true },
    })
    if (!target) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })
    }

    await this.prisma.$transaction(async (tx) => {
      // Tear down existing relationships, keeping counters consistent
      const [iFollowThem, theyFollowMe] = await Promise.all([
        tx.follow.findUnique({
          where: { followerId_followingId: { followerId: blockerId, followingId: blockedId } },
        }),
        tx.follow.findUnique({
          where: { followerId_followingId: { followerId: blockedId, followingId: blockerId } },
        }),
      ])

      await tx.follow.deleteMany({
        where: {
          OR: [
            { followerId: blockerId, followingId: blockedId },
            { followerId: blockedId, followingId: blockerId },
          ],
        },
      })
      await tx.followRequest.deleteMany({
        where: {
          OR: [
            { senderId: blockerId, receiverId: blockedId },
            { senderId: blockedId, receiverId: blockerId },
          ],
        },
      })

      if (iFollowThem?.status === 'active') {
        await tx.profile.update({ where: { id: blockedId }, data: { followersCount: { decrement: 1 } } })
        await tx.profile.update({ where: { id: blockerId }, data: { followingCount: { decrement: 1 } } })
      }
      if (theyFollowMe?.status === 'active') {
        await tx.profile.update({ where: { id: blockerId }, data: { followersCount: { decrement: 1 } } })
        await tx.profile.update({ where: { id: blockedId }, data: { followingCount: { decrement: 1 } } })
      }

      await tx.blockedUser.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId } },
        create: { blockerId, blockedId, reason },
        update: { reason },
      })
    })

    await this.redis.invalidateRelationship(blockerId, blockedId)
    await this.refreshCounterCache(blockerId)
    await this.refreshCounterCache(blockedId)

    this.logger.log(`User ${blockerId} blocked user ${blockedId}`)
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const block = await this.prisma.blockedUser.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    })
    if (!block) {
      throw new NotFoundException({ code: 'NOT_BLOCKED', message: 'This user is not blocked' })
    }

    await this.prisma.blockedUser.delete({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    })
    await this.redis.invalidateRelationship(blockerId, blockedId)
  }

  async getBlockedUsers(userId: string): Promise<BlockedUserItem[]> {
    const blocks = await this.prisma.blockedUser.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return blocks.map((b) => ({
      ...b.blocked,
      reason: b.reason,
      blockedAt: b.createdAt.toISOString(),
    }))
  }

  // ── MUTE / UNMUTE ─────────────────────────────────────────────────────────

  async muteUser(muterId: string, mutedId: string): Promise<void> {
    if (muterId === mutedId) {
      throw new BadRequestException({ code: 'CANNOT_MUTE_SELF', message: 'You cannot mute yourself' })
    }

    await this.prisma.mutedUser.upsert({
      where: { muterId_mutedId: { muterId, mutedId } },
      create: { muterId, mutedId },
      update: {},
    })
    await this.redis.invalidateRelationship(muterId, mutedId)
  }

  async unmuteUser(muterId: string, mutedId: string): Promise<void> {
    const mute = await this.prisma.mutedUser.findUnique({
      where: { muterId_mutedId: { muterId, mutedId } },
    })
    if (!mute) {
      throw new NotFoundException({ code: 'NOT_MUTED', message: 'This user is not muted' })
    }

    await this.prisma.mutedUser.delete({
      where: { muterId_mutedId: { muterId, mutedId } },
    })
    await this.redis.invalidateRelationship(muterId, mutedId)
  }

  async getMutedUsers(userId: string): Promise<MutedUserItem[]> {
    const mutes = await this.prisma.mutedUser.findMany({
      where: { muterId: userId },
      include: {
        muted: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return mutes.map((m) => ({
      ...m.muted,
      mutedAt: m.createdAt.toISOString(),
    }))
  }

  // ── FOLLOWERS / FOLLOWING LISTS (Cursor + Offset pagination) ───────────

  async getFollowers(
    userId: string,
    currentUserId: string,
    page = 1,
    limit = 20,
    cursor?: string,
  ): Promise<{ data: FollowerResponse[]; total: number; nextCursor: string | null; hasMore: boolean }> {
    await this.assertCanViewNetwork(userId, currentUserId)
    const take = Math.min(limit, MAX_PAGE_SIZE)

    // ── Cursor-based pagination ──────────────────────────────────────────
    if (cursor) {
      const decoded = decodeCursor(cursor)
      // For followers, the tiebreaker is followerId (unique within followingId)
      const follows = await this.prisma.follow.findMany({
        where: {
          followingId: userId,
          status: 'active',
          ...(decoded
            ? {
                OR: [
                  { createdAt: { lt: new Date(decoded.createdAt) } },
                  {
                    createdAt: decoded.createdAt,
                    followerId: { lt: decoded.tiebreaker },
                  },
                ],
              }
            : {}),
        },
        take: take + 1,
        orderBy: [{ createdAt: 'desc' }, { followerId: 'desc' }],
        include: {
          follower: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      })

      const hasMore = follows.length > take
      const items = hasMore ? follows.slice(0, take) : follows
      const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].followerId)
        : null

      const decorated = await this.decorateWithViewerContext(
        items.map((f) => ({ profile: f.follower, followedAt: f.createdAt })),
        currentUserId,
      )
      const total = await this.prisma.follow.count({ where: { followingId: userId, status: 'active' } })
      return { data: decorated, total, nextCursor, hasMore }
    }

    // ── Offset-based pagination (backward compatible) ────────────────────
    const skip = (Math.max(page, 1) - 1) * take
    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId, status: 'active' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      }),
      this.prisma.follow.count({ where: { followingId: userId, status: 'active' } }),
    ])

    const decorated = await this.decorateWithViewerContext(
      follows.map((f) => ({ profile: f.follower, followedAt: f.createdAt })),
      currentUserId,
    )
    return { data: decorated, total, nextCursor: null, hasMore: skip + take < total }
  }

  async getFollowing(
    userId: string,
    currentUserId: string,
    page = 1,
    limit = 20,
    cursor?: string,
  ): Promise<{ data: FollowerResponse[]; total: number; nextCursor: string | null; hasMore: boolean }> {
    await this.assertCanViewNetwork(userId, currentUserId)
    const take = Math.min(limit, MAX_PAGE_SIZE)

    // ── Cursor-based pagination ──────────────────────────────────────────
    if (cursor) {
      const decoded = decodeCursor(cursor)
      // For following, the tiebreaker is followingId (unique within followerId)
      const follows = await this.prisma.follow.findMany({
        where: {
          followerId: userId,
          status: 'active',
          ...(decoded
            ? {
                OR: [
                  { createdAt: { lt: new Date(decoded.createdAt) } },
                  {
                    createdAt: decoded.createdAt,
                    followingId: { lt: decoded.tiebreaker },
                  },
                ],
              }
            : {}),
        },
        take: take + 1,
        orderBy: [{ createdAt: 'desc' }, { followingId: 'desc' }],
        include: {
          following: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      })

      const hasMore = follows.length > take
      const items = hasMore ? follows.slice(0, take) : follows
      const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].followingId)
        : null

      const decorated = await this.decorateWithViewerContext(
        items.map((f) => ({ profile: f.following, followedAt: f.createdAt })),
        currentUserId,
      )
      const total = await this.prisma.follow.count({ where: { followerId: userId, status: 'active' } })
      return { data: decorated, total, nextCursor, hasMore }
    }

    // ── Offset-based pagination (backward compatible) ────────────────────
    const skip = (Math.max(page, 1) - 1) * take
    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId, status: 'active' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      }),
      this.prisma.follow.count({ where: { followerId: userId, status: 'active' } }),
    ])

    const decorated = await this.decorateWithViewerContext(
      follows.map((f) => ({ profile: f.following, followedAt: f.createdAt })),
      currentUserId,
    )
    return { data: decorated, total, nextCursor: null, hasMore: skip + take < total }
  }

  /**
   * Batch-resolve the viewer's relationship to every profile in a list page
   * (2 IN-queries total) so the UI can render Follow / Following / Requested
   * buttons without N+1 relationship calls.
   */
  private async decorateWithViewerContext(
    items: {
      profile: {
        id: string
        username: string
        displayName: string
        avatarUrl: string | null
        bio: string | null
        isPrivate: boolean
        verificationTier: string
        professionalProfile: { category: string; isVerified: boolean } | null
      }
      followedAt: Date
    }[],
    viewerId: string,
  ): Promise<FollowerResponse[]> {
    const ids = items.map((i) => i.profile.id).filter((id) => id !== viewerId)

    const [viewerFollows, viewerRequests, followersOfViewer] = ids.length
      ? await Promise.all([
          this.prisma.follow.findMany({
            where: { followerId: viewerId, followingId: { in: ids }, status: 'active' },
            select: { followingId: true },
          }),
          this.prisma.followRequest.findMany({
            where: { senderId: viewerId, receiverId: { in: ids }, status: 'pending' },
            select: { receiverId: true },
          }),
          this.prisma.follow.findMany({
            where: { followerId: { in: ids }, followingId: viewerId, status: 'active' },
            select: { followerId: true },
          }),
        ])
      : [[], [], []]

    const followsSet = new Set(viewerFollows.map((f) => f.followingId))
    const requestedSet = new Set(viewerRequests.map((r) => r.receiverId))
    const followsViewerSet = new Set(followersOfViewer.map((f) => f.followerId))

    return items.map(({ profile, followedAt }) => ({
      ...this.mapFollowerProfile(profile, followedAt),
      isMe: profile.id === viewerId,
      viewerFollows: followsSet.has(profile.id),
      viewerRequested: requestedSet.has(profile.id),
      followsViewer: followsViewerSet.has(profile.id),
      isPrivate: profile.isPrivate,
    }))
  }

  /**
   * Mutual followers: users X where X follows *me* AND X follows *target*.
   * Single SQL query via a relation sub-filter — no ID lists in app memory.
   */
  async getMutualFollowers(userId: string, targetUserId: string, page = 1, limit = 20): Promise<{ data: FollowerResponse[]; total: number }> {
    const take = Math.min(limit, MAX_PAGE_SIZE)
    const skip = (Math.max(page, 1) - 1) * take

    const where = {
      followingId: targetUserId,
      status: 'active' as const,
      follower: {
        followsAsFollower: {
          some: { followingId: userId, status: 'active' as const },
        },
      },
    }

    const [mutuals, total] = await Promise.all([
      this.prisma.follow.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      }),
      this.prisma.follow.count({ where }),
    ])

    const decorated = await this.decorateWithViewerContext(
      mutuals.map((f) => ({ profile: f.follower, followedAt: f.createdAt })),
      userId,
    )
    return { data: decorated, total }
  }

  /**
   * Mutual following: users Y where *I* follow Y AND *target* follows Y.
   */
  async getMutualFollowing(userId: string, targetUserId: string, page = 1, limit = 20): Promise<{ data: FollowerResponse[]; total: number }> {
    const take = Math.min(limit, MAX_PAGE_SIZE)
    const skip = (Math.max(page, 1) - 1) * take

    const where = {
      followerId: targetUserId,
      status: 'active' as const,
      following: {
        followsAsFollowing: {
          some: { followerId: userId, status: 'active' as const },
        },
      },
    }

    const [mutuals, total] = await Promise.all([
      this.prisma.follow.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            include: {
              professionalProfile: { select: { category: true, isVerified: true } },
            },
          },
        },
      }),
      this.prisma.follow.count({ where }),
    ])

    const decorated = await this.decorateWithViewerContext(
      mutuals.map((f) => ({ profile: f.following, followedAt: f.createdAt })),
      userId,
    )
    return { data: decorated, total }
  }

  // ── FOLLOW SUGGESTIONS ────────────────────────────────────────────────────

  async getSuggestions(userId: string, limit = 10): Promise<FollowSuggestion[]> {
    const take = Math.min(limit, 25)

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'active' },
      select: { followingId: true },
      take: 200,
    })
    const excludeIds = new Set(following.map((f) => f.followingId))
    excludeIds.add(userId)

    const blocked = await this.prisma.blockedUser.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    })
    blocked.forEach((b) => {
      excludeIds.add(b.blockerId)
      excludeIds.add(b.blockedId)
    })

    // Friend-of-friend: accounts followed by people I follow
    const candidates = await this.prisma.follow.groupBy({
      by: ['followingId'],
      where: {
        followerId: { in: Array.from(excludeIds).filter((id) => id !== userId).slice(0, 100) },
        followingId: { notIn: Array.from(excludeIds) },
        status: 'active',
      },
      _count: { followingId: true },
      orderBy: { _count: { followingId: 'desc' } },
      take: take * 2,
    })

    if (candidates.length === 0) {
      // Cold start — surface verified professionals
      const fallback = await this.prisma.profile.findMany({
        where: {
          id: { notIn: Array.from(excludeIds) },
          state: 'active',
          professionalProfile: { isNot: null },
        },
        include: {
          professionalProfile: { select: { category: true, isVerified: true } },
        },
        orderBy: { followersCount: 'desc' },
        take,
      })
      return this.attachFollowsViewer(fallback.map((u) => this.mapSuggestion(u, 0)), userId)
    }

    const candidateIds = candidates.slice(0, take).map((c) => c.followingId)
    const profiles = await this.prisma.profile.findMany({
      where: { id: { in: candidateIds }, state: 'active' },
      include: {
        professionalProfile: { select: { category: true, isVerified: true } },
      },
    })

    const mutualCounts = new Map(candidates.map((c) => [c.followingId, c._count.followingId]))
    const ranked = profiles
      .map((u) => this.mapSuggestion(u, mutualCounts.get(u.id) ?? 0))
      .sort((a, b) => b.mutualConnections - a.mutualConnections)
    return this.attachFollowsViewer(ranked, userId)
  }

  /** Mark suggestions from accounts that already follow the viewer ("Follow Back"). */
  private async attachFollowsViewer(
    suggestions: FollowSuggestion[],
    viewerId: string,
  ): Promise<(FollowSuggestion & { followsViewer: boolean })[]> {
    if (suggestions.length === 0) return []
    const followers = await this.prisma.follow.findMany({
      where: { followerId: { in: suggestions.map((s) => s.id) }, followingId: viewerId, status: 'active' },
      select: { followerId: true },
    })
    const followsViewerSet = new Set(followers.map((f) => f.followerId))
    return suggestions.map((s) => ({ ...s, followsViewer: followsViewerSet.has(s.id) }))
  }

  // ── USER SEARCH ───────────────────────────────────────────────────────────

  /**
   * Search accounts by username or display name (case-insensitive substring).
   * Excludes the viewer, blocked relationships in either direction, and
   * non-active accounts. Ranked by follower count; includes viewer follow
   * state so the UI can render the correct button immediately.
   */
  async searchUsers(viewerId: string, rawQuery: string, limit = 20): Promise<UserSearchResult[]> {
    const query = rawQuery.trim()
    if (query.length < 2) return []
    const take = Math.min(limit, 20)

    const blocked = await this.prisma.blockedUser.findMany({
      where: { OR: [{ blockerId: viewerId }, { blockedId: viewerId }] },
      select: { blockerId: true, blockedId: true },
    })
    const excludeIds = new Set<string>([viewerId])
    blocked.forEach((b) => {
      excludeIds.add(b.blockerId)
      excludeIds.add(b.blockedId)
    })

    const profiles = await this.prisma.profile.findMany({
      where: {
        state: 'active',
        id: { notIn: Array.from(excludeIds) },
        OR: [
          { username: { contains: query.toLowerCase() } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        professionalProfile: { select: { category: true, isVerified: true } },
      },
      orderBy: { followersCount: 'desc' },
      take,
    })

    if (profiles.length === 0) return []

    const ids = profiles.map((p) => p.id)
    const [viewerFollows, viewerRequests, followersOfViewer] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: viewerId, followingId: { in: ids }, status: 'active' },
        select: { followingId: true },
      }),
      this.prisma.followRequest.findMany({
        where: { senderId: viewerId, receiverId: { in: ids }, status: 'pending' },
        select: { receiverId: true },
      }),
      this.prisma.follow.findMany({
        where: { followerId: { in: ids }, followingId: viewerId, status: 'active' },
        select: { followerId: true },
      }),
    ])
    const followsSet = new Set(viewerFollows.map((f) => f.followingId))
    const requestedSet = new Set(viewerRequests.map((r) => r.receiverId))
    const followsViewerSet = new Set(followersOfViewer.map((f) => f.followerId))

    return profiles.map((p) => ({
      ...this.mapSuggestion(p, 0),
      isPrivate: p.isPrivate,
      viewerFollows: followsSet.has(p.id),
      viewerRequested: requestedSet.has(p.id),
      followsViewer: followsViewerSet.has(p.id),
    }))
  }

  // ── PRIVACY GATE ──────────────────────────────────────────────────────────

  /**
   * Followers/following lists of a private account are visible only to the
   * owner and accepted followers (Instagram semantics). Blocked viewers are
   * told the account doesn't exist.
   */
  private async assertCanViewNetwork(targetUserId: string, currentUserId: string): Promise<void> {
    if (targetUserId === currentUserId) return

    const [target, blockedMe] = await Promise.all([
      this.prisma.profile.findUnique({
        where: { id: targetUserId },
        select: { isPrivate: true, state: true },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: targetUserId, blockedId: currentUserId } },
      }),
    ])

    if (!target || target.state !== 'active' || blockedMe) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })
    }
    if (!target.isPrivate) return

    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } },
    })
    if (follow?.status !== 'active') {
      throw new ForbiddenException({
        code: 'PRIVATE_ACCOUNT',
        message: 'This account is private. Follow to see their connections.',
      })
    }
  }

  // ── POST-COMMIT SIDE EFFECTS ──────────────────────────────────────────────

  /**
   * Runs after a follow-graph mutation commits: refresh Redis mirrors,
   * invalidate the relationship cache, and broadcast live counter updates.
   * delta is from the FOLLOWER's perspective: followers → applies to
   * followingId, following → applies to followerId.
   */
  private async afterFollowChange(
    followerId: string,
    followingId: string,
    delta: { followers: 1 | -1; following: 1 | -1 },
  ): Promise<void> {
    await Promise.all([
      this.redis.adjustCounters(followingId, { followers: delta.followers }),
      this.redis.adjustCounters(followerId, { following: delta.following }),
      this.redis.invalidateRelationship(followerId, followingId),
    ])

    // Live counter broadcast to anyone viewing either profile
    const [followingProfile, followerProfile] = await Promise.all([
      this.prisma.profile.findUnique({
        where: { id: followingId },
        select: { followersCount: true, followingCount: true },
      }),
      this.prisma.profile.findUnique({
        where: { id: followerId },
        select: { followersCount: true, followingCount: true },
      }),
    ])

    if (followingProfile) {
      await this.realtime.publishToProfile(followingId, 'network.counters', {
        userId: followingId,
        followersCount: followingProfile.followersCount,
        followingCount: followingProfile.followingCount,
      })
    }
    if (followerProfile) {
      await this.realtime.publishToProfile(followerId, 'network.counters', {
        userId: followerId,
        followersCount: followerProfile.followersCount,
        followingCount: followerProfile.followingCount,
      })
    }
  }

  private async refreshCounterCache(userId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { followersCount: true, followingCount: true, postsCount: true },
    })
    if (profile) {
      await this.redis.setCounters(userId, {
        followers: profile.followersCount,
        following: profile.followingCount,
        posts: profile.postsCount,
      })
    }
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────

  private async notifyNewFollower(followerId: string, followingId: string): Promise<void> {
    const [follower, reverseFollow] = await Promise.all([
      this.prisma.profile.findUnique({
        where: { id: followerId },
        select: { username: true, displayName: true, avatarUrl: true },
      }),
      // Did the recipient already follow this person? Then it's a follow-back.
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: followingId, followingId: followerId } },
      }),
    ])

    const isFollowBack = reverseFollow?.status === 'active'
    const name = follower?.displayName ?? 'Someone'

    await this.notifications.enqueue({
      userId: followingId,
      type: 'new_follower',
      title: isFollowBack ? 'Followed You Back' : 'New Follower',
      body: isFollowBack ? `${name} followed you back` : `${name} started following you`,
      data: { followerId, username: follower?.username, followBack: isFollowBack },
    })
    await this.realtime.publishToUser(followingId, 'network.follower.new', {
      follower: follower ? { id: followerId, ...follower } : { id: followerId },
      followBack: isFollowBack,
    })
  }

  // ── MAPPERS ───────────────────────────────────────────────────────────────

  private mapFollowerProfile(
    profile: {
      id: string
      username: string
      displayName: string
      avatarUrl: string | null
      bio: string | null
      verificationTier: string
      professionalProfile: { category: string; isVerified: boolean } | null
    },
    followedAt: Date,
  ): Omit<FollowerResponse, 'isMe' | 'viewerFollows' | 'viewerRequested' | 'followsViewer' | 'isPrivate'> {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      isVerified: profile.verificationTier === 'professional',
      isProfessional: !!profile.professionalProfile,
      followedAt: followedAt.toISOString(),
    }
  }

  private mapSuggestion(
    profile: {
      id: string
      username: string
      displayName: string
      avatarUrl: string | null
      bio: string | null
      verificationTier: string
      professionalProfile: { category: string; isVerified: boolean } | null
    },
    mutualConnections: number,
  ): FollowSuggestion {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      mutualConnections,
      isVerified: profile.verificationTier === 'professional',
      isProfessional: !!profile.professionalProfile,
      professionalCategory: profile.professionalProfile?.category ?? null,
    }
  }
}
