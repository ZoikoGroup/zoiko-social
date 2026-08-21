/**
 * ZoikoSocial Service Worker
 *
 * Uses Workbox via CDN importScripts (no build step needed) to:
 *  - Cache JS/CSS chunks (Cache First — hashed filenames are immutable)
 *  - Cache Google Fonts (Cache First)
 *  - Cache images (Stale While Revalidate)
 *  - Serve navigation requests (Network First — fresh content, offline fallback)
 *
 * This decoupled file lives in public/ and is NOT processed by Turbopack,
 * keeping the build pipeline clean while still providing full offline/caching
 * benefits. The SW is automatically updated when this file changes (browser
 * checks for byte-diff updates every 24h by default).
 *
 * Workbox CDN: https://storage.googleapis.com/workbox-cdn/releases/6.6.1/workbox-sw.js
 *
 * ── Design decisions ────────────────────────────────────────────────────────
 * - API calls (all authenticated) are NOT cached to avoid serving stale
 *   user-specific data or leaking data between sessions.
 * - Root-level static assets (favicon, logo) use CacheFirst via the image
 *   route registered before the general StaleWhileRevalidate image route so
 *   they get the more aggressive caching strategy.
 * - On SW update, old caches from previous versions are cleaned up to prevent
 *   storage bloat.
 */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.6.1/workbox-sw.js',
)

// ── Debug mode ───────────────────────────────────────────────────────────────
// Logs Workbox actions to the browser console — enabled via URL param:
//   ?sw_debug=1
workbox.setConfig({ debug: self.location.search.includes('sw_debug=1') })

// ── Cache names (bump version to force a full cache reset) ───────────────────
const CACHE_VERSION = 'v1'
const CACHES = {
  static: `zk-static-${CACHE_VERSION}`,  // JS/CSS chunks + root assets
  fonts:  `zk-fonts-${CACHE_VERSION}`,   // Google Fonts
  images: `zk-images-${CACHE_VERSION}`,  // User content images
  pages:  `zk-pages-${CACHE_VERSION}`,   // Navigated pages (HTML)
}

// ── Expirations ──────────────────────────────────────────────────────────────
const ONE_DAY   = 24 * 60 * 60
const ONE_WEEK  = 7 * ONE_DAY
const ONE_MONTH = 30 * ONE_DAY

// ── Install + Activate ───────────────────────────────────────────────────────
// When the SW updates (new version deployed), activate immediately and take
// control of all open tabs so the user always gets the latest code without
// having to close/reopen the tab.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  // Clean up old caches from previous SW versions (prevents storage bloat)
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('zk-') && !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  )
  self.clients.claim()
})

// ── Strategy 1: Static assets in public/ root (Cache First) ──────────────────
// favicon, logo SVGs — register BEFORE the general image route so root-level
// files get CacheFirst instead of StaleWhileRevalidate.
workbox.routing.registerRoute(
  /\.(?:ico|svg)(?:\?.*)?$/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHES.static,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: ONE_MONTH,
      }),
    ],
  }),
)

// ── Strategy 2: Next.js static JS/CSS (Cache First) ──────────────────────────
// These filenames contain content hashes (e.g. chunk-abc123.js), so they are
// effectively immutable — once cached they never need revalidation.
workbox.routing.registerRoute(
  /\/_next\/static\//,
  new workbox.strategies.CacheFirst({
    cacheName: CACHES.static,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: ONE_MONTH,
      }),
    ],
  }),
)

// ── Strategy 3: Google Fonts (Cache First) ───────────────────────────────────
// Font files are referenced by their URL path which includes version/family,
// so they can be cached indefinitely.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
  new workbox.strategies.CacheFirst({
    cacheName: CACHES.fonts,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: ONE_MONTH,
      }),
    ],
  }),
)

// ── Strategy 4: User images (Stale While Revalidate) ─────────────────────────
// Supabase storage, R2, and external images. Serve the cached version
// instantly while refreshing it in the background on next visit.
// Note: .ico and .svg are excluded because they're served by Strategy 1
// with the more aggressive CacheFirst strategy.
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|gif|webp|avif)(?:\?.*)?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHES.images,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: ONE_WEEK,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// ── Strategy 5: Navigation requests (Network First) ──────────────────────────
// Pages should always show fresh content. If offline, serve the cached HTML.
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: CACHES.pages,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: ONE_DAY,
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// ── Push notifications ───────────────────────────────────────────────────────
// The server encrypts a small JSON payload to this browser's subscription keys.
// It is deliberately small — a push payload has a hard size limit — so this only
// gets what it needs to draw the notification and know where a tap should go.

self.addEventListener('push', (event) => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    // A push with no body, or a body that is not ours. Showing a generic
    // notification is better than showing nothing: on some browsers a push event
    // that displays no notification counts against the origin's permission.
    payload = {}
  }

  const title = payload.title || 'ZoikoSocial'
  const options = {
    body: payload.body || '',
    icon: '/zoikosocial-logo.png',
    badge: '/favicon.svg',
    // Same tag collapses related alerts instead of stacking twelve of them, and
    // renotify lets a newer one still surface rather than being silently merged.
    tag: payload.type || 'zoiko',
    renotify: true,
    data: { url: payload.url || '/notifications', id: payload.id, type: payload.type },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/notifications'

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

      // Prefer an open tab over a new one. Opening a second tab of an app the
      // member already has open is the most common way notifications become
      // annoying, and navigating the existing one keeps their place in the app.
      for (const client of clientList) {
        if ('focus' in client) {
          await client.focus()
          if ('navigate' in client) {
            try {
              await client.navigate(target)
            } catch {
              // Cross-origin or a client that refuses navigation — focusing it is
              // still the better outcome than a duplicate tab.
            }
          }
          return
        }
      }

      if (self.clients.openWindow) await self.clients.openWindow(target)
    })(),
  )
})

// A subscription can be rotated by the browser or the push service without the
// member doing anything. Without this the endpoint we hold goes stale and every
// later notification silently fails, so the page is told to re-subscribe.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of clientList) client.postMessage({ type: 'push-resubscribe' })
    })(),
  )
})

// ── Log registration success ─────────────────────────────────────────────────
console.log(
  `[ZoikoSocial SW] Active — caching static assets, fonts, images, and pages.`,
)
