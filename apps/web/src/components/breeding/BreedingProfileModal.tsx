'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Camera, Check, PawPrint, IndianRupee, Plus, Trash2, ImagePlus, FileText } from 'lucide-react'
import { breedingApi, petsApi, type BreedingProfile, type NewBreedingProfile, type Pet, type DnaResult } from '@/lib/api'
import { LocationInput } from '@/components/LocationInput'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'] as const
const TEMPERAMENTS = ['Friendly', 'Calm', 'Playful', 'Protective', 'Gentle', 'Energetic', 'Social', 'Independent', 'Trained']
const HEALTH_TESTS = ['Vaccinated', 'Dewormed', 'DNA tested', 'Hips (OFA)', 'Elbows', 'Eyes (CERF)', 'Heart', 'Patella', 'Brucellosis clear']

function normalizeSpecies(s: string | null): string {
  const v = (s ?? '').toLowerCase().trim()
  return (['dog', 'cat', 'bird', 'rabbit'] as string[]).includes(v) ? v : 'other'
}

type Form = NewBreedingProfile & { latitude?: number; longitude?: number }

/** Create or edit a breeding profile, optionally linked to a Health Passport pet. */
export function BreedingProfileModal({ profile, onClose, onSaved }: {
  profile?: BreedingProfile | null
  onClose: () => void
  onSaved: (p: BreedingProfile) => void
}): React.JSX.Element {
  const { profile: me } = useAuth()
  const editing = !!profile
  const [pets, setPets] = useState<Pet[]>([])
  const [form, setForm] = useState<Form>(() => profile ? {
    petName: profile.petName, species: profile.species, breed: profile.breed, sex: profile.sex,
    age: profile.age ?? '', location: profile.location ?? '', about: profile.about ?? '',
    temperament: profile.temperament, healthTests: profile.healthTests,
    registered: profile.registered, willingToTravel: profile.willingToTravel,
    dnaResults: profile.dnaResults, documents: profile.documents, photos: profile.photos,
    littersCount: profile.littersCount, availableNow: profile.availableNow,
    ...(profile.petId ? { petId: profile.petId } : {}),
    ...(profile.ageMonths != null ? { ageMonths: profile.ageMonths } : {}),
    ...(profile.lastLitterAt ? { lastLitterAt: profile.lastLitterAt } : {}),
    ...(profile.heatStatus ? { heatStatus: profile.heatStatus } : {}),
    ...(profile.nextHeatAt ? { nextHeatAt: profile.nextHeatAt } : {}),
    ...(profile.fee != null ? { fee: profile.fee } : {}),
    ...(profile.coverUrl ? { coverUrl: profile.coverUrl } : {}),
    ...(profile.latitude != null ? { latitude: profile.latitude } : {}),
    ...(profile.longitude != null ? { longitude: profile.longitude } : {}),
  } : {
    petName: '', species: 'dog', breed: '', sex: 'male', temperament: [], healthTests: [],
    registered: false, willingToTravel: false, dnaResults: [], documents: [], photos: [],
    littersCount: 0, availableNow: true,
  })
  const [cover, setCover] = useState<string | null>(profile?.coverUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<HTMLInputElement>(null)
  const docsRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) return
    petsApi.mine().then(setPets).catch(() => {})
  }, [editing])

  function set<K extends keyof Form>(k: K, v: Form[K]): void { setForm((f) => ({ ...f, [k]: v })) }
  function toggleArr(k: 'temperament' | 'healthTests', v: string): void {
    setForm((f) => {
      const cur = (f[k] as string[] | undefined) ?? []
      return { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }
    })
  }

  function pickPet(petId: string): void {
    const pet = pets.find((p) => p.id === petId)
    if (!pet) { setForm((f) => { const next = { ...f }; delete next.petId; return next }); return }
    setForm((f) => ({
      ...f, petId,
      petName: pet.name,
      species: normalizeSpecies(pet.species),
      breed: pet.breed ?? f.breed,
      sex: pet.sex === 'male' || pet.sex === 'female' ? pet.sex : (f.sex ?? 'male'),
    }))
  }

  async function pickCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !me) return
    setUploading(true); setError('')
    try { const url = await uploadCommunityImage(me.id, file, 'cover'); setCover(url); set('coverUrl', url) }
    catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }

  async function pickMany(kind: 'photos' | 'documents', e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(e.target.files ?? []); e.target.value = ''
    if (!files.length || !me) return
    setUploading(true); setError('')
    try {
      const urls = await Promise.all(files.slice(0, 8).map((f) => uploadCommunityImage(me.id, f, 'cover')))
      setForm((f) => ({ ...f, [kind]: [...((f[kind] as string[] | undefined) ?? []), ...urls].slice(0, kind === 'photos' ? 8 : 10) }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }
  function removeAt(kind: 'photos' | 'documents', i: number): void {
    setForm((f) => ({ ...f, [kind]: ((f[kind] as string[] | undefined) ?? []).filter((_, idx) => idx !== i) }))
  }

  // DNA (genetic health) result rows
  const dna = form.dnaResults ?? []
  function addDna(): void { setForm((f) => ({ ...f, dnaResults: [...(f.dnaResults ?? []), { condition: '', status: 'clear' }] })) }
  function updateDna(i: number, patch: Partial<DnaResult>): void {
    setForm((f) => ({ ...f, dnaResults: (f.dnaResults ?? []).map((d, idx) => idx === i ? { ...d, ...patch } : d) }))
  }
  function removeDna(i: number): void { setForm((f) => ({ ...f, dnaResults: (f.dnaResults ?? []).filter((_, idx) => idx !== i) })) }

  async function submit(): Promise<void> {
    if (saving || !form.petName.trim() || !form.breed.trim()) return
    setSaving(true); setError('')
    try {
      const payload: Form = {
        ...form, petName: form.petName.trim(), breed: form.breed.trim(),
        dnaResults: (form.dnaResults ?? []).filter((d) => d.condition.trim()),
      }
      const p = editing ? await breedingApi.update(profile!.id, payload) : await breedingApi.create(payload)
      onSaved(p); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save profile') } finally { setSaving(false) }
  }

  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  const label = 'text-[12px] font-semibold text-outline'

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{editing ? 'Edit breeding profile' : 'List for breeding'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Pet picker (from Health Passport) */}
          {!editing && (
            <div>
              <label className={`${label} flex items-center gap-1`}><PawPrint className="w-3.5 h-3.5" />Use a pet from your Health Passport</label>
              {pets.length === 0 ? (
                <p className="text-[12px] text-outline mt-1">No pets yet — you can still fill details below, or add a pet in Health Passport to auto-fill and show vaccination status.</p>
              ) : (
                <select value={form.petId ?? ''} onChange={(e) => pickPet(e.target.value)} className={input}>
                  <option value="">Enter manually</option>
                  {pets.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.species}{p.breed ? ` · ${p.breed}` : ''}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Cover */}
          <button onClick={() => fileRef.current?.click()} className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="w-full h-full object-cover" />
            ) : <div className="text-center"><Camera className="w-6 h-6 text-outline/50 mx-auto" /><span className="text-[10px] text-outline">Add a photo</span></div>}
            {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickCover} />

          {/* Basics */}
          <div className="grid grid-cols-2 gap-2">
            <div><label className={label}>Pet name</label><input value={form.petName} onChange={(e) => set('petName', e.target.value)} maxLength={120} className={input} /></div>
            <div><label className={label}>Breed</label><input value={form.breed} onChange={(e) => set('breed', e.target.value)} maxLength={120} className={input} /></div>
            <div>
              <label className={label}>Species</label>
              <select value={form.species} onChange={(e) => set('species', e.target.value)} className={input}>
                {SPECIES.map((s) => <option key={s} value={s}>{s[0]!.toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Sex</label>
              <select value={form.sex} onChange={(e) => set('sex', e.target.value)} className={input}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div><label className={label}>Age</label><input value={form.age ?? ''} onChange={(e) => set('age', e.target.value)} maxLength={60} placeholder="e.g. 2 yrs" className={input} /></div>
            <div className="relative">
              <label className={label}>Stud/breeding fee</label>
              <IndianRupee className="absolute left-3 top-[34px] w-4 h-4 text-outline" />
              <input type="number" min="0" value={form.fee ?? ''} onChange={(e) => set('fee', e.target.value ? Number(e.target.value) : undefined)} placeholder="Optional" className={`${input} pl-9`} />
            </div>
            <div><label className={label}>Age in months <span className="font-normal">(for age check)</span></label><input type="number" min="0" max="600" value={form.ageMonths ?? ''} onChange={(e) => set('ageMonths', e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g. 24" className={input} /></div>
          </div>

          <div>
            <label className={label}>Location (for near-me & map)</label>
            <LocationInput value={form.location ?? ''} onChange={(v) => set('location', v)} onSelectCoords={(c) => { set('latitude', c?.lat); set('longitude', c?.lng) }} maxLength={160} placeholder="Area / city" className={input} />
          </div>

          <div><label className={label}>About</label><textarea value={form.about ?? ''} onChange={(e) => set('about', e.target.value)} maxLength={3000} rows={3} placeholder="Lineage, temperament, breeding history, terms…" className={`${input} resize-none`} /></div>

          <ChipGroup label="Temperament" values={TEMPERAMENTS} selected={form.temperament ?? []} onToggle={(v) => toggleArr('temperament', v)} />
          <ChipGroup label="Health tests & records" values={HEALTH_TESTS} selected={form.healthTests ?? []} onToggle={(v) => toggleArr('healthTests', v)} />

          <div className="flex flex-wrap gap-2">
            <Toggle on={!!form.registered} onClick={() => set('registered', !form.registered)} label="Registered / pedigree" />
            <Toggle on={!!form.willingToTravel} onClick={() => set('willingToTravel', !form.willingToTravel)} label="Willing to travel" />
            <Toggle on={form.availableNow !== false} onClick={() => set('availableNow', !(form.availableNow !== false))} label="Available now" />
          </div>

          {/* Genetic (DNA) results — carrier x carrier warnings on matches */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className={label}>Genetic (DNA) results</p>
              <button onClick={addDna} className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline cursor-pointer"><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
            {dna.length === 0 ? <p className="text-[11px] text-outline">Add DNA test results (e.g. PRA, DM) to enable genetic-risk warnings on matches.</p> : (
              <div className="space-y-1.5">
                {dna.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={d.condition} onChange={(e) => updateDna(i, { condition: e.target.value })} maxLength={80} placeholder="Condition (e.g. PRA)" className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
                    <select value={d.status} onChange={(e) => updateDna(i, { status: e.target.value as DnaResult['status'] })} className="px-2 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none">
                      <option value="clear">Clear</option>
                      <option value="carrier">Carrier</option>
                      <option value="affected">Affected</option>
                    </select>
                    <button onClick={() => removeDna(i)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Breeding history (welfare guards) */}
          <div className="grid grid-cols-2 gap-2">
            <div><label className={label}>Litters so far</label><input type="number" min="0" value={form.littersCount ?? 0} onChange={(e) => set('littersCount', e.target.value ? Number(e.target.value) : 0)} className={input} /></div>
            <div><label className={label}>Last litter date</label><input type="date" value={form.lastLitterAt ?? ''} onChange={(e) => set('lastLitterAt', e.target.value || undefined)} className={input} /></div>
          </div>

          {/* Cycle (females) */}
          {form.sex === 'female' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={label}>Heat / cycle status</label>
                <select value={form.heatStatus ?? ''} onChange={(e) => set('heatStatus', e.target.value || undefined)} className={input}>
                  <option value="">Unknown</option>
                  <option value="in_season">In season now</option>
                  <option value="due_soon">Due soon</option>
                  <option value="resting">Resting</option>
                </select>
              </div>
              <div><label className={label}>Next heat (approx)</label><input type="date" value={form.nextHeatAt ?? ''} onChange={(e) => set('nextHeatAt', e.target.value || undefined)} className={input} /></div>
            </div>
          )}

          {/* Photo gallery */}
          <div className="space-y-1.5">
            <p className={label}>Photos</p>
            <div className="flex flex-wrap gap-2">
              {(form.photos ?? []).map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeAt('photos', i)} className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => photosRef.current?.click()} className="w-16 h-16 rounded-lg border border-dashed border-outline-variant/60 flex items-center justify-center text-outline hover:border-primary cursor-pointer"><ImagePlus className="w-5 h-5" /></button>
            </div>
            <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => pickMany('photos', e)} />
          </div>

          {/* Documents (pedigree / DNA reports) — photos/scans */}
          <div className="space-y-1.5">
            <p className={label}>Pedigree / DNA documents <span className="font-normal">(photo or scan)</span></p>
            <div className="flex flex-wrap gap-2 items-center">
              {(form.documents ?? []).map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container text-[11px] text-on-surface-variant">
                  <FileText className="w-3.5 h-3.5" />Doc {i + 1}
                  <button onClick={(e) => { e.preventDefault(); removeAt('documents', i) }} className="text-red-500"><X className="w-3 h-3" /></button>
                </a>
              ))}
              <button onClick={() => docsRef.current?.click()} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-outline-variant/60 text-[12px] text-outline hover:border-primary cursor-pointer"><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
            <input ref={docsRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => pickMany('documents', e)} />
          </div>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !form.petName.trim() || !form.breed.trim() || uploading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Save changes' : 'Publish profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }): React.JSX.Element {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40'}`}>
      {on && <Check className="w-3 h-3" />}{label}
    </button>
  )
}

function ChipGroup({ label, values, selected, onToggle }: { label: string; values: readonly string[]; selected: string[]; onToggle: (v: string) => void }): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-semibold text-outline">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => {
          const on = selected.includes(v)
          return <button key={v} onClick={() => onToggle(v)} className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${on ? 'bg-primary/15 text-primary border-primary/40' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-primary/40'}`}>{v}</button>
        })}
      </div>
    </div>
  )
}
