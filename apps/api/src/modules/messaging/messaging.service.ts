import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { R2Service } from '../storage/r2.service'
import { MessagingPrivacyService } from './messaging-privacy.service'
import { PresenceService } from './presence.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import type {
  ConversationResponse,
  SuggestionResponse,
  UnreadCountResponse,
} from './dto/index'

@Injectable()
export class MessagingService {
  // Disappearing-message fields removed (never migrated to DB) — see removal in 2026-07.
  private readonly logger = new Logger(MessagingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly r2: R2Service,
    private readonly privacy: MessagingPrivacyService,
    private readonly presence: PresenceService,
  ) {}

  // ── CONVERSATIONS ──────────────────────────────────────────────────────────

  async getConversations(userId: string, cursor?: string | null): Promise<{ data: ConversationResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const take = 21
    const decoded = cursor ? decodeCursor(cursor) : null

    const memberships = await this.prisma.conversationMember.findMany({
      where: {
        userId,
        isDeleted: false,
        ...(decoded
          ? {
              OR: [
                { joinedAt: { lt: new Date(decoded.createdAt) } },
                { joinedAt: new Date(decoded.createdAt), conversationId: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ joinedAt: 'desc' }, { conversationId: 'desc' }],
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
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: { body: true, senderId: true, createdAt: true, type: true },
            },
            settings: {
              where: { userId },
              take: 1,
            },
          },
        },
      },
    })

    const hasMore = memberships.length > take
    const items = hasMore ? memberships.slice(0, take) : memberships

    const conversations = await Promise.all(
      items.map(async (m) => {
        const conv = m.conversation
        const lastMsg = conv.messages[0] ?? null
        const setting = conv.settings[0]

        // Count unread messages
        const unreadCount = m.lastReadAt
          ? await this.prisma.message.count({
              where: {
                conversationId: conv.id,
                senderId: { not: userId },
                createdAt: { gt: m.lastReadAt },
                isDeleted: false,
              },
            })
          : await this.prisma.message.count({
              where: {
                conversationId: conv.id,
                senderId: { not: userId },
                isDeleted: false,
              },
            })

        // If DM, find the other participant's presence
        let isOnline = false
        let lastSeen: string | null = null
        if (conv.type === 'dm') {
          const other = conv.members.find((mem) => mem.userId !== userId)
          if (other) {
            const pres = await this.presence.getPresence(other.userId)
            isOnline = pres.isOnline
            lastSeen = pres.lastSeen
          }
        }

        return {
          id: conv.id,
          type: conv.type,
          name: conv.name,
          avatarUrl: conv.avatarUrl,
          lastMessage: lastMsg
            ? { body: lastMsg.body, senderId: lastMsg.senderId, createdAt: lastMsg.createdAt.toISOString() }
            : null,
          unreadCount,
          isOnline,
          lastSeen,
          participants: conv.members.map((mem) => ({
            id: mem.user.id,
            username: mem.user.username,
            displayName: mem.user.displayName,
            avatarUrl: mem.user.avatarUrl,
            isVerified: mem.user.verificationTier === 'professional',
          })),
          isMuted: setting?.isMuted ?? false,
          isPinned: setting?.isPinned ?? false,
          isArchived: setting?.isArchived ?? false,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
        }
      }),
    )

