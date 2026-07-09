'use client'

import { useCallback, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { BookOpen, Plus, Trash2, Loader2, PawPrint, Milestone, Camera, Stethoscope } from 'lucide-react'
import { petsApi, type Pet, type DiaryEntry } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

const KINDS = [
  { value: 'note', label: 'Note', Icon: BookOpen },
  { value: 'milestone', label: 'Milestone', Icon: Milestone },
  { value: 'photo', label: 'Photo', Icon: Camera },
  { value: 'checkup', label: 'Checkup', Icon: Stethoscope },
]

function initials(n: string): string { return n.slice(0, 2).toUpperCase() }
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PetDiaryPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [activePet, setActivePet] = useState<string | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loadingPets, setLoadingPets] = useState(true)
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [kind, setKind] = useState('note')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    let cancelled = false
    petsApi.mine()
      .then((data) => {
        if (cancelled) return
        setPets(data)
        setActivePet((prev) => prev ?? data[0]?.id ?? null)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingPets(false) })
    return () => { cancelled = true }
  }, [])

  const loadEntries = useCallback((petId: string) => {
    setLoadingEntries(true)
    petsApi.diary(petId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoadingEntries(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (activePet) loadEntries(activePet)
      else setEntries([])
    }, 0)
    return () => clearTimeout(t)
  }, [activePet, loadEntries])

  async function addEntry(): Promise<void> {
    if (!activePet || saving || (!title.trim() && !body.trim())) return
    setSaving(true)
    try {
      const entry = await petsApi.addDiary(activePet, {
        kind,
        ...(title.trim() ? { title: title.trim() } : {}),
        ...(body.trim() ? { body: body.trim() } : {}),
      })
      setEntries((prev) => [entry, ...prev])
      setTitle(''); setBody(''); setKind('note'); setShowForm(false)
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  async function removeEntry(id: string): Promise<void> {
    if (!activePet) return
    setEntries((prev) => prev.filter((e) => e.id !== id))
    await petsApi.removeDiary(activePet, id).catch(() => {})
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
            {/* Title */}
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-headline text-headline-md text-on-surface leading-tight">Pet Diary</h1>
                <p className="text-label-sm text-outline">Moments, milestones &amp; memories</p>
              </div>
            </div>

            {/* Pet selector */}
            {loadingPets ? (
              <div className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
            ) : pets.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center">
                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-label-md text-on-surface font-semibold">No pets yet</p>
                <p className="text-label-sm text-outline">Add a pet from the home page to start a diary.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setActivePet(pet.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors cursor-pointer ${
                      activePet === pet.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
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

            {/* Add entry */}
            {pets.length > 0 && activePet && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                {!showForm ? (
                  <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-label-md font-semibold text-primary hover:underline cursor-pointer">
                    <Plus className="w-4 h-4" />New diary entry
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {KINDS.map((k) => (
                        <button key={k.value} onClick={() => setKind(k.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm cursor-pointer transition-colors ${kind === k.value ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                          <k.Icon className="w-3.5 h-3.5" />{k.label}
                        </button>
                      ))}
                    </div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Title (optional)"
                      className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none" />
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={3} placeholder="What happened today?"
                      className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setShowForm(false); setTitle(''); setBody('') }} className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm cursor-pointer">Cancel</button>
                      <button onClick={addEntry} disabled={saving || (!title.trim() && !body.trim())}
                        className="px-5 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center gap-2">
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            {loadingEntries ? (
              <div className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
            ) : pets.length > 0 && entries.length === 0 ? (
              <p className="text-label-sm text-outline text-center py-8">No entries yet — add the first memory above.</p>
            ) : (
              <div className="space-y-3">
                {entries.map((e) => {
                  const K = KINDS.find((k) => k.value === e.kind) ?? KINDS[0]!
                  return (
                    <div key={e.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 group">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <K.Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-label-md font-semibold text-on-surface">{e.title || K.label}</span>
                            <span className="text-[11px] text-outline flex-shrink-0">{fmtDate(e.entryDate)}</span>
                          </div>
                          {e.body && <p className="text-label-sm text-on-surface-variant mt-1 whitespace-pre-line">{e.body}</p>}
                          {e.photoUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={e.photoUrl} alt="" className="mt-2 rounded-lg max-h-72 object-cover w-full" />
                          )}
                        </div>
                        <button onClick={() => removeEntry(e.id)} className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
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
