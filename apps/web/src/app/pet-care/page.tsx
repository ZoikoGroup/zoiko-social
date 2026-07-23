'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HeartHandshake, Search, Plus, MapPin, Star, Calendar, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { usePagedList } from '@/hooks/use-cache'
import { providersApi, type Provider } from '@/lib/api'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { LocationInput } from '@/components/LocationInput'
import { AddProviderModal } from '@/components/ServiceDirectory'

export default function PetCarePage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  const listKey = `providers:pet_care:${query.trim()}:${location.trim()}`
  const {
    items, isLoading: loading, hasMore, loadMore, patch: patchItems,
  } = usePagedList<Provider>(
    listKey,
    (cursor) => providersApi.browse('pet_care', { ...(query.trim() ? { q: query.trim() } : {}), ...(location.trim() ? { location: location.trim() } : {}) }, cursor),
    (query || location) ? 300 : 0,
  )

  useEffect(() => {
    const s = sentinelRef.current
    if (!s || !hasMore) return
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) loadMore() }, { rootMargin: '400px' })
    obs.observe(s)
    return () => obs.disconnect()
  }, [hasMore, loadMore])

  if (authLoading || !isAuthenticated) return <LoadingSkeleton />

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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Pet Care Services</h1>
                  <p className="text-label-sm text-outline">Grooming, boarding, walking & more</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/pet-care/my-bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-outline-variant/40 text-label-sm text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                  <Calendar className="w-4 h-4" /> My Bookings
                </Link>
                <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or service…"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none"
                />
              </div>
              <div className="relative sm:w-44">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <LocationInput
                  value={location}
                  onChange={setLocation}
                  placeholder="Location"
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl text-label-sm border border-transparent focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Provider Cards */}
            {loading ? (
              <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : items.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <HeartHandshake className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="text-label-md font-bold text-on-surface">No providers yet</h3>
                <p className="text-label-sm text-outline mt-1 mb-4">Be the first to add a pet care service for the community.</p>
                <button onClick={() => setAddOpen(true)} className="px-5 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold cursor-pointer">
                  Add a Service
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
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

      {addOpen && (
        <AddProviderModal
          category="pet_care"
          serviceTypes={['Grooming', 'Boarding', 'Walking', 'Training', 'Pet Sitting', 'Daycare', 'Other']}
          title="Add a Service"
          onClose={() => setAddOpen(false)}
          onAdded={(p) => patchItems((prev) => [p, ...prev])}
        />
      )}
    </>
  )
}

// ── Enhanced Provider Card ───────────────────────────────────────────────────

function ProviderCard({ provider }: { provider: Provider }): React.JSX.Element {
  const router = useRouter()
  const handleClick = () => router.push(`/pet-care/${provider.id}`)

  return (
    <div
      onClick={handleClick}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex gap-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] group"
    >
      {/* Cover image / icon */}
      <div className="w-16 h-16 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
        {provider.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <HeartHandshake className="w-7 h-7 text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-label-md text-on-surface truncate group-hover:text-primary transition-colors">{provider.name}</h3>
              {provider.serviceType && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {provider.serviceType}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {provider.location && (
                <span className="flex items-center gap-1 text-[12px] text-outline">
                  <MapPin className="w-3 h-3" /> {provider.location}
                </span>
              )}
            </div>
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="text-label-sm font-semibold text-on-surface">—</span>
          </div>
        </div>

        {provider.description && (
          <p className="text-label-sm text-on-surface-variant mt-1.5 line-clamp-2">{provider.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-outline-variant/10">
          {provider.phone && (
            <a href={`tel:${provider.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[11px] text-outline hover:text-primary transition-colors">
              📞 {provider.phone}
            </a>
          )}
          {provider.location && (
            <span className="flex items-center gap-1 text-[11px] text-outline">
              📍 {provider.location}
            </span>
          )}
          <span className="ml-auto text-[11px] text-primary font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton(): React.JSX.Element {
  return (
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
}
