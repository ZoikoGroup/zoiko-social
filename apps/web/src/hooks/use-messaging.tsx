'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getSocket } from '@/lib/socket'
import { getAuthToken } from '@/lib/auth'
import { playMessageSound } from '@/lib/notification-sound'
import { useToast } from '@/hooks/use-toast'
import type { Socket } from 'socket.io-client'

// Module-level map to store socket cleanup functions without relying on `any` casts
const socketCleanups = new Map<Socket, () => void>()

// ── Types ───────────────────────────────────────────────────────────────────

export interface ConversationParticipant {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

export interface LastMessage {
  body: string | null
  senderId: string
  createdAt: string
}

export interface Conversation {
  id: string
  type: string
  name: string | null
  avatarUrl: string | null
  /** Shared chat theme id (see lib/chat-themes.ts); null = default. */
  theme?: string | null
  lastMessage: LastMessage | null
  unreadCount: number
  isOnline: boolean
  lastSeen: string | null
  participants: ConversationParticipant[]
  isMuted: boolean
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageData {
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
  /** WhatsApp-style snippet of the replied-to message (null if not a reply). */
  parent?: {
    id: string
    body: string | null
    type: string
    isDeleted: boolean
    senderId: string
    senderName: string
  } | null
  isDeleted: boolean
  editedAt: string | null
  reactions: { emoji: string; userId: string }[]
  receipt: { status: string; readAt: string | null } | null
  disappearMode?: 'none' | 'view_once' | 'view_twice'
  viewCount?: number
  createdAt: string
}

export interface Suggestion {
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

export interface GroupInvite {
  groupId: string
  conversationId: string
  name: string | null
  description: string | null
  memberCount: number
  invitedBy: { id: string; username: string; displayName: string; avatarUrl: string | null } | null
  createdAt: string
}

// ── Context ─────────────────────────────────────────────────────────────────

interface MessagingContextValue {
  conversations: Conversation[]
  unreadCount: number
  isLoadingConversations: boolean
  conversationsError: string | null
  retryFetchConversations: () => Promise<void>
  /** Open or create a conversation with a user — returns the conversation ID */
  openConversation: (userId: string, initialMessage?: string) => Promise<string | null>
  /** Create a group conversation — returns the new conversation ID (null on failure) */
  createGroup: (input: { name: string; participantIds: string[]; description?: string }) => Promise<string | null>
  /** Pending group invitations addressed to the current user */
  groupInvites: GroupInvite[]
  refreshGroupInvites: () => Promise<void>
  /** Accept a group invite — returns the conversation ID to open (null on failure) */
  acceptGroupInvite: (groupId: string) => Promise<string | null>
  /** Decline a group invite */
  rejectGroupInvite: (groupId: string) => Promise<void>
  /** Set active conversation ID */
  activeConversationId: string | null
  setActiveConversationId: (id: string | null) => void
  /** Send a message in the active conversation */
  sendMessage: (body: string) => Promise<void>
  /** Get messages for a conversation */
  getMessages: (conversationId: string, cursor?: string) => Promise<MessageData[]>
  /** Get suggestions for new conversations */
  suggestions: Suggestion[]
  refreshSuggestions: () => Promise<void>
  /** Mark a conversation as read */
  markRead: (conversationId: string, messageId?: string) => Promise<void>
  /** Mark all conversations as read */
  markAllRead: () => Promise<void>
}

const MessagingContext = createContext<MessagingContextValue | undefined>(undefined)

// ── Provider ────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function MessagingProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { isAuthenticated, user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [conversationsError, setConversationsError] = useState<string | null>(null)

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  const { warning: toastWarning, success: toastSuccess } = useToast()
  const wasOfflineRef = useRef(false)
  // Live mirror of the open conversation for use inside the stable socket
  // handler below. Previously a plain object was created inside that effect
  // (deps: [isAuthenticated, ...]), so it froze at the initial value (null) and
  // the "don't increment the conversation I'm viewing" guard never matched.
  const activeConvIdRef = useRef<string | null>(activeConversationId)
  useEffect(() => {
    activeConvIdRef.current = activeConversationId
  }, [activeConversationId])
  // Stable handle to the latest group-invites fetcher, so the long-lived socket
  // effect can trigger a refresh without re-subscribing on every render.
  const fetchGroupInvitesRef = useRef<(() => Promise<void>) | null>(null)

