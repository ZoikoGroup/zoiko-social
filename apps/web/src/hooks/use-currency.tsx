'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import {
  CURRENCY_STORAGE_KEY, CURRENCY_EVENT, RATES_STORAGE_KEY, RATES_TTL_MS, FX_ENDPOINT,
  DEFAULT_CURRENCY, STATIC_RATES, formatMoney, ratesFromApi, detectCurrency, type RatesMap,
} from '@/lib/currency'
import { useAuth } from '@/hooks/use-auth'
import { profileApi } from '@/lib/api'

interface CurrencyContextValue {
  currency: string
  setCurrency: (code: string) => void
  format: (amount: number, from?: string) => string
  ratesLive: boolean
  ratesUpdatedAt: number | null
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

// localStorage-backed store for the chosen currency — hydration-safe.
function subscribe(cb: () => void): () => void {
  window.addEventListener('storage', cb)
  window.addEventListener(CURRENCY_EVENT, cb)
  return () => { window.removeEventListener('storage', cb); window.removeEventListener(CURRENCY_EVENT, cb) }
}
function readStored(): string | null {
  try { return localStorage.getItem(CURRENCY_STORAGE_KEY) } catch { return null }
}
function getSnapshot(): string { return readStored() || DEFAULT_CURRENCY }
function getServerSnapshot(): string { return DEFAULT_CURRENCY }

function writeCurrency(code: string): void {
  try { localStorage.setItem(CURRENCY_STORAGE_KEY, code) } catch { /* ignore */ }
  window.dispatchEvent(new Event(CURRENCY_EVENT))
}

export function CurrencyProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { profile, isAuthenticated } = useAuth()
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const [rates, setRates] = useState<RatesMap>(STATIC_RATES)
  const [ratesLive, setRatesLive] = useState(false)
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<number | null>(null)
  const seededRef = useRef(false)

  // ── Live FX rates: cache (24h) → fetch → static fallback ──
  useEffect(() => {
    let cancelled = false
    void (async () => {
      await Promise.resolve() // defer so no synchronous setState in the effect body
      try {
        const cached = JSON.parse(localStorage.getItem(RATES_STORAGE_KEY) || 'null') as { rates: RatesMap; at: number } | null
        if (cached?.rates && Date.now() - cached.at < RATES_TTL_MS) {
          if (!cancelled) { setRates(cached.rates); setRatesUpdatedAt(cached.at); setRatesLive(true) }
          return
        }
      } catch { /* ignore */ }
      try {
        const res = await fetch(FX_ENDPOINT)
        const map = ratesFromApi(await res.json())
        if (map && !cancelled) {
          const at = Date.now()
          setRates(map); setRatesUpdatedAt(at); setRatesLive(true)
          try { localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify({ rates: map, at })) } catch { /* ignore */ }
        }
      } catch { /* offline / blocked → keep static fallback */ }
    })()
    return () => { cancelled = true }
  }, [])

  // ── First-visit seed: profile currency, else auto-detect from locale ──
  useEffect(() => {
    if (seededRef.current) return
    const t = setTimeout(() => {
      if (readStored()) { seededRef.current = true; return }
      const seed = (profile?.currency && profile.currency !== '' ? profile.currency : null) ?? detectCurrency()
      if (seed && seed !== DEFAULT_CURRENCY) writeCurrency(seed)
      seededRef.current = true
    }, 0)
    return () => clearTimeout(t)
  }, [profile])

  const setCurrency = useCallback((code: string) => {
    writeCurrency(code)
    if (isAuthenticated) void profileApi.update({ currency: code }).catch(() => {})
  }, [isAuthenticated])

  const format = useCallback((amount: number, from = 'INR') => formatMoney(amount, currency, from, rates), [currency, rates])

  const value = useMemo(
    () => ({ currency, setCurrency, format, ratesLive, ratesUpdatedAt }),
    [currency, setCurrency, format, ratesLive, ratesUpdatedAt],
  )
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (ctx) return ctx
  return {
    currency: DEFAULT_CURRENCY,
    setCurrency: () => {},
    format: (a, from = 'INR') => formatMoney(a, DEFAULT_CURRENCY, from),
    ratesLive: false,
    ratesUpdatedAt: null,
  }
}
