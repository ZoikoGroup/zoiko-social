'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, PawPrint } from 'lucide-react'
import { PostComposer } from './PostComposer'
import { PostCard } from './PostCard'
import { feedApi, type PostItem } from '@/lib/api'
import { getSocket } from '@/lib/socket'

function FeedSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" />
              <div className="h-2.5 w-16 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
          <div className="h-72 bg-surface-container animate-pulse" />
          <div className="px-4 py-3 space-y-2">
            <div className="h-3.5 w-24 bg-surface-container rounded animate-pulse" />
            <div className="h-3 w-56 bg-surface-container rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface HomeFeedProps {
  onShareToStory?: (refType: string, refId: string) => void
}

export function HomeFeed({ onShareToStory }: HomeFeedProps): React.JSX.Element {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadFirstPage = useCallback(async (): Promise<void> => {
    try {
      const page = await feedApi.home()
      setPosts(page.data)
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
      setNewPostsAvailable(false)
    } catch { /* keep whatever is shown */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => { void loadFirstPage() }, 0)
    return () => clearTimeout(timer)
  }, [loadFirstPage])

  // Realtime: someone I follow posted → show the "New posts" pill
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined

    void getSocket().then((socket) => {
      if (!socket || cancelled) return
      socket.emit('feed.subscribe')
      const onNew = (): void => setNewPostsAvailable(true)
      socket.on('post:new', onNew)
      cleanup = () => {
        socket.off('post:new', onNew)
        socket.emit('feed.unsubscribe')
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && nextCursor) {
          setLoadingMore(true)
          feedApi.home(nextCursor)
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

  return (
    <div className="space-y-4 relative">
      <PostComposer onPosted={(post) => setPosts((prev) => [post, ...prev])} />

      {/* New posts pill */}
      {newPostsAvailable && (
        <button
          onClick={() => { setLoading(true); void loadFirstPage() }}
          className="sticky top-20 z-20 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
          New posts
        </button>
      )}

      {loading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-label-md font-bold text-on-surface mb-1">Your feed is quiet</h3>
          <p className="text-label-sm text-outline max-w-xs mx-auto">
            Follow people from the network page, or share your first post above — your feed fills
            with posts from accounts you follow.
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
              {...(onShareToStory ? { onShareToStory } : {})}
            />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <FeedSkeleton />}
        </>
      )}
    </div>
  )
}
