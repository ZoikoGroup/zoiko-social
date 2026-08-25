'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Send, Smile, Phone, Video, ArrowLeft, Info,
  Reply, Forward, Copy, Edit3, Trash2,
  X, Check, CheckCheck, Loader2, Clock, AlertCircle, Plus,
  MoreVertical, MoreHorizontal, Flag, UserMinus2, UserCheck2, VolumeX, Volume2,
  FileText, EyeOff, Palette, LogOut, Pin, ShieldAlert,
  MapPin, BarChart2, Image as ImageIcon, ChevronDown,
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
import { useDateFormat } from '@/hooks/use-date-format'
import { cn } from '@/lib/utils'
import { SkeletonMessageList } from '@/components/Skeletons'
import { useToast } from '@/hooks/use-toast'
import { useMessaging } from '@/hooks/use-messaging'
import { usePresence } from '@/hooks/use-presence'
import { messagingApi } from '@/lib/messaging-api'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import {
  useCommunityChat,
  CommunityHeaderInfo,
  CommunityPinnedBar,
  CommunityComposerLock,
  CommunityMembersSheet,
  CommunityChatSettings,
} from './CommunityChat'
import { isAiAssistant } from '@/lib/ai-assistant'
import { getSocket } from '@/lib/socket'
import { getAuthToken } from '@/lib/auth'
import { compressImage } from '@/lib/image'
import { moderationApi, networkApi, profileApi, type Relationship } from '@/lib/api'
import { EmptyState } from '@/components/messaging/EmptyState'
import { ReactionPicker } from '@/components/messaging/ReactionPicker'
import { SharedPostPreview } from '@/components/messaging/SharedPostPreview'
import { LocationBubble, PollBubble, locationFrom } from './MessageAttachments'
import { ForwardModal } from './ForwardModal'
import { ReportContentModal } from '@/components/ReportContentModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PollCreatorModal } from './PollCreatorModal'
import { LocationPickerModal } from './LocationPickerModal'
import { useCall } from '@/hooks/use-call'
import { CHAT_THEMES, getChatTheme } from '@/lib/chat-themes'
import type { MessageData, Conversation } from '@/hooks/use-messaging'
import type { Socket } from 'socket.io-client'
import { formatDateTime } from '@/lib/datetime'
import { useTranslations } from 'next-intl'

// ── Props ──────────────────────────────────────────────────────────────────

interface MessageConversationProps {
  conversationId: string | null
  onBack?: () => void
  conversation: Conversation | null | undefined
  onNewMessage: (() => void) | undefined
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍']

const API_URL = process.env.NEXT_PUBLIC_API_URL


/**
 * Makes the chat header's avatar and name open something.
 *
 * A direct message goes to the other person's profile. A group has no single
 * profile, so it opens the details panel — the same place its member list and
 * settings live, which is where tapping a group name leads elsewhere too.
 *
 * Rendered as a plain wrapper when there is nowhere to go: the assistant has a
 * profile like anyone else, but a conversation whose participant has not loaded
 * yet must not be a dead link that looks live.
 */

/**
 * Wraps anything that identifies a person so that tapping it opens their profile.
 *
 * Falls back to a plain span when there is no username — a participant that has
 * not loaded yet must not become a link that goes nowhere. Kept as one component
 * so the avatar in a group message, the chat header and the details panel cannot
 * drift apart in whether they are tappable.
 */
function IdentityLink({
  username,
  className,
  children,
}: {
  username: string | undefined
  className?: string
  children: React.ReactNode
}): React.JSX.Element {
  if (!username) return <span className={className}>{children}</span>
  return (
    <Link
      href={`/profile/${username}`}
      className={cn(className, 'cursor-pointer hover:opacity-80 transition-opacity')}
      aria-label={`View @${username}`}
    >
      {children}
    </Link>
  )
}

function HeaderIdentity({
  username,
  isGroup,
  onShowInfo,
  children,
}: {
  /* Not optional-with-`?`: it is always passed, and may be undefined while the
     participant loads. Under exactOptionalPropertyTypes those are different
     things, and the build rejects the second for the first. */
  username: string | undefined
  isGroup: boolean
  onShowInfo: () => void
  children: React.ReactNode
}): React.JSX.Element {
  // -mx/px pairs keep the tap target generous without shifting the layout the
  // header already had.
  const shared =
    'flex items-center gap-2.5 md:gap-3 flex-1 min-w-0 rounded-lg -mx-1 px-1 py-0.5 hover:bg-surface-container/60 transition-colors text-left cursor-pointer'

  if (isGroup) {
    return (
      <div 
        role="button"
        tabIndex={0}
        onClick={onShowInfo} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onShowInfo() }}
        className={shared} 
        aria-label="Group details"
      >
        {children}
      </div>
    )
  }

  if (!username) {
    return <div className="flex items-center gap-2.5 md:gap-3 flex-1 min-w-0">{children}</div>
  }

  return (
    <Link href={`/profile/${username}`} className={shared} aria-label={`View @${username}`}>
      {children}
    </Link>
  )
}

/**
 * How far the thread slides to uncover the times. Wide enough for "10:32 PM" at
 * the smallest size the label is drawn, and no wider — the gesture should feel
 * like a peek rather than a page.
 */
const TIME_REVEAL_PX = 76

/**
 * How long a mouse button is held before the time appears. Long enough not to
 * fire while someone is clicking or double-clicking to react, short enough that
 * holding does not feel like waiting.
 */
const HOLD_TO_SEE_TIME_MS = 400

