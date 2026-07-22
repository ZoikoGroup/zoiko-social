'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePagedList } from '@/hooks/use-cache'
import { Header } from '@/components/Header'
import { Img } from '@/components/Img'
import { ProfileCard } from '@/components/ProfileCard'
import { LocationLink } from '@/components/LocationLink'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import { EventFormModal } from '@/components/events/EventFormModal'
import { Calendar, Globe, Plus, Users, Check, Search, Film, Ticket, Navigation } from 'lucide-react'
import { eventsApi, EVENT_CATEGORIES, EVENT_CATEGORY_LABELS, type EventItem, type EventFilters } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

function dateBadge(iso: string): { mon: string; day: string } {
  const d = new Date(iso)
  return { mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), day: String(d.getDate()) }
}
function when(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function EventsPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  const [tab, setTab] = useState<'upcoming' | 'hosting' | 'past'>('upcoming')
  const [category, setCategory] = useState('')
  const [free, setFree] = useState(false)
  const [search, setSearch] = useState('')
  const [near, setNear] = useState<{ lat: number; lng: number } | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const useNear = near && tab === 'upcoming'
  const filters: EventFilters = {
    ...(tab === 'hosting' ? { mine: true } : {}),
    ...(tab === 'past' ? { past: true } : {}),
    ...(category ? { category } : {}),
    ...(free ? { free: true } : {}),
    ...(search.trim() ? { q: search.trim() } : {}),
    ...(useNear ? { nearLat: near.lat, nearLng: near.lng } : {}),
  }
  const listKey = `events:${tab}:${category}:${free ? 1 : 0}:${search.trim()}:${useNear ? 'near' : ''}`

  function toggleNear(): void {
    if (near) { setNear(null); return }
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setNear({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }

  const {
    items: events, isLoading: loading, isRefreshing, hasMore, loadMore, patch: patchEvents,
  } = usePagedList<EventItem>(listKey, (cursor) => eventsApi.upcoming(cursor, 15, filters))

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    const s = sentinelRef.current
    if (!s || !hasMore) return
    const obs = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) loadMore() }, { rootMargin: '400px' })
    obs.observe(s)
    return () => obs.disconnect()
  }, [hasMore, loadMore])

  async function toggleRsvp(ev: EventItem): Promise<void> {
    const optimistic = !ev.viewerGoing
    patchEvents((prev) => prev.map((e) => e.id === ev.id ? { ...e, viewerGoing: optimistic, goingCount: e.goingCount + (optimistic ? 1 : -1) } : e))
    try {
      const r = optimistic ? await eventsApi.rsvp(ev.id) : await eventsApi.cancelRsvp(ev.id)
      patchEvents((prev) => prev.map((e) => e.id === ev.id ? { ...e, viewerGoing: r.going, goingCount: r.goingCount } : e))
    } catch {
      patchEvents((prev) => prev.map((e) => e.id === ev.id ? { ...e, viewerGoing: ev.viewerGoing, goingCount: ev.goingCount } : e))
    }
  }

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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Events</h1>
                  <p className="text-label-sm text-outline">Adoption days, workshops & meetups</p>
                </div>
              </div>
              <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />Create
              </button>
            </div>

            {/* Tabs + filters */}
            <div className="space-y-2">
              <div className="flex gap-2">
                {(['upcoming', 'hosting', 'past'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-3.5 py-1.5 rounded-full text-label-sm font-semibold capitalize cursor-pointer transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events"
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
                </div>
                <button onClick={() => setFree((v) => !v)}
                  className={`px-3.5 py-2 rounded-xl text-label-sm font-semibold cursor-pointer border transition-colors ${free ? 'bg-primary text-white border-primary' : 'border-outline-variant/40 text-on-surface-variant hover:border-primary/30'}`}>Free</button>
                {tab === 'upcoming' && (
                  <button onClick={toggleNear} title="Sort by distance"
                    className={`px-3.5 py-2 rounded-xl text-label-sm font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${near ? 'bg-primary text-white border-primary' : 'border-outline-variant/40 text-on-surface-variant hover:border-primary/30'}`}>
                    <Navigation className="w-3.5 h-3.5" />Near me
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => setCategory('')}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 ${category === '' ? 'bg-primary/10 text-primary' : 'bg-surface-container-lowest text-outline border border-outline-variant/30'}`}>All</button>
                {EVENT_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(category === c ? '' : c)}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 ${category === c ? 'bg-primary/10 text-primary' : 'bg-surface-container-lowest text-outline border border-outline-variant/30'}`}>{EVENT_CATEGORY_LABELS[c]}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">{[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}</div>
            ) : events.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md font-semibold text-on-surface">No upcoming events</p>
                <p className="text-label-sm text-outline">Create the first one for the community.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((e) => {
                  const b = dateBadge(e.startsAt)
                  const category = e.category ? (EVENT_CATEGORY_LABELS[e.category] ?? e.category) : null
                  return (
                    <div key={e.id} className="relative bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden hover:border-primary/40 transition-colors">
                      <Link href={`/events/${e.id}`} aria-label={e.title} className="absolute inset-0 z-0" />
                      <div className="flex gap-4 p-4">
                        {e.coverUrl ? (
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container relative">
                            <Img src={e.coverUrl} alt="" className="w-full h-full object-cover" />
                            {e.videoUrl && <span className="absolute bottom-1 right-1 bg-black/60 rounded-full p-1"><Film className="w-3 h-3 text-white" /></span>}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary leading-none">{b.mon}</span>
                            <span className="text-headline-md font-bold text-primary leading-tight">{b.day}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {category && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide">{category}</span>}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${e.isFree ? 'bg-emerald-500/10 text-emerald-600' : 'bg-secondary/10 text-secondary'}`}>
                              <Ticket className="w-2.5 h-2.5" />{e.isFree ? 'FREE' : (e.price || 'PAID')}
                            </span>
                            {e.seatsLeft !== null && <span className={`text-[10px] font-semibold ${e.seatsLeft === 0 ? 'text-red-500' : 'text-outline'}`}>{e.seatsLeft === 0 ? 'Sold out' : `${e.seatsLeft} left`}</span>}
                            {e.visibility === 'followers' && <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold flex items-center gap-1"><Users className="w-2.5 h-2.5" />FOLLOWERS</span>}
                            {e.distanceKm != null && <span className="text-[10px] font-semibold text-primary flex items-center gap-0.5"><Navigation className="w-2.5 h-2.5" />{e.distanceKm} km</span>}
                          </div>
                          <h3 className="text-label-md font-bold text-on-surface">{e.title}</h3>
                          <p className="text-[12px] text-outline mt-0.5">{when(e.startsAt)}</p>
                          <p className="flex items-center gap-1 text-[12px] text-on-surface-variant mt-1">
                            {e.isOnline ? <><Globe className="w-3.5 h-3.5 text-primary" />Online</> : e.location ? <LocationLink location={e.location} iconClassName="w-3.5 h-3.5" className="text-primary" /> : null}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 text-[12px] text-outline">
                              <UserAvatar name={e.host.displayName} image={e.host.avatarUrl ?? undefined} size="xs" verified={e.host.isVerified} />
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.goingCount} going</span>
                            </div>
                            <button onClick={() => toggleRsvp(e)}
                              className={`relative z-20 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-label-sm font-semibold transition-colors cursor-pointer ${e.viewerGoing ? 'bg-primary/10 text-primary' : 'bg-primary text-white hover:bg-primary/90'}`}>
                              {e.viewerGoing ? <><Check className="w-3.5 h-3.5" />Going</> : 'RSVP'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

      {createOpen && <EventFormModal onClose={() => setCreateOpen(false)} onSaved={(ev) => patchEvents((prev) => [ev, ...prev])} />}
    </>
  )
}
