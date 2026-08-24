import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'

/**
 * Community chat.
 *
 * The design decision this whole file rests on: membership is DERIVED from
 * `community_members`, never copied into `conversation_members`. A community can
 * hold thousands of people, and maintaining two membership lists means they
 * drift — the first ban that removes someone from one list and not the other
 * leaves them reading a chat they were thrown out of. Deriving makes join, leave
 * and ban correct for free, and writes no rows per member.
 *
 * What it costs is read state: `conversation_members.last_read_at` is where the
 * inbox keeps its bookmark, and there is no row here. `community_members
 * .chat_last_read_at` stands in for it (migration 074).
 *
 * Pin / mute / archive need nothing special — `conversation_settings` is keyed
 * on (conversation, user) independently of membership, so it already works.
 */

/** Staff, in descending order of authority. Anyone here moderates the chat. */
const MOD_ROLES = new Set(['owner', 'admin', 'moderator'])
/** Who may change the chat's settings. Deliberately tighter than moderation. */
const ADMIN_ROLES = new Set(['owner', 'admin'])

/** Why the composer is locked, in the words the member sees. */
export type PostBlockedReason =
  | 'chat_disabled'
  | 'announcement_only'
  | 'muted'
  | 'slow_mode'
  | null

export interface CommunityChatAccess {
  conversationId: string
  communityId: string
  role: string
  isMod: boolean
  isAdmin: boolean
  canPost: boolean
  reason: PostBlockedReason
  /** Seconds still to wait, when `reason` is 'slow_mode'. */
  retryAfterSeconds: number
  announcementOnly: boolean
  slowModeSeconds: number
  chatEnabled: boolean
}

