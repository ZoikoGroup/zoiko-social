import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
  reactStrictMode: true,
  async redirects() {
    // The landing page used to live at /home and was deployed there.
    // Keep those links working now that it is served at the root.
    return [{ source: '/home', destination: '/', permanent: true }]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
