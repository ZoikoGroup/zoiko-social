// ═════════════════════════════════════════════════════════════════════════════
// Multi-currency support
//
// Amounts are stored in a base currency (INR) unless a record carries its own
// currency code (e.g. shop products, breeding listings). The viewer picks a
// display currency (Settings or the header switcher); prices convert using live
// FX rates (fetched + cached by use-currency) with a static fallback table.
//
// A rate = how many INR make up 1 unit of that currency (base INR = 1).
// ═════════════════════════════════════════════════════════════════════════════

export interface CurrencyMeta {
  code: string
  symbol: string
  name: string
  locale: string
  rate: number     // static fallback: INR per 1 unit
  decimals: number // display decimals for small amounts
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', rate: 1, decimals: 0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', rate: 83, decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-IE', rate: 90, decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', rate: 105, decimals: 2 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'en-AE', rate: 22.6, decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', rate: 54, decimals: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', rate: 61, decimals: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', rate: 62, decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', rate: 0.56, decimals: 0 },
]

export const DEFAULT_CURRENCY = 'INR'
export const CURRENCY_STORAGE_KEY = 'zoiko-currency'
export const CURRENCY_EVENT = 'zoiko-currency-change'
export const RATES_STORAGE_KEY = 'zoiko-fx-rates'
export const RATES_TTL_MS = 24 * 60 * 60 * 1000 // refresh live rates daily
// Free, keyless FX endpoint. Base INR → rates[code] = units of code per 1 INR.
export const FX_ENDPOINT = 'https://open.er-api.com/v6/latest/INR'

export type RatesMap = Record<string, number> // INR per 1 unit
export const STATIC_RATES: RatesMap = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.rate]))

export function currencyMeta(code: string): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!
}

function rateOf(code: string, rates: RatesMap): number {
  return rates[code] ?? currencyMeta(code).rate
}

/** Convert an amount from one currency to another via the INR base. */
export function convert(amount: number, from: string, to: string, rates: RatesMap = STATIC_RATES): number {
  if (from === to) return amount
  return (amount * rateOf(from, rates)) / rateOf(to, rates)
}

/**
 * Format an amount (default source INR) in the target display currency.
 * Prefixes "≈" when the value was converted from another currency.
 */
export function formatMoney(amount: number, to: string, from: string = DEFAULT_CURRENCY, rates: RatesMap = STATIC_RATES): string {
  const m = currencyMeta(to)
  const value = convert(amount, from, to, rates)
  const maxFrac = Math.abs(value) >= 1000 ? 0 : m.decimals
  const text = `${m.symbol}${value.toLocaleString(m.locale, { maximumFractionDigits: maxFrac })}`
  return from !== to ? `≈${text}` : text
}

/** Parse a live-rate API payload ({ rates: { code: unitsPerINR } }) into our INR-per-unit map. */
export function ratesFromApi(payload: unknown): RatesMap | null {
  if (!payload || typeof payload !== 'object') return null
  const raw = (payload as { rates?: Record<string, number> }).rates
  if (!raw || typeof raw !== 'object') return null
  const out: RatesMap = { INR: 1 }
  for (const c of CURRENCIES) {
    const perInr = raw[c.code]
    if (typeof perInr === 'number' && perInr > 0) out[c.code] = 1 / perInr
  }
  return Object.keys(out).length > 1 ? out : null
}

// Region → currency, for first-visit auto-detection from the browser locale.
const REGION_CURRENCY: Record<string, string> = {
  IN: 'INR', US: 'USD', GB: 'GBP', AE: 'AED', AU: 'AUD', CA: 'CAD', SG: 'SGD', JP: 'JPY',
  IE: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', PT: 'EUR', AT: 'EUR',
}

/** Best-effort currency from the browser locale (e.g. en-US → USD). Falls back to INR. */
export function detectCurrency(): string {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const l of langs) {
      const region = l.split('-')[1]?.toUpperCase()
      if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region]
    }
  } catch { /* ignore */ }
  return DEFAULT_CURRENCY
}
