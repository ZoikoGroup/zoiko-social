'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Search, MessageSquare, Plus, Users, CheckCheck, MoreHorizontal, Loader2, ArrowLeft,
  Pin, PinOff, Bell, BellOff, Archive, ArchiveRestore, Megaphone,
} from 'lucide-react'
import Link from 'next/link'
import { useDateFormat } from '@/hooks/use-date-format'
import { UserAvatar } from '@/components/UserAvatar'
import { GroupInvitations } from '@/components/messaging/GroupInvitations'
import { useMessaging } from '@/hooks/use-messaging'
import { usePresence } from '@/hooks/use-presence'
import { useAuth } from '@/hooks/use-auth'
import type { Conversation } from '@/hooks/use-messaging'
import { DocsHelpLink } from '@/components/DocsHelpLink'
import { messagingApi } from '@/lib/messaging-api'
import { MessageRequestsPanel } from '@/components/messaging/MessageRequestsPanel'
import { formatDateTime } from '@/lib/datetime'
import { useTranslations } from 'next-intl'

export type ChatTab = 'all' | 'groups' | 'communities'

interface ConnectedConversationListProps {
  activeTab: ChatTab
  onTabChange: (tab: ChatTab) => void
  selectedId: string | null
  onSelect: (id: string) => void
  onNewMessage: () => void
  unreadCount: number
}

function formatTime(dateStr: string, locale: string, nowLabel: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return nowLabel
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return formatDateTime(date, locale, 'dayMonth')
}

// A shared post is delivered as a DM whose body is just the post permalink —
// show a friendly label in the list instead of a raw URL (Instagram-style).
const SHARED_POST_URL = /^https?:\/\/\S+\/p\/[0-9a-f-]{16,}\/?$/i

/** Previews for the message kinds that carry no text at all. */
const BODYLESS_PREVIEW: Record<string, string> = {
  location: '📍 Location',
  poll: '📊 Poll',
}

function truncateMessage(body: string | null, senderId: string, currentUserId: string, sentLabel: string, youPrefix: string, postLabel: string, type?: string): string {
  // A shared location and a poll have a null body. Falling through to "sent a
  // message" was why a chat holding one still read "No messages yet".
  if (!body && type && BODYLESS_PREVIEW[type]) {
    const prefix = senderId === currentUserId ? `${youPrefix} ` : ''
    return `${prefix}${BODYLESS_PREVIEW[type]}`
  }
  if (!body) return sentLabel
  const prefix = senderId === currentUserId ? `${youPrefix} ` : ''
  if (SHARED_POST_URL.test(body.trim())) return `${prefix}${postLabel}`
  const cleaned = body.replace(/\n/g, ' ')
  return cleaned.length > 60 ? `${prefix}${cleaned.slice(0, 60)}…` : `${prefix}${cleaned}`
}

