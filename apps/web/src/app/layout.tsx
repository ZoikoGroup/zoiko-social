import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ZoikoSocial',
  description: 'The professional community for animal lovers, rescuers, and pet care experts',
  icons: { icon: '/favicon.svg' },
}

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
const SUPABASE_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_URL

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* ── Resource Hints ────────────────────────────────────────────────
         * Preconnect early origins so the browser starts the TLS handshake
         * before the first fetch, saving ~100-150ms on initial load.
         *
         * fonts.gstatic.com: Google Fonts CDN — next/font/google inserts its
         *   own preconnect internally, but being explicit here ensures it's
         *   discovered even earlier by the HTML parser.
         * NEXT_PUBLIC_API_URL: NestJS API + Socket.IO server.
         * NEXT_PUBLIC_SUPABASE_URL: Supabase Auth + Realtime.
         */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {API_ORIGIN && <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />}
        {SUPABASE_ORIGIN && <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />}
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly etc.) inject attributes
          into <body> before React hydrates — only attribute diffs on this element are
          suppressed; child hydration mismatches still surface normally. */}
      <body className="font-body antialiased bg-background text-on-surface" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
