'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import QRCode from 'qrcode'
import {
  ShieldCheck, Plus, Trash2, Loader2, PawPrint, Syringe, Stethoscope, Pill, AlertTriangle, Scale, FileText,
  Pencil, X, ImagePlus, CalendarDays, Bell, Printer, HeartPulse,
  Share2, Copy, Check, Link2, CalendarPlus, TrendingUp, TrendingDown, Minus, Target, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { petsApi, type HealthRecord } from '@/lib/api'
import { PetAbout } from '@/components/PetAbout'
import { AddPetModal } from '@/components/AddPetModal'
import { ageOf } from '@/lib/pet'
import { usePets } from '@/hooks/use-pets'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'
import { DocsHelpLink } from '@/components/DocsHelpLink'

interface TypeMeta { value: string; label: string; Icon: LucideIcon; node: string; tint: string }
const TYPES: TypeMeta[] = [
  { value: 'vaccination', label: 'Vaccination', Icon: Syringe, node: 'bg-primary text-white', tint: 'bg-primary/10 text-primary' },
  { value: 'vet_visit', label: 'Vet Visit', Icon: Stethoscope, node: 'bg-blue-500 text-white', tint: 'bg-blue-500/10 text-blue-600' },
  { value: 'medication', label: 'Medication', Icon: Pill, node: 'bg-secondary text-white', tint: 'bg-secondary/10 text-secondary' },
  { value: 'allergy', label: 'Allergy', Icon: AlertTriangle, node: 'bg-red-500 text-white', tint: 'bg-red-500/10 text-red-600' },
  { value: 'weight', label: 'Weight', Icon: Scale, node: 'bg-emerald-500 text-white', tint: 'bg-emerald-500/10 text-emerald-600' },
  { value: 'note', label: 'Note', Icon: FileText, node: 'bg-outline text-white', tint: 'bg-surface-container text-on-surface-variant' },
]
const typeMeta = (t: string): TypeMeta => TYPES.find((x) => x.value === t) ?? TYPES[5]!
const VACCINE_TEMPLATES = ['Rabies', 'DHPP', 'Distemper', 'Parvovirus', 'Leptospirosis', 'Bordetella (Kennel Cough)', 'Canine Influenza', 'FVRCP', 'FeLV', 'Corona']

function initials(n: string): string { return n.slice(0, 2).toUpperCase() }
function fmtDate(iso: string | null): string { return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '' }
function daysUntil(iso: string): number { return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000) }
function yearOf(iso: string | null): string { return iso ? new Date(iso).getFullYear().toString() : 'Undated' }
const targetKey = (petId: string): string => `zoiko-pet-target-${petId}`

