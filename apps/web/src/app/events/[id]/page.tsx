'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Calendar, Clock, Globe, Users, Check, Star, Ticket, Loader2, Trash2,
  Link2, CalendarPlus, Timer, Pencil, X, Mail, Search, UserPlus,
} from 'lucide-react'
import { useDateFormat } from '@/hooks/use-date-format'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { Img } from '@/components/Img'
import { LocationLink } from '@/components/LocationLink'
import { UserAvatar } from '@/components/UserAvatar'
import { EventFormModal } from '@/components/events/EventFormModal'
import { eventsApi, networkApi, ApiError, EVENT_CATEGORY_LABELS, type EventItem, type EventAttendee, type EventInvitee, type FollowSuggestion } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { ReportButton } from '@/components/ReportButton'
import { formatDateTime } from '@/lib/datetime'

function fmtDate(iso: string, locale: string): string {
  return formatDateTime(iso, locale, 'weekdayLongFull')
}
function fmtTime(iso: string, locale: string): string {
  return formatDateTime(iso, locale, 'time')
}
function fmtDuration(a: string, b: string): string {
  const mins = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000)
  if (mins <= 0) return ''
  const h = Math.floor(mins / 60), m = mins % 60
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ')
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { locale } = useDateFormat()
  const { id } = use(params)
  const { user } = useAuth()
  const [ev, setEv] = useState<EventItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const [forbiddenCode, setForbiddenCode] = useState('')
  const [status, setStatus] = useState<'going' | 'interested' | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [attendeesOpen, setAttendeesOpen] = useState(false)
  const [invitesOpen, setInvitesOpen] = useState(false)
  // Share token from the URL (?share=…) — read once on mount (client-only;
  // SSR renders with null and the skeleton, then the fetch below runs on mount).
  // Must be read BEFORE fetching: a token-less get() on an invite-only event
  // 403s with EVENT_NOT_INVITED, which would wrongly show the forbidden screen.
  const [share] = useState<string | null>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('share') : null,
  )

  useEffect(() => {
    let cancelled = false
    // Link holders join via the token (grants access + maybe an invite row),
    // then render straight from the join response.
    const load = share ? eventsApi.join(id, share) : eventsApi.get(id)
    load
      .then((e) => { if (!cancelled) { setEv(e); setStatus(e.viewerGoing ? 'going' : null) } })
      .catch((e) => {
        if (cancelled || !(e instanceof ApiError)) return
        if (e.code === 'EVENT_PRIVATE' || e.code === 'EVENT_NOT_INVITED') { setForbidden(true); setForbiddenCode(e.code) }
        else if (e.code === 'INVALID_SHARE_LINK') { setForbidden(true); setForbiddenCode('INVALID_SHARE_LINK') }
        else setNotFound(true)
      })
    return () => { cancelled = true }
  }, [id, share])

  const isHost = !!(user && ev && user.id === ev.host.id)
  const full = !!ev && ev.seatsLeft === 0 && status !== 'going'
  // Link holders have access even when they have no invite row (viewerInvited=false).
  const notInvited = !!ev && ev.inviteOnly && !isHost && !ev.viewerInvited && !share
  const canDecline = !!ev && ev.viewerInvited && !isHost && !declined

  async function setRsvp(next: 'going' | 'interested'): Promise<void> {
    if (!ev || busy) return
    setBusy(true); setRsvpError('')
    try {
      if (status === next) {
        const r = await eventsApi.cancelRsvp(ev.id)
        setStatus(null)
        setEv({ ...ev, goingCount: r.goingCount, seatsLeft: ev.capacity !== null ? Math.max(0, ev.capacity - r.goingCount) : null })
      } else {
        const r = await eventsApi.rsvp(ev.id, next, share ?? undefined)
        setStatus(next)
        setEv({ ...ev, goingCount: r.goingCount, seatsLeft: ev.capacity !== null ? Math.max(0, ev.capacity - r.goingCount) : null })
      }
    } catch (e) {
      setRsvpError(e instanceof ApiError && e.code === 'EVENT_FULL' ? 'This event is full.' : 'Could not update RSVP.')
    } finally { setBusy(false) }
  }

  async function decline(): Promise<void> {
    if (!ev || busy) return
    setBusy(true); setRsvpError('')
    try {
      const r = await eventsApi.declineInvite(ev.id)
      setDeclined(true)
      setStatus(null)
      setEv({ ...ev, viewerInvited: false, goingCount: r.goingCount, seatsLeft: ev.capacity !== null ? Math.max(0, ev.capacity - r.goingCount) : null })
    } catch { setRsvpError('Could not decline the invite.') } finally { setBusy(false) }
  }

  async function copyLink(): Promise<void> {
    // Invite-only events share the token link so recipients can actually join.
    const url = ev?.inviteOnly && ev?.shareToken
      ? `${window.location.origin}/events/${ev.id}?share=${encodeURIComponent(ev.shareToken)}`
      : window.location.href
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* ignore */ }
  }

  async function remove(): Promise<void> {
    if (!ev || deleting) return
    setDeleting(true)
    try { await eventsApi.remove(ev.id); window.location.href = '/events' } catch { setDeleting(false) }
  }

  if (notFound || forbidden) return (
    <><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        {forbidden ? (forbiddenCode === 'EVENT_PRIVATE' ? <Users className="w-10 h-10 text-outline mx-auto mb-2" /> : <Mail className="w-10 h-10 text-outline mx-auto mb-2" />) : <Calendar className="w-10 h-10 text-outline mx-auto mb-2" />}
        <p className="text-label-md font-semibold text-on-surface">
          {forbidden ? (forbiddenCode === 'EVENT_PRIVATE' ? 'Followers-only event' : forbiddenCode === 'INVALID_SHARE_LINK' ? 'Link no longer works' : 'Invite-only event') : 'Event not found'}
        </p>
        {forbidden && (
          <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">
            {forbiddenCode === 'EVENT_PRIVATE' ? 'Follow the host to see this event.' : forbiddenCode === 'INVALID_SHARE_LINK' ? 'This share link has been reset. Ask the host for a new one.' : 'Only invited people can see and join this event.'}
          </p>
        )}
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
                    {ev.inviteOnly && <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1"><Mail className="w-3 h-3" />Invite only</span>}
                  </div>
                  <h1 className="text-white font-headline text-[26px] md:text-4xl font-bold leading-tight drop-shadow">{ev.title}</h1>
                  <p className="text-white/90 text-label-md mt-1">{fmtDate(ev.startsAt, locale)} · {fmtTime(ev.startsAt, locale)}</p>
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
                  {ev.inviteOnly && <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold flex items-center gap-1"><Mail className="w-3 h-3" />Invite only</span>}
                </div>
                <h1 className="font-headline text-[26px] md:text-3xl font-bold text-on-surface leading-tight">{ev.title}</h1>
              </div>
            )}

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Fact Icon={Calendar} label="Date" value={fmtDate(ev.startsAt, locale)} />
              <Fact Icon={Clock} label="Time" value={`${fmtTime(ev.startsAt, locale)}${ev.endsAt ? ` – ${fmtTime(ev.endsAt, locale)}` : ''}`} />
              {duration && <Fact Icon={Timer} label="Duration" value={duration} />}
              <Fact Icon={Users} label="Going" value={`${ev.goingCount}${ev.capacity !== null ? ` / ${ev.capacity}` : ''}`} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setAttendeesOpen(true)} className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-1.5 cursor-pointer">
                <Users className="w-4 h-4" />See who&apos;s going
              </button>
              {/* The host has their own controls further down; reporting is for
                  everyone else. */}
              {!isHost && <ReportButton targetType="event" targetId={ev.id} />}
            </div>

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
              {/* A community-hosted event should say so, and lead back there —
                  that's usually the reason someone is interested in it. */}
              {ev.community && (
                <Link
                  href={`/c/${ev.community.slug}`}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-label-sm font-semibold hover:bg-primary/15 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  {ev.community.name}
                </Link>
              )}
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
                <span>{fmtDate(ev.startsAt, locale)} · {fmtTime(ev.startsAt, locale)}</span>
              </div>

              {/* RSVP */}
              {declined ? (
                <div className="rounded-xl bg-surface-container p-4 text-center">
                  <X className="w-6 h-6 text-outline mx-auto mb-1" />
                  <p className="text-label-sm font-semibold text-on-surface">Invite declined</p>
                  <p className="text-[12px] text-outline mt-0.5">You won&apos;t see this event in your list anymore.</p>
                </div>
              ) : notInvited ? (
                <div className="rounded-xl bg-surface-container p-4 text-center">
                  <Mail className="w-6 h-6 text-outline mx-auto mb-1" />
                  <p className="text-label-sm font-semibold text-on-surface">Invite-only event</p>
                  <p className="text-[12px] text-outline mt-0.5">Only invited people can join.</p>
                </div>
              ) : (
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
              )}
              {canDecline && !busy && (
                <button onClick={decline}
                  className="w-full py-2 rounded-xl text-label-sm font-semibold text-outline hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                  Decline invite
                </button>
              )}
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
                  {ev.inviteOnly && (
                    <button onClick={() => setInvitesOpen(true)}
                      className="flex-1 py-2 rounded-xl bg-secondary/10 text-secondary text-label-sm font-semibold hover:bg-secondary/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <UserPlus className="w-4 h-4" />Invite
                    </button>
                  )}
                  <button onClick={() => setEditOpen(true)}
                    className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Pencil className="w-4 h-4" />Edit
                  </button>
                  <button onClick={remove} disabled={deleting}
                    className="flex-1 py-2 rounded-xl text-red-500 text-label-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}<span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
      {editOpen && <EventFormModal event={ev} onClose={() => setEditOpen(false)} onSaved={(e) => { setEv(e); setEditOpen(false) }} />}
      {attendeesOpen && <AttendeesModal id={ev.id} {...(share ? { share } : {})} onClose={() => setAttendeesOpen(false)} />}
      {invitesOpen && ev && (
        <InvitesModal
          id={ev.id}
          shareToken={ev.shareToken}
          shareLinkExtendsInvites={ev.shareLinkExtendsInvites}
          onClose={() => setInvitesOpen(false)}
          onInvited={(ids) => setEv((prev) => prev ? { ...prev, viewerInvited: prev.viewerInvited || ids.includes(user?.id ?? '') } : prev)}
          onShareLinkChange={(s) => setEv((prev) => prev ? { ...prev, shareToken: s.shareToken, shareLinkExtendsInvites: s.shareLinkExtendsInvites } : prev)}
        />
      )}
    </>
  )
}

