'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  X, Users, UserPlus, ScrollText, Crown, Shield, Wrench, Loader2,
  Check, Ban, VolumeX, Volume2, UserMinus, Trash2, Plus, ArrowUpRight,
} from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { communitiesApi, type Community, type CommunityMember, type CommunityRule } from '@/lib/api'
import { SkeletonRowList } from '../Skeletons'
import { useToast } from '@/hooks/use-toast'
import { DocsHelpLink } from '@/components/DocsHelpLink'

/**
 * Community moderation, for owners, admins and moderators.
 *
 * Every endpoint behind this already existed and had no caller, which meant a
 * community owner could not review join requests, change a role, mute, remove,
 * ban, edit the rules or hand over ownership from the web app at all — the only
 * moderation available was deleting the whole community.
 *
 * Capability is gated by the viewer's own role rather than by hiding the modal:
 * a moderator can mute (that is what the API allows them), an admin can also
 * change roles, remove and ban, and only the owner can transfer ownership.
 */

type Tab = 'members' | 'requests' | 'rules'

interface PendingRequest {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  requestedAt: string
}

const ROLE_BADGE: Record<string, { label: string; Icon: typeof Crown; className: string }> = {
  owner: { label: 'Owner', Icon: Crown, className: 'text-amber-500' },
  admin: { label: 'Admin', Icon: Shield, className: 'text-primary' },
  moderator: { label: 'Mod', Icon: Wrench, className: 'text-secondary' },
}

const MUTE_DURATIONS: { value: '1h' | '24h' | '7d'; label: string }[] = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
]

interface ModerationModalProps {
  community: Community
  onClose: () => void
  /** Called after a change that alters the community itself (rules, ownership). */
  onChanged?: () => void
}

