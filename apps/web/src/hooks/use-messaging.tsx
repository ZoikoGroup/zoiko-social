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

// ── Context ─────────────────────────────────────────────────────────────────

interface MessagingContextValue {
  conversations: Conversation[]
  unreadCount: number
  isLoadingConversations: boolean
  conversationsError: string | null
  retryFetchConversations: () => Promise<void>
  /** Open or create a conversation with a user — returns the conversation ID */
  openConversation: (userId: string, initialMessage?: string) => Promise<string | null>
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
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [conversationsError, setConversationsError] = useState<string | null>(null)

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  const { warning: toastWarning, success: toastSuccess } = useToast()
  const wasOfflineRef = useRef(false)

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
        setConversations(json?.data?.data ?? json?.data ?? [])
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
    const activeConvIdRef = { current: activeConversationId }

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

      // Listen for new messages
      const onNewMessage = (message: MessageData) => {
        // Play notification sound if tab is not focused and message is from someone else
        if (
          typeof document !== 'undefined' &&
          document.hidden &&
          message.sender.id !== user?.id
        ) {
          playMessageSound()
        }

        setConversations((prev) => {
          const existing = prev.find((c) => c.id === message.conversationId)
          if (existing) {
            return prev.map((c) =>
              c.id === message.conversationId
                ? {
                    ...c,
                    lastMessage: {
                      body: message.body,
                      senderId: message.sender.id,
                      createdAt: message.createdAt,
                    },
                    unreadCount:
                      message.conversationId === activeConvIdRef.current
                        ? 0
                        : c.unreadCount + 1,
                  }
                : c,
            )
          }
          return prev
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

      s.on('message:new', onNewMessage)
      s.on('disconnect', onDisconnect)
      s.on('connect', onConnect)
      s.on('conversation:new', onNewConversation)
      s.on('message_request:accepted', onRequestAccepted)

      // Store off functions for cleanup
      socketCleanups.set(s, () => {
        s.off('message:new', onNewMessage)
        s.off('disconnect', onDisconnect)
        s.off('connect', onConnect)
        s.off('conversation:new', onNewConversation)
        s.off('message_request:accepted', onRequestAccepted)
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
      return json?.data ?? []
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

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        unreadCount,
        isLoadingConversations,
        conversationsError,
        retryFetchConversations: fetchConversations,
        openConversation,
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
