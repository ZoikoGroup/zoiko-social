'use client'

import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { StoryProgressBar } from './StoryProgressBar'
import { StoryRefCard } from './StoryRefCard'
import { ReactionBar } from './ReactionBar'
import { UserAvatar } from '../UserAvatar'
import { storiesApi, trayApi, viewsApi, type StoryItem, type TrayRing } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

// Lazy-load HlsVideoPlayer (~40KB hls.js chunk) — most stories are images,
// so we only download it when the user actually reaches a video story.
const HlsVideoPlayerLazy = dynamic(
  () => import('./HlsVideoPlayer').then((mod) => mod.HlsVideoPlayer),
  { ssr: false },
)

interface StoryViewerProps {
  initialAuthorId: string
  onClose: () => void
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function StoryViewer({ initialAuthorId, onClose }: StoryViewerProps): React.JSX.Element {
  const { user } = useAuth()
  const [rings, setRings] = useState<TrayRing[]>([])
  const [ringIndex, setRingIndex] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  const [stories, setStories] = useState<StoryItem[]>([])
  const [loadingStory, setLoadingStory] = useState(false)
  const [paused, setPaused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const preloadedRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement>>(new Map())
  const [videoPaused, setVideoPaused] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Load tray rings
  useEffect(() => {
    let cancelled = false
    trayApi.get()
      .then((data) => {
        if (cancelled) return
        const idx = data.rings.findIndex((r) => r.author.id === initialAuthorId)
        setRings(data.rings)
        setRingIndex(idx >= 0 ? idx : 0)
      })
      .catch(() => { if (!cancelled) onClose() })
    return () => { cancelled = true }
  }, [initialAuthorId, onClose])

  // Derived current values for render
  const currentRing = rings[ringIndex]
  const currentStory = stories[storyIndex]

  // Reset video state on story index change
  useEffect(() => {
    queueMicrotask(() => { setVideoPaused(false); setVideoReady(false) })
  }, [storyIndex])

  // Fetch current ring's full stories
  const authorId = rings[ringIndex]?.author.id
  useEffect(() => {
    if (!authorId) return
    let cancelled = false
    queueMicrotask(() => setLoadingStory(true))
    trayApi.getUserRing(authorId)
      .then(async (ring) => {
        if (cancelled) return
        const ids = ring.stories.map((s) => s.id)
        const fullStories: StoryItem[] = await Promise.all(ids.map((id) => storiesApi.get(id)))
        if (!cancelled) {
          setStories(fullStories)
          setStoryIndex(0)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingStory(false) })
    return () => { cancelled = true }
  }, [authorId])

  // Record view on story change
  useEffect(() => {
    const s = stories[storyIndex]
    if (s && !s.viewerSeen) {
      void viewsApi.record(s.id, 100)
    }
  }, [storyIndex, stories])

  // (video state reset is now at the top of the ring-fetch effect)

  // Preload next story media (uses ref to avoid re-render thrash)
  useEffect(() => {
    const nextStory = stories[storyIndex + 1]
    if (!nextStory?.media?.[0]) return
    const m = nextStory.media[0]
    const url = m.imageUrl ?? m.hlsUrl ?? m.previewUrl
    if (!url || preloadedRef.current.has(url)) return
    preloadedRef.current.set(url, new Map() as never) // marker: preloaded
    if (m.type === 'video') {
      const vid = document.createElement('video')
      vid.preload = 'metadata'
      vid.src = url
    } else {
      const img = new Image()
      img.src = url
    }
  }, [storyIndex, stories])

  const goNext = useCallback(() => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1)
    } else if (ringIndex < rings.length - 1) {
      setRingIndex((i) => i + 1)
      setStoryIndex(0)
    } else {
      onClose()
    }
  }, [storyIndex, stories.length, ringIndex, rings.length, onClose])

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1)
    } else if (ringIndex > 0) {
      setRingIndex((i) => i - 1)
      // Switched ring — useEffect will re-fetch and start at first story
    }
  }, [storyIndex, ringIndex])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent): void {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'Escape') { onClose() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  // Touch handlers for swipe
  function handleTouchStart(e: React.TouchEvent): void {
    touchStartRef.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }
    longPressRef.current = setTimeout(() => setPaused(true), 300)
  }

  function handleTouchEnd(e: React.TouchEvent): void {
    if (longPressRef.current) clearTimeout(longPressRef.current)
    setPaused(false)
    if (!touchStartRef.current) return
    const dx = e.changedTouches[0]!.clientX - touchStartRef.current.x
    const dy = e.changedTouches[0]!.clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (Math.abs(dy) > 60 && dy > 0) { onClose(); return } // Swipe down to close
    if (Math.abs(dx) < 40) return // Not a horizontal swipe
    if (dx > 0) goPrev()
    else goNext()
  }

  function handleTapZone(e: React.MouseEvent<HTMLDivElement>): void {
    if (isVideo && videoReady) {
      // Toggle pause on video stories
      setVideoPaused((p) => !p)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.3) goPrev()
    else goNext()
  }

  async function deleteStory(): Promise<void> {
    if (!currentStory) return
    try {
      await storiesApi.delete(currentStory.id)
      setMenuOpen(false)
      goNext()
    } catch { /* ignore */ }
  }

  if (!currentRing) return <></>

  const isOwn = user?.id === currentRing.author.id
  const media = currentStory?.media?.[0]
  const mediaUrl = media?.imageUrl ?? media?.hlsUrl ?? media?.previewUrl
  const isVideo = currentStory?.type === 'video' && (media?.hlsUrl || media?.imageUrl?.endsWith('.mp4') || media?.type === 'video')
  const isTextStory = currentStory?.type === 'text'
  const isSharedStory = currentStory?.type === 'shared_post' || currentStory?.type === 'shared_professional_profile' || currentStory?.type === 'shared_community_post' || currentStory?.type === 'shared_marketplace_product'

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Background overlay — animated show */}
      <div className="absolute inset-0 bg-black/90 animate-fade-in" onClick={onClose} />

      {/* Story container */}
      <div
        className="relative w-full max-w-[420px] h-full max-h-[780px] mx-auto my-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loadingStory ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : currentStory ? (
          <>
            {/* Progress bars */}
            <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
              {stories.map((_, i) => (
                <StoryProgressBar
                  key={i}
                  durationMs={currentStory.durationMs}
                  active={i === storyIndex}
                  paused={paused || i > storyIndex}
                  onComplete={goNext}
                />
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-0 right-0 z-20 flex items-center gap-3 px-4">
              <Link href={`/profile/${currentRing.author.username}`} onClick={onClose}>
                <UserAvatar
                  name={currentRing.author.displayName}
                  image={currentRing.author.avatarUrl ?? undefined}
                  size="sm"
                  verified={currentRing.author.isVerified}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${currentRing.author.username}`}
                  onClick={onClose}
                  className="text-white text-[13px] font-semibold hover:underline"
                >
                  {currentRing.author.displayName}
                </Link>
                <p className="text-[11px] text-white/60">{timeAgo(currentStory.createdAt)}</p>
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-30">
                    {isOwn && (
                      <button
                        onClick={deleteStory}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-label-sm text-red-400 hover:bg-white/5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />Delete story
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Media */}
            <div className="absolute inset-0 flex items-center justify-center" onClick={handleTapZone}>
              {isTextStory ? (
                <div
                  className="w-full h-full flex items-center justify-center p-8"
                  style={{
                    background: (currentStory.background as { gradient?: string })?.gradient ?? 'linear-gradient(135deg, #066879, #E88924)',
                  }}
                >
                  <p className="text-white text-xl font-semibold text-center leading-relaxed max-w-xs break-words">
                    {currentStory.caption}
                  </p>
                </div>
              ) : isVideo && media?.hlsUrl ? (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                }>
                  <HlsVideoPlayerLazy
                    src={media.hlsUrl}
                    poster={media.previewUrl ?? media.thumbnailUrl}
                    muted={true}
                    showMuteToggle={true}
                    onTimeUpdate={(_current, _dur) => {
                      // Video progress tracked internally by StoryProgressBar
                    }}
                    onEnded={goNext}
                    onPlay={() => setVideoPaused(false)}
                    onPause={() => setVideoPaused(true)}
                    onReady={() => setVideoReady(true)}
                    paused={paused || videoPaused}
                  />
                </Suspense>
              ) : isSharedStory && currentStory.refType && currentStory.refId ? (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <div className="w-full max-w-xs">
                    <StoryRefCard
                      refType={currentStory.refType}
                      refId={currentStory.refId}
                      interactive={true}
                      onNavigate={onClose}
                    />
                  </div>
                </div>
              ) : mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt=""
                  className="w-full h-full object-contain select-none"
                  style={
                    media?.blurhash
                      ? { backgroundImage: `url('data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23066879"/></svg>')}')`, backgroundSize: 'cover' }
                      : undefined
                  }
                  draggable={false}
                />
              ) : (
                <p className="text-white/60 text-lg">{currentStory.caption}</p>
              )}
            </div>

            {/* Tap zones visual hints (subtle) */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[30%] z-10 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-[30%] z-10 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); goNext() }}
            />

            {/* Reaction bar */}
            {currentStory.allowReactions !== false && (
              <div className="absolute bottom-6 left-0 right-0 z-20 px-4">
                <ReactionBar
                  storyId={currentStory.id}
                  authorId={currentRing.author.id}
                  allowReplies={currentStory.allowReplies !== false}
                  onReply={(_msg) => {
                    // DM reply would go here — currently falls back to notification
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            Story not available
          </div>
        )}
      </div>
    </div>
  )
}
