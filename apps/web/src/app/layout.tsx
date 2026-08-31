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
  /*
    No `icons` here on purpose.
    
    This used to be `{ icon: '/favicon.svg' }`, and declaring it overrode the
    app/ icon file conventions entirely — /icon returned 404 and the only tag
    emitted pointed at a 335 KB "SVG" that was really a base64 PNG wrapped in an
    <svg>. Chromium does not render SVG favicons containing embedded raster
    images, so the tab showed nothing at all and there was no .ico to fall back to.

    favicon.ico, icon.png and apple-icon.png in app/ are picked up automatically
    and get correct rel, type and sizes attributes generated from the files
    themselves — which a hand-written declaration has to keep in sync by hand.
  */
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
  // The flip side: because lang now varies, the browser offers to translate any
  // page whose declared language differs from the reader's own — a reader on a
  // Spanish interface with an English browser gets offered exactly that.
  // Accepting it replaces our nodes with the translator's, and React then throws
  // NotFoundError from insertBefore on its next render, because the sibling it
  // wants to insert before is no longer its child.
  //
  // The <span>s wrapped around button labels across this app reduce that: a label
  // inside its own element is translated in place, so React keeps a child it
  // recognises. They look redundant; they are not. But they only cover labels,
  // while the translator restructures whole regions, so the crash returned on the
  // /network filter panel. translate="no" on the shell is what actually closes
  // it: this app ships six locales and its own picker, so machine-translating our
  // own chrome duplicates a feature we already provide.
  //
  // Scoped, not blanket. Other people's words — posts, bios, comments, messages —
  // opt back in with translate="yes", because our catalog will never cover those
  // and a reader may genuinely need them translated.
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} translate="no" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
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
