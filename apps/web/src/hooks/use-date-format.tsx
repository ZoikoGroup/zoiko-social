'use client'

import { useCallback } from 'react'
import { useLocale } from 'next-intl'
import { formatClock, formatDateTime, formatRelativeTime, type DateStyle } from '@/lib/datetime'

/**
 * Date formatting bound to the locale the visitor chose.
 *
 * Prefer this in components. The pure functions in lib/datetime take an explicit
 * locale and exist for module-scope helpers, where no hook can run.
 */
export function useDateFormat(): {
  date: (value: string | number | Date | null | undefined, style: DateStyle) => string
  ago: (value: string | number | Date | null | undefined) => string
  clock: (hhmm: string) => string
  locale: string
} {
  const locale = useLocale()

  const date = useCallback(
    (value: string | number | Date | null | undefined, style: DateStyle) =>
      formatDateTime(value, locale, style),
    [locale],
  )

  const ago = useCallback(
    (value: string | number | Date | null | undefined) => formatRelativeTime(value, locale),
    [locale],
  )

  const clock = useCallback((hhmm: string) => formatClock(hhmm, locale), [locale])

  return { date, ago, clock, locale }
}
