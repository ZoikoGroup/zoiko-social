/**
 * Links from the landing site into the main app.
 *
 * The landing site and the app are separate deployments, so these have to be
 * absolute URLs. `NEXT_PUBLIC_APP_URL` is the same variable the web app's own
 * Vercel deploy uses; it must be inlined statically for Next to substitute it
 * at build time, so it is read once here rather than through a helper.
 */
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

/** Absolute URL for a path in the main app. */
export function appUrl(path: string): string {
  return `${APP_URL}${path}`
}

/**
 * Primary navigation. `Home` stays on the landing site; everything else is a
 * surface that only exists in the app.
 *
 * `Premium` is deliberately absent — the app has no premium or subscription
 * route yet, so there is nothing to point it at.
 */
export const NAV_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Discover', href: appUrl('/explore') },
  { label: 'Communities', href: appUrl('/communities') },
  { label: 'News', href: appUrl('/news') },
  { label: 'Events', href: appUrl('/events') },
  { label: 'Adopt', href: appUrl('/adoption') },
  { label: 'Market', href: appUrl('/shop') },
  { label: 'Premium', href: '#' },
  { label: 'Safety', href: appUrl('/docs/safety-and-trust') },
]

export const APP_LINKS = {
  /** Sign-up. Used by every "Join Free" call to action. */
  signUp: appUrl('/signup'),
  signIn: appUrl('/login'),
  /** The app root; it gates to /login and returns the visitor here after. */
  home: appUrl('/'),
  communities: appUrl('/communities'),
  news: appUrl('/news'),
  /** Help centre — the app's documentation index. */
  docs: appUrl('/docs'),
  safety: appUrl('/docs/safety-and-trust'),
  privacy: appUrl('/privacy'),
  terms: appUrl('/terms'),
} as const
