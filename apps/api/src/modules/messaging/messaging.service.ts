import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { SupabaseStorageService } from '../storage/supabase-storage.service'
import { MessagingPrivacyService } from './messaging-privacy.service'
import { PresenceService } from './presence.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import { ProfanityService } from '../common/moderation/profanity.service'
import { AiAssistantService } from '../ai-assistant/ai-assistant.service'
import { aiThreadHint } from './ai-thread-hint'
import { PushService } from '../push/push.service'
import { CommunityChatService } from './community-chat.service'
import { NotificationPreferenceService } from '../push/notification-preference.service'
import { PREFERENCE_KEYS } from '../comms/comms.types'
import type {
  ConversationResponse,
  SuggestionResponse,
  UnreadCountResponse,
} from './dto/index'

/** Pinned chats are always shown in full; this only stops a pathological case. */
const PINNED_LIMIT = 50

@Injectable()
export class MessagingService {
  // Disappearing-message fields removed (never migrated to DB) — see removal in 2026-07.
  private readonly logger = new Logger(MessagingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly storage: SupabaseStorageService,
    private readonly privacy: MessagingPrivacyService,
    private readonly presence: PresenceService,
    private readonly profanity: ProfanityService,
    private readonly aiAssistant: AiAssistantService,
    private readonly push: PushService,
    private readonly pushPreferences: NotificationPreferenceService,
    private readonly communityChat: CommunityChatService,
  ) {}

  // ── CONVERSATIONS ──────────────────────────────────────────────────────────

  async getConversations(userId: string, cursor?: string | null): Promise<{ data: ConversationResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const take = 21
    const decoded = cursor ? decodeCursor(cursor) : null

    // Every member gets a thread with ZoikoSocial AI. Provisioned lazily on the
    // first inbox load rather than at signup, so accounts that predate the
    // assistant get one too. Only on the first page — deeper pages skip it.
    // Pinned conversations belong at the top of the list, not the top of a page,
    // so they are fetched whole on the first page and excluded from the
    // paginated remainder. A member pins a handful of chats, so this is bounded.
    //
    // Run together with the assistant-thread check: they touch different tables
    // and neither needs the other's result. A single database round-trip costs
    // 150-750 ms here depending on where the caller and the database sit, so
    // awaiting them one after the other spent a whole one for nothing.
    const [, pinnedSettings] = await Promise.all([
      cursor ? Promise.resolve() : this.ensureAiThread(userId),
      this.prisma.conversationSetting.findMany({
        where: { userId, isPinned: true },
        select: { conversationId: true },
        take: PINNED_LIMIT,
      }),
    ])
    const pinnedIds = pinnedSettings.map((s) => s.conversationId)

    const memberships = await this.prisma.conversationMember.findMany({
      where: {
        userId,
        isDeleted: false,
        // Recency order is a property of the conversation, so the keyset runs
        // against it rather than against when this member joined.
        ...(decoded
          ? {
              conversation: {
                OR: [
                  { lastMessageAt: { lt: new Date(decoded.createdAt) } },
                  {
                    lastMessageAt: new Date(decoded.createdAt),
                    id: { lt: decoded.tiebreaker },
                  },
                ],
              },
            }
          : {}),
        ...(pinnedIds.length > 0 ? { conversationId: { notIn: pinnedIds } } : {}),
      },
      take: take + 1,
      orderBy: [
        { conversation: { lastMessageAt: 'desc' } },
        { conversationId: 'desc' },
      ],
      include: this.conversationListInclude(userId),
    })

    const hasMore = memberships.length > take
    const items = hasMore ? memberships.slice(0, take) : memberships

    // Pinned threads ride along on the first page only, ahead of everything else.
    const pinned = !cursor && pinnedIds.length > 0
      ? await this.prisma.conversationMember.findMany({
          where: { userId, isDeleted: false, conversationId: { in: pinnedIds } },
          orderBy: [
            { conversation: { lastMessageAt: 'desc' } },
            { conversationId: 'desc' },
          ],
          include: this.conversationListInclude(userId),
        })
      : []

    const rows = [...pinned, ...items]

    // Two batched reads for the whole page instead of per-conversation queries:
    // one grouped unread count, one pipelined presence lookup.
    const otherParticipantIds = rows
      .filter((m) => m.conversation.type === 'dm')
      .map((m) => m.conversation.members.find((mem) => mem.userId !== userId)?.userId)
      .filter((id): id is string => typeof id === 'string')

    const [unreadMap, presenceMap] = await Promise.all([
      this.getUnreadCountsMap(userId),
      this.presence.getPresenceMany(otherParticipantIds),
    ])

    const conversations = rows.map((m) => {
      const conv = m.conversation
      const lastMsg = conv.messages[0] ?? null
      const setting = conv.settings[0]

      let isOnline = false
      let lastSeen: string | null = null
      if (conv.type === 'dm') {
        const other = conv.members.find((mem) => mem.userId !== userId)
        const pres = other ? presenceMap.get(other.userId) : undefined
        isOnline = pres?.isOnline ?? false
        lastSeen = pres?.lastSeen ?? null
      }

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        avatarUrl: conv.avatarUrl,
        theme: conv.theme ?? null,
        lastMessage: lastMsg
          ? { body: lastMsg.body, senderId: lastMsg.senderId, createdAt: lastMsg.createdAt.toISOString() }
          : null,
        unreadCount: unreadMap.get(conv.id) ?? 0,
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
    })

    // No post-sort: the database already returned them in display order, which
    // is what makes the order hold ACROSS pages rather than only within one.
    const last = items[items.length - 1]
    return {
      data: conversations,
      nextCursor: hasMore && last
        ? encodeCursor(last.conversation.lastMessageAt, last.conversationId)
        : null,
      hasMore,
    }
  }

