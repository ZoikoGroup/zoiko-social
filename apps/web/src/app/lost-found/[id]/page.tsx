'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import { ChevronLeft, MapPin, Calendar, Phone, Eye, Loader2, Trash2, Check, Gift } from 'lucide-react'
import { lostFoundApi, type LostFoundReport, type LostFoundSighting } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
}

export default function LostFoundDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [report, setReport] = useState<LostFoundReport | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [sightings, setSightings] = useState<LostFoundSighting[]>([])
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState('')
  const [posting, setPosting] = useState(false)

  const isOwner = !!user && !!report && user.id === report.reporter.id

  useEffect(() => {
    let cancelled = false
    lostFoundApi.get(id).then((r) => { if (!cancelled) setReport(r) }).catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  const loadSightings = useCallback(() => { lostFoundApi.sightings(id).then(setSightings).catch(() => {}) }, [id])
  useEffect(() => { const t = setTimeout(loadSightings, 0); return () => clearTimeout(t) }, [loadSightings])

  async function submitSighting(): Promise<void> {
    if (posting || (!message.trim() && !location.trim())) return
    setPosting(true)
    try {
      await lostFoundApi.addSighting(id, { ...(message.trim() ? { message: message.trim() } : {}), ...(location.trim() ? { location: location.trim() } : {}) })
      setMessage(''); setLocation('')
      loadSightings()
      if (report) setReport({ ...report, sightingsCount: report.sightingsCount + 1 })
    } catch { /* ignore */ } finally { setPosting(false) }
  }

  async function setStatus(status: string): Promise<void> {
    if (!report) return
    setReport({ ...report, status })
    await lostFoundApi.update(id, { status }).catch(() => {})
  }

  async function remove(): Promise<void> {
    await lostFoundApi.remove(id).catch(() => {})
    router.push('/lost-found')
  }

  if (notFound) {
    return (<><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center"><MapPin className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Report not found</p>
      <Link href="/lost-found" className="text-primary hover:underline text-label-sm">Back to Lost &amp; Found</Link></div></main></>)
  }
  if (!report) return <div className="min-h-screen bg-background" />

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-2 md:px-5 py-4 pb-24 space-y-4">
          <Link href="/lost-found" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary"><ChevronLeft className="w-4 h-4" />Lost &amp; Found</Link>

          {report.photoUrl && (
            <div className="rounded-2xl overflow-hidden bg-surface-container aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${report.kind === 'lost' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{report.kind}</span>
                  {report.status === 'reunited' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">Reunited 🎉</span>}
                </div>
                <h1 className="font-headline text-headline-lg text-on-surface mt-1">{report.petName ?? report.species}</h1>
                <p className="text-label-md text-on-surface-variant">{report.species}{report.breed ? ` · ${report.breed}` : ''}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-label-sm text-on-surface-variant">
              {report.lastSeenLocation && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{report.lastSeenLocation}</span>}
              {report.lastSeenAt && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" />{fmtDate(report.lastSeenAt)}</span>}
              {report.contact && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" />{report.contact}</span>}
              {report.reward != null && report.reward > 0 && <span className="flex items-center gap-1 text-secondary font-medium"><Gift className="w-3.5 h-3.5" />Reward ₹{report.reward}</span>}
            </div>

            {report.description && <p className="text-label-md text-on-surface-variant mt-4 whitespace-pre-line leading-relaxed">{report.description}</p>}

            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-outline-variant/20">
              <Link href={`/profile/${report.reporter.username}`}><UserAvatar name={report.reporter.displayName} image={report.reporter.avatarUrl ?? undefined} size="sm" verified={report.reporter.isVerified} /></Link>
              <div>
                <Link href={`/profile/${report.reporter.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{report.reporter.displayName}</Link>
                <p className="text-[11px] text-outline">Reported {fmtDate(report.createdAt)}</p>
              </div>
            </div>

            {isOwner && report.status !== 'reunited' && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setStatus('reunited')} className="px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer">Mark reunited</button>
                <button onClick={remove} className="px-4 py-2 rounded-xl border border-red-300 text-red-500 text-label-sm hover:bg-red-50 cursor-pointer flex items-center gap-1.5"><Trash2 className="w-4 h-4" />Delete</button>
              </div>
            )}
          </div>

          {/* Sightings */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
            <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-3"><Eye className="w-4 h-4 text-primary" />Sightings ({report.sightingsCount})</h2>

            {!isOwner && (
              <div className="mb-4 space-y-2 pb-4 border-b border-outline-variant/10">
                <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} placeholder="Where did you see this pet?"
                  className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={2} placeholder="Add a note (condition, direction, time)…"
                  className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none resize-none" />
                <button onClick={submitSighting} disabled={posting || (!message.trim() && !location.trim())}
                  className="w-full py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
                  {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Report a sighting
                </button>
              </div>
            )}

            {sightings.length === 0 ? (
              <p className="text-label-sm text-outline">No sightings reported yet.</p>
            ) : (
              <div className="space-y-3">
                {sightings.map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <Link href={`/profile/${s.reporter.username}`}><UserAvatar name={s.reporter.displayName} image={s.reporter.avatarUrl ?? undefined} size="sm" verified={s.reporter.isVerified} /></Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${s.reporter.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{s.reporter.displayName}</Link>
                      {s.location && <p className="flex items-center gap-1 text-[12px] text-primary mt-0.5"><MapPin className="w-3 h-3" />{s.location}</p>}
                      {s.message && <p className="text-label-sm text-on-surface-variant mt-0.5">{s.message}</p>}
                      <p className="text-[11px] text-outline mt-0.5">{fmtDate(s.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
    </>
  )
}
