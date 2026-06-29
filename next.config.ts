import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strict mode catches extra bugs in development
  reactStrictMode: true,

  // Security headers applied to every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Force HTTPS for 1 year, include subdomains
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Disable browser DNS prefetching
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable features not needed
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(self), payment=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Supabase API and realtime
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} wss://*.supabase.co`,
              // Supabase storage for images/media
              `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}`,
              // Inline styles needed for Next.js, nonces recommended for production
              "style-src 'self' 'unsafe-inline'",
              // Next.js requires unsafe-eval in development only
              process.env.NODE_ENV === 'development'
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
                : "script-src 'self'",
              "font-src 'self'",
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

  // Image domains allowed for next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Supabase storage CDN — set your project ref
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Redirect www to non-www in production
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

  // Moved out of experimental in Next.js 15+
  serverExternalPackages: ['@supabase/ssr'],
}

export default nextConfig
