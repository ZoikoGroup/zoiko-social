/**
 * Locale-aware date and time formatting.
 *
 * Every call site used to pass 'en-US' (35 of them) or nothing at all (18). The
 * first pinned German and French users to American formatting — "Aug 17, 2026"
 * instead of "17. Aug. 2026". The second is subtler and worse: no locale means
 * the *browser's* locale, so the same page formatted differently depending on OS
 * settings, ignoring the language the visitor picked in the app.
 *
 * Passing the app locale also fixes the clock for free. Intl derives hour12 from
 * the locale, so de/fr/pt get 24-hour and en gets AM/PM without anyone asking.
 *
 * Styles are named by what they show rather than by where they are used, so two
 * screens wanting the same shape share one entry. Field *order* is deliberately
 * not encoded — Intl orders parts by locale, which is the whole point — so
 * { month, day, year } and { day, month, year } are one style here.
 */

export type DateStyle =
  | 'dayMonth'
  | 'dayMonthYear'
  | 'dayMonthLong'
  | 'dayMonthYearLong'
  | 'month'
  | 'monthYear'
  | 'monthYearLong'
  | 'time'
  | 'timePadded'
  | 'dayMonthTimePadded'
  | 'weekdayDayMonth'
  | 'weekdayDayMonthYear'
  | 'weekdayDayMonthTime'
  | 'weekdayDayMonthTimePadded'
  | 'weekdayLongDayMonth'
  | 'weekdayLongDayMonthTime'
  | 'weekdayLongFull'

const STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  dayMonth: { month: 'short', day: 'numeric' },
  dayMonthYear: { month: 'short', day: 'numeric', year: 'numeric' },
  dayMonthLong: { month: 'long', day: 'numeric' },
  dayMonthYearLong: { month: 'long', day: 'numeric', year: 'numeric' },
  month: { month: 'short' },
  monthYear: { month: 'short', year: 'numeric' },
  monthYearLong: { month: 'long', year: 'numeric' },
  time: { hour: 'numeric', minute: '2-digit' },
  timePadded: { hour: '2-digit', minute: '2-digit' },
  dayMonthTimePadded: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  weekdayDayMonth: { weekday: 'short', month: 'short', day: 'numeric' },
  weekdayDayMonthYear: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
  weekdayDayMonthTime: { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  weekdayDayMonthTimePadded: { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  weekdayLongDayMonth: { weekday: 'long', month: 'long', day: 'numeric' },
  weekdayLongDayMonthTime: { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  weekdayLongFull: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
}

// Intl.DateTimeFormat construction is the expensive part, so instances are
// reused. Keyed by locale + style; at most 6 locales x 16 styles.
const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(locale: string, style: DateStyle): Intl.DateTimeFormat {
  const key = `${locale}|${style}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, STYLES[style])
    cache.set(key, f)
  }
  return f
}

/**
 * Returns '' for null, undefined and unparseable input rather than throwing or
 * rendering "Invalid Date" — these values come from the API, and a blank cell
 * beats a crash or visible garbage.
 */
export function formatDateTime(
  value: string | number | Date | null | undefined,
  locale: string,
  style: DateStyle,
): string {
  if (value === null || value === undefined || value === '') return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return formatter(locale, style).format(d)
}

const relativeCache = new Map<string, Intl.RelativeTimeFormat>()

function relativeFormatter(locale: string): Intl.RelativeTimeFormat {
  let f = relativeCache.get(locale)
  if (!f) {
    // 'narrow' is only safe in English, where it gives the compact "5m ago" these
    // call sites used to print. Other locales render it badly: French drops the
    // "ago" wording entirely and emits "-5 min", German abbreviates Minuten to a
    // bare "m" ("vor 5 m"). 'short' reads correctly everywhere — "vor 5 Min.",
    // "il y a 5 min", "hace 5 min" — at the cost of a few characters.
    const style = locale.startsWith('en') ? 'narrow' : 'short'
    f = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style })
    relativeCache.set(locale, f)
  }
  return f
}

/**
 * "just now", "5m", "3h" — the timestamp beside a post, notification or message.
 *
 * This existed as four copy-pasted helpers (feed, dashboard, news, notifications)
 * that each hardcoded 'en-US' *and* the English words. Intl.RelativeTimeFormat
 * knows the wording for every locale, so there is nothing to translate by hand.
 *
 * Past a week an absolute date is more useful than "63d ago", which is where the
 * originals switched too.
 */
export function formatRelativeTime(
  value: string | number | Date | null | undefined,
  locale: string,
): string {
  if (value === null || value === undefined || value === '') return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  const rtf = relativeFormatter(locale)

  // Negative deltas (a clock skew, or a scheduled item) read as "in 5m".
  if (Math.abs(seconds) < 60) return rtf.format(-seconds, 'second')
  if (Math.abs(seconds) < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute')
  if (Math.abs(seconds) < 86_400) return rtf.format(-Math.floor(seconds / 3600), 'hour')
  if (Math.abs(seconds) < 604_800) return rtf.format(-Math.floor(seconds / 86_400), 'day')
  return formatDateTime(d, locale, 'dayMonth')
}

/**
 * "today" / "yesterday" in the reader's language, or an absolute date.
 *
 * numeric: 'auto' is what makes Intl return the word rather than "0 days ago",
 * so "Today"/"Yesterday" need no catalog keys of their own — and languages that
 * have a single word for "the day before yesterday" (de vorgestern, es anteayer)
 * get it for free.
 */
export function formatDayLabel(
  value: string | number | Date | null | undefined,
  locale: string,
): string {
  if (value === null || value === undefined || value === '') return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  // Compare calendar days, not elapsed hours: 23:59 and 00:01 are a minute apart
  // but still "yesterday" and "today".
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOf(d) - startOf(new Date())) / 86_400_000)
  if (days === 0 || days === -1) {
    return relativeFormatter(locale).format(days, 'day')
  }
  return formatDateTime(d, locale, 'dayMonth')
}

/**
 * A wall-clock "HH:MM" with no date attached — opening hours, appointment slots.
 *
 * These were rendered by hand as `${h12}:${mm} ${period}`, which hardcodes the
 * 12-hour clock and English AM/PM for every language. Anchored to an arbitrary
 * fixed date because only the time part is displayed; the date is never shown,
 * and a constant keeps the result stable rather than shifting at DST boundaries.
 */
export function formatClock(hhmm: string, locale: string): string {
  const [h, m] = hhmm.split(':')
  const hours = Number(h)
  const minutes = Number(m ?? '0')
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return hhmm
  const d = new Date(2000, 0, 1, hours, minutes)
  return formatter(locale, 'time').format(d)
}
