'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, MessageSquare, Plus, Users, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { UserAvatar } from '@/components/UserAvatar'
import { useMessaging } from '@/hooks/use-messaging'
import { usePresence } from '@/hooks/use-presence'
import { useAuth } from '@/hooks/use-auth'
import type { Conversation } from '@/hooks/use-messaging'

export type ChatTab = 'all' | 'groups' | 'communities'

interface ConnectedConversationListProps {
  activeTab: ChatTab
  onTabChange: (tab: ChatTab) => void
  selectedId: string | null
  onSelect: (id: string) => void
  onNewMessage: () => void
  unreadCount: number
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function truncateMessage(body: string | null, senderId: string, currentUserId: string): string {
  if (!body) return 'Sent a message'
  const prefix = senderId === currentUserId ? 'You: ' : ''
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
  const { conversations, isLoadingConversations, conversationsError, retryFetchConversations, markAllRead } = useMessaging()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter conversations based on active tab and search
  const filtered = useMemo(() => {
    let list = [...conversations]

    // Tab filter
    if (activeTab === 'all') {
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
          c.participants.some((p) => p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)),
      )
    }

    return list
  }, [conversations, activeTab, searchQuery])

  const TABS: { id: ChatTab; label: string; badge?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'groups', label: 'Groups' },
    { id: 'communities', label: 'Communities' },
  ]

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-outline-variant/20 flex-shrink-0">
        <div className="hidden md:flex items-center justify-between mb-3">
          <h2 className="font-headline text-headline-md text-on-surface">Messages</h2>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => void markAllRead()}
                className="p-2 rounded-lg text-outline hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onNewMessage}
              className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="New message"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-9 pr-3 py-2 bg-surface-container rounded-lg text-label-md border border-transparent focus:border-primary focus:outline-none transition-colors placeholder:text-outline/60"
          />
        </div>
      </div>

      {/* Tabs - scrollable on very small screens */}
      <div className="flex border-b border-outline-variant/20 overflow-x-auto no-scrollbar flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 md:py-3 text-label-sm font-semibold border-b-2 transition-colors cursor-pointer relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
            {tab.id === 'all' && unreadCount > 0 && (
              <span className="w-4 h-4 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
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
            <p className="text-label-md text-outline mb-1">No communities</p>
            <p className="text-[11px] text-primary font-semibold hover:underline">
              Join a community
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
            <p className="text-label-md font-semibold text-on-surface mb-1">Service Unavailable</p>
            <p className="text-[11px] text-outline mb-2 max-w-[220px] mx-auto leading-relaxed">
              The messaging server is not running. Other parts of the app still work.
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
                Try Again
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-5 h-5 text-outline" />
            </div>
            <p className="text-label-md text-outline mb-1">
              {searchQuery ? 'No conversations found' : activeTab === 'all' ? 'No conversations yet' : `No ${activeTab} yet`}
            </p>
            <p className="text-[11px] text-outline">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        ) : (
          <>
            {/* Pinned conversations */}
            {filtered.filter((c) => c.isPinned).length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Pinned</span>
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
                <div className="border-t border-outline-variant/10 mx-4 my-1" />
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
  const { subscribePresence, unsubscribePresence, getPresence, isUserTyping } = usePresence()

  useEffect(() => {
    if (conv.type !== 'dm') return
    const other = conv.participants.find((p) => p.id !== currentUserId)
    if (!other) return
    subscribePresence(other.id)
    return () => unsubscribePresence(other.id)
  }, [conv.type, conv.participants, currentUserId, subscribePresence, unsubscribePresence])

  const isDM = conv.type === 'dm'
  const otherParticipant = isDM ? conv.participants.find((p) => p.id !== currentUserId) : null
  const otherUserId = otherParticipant?.id
  const presence = otherUserId ? getPresence(otherUserId) : null
  const isOnline = presence?.isOnline ?? conv.isOnline
  const displayName = conv.name ?? otherParticipant?.displayName ?? 'Unknown'
  const avatarUrl = conv.avatarUrl ?? otherParticipant?.avatarUrl ?? null
  const isVerified = otherParticipant?.isVerified ?? false
  const lastMsg = conv.lastMessage
  const lastMsgText = lastMsg ? truncateMessage(lastMsg.body, lastMsg.senderId, currentUserId) : 'No messages yet'
  const timeStr = lastMsg ? formatTime(lastMsg.createdAt) : ''
  const showOnline = isDM && isOnline
  const isTyping = otherUserId && conv.id ? isUserTyping(otherUserId, conv.id) : false

  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 border-b border-outline-variant/10 transition-colors cursor-pointer text-left active:bg-surface-container ${
        isSelected ? 'bg-primary/5' : 'hover:bg-surface-container'
      }`}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar name={displayName} image={avatarUrl ?? undefined} size="sm" verified={isVerified} />
        {showOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-label-md truncate ${
              conv.unreadCount > 0 ? 'font-bold text-on-surface' : 'font-semibold text-on-surface'
            }`}
          >
            {displayName}
          </p>
          <span className="text-[10px] text-outline flex-shrink-0">{timeStr}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {isTyping ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] text-primary font-medium flex-shrink-0">typing</span>
              <div className="flex items-center gap-[3px]">
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
                <span className="typing-dot w-[4px] h-[4px] rounded-full bg-primary" />
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-outline truncate flex-1">{lastMsgText}</p>
          )}
          {conv.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}


