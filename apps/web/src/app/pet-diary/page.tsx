'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import {
  BookOpen, Plus, Trash2, Loader2, PawPrint, Camera, Stethoscope, Star, Pencil, X, ImagePlus,
  CalendarDays, Scale, Syringe, Pill, AlertTriangle, FileText, Share2, Printer, Cake, Bell, LayoutGrid, Clock, Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { petsApi, postsApi, type Pet, type DiaryEntry, type HealthRecord } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

interface KindMeta { value: string; label: string; Icon: LucideIcon; node: string; tint: string }
const KINDS: KindMeta[] = [
  { value: 'note', label: 'Note', Icon: BookOpen, node: 'bg-primary text-white', tint: 'bg-primary/10 text-primary' },
  { value: 'milestone', label: 'Milestone', Icon: Star, node: 'bg-amber-500 text-white', tint: 'bg-amber-500/10 text-amber-600' },
  { value: 'photo', label: 'Photo', Icon: Camera, node: 'bg-blue-500 text-white', tint: 'bg-blue-500/10 text-blue-600' },
  { value: 'checkup', label: 'Checkup', Icon: Stethoscope, node: 'bg-emerald-500 text-white', tint: 'bg-emerald-500/10 text-emerald-600' },
]
const kindMeta = (v: string): KindMeta => KINDS.find((k) => k.value === v) ?? KINDS[0]!

const HEALTH_META: Record<string, { label: string; Icon: LucideIcon; node: string }> = {
  vaccination: { label: 'Vaccination', Icon: Syringe, node: 'bg-teal-500 text-white' },
  vet_visit: { label: 'Vet Visit', Icon: Stethoscope, node: 'bg-blue-500 text-white' },
  medication: { label: 'Medication', Icon: Pill, node: 'bg-secondary text-white' },
  allergy: { label: 'Allergy', Icon: AlertTriangle, node: 'bg-red-500 text-white' },
  weight: { label: 'Weight', Icon: Scale, node: 'bg-emerald-500 text-white' },
  note: { label: 'Health note', Icon: FileText, node: 'bg-outline text-white' },
}
const MILESTONE_TEMPLATES = ['Gotcha Day', 'First walk', 'Birthday', 'Learned a trick', 'Lost a tooth', 'First groom', 'Vet all-clear', 'First swim']