    // Sort: pinned first, then by lastMessageAt desc
    conversations.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      const aTime = a.lastMessage?.createdAt ?? a.createdAt
      const bTime = b.lastMessage?.createdAt ?? b.createdAt
      return bTime.localeCompare(aTime)
    })

    return {
      data: conversations,
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.joinedAt, items[items.length - 1]!.conversationId)
        : null,
      hasMore,
    }
  }

  async getOrCreateConversation(userId: string, participantId: string, initialMessage?: string): Promise<ConversationResponse> {
    if (userId === participantId) {
      throw new BadRequestException({ code: 'SELF_DM', message: 'Cannot message yourself' })
    }

    // Check if DM conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: 'dm',
        isDeleted: false,
        AND: [
          { members: { some: { userId, isDeleted: false } } },
          { members: { some: { userId: participantId, isDeleted: false } } },
        ],
      },
      include: {
        members: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { body: true, senderId: true, createdAt: true, type: true },
        },
        settings: { where: { userId }, take: 1 },
      },
    })

    if (existing) {
      // If the user had previously deleted this conversation, restore it
      await this.prisma.conversationMember.updateMany({
        where: { conversationId: existing.id, userId, isDeleted: true },
        data: { isDeleted: false, deletedAt: null },
      })

      return this.mapConversationToResponse(existing, userId, existing.members, existing.messages[0] ?? null, existing.settings[0] ?? null)
    }

    // Check privacy
    const canMessage = await this.privacy.canMessage(userId, participantId)
    if (!canMessage.allowed) {
      // If not following, block entirely — no message request bypass
      if (canMessage.reason === 'not_following') {
        throw new ForbiddenException({
          code: 'FOLLOW_REQUIRED',
          message: 'You must follow this user before sending them a message',
        })
      }
      // Check if they can send a message request instead
      const canRequest = await this.privacy.canSendMessageRequest(userId, participantId)
      if (!canRequest.allowed) {
        throw new ForbiddenException({ code: 'CANNOT_MESSAGE', message: `Cannot message this user: ${canMessage.reason}` })
      }
      // If they can only send a request, create one
      await this.createMessageRequest(userId, participantId, initialMessage)
      throw new ForbiddenException({
        code: 'MESSAGE_REQUEST_REQUIRED',
        message: 'Message request sent. You must wait for the user to accept.',
      })
    }

    // Create conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'dm',
        createdBy: userId,
        members: {
          createMany: {
            data: [
              { userId, groupRole: 'member' },
              { userId: participantId, groupRole: 'member' },
            ],
          },
        },
      },
      include: {
        members: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { body: true, senderId: true, createdAt: true, type: true },
        },
        settings: { where: { userId }, take: 1 },
      },
    })

    // Send initial message if provided
    if (initialMessage) {
      const message = await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          body: initialMessage,
          type: 'text',
        },
      })
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: message.createdAt },
      })

      // Real-time notification to recipient
      await this.realtime.publishToUser(participantId, 'conversation:new', { conversationId: conversation.id })
    }

    return this.mapConversationToResponse(conversation, userId, conversation.members, conversation.messages[0] ?? null, conversation.settings[0] ?? null)
  }

  // ── MESSAGES ───────────────────────────────────────────────────────────────

  async getMessages(userId: string, conversationId: string, cursor?: string | null) {
    // Verify membership
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    })
    if (!member || member.isDeleted) {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }

    const take = 51
    const decoded = cursor ? decodeCursor(cursor) : null

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        reactions: {
          select: { emoji: true, userId: true },
        },
        receipts: {
          where: { userId: { not: userId } },
          take: 1,
          select: { status: true, readAt: true },
        },
      },
    })

    const hasMore = messages.length > take
    const items = hasMore ? messages.slice(0, take) : messages

    // Mark as read
    if (items.length > 0) {
      const lastMsg = items[0]!
      if (lastMsg.senderId !== userId) {
        await this.markConversationRead(userId, conversationId, lastMsg.id)
      }
    }

    return {
      data: items.reverse().map((msg) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        sender: {
          id: msg.sender.id,
          username: msg.sender.username,
          displayName: msg.sender.displayName,
          avatarUrl: msg.sender.avatarUrl,
        },
        type: msg.type,
        body: msg.body,
        mediaUrls: msg.mediaUrls,
        parentId: msg.parentId,
        isDeleted: msg.isDeleted,
        editedAt: msg.editedAt?.toISOString() ?? null,
        reactions: msg.reactions.map((r) => ({ emoji: r.emoji, userId: r.userId })),
        receipt: msg.receipts[0]
          ? { status: msg.receipts[0].status, readAt: msg.receipts[0].readAt?.toISOString() ?? null }
          : null,
        createdAt: msg.createdAt.toISOString(),
      })),
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id)
        : null,
      hasMore,
    }
  }

  async sendMessage(userId: string, conversationId: string, input: { body?: string; type?: string; parentId?: string; mediaUrls?: string[] }) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    })
    if (!member || member.isDeleted) {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }

    if (!input.body && (!input.mediaUrls || input.mediaUrls.length === 0)) {
      throw new BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message must have content or media' })
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: input.body ?? null,
        type: input.type ?? 'text',
        parentId: input.parentId ?? null,
        mediaUrls: input.mediaUrls ?? [],
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    })

    // Update lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt },
    })

    // Broadcast to conversation room
    await this.realtime.publish(`conversation:${conversationId}`, 'message:new', {
      id: message.id,
      conversationId: message.conversationId,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        avatarUrl: message.sender.avatarUrl,
      },
      type: message.type,
      body: message.body,
      mediaUrls: message.mediaUrls,
      parentId: message.parentId,
      createdAt: message.createdAt.toISOString(),
    })

    // Send push notification to other participants
    const otherMembers = await this.prisma.conversationMember.findMany({
      where: { conversationId, userId: { not: userId }, isDeleted: false },
      select: { userId: true },
    })

    for (const om of otherMembers) {
      const setting = await this.prisma.conversationSetting.findUnique({
        where: { conversationId_userId: { conversationId, userId: om.userId } },
      })
      if (!setting?.isMuted) {
        await this.realtime.publishToUser(om.userId, 'notification:new', {
          type: 'message',
          title: message.sender.displayName,
          body: message.body ?? 'Sent a message',
          data: { conversationId, messageId: message.id },
        })
      }
    }

    return {
      id: message.id,
      conversationId: message.conversationId,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        avatarUrl: message.sender.avatarUrl,
      },
      type: message.type,
      body: message.body,
      mediaUrls: message.mediaUrls,
      parentId: message.parentId,
      isDeleted: message.isDeleted,
      editedAt: null,
      reactions: [],
      receipt: null,
      createdAt: message.createdAt.toISOString(),
    }
  }

  async deleteMessage(userId: string, messageId: string, forEveryone = false): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderId: true },
    })
    if (!message) throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })
    if (message.senderId !== userId && !forEveryone) {
      throw new ForbiddenException({ code: 'NOT_SENDER', message: 'You can only delete your own messages' })
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        ...(forEveryone ? { deletedForEveryone: true } : {}),
      },
    })

    await this.realtime.publish(`conversation:${message.conversationId}`, 'message:deleted', {
      messageId,
      conversationId: message.conversationId,
      deletedForEveryone: forEveryone,
    })
  }

  async editMessage(userId: string, messageId: string, body: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderId: true },
    })
    if (!message) throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })
    if (message.senderId !== userId) {
      throw new ForbiddenException({ code: 'NOT_SENDER', message: 'You can only edit your own messages' })
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { body, editedAt: new Date() },
    })

    await this.realtime.publish(`conversation:${message.conversationId}`, 'message:edited', {
      messageId,
      conversationId: message.conversationId,
      body,
    })
  }

  async reactToMessage(userId: string, messageId: string, emoji: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true },
    })
    if (!message) throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })

    const existing = await this.prisma.messageReaction.findUnique({
      where: { messageId_userId_emoji: { messageId, userId, emoji } },
    })

    if (existing) {
      // Remove reaction (toggle)
      await this.prisma.messageReaction.delete({ where: { id: existing.id } })
    } else {
      await this.prisma.messageReaction.create({
        data: { messageId, userId, emoji },
      })
    }

    await this.realtime.publish(`conversation:${message.conversationId}`, 'message:reaction', {
      messageId,
      conversationId: message.conversationId,
      userId,
      emoji,
      removed: !!existing,
    })
  }

  // ── MARK AS READ ───────────────────────────────────────────────────────────

  async markConversationRead(userId: string, conversationId: string, lastReadMessageId?: string): Promise<void> {
    const now = new Date()
    await this.prisma.conversationMember.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: now },
    })

    if (lastReadMessageId) {
      await this.prisma.messageReceipt.upsert({
        where: { messageId_userId: { messageId: lastReadMessageId, userId } },
        create: { messageId: lastReadMessageId, userId, status: 'read', readAt: now },
        update: { status: 'read', readAt: now },
      })
    }
  }

  // ── SUGGESTIONS ─────────────────────────────────────────────────────────────

  async getSuggestions(userId: string, limit = 10): Promise<SuggestionResponse[]> {
    // Priority order: following → followers → mutuals → recent interactions → professional contacts
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'active' },
      select: { followingId: true },
      take: 50,
    })

    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId, status: 'active', followerId: { notIn: following.map((f) => f.followingId) } },
      select: { followerId: true },
      take: 50,
    })

    const userIds = new Set([
      ...following.map((f) => f.followingId),
      ...followers.map((f) => f.followerId),
    ])

    // Blocked users (both directions)
    const blocked = await this.prisma.blockedUser.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
      select: { blockerId: true, blockedId: true },
    })
    const blockedIds = new Set(blocked.flatMap((b) => [b.blockerId, b.blockedId]))

    // Filter to valid suggestion candidates
    const candidateIds = Array.from(userIds).filter((id) => id !== userId && !blockedIds.has(id))

    if (candidateIds.length === 0) return []

    const profiles = await this.prisma.profile.findMany({
      where: {
        id: { in: candidateIds.slice(0, 30) },
        state: 'active',
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        verificationTier: true,
        professionalProfile: { select: { category: true } },
      },
      take: limit,
    })

    const suggestions = await Promise.all(
      profiles.map(async (p) => {
        const pres = await this.presence.getPresence(p.id)
        return {
          id: p.id,
          username: p.username,
          displayName: p.displayName,
          avatarUrl: p.avatarUrl,
          bio: p.bio,
          mutualFollowers: 0, // Optimized later
          isVerified: p.verificationTier === 'professional',
          isProfessional: !!p.professionalProfile,
          professionalCategory: p.professionalProfile?.category ?? null,
          isOnline: pres.isOnline,
          lastSeen: pres.lastSeen,
        }
      }),
    )

    return suggestions
  }

  // ── UNREAD COUNTS ──────────────────────────────────────────────────────────

  async getUnreadCounts(userId: string): Promise<UnreadCountResponse> {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { userId, isDeleted: false },
      select: { conversationId: true, lastReadAt: true },
    })

    const counts = await Promise.all(
      memberships.map(async (m) => {
        const count = m.lastReadAt
          ? await this.prisma.message.count({
              where: {
                conversationId: m.conversationId,
                senderId: { not: userId },
                createdAt: { gt: m.lastReadAt },
                isDeleted: false,
              },
            })
          : 0
        return { conversationId: m.conversationId, count }
      }),
    )

    const total = counts.reduce((sum, c) => sum + c.count, 0)

    return { total, conversations: counts }
  }

  // ── MESSAGE SEARCH ─────────────────────────────────────────────────────────

  async searchMessages(userId: string, query: string, conversationId?: string) {
    const where: Record<string, unknown> = {
      body: { contains: query, mode: 'insensitive' },
      isDeleted: false,
    }

    if (conversationId) {
      where.conversationId = conversationId
    } else {
      // Only search conversations the user is a member of
      const memberships = await this.prisma.conversationMember.findMany({
        where: { userId, isDeleted: false },
        select: { conversationId: true },
      })
      where.conversationId = { in: memberships.map((m) => m.conversationId) }
    }

    const messages = await this.prisma.message.findMany({
      where: where as never,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        conversation: { select: { id: true, name: true } },
      },
    })

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      conversationName: msg.conversation.name,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
        displayName: msg.sender.displayName,
        avatarUrl: msg.sender.avatarUrl,
      },
      body: msg.body,
      createdAt: msg.createdAt.toISOString(),
    }))
  }

  // ── MESSAGE REQUESTS ───────────────────────────────────────────────────────

  async createMessageRequest(senderId: string, recipientId: string, message?: string): Promise<void> {
    if (senderId === recipientId) return

    const existing = await this.prisma.messageRequest.findUnique({
      where: { senderId_recipientId: { senderId, recipientId } },
    })
    if (existing) return

    const expiryMap = {
      seven_days: 7,
      fourteen_days: 14,
      thirty_days: 30,
      never: null,
    }

    const privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId: recipientId },
    })

    let expiresAt: Date | null = null
    const expirySetting = privacy?.messageRequestExpiry ?? 'thirty_days'
    const days = expiryMap[expirySetting as keyof typeof expiryMap]
    if (days) {
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    }

    await this.prisma.messageRequest.create({
      data: {
        senderId,
        recipientId,
        message: message ?? null,
        expiresAt,
      },
    })

    await this.realtime.publishToUser(recipientId, 'message_request:new', {
      senderId,
      message: message ?? null,
    })
  }

  async getMessageRequests(userId: string): Promise<{ incoming: unknown[]; outgoing: unknown[] }> {
    const incoming = await this.prisma.messageRequest.findMany({
      where: { recipientId: userId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
      },
    })

    const outgoing = await this.prisma.messageRequest.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        recipient: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
      },
    })

    return {
      incoming: incoming.map((r) => ({
        id: r.id,
        sender: {
          id: r.sender.id,
          username: r.sender.username,
          displayName: r.sender.displayName,
          avatarUrl: r.sender.avatarUrl,
          isVerified: r.sender.verificationTier === 'professional',
        },
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
      outgoing: outgoing.map((r) => ({
        id: r.id,
        recipient: {
          id: r.recipient.id,
          username: r.recipient.username,
          displayName: r.recipient.displayName,
          avatarUrl: r.recipient.avatarUrl,
          isVerified: r.recipient.verificationTier === 'professional',
        },
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    }
  }

  async acceptMessageRequest(userId: string, requestId: string): Promise<void> {
    const request = await this.prisma.messageRequest.findUnique({
      where: { id: requestId },
    })
    if (!request || request.recipientId !== userId) {
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Request not found' })
    }

    await this.prisma.messageRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    })

    // Create conversation
    const conv = await this.prisma.conversation.create({
      data: {
        type: 'dm',
        createdBy: userId,
        members: {
          createMany: {
            data: [
              { userId: request.senderId, groupRole: 'member' },
              { userId, groupRole: 'member' },
            ],
          },
        },
      },
    })

    await this.realtime.publishToUser(request.senderId, 'message_request:accepted', {
      conversationId: conv.id,
    })
  }

  async rejectMessageRequest(userId: string, requestId: string): Promise<void> {
    const request = await this.prisma.messageRequest.findUnique({
      where: { id: requestId },
    })
    if (!request || request.recipientId !== userId) return

    await this.prisma.messageRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    })
  }

  // ── SEARCH PROFILES ─────────────────────────────────────────────────────────

  async searchProfiles(userId: string, q: string, take: number) {
    // Exclude blocked users and self
    const blocked = await this.prisma.blockedUser.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
      select: { blockerId: true, blockedId: true },
    })
    const blockedIds = new Set(blocked.flatMap((b) => [b.blockerId, b.blockedId]))

    const profiles = await this.prisma.profile.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { state: 'active' },
          {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { displayName: { contains: q, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        verificationTier: true,
        professionalProfile: {
          select: { category: true },
        },
      },
      take,
      orderBy: [{ followersCount: 'desc' }],
    })

    return profiles
      .filter((p) => !blockedIds.has(p.id))
      .map((p) => ({
        id: p.id,
        username: p.username,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        isVerified: p.verificationTier === 'professional',
        isProfessional: !!p.professionalProfile,
        professionalCategory: p.professionalProfile?.category ?? null,
      }))
  }

  // ── UPLOAD ──────────────────────────────────────────────────────────────────

  async getUploadUrl(userId: string, mimeType: string, fileName?: string, fileSize?: number): Promise<{ url: string; viewUrl: string; key: string; type: string }> {
    if (!this.r2.isEnabled) {
      throw new BadRequestException({ code: 'STORAGE_NOT_CONFIGURED', message: 'File upload is not available' })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv',
    ]
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException({ code: 'INVALID_FILE_TYPE', message: `File type ${mimeType} is not supported` })
    }

    // Validate file size (100MB max)
    if (fileSize && fileSize > 100 * 1024 * 1024) {
      throw new BadRequestException({ code: 'FILE_TOO_LARGE', message: 'File exceeds maximum size of 100MB' })
    }

    const key = this.r2.generateKey(userId, mimeType)
    const uploadUrl = await this.r2.getPresignedUploadUrl(key, mimeType, 3600)
    const viewUrl = this.r2.getPublicUrl(key)

    let type = 'document'
    if (mimeType.startsWith('image/')) type = 'image'
    else if (mimeType.startsWith('video/')) type = 'video'
    else if (mimeType.startsWith('audio/')) type = 'audio'
    else if (mimeType === 'image/gif') type = 'gif'

    return { url: uploadUrl, viewUrl, key, type }
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  private async mapConversationToResponse(
    conv: {
      id: string
      type: string
      name: string | null
      avatarUrl: string | null
      createdAt: Date
      updatedAt: Date
    },
    userId: string,
    members: Array<{
      user: {
        id: string
        username: string
        displayName: string
        avatarUrl: string | null
        verificationTier: string
      }
    }>,
    lastMsg: { body: string | null; senderId: string; createdAt: Date; type: string } | null,
    setting: { isMuted: boolean; isPinned: boolean; isArchived: boolean } | null,
  ): Promise<ConversationResponse> {
    let isOnline = false
    let lastSeen: string | null = null
    if (conv.type === 'dm') {
      const other = members.find((m) => m.user.id !== userId)
      if (other) {
        const pres = await this.presence.getPresence(other.user.id)
        isOnline = pres.isOnline
        lastSeen = pres.lastSeen
      }
    }

    return {
      id: conv.id,
      type: conv.type,
      name: conv.name,
      avatarUrl: conv.avatarUrl,
      lastMessage: lastMsg
        ? { body: lastMsg.body, senderId: lastMsg.senderId, createdAt: lastMsg.createdAt.toISOString() }
        : null,
      unreadCount: 0,
      isOnline,
      lastSeen,
      participants: members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        isVerified: m.user.verificationTier === 'professional',
      })),
      isMuted: setting?.isMuted ?? false,
      isPinned: setting?.isPinned ?? false,
      isArchived: setting?.isArchived ?? false,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    }
  }
}
