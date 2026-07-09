'use client'

import { useCallback, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { ShieldCheck, Plus, Trash2, Loader2, PawPrint, Syringe, Stethoscope, Pill, AlertTriangle, Scale, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { petsApi, type Pet, type HealthRecord } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

const TYPES: { value: string; label: string; Icon: LucideIcon; tint: string }[] = [
  { value: 'vaccination', label: 'Vaccination', Icon: Syringe, tint: 'bg-primary/10 text-primary' },
  { value: 'vet_visit', label: 'Vet Visit', Icon: Stethoscope, tint: 'bg-blue-500/10 text-blue-600' },
  { value: 'medication', label: 'Medication', Icon: Pill, tint: 'bg-secondary/10 text-secondary' },
  { value: 'allergy', label: 'Allergy', Icon: AlertTriangle, tint: 'bg-red-500/10 text-red-600' },
  { value: 'weight', label: 'Weight', Icon: Scale, tint: 'bg-emerald-500/10 text-emerald-600' },
  { value: 'note', label: 'Note', Icon: FileText, tint: 'bg-surface-container text-on-surface-variant' },
]
const typeMeta = (t: string) => TYPES.find((x) => x.value === t) ?? TYPES[5]!

function initials(n: string): string { return n.slice(0, 2).toUpperCase() }
function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
}

export default function HealthPassportPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [activePet, setActivePet] = useState<string | null>(null)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loadingPets, setLoadingPets] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState('vaccination')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [recordDate, setRecordDate] = useState('')
  const [nextDue, setNextDue] = useState('')
  const [saving, setSaving] = useState(false)

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
    setLoadingRecords(true)
    petsApi.health(petId).then(setRecords).catch(() => setRecords([])).finally(() => setLoadingRecords(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (activePet) load(activePet)
      else setRecords([])
    }, 0)
    return () => clearTimeout(t)
  }, [activePet, load])

  async function addRecord(): Promise<void> {
    if (!activePet || saving || !title.trim()) return
    setSaving(true)
    try {
      const rec = await petsApi.addHealth(activePet, {
        type, title: title.trim(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        ...(recordDate ? { recordDate } : {}),
        ...(nextDue ? { nextDue } : {}),
      })
      setRecords((prev) => [rec, ...prev])
      setTitle(''); setNotes(''); setRecordDate(''); setNextDue(''); setType('vaccination'); setShowForm(false)
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  async function removeRecord(id: string): Promise<void> {
    if (!activePet) return
    setRecords((prev) => prev.filter((r) => r.id !== id))
    await petsApi.removeHealth(activePet, id).catch(() => {})
  }

  if (authLoading || !isAuthenticated) return <div className="min-h-screen bg-background" />

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
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-headline text-headline-md text-on-surface leading-tight">Health Passport</h1>
                <p className="text-label-sm text-outline">Vaccinations, visits & medical records</p>
              </div>
            </div>

            {/* Pet selector */}
            {loadingPets ? (
              <div className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
            ) : pets.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md text-on-surface font-semibold">No pets yet</p>
                <p className="text-label-sm text-outline">Add a pet from the home page to track health records.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {pets.map((pet) => (
                  <button key={pet.id} onClick={() => setActivePet(pet.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors cursor-pointer ${activePet === pet.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold overflow-hidden ${activePet === pet.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                      {pet.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pet.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : initials(pet.name)}
                    </span>
                    <span className="text-label-sm font-semibold">{pet.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Add record */}
            {pets.length > 0 && activePet && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                {!showForm ? (
                  <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-label-md font-semibold text-primary hover:underline cursor-pointer">
                    <Plus className="w-4 h-4" />Add health record
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map((t) => (
                        <button key={t.value} onClick={() => setType(t.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer transition-colors ${type === t.value ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                          <t.Icon className="w-3.5 h-3.5" />{t.label}
                        </button>
                      ))}
                    </div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Title (e.g. Rabies vaccine)"
                      className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={2} placeholder="Notes (optional)"
                      className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none" />
                    <div className="flex gap-3">
                      <label className="flex-1 text-[11px] text-outline">Date
                        <input type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
                      </label>
                      <label className="flex-1 text-[11px] text-outline">Next due (optional)
                        <input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
                      </label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setShowForm(false); setTitle(''); setNotes('') }} className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm cursor-pointer">Cancel</button>
                      <button onClick={addRecord} disabled={saving || !title.trim()}
                        className="px-5 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center gap-2">
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save record
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Records */}
            {loadingRecords ? (
              <div className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
            ) : pets.length > 0 && records.length === 0 ? (
              <p className="text-label-sm text-outline text-center py-8">No records yet — add the first one above.</p>
            ) : (
              <div className="space-y-3">
                {records.map((r) => {
                  const m = typeMeta(r.type)
                  return (
                    <div key={r.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 group">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${m.tint}`}>
                          <m.Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-label-md font-semibold text-on-surface">{r.title}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-outline flex-shrink-0">{m.label}</span>
                          </div>
                          {r.notes && <p className="text-label-sm text-on-surface-variant mt-1 whitespace-pre-line">{r.notes}</p>}
                          <div className="flex gap-4 mt-1.5 text-[11px] text-outline">
                            {r.recordDate && <span>Date: {fmtDate(r.recordDate)}</span>}
                            {r.nextDue && <span className="text-secondary font-medium">Next due: {fmtDate(r.nextDue)}</span>}
                          </div>
                        </div>
                        <button onClick={() => removeRecord(r.id)} className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
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
