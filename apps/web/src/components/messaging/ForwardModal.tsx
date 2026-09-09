'use client'

import { useMemo, useState } from 'react'
import { X, Search, Check, Loader2, Users, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/UserAvatar'
import type { Conversation } from '@/hooks/use-messaging'

/**
 * Picks where a message goes.
 *
 * Forward was two buttons wired to `() => {}` — one in the hover toolbar and one
 * in the long-press menu — with no endpoint behind them either. This is the
 * missing half.
 *
 * Capped at five targets, matching the server. Forwarding is the cheapest way to
 * blast identical content through an app, and an uncapped list turns one tap
 * into a broadcast.
 */

const MAX_TARGETS = 5

export function ForwardModal({
  conversations,
  currentConversationId,
  currentUserId,
  onClose,
  onForward,
}: {
  conversations: Conversation[]
  currentConversationId: string | null
  currentUserId: string
  onClose: () => void
  onForward: (conversationIds: string[]) => Promise<void>
}): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [sending, setSending] = useState(false)

  const options = useMemo(() => {
    // The conversation it came from is excluded: the server refuses it, and
    // offering a choice that always fails is worse than not offering it.
    const list = conversations.filter((c) => c.id !== currentConversationId && !c.isArchived)
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((c) => {
      const name = c.name ?? c.participants.find((p) => p.id !== currentUserId)?.displayName ?? ''
      return name.toLowerCase().includes(q)
    })
  }, [conversations, currentConversationId, currentUserId, query])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_TARGETS
          ? prev
          : [...prev, id],
    )
  }

  const submit = async () => {
    if (selected.length === 0 || sending) return
    setSending(true)
    try {
      await onForward(selected)
    } finally {
      setSending(false)
    }
  }

  const atLimit = selected.length >= MAX_TARGETS

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] flex flex-col bg-surface rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
          <h3 className="font-semibold text-foreground">Forward to…</h3>
          <Button onClick={onClose} variant="ghost" size="icon" className="size-8 rounded-full" aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container">
            <Search className="size-4 text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          {atLimit && (
            <p className="text-[11px] text-muted-foreground mt-1.5 px-1">
              You can forward to {MAX_TARGETS} chats at once.
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">
              {query ? 'No chats match that.' : 'No other chats to forward to.'}
            </p>
          ) : (
            options.map((c) => {
              const other = c.participants.find((p) => p.id !== currentUserId)
              const name = c.name ?? other?.displayName ?? 'Unknown'
              const isSelected = selected.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  disabled={!isSelected && atLimit}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                    isSelected ? 'bg-primary/10' : 'hover:bg-surface-container',
                  )}
                >
                  <UserAvatar name={name} image={c.avatarUrl ?? other?.avatarUrl ?? undefined} size="sm" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-foreground truncate">{name}</span>
                    {c.type !== 'dm' && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="size-3" />
                        {c.type === 'community' ? 'Community' : 'Group'}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'flex items-center justify-center size-5 rounded-full flex-shrink-0 border transition-colors',
                      isSelected ? 'bg-primary border-primary' : 'border-outline-variant',
                    )}
                  >
                    {isSelected && <Check className="size-3 text-white" />}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div className="p-3 border-t border-outline-variant/20">
          <Button onClick={() => void submit()} disabled={selected.length === 0 || sending} className="w-full gap-2">
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {selected.length === 0
              ? 'Select a chat'
              : `Forward to ${selected.length} ${selected.length === 1 ? 'chat' : 'chats'}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
