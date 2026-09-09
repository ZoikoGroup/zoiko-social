'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowUp, PawPrint, ChevronDown, MapPin, Check, RefreshCw } from 'lucide-react'
import { PostComposer } from './PostComposer'
import { PostCard } from './PostCard'
import { NewsFeedCard } from './NewsFeedCard'
import { feedApi, lostFoundApi, type PostItem, type LostFoundReport, type NewsCardItem } from '@/lib/api'
import { getSocket } from '@/lib/socket'

// Topic tabs link to real hashtag discovery pages; For You shows the home feed.
// labelKey indexes the `feed` namespace, except lostFound which reuses the module
// name so the tab and the nav entry can never disagree.
const FEED_TABS: { labelKey: string; module?: boolean; tag?: string }[] = [
  { labelKey: 'forYou' },
  { labelKey: 'local', tag: 'local' },
  { labelKey: 'rescue', tag: 'rescue' },
  { labelKey: 'vetAdvice', tag: 'vetadvice' },
  { labelKey: 'lostFound', module: true, tag: 'lostandfound' },
]

function FeedTabs(): React.JSX.Element {
  const t = useTranslations('feed')
  const tm = useTranslations('modules')
  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/25 rounded-2xl px-3 py-2.5 shadow-sm overflow-x-auto no-scrollbar">
      {FEED_TABS.map((tab, i) => {
        const active = i === 0
        const isRescue = tab.labelKey === 'rescue'
        const label = tab.module ? tm(tab.labelKey) : t(tab.labelKey)
        const cls = `flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all cursor-pointer active:scale-[0.97] ${
          active
            ? 'bg-primary text-white border-primary shadow-sm'
            : isRescue
              ? 'bg-background text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
              : 'bg-background text-on-surface-variant border-outline-variant/40 hover:text-on-surface hover:border-outline-variant/70 hover:bg-surface-container-low'
        }`
        return tab.tag ? (
          <Link key={tab.labelKey} href={`/explore/tags/${tab.tag}`} className={cls}>{label}</Link>
        ) : (
          <span key={tab.labelKey} className={cls}>{label}</span>
        )
      })}
      <Link
        href="/explore"
        className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-[13px] font-semibold text-outline border border-outline-variant/30 bg-background hover:text-on-surface hover:border-outline-variant/60 transition-all active:scale-[0.97]"
      >
        {t('more')} <ChevronDown className="w-3.5 h-3.5" />
      </Link>
      {/* A "Filter feed" button used to sit here with no handler. Nothing backs
          it: GET /feed takes cursor and limit and no filter parameter at all,
          and the topic tabs to its left are the only filtering that exists. A
          control that cannot do what its label says is worse than no control,
          so it is gone until there is a filter to attach it to. */}
    </div>
  )
}

