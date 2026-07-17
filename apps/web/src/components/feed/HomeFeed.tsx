'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, PawPrint, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react'
import { PostComposer } from './PostComposer'
import { PostCard } from './PostCard'
import { feedApi, lostFoundApi, type PostItem, type LostFoundReport } from '@/lib/api'
import { getSocket } from '@/lib/socket'

// Topic tabs link to real hashtag discovery pages; For You shows the home feed.
const FEED_TABS: { label: string; tag?: string }[] = [
  { label: 'For You' },
  { label: 'Local', tag: 'local' },
  { label: 'Rescue', tag: 'rescue' },
  { label: 'Vet Advice', tag: 'vetadvice' },
  { label: 'Lost & Found', tag: 'lostandfound' },
]

function FeedTabs(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/25 rounded-2xl px-3 py-2.5 shadow-sm overflow-x-auto no-scrollbar">
      {FEED_TABS.map((t, i) => {
        const active = i === 0
        const isRescue = t.label === 'Rescue'
        const cls = `flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all cursor-pointer active:scale-[0.97] ${
          active
            ? 'bg-primary text-white border-primary shadow-sm'
            : isRescue
              ? 'bg-background text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
              : 'bg-background text-on-surface-variant border-outline-variant/40 hover:text-on-surface hover:border-outline-variant/70 hover:bg-surface-container-low'
        }`
        return t.tag ? (
          <Link key={t.label} href={`/explore/tags/${t.tag}`} className={cls}>{t.label}</Link>
        ) : (
          <span key={t.label} className={cls}>{t.label}</span>
        )
      })}
      <Link
        href="/explore"
        className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[13px] font-semibold text-outline border border-outline-variant/30 bg-background hover:text-on-surface hover:border-outline-variant/60 transition-all active:scale-[0.97]"
      >
        More <ChevronDown className="w-3.5 h-3.5" />
      </Link>
      <button className="ml-auto flex-shrink-0 flex items-center justify-center size-8 rounded-full text-outline hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer" aria-label="Filter feed">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}

function LostPetAlert({ report }: { report: LostFoundReport }): React.JSX.Element {
  return (
    <Link
      href={`/lost-found/${report.id}`}
      className="flex items-center gap-2.5 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 hover:bg-secondary/15 transition-colors"
    >
      <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
      <p className="flex-1 text-label-sm text-on-surface leading-snug">
        <span className="font-bold">Lost Pet Alert:</span>{' '}
        {report.petName ?? report.species}{report.lastSeenLocation ? ` was last seen near ${report.lastSeenLocation}` : ''}.
      </p>
      <span className="text-label-sm font-semibold text-secondary flex-shrink-0 whitespace-nowrap">View Details ›</span>
    </Link>
  )
}

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

export function HomeFeed(): React.JSX.Element {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)
  const [lostAlert, setLostAlert] = useState<LostFoundReport | null>(null)
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

  // Latest lost-pet report for the bottom alert banner
  useEffect(() => {
    let cancelled = false
    lostFoundApi.browse({ kind: 'lost' }, null, 1)
      .then((page) => { if (!cancelled && page.data[0]) setLostAlert(page.data[0]) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

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
      <PostComposer showLauncher onPosted={(post) => setPosts((prev) => [post, ...prev])} />

      <FeedTabs />

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
          <p className="text-label-sm text-outline max-w-xs mx-auto mb-5">
            Follow verified experts and organizations, or share your first update to connect with
            your community.
          </p>
          <button
            onClick={() => document.getElementById('home-composer-textarea')?.focus()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Share your first update
          </button>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <FeedSkeleton />}
        </>
      )}

      {lostAlert && <LostPetAlert report={lostAlert} />}
    </div>
  )
}
