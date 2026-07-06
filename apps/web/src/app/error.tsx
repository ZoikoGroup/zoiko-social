'use client'

import { useEffect } from 'react'

/**
 * Route-level error boundary. Without this, any uncaught render error paints a
 * blank white screen. This catches it, shows a recoverable UI, and offers a
 * "reset stored data" escape hatch for the classic stale-cache/stale-session
 * white screen (works in incognito → clear persisted state in the normal tab).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.JSX.Element {
  useEffect(() => {
    // Surface it in the console for diagnosis
    console.error('App error boundary caught:', error)
  }, [error])

  function hardReset(): void {
    try {
      sessionStorage.clear()
      // Clear our own cache key + any Supabase auth keys that may be corrupt
      Object.keys(localStorage)
        .filter((k) => k.startsWith('zk.') || k.startsWith('sb-'))
        .forEach((k) => localStorage.removeItem(k))
    } catch {
      /* ignore storage errors */
    }
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-on-surface">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">🐾</span>
        </div>
        <div className="space-y-1.5">
          <h1 className="font-headline text-headline-md">Something went wrong</h1>
          <p className="text-label-md text-on-surface-variant">
            The page hit an unexpected error. Try again, or reset your local data if it keeps happening.
          </p>
        </div>

        {process.env.NODE_ENV !== 'production' && (
          <pre className="text-left text-[11px] leading-relaxed bg-surface-container-low rounded-xl p-3 overflow-x-auto text-red-500 max-h-40">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ''}
          </pre>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try again
          </button>
          <button
            onClick={hardReset}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md font-semibold hover:bg-surface-container transition-colors cursor-pointer"
          >
            Reset & reload
          </button>
        </div>
      </div>
    </div>
  )
}
