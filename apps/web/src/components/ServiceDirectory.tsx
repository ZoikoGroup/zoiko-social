'use client'

import { useEffect, useRef, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import type { LucideIcon } from 'lucide-react'
import { Search, Plus, MapPin, Phone, Globe, X, Loader2, Camera } from 'lucide-react'
import { LocationLink } from '@/components/LocationLink'
import { LocationInput } from '@/components/LocationInput'
import { Header } from './Header'
import { ProfileCard } from './ProfileCard'
import { QuickLinksWidget } from './QuickLinksWidget'
import { RightPanel } from './RightPanel'
import { MobileTabs } from './MobileTabs'
import { providersApi, type Provider, type NewProvider } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

interface ServiceDirectoryProps {
  category: 'vet' | 'pet_care'
  title: string
  subtitle: string
  Icon: LucideIcon
  serviceTypes: string[]
  addLabel: string
}

export function ServiceDirectory({ category, title, subtitle, Icon, serviceTypes, addLabel }: ServiceDirectoryProps): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const listKey = `providers:${category}:${query.trim()}:${location.trim()}`
  const {
    items, isLoading: loading, hasMore, loadMore, patch: patchItems,
  } = usePagedList<Provider>(
    listKey,
    (cursor) => providersApi.browse(category, { ...(query.trim() ? { q: query.trim() } : {}), ...(location.trim() ? { location: location.trim() } : {}) }, cursor),
    (query || location) ? 300 : 0,
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
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">{title}</h1>
                  <p className="text-label-sm text-outline">{subtitle}</p>
                </div>
              </div>
              <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />{addLabel}
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or service…"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none" />
              </div>
              <div className="relative sm:w-44">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <LocationInput value={location} onChange={setLocation} placeholder="Location"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : items.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md font-semibold text-on-surface">No listings yet</p>
                <p className="text-label-sm text-outline">Be the first to add one for the community.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((p) => (
                  <div key={p.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {p.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : <Icon className="w-6 h-6 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-label-md text-on-surface truncate">{p.name}</h3>
                        {p.serviceType && <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">{p.serviceType}</span>}
                      </div>
                      {p.description && <p className="text-label-sm text-on-surface-variant mt-1 line-clamp-2">{p.description}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px] text-outline">
                        {p.location && <LocationLink location={p.location} iconClassName="w-3.5 h-3.5" />}
                        {p.phone && <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3.5 h-3.5" />{p.phone}</a>}
                        {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe className="w-3.5 h-3.5" />Website</a>}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={sentinelRef} className="h-1" />
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {addOpen && <AddProviderModal category={category} serviceTypes={serviceTypes} title={addLabel} onClose={() => setAddOpen(false)} onAdded={(p) => patchItems((prev) => [p, ...prev])} />}
    </>
  )
}

function AddProviderModal({ category, serviceTypes, title, onClose, onAdded }: {
  category: 'vet' | 'pet_care'; serviceTypes: string[]; title: string
  onClose: () => void; onAdded: (p: Provider) => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const [form, setForm] = useState<NewProvider>({ category, name: '', serviceType: serviceTypes[0] ?? '' })
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  function set<K extends keyof NewProvider>(k: K, v: NewProvider[K]): void { setForm((f) => ({ ...f, [k]: v })) }

  async function pickCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(true); setError('')
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) }
    catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (saving || !form.name.trim()) return
    setSaving(true); setError('')
    try {
      const p = await providersApi.create({ ...form, name: form.name.trim(), ...(coverUrl ? { coverUrl } : {}) })
      onAdded(p); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to add listing') } finally { setSaving(false) }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <button onClick={() => fileRef.current?.click()} className="relative w-full h-24 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center group cursor-pointer">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            ) : <Camera className="w-6 h-6 text-outline/50" />}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickCover} />
          <input value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={120} placeholder="Name" className={input} />
          <select value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)} className={input}>
            {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={2000} rows={2} placeholder="Description (optional)" className={`${input} resize-none`} />
          <LocationInput value={form.location ?? ''} onChange={(v) => set('location', v)} maxLength={120} placeholder="Location / city" className={input} />
          <input value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} maxLength={300} placeholder="Address (optional)" className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} maxLength={40} placeholder="Phone" className={input} />
            <input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} maxLength={300} placeholder="Website (https://)" className={input} />
          </div>
          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !form.name.trim() || uploading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Add listing
          </button>
        </div>
      </div>
    </div>
  )
}
