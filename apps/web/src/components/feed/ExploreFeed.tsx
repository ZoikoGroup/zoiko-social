'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Compass } from 'lucide-react'
import { PostCard } from './PostCard'
import { feedApi, type PostItem } from '@/lib/api'

function ExploreSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 h-80 animate-pulse" />
      ))}
    </div>
  )
}

/**
 * ExploreFeed — the discovery surface. Recent PUBLIC posts from public accounts
 * the viewer doesn't follow, so a public account reaches anyone on the platform.
 * No composer, no realtime pill — this is a browse/discover experience.
 */
export function ExploreFeed(): React.JSX.Element {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadFirstPage = useCallback(async (): Promise<void> => {
    try {
      const page = await feedApi.explore()
      setPosts(page.data)
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
    } catch { /* keep whatever is shown */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { void loadFirstPage() }, 0)
    return () => clearTimeout(timer)
  }, [loadFirstPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && nextCursor) {
          setLoadingMore(true)
          feedApi.explore(nextCursor)
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
      },
      { rootMargin: '400px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, nextCursor, loadingMore])

  if (loading) return <ExploreSkeleton />

  if (posts.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-label-md font-bold text-on-surface mb-1">Nothing to explore yet</h3>
        <p className="text-label-sm text-outline max-w-xs mx-auto">
          Public posts from across the platform will show up here as people share them.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
        />
      ))}
      <div ref={sentinelRef} className="h-1" />
      {loadingMore && <ExploreSkeleton />}
    </div>
  )
}
