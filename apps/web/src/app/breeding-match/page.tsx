'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dna, Search, Plus, Navigation, Loader2, BadgeCheck, Syringe, Award,
  Sparkles, Heart, Pencil, Trash2, PlaneTakeoff, ShieldCheck, Venus, Mars, AlertTriangle, Bell, X,
  Baby, ArrowUpRight, Calendar,
} from 'lucide-react'
import { usePagedList } from '@/hooks/use-cache'
import { breedingApi, adoptionApi, petsApi, type BreedingProfile, type BreedingFilters, type BreedingAlert, type BreedingLitter, type Pet } from '@/lib/api'
import { BreedingProfileModal } from '@/components/breeding/BreedingProfileModal'
import { Img } from '@/components/Img'
import { LocationLink } from '@/components/LocationLink'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import { useAuth } from '@/hooks/use-auth'

const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other']
type Tab = 'discover' | 'matches' | 'mine' | 'litters'

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  return sym ? `${sym}${amount.toLocaleString()}` : `${amount.toLocaleString()} ${currency}`
}

function SexBadge({ sex }: { sex: string }): React.JSX.Element {
  const female = sex === 'female'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${female ? 'bg-pink-500/10 text-pink-600' : 'bg-blue-500/10 text-blue-600'}`}>
      {female ? <Venus className="w-3 h-3" /> : <Mars className="w-3 h-3" />}{female ? 'Female' : 'Male'}
    </span>
  )
}

export default function BreedingMatchPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('discover')
  const [formOpen, setFormOpen] = useState(false)
  const [edit, setEdit] = useState<BreedingProfile | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const open = (id: string): void => { router.push(`/breeding-match/${id}`) }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-9 space-y-4 pb-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10"><Dna className="w-5 h-5 text-primary" /></span>
                <div>
                  <h1 className="font-headline text-headline-md font-bold text-on-surface">Breeding Match</h1>
                  <p className="text-label-sm text-outline">Find the right, health-checked mate for your pet</p>
                </div>
              </div>
              <button onClick={() => { setEdit(null); setFormOpen(true) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /><span className="hidden sm:inline">List your pet</span>
              </button>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-on-surface-variant leading-snug">
                ZoikoSocial promotes <span className="font-semibold">responsible, health-tested breeding only</span>. Verify health clearances, keep chats on-platform, and meet in person.
              </p>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {([['discover', 'Discover'], ['matches', 'Matches for my pet'], ['mine', 'My listings'], ['litters', 'Litters']] as [Tab, string][]).map(([id, lbl]) => (
                <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-full text-label-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${tab === id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>{lbl}</button>
              ))}
            </div>

            {tab === 'discover' && <DiscoverTab onOpen={open} />}
            {tab === 'matches' && <MatchesTab onOpen={open} />}
            {tab === 'mine' && <MineTab onOpen={open} onEdit={(p) => { setEdit(p); setFormOpen(true) }} onCreate={() => { setEdit(null); setFormOpen(true) }} />}
            {tab === 'litters' && <LittersTab />}
          </div>
        </div>
      </main>
      <MobileTabs currentPage="breeding-match" />
      {formOpen && <BreedingProfileModal profile={edit} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); window.location.reload() }} />}
    </>
  )
}

// ── Discover ──────────────────────────────────────────────────────────────────
function DiscoverTab({ onOpen }: { onOpen: (id: string) => void }): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [species, setSpecies] = useState('')
  const [sex, setSex] = useState('')
  const [healthTested, setHealthTested] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [near, setNear] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [alerts, setAlerts] = useState<BreedingAlert[]>([])
  const [showAlerts, setShowAlerts] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { breedingApi.alerts().then(setAlerts).catch(() => {}) }, [])

  async function saveAlert(): Promise<void> {
    try {
      const a = await breedingApi.createAlert({
        ...(species ? { species } : {}),
        ...(sex ? { sex } : {}),
        ...(query.trim() ? { breed: query.trim() } : {}),
        ...(near ? { nearLat: near.lat, nearLng: near.lng, radiusKm: 25 } : {}),
      })
      setAlerts((prev) => [a, ...prev]); setShowAlerts(true)
    } catch { /* ignore */ }
  }
  async function dropAlert(alid: string): Promise<void> {
    try { await breedingApi.removeAlert(alid); setAlerts((prev) => prev.filter((x) => x.id !== alid)) } catch { /* ignore */ }
  }

  const filters = useMemo<BreedingFilters>(() => ({
    ...(query.trim() ? { q: query.trim() } : {}),
    ...(species ? { species } : {}),
    ...(sex ? { sex } : {}),
    ...(healthTested ? { healthTested: true } : {}),
    ...(registered ? { registered: true } : {}),
    ...(near ? { near } : {}),
  }), [query, species, sex, healthTested, registered, near])

  const { items, isLoading: loading, hasMore, loadMore, loadingMore } = usePagedList<BreedingProfile>(
    `breeding:${JSON.stringify(filters)}`,
    (cursor) => breedingApi.browse(filters, cursor, 12),
    query ? 300 : 0,
  )

  useEffect(() => {
    const s = sentinelRef.current
    if (!s || !hasMore) return
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) loadMore() }, { rootMargin: '400px' })
    obs.observe(s)
    return () => obs.disconnect()
  }, [hasMore, loadMore])

  function toggleNear(): void {
    if (near) { setNear(null); return }
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setNear({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false) },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or breed…"
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={species} onChange={(e) => setSpecies(e.target.value)} className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none cursor-pointer">
          <option value="">All species</option>
          {SPECIES.map((s) => <option key={s} value={s}>{s[0]!.toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={sex} onChange={(e) => setSex(e.target.value)} className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none cursor-pointer">
          <option value="">Any sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button onClick={toggleNear} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${near ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40'}`}>
          {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}Near me
        </button>
        <button onClick={() => setHealthTested((v) => !v)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${healthTested ? 'bg-green-600 text-white border-green-600' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40'}`}>Health-tested</button>
        <button onClick={() => setRegistered((v) => !v)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${registered ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40'}`}>Registered</button>
      </div>

      {/* Saved-search alerts */}
      <div className="flex items-center justify-between">
        <button onClick={saveAlert} className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline cursor-pointer"><Bell className="w-3.5 h-3.5" />Alert me for these filters</button>
        {alerts.length > 0 && <button onClick={() => setShowAlerts((v) => !v)} className="text-[12px] text-outline hover:text-on-surface cursor-pointer">{alerts.length} saved {alerts.length === 1 ? 'alert' : 'alerts'}</button>}
      </div>
      {showAlerts && alerts.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 space-y-1.5">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between text-[12px]">
              <span className="text-on-surface-variant capitalize">{[a.species, a.sex, a.breed, a.nearLat != null ? `within ${a.radiusKm}km` : null].filter(Boolean).join(' · ') || 'Any match'}</span>
              <button onClick={() => dropAlert(a.id)} className="p-1 rounded text-red-500 hover:bg-red-500/10 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Empty text="No breeding profiles match. Try clearing filters, or list your pet." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((p) => <BreedingCard key={p.id} p={p} onOpen={() => onOpen(p.id)} />)}
          </div>
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <div className="flex justify-center py-3"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}
        </>
      )}
    </div>
  )
}