  // ── Fetch conversations (defined FIRST so it's available everywhere) ──

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return
    setConversationsError(null)
    setIsLoadingConversations(true)
    try {
      const token = await getAuthToken()
      if (!token) {
        setConversationsError('Not signed in — auth token not available')
        return
      }
      const res = await fetch(`${API_URL}/api/v1/messaging/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        const raw = json?.data?.data ?? json?.data ?? []
        // Normalize at the boundary: a conversation must always carry an array of
        // participants, otherwise list rendering (search filter, avatar/name
        // derivation) hits `.some`/`.find` on undefined and the whole Messages
        // view crashes. Belt-and-suspenders against any partial API payload.
        const list = Array.isArray(raw)
          ? raw.map((c: Conversation) => ({ ...c, participants: Array.isArray(c.participants) ? c.participants : [] }))
          : []
        setConversations(list)
        setConversationsError(null)
      } else {
        const body = await res.json().catch(() => null)
        const msg = body?.error?.message ?? body?.message ?? `Server error (${res.status})`
        console.error('[messaging] fetchConversations failed:', res.status, msg)
        setConversationsError(msg)
      }
    } catch (err) {
      console.error('[messaging] fetchConversations network error:', err)
      setConversationsError('Network error — unable to reach the server')
    } finally {
      setIsLoadingConversations(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchConversations()
  }, [isAuthenticated, fetchConversations])

  // ── Connect Socket.IO ───────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        if (!cancelled) {
          setSocket(null)
          setConversations([])
        }
      }, 0)
      return () => { cancelled = true; clearTimeout(timer) }
    }

    getSocket().then((s) => {
      if (cancelled || !s) return
      setSocket(s)

      // Live conversation-list updates (unread badge + last-message preview).
      // Driven by `conversation:activity` on the always-joined user room —
      // `message:new` only reaches the conversation room, which this list
      // provider never joins, so background chats never updated live before.
      const onConversationActivity = (data: {
        conversationId: string
        senderId: string
        body: string | null
        createdAt: string
      }) => {
        if (data.senderId === user?.id) return // our own message — the open thread handles it
        if (typeof document !== 'undefined' && document.hidden) {
          playMessageSound()
        }

        setConversations((prev) => {
          const existing = prev.find((c) => c.id === data.conversationId)
          if (!existing) {
            // First message in a conversation we haven't loaded yet (e.g. someone
            // messages us in a brand-new thread). Pull it in so the unread badge
            // updates live instead of only after a page reload.
            void fetchConversations()
            return prev
          }
          return prev.map((c) =>
            c.id === data.conversationId
              ? {
                  ...c,
                  lastMessage: {
                    body: data.body,
                    senderId: data.senderId,
                    createdAt: data.createdAt,
                  },
                  unreadCount:
                    data.conversationId === activeConvIdRef.current
                      ? 0
                      : c.unreadCount + 1,
                }
              : c,
          )
        })
      }

      // Listen for connection state changes
      const onDisconnect = () => {
        if (!wasOfflineRef.current) {
          wasOfflineRef.current = true
          toastWarning('You\'re offline', 'Trying to reconnect\u2026')
        }
      }

      const onConnect = () => {
        if (wasOfflineRef.current) {
          wasOfflineRef.current = false
          toastSuccess('Connected', 'Back online')
        }
      }

      const onNewConversation = () => { void fetchConversations() }
      const onRequestAccepted = () => { void fetchConversations() }
      // A group we were added to (as owner on create, or invitee) — pull it into
      // the list live instead of only on next reload.
      const onGroupEvent = () => { void fetchConversations() }
      // A pending group invitation arrived — refresh the invites list live and
      // let the user know (they act on it from the alerts / Messages surfaces).
      const onGroupInvited = (data: { groupName?: string | null }) => {
        void fetchGroupInvitesRef.current?.()
        toastSuccess('Group invitation', data?.groupName ? `You were invited to "${data.groupName}"` : 'You have a new group invitation')
      }

      s.on('conversation:activity', onConversationActivity)
      s.on('disconnect', onDisconnect)
      s.on('connect', onConnect)
      s.on('conversation:new', onNewConversation)
      s.on('message_request:accepted', onRequestAccepted)
      s.on('group:created', onGroupEvent)
      s.on('group:added', onGroupEvent)
      s.on('group:invited', onGroupInvited)

      // Store off functions for cleanup
      socketCleanups.set(s, () => {
        s.off('conversation:activity', onConversationActivity)
        s.off('disconnect', onDisconnect)
        s.off('connect', onConnect)
        s.off('conversation:new', onNewConversation)
        s.off('message_request:accepted', onRequestAccepted)
        s.off('group:created', onGroupEvent)
        s.off('group:added', onGroupEvent)
        s.off('group:invited', onGroupInvited)
      })
    })

    return () => {
      cancelled = true
      wasOfflineRef.current = false
      // Clean up socket listeners if they were registered
      getSocket().then((s) => {
        if (s) {
          const cleanup = socketCleanups.get(s)
          cleanup?.()
          socketCleanups.delete(s)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, toastWarning, toastSuccess])

  // ── Fetch suggestions ───────────────────────────────────────────────────

  const refreshSuggestions = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/suggestions?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setSuggestions(json?.data ?? [])
      }
    } catch { /* ignore */ }
  }, [isAuthenticated])

  // ── Actions ─────────────────────────────────────────────────────────────

  const openConversation = useCallback(async (userId: string, initialMessage?: string): Promise<string | null> => {
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participantId: userId, initialMessage }),
      })
      const json = await res.json()
      if (res.ok) {
        const convId = json?.data?.id ?? json?.id
        if (convId) {
          void fetchConversations()
          setActiveConversationId(convId)
          return convId
        }
      }
      // Handle 403 errors
      if (res.status === 403) {
        if (json?.error?.code === 'FOLLOW_REQUIRED') {
          toastWarning('Follow required', json?.error?.message ?? 'You need to follow this user before sending them a message')
          return null
        }
        if (json?.error?.code === 'MESSAGE_REQUEST_REQUIRED') {
          return null
        }
        if (json?.error?.code === 'CANNOT_MESSAGE') {
          toastWarning('Cannot message', json?.error?.message ?? 'You cannot message this user')
          return null
        }
      }
      return null
    } catch {
      return null
    }
  }, [fetchConversations, toastWarning])

  const createGroup = useCallback(async (input: { name: string; participantIds: string[]; description?: string }): Promise<string | null> => {
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        const data = json?.data ?? json
        const convId = data?.conversationId ?? null
        const invited = Number(data?.invitedCount ?? 0)
        void fetchConversations()
        if (convId) setActiveConversationId(convId)
        if (invited > 0) {
          toastSuccess(
            'Group created',
            `${invited} invitation${invited === 1 ? '' : 's'} sent — they'll join once they accept.`,
          )
        }
        return convId
      }
      const msg = json?.error?.message ?? json?.message ?? `Server error (${res.status})`
      toastWarning('Could not create group', msg)
      return null
    } catch {
      toastWarning('Could not create group', 'Network error — please try again')
      return null
    }
  }, [fetchConversations, toastWarning, toastSuccess])

  const refreshGroupInvites = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/groups/invites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setGroupInvites(json?.data ?? json ?? [])
      }
    } catch { /* ignore */ }
  }, [isAuthenticated])

  const acceptGroupInvite = useCallback(async (groupId: string): Promise<string | null> => {
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/groups/${groupId}/invites/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        setGroupInvites((prev) => prev.filter((i) => i.groupId !== groupId))
        void fetchConversations()
        const convId = json?.data?.conversationId ?? json?.conversationId ?? null
        return convId
      }
      toastWarning('Could not join group', json?.error?.message ?? json?.message ?? 'Please try again')
      return null
    } catch {
      toastWarning('Could not join group', 'Network error — please try again')
      return null
    }
  }, [fetchConversations, toastWarning])

  const rejectGroupInvite = useCallback(async (groupId: string): Promise<void> => {
    // Optimistically remove; restore on failure.
    const prev = groupInvites
    setGroupInvites((cur) => cur.filter((i) => i.groupId !== groupId))
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/groups/${groupId}/invites/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) setGroupInvites(prev)
    } catch {
      setGroupInvites(prev)
    }
  }, [groupInvites])

  const sendMessageFn = useCallback(async (body: string) => {
    if (!activeConversationId || !body.trim()) return
    try {
      const token = await getAuthToken()
      await fetch(`${API_URL}/api/v1/messaging/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: body.trim() }),
      })
    } catch { /* socket will catch it */ }
  }, [activeConversationId])

  const getMessagesFn = useCallback(async (conversationId: string, cursor?: string): Promise<MessageData[]> => {
    try {
      const token = await getAuthToken()
      const url = `${API_URL}/api/v1/messaging/conversations/${conversationId}/messages${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      // Response is double-wrapped: interceptor {success,data} around the
      // service's {data,nextCursor,hasMore}. The messages array is data.data.
      const list = json?.data?.data ?? []
      // Guarantee array fields exist — realtime reaction handlers do
      // `m.reactions.some(...)` unguarded, so a message without `reactions`
      // would crash the thread on the next reaction event.
      return Array.isArray(list)
        ? list.map((m: MessageData) => ({
            ...m,
            reactions: Array.isArray(m.reactions) ? m.reactions : [],
            mediaUrls: Array.isArray(m.mediaUrls) ? m.mediaUrls : [],
          }))
        : []
    } catch {
      return []
    }
  }, [])

  const markRead = useCallback(async (conversationId: string, messageId?: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    )
    socket?.emit('messages:read', { conversationId, messageId })
    try {
      const token = await getAuthToken()
      await fetch(`${API_URL}/api/v1/messaging/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ lastReadMessageId: messageId }),
      })
    } catch { /* ignore */ }
  }, [socket])

  const markAllRead = useCallback(async () => {
    // Optimistically clear all unread counts locally
    setConversations((prev) =>
      prev.map((c) => ({ ...c, unreadCount: 0 })),
    )
    try {
      const token = await getAuthToken()
      await fetch(`${API_URL}/api/v1/messaging/conversations/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch { /* ignore — local state already cleared */ }
  }, [])

  // Keep the socket-effect's ref pointing at the latest fetcher, and pull the
  // pending invites once on auth.
  useEffect(() => {
    fetchGroupInvitesRef.current = refreshGroupInvites
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) void refreshGroupInvites()
  }, [isAuthenticated, refreshGroupInvites])

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        unreadCount,
        isLoadingConversations,
        conversationsError,
        retryFetchConversations: fetchConversations,
        openConversation,
        createGroup,
        groupInvites,
        refreshGroupInvites,
        acceptGroupInvite,
        rejectGroupInvite,
        activeConversationId,
        setActiveConversationId,
        sendMessage: sendMessageFn,
        getMessages: getMessagesFn,
        suggestions,
        refreshSuggestions,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging(): MessagingContextValue {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}