export function MessageConversation({
  conversationId,
  onBack,
  conversation,
  onNewMessage,
}: MessageConversationProps): React.JSX.Element {
  const tmsg = useTranslations('messaging')
  const { locale } = useDateFormat()
  const { user, profile } = useAuth()
  const { conversations, markRead, retryFetchConversations, setActiveConversationId } = useMessaging()
  const { isUserTyping, subscribePresence, unsubscribePresence, getPresence } = usePresence()

  const [messages, setMessages] = useState<MessageData[]>([])
  const [leavingGroup, setLeavingGroup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<MessageData | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showPollModal, setShowPollModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ message: MessageData; x: number; y: number } | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [pendingStatus, setPendingStatus] = useState<Record<string, 'sending' | 'failed'>>({})
  const [reactionPickerMsg, setReactionPickerMsg] = useState<{ messageId: string; x: number; y: number } | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [disappearMode, setDisappearMode] = useState<'none' | 'view_once' | 'view_twice'>('none')
  const [themeId, setThemeId] = useState<string | null>(conversation?.theme ?? null)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  // Chat-panel element held in state (via callback ref) so popovers can be
  // constrained to it without reading a ref value during render.
  const [conversationEl, setConversationEl] = useState<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wasTypingRef = useRef(false)

  const isDM = conversation?.type === 'dm'
  const otherParticipant = isDM ? conversation?.participants?.find((p) => p.id !== user?.id) : null
  const displayName = conversation?.name ?? otherParticipant?.displayName ?? ''
  const avatarUrl = conversation?.avatarUrl ?? otherParticipant?.avatarUrl ?? null
  const isVerified = otherParticipant?.isVerified ?? false
  const otherUserId = otherParticipant?.id ?? null

  // The assistant has no ears and no camera, so calling it is not a thing that can
  // happen. Hiding the buttons is the honest version of that — a call that connects
  // to silence, or an invite nothing ever answers, is worse than no button at all.
  const isCommunity = conversation?.type === 'community'
  const communityInfo = conversation?.community ?? null
  const isAiChat = isDM && isAiAssistant(otherParticipant?.username)
  const activeTheme = getChatTheme(themeId)
  const { success: toastSuccess, error: toastError } = useToast()
  const { startCall } = useCall()
  const {
    access: communityAccess,
    pinned: pinnedMessage,
    refresh: refreshCommunityAccess,
    setAccess: setCommunityAccess,
    setPinned: setPinnedMessage,
  } = useCommunityChat(conversationId, isCommunity)
  const [showCommunityMembers, setShowCommunityMembers] = useState(false)
  /** The message currently flashing because someone jumped to it. */
  const [flashMessageId, setFlashMessageId] = useState<string | null>(null)
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Messages that arrived while the reader was scrolled up. */
  const [unseenCount, setUnseenCount] = useState(0)
  /** The message being forwarded, while the picker is open. */
  const [forwardingMessage, setForwardingMessage] = useState<MessageData | null>(null)

  // Block/mute/report state for the other DM participant.
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [reportUserOpen, setReportUserOpen] = useState(false)
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false)

  /*
   * Swipe left to read the time on every message.
   *
   * A message carries a small label already, but it only shows a clock for today —
   * anything older reads "Aug 21", so the time of an older message was simply not
   * available. Rather than crowd every bubble with one, the times sit just off the
   * right edge and the whole column slides over to uncover them, which is the
   * gesture people already know from Instagram and WhatsApp.
   *
   * Kept in a ref as well as state: the touch handlers need the current offset
   * without re-subscribing on every frame.
   */
  const [timeReveal, setTimeReveal] = useState(0)

  /*
   * Press and hold a message to read its time — the mouse equivalent of the swipe.
   *
   * A swipe is a touch gesture and does nothing with a mouse, so on a laptop there
   * was no way to reach the time at all. Long press is free here: touch already
   * uses it for the message menu, but a mouse opens that with right-click, so
   * holding the button has no meaning yet.
   *
   * Shown while held and gone on release. Nothing to dismiss, and no state left
   * behind if the pointer leaves the window mid-press.
   */
  const [heldMessage, setHeldMessage] = useState<{ id: string; x: number; y: number } | null>(null)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdOrigin = useRef<{ x: number; y: number } | null>(null)

  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    holdOrigin.current = null
    setHeldMessage(null)
  }, [])

  const startHold = useCallback((messageId: string, e: React.MouseEvent) => {
    // Left button only: right-click already opens the message menu.
    if (e.button !== 0) return
    const { clientX: x, clientY: y } = e
    holdOrigin.current = { x, y }
    holdTimer.current = setTimeout(() => setHeldMessage({ id: messageId, x, y }), HOLD_TO_SEE_TIME_MS)
  }, [])

  const moveDuringHold = useCallback((e: React.MouseEvent) => {
    const origin = holdOrigin.current
    if (!origin || holdTimer.current === null) return
    // Selecting text inside a bubble is a drag, and should not be read as a hold.
    if (Math.abs(e.clientX - origin.x) > 8 || Math.abs(e.clientY - origin.y) > 8) cancelHold()
  }, [cancelHold])
  const swipeStart = useRef<{ x: number; y: number; active: boolean } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    swipeStart.current = { x: touch.clientX, y: touch.clientY, active: false }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const start = swipeStart.current
    const touch = e.touches[0]
    if (!start || !touch) return

    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y

    // Only claim the gesture once it is clearly horizontal and leftward. Reading
    // back through a conversation is a vertical scroll, and stealing that to
    // reveal timestamps would make the thread feel broken.
    if (!start.active) {
      if (Math.abs(dy) > Math.abs(dx) || dx > -10) return
      start.active = true
    }

    setTimeReveal(Math.min(TIME_REVEAL_PX, Math.max(0, -dx)))
  }, [])

  const endSwipe = useCallback(() => {
    swipeStart.current = null
    setTimeReveal(0)
  }, [])

  useEffect(() => {
    if (!otherUserId) return undefined
    let cancelled = false
    profileApi.getRelationship(otherUserId).then((r) => { if (!cancelled) setRelationship(r) }).catch(() => {})
    return () => { cancelled = true }
  }, [otherUserId])

  async function handleToggleMute(): Promise<void> {
    if (!otherUserId) return
    const wasMuted = !!relationship?.muted
    try {
      if (wasMuted) {
        await networkApi.unmute(otherUserId)
        setRelationship((r) => r ? { ...r, muted: false } : r)
        toastSuccess('Unmuted', `You'll see posts from ${displayName} again.`)
      } else {
        await networkApi.mute(otherUserId)
        setRelationship((r) => r ? { ...r, muted: true } : r)
        toastSuccess('Muted', `You won't see posts from ${displayName} in your feed.`)
      }
    } catch (e) {
      toastError('Action failed', e instanceof Error ? e.message : 'Please try again')
    }
  }

  /**
   * Mutes this conversation's notifications.
   *
   * Deliberately not `networkApi.mute`, which this panel used to call: that hides
   * someone's posts from the feed and leaves the chat exactly as noisy as it was,
   * so a button reading "mute notifications" muted something else entirely. It
   * also needed a single other participant, which left the option dead in groups.
   */
  async function handleToggleConversationMute(): Promise<void> {
    if (!conversationId) return
    const wasMuted = !!conversation?.isMuted
    try {
      if (wasMuted) {
        await messagingApi.unmute(conversationId)
        toastSuccess('Unmuted', 'You will be notified about new messages here again.')
      } else {
        await messagingApi.mute(conversationId)
        toastSuccess('Muted', 'You will not be notified about new messages here.')
      }
      // The inbox carries the flag this label reads; without the refetch the row
      // keeps its old bell and the label flips back when the panel is reopened.
      await retryFetchConversations()
    } catch (e) {
      toastError('Action failed', e instanceof Error ? e.message : 'Please try again')
    }
  }

  async function handleUnblock(): Promise<void> {
    if (!otherUserId) return
    try {
      await networkApi.unblock(otherUserId)
      setRelationship((r) => r ? { ...r, blocked: false } : r)
      toastSuccess('Unblocked', `${displayName} can now see your profile and message you again.`)
    } catch (e) {
      toastError('Action failed', e instanceof Error ? e.message : 'Please try again')
    }
  }

  async function handleBlock(): Promise<void> {
    if (!otherUserId) return
    await networkApi.block(otherUserId)
    setRelationship((r) => r ? { ...r, blocked: true, following: false, followedBy: false } : r)
    toastSuccess('Blocked', `${displayName} can no longer see your profile or message you.`)
  }

  /**
   * Pin or unpin, moderators only. The bar updates from the socket event the
   * server broadcasts, so every member's view moves together rather than only
   * the moderator who pressed it.
   */
  async function handleTogglePin(messageId: string): Promise<void> {
    if (!conversationId) return
    try {
      const { pinned } = await messagingApi.togglePinMessage(messageId)
      const next = pinned ? await messagingApi.pinnedMessage(conversationId) : null
      setPinnedMessage(next)
      toastSuccess(pinned ? 'Pinned' : 'Unpinned', pinned ? 'Everyone will see this at the top.' : 'Removed from the top of the chat.')
    } catch (e) {
      toastError('Could not pin', e instanceof Error ? e.message : 'Please try again')
    }
  }

  /**
   * Scrolls to a message and flashes it — the reply quote and the pinned bar
   * both land here.
   *
   * The flash is React state rather than classes written onto the node. The
   * previous version added ring utilities directly to the DOM, which any
   * re-render inside the 1.4s window silently undid, so the highlight often
   * never appeared.
   *
   * A parent older than the loaded page has no element to scroll to. Saying so
   * beats scrolling nowhere and looking broken.
   */
  const jumpToMessage = useCallback((messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`)
    if (!el) {
      toastError('Message not loaded', 'Scroll up to load older messages, then try again.')
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Clear first so tapping the same quote twice restarts the animation
    // instead of doing nothing because the class is already applied.
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    setFlashMessageId(null)
    requestAnimationFrame(() => setFlashMessageId(messageId))
    flashTimerRef.current = setTimeout(() => setFlashMessageId(null), 1400)
  }, [toastError])

  /**
   * Sends a message on to other chats.
   *
   * Reports partial success honestly: forwarding into three chats where one is
   * in announcement mode succeeds twice and fails once, and saying "forwarded"
   * would hide the one that did not arrive.
   */
  const handleForward = useCallback(async (messageId: string, conversationIds: string[]): Promise<void> => {
    try {
      const { forwarded, results } = await messagingApi.forwardMessage(messageId, conversationIds)
      const failed = results.filter((r) => !r.ok)
      setForwardingMessage(null)
      if (forwarded === 0) {
        toastError('Could not forward', failed[0]?.error ?? 'Please try again')
        return
      }
      if (failed.length > 0) {
        toastSuccess(
          `Forwarded to ${forwarded}`,
          `${failed.length} could not be delivered: ${failed[0]?.error ?? 'not allowed'}`,
        )
        return
      }
      toastSuccess('Forwarded', `Sent to ${forwarded} ${forwarded === 1 ? 'chat' : 'chats'}.`)
    } catch (e) {
      toastError('Could not forward', e instanceof Error ? e.message : 'Please try again')
    }
  }, [toastSuccess, toastError])

  /**
   * Records a vote and swaps in the server's tally.
   *
   * No optimistic update: the server decides whether this moves an existing
   * vote or withdraws it, and guessing wrong would flicker the bars the wrong
   * way before correcting itself.
   */
  const handleVote = useCallback(async (messageId: string, optionId: string): Promise<void> => {
    try {
      const poll = await messagingApi.votePoll(messageId, optionId)
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, poll } : m)))
    } catch (e) {
      toastError('Could not vote', e instanceof Error ? e.message : 'Please try again')
    }
  }, [toastError])

  /** Moderator removal of someone else's message. Always for everyone. */
  async function handleModerateDelete(messageId: string): Promise<void> {
    if (!window.confirm('Remove this message for everyone in the community?')) return
    try {
      await messagingApi.moderateDeleteMessage(messageId)
      toastSuccess('Removed', 'The message is no longer visible to anyone.')
    } catch (e) {
      toastError('Could not remove', e instanceof Error ? e.message : 'Please try again')
    }
  }

  /** Removes the thread from this member's inbox; the other copy is untouched. */
  async function handleDeleteConversation(): Promise<void> {
    if (!conversationId) return
    if (!window.confirm('Delete this conversation? It stays in the other person\'s inbox.')) return
    try {
      await messagingApi.deleteConversation(conversationId)
      await retryFetchConversations()
      setActiveConversationId(null)
      toastSuccess('Deleted', 'The conversation is no longer in your inbox.')
    } catch (e) {
      toastError('Could not delete', e instanceof Error ? e.message : 'Please try again')
    }
  }

  async function handleLeaveGroup(): Promise<void> {
    if (!conversationId) return
    if (!window.confirm('Leave this group? You will stop receiving its messages.')) return
    setLeavingGroup(true)
    try {
      await messagingApi.leaveGroup(conversationId)
      await retryFetchConversations()
      setActiveConversationId(null)
      toastSuccess('Left group', 'You will no longer receive messages from it.')
    } catch (e) {
      toastError('Could not leave', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setLeavingGroup(false)
    }
  }

  // Keep local theme in sync with the conversation (initial load + switching chats).
  useEffect(() => {
    const t = setTimeout(() => setThemeId(conversation?.theme ?? null), 0)
    return () => clearTimeout(t)
  }, [conversation?.theme, conversationId])

  // Set the shared chat theme (optimistic; the server echoes `conversation:theme`
  // back to both participants over the socket).
  const setChatTheme = useCallback(async (nextThemeId: string | null) => {
    if (!conversationId) return
    const normalized = nextThemeId && nextThemeId !== 'default' ? nextThemeId : null
    const prev = themeId
    setThemeId(normalized)
    setShowThemePicker(false)
    try {
      const token = await getAuthToken()
      const res = await fetch(`${API_URL}/api/v1/messaging/conversations/${conversationId}/theme`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: normalized }),
      })
      if (!res.ok) throw new Error('API error')
    } catch {
      setThemeId(prev)
      toastError('Theme not changed', 'Could not update the chat theme. Please try again.')
    }
  }, [conversationId, themeId, toastError])

  const handleStartCall = useCallback((callType: 'audio' | 'video') => {
    if (!conversationId) return
    // Belt and braces: the buttons are not rendered for the assistant, but nothing
    // else should be able to open a call to it either.
    if (isAiChat) return
    if (isDM && otherUserId) {
      startCall({ conversationId, peerUserId: otherUserId, peerName: displayName, peerAvatar: avatarUrl, callType })
    } else if (!isDM) {
      // Group/community conversation — the invite fans out to all members
      startCall({ conversationId, callType, isGroup: true, conversationName: displayName || 'Group call' })
    }
  }, [conversationId, isAiChat, isDM, otherUserId, displayName, avatarUrl, startCall])

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
                  // One reaction per user (Instagram-style). Always drop any
                  // existing reaction from this user first: on removal that
                  // clears it, and on add/replace it both dedups the sender's
                  // own optimistic echo and swaps out their previous emoji.
                  reactions: data.removed
                    ? m.reactions.filter((r) => r.userId !== data.userId)
                    : [
                        ...m.reactions.filter((r) => r.userId !== data.userId),
                        { emoji: data.emoji, userId: data.userId },
                      ],
                }
              : m,
          ),
        )
      }
    }

    const handlePollVote = (data: {
      conversationId: string
      messageId: string
      totalVotes: number
      options: { id: string; votes: number }[]
    }) => {
      if (data.conversationId !== conversationId) return
      const counts = new Map(data.options.map((o) => [o.id, o.votes]))
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.messageId && m.poll
            ? {
                ...m,
                poll: {
                  ...m.poll,
                  totalVotes: data.totalVotes,
                  // votedByMe stays as this viewer left it — the broadcast
                  // deliberately carries no one's individual choice.
                  options: m.poll.options.map((o) => ({ ...o, votes: counts.get(o.id) ?? o.votes })),
                },
              }
            : m,
        ),
      )
    }

    const handleMessagePinned = (data: { conversationId: string; messageId: string | null }) => {
      if (data.conversationId !== conversationId) return
      if (!data.messageId) { setPinnedMessage(null); return }
      void messagingApi.pinnedMessage(data.conversationId).then(setPinnedMessage).catch(() => {})
    }

    // Announcement mode or slow mode changing while someone has the composer
    // open: refetch so their box locks itself rather than letting them type a
    // message the server will refuse.
    const handleCommunitySettings = (data: { conversationId: string }) => {
      if (data.conversationId !== conversationId) return
      void refreshCommunityAccess()
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

    // Shared chat theme changed by either participant — apply it live.
    const handleThemeChange = (data: { conversationId: string; theme: string | null }) => {
      if (data.conversationId === conversationId) {
        setThemeId(data.theme)
      }
    }

    socket.on('message:new', handleNewMessage)
    socket.on('message:edited', handleEditedMessage)
    socket.on('message:deleted', handleDeletedMessage)
    socket.on('message:pinned', handleMessagePinned)
    socket.on('message:poll', handlePollVote)
    socket.on('community:settings', handleCommunitySettings)
    socket.on('message:reaction', handleReaction)
    socket.on('message:expired', handleMessageExpired)
    socket.on('conversation:theme', handleThemeChange)

    // Join conversation room
    socket.emit('conversation:join', { conversationId })

    return () => {
      socket.off('message:new', handleNewMessage)
      socket.off('message:edited', handleEditedMessage)
      socket.off('message:deleted', handleDeletedMessage)
      socket.off('message:pinned', handleMessagePinned)
      socket.off('message:poll', handlePollVote)
      socket.off('community:settings', handleCommunitySettings)
      socket.off('message:reaction', handleReaction)
      socket.off('message:expired', handleMessageExpired)
      socket.off('conversation:theme', handleThemeChange)
      socket.emit('conversation:leave', { conversationId })
    }
  }, [socket, conversationId, markRead, refreshCommunityAccess, setPinnedMessage])

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

  // When the open conversation changes (or the component unmounts) while we were
  // still "typing", tell the OLD conversation to stop — otherwise the other
  // participant is left with a stuck "typing…" indicator. Keyed only on
  // conversationId/socket so it doesn't fire on every keystroke.
  useEffect(() => {
    return () => {
      if (wasTypingRef.current) {
        wasTypingRef.current = false
        socket?.emit('typing:stop', { conversationId })
      }
    }
  }, [conversationId, socket])

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
      ? tmsg('lastSeen', { when: formatLastSeen(otherPresence.lastSeen, locale) })
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

  // Auto-scroll to the newest message ONLY when one is appended (or on the first
  // load / conversation switch). Keying on messages.length also fired when older
  // pages were PREPENDED by infinite scroll, yanking the viewport to the bottom
  // and making history impossible to read.
  const lastMessageIdRef = useRef<string | null>(null)
  useEffect(() => {
    const lastId = messages.length > 0 ? messages[messages.length - 1]!.id : null
    if (lastId === lastMessageIdRef.current) return // prepend, edit, or no change
    const prevId = lastMessageIdRef.current
    lastMessageIdRef.current = lastId
    const container = messagesContainerRef.current
    // First population / conversation switch (prevId === null): always snap.
    // Later appends: only follow if the user is already near the bottom, so an
    // incoming message doesn't interrupt someone reading older history.
    const nearBottom =
      !container || container.scrollHeight - container.scrollTop - container.clientHeight < 200

    // Your OWN message always wins. Pressing send is an unambiguous statement
    // that you are done reading history — leaving the view parked where it was
    // meant a message could be sent and never seen, which is how this looked
    // broken.
    const last = messages[messages.length - 1]
    const sentByMe = !!last && last.sender.id === user?.id

    if (prevId === null || sentByMe || nearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: prevId === null ? 'auto' : 'smooth' })
      // rAF, not a bare call: setState directly in an effect body is a React 19
      // lint error and does cause a cascading render.
      requestAnimationFrame(() => setUnseenCount(0))
      return
    }

    // Someone else's message, and the reader is up in the history. Yanking them
    // to the bottom loses their place mid-sentence, so it is offered instead.
    requestAnimationFrame(() => setUnseenCount((n) => n + 1))
  }, [messages, user?.id])

  // Load more messages (infinite scroll)
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || !nextCursor || loadingMore) return
    setLoadingMore(true)
    const container = messagesContainerRef.current
    const prevScrollHeight = container?.scrollHeight ?? 0
    const prevScrollTop = container?.scrollTop ?? 0
    try {
      const result = await fetchMessages(nextCursor)
      setMessages((prev) => [...result.data, ...prev])
      setNextCursor(result.nextCursor)
      // Prepending grows the container above the viewport; restore the offset so
      // the message the user was looking at stays put instead of jumping.
      requestAnimationFrame(() => {
        const c = messagesContainerRef.current
        if (c) c.scrollTop = prevScrollTop + (c.scrollHeight - prevScrollHeight)
      })
    } catch { /* ignore */ }
    finally { setLoadingMore(false) }
  }, [conversationId, nextCursor, loadingMore, fetchMessages])

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    // Scrolling back down to the end is the same statement as tapping the pill.
    if (container.scrollHeight - container.scrollTop - container.clientHeight < 120) {
      setUnseenCount((n) => (n === 0 ? n : 0))
    }

    if (!nextCursor || loadingMore) return
    if (container.scrollTop < 100) {
      void loadMoreMessages()
    }
  }, [nextCursor, loadingMore, loadMoreMessages])

  /** Jump to the newest message and dismiss the catch-up pill. */
  const scrollToLatest = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setUnseenCount(0)
  }, [])

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

    // Slow mode restarts with every message. A client-side countdown would
    // drift against the server's clock and then confidently offer a composer
    // that gets refused, so the server is asked again instead.
    if (isCommunity && communityAccess?.slowModeSeconds) void refreshCommunityAccess()
  }, [
    conversationId, input, replyingTo, user, profile, socket, sendMessage,
    isCommunity, communityAccess?.slowModeSeconds, refreshCommunityAccess,
  ])

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
      // Apply the edit optimistically (like delete/send/react do). Otherwise the
      // bubble only updates when the `message:edited` socket echo arrives — so on
      // a degraded/disconnected socket the user sees "Message edited" but the old
      // text until a full reload.
      const newBody = editText.trim()
      const editedId = editingMessageId
      setMessages((prev) =>
        prev.map((m) => (m.id === editedId ? { ...m, body: newBody, editedAt: new Date().toISOString() } : m)),
      )
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

  // Report a message to Trust & Safety
  const handleReportMessage = useCallback(async (messageId: string) => {
    try {
      await moderationApi.report('message', messageId, 'abuse')
      toastSuccess('Message reported', "We'll review it shortly.")
    } catch {
      toastError('Report failed', 'Could not submit the report. Please try again.')
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
          const mineSameEmoji = m.reactions.some((r) => r.userId === user?.id && r.emoji === emoji)
          // Strip any prior reaction from this user, then (unless we're toggling
          // the same emoji off) add the new one — one reaction per user.
          const withoutMine = m.reactions.filter((r) => r.userId !== user?.id)
          return {
            ...m,
            reactions: mineSameEmoji
              ? withoutMine
              : [...withoutMine, { emoji, userId: user?.id ?? '' }],
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

    // Validate video duration (< 5 minutes). Fail closed if metadata is unreadable.
    let videoDuration: number | undefined
    if (file.type.startsWith('video/')) {
      try {
        videoDuration = await getVideoDuration(file)
      } catch {
        toastError('Unreadable video', 'Could not verify the video length. Please try a different file.')
        return
      }
      // Some containers report duration as Infinity or NaN. `Infinity > 300` is
      // true (rejects valid short clips) and `NaN > 300` is false (lets an
      // unverifiable file through the cap) — so guard non-finite explicitly.
      if (!Number.isFinite(videoDuration)) {
        toastError('Unreadable video', 'Could not verify the video length. Please try a different file.')
        return
      }
      if (videoDuration > 300) {
        toastError('Video too long', 'Videos must be under 5 minutes')
        return
      }
    }

    setUploadingFile(true)
    try {
      // Compress images before upload (resize → WebP) so they occupy far less storage
      let uploadBlob: Blob = file
      let uploadName = file.name
      let uploadMime = file.type
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file)
        uploadBlob = compressed.blob
        uploadName = compressed.fileName
        uploadMime = compressed.mimeType
      }

      const token = await getAuthToken()

      // Get a Supabase signed upload URL
      const urlRes = await fetch(`${API_URL}/api/v1/messaging/upload/presigned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mimeType: uploadMime,
          fileName: uploadName,
          fileSize: uploadBlob.size,
          ...(videoDuration !== undefined ? { durationSeconds: Math.round(videoDuration) } : {}),
        }),
      })
      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => null)
        throw new Error(err?.error?.message ?? 'Failed to get upload URL')
      }

      // The API wraps every response as { success, data: {...} }; the presigned
      // fields live under .data. Reading them from the top level left uploadUrl
      // undefined -> PUT to "/undefined" (404), so media upload never worked.
      const presignedJson = await urlRes.json() as {
        data?: { url: string; viewUrl: string; key: string; type: string }
        url?: string; viewUrl?: string; key?: string; type?: string
      }
      const { url: uploadUrl, viewUrl, key, type } = presignedJson.data ?? presignedJson
      if (!uploadUrl) throw new Error('Upload service returned no upload URL')

      // Upload the file directly to Supabase Storage via the signed URL
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: uploadBlob,
        headers: { 'Content-Type': uploadMime },
      })
      if (!uploadRes.ok) throw new Error('Upload failed')

      // Use the public URL from Supabase Storage
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
          // Guard against the double-render race: the server broadcasts
          // message:new to the room, and if that echo lands before this POST
          // resolves the message is already in state. Without the id check it
          // would be appended twice (duplicate bubble + duplicate React key).
          setMessages((prev) => (prev.some((m) => m.id === realMsg.id) ? prev : [...prev, realMsg]))
        }
        setInput('')
        setDisappearMode('none')
      } else {
        // The media reached storage but the message create failed — surface it
        // instead of silently doing nothing (previously there was no else branch).
        const err = await msgRes.json().catch(() => null)
        throw new Error(err?.error?.message ?? 'Media uploaded but the message could not be sent')
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
    <div className="flex items-center gap-2.5 md:gap-3 px-3 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/20 bg-background/95 backdrop-blur-sm flex-shrink-0">
      {onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="md:hidden size-9 rounded-full -ml-1"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      {/*
        Tapping the avatar or the name opens the profile, which is what every
        messaging app trains people to expect and what this header did not do —
        the name was a <p> and the avatar a plain div, so there was nothing to
        tap. A group has no single profile to open, so it reveals the details
        panel instead, which is the equivalent destination.
      */}
      <HeaderIdentity
        username={otherParticipant?.username}
        isGroup={!isDM}
        onShowInfo={() => setShowInfo(true)}
      >
      <div className="relative flex-shrink-0">
        <Avatar className="size-10 ring-2 ring-primary/10">
          {avatarUrl ? (
            <AvatarImage alt={displayName} src={avatarUrl} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-[15px] text-foreground truncate">{displayName}</p>
          {isVerified && (
            <svg className="size-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </div>
        {isCommunity ? (
          <CommunityHeaderInfo
            membersCount={communityInfo?.membersCount ?? 0}
            access={communityAccess}
            onOpenMembers={() => setShowCommunityMembers(true)}
          />
        ) : someoneTyping ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11.5px] font-medium text-primary truncate max-w-[160px]">{typingLabel}</span>
            <div className="flex items-center gap-[3px] flex-shrink-0">
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
              <span className="typing-dot w-[5px] h-[5px] rounded-full bg-primary" />
            </div>
          </div>
        ) : (
          <p className={cn('text-[11.5px] font-medium', isOnline ? 'text-green-600' : 'text-muted-foreground')}>
            {typingText}
          </p>
        )}
      </div>
      </HeaderIdentity>
      <div className="flex items-center gap-0.5 md:gap-1">
        {!isAiChat && !isCommunity && (
          <>
            <Button
              onClick={() => handleStartCall('audio')}
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-primary hover:bg-primary/10"
              aria-label={tmsg('voiceCall')}
            >
              <Phone className="size-[18px]" />
            </Button>
            <Button
              onClick={() => handleStartCall('video')}
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-primary hover:bg-primary/10"
              aria-label={tmsg('videoCall')}
            >
              <Video className="size-[18px]" />
            </Button>
          </>
        )}
        <Button
          onClick={() => setShowInfo((s) => !s)}
          variant="ghost"
          size="icon"
          className={cn('size-9 rounded-full', showInfo && 'bg-primary/10 text-primary')}
          aria-label="Conversation info"
        >
          <Info className="size-[18px]" />
        </Button>
        {/* User actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="User actions"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full"
            >
              <MoreVertical className="size-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-36 rounded-lg bg-popover p-1 shadow-xl"
            align="end"
            collisionBoundary={conversationEl}
            collisionPadding={8}
          >
            <div className="flex flex-col gap-1">
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => setShowThemePicker(true)}
              >
                <Palette className="size-4" />
                <span className="font-medium text-xs">Theme</span>
              </Button>
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
                disabled={!otherUserId}
                onClick={() => void handleToggleMute()}
              >
                {relationship?.muted ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                <span className="font-medium text-xs">{relationship?.muted ? 'Unmute User' : 'Mute User'}</span>
              </Button>
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
                disabled={!otherUserId}
                onClick={() => (relationship?.blocked ? void handleUnblock() : setConfirmBlockOpen(true))}
              >
                {relationship?.blocked ? <UserCheck2 className="size-4" /> : <UserMinus2 className="size-4" />}
                <span className="font-medium text-xs">{relationship?.blocked ? 'Unblock User' : 'Block User'}</span>
              </Button>
              {/* Groups get "Leave" instead: deleting your copy while still a
                  member would just refill on the next message. */}
              {!isDM && (
                <Button
                  className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                  size="sm"
                  type="button"
                  variant="ghost"
                  disabled={leavingGroup}
                  onClick={() => void handleLeaveGroup()}
                >
                  {leavingGroup ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                  <span className="font-medium text-xs">Leave group</span>
                </Button>
              )}
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => void handleDeleteConversation()}
              >
                <Trash2 className="size-4" />
                <span className="font-medium text-xs">Delete Conversation</span>
              </Button>
              <Button
                className="w-full justify-start gap-2 rounded bg-transparent text-yellow-600 hover:bg-accent"
                size="sm"
                type="button"
                variant="ghost"
                disabled={!otherUserId}
                onClick={() => setReportUserOpen(true)}
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
          className="size-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-container"
          size="icon"
          type="button"
          variant="ghost"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        collisionBoundary={conversationEl}
        collisionPadding={8}
        className="w-40 rounded-lg bg-popover p-1 shadow-xl"
      >
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
          onClick={() => setForwardingMessage(msg)}
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
          onClick={() => void handleReportMessage(msg.id)}
        >
          <Flag className="size-3.5" />
          <span>Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // ── Render reactions for a message ──────────────────────────────────────
  const renderReactions = (msg: MessageData, isMine: boolean) => {
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
      <div className={cn('relative z-[1] flex gap-1 flex-wrap -mt-2.5', isMine ? 'justify-end pr-1.5' : 'justify-start pl-1.5')}>
        {Object.entries(grouped).map(([emoji, { count, userIds }]) => {
          const reactedByMe = userIds.includes(user?.id ?? '')
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
              className={cn(
                'flex items-center gap-1 rounded-full border px-1.5 py-[3px] shadow-sm transition-all cursor-pointer hover:scale-110 active:scale-95',
                reactedByMe
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-background border-outline-variant/30 hover:border-outline-variant/60 text-foreground',
              )}
              title={tooltip}
            >
              <span className="text-[13px] leading-none">{emoji}</span>
              {count > 1 && (
                <span className="text-[10.5px] font-bold leading-none tabular-nums">{count}</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // ── Floating hover toolbar — quick reactions + actions, anchored to the bubble ──
  const renderReactionBar = (msg: MessageData, isMine: boolean, isPending: boolean) => {
    if (isPending) return null

    return (
      <div
        className={cn(
          'absolute -top-8 z-20 hidden md:flex opacity-0 group-hover/message:opacity-100 group-hover/message:-translate-y-1 transition-all duration-150 pointer-events-none',
          isMine ? 'right-0' : 'left-0',
        )}
      >
        <div className="flex items-center gap-0.5 bg-background rounded-full shadow-lg border border-outline-variant/30 px-1 py-0.5 pointer-events-auto">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => void handleReact(msg.id, emoji)}
              className={cn(
                'size-7 flex items-center justify-center rounded-full text-[15px] hover:bg-surface-container hover:scale-125 transition-all cursor-pointer',
                msg.reactions?.some((r) => r.emoji === emoji && r.userId === user?.id) && 'bg-primary/10 scale-110',
              )}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
              setReactionPickerMsg({ messageId: msg.id, x: rect.left, y: rect.bottom + 8 })
            }}
            className="size-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors cursor-pointer"
            title="More reactions"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    )
  }

  // ── WhatsApp-style quoted reply inside the bubble ───────────────────────
  const renderReplyQuote = (msg: MessageData, isMine: boolean) => {
    if (!msg.parentId) return null

    // Prefer the API-provided snippet; fall back to a local lookup for older cached messages
    const local = messages.find((m) => m.id === msg.parentId)
    const snippet = msg.parent ?? (local
      ? {
          id: local.id,
          body: local.isDeleted ? null : local.body,
          type: local.type,
          isDeleted: local.isDeleted,
          senderId: local.sender.id,
          senderName: local.sender.displayName,
        }
      : null)

    const name = snippet ? (snippet.senderId === user?.id ? 'You' : snippet.senderName) : 'Message'
    const preview = !snippet
      ? 'Original message unavailable'
      : snippet.isDeleted
        ? 'This message was deleted'
        : snippet.body?.trim()
          ? snippet.body
          : snippet.type === 'image'
            ? '📷 Photo'
            : snippet.type === 'video'
              ? '🎥 Video'
              : snippet.type === 'audio'
                ? '🎤 Voice message'
                : snippet.type === 'document' || snippet.type === 'file'
                  ? '📄 Document'
                  : snippet.type === 'gif'
                    ? 'GIF'
                    : snippet.type === 'location'
                      ? '📍 Location'
                      : snippet.type === 'poll'
                        ? '📊 Poll'
                        : 'Message'

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (msg.parentId) jumpToMessage(msg.parentId)
        }}
        className={cn(
          'w-full flex flex-col items-start mb-1.5 px-2.5 py-1.5 rounded-lg border-l-[3px] text-left cursor-pointer transition-colors',
          isMine
            ? 'bg-black/15 border-white/70 hover:bg-black/20'
            : 'bg-primary/5 border-primary hover:bg-primary/10',
        )}
      >
        <span className={cn('text-[11px] font-bold leading-tight', isMine ? 'text-white/95' : 'text-primary')}>
          {name}
        </span>
        <span className={cn('text-[11.5px] leading-snug line-clamp-1 break-all', isMine ? 'text-white/75' : 'text-muted-foreground')}>
          {preview}
        </span>
      </button>
    )
  }

  // ── Render media (images, videos, documents) ──────────────────────────
  const renderMedia = (msg: MessageData, hasQuote = false) => {
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

    // Documents render as an inset chip within the bubble padding. Images/videos
    // are full-bleed (negative margins so they reach the bubble edges).
    const containerClass = isDocument
      ? cn('mb-1 min-w-0', hasQuote ? 'mt-0' : 'mt-1 first:mt-0')
      : cn('-mx-4 mb-1', hasQuote ? 'mt-0 mx-0 rounded-lg overflow-hidden' : '-mt-2.5 first:mt-0')

    return (
      <div className={containerClass}>
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
            // Strip any query string and decode %20 etc. so the label is clean
            // and its width isn't inflated by a signed-URL token.
            const raw = url.split('/').pop() ?? 'Document'
            const base = raw.split('?')[0] ?? raw
            let fileName = 'Document'
            try {
              fileName = decodeURIComponent(base) || 'Document'
            } catch {
              fileName = base || 'Document'
            }
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={fileName}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition-colors no-underline max-w-full min-w-0"
              >
                <FileText className="size-5 flex-shrink-0 opacity-80" />
                <span className="min-w-0 flex-1 text-sm font-medium truncate">{fileName}</span>
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
    <Card ref={setConversationEl} className="flex h-full w-full flex-col overflow-hidden shadow-none border-0 rounded-none">
      {renderHeader()}

      <CardContent className="flex-1 p-0 overflow-hidden flex relative">
        {isCommunity && showCommunityMembers && conversationId && (
          <CommunityMembersSheet
            conversationId={conversationId}
            onClose={() => setShowCommunityMembers(false)}
          />
        )}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {isCommunity && pinnedMessage && (
            <CommunityPinnedBar
              pinned={pinnedMessage}
              canUnpin={!!communityAccess?.isMod}
              onJump={jumpToMessage}
              onUnpin={() => void handleTogglePin(pinnedMessage.id)}
            />
          )}

          {/* Messages area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={endSwipe}
            onTouchCancel={endSwipe}
            className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:px-5 space-y-1 bg-surface-container-low/60"
            style={activeTheme.wallpaper ? { backgroundImage: activeTheme.wallpaper } : undefined}
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
                <div className="px-6">
                  <div className="size-16 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Send className="size-6 text-primary" />
                  </div>
                  <p className="text-[15px] font-semibold text-foreground">No messages yet</p>
                  <p className="text-[12.5px] text-muted-foreground mt-1">Say hello to start the conversation 👋</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null
                const showAvatar = !prevMsg || prevMsg.sender.id !== msg.sender.id
                const isMine = isOwnMessage(msg)
                const showDateChip = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt)

                const msgStatus = pendingStatus[msg.id]
                const isPending = msgStatus === 'sending'
                const isFailed = msgStatus === 'failed'

                return (
                  <div key={msg.id} className="contents">
                  {showDateChip && (
                    <div className="flex justify-center py-3">
                      <span className="px-3 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-outline shadow-sm">
                        {formatDateChip(msg.createdAt, locale)}
                      </span>
                    </div>
                  )}
                  {/*
                    Slid left by the swipe, with the time parked just beyond the right
                    edge so it comes into view as the row moves. A transform rather than
                    a margin: it runs on the compositor, so dragging a long thread stays
                    smooth. The transition applies only on release — animating every
                    frame of the drag would leave the rows lagging behind the finger.
                  */}
                  <div
                    className={cn(
                      'flex flex-col relative group/message',
                      isMine ? 'items-end' : 'items-start',
                      showAvatar ? 'mt-3' : 'mt-0.5',
                      !isPending && !isFailed && 'animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out',
                    )}
                    style={{
                      transform: timeReveal > 0 ? `translateX(-${timeReveal}px)` : undefined,
                      transition: timeReveal === 0 ? 'transform 180ms ease-out' : 'none',
                    }}
                  >
                    {/*
                      The time every message has and no message showed: the label under a
                      bubble reads "Aug 21" once it is not today, so the clock was simply
                      unavailable for anything older. aria-hidden because it repeats what
                      the bubble's own title already tells a screen reader.
                    */}
                    <span
                      aria-hidden
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] tabular-nums text-outline whitespace-nowrap pointer-events-none"
                      style={{
                        left: '100%',
                        marginLeft: 10,
                        opacity: timeReveal / TIME_REVEAL_PX,
                        transition: timeReveal === 0 ? 'opacity 180ms ease-out' : 'none',
                      }}
                    >
                      {formatDateTime(msg.createdAt, locale, 'timePadded')}
                    </span>
                    {/*
                      Row: avatar + bubble + time.

                      w-full, not max-w-full: the bubble below caps itself at a
                      percentage, and a percentage needs a width to be a percentage
                      *of*. With the parent column aligning this row by items-end,
                      the row sized to its own contents — so the cap referred back
                      to the thing it was supposed to be capping, and the bubble
                      collapsed to its narrowest legal width, one word per line.
                      Full width makes it definite; row-reverse still parks a sent
                      message on the right.
                    */}
                    <div className={cn('flex w-full gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
                      {/* Avatar for others */}
                      {!isMine && (
                        /*
                          In a group the only way to find out who someone was meant leaving
                          and searching for them. Their avatar now opens their profile,
                          which is what tapping a face means everywhere else.
                        */
                        <IdentityLink
                          username={msg.sender.username}
                          className={cn('flex-shrink-0 self-end', showAvatar ? '' : 'invisible')}
                        >
                          <Avatar className="size-8">
                            {msg.sender.avatarUrl ? (
                              <AvatarImage alt={msg.sender.displayName} src={msg.sender.avatarUrl} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {msg.sender.displayName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </IdentityLink>
                      )}

                      {/*
                        Actions live beside the bubble, not inside the reaction
                        pill. Mixing "react with 😂" and "delete this for
                        everyone" into one strip put a destructive action a few
                        pixels from a playful one, and the pill had to be hovered
                        precisely to reach either.

                        Always on the outer edge — left of your own messages,
                        right of theirs — so it never covers the text.
                      */}
                      {isMine && !isPending && (
                        <div className="hidden md:flex self-center flex-shrink-0 opacity-0 group-hover/message:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                          {renderMessageActions(msg, isMine)}
                        </div>
                      )}

                      <div className={cn('relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%]', isMine ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
                        {/* Reactions only — the actions menu sits beside the bubble instead. */}
                        {renderReactionBar(msg, isMine, isPending)}
                        {/*
                          Message bubble. The title carries the full date and time: the
                          swipe that reveals it is a touch gesture, and a mouse needs its
                          own way to the same fact.
                        */}
                        <div className={cn(flashMessageId === msg.id && 'message-flash')}>
                          <div
                            id={`msg-${msg.id}`}
                            title={formatDateTime(msg.createdAt, locale, 'dayMonthYearTime')}
                            onDoubleClick={() => void handleReact(msg.id, '❤️')}
                            onMouseDown={(e) => startHold(msg.id, e)}
                            onMouseMove={moveDuringHold}
                            onMouseUp={cancelHold}
                            onMouseLeave={cancelHold}
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
                                  if (navigator.vibrate) navigator.vibrate(10)
                                  setContextMenu({
                                    message: msg,
                                    x: Math.max(8, Math.min(Number(touch.dataset.touchX), window.innerWidth - 224)),
                                    y: Math.max(8, Math.min(Number(touch.dataset.touchY) - 40, window.innerHeight - 360)),
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
                              setContextMenu({
                                message: msg,
                                x: Math.max(8, Math.min(e.clientX, window.innerWidth - 224)),
                                y: Math.max(8, Math.min(e.clientY, window.innerHeight - 360)),
                              })
                            }}
                            className={cn(
                              'relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap select-none overflow-hidden',
                              msg.type === 'call'
                                ? 'bg-surface-container/80 text-muted-foreground border border-outline-variant/30 rounded-full px-4 py-2 text-[12.5px] font-medium'
                                : isMine
                                  ? editingMessageId === msg.id
                                    ? 'bg-background border border-outline-variant/30 shadow-sm'
                                    : 'bg-primary text-primary-foreground rounded-br-md shadow-sm'
                                  : 'bg-background text-foreground rounded-bl-md border border-outline-variant/25 shadow-sm',
                            )}
                            style={
                              isMine && msg.type !== 'call' && editingMessageId !== msg.id && activeTheme.sentBubble
                                ? { background: activeTheme.sentBubble, color: activeTheme.sentText }
                                : undefined
                            }
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
                                <button onClick={handleEdit} aria-label="Save edit" className="text-primary hover:text-primary/80 cursor-pointer flex-shrink-0">
                                  <Check className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                {/* Quoted reply (WhatsApp-style) */}
                                {renderReplyQuote(msg, isMine)}

                                {/*
                                  Provenance. Without it a forwarded message
                                  reads as something the sender wrote, which is
                                  how rumours travel.
                                */}
                                {msg.forwardedFrom && (
                                  <span className={cn(
                                    'flex items-center gap-1 text-[10.5px] italic mb-0.5',
                                    isMine ? 'text-white/70' : 'text-muted-foreground',
                                  )}>
                                    <Forward className="size-3" />
                                    Forwarded
                                  </span>
                                )}

                                {/* Media content */}
                                {renderMedia(msg, !!msg.parentId)}

                                {/* Shared post — Instagram-style preview card */}
                                {msg.type === 'shared_post' ? (
                                  <SharedPostPreview url={msg.body} isMine={isMine} />
                                ) : msg.poll ? (
                                  <PollBubble
                                    poll={msg.poll}
                                    isMine={isMine}
                                    onVote={(optionId) => handleVote(msg.id, optionId)}
                                  />
                                ) : locationFrom(msg.metadata) ? (
                                  <LocationBubble location={locationFrom(msg.metadata)!} isMine={isMine} />
                                ) : msg.body && (
                                  <p className="mt-1">{msg.body}</p>
                                )}
                                {msg.editedAt && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Reactions — aligned with the bubble */}
                        {renderReactions(msg, isMine)}

                        {/* Time + status */}
                        <div className={cn('flex items-center gap-1 px-1', isMine ? 'justify-end' : 'justify-start')}>
                          <span className="text-[10px] text-muted-foreground">{formatMessageTime(msg.createdAt, locale)}</span>

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

                        </div>
                      </div>

                      {/* Their messages: actions on the right — still the outer edge. */}
                      {!isMine && !isPending && (
                        <div className="hidden md:flex self-center flex-shrink-0 opacity-0 group-hover/message:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                          {renderMessageActions(msg, isMine)}
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/*
            The catch-up pill.

            Shown only when someone else's message landed while the reader was up
            in the history — their own send scrolls outright, and so does anything
            arriving while they are already at the bottom. This is the one case
            where scrolling automatically would take the page away mid-sentence.
          */}
          {unseenCount > 0 && (
            <button
              onClick={scrollToLatest}
              className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:bg-primary/90 active:scale-95 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {unseenCount === 1 ? '1 new message' : `${unseenCount} new messages`}
              <ChevronDown className="size-3.5" />
            </button>
          )}

          {/* Input bar */}
          <div className="px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:px-4 md:py-3 bg-background border-t border-outline-variant/20 flex-shrink-0">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="flex items-center gap-2.5 mb-2 px-3 py-2 bg-primary/5 border border-primary/15 rounded-xl">
                <div className="w-1 h-8 bg-primary rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-primary">Replying to {replyingTo.sender.displayName}</p>
                  <p className="text-[11.5px] text-muted-foreground truncate">{replyingTo.body ?? 'Sent a message'}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="flex items-center justify-center size-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-container cursor-pointer flex-shrink-0 transition-colors">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {isCommunity && communityAccess && !communityAccess.canPost && communityAccess.reason ? (
              <CommunityComposerLock
                key={communityAccess.retryAfterSeconds}
                reason={communityAccess.reason}
                retryAfterSeconds={communityAccess.retryAfterSeconds}
              />
            ) : (
            <div className="flex items-end gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv"
              />

              {/* Pill container: attach + input + emoji */}
              <div className="flex-1 flex items-end gap-0.5 bg-surface-container rounded-3xl pl-1.5 pr-1.5 py-1 min-h-[44px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={uploadingFile}
                      className="size-9 rounded-full flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      aria-label="Attach"
                    >
                      {uploadingFile ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={12} className="w-48 p-1 rounded-xl shadow-xl">
                    <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2" onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon className="size-4 text-primary" />
                      <span className="font-medium text-foreground/90">Photos & Videos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2" onClick={() => setShowPollModal(true)}>
                      <BarChart2 className="size-4 text-emerald-500" />
                      <span className="font-medium text-foreground/90">Poll</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2" onClick={() => setShowLocationModal(true)}>
                      <MapPin className="size-4 text-rose-500" />
                      <span className="font-medium text-foreground/90">Location</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={editingMessageId ? tmsg('editMessage') : replyingTo ? tmsg('reply') : tmsg('typeMessage')}
                  rows={1}
                  className="flex-1 px-2 py-2 bg-transparent text-[14.5px] focus:outline-none resize-none min-h-[36px] max-h-[120px] placeholder:text-muted-foreground/70 self-center"
                  maxLength={650}
                />

                <Button
                  onClick={() => setShowEmojiPicker((s) => !s)}
                  variant="ghost"
                  size="icon"
                  className={cn('size-9 rounded-full flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10', showEmojiPicker && 'text-primary bg-primary/10')}
                  aria-label="Toggle emoji picker"
                >
                  <Smile className="size-5" />
                </Button>
              </div>

              <Button
                onClick={() => editingMessageId ? void handleEdit() : void handleSend()}
                disabled={(!input.trim() && !editingMessageId) || uploadingFile}
                size="icon"
                className="size-11 rounded-full flex-shrink-0 shadow-md active:scale-95 transition-transform"
                aria-label={editingMessageId ? 'Save edit' : 'Send message'}
              >
                {uploadingFile ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : editingMessageId ? (
                  <Check className="size-5" />
                ) : (
                  <Send className="size-5 -ml-0.5 mt-0.5" />
                )}
              </Button>
            </div>
            )}

            {/* Quick emoji picker */}
            {showEmojiPicker && (
              <div className="flex gap-1.5 mt-2.5 p-2 bg-surface-container rounded-2xl overflow-x-auto no-scrollbar">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInput((prev) => prev + emoji)
                      setShowEmojiPicker(false)
                      inputRef.current?.focus()
                    }}
                    className="size-9 flex items-center justify-center rounded-xl hover:bg-background hover:scale-110 transition-all text-xl cursor-pointer flex-shrink-0"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info panel — slide-over on mobile, sidebar on desktop */}
        {showInfo && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
              onClick={() => setShowInfo(false)}
            />
            <div className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-background shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 lg:static lg:z-auto lg:w-72 lg:max-w-none lg:flex-shrink-0 lg:border-l lg:shadow-none lg:animate-none">
              {/* Mobile close */}
              <div className="flex items-center justify-between px-4 pt-3 lg:hidden">
                <span className="text-sm font-bold text-foreground">Details</span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="flex items-center justify-center size-8 rounded-full hover:bg-surface-container text-muted-foreground cursor-pointer transition-colors"
                  aria-label="Close details"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-5 flex flex-col items-center text-center border-b border-outline-variant/20">
                {/*
                  The details panel showed a face and a handle with no way to reach
                  the profile behind them — the place a member is most likely to go
                  looking for it.
                */}
                <IdentityLink username={otherParticipant?.username} className="flex flex-col items-center">
                <Avatar className="size-20 ring-4 ring-primary/10">
                  {avatarUrl ? (
                    <AvatarImage alt={displayName} src={avatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-2xl font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="font-bold text-lg text-foreground mt-3 truncate max-w-full">{displayName}</h3>
                {otherParticipant?.username && (
                  <p className="text-sm text-muted-foreground mt-0.5">@{otherParticipant.username}</p>
                )}
                </IdentityLink>
                <span className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-medium mt-2 px-2.5 py-1 rounded-full',
                  isOnline ? 'text-green-700 bg-green-50' : 'text-muted-foreground bg-surface-container',
                )}>
                  <span className={cn('size-1.5 rounded-full', isOnline ? 'bg-green-500' : 'bg-muted-foreground/40')} />
                  {isOnline ? 'Active now' : 'Offline'}
                </span>
              </div>
              {isCommunity && communityAccess?.isAdmin && conversationId && (
                <CommunityChatSettings
                  conversationId={conversationId}
                  access={communityAccess}
                  onSaved={(next) => {
                    setCommunityAccess((a) => (a ? { ...a, ...next } : a))
                    toastSuccess('Saved', 'Chat settings updated for everyone.')
                  }}
                  onError={(m) => toastError('Could not save', m)}
                />
              )}

              <div className="p-4 space-y-1">
                {[
                  {
                    label: conversation?.isMuted ? 'Unmute notifications' : 'Mute notifications',
                    onClick: () => void handleToggleConversationMute(),
                  },
                  {
                    label: relationship?.blocked ? 'Unblock user' : 'Block user',
                    onClick: otherUserId
                      ? () => (relationship?.blocked ? void handleUnblock() : setConfirmBlockOpen(true))
                      : undefined,
                  },
                  {
                    label: 'Report user',
                    onClick: otherUserId ? () => setReportUserOpen(true) : undefined,
                  },
                  {
                    label: 'Delete conversation',
                    danger: true,
                    onClick: () => void handleDeleteConversation(),
                  },
                ].map(({ label, danger, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    disabled={!onClick}
                    className={cn(
                      'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                      danger ? 'text-destructive hover:bg-destructive/10' : 'text-foreground/80 hover:bg-surface-container',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Reaction picker (full emoji selector) */}
      {reactionPickerMsg && (
        <ReactionPicker
          position={{ x: reactionPickerMsg.x, y: reactionPickerMsg.y }}
          boundsEl={conversationEl}
          onSelect={(emoji) => void handleReact(reactionPickerMsg.messageId, emoji)}
          onClose={() => setReactionPickerMsg(null)}
        />
      )}

      {/*
        The time, while a message is held.

        Rendered here rather than beside the bubble so it is never clipped by the
        thread's own scroll box, and pointer-events-none so holding never turns
        into hovering something else.
      */}
      {heldMessage && (
        <div
          className="fixed z-[60] pointer-events-none animate-in fade-in zoom-in-95 duration-100"
          style={{
            // Nudged above the cursor and clamped to the viewport, so a message at
            // the very edge does not push the label off-screen.
            left: Math.min(Math.max(12, heldMessage.x - 60), (typeof window !== 'undefined' ? window.innerWidth : 0) - 180),
            top: Math.max(12, heldMessage.y - 52),
          }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-popover border border-outline-variant/25 shadow-2xl">
            <p className="text-[11.5px] font-medium text-on-surface whitespace-nowrap tabular-nums">
              {formatDateTime(
                messages.find((m) => m.id === heldMessage.id)?.createdAt ?? '',
                locale,
                'dayMonthYearTime',
              )}
            </p>
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setContextMenu(null)}
        >
          <div
            className="absolute bg-popover rounded-2xl shadow-2xl border border-outline-variant/25 py-1 min-w-[210px] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick reactions */}
            <div className="px-2.5 py-2 border-b border-outline-variant/20">
              <div className="flex gap-1 items-center justify-between">
                {['❤️', '😂', '😮', '👍'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => void handleReact(contextMenu.message.id, emoji)}
                    className={cn(
                      'size-9 flex items-center justify-center rounded-full hover:bg-surface-container hover:scale-125 transition-all text-xl cursor-pointer',
                      contextMenu.message.reactions?.some((r) => r.emoji === emoji && r.userId === user?.id) && 'bg-primary/10 scale-110',
                    )}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setReactionPickerMsg({ messageId: contextMenu.message.id, x: contextMenu.x, y: contextMenu.y })
                    setContextMenu(null)
                  }}
                  className="size-9 flex items-center justify-center rounded-full bg-surface-container text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer"
                  title="More reactions"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {[
              { label: 'Reply', icon: Reply, action: () => { setReplyingTo(contextMenu.message); setContextMenu(null) } },
              { label: 'Forward', icon: Forward, action: () => { setForwardingMessage(contextMenu.message); setContextMenu(null) } },
              { label: 'Copy', icon: Copy, action: () => { void navigator.clipboard.writeText(contextMenu.message.body ?? ''); setContextMenu(null) } },
              ...(isOwnMessage(contextMenu.message)
                ? [
                    { label: 'Edit', icon: Edit3, action: () => { setEditingMessageId(contextMenu.message.id); setEditText(contextMenu.message.body ?? ''); setContextMenu(null) } },
                    { label: 'Delete for me', icon: Trash2, action: () => void handleDelete(contextMenu.message.id) },
                    { label: 'Delete for everyone', icon: Trash2, action: () => void handleDelete(contextMenu.message.id, true), danger: true },
                  ]
                : []),
              // Moderator powers, on anyone's message including their own. Kept
              // last so the destructive one is never where "Copy" was a moment
              // ago in a DM.
              ...(isCommunity && communityAccess?.isMod
                ? [
                    {
                      label: pinnedMessage?.id === contextMenu.message.id ? 'Unpin message' : 'Pin message',
                      icon: Pin,
                      action: () => { void handleTogglePin(contextMenu.message.id); setContextMenu(null) },
                    },
                    ...(isOwnMessage(contextMenu.message)
                      ? []
                      : [{
                          label: 'Remove for everyone',
                          icon: ShieldAlert,
                          action: () => { void handleModerateDelete(contextMenu.message.id); setContextMenu(null) },
                          danger: true,
                        }]),
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

      {/* Chat theme picker */}
      {showThemePicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-in fade-in duration-150"
          onClick={() => setShowThemePicker(false)}
        >
          <div
            className="w-full sm:max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Chat theme</h3>
              </div>
              <button
                onClick={() => setShowThemePicker(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors cursor-pointer"
                aria-label="Close theme picker"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="px-4 pt-3 text-[11.5px] text-muted-foreground">
              Themes apply to this chat for both of you.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-4 max-h-[50vh] overflow-y-auto">
              {CHAT_THEMES.map((t) => {
                const selected = (themeId ?? 'default') === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => void setChatTheme(t.id)}
                    className={cn(
                      'group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors cursor-pointer',
                      selected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-surface-container',
                    )}
                    aria-pressed={selected}
                  >
                    <span
                      className="relative size-14 rounded-full border border-outline-variant/30 shadow-inner flex items-end justify-end p-1 overflow-hidden"
                      style={{
                        background:
                          t.sentBubble ??
                          'linear-gradient(135deg, var(--color-primary, #066879), var(--color-primary, #066879))',
                      }}
                    >
                      <span className="text-sm leading-none drop-shadow" aria-hidden>{t.emoji}</span>
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="size-5 text-white drop-shadow" />
                        </span>
                      )}
                    </span>
                    <span className={cn('text-[11px] font-medium', selected ? 'text-primary' : 'text-foreground')}>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {reportUserOpen && otherUserId && (
        <ReportContentModal
          targetType="user"
          targetId={otherUserId}
          onClose={() => setReportUserOpen(false)}
        />
      )}
      {confirmBlockOpen && otherUserId && (
        <ConfirmDialog
          title={`Block ${displayName}?`}
          body={`They won't be able to see your profile, follow you, or message you. Existing follows between you will be removed. You can unblock them anytime.`}
          confirmLabel="Block"
          onConfirm={handleBlock}
          onClose={() => setConfirmBlockOpen(false)}
        />
      )}
      {forwardingMessage && user?.id && (
        <ForwardModal
          conversations={conversations}
          currentConversationId={conversationId}
          currentUserId={user.id}
          onClose={() => setForwardingMessage(null)}
          onForward={(ids) => handleForward(forwardingMessage.id, ids)}
        />
      )}

      {showPollModal && (
        <PollCreatorModal
          onClose={() => setShowPollModal(false)}
          onSend={async (poll) => {
            setShowPollModal(false)
            if (!conversationId) return
            try {
              await messagingApi.sendMessage(conversationId, {
                type: 'poll',
                poll,
              })
            } catch (e) {
              toastError('Could not send poll', e instanceof Error ? e.message : 'Please try again')
            }
          }}
        />
      )}
      {showLocationModal && (
        <LocationPickerModal
          onClose={() => setShowLocationModal(false)}
          onSend={async (location) => {
            setShowLocationModal(false)
            if (!conversationId) return
            try {
              await messagingApi.sendMessage(conversationId, {
                type: 'location',
                metadata: { location },
              })
            } catch (e) {
              toastError('Could not share location', e instanceof Error ? e.message : 'Please try again')
            }
          }}
        />
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

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function formatDateChip(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === now.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return formatDateTime(date, locale, 'weekdayDayMonthYear')
}

function formatMessageTime(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return formatDateTime(date, locale, 'timePadded')
  }
  return formatDateTime(date, locale, 'dayMonth')
}

function formatLastSeen(dateStr: string, locale: string): string {
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
  return formatDateTime(date, locale, 'dayMonth')
}
