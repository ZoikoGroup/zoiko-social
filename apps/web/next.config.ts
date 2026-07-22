import path from 'path'
import type { NextConfig } from 'next'

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
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} wss://*.supabase.co ${apiUrl} ${apiWsUrl} https://*.livekit.cloud wss://*.livekit.cloud https://*.r2.cloudflarestorage.com ${r2PublicUrl} https://photon.komoot.io`,
              `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} *.r2.dev ${r2PublicUrl} images.unsplash.com`,
              `media-src 'self' blob: *.mux.com *.r2.dev ${r2PublicUrl}`,
              "style-src 'self' 'unsafe-inline'",
              // storage.googleapis.com: the service worker (public/sw.js) importScripts
              // Workbox from the Google CDN (workbox-cdn) and it pulls its runtime
              // modules from the same host; without this the SW fails to register.
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://storage.googleapis.com",
              "font-src 'self'",
              // openstreetmap.org: keyless embedded map (event location pin)
              "frame-src 'self' https://www.openstreetmap.org",
              "frame-src 'none'",
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

export default nextConfig
