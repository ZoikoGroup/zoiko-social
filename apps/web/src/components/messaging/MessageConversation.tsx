'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Send, Paperclip, Smile, Phone, Video, ArrowLeft, Info,
  Reply, Forward, Copy, Edit3, Trash2,
  X, Check, CheckCheck, Loader2, Clock, AlertCircle, Plus,
  MoreVertical, MoreHorizontal, Flag, UserMinus2,
  FileText, Eye, EyeOff,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SkeletonMessageList } from '@/components/Skeletons'
import { useToast } from '@/hooks/use-toast'
import { useMessaging } from '@/hooks/use-messaging'
import { usePresence } from '@/hooks/use-presence'
import { useAuth } from '@/hooks/use-auth'
import { getSocket } from '@/lib/socket'
import { getAuthToken } from '@/lib/auth'
import { EmptyState } from '@/components/messaging/EmptyState'
import { CallModal } from '@/components/messaging/CallModal'
import { ReactionPicker } from '@/components/messaging/ReactionPicker'
import type { MessageData, Conversation } from '@/hooks/use-messaging'
import type { Socket } from 'socket.io-client'

// ── Props ──────────────────────────────────────────────────────────────────

interface MessageConversationProps {
  conversationId: string | null
  onBack?: () => void
  conversation: Conversation | null | undefined
  onNewMessage: (() => void) | undefined
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍']

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function MessageConversation({
  conversationId,
  onBack,
  conversation,
  onNewMessage,
}: MessageConversationProps): React.JSX.Element {
  const { user, profile } = useAuth()
  const { markRead } = useMessaging()
  const { isUserTyping, subscribePresence, unsubscribePresence, getPresence } = usePresence()

  const [messages, setMessages] = useState<MessageData[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<MessageData | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [contextMenu, setContextMenu] = useState<{ message: MessageData; x: number; y: number } | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [pendingStatus, setPendingStatus] = useState<Record<string, 'sending' | 'failed'>>({})
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null)
  const [reactionPickerMsg, setReactionPickerMsg] = useState<{ messageId: string; x: number; y: number } | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [disappearMode, setDisappearMode] = useState<'none' | 'view_once' | 'view_twice'>('none')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wasTypingRef = useRef(false)

  const isDM = conversation?.type === 'dm'
  const otherParticipant = isDM ? conversation?.participants.find((p) => p.id !== user?.id) : null
  const displayName = conversation?.name ?? otherParticipant?.displayName ?? ''
  const avatarUrl = conversation?.avatarUrl ?? otherParticipant?.avatarUrl ?? null
  const isVerified = otherParticipant?.isVerified ?? false
  const otherUserId = otherParticipant?.id ?? null
  const handleCloseCall = useCallback(() => setCallType(null), [])
  const { success: toastSuccess, error: toastError } = useToast()

  // Connect socket
  useEffect(() => {
    let cancelled = false
    getSocket().then((s) => { if (!cancelled) setSocket(s) })
    return () => { cancelled = true }
  }, [])

  // Reset typing state on socket reconnect
  useEffect(() => {
    wasTypingRef.current = false
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [socket])

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !conversationId) return

    const handleNewMessage = (msg: MessageData) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        void markRead(conversationId, msg.id)
      }
    }

    const handleEditedMessage = (data: { messageId: string; conversationId: string; body: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId ? { ...m, body: data.body, editedAt: new Date().toISOString() } : m,
          ),
        )
      }
    }

    const handleDeletedMessage = (data: { messageId: string; conversationId: string; deletedForEveryone: boolean }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => prev.filter((m) => m.id !== data.messageId))
      }
    }

    const handleReaction = (data: { messageId: string; conversationId: string; userId: string; emoji: string; removed: boolean }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? {
                  ...m,
                  reactions: data.removed
                    ? m.reactions.filter((r) => !(r.userId === data.userId && r.emoji === data.emoji))
                    : [...m.reactions, { emoji: data.emoji, userId: data.userId }],
                }
              : m,
          ),
        )
      }
    }

    const handleMessageExpired = (data: { messageId: string; conversationId: string; viewCount: number }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, viewCount: data.viewCount }
              : m,
          ),
        )
      }
    }

    socket.on('message:new', handleNewMessage)
    socket.on('message:edited', handleEditedMessage)
    socket.on('message:deleted', handleDeletedMessage)
    socket.on('message:reaction', handleReaction)
    socket.on('message:expired', handleMessageExpired)

    // Join conversation room
    socket.emit('conversation:join', { conversationId })

    return () => {
      socket.off('message:new', handleNewMessage)
      socket.off('message:edited', handleEditedMessage)
      socket.off('message:deleted', handleDeletedMessage)
      socket.off('message:reaction', handleReaction)
      socket.off('message:expired', handleMessageExpired)
      socket.emit('conversation:leave', { conversationId })
    }
  }, [socket, conversationId, markRead])

  // Subscribe to presence for all participants
  useEffect(() => {
    if (!conversation?.participants) return
    const others = conversation.participants.filter((p) => p.id !== user?.id)
    for (const p of others) {
      subscribePresence(p.id)
    }
    return () => {
      for (const p of others) {
        unsubscribePresence(p.id)
      }
    }
  }, [conversation?.participants, user?.id, subscribePresence, unsubscribePresence])

  // Emit typing indicators
  useEffect(() => {
    if (!socket || !conversationId) return

    if (input.trim().length > 0 && !editingMessageId) {
      if (!wasTypingRef.current) {
        wasTypingRef.current = true
        socket.emit('typing:start', { conversationId })
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        wasTypingRef.current = false
        socket.emit('typing:stop', { conversationId })
      }, 1500)
    } else {
      if (wasTypingRef.current) {
        wasTypingRef.current = false
        socket.emit('typing:stop', { conversationId })
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [input, socket, conversationId, editingMessageId])

  const otherPresence = otherUserId ? getPresence(otherUserId) : null
  const isOnline = otherPresence?.isOnline ?? conversation?.isOnline ?? false

  // Typing indicator — use useMemo to stabilize the dependency for the useMemo below
  const typingUsers = useMemo(() =>
    conversationId && conversation?.participants
      ? conversation.participants
          .filter((p) => p.id !== user?.id && isUserTyping(p.id, conversationId))
          .map((p) => p.displayName)
      : [],
  [conversationId, conversation, user?.id, isUserTyping],
  )
  const someoneTyping = typingUsers.length > 0

  const typingText = isOnline
    ? 'Active now'
    : otherPresence?.lastSeen
      ? `Last seen ${formatLastSeen(otherPresence.lastSeen)}`
      : 'Offline'

  const typingLabel = useMemo(() => {
    if (typingUsers.length === 0) return ''
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing`
    if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing`
    return `${typingUsers.slice(0, 2).join(', ')}, and ${typingUsers.length - 2} other${typingUsers.length - 2 > 1 ? 's' : ''} are typing`
  }, [typingUsers])

  // Load messages via REST
  const fetchMessages = useCallback(async (cursor?: string): Promise<{ data: MessageData[]; nextCursor: string | null }> => {
    const token = await getAuthToken()
    const res = await fetch(
      `${API_URL}/api/v1/messaging/conversations/${conversationId}/messages${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) return { data: [], nextCursor: null }
    const json = await res.json()
    const data = json?.data ?? {}
    return { data: data.data ?? [], nextCursor: data.nextCursor ?? null }
  }, [conversationId])

  const loadMessages = useCallback(async () => {
    if (!conversationId) return
    setLoading(true)
    setMessagesError(null)
    try {
      const result = await fetchMessages()
      setMessages(result.data)
      setNextCursor(result.nextCursor)
      if (result.data.length > 0) {
        void markRead(conversationId, result.data[result.data.length - 1]?.id)
      }
    } catch {
      setMessagesError('Unable to load messages. The messaging server is not running.')
    }
    finally { setLoading(false) }
  }, [conversationId, fetchMessages, markRead])

  useEffect(() => {
    if (conversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadMessages()
    }
    // Reset reply/edit/info state when conversation changes
    const timer = setTimeout(() => {
      setReplyingTo(null)
      setEditingMessageId(null)
      setShowInfo(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [conversationId, loadMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Load more messages (infinite scroll)
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || !nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const result = await fetchMessages(nextCursor)
      setMessages((prev) => [...result.data, ...prev])
      setNextCursor(result.nextCursor)
    } catch { /* ignore */ }
    finally { setLoadingMore(false) }
  }, [conversationId, nextCursor, loadingMore, fetchMessages])

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || !nextCursor || loadingMore) return
    const { scrollTop } = messagesContainerRef.current
    if (scrollTop < 100) {
      void loadMoreMessages()
    }
  }, [nextCursor, loadingMore, loadMoreMessages])

  // Send message with optimistic update
  const sendMessage = useCallback(async (body: string, parentId: string | null, tempId: string) => {
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body, ...(parentId ? { parentId } : {}) }),
      })
      if (res.ok) {
        const json = await res.json()
        const realMsg = json?.data
        if (realMsg) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === realMsg.id)) {
              return prev.filter((m) => m.id !== tempId)
            }
            return prev.map((m) => (m.id === tempId ? realMsg : m))
          })
        }
        setPendingStatus((prev) => {
          const next = { ...prev }
          delete next[tempId]
          return next
        })
      } else {
        setPendingStatus((prev) => ({ ...prev, [tempId]: 'failed' }))
        toastError('Send failed', 'Message could not be sent. Tap "Failed" to retry.')
      }
    } catch {
      setPendingStatus((prev) => ({ ...prev, [tempId]: 'failed' }))
      toastError('Send failed', 'Network error — message could not be sent.')
    }
  }, [conversationId, toastError])

  const handleSend = useCallback(async () => {
    if (!conversationId || !input.trim()) return

    const body = input.trim()
    const parentId = replyingTo?.id ?? null
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const optimisticMsg: MessageData = {
      id: tempId,
      conversationId,
      sender: {
        id: user?.id ?? '',
        username: profile?.username ?? '',
        displayName: profile?.displayName ?? '',
        avatarUrl: profile?.avatarUrl ?? null,
      },
      type: 'text',
      body,
      mediaUrls: [],
      parentId,
      isDeleted: false,
      editedAt: null,
      reactions: [],
      receipt: null,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMsg])
    setPendingStatus((prev) => ({ ...prev, [tempId]: 'sending' }))
    setInput('')
    setDisappearMode('none')
    setReplyingTo(null)

    if (wasTypingRef.current) {
      wasTypingRef.current = false
      socket?.emit('typing:stop', { conversationId })
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    void sendMessage(body, parentId, tempId)
  }, [conversationId, input, replyingTo, user, profile, socket, sendMessage])

  const handleRetry = useCallback(async (tempId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== tempId))
    setPendingStatus((prev) => {
      const next = { ...prev }
      delete next[tempId]
      return next
    })
  }, [])

  const handleResend = useCallback((tempId: string) => {
    const failedMsg = messages.find((m) => m.id === tempId)
    if (failedMsg?.body) {
      setInput(failedMsg.body)
    }
    handleRetry(tempId)
    inputRef.current?.focus()
  }, [messages, handleRetry])

  // Edit message
  const handleEdit = useCallback(async () => {
    if (!editingMessageId || !editText.trim()) return
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/messages/${editingMessageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: editText.trim() }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error?.message ?? `Server error (${res.status})`)
      }
      setEditingMessageId(null)
      setEditText('')
      toastSuccess('Message edited')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not edit the message'
      toastError('Edit failed', msg)
    }
  }, [editingMessageId, editText, toastSuccess, toastError])

  // Delete message
  const handleDelete = useCallback(async (messageId: string, forEveryone = false) => {
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/messages/${messageId}${forEveryone ? '?forEveryone=true' : ''}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error?.message ?? `Server error (${res.status})`)
      }
      setContextMenu(null)
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
      toastSuccess(forEveryone ? 'Message deleted for everyone' : 'Message deleted')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not delete the message'
      toastError('Delete failed', msg)
    }
  }, [toastSuccess, toastError])

  // ── EMOJI REACTIONS ─────────────────────────────────────────────────────
  const handleReact = useCallback(async (messageId: string, emoji: string) => {
    // Save previous reactions for rollback
    let prevReactions: { emoji: string; userId: string }[] = []

    // Optimistic UI update — toggle reaction immediately
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          prevReactions = [...m.reactions]
          return {
            ...m,
            reactions: m.reactions.some((r) => r.userId === user?.id && r.emoji === emoji)
              ? m.reactions.filter((r) => !(r.userId === user?.id && r.emoji === emoji))
              : [...m.reactions, { emoji, userId: user?.id ?? '' }],
          }
        }
        return m
      }),
    )
    setContextMenu(null)

    // Fire API call in background
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      })
      if (!res.ok) throw new Error('API error')
    } catch {
      // Rollback optimistic update on failure
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions: prevReactions } : m)),
      )
      toastError('Reaction failed', 'Could not add reaction')
    }
  }, [toastError, user?.id])

  const isOwnMessage = (msg: MessageData) => msg.sender?.id === user?.id

  // ── FILE UPLOAD ──────────────────────────────────────────────────────────

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !conversationId) return

    const file = files[0]
    if (!file) return
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (file.size > maxSize) {
      toastError('File too large', 'Maximum file size is 100MB')
      return
    }

    // Validate video duration (< 5 minutes)
    if (file.type.startsWith('video/')) {
      const duration = await getVideoDuration(file)
      if (duration > 300) {
        toastError('Video too long', 'Videos must be under 5 minutes')
        return
      }
    }

    setUploadingFile(true)
    try {
      const token = await getAuthToken()

      // Get presigned upload URL
      const urlRes = await fetch(`${API_URL}/api/v1/messaging/upload/presigned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mimeType: file.type, fileName: file.name, fileSize: file.size }),
      })
      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => null)
        throw new Error(err?.error?.message ?? 'Failed to get upload URL')
      }

      const { url: uploadUrl, viewUrl, key, type } = await urlRes.json() as { url: string; viewUrl: string; key: string; type: string }

      // Upload file directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file as Blob,
        headers: { 'Content-Type': (file as Blob).type },
      })
      if (!uploadRes.ok) throw new Error('Upload failed')

      // Use the public view URL from R2
      const mediaUrl = viewUrl || key

      // Send message with media
      const msgRes = await fetch(`${API_URL}/api/v1/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          mediaUrls: [mediaUrl],
          body: input.trim() || undefined,
          disappearMode: type === 'image' || type === 'video' ? disappearMode : 'none',
        }),
      })

      if (msgRes.ok) {
        const json = await msgRes.json()
        const realMsg = json?.data ?? json
        if (realMsg) {
          setMessages((prev) => [...prev, realMsg])
        }
        setInput('')
        setDisappearMode('none')
      }
    } catch (err) {
      toastError('Upload failed', err instanceof Error ? err.message : 'Could not upload file')
    } finally {
      setUploadingFile(false)
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [conversationId, input, disappearMode, toastError])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (editingMessageId) {
        void handleEdit()
      } else {
        void handleSend()
      }
    }
    if (e.key === 'Escape') {
      setReplyingTo(null)
      setEditingMessageId(null)
    }
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!conversationId) {
    return <EmptyState onStartNewMessage={onNewMessage} />
  }

  // ── Chat header ─────────────────────────────────────────────────────────
  const renderHeader = () => (
    <div className="flex items-center gap-3 px-4 py-3 border-b bg-background flex-shrink-0">
      {onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="md:hidden size-9 rounded-lg"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4" />
        </Button>
      )}
      <div className="relative flex-shrink-0">
        <Avatar className="size-10">
          {avatarUrl ? (
            <AvatarImage alt={displayName} src={avatarUrl} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
          {isVerified && (
            <svg className="size-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </div>
        {someoneTyping ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-medium text-primary truncate max-w-[160px]">{typingLabel}</span>
            <div className="flex items-center gap-[3px] flex-shrink-0">
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
            </div>
          </div>
        ) : (
          <p className={cn('text-[11px] font-medium', isOnline ? 'text-green-600' : 'text-muted-foreground')}>
            {typingText}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
                onClick={() => setCallType('audio')}
                variant="ghost"
                size="icon"
                className="size-8 md:size-9 rounded-lg hidden sm:inline-flex"
                aria-label="Audio call"
              >
                <Phone className="size-3.5 md:size-4" />
              </Button>
              <Button
                onClick={() => setCallType('video')}
                variant="ghost"
                size="icon"
                className="size-8 md:size-9 rounded-lg hidden sm:inline-flex"
                aria-label="Video call"
              >
                <Video className="size-3.5 md:size-4" />
              </Button>
        <Button
          onClick={() => setShowInfo((s) => !s)}
          variant="ghost"
          size="icon"
          className={cn('size-9 rounded-lg', showInfo && 'bg-accent text-accent-foreground')}
          aria-label="Conversation info"
        >
          <Info className="size-4" />
        </Button>
        {/* User actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="User actions"
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl" align="end">
            <div className="flex flex-col gap-1">
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
              >
                <UserMinus2 className="size-4" />
                <span className="font-medium text-xs">Block User</span>
              </Button>
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4" />
                <span className="font-medium text-xs">Delete Conversation</span>
              </Button>
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-yellow-600 hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
              >
                <Flag className="size-4" />
                <span className="font-medium text-xs">Report User</span>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  // ── Message actions dropdown ────────────────────────────────────────────
  const renderMessageActions = (msg: MessageData, isMe: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Message actions"
          className="size-7 rounded-full bg-background hover:bg-accent shadow-sm border"
          size="icon"
          type="button"
          variant="ghost"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40 rounded-lg bg-popover p-1 shadow-xl">
        {/* React — available for all messages, opens reaction picker */}
        <DropdownMenuItem
          className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer"
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setReactionPickerMsg({ messageId: msg.id, x: rect.left, y: rect.top - 40 })
          }}
        >
          <Smile className="size-3.5" />
          <span>React</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer"
          onClick={() => { setReplyingTo(msg) }}
        >
          <Reply className="size-3.5" />
          <span>Reply</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer"
          onClick={() => {}}
        >
          <Forward className="size-3.5" />
          <span>Forward</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer"
          onClick={() => { void navigator.clipboard.writeText(msg.body ?? '') }}
        >
          <Copy className="size-3.5" />
          <span>Copy</span>
        </DropdownMenuItem>

        {isMe && (
          <DropdownMenuItem
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer"
            onClick={() => { setEditingMessageId(msg.id); setEditText(msg.body ?? '') }}
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {isMe && (
          <DropdownMenuItem
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-destructive cursor-pointer"
            onClick={() => void handleDelete(msg.id)}
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}

        {isMe && (
          <DropdownMenuItem
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-destructive cursor-pointer"
            onClick={() => void handleDelete(msg.id, true)}
          >
            <Trash2 className="size-3.5" />
            <span>Delete for everyone</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-yellow-600 cursor-pointer"
          onClick={() => {}}
        >
          <Flag className="size-3.5" />
          <span>Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // ── Render reactions for a message ──────────────────────────────────────
  const renderReactions = (msg: MessageData) => {
    if (!msg.reactions?.length) return null

    const grouped = msg.reactions.reduce<Record<string, { count: number; userIds: string[] }>>((acc, r) => {
      const existing = acc[r.emoji]
      if (existing) {
        existing.count += 1
        existing.userIds.push(r.userId)
      } else {
        acc[r.emoji] = { count: 1, userIds: [r.userId] }
      }
      return acc
    }, {})

    return (
      <div className="flex gap-0.5 flex-wrap px-1">
        {Object.entries(grouped).map(([emoji, { count, userIds }]) => {
          const names = userIds.map((uid) => {
            if (uid === user?.id) return 'You'
            const p = conversation?.participants.find((p) => p.id === uid)
            return p?.displayName ?? 'Unknown'
          })
          const tooltip =
            names.length === 1
              ? `${names[0]} reacted with ${emoji}`
              : names.length === 2
                ? `${names[0]} and ${names[1]} reacted with ${emoji}`
                : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]} reacted with ${emoji}`

          return (
            <button
              key={emoji}
              onClick={() => handleReact(msg.id, emoji)}
              className="text-xs bg-background rounded-full px-1.5 py-0.5 border shadow-sm hover:bg-accent transition-colors cursor-pointer"
              title={tooltip}
            >
              {emoji} {count > 1 ? count : ''}
            </button>
          )
        })}
      </div>
    )
  }

  // ── Inline reaction bar (hover) ─────────────────────────────────────────
  const renderReactionBar = (msg: MessageData, isMine: boolean, isPending: boolean) => {
    if (isPending) return null

    return (
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 z-10 hidden md:flex pointer-events-none',
        )}
      >
        <div className="flex items-center gap-0.5 bg-background/80 backdrop-blur-sm rounded-full shadow-lg border px-1.5 py-1 pointer-events-auto">
          {['❤️', '😂', '😮', '😢', '🙏', '👍'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => void handleReact(msg.id, emoji)}
              className={cn(
                'size-7 flex items-center justify-center rounded-full text-sm hover:bg-accent transition-colors cursor-pointer',
                msg.reactions?.some((r) => r.emoji === emoji && r.userId === user?.id) && 'scale-110',
              )}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={(e) => {
              setReactionPickerMsg({ messageId: msg.id, x: e.clientX, y: e.clientY })
            }}
            className="size-7 flex items-center justify-center rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="More reactions"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    )
  }

  // ── Render media (images, videos, documents) ──────────────────────────
  const renderMedia = (msg: MessageData) => {
    if (!msg.mediaUrls || msg.mediaUrls.length === 0) return null

    const isImage = msg.type === 'image' || msg.mediaUrls[0]?.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)
    const isVideo = msg.type === 'video'
    const isDocument = msg.type === 'document' || msg.type === 'file'

    // Disappearing media (view once / view twice)
    const isDisappearing = msg.disappearMode && msg.disappearMode !== 'none'
    const hasExpired = isDisappearing && msg.viewCount !== undefined && (
      (msg.disappearMode === 'view_once' && msg.viewCount >= 1) ||
      (msg.disappearMode === 'view_twice' && msg.viewCount >= 2)
    )

    if (hasExpired) {
      return (
        <div className="flex items-center gap-2 py-3 px-3 bg-muted rounded-lg">
          <EyeOff className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Media has expired</span>
        </div>
      )
    }

    return (
      <div className="-mx-4 -mt-2.5 mb-1 first:mt-0">
        {msg.mediaUrls.map((url, i) => {
          if (isImage) {
            return (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={msg.body ?? 'Shared image'}
                  className="w-full max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  loading="lazy"
                  onClick={() => window.open(url, '_blank')}
                />
                {isDisappearing && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                    {msg.disappearMode === 'view_once' ? 'View once' : 'View twice'}
                  </div>
                )}
              </div>
            )
          }
          if (isVideo) {
            return (
              <div key={i} className="relative">
                <video
                  src={url}
                  controls
                  className="w-full max-h-80"
                  preload="metadata"
                >
                  <track kind="captions" />
                </video>
                {isDisappearing && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                    {msg.disappearMode === 'view_once' ? 'View once' : 'View twice'}
                  </div>
                )}
              </div>
            )
          }
          if (isDocument) {
            const fileName = url.split('/').pop() ?? 'Document'
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-accent/50 hover:bg-accent transition-colors no-underline"
              >
                <FileText className="size-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">{fileName}</span>
              </a>
            )
          }
          return null
        })}
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <Card className="flex h-full w-full flex-col overflow-hidden shadow-none border-0 rounded-none md:border md:rounded-lg">
      {renderHeader()}

      <CardContent className="flex-1 p-0 overflow-hidden flex">
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Messages area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:px-4 space-y-1"
          >
            {loadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="size-4 text-primary animate-spin" />
              </div>
            )}

            {loading ? (
              <SkeletonMessageList />
            ) : messagesError ? (
              <div className="flex items-center justify-center h-full text-center px-8">
                <div>
                  <div className="size-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="size-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Server Offline</p>
                  <p className="text-xs text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
                    {messagesError}
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="size-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                    <Send className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Send a message to start the conversation</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null
                const showAvatar = !prevMsg || prevMsg.sender.id !== msg.sender.id
                const isMine = isOwnMessage(msg)

                const msgStatus = pendingStatus[msg.id]
                const isPending = msgStatus === 'sending'
                const isFailed = msgStatus === 'failed'

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex flex-col relative group/message',
                      isMine ? 'items-end' : 'items-start',
                      showAvatar ? 'mt-3' : 'mt-0.5',
                      !isPending && !isFailed && 'animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out',
                    )}
                  >
                    {/* Row: avatar + bubble + time */}
                    <div className={cn('flex gap-2 max-w-full', isMine ? 'flex-row-reverse' : 'flex-row')}>
                      {/* Avatar for others */}
                      {!isMine && (
                        <div className={cn('flex-shrink-0 self-end', showAvatar ? '' : 'invisible')}>
                          <Avatar className="size-8">
                            {msg.sender.avatarUrl ? (
                              <AvatarImage alt={msg.sender.displayName} src={msg.sender.avatarUrl} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {msg.sender.displayName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                      )}

                      <div className={cn('max-w-[85%] sm:max-w-[75%] md:max-w-[65%]', isMine ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
                        {/* Reply indicator */}
                        {msg.parentId && (
                          <button
                            onClick={() => document.getElementById(`msg-${msg.parentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            className="text-[10px] text-primary hover:underline px-1 text-left cursor-pointer"
                          >
                            Replying to a message
                          </button>
                        )}

                        {/* Message bubble */}
                        <div>
                          <div
                            id={`msg-${msg.id}`}
                            onDoubleClick={() => void handleReact(msg.id, '❤️')}
                            onTouchStart={(e) => {
                              const touch = e.currentTarget
                              const touchX = e.touches[0]?.clientX ?? 0
                              const touchY = e.touches[0]?.clientY ?? 0
                              touch.dataset.longPress = 'started'
                              touch.dataset.touchX = touchX.toString()
                              touch.dataset.touchY = touchY.toString()
                              touch.dataset.longPressTimer = setTimeout(() => {
                                if (touch.dataset.longPress === 'started') {
                                  touch.dataset.longPress = 'fired'
                                  setReactionPickerMsg({
                                    messageId: msg.id,
                                    x: Number(touch.dataset.touchX),
                                    y: Number(touch.dataset.touchY) - 40,
                                  })
                                }
                              }, 500).toString()
                            }}
                            onTouchEnd={(e) => {
                              const touch = e.currentTarget
                              if (touch.dataset.longPress !== 'fired') {
                                touch.dataset.longPress = 'cancelled'
                              }
                              if (touch.dataset.longPressTimer) {
                                clearTimeout(Number(touch.dataset.longPressTimer))
                                touch.dataset.longPressTimer = ''
                              }
                            }}
                            onTouchMove={(e) => {
                              const touch = e.currentTarget
                              touch.dataset.longPress = 'cancelled'
                              if (touch.dataset.longPressTimer) {
                                clearTimeout(Number(touch.dataset.longPressTimer))
                                touch.dataset.longPressTimer = ''
                              }
                            }}
                            onContextMenu={(e) => {
                              if (e.currentTarget.dataset.longPress === 'fired') {
                                e.currentTarget.dataset.longPress = ''
                                e.preventDefault()
                                return
                              }
                              e.preventDefault()
                              setContextMenu({ message: msg, x: e.clientX, y: e.clientY })
                            }}
                            className={cn(
                              'relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap select-none',
                              isMine
                                ? editingMessageId === msg.id
                                  ? 'bg-accent'
                                  : 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-accent text-foreground rounded-bl-sm',
                            )}
                          >
                            {editingMessageId === msg.id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  className="flex-1 bg-transparent text-foreground outline-none text-sm"
                                  autoFocus
                                />
                                <button onClick={() => { setEditingMessageId(null); setEditText('') }} className="text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0">
                                  <X className="size-3.5" />
                                </button>
                                <button onClick={handleEdit} className="text-primary hover:text-primary/80 cursor-pointer flex-shrink-0">
                                  <Check className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                {/* Media content */}
                                {renderMedia(msg)}

                                {msg.body && (
                                  <p className="mt-1">{msg.body}</p>
                                )}
                                {msg.editedAt && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Time + status */}
                        <div className={cn('flex items-center gap-1 px-1', isMine ? 'justify-end' : 'justify-start')}>
                          <span className="text-[10px] text-muted-foreground">{formatMessageTime(msg.createdAt)}</span>

                          {isMine && isPending && (
                            <Clock className="size-3 text-muted-foreground animate-pulse" />
                          )}
                          {isMine && isFailed && (
                            <button
                              onClick={() => handleResend(msg.id)}
                              className="flex items-center gap-0.5 text-[10px] text-destructive hover:text-destructive/80 font-semibold cursor-pointer"
                              title="Failed to send — click to retry"
                            >
                              <AlertCircle className="size-3" />
                              <span>Failed</span>
                            </button>
                          )}
                          {isMine && !isPending && !isFailed && msg.receipt && (
                            msg.receipt.status === 'read'
                              ? <CheckCheck className="size-3 text-blue-500" />
                              : <CheckCheck className="size-3 text-muted-foreground" />
                          )}
                          {isMine && !isPending && !isFailed && !msg.receipt && (
                            <Check className="size-3 text-muted-foreground" />
                          )}

                          {/* Message actions dropdown (mobile-friendly) */}
                          {!isPending && !isFailed && (
                            <div className="opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 md:hidden">
                              {renderMessageActions(msg, isMine)}
                            </div>
                          )}
                        </div>

                        {/* Desktop message actions (shown on hover) */}
                        {!isPending && !isFailed && (
                          <div className="hidden md:block opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 mt-0.5">
                            {renderMessageActions(msg, isMine)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reaction bar — centered in chat window */}
                    {renderReactionBar(msg, isMine, isPending)}

                    {/* Reactions at outer level — has full chat width, won't overflow */}
                    {renderReactions(msg)}
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 md:px-4 bg-background border-t flex-shrink-0">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-accent rounded-lg">
                <div className="w-0.5 h-8 bg-primary rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-primary">Replying to {replyingTo.sender.displayName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{replyingTo.body ?? 'Sent a message'}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-1.5 md:gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="icon"
                disabled={uploadingFile}
                className="size-8 md:size-9 rounded-lg flex-shrink-0 hidden sm:inline-flex"
                aria-label="Attach file"
              >
                {uploadingFile ? <Loader2 className="size-4 animate-spin" /> : <Paperclip className="size-5" />}
              </Button>

              {/* Disappear mode toggle for media messages */}
              {disappearMode !== 'none' && (
                <Button
                  onClick={() => setDisappearMode(disappearMode === 'view_once' ? 'view_twice' : 'none')}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 md:size-9 rounded-lg flex-shrink-0',
                    disappearMode === 'view_once' ? 'text-secondary' : 'text-destructive',
                  )}
                  aria-label={`Disappear mode: ${disappearMode}`}
                  title={`Disappear mode: ${disappearMode === 'view_once' ? 'View once' : 'View twice'}`}
                >
                  {disappearMode === 'view_once' ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </Button>
              )}

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={editingMessageId ? 'Edit message…' : replyingTo ? 'Reply…' : 'Type a message…'}
                  rows={1}
                  className="w-full px-3 md:px-4 py-2 bg-accent rounded-xl text-sm border border-transparent focus:border-primary focus:outline-none transition-colors resize-none min-h-[36px] max-h-[120px]"
                  maxLength={650}
                />
              </div>

              <Button
                onClick={() => setShowEmojiPicker((s) => !s)}
                variant="ghost"
                size="icon"
                className={cn('size-8 md:size-9 rounded-lg flex-shrink-0', showEmojiPicker && 'bg-accent text-accent-foreground')}
                aria-label="Toggle emoji picker"
              >
                <Smile className="size-5" />
              </Button>

              <Button
                onClick={() => editingMessageId ? void handleEdit() : void handleSend()}
                disabled={(!input.trim() && !editingMessageId) || uploadingFile}
                size="icon"
                className="size-9 md:size-10 rounded-xl flex-shrink-0"
                aria-label={editingMessageId ? 'Save edit' : 'Send message'}
              >
                {uploadingFile ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : editingMessageId ? (
                  <Check className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>

            {/* Disappear mode toggle row */}
            {!editingMessageId && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setDisappearMode(disappearMode === 'view_once' ? 'none' : 'view_once')}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer',
                    disappearMode === 'view_once'
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-muted-foreground hover:bg-accent',
                  )}
                >
                  <Eye className="size-3" />
                  View once
                </button>
                <button
                  onClick={() => setDisappearMode(disappearMode === 'view_twice' ? 'none' : 'view_twice')}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer',
                    disappearMode === 'view_twice'
                      ? 'bg-destructive/10 text-destructive'
                      : 'text-muted-foreground hover:bg-accent',
                  )}
                >
                  <EyeOff className="size-3" />
                  View twice
                </button>
              </div>
            )}

            {/* Quick emoji picker */}
            {showEmojiPicker && (
              <div className="flex gap-1.5 mt-3 p-2 bg-accent rounded-xl overflow-x-auto">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInput((prev) => prev + emoji)
                      setShowEmojiPicker(false)
                      inputRef.current?.focus()
                    }}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-lg cursor-pointer flex-shrink-0"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info panel (desktop sidebar) */}
        {showInfo && (
          <div className="w-72 flex-shrink-0 border-l bg-background overflow-y-auto hidden lg:block">
            <div className="p-5 flex flex-col items-center text-center border-b">
              <Avatar className="size-16">
                {avatarUrl ? (
                  <AvatarImage alt={displayName} src={avatarUrl} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-semibold text-lg text-foreground mt-3 truncate max-w-full">{displayName}</h3>
              {otherParticipant?.username && (
                <p className="text-sm text-muted-foreground mt-0.5">@{otherParticipant.username}</p>
              )}
              <p className={cn('text-xs font-medium mt-1', isOnline ? 'text-green-600' : 'text-muted-foreground')}>
                {isOnline ? 'Active now' : 'Offline'}
              </p>
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: 'Mute notifications' },
                { label: 'Block user' },
                { label: 'Report spam' },
                { label: 'Delete conversation', danger: true },
              ].map(({ label, danger }) => (
                <button
                  key={label}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer',
                    danger ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:bg-accent',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Call modal */}
      <CallModal
        open={callType !== null}
        type={callType ?? 'audio'}
        displayName={displayName}
        avatarUrl={avatarUrl}
        isVerified={isVerified}
        isOnline={isOnline}
        onClose={handleCloseCall}
      />

      {/* Reaction picker (full emoji selector) */}
      {reactionPickerMsg && (
        <ReactionPicker
          position={{ x: reactionPickerMsg.x, y: reactionPickerMsg.y }}
          onSelect={(emoji) => void handleReact(reactionPickerMsg.messageId, emoji)}
          onClose={() => setReactionPickerMsg(null)}
        />
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setContextMenu(null)}
        >
          <div
            className="absolute bg-popover rounded-xl shadow-2xl border py-1 min-w-[200px] overflow-hidden"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick reactions */}
            <div className="px-3 py-2 border-b">
              <div className="flex gap-1.5 items-center">
                {['❤️', '😂', '😮', '👍'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => void handleReact(contextMenu.message.id, emoji)}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-lg cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setReactionPickerMsg({ messageId: contextMenu.message.id, x: contextMenu.x, y: contextMenu.y })
                    setContextMenu(null)
                  }}
                  className="size-8 flex items-center justify-center rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors cursor-pointer font-semibold"
                  title="More reactions"
                >
                  +{QUICK_REACTIONS.length - 4}
                </button>
              </div>
            </div>

            {[
              { label: 'Reply', icon: Reply, action: () => { setReplyingTo(contextMenu.message); setContextMenu(null) } },
              { label: 'Forward', icon: Forward, action: () => setContextMenu(null) },
              { label: 'Copy', icon: Copy, action: () => { void navigator.clipboard.writeText(contextMenu.message.body ?? ''); setContextMenu(null) } },
              ...(isOwnMessage(contextMenu.message)
                ? [
                    { label: 'Edit', icon: Edit3, action: () => { setEditingMessageId(contextMenu.message.id); setEditText(contextMenu.message.body ?? ''); setContextMenu(null) } },
                    { label: 'Delete for me', icon: Trash2, action: () => void handleDelete(contextMenu.message.id) },
                    { label: 'Delete for everyone', icon: Trash2, action: () => void handleDelete(contextMenu.message.id, true), danger: true },
                  ]
                : []),
            ].map(({ label, icon: Icon, action, danger }: { label: string; icon: React.ComponentType<{ className?: string }>; action: () => void; danger?: boolean }) => (
              <button
                key={label}
                onClick={action}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer',
                  danger ? 'text-destructive hover:bg-destructive/10' : 'text-foreground hover:bg-accent',
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Validate video duration — returns duration in seconds. Rejects videos > 5 min. */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error('Could not read video metadata'))
    }
    video.src = URL.createObjectURL(file)
  })
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatLastSeen(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
