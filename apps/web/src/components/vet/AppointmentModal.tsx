'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Calendar, PawPrint, ShieldCheck } from 'lucide-react'
import { petsApi, type Pet, type Provider } from '@/lib/api'
import { petCareApi, type PetCareService } from '@/lib/pet-care-api'
import { CONSULT_MODE_LABELS, todayHoursLabel } from '@/lib/vet'

/**
 * Book a vet appointment: pick a service, consult mode, date/time, and the pet
 * (pulled from the owner's Health Passport). Reuses the generic bookings API.
 */
export function AppointmentModal({ provider, services, onClose, onBooked }: {
  provider: Provider
  services: PetCareService[]
  onClose: () => void
  onBooked: () => void
}): React.JSX.Element {
  const bookable = services.filter((s) => s.isActive)
  const [serviceId, setServiceId] = useState(bookable[0]?.id ?? '')
  const [mode, setMode] = useState(provider.consultModes[0] ?? 'in_clinic')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [pets, setPets] = useState<Pet[]>([])
  const [petId, setPetId] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    petsApi.mine().then((d) => { if (!cancelled) { setPets(d); setPetId((p) => p || d[0]?.id || '') } }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const selected = bookable.find((s) => s.id === serviceId)
  const input = 'w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none'
  const minDate = new Date().toISOString().slice(0, 10)

  async function submit(): Promise<void> {
    if (!serviceId || !date || !time || saving) return
    setSaving(true); setError('')
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString()
      await petCareApi.createBooking({
        providerId: provider.id, serviceId, scheduledAt,
        consultMode: mode as 'in_clinic' | 'home_visit' | 'video',
        ...(petId ? { petId } : {}),
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      })
      setDone(true)
      onBooked()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to book appointment') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Book appointment</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-green-100 mx-auto flex items-center justify-center"><Calendar className="w-7 h-7 text-green-600" /></div>
            <p className="text-label-lg font-bold text-on-surface">Appointment requested</p>
            <p className="text-label-sm text-outline">{provider.name} will confirm your appointment. You&apos;ll get a notification.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer">Done</button>
          </div>
        ) : bookable.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-label-md font-semibold text-on-surface">No bookable services</p>
            <p className="text-label-sm text-outline">This clinic hasn&apos;t published services yet. Try calling them directly.</p>
          </div>
        ) : (
          <>
            <div className="p-5 space-y-3 overflow-y-auto flex-1">
              <div>
                <label className="text-[12px] font-semibold text-outline">Service</label>
                <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={input}>
                  {bookable.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.priceDisplay}</option>)}
                </select>
              </div>

              {provider.consultModes.length > 0 && (
                <div>
                  <label className="text-[12px] font-semibold text-outline">Consultation mode</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {provider.consultModes.map((m) => (
                      <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${mode === m ? 'bg-primary text-white border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40'}`}>
                        {CONSULT_MODE_LABELS[m] ?? m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-outline">Date</label>
                  <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-outline">Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} />
                </div>
              </div>
              <p className="text-[11px] text-outline -mt-1">Clinic today: {todayHoursLabel(provider.hours, provider.is24x7)}</p>

              <div>
                <label className="text-[12px] font-semibold text-outline flex items-center gap-1"><PawPrint className="w-3.5 h-3.5" />Pet (from Health Passport)</label>
                {pets.length === 0 ? (
                  <p className="text-[12px] text-outline mt-1">No pets yet. Add one in your Health Passport to attach medical history.</p>
                ) : (
                  <select value={petId} onChange={(e) => setPetId(e.target.value)} className={input}>
                    <option value="">Not specified</option>
                    {pets.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.species}{p.breed ? ` · ${p.breed}` : ''}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[12px] font-semibold text-outline">Reason for visit</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={2} placeholder="e.g. annual vaccination, not eating, limping…" className={`${input} resize-none`} />
              </div>

              {selected && (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-label-sm text-on-surface-variant">{selected.name}</span>
                  <span className="text-label-md font-bold text-on-surface">{selected.priceDisplay}</span>
                </div>
              )}
              <p className="flex items-start gap-1.5 text-[11px] text-outline"><ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />Pay at the clinic. Your contact details are shared with the clinic only after they confirm.</p>
              {error && <p className="text-label-sm text-red-500">{error}</p>}
            </div>

            <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
              <button onClick={submit} disabled={saving || !serviceId || !date || !time} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}Request appointment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