export function ModerationModal({ community, onClose, onChanged }: ModerationModalProps): React.JSX.Element {
  const toast = useToast()
  const role = community.viewerRole ?? 'member'
  const isOwner = role === 'owner'
  const isAdmin = isOwner || role === 'admin'

  // Moderators land on Members (all they can act on); admins on Requests, which
  // is the queue that actually needs attention.
  const [tab, setTab] = useState<Tab>(isAdmin ? 'requests' : 'members')

  const TABS: { key: Tab; label: string; Icon: typeof Users; visible: boolean }[] = [
    { key: 'requests', label: 'Requests', Icon: UserPlus, visible: isAdmin },
    { key: 'members', label: 'Members', Icon: Users, visible: true },
    { key: 'rules', label: 'Rules', Icon: ScrollText, visible: isAdmin },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="flex items-center gap-2 font-headline text-headline-md text-on-surface">
            <Shield className="w-5 h-5 text-primary" />
            Manage
          </h2>
          <div className="flex items-center gap-1">
            <DocsHelpLink href="/docs/community-and-events#community-roles" />
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-2 border-b border-outline-variant/20">
          {TABS.filter((t) => t.visible).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${
                tab === t.key ? 'bg-primary/10 text-primary' : 'text-outline hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <t.Icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {tab === 'requests' && <RequestsTab communityId={community.id} toast={toast} />}
          {tab === 'members' && (
            <MembersTab
              communityId={community.id}
              isAdmin={isAdmin}
              isOwner={isOwner}
              toast={toast}
              onChanged={onChanged}
            />
          )}
          {tab === 'rules' && (
            <RulesTab communityId={community.id} rules={community.rules} toast={toast} onChanged={onChanged} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Join requests ────────────────────────────────────────────────────────────

type Toast = ReturnType<typeof useToast>

function RequestsTab({ communityId, toast }: { communityId: string; toast: Toast }): React.JSX.Element {
  const [requests, setRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    communitiesApi.requests(communityId)
      .then((r) => setRequests(r.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [communityId])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function act(userId: string, action: 'approve' | 'reject' | 'block', name: string): Promise<void> {
    setBusyId(userId)
    try {
      if (action === 'approve') await communitiesApi.approve(communityId, userId)
      else if (action === 'reject') await communitiesApi.reject(communityId, userId)
      else await communitiesApi.blockRequest(communityId, userId)

      setRequests((prev) => prev.filter((r) => r.id !== userId))
      toast.success(
        action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Blocked',
        action === 'approve' ? `${name} can now post here.` : `${name}'s request was ${action}ed.`,
      )
    } catch (e) {
      toast.error('Action failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <SkeletonRowList count={3} />
  if (requests.length === 0) {
    return (
      <div className="py-10 text-center">
        <UserPlus className="w-8 h-8 text-outline mx-auto mb-2" />
        <p className="text-label-md font-semibold text-on-surface">No pending requests</p>
        <p className="text-label-sm text-outline mt-0.5">New requests to join will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {requests.map((r) => (
        <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low">
          <UserAvatar name={r.displayName} image={r.avatarUrl ?? undefined} size="md" verified={r.isVerified} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-label-sm text-on-surface truncate">{r.displayName}</p>
            <p className="text-[11px] text-outline truncate">@{r.username}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {busyId === r.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-outline" />
            ) : (
              <>
                <button
                  onClick={() => void act(r.id, 'approve', r.displayName)}
                  title="Approve"
                  aria-label={`Approve ${r.displayName}`}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => void act(r.id, 'reject', r.displayName)}
                  title="Reject"
                  aria-label={`Reject ${r.displayName}`}
                  className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Reject lets them ask again; block is for repeat requests. */}
                <button
                  onClick={() => void act(r.id, 'block', r.displayName)}
                  title="Reject and block"
                  aria-label={`Reject and block ${r.displayName}`}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Members ──────────────────────────────────────────────────────────────────

function MembersTab({
  communityId, isAdmin, isOwner, toast, onChanged,
}: {
  communityId: string
  isAdmin: boolean
  isOwner: boolean
  toast: Toast
  onChanged?: (() => void) | undefined
}): React.JSX.Element {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      communitiesApi.members(communityId)
        .then((r) => {
          if (cancelled) return
          setMembers(r.data); setNextCursor(r.nextCursor); setHasMore(r.hasMore)
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [communityId])

  async function loadMore(): Promise<void> {
    if (!nextCursor) return
    const r = await communitiesApi.members(communityId, nextCursor)
    setMembers((prev) => {
      const seen = new Set(prev.map((m) => m.id))
      return [...prev, ...r.data.filter((m) => !seen.has(m.id))]
    })
    setNextCursor(r.nextCursor)
    setHasMore(r.hasMore)
  }

  async function run(
    member: CommunityMember,
    label: string,
    fn: () => Promise<unknown>,
    opts: { removeFromList?: boolean; newRole?: string } = {},
  ): Promise<void> {
    setBusyId(member.id)
    setOpenMenu(null)
    try {
      await fn()
      if (opts.removeFromList) {
        setMembers((prev) => prev.filter((m) => m.id !== member.id))
      } else if (opts.newRole) {
        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: opts.newRole! } : m)))
      }
      toast.success(label, `${member.displayName} — done.`)
      onChanged?.()
    } catch (e) {
      toast.error('Action failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <SkeletonRowList count={5} />

  return (
    <div className="space-y-1">
      {members.map((m) => {
        const badge = ROLE_BADGE[m.role]
        // The owner is never actionable from here — ownership moves by transfer.
        const actionable = m.role !== 'owner'

        return (
          <div key={m.id} className="rounded-xl hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3 px-2 py-2">
              <Link href={`/profile/${m.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <UserAvatar name={m.displayName} image={m.avatarUrl ?? undefined} size="md" verified={m.isVerified} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-label-sm text-on-surface truncate">{m.displayName}</p>
                  <p className="text-[11px] text-outline truncate">@{m.username}</p>
                </div>
              </Link>

              {badge && (
                <span className={`flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 ${badge.className}`}>
                  <badge.Icon className="w-3.5 h-3.5" />{badge.label}
                </span>
              )}

              {actionable && (
                busyId === m.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-outline flex-shrink-0" />
                ) : (
                  <button
                    onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                    aria-label={`Manage ${m.displayName}`}
                    className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                )
              )}
            </div>

            {openMenu === m.id && (
              <div className="px-2 pb-2.5 space-y-1.5">
                {/* Mute — the one action a moderator has. */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-outline mr-1">
                    <VolumeX className="w-3.5 h-3.5" />Mute
                  </span>
                  {MUTE_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => void run(m, `Muted for ${d.label}`, () => communitiesApi.muteMember(communityId, m.id, d.value))}
                      className="px-2.5 py-1 rounded-full border border-outline-variant/40 text-[11px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      {d.label}
                    </button>
                  ))}
                  <button
                    onClick={() => void run(m, 'Unmuted', () => communitiesApi.unmuteMember(communityId, m.id))}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/40 text-[11px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />Unmute
                  </button>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-outline mr-1">
                      <Shield className="w-3.5 h-3.5" />Role
                    </span>
                    {(['admin', 'moderator', 'member'] as const).map((r) => (
                      <button
                        key={r}
                        disabled={m.role === r}
                        onClick={() => void run(m, `Now ${r}`, () => communitiesApi.setRole(communityId, m.id, r), { newRole: r })}
                        className="px-2.5 py-1 rounded-full border border-outline-variant/40 text-[11px] font-semibold capitalize text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <button
                      onClick={() => void run(m, 'Removed', () => communitiesApi.removeMember(communityId, m.id), { removeFromList: true })}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/40 text-[11px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <UserMinus className="w-3 h-3" />Remove
                    </button>
                    {/* Remove lets them rejoin; ban does not. */}
                    <button
                      onClick={() => {
                        if (!window.confirm(`Ban ${m.displayName}? They won't be able to rejoin.`)) return
                        void run(m, 'Banned', () => communitiesApi.banMember(communityId, m.id), { removeFromList: true })
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-400/50 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Ban className="w-3 h-3" />Ban
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          if (!window.confirm(`Make ${m.displayName} the owner? You will become an admin and cannot undo this yourself.`)) return
                          void run(m, 'Ownership transferred', () => communitiesApi.transferOwnership(communityId, m.id))
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-400/50 text-[11px] font-semibold text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        <ArrowUpRight className="w-3 h-3" />Make owner
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {hasMore && (
        <button onClick={() => void loadMore()} className="w-full py-2 text-label-sm font-semibold text-outline hover:text-on-surface cursor-pointer">
          Load more
        </button>
      )}
    </div>
  )
}

// ── Rules ────────────────────────────────────────────────────────────────────

function RulesTab({
  communityId, rules, toast, onChanged,
}: {
  communityId: string
  rules: CommunityRule[]
  toast: Toast
  onChanged?: (() => void) | undefined
}): React.JSX.Element {
  const [draft, setDraft] = useState<{ title: string; body: string }[]>(
    () => rules.map((r) => ({ title: r.title, body: r.body ?? '' })),
  )
  const [saving, setSaving] = useState(false)

  const update = (i: number, patch: Partial<{ title: string; body: string }>): void =>
    setDraft((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))

  async function save(): Promise<void> {
    const cleaned = draft
      .map((r) => ({ title: r.title.trim(), body: r.body.trim() }))
      .filter((r) => r.title.length > 0)
      .map((r) => (r.body ? { title: r.title, body: r.body } : { title: r.title }))

    setSaving(true)
    try {
      await communitiesApi.setRules(communityId, cleaned)
      toast.success('Rules saved', 'Members will see them when they join.')
      onChanged?.()
    } catch (e) {
      toast.error('Could not save', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      {draft.length === 0 && (
        <p className="text-label-sm text-outline text-center py-6">
          No rules yet. Communities with clear rules get far fewer reports.
        </p>
      )}

      {draft.map((r, i) => (
        <div key={i} className="rounded-xl border border-outline-variant/30 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <input
              value={r.title}
              onChange={(e) => update(i, { title: e.target.value.slice(0, 120) })}
              placeholder="Rule title"
              aria-label={`Rule ${i + 1} title`}
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface placeholder:text-outline"
            />
            <button
              onClick={() => setDraft((prev) => prev.filter((_, idx) => idx !== i))}
              aria-label={`Delete rule ${i + 1}`}
              className="p-1.5 rounded-lg text-outline hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={r.body}
            onChange={(e) => update(i, { body: e.target.value.slice(0, 1000) })}
            rows={2}
            placeholder="What this means in practice (optional)"
            aria-label={`Rule ${i + 1} detail`}
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface placeholder:text-outline resize-none"
          />
        </div>
      ))}

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => setDraft((prev) => [...prev, { title: '', body: '' }])}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/40 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />Add rule
        </button>
        <button
          onClick={() => void save()}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{saving ? 'Saving…' : 'Save rules'}</span>
        </button>
      </div>
    </div>
  )
}
