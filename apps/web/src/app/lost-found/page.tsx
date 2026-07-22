'use client'

import { useEffect, useRef, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import { Img } from '@/components/Img'
import { LocationLink } from '@/components/LocationLink'
import { LocationInput } from '@/components/LocationInput'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { MapPin, Search, Plus, X, Loader2, Camera, Eye, Navigation, Gift } from 'lucide-react'
import { lostFoundApi, type LostFoundReport, type NewReport } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

const TABS = [{ v: '', label: 'All' }, { v: 'lost', label: 'Lost' }, { v: 'found', label: 'Found' }]

function kindChip(kind: string): string {
  return kind === 'lost' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
}

export default function LostFoundPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [kind, setKind] = useState('')
  const [query, setQuery] = useState('')
  const [species, setSpecies] = useState('')
  const [reward, setReward] = useState(false)
  const [near, setNear] = useState<{ lat: number; lng: number } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const listKey = `lostfound:${kind}:${query.trim()}:${species}:${reward ? 1 : 0}:${near ? 'near' : ''}`
  const {
    items: reports, isLoading: loading, isRefreshing, hasMore, loadMore, patch: patchReports,
  } = usePagedList<LostFoundReport>(
    listKey,
    (cursor) => lostFoundApi.browse({
      ...(kind ? { kind } : {}),
      ...(query.trim() ? { q: query.trim() } : {}),
      ...(species ? { species } : {}),
      ...(reward ? { reward: true } : {}),
      ...(near ? { nearLat: near.lat, nearLng: near.lng } : {}),
    }, cursor),
    query ? 300 : 0,
  )

  function toggleNear(): void {
    if (near) { setNear(null); return }
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setNear({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }

  useEffect(() => {
    const s = sentinelRef.current
    if (!s || !hasMore) return
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) loadMore() }, { rootMargin: '400px' })
    obs.observe(s)
    return () => obs.disconnect()
  }, [hasMore, loadMore])

  if (authLoading || !isAuthenticated) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 hidden lg:block"><div className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" /></div>
          <div className="lg:col-span-6 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
          <div className="lg:col-span-3 hidden lg:block"><div className="h-72 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" /></div>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-6 space-y-gutter pb-20">
            {isRefreshing && !loading && (
              <div className="h-0.5 overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-1/3 bg-primary/60 animate-pulse rounded-full" />
              </div>
            )}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-secondary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Lost &amp; Found</h1>
                  <p className="text-label-sm text-outline">Reunite pets with their families</p>
                </div>
              </div>
              <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white text-label-sm font-semibold hover:bg-secondary/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />Report
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, breed, area…"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none" />
              </div>
              <div className="flex gap-2">
                {TABS.map((t) => (
                  <button key={t.v} onClick={() => setKind(t.v)}
                    className={`px-4 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${kind === t.v ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                    {t.label}
                  </button>
                ))}
                <span className="flex-1" />
                <button onClick={() => setReward((v) => !v)} title="With reward" className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${reward ? 'bg-secondary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>Reward</button>
                <button onClick={toggleNear} title="Near me" className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer flex items-center gap-1 ${near ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}><Navigation className="w-3.5 h-3.5" />Near</button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                <button onClick={() => setSpecies('')} className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 ${species === '' ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-outline border border-outline-variant/30'}`}>All species</button>
                {SPECIES.map((s) => (
                  <button key={s} onClick={() => setSpecies(species === s ? '' : s)} className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 ${species === s ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-outline border border-outline-variant/30'}`}>{s}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : reports.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <MapPin className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-label-md font-semibold text-on-surface">No reports here</p>
                <p className="text-label-sm text-outline">Report a lost or found pet to alert the community.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {reports.map((r) => (
                  <Link key={r.id} href={`/lost-found/${r.id}`} onMouseEnter={() => { void lostFoundApi.get(r.id).catch(() => {}) }} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group">
                    <div className="aspect-[4/3] bg-surface-container relative">
                      {r.photoUrl ? (
                        <Img src={r.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : <div className="w-full h-full flex items-center justify-center"><MapPin className="w-10 h-10 text-outline/40" /></div>}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${kindChip(r.kind)}`}>{r.kind}</span>
                      {r.status === 'reunited' && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">Reunited</span>}
                      {r.reward != null && r.reward > 0 && <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-white flex items-center gap-1"><Gift className="w-2.5 h-2.5" />₹{r.reward}</span>}
                      {r.distanceKm != null && <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white flex items-center gap-1"><Navigation className="w-2.5 h-2.5" />{r.distanceKm} km</span>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-label-md text-on-surface truncate">{r.petName ?? r.species}</h3>
                      <p className="text-[12px] text-on-surface-variant truncate">{r.species}{r.breed ? ` · ${r.breed}` : ''}</p>
                      {(r.age || r.sex || r.color) && <p className="text-[11px] text-outline truncate capitalize">{[r.age, r.sex, r.color].filter(Boolean).join(' · ')}</p>}
                      {r.lastSeenLocation && <LocationLink location={r.lastSeenLocation} iconClassName="w-3 h-3" className="text-[11px] text-outline mt-1 max-w-full" />}
                      {r.sightingsCount > 0 && <p className="flex items-center gap-1 text-[11px] text-primary mt-1"><Eye className="w-3 h-3" />{r.sightingsCount} sighting{r.sightingsCount > 1 ? 's' : ''}</p>}
                    </div>
                  </Link>
                ))}
                <div ref={sentinelRef} className="h-1 col-span-2" />
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {createOpen && <ReportModal onClose={() => setCreateOpen(false)} onCreated={(r) => patchReports((prev) => [r, ...prev])} />}
    </>
  )
}

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']

function ReportModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: LostFoundReport) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [form, setForm] = useState<NewReport>({ kind: 'lost', species: '' })
  const [photos, setPhotos] = useState<string[]>([])
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  function set<K extends keyof NewReport>(k: K, v: NewReport[K]): void { setForm((f) => ({ ...f, [k]: v })) }

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile || photos.length >= 6) return
    setUploading(true); setError('')
    try { const url = await uploadCommunityImage(profile.id, file, 'cover'); setPhotos((p) => [...p, url]) }
    catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (saving || !form.species.trim()) return
    setSaving(true); setError('')
    try {
      const r = await lostFoundApi.create({
        ...form,
        species: form.species.trim(),
        ...(photos.length ? { photoUrls: photos, photoUrl: photos[0] } : {}),
        ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
      })
      onCreated(r); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create report') } finally { setSaving(false) }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  const chip = (active: boolean): string => `px-3 py-1.5 rounded-full text-label-sm cursor-pointer transition-colors ${active ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Report a pet</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div className="flex gap-2">
            {(['lost', 'found'] as const).map((k) => (
              <button key={k} onClick={() => set('kind', k)}
                className={`flex-1 py-2 rounded-xl text-label-md font-semibold capitalize cursor-pointer transition-colors ${form.kind === k ? (k === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white') : 'border border-outline-variant text-on-surface-variant'}`}>
                {k === 'lost' ? 'I lost a pet' : 'I found a pet'}
              </button>
            ))}
          </div>

          {/* Photos (up to 6) */}
          <div className="flex gap-2 flex-wrap">
            {photos.map((p, i) => (
              <div key={p} className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container">
                <Img src={p} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3 text-white" /></button>
              </div>
            ))}
            {photos.length < 6 && (
              <button onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high">
                {uploading ? <Loader2 className="w-5 h-5 text-outline animate-spin" /> : <Camera className="w-5 h-5 text-outline/60" />}
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />

          <div className="grid grid-cols-2 gap-3">
            <input value={form.petName ?? ''} onChange={(e) => set('petName', e.target.value)} maxLength={80} placeholder="Pet name (optional)" className={input} />
            <input value={form.species} onChange={(e) => set('species', e.target.value)} maxLength={40} placeholder="Species *" className={input} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {SPECIES.map((s) => <button key={s} onClick={() => set('species', s)} className={chip(form.species === s)}>{s}</button>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.breed ?? ''} onChange={(e) => set('breed', e.target.value)} maxLength={60} placeholder="Breed" className={input} />
            <input value={form.age ?? ''} onChange={(e) => set('age', e.target.value)} maxLength={40} placeholder="Age (e.g. 3 yrs)" className={input} />
          </div>
          <input value={form.color ?? ''} onChange={(e) => set('color', e.target.value)} maxLength={60} placeholder="Colour / markings" className={input} />
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-outline self-center mr-1">Sex:</span>
            {(['male', 'female', 'unknown'] as const).map((s) => <button key={s} onClick={() => set('sex', s)} className={chip(form.sex === s) + ' capitalize'}>{s}</button>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-outline self-center mr-1">Size:</span>
            {(['small', 'medium', 'large'] as const).map((s) => <button key={s} onClick={() => set('size', s)} className={chip(form.size === s) + ' capitalize'}>{s}</button>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.microchipId ?? ''} onChange={(e) => set('microchipId', e.target.value)} maxLength={60} placeholder="Microchip ID" className={input} />
            <input value={form.collar ?? ''} onChange={(e) => set('collar', e.target.value)} maxLength={200} placeholder="Collar / tag" className={input} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => set('neutered', !form.neutered)} className={chip(!!form.neutered) + ' flex-1 text-center'}>Spayed / neutered</button>
            <button onClick={() => set('vaccinated', !form.vaccinated)} className={chip(!!form.vaccinated) + ' flex-1 text-center'}>Vaccinated</button>
          </div>
          <LocationInput value={form.lastSeenLocation ?? ''} onChange={(v) => set('lastSeenLocation', v)} onSelectCoords={setCoords} maxLength={200} placeholder={form.kind === 'lost' ? 'Last seen location' : 'Where found'} className={input} />
          <label className="text-[11px] text-outline block">{form.kind === 'lost' ? 'Last seen date' : 'Date found'}
            <input type="date" value={form.lastSeenAt ?? ''} onChange={(e) => set('lastSeenAt', e.target.value)} className={`${input} mt-1`} />
          </label>
          <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={2000} rows={2} placeholder="Details that help identify the pet…" className={`${input} resize-none`} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.contact ?? ''} onChange={(e) => set('contact', e.target.value)} maxLength={200} placeholder="Contact (phone / email)" className={input} />
            {form.kind === 'lost' && <input type="number" min={0} value={form.reward ?? ''} onChange={(e) => set('reward', e.target.value ? Number(e.target.value) : undefined)} placeholder="Reward ₹ (optional)" className={input} />}
          </div>
          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !form.species.trim() || uploading} className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-label-md font-semibold hover:bg-secondary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Post report
          </button>
        </div>
      </div>
    </div>
  )
}