export function ConnectedConversationList({
  activeTab,
  onTabChange,
  selectedId,
  onSelect,
  onNewMessage,
  unreadCount,
}: ConnectedConversationListProps): React.JSX.Element {
  const t = useTranslations('messaging')
  const { conversations, isLoadingConversations, conversationsError, retryFetchConversations, markAllRead } = useMessaging()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  /*
   * Archiving a chat removed it from every tab and offered nothing that could
   * bring it back — the conversation was simply gone, along with the option to
   * unarchive it that lives in its own row menu.
   *
   * Archived chats now live behind a row at the top of the list, the way they do
   * in WhatsApp: it appears only when something is in there, and opening it shows
   * that list on its own.
   */
  const [showArchived, setShowArchived] = useState(false)

  const archivedCount = useMemo(
    () => conversations.filter((c) => c.isArchived).length,
    [conversations],
  )

  /*
   * Derived rather than stored: unarchiving the last chat should drop you back to
   * the list instead of leaving you staring at an empty archive. That is a fact
   * about the data, not an event to react to, so it needs no effect — and an
   * effect here would set state during render, which is the cascading-render
   * problem the lint rule exists to catch.
   */
  const inArchive = showArchived && archivedCount > 0

  // Filter conversations based on active tab and search
  const filtered = useMemo(() => {
    let list = [...conversations]

    if (inArchive) {
      // The archive ignores the tabs: it is a place, not another filter.
      list = list.filter((c) => c.isArchived)
    } else if (activeTab === 'all') {
      list = list.filter((c) => !c.isArchived)
    } else if (activeTab === 'groups') {
      list = list.filter((c) => c.type === 'group' && !c.isArchived)
    } else if (activeTab === 'communities') {
      list = list.filter((c) => c.type === 'community' && !c.isArchived)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          (c.participants ?? []).some((p) => p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)),
      )
    }

    return list
  }, [conversations, activeTab, searchQuery, inArchive])

  const TABS: { id: ChatTab; label: string; badge?: number }[] = [
    { id: 'all', label: t('all') },
    { id: 'groups', label: t('groups') },
    { id: 'communities', label: t('communities') },
  ]

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="hidden md:flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-on-surface">{t('title')}</h2>
          <div className="flex items-center gap-1.5">
            <DocsHelpLink href="/docs/messaging-and-calls#starting-a-conversation" />
            {unreadCount > 0 && (
              <button
                onClick={() => void markAllRead()}
                className="flex items-center justify-center size-9 rounded-full text-outline hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                title={t('markAllRead')}
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onNewMessage}
              className="flex items-center justify-center size-9 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
              title={t('newMessage')}
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-full text-[13.5px] font-medium border border-transparent focus:border-primary/40 focus:bg-surface-container-lowest focus:shadow-sm focus:outline-none transition-all placeholder:text-outline/60 placeholder:font-normal"
          />
        </div>

        {/* Segmented pill tabs */}
        <div className="flex gap-1 mt-3 p-1 bg-surface-container rounded-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
              {tab.id === 'all' && unreadCount > 0 && (
                <span className="min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {/* Pending group invitations (accept/reject inline) */}
        <div className="pt-2">
          <GroupInvitations variant="compact" />
        </div>
        {/* Held-back DMs from people the recipient's privacy settings filter. */}
        <MessageRequestsPanel />
        {isLoadingConversations ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-surface-container flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-surface-container rounded" />
                  <div className="h-2.5 w-48 bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 && activeTab === 'communities' && !searchQuery ? (
          <Link
            href="/communities"
            className="block p-8 text-center hover:bg-surface-container/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-outline" />
            </div>
            <p className="text-label-md text-outline mb-1">{t('noCommunities')}</p>
            <p className="text-[11px] text-primary font-semibold hover:underline">
              {t('joinCommunity')}
            </p>
          </Link>
        ) : conversationsError && !searchQuery ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            </div>
            <p className="text-label-md font-semibold text-on-surface mb-1">{t('serviceUnavailable')}</p>
            <p className="text-[11px] text-outline mb-2 max-w-[220px] mx-auto leading-relaxed">
              {t('serverDown')}
            </p>
            <p className="text-[10px] text-outline/60 mb-4 font-mono">{conversationsError}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => void retryFetchConversations()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-label-sm font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('tryAgain')}
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-5 h-5 text-outline" />
            </div>
            <p className="text-label-md text-outline mb-1">
              {searchQuery ? t('noConversationsFound') : t('noConversations')}
            </p>
            <p className="text-[11px] text-outline">
              {searchQuery ? t('tryDifferentSearch') : t('startConversation')}
            </p>
          </div>
        ) : (
          <>
            {/*
              The way back out of the archive. Shown at the top of the normal list when
              anything is in there, and as a header while inside it — so the archive is
              never somewhere you can enter and not leave.
            */}
            {inArchive ? (
              <button
                onClick={() => setShowArchived(false)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant/15"
              >
                <ArrowLeft className="w-4 h-4 text-outline flex-shrink-0" />
                <span className="text-label-sm font-semibold text-on-surface">{t('archived')}</span>
                <span className="ml-auto text-[11px] text-outline">{archivedCount}</span>
              </button>
            ) : (
              archivedCount > 0 && !searchQuery.trim() && (
                <button
                  onClick={() => setShowArchived(true)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant/15"
                >
                  <Archive className="w-4 h-4 text-outline flex-shrink-0" />
                  <span className="text-label-sm font-medium text-on-surface">{t('archived')}</span>
                  <span className="ml-auto text-[11px] font-semibold text-outline">{archivedCount}</span>
                </button>
              )
            )}

            {/* Pinned conversations */}
            {filtered.filter((c) => c.isPinned).length > 0 && (
              <>
                <div className="px-5 pt-3 pb-1">
                  <span className="text-[10.5px] font-bold text-outline/80 uppercase tracking-widest">📌 Pinned</span>
                </div>
                {filtered
                  .filter((c) => c.isPinned)
                  .map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isSelected={selectedId === conv.id}
                      currentUserId={user?.id ?? ''}
                      onSelect={onSelect}
                    />
                  ))}
                <div className="border-t border-outline-variant/15 mx-5 my-2" />
              </>
            )}

            {/* All conversations */}
            {filtered
              .filter((c) => !c.isPinned)
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isSelected={selectedId === conv.id}
                  currentUserId={user?.id ?? ''}
                  onSelect={onSelect}
                />
              ))}
          </>
        )}
      </div>
    </div>
  )
}

