'use client'

import { useState } from 'react'
import { X, Globe, MapPin, Users, Mail, ImagePlus, Film, Loader2, Search, Check } from 'lucide-react'
import { Img } from '@/components/Img'
import { LocationInput } from '@/components/LocationInput'
import { UserAvatar } from '@/components/UserAvatar'
import { eventsApi, networkApi, EVENT_CATEGORIES, EVENT_CATEGORY_LABELS, type EventItem, type EventInput, type FollowSuggestion } from '@/lib/api'
import { uploadCommunityImage, uploadEventVideo } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'
import { DocsHelpLink } from '@/components/DocsHelpLink'

/** datetime-local value (local tz) from an ISO string. */
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

/** Create (no `event`) or edit (with `event`) an event in one modal. */
export function EventFormModal({ event, onClose, onSaved }: {
  event?: EventItem | null
  onClose: () => void
  onSaved: (e: EventItem) => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const editing = !!event
  const [title, setTitle] = useState(event?.title ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [category, setCategory] = useState(event?.category ?? '')
  const [location, setLocation] = useState(event?.location ?? '')
  const [venueName, setVenueName] = useState(event?.venueName ?? '')
  const [visibility, setVisibility] = useState<'public' | 'followers'>((event?.visibility as 'public' | 'followers') ?? 'public')
  const [inviteOnly, setInviteOnly] = useState(event?.inviteOnly ?? false)
  const [invitees, setInvitees] = useState<FollowSuggestion[]>([])
  const [isOnline, setIsOnline] = useState(event?.isOnline ?? false)
  const [startsAt, setStartsAt] = useState(toLocalInput(event?.startsAt ?? null))
  const [endsAt, setEndsAt] = useState(toLocalInput(event?.endsAt ?? null))
  const [isFree, setIsFree] = useState(event?.isFree ?? true)
  const [price, setPrice] = useState(event?.price ?? '')
  const [bookingUrl, setBookingUrl] = useState(event?.bookingUrl ?? '')
  const [capacity, setCapacity] = useState(event?.capacity != null ? String(event.capacity) : '')
  const [coverUrl, setCoverUrl] = useState(event?.coverUrl ?? '')
  const [videoUrl, setVideoUrl] = useState(event?.videoUrl ?? '')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    event?.latitude != null && event?.longitude != null ? { lat: event.latitude, lng: event.longitude } : null,
  )
  const [uploading, setUploading] = useState<'' | 'cover' | 'video'>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  const [inviteQuery, setInviteQuery] = useState('')
  const [inviteResults, setInviteResults] = useState<FollowSuggestion[]>([])
  const [inviteSearching, setInviteSearching] = useState(false)

  async function searchInvitees(q: string): Promise<void> {
    setInviteQuery(q)
    if (!q.trim()) { setInviteResults([]); return }
    setInviteSearching(true)
    try {
      const res = await networkApi.search(q.trim(), 10)
      const selected = new Set(invitees.map((i) => i.id))
      setInviteResults(res.filter((u) => !selected.has(u.id) && u.id !== profile?.id))
    } catch { setInviteResults([]) } finally { setInviteSearching(false) }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading('cover'); setError('')
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) } catch (err) { setError(err instanceof Error ? err.message : 'Cover upload failed') } finally { setUploading('') }
  }
  async function handleVideo(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading('video'); setError('')
    try { setVideoUrl(await uploadEventVideo(profile.id, file)) } catch (err) { setError(err instanceof Error ? err.message : 'Video upload failed') } finally { setUploading('') }
  }

  async function submit(): Promise<void> {
    if (saving || !title.trim() || !startsAt) return
    setSaving(true); setError('')
    const full: EventInput & { title: string; startsAt: string } = {
      title: title.trim(),
      startsAt: new Date(startsAt).toISOString(),
      isOnline, isFree, visibility,
      inviteOnly,
      ...(inviteOnly && invitees.length > 0 ? { invitees: invitees.map((i) => i.id) } : {}),
      description: description.trim() || null,
      category: category || null,
      coverUrl: coverUrl || null,
      videoUrl: videoUrl || null,
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      price: !isFree ? (price.trim() || null) : null,
      bookingUrl: !isFree ? (bookingUrl.trim() || null) : null,
      capacity: capacity && Number(capacity) > 0 ? Number(capacity) : null,
      venueName: !isOnline ? (venueName.trim() || null) : null,
      location: !isOnline ? (location.trim() || null) : null,
      latitude: !isOnline ? (coords?.lat ?? null) : null,
      longitude: !isOnline ? (coords?.lng ?? null) : null,
    }
    try {
      let saved: EventItem
      if (editing && event) {
        saved = await eventsApi.update(event.id, full)
      } else {
        // create rejects nulls (optional, not nullable) — strip them
        const clean = Object.fromEntries(Object.entries(full).filter(([, v]) => v !== null && v !== undefined))
        saved = await eventsApi.create(clean as EventInput & { title: string; startsAt: string })
      }
      onSaved(saved); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save event') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{editing ? 'Edit event' : 'Create event'}</h2>
          <div className="flex items-center gap-1">
            <DocsHelpLink href="/docs/community-and-events#events" />
            <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div className="flex gap-2">
            <label className="flex-1 relative h-24 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              {coverUrl ? <Img src={coverUrl} alt="" className="w-full h-full object-cover" /> : (
                <span className="flex flex-col items-center gap-1 text-outline text-[11px]">{uploading === 'cover' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}{uploading === 'cover' ? 'Uploading…' : 'Cover image'}</span>
              )}
              <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
            </label>
            <label className="flex-1 relative h-24 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              {videoUrl ? <video src={videoUrl} muted className="w-full h-full object-cover"><track kind="captions" /></video> : (
                <span className="flex flex-col items-center gap-1 text-outline text-[11px]">{uploading === 'video' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}{uploading === 'video' ? 'Uploading…' : 'Video (optional)'}</span>
              )}
              <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
            </label>
          </div>

          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Event title" className={inputCls} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} placeholder="Description (optional)" className={`${inputCls} resize-none`} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
            <option value="">Category (optional)</option>
            {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{EVENT_CATEGORY_LABELS[c]}</option>)}
          </select>

          <div>
            <p className="text-[11px] text-outline mb-1">Who can see this event?</p>
            <div className="flex rounded-xl border border-outline-variant/40 overflow-hidden text-label-sm font-semibold">
              <button onClick={() => { setVisibility('public'); setInviteOnly(false) }} className={`flex-1 py-2 flex items-center justify-center gap-1.5 cursor-pointer ${visibility === 'public' && !inviteOnly ? 'bg-primary text-white' : 'text-on-surface-variant'}`}><Globe className="w-4 h-4" />Public</button>
              <button onClick={() => { setVisibility('followers'); setInviteOnly(false) }} className={`flex-1 py-2 flex items-center justify-center gap-1.5 cursor-pointer ${visibility === 'followers' && !inviteOnly ? 'bg-primary text-white' : 'text-on-surface-variant'}`}><Users className="w-4 h-4" />Followers</button>
              <button onClick={() => setInviteOnly(true)} className={`flex-1 py-2 flex items-center justify-center gap-1.5 cursor-pointer ${inviteOnly ? 'bg-primary text-white' : 'text-on-surface-variant'}`}><Mail className="w-4 h-4" />Invite only</button>
            </div>
            {inviteOnly && (
              <p className="text-[11px] text-outline mt-1">Only people you invite can see and join this event.</p>
            )}
          </div>

          {inviteOnly && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  value={inviteQuery}
                  onChange={(e) => void searchInvitees(e.target.value)}
                  placeholder="Search people to invite…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none"
                />
                {inviteQuery.trim() && (
                  <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-lg max-h-52 overflow-y-auto">
                    {inviteSearching ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                    ) : inviteResults.length === 0 ? (
                      <p className="px-3 py-3 text-label-sm text-outline">No people found.</p>
                    ) : inviteResults.map((u) => (
                      <button key={u.id} onClick={() => { setInvitees((p) => [...p, u]); setInviteResults((p) => p.filter((x) => x.id !== u.id)); setInviteQuery('') }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-surface-container text-left cursor-pointer">
                        <UserAvatar name={u.displayName} image={u.avatarUrl ?? undefined} size="sm" verified={u.isVerified} />
                        <div className="min-w-0"><p className="text-label-sm font-semibold text-on-surface truncate">{u.displayName}</p><p className="text-[11px] text-outline truncate">@{u.username}</p></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {invitees.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {invitees.map((u) => (
                    <span key={u.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      <UserAvatar name={u.displayName} image={u.avatarUrl ?? undefined} size="xs" verified={u.isVerified} />
                      <span className="max-w-28 truncate">{u.displayName}</span>
                      <button onClick={() => setInvitees((p) => p.filter((x) => x.id !== u.id))} className="text-primary/70 hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              {editing && (
                <p className="text-[11px] text-outline flex items-center gap-1"><Check className="w-3 h-3" />Existing invites are managed from the event page.</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-outline block">Starts
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="text-[11px] text-outline block">Ends (optional)
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
            </label>
          </div>

          <button onClick={() => setIsOnline((v) => !v)} className="flex items-center gap-2 text-label-sm text-on-surface-variant cursor-pointer">
            {isOnline ? <Globe className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4" />}{isOnline ? 'Online event' : 'In-person'}
          </button>
          {!isOnline && (
            <>
              <input value={venueName} onChange={(e) => setVenueName(e.target.value)} maxLength={160} placeholder="Venue name (e.g. Cubbon Park Bandstand)" className={inputCls} />
              <LocationInput value={location} onChange={setLocation} onSelectCoords={setCoords} maxLength={200} placeholder="Address / location" className={inputCls} />
            </>
          )}

          <div className="flex rounded-xl border border-outline-variant/40 overflow-hidden text-label-sm font-semibold">
            <button onClick={() => setIsFree(true)} className={`flex-1 py-2 cursor-pointer ${isFree ? 'bg-primary text-white' : 'text-on-surface-variant'}`}>Free</button>
            <button onClick={() => setIsFree(false)} className={`flex-1 py-2 cursor-pointer ${!isFree ? 'bg-primary text-white' : 'text-on-surface-variant'}`}>Paid</button>
          </div>
          {!isFree && (
            <div className="grid grid-cols-2 gap-2">
              <input value={price} onChange={(e) => setPrice(e.target.value)} maxLength={60} placeholder="Price (e.g. ₹499)" className={inputCls} />
              <input value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} maxLength={600} placeholder="Booking link (https://…)" className={inputCls} />
            </div>
          )}
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacity / max seats (optional)" className={inputCls} />

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>
        <div className="p-5 pt-3 flex gap-3 border-t border-outline-variant/20 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving || !!uploading || !title.trim() || !startsAt}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </div>
    </div>
  )
}
