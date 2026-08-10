'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Siren, Loader2, Eye, ArrowRight } from 'lucide-react'
import { lostFoundApi, type LostFoundReport } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

/**
 * Missing-pet state and one-tap reporting, on the pet's own profile.
 *
 * Reporting a pet missing used to mean opening Lost & Found and retyping its
 * breed, colour and microchip number — details already on this page, being asked
 * for at the worst possible moment. Filing from here sends only the pet id; the
 * API fills the rest from the profile, so the report exists within a second and
 * can be refined afterwards.
 *
 * Location is attached when the browser offers it quickly, and skipped when it
 * doesn't. Waiting on a permission dialog is exactly the wrong thing to do when
 * someone is standing in the street looking for their dog.
 */

/** Long enough to be useful, short enough not to delay the report. */
const LOCATION_TIMEOUT_MS = 4000

async function currentPosition(): Promise<{ latitude: number; longitude: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS, maximumAge: 60_000 },
    )
  })
}

export function PetMissingBanner({ petId, petName }: { petId: string; petName: string }): React.JSX.Element | null {
  const router = useRouter()
  const toast = useToast()
  const [report, setReport] = useState<LostFoundReport | null>(null)
  const [checked, setChecked] = useState(false)
  const [filing, setFiling] = useState(false)

  const load = useCallback(() => {
    lostFoundApi.forPet(petId)
      .then((rs) => setReport(rs[0] ?? null))
      .catch(() => { /* no report is the normal case */ })
      .finally(() => setChecked(true))
  }, [petId])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function fileReport(): Promise<void> {
    setFiling(true)
    try {
      const position = await currentPosition()
      const created = await lostFoundApi.create({
        kind: 'lost',
        // Everything else — name, breed, colour, microchip, photo — comes from
        // the pet profile server-side.
        species: '',
        petId,
        ...(position ?? {}),
      })
      setReport(created)
      toast.success('Reported missing', 'Add the details that will help people spot them.')
      router.push(`/lost-found/${created.id}`)
    } catch (e) {
      toast.error('Could not file the report', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setFiling(false)
    }
  }

  // Nothing until we know — a banner that flashes in and out is worse than none.
  if (!checked) return null

  if (report) {
    return (
      <Link
        href={`/lost-found/${report.id}`}
        className="flex items-center gap-3 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/25 px-4 py-3 hover:bg-red-100/60 dark:hover:bg-red-950/40 transition-colors"
      >
        <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-red-500/15">
          <Siren className="w-5 h-5 text-red-600 dark:text-red-400" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-label-sm font-bold text-on-surface">{petName} is reported missing</p>
          <p className="flex items-center gap-1.5 text-[11px] text-outline mt-0.5">
            <Eye className="w-3 h-3" />
            {report.sightingsCount === 0
              ? 'No sightings yet — share the report to reach more people'
              : `${report.sightingsCount} sighting${report.sightingsCount === 1 ? '' : 's'} reported`}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
      </Link>
    )
  }

  return (
    <button
      onClick={() => void fileReport()}
      disabled={filing}
      className="w-full flex items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors cursor-pointer disabled:opacity-60 text-left"
    >
      <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-surface-container">
        {filing ? <Loader2 className="w-5 h-5 animate-spin text-outline" /> : <Siren className="w-5 h-5 text-outline" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-label-sm font-semibold text-on-surface">
          {filing ? 'Filing the report…' : `Report ${petName} missing`}
        </p>
        <p className="text-[11px] text-outline mt-0.5">
          Uses their photo, breed and microchip number automatically
        </p>
      </div>
    </button>
  )
}