@Injectable()
export class CommunityChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  // ── Provisioning ───────────────────────────────────────────────────────────

  /**
   * The conversation backing a community, created on demand.
   *
   * Lazy rather than at community creation, so the communities that already
   * exist get one too — the same reason the assistant thread is provisioned on
   * first inbox load rather than at signup.
   *
   * `upsert` on the unique community_id rather than find-then-create: two
   * members opening the chat at the same moment would both see nothing and both
   * insert, and one of them would get a unique-violation instead of a chat.
   */
  async ensureChat(communityId: string, name: string, avatarUrl: string | null): Promise<string> {
    const conv = await this.prisma.conversation.upsert({
      where: { communityId },
      create: { type: 'community', communityId, name, avatarUrl },
      update: {},
      select: { id: true },
    })
    return conv.id
  }

  // ── Access ────────────────────────────────────────────────────────────────

  /**
   * Everything the send and read paths need, in one place.
   *
   * Returns null rather than throwing when the conversation is not a community
   * chat, so callers can fall through to the ordinary DM/group checks.
   */
  async getAccess(userId: string, conversationId: string): Promise<CommunityChatAccess | null> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        communityId: true,
        isDeleted: true,
        community: {
          select: {
            id: true,
            isDeleted: true,
            settings: {
              select: { chatEnabled: true, chatAnnouncementOnly: true, chatSlowModeSeconds: true },
            },
          },
        },
      },
    })
    if (!conv?.communityId || conv.isDeleted) return null
    if (!conv.community || conv.community.isDeleted) {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }

    const member = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: conv.communityId, userId } },
      select: { role: true, status: true, mutedUntil: true },
    })
    // A non-member gets the same answer as a stranger asking about a DM: not
    // found. Confirming the chat exists would leak the membership of a private
    // community to anyone who could guess a conversation id.
    if (!member || member.status !== 'active') {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }

    // Absent settings row means defaults, which is an open chat.
    const settings = conv.community.settings
    const chatEnabled = settings?.chatEnabled ?? true
    const announcementOnly = settings?.chatAnnouncementOnly ?? false
    const slowModeSeconds = settings?.chatSlowModeSeconds ?? 0

    const isMod = MOD_ROLES.has(member.role)
    const isAdmin = ADMIN_ROLES.has(member.role)

    const base: CommunityChatAccess = {
      conversationId: conv.id,
      communityId: conv.communityId,
      role: member.role,
      isMod,
      isAdmin,
      canPost: true,
      reason: null,
      retryAfterSeconds: 0,
      announcementOnly,
      slowModeSeconds,
      chatEnabled,
    }

    // Order matters: report the reason a member cannot fix before one they can.
    if (!chatEnabled && !isAdmin) return { ...base, canPost: false, reason: 'chat_disabled' }
    if (announcementOnly && !isMod) return { ...base, canPost: false, reason: 'announcement_only' }
    if (member.mutedUntil && member.mutedUntil.getTime() > Date.now()) {
      return { ...base, canPost: false, reason: 'muted' }
    }

    // Slow mode last, and skipped for staff — the people most likely to need to
    // post twice in a row are the ones keeping order.
    if (slowModeSeconds > 0 && !isMod) {
      const last = await this.prisma.message.findFirst({
        where: { conversationId, senderId: userId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      })
      if (last) {
        const elapsed = (Date.now() - last.createdAt.getTime()) / 1000
        if (elapsed < slowModeSeconds) {
          return {
            ...base,
            canPost: false,
            reason: 'slow_mode',
            retryAfterSeconds: Math.ceil(slowModeSeconds - elapsed),
          }
        }
      }
    }

    return base
  }

  /** Read access only: any active member, even one who may not post. */
  async assertCanRead(userId: string, conversationId: string): Promise<CommunityChatAccess> {
    const access = await this.getAccess(userId, conversationId)
    if (!access) {
      throw new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' })
    }
    return access
  }

  /** Throws with the specific reason, so the client can say which lock it hit. */
  async assertCanPost(userId: string, conversationId: string): Promise<CommunityChatAccess> {
    const access = await this.assertCanRead(userId, conversationId)
    if (access.canPost) return access

    const messages: Record<Exclude<PostBlockedReason, null>, string> = {
      chat_disabled: 'Chat is turned off for this community',
      announcement_only: 'Only admins can post in this community',
      muted: 'You are muted in this community',
      slow_mode: `Slow mode is on — wait ${access.retryAfterSeconds}s before posting again`,
    }
    throw new ForbiddenException({
      code: 'COMMUNITY_CHAT_FORBIDDEN',
      reason: access.reason,
      retryAfterSeconds: access.retryAfterSeconds,
      message: access.reason ? messages[access.reason] : 'You cannot post here',
    })
  }

  /**
   * Membership test for the socket gateway, which joins a room before it knows
   * what kind of conversation it is. Never throws — a false answer is the point.
   */
  async isChatMember(userId: string, conversationId: string): Promise<boolean> {
    try {
      const access = await this.getAccess(userId, conversationId)
      return access !== null
    } catch {
      return false
    }
  }

  // ── The Communities tab ───────────────────────────────────────────────────

  /**
   * Every community chat this member can see.
   *
   * Deliberately its own endpoint rather than a branch inside the inbox: the
   * inbox is a keyset pagination over `conversation_members`, and community
   * chats have no rows there. Merging a second source into that keyset would
   * break its ordering guarantee at every page boundary.
   */
  async listForUser(userId: string) {
    const memberships = await this.prisma.communityMember.findMany({
      where: { userId, status: 'active', community: { isDeleted: false } },
      select: {
        role: true,
        chatLastReadAt: true,
        community: {
          select: {
            id: true,
            slug: true,
            name: true,
            avatarUrl: true,
            membersCount: true,
            settings: {
              select: { chatEnabled: true, chatAnnouncementOnly: true, chatSlowModeSeconds: true },
            },
            chat: { select: { id: true, theme: true, lastMessageAt: true, createdAt: true } },
          },
        },
      },
      take: 200,
    })
    if (memberships.length === 0) return []

    // Backfill in one insert rather than one upsert per community: every
    // community that predates this feature is missing its chat, so the first
    // load after deploy would otherwise be N round-trips.
    const missing = memberships.filter((m) => !m.community.chat)
    if (missing.length > 0) {
      await this.prisma.conversation.createMany({
        data: missing.map((m) => ({
          type: 'community',
          communityId: m.community.id,
          name: m.community.name,
          avatarUrl: m.community.avatarUrl,
        })),
        skipDuplicates: true,
      })
      const created = await this.prisma.conversation.findMany({
        where: { communityId: { in: missing.map((m) => m.community.id) } },
        select: { id: true, communityId: true, theme: true, lastMessageAt: true, createdAt: true },
      })
      const byCommunity = new Map(created.map((c) => [c.communityId, c]))
      for (const m of missing) {
        const c = byCommunity.get(m.community.id)
        if (c) {
          m.community.chat = {
            id: c.id,
            theme: c.theme,
            lastMessageAt: c.lastMessageAt,
            createdAt: c.createdAt,
          }
        }
      }
    }

    const chatIds = memberships
      .map((m) => m.community.chat?.id)
      .filter((id): id is string => !!id)
    if (chatIds.length === 0) return []

    // Batched reads for the whole list rather than per-chat queries.
    const [lastMessages, settings, activity] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId: { in: chatIds }, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        distinct: ['conversationId'],
        select: { conversationId: true, body: true, senderId: true, createdAt: true, type: true },
      }),
      this.prisma.conversationSetting.findMany({
        where: { userId, conversationId: { in: chatIds } },
        select: { conversationId: true, isMuted: true, isPinned: true, isArchived: true },
      }),
      this.prisma.message.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: chatIds }, isDeleted: false, senderId: { not: userId } },
        _count: { _all: true },
      }),
    ])

    const lastByChat = new Map(lastMessages.map((m) => [m.conversationId, m]))
    const settingByChat = new Map(settings.map((s) => [s.conversationId, s]))
    const hasActivity = new Map(activity.map((r) => [r.conversationId, r._count._all]))

    // Unread needs a per-member cutoff, which one groupBy cannot express. Only
    // the chats that could possibly have unread are counted, which in practice
    // is the handful a member has activity in rather than all 200.
    const needsUnread = memberships.filter((m) => {
      const chat = m.community.chat
      if (!chat) return false
      if (!hasActivity.get(chat.id)) return false
      return !m.chatLastReadAt || chat.lastMessageAt > m.chatLastReadAt
    })
    const unreadCounts = new Map<string, number>()
    await Promise.all(
      needsUnread.map(async (m) => {
        const chat = m.community.chat
        if (!chat) return
        const count = await this.prisma.message.count({
          where: {
            conversationId: chat.id,
            isDeleted: false,
            senderId: { not: userId },
            ...(m.chatLastReadAt ? { createdAt: { gt: m.chatLastReadAt } } : {}),
          },
        })
        unreadCounts.set(chat.id, count)
      }),
    )

    const rows = memberships
      .filter((m) => m.community.chat)
      .map((m) => {
        const community = m.community
        const chat = community.chat as NonNullable<typeof community.chat>
        const last = lastByChat.get(chat.id) ?? null
        const setting = settingByChat.get(chat.id)
        const s = community.settings
        return {
          id: chat.id,
          type: 'community',
          name: community.name,
          avatarUrl: community.avatarUrl,
          theme: chat.theme,
          lastMessage: last
            ? {
                body: last.body,
                senderId: last.senderId,
                createdAt: last.createdAt.toISOString(),
                type: last.type,
              }
            : null,
          unreadCount: unreadCounts.get(chat.id) ?? 0,
          isOnline: false,
          lastSeen: null,
          participants: [],
          isMuted: setting?.isMuted ?? false,
          isPinned: setting?.isPinned ?? false,
          isArchived: setting?.isArchived ?? false,
          createdAt: chat.createdAt.toISOString(),
          updatedAt: chat.lastMessageAt.toISOString(),
          community: {
            id: community.id,
            slug: community.slug,
            name: community.name,
            avatarUrl: community.avatarUrl,
            membersCount: community.membersCount,
            myRole: m.role,
            isMod: MOD_ROLES.has(m.role),
            isAdmin: ADMIN_ROLES.has(m.role),
            chatEnabled: s?.chatEnabled ?? true,
            announcementOnly: s?.chatAnnouncementOnly ?? false,
            slowModeSeconds: s?.chatSlowModeSeconds ?? 0,
          },
        }
      })

    // Pinned first, then most recent activity — the order the inbox uses.
    rows.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return b.updatedAt.localeCompare(a.updatedAt)
    })
    return rows
  }

  // ── Read state ────────────────────────────────────────────────────────────

  /** Moves this member's bookmark. Silent for a non-member: nothing to mark. */
  async markRead(userId: string, conversationId: string): Promise<void> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { communityId: true },
    })
    if (!conv?.communityId) return
    await this.prisma.communityMember.updateMany({
      where: { communityId: conv.communityId, userId, status: 'active' },
      data: { chatLastReadAt: new Date() },
    })
  }

  // ── Moderation ────────────────────────────────────────────────────────────

  /**
   * Pins a message to the top of the chat. One at a time: pinning a second
   * clears the first, which is what every app that has shipped this does and
   * what keeps the pin bar a fixed height.
   */
  async pinMessage(userId: string, messageId: string): Promise<{ pinned: boolean }> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, isDeleted: true, pinnedAt: true },
    })
    if (!message || message.isDeleted) {
      throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })
    }
    const access = await this.assertCanRead(userId, message.conversationId)
    if (!access.isMod) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only moderators can pin messages' })
    }

    // Toggle: pinning the already-pinned message unpins it.
    if (message.pinnedAt) {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { pinnedAt: null, pinnedBy: null },
      })
      await this.realtime.publish(`conversation:${message.conversationId}`, 'message:pinned', {
        conversationId: message.conversationId,
        messageId: null,
      })
      return { pinned: false }
    }

    await this.prisma.$transaction([
      this.prisma.message.updateMany({
        where: { conversationId: message.conversationId, pinnedAt: { not: null } },
        data: { pinnedAt: null, pinnedBy: null },
      }),
      this.prisma.message.update({
        where: { id: messageId },
        data: { pinnedAt: new Date(), pinnedBy: userId },
      }),
    ])
    await this.realtime.publish(`conversation:${message.conversationId}`, 'message:pinned', {
      conversationId: message.conversationId,
      messageId,
    })
    return { pinned: true }
  }

  /** The current pin, for the bar at the top of the chat. */
  async getPinned(userId: string, conversationId: string) {
    await this.assertCanRead(userId, conversationId)
    const pinned = await this.prisma.message.findFirst({
      where: { conversationId, pinnedAt: { not: null }, isDeleted: false },
      orderBy: { pinnedAt: 'desc' },
      select: {
        id: true,
        body: true,
        type: true,
        createdAt: true,
        pinnedAt: true,
        sender: { select: { id: true, displayName: true, username: true } },
      },
    })
    if (!pinned) return null
    return {
      id: pinned.id,
      body: pinned.body,
      type: pinned.type,
      createdAt: pinned.createdAt.toISOString(),
      pinnedAt: pinned.pinnedAt ? pinned.pinnedAt.toISOString() : null,
      senderId: pinned.sender.id,
      senderName: pinned.sender.displayName,
    }
  }

  /**
   * Moderator deletion, distinct from a member deleting their own message: this
   * removes it for everyone, and is allowed on someone else's message.
   */
  async moderateDelete(userId: string, messageId: string): Promise<string> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderId: true },
    })
    if (!message) {
      throw new NotFoundException({ code: 'MESSAGE_NOT_FOUND', message: 'Message not found' })
    }
    const access = await this.assertCanRead(userId, message.conversationId)
    if (!access.isMod) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only moderators can remove messages' })
    }
    await this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true, deletedForEveryone: true, pinnedAt: null, pinnedBy: null },
    })
    await this.realtime.publish(`conversation:${message.conversationId}`, 'message:deleted', {
      messageId,
      conversationId: message.conversationId,
      deletedForEveryone: true,
    })
    return message.conversationId
  }

  /** Chat settings, changeable by owner and admin only. */
  async updateSettings(
    userId: string,
    conversationId: string,
    input: { chatEnabled?: boolean; announcementOnly?: boolean; slowModeSeconds?: number },
  ) {
    const access = await this.assertCanRead(userId, conversationId)
    if (!access.isAdmin) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only community admins can change chat settings' })
    }
    if (input.slowModeSeconds !== undefined && (input.slowModeSeconds < 0 || input.slowModeSeconds > 3600)) {
      throw new BadRequestException({
        code: 'INVALID_SLOW_MODE',
        message: 'Slow mode must be between 0 and 3600 seconds',
      })
    }

    const data = {
      ...(input.chatEnabled !== undefined ? { chatEnabled: input.chatEnabled } : {}),
      ...(input.announcementOnly !== undefined ? { chatAnnouncementOnly: input.announcementOnly } : {}),
      ...(input.slowModeSeconds !== undefined ? { chatSlowModeSeconds: input.slowModeSeconds } : {}),
    }
    // The settings row is optional on a community, so this has to create it.
    const saved = await this.prisma.communitySettings.upsert({
      where: { communityId: access.communityId },
      create: { communityId: access.communityId, ...data },
      update: data,
      select: { chatEnabled: true, chatAnnouncementOnly: true, chatSlowModeSeconds: true },
    })
    const result = {
      chatEnabled: saved.chatEnabled,
      announcementOnly: saved.chatAnnouncementOnly,
      slowModeSeconds: saved.chatSlowModeSeconds,
    }
    await this.realtime.publish(`conversation:${conversationId}`, 'community:settings', {
      conversationId,
      ...result,
    })
    return result
  }

  /**
   * Who is in the room, for the members sheet. Staff first, then alphabetical —
   * a member looking here usually wants to find someone to report to.
   */
  async listMembers(userId: string, conversationId: string, limit = 50) {
    await this.assertCanRead(userId, conversationId)
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { communityId: true },
    })
    if (!conv?.communityId) return []
    const members = await this.prisma.communityMember.findMany({
      where: { communityId: conv.communityId, status: 'active' },
      select: {
        role: true,
        mutedUntil: true,
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
      },
      take: Math.min(limit, 100),
    })
    const rank: Record<string, number> = { owner: 0, admin: 1, moderator: 2, member: 3 }
    return members
      .map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        isVerified: m.user.verificationTier !== 'none',
        role: m.role,
        isMuted: !!m.mutedUntil && m.mutedUntil.getTime() > Date.now(),
      }))
      .sort(
        (a, b) =>
          (rank[a.role] ?? 9) - (rank[b.role] ?? 9) || a.displayName.localeCompare(b.displayName),
      )
  }
}
