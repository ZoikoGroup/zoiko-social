'use client'

import { useEffect, useRef, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import { Calendar, MapPin, Globe, Plus, X, Users, Check, Loader2 } from 'lucide-react'
import { eventsApi, type EventItem } from '@/lib/api'
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
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    items: events, isLoading: loading, isRefreshing, hasMore, loadMore, patch: patchEvents,
  } = usePagedList<EventItem>('events', (cursor) => eventsApi.upcoming(cursor))

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
                  return (
                    <div key={e.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary leading-none">{b.mon}</span>
                          <span className="text-headline-md font-bold text-primary leading-tight">{b.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-label-md font-bold text-on-surface">{e.title}</h3>
                          <p className="text-[12px] text-outline mt-0.5">{when(e.startsAt)}</p>
                          <p className="flex items-center gap-1 text-[12px] text-on-surface-variant mt-1">
                            {e.isOnline ? <><Globe className="w-3.5 h-3.5 text-primary" />Online</> : e.location ? <><MapPin className="w-3.5 h-3.5 text-primary" />{e.location}</> : null}
                          </p>
                          {e.description && <p className="text-label-sm text-on-surface-variant mt-2 line-clamp-2">{e.description}</p>}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 text-[12px] text-outline">
                              <UserAvatar name={e.host.displayName} image={e.host.avatarUrl ?? undefined} size="xs" verified={e.host.isVerified} />
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.goingCount} going</span>
                            </div>
                            <button onClick={() => toggleRsvp(e)}
                              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-label-sm font-semibold transition-colors cursor-pointer ${e.viewerGoing ? 'bg-primary/10 text-primary' : 'bg-primary text-white hover:bg-primary/90'}`}>
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

      {createOpen && <CreateEventModal onClose={() => setCreateOpen(false)} onCreated={(ev) => patchEvents((prev) => [ev, ...prev])} />}
    </>
  )
}

function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: (e: EventItem) => void }): React.JSX.Element {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [startsAt, setStartsAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(): Promise<void> {
    if (saving || !title.trim() || !startsAt) return
    setSaving(true); setError('')
    try {
      const ev = await eventsApi.create({
        title: title.trim(),
        startsAt: new Date(startsAt).toISOString(),
        isOnline,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(!isOnline && location.trim() ? { location: location.trim() } : {}),
      })
      onCreated(ev); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create event') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface">Create event</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} autoFocus placeholder="Event title"
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} placeholder="Description (optional)"
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none" />
          <label className="text-[11px] text-outline block">Starts at
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
          </label>
          <button onClick={() => setIsOnline((v) => !v)} className="flex items-center gap-2 text-label-sm text-on-surface-variant cursor-pointer">
            {isOnline ? <Globe className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4" />}{isOnline ? 'Online event' : 'In-person'}
          </button>
          {!isOnline && (
            <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} placeholder="Location"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
          )}
          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !title.trim() || !startsAt}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Create event
          </button>
        </div>
      </div>
    </div>
  )
}
