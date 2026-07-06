'use client'

import { useEffect, useRef, useState } from 'react'

interface StoryProgressBarProps {
  durationMs: number
  active: boolean
  paused: boolean
  onComplete: () => void
}

export function StoryProgressBar({
  durationMs,
  active,
  paused,
  onComplete,
}: StoryProgressBarProps): React.JSX.Element {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)

  useEffect(() => {
    // Reset progress when deactivating
    if (!active) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      queueMicrotask(() => setProgress(0))
      elapsedRef.current = 0
      return
    }

    // Ensure progress is 0 on fresh activation
    queueMicrotask(() => setProgress(0))
    elapsedRef.current = 0

    if (paused) {
      // Record elapsed time before pause
      elapsedRef.current = performance.now() - startRef.current
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      return
    }

    // Resume or start: shift start time by already-elapsed amount
    const duration = Math.max(durationMs, 2000)
    startRef.current = performance.now() - elapsedRef.current

    function tick(now: number): void {
      const elapsed = now - startRef.current
      const pct = Math.min(elapsed / duration, 1)
      setProgress(pct)
      if (pct < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        onComplete()
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [active, paused, durationMs, onComplete])

  return (
    <div className="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden mx-0.5">
      <div
        className="h-full bg-white rounded-full transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