function initials(n: string): string { return n.slice(0, 2).toUpperCase() }
function fmtDate(iso: string): string { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
function monthKey(iso: string): string { return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
function ageOf(birthdate: string | null): string | null {
  if (!birthdate) return null
  const months = Math.max(0, Math.floor((Date.now() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
  if (months < 12) return `${months} mo`
  const y = Math.floor(months / 12)
  return `${y} yr${y > 1 ? 's' : ''}`
}
function daysUntil(iso: string): number { return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000) }
function allPhotos(e: DiaryEntry): string[] { return [...(e.photoUrl ? [e.photoUrl] : []), ...e.photoUrls] }

type View = 'timeline' | 'photos' | 'weight'

export default function PetDiaryPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [activePet, setActivePet] = useState<string | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [health, setHealth] = useState<HealthRecord[]>([])
  const [loadingPets, setLoadingPets] = useState(true)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<View>('timeline')
  const [filter, setFilter] = useState('all')
  const [showHealth, setShowHealth] = useState(true)
  const [modal, setModal] = useState<{ entry: DiaryEntry | null } | null>(null)
  const [logWeight, setLogWeight] = useState(false)
  const [sharedId, setSharedId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    let cancelled = false
    petsApi.mine()
      .then((data) => { if (cancelled) return; setPets(data); setActivePet((prev) => prev ?? data[0]?.id ?? null) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingPets(false) })
    return () => { cancelled = true }
  }, [])

  const load = useCallback((petId: string) => {
    setLoading(true)
    Promise.all([petsApi.diary(petId).catch(() => []), petsApi.health(petId).catch(() => [])])
      .then(([d, h]) => { setEntries(d); setHealth(h) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { if (activePet) load(activePet); else { setEntries([]); setHealth([]) } }, 0)
    return () => clearTimeout(t)
  }, [activePet, load])

  const pet = pets.find((p) => p.id === activePet) ?? null

  const stats = useMemo(() => ({
    total: entries.length,
    milestones: entries.filter((e) => e.kind === 'milestone').length,
    photos: entries.reduce((n, e) => n + allPhotos(e).length, 0),
    since: entries.length ? monthKey([...entries].sort((a, b) => a.entryDate.localeCompare(b.entryDate))[0]!.entryDate) : null,
  }), [entries])

  // Weight series from Health Passport
  const weights = useMemo(() => health
    .filter((h) => h.type === 'weight')
    .map((h) => ({ date: h.recordDate ?? h.createdAt.slice(0, 10), value: parseFloat(h.title) || parseFloat(h.notes ?? '') || NaN }))
    .filter((w) => !isNaN(w.value))
    .sort((a, b) => a.date.localeCompare(b.date)), [health])

  // Coming up: birthday + upcoming health due dates
  const comingUp = useMemo(() => {
    const items: { icon: LucideIcon; label: string; days: number }[] = []
    if (pet?.birthdate) {
      const bd = new Date(pet.birthdate)
      const now = new Date()
      const next = new Date(now.getFullYear(), bd.getMonth(), bd.getDate())
      if (next.getTime() < now.setHours(0, 0, 0, 0)) next.setFullYear(next.getFullYear() + 1)
      items.push({ icon: Cake, label: `${pet.name}'s birthday`, days: daysUntil(next.toISOString().slice(0, 10)) })
    }
    for (const h of health) {
      if (h.nextDue && daysUntil(h.nextDue) >= 0) items.push({ icon: HEALTH_META[h.type]?.Icon ?? Bell, label: `${h.title} due`, days: daysUntil(h.nextDue) })
    }
    return items.sort((a, b) => a.days - b.days).slice(0, 4)
  }, [pet, health])

  // On this day (previous years)
  const onThisDay = useMemo(() => {
    const md = new Date().toISOString().slice(5, 10)
    const yr = new Date().getFullYear()
    return entries.filter((e) => e.entryDate.slice(5, 10) === md && Number(e.entryDate.slice(0, 4)) < yr)
  }, [entries])

  // Timeline (diary + optional health), grouped by month
  const groups = useMemo(() => {
    type TL = { id: string; date: string; diary?: DiaryEntry; health?: HealthRecord }
    let items: TL[] = entries
      .filter((e) => filter === 'all' || e.kind === filter)
      .map((e) => ({ id: e.id, date: e.entryDate, diary: e }))
    if (showHealth && filter === 'all') {
      items = items.concat(health.map((h) => ({ id: `h-${h.id}`, date: h.recordDate ?? h.createdAt.slice(0, 10), health: h })))
    }
    items.sort((a, b) => b.date.localeCompare(a.date))
    const g: { month: string; items: TL[] }[] = []
    for (const it of items) {
      const m = monthKey(it.date)
      const grp = g.find((x) => x.month === m)
      if (grp) grp.items.push(it); else g.push({ month: m, items: [it] })
    }
    return g
  }, [entries, health, filter, showHealth])

  const galleryPhotos = useMemo(() => entries.flatMap((e) => allPhotos(e).map((url) => ({ url, entry: e }))), [entries])

  async function removeEntry(id: string): Promise<void> {
    if (!activePet) return
    setEntries((prev) => prev.filter((e) => e.id !== id))
    await petsApi.removeDiary(activePet, id).catch(() => {})
  }
  function onSaved(entry: DiaryEntry, isEdit: boolean): void {
    setEntries((prev) => isEdit ? prev.map((e) => e.id === entry.id ? entry : e) : [entry, ...prev])
    setModal(null)
  }
  async function share(e: DiaryEntry): Promise<void> {
    if (!pet) return
    const K = kindMeta(e.kind)
    const caption = `${pet.name} — ${e.title || K.label}${e.body ? `\n\n${e.body}` : ''}\n\n#PetDiary`
    try { await postsApi.create({ caption, visibility: 'public' }); setSharedId(e.id); setTimeout(() => setSharedId(null), 2500) } catch { /* ignore */ }
  }

  if (authLoading || !isAuthenticated) return <div className="min-h-screen bg-background" />

  return (
    <>
      <style>{`@media print { body * { visibility: hidden !important } #diary-print, #diary-print * { visibility: visible !important } #diary-print { position: absolute; left: 0; top: 0; width: 100% } .no-print { display: none !important } }`}</style>
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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
                <div>
                  <h1 className="font-headline text-headline-md text-on-surface leading-tight">Pet Diary</h1>
                  <p className="text-label-sm text-outline">Moments, milestones &amp; memories</p>
                </div>
              </div>
              {pet && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => window.print()} title="Save as PDF" className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><Printer className="w-4 h-4" /></button>
                  <button onClick={() => setModal({ entry: null })} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90"><Plus className="w-4 h-4" />New entry</button>
                </div>
              )}
            </div>

            {/* Pet selector */}
            {loadingPets ? (
              <div className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse no-print" />
            ) : pets.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md text-on-surface font-semibold">No pets yet</p>
                <p className="text-label-sm text-outline">Add a pet from the home page to start a diary.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center gap-2 overflow-x-auto no-scrollbar no-print">
                {pets.map((p) => (
                  <button key={p.id} onClick={() => setActivePet(p.id)}
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

            {/* Pet header + stats */}
            {pet && (
              <div id="diary-print">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {pet.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pet.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : <span className="text-headline-sm font-bold text-primary">{initials(pet.name)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-headline text-label-lg font-bold text-on-surface">{pet.name}</h2>
                    <p className="text-[12px] text-outline capitalize">{[pet.breed, pet.sex, ageOf(pet.birthdate)].filter(Boolean).join(' · ') || pet.species}</p>
                    <div className="flex gap-5 mt-2">
                      <Stat n={stats.total} label="Entries" />
                      <Stat n={stats.milestones} label="Milestones" />
                      <Stat n={stats.photos} label="Photos" />
                      {weights.length > 0 && <Stat n={weights[weights.length - 1]!.value} label="kg" />}
                    </div>
                  </div>
                  {stats.since && <div className="text-right flex-shrink-0 hidden sm:block"><p className="text-[10px] uppercase tracking-wide text-outline">Since</p><p className="text-label-sm font-semibold text-on-surface">{stats.since}</p></div>}
                </div>

                {/* Coming up */}
                {comingUp.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 mt-3 no-print">
                    <h3 className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface mb-2"><Bell className="w-4 h-4 text-primary" />Coming up</h3>
                    <div className="flex flex-wrap gap-2">
                      {comingUp.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-[12px] text-on-surface-variant">
                          <c.icon className="w-3.5 h-3.5 text-primary" />{c.label} · <span className="font-semibold text-on-surface">{c.days === 0 ? 'today' : `${c.days}d`}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* View tabs */}
                <div className="flex gap-1 mt-3 no-print">
                  {([['timeline', 'Timeline', BookOpen], ['photos', 'Photos', LayoutGrid], ['weight', 'Weight', Scale]] as [View, string, LucideIcon][]).map(([id, lbl, Icon]) => (
                    <button key={id} onClick={() => setView(id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-label-sm font-semibold cursor-pointer transition-colors ${view === id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}><Icon className="w-4 h-4" />{lbl}</button>
                  ))}
                </div>

                {/* On this day */}
                {view === 'timeline' && onThisDay.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-3 no-print">
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-700"><Clock className="w-3.5 h-3.5" />On this day</p>
                    <div className="mt-1 space-y-0.5">
                      {onThisDay.map((e) => <button key={e.id} onClick={() => setModal({ entry: e })} className="block text-left text-[12px] text-on-surface-variant hover:text-primary cursor-pointer">{new Date(e.entryDate).getFullYear()} · {e.title || kindMeta(e.kind).label}</button>)}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse mt-3" />
                ) : view === 'weight' ? (
                  <WeightView weights={weights} onLog={() => setLogWeight(true)} />
                ) : view === 'photos' ? (
                  <PhotoGallery photos={galleryPhotos} onOpen={(e) => setModal({ entry: e })} />
                ) : (
                  <>
                    {/* Filters */}
                    {entries.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mt-3 no-print items-center">
                        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${entries.length})`} />
                        {KINDS.map((k) => {
                          const c = entries.filter((e) => e.kind === k.value).length
                          return c === 0 ? null : <FilterChip key={k.value} active={filter === k.value} onClick={() => setFilter(k.value)} label={`${k.label} (${c})`} Icon={k.Icon} />
                        })}
                        {health.length > 0 && filter === 'all' && (
                          <button onClick={() => setShowHealth((v) => !v)} className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer ${showHealth ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-container-lowest text-outline border border-outline-variant/40'}`}><Stethoscope className="w-3.5 h-3.5" />Health events</button>
                        )}
                      </div>
                    )}

                    {groups.length === 0 ? (
                      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center mt-3">
                        <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-label-md font-semibold text-on-surface">{entries.length === 0 ? 'No entries yet' : 'Nothing here'}</p>
                        <p className="text-label-sm text-outline">{entries.length === 0 ? `Add ${pet.name}'s first memory.` : 'Try a different filter.'}</p>
                      </div>
                    ) : (
                      <div className="space-y-5 mt-3">
                        {groups.map((g) => (
                          <div key={g.month}>
                            <h3 className="text-label-sm font-bold text-outline mb-2 px-1">{g.month}</h3>
                            <div className="relative pl-8 space-y-3 before:content-[''] before:absolute before:left-[13px] before:top-1 before:bottom-1 before:w-0.5 before:bg-outline-variant/30">
                              {g.items.map((it) => it.diary
                                ? <DiaryCard key={it.id} e={it.diary} shared={sharedId === it.diary.id} onEdit={() => setModal({ entry: it.diary! })} onDelete={() => removeEntry(it.diary!.id)} onShare={() => share(it.diary!)} />
                                : <HealthCard key={it.id} h={it.health!} />)}
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

      {modal && activePet && <EntryModal petId={activePet} entry={modal.entry} onClose={() => setModal(null)} onSaved={onSaved} />}
      {logWeight && activePet && <LogWeightModal petId={activePet} onClose={() => setLogWeight(false)} onSaved={(r) => { setHealth((prev) => [r, ...prev]); setLogWeight(false) }} />}
    </>
  )
}

// ── Cards ─────────────────────────────────────────────────────────────────────
function DiaryCard({ e, shared, onEdit, onDelete, onShare }: { e: DiaryEntry; shared: boolean; onEdit: () => void; onDelete: () => void; onShare: () => void }): React.JSX.Element {
  const K = kindMeta(e.kind)
  const photos = allPhotos(e)
  return (
    <div className="relative group">
      <div className={`absolute -left-[27px] top-1 w-7 h-7 rounded-full flex items-center justify-center z-[1] ring-4 ring-background ${K.node}`}><K.Icon className="w-3.5 h-3.5" /></div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label-md font-semibold text-on-surface">{e.title || K.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${K.tint}`}>{K.label}</span>
            </div>
            <span className="text-[11px] text-outline">{fmtDate(e.entryDate)}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 no-print">
            <button onClick={onShare} title="Share to feed" className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 cursor-pointer">{shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}</button>
            <button onClick={onEdit} className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 cursor-pointer"><Pencil className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        {e.body && <p className="text-label-sm text-on-surface-variant mt-1.5 whitespace-pre-line">{e.body}</p>}
        {e.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{e.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline">#{t}</span>)}</div>}
        {photos.length > 0 && (
          <div className={`mt-2 grid gap-1.5 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {photos.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" className={`rounded-lg object-cover w-full ${photos.length === 1 ? 'max-h-80' : 'h-40'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HealthCard({ h }: { h: HealthRecord }): React.JSX.Element {
  const M = HEALTH_META[h.type] ?? HEALTH_META.note!
  return (
    <div className="relative">
      <div className={`absolute -left-[27px] top-1 w-7 h-7 rounded-full flex items-center justify-center z-[1] ring-4 ring-background ${M.node}`}><M.Icon className="w-3.5 h-3.5" /></div>
      <div className="bg-surface-container-low/60 rounded-xl border border-outline-variant/20 p-3">
        <div className="flex items-center gap-2">
          <span className="text-label-sm font-semibold text-on-surface">{h.title}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">{M.label}</span>
          <span className="text-[11px] text-outline ml-auto">{h.recordDate ? fmtDate(h.recordDate) : fmtDate(h.createdAt)}</span>
        </div>
        {h.notes && <p className="text-[12px] text-on-surface-variant mt-1">{h.notes}</p>}
      </div>
    </div>
  )
}

// ── Weight view ─────────────────────────────────────────────────────────────
function WeightView({ weights, onLog }: { weights: { date: string; value: number }[]; onLog: () => void }): React.JSX.Element {
  return (
    <div className="mt-3 space-y-3">
      <div className="flex justify-end no-print"><button onClick={onLog} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"><Plus className="w-4 h-4" />Log weight</button></div>
      {weights.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center"><Scale className="w-8 h-8 text-emerald-500 mx-auto mb-2" /><p className="text-label-md font-semibold text-on-surface">No weight logged</p><p className="text-label-sm text-outline">Log weight to see the growth curve. Entries also appear in the Health Passport.</p></div>
      ) : (
        <>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
            <WeightChart data={weights} />
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/15">
            {[...weights].reverse().map((w, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[12px] text-outline">{fmtDate(w.date)}</span>
                <span className="text-label-md font-semibold text-on-surface tabular-nums">{w.value} kg</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function WeightChart({ data }: { data: { date: string; value: number }[] }): React.JSX.Element {
  const W = 320, H = 120, pad = 8
  const vals = data.map((d) => d.value)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((d.value - min) / range) * (H - pad * 2)
    return { x, y }
  })
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
        <polyline points={line} fill="none" stroke="var(--color-primary, #2a5c48)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--color-primary, #2a5c48)" />)}
      </svg>
      <div className="flex justify-between text-[10px] text-outline mt-1 tabular-nums"><span>{fmtDate(data[0]!.date)}</span><span>{max} kg peak</span><span>{fmtDate(data[data.length - 1]!.date)}</span></div>
    </div>
  )
}

// ── Photo gallery ───────────────────────────────────────────────────────────
function PhotoGallery({ photos, onOpen }: { photos: { url: string; entry: DiaryEntry }[]; onOpen: (e: DiaryEntry) => void }): React.JSX.Element {
  if (photos.length === 0) return <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center mt-3"><Camera className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-label-md font-semibold text-on-surface">No photos yet</p><p className="text-label-sm text-outline">Add photos to diary entries to build a gallery.</p></div>
  return (
    <div className="grid grid-cols-3 gap-1.5 mt-3">
      {photos.map((p, i) => (
        <button key={i} onClick={() => onOpen(p.entry)} className="aspect-square rounded-lg overflow-hidden bg-surface-container cursor-pointer group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </button>
      ))}
    </div>
  )
}

// ── Shared bits ─────────────────────────────────────────────────────────────
function Stat({ n, label }: { n: number; label: string }): React.JSX.Element {
  return <div><strong className="block text-label-lg font-bold text-on-surface tabular-nums">{n}</strong><span className="text-[11px] text-outline">{label}</span></div>
}
function FilterChip({ active, onClick, label, Icon }: { active: boolean; onClick: () => void; label: string; Icon?: LucideIcon }): React.JSX.Element {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${active ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:border-primary'}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}{label}
    </button>
  )
}

// ── Log weight modal ────────────────────────────────────────────────────────
function LogWeightModal({ petId, onClose, onSaved }: { petId: string; onClose: () => void; onSaved: (r: HealthRecord) => void }): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10)
  const [kg, setKg] = useState('')
  const [date, setDate] = useState(today)
  const [saving, setSaving] = useState(false)
  async function save(): Promise<void> {
    const v = parseFloat(kg)
    if (saving || isNaN(v) || v <= 0) return
    setSaving(true)
    try { const r = await petsApi.addHealth(petId, { type: 'weight', title: `${v} kg`, recordDate: date }); onSaved(r) }
    catch { /* ignore */ } finally { setSaving(false) }
  }
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3"><h2 className="text-label-md font-bold text-on-surface">Log weight</h2><button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button></div>
        <div className="space-y-3">
          <div className="relative"><Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" /><input type="number" step="0.1" min="0" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="Weight in kg" className={`${input} pl-9`} autoFocus /></div>
          <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
          <p className="text-[11px] text-outline">Saved to the Health Passport too.</p>
          <button onClick={save} disabled={saving || !kg} className="w-full py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}Save</button>
        </div>
      </div>
    </div>
  )
}

// ── Add / edit entry modal ──────────────────────────────────────────────────
function EntryModal({ petId, entry, onClose, onSaved }: {
  petId: string; entry: DiaryEntry | null; onClose: () => void; onSaved: (e: DiaryEntry, isEdit: boolean) => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const editing = !!entry
  const today = new Date().toISOString().slice(0, 10)
  const [kind, setKind] = useState(entry?.kind ?? 'note')
  const [title, setTitle] = useState(entry?.title ?? '')
  const [body, setBody] = useState(entry?.body ?? '')
  const [photos, setPhotos] = useState<string[]>(entry ? allPhotos(entry) : [])
  const [tags, setTags] = useState<string[]>(entry?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [entryDate, setEntryDate] = useState(entry?.entryDate ?? today)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function pickPhotos(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(e.target.files ?? []); e.target.value = ''
    if (!files.length || !profile) return
    setUploading(true); setError('')
    try {
      const urls = await Promise.all(files.slice(0, 8).map((f) => uploadCommunityImage(profile.id, f, 'cover')))
      setPhotos((p) => [...p, ...urls].slice(0, 8))
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) }
  }
  function addTag(): void { const t = tagInput.trim().replace(/^#/, ''); if (t && !tags.includes(t)) setTags((p) => [...p, t].slice(0, 10)); setTagInput('') }

  async function save(): Promise<void> {
    if (saving || (!title.trim() && !body.trim() && photos.length === 0)) return
    setSaving(true); setError('')
    try {
      const payload = { kind, title: title.trim(), body: body.trim(), photoUrls: photos, tags, entryDate }
      const saved = editing ? await petsApi.updateDiary(petId, entry!.id, payload) : await petsApi.addDiary(petId, payload)
      onSaved(saved, editing)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save entry') } finally { setSaving(false) }
  }

  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{editing ? 'Edit entry' : 'New diary entry'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button key={k.value} onClick={() => setKind(k.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer transition-colors ${kind === k.value ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                <k.Icon className="w-3.5 h-3.5" />{k.label}
              </button>
            ))}
          </div>

          {kind === 'milestone' && (
            <div className="flex flex-wrap gap-1.5">
              {MILESTONE_TEMPLATES.map((t) => <button key={t} onClick={() => setTitle(t)} className="px-2.5 py-1 rounded-full text-[11px] bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 cursor-pointer">{t}</button>)}
            </div>
          )}

          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Title (optional)" className={input} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={4} placeholder="What happened today?" className={`${input} resize-none`} />

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input type="date" max={today} value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className={`${input} pl-9`} />
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {tags.map((t) => <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-[12px] text-on-surface-variant">#{t}<button onClick={() => setTags((p) => p.filter((x) => x !== t))} className="text-outline hover:text-red-500"><X className="w-3 h-3" /></button></span>)}
            </div>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }} maxLength={30} placeholder="Add tag + Enter (e.g. walk, grooming)" className={input} />
          </div>

          {/* Photos */}
          <div className="flex flex-wrap gap-2">
            {photos.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {photos.length < 8 && <button onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-lg border border-dashed border-outline-variant/60 flex items-center justify-center text-outline hover:border-primary cursor-pointer">{uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={pickPhotos} />

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container cursor-pointer">Cancel</button>
          <button onClick={save} disabled={saving || uploading || (!title.trim() && !body.trim() && photos.length === 0)} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Save changes' : 'Save entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
