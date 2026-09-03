'use client'

import { useEffect } from 'react'

/** One auto-reload per tab, ever. See the note in the update handler below. */
const SW_RELOADED_KEY = 'zk-sw-reloaded'

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
    // Only register in production — SW adds complexity to dev workflows.
    //
    // Opt back in locally with NEXT_PUBLIC_ENABLE_SW=true. Push notifications are
    // delivered by the service worker, so without an escape hatch they cannot be
    // exercised until they are already live, which is the worst place to discover
    // that they do not work.
    const forced = process.env.NEXT_PUBLIC_ENABLE_SW === 'true'
    if (process.env.NODE_ENV !== 'production' && !forced) return
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const register = (): void => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.warn('[ZoikoSocial SW] Registered:', reg.scope)

          /*
            Reload once when a new version takes over — and only once.

            sw.js calls skipWaiting() on install and clients.claim() on activate,
            so an update seizes control of open tabs immediately. A page loaded
            from the previous build then asks the new worker for chunks that
            build no longer has, which surfaces as a chunk-load error rather
            than anything legible. Reloading is the recovery.

            The guard is the important part. An unguarded reload here plus
            skipWaiting is the textbook infinite-refresh loop: every time the
            browser decides sw.js has changed, the tab reloads, registers, is
            told it changed again, and reloads forever — which presents as the
            app simply never opening, not as an error anyone can read.

            That is not hypothetical. /sw.js was being served with a four-hour
            CDN cache, so different edges could hand back different bytes of the
            same file and `updatefound` fired on more or less every load. The
            cache header is fixed in next.config.ts; this flag makes the loop
            impossible regardless of what the network does.

            sessionStorage, not a module variable: it has to survive the reload
            it triggers, and it clears when the tab closes so a genuine later
            update can still refresh.
          */
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing
            if (!installing) return

            installing.addEventListener('statechange', () => {
              if (installing.state !== 'installed') return
              // No previous controller means this is a first install, not an
              // update — there is nothing stale on screen to refresh.
              if (!navigator.serviceWorker.controller) return

              try {
                if (sessionStorage.getItem(SW_RELOADED_KEY)) {
                  console.warn('[ZoikoSocial SW] Update seen again — not reloading twice')
                  return
                }
                sessionStorage.setItem(SW_RELOADED_KEY, '1')
              } catch {
                // Storage unavailable (private mode, blocked site data). Refuse
                // to reload rather than risk an unguarded loop.
                return
              }

              console.warn('[ZoikoSocial SW] Update available — reloading once')
              window.location.reload()
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