/** Builds and downloads an .ics calendar file for the given due reminders. */
function downloadIcs(petName: string, items: { title: string; date: string }[]): void {
  const stamp = (d: string): string => d.replace(/-/g, '')
  const esc = (s: string): string => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zoiko//Health Passport//EN', 'CALSCALE:GREGORIAN']
  for (const [i, it] of items.entries()) {
    lines.push('BEGIN:VEVENT', `UID:zoiko-hp-${i}-${stamp(it.date)}@zoiko`, `DTSTART;VALUE=DATE:${stamp(it.date)}`,
      `SUMMARY:${esc(`${petName}: ${it.title}`)}`, `DESCRIPTION:${esc('Pet health reminder from Zoiko Health Passport')}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`${petName}: ${it.title}`)}`, 'END:VALARM', 'END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${petName.replace(/\s+/g, '-').toLowerCase()}-reminders.ics`
  a.click(); URL.revokeObjectURL(url)
}

type View = 'records' | 'weight'

export default function HealthPassportPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const { pets, loading: loadingPets, patchPet } = usePets()
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<View>('records')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState<{ record: HealthRecord | null } | null>(null)
  const [logWeight, setLogWeight] = useState(false)
  const [editPet, setEditPet] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [household, setHousehold] = useState<{ id: string; name: string; overdue: number; next: { title: string; date: string } | null }[]>([])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  // Derived rather than synced through an effect: the selection stays valid for
  // free as the list loads or changes underneath us (the assistant can add or
  // edit a pet from the chat thread), with no cascading render.
  const activePet = selectedPet && pets.some((p) => p.id === selectedPet) ? selectedPet : (pets[0]?.id ?? null)

  const load = useCallback((petId: string) => {
    setLoading(true)
    petsApi.health(petId).then(setRecords).catch(() => setRecords([])).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { if (activePet) load(activePet); else setRecords([]) }, 0)
    return () => clearTimeout(t)
  }, [activePet, load])

  // Household overview: soonest-due + overdue count per pet.
  useEffect(() => {
    if (pets.length < 2) { const t = setTimeout(() => setHousehold([]), 0); return () => clearTimeout(t) }
    let cancelled = false
    Promise.all(pets.map((p) => petsApi.health(p.id).then((recs) => ({ p, recs })).catch(() => ({ p, recs: [] as HealthRecord[] }))))
      .then((all) => {
        if (cancelled) return
        setHousehold(all.map(({ p, recs }) => {
          const due = recs.filter((r) => r.nextDue)
          const overdue = due.filter((r) => daysUntil(r.nextDue!) < 0).length
          const next = due.filter((r) => daysUntil(r.nextDue!) >= 0).sort((a, b) => a.nextDue!.localeCompare(b.nextDue!))[0]
          return { id: p.id, name: p.name, overdue, next: next ? { title: next.title, date: next.nextDue! } : null }
        }))
      })
    return () => { cancelled = true }
  }, [pets])

  const pet = pets.find((p) => p.id === activePet) ?? null

  const weights = useMemo(() => records
    .filter((r) => r.type === 'weight')
    .map((r) => ({ date: r.recordDate ?? r.createdAt.slice(0, 10), value: parseFloat(r.title) || parseFloat(r.notes ?? '') || NaN }))
    .filter((w) => !isNaN(w.value))
    .sort((a, b) => a.date.localeCompare(b.date)), [records])

  const allergies = useMemo(() => records.filter((r) => r.type === 'allergy'), [records])

  const reminders = useMemo(() => records
    .filter((r) => r.nextDue)
    .map((r) => ({ r, days: daysUntil(r.nextDue!) }))
    .filter((x) => x.days <= 120)
    .sort((a, b) => a.days - b.days), [records])

  const stats = useMemo(() => {
    const lastVisit = records.filter((r) => r.type === 'vet_visit' && r.recordDate).sort((a, b) => b.recordDate!.localeCompare(a.recordDate!))[0]
    const nextDue = records.filter((r) => r.nextDue && daysUntil(r.nextDue) >= 0).sort((a, b) => a.nextDue!.localeCompare(b.nextDue!))[0]
    return {
      total: records.length,
      vaccinations: records.filter((r) => r.type === 'vaccination').length,
      lastVisit: lastVisit ? fmtDate(lastVisit.recordDate) : '—',
      weight: weights.length ? `${weights[weights.length - 1]!.value} kg` : '—',
      nextDue: nextDue ? fmtDate(nextDue.nextDue) : '—',
    }
  }, [records, weights])

  const filtered = filter === 'all' ? records : records.filter((r) => r.type === filter)
  const sorted = [...filtered].sort((a, b) => (b.recordDate ?? b.createdAt.slice(0, 10)).localeCompare(a.recordDate ?? a.createdAt.slice(0, 10)))
  const groups: { year: string; items: HealthRecord[] }[] = []
  for (const r of sorted) {
    const y = yearOf(r.recordDate)
    const g = groups.find((x) => x.year === y)
    if (g) g.items.push(r); else groups.push({ year: y, items: [r] })
  }

  async function removeRecord(id: string): Promise<void> {
    if (!activePet) return
    setRecords((prev) => prev.filter((r) => r.id !== id))
    await petsApi.removeHealth(activePet, id).catch(() => {})
  }
  function onSaved(rec: HealthRecord, isEdit: boolean): void {
    setRecords((prev) => isEdit ? prev.map((r) => r.id === rec.id ? rec : r) : [rec, ...prev])
    setModal(null)
  }

  if (authLoading || !isAuthenticated) return <div className="min-h-screen bg-background" />

  return (
    <>
      <style>{`@media print { body * { visibility:hidden !important } #hp-print, #hp-print * { visibility:visible !important } #hp-print { position:absolute; left:0; top:0; width:100% } .no-print { display:none !important } }`}</style>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block no-print">
            <ProfileCard />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-6 space-y-gutter pb-20">
            <div className="flex items-center justify-between px-1 no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Health Passport</h1>
                  <p className="text-label-sm text-outline">Vaccinations, visits &amp; medical records</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <DocsHelpLink href="/docs/profile-and-pets#health-passport" />
                {pet && (
                  <>
                    <button onClick={() => setShowShare(true)} title="Share vet card" className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><Share2 className="w-4 h-4" /></button>
                    <button onClick={() => window.print()} title="Print / Save as PDF" className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><Printer className="w-4 h-4" /></button>
                    <button onClick={() => setModal({ record: null })} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" />Add record</button>
                  </>
                )}
              </div>
            </div>

            {/* Pet selector */}
            {loadingPets ? (
              <div className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse no-print" />
            ) : pets.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md text-on-surface font-semibold">No pets yet</p>
                <p className="text-label-sm text-outline">Add a pet from the home page to track health records.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center gap-2 overflow-x-auto no-scrollbar no-print">
                {pets.map((p) => (
                  <button key={p.id} onClick={() => setSelectedPet(p.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors cursor-pointer ${activePet === p.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold overflow-hidden ${activePet === p.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : initials(p.name)}
                    </span>
                    <span className="text-label-sm font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Household overview */}
            {household.length > 1 && (household.some((h) => h.overdue > 0 || h.next)) && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 no-print">
                <h3 className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface mb-2"><Users className="w-4 h-4 text-primary" />Household care</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {household.filter((h) => h.overdue > 0 || h.next).map((h) => (
                    <button key={h.id} onClick={() => setSelectedPet(h.id)} className={`text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${activePet === h.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-label-sm font-semibold text-on-surface truncate">{h.name}</span>
                        {h.overdue > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 flex-shrink-0">{h.overdue} overdue</span>}
                      </div>
                      <span className="text-[11px] text-outline truncate block">{h.next ? `Next: ${h.next.title} · ${fmtDate(h.next.date)}` : 'All up to date'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pet && (
              <div id="hp-print" className="space-y-3">
                {/* Summary */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {pet.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pet.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : <span className="text-headline-sm font-bold text-primary">{initials(pet.name)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-headline text-label-lg font-bold text-on-surface flex items-center gap-1.5">{pet.name}<HeartPulse className="w-4 h-4 text-primary" /></h2>
                      <p className="text-[12px] text-outline capitalize">{[pet.breed, pet.sex, ageOf(pet.birthdate)].filter(Boolean).join(' · ') || pet.species}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                    <Stat label="Records" value={stats.total} />
                    <Stat label="Vaccines" value={stats.vaccinations} />
                    <Stat label="Weight" value={stats.weight} />
                    <Stat label="Last visit" value={stats.lastVisit} />
                    <Stat label="Next due" value={stats.nextDue} />
                  </div>
                </div>

                {/* About */}
                <PetAbout
                  pet={pet}
                  latestWeightKg={weights.length > 0 ? weights[weights.length - 1]!.value : undefined}
                  onEdit={() => setEditPet(true)}
                />

                {/* Allergies (critical) */}
                {allergies.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-label-sm font-bold text-red-700">Allergies &amp; alerts</p>
                      <p className="text-[12px] text-on-surface-variant">{allergies.map((a) => a.title).join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Reminders */}
                {reminders.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 no-print">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface"><Bell className="w-4 h-4 text-primary" />Due &amp; overdue</h3>
                      <button onClick={() => downloadIcs(pet.name, reminders.map(({ r }) => ({ title: r.title, date: r.nextDue! })))} title="Add all to calendar" className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"><CalendarPlus className="w-3.5 h-3.5" />Add to calendar</button>
                    </div>
                    <div className="space-y-1.5">
                      {reminders.map(({ r, days }) => {
                        const m = typeMeta(r.type)
                        return (
                          <button key={r.id} onClick={() => setModal({ record: r })} className="w-full flex items-center gap-2 text-left cursor-pointer group">
                            <m.Icon className={`w-3.5 h-3.5 ${days < 0 ? 'text-red-600' : 'text-amber-600'}`} />
                            <span className="text-[12px] text-on-surface-variant group-hover:text-on-surface flex-1 truncate">{r.title}</span>
                            <span className={`text-[11px] font-semibold ${days < 0 ? 'text-red-600' : 'text-amber-600'}`}>{days < 0 ? `overdue ${-days}d` : days === 0 ? 'today' : `in ${days}d`}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* View tabs */}
                <div className="flex gap-1 no-print">
                  {([['records', 'Records', FileText], ['weight', 'Weight', Scale]] as [View, string, LucideIcon][]).map(([id, lbl, Icon]) => (
                    <button key={id} onClick={() => setView(id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-label-sm font-semibold cursor-pointer transition-colors ${view === id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}><Icon className="w-4 h-4" />{lbl}</button>
                  ))}
                </div>

                {loading ? (
                  <div className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
                ) : view === 'weight' ? (
                  <WeightView petId={pet.id} weights={weights} onLog={() => setLogWeight(true)} />
                ) : (
                  <>
                    {/* Filters */}
                    {records.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 no-print">
                        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${records.length})`} />
                        {TYPES.map((t) => {
                          const c = records.filter((r) => r.type === t.value).length
                          return c === 0 ? null : <FilterChip key={t.value} active={filter === t.value} onClick={() => setFilter(t.value)} label={`${t.label} (${c})`} Icon={t.Icon} />
                        })}
                      </div>
                    )}

                    {sorted.length === 0 ? (
                      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
                        <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-label-md font-semibold text-on-surface">{records.length === 0 ? 'No records yet' : 'Nothing in this filter'}</p>
                        <p className="text-label-sm text-outline">{records.length === 0 ? `Add ${pet.name}'s first health record.` : 'Try a different filter.'}</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {groups.map((g) => (
                          <div key={g.year}>
                            <h3 className="text-label-sm font-bold text-outline mb-2 px-1">{g.year}</h3>
                            <div className="relative pl-8 space-y-3 before:content-[''] before:absolute before:left-[13px] before:top-1 before:bottom-1 before:w-0.5 before:bg-outline-variant/30">
                              {g.items.map((r) => <RecordCard key={r.id} r={r} onEdit={() => setModal({ record: r })} onDelete={() => removeRecord(r.id)} />)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block no-print"><RightPanel /></div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {modal && activePet && <RecordModal petId={activePet} record={modal.record} onClose={() => setModal(null)} onSaved={onSaved} />}
      {logWeight && activePet && <RecordModal petId={activePet} record={null} initialType="weight" onClose={() => setLogWeight(false)} onSaved={(r, e) => { onSaved(r, e); setLogWeight(false) }} />}
      <AddPetModal
        open={editPet && !!pet}
        pet={pet ?? null}
        onClose={() => setEditPet(false)}
        onAdded={patchPet}
      />

      {showShare && pet && <ShareModal petId={pet.id} petName={pet.name} onClose={() => setShowShare(false)} />}
    </>
  )
}

// ── Share modal (vet card) ────────────────────────────────────────────────────
function ShareModal({ petId, petName, onClose }: { petId: string; petName: string; onClose: () => void }): React.JSX.Element {
  const [url, setUrl] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    petsApi.enableHealthShare(petId)
      .then(({ token }) => {
        if (cancelled) return
        const link = `${window.location.origin}/pet-passport/${token}`
        setUrl(link)
        return QRCode.toDataURL(link, { width: 220, margin: 1 }).then((d) => { if (!cancelled) setQr(d) })
      })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Could not create share link') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [petId])

  async function copy(): Promise<void> {
    if (!url) return
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  async function revoke(): Promise<void> {
    setBusy(true)
    await petsApi.disableHealthShare(petId).catch(() => {})
    setBusy(false); onClose()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface flex items-center gap-1.5"><Share2 className="w-5 h-5 text-primary" />Share vet card</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-label-sm text-outline">A read-only medical card for {petName}. Show the QR at the clinic or send the link. You can revoke access anytime.</p>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-label-sm text-red-500 text-center py-6">{error}</p>
          ) : (
            <>
              {qr && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt="Passport QR code" className="w-44 h-44 rounded-xl border border-outline-variant/30" />
                </div>
              )}
              <div className="flex items-center gap-2 bg-surface-container rounded-xl px-3 py-2">
                <Link2 className="w-4 h-4 text-outline flex-shrink-0" />
                <span className="text-[12px] text-on-surface-variant truncate flex-1">{url}</span>
                <button onClick={copy} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 cursor-pointer flex-shrink-0">{copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}</button>
              </div>
              <button onClick={revoke} disabled={busy} className="w-full py-2.5 rounded-xl border border-red-500/40 text-red-600 text-label-md font-semibold hover:bg-red-500/10 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}Revoke link
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Record card ──────────────────────────────────────────────────────────────
function RecordCard({ r, onEdit, onDelete }: { r: HealthRecord; onEdit: () => void; onDelete: () => void }): React.JSX.Element {
  const m = typeMeta(r.type)
  const overdue = r.nextDue && daysUntil(r.nextDue) < 0
  return (
    <div className="relative group">
      <div className={`absolute -left-[27px] top-1 w-7 h-7 rounded-full flex items-center justify-center z-[1] ring-4 ring-background ${m.node}`}><m.Icon className="w-3.5 h-3.5" /></div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label-md font-semibold text-on-surface">{r.title}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.tint}`}>{m.label}</span>
            </div>
            <span className="text-[11px] text-outline">{r.recordDate ? fmtDate(r.recordDate) : 'Undated'}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 no-print">
            <button onClick={onEdit} className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 cursor-pointer"><Pencil className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        {r.notes && <p className="text-label-sm text-on-surface-variant mt-1.5 whitespace-pre-line">{r.notes}</p>}
        {r.nextDue && <p className={`text-[11px] font-semibold mt-1.5 ${overdue ? 'text-red-600' : 'text-secondary'}`}>Next due: {fmtDate(r.nextDue)}{overdue ? ' (overdue)' : ''}</p>}
        {r.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {r.attachments.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-lg overflow-hidden border border-outline-variant/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Weight ───────────────────────────────────────────────────────────────────
function WeightView({ petId, weights, onLog }: { petId: string; weights: { date: string; value: number }[]; onLog: () => void }): React.JSX.Element {
  const [target, setTarget] = useState<number | null>(null)
  const [editTarget, setEditTarget] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(targetKey(petId)) : null
    const t = setTimeout(() => setTarget(raw ? parseFloat(raw) : null), 0)
    return () => clearTimeout(t)
  }, [petId])

  function saveTarget(): void {
    const v = parseFloat(draft)
    if (!isNaN(v) && v > 0) { window.localStorage.setItem(targetKey(petId), String(v)); setTarget(v) }
    else { window.localStorage.removeItem(targetKey(petId)); setTarget(null) }
    setEditTarget(false)
  }

  const latest = weights.length ? weights[weights.length - 1]!.value : null
  const prev = weights.length > 1 ? weights[weights.length - 2]!.value : null
  const delta = latest !== null && prev !== null ? +(latest - prev).toFixed(2) : null
  const TrendIcon = delta === null || delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown
  // Ideal band = target ±10%.
  const band = target ? { lo: +(target * 0.9).toFixed(1), hi: +(target * 1.1).toFixed(1) } : null
  const status = latest !== null && band ? (latest < band.lo ? 'under' : latest > band.hi ? 'over' : 'ideal') : null

  return (
    <div className="space-y-3">
      {/* Insight bar */}
      {weights.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
            <span className="text-[10px] text-outline">Current</span>
            <strong className="block text-label-lg font-bold text-on-surface tabular-nums">{latest} kg</strong>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
            <span className="text-[10px] text-outline">Trend</span>
            <strong className={`flex items-center gap-1 text-label-lg font-bold tabular-nums ${delta && delta > 0 ? 'text-amber-600' : delta && delta < 0 ? 'text-blue-600' : 'text-on-surface'}`}>
              <TrendIcon className="w-4 h-4" />{delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta} kg`}
            </strong>
          </div>
          <button onClick={() => { setDraft(target ? String(target) : ''); setEditTarget(true) }} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 text-left cursor-pointer hover:border-primary no-print">
            <span className="flex items-center gap-1 text-[10px] text-outline"><Target className="w-3 h-3" />Ideal weight</span>
            {status ? (
              <strong className={`block text-label-lg font-bold ${status === 'ideal' ? 'text-emerald-600' : 'text-amber-600'}`}>{status === 'ideal' ? 'On target' : status === 'over' ? 'Above band' : 'Below band'}</strong>
            ) : (
              <strong className="block text-label-md font-semibold text-primary">Set target</strong>
            )}
          </button>
        </div>
      )}

      {editTarget && (
        <div className="bg-surface-container-lowest rounded-xl border border-primary/40 p-3 flex items-center gap-2 no-print">
          <Target className="w-4 h-4 text-primary flex-shrink-0" />
          <input type="number" step="0.1" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Target weight (kg)" className="flex-1 px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
          <button onClick={saveTarget} className="px-3 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold cursor-pointer">Save</button>
          <button onClick={() => setEditTarget(false)} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex justify-end no-print"><button onClick={onLog} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"><Plus className="w-4 h-4" />Log weight</button></div>
      {weights.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center"><Scale className="w-8 h-8 text-emerald-500 mx-auto mb-2" /><p className="text-label-md font-semibold text-on-surface">No weight logged</p><p className="text-label-sm text-outline">Log weight to track the growth curve over time.</p></div>
      ) : (
        <>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4"><WeightChart data={weights} band={band} /></div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/15">
            {[...weights].reverse().map((w, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5"><span className="text-[12px] text-outline">{fmtDate(w.date)}</span><span className="text-label-md font-semibold text-on-surface tabular-nums">{w.value} kg</span></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
function WeightChart({ data, band }: { data: { date: string; value: number }[]; band?: { lo: number; hi: number } | null }): React.JSX.Element {
  const W = 320, H = 120, pad = 8
  const vals = data.map((d) => d.value)
  let min = Math.min(...vals), max = Math.max(...vals)
  if (band) { min = Math.min(min, band.lo); max = Math.max(max, band.hi) }
  const range = max - min || 1
  const y = (v: number): number => H - pad - ((v - min) / range) * (H - pad * 2)
  const pts = data.map((d, i) => ({ x: pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2), y: y(d.value) }))
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
        {band && <rect x={0} y={y(band.hi)} width={W} height={Math.max(0, y(band.lo) - y(band.hi))} fill="rgb(16 185 129 / 0.12)" />}
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--color-primary, #2a5c48)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--color-primary, #2a5c48)" />)}
      </svg>
      <div className="flex justify-between text-[10px] text-outline mt-1 tabular-nums"><span>{fmtDate(data[0]!.date)}</span><span>{Math.max(...vals)} kg peak</span><span>{fmtDate(data[data.length - 1]!.date)}</span></div>
    </div>
  )
}

// ── Shared bits ───────────────────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string | number }): React.JSX.Element {
  return <div><strong className="block text-label-md font-bold text-on-surface tabular-nums truncate">{value}</strong><span className="text-[10px] text-outline">{label}</span></div>
}
function FilterChip({ active, onClick, label, Icon }: { active: boolean; onClick: () => void; label: string; Icon?: LucideIcon }): React.JSX.Element {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${active ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:border-primary'}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}{label}
    </button>
  )
}

// ── Add / edit record modal ──────────────────────────────────────────────────
function RecordModal({ petId, record, initialType, onClose, onSaved }: {
  petId: string; record: HealthRecord | null; initialType?: string; onClose: () => void; onSaved: (r: HealthRecord, isEdit: boolean) => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const editing = !!record
  const today = new Date().toISOString().slice(0, 10)
  const [type, setType] = useState(record?.type ?? initialType ?? 'vaccination')
  const [title, setTitle] = useState(record?.title ?? '')
  const [notes, setNotes] = useState(record?.notes ?? '')
  const [attachments, setAttachments] = useState<string[]>(record?.attachments ?? [])
  const [recordDate, setRecordDate] = useState(record?.recordDate ?? today)
  const [nextDue, setNextDue] = useState(record?.nextDue ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function pickTemplate(name: string): void {
    setTitle(name)
    // Suggest a 1-year next-due from the record date for vaccinations.
    if (recordDate) { const d = new Date(recordDate); d.setFullYear(d.getFullYear() + 1); setNextDue(d.toISOString().slice(0, 10)) }
  }

  async function pickFiles(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(e.target.files ?? []); e.target.value = ''
    if (!files.length || !profile) return
    setUploading(true); setError('')
    try {
      const urls = await Promise.all(files.slice(0, 10).map((f) => uploadCommunityImage(profile.id, f, 'cover')))
      setAttachments((p) => [...p, ...urls].slice(0, 10))
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }

  async function save(): Promise<void> {
    if (saving || !title.trim()) return
    setSaving(true); setError('')
    try {
      const payload = { type, title: title.trim(), notes: notes.trim(), attachments, recordDate, ...(nextDue ? { nextDue } : {}) }
      const saved = editing ? await petsApi.updateHealth(petId, record!.id, payload) : await petsApi.addHealth(petId, payload)
      onSaved(saved, editing)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save record') } finally { setSaving(false) }
  }

  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  const label = 'text-[12px] font-semibold text-outline'

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{editing ? 'Edit record' : 'Add health record'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t.value} onClick={() => setType(t.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer transition-colors ${type === t.value ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                <t.Icon className="w-3.5 h-3.5" />{t.label}
              </button>
            ))}
          </div>

          {type === 'vaccination' && (
            <div className="flex flex-wrap gap-1.5">
              {VACCINE_TEMPLATES.map((v) => <button key={v} onClick={() => pickTemplate(v)} className="px-2.5 py-1 rounded-full text-[11px] bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">{v}</button>)}
            </div>
          )}

          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder={type === 'weight' ? 'e.g. 12.4 kg' : 'Title (e.g. Rabies vaccine)'} className={input} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} placeholder="Notes (vet, batch no., dosage…)" className={`${input} resize-none`} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Date</label>
              <div className="relative"><CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" /><input type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} className={`${input} pl-9`} /></div>
            </div>
            <div>
              <label className={label}>Next due <span className="font-normal">(optional)</span></label>
              <input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} className={input} />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className={label}>Attachments <span className="font-normal">(lab reports, vaccine card…)</span></label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {attachments.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setAttachments((p) => p.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {attachments.length < 10 && <button onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-lg border border-dashed border-outline-variant/60 flex items-center justify-center text-outline hover:border-primary cursor-pointer">{uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}</button>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={pickFiles} />
          </div>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={save} disabled={saving || uploading || !title.trim()} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Save changes' : 'Save record'}
          </button>
        </div>
      </div>
    </div>
  )
}
