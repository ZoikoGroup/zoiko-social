'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Stethoscope, Plus, Loader2, Calendar, Star, Clock, Pencil, Trash2, X, Check,
  ClipboardList, PawPrint, FileText, IndianRupee, CalendarClock,
} from 'lucide-react'
import { providersApi, type Provider, type TeamMember } from '@/lib/api'
import {
  petCareApi, type PetCareService, type PetCareBooking, type ProviderReview,
  BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS,
} from '@/lib/pet-care-api'
import { VET_SERVICE_CATEGORIES, VET_SERVICE_CATEGORY_LABELS, todayHoursLabel } from '@/lib/vet'
import { VetClinicFormModal } from '@/components/vet/VetClinicFormModal'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { useAuth } from '@/hooks/use-auth'

type Tab = 'today' | 'appointments' | 'services' | 'team' | 'reviews'
const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
  { id: 'reviews', label: 'Reviews' },
]

export default function ClinicDashboardPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [clinics, setClinics] = useState<Provider[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('today')
  const [loadingClinics, setLoadingClinics] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [appointments, setAppointments] = useState<PetCareBooking[]>([])
  const [services, setServices] = useState<PetCareService[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [reviews, setReviews] = useState<ProviderReview[]>([])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    let cancelled = false
    providersApi.mine()
      .then((list) => {
        if (cancelled) return
        const vets = list.filter((p) => p.category === 'vet')
        setClinics(vets)
        setActiveId((prev) => prev ?? vets[0]?.id ?? null)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingClinics(false) })
  }, [refreshKey])

  const active = clinics.find((c) => c.id === activeId) ?? null

  useEffect(() => {
    if (!activeId) return
    let cancelled = false
    petCareApi.listBookings('provider', undefined, null, 30).then((p) => { if (!cancelled) setAppointments(p.data) }).catch(() => {})
    petCareApi.listServices(activeId).then((s) => { if (!cancelled) setServices(s) }).catch(() => {})
    providersApi.team(activeId).then((t) => { if (!cancelled) setTeam(t) }).catch(() => {})
    petCareApi.listReviews(activeId).then((r) => { if (!cancelled) setReviews(r) }).catch(() => {})
    return () => { cancelled = true }
  }, [activeId, refreshKey])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  if (authLoading || loadingClinics) return (
    <><Header /><main className="pt-20 min-h-screen bg-background"><div className="max-w-3xl mx-auto p-4"><div className="h-40 bg-surface-container-lowest rounded-xl animate-pulse" /></div></main></>
  )

  // No clinic yet → onboarding
  if (clinics.length === 0) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-lg mx-auto p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-3"><Stethoscope className="w-7 h-7 text-primary" /></div>
            <h1 className="font-headline text-headline-md text-on-surface">List your clinic</h1>
            <p className="text-label-sm text-outline mt-1 mb-5">Create your clinic profile to appear in Vet Finder, take appointments, and manage your practice.</p>
            <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer"><Plus className="w-4 h-4" />Create clinic</button>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
      {formOpen && <VetClinicFormModal onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); refresh() }} />}
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background pb-24">
        <div className="max-w-3xl mx-auto px-2 md:px-4 py-4 space-y-4">
          {/* Clinic header */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
              {active?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : <Stethoscope className="w-6 h-6 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              {clinics.length > 1 ? (
                <select value={activeId ?? ''} onChange={(e) => setActiveId(e.target.value)} className="font-headline text-label-lg font-bold text-on-surface bg-transparent focus:outline-none cursor-pointer">
                  {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : <h1 className="font-headline text-label-lg font-bold text-on-surface truncate">{active?.name}</h1>}
              <p className="text-[12px] text-outline flex items-center gap-1"><Clock className="w-3 h-3" />{active ? todayHoursLabel(active.hours, active.is24x7) : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              {active && <Link href={`/vet-finder/${active.id}`} className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[12px] font-semibold hover:bg-surface-container-high">View</Link>}
              <button onClick={() => setFormOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[12px] font-semibold hover:bg-primary/20 cursor-pointer"><Pencil className="w-3.5 h-3.5" />Edit</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-label-sm font-semibold whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>{t.label}</button>
            ))}
          </div>

          {active && tab === 'today' && <TodayTab appointments={appointments} reviews={reviews} services={services} />}
          {active && tab === 'appointments' && <AppointmentsTab appointments={appointments} onChanged={refresh} />}
          {active && tab === 'services' && <ServicesTab providerId={active.id} services={services} onChanged={refresh} />}
          {active && tab === 'team' && <TeamTab providerId={active.id} team={team} onChanged={refresh} />}
          {active && tab === 'reviews' && <ReviewsTab reviews={reviews} />}
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
      {formOpen && active && <VetClinicFormModal provider={active} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); refresh() }} />}
      {formOpen && !active && <VetClinicFormModal onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); refresh() }} />}
    </>
  )
}

