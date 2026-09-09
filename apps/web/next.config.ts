import path from 'path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Points the plugin at the request config that resolves the locale per render.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// The API URL in ws form for Socket.IO — http://x → ws://x, https://x → wss://x
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
const apiWsUrl = apiUrl.replace(/^http/, 'ws')

// Cloudflare R2 public read domain (custom domain, e.g. https://media.zoikosocial.com).
// Presigned uploads always PUT to *.r2.cloudflarestorage.com regardless of this.
const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''

const nextConfig: NextConfig = {
  // Both must point to the monorepo root so Turbopack can follow pnpm symlinks
  // (the virtual store lives at <root>/node_modules/.pnpm/) and so that the
  // Vercel CLI file-tracing step runs from the same root it resolves paths
  // against — preventing the double-path ENOENT when vercel build runs from root.
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      /*
        The service worker script must never be held in a cache.

        Cloudflare applies a default edge TTL to .js and was serving /sw.js with
        `Cache-Control: public, max-age=14400`. Two consequences, both bad for a
        service worker: a deployed update could take four hours to reach anyone,
        and different edges could hand back different bytes of the same file — so
        the browser saw sw.js "change" load after load, fired `updatefound` each
        time, and the client's reload-on-update turned that into a refresh loop.

        Proof it was stale rather than theoretical: the cached /sw.js response
        carried a CSP missing a script-src host the live pages already had.

        This entry sits BEFORE the catch-all and adds only Cache-Control, so the
        security headers below still apply to /sw.js — Next merges matching
        entries rather than letting the first one win.

        The script only. Assets the worker caches are content hashed and should
        stay cacheable; it is the worker itself that has to be revalidated every
        time, which is what the spec expects.
      */
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(self), payment=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // photon.komoot.io: keyless place-autocomplete for location inputs
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} wss://*.supabase.co ${apiUrl} ${apiWsUrl} https://*.livekit.cloud wss://*.livekit.cloud https://*.r2.cloudflarestorage.com ${r2PublicUrl} https://photon.komoot.io https://open.er-api.com https://cloudflareinsights.com`,
              `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} *.r2.dev ${r2PublicUrl} images.unsplash.com`,
              `media-src 'self' blob: *.mux.com *.r2.dev ${r2PublicUrl}`,
              "style-src 'self' 'unsafe-inline'",
              // storage.googleapis.com: the service worker (public/sw.js) importScripts
              // Workbox from the Google CDN (workbox-cdn) and it pulls its runtime
              // modules from the same host; without this the SW fails to register.
              //
              // static.cloudflareinsights.com: Cloudflare Web Analytics. The
              // beacon is injected by Cloudflare at the edge, AFTER this app has
              // produced its response — so the app cannot choose not to load it,
              // and the only visible symptom was a CSP violation on every page
              // view. Listing it is what stops the console error; switching Web
              // Analytics off in the Cloudflare dashboard is the alternative, and
              // is the better answer if the data is not wanted.
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://storage.googleapis.com https://static.cloudflareinsights.com",
              "font-src 'self'",
              // openstreetmap.org: keyless embedded map, used by the event,
              // lost-and-found and vet-clinic detail pages.
              //
              // A second "frame-src 'none'" used to follow this line. Browsers
              // keep the first occurrence of a directive and ignore the rest, so
              // the maps kept working and the only symptom was a console warning
              // — but the two lines contradicted each other, and reordering them
              // would have blanked all three maps with no obvious cause.
              "frame-src 'self' https://www.openstreetmap.org",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async redirects() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/:path*',
            has: [{ type: 'host', value: 'www.zoikosocial.com' }],
            destination: 'https://zoikosocial.com/:path*',
            permanent: true,
          },
        ]
      : []
  },

  serverExternalPackages: ['@supabase/ssr'],
}

export default withNextIntl(nextConfig)
