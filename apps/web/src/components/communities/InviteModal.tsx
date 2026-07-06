'use client'

import { useEffect, useState } from 'react'
import { X, Search, Link2, Loader2, Check, UserPlus, Copy } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { communitiesApi, networkApi } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

interface InvitePerson {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

interface InviteModalProps {
  open: boolean
  communityId: string
  onClose: () => void
}

export function InviteModal({ open, communityId, onClose }: InviteModalProps): React.JSX.Element | null {
  if (!open) return null
  return <InviteSheet communityId={communityId} onClose={onClose} />
}

function InviteSheet({ communityId, onClose }: Omit<InviteModalProps, 'open'>): React.JSX.Element {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<InvitePerson[]>([])
  const [searching, setSearching] = useState(false)
  const [invited, setInvited] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [link, setLink] = useState<string | null>(null)
  const [creatingLink, setCreatingLink] = useState(false)
  const [copied, setCopied] = useState(false)

  // Default suggestions = people you follow; search overrides
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const q = search.trim()
    const timer = setTimeout(async () => {
      if (cancelled) return
      setSearching(true)
      try {
        const data = q.length >= 2
          ? await networkApi.search(q, 15)
          : (await networkApi.getFollowing(user.id, 1, 20)).data
        if (!cancelled) {
          setResults(data.map((p) => ({
            id: p.id, username: p.username, displayName: p.displayName,
            avatarUrl: p.avatarUrl, isVerified: p.isVerified,
          })))
        }
      } catch { /* ignore */ } finally {
        if (!cancelled) setSearching(false)
      }
    }, q ? 350 : 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [search, user])

  async function invite(person: InvitePerson): Promise<void> {
    if (invited.has(person.id) || busy.has(person.id)) return
    setBusy((p) => new Set(p).add(person.id))
    try {
      await communitiesApi.inviteUser(communityId, person.username)
      setInvited((p) => new Set(p).add(person.id))
    } catch { /* already member etc. */ } finally {
      setBusy((p) => { const n = new Set(p); n.delete(person.id); return n })
    }
  }

  async function makeLink(): Promise<void> {
    setCreatingLink(true)
    try {
      const result = await communitiesApi.createInviteLink(communityId, { expiresInDays: 7 })
      setLink(result.url)
    } catch { /* ignore */ } finally {
      setCreatingLink(false)
    }
  }

  async function copyLink(): Promise<void> {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[75vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="flex items-center gap-2 font-headline text-headline-md text-on-surface">
            <UserPlus className="w-5 h-5 text-primary" />Invite members
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people by name or username…"
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* People */}
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {searching ? (
            <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
          ) : results.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-6">
              {search ? 'No one matches.' : 'Search for people to invite.'}
            </p>
          ) : (
            <div className="space-y-1">
              {results.map((person) => {
                const sent = invited.has(person.id)
                const b = busy.has(person.id)
                return (
                  <div key={person.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors">
                    <UserAvatar name={person.displayName} image={person.avatarUrl ?? undefined} size="md" verified={person.isVerified} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-label-sm text-on-surface truncate">{person.username}</p>
                      <p className="text-[11px] text-outline truncate">{person.displayName}</p>
                    </div>
                    <button
                      onClick={() => invite(person)} disabled={sent || b}
                      className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        sent ? 'bg-surface-container text-on-surface-variant' : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-60'
                      }`}
                    >
                      {sent ? <><Check className="w-3.5 h-3.5" />Invited</> : b ? '…' : 'Invite'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Invite link */}
        <div className="border-t border-outline-variant/20 p-3">
          {link ? (
            <button onClick={copyLink} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-low text-label-sm hover:bg-surface-container transition-colors cursor-pointer">
              <Copy className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate flex-1 text-left text-outline">{copied ? 'Link copied!' : link}</span>
            </button>
          ) : (
            <button
              onClick={makeLink} disabled={creatingLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
            >
              {creatingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              Create invite link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
