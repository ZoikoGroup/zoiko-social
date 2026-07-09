import { z } from 'zod'

// ── Enums ───────────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'voice_note' | 'document' | 'gif' | 'sticker' | 'location' | 'contact'
export type MessageRequestStatus = 'pending' | 'accepted' | 'rejected' | 'expired'
export type PresenceStatus = 'online' | 'offline' | 'away' | 'do_not_disturb'
export type PrivacySetting = 'everyone' | 'my_connections' | 'my_followers' | 'nobody'
export type GroupRole = 'owner' | 'admin' | 'member'
export type GroupType = 'private' | 'public' | 'invite_only'

// ── Zod Schemas ─────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const CreateConversationSchema = z.object({
  participantId: z.string().uuid(),
  initialMessage: z.string().max(2000).optional(),
})

export const SendMessageSchema = z.object({
  body: z.string().max(5000).optional(),
  type: z.enum(['text', 'image', 'video', 'audio', 'voice_note', 'document', 'gif', 'sticker', 'location', 'contact']).default('text'),
  parentId: z.string().uuid().optional(),
  mediaUrls: z.array(z.string().url()).max(10).optional(),
})

export const EditMessageSchema = z.object({
  body: z.string().max(5000),
})

export const ReactToMessageSchema = z.object({
  emoji: z.string().min(1).max(10),
})

export const TypingSchema = z.object({
  conversationId: z.string().uuid(),
  isTyping: z.boolean(),
})

export const MarkReadSchema = z.object({
  conversationId: z.string().uuid(),
  lastReadMessageId: z.string().uuid(),
})

export const CreateGroupSchema = z.object({
  name: z.string().min(1).max(100),
  participantIds: z.array(z.string().uuid()).min(1).max(255),
  description: z.string().max(500).optional(),
  type: z.enum(['private', 'public', 'invite_only']).default('private'),
})

export const SendMessageRequestSchema = z.object({
  recipientId: z.string().uuid(),
  message: z.string().max(2000).optional(),
})

export const UpdatePrivacySchema = z.object({
  whoCanMessage: z.enum(['everyone', 'my_connections', 'my_followers', 'nobody']).optional(),
  whoCanSendMessageRequest: z.enum(['everyone', 'my_connections', 'my_followers', 'nobody']).optional(),
  whoCanSeeOnlineStatus: z.enum(['everyone', 'my_connections', 'my_followers', 'nobody']).optional(),
  whoCanSeeLastSeen: z.enum(['everyone', 'my_connections', 'my_followers', 'nobody']).optional(),
  showReadReceipts: z.boolean().optional(),
  showTypingIndicator: z.boolean().optional(),
})

export const UpdateProfessionalMessagingSchema = z.object({
  greetingEnabled: z.boolean().optional(),
  greetingMessage: z.string().max(500).optional(),
  awayMessageEnabled: z.boolean().optional(),
  awayMessage: z.string().max(500).optional(),
  businessHoursEnabled: z.boolean().optional(),
  businessHours: z.any().optional(),
  autoReplyEnabled: z.boolean().optional(),
  autoReplyMessage: z.string().max(500).optional(),
  quickReplies: z.array(z.object({ shortcut: z.string(), message: z.string() })).optional(),
})

// ── Response Types ──────────────────────────────────────────────────────────

export interface ConversationResponse {
  id: string
  type: string
  name: string | null
  avatarUrl: string | null
  lastMessage: {
    body: string | null
    senderId: string
    createdAt: string
  } | null
  unreadCount: number
  isOnline: boolean
  lastSeen: string | null
  participants: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }[]
  isMuted: boolean
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageResponse {
  id: string
  conversationId: string
  sender: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  }
  type: string
  body: string | null
  mediaUrls: string[]
  parentId: string | null
  isDeleted: boolean
  editedAt: string | null
  reactions: { emoji: string; userId: string }[]
  receipt: { status: string; readAt: string | null } | null
  createdAt: string
}

export interface SuggestionResponse {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  mutualFollowers: number
  isVerified: boolean
  isProfessional: boolean
  professionalCategory: string | null
  isOnline: boolean
  lastSeen: string | null
}

export interface MessageRequestResponse {
  id: string
  sender: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  message: string | null
  status: string
  createdAt: string
}

export interface UnreadCountResponse {
  total: number
  conversations: { conversationId: string; count: number }[]
}

// ── Inferred input types for the controller ────────────────────────────────

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>
export type SendMessageInput = z.infer<typeof SendMessageSchema>
export type EditMessageInput = z.infer<typeof EditMessageSchema>
export type ReactToMessageInput = z.infer<typeof ReactToMessageSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
export type MarkReadInput = z.infer<typeof MarkReadSchema>
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>
export type SendMessageRequestInput = z.infer<typeof SendMessageRequestSchema>
export type UpdatePrivacyInput = z.infer<typeof UpdatePrivacySchema>
export type UpdateProfessionalMessagingInput = z.infer<typeof UpdateProfessionalMessagingSchema>
