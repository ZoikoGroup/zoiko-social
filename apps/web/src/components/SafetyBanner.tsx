'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  ThermometerSun, ThermometerSnowflake, CloudLightning, Snowflake,
  CloudRain, Sun, Wind, CloudFog, Waves, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { safetyApi, type Advisory, type AdvisoryKind, type AdvisorySeverity } from '@/lib/api'

/**
 * Live pet-welfare advisory for the member's location.
 *
 * Renders nothing at all unless there is genuinely something to say — no location
 * permission, no advisory, or a failed lookup all mean no banner. A banner that is
 * always present teaches people to ignore it, which would make the one that
 * matters useless.
 *
 * Dismissal is per advisory kind, so hiding today's heat notice does not also
 * suppress tonight's thunderstorm warning.
 */

const ICONS: Record<AdvisoryKind, LucideIcon> = {
  extreme_heat: ThermometerSun,
  heat: ThermometerSun,
  extreme_cold: ThermometerSnowflake,
  cold: ThermometerSnowflake,
  thunderstorm: CloudLightning,
  snow_ice: Snowflake,
  heavy_rain: CloudRain,
  high_uv: Sun,
  poor_air: Waves,
  high_wind: Wind,
  fog: CloudFog,
}

/** Severe reads as an alarm; warning as caution; info stays quiet. */
const TONES: Record<AdvisorySeverity, { wrap: string; chip: string; icon: string; action: string }> = {
  severe: {
    wrap: 'border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/25',
    chip: 'bg-red-500/15',
    icon: 'text-red-600 dark:text-red-400',
    action: 'border-red-400/60 text-red-700 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-950/40',
  },
  warning: {
    wrap: 'border-secondary/30 bg-secondary/10',
    chip: 'bg-secondary/15',
    icon: 'text-secondary',
    action: 'border-secondary/50 text-secondary hover:bg-secondary/10',
  },
  info: {
    wrap: 'border-outline-variant/40 bg-surface-container-low',
    chip: 'bg-surface-container-high',
    icon: 'text-on-surface-variant',
    action: 'border-outline-variant text-on-surface-variant hover:bg-surface-container',
  },
}

const dismissKey = (kind: AdvisoryKind): string => `zk.safetyBanner.dismissed.${kind}`

/**
 * `true` only after client mount — server and first client render both return
 * false, so sessionStorage can be read during render without a hydration mismatch
 * and without syncing external state through an effect.
 */
const emptySubscribe = (): (() => void) => () => {}

function isKindDismissed(kind: AdvisoryKind): boolean {
  try {
    return sessionStorage.getItem(dismissKey(kind)) === '1'
  } catch {
    return false
  }
}

export function SafetyBanner(): React.JSX.Element | null {
  const [advisory, setAdvisory] = useState<Advisory | null>(null)
  const [justDismissed, setJustDismissed] = useState(false)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    let cancelled = false

    // No permission, no banner. Never prompted separately for this — the browser
    // reuses a grant the member already gave for "near me" features.
    if (typeof navigator === 'undefined' || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void safetyApi
          .advisories(
            Number(pos.coords.latitude.toFixed(2)),
            Number(pos.coords.longitude.toFixed(2)),
          )
          .then((result) => {
            if (cancelled) return
            // The list is severity-sorted, so the first is the one worth showing.
            setAdvisory(result.advisories[0] ?? null)
          })
          .catch(() => { /* a missing advisory is a non-event */ })
      },
      () => { /* declined or unavailable — stay silent */ },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )

    return () => { cancelled = true }
  }, [])

  if (!advisory) return null
  if (justDismissed || (mounted && isKindDismissed(advisory.kind))) return null

  const Icon = ICONS[advisory.kind]
  const tone = TONES[advisory.severity]

  function dismiss(): void {
    try { sessionStorage.setItem(dismissKey(advisory!.kind), '1') } catch { /* ignore */ }
    setJustDismissed(true)
  }

  return (
    <div className="max-w-container-max mx-auto px-2 md:px-5 pt-4">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${tone.wrap}`}>
        <span className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full ${tone.chip}`}>
          <Icon className={`w-5 h-5 ${tone.icon}`} />
        </span>
        <p className="flex-1 text-label-sm leading-snug text-on-surface">
          <span className="font-bold">{advisory.title}:</span>{' '}
          {advisory.message}
        </p>
        <Link
          href={advisory.docsPath}
          className={`hidden sm:inline-flex items-center px-4 py-2 rounded-lg border text-label-sm font-semibold transition-colors flex-shrink-0 ${tone.action}`}
        >
          Safety Guide
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
