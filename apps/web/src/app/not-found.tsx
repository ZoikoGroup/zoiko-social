import Link from 'next/link'
import type { Metadata } from 'next'

/**
 * The 404 page.
 *
 * Without this, an unmatched URL fell through to Next's built-in page — black
 * text on white, no navigation, no sign the visitor was still on ZoikoSocial. A
 * mistyped link or a deleted post left someone at a dead end with nothing to do
 * but press back.
 *
 * A server component on purpose: nothing here needs state or an effect, and a 404
 * is exactly the page that should not wait on a JavaScript bundle. It inherits the
 * root layout, so the header, theme and fonts come for free.
 */

export const metadata: Metadata = {
  title: 'Page not found',
  // Nothing here is worth indexing, and a soft-404 in search results is worse
  // than none at all.
  robots: { index: false, follow: true },
}

/** Somewhere useful to go, rather than only "go home". */
const SUGGESTIONS = [
  { href: '/', label: 'Home feed' },
  { href: '/explore', label: 'Explore' },
  { href: '/adoption', label: 'Adoption' },
  { href: '/lost-found', label: 'Lost & found' },
]

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">🐾</span>
        </div>

        <div className="space-y-1.5">
          <h1 className="font-headline text-headline-md text-on-surface">This page has wandered off</h1>
          <p className="text-label-md text-on-surface-variant">
            The link may be wrong, or whatever was here has since been removed.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3.5 py-2 rounded-lg bg-surface-container text-label-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to ZoikoSocial
        </Link>
      </div>
    </div>
  )
}
