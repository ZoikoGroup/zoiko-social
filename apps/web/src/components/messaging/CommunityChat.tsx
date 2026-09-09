'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Pin, Megaphone, Timer, Users, ShieldCheck, Lock, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  messagingApi,
  type CommunityChatAccess,
  type CommunityChatMember,
  type PinnedMessage,
} from '@/lib/messaging-api'

/**
 * The parts of a chat that only exist because it belongs to a community.
 *
 * Kept out of MessageConversation on purpose. That component is already very
 * large, and everything here is inert for a DM — folding it in would mean five
 * more `isCommunity &&` branches through code that four other chat types share.
 */

// ── State ────────────────────────────────────────────────────────────────────

/**
 * Loads the viewer's standing in the room and keeps it current.
 *
 * `access` is refetched after every send because slow mode changes with each
 * message the viewer posts — the server is the only thing that knows when the
 * next one is allowed, and a client-side countdown would drift and then lie.
 */
export function useCommunityChat(conversationId: string | null, isCommunity: boolean) {
  // The id is stored WITH the data rather than cleared by an effect when the
  // conversation changes. Clearing would need a setState in an effect body, and
  // the frame before it ran would show the previous room's permissions — which
  // for a moment is a composer unlocked in a room that does not allow posting.
  const [state, setState] = useState<{
    id: string | null
    access: CommunityChatAccess | null
    pinned: PinnedMessage | null
  }>({ id: null, access: null, pinned: null })

  const load = useCallback(async (id: string) => {
    const [a, p] = await Promise.all([
      messagingApi.communityAccess(id),
      messagingApi.pinnedMessage(id).catch(() => null),
    ])
    return { id, access: a, pinned: p }
  }, [])

  const refresh = useCallback(async () => {
    if (!conversationId || !isCommunity) return
    try {
      setState(await load(conversationId))
    } catch {
      // A failure must not block the chat: the composer stays as it was and the
      // server refuses the send with the real reason if there is one.
    }
  }, [conversationId, isCommunity, load])

  useEffect(() => {
    if (!conversationId || !isCommunity) return
    let cancelled = false
    void (async () => {
      try {
        const next = await load(conversationId)
        if (!cancelled) setState(next)
      } catch {
        if (!cancelled) setState({ id: conversationId, access: null, pinned: null })
      }
    })()
    return () => { cancelled = true }
  }, [conversationId, isCommunity, load])

  // Only ever hand back data belonging to the conversation being asked about.
  const current = state.id === conversationId && isCommunity
  const setAccess = useCallback(
    (fn: (a: CommunityChatAccess | null) => CommunityChatAccess | null) =>
      setState((s) => ({ ...s, access: fn(s.access) })),
    [],
  )
  const setPinned = useCallback(
    (p: PinnedMessage | null) => setState((s) => ({ ...s, pinned: p })),
    [],
  )

  return {
    access: current ? state.access : null,
    pinned: current ? state.pinned : null,
    refresh,
    setAccess,
    setPinned,
  }
}

// ── Header ───────────────────────────────────────────────────────────────────

/**
 * What replaces "Active now" in a community chat.
 *
 * A room of hundreds has no single presence to report, and the two things a
 * member actually needs to know on entering are how big it is and whether they
 * are allowed to speak.
 */
export function CommunityHeaderInfo({
  membersCount,
  access,
  onOpenMembers,
}: {
  membersCount: number
  access: CommunityChatAccess | null
  onOpenMembers: () => void
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenMembers}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenMembers() }}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <Users className="size-3.5" />
        {membersCount.toLocaleString()} {membersCount === 1 ? 'member' : 'members'}
      </div>
      {access?.announcementOnly && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Megaphone className="size-3" />
          Announcements
        </span>
      )}
      {!!access?.slowModeSeconds && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400">
          <Timer className="size-3" />
          {formatSlow(access.slowModeSeconds)}
        </span>
      )}
      {access?.isMod && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary">
          <ShieldCheck className="size-3" />
          {titleCase(access.role)}
        </span>
      )}
    </div>
  )
}

