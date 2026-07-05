'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Heart } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { FollowButton, initialFollowState } from '../FollowButton'
import { postsApi, type FollowerItem } from '@/lib/api'
import { SkeletonRowList } from '../Skeletons'

type Liker = FollowerItem & { likedAt: string }

interface LikersModalProps {
  open: boolean
  postId: string
  onClose: () => void
}

export function LikersModal({ open, postId, onClose }: LikersModalProps): React.JSX.Element | null {
  if (!open) return null
  return <LikersList postId={postId} onClose={onClose} />
}

function LikersList({ postId, onClose }: Omit<LikersModalProps, 'open'>): React.JSX.Element {
  const [likers, setLikers] = useState<Liker[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      postsApi.likers(postId)
        .then((page) => {
          if (cancelled) return
          setLikers(page.data as Liker[])
          setNextCursor(page.nextCursor)
          setHasMore(page.hasMore)
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [postId])

  async function loadMore(): Promise<void> {
    if (!nextCursor) return
    const page = await postsApi.likers(postId, nextCursor)
    setLikers((prev) => {
      const seen = new Set(prev.map((l) => l.id))
      return [...prev, ...(page.data as Liker[]).filter((l) => !seen.has(l.id))]
    })
    setNextCursor(page.nextCursor)
    setHasMore(page.hasMore)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="flex items-center gap-2 font-headline text-headline-md text-on-surface">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Likes
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <SkeletonRowList count={4} />
          ) : likers.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-8">No likes yet.</p>
          ) : (
            <div className="space-y-1">
              {likers.map((liker) => (
                <div key={liker.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors">
                  <Link href={`/profile/${liker.username}`} onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0">
                    <UserAvatar name={liker.displayName} image={liker.avatarUrl ?? undefined} size="md" verified={liker.isVerified} />
                    <div className="min-w-0">
                      <p className="font-semibold text-label-sm text-on-surface truncate">{liker.username}</p>
                      <p className="text-[11px] text-outline truncate">{liker.displayName}</p>
                    </div>
                  </Link>
                  {!liker.isMe && (
                    <FollowButton
                      userId={liker.id}
                      initialState={initialFollowState(liker)}
                      followsViewer={liker.followsViewer}
                      className="px-3 py-1.5 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full py-2 text-label-sm font-semibold text-outline hover:text-on-surface cursor-pointer"
                >
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
