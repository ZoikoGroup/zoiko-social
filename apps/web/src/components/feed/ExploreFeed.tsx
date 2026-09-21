'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Compass, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PostCard } from './PostCard'
import { ScrollTopButton } from './ScrollTopButton'
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
  const t = useTranslations('feed')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
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

  /**
   * Pulls the newest page in and returns to the top — the same deal the home
   * feed offers at its end-of-feed card, since Explore is the same kind of
   * endless list wearing a different ranking.
   */
  const refresh = useCallback(async (): Promise<void> => {
    setRefreshing(true)
    try {
      await loadFirstPage()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setRefreshing(false)
    }
  }, [loadFirstPage])

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
    <div className="space-y-4 relative">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          surface="explore"
          onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
        />
      ))}
      <div ref={sentinelRef} className="h-1" />
      {loadingMore && <ExploreSkeleton />}

      {/*
        End of explore, stated rather than implied — the same treatment the
        home feed gives its own bottom, with the same way out.
      */}
      {!hasMore && !loadingMore && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-label-md font-bold text-on-surface mb-1">{t('caughtUp')}</h3>
          <p className="text-label-sm text-outline max-w-xs mx-auto mb-5">{t('caughtUpBody')}</p>
          <button
            onClick={() => { void refresh() }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('refreshing') : t('refresh')}
          </button>
        </div>
      )}

      <ScrollTopButton />
    </div>
  )
}
