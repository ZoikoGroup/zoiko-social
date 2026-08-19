'use client'

import { useCallback } from 'react'
import { useLocale } from 'next-intl'
import { formatCompact, formatNumber } from '@/lib/number'

/**
 * Number formatting bound to the locale the visitor chose.
 *
 * Separate from useDateFormat rather than bolted onto it: dates and counts are
 * different concerns, and a component usually needs one or the other. The pure
 * functions in lib/number take an explicit locale, for module-scope helpers where
 * no hook can run.
 */
export function useFormat(): {
  n: (value: number | null | undefined) => string
  compact: (value: number | null | undefined) => string
  locale: string
} {
  const locale = useLocale()
  const n = useCallback((v: number | null | undefined) => formatNumber(v, locale), [locale])
  const compact = useCallback((v: number | null | undefined) => formatCompact(v, locale), [locale])
  return { n, compact, locale }
}
