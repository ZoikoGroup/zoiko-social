'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Users } from 'lucide-react'
import { PostComposer } from '../feed/PostComposer'
import { PostCard } from '../feed/PostCard'
import { feedApi, type PostItem } from '@/lib/api'

interface CommunityFeedProps {
  communityId: string
  isMember: boolean
}

function Skeleton(): React.JSX.Element {
  return <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 h-64 animate-pulse" />
}

export function CommunityFeed({ communityId, isMember }: CommunityFeedProps): React.JSX.Element {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadFirst = useCallback((): void => {
    setLoading(true)
    feedApi.community(communityId)
      .then((page) => { setPosts(page.data); setNextCursor(page.nextCursor); setHasMore(page.hasMore) })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [communityId])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!isMember) { setLoading(false); return }
      loadFirst()
    }, 0)
    return () => clearTimeout(t)
  }, [isMember, loadFirst])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loadingMore && nextCursor) {
        setLoadingMore(true)
        feedApi.community(communityId, nextCursor)
          .then((page) => {
            setPosts((prev) => {
              const seen = new Set(prev.map((p) => p.id))
              return [...prev, ...page.data.filter((p) => !seen.has(p.id))]
            })
            setNextCursor(page.nextCursor)
            setHasMore(page.hasMore)
          })
          .catch(() => {})
          .finally(() => setLoadingMore(false))
      }
    }, { rootMargin: '400px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [communityId, hasMore, nextCursor, loadingMore])

  if (!isMember) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <p className="text-label-md font-semibold text-on-surface">Join to view &amp; share posts</p>
        <p className="text-label-sm text-outline mt-1 max-w-sm mx-auto">
          This community&apos;s posts are for members. Join to see the latest and start posting.
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      <PostComposer communityId={communityId} onPosted={(post) => setPosts((prev) => [post, ...prev])} />

      {loading ? (
        <Skeleton />
      ) : posts.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-outline" />
          </div>
          <p className="text-label-md font-semibold text-on-surface">No posts yet</p>
          <p className="text-label-sm text-outline mt-1">Be the first to post in this community.</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))} />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <Skeleton />}
        </>
      )}
    </div>
  )
}