// ── Matches for my pet ────────────────────────────────────────────────────────
function MatchesTab({ onOpen }: { onOpen: (id: string) => void }): React.JSX.Element {
  const [pets, setPets] = useState<Pet[]>([])
  const [petId, setPetId] = useState('')
  const [matches, setMatches] = useState<BreedingProfile[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    petsApi.mine().then((d) => { setPets(d); setPetId((p) => p || d[0]?.id || '') }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!petId) return undefined
    const t = setTimeout(() => {
      setLoading(true)
      breedingApi.matches(petId).then(setMatches).catch(() => setMatches([])).finally(() => setLoading(false))
    }, 0)
    return () => clearTimeout(t)
  }, [petId])

  const activePet = pets.find((p) => p.id === petId)

  return (
    <div className="space-y-3">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
        <label className="text-[12px] font-semibold text-outline flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-primary" />Find mates for</label>
        {pets.length === 0 ? (
          <p className="text-label-sm text-outline mt-1">Add a pet in your <a href="/health-passport" className="text-primary hover:underline">Health Passport</a> first — then we&apos;ll suggest compatible, opposite-sex matches of the same breed nearby.</p>
        ) : (
          <select value={petId} onChange={(e) => setPetId(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none">
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.species}{p.breed ? ` · ${p.breed}` : ''}{p.sex ? ` · ${p.sex}` : ''}</option>)}
          </select>
        )}
        {activePet && !activePet.sex && <p className="text-[11px] text-amber-600 mt-1.5">Tip: set {activePet.name}&apos;s sex in Health Passport for better opposite-sex matches.</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[0, 1].map((i) => <div key={i} className="h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
      ) : matches.length === 0 ? (
        <Empty text={pets.length === 0 ? 'No pet selected.' : 'No compatible matches yet. Check back as more pets are listed.'} />
      ) : (
        <>
          <p className="text-[12px] text-outline px-1">{matches.length} compatible {matches.length === 1 ? 'match' : 'matches'} — same species, opposite sex, same breed first.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matches.map((p) => <BreedingCard key={p.id} p={p} onOpen={() => onOpen(p.id)} />)}
          </div>
        </>
      )}
    </div>
  )
}

