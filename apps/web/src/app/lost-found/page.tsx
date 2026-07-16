'use client'

import { useEffect, useRef, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import { Img } from '@/components/Img'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { MapPin, Search, Plus, X, Loader2, Camera, Eye } from 'lucide-react'
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
  const [createOpen, setCreateOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const listKey = `lostfound:${kind}:${query.trim()}`
  const {
    items: reports, isLoading: loading, isRefreshing, hasMore, loadMore, patch: patchReports,
  } = usePagedList<LostFoundReport>(
    listKey,
    (cursor) => lostFoundApi.browse({ ...(kind ? { kind } : {}), ...(query.trim() ? { q: query.trim() } : {}) }, cursor),
    query ? 300 : 0,
  )

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
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-label-md text-on-surface truncate">{r.petName ?? r.species}</h3>
                      <p className="text-[12px] text-on-surface-variant truncate">{r.species}{r.breed ? ` · ${r.breed}` : ''}</p>
                      {r.lastSeenLocation && <p className="flex items-center gap-1 text-[11px] text-outline mt-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{r.lastSeenLocation}</p>}
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

function ReportModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: LostFoundReport) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [form, setForm] = useState<NewReport>({ kind: 'lost', species: '' })
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  function set<K extends keyof NewReport>(k: K, v: NewReport[K]): void { setForm((f) => ({ ...f, [k]: v })) }

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(true); setError('')
    try { setPhotoUrl(await uploadCommunityImage(profile.id, file, 'cover')) }
    catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (saving || !form.species.trim()) return
    setSaving(true); setError('')
    try {
      const r = await lostFoundApi.create({ ...form, species: form.species.trim(), ...(photoUrl ? { photoUrl } : {}) })
      onCreated(r); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create report') } finally { setSaving(false) }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

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
          <button onClick={() => fileRef.current?.click()} className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : <Camera className="w-6 h-6 text-outline/50" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.petName ?? ''} onChange={(e) => set('petName', e.target.value)} maxLength={80} placeholder="Pet name (optional)" className={input} />
            <input value={form.species} onChange={(e) => set('species', e.target.value)} maxLength={40} placeholder="Species" className={input} />
          </div>
          <input value={form.breed ?? ''} onChange={(e) => set('breed', e.target.value)} maxLength={60} placeholder="Breed / colour (optional)" className={input} />
          <input value={form.lastSeenLocation ?? ''} onChange={(e) => set('lastSeenLocation', e.target.value)} maxLength={200} placeholder="Last seen location" className={input} />
          <label className="text-[11px] text-outline block">Last seen date
            <input type="date" value={form.lastSeenAt ?? ''} onChange={(e) => set('lastSeenAt', e.target.value)} className={`${input} mt-1`} />
          </label>
          <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={2000} rows={2} placeholder="Details that help identify the pet…" className={`${input} resize-none`} />
          <input value={form.contact ?? ''} onChange={(e) => set('contact', e.target.value)} maxLength={200} placeholder="Contact (phone / email)" className={input} />
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
