'use client'

import { useRef, useState } from 'react'
import { X, Loader2, Camera, Image as ImageIcon, Check } from 'lucide-react'
import { providersApi, type Provider, type NewProvider, type HoursEntry } from '@/lib/api'
import {
  SPECIALTIES, SPECIES_TREATED, FACILITIES, LANGUAGES, CONSULT_MODES, CONSULT_MODE_LABELS,
  DAY_LABELS_SHORT, defaultHours,
} from '@/lib/vet'
import { LocationInput } from '@/components/LocationInput'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

type Form = NewProvider & { latitude?: number; longitude?: number }

/** Create or edit a vet clinic profile (all Vet Finder fields). */
export function VetClinicFormModal({ provider, onClose, onSaved }: {
  provider?: Provider | null
  onClose: () => void
  onSaved: (p: Provider) => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const editing = !!provider
  const [form, setForm] = useState<Form>(() => provider ? {
    category: 'vet', name: provider.name, serviceType: provider.serviceType ?? '', description: provider.description ?? '',
    location: provider.location ?? '', address: provider.address ?? '', phone: provider.phone ?? '', website: provider.website ?? '',
    ...(provider.coverUrl ? { coverUrl: provider.coverUrl } : {}),
    ...(provider.logoUrl ? { logoUrl: provider.logoUrl } : {}),
    specialties: provider.specialties, species: provider.species, facilities: provider.facilities,
    consultModes: provider.consultModes, languages: provider.languages,
    emergencyAvailable: provider.emergencyAvailable, is24x7: provider.is24x7, acceptsWalkins: provider.acceptsWalkins,
    hours: provider.hours ?? defaultHours(), licenseNo: provider.licenseNo ?? '',
    ...(provider.latitude != null ? { latitude: provider.latitude } : {}),
    ...(provider.longitude != null ? { longitude: provider.longitude } : {}),
  } : {
    category: 'vet', name: '', serviceType: '', specialties: [], species: [], facilities: [],
    consultModes: ['in_clinic'], languages: [], emergencyAvailable: false, is24x7: false, acceptsWalkins: false,
    hours: defaultHours(),
  })
  const [logo, setLogo] = useState<string | null>(provider?.logoUrl ?? null)
  const [cover, setCover] = useState<string | null>(provider?.coverUrl ?? null)
  const [uploading, setUploading] = useState<'logo' | 'cover' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const logoRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof Form>(k: K, v: Form[K]): void { setForm((f) => ({ ...f, [k]: v })) }
  function toggle(k: 'specialties' | 'species' | 'facilities' | 'languages' | 'consultModes', v: string): void {
    setForm((f) => {
      const cur = (f[k] as string[] | undefined) ?? []
      return { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }
    })
  }

  async function pick(kind: 'logo' | 'cover', e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(kind); setError('')
    try {
      const url = await uploadCommunityImage(profile.id, file, 'cover')
      if (kind === 'logo') { setLogo(url); set('logoUrl', url) } else { setCover(url); set('coverUrl', url) }
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(null) }
  }

  function updateHour(day: number, patch: Partial<HoursEntry>): void {
    setForm((f) => ({ ...f, hours: (f.hours ?? defaultHours()).map((h) => h.day === day ? { ...h, ...patch } : h) }))
  }

  async function submit(): Promise<void> {
    if (saving || !form.name.trim()) return
    setSaving(true); setError('')
    try {
      const payload: Partial<NewProvider> = { ...form, name: form.name.trim() }
      const p = editing
        ? await providersApi.update(provider!.id, payload)
        : await providersApi.create({ ...payload, category: 'vet', name: form.name.trim() })
      onSaved(p); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save clinic') } finally { setSaving(false) }
  }

  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  const label = 'text-[12px] font-semibold text-outline'

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{editing ? 'Edit clinic' : 'List your clinic'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Media */}
          <div className="flex gap-3">
            <button onClick={() => logoRef.current?.click()} className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer flex-shrink-0">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="w-full h-full object-cover" />
              ) : <div className="text-center"><Camera className="w-5 h-5 text-outline/50 mx-auto" /><span className="text-[9px] text-outline">Logo</span></div>}
              {uploading === 'logo' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-4 h-4 text-white animate-spin" /></div>}
            </button>
            <button onClick={() => coverRef.current?.click()} className="relative flex-1 h-20 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : <div className="text-center"><ImageIcon className="w-5 h-5 text-outline/50 mx-auto" /><span className="text-[9px] text-outline">Cover photo</span></div>}
              {uploading === 'cover' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-4 h-4 text-white animate-spin" /></div>}
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick('logo', e)} />
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick('cover', e)} />
          </div>

          {/* Basics */}
          <div className="space-y-2">
            <input value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={120} placeholder="Clinic name" className={input} />
            <input value={form.serviceType ?? ''} onChange={(e) => set('serviceType', e.target.value)} maxLength={60} placeholder="Tagline (e.g. 24×7 multi-specialty pet hospital)" className={input} />
            <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={2000} rows={3} placeholder="About the clinic…" className={`${input} resize-none`} />
          </div>

          {/* Contact + location */}
          <div className="space-y-2">
            <p className={label}>Contact & location</p>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} maxLength={40} placeholder="Phone" className={input} />
              <input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} maxLength={300} placeholder="Website (https://)" className={input} />
            </div>
            <LocationInput value={form.location ?? ''} onChange={(v) => set('location', v)} onSelectCoords={(c) => { set('latitude', c?.lat); set('longitude', c?.lng) }} maxLength={120} placeholder="Area / city (for near-me & map)" className={input} />
            <input value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} maxLength={300} placeholder="Full address" className={input} />
          </div>

          {/* Emergency */}
          <div className="space-y-2">
            <p className={label}>Availability</p>
            <div className="flex flex-wrap gap-2">
              <ToggleChip on={!!form.emergencyAvailable} onClick={() => set('emergencyAvailable', !form.emergencyAvailable)} label="Emergency services" tone="red" />
              <ToggleChip on={!!form.is24x7} onClick={() => set('is24x7', !form.is24x7)} label="Open 24×7" tone="green" />
              <ToggleChip on={!!form.acceptsWalkins} onClick={() => set('acceptsWalkins', !form.acceptsWalkins)} label="Accepts walk-ins" />
            </div>
          </div>

          {/* Consult modes */}
          <ChipGroup label="Consultation modes" values={CONSULT_MODES.map((m) => ({ value: m, label: CONSULT_MODE_LABELS[m] ?? m }))} selected={form.consultModes ?? []} onToggle={(v) => toggle('consultModes', v)} />

          {/* Specialties / species / facilities / languages */}
          <ChipGroup label="Specialties" values={SPECIALTIES.map((s) => ({ value: s, label: s }))} selected={form.specialties ?? []} onToggle={(v) => toggle('specialties', v)} />
          <ChipGroup label="Species treated" values={SPECIES_TREATED.map((s) => ({ value: s, label: s }))} selected={form.species ?? []} onToggle={(v) => toggle('species', v)} />
          <ChipGroup label="Facilities" values={FACILITIES.map((s) => ({ value: s, label: s }))} selected={form.facilities ?? []} onToggle={(v) => toggle('facilities', v)} />
          <ChipGroup label="Languages" values={LANGUAGES.map((s) => ({ value: s, label: s }))} selected={form.languages ?? []} onToggle={(v) => toggle('languages', v)} />

          {/* Hours */}
          {!form.is24x7 && (
            <div className="space-y-1.5">
              <p className={label}>Opening hours</p>
              {(form.hours ?? defaultHours()).map((h) => (
                <div key={h.day} className="flex items-center gap-2">
                  <span className="w-10 text-[12px] font-semibold text-on-surface-variant">{DAY_LABELS_SHORT[h.day]}</span>
                  {h.closed ? (
                    <span className="flex-1 text-[12px] text-outline">Closed</span>
                  ) : (
                    <>
                      <input type="time" value={h.open} onChange={(e) => updateHour(h.day, { open: e.target.value })} className="px-2 py-1 rounded-lg border border-outline-variant/40 bg-surface-container-low text-[12px]" />
                      <span className="text-outline text-[12px]">–</span>
                      <input type="time" value={h.close} onChange={(e) => updateHour(h.day, { close: e.target.value })} className="px-2 py-1 rounded-lg border border-outline-variant/40 bg-surface-container-low text-[12px]" />
                    </>
                  )}
                  <button onClick={() => updateHour(h.day, { closed: !h.closed })} className="ml-auto text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                    {h.closed ? 'Set open' : 'Mark closed'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* License */}
          <div className="space-y-1">
            <p className={label}>Registration / license number (builds trust)</p>
            <input value={form.licenseNo ?? ''} onChange={(e) => set('licenseNo', e.target.value)} maxLength={80} placeholder="e.g. VCI/2021/12345" className={input} />
          </div>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !form.name.trim() || !!uploading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Save changes' : 'Create clinic'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleChip({ on, onClick, label, tone }: { on: boolean; onClick: () => void; label: string; tone?: 'red' | 'green' }): React.JSX.Element {
  const active = tone === 'red' ? 'bg-red-600 text-white border-red-600' : tone === 'green' ? 'bg-green-600 text-white border-green-600' : 'bg-primary text-white border-primary'
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${on ? active : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40'}`}>
      {on && <Check className="w-3 h-3" />}{label}
    </button>
  )
}

function ChipGroup({ label, values, selected, onToggle }: {
  label: string; values: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void
}): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-semibold text-outline">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => {
          const on = selected.includes(v.value)
          return (
            <button key={v.value} onClick={() => onToggle(v.value)} className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${on ? 'bg-primary/15 text-primary border-primary/40' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-primary/40'}`}>
              {v.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
