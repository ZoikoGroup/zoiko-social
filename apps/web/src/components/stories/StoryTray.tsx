'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { trayApi, type TrayRing } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { getSocket } from '@/lib/socket'

interface StoryTrayProps {
  onOpenRing: (authorId: string, initialStoryIndex?: number) => void
  onOpenComposer: () => void
}

function RingSkeleton(): React.JSX.Element {
  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
          <div className="w-16 h-16 rounded-full bg-surface-container animate-pulse ring-2 ring-surface-container-lowest" />
          <div className="h-2.5 w-12 bg-surface-container rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function StoryTray({ onOpenRing, onOpenComposer }: StoryTrayProps): React.JSX.Element {
  const { profile } = useAuth()
  const [rings, setRings] = useState<TrayRing[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
      const data = await trayApi.get()
      if (signal?.aborted) return
      setRings(data.rings)
    } catch { /* keep empty */ } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const abort = new AbortController()
    queueMicrotask(() => { load(abort.signal).catch(() => {}) })
    return () => abort.abort()
  }, [load])

  // Realtime: new story → refresh tray
  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false

    void getSocket().then((socket) => {
      if (!socket || cancelled) return
      socket.emit('tray.subscribe')
      const onNew = () => { void load() }
      const onExpire = () => { void load() }
      socket.on('story:new', onNew)
      socket.on('story:expire', onExpire)
      cleanup = () => {
        socket.off('story:new', onNew)
        socket.off('story:expire', onExpire)
        socket.emit('tray.unsubscribe')
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [load])

  const ownRing = rings.find((r) => r.author.id === profile?.id)
  const otherRings = rings.filter((r) => r.author.id !== profile?.id)
  const hasAnyStories = ownRing && ownRing.stories.length > 0

  if (loading) return <RingSkeleton />

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div ref={scrollRef} className="flex items-center gap-3 px-4 py-[14px] overflow-x-auto no-scrollbar">
        {/* Your Story — always first. Tap avatar to VIEW (if you have one); ＋ always adds. */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[72px]">
          <div className="relative">
            <button
              onClick={() => (hasAnyStories && profile ? onOpenRing(profile.id) : onOpenComposer())}
              className="block cursor-pointer group"
              aria-label={hasAnyStories ? 'View your story' : 'Add story'}
            >
              <div className={`w-[64px] h-[64px] rounded-full transition-all ${hasAnyStories ? 'p-[2px] bg-gradient-to-tr from-primary via-secondary to-primary group-hover:brightness-110' : ''}`}>
                <div className={`w-full h-full rounded-full overflow-hidden ${hasAnyStories ? 'ring-[2px] ring-surface-container-lowest' : 'ring-2 ring-outline-variant'}`}>
                  {profile ? (
                    <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="xl" verified={false} />
                  ) : (
                    <div className="w-full h-full bg-surface-container" />
                  )}
                </div>
              </div>
            </button>
            {/* ＋ badge — always opens the composer to add a new story */}
            <button
              onClick={onOpenComposer}
              className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-primary border-[2.5px] border-surface-container-lowest flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
              aria-label="Add story"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <span className="text-[11px] text-on-surface-variant font-medium truncate w-full text-center leading-tight">
            {hasAnyStories ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Other rings */}
        {otherRings.map((ring) => {
          return (
            <button
              key={ring.author.id}
              onClick={() => onOpenRing(ring.author.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[72px] group cursor-pointer"
            >
              <div className={`w-[64px] h-[64px] rounded-full p-[2px] ${ring.hasUnseen ? 'bg-gradient-to-tr from-primary via-secondary to-primary' : 'bg-outline-variant'} transition-all duration-200 group-hover:brightness-110`}>
                <div className="w-full h-full rounded-full overflow-hidden ring-[2px] ring-surface-container-lowest">
                  <UserAvatar
                    name={ring.author.displayName}
                    image={ring.author.avatarUrl ?? undefined}
                    size="xl"
                    verified={ring.author.isVerified}
                  />
                </div>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium truncate w-full text-center leading-tight">
                {ring.author.displayName.split(' ')[0]}
              </span>
            </button>
          )
        })}

        {/* Empty state */}
        {rings.length === 0 && (
          <p className="text-label-sm text-outline py-8 text-center w-full">
            No stories yet — follow people to see theirs, or add your own
          </p>
        )}
      </div>
    </div>
  )
}
