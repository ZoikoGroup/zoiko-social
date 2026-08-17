/**
 * Shared pet display helpers.
 *
 * `ageOf` was previously copy-pasted into pet-diary, health-passport and the
 * public passport page; it lives here so the three views can never drift.
 */

import { formatDateTime } from '@/lib/datetime'

/** Approximate age as a short label — "7 mo", "3 yrs". Null when no birthdate. */
export function ageOf(birthdate: string | null | undefined): string | null {
  if (!birthdate) return null
  const months = Math.max(
    0,
    Math.floor((Date.now() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
  )
  if (months < 12) return `${months} mo`
  const years = Math.floor(months / 12)
  return `${years} yr${years > 1 ? 's' : ''}`
}

/**
 * A birthdate rendered for reading — "4 Mar 2021". Null when absent.
 *
 * Took no locale and so followed the browser's, not the one chosen in the app.
 */
export function formatPetDate(date: string | null | undefined, locale: string): string | null {
  if (!date) return null
  const formatted = formatDateTime(date, locale, 'dayMonthYear')
  return formatted === '' ? null : formatted
}

/** Neutered/spayed label. Undefined for null so callers can omit the row entirely. */
export function neuteredLabel(neutered: boolean | null | undefined): string | undefined {
  if (neutered === null || neutered === undefined) return undefined
  return neutered ? 'Yes' : 'No'
}
