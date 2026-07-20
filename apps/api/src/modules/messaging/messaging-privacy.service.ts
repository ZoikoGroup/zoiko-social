import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export type PrivacyCheckResult =
  | { allowed: true }
  | { allowed: false; reason: 'blocked' | 'blocked_you' | 'not_following' | 'message_requests_disabled' | 'privacy_restricted' | 'muted_by_you' | 'account_deactivated' }

@Injectable()
export class MessagingPrivacyService {
  private readonly logger = new Logger(MessagingPrivacyService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check whether `senderId` can message `recipientId`.
   * This enforces: blocks (both directions), privacy settings, and account state.
   */
  async canMessage(senderId: string, recipientId: string): Promise<PrivacyCheckResult> {
    if (senderId === recipientId) {
      return { allowed: false, reason: 'privacy_restricted' }
    }

    const [recipient, blockedByMe, blockedByThem] = await Promise.all([
      this.prisma.profile.findUnique({
        where: { id: recipientId },
        select: { state: true },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: senderId, blockedId: recipientId } },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: recipientId, blockedId: senderId } },
      }),
    ])

    if (!recipient || recipient.state !== 'active') {
      return { allowed: false, reason: 'account_deactivated' }
    }
    if (blockedByMe) return { allowed: false, reason: 'blocked' }
    if (blockedByThem) return { allowed: false, reason: 'blocked_you' }

    // Always require following the recipient to send messages
    const follows = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: senderId, followingId: recipientId } },
    })
    if (!follows || follows.status !== 'active') {
      return { allowed: false, reason: 'not_following' }
    }

    // Check user privacy settings
    const privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId: recipientId },
    })

    if (privacy) {
      if (privacy.whoCanMessage === 'nobody') return { allowed: false, reason: 'privacy_restricted' }
      if (privacy.whoCanMessage === 'my_connections') {
        const follows = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: senderId, followingId: recipientId } },
        })
        if (!follows || follows.status !== 'active') return { allowed: false, reason: 'privacy_restricted' }
      }
      if (privacy.whoCanMessage === 'my_followers') {
        const isFollower = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: recipientId, followingId: senderId } },
        })
        if (!isFollower || isFollower.status !== 'active') return { allowed: false, reason: 'privacy_restricted' }
      }
    }

    return { allowed: true }
  }

  /** True if either user has blocked the other (used to re-gate existing DMs). */
  async isBlockedEitherWay(a: string, b: string): Promise<boolean> {
    const block = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: a, blockedId: b },
          { blockerId: b, blockedId: a },
        ],
      },
      select: { blockerId: true },
    })
    return !!block
  }

  /**
   * Check whether `senderId` can send a message request to `recipientId`.
   * Message requests are for non-following users when the recipient allows them.
   */
  async canSendMessageRequest(senderId: string, recipientId: string): Promise<PrivacyCheckResult> {
    if (senderId === recipientId) return { allowed: false, reason: 'privacy_restricted' }

    const [blockedByMe, blockedByThem] = await Promise.all([
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: senderId, blockedId: recipientId } },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: recipientId, blockedId: senderId } },
      }),
    ])

    if (blockedByMe) return { allowed: false, reason: 'blocked' }
    if (blockedByThem) return { allowed: false, reason: 'blocked_you' }

    const privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId: recipientId },
    })

    if (privacy) {
      const setting = privacy.whoCanSendMessageRequest
      if (setting === 'nobody') return { allowed: false, reason: 'message_requests_disabled' }
      if (setting === 'my_connections') {
        const follows = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: senderId, followingId: recipientId } },
        })
        if (!follows || follows.status !== 'active') return { allowed: false, reason: 'message_requests_disabled' }
      }
      if (setting === 'my_followers') {
        const isFollower = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: recipientId, followingId: senderId } },
        })
        if (!isFollower || isFollower.status !== 'active') return { allowed: false, reason: 'message_requests_disabled' }
      }
    }

    return { allowed: true }
  }

  /**
   * Can `viewerId` see the online status of `targetId`?
   */
  async canSeeOnlineStatus(viewerId: string, targetId: string): Promise<boolean> {
    if (viewerId === targetId) return true
    const privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId: targetId },
    })
    if (!privacy || privacy.whoCanSeeOnlineStatus === 'everyone') return true
    if (privacy.whoCanSeeOnlineStatus === 'nobody') return false
    if (privacy.whoCanSeeOnlineStatus === 'my_connections') {
      const follows = await this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
      })
      return !!follows && follows.status === 'active'
    }
    return false
  }

  /**
   * Can `viewerId` see the last seen of `targetId`?
   */
  async canSeeLastSeen(viewerId: string, targetId: string): Promise<boolean> {
    if (viewerId === targetId) return true
    const privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId: targetId },
    })
    if (!privacy || privacy.whoCanSeeLastSeen === 'everyone') return true
    if (privacy.whoCanSeeLastSeen === 'nobody') return false
    if (privacy.whoCanSeeLastSeen === 'my_connections') {
      const follows = await this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
      })
      return !!follows && follows.status === 'active'
    }
    return false
  }
}
