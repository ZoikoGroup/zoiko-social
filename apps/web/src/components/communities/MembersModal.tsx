'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Users, Crown, Shield, Wrench } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { communitiesApi, type CommunityMember } from '@/lib/api'
import { SkeletonRowList } from '../Skeletons'

const ROLE_BADGE: Record<string, { label: string; Icon: typeof Crown; className: string }> = {
  owner: { label: 'Owner', Icon: Crown, className: 'text-amber-500' },
  admin: { label: 'Admin', Icon: Shield, className: 'text-primary' },
  moderator: { label: 'Mod', Icon: Wrench, className: 'text-secondary' },
}

interface MembersModalProps {
  open: boolean
  communityId: string
  memberCount: number
  onClose: () => void
}

export function MembersModal({ open, communityId, memberCount, onClose }: MembersModalProps): React.JSX.Element | null {
  if (!open) return null
  return <MembersList communityId={communityId} memberCount={memberCount} onClose={onClose} />
}

function MembersList({ communityId, memberCount, onClose }: Omit<MembersModalProps, 'open'>): React.JSX.Element {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      communitiesApi.members(communityId)
        .then((r) => { if (!cancelled) { setMembers(r.data); setNextCursor(r.nextCursor); setHasMore(r.hasMore) } })
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="flex items-center gap-2 font-headline text-headline-md text-on-surface">
            <Users className="w-5 h-5 text-primary" />
            {memberCount.toLocaleString()} members
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <SkeletonRowList count={5} />
          ) : members.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-8">No members to show.</p>
          ) : (
            <div className="space-y-1">
              {members.map((m) => {
                const badge = ROLE_BADGE[m.role]
                return (
                  <Link
                    key={m.id}
                    href={`/profile/${m.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <UserAvatar name={m.displayName} image={m.avatarUrl ?? undefined} size="md" verified={m.isVerified} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-label-sm text-on-surface truncate">{m.username}</p>
                      <p className="text-[11px] text-outline truncate">{m.displayName}</p>
                    </div>
                    {badge && (
                      <span className={`flex items-center gap-1 text-[11px] font-semibold ${badge.className}`}>
                        <badge.Icon className="w-3.5 h-3.5" />{badge.label}
                      </span>
                    )}
                  </Link>
                )
              })}
              {hasMore && (
                <button onClick={loadMore} className="w-full py-2 text-label-sm font-semibold text-outline hover:text-on-surface cursor-pointer">
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