function InvitesModal({ id, shareToken, shareLinkExtendsInvites, onClose, onInvited, onShareLinkChange }: {
  id: string
  shareToken: string | null
  shareLinkExtendsInvites: boolean
  onClose: () => void
  onInvited: (ids: string[]) => void
  onShareLinkChange: (s: { shareToken: string; shareLinkExtendsInvites: boolean }) => void
}): React.JSX.Element {
  const [invitees, setInvitees] = useState<EventInvitee[] | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FollowSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [shareExtends, setShareExtends] = useState(shareLinkExtendsInvites)
  const [linkCopied, setLinkCopied] = useState(false)
  const [linkBusy, setLinkBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    eventsApi.invites(id)
      .then((d) => { if (!cancelled) setInvitees(d) })
      .catch(() => { if (!cancelled) setInvitees([]) })
    return () => { cancelled = true }
  }, [id])

  const load = (): void => {
    eventsApi.invites(id).then(setInvitees).catch(() => setInvitees([]))
  }

  async function search(q: string): Promise<void> {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    try {
      const selected = new Set((invitees ?? []).map((i) => i.id))
      const res = await networkApi.search(q.trim(), 10)
      setResults(res.filter((u) => !selected.has(u.id)))
    } catch { setResults([]) } finally { setSearching(false) }
  }

  async function add(u: FollowSuggestion): Promise<void> {
    if (saving) return
    setSaving(true); setError('')
    try {
      await eventsApi.invite(id, [u.id])
      setResults((p) => p.filter((x) => x.id !== u.id))
      setQuery('')
      load(); onInvited([u.id])
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to invite') } finally { setSaving(false) }
  }

  async function revoke(inviteeId: string): Promise<void> {
    setSaving(true); setError('')
    try {
      await eventsApi.removeInvite(id, inviteeId)
      load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to revoke') } finally { setSaving(false) }
  }

  async function reInvite(inviteeId: string): Promise<void> {
    if (saving) return
    setSaving(true); setError('')
    try {
      await eventsApi.invite(id, [inviteeId])
      load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to re-invite') } finally { setSaving(false) }
  }

  async function copyShareLink(): Promise<void> {
    if (!shareToken) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/events/${id}?share=${encodeURIComponent(shareToken)}`)
      setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1500)
    } catch { /* ignore */ }
  }

  async function setExtends(next: boolean): Promise<void> {
    if (linkBusy) return
    setLinkBusy(true); setError('')
    try {
      const r = await eventsApi.shareLink(id, { extendsInvites: next })
      setShareExtends(r.shareLinkExtendsInvites)
      onShareLinkChange(r)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to update link') } finally { setLinkBusy(false) }
  }

  async function resetLink(): Promise<void> {
    if (linkBusy) return
    setLinkBusy(true); setError('')
    try {
      const r = await eventsApi.shareLink(id, { reset: true })
      onShareLinkChange(r)
      setLinkCopied(false)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to reset link') } finally { setLinkBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[75vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Invite people</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input value={query} onChange={(e) => void search(e.target.value)} placeholder="Search people…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
            {query.trim() && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-lg max-h-48 overflow-y-auto">
                {searching ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                ) : results.length === 0 ? (
                  <p className="px-3 py-3 text-label-sm text-outline">No people found.</p>
                ) : results.map((u) => (
                  <button key={u.id} onClick={() => void add(u)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-surface-container text-left cursor-pointer">
                    <UserAvatar name={u.displayName} image={u.avatarUrl ?? undefined} size="sm" verified={u.isVerified} />
                    <div className="min-w-0 flex-1"><p className="text-label-sm font-semibold text-on-surface truncate">{u.displayName}</p><p className="text-[11px] text-outline truncate">@{u.username}</p></div>
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wide text-outline">Invited · {(invitees ?? []).length}</p>
          {!invitees ? (
            <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : invitees.length === 0 ? (
            <p className="text-label-sm text-outline text-center py-6">No invites yet. Search above to invite someone.</p>
          ) : (
            <div className="space-y-1">
              {invitees.map((i) => (
                <div key={i.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-container">
                  <UserAvatar name={i.displayName} image={i.avatarUrl ?? undefined} size="sm" verified={i.isVerified} />
                  <div className="min-w-0 flex-1">
                    <p className="text-label-sm font-semibold text-on-surface truncate">{i.displayName}</p>
                    <p className="text-[11px] text-outline truncate">@{i.username}</p>
                    {i.status === 'declined' && <p className="text-[11px] text-red-500 font-semibold">Declined invite</p>}
                  </div>
                  {i.status === 'declined' ? (
                    <button onClick={() => void reInvite(i.id)} disabled={saving}
                      className="px-2.5 py-1 rounded-lg text-primary text-[11px] font-semibold hover:bg-primary/10 disabled:opacity-50 cursor-pointer">Re-invite</button>
                  ) : (
                    <button onClick={() => void revoke(i.id)} disabled={saving}
                      className="px-2.5 py-1 rounded-lg text-red-500 text-[11px] font-semibold hover:bg-red-50 disabled:opacity-50 cursor-pointer">Remove</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* ── Share link section (host) ── */}
          <div className="pt-3 border-t border-outline-variant/20 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-outline">Share link</p>
            <p className="text-[12px] text-outline">Anyone with the link can join. When “extends invites” is on, joiners are added to your invite list so you can manage them.</p>
            <div className="flex gap-2">
              <button onClick={copyShareLink} disabled={!shareToken || linkBusy}
                className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-label-sm font-semibold hover:bg-primary/20 disabled:opacity-50 transition-colors cursor-pointer">
                {linkCopied ? 'Copied!' : 'Copy link'}
              </button>
              <button onClick={resetLink} disabled={linkBusy}
                className="px-3 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container disabled:opacity-50 transition-colors cursor-pointer">
                New link
              </button>
            </div>
            <button onClick={() => void setExtends(!shareExtends)} disabled={linkBusy}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-outline-variant/40 text-label-sm hover:bg-surface-container cursor-pointer disabled:opacity-50">
              <span className="font-semibold text-on-surface">Link extends invites</span>
              <span className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${shareExtends ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'}`}>
                <span className="w-4 h-4 rounded-full bg-white shadow" />
              </span>
            </button>
          </div>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function AttendeesModal({ id, share, onClose }: { id: string; share?: string; onClose: () => void }): React.JSX.Element {
  const [data, setData] = useState<{ going: EventAttendee[]; interested: EventAttendee[] } | null>(null)
  useEffect(() => {
    let cancelled = false
    eventsApi.attendees(id, share).then((d) => { if (!cancelled) setData(d) }).catch(() => { if (!cancelled) setData({ going: [], interested: [] }) })
    return () => { cancelled = true }
  }, [id, share])

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
