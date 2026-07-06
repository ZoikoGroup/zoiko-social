'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { Volume2, VolumeX } from 'lucide-react'

export interface HlsVideoPlayerHandle {
  currentTime: number
  duration: number
  paused: boolean
}

interface HlsVideoPlayerProps {
  src: string
  poster?: string | null
  /** Called with currentTime/duration for progress tracking */
  onTimeUpdate?: (currentTime: number, duration: number) => void
  /** Called when playback ends */
  onEnded?: () => void
  /** Called when playback starts/resumes */
  onPlay?: () => void
  /** Called when playback pauses (including for buffering) */
  onPause?: () => void
  /** Called when media is loaded and ready */
  onReady?: () => void
  /** External pause control */
  paused?: boolean
  /** Start muted */
  muted?: boolean
  /** Show mute toggle */
  showMuteToggle?: boolean
  className?: string
}

export function HlsVideoPlayer({
  src,
  poster,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  onReady,
  paused: externalPaused,
  muted: initialMuted = true,
  showMuteToggle = true,
  className = '',
}: HlsVideoPlayerProps): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [muted, setMuted] = useState(initialMuted)
  const [canPlay, setCanPlay] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use refs for callback props to avoid recreating HLS on every render
  const onReadyRef = useRef(onReady)
  const onEndedRef = useRef(onEnded)
  const onPlayRef = useRef(onPlay)
  const onPauseRef = useRef(onPause)
  const onTimeUpdateRef = useRef(onTimeUpdate)

  // Sync refs after render — never access .current during render
  useEffect(() => {
    onReadyRef.current = onReady
    onEndedRef.current = onEnded
    onPlayRef.current = onPlay
    onPauseRef.current = onPause
    onTimeUpdateRef.current = onTimeUpdate
  })

  // Attach HLS or native playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setLoading(true)
    setError(null)

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      // hls.js path
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
      })
      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        setCanPlay(true)
        onReadyRef.current?.()
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad()
          } else {
            setError('Video playback error')
            hls.destroy()
            hlsRef.current = null
          }
        }
      })

      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    } else if (src.endsWith('.m3u8') && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari/iOS)
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        setLoading(false)
        setCanPlay(true)
        onReadyRef.current?.()
      })
      return () => {
        video.src = ''
      }
    } else {
      // Direct video file (mp4 fallback)
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        setLoading(false)
        setCanPlay(true)
        onReadyRef.current?.()
      })
      return () => {
        video.src = ''
      }
    }
  }, [src]) // Only depend on src — callbacks are via refs

  // External pause control
  useEffect(() => {
    const video = videoRef.current
    if (!video || !canPlay) return
    if (externalPaused) {
      void video.pause()
    } else {
      void video.play().catch(() => {})
    }
  }, [externalPaused, canPlay])

  // Time update events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTimeUpdate = (): void => onTimeUpdateRef.current?.(video.currentTime, video.duration || 30)
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, []) // Stable — uses ref

  const toggleMute = useCallback((): void => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
          <p className="text-white/70 text-sm">{error}</p>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        loop={false}
        muted={muted}
        poster={poster ?? undefined}
        preload="metadata"
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onError={() => setError('Failed to load video')}
      />

      {/* Mute toggle */}
      {showMuteToggle && canPlay && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}