function ConversationItem({
  conv,
  isSelected,
  currentUserId,
  onSelect,
}: {
  conv: Conversation
  isSelected: boolean
  currentUserId: string
  onSelect: (id: string) => void
}): React.JSX.Element {
  const t = useTranslations('messaging')
  const { locale } = useDateFormat()
  const { subscribePresence, unsubscribePresence, getPresence, isUserTyping } = usePresence()

  useEffect(() => {
    if (conv.type !== 'dm') return
    const other = conv.participants?.find((p) => p.id !== currentUserId)
    if (!other) return
    subscribePresence(other.id)
    return () => unsubscribePresence(other.id)
  }, [conv.type, conv.participants, currentUserId, subscribePresence, unsubscribePresence])

  const isDM = conv.type === 'dm'
  const otherParticipant = isDM ? conv.participants?.find((p) => p.id !== currentUserId) : null
  const otherUserId = otherParticipant?.id
  const presence = otherUserId ? getPresence(otherUserId) : null
  const isOnline = presence?.isOnline ?? conv.isOnline
  const displayName = conv.name ?? otherParticipant?.displayName ?? t('unknown')
  const avatarUrl = conv.avatarUrl ?? otherParticipant?.avatarUrl ?? null
  const isVerified = otherParticipant?.isVerified ?? false
  const lastMsg = conv.lastMessage
  const lastMsgText = lastMsg ? truncateMessage(lastMsg.body, lastMsg.senderId, currentUserId, t('sentAMessage'), t('youPrefix'), t('sentAPost'), lastMsg.type) : t('noMessagesYet')
  const timeStr = lastMsg ? formatTime(lastMsg.createdAt, locale, t('now')) : ''
  const showOnline = isDM && isOnline
  const isTyping = otherUserId && conv.id ? isUserTyping(otherUserId, conv.id) : false

  return (
    <div className="relative group">
    <button
      onClick={() => onSelect(conv.id)}
      className={`w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors cursor-pointer text-left active:scale-[0.99] ${
        isSelected ? 'bg-primary/10' : 'hover:bg-surface-container active:bg-surface-container'
      }`}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar name={displayName} image={avatarUrl ?? undefined} size="md" verified={isVerified} />
        {showOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-surface-container-lowest rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <p
              className={`text-[14.5px] truncate leading-snug ${
                conv.unreadCount > 0 ? 'font-bold text-on-surface' : 'font-semibold text-on-surface'
              }`}
            >
              {displayName}
            </p>
            {conv.type === 'community' && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary flex-shrink-0 self-center">
                <Users className="w-2.5 h-2.5" />
                {conv.community?.membersCount ?? 0}
              </span>
            )}
            {conv.community?.announcementOnly && (
              <Megaphone className="w-3 h-3 text-amber-500 flex-shrink-0 self-center" />
            )}
          </div>
          <span className={`text-[11px] flex-shrink-0 ${conv.unreadCount > 0 ? 'text-primary font-semibold' : 'text-outline'}`}>{timeStr}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          {isTyping ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[12px] text-primary font-medium flex-shrink-0">typing</span>
              <div className="flex items-center gap-[3px]">
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
              </div>
            </div>
          ) : (
            <p className={`text-[12px] truncate flex-1 ${conv.unreadCount > 0 ? 'text-on-surface-variant font-medium' : 'text-outline'}`}>{lastMsgText}</p>
          )}
          {conv.isMuted && <BellOff className="w-3 h-3 text-outline flex-shrink-0" />}
          {conv.unreadCount > 0 && !conv.isMuted && (
            <span className="flex-shrink-0 min-w-[19px] h-[19px] px-1.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>

      {/* Pin / mute / archive lived only on the API until now. Kept outside the
          row button (buttons can't nest) and revealed on hover or focus. */}
      <ConversationActions conv={conv} />
    </div>
  )
}

function ConversationActions({ conv }: { conv: Conversation }): React.JSX.Element {
  const t = useTranslations('messaging')
  // Same refetch the error-retry path uses — pin/mute/archive all change the
  // list's ordering or filtering, so the list has to come back from the server.
  const { retryFetchConversations } = useMessaging()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function run(fn: () => Promise<unknown>): Promise<void> {
    setBusy(true)
    try {
      await fn()
      await retryFetchConversations()
    } catch {
      // The list simply doesn't change; the row is not the place for an error.
    } finally {
      setBusy(false)
      setOpen(false)
    }
  }

  const ACTIONS = [
    conv.isPinned
      ? { label: t('unpin'), Icon: PinOff, run: () => messagingApi.unpin(conv.id) }
      : { label: t('pin'), Icon: Pin, run: () => messagingApi.pin(conv.id) },
    conv.isMuted
      ? { label: t('unmute'), Icon: Bell, run: () => messagingApi.unmute(conv.id) }
      : { label: t('mute'), Icon: BellOff, run: () => messagingApi.mute(conv.id) },
    conv.isArchived
      ? { label: t('unarchive'), Icon: ArchiveRestore, run: () => messagingApi.unarchive(conv.id) }
      : { label: t('archive'), Icon: Archive, run: () => messagingApi.archive(conv.id) },
  ]

  /*
   * The menu is positioned from the button's place on screen rather than nested
   * inside the row.
   *
   * As a descendant it was drawn underneath the rows below it: each row's own
   * options button fades in and out, and an element mid-transition has its own
   * stacking context, so later rows painted over the open menu. It would also
   * have been clipped by the list's scroll box for the last conversation, where
   * the menu needs to sit outside the list entirely.
   */
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [anchor, setAnchor] = useState<{ right: number; top: number } | null>(null)

  const openMenu = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    setAnchor({ right: window.innerWidth - rect.right, top: rect.bottom + 6 })
    setOpen(true)
  }, [])

  // A menu pinned to a screen position stops matching its row the moment anything
  // moves, so it closes rather than following.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    // Capture phase: the list scrolls, not the window.
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-label={t('conversationOptions')}
        aria-expanded={open}
        className={`p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer ${
          open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
      </button>

      {/*
        Through a portal, not merely positioned.

        The wrapper above centres itself with -translate-y-1/2, and a transformed
        element becomes the containing block for any `fixed` descendant — so a menu
        placed at viewport coordinates was measured against that small box instead
        and landed off-screen. Escaping to the body makes those coordinates mean
        what they say, and clears the row stacking contexts and the list's scroll
        clipping at the same time.
      */}
      {open && anchor && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[61] w-40 py-1 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl animate-in fade-in zoom-in-95 duration-100"
            style={{ right: anchor.right, top: anchor.top }}
          >
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  // Close first: the list refetches and reorders underneath, so a
                  // menu still pinned to the old screen position would be pointing
                  // at whichever conversation had moved into that spot.
                  setOpen(false)
                  void run(a.run)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-label-sm text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <a.Icon className="w-3.5 h-3.5 text-outline" />
                {a.label}
              </button>
            ))}
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}