function LostPetAlert({ report }: { report: LostFoundReport }): React.JSX.Element {
  const t = useTranslations('feed')
  const name = report.petName ?? report.species
  return (
    <Link
      href={`/lost-found/${report.id}`}
      className="flex items-center gap-2.5 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 hover:bg-secondary/15 transition-colors"
    >
      <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
      <p className="flex-1 text-label-sm text-on-surface leading-snug">
        <span className="font-bold">{t('lostPetAlert')}</span>{' '}
        {/* One whole sentence per locale rather than English glued together —
            German puts the location before the verb. */}
        {report.lastSeenLocation
          ? t('lastSeenNear', { name, location: report.lastSeenLocation })
          : t('lostPetNamed', { name })}
      </p>
      <span className="text-label-sm font-semibold text-secondary flex-shrink-0 whitespace-nowrap">{t('viewDetails')} ›</span>
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
  const t = useTranslations('feed')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lostAlert, setLostAlert] = useState<LostFoundReport | null>(null)
  /**
   * News cards, at indices absolute to the accumulated post list.
   *
   * The server places them per page, so page two's "after index 4" means index
   * 19 once page one is already on screen. Converted on arrival rather than at
   * render time, because the offset is only knowable when the page lands.
   */
  const [newsCards, setNewsCards] = useState<{ afterIndex: number; article: NewsCardItem }[]>([])
  /** How many posts are on screen, for that conversion. */
  const postCountRef = useRef(0)
  const sentinelRef = useRef<HTMLDivElement>(null)

  /**
   * Index → articles, so the render is a lookup rather than a scan per post.
   *
   * A list per index rather than a single article, because two cards can end up
   * claiming the same slot: the server positions each page's overflow past that
   * page's last post, and a later page's posts can then occupy those same
   * indices. Keyed one-to-one, the second card silently replaced the first and
   * an article simply vanished from the feed.
   */
  const newsAt = useMemo(() => {
    const byIndex = new Map<number, NewsCardItem[]>()
    for (const { afterIndex, article } of newsCards) {
      const existing = byIndex.get(afterIndex)
      if (existing) existing.push(article)
      else byIndex.set(afterIndex, [article])
    }
    return byIndex
  }, [newsCards])

  const loadFirstPage = useCallback(async (): Promise<void> => {
    try {
      const page = await feedApi.home()
      setPosts(page.data)
      postCountRef.current = page.data.length
      setNewsCards(page.news ?? [])
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
      setNewPostsAvailable(false)
    } catch { /* keep whatever is shown */ } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Pulls the newest page in and returns to the top.
   *
   * Shared by the "new posts" pill and the end-of-feed control, because they
   * are the same request wearing two hats: one fires when the socket says
   * something arrived, the other when a reader who has reached the bottom asks
   * for themselves.
   *
   * The list is replaced rather than appended to. A refresh is a request for
   * what is current, and merging a fresh ranking into a stale one produces an
   * order that matches neither.
   *
   * Deliberately no skeleton, unlike the first load: the posts already on
   * screen stay put until the new ones are ready, so asking for the latest
   * never blanks the page you were reading.
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
              // Captured before the append: the new page's news indices are
              // relative to its own posts, and this is where they start.
              const base = postCountRef.current
              setPosts((prev) => {
                const seen = new Set(prev.map((p) => p.id))
                const fresh = page.data.filter((p) => !seen.has(p.id))
                postCountRef.current = prev.length + fresh.length
                return [...prev, ...fresh]
              })
              if (page.news?.length) {
                setNewsCards((prev) => {
                  // The server slices articles by page offset, but a dropped
                  // post shifts that arithmetic — so dedupe by id rather than
                  // trusting the slice never overlaps.
                  const seen = new Set(prev.map((n) => n.article.id))
                  const added = (page.news ?? [])
                    .filter((n) => !seen.has(n.article.id))
                    .map((n) => ({ ...n, afterIndex: base + n.afterIndex }))
                  return added.length > 0 ? [...prev, ...added] : prev
                })
              }
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
          onClick={() => { void refresh() }}
          className="sticky top-20 z-20 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
          <span>{t('newPosts')}</span>
        </button>
      )}

      {loading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-label-md font-bold text-on-surface mb-1">{t('quiet')}</h3>
            <p className="text-label-sm text-outline max-w-xs mx-auto mb-5">{t('quietBody')}</p>
            <button
              onClick={() => document.getElementById('home-composer-textarea')?.focus()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {t('shareFirst')}
            </button>
          </div>

          {/*
            News still belongs here. A member who follows nobody yet has the
            emptiest feed and the most reason to be given something to read —
            leaving the page at a single empty-state card was the wrong answer.
          */}
          {newsCards.map(({ article }) => (
            <NewsFeedCard key={article.id} article={article} />
          ))}
        </>
      ) : (
        <>
          {posts.map((post, i) => (
            <Fragment key={post.id}>
              <PostCard
                post={post}
                onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
              />
              {newsAt.get(i)?.map((article) => (
                <NewsFeedCard key={article.id} article={article} />
              ))}
            </Fragment>
          ))}
          {/*
            Cards whose slot falls beyond the last post — a page of three posts
            still earns one — would otherwise be computed by the server and
            silently dropped here.
          */}
          {newsCards
            .filter(({ afterIndex }) => afterIndex >= posts.length)
            .map(({ article }) => (
              <NewsFeedCard key={article.id} article={article} />
            ))}

          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <FeedSkeleton />}

          {/*
            The end of the feed, stated rather than implied.

            Without this the list simply stopped: no more posts, no sentinel
            firing, and nothing to say whether everything had been seen or the
            next page had failed. Reaching the bottom should read as finished,
            and it should offer the one thing wanted there — a way to check
            whether anything has arrived since.
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
        </>
      )}

      {lostAlert && <LostPetAlert report={lostAlert} />}
    </div>
  )
}
