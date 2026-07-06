'use client'

import { useEffect } from 'react'

/**
 * Root error boundary — catches errors thrown in the root layout/providers
 * themselves (which the route-level error.tsx cannot). It replaces the whole
 * document, so it must render its own <html>/<body> with inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.JSX.Element {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  function hardReset(): void {
    try {
      sessionStorage.clear()
      Object.keys(localStorage)
        .filter((k) => k.startsWith('zk.') || k.startsWith('sb-'))
        .forEach((k) => localStorage.removeItem(k))
    } catch {
      /* ignore */
    }
    window.location.href = '/'
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0b0b0f',
          color: '#e7e7ea',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>Something went wrong</h1>
          <p style={{ fontSize: 14, opacity: 0.7, margin: '0 0 20px' }}>
            The app failed to load. Reset your local data if this keeps happening.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                background: '#7c3aed',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              onClick={hardReset}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1px solid #3a3a42',
                background: 'transparent',
                color: '#e7e7ea',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset &amp; reload
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
