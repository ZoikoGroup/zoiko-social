/**
 * Locale configuration for the app.
 *
 * The locale comes from a cookie rather than a URL segment. next-intl supports
 * both, and the sub-path form (/de/settings) is the better choice for a public
 * marketing site because each language gets its own indexable URL. This app is
 * almost entirely behind a login, so that buys little, and it would mean
 * rewriting every internal href and every router.push across 197 files. The
 * cookie keeps the routing surface unchanged.
 *
 * If the landing site is ever translated, it should use sub-path routing — it
 * is public and its URLs matter.
 */

export const LOCALES = ['en', 'en-GB', 'es', 'fr', 'de', 'pt'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Cookie name. Read by the server on every request to pick the catalog. */
export const LOCALE_COOKIE = 'zoiko-locale'

/** A year: the choice should outlive the session it was made in. */
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'US English',
  'en-GB': 'UK English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
}

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value)
}

/**
 * Best match for an Accept-Language header, used the first time someone visits
 * and has no cookie yet. Exact matches win; otherwise the base language does, so
 * a browser asking for de-AT gets de rather than English.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { tag: tag.trim(), q: q ? Number(q.split('=')[1]) : 1 }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag
    const base = tag.split('-')[0]
    const match = LOCALES.find((l) => l === base || l.split('-')[0] === base)
    if (match) return match
  }
  return DEFAULT_LOCALE
}
