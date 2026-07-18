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
import { PawPrint, Search, Plus, X, Loader2, Camera, Check } from 'lucide-react'
import { LocationLink } from '@/components/LocationLink'
import { LocationInput } from '@/components/LocationInput'
import { adoptionApi, type AdoptionListing, type NewListing } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

const SPECIES = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other']

function StatusChip({ status }: { status: string }): React.JSX.Element {
  const map: Record<string, string> = {
    available: 'bg-emerald-500/10 text-emerald-600',
    pending: 'bg-secondary/10 text-secondary',
    adopted: 'bg-primary/10 text-primary',
    withdrawn: 'bg-surface-container text-outline',
  }
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${map[status] ?? map.withdrawn}`}>{status}</span>
}

export default function AdoptionPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [species, setSpecies] = useState('All')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const listKey = `adoption:${species}:${query.trim()}`
  const {
    items: listings, isLoading: loading, isRefreshing, hasMore, loadMore, patch: patchListings,
  } = usePagedList<AdoptionListing>(
    listKey,
    (cursor) => adoptionApi.browse({ ...(species !== 'All' ? { species } : {}), ...(query.trim() ? { q: query.trim() } : {}) }, cursor),
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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><PawPrint className="w-5 h-5 text-primary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Adoption &amp; Rescue</h1>
                  <p className="text-label-sm text-outline">Find your new best friend</p>
                </div>
              </div>
              <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />List a pet
              </button>
            </div>

            {/* Filters */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, breed…"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {SPECIES.map((s) => (
                  <button key={s} onClick={() => setSpecies(s)}
                    className={`px-3 py-1.5 rounded-full text-label-sm flex-shrink-0 transition-colors cursor-pointer ${species === s ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : listings.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md font-semibold text-on-surface">No pets found</p>
                <p className="text-label-sm text-outline">Try a different filter, or list a pet for adoption.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {listings.map((l) => (
                  <Link key={l.id} href={`/adoption/${l.id}`} onMouseEnter={() => { void adoptionApi.get(l.id).catch(() => {}) }} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group">
                    <div className="aspect-[4/3] bg-surface-container relative">
                      {l.coverUrl ? (
                        <Img src={l.coverUrl} alt={l.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><PawPrint className="w-10 h-10 text-outline/40" /></div>
                      )}
                      <div className="absolute top-2 right-2"><StatusChip status={l.status} /></div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-label-md text-on-surface truncate">{l.name}</h3>
                        {l.fee != null && <span className="text-[11px] text-outline flex-shrink-0">{l.fee === 0 ? 'Free' : `₹${l.fee}`}</span>}
                      </div>
                      <p className="text-[12px] text-on-surface-variant truncate">{l.species}{l.breed ? ` · ${l.breed}` : ''}{l.age ? ` · ${l.age}` : ''}</p>
                      {l.location && <LocationLink location={l.location} iconClassName="w-3 h-3" className="text-[11px] text-outline mt-1 max-w-full" />}
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

      {createOpen && <ListPetModal onClose={() => setCreateOpen(false)} onCreated={(l) => patchListings((prev) => [l, ...prev])} />}
    </>
  )
}

function ListPetModal({ onClose, onCreated }: { onClose: () => void; onCreated: (l: AdoptionListing) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [form, setForm] = useState<NewListing>({ name: '', species: 'Dog', sex: 'unknown' })
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof NewListing>(k: K, v: NewListing[K]): void { setForm((f) => ({ ...f, [k]: v })) }
  function toggleGoodWith(v: string): void {
    setForm((f) => { const cur = f.goodWith ?? []; return { ...f, goodWith: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] } })
  }

  async function pickCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(true); setError('')
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) }
    catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') }
    finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (saving || !form.name.trim() || !form.species.trim()) return
    setSaving(true); setError('')
    try {
      const listing = await adoptionApi.create({ ...form, name: form.name.trim(), ...(coverUrl ? { coverUrl } : {}) })
      onCreated(listing); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create listing') } finally { setSaving(false) }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">List a pet for adoption</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {/* Cover */}
          <button onClick={() => fileRef.current?.click()} className="relative w-full h-32 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            ) : <PawPrint className="w-8 h-8 text-outline/40" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickCover} />

          <input value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={80} placeholder="Pet name" className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.species} onChange={(e) => set('species', e.target.value)} maxLength={40} placeholder="Species (Dog, Cat…)" className={input} />
            <input value={form.breed ?? ''} onChange={(e) => set('breed', e.target.value)} maxLength={60} placeholder="Breed (optional)" className={input} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={form.age ?? ''} onChange={(e) => set('age', e.target.value)} maxLength={40} placeholder="Age" className={input} />
            <select value={form.sex} onChange={(e) => set('sex', e.target.value as NewListing['sex'])} className={input}>
              <option value="unknown">Sex</option><option value="male">Male</option><option value="female">Female</option>
            </select>
            <select value={form.size ?? ''} onChange={(e) => set('size', (e.target.value || undefined) as NewListing['size'])} className={input}>
              <option value="">Size</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
            </select>
          </div>
          <LocationInput value={form.location ?? ''} onChange={(v) => set('location', v)} maxLength={200} placeholder="Location" className={input} />
          <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={3000} rows={3} placeholder="Tell adopters about this pet…" className={`${input} resize-none`} />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => set('vaccinated', !form.vaccinated)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer ${form.vaccinated ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}>{form.vaccinated && <Check className="w-3.5 h-3.5" />}Vaccinated</button>
            <button onClick={() => set('neutered', !form.neutered)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer ${form.neutered ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}>{form.neutered && <Check className="w-3.5 h-3.5" />}Neutered</button>
          </div>
          <div>
            <p className="text-[11px] text-outline mb-1.5">Good with</p>
            <div className="flex gap-2">
              {['kids', 'dogs', 'cats'].map((g) => (
                <button key={g} onClick={() => toggleGoodWith(g)} className={`px-3 py-1.5 rounded-full text-label-sm capitalize cursor-pointer ${(form.goodWith ?? []).includes(g) ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}>{g}</button>
              ))}
            </div>
          </div>
          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !form.name.trim() || uploading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}List pet
          </button>
        </div>
      </div>
    </div>
  )
}
