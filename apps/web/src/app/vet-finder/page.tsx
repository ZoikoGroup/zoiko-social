'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Stethoscope, Search, MapPin, Plus, Star, Phone, BadgeCheck, Clock,
  Siren, Navigation, Loader2, Video, Home, Building2,
} from 'lucide-react'
import { usePagedList } from '@/hooks/use-cache'
import { providersApi, type Provider, type ProviderFilters } from '@/lib/api'
import { CONSULT_MODE_LABELS, SPECIALTIES } from '@/lib/vet'
import { LocationInput } from '@/components/LocationInput'
import { LocationLink } from '@/components/LocationLink'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { useAuth } from '@/hooks/use-auth'

const MODE_ICON: Record<string, typeof Video> = { in_clinic: Building2, home_visit: Home, video: Video }

export default function VetFinderPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [emergency, setEmergency] = useState(false)
  const [openNow, setOpenNow] = useState(false)
  const [specialty, setSpecialty] = useState('')
  const [near, setNear] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const filters = useMemo<ProviderFilters>(() => ({
    ...(query.trim() ? { q: query.trim() } : {}),
    ...(location.trim() ? { location: location.trim() } : {}),
    ...(emergency ? { emergency: true } : {}),
    ...(openNow ? { openNow: true } : {}),
    ...(specialty ? { specialty } : {}),
    ...(near ? { near } : {}),
  }), [query, location, emergency, openNow, specialty, near])

  const listKey = `vets:${JSON.stringify(filters)}`
  const { items, isLoading: loading, hasMore, loadMore } = usePagedList<Provider>(
    listKey,
    (cursor) => providersApi.browse('vet', filters, cursor),
    (query || location) ? 300 : 0,
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

  if (authLoading || !isAuthenticated) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-6 lg:col-start-4 space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}
          </div>
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
            {/* Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Stethoscope className="w-5 h-5 text-primary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Vet Finder</h1>
                  <p className="text-label-sm text-outline">Trusted vets & clinics near you</p>
                </div>
              </div>
              <Link href="/vet-finder/dashboard" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />List your clinic
              </Link>
            </div>

            {/* Emergency banner */}
            <button
              onClick={() => setEmergency((v) => !v)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${emergency ? 'bg-red-500/10 border-red-500/40' : 'bg-surface-container-lowest border-outline-variant/30 hover:border-red-500/30'}`}
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0"><Siren className="w-5 h-5 text-red-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md font-bold text-on-surface">Pet emergency?</p>
                <p className="text-[12px] text-outline">{emergency ? 'Showing emergency & 24×7 clinics only' : 'Tap to show only emergency & 24×7 clinics'}</p>
              </div>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${emergency ? 'bg-red-600 text-white' : 'bg-surface-container text-outline'}`}>{emergency ? 'ON' : 'OFF'}</span>
            </button>

            {/* Search + filters */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clinic or service…"
                    className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none" />
                </div>
                <div className="relative sm:w-44">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline z-10" />
                  <LocationInput value={location} onChange={setLocation} placeholder="Location"
                    className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={toggleNear} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${near ? 'bg-primary text-white border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-primary'}`}>
                  {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                  {near ? 'Near me: on' : 'Near me'}
                </button>
                <button onClick={() => setOpenNow((v) => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${openNow ? 'bg-green-600 text-white border-green-600' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-green-600'}`}>
                  <Clock className="w-3.5 h-3.5" />Open now
                </button>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-surface-container-low text-on-surface-variant border border-outline-variant/40 focus:border-primary focus:outline-none cursor-pointer">
                  <option value="">All specialties</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : items.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <Stethoscope className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md font-semibold text-on-surface">No clinics found</p>
                <p className="text-label-sm text-outline">{emergency || openNow || near || specialty ? 'Try clearing some filters.' : 'Be the first to list a clinic for the community.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((p) => <VetCard key={p.id} p={p} onOpen={() => router.push(`/vet-finder/${p.id}`)} />)}
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
    </>
  )
}

function VetCard({ p, onOpen }: { p: Provider; onOpen: () => void }): React.JSX.Element {
  const verified = p.isVerified || p.addedBy.isVerified
  return (
    <div onClick={onOpen} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex gap-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]">
      <div className="w-16 h-16 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
        {p.logoUrl || p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logoUrl ?? p.coverUrl ?? ''} alt="" className="w-full h-full object-cover" />
        ) : <Stethoscope className="w-7 h-7 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-label-lg text-on-surface truncate">{p.name}</h3>
              {verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
            {p.reviewCount > 0 && (
              <div className="flex items-center gap-1 mt-0.5 text-[12px] text-outline">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-on-surface">{p.rating.toFixed(1)}</span>
                <span>({p.reviewCount})</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {p.is24x7
              ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">24×7</span>
              : p.openNow === true ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Open now</span>
              : p.openNow === false ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-outline">Closed</span>
              : null}
            {p.emergencyAvailable && <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700"><Siren className="w-2.5 h-2.5" />Emergency</span>}
          </div>
        </div>

        {p.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.specialties.slice(0, 3).map((s) => <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{s}</span>)}
            {p.specialties.length > 3 && <span className="text-[10px] text-outline px-1">+{p.specialties.length - 3}</span>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[12px] text-outline">
          {p.location && <LocationLink location={p.location} iconClassName="w-3.5 h-3.5" />}
          {p.distanceKm != null && <span className="flex items-center gap-0.5"><Navigation className="w-3 h-3" />{p.distanceKm} km</span>}
          {p.consultModes.map((m) => {
            const Icon = MODE_ICON[m] ?? Building2
            return <span key={m} className="flex items-center gap-0.5"><Icon className="w-3 h-3" />{CONSULT_MODE_LABELS[m] ?? m}</span>
          })}
        </div>

        {p.phone && (
          <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${p.emergencyAvailable ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            <Phone className="w-3.5 h-3.5" />{p.emergencyAvailable ? 'Call now' : 'Call'}
          </a>
        )}
      </div>
    </div>
  )
}
