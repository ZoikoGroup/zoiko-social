'use client'

import { useEffect } from 'react'

/**
 * Registers the ZoikoSocial service worker (sw.js) on the client side.
 *
 * The service worker provides:
 *  - Cache-first loading of JS/CSS chunks (instant repeat visits)
 *  - Cache-first loading of Google Fonts
 *  - Stale-while-revalidate for user images (Supabase, R2)
 *  - Network-first for page navigations (fresh content, offline fallback)
 *  - Network-first for API calls (offline-capable)
 *
 * The SW file lives in `public/sw.js` and uses Workbox via CDN importScripts,
 * so it works with Turbopack without any build-step integration.
 *
 * Registration is deferred to idle time using requestIdleCallback so it never
 * competes with the initial render or user interaction.
 */
export function ServiceWorkerRegister(): React.JSX.Element {
  useEffect(() => {
    // Only register in production — SW adds complexity to dev workflows
    if (process.env.NODE_ENV !== 'production') return
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const register = (): void => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[ZoikoSocial SW] Registered:', reg.scope)

          // Detect updates and reload the page automatically when a new
          // version is available. This ensures users always run the latest code
          // without requiring a manual refresh.
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing
            if (!installing) return
            installing.addEventListener('statechange', () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version available — reload to activate it
                console.log('[ZoikoSocial SW] Update available — reloading...')
                window.location.reload()
              }
            })
          })
        })
        .catch((err) => {
          console.warn('[ZoikoSocial SW] Registration failed:', err)
        })
    }

    // Defer registration to idle time using requestIdleCallback with a
    // timeout fallback for browsers that don't support it.
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(register, { timeout: 3000 })
    } else {
      // Safari / older browsers: defer to macrotask queue
      setTimeout(register, 2000)
    }
  }, [])

  // This component renders nothing — it only registers the SW as a side effect
  return <></>
}