// ── My listings ───────────────────────────────────────────────────────────────
function MineTab({ onOpen, onEdit, onCreate }: { onOpen: (id: string) => void; onEdit: (p: BreedingProfile) => void; onCreate: () => void }): React.JSX.Element {
  const [mine, setMine] = useState<BreedingProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    breedingApi.mine().then(setMine).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function del(p: BreedingProfile): Promise<void> {
    if (!window.confirm(`Remove ${p.petName} from breeding?`)) return
    try { await breedingApi.remove(p.id); setMine((m) => m.filter((x) => x.id !== p.id)) } catch { /* ignore */ }
  }

  if (loading) return <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
  if (mine.length === 0) return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
      <Dna className="w-8 h-8 text-primary mx-auto mb-2" />
      <p className="text-label-md font-semibold text-on-surface">No listings yet</p>
      <p className="text-label-sm text-outline mb-4">List one of your pets — link it to the Health Passport to show vaccination status.</p>
      <button onClick={onCreate} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 cursor-pointer">List your pet</button>
    </div>
  )

  return (
    <div className="space-y-3">
      {mine.map((p) => (
        <div key={p.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 flex gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
            {p.coverUrl ? <Img src={p.coverUrl} alt="" className="w-full h-full object-cover" /> : <Dna className="w-6 h-6 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-label-md text-on-surface truncate">{p.petName} <span className="text-[11px] font-normal text-outline">· {p.breed}</span></p>
            <p className="text-[12px] text-outline capitalize">{p.sex} · {p.species} · {p.status}</p>
            <button onClick={() => onOpen(p.id)} className="flex items-center gap-1 mt-1 text-[12px] text-primary font-semibold hover:underline"><Heart className="w-3.5 h-3.5" />{p.requestsCount} request{p.requestsCount === 1 ? '' : 's'}</button>
          </div>
          <div className="flex items-start gap-1">
            <button onClick={() => onEdit(p)} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => del(p)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Litters (Litter → Adoption pipeline) ──────────────────────────────────────
function LittersTab(): React.JSX.Element {
  const router = useRouter()
  const [litters, setLitters] = useState<BreedingLitter[]>([])
  const [loading, setLoading] = useState(true)
  const [offspringFor, setOffspringFor] = useState<BreedingLitter | null>(null)

  useEffect(() => { breedingApi.litters().then(setLitters).catch(() => {}).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
  if (litters.length === 0) return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
      <Baby className="w-8 h-8 text-primary mx-auto mb-2" />
      <p className="text-label-md font-semibold text-on-surface">No litters yet</p>
      <p className="text-label-sm text-outline">After a match is accepted, record the litter from the match to track it and list the offspring for adoption.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {litters.map((l) => (
        <div key={l.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-label-md text-on-surface truncate">{l.petName} <span className="text-[11px] font-normal text-outline">× {l.withName}</span></p>
              <p className="text-[12px] text-outline capitalize">{l.breed ?? l.species}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.status === 'born' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{l.status === 'born' ? 'Born' : 'Expecting'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12px] text-outline">
            {l.bornAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Born {l.bornAt}</span>}
            {!l.bornAt && l.expectedAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {l.expectedAt}</span>}
            {l.count != null && <span>{l.count} in litter</span>}
            {l.listedCount > 0 && <span className="text-primary font-semibold">{l.listedCount} listed for adoption</span>}
          </div>
          {l.notes && <p className="text-[12px] text-on-surface-variant mt-1.5">{l.notes}</p>}
          {l.canManage && (
            <button onClick={() => setOffspringFor(l)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 cursor-pointer"><Heart className="w-3.5 h-3.5" />List a pup for adoption</button>
          )}
        </div>
      ))}
      {offspringFor && <OffspringModal litter={offspringFor} onClose={() => setOffspringFor(null)} onListed={(adoptionId) => {
        setLitters((prev) => prev.map((x) => x.id === offspringFor.id ? { ...x, listedCount: x.listedCount + 1 } : x))
        setOffspringFor(null)
        router.push(`/adoption/${adoptionId}`)
      }} />}
    </div>
  )
}

function OffspringModal({ litter, onClose, onListed }: { litter: BreedingLitter; onClose: () => void; onListed: (adoptionId: string) => void }): React.JSX.Element {
  const cap = (s: string | null): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Dog'
  const [name, setName] = useState(`${litter.breed ?? cap(litter.species)} pup`)
  const [listingType, setListingType] = useState<'adopt' | 'sale'>('adopt')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  async function save(): Promise<void> {
    if (saving || !name.trim()) return
    setSaving(true); setError('')
    try {
      const amt = amount ? Number(amount) : undefined
      const created = await adoptionApi.create({
        name: name.trim(), species: cap(litter.species), listingType,
        ...(litter.breed ? { breed: litter.breed } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(listingType === 'sale' && amt ? { price: amt } : {}),
        ...(listingType === 'adopt' && amt ? { fee: amt } : {}),
      })
      await breedingApi.markLitterListed(litter.id).catch(() => {})
      onListed(created.id)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create listing') } finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-label-md font-bold text-on-surface">List a pup for adoption</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-label-sm text-outline mb-3">Creates an Adoption listing pre-filled from this litter ({litter.breed ?? cap(litter.species)}). You can add photos and details on the listing.</p>
        <div className="space-y-3">
          <div><label className="text-[12px] font-semibold text-outline">Name / title</label><input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className={input} /></div>
          <div className="flex gap-2">
            <button onClick={() => setListingType('adopt')} className={`flex-1 py-2 rounded-xl text-label-sm font-semibold border ${listingType === 'adopt' ? 'bg-primary text-white border-primary' : 'border-outline-variant/40 text-on-surface-variant'}`}>Adopt</button>
            <button onClick={() => setListingType('sale')} className={`flex-1 py-2 rounded-xl text-label-sm font-semibold border ${listingType === 'sale' ? 'bg-primary text-white border-primary' : 'border-outline-variant/40 text-on-surface-variant'}`}>For sale</button>
          </div>
          <div><label className="text-[12px] font-semibold text-outline">{listingType === 'sale' ? 'Price (₹)' : 'Adoption fee (₹, optional)'}</label><input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={listingType === 'sale' ? 'e.g. 15000' : 'Optional'} className={input} /></div>
          <div><label className="text-[12px] font-semibold text-outline">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={2} placeholder="Vaccinations, temperament, parents…" className={`${input} resize-none`} /></div>
          {error && <p className="text-label-sm text-red-500">{error}</p>}
          <button onClick={save} disabled={saving || !name.trim()} className="w-full py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}<ArrowUpRight className="w-4 h-4" />Create adoption listing
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
function BreedingCard({ p, onOpen }: { p: BreedingProfile; onOpen: () => void }): React.JSX.Element {
  return (
    <div onClick={onOpen} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="relative h-40 bg-surface-container overflow-hidden">
        {p.coverUrl ? <Img src={p.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center"><Dna className="w-9 h-9 text-primary/40" /></div>}
        {p.owner.isVerified && <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-primary text-[10px] font-bold"><BadgeCheck className="w-3 h-3" />Verified</span>}
        <span className="absolute top-2 right-2"><SexBadge sex={p.sex} /></span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate flex items-center gap-1">{p.petName}{p.verifiedBy && <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}</h3>
          {p.matchScore != null
            ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white flex-shrink-0">{p.matchScore}% match</span>
            : p.fee != null && p.fee > 0 ? <span className="text-label-sm font-bold text-secondary flex-shrink-0">{money(p.fee, p.currency)}</span> : null}
        </div>
        <p className="text-[12px] text-on-surface-variant capitalize">{p.breed}{p.age ? ` · ${p.age}` : ''}</p>

        <div className="flex flex-wrap items-center gap-1 mt-2">
          {p.availableNow && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[9px] font-bold">Available</span>}
          {p.vaccinated && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-bold"><Syringe className="w-2.5 h-2.5" />Vaccinated</span>}
          {p.healthTests.length > 0 && <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold">{p.healthTests.length} health test{p.healthTests.length === 1 ? '' : 's'}</span>}
          {p.registered && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[9px] font-bold"><Award className="w-2.5 h-2.5" />Registered</span>}
          {p.willingToTravel && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[9px] font-bold"><PlaneTakeoff className="w-2.5 h-2.5" />Travels</span>}
        </div>

        {p.matchWarnings.length > 0 && (
          <p className="flex items-start gap-1 mt-1.5 text-[10px] text-amber-600"><AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />{p.matchWarnings[0]}</p>
        )}

        <div className="flex items-center gap-2 mt-2 text-[11px] text-outline min-w-0">
          {p.location && <LocationLink location={p.location} iconClassName="w-3 h-3" className="truncate" />}
          {p.distanceKm != null && <span className="flex items-center gap-0.5 flex-shrink-0"><Navigation className="w-3 h-3" />{p.distanceKm} km</span>}
        </div>
      </div>
    </div>
  )
}

function Empty({ text }: { text: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
      <Dna className="w-8 h-8 text-primary mx-auto mb-2" />
      <p className="text-label-sm text-outline">{text}</p>
    </div>
  )
}