// ── Today ────────────────────────────────────────────────────────────────────
function TodayTab({ appointments, reviews, services }: { appointments: PetCareBooking[]; reviews: ProviderReview[]; services: PetCareService[] }): React.JSX.Element {
  const today = new Date().toDateString()
  const todays = appointments.filter((a) => new Date(a.scheduledAt).toDateString() === today && a.status !== 'cancelled')
  const pending = appointments.filter((a) => a.status === 'pending').length
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat icon={<CalendarClock className="w-4 h-4" />} label="Today" value={String(todays.length)} />
        <Stat icon={<ClipboardList className="w-4 h-4" />} label="Pending" value={String(pending)} />
        <Stat icon={<Star className="w-4 h-4" />} label="Rating" value={avgRating} />
        <Stat icon={<FileText className="w-4 h-4" />} label="Services" value={String(services.filter((s) => s.isActive).length)} />
      </div>
      <Card title="Today's appointments">
        {todays.length === 0 ? <Empty text="No appointments scheduled for today." /> : (
          <div className="space-y-2">{todays.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).map((a) => <AppointmentRow key={a.id} a={a} compact />)}</div>
        )}
      </Card>
    </div>
  )
}

// ── Appointments ───────────────────────────────────────────────────────────────
const FILTERS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const
function AppointmentsTab({ appointments, onChanged }: { appointments: PetCareBooking[]; onChanged: () => void }): React.JSX.Element {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [summaryFor, setSummaryFor] = useState<PetCareBooking | null>(null)
  const list = appointments.filter((a) => filter === 'all' || a.status === filter)
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant'}`}>{f === 'all' ? 'All' : BOOKING_STATUS_LABELS[f]}</button>
        ))}
      </div>
      {list.length === 0 ? <Card title=""><Empty text="No appointments here yet." /></Card> : (
        <div className="space-y-2">{list.map((a) => <AppointmentRow key={a.id} a={a} onChanged={onChanged} onSummary={() => setSummaryFor(a)} />)}</div>
      )}
      {summaryFor && <VisitSummaryModal booking={summaryFor} onClose={() => setSummaryFor(null)} onSaved={() => { setSummaryFor(null); onChanged() }} />}
    </div>
  )
}

