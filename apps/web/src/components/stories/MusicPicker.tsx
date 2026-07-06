'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Play, Pause, X, Music } from 'lucide-react'
import { musicApi, type MusicTrackMeta } from '@/lib/api'

interface MusicPickerProps {
  onSelect: (track: MusicTrackMeta) => void
  onRemove: () => void
  selectedTrack: MusicTrackMeta | null
}

export function MusicPicker({ onSelect, onRemove, selectedTrack }: MusicPickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<MusicTrackMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Track whether trending has been loaded to avoid re-fetching
  const trendingLoadedRef = useRef(false)

  useEffect(() => {
    if (!query.trim()) {
      queueMicrotask(() => setTracks([]))
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      queueMicrotask(() => setLoading(true))
      try {
        const result = await musicApi.search({ q: query, limit: 12 })
        if (!cancelled) setTracks(result.tracks)
      } catch {
        if (!cancelled) setTracks([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 350)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])

  // Load trending on first open
  useEffect(() => {
    if (open && !trendingLoadedRef.current && !query) {
      trendingLoadedRef.current = true
      queueMicrotask(() => setLoading(true))
      musicApi.trending(10)
        .then((items) => setTracks(items.map((i) => i.track)))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [open, query])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  function playPreview(track: MusicTrackMeta): void {
    if (playingId === track.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    if (audioRef.current) audioRef.current.pause()
    const url = track.previewUrl ?? track.audioUrl
    if (!url) return
    const audio = new Audio(url)
    audio.volume = 0.5
    audio.play().catch(() => {})
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(track.id)
  }

  return (
    <div className="relative">
      {selectedTrack ? (
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
          {selectedTrack.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedTrack.coverUrl} alt="" className="w-7 h-7 rounded object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-medium truncate">{selectedTrack.title}</p>
            <p className="text-white/50 text-[10px] truncate">{selectedTrack.artist}</p>
          </div>
          <button onClick={onRemove} className="p-1 rounded-full text-white/60 hover:bg-white/10 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium transition-colors cursor-pointer"
        >
          <Music className="w-3.5 h-3.5" />
          Music
        </button>
      )}

      {open && !selectedTrack && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 w-3.5 h-3.5" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks…"
                className="w-full pl-8 pr-3 py-1.5 bg-white/5 rounded-lg text-white text-[13px] placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : tracks.length === 0 ? (
              <p className="text-white/40 text-[12px] text-center py-6">
                {query ? 'No tracks found' : 'Type to search or see trending'}
              </p>
            ) : (
              tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => { onSelect(track); setOpen(false); audioRef.current?.pause(); setPlayingId(null) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); playPreview(track) }}
                    className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0 hover:bg-white/20 cursor-pointer"
                  >
                    {playingId === track.id ? (
                      <Pause className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white/70" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-medium truncate">{track.title}</p>
                    <p className="text-white/50 text-[11px] truncate">{track.artist}</p>
                  </div>
                  <span className="text-white/30 text-[10px]">
                    {Math.floor(track.durationMs / 60000)}:{String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
