'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Calendar, Clock, Globe, Users, Check, Star, Ticket, Loader2, Trash2,
  Link2, CalendarPlus, Timer, Pencil, X,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { Img } from '@/components/Img'
import { LocationLink } from '@/components/LocationLink'
import { UserAvatar } from '@/components/UserAvatar'
import { EventFormModal } from '@/components/events/EventFormModal'
import { eventsApi, ApiError, EVENT_CATEGORY_LABELS, type EventItem, type EventAttendee } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
function fmtDuration(a: string, b: string): string {
  const mins = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000)
  if (mins <= 0) return ''
  const h = Math.floor(mins / 60), m = mins % 60
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ')
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const [ev, setEv] = useState<EventItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const [status, setStatus] = useState<'going' | 'interested' | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [attendeesOpen, setAttendeesOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    eventsApi.get(id)
      .then((e) => { if (!cancelled) { setEv(e); setStatus(e.viewerGoing ? 'going' : null) } })
      .catch((e) => {
        if (cancelled || !(e instanceof ApiError)) return
        if (e.code === 'EVENT_PRIVATE') setForbidden(true)
        else setNotFound(true)
      })
    return () => { cancelled = true }
  }, [id])

  const isHost = !!(user && ev && user.id === ev.host.id)
  const full = !!ev && ev.seatsLeft === 0 && status !== 'going'

  async function setRsvp(next: 'going' | 'interested'): Promise<void> {
    if (!ev || busy) return
    setBusy(true); setRsvpError('')
    try {
      if (status === next) {
        const r = await eventsApi.cancelRsvp(ev.id)
        setStatus(null)
        setEv({ ...ev, goingCount: r.goingCount, seatsLeft: ev.capacity !== null ? Math.max(0, ev.capacity - r.goingCount) : null })
      } else {
        const r = await eventsApi.rsvp(ev.id, next)
        setStatus(next)
        setEv({ ...ev, goingCount: r.goingCount, seatsLeft: ev.capacity !== null ? Math.max(0, ev.capacity - r.goingCount) : null })
      }
    } catch (e) {
      setRsvpError(e instanceof ApiError && e.code === 'EVENT_FULL' ? 'This event is full.' : 'Could not update RSVP.')
    } finally { setBusy(false) }
  }

  async function copyLink(): Promise<void> {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* ignore */ }
  }

  async function remove(): Promise<void> {
    if (!ev || deleting) return
    setDeleting(true)
    try { await eventsApi.remove(ev.id); window.location.href = '/events' } catch { setDeleting(false) }
  }

  if (notFound || forbidden) return (
    <><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        {forbidden ? <Users className="w-10 h-10 text-outline mx-auto mb-2" /> : <Calendar className="w-10 h-10 text-outline mx-auto mb-2" />}
        <p className="text-label-md font-semibold text-on-surface">{forbidden ? 'Followers-only event' : 'Event not found'}</p>
        {forbidden && <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">Follow the host to see this event.</p>}
        <Link href="/events" className="inline-block mt-4 px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold">Browse events</Link></div>
    </main></>
  )

  if (!ev) return (
    <><Header /><main className="pt-20 min-h-screen bg-background">
      <div className="max-w-container-max mx-auto px-2 md:px-5 py-4"><div className="h-72 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 animate-pulse" /></div>
    </main></>
  )

  const category = ev.category ? (EVENT_CATEGORY_LABELS[ev.category] ?? ev.category) : null
  const duration = ev.endsAt ? fmtDuration(ev.startsAt, ev.endsAt) : ''

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-background pb-24">
        {/* ── Hero banner (BookMyShow-style) ── */}
        <div className="relative w-full bg-surface-container-high">
          <div className="relative w-full aspect-[21/9] max-h-[460px] overflow-hidden bg-gradient-to-br from-primary/25 to-secondary/25">
            {ev.videoUrl ? (
              <video src={ev.videoUrl} controls playsInline poster={ev.coverUrl ?? undefined} className="w-full h-full object-cover">
                <track kind="captions" />
              </video>
            ) : ev.coverUrl ? (
              <Img src={ev.coverUrl} alt={ev.title} priority className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Calendar className="w-16 h-16 text-white/50" /></div>
            )}
            {!ev.videoUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />}
            {/* Back */}
            <Link href="/events" className="absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur text-white text-label-sm hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-4 h-4" />Events
            </Link>
            {/* Title overlay (image heroes only) */}
            {!ev.videoUrl && (
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="max-w-container-max mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    {category && <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wide">{category}</span>}
                    {ev.isOnline && <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1"><Globe className="w-3 h-3" />Online</span>}
                    {ev.visibility === 'followers' && <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1"><Users className="w-3 h-3" />Followers only</span>}
                  </div>
                  <h1 className="text-white font-headline text-[26px] md:text-4xl font-bold leading-tight drop-shadow">{ev.title}</h1>
                  <p className="text-white/90 text-label-md mt-1">{fmtDate(ev.startsAt)} · {fmtTime(ev.startsAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-container-max mx-auto px-2 md:px-5 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video-hero title block (shown here when hero is a video) */}
            {ev.videoUrl && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {category && <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide">{category}</span>}
                  {ev.isOnline && <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold flex items-center gap-1"><Globe className="w-3 h-3" />Online</span>}
                  {ev.visibility === 'followers' && <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold flex items-center gap-1"><Users className="w-3 h-3" />Followers only</span>}
                </div>
                <h1 className="font-headline text-[26px] md:text-3xl font-bold text-on-surface leading-tight">{ev.title}</h1>
              </div>
            )}

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Fact Icon={Calendar} label="Date" value={fmtDate(ev.startsAt)} />
              <Fact Icon={Clock} label="Time" value={`${fmtTime(ev.startsAt)}${ev.endsAt ? ` – ${fmtTime(ev.endsAt)}` : ''}`} />
              {duration && <Fact Icon={Timer} label="Duration" value={duration} />}
              <Fact Icon={Users} label="Going" value={`${ev.goingCount}${ev.capacity !== null ? ` / ${ev.capacity}` : ''}`} />
            </div>
            <button onClick={() => setAttendeesOpen(true)} className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-1.5 cursor-pointer">
              <Users className="w-4 h-4" />See who&apos;s going
            </button>

            {/* Venue */}
            {!ev.isOnline && (ev.venueName || ev.location) && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                <h2 className="text-label-md font-bold text-on-surface mb-1">Venue</h2>
                {ev.venueName && <p className="text-label-md text-on-surface">{ev.venueName}</p>}
                {ev.location && <LocationLink location={ev.location} iconClassName="w-4 h-4" className="text-primary text-label-sm mt-0.5" />}
                {ev.latitude != null && ev.longitude != null && (
                  <iframe
                    title="Event location map"
                    loading="lazy"
                    className="w-full h-48 rounded-lg mt-3 border border-outline-variant/30"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${ev.longitude - 0.008}%2C${ev.latitude - 0.006}%2C${ev.longitude + 0.008}%2C${ev.latitude + 0.006}&layer=mapnik&marker=${ev.latitude}%2C${ev.longitude}`}
                  />
                )}
              </div>
            )}

            {/* About */}
            {ev.description && (
              <div>
                <h2 className="text-label-md font-bold text-on-surface mb-2">About this event</h2>
                <p className="text-label-md text-on-surface-variant whitespace-pre-line leading-relaxed">{ev.description}</p>
              </div>
            )}

            {/* Host */}
            <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
              <Link href={`/profile/${ev.host.username}`} className="flex items-center gap-3 group">
                <UserAvatar name={ev.host.displayName} image={ev.host.avatarUrl ?? undefined} size="md" verified={ev.host.isVerified} />
                <div>
                  <p className="text-[11px] text-outline">Hosted by</p>
                  <p className="text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">{ev.host.displayName}</p>
                </div>
              </Link>
            </div>
          </div>

          {/* ── Right: sticky booking card ── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  <span className="text-headline-md font-bold text-on-surface">{ev.isFree ? 'Free' : (ev.price || 'Paid')}</span>
                </div>
                {ev.capacity !== null && (
                  <span className={`text-label-sm font-semibold ${ev.seatsLeft === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {ev.seatsLeft === 0 ? 'Sold out' : `${ev.seatsLeft} left`}
                  </span>
                )}
              </div>

              <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{fmtDate(ev.startsAt)} · {fmtTime(ev.startsAt)}</span>
              </div>

              {/* RSVP */}
              <div className="flex gap-2">
                <button onClick={() => setRsvp('going')} disabled={busy || full}
                  className={`flex-1 py-2.5 rounded-xl text-label-md font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${status === 'going' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-primary text-white hover:bg-primary/90'}`}>
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'going' ? <Check className="w-4 h-4" /> : null}
                  {status === 'going' ? 'Going' : full ? 'Full' : 'RSVP'}
                </button>
                <button onClick={() => setRsvp('interested')} disabled={busy}
                  className={`px-4 py-2.5 rounded-xl text-label-md font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${status === 'interested' ? 'bg-secondary/10 text-secondary border-secondary/30' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>
                  <Star className={`w-4 h-4 ${status === 'interested' ? 'fill-secondary' : ''}`} />Interested
                </button>
              </div>
              {rsvpError && <p className="text-label-sm text-red-500">{rsvpError}</p>}

              {/* External booking */}
              {ev.bookingUrl && (
                <a href={ev.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-secondary text-white text-label-md font-semibold hover:bg-secondary/90 transition-colors cursor-pointer flex items-center justify-center gap-1.5 no-underline">
                  <Ticket className="w-4 h-4" />Book tickets
                </a>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={copyLink} className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Link2 className="w-4 h-4" />{copied ? 'Copied!' : 'Share'}
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${new Date(ev.startsAt).toISOString().replace(/[-:]|\.\d{3}/g, '')}/${new Date(ev.endsAt ?? ev.startsAt).toISOString().replace(/[-:]|\.\d{3}/g, '')}&location=${encodeURIComponent(ev.location ?? '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center gap-1.5 no-underline">
                  <CalendarPlus className="w-4 h-4" />Add to calendar
                </a>
              </div>

              {isHost && (
                <div className="flex gap-2">
                  <button onClick={() => setEditOpen(true)}
                    className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Pencil className="w-4 h-4" />Edit
                  </button>
                  <button onClick={remove} disabled={deleting}
                    className="flex-1 py-2 rounded-xl text-red-500 text-label-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
      {editOpen && <EventFormModal event={ev} onClose={() => setEditOpen(false)} onSaved={(e) => { setEv(e); setEditOpen(false) }} />}
      {attendeesOpen && <AttendeesModal id={ev.id} onClose={() => setAttendeesOpen(false)} />}
    </>
  )
}

function AttendeesModal({ id, onClose }: { id: string; onClose: () => void }): React.JSX.Element {
  const [data, setData] = useState<{ going: EventAttendee[]; interested: EventAttendee[] } | null>(null)
  useEffect(() => {
    let cancelled = false
    eventsApi.attendees(id).then((d) => { if (!cancelled) setData(d) }).catch(() => { if (!cancelled) setData({ going: [], interested: [] }) })
    return () => { cancelled = true }
  }, [id])

  const Row = ({ a }: { a: EventAttendee }): React.JSX.Element => (
    <Link href={`/profile/${a.username}`} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors">
      <UserAvatar name={a.displayName} image={a.avatarUrl ?? undefined} size="md" verified={a.isVerified} />
      <div className="min-w-0"><p className="text-label-md font-semibold text-on-surface truncate">{a.displayName}</p><p className="text-[12px] text-outline truncate">@{a.username}</p></div>
    </Link>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface">Attendees</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-3 overflow-y-auto">
          {!data ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : (data.going.length === 0 && data.interested.length === 0) ? (
            <p className="text-label-sm text-outline text-center py-8">No attendees yet.</p>
          ) : (
            <div className="space-y-2">
              {data.going.length > 0 && <p className="text-[11px] font-bold uppercase tracking-wide text-outline px-2 pt-1">Going · {data.going.length}</p>}
              {data.going.map((a) => <Row key={`g-${a.id}`} a={a} />)}
              {data.interested.length > 0 && <p className="text-[11px] font-bold uppercase tracking-wide text-outline px-2 pt-2">Interested · {data.interested.length}</p>}
              {data.interested.map((a) => <Row key={`i-${a.id}`} a={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Fact({ Icon, label, value }: { Icon: typeof Calendar; label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-start gap-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
      <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[11px] text-outline">{label}</p>
        <p className="text-label-md font-semibold text-on-surface truncate">{value}</p>
      </div>
    </div>
  )
}
