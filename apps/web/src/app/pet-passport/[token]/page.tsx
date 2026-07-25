'use client'

import { use, useEffect, useState } from 'react'
import {
  ShieldCheck, Syringe, Stethoscope, Pill, AlertTriangle, Scale, FileText, Printer, Loader2, PawPrint,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { petsApi, type PublicPassport } from '@/lib/api'

const META: Record<string, { label: string; Icon: LucideIcon; node: string; tint: string }> = {
  vaccination: { label: 'Vaccination', Icon: Syringe, node: 'bg-primary text-white', tint: 'bg-primary/10 text-primary' },
  vet_visit: { label: 'Vet Visit', Icon: Stethoscope, node: 'bg-blue-500 text-white', tint: 'bg-blue-500/10 text-blue-600' },
  medication: { label: 'Medication', Icon: Pill, node: 'bg-secondary text-white', tint: 'bg-secondary/10 text-secondary' },
  allergy: { label: 'Allergy', Icon: AlertTriangle, node: 'bg-red-500 text-white', tint: 'bg-red-500/10 text-red-600' },
  weight: { label: 'Weight', Icon: Scale, node: 'bg-emerald-500 text-white', tint: 'bg-emerald-500/10 text-emerald-600' },
  note: { label: 'Note', Icon: FileText, node: 'bg-gray-500 text-white', tint: 'bg-gray-500/10 text-gray-600' },
}
const meta = (t: string) => META[t] ?? META.note!
function fmtDate(iso: string | null): string { return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Undated' }
function ageOf(birthdate: string | null): string | null {
  if (!birthdate) return null
  const months = Math.max(0, Math.floor((Date.now() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
  if (months < 12) return `${months} mo`
  const y = Math.floor(months / 12); return `${y} yr${y > 1 ? 's' : ''}`
}

export default function PublicPassportPage({ params }: { params: Promise<{ token: string }> }): React.JSX.Element {
  const { token } = use(params)
  const [data, setData] = useState<PublicPassport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    petsApi.publicPassport(token)
      .then((d) => { if (!cancelled) setData(d) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'This link is invalid or has been revoked') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  const allergies = data?.records.filter((r) => r.type === 'allergy') ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <style>{`@media print { .no-print { display:none !important } }`}</style>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <div>
              <p className="font-headline text-headline-sm text-on-surface leading-tight">Health Passport</p>
              <p className="text-label-sm text-outline">Shared read-only medical card</p>
            </div>
          </div>
          {data && <button onClick={() => window.print()} className="no-print flex items-center gap-1.5 px-3 py-2 rounded-full border border-outline-variant/40 text-label-sm text-on-surface-variant hover:bg-surface-container cursor-pointer"><Printer className="w-4 h-4" />Print</button>}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-outline"><Loader2 className="w-7 h-7 animate-spin mb-2" />Loading passport…</div>
        ) : error ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-10 text-center">
            <AlertTriangle className="w-9 h-9 text-red-500 mx-auto mb-3" />
            <p className="text-label-lg font-semibold text-on-surface">Passport unavailable</p>
            <p className="text-label-sm text-outline mt-1">{error}</p>
          </div>
        ) : data && (
          <div className="space-y-4">
            {/* Pet header */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {data.pet.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.pet.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : <PawPrint className="w-9 h-9 text-primary" />}
              </div>
              <div className="min-w-0">
                <h1 className="font-headline text-headline-md text-on-surface">{data.pet.name}</h1>
                <p className="text-label-md text-outline capitalize">{[data.pet.breed, data.pet.sex, ageOf(data.pet.birthdate)].filter(Boolean).join(' · ') || data.pet.species}</p>
                {data.pet.ownerName && <p className="text-label-sm text-outline mt-0.5">Guardian: {data.pet.ownerName}</p>}
              </div>
            </div>

            {allergies.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-label-md font-bold text-red-700">Allergies &amp; alerts</p>
                  <p className="text-label-sm text-on-surface-variant">{allergies.map((a) => a.title).join(', ')}</p>
                </div>
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 divide-y divide-outline-variant/15">
              {data.records.length === 0 ? (
                <p className="p-8 text-center text-label-sm text-outline">No health records on this passport.</p>
              ) : data.records.map((r) => {
                const m = meta(r.type)
                return (
                  <div key={r.id} className="p-4 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.node}`}><m.Icon className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-label-md font-semibold text-on-surface">{r.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.tint}`}>{m.label}</span>
                      </div>
                      <span className="text-[11px] text-outline">{fmtDate(r.recordDate)}</span>
                      {r.notes && <p className="text-label-sm text-on-surface-variant mt-1 whitespace-pre-line">{r.notes}</p>}
                      {r.nextDue && <p className="text-[11px] font-semibold text-secondary mt-1">Next due: {fmtDate(r.nextDue)}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-center text-[11px] text-outline pt-2">Shared securely via Zoiko · The guardian can revoke this link anytime.</p>
          </div>
        )}
      </div>
    </div>
  )
}
