import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, matchLocale } from './config'

/**
 * Resolves the locale for every server render.
 *
 * Order: the cookie the visitor chose, then what their browser asks for, then
 * English. Reading Accept-Language means a German browser gets German on the
 * first visit rather than after finding the setting.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const chosen = cookieStore.get(LOCALE_COOKIE)?.value

  let locale = DEFAULT_LOCALE
  if (isLocale(chosen)) {
    locale = chosen
  } else {
    const headerStore = await headers()
    locale = matchLocale(headerStore.get('accept-language'))
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Explicit so a formatted date does not silently follow the server's zone.
    // Overridden per-user once a timezone preference exists.
    now: new Date(),
  }
})
