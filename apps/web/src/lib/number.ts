/**
 * Locale-aware number formatting.
 *
 * Every call site used bare toLocaleString(), which takes the *browser's* locale
 * rather than the one chosen in the app — so a reader on a Spanish interface with
 * an English browser saw "1,234 members" while the interface around it said
 * "miembros". Spanish and German group with a full stop, French with a narrow
 * space; getting it from the browser means the same page disagrees with itself.
 */

const cache = new Map<string, Intl.NumberFormat>()

function formatter(locale: string): Intl.NumberFormat {
  let f = cache.get(locale)
  if (!f) {
    f = new Intl.NumberFormat(locale)
    cache.set(locale, f)
  }
  return f
}

/** Grouped integer — "1,234" in English, "1.234" in German. */
export function formatNumber(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return formatter(locale).format(value)
}

/**
 * Short form for counts that need to fit a badge — 1.2K, 3.4M.
 *
 * Intl's own compact notation is locale-correct (German says "1234" as "1234"
 * but "1,2 Mio." for millions), which hand-rolled `${n/1000}K` never is.
 */
export function formatCompact(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
