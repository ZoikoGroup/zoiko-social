'use client'

import { useState } from 'react'
import { Sun, X } from 'lucide-react'
import Link from 'next/link'

const DISMISS_KEY = 'zk.safetyBanner.dismissed.v1'

/**
 * Full-width safety/welfare alert banner shown at the top of the home feed.
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
    <div className="w-full bg-gradient-to-r from-[#E8590C] to-[#F08C00] text-white">
      <div className="max-w-container-max mx-auto px-3 md:px-5 py-2.5 flex items-center gap-3">
        <Sun className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 text-label-sm leading-snug">
          <span className="font-bold">Heat Warning:</span>{' '}
          Pavement temps can reach 50°C+ — risk of paw pad burns. Walk pets early morning or after
          sundown. Carry water.
        </p>
        <Link
          href="/pet-care"
          className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-[#E8590C] text-label-sm font-semibold hover:bg-white/90 transition-colors flex-shrink-0"
        >
          View Safety Tips
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
