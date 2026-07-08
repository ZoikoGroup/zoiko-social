'use client'

import { useState } from 'react'
import { ThermometerSun, X } from 'lucide-react'
import Link from 'next/link'

const DISMISS_KEY = 'zk.safetyBanner.dismissed.v1'

/**
 * Safety/welfare advisory shown at the top of the home feed.
 * Dismissible per browser session (sessionStorage) so it reappears next visit.
 * Content is static welfare guidance for now; wire to a live alerts source later.
 */
export function SafetyBanner(): React.JSX.Element | null {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return sessionStorage.getItem(DISMISS_KEY) === '1' } catch { return false }
  })

  if (dismissed) return null

  function dismiss(): void {
    try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
    setDismissed(true)
  }

  return (
    <div className="max-w-container-max mx-auto px-2 md:px-5 pt-4">
      <div className="flex items-center gap-3 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3">
        <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-secondary/15">
          <ThermometerSun className="w-5 h-5 text-secondary" />
        </span>
        <p className="flex-1 text-label-sm leading-snug text-on-surface">
          <span className="font-bold">Heat Advisory:</span>{' '}
          Pavement temperatures are high today. Test before walks and protect your pets.
        </p>
        <Link
          href="/pet-care"
          className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border border-secondary/50 text-secondary text-label-sm font-semibold hover:bg-secondary/10 transition-colors flex-shrink-0"
        >
          View Safety Guide
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1.5 rounded-lg text-outline hover:bg-black/5 transition-colors flex-shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
