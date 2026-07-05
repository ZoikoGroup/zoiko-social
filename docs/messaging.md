# ZoikoSocial — Messaging System Implementation Plan

> Status: **Planning**  
> Last Updated: July 4, 2026  
> Architecture: Hybrid (NestJS API for writes, Supabase Realtime for reads)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema (Existing)](#2-database-schema-existing)
3. [Phase 1: NestJS Backend API](#3-phase-1-nestjs-backend-api)
4. [Phase 2: Supabase Realtime Integration](#4-phase-2-supabase-realtime-integration)
5. [Phase 3: Frontend Data Integration](#5-phase-3-frontend-data-integration)
6. [Phase 4: New Conversation Flow](#6-phase-4-new-conversation-flow)
7. [Phase 5: Cross-Page Linking](#7-phase-5-cross-page-linking)
8. [Phase 6: Polish & Edge Cases](#8-phase-6-polish--edge-cases)
9. [File Creation/Modification Summary](#9-file-creationmodification-summary)
10. [Security Considerations](#10-security-considerations)
11. [Performance Considerations](#11-performance-considerations)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Next.js)                     │
│                                                           │
│  ┌──────────────┐    ┌──────────────────────────────┐    │
│  │ Conversation │    │         ChatWindow            │    │
│  │    List      │    │  ┌─────┐ ┌─────┐ ┌────────┐ │    │
│  │              │    │  │ Msg │ │ Msg │ │ Input  │ │    │
│  │ • Fetch API  │    │  │     │ │     │ │ Bar    │ │    │
│  │ • Realtime   │    │  └─────┘ └─────┘ └────────┘ │    │
│  └──────┬───────┘    └──────────┬───────────────────┘    │
│         │                       │                         │
│         │        ┌──────────────┴──────────────┐          │
│         │        │   Supabase Realtime (read)   │          │
│         │        │  • New messages via channel  │          │
│         │        │  • Conversation updates      │          │
│         │        └──────────────┬──────────────┘          │
│         │                       │                         │
└─────────┼───────────────────────┼─────────────────────────┘
          │                       │
          │    REST API (/api/v1) │
          ▼                       ▼
┌─────────────────────────────────────────────────────────┐
│                 NestJS API (Fastify)                      │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │            Messaging Controller                    │    │
│  │  GET  /conversations                              │    │
│  │  POST /conversations                              │    │
│  │  GET  /conversations/:id/messages                 │    │
│  │  POST /conversations/:id/messages                 │    │
│  │  PATCH /messages/:id                              │    │
│  │  DELETE /messages/:id                             │    │
│  │  POST /conversations/:id/read                     │    │
│  │  POST /conversations/:id/members                  │    │
│  │  DELETE /conversations/:id/members                │    │
│  └──────────────────────┬───────────────────────────┘    │
│                         │                                  │
│  ┌──────────────────────▼───────────────────────────┐    │
│  │            Messaging Service                       │    │
│  │  • getConversations()   • sendMessage()            │    │
│  │  • createConversation() • editMessage()            │    │
│  │  • getMessages()        • deleteMessage()          │    │
│  │  • markRead()           • add/removeMembers()     │    │
│  └──────────────────────┬───────────────────────────┘    │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Supabase DB       │
              │  (service_role key)    │
              │                        │
              │  • conversations       │
              │  • conversation_members│
              │  • messages            │
              │  • RLS enforced        │
              └───────────────────────┘
```

**Data Flow:**
- **Writes** (send message, create conversation, edit/delete) → NestJS API → Supabase (admin client, service_role)
- **Reads** (fetch conversation list, message history) → NestJS API → Supabase (admin client)
- **Real-time** (new message notifications) → Supabase Realtime channels directly from browser
- **Auth** → JWT token verified by NestJS, session cookie used for Realtime channel auth

---

## 2. Database Schema (Existing)

The following tables already exist in `supabase/migrations/000_schema.sql` with RLS in `001_rls_setup.sql`:

### 2.1 `conversations`

```sql
CREATE TABLE public.conversations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type            public.conversation_type NOT NULL DEFAULT 'dm',
  name            text,                           -- null for DMs (use participant names)
  avatar_url      text,                           -- group/community avatar
  created_by      uuid        REFERENCES public.profiles(id),
  last_message_at timestamptz,                    -- updated on each new message
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

### 2.2 `conversation_members`

```sql
CREATE TABLE public.conversation_members (
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  last_read_at    timestamptz,                    -- updated when user reads messages
  PRIMARY KEY (conversation_id, user_id)
);
```

### 2.3 `messages`

```sql
CREATE TABLE public.messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            text,
  media_urls      text[]      NOT NULL DEFAULT '{}',
  is_deleted      boolean     NOT NULL DEFAULT false,
  edited_at       timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

### 2.4 RLS Policies (Already Applied)

- `messages_select_participants` — Only conversation members can read messages
- `messages_insert_participant` — Only members can send, blocked by user state
- `messages_delete_own` — Only sender can soft-delete
- `conversations_select_participants` — Only members can see the conversation
- `conversation_members` — Protected by the conversation and user references

### 2.5 Key Indexes

```sql
CREATE INDEX messages_conv_id_idx    ON public.messages (conversation_id);
CREATE INDEX messages_created_at_idx ON public.messages (created_at DESC);
CREATE INDEX conv_members_user_id_idx ON public.conversation_members (user_id);
```

---

## 3. Phase 1: NestJS Backend API

### 3.1 Module Structure

```
apps/api/src/modules/messaging/
├── messaging.module.ts
├── messaging.controller.ts
├── messaging.service.ts
└── dto/
    ├── create-conversation.dto.ts
    ├── send-message.dto.ts
    ├── get-messages-query.dto.ts
    ├── update-message.dto.ts
    └── add-members.dto.ts
```

### 3.2 DTOs / Validation Schemas

#### Create Conversation
```typescript
export const CreateConversationSchema = z.object({
  type: z.enum(['dm', 'group', 'community']),
  participantIds: z.array(z.string().uuid()).min(1).max(100),
  name: z.string().max(100).optional(),          // required for group/community
}).refine(
  (data) => {
    // DM cannot have more than 2 participants (creator + 1 other)
    if (data.type === 'dm') return data.participantIds.length <= 2
    return true
  },
  { message: 'DM can only have 2 participants' },
)
```

#### Send Message
```typescript
// Already exists in packages/validation/src/index.ts:
export const SendMessageSchema = z.object({
  body: z.string().max(4000).optional(),
  mediaUrls: z.array(z.string().url()).max(5).default([]),
}).refine(
  (data) => data.body !== undefined || data.mediaUrls.length > 0,
  { message: 'Message must have body or media' },
)
```

#### Get Messages (Query Params)
```typescript
export const GetMessagesQuerySchema = z.object({
  cursor: z.string().datetime().optional(),  // ISO timestamp for cursor-based pagination
  limit: z.coerce.number().min(1).max(100).default(50),
  beforeId: z.string().uuid().optional(),    // alternative: paginate before a message ID
})
```

#### Update Message (Edit)
```typescript
export const UpdateMessageSchema = z.object({
  body: z.string().max(4000).min(1),
})
```

#### Add Members
```typescript
export const AddMembersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(50),
})
```

### 3.3 API Endpoints

#### `GET /api/v1/conversations`
List the authenticated user's conversations, ordered by `last_message_at DESC`.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "dm",
      "name": "Dr. Sarah Vance",
      "avatarUrl": null,
      "lastMessage": {
        "id": "uuid",
        "body": "I'll send the lab results shortly.",
        "senderId": "uuid",
        "createdAt": "2026-07-04T09:48:00Z"
      },
      "unreadCount": 3,
      "isOnline": true,
      "members": [
        { "id": "uuid", "displayName": "Alex Rivera", "avatarUrl": null }
      ],
      "lastMessageAt": "2026-07-04T09:48:00Z"
    }
  ]
}
```

#### `POST /api/v1/conversations`
Create a new conversation. For DMs, check if one already exists between the users first.

**Logic:**
1. If `type === 'dm'`, check if a DM conversation between these users already exists
2. If found, return existing conversation (don't duplicate)
3. If not found, INSERT into `conversations` and `conversation_members`
4. Return the new conversation with member details

#### `GET /api/v1/conversations/:id`
Get conversation details including full member list with profiles.

#### `GET /api/v1/conversations/:id/messages`
Get paginated messages for a conversation.

**Cursor-based pagination:** Pass `cursor` (ISO timestamp of the oldest message's `created_at` on the current page) to load older messages.

```sql
SELECT m.*, p.display_name, p.avatar_url
FROM public.messages m
JOIN public.profiles p ON p.id = m.sender_id
WHERE m.conversation_id = :id
  AND m.created_at < :cursor   -- cursor pagination (descending)
  AND m.is_deleted = false
ORDER BY m.created_at DESC
LIMIT :limit
```

#### `POST /api/v1/conversations/:id/messages`
Send a message in a conversation.

**Logic:**
1. Verify user is a member of the conversation
2. Validate user state (not suspended/banned)
3. INSERT into `messages` table
4. UPDATE `conversations.last_message_at`
5. Return the created message

#### `PATCH /api/v1/messages/:id`
Edit a message (only within 5 minutes of sending).

**Validation:**
- User must be the sender
- Message must be less than 5 minutes old (check `created_at`)
- Set `edited_at` to current timestamp

#### `DELETE /api/v1/messages/:id`
Soft-delete a message.

**Logic:**
- Only the sender can delete their message
- Set `is_deleted = true`
- Set `body = null` and clear `media_urls`

#### `POST /api/v1/conversations/:id/read`
Mark conversation as read up to a specific message.

**Logic:**
- Update `last_read_at` in `conversation_members` for the current user
- Optionally accept a `messageId` to mark read up to that specific message

#### `POST /api/v1/conversations/:id/members`
Add members to a group conversation.

**Restrictions:**
- Only for `group` or `community` type conversations
- Creator/original members can add (or any member — TBD)

#### `DELETE /api/v1/conversations/:id/members/:userId`
Remove a member or leave a conversation.

**Logic:**
- If user removes themselves, they leave the conversation
- If a user removes someone else, permission check required
- For DMs, deleting a member effectively deletes the conversation

### 3.4 Messaging Service — Key Queries

#### `getConversations(userId)`
```sql
SELECT
  c.id,
  c.type,
  c.name,
  c.avatar_url,
  c.last_message_at,
  c.created_at,
  -- Last message preview
  (SELECT jsonb_build_object(
    'id', m.id,
    'body', CASE WHEN m.is_deleted THEN '[deleted]' ELSE m.body END,
    'senderId', m.sender_id,
    'createdAt', m.created_at
   )
   FROM public.messages m
   WHERE m.conversation_id = c.id AND m.is_deleted = false
   ORDER BY m.created_at DESC
   LIMIT 1) as last_message,
  -- Unread count
  (SELECT COUNT(*)
   FROM public.messages m
   WHERE m.conversation_id = c.id
     AND m.created_at > COALESCE(cm.last_read_at, '1970-01-01')
     AND m.sender_id != :userId
     AND m.is_deleted = false) as unread_count,
  -- Member profiles
  (SELECT jsonb_agg(jsonb_build_object(
    'id', p.id,
    'displayName', p.display_name,
    'avatarUrl', p.avatar_url
   ))
   FROM public.conversation_members cm2
   JOIN public.profiles p ON p.id = cm2.user_id
   WHERE cm2.conversation_id = c.id) as members
FROM public.conversations c
JOIN public.conversation_members cm ON cm.conversation_id = c.id AND cm.user_id = :userId
ORDER BY c.last_message_at DESC NULLS LAST
```

#### `getMessages(conversationId, cursor?, limit)`
```sql
SELECT m.*, p.display_name, p.avatar_url
FROM public.messages m
JOIN public.profiles p ON p.id = m.sender_id
WHERE m.conversation_id = :conversationId
  AND (:cursor IS NULL OR m.created_at < :cursor)
  AND m.is_deleted = false
ORDER BY m.created_at DESC
LIMIT :limit
```

**Note:** Results are returned in descending order (newest first). The client reverses them for display.

---

## 4. Phase 2: Supabase Realtime Integration

### 4.1 Hook: `use-realtime-messages.ts`

```typescript
// apps/web/src/hooks/use-realtime-messages.ts

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeMessagesOptions {
  conversationId: string
  onMessage: (message: Message) => void
  onMessageUpdate?: (messageId: string, updates: Partial<Message>) => void
  onMessageDelete?: (messageId: string) => void
}

export function useRealtimeMessages({
  conversationId,
  onMessage,
  onMessageUpdate,
  onMessageDelete,
}: UseRealtimeMessagesOptions): void {
  useEffect(() => {
    if (!conversationId) return

    const supabase = createClient()
    const channelName = `messages:${conversationId}`

    const channel = supabase
      .channel(channelName)
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          onMessage(payload.new as Message)
        },
      )
      .on<{ id: string; body: string; edited_at: string }>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessageUpdate?.(payload.new.id, payload.new)
        },
      )
      .on<{ id: string; is_deleted: boolean }>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new.is_deleted) {
            onMessageDelete?.(payload.new.id)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, onMessage, onMessageUpdate, onMessageDelete])
}
```

### 4.2 Hook: `use-realtime-conversations.ts`

```typescript
// apps/web/src/hooks/use-realtime-conversations.ts

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseRealtimeConversationsOptions {
  userId: string
  onConversationUpdate: (conversationId: string) => void
  onNewMessage: (conversationId: string) => void
}

export function useRealtimeConversations({
  userId,
  onConversationUpdate,
  onNewMessage,
}: UseRealtimeConversationsOptions): void {
  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    // Subscribe to conversation updates for conversations the user is a member of
    const channel = supabase
      .channel('conversations:user')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          // Check if user is a member (will need to verify or use a filter)
          onConversationUpdate(payload.new.id)
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          // Can't filter by member here — handled in the service
        },
        (payload) => {
          // The ChatWindow's hook handles new messages for the active conversation.
          // This hook can notify the conversation list to re-fetch.
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, onConversationUpdate, onNewMessage])
}
```

**Note:** Realtime channel authorization uses the client's JWT session (anon key + RLS). The RLS policies on `messages` and `conversations` ensure users only receive events for conversations they're members of.

---

## 5. Phase 3: Frontend Data Integration

### 5.1 Update `ConversationList.tsx`

**Current state:** Uses hardcoded `CONVERSATIONS` array with mock data.

**Changes needed:**
1. Fetch conversations from `GET /api/v1/conversations` on mount (with JWT token)
2. Display real data: conversation name, last message preview, unread count, member avatars
3. Add loading skeleton state while fetching
4. Add error state with retry button
5. Subscribe to real-time updates to reorder list when new messages arrive
6. Wire search input to filter conversations

**New props/state:**
```typescript
interface ConversationListProps {
  activeTab: ChatTab
  onTabChange: (tab: ChatTab) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

// Internal state
interface ConversationListState {
  conversations: FetchedConversation[]
  loading: boolean
  error: string | null
  searchQuery: string
}
```

**Data fetching:**
```typescript
async function fetchConversations(): Promise<void> {
  setLoading(true)
  setError(null)
  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const res = await fetch(`${apiUrl}/api/v1/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const { data } = await res.json()
    setConversations(data)
  } catch {
    setError('Failed to load conversations')
  } finally {
    setLoading(false)
  }
}
```

### 5.2 Update `ChatWindow.tsx`

**Current state:** Uses hardcoded `MESSAGES` array, local state for sending.

**Changes needed:**
1. Fetch messages from `GET /api/v1/conversations/:id/messages` when `conversationId` changes
2. Implement cursor-based pagination for loading older messages (scroll up)
3. Send messages via `POST /api/v1/conversations/:id/messages`
4. Subscribe to real-time updates for the active conversation
5. Show message status indicators (sending → sent → delivered → read)
6. Handle loading states, empty states, error states
7. Scroll to bottom on new messages, maintain scroll position on older messages load
8. Replace mock conversation header data with real user profile data
9. Implement edit/delete actions via context menu (long press or right-click)

**Component state:**
```typescript
interface ChatWindowState {
  messages: Message[]
  loading: boolean
  error: string | null
  hasMore: boolean          // for infinite scroll
  cursor: string | null     // for pagination
  sending: boolean          // while message is being sent
  conversation: ConversationDetail | null
}
```

**Message grouping:**
Group messages by date with date separators (e.g., "Today", "Yesterday", "July 2, 2026").

**Optimistic updates:**
When sending a message, immediately add it to the UI with a "sending" state, then update with the server response.

### 5.3 New Component: `MessageBubble.tsx`

Extract message rendering into its own component for better maintainability:

```typescript
interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showSender: boolean          // show sender name/avatar for group chats
  senderName?: string
  senderAvatar?: string
  onEdit?: (messageId: string, newBody: string) => void
  onDelete?: (messageId: string) => void
}
```

Features:
- Rounded bubble with different styles for own vs. others' messages
- Sender name + avatar for group messages
- Timestamp on hover
- Edit indicator ("edited")
- Deleted message placeholder ("This message was deleted")
- Media attachments display (images, files)
- Context menu with Edit/Delete options

### 5.4 New Component: `MessageInput.tsx`

Extract the input bar into its own component:

```typescript
interface MessageInputProps {
  onSend: (body: string, mediaUrls?: string[]) => void
  disabled?: boolean
  placeholder?: string
}
```

Features:
- Auto-resizing textarea
- Enter to send, Shift+Enter for newline
- Attachment button with file picker
- Emoji picker integration
- Character count / limit indicator

### 5.5 New Component: `MessageStatus.tsx`

Show message delivery status:

```typescript
interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read'
}
```

Visual indicators:
- Sending: Spinner or clock icon
- Sent: Single checkmark ✓
- Delivered: Double checkmark ✓✓
- Read: Double checkmark with blue color ✓✓

---

## 6. Phase 4: New Conversation Flow

### 6.1 New Component: `NewConversationModal.tsx`

A modal/drawer for starting new conversations:

**UI:**
1. Tab switch: "New Message" (DM) / "New Group"
2. User search input with debounced API calls
3. Search results showing name, avatar, role, mutual connections
4. Selected recipients displayed as chips
5. Group name input (shown when 2+ recipients)
6. "Start Chat" / "Create Group" button

**Behavior:**
- Search users by name or username
- For DM: if conversation exists, navigate to it instead of creating new
- For group: create with all selected participants
- On success, navigate to the new conversation
- On error, show error message

### 6.2 User Search API

A new endpoint or reuse of an existing user search:

```
GET /api/v1/users/search?q=query&limit=10
```

Returns matching user profiles (exclude current user, respect privacy settings).

---

## 7. Phase 5: Cross-Page Linking

Wire messaging into other features so users can message each other from context:

| Page | Action | Target |
|------|--------|--------|
| **Network / People** | "Message" button on user cards | Opens DM with that user |
| **Profile** | "Message" button on user profiles | Opens DM with that user |
| **Adoption listings** | "Ask about this pet" | Opens DM with the organization/poster |
| **Breeding Match** | "Connect" button | Opens DM with the breeder |
| **Pet Care** | "Book Now" or "Message" | Opens DM with the provider |
| **Communities** | Community chat link | Opens community conversation |
| **Lost & Found** | "Contact finder" | Opens DM with the reporter |
| **Events** | "Message organizer" | Opens DM with event host |

Each of these should:
1. Check if a DM conversation already exists
2. If not, create one via the API
3. Navigate to `/messages` with the conversation selected

---

## 8. Phase 6: Polish & Edge Cases

### 8.1 Typing Indicators

- Publish typing events via Supabase Realtime (separate channel or broadcast)
- Show "[Name] is typing..." in the conversation header
- Auto-clear after 3 seconds of no typing activity

### 8.2 Message Reactions

Additional database table:
```sql
CREATE TABLE public.message_reactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
```

### 8.3 Media Uploads

- Upload via Supabase Storage with path: `{user_id}/chat/{conversation_id}/{filename}`
- File type/size validation on client and server
- Upload progress indicator in the input bar
- Image preview before sending
- Support for images, documents (PDF, DOC), voice notes

### 8.4 Message Search

- Full-text search across all user's conversations
- Use PostgreSQL `pg_trgm` extension (already installed)
- Search endpoint: `GET /api/v1/messages/search?q=query`

### 8.5 Push Notifications

- When a new message is sent and the recipient is not on the page:
  - Send push notification via service worker
  - Use Supabase Realtime presence to determine online status
  - Batch notifications for multiple messages

### 8.6 Additional Features

- **Conversation mute** — Mute notifications for a conversation
- **Block user** — Block all communication from a user
- **Report message** — Report inappropriate content
- **Pin conversation** — Pin important conversations to top
- **Archive conversation** — Hide from main list without deleting
- **Message forwarding** — Forward a message to another conversation
- **Voice messages** — Record and send voice notes
- **Read receipts** — Show read/delivered status per message

---

## 9. File Creation/Modification Summary

### 9.1 New Files

| # | File | Purpose |
|---|------|---------|
| 1 | `apps/api/src/modules/messaging/messaging.module.ts` | NestJS module |
| 2 | `apps/api/src/modules/messaging/messaging.controller.ts` | REST endpoints |
| 3 | `apps/api/src/modules/messaging/messaging.service.ts` | Business logic |
| 4 | `apps/api/src/modules/messaging/dto/create-conversation.dto.ts` | Create conversation validation |
| 5 | `apps/api/src/modules/messaging/dto/send-message.dto.ts` | Send message validation |
| 6 | `apps/api/src/modules/messaging/dto/get-messages-query.dto.ts` | Messages query params |
| 7 | `apps/api/src/modules/messaging/dto/update-message.dto.ts` | Edit message validation |
| 8 | `apps/api/src/modules/messaging/dto/add-members.dto.ts` | Add members validation |
| 9 | `apps/web/src/hooks/use-realtime-messages.ts` | Realtime message subscription |
| 10 | `apps/web/src/hooks/use-realtime-conversations.ts` | Realtime conversation updates |
| 11 | `apps/web/src/components/MessageBubble.tsx` | Individual message display |
| 12 | `apps/web/src/components/MessageInput.tsx` | Message input bar |
| 13 | `apps/web/src/components/MessageStatus.tsx` | Message status indicator |
| 14 | `apps/web/src/components/NewConversationModal.tsx` | Start new conversation |

### 9.2 Modified Files

| # | File | Changes |
|---|------|---------|
| 1 | `apps/api/src/app.module.ts` | Import `MessagingModule` |
| 2 | `apps/web/src/components/ConversationList.tsx` | Fetch real data, loading/error states, real-time updates |
| 3 | `apps/web/src/components/ChatWindow.tsx` | Fetch messages, send via API, real-time, pagination |
| 4 | `apps/web/src/app/messages/page.tsx` | Wire up state management, pass real data |
| 5 | `apps/web/src/hooks/use-auth.tsx` | Optionally expose the auth token for API calls |

---

## 10. Security Considerations

### 10.1 Authentication & Authorization

- All messaging endpoints require JWT authentication via `JwtAuthGuard`
- Every endpoint verifies the user is a member of the conversation before reading/sending
- The `CurrentUser` decorator extracts authenticated user info from the token

### 10.2 RLS Defense in Depth

- Even if the NestJS API has a bug, RLS on the database blocks unauthorized access
- Blocked/suspended users are prevented from sending messages at the DB level
- RLS policies on `messages`, `conversations`, and `conversation_members` provide defense in depth

### 10.3 Input Validation

- All request bodies validated with Zod schemas
- Message body length capped at 4000 characters
- Media URLs validated as proper URLs, max 5 per message
- Participant IDs validated as UUIDs

### 10.4 Rate Limiting

- Implement rate limiting on message sends (e.g., 30 messages per minute)
- Rate limiting on conversation creation (e.g., 10 new conversations per hour)

### 10.5 Content Safety

- Message body should pass through the profanity/safety pipeline
- Media uploads should be scanned for malicious content
- Report functionality for flagging inappropriate messages

---

## 11. Performance Considerations

### 11.1 Database Indexes

Already created:
- `messages_conv_id_idx` — Fast lookup by conversation
- `messages_created_at_idx` — Fast ordering for pagination
- `conv_members_user_id_idx` — Fast lookup of user's conversations

### 11.2 Cursor-Based Pagination

- Use `created_at` timestamps for cursor pagination (not `OFFSET`)
- This ensures consistent results even as new messages arrive
- Default limit of 50 messages per page

### 11.3 Query Optimization

- N+1 query prevention: Use JOINs to fetch member profiles with conversations
- Limit conversation list to most recent 50 conversations
- Unread count computed via subquery (already efficient with indexes)

### 11.4 Real-Time Efficiency

- Supabase Realtime channels are scoped per conversation
- Channel filters ensure only relevant events are received
- Clean up subscriptions when navigating away

---

## Implementation Order

```
Phase 1 ──── NestJS Backend API
  ├── Create MessagingModule with controller + service
  ├── Implement all REST endpoints
  ├── Wire into AppModule
  └── Test with curl/Postman

Phase 2 ──── Supabase Realtime Hooks
  ├── Create use-realtime-messages hook
  ├── Create use-realtime-conversations hook
  └── Test with browser DevTools

Phase 3 ──── Frontend Data Integration
  ├── Update ConversationList with real data
  ├── Update ChatWindow with real data
  ├── Add loading/error/empty states
  └── Wire real-time subscriptions

Phase 4 ──── New Conversation Flow
  ├── Create NewConversationModal
  ├── User search implementation
  └── Navigate to new conversation

Phase 5 ──── Cross-Page Linking
  ├── Add message buttons to Network/Profile
  ├── Connect adoption listings
  └── Wire breeding match and pet care

Phase 6 ──── Polish & Edge Cases
  ├── Typing indicators
  ├── Message reactions
  ├── Media uploads
  ├── Message search
  └── Push notifications
```
