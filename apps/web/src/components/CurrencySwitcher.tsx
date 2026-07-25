'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Search, ChevronDown } from 'lucide-react'
import { useCurrency } from '@/hooks/use-currency'
import { CURRENCIES, currencyMeta } from '@/lib/currency'

function timeAgo(ts: number): string {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

/** Header currency quick-switcher: pick a display currency from any page. */
export function CurrencySwitcher(): React.JSX.Element {
  const { currency, setCurrency, ratesLive, ratesUpdatedAt } = useCurrency()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent): void { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const meta = currencyMeta(currency)
  const filtered = CURRENCIES.filter((c) => {
    const s = q.trim().toLowerCase()
    return !s || c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.symbol.includes(s)
  })

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Display currency"
        className="flex items-center gap-1 px-2.5 h-10 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
        aria-label="Change display currency"
      >
        <span className="text-label-sm font-bold">{meta.symbol}</span>
        <span className="text-[11px] font-semibold hidden sm:inline">{meta.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden z-[80]">
          <div className="p-2 border-b border-outline-variant/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
              <input
                value={q} onChange={(e) => setQ(e.target.value)} autoFocus
                placeholder="Search currency…"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-label-sm border border-transparent focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-label-sm text-outline text-center py-4">No match</p>
            ) : filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); setQ('') }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-container cursor-pointer ${c.code === currency ? 'bg-primary/5' : ''}`}
              >
                <span className="w-6 text-center font-bold text-on-surface">{c.symbol}</span>
                <span className="flex-1 min-w-0">
                  <span className="text-label-sm font-semibold text-on-surface">{c.code}</span>
                  <span className="text-[11px] text-outline block truncate">{c.name}</span>
                </span>
                {c.code === currency && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-outline-variant/20 text-[10px] text-outline">
            {ratesLive && ratesUpdatedAt
              ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Live rates · updated {timeAgo(ratesUpdatedAt)}</span>
              : <span>Approximate rates · converted prices are estimates</span>}
          </div>
        </div>
      )}
    </div>
  )
}