function AppointmentRow({ a, onChanged, onSummary, compact }: { a: PetCareBooking; onChanged?: () => void; onSummary?: () => void; compact?: boolean }): React.JSX.Element {
  const [busy, setBusy] = useState(false)
  const dt = new Date(a.scheduledAt)
  async function move(status: string): Promise<void> {
    if (busy) return
    setBusy(true)
    try { await petCareApi.updateBookingStatus(a.id, status); onChanged?.() } catch { /* ignore */ } finally { setBusy(false) }
  }
  const next: Record<string, { label: string; status: string }[]> = {
    pending: [{ label: 'Confirm', status: 'confirmed' }, { label: 'Decline', status: 'cancelled' }],
    confirmed: [{ label: 'Check in', status: 'in_progress' }, { label: 'Cancel', status: 'cancelled' }],
    in_progress: [{ label: 'Complete', status: 'completed' }],
  }
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-label-md font-semibold text-on-surface truncate">{a.service.name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BOOKING_STATUS_COLORS[a.status] ?? ''}`}>{BOOKING_STATUS_LABELS[a.status] ?? a.status}</span>
          </div>
          <p className="text-[12px] text-outline flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{dt.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[12px] text-on-surface-variant">
            <span className="flex items-center gap-1"><PawPrint className="w-3 h-3 text-primary" />{a.pet?.name ?? a.petName ?? 'Pet'}{a.pet?.species ? ` · ${a.pet.species}` : ''}</span>
            <span>{a.seeker.displayName}</span>
            {a.consultMode && <span className="text-outline">{a.consultMode.replace('_', ' ')}</span>}
          </div>
          {a.reason && <p className="text-[12px] text-on-surface-variant mt-1 italic">“{a.reason}”</p>}
          {a.visitSummary && <p className="text-[12px] text-green-700 mt-1 flex items-center gap-1"><FileText className="w-3 h-3" />Visit summary added</p>}
        </div>
        <span className="text-label-md font-bold text-on-surface flex-shrink-0">{a.priceDisplay}</span>
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {(next[a.status] ?? []).map((n) => (
            <button key={n.status} onClick={() => move(n.status)} disabled={busy} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold disabled:opacity-40 cursor-pointer ${n.status === 'cancelled' ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' : 'bg-primary text-white hover:bg-primary/90'}`}>{busy ? '…' : n.label}</button>
          ))}
          {(a.status === 'in_progress' || a.status === 'completed') && onSummary && (
            <button onClick={onSummary} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high cursor-pointer flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{a.visitSummary ? 'Edit summary' : 'Add visit summary'}</button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Services ────────────────────────────────────────────────────────────────
function ServicesTab({ providerId, services, onChanged }: { providerId: string; services: PetCareService[]; onChanged: () => void }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<PetCareService | null>(null)
  async function del(s: PetCareService): Promise<void> {
    try { await petCareApi.removeService(providerId, s.id); onChanged() } catch { /* ignore */ }
  }
  return (
    <div className="space-y-3">
      <button onClick={() => { setEdit(null); setOpen(true) }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"><Plus className="w-4 h-4" />Add service</button>
      {services.length === 0 ? <Card title=""><Empty text="No services yet. Add consultations, vaccinations, surgery and more." /></Card> : (
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-label-md font-semibold text-on-surface">{s.name} {!s.isActive && <span className="text-[10px] text-outline">(hidden)</span>}</p>
                <p className="text-[11px] text-outline">{VET_SERVICE_CATEGORY_LABELS[s.category] ?? s.category}{s.durationMinutes ? ` · ${s.durationMinutes} min` : ''} · {s.priceDisplay}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEdit(s); setOpen(true) }} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del(s)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && <ServiceModal providerId={providerId} service={edit} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); onChanged() }} />}
    </div>
  )
}

function ServiceModal({ providerId, service, onClose, onSaved }: { providerId: string; service: PetCareService | null; onClose: () => void; onSaved: () => void }): React.JSX.Element {
  const [name, setName] = useState(service?.name ?? '')
  const [category, setCategory] = useState(service?.category ?? 'consultation')
  const [price, setPrice] = useState(service ? (service.priceCents / 100).toString() : '')
  const [duration, setDuration] = useState(service?.durationMinutes ? String(service.durationMinutes) : '')
  const [desc, setDesc] = useState(service?.description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  async function save(): Promise<void> {
    const priceCents = Math.round(parseFloat(price || '0') * 100)
    if (!name.trim() || priceCents < 0 || saving) return
    setSaving(true); setError('')
    try {
      const payload = {
        name: name.trim(), priceCents,
        category: category as (typeof VET_SERVICE_CATEGORIES)[number],
        ...(duration ? { durationMinutes: parseInt(duration, 10) } : {}),
        ...(desc.trim() ? { description: desc.trim() } : {}),
      }
      if (service) await petCareApi.updateService(providerId, service.id, payload)
      else await petCareApi.createService(providerId, payload)
      onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save') } finally { setSaving(false) }
  }
  return (
    <ModalShell title={service ? 'Edit service' : 'Add service'} onClose={onClose}>
      <div className="p-5 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} placeholder="Service name (e.g. General Consultation)" className={input} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
          {VET_SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{VET_SERVICE_CATEGORY_LABELS[c]}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="Price" className={`${input} pl-9`} />
          </div>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" min="5" placeholder="Duration (min)" className={input} />
        </div>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={2000} rows={2} placeholder="Description (optional)" className={`${input} resize-none`} />
        {error && <p className="text-label-sm text-red-500">{error}</p>}
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} disabled={!name.trim()} saveLabel={service ? 'Save' : 'Add service'} />
    </ModalShell>
  )
}

// ── Team ────────────────────────────────────────────────────────────────────
function TeamTab({ providerId, team, onChanged }: { providerId: string; team: TeamMember[]; onChanged: () => void }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  async function del(m: TeamMember): Promise<void> {
    try { await providersApi.removeTeamMember(providerId, m.id); onChanged() } catch { /* ignore */ }
  }
  return (
    <div className="space-y-3">
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"><Plus className="w-4 h-4" />Add vet</button>
      {team.length === 0 ? <Card title=""><Empty text="Add the vets on your team so clients know who they'll see." /></Card> : (
        <div className="space-y-2">
          {team.map((m) => (
            <div key={m.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-label-sm font-bold text-primary">{m.name.slice(0, 1)}</span></div>
              <div className="flex-1 min-w-0"><p className="text-label-md font-semibold text-on-surface">{m.name}</p>{m.role && <p className="text-[11px] text-outline">{m.role}{m.licenseNo ? ` · ${m.licenseNo}` : ''}</p>}</div>
              <button onClick={() => del(m)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
      {open && <TeamModal providerId={providerId} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); onChanged() }} />}
    </div>
  )
}

function TeamModal({ providerId, onClose, onSaved }: { providerId: string; onClose: () => void; onSaved: () => void }): React.JSX.Element {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [licenseNo, setLicenseNo] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  async function save(): Promise<void> {
    if (!name.trim() || saving) return
    setSaving(true); setError('')
    try {
      await providersApi.addTeamMember(providerId, { name: name.trim(), ...(role.trim() ? { role: role.trim() } : {}), ...(licenseNo.trim() ? { licenseNo: licenseNo.trim() } : {}) })
      onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to add') } finally { setSaving(false) }
  }
  return (
    <ModalShell title="Add vet" onClose={onClose}>
      <div className="p-5 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Full name (e.g. Dr. Asha Rao)" className={input} />
        <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} placeholder="Specialty / title (e.g. Surgeon)" className={input} />
        <input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} maxLength={80} placeholder="License no. (optional)" className={input} />
        {error && <p className="text-label-sm text-red-500">{error}</p>}
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} disabled={!name.trim()} saveLabel="Add vet" />
    </ModalShell>
  )
}

// ── Reviews ─────────────────────────────────────────────────────────────────
function ReviewsTab({ reviews }: { reviews: ProviderReview[] }): React.JSX.Element {
  return (
    <Card title={`Reviews${reviews.length ? ` (${reviews.length})` : ''}`}>
      {reviews.length === 0 ? <Empty text="No reviews yet. Completed appointments can be reviewed by clients." /> : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-outline-variant/15 pb-3 last:border-0">
              <div className="flex items-center gap-2"><span className="text-label-sm font-semibold text-on-surface">{r.author.displayName}</span><span className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-outline/30'}`} />)}</span></div>
              {r.body && <p className="text-label-sm text-on-surface-variant mt-1">{r.body}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ── Visit summary modal ───────────────────────────────────────────────────────
function VisitSummaryModal({ booking, onClose, onSaved }: { booking: PetCareBooking; onClose: () => void; onSaved: () => void }): React.JSX.Element {
  const [summary, setSummary] = useState(booking.visitSummary ?? '')
  const [prescription, setPrescription] = useState(booking.prescription ?? '')
  const [followUp, setFollowUp] = useState(booking.followUpAt ?? '')
  const [toPassport, setToPassport] = useState(!!booking.petId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  async function save(): Promise<void> {
    if (saving) return
    setSaving(true); setError('')
    try {
      await petCareApi.addVisitSummary(booking.id, {
        addToHealthPassport: toPassport && !!booking.petId,
        recordType: 'vet_visit',
        ...(summary.trim() ? { visitSummary: summary.trim() } : {}),
        ...(prescription.trim() ? { prescription: prescription.trim() } : {}),
        ...(followUp ? { followUpAt: followUp } : {}),
      })
      onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save') } finally { setSaving(false) }
  }
  return (
    <ModalShell title="Visit summary" onClose={onClose}>
      <div className="p-5 space-y-3">
        <p className="text-[12px] text-outline">{booking.pet?.name ?? booking.petName ?? 'Pet'} · {booking.service.name}</p>
        <div><label className="text-[12px] font-semibold text-outline">Summary / diagnosis</label><textarea value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={4000} rows={3} placeholder="Findings, diagnosis, advice…" className={`${input} resize-none`} /></div>
        <div><label className="text-[12px] font-semibold text-outline">Prescription</label><textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} maxLength={4000} rows={2} placeholder="Medications & dosage…" className={`${input} resize-none`} /></div>
        <div><label className="text-[12px] font-semibold text-outline">Next visit / follow-up</label><input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className={input} /></div>
        {booking.petId ? (
          <button onClick={() => setToPassport((v) => !v)} className="flex items-center gap-2 text-label-sm text-on-surface-variant cursor-pointer">
            <span className={`w-5 h-5 rounded border flex items-center justify-center ${toPassport ? 'bg-primary border-primary' : 'border-outline-variant'}`}>{toPassport && <Check className="w-3.5 h-3.5 text-white" />}</span>
            Add to {booking.pet?.name ?? 'the pet'}&apos;s Health Passport
          </button>
        ) : <p className="text-[11px] text-outline">No pet linked — can&apos;t push to a Health Passport.</p>}
        {error && <p className="text-label-sm text-red-500">{error}</p>}
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} disabled={false} saveLabel="Save summary" />
    </ModalShell>
  )
}

// ── Shared bits ───────────────────────────────────────────────────────────────
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
      <div className="flex items-center gap-1.5 text-outline">{icon}<span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="text-headline-sm font-bold text-on-surface mt-1">{value}</p>
    </div>
  )
}
function Card({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
      {title && <h2 className="font-headline text-label-lg font-bold text-on-surface mb-2">{title}</h2>}
      {children}
    </div>
  )
}
function Empty({ text }: { text: string }): React.JSX.Element {
  return <p className="text-label-sm text-outline text-center py-6">{text}</p>
}
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
function ModalFooter({ onClose, onSave, saving, disabled, saveLabel }: { onClose: () => void; onSave: () => void; saving: boolean; disabled: boolean; saveLabel: string }): React.JSX.Element {
  return (
    <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
      <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
      <button onClick={onSave} disabled={saving || disabled} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{saveLabel}</button>
    </div>
  )
}