  /** Shared shape for both halves of the conversation list (pinned + paged). */
  private conversationListInclude(userId: string) {
    return {
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
            orderBy: { createdAt: 'desc' as const },
            select: { body: true, senderId: true, createdAt: true, type: true },
          },
          settings: {
            where: { userId },
            take: 1,
          },
        },
      },
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

  /**
   * Assert that `userId` is an active member of `conversationId`, throwing the
   * same NOT_FOUND used elsewhere otherwise. Returns the membership row.
   * Centralises the membership guard so read/write paths can't forget it.
   */
  private async assertMember(userId: string, conversationId: string) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    })
    if (!member || member.isDeleted) {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }
    return member
  }

  /** True when the user is an active member of the conversation (no throw). */
  async isMember(userId: string, conversationId: string): Promise<boolean> {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { isDeleted: true },
    })
    if (member && !member.isDeleted) return true
    // A community chat has no ConversationMember rows by design — membership is
    // derived from community_members. Without this the socket room refuses every
    // community member and the chat never goes live.
    return this.communityChat.isChatMember(userId, conversationId)
  }

  /**
   * Fetch a single conversation by id for a member. Previously the controller
   * scanned only the caller's first page of conversations, so members of any
   * conversation beyond that page got `null`.
   */
  async getConversationById(userId: string, conversationId: string): Promise<ConversationResponse | null> {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { isDeleted: true },
    })
    if (!member || member.isDeleted) {
      // Community chat has no member row; a non-member throws here rather than
      // returning null, which the controller maps to the same 404.
      await this.communityChat.assertCanRead(userId, conversationId)
    }

    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
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
    if (!conv || conv.isDeleted) return null

    return this.mapConversationToResponse(conv, userId, conv.members, conv.messages[0] ?? null, conv.settings[0] ?? null)
  }

  // ── MESSAGES ───────────────────────────────────────────────────────────────

  /** Compact snippet of a replied-to message, embedded in message payloads (WhatsApp-style quote). */
  private mapParentSnippet(
    parent: { id: string; body: string | null; type: string; isDeleted: boolean; sender: { id: string; displayName: string } } | null,
  ) {
    if (!parent) return null
    return {
      id: parent.id,
      body: parent.isDeleted ? null : parent.body,
      type: parent.type,
      isDeleted: parent.isDeleted,
      senderId: parent.sender.id,
      senderName: parent.sender.displayName,
    }
  }

  /** Prisma include fragment for the parent-message snippet. */
  private static readonly PARENT_INCLUDE = {
    select: {
      id: true,
      body: true,
      type: true,
      isDeleted: true,
      sender: { select: { id: true, displayName: true } },
    },
  } as const

  async getMessages(userId: string, conversationId: string, cursor?: string | null) {
    // Verify membership
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    })
    if (!member || member.isDeleted) {
      // Community chat: derived membership, and it throws the same
      // CONVERSATION_NOT_FOUND for a non-member.
      await this.communityChat.assertCanRead(userId, conversationId)
    }

    const take = 51
    const decoded = cursor ? decodeCursor(cursor) : null

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        // Hide messages this user deleted "for me" only (see deleteMessage).
        NOT: { deletedFor: { has: userId } },
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
        parent: MessagingService.PARENT_INCLUDE,
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
        parent: this.mapParentSnippet(msg.parent),
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

  async sendMessage(userId: string, conversationId: string, input: { 
    body?: string; 
    type?: string; 
    parentId?: string; 
    mediaUrls?: string[];
    metadata?: Record<string, unknown>;
    poll?: { question: string; options: string[] };
  }) {
    // Run EVERY pre-flight read concurrently. These used to be 3–4 sequential
    // awaits (membership → other member → block check → reply-parent), and
    // against a distant database each serial round-trip stacked up into seconds
    // of send latency. They are independent, so one parallel batch + the insert
    // is all the critical path needs.
    const [member, myBlocks, parent] = await Promise.all([
      this.prisma.conversationMember.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
        include: {
          conversation: {
            select: {
              type: true,
              members: {
                where: { isDeleted: false, userId: { not: userId } },
                select: { userId: true },
                take: 1,
              },
            },
          },
        },
      }),
      // All blocks involving the sender (either direction). Fetched up front so
      // the DM block check below is an in-memory lookup, not another round-trip.
      this.prisma.blockedUser.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      }),
      input.parentId
        ? this.prisma.message.findUnique({
            where: { id: input.parentId },
            select: { conversationId: true },
          })
        : Promise.resolve(null),
    ])

    if (!member || member.isDeleted) {
      // Community chat. Derived membership, and the same call enforces the
      // posting rules — chat switched off, announcement-only, muted member,
      // slow mode — each throwing with the reason so the composer can say which
      // lock it hit rather than "something went wrong".
      await this.communityChat.assertCanPost(userId, conversationId)
    }

    // Re-check block state on every DM send. Blocks are otherwise only evaluated
    // when the conversation is first created, so a user blocked AFTER the DM
    // already exists could keep messaging into it. (Group membership is gated at
    // add-member time instead.)
    if (member && member.conversation.type === 'dm') {
      const other = member.conversation.members[0]
      const blockedIds = new Set(myBlocks.flatMap((b) => [b.blockerId, b.blockedId]))
      if (other && blockedIds.has(other.userId)) {
        throw new ForbiddenException({ code: 'BLOCKED', message: 'You can no longer message this user' })
      }
    }

    if (!input.body && (!input.mediaUrls || input.mediaUrls.length === 0) && !input.poll && (!input.metadata || Object.keys(input.metadata).length === 0)) {
      throw new BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message must have content, media, a poll, or location' })
    }
    if (input.body) this.profanity.assertClean(input.body, { actorId: userId, entityType: 'message' })

    // A reply's parent MUST live in the same conversation. Without this, a member
    // of conversation A could set parentId to a message in conversation B and the
    // parent snippet (body + sender name) would leak into A (cross-conversation
    // read IDOR).
    if (input.parentId && (!parent || parent.conversationId !== conversationId)) {
      throw new BadRequestException({ code: 'INVALID_PARENT', message: 'Reply target is not in this conversation' })
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: input.body ?? null,
        type: input.type ?? 'text',
        parentId: input.parentId ?? null,
        mediaUrls: input.mediaUrls ?? [],
        ...(input.metadata !== undefined
          ? { metadata: input.metadata as Prisma.InputJsonValue }
          : {}),
        ...(input.poll && {
          poll: {
            create: {
              question: input.poll.question,
              options: {
                create: input.poll.options.map(text => ({ text })),
              },
            },
          },
        }),
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        parent: MessagingService.PARENT_INCLUDE,
        poll: {
          include: {
            options: {
              include: { votes: true }
            }
          }
        },
      },
    })

    // Deliver to the conversation room FIRST so recipients see the message with
    // minimal latency (emitLocal is synchronous inside publish).
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
      parent: this.mapParentSnippet(message.parent),
      createdAt: message.createdAt.toISOString(),
    })

    // Everything else — the lastMessageAt bump and per-recipient push
    // notifications — is off the sender's critical path. It used to run inline and
    // awaited: one conversation.update, then a sequential N+1 (a
    // conversationSetting.findUnique AND an awaited publishToUser per member), so
    // send latency grew with member count. Now fire-and-forget with a single
    // settings query and parallel publishes.
    void this.dispatchPostSend(userId, conversationId, message).catch((err: Error) =>
      this.logger.warn(`post-send tasks failed for ${conversationId}: ${err.message}`),
    )

    // When the recipient of this DM is ZoikoSocial AI, generate its reply. Also
    // off the critical path: the sender's message is already delivered, and the
    // reply arrives over the same socket moments later. The sender-is-AI guard is
    // what stops the assistant replying to itself.
    const recipientId = member?.conversation.type === 'dm' ? member.conversation.members[0]?.userId : undefined
    if (input.body && recipientId && this.aiAssistant.isAiProfile(recipientId) && !this.aiAssistant.isAiProfile(userId)) {
      void this.dispatchAiReply(conversationId, userId, input.body).catch((err: Error) =>
        this.logger.warn(`AI reply failed for ${conversationId}: ${err.message}`),
      )
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
      parent: this.mapParentSnippet(message.parent),
      isDeleted: message.isDeleted,
      editedAt: null,
      reactions: [],
      receipt: null,
      createdAt: message.createdAt.toISOString(),
    }
  }

  /**
   * Generates ZoikoSocial AI's reply and sends it as a normal message.
   *
   * The reply goes back through `sendMessage` with the assistant as sender, so it
   * gets the same persistence, realtime delivery and notification handling as any
   * human message — nothing about the assistant's messages is special-cased.
   * Typing indicators bracket the model call using the existing `typing:update`
   * event, so the member sees "typing…" while it thinks.
   */
  private async dispatchAiReply(conversationId: string, userId: string, text: string): Promise<void> {
    const aiId = this.aiAssistant.getAiProfileId()
    if (!aiId) return

    await this.presence.setTyping(aiId, conversationId, true)
    try {
      const reply = await this.aiAssistant.generateReply(conversationId, userId, text)
      await this.sendMessage(aiId, conversationId, { body: reply })
    } finally {
      // Always clear the indicator, or it sticks until the client's own timeout.
      await this.presence.setTyping(aiId, conversationId, false).catch(() => undefined)
    }
  }

  /**
   * Ensures this member has their ZoikoSocial AI thread, seeded with a greeting.
   *
   * Creates the conversation directly rather than through `getOrCreateConversation`
   * because that path enforces the follow/privacy gate and would turn this into a
   * message request — the assistant is always reachable. Best-effort: a failure
   * here must not stop the inbox from loading.
   */
  private async ensureAiThread(userId: string): Promise<void> {
    const aiId = this.aiAssistant.getAiProfileId()
    if (!aiId || aiId === userId) return

    // Skips the lookup below, which otherwise cost a database round-trip on every
    // first-page inbox load. Cleared when a member deletes a conversation, since
    // that is the one thing that makes the answer stale.
    if (aiThreadHint.has(userId)) return

    try {
      const existing = await this.prisma.conversation.findFirst({
        where: {
          type: 'dm',
          isDeleted: false,
          AND: [{ members: { some: { userId } } }, { members: { some: { userId: aiId } } }],
        },
        // The member's own row comes along because its existence is not the same
        // question as whether they can see the thread: deleting a conversation
        // soft-deletes that row, and the inbox lists only live ones.
        select: { id: true, members: { where: { userId }, select: { isDeleted: true } } },
      })

      if (existing) {
        // Deleting the thread used to be permanent for the assistant. The
        // conversation still existed, so this check said "already provisioned" and
        // returned, while the inbox filtered the deleted row out — the member lost
        // the assistant with no way back. Restore their side instead of creating a
        // second thread, which would split the history in two.
        if (existing.members[0]?.isDeleted) {
          await this.prisma.conversationMember.update({
            where: { conversationId_userId: { conversationId: existing.id, userId } },
            data: { isDeleted: false, deletedAt: null },
          })
        }
        aiThreadHint.add(userId)
        return
      }

      const conversation = await this.prisma.conversation.create({
        data: {
          type: 'dm',
          createdBy: aiId,
          members: { createMany: { data: [{ userId }, { userId: aiId }] } },
        },
        select: { id: true },
      })

      await this.sendMessage(aiId, conversation.id, { body: this.aiAssistant.greeting })
      aiThreadHint.add(userId)
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      this.logger.warn(`Could not provision AI thread for ${userId}: ${reason}`)
    }
  }

  /**
   * Post-send side effects that must NOT block the sender's response: bump the
   * conversation's lastMessageAt and push a `notification:new` to each non-muted
   * recipient. Muted state is fetched in ONE query (was an N+1) and publishes run
   * in parallel.
   */
  private async dispatchPostSend(
    senderId: string,
    conversationId: string,
    message: { id: string; body: string | null; createdAt: Date; sender: { displayName: string } },
  ): Promise<void> {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt },
    })

    const otherMembers = await this.prisma.conversationMember.findMany({
      where: { conversationId, userId: { not: senderId }, isDeleted: false },
      select: { userId: true },
    })
    if (otherMembers.length === 0) return

    const settings = await this.prisma.conversationSetting.findMany({
      where: { conversationId, userId: { in: otherMembers.map((m) => m.userId) } },
      select: { userId: true, isMuted: true },
    })
    const mutedIds = new Set(settings.filter((s) => s.isMuted).map((s) => s.userId))

    // Lightweight list-refresh event delivered to each recipient's always-joined
    // user room. The conversation-list provider can't feasibly join every
    // conversation room, so message:new (which only goes to the conversation
    // room) never reached background chats — their unread badge / last-message
    // preview only updated on a manual refetch. This drives that live. Muted
    // chats still update their unread count; only notification:new is suppressed.
    const activity = {
      conversationId,
      senderId,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
    }

    const publishes: Array<Promise<void>> = []
    const pushTargets: string[] = []
    for (const om of otherMembers) {
      publishes.push(this.realtime.publishToUser(om.userId, 'conversation:activity', activity))
      if (!mutedIds.has(om.userId)) {
        publishes.push(
          this.realtime.publishToUser(om.userId, 'notification:new', {
            type: 'message',
            title: message.sender.displayName,
            body: message.body ?? 'Sent a message',
            data: { conversationId, messageId: message.id },
          }),
        )
        pushTargets.push(om.userId)
      }
    }
    await Promise.all(publishes)

    await this.pushMessage(pushTargets, conversationId, message)
  }

  /**
   * Sends the device notification for a new message.
   *
   * Messages need their own path because they never reach the notification
   * writer, which is where every other type gets its push. They are not written
   * to the notifications table at all — a chat has its own surface and does not
   * belong in Alerts — so the socket event above is the whole of the in-app story.
   * Without this, likes and follows pushed and messages silently did not, which is
   * the wrong way round: a message is the notification people most expect.
   *
   * Recipients here have already been filtered for a muted conversation. The
   * category preference is checked on top of that, so "no message notifications
   * on my device" is honoured even for a chat that is not muted.
   */
  private async pushMessage(
    userIds: string[],
    conversationId: string,
    message: { id: string; body: string | null; type?: string; sender: { displayName: string } },
    notificationType: 'message' | 'call' = 'message',
  ): Promise<void> {
    if (userIds.length === 0) {
      this.logger.debug(`message ${message.id}: no push recipients (all muted or alone)`)
      return
    }

    // A body is absent for an attachment, and a raw empty string reads as a bug
    // on the lock screen. Describe the thing instead.
    const preview =
      message.body?.trim() ||
      (message.type && message.type !== 'text' ? `Sent ${message.type === 'image' ? 'a photo' : 'an attachment'}` : 'Sent a message')

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          if (!(await this.pushPreferences.allowsPush(userId, PREFERENCE_KEYS.messagesActivity))) {
            this.logger.debug(`message push skipped for ${userId}: category or master switch off`)
            return
          }
          const result = await this.push.sendToUser(userId, {
            title: message.sender.displayName,
            body: preview.slice(0, 180),
            type: notificationType,
            id: message.id,
            url: `/messages?conversation=${conversationId}`,
          })
          // Debug, not info: useful when bringing this up or diagnosing a
          // "no notification arrived" report, and noise on every message otherwise.
          this.logger.debug(
            `message push for ${userId}: sent=${result.sent} pruned=${result.pruned}`,
          )
        } catch (err) {
          // The message is sent and the socket event has gone out. A push that
          // fails must not turn a delivered message into an error.
          this.logger.warn(`Push for message ${message.id} failed: ${(err as Error).message}`)
        }
      }),
    )
  }

  /**
   * Caller identity (display name + avatar) for call-signaling payloads, resolved
   * server-side from the authenticated user id. Previously the gateway copied
   * these straight from the client body, letting a caller spoof their name/avatar.
   */
  async getCallIdentity(userId: string): Promise<{ displayName?: string; avatarUrl?: string | null }> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { displayName: true, avatarUrl: true },
    })
    return { displayName: profile?.displayName, avatarUrl: profile?.avatarUrl ?? null }
  }

  /** Ids of all active members of a conversation except `excludeUserId` — group-call fan-out. */
  async getOtherMemberIds(conversationId: string, excludeUserId: string): Promise<string[]> {
    const members = await this.prisma.conversationMember.findMany({
      where: { conversationId, isDeleted: false, userId: { not: excludeUserId } },
      select: { userId: true },
    })
    return members.map((m) => m.userId)
  }

  /**
   * Write a call record into the conversation (WhatsApp-style), e.g.
   * "📞 Voice call · 2:05" or "📞 Missed voice call". Broadcast like a normal
   * message so both parties see it appear in the thread immediately.
   */
  async recordCallMessage(
    callerId: string,
    conversationId: string,
    call: { kind: 'audio' | 'video'; status: 'ended' | 'missed' | 'declined'; durationSec?: number },
  ): Promise<void> {
    // The caller must still be an active member of the conversation. The call
    // gateway gates relays on membership, but the call-record write reached here
    // unguarded, so a removed member (who still knows the conversationId) could
    // inject a "📞 Voice call" message into the thread.
    if (!(await this.isMember(callerId, conversationId))) return

    const icon = call.kind === 'video' ? '🎥' : '📞'
    const label = call.kind === 'video' ? 'Video call' : 'Voice call'
    const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
    const body =
      call.status === 'ended'
        ? `${icon} ${label} · ${fmt(Math.max(1, call.durationSec ?? 1))}`
        : call.status === 'declined'
          ? `${icon} ${label} declined`
          : `${icon} Missed ${label.toLowerCase()}`

    const message = await this.prisma.message.create({
      data: { conversationId, senderId: callerId, body, type: 'call' },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    })

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt },
    })

    await this.realtime.publish(`conversation:${conversationId}`, 'message:new', {
      id: message.id,
      conversationId,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        displayName: message.sender.displayName,
        avatarUrl: message.sender.avatarUrl,
      },
      type: 'call',
      body,
      mediaUrls: [],
      parentId: null,
      parent: null,
      createdAt: message.createdAt.toISOString(),
    })

    /*
     * A missed call is the one call record worth a device notification.
     *
     * This publishes to the conversation room only, which reaches whoever has the
     * thread open and nobody else — so someone whose app was closed missed the
     * call and then heard nothing about it at all. That is the failure this
     * feature exists to prevent.
     *
     * Only `missed`: a call that connected was witnessed by both parties, and a
     * declined one was declined by the person being notified. Announcing either
     * is noise.
     */
    if (call.status === 'missed') {
      const recipients = await this.unmutedRecipients(conversationId, callerId)
      await this.pushMessage(recipients, conversationId, { ...message, body }, 'call')
    }
  }

  /**
   * Rings a member's device for an incoming call.
   *
   * The invite itself travels over the socket, which reaches only someone whose
   * app is already open — so a closed app never rang at all. This is the part that
   * reaches a phone in a pocket.
   *
   * Sent while the call is ringing rather than after it, unlike the missed-call
   * record: a notification that arrives once the caller has given up is a worse
   * outcome than none. Nothing here is awaited by the signalling path.
   */
  async pushIncomingCall(
    conversationId: string,
    callerId: string,
    callerName: string,
    callType: 'audio' | 'video',
    toUserId?: string,
  ): Promise<void> {
    try {
      const recipients = toUserId
        ? [toUserId]
        : await this.unmutedRecipients(conversationId, callerId)
      if (recipients.length === 0) return

      // A muted conversation should not ring a device, exactly as it does not
      // notify for a message. Checked here for the direct case, since that skips
      // unmutedRecipients above.
      const allowed = toUserId
        ? (await this.unmutedRecipients(conversationId, callerId)).includes(toUserId)
        : true
      if (!allowed) return

      await Promise.all(
        recipients.map(async (userId) => {
          if (!(await this.pushPreferences.allowsPush(userId, PREFERENCE_KEYS.messagesActivity))) return
          await this.push.sendToUser(userId, {
            title: callerName,
            body: callType === 'video' ? 'Incoming video call' : 'Incoming voice call',
            type: 'call_invite',
            id: conversationId,
            url: `/messages?conversation=${conversationId}&call=incoming`,
            // One slot: a re-dial replaces the previous ring rather than stacking.
            collapseKey: 'call.incoming',
          })
        }),
      )
    } catch (err) {
      this.logger.warn(`Call push failed for ${conversationId}: ${(err as Error).message}`)
    }
  }

  /**
   * Members of a conversation, other than the sender, who have not muted it.
   *
   * The message fan-out computes this inline because it already needs both
   * queries for its socket publishes. The call path needs the same answer without
   * that context, so it asks here rather than repeating the reasoning.
   */
  private async unmutedRecipients(conversationId: string, senderId: string): Promise<string[]> {
    const members = await this.prisma.conversationMember.findMany({
      where: { conversationId, userId: { not: senderId }, isDeleted: false },
      select: { userId: true },
    })
    if (members.length === 0) return []

    const settings = await this.prisma.conversationSetting.findMany({
      where: { conversationId, userId: { in: members.map((m) => m.userId) }, isMuted: true },
      select: { userId: true },
    })
    const muted = new Set(settings.map((s) => s.userId))
    return members.map((m) => m.userId).filter((id) => !muted.has(id))
  }

  async deleteMessage(userId: string, messageId: string, forEveryone = false): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderId: true },
    })
    if (!message) throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })

    if (forEveryone) {
      // "Delete for everyone" destroys the message for all participants — only the
      // sender may do this. (The previous `&& !forEveryone` guard let ANY user
      // delete ANY message globally by passing forEveryone=true — an IDOR.)
      if (message.senderId !== userId) {
        throw new ForbiddenException({ code: 'NOT_SENDER', message: 'You can only delete your own messages' })
      }
      await this.prisma.message.update({
        where: { id: messageId },
        data: { isDeleted: true, deletedForEveryone: true },
      })
      await this.realtime.publish(`conversation:${message.conversationId}`, 'message:deleted', {
        messageId,
        conversationId: message.conversationId,
        deletedForEveryone: true,
      })
      return
    }

    // "Delete for me" hides the message from the caller's view ONLY. Any member of
    // the conversation may do this to any message (WhatsApp semantics). Previously
    // this set isDeleted globally and broadcast to the whole room, so "delete for
    // me" wiped the message for everyone — data loss. Now it appends the caller to
    // the message's `deletedFor` set (getMessages filters on it) and echoes only to
    // the caller's own devices.
    await this.assertMember(userId, message.conversationId)
    await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedFor: { push: userId } },
    })
    await this.realtime.publishToUser(userId, 'message:deleted', {
      messageId,
      conversationId: message.conversationId,
      deletedForEveryone: false,
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
    this.profanity.assertClean(body, { actorId: userId, entityType: 'message' })

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
    // Reacting is a write into the conversation room — the caller must be a member
    // (otherwise a non-member could react to and broadcast into any conversation).
    await this.assertMember(userId, message.conversationId)

    // Instagram-style: one reaction per user per message. Re-tapping the same
    // emoji removes it (toggle off); tapping a different emoji replaces the old.
    const existing = await this.prisma.messageReaction.findFirst({
      where: { messageId, userId },
    })

    let removed = false
    if (existing && existing.emoji === emoji) {
      // Same emoji → toggle off
      await this.prisma.messageReaction.delete({ where: { id: existing.id } })
      removed = true
    } else if (existing) {
      // Different emoji → replace the user's single reaction in place
      await this.prisma.messageReaction.update({
        where: { id: existing.id },
        data: { emoji },
      })
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
      removed,
    })
  }

  // ── CHAT THEME ──────────────────────────────────────────────────────────────

  /**
   * Set the shared chat theme for a conversation (Instagram-style: the theme is
   * stored on the conversation and applies to every member). Broadcasts a
   * `conversation:theme` event so both participants update in real time.
   * A null theme resets to the default.
   */
  async setConversationTheme(userId: string, conversationId: string, theme: string | null): Promise<void> {
    // Only a member may change the conversation's theme.
    await this.assertMember(userId, conversationId)

    const normalized = theme && theme !== 'default' ? theme : null
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { theme: normalized },
    })

    await this.realtime.publish(`conversation:${conversationId}`, 'conversation:theme', {
      conversationId,
      theme: normalized,
      byUserId: userId,
    })
  }

  // ── MARK AS READ ───────────────────────────────────────────────────────────

  /**
   * Mark a conversation read up to a message.
   *
   * The member row update was always safe — it filters on both ids, so a
   * non-member simply matched nothing. The receipt upsert was not: it keyed on
   * `messageId` and `userId` alone and never looked at `conversationId`, so any
   * authenticated caller could write a `read` receipt against *any* message id
   * in the system, for a conversation they had no part in. Reachable from both
   * `POST /messaging/conversations/:id/read` and the `messages:read` socket
   * event, whose payloads are caller-controlled — the Zod schema checked that
   * the id was a UUID, not that it was theirs.
   *
   * Nothing reads `MessageReceipt` back yet, so the damage was a polluted table
   * plus a message-existence oracle (the FK to Message rejects ids that do not
   * exist). The moment a "Seen by" surface is built on it, it would have become
   * a forged read receipt on someone else's private thread.
   *
   * Two checks now, matching how the rest of this service and PetsService guard
   * nested records: the caller must be a member, and the message must belong to
   * this conversation.
   */
  async markConversationRead(userId: string, conversationId: string, lastReadMessageId?: string): Promise<void> {
    const isConversationMember = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { isDeleted: true },
    })
    if (!isConversationMember || isConversationMember.isDeleted) {
      // Community chat keeps its bookmark on community_members instead — see
      // CommunityChatService for why there is no member row to update.
      await this.communityChat.assertCanRead(userId, conversationId)
      await this.communityChat.markRead(userId, conversationId)
      return
    }

    const now = new Date()
    await this.prisma.conversationMember.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: now },
    })

    if (lastReadMessageId) {
      const message = await this.prisma.message.findFirst({
        where: { id: lastReadMessageId, conversationId },
        select: { id: true },
      })
      if (!message) {
        throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })
      }
      await this.prisma.messageReceipt.upsert({
        where: { messageId_userId: { messageId: lastReadMessageId, userId } },
        create: { messageId: lastReadMessageId, userId, status: 'read', readAt: now },
        update: { status: 'read', readAt: now },
      })
    }
  }

  /** Mark every one of the caller's active conversations as read (bulk "read all"). */
  async markAllConversationsRead(userId: string): Promise<void> {
    await this.prisma.conversationMember.updateMany({
      where: { userId, isDeleted: false },
      data: { lastReadAt: new Date() },
    })
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

  /**
   * Unread counts for ALL of a user's active conversations in ONE query.
   * Replaces the previous per-conversation `message.count` fan-out (N+1 that
   * could fire hundreds of concurrent COUNTs and time out). Uses the
   * `messages(conversation_id, created_at)` index; per-conversation cutoff comes
   * from the member's `last_read_at` (null = everything from others is unread).
   */
  private async getUnreadCountsMap(userId: string): Promise<Map<string, number>> {
    const rows = await this.prisma.$queryRaw<Array<{ conversationId: string; count: number | bigint }>>`
      SELECT m.conversation_id AS "conversationId", COUNT(*)::int AS count
      FROM messages m
      JOIN conversation_members cm
        ON cm.conversation_id = m.conversation_id AND cm.user_id = ${userId}::uuid
      WHERE cm.is_deleted = false
        AND m.sender_id <> ${userId}::uuid
        AND m.is_deleted = false
        AND (cm.last_read_at IS NULL OR m.created_at > cm.last_read_at)
      GROUP BY m.conversation_id
    `
    return new Map(rows.map((r) => [r.conversationId, Number(r.count)]))
  }

  async getUnreadCounts(userId: string): Promise<UnreadCountResponse> {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { userId, isDeleted: false },
      select: { conversationId: true },
    })

    const unreadMap = await this.getUnreadCountsMap(userId)
    const counts = memberships.map((m) => ({
      conversationId: m.conversationId,
      count: unreadMap.get(m.conversationId) ?? 0,
    }))
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
      // Must be a member of the requested conversation — otherwise supplying an
      // arbitrary conversationId leaked its messages (read IDOR).
      await this.assertMember(userId, conversationId)
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

    // Enforce blocks + the recipient's whoCanSendMessageRequest setting. This
    // path is reachable directly via POST /requests, which previously skipped the
    // check entirely — a blocked user (or one whose target set requests to
    // "nobody") could still create a request and push a realtime notification.
    const canRequest = await this.privacy.canSendMessageRequest(senderId, recipientId)
    if (!canRequest.allowed) {
      throw new ForbiddenException({ code: 'CANNOT_REQUEST', message: `Cannot send message request: ${canRequest.reason}` })
    }

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

  async getUploadUrl(userId: string, mimeType: string, fileName?: string, fileSize?: number, durationSeconds?: number): Promise<{ url: string; viewUrl: string; key: string; type: string }> {
    if (!this.storage.isEnabled) {
      throw new BadRequestException({ code: 'STORAGE_NOT_CONFIGURED', message: 'File upload is not available' })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv',
    ]
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException({ code: 'INVALID_FILE_TYPE', message: `File type ${mimeType} is not supported` })
    }

    // Per-type size caps — images arrive pre-compressed by the client (WebP),
    // so anything huge is either a raw bypass or an oversized GIF
    const MB = 1024 * 1024
    const sizeLimit = mimeType.startsWith('video/') ? 100 * MB
      : mimeType.startsWith('image/') ? 25 * MB
        : mimeType.startsWith('audio/') ? 25 * MB
          : 25 * MB // documents
    if (fileSize && fileSize > sizeLimit) {
      throw new BadRequestException({ code: 'FILE_TOO_LARGE', message: `File exceeds maximum size of ${sizeLimit / MB}MB` })
    }

    // Videos must declare a duration and stay under 5 minutes (fail closed —
    // the client measures it and the request is rejected without it)
    if (mimeType.startsWith('video/')) {
      if (typeof durationSeconds !== 'number' || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        throw new BadRequestException({ code: 'VIDEO_DURATION_REQUIRED', message: 'Video duration is required' })
      }
      if (durationSeconds > 300) {
        throw new BadRequestException({ code: 'VIDEO_TOO_LONG', message: 'Videos must be under 5 minutes' })
      }
    }

    const key = this.storage.generateKey(userId, mimeType)
    const uploadUrl = await this.storage.getPresignedUploadUrl(key)
    const viewUrl = this.storage.getPublicUrl(key)

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
      theme: string | null
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
      theme: conv.theme ?? null,
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
