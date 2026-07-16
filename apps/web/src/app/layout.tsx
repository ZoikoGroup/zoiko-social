import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

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
        {/* TLS handshakes start before the first fetch — saves ~100ms on first request */}
        {API_ORIGIN && <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />}
        {SUPABASE_ORIGIN && <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />}
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly etc.) inject attributes
          into <body> before React hydrates — only attribute diffs on this element are
          suppressed; child hydration mismatches still surface normally. */}
      <body className="font-body antialiased bg-background text-on-surface" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