function formatSlow(seconds: number): string {
  if (seconds < 60) return `${seconds}s slow mode`
  const mins = Math.round(seconds / 60)
  return `${mins}m slow mode`
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Pinned message ───────────────────────────────────────────────────────────

/** The bar under the header. One pin at a time, so its height never moves. */
export function CommunityPinnedBar({
  pinned,
  canUnpin,
  onJump,
  onUnpin,
}: {
  pinned: PinnedMessage
  canUnpin: boolean
  onJump: (messageId: string) => void
  onUnpin: () => void
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant/20 bg-surface-container/60">
      <Pin className="size-3.5 text-primary flex-shrink-0" />
      <button
        onClick={() => onJump(pinned.id)}
        className="flex-1 min-w-0 text-left cursor-pointer group"
      >
        <p className="text-[11px] font-semibold text-primary">Pinned by {pinned.senderName}</p>
        <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">
          {pinned.body ?? 'Attachment'}
        </p>
      </button>
      {canUnpin && (
        <Button
          onClick={onUnpin}
          variant="ghost"
          size="icon"
          className="size-7 rounded-full flex-shrink-0 text-muted-foreground hover:text-destructive"
          aria-label="Unpin message"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}

// ── Composer lock ────────────────────────────────────────────────────────────

const LOCK_COPY: Record<string, { title: string; detail: string }> = {
  chat_disabled: {
    title: 'Chat is off',
    detail: 'An admin has turned off chat for this community.',
  },
  announcement_only: {
    title: 'Only admins can post',
    detail: 'This community is in announcement mode. You can still read everything here.',
  },
  muted: {
    title: 'You are muted',
    detail: 'A moderator has muted you in this community.',
  },
  slow_mode: {
    title: 'Slow mode',
    detail: 'You can post again shortly.',
  },
}

/**
 * Replaces the composer when the viewer may not post.
 *
 * Deliberately says which lock is on rather than greying the box out. A disabled
 * input with no explanation is the single most common way a chat feels broken —
 * it was how the archived chats looked before they had a way out.
 */
export function CommunityComposerLock({
  reason,
  retryAfterSeconds,
}: {
  reason: string
  retryAfterSeconds: number
}): React.JSX.Element {
  // Seeded once from the prop. The parent gives this component a key derived
  // from the same number, so a new wait remounts it rather than needing an
  // effect to reset the count.
  const [remaining, setRemaining] = useState(retryAfterSeconds)

  useEffect(() => {
    if (retryAfterSeconds <= 0) return
    const timer = setInterval(() => setRemaining((r) => (r <= 1 ? 0 : r - 1)), 1000)
    return () => clearInterval(timer)
  }, [retryAfterSeconds])

  const copy = LOCK_COPY[reason] ?? { title: 'You cannot post here', detail: '' }
  const detail =
    reason === 'slow_mode' && remaining > 0 ? `You can post again in ${remaining}s.` : copy.detail

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container">
      <Lock className="size-4 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{copy.title}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </div>
    </div>
  )
}

// ── Members ──────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
  owner: 'bg-primary/15 text-primary',
  admin: 'bg-primary/15 text-primary',
  moderator: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
}

/** Who is in the room. Staff first — usually who the viewer came looking for. */
export function CommunityMembersSheet({
  conversationId,
  onClose,
}: {
  conversationId: string
  onClose: () => void
}): React.JSX.Element {
  const [members, setMembers] = useState<CommunityChatMember[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    messagingApi
      .communityMembers(conversationId)
      .then((m) => { if (!cancelled) setMembers(m) })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load members')
      })
    return () => { cancelled = true }
  }, [conversationId])

  return (
    <div className="absolute inset-0 z-30 bg-surface flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
        <h3 className="font-semibold text-foreground">Members</h3>
        <Button onClick={onClose} variant="ghost" size="icon" className="size-8 rounded-full" aria-label="Close members list">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {error ? (
          <p className="text-sm text-destructive p-4">{error}</p>
        ) : !members ? (
          <div className="flex justify-center p-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No members to show.</p>
        ) : (
          members.map((m) => (
            <Link
              key={m.id}
              href={`/profile/${m.username}`}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-container transition-colors"
            >
              <Avatar className="size-9">
                {m.avatarUrl ? (
                  <AvatarImage alt={m.displayName} src={m.avatarUrl} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {m.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{m.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">@{m.username}</p>
              </div>
              {m.isMuted && <span className="text-[11px] text-muted-foreground">Muted</span>}
              {ROLE_STYLE[m.role] && (
                <span className={cn('text-[11px] font-medium px-1.5 py-0.5 rounded', ROLE_STYLE[m.role])}>
                  {titleCase(m.role)}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

// ── Admin settings ───────────────────────────────────────────────────────────

const SLOW_CHOICES = [0, 5, 15, 30, 60, 300]

/**
 * The three switches an owner or admin has over the room.
 *
 * Saved one field at a time rather than as a whole form: two admins changing
 * different switches at once would otherwise have the second save revert the
 * first, silently.
 */
export function CommunityChatSettings({
  conversationId,
  access,
  onSaved,
  onError,
}: {
  conversationId: string
  access: CommunityChatAccess
  onSaved: (next: { chatEnabled: boolean; announcementOnly: boolean; slowModeSeconds: number }) => void
  onError: (message: string) => void
}): React.JSX.Element {
  const [saving, setSaving] = useState<string | null>(null)

  const save = useCallback(
    async (field: string, body: { chatEnabled?: boolean; announcementOnly?: boolean; slowModeSeconds?: number }) => {
      setSaving(field)
      try {
        const next = await messagingApi.updateCommunityChatSettings(conversationId, body)
        onSaved(next)
      } catch (e) {
        onError(e instanceof Error ? e.message : 'Could not save')
      } finally {
        setSaving(null)
      }
    },
    [conversationId, onSaved, onError],
  )

  const rows = useMemo(
    () => [
      {
        key: 'chatEnabled',
        Icon: Lock,
        label: 'Allow chat',
        detail: 'Turn off to close the room to everyone but admins.',
        checked: access.chatEnabled,
        toggle: () => void save('chatEnabled', { chatEnabled: !access.chatEnabled }),
      },
      {
        key: 'announcementOnly',
        Icon: Megaphone,
        label: 'Announcements only',
        detail: 'Only owners, admins and moderators can post. Everyone can still read.',
        checked: access.announcementOnly,
        toggle: () => void save('announcementOnly', { announcementOnly: !access.announcementOnly }),
      },
    ],
    [access, save],
  )

  return (
    <div className="p-4 space-y-3 border-t border-outline-variant/20">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Chat settings</p>

      {rows.map(({ key, Icon, label, detail, checked, toggle }) => (
        <button
          key={key}
          onClick={toggle}
          disabled={saving !== null}
          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Icon className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-foreground">{label}</span>
            <span className="block text-xs text-muted-foreground">{detail}</span>
          </span>
          <span
            className={cn(
              'mt-0.5 w-9 h-5 rounded-full flex-shrink-0 transition-colors relative',
              checked ? 'bg-primary' : 'bg-outline-variant',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-4 rounded-full bg-white transition-all',
                checked ? 'left-[18px]' : 'left-0.5',
              )}
            />
          </span>
        </button>
      ))}

      <div className="px-3 py-2.5 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Timer className="size-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Slow mode</p>
            <p className="text-xs text-muted-foreground">How long a member waits between messages.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SLOW_CHOICES.map((seconds) => (
            <button
              key={seconds}
              onClick={() => void save('slow', { slowModeSeconds: seconds })}
              disabled={saving !== null}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer',
                access.slowModeSeconds === seconds
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-foreground/80 hover:bg-surface-container-high',
              )}
            >
              {seconds === 0 ? 'Off' : seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
