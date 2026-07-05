'use client'

import { useEffect, useState } from 'react'
import { X, Search, Link2, Check, Send } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { networkApi, postsApi, type FollowerItem, type PostItem } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { SkeletonRowList } from '../Skeletons'

interface ShareModalProps {
  open: boolean
  post: PostItem
  onClose: () => void
}

export function ShareModal({ open, post, onClose }: ShareModalProps): React.JSX.Element | null {
  if (!open) return null
  return <ShareSheet post={post} onClose={onClose} />
}

function ShareSheet({ post, onClose }: Omit<ShareModalProps, 'open'>): React.JSX.Element {
  const { user } = useAuth()
  const [people, setPeople] = useState<FollowerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  // People you follow — the natural share audience
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const timer = setTimeout(() => {
      networkApi.getFollowing(user.id, 1, 50)
        .then((result) => { if (!cancelled) setPeople(result.data) })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [user])

  const filtered = search.trim()
    ? people.filter(
        (p) =>
          p.username.includes(search.toLowerCase()) ||
          p.displayName.toLowerCase().includes(search.toLowerCase()),
      )
    : people

  async function sendTo(person: FollowerItem): Promise<void> {
    if (sentIds.has(person.id) || busyIds.has(person.id)) return
    setBusyIds((prev) => new Set(prev).add(person.id))
    try {
      await postsApi.share(post.id, 'internal', [person.id])
      setSentIds((prev) => new Set(prev).add(person.id))
    } catch { /* keep row */ } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(person.id)
        return next
      })
    }
  }

  async function copyLink(): Promise<void> {
    try {
      const { url } = await postsApi.share(post.id, 'link')
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface">Share</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people you follow…"
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* People list */}
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {loading ? (
            <SkeletonRowList count={4} />
          ) : filtered.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-8">
              {people.length === 0
                ? 'Follow people to share posts with them.'
                : 'No one matches your search.'}
            </p>
          ) : (
            <div className="space-y-1">
              {filtered.map((person) => {
                const sent = sentIds.has(person.id)
                const busy = busyIds.has(person.id)
                return (
                  <div key={person.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors">
                    <UserAvatar name={person.displayName} image={person.avatarUrl ?? undefined} size="md" verified={person.isVerified} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-label-sm text-on-surface truncate">{person.username}</p>
                      <p className="text-[11px] text-outline truncate">{person.displayName}</p>
                    </div>
                    <button
                      onClick={() => sendTo(person)}
                      disabled={sent || busy}
                      className={`px-4 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        sent
                          ? 'bg-surface-container text-on-surface-variant'
                          : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-60'
                      }`}
                    >
                      {sent ? (<><Check className="w-3.5 h-3.5" />Sent</>) : busy ? '…' : (<><Send className="w-3.5 h-3.5" />Send</>)}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Copy link */}
        <div className="border-t border-outline-variant/20 p-3">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  )
}
