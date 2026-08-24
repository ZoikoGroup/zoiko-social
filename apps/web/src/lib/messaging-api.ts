import { request, mutate } from './api'

/**
 * Messaging endpoints that had no caller.
 *
 * Twenty-five of the messaging module's forty-five routes were unreachable from
 * the web app: message requests, conversation pin/mute/archive, privacy
 * settings, favourites and group membership management. The backend, its guards
 * and its tests were all there; nothing called them.
 *
 * Deliberately built on the shared `request`/`mutate` helpers rather than the
 * raw `fetch` calls the rest of the messaging feature uses. Those hand-roll the
 * Authorization header and the error shape per call site; this gets consistent
 * auth, the unified ApiError, and cache invalidation on writes for free.
 */

export interface MessagingUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

export interface MessageRequestItem {
  id: string
  message: string | null
  status: string
  createdAt: string
}

export interface IncomingMessageRequest extends MessageRequestItem {
  sender: MessagingUser
}

export interface OutgoingMessageRequest extends MessageRequestItem {
  recipient: MessagingUser
}

export type PrivacyAudience = 'everyone' | 'my_connections' | 'my_followers' | 'nobody'

export interface MessagingPrivacy {
  whoCanMessage: PrivacyAudience
  whoCanSendMessageRequest: PrivacyAudience
  whoCanSeeOnlineStatus: PrivacyAudience
  whoCanSeeLastSeen: PrivacyAudience
  showReadReceipts: boolean
  showTypingIndicator: boolean
  messageRequestExpiry: number | null
}


/** Why the composer is locked. Mirrors the API's PostBlockedReason. */
export type PostBlockedReason = 'chat_disabled' | 'announcement_only' | 'muted' | 'slow_mode' | null

export interface CommunityChatAccess {
  conversationId: string
  communityId: string
  role: string
  isMod: boolean
  isAdmin: boolean
  canPost: boolean
  reason: PostBlockedReason
  retryAfterSeconds: number
  announcementOnly: boolean
  slowModeSeconds: number
  chatEnabled: boolean
}

export interface PinnedMessage {
  id: string
  body: string | null
  type: string
  createdAt: string
  pinnedAt: string | null
  senderId: string
  senderName: string
}

export interface CommunityChatMember {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  role: string
  isMuted: boolean
}

export const messagingApi = {
  // ── Community chat ────────────────────────────────────────────────────────
  /** The viewer's role and whether the room's locks currently apply to them. */
  communityAccess: (conversationId: string) =>
    request<CommunityChatAccess>(`/messaging/conversations/${conversationId}/community`),
  communityMembers: (conversationId: string) =>
    request<CommunityChatMember[]>(`/messaging/conversations/${conversationId}/community/members`),
  updateCommunityChatSettings: (
    conversationId: string,
    body: { chatEnabled?: boolean; announcementOnly?: boolean; slowModeSeconds?: number },
  ) =>
    mutate<{ chatEnabled: boolean; announcementOnly: boolean; slowModeSeconds: number }>(
      `/messaging/conversations/${conversationId}/community/settings`,
      { method: 'PATCH', body: JSON.stringify(body) },
    ),
  pinnedMessage: (conversationId: string) =>
    request<PinnedMessage | null>(`/messaging/conversations/${conversationId}/pinned`),
  /** Toggle: pinning the pinned message unpins it. */
  togglePinMessage: (messageId: string) =>
    mutate<{ pinned: boolean }>(`/messaging/messages/${messageId}/pin`, { method: 'POST' }),
  /** Moderator removal of someone else's message; always for everyone. */
  moderateDeleteMessage: (messageId: string) =>
    mutate<void>(`/messaging/messages/${messageId}/moderate`, { method: 'DELETE' }),

  // ── Message requests (DMs from people you don't follow) ───────────────────
  requests: () =>
    request<{ incoming: IncomingMessageRequest[]; outgoing: OutgoingMessageRequest[] }>('/messaging/requests'),
  acceptRequest: (id: string) =>
    mutate<{ success: boolean }>(`/messaging/requests/${id}/accept`, { method: 'POST' }),
  rejectRequest: (id: string) =>
    mutate<{ success: boolean }>(`/messaging/requests/${id}/reject`, { method: 'POST' }),

  // ── Per-conversation state ────────────────────────────────────────────────
  pin: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/pin`, { method: 'POST' }),
  unpin: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/pin`, { method: 'DELETE' }),
  /** `until` omitted mutes indefinitely. */
  mute: (conversationId: string, until?: Date) =>
    mutate<{ success: boolean }>(
      `/messaging/conversations/${conversationId}/mute${until ? `?until=${encodeURIComponent(until.toISOString())}` : ''}`,
      { method: 'POST' },
    ),
  unmute: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/mute`, { method: 'DELETE' }),
  archive: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/archive`, { method: 'POST' }),
  unarchive: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/archive`, { method: 'DELETE' }),
  /** Empties the thread for you only; the other participant keeps their copy. */
  clear: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}/clear`, { method: 'POST' }),
  /** Removes the conversation from your inbox. Also your copy only. */
  deleteConversation: (conversationId: string) =>
    mutate<{ success: boolean }>(`/messaging/conversations/${conversationId}`, { method: 'DELETE' }),

  // ── Privacy ───────────────────────────────────────────────────────────────
  privacy: () => request<MessagingPrivacy>('/messaging/privacy'),
  updatePrivacy: (input: Partial<MessagingPrivacy>) =>
    mutate<MessagingPrivacy>('/messaging/privacy', { method: 'PATCH', body: JSON.stringify(input) }),

  // ── Favourites ────────────────────────────────────────────────────────────
  /** Rows are the join records, so the person is under `contact`. */
  favorites: () =>
    request<{ userId: string; contactId: string; createdAt: string; contact: MessagingUser & { verificationTier: string } }[]>(
      '/messaging/favorites',
    ),
  addFavorite: (contactId: string) =>
    mutate<{ success: boolean }>(`/messaging/favorites/${contactId}`, { method: 'POST' }),
  removeFavorite: (contactId: string) =>
    mutate<{ success: boolean }>(`/messaging/favorites/${contactId}`, { method: 'DELETE' }),

  // ── Group membership ──────────────────────────────────────────────────────
  addGroupMembers: (groupId: string, userIds: string[]) =>
    mutate<{ success: boolean }>(`/messaging/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    }),
  removeGroupMember: (groupId: string, userId: string) =>
    mutate<{ success: boolean }>(`/messaging/groups/${groupId}/members/${userId}`, { method: 'DELETE' }),
  leaveGroup: (groupId: string) =>
    mutate<{ success: boolean }>(`/messaging/groups/${groupId}/leave`, { method: 'POST' }),

  /** Search within the viewer's own messages. */
  searchMessages: (q: string) =>
    request<{ conversationId: string; messageId: string; body: string; createdAt: string }[]>(
      `/messaging/search?q=${encodeURIComponent(q)}`,
    ),
}
