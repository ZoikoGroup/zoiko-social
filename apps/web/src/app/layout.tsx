import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  // Resolved per request from the cookie, falling back to Accept-Language.
  // lang has to follow it: screen readers and browser translation both read it,
  // and a German page announcing lang="en" is read with English pronunciation.
  //
  // The flip side, and the reason for the <span>s wrapped around button labels
  // across this app: because lang now varies, the browser offers to translate
  // pages whose declared language differs from the reader's own. Accepting that
  // replaces our text nodes with the translator's, and React then throws
  // NotFoundError from insertBefore the next time it renders a spinner beside
  // one — the label it wants to insert before is no longer its child. A label
  // inside its own element is translated in place, so React keeps a child it
  // still recognises. Those wrappers look redundant; they are not.
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
