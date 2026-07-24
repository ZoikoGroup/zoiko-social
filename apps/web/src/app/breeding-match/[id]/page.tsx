'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { LocationLink } from '@/components/LocationLink'
import { UserAvatar } from '@/components/UserAvatar'
import {
  ChevronLeft, ShieldCheck, BadgeCheck, Dna, Trash2, Loader2, Check, X,
  Venus, Mars, HeartHandshake, PawPrint, Syringe, Award, PlaneTakeoff, MessageCircle, Stethoscope, Navigation,
  Star, FileText, CalendarClock,
} from 'lucide-react'
import { breedingApi, providersApi, type BreedingProfile, type BreedingRequest, type BreedingReview, type Provider } from '@/lib/api'
import { BreedingChat } from '@/components/breeding/BreedingChat'
import { Img } from '@/components/Img'
import { useAuth } from '@/hooks/use-auth'

const HEAT_LABELS: Record<string, string> = { in_season: 'In season now', due_soon: 'Heat due soon', resting: 'Resting' }
const DNA_TONE: Record<string, string> = { clear: 'bg-emerald-500/10 text-emerald-600', carrier: 'bg-amber-500/10 text-amber-600', affected: 'bg-red-500/10 text-red-600' }

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  return sym ? `${sym}${amount.toLocaleString()}` : `${amount.toLocaleString()} ${currency}`
}

export default function BreedingDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<BreedingProfile | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [requests, setRequests] = useState<BreedingRequest[]>([])
  const [requestOpen, setRequestOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [reqState, setReqState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [myRequestId, setMyRequestId] = useState<string | null>(null)
  // Open chat: { requestId, title }
  const [chat, setChat] = useState<{ requestId: string; title: string } | null>(null)
  const [reviews, setReviews] = useState<BreedingReview[]>([])
  const [myVetClinics, setMyVetClinics] = useState<Provider[]>([])
  const [reviewOpen, setReviewOpen] = useState<string | null>(null) // requestId being reviewed
  const [litterFor, setLitterFor] = useState<string | null>(null)   // requestId to record a litter for

  const isOwner = !!user && !!profile && user.id === profile.owner.id

  useEffect(() => {
    let cancelled = false
    breedingApi.get(id)
      .then((p) => { if (cancelled) return; setProfile(p); if (p.viewerRequested) { setReqState('sent'); setMyRequestId(p.viewerRequestId) } })
      .catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  const loadRequests = useCallback(() => { breedingApi.requests(id).then(setRequests).catch(() => {}) }, [id])
  useEffect(() => {
    if (!isOwner) return
    const t = setTimeout(loadRequests, 0)
    return () => clearTimeout(t)
  }, [isOwner, loadRequests])

  useEffect(() => { breedingApi.reviews(id).then(setReviews).catch(() => {}) }, [id])
  useEffect(() => {
    if (!user) return
    providersApi.mine().then((list) => setMyVetClinics(list.filter((p) => p.category === 'vet'))).catch(() => {})
  }, [user])

  async function verifyProfile(): Promise<void> {
    const clinic = myVetClinics[0]
    if (!clinic) return
    try { const updated = await breedingApi.verify(id, clinic.id); setProfile(updated) } catch { /* ignore */ }
  }

  async function sendRequest(): Promise<void> {
    if (reqState === 'sending') return
    setReqState('sending')
    try {
      const res = await breedingApi.request(id, message.trim() ? { message: message.trim() } : {})
      setReqState('sent'); setMyRequestId(res.id); setRequestOpen(false)
    } catch { setReqState('idle') }
  }
  async function respond(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
    setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status } : r))
    await breedingApi.respond(id, requestId, status).catch(() => {})
  }
  async function remove(): Promise<void> {
    if (!window.confirm('Delete this breeding profile?')) return
    await breedingApi.remove(id).catch(() => {})
    router.push('/breeding-match')
  }

  if (notFound) {
    return (<><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center"><PawPrint className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Profile not found</p>
      <Link href="/breeding-match" className="text-primary hover:underline text-label-sm">Back to Breeding Match</Link></div></main></>)
  }
  if (!profile) return (
    <><Header /><main className="pt-20 min-h-screen bg-background"><div className="max-w-4xl mx-auto px-2 md:px-5 py-4"><div className="h-4 w-28 bg-surface-container rounded animate-pulse mb-4" /><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="aspect-square rounded-2xl bg-surface-container animate-pulse" /><div className="space-y-4"><div className="h-7 w-2/3 bg-surface-container rounded animate-pulse" /><div className="h-4 w-1/2 bg-surface-container rounded animate-pulse" /><div className="h-11 w-full bg-surface-container rounded-xl animate-pulse" /></div></div></div></main></>
  )

  const gallery = [profile.coverUrl, ...profile.photos].filter(Boolean) as string[]
  const female = profile.sex === 'female'

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-2 md:px-5 py-4 pb-24">
          <Link href="/breeding-match" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary mb-4"><ChevronLeft className="w-4 h-4" />Breeding Match</Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
              {gallery[0] ? <Img src={gallery[0]} alt="" priority className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Dna className="w-12 h-12 text-primary/40" /></div>}
              {profile.owner.isVerified && <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-primary text-[11px] font-bold"><BadgeCheck className="w-3.5 h-3.5" />Verified</span>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${female ? 'bg-pink-500/10 text-pink-600' : 'bg-blue-500/10 text-blue-600'}`}>
                  {female ? <Venus className="w-3 h-3" /> : <Mars className="w-3 h-3" />}{female ? 'Female' : 'Male'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">{profile.species}</span>
                {profile.status !== 'available' && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-semibold text-red-600 capitalize">{profile.status}</span>}
              </div>

              <h1 className="font-headline text-headline-lg font-bold text-on-surface leading-tight">{profile.petName}</h1>
              <p className="text-label-md text-on-surface-variant mt-0.5 capitalize">{profile.breed}{profile.age ? ` · ${profile.age}` : ''}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-label-sm text-outline">
                {profile.location && <LocationLink location={profile.location} iconClassName="w-4 h-4" />}
                {profile.distanceKm != null && <span className="flex items-center gap-0.5"><Navigation className="w-3.5 h-3.5" />{profile.distanceKm} km</span>}
              </div>
              {profile.fee != null && profile.fee > 0 && <p className="text-headline-md font-bold text-secondary mt-2">{money(profile.fee, profile.currency)}</p>}

              {/* Trust badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.verifiedBy && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold"><ShieldCheck className="w-3 h-3" />Vet-verified by {profile.verifiedBy.name}</span>}
                {profile.reviewCount > 0 && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[11px] font-semibold"><Star className="w-3 h-3 fill-amber-500 text-amber-500" />{profile.rating.toFixed(1)} ({profile.reviewCount})</span>}
                {profile.availableNow && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-600 text-[11px] font-semibold"><Check className="w-3 h-3" />Available now</span>}
                {profile.heatStatus && HEAT_LABELS[profile.heatStatus] && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/10 text-pink-600 text-[11px] font-semibold"><CalendarClock className="w-3 h-3" />{HEAT_LABELS[profile.heatStatus]}{profile.nextHeatAt ? ` · ${profile.nextHeatAt}` : ''}</span>}
                {profile.vaccinated && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold"><Syringe className="w-3 h-3" />Vaccinated (Health Passport)</span>}
                {profile.registered && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[11px] font-semibold"><Award className="w-3 h-3" />Registered / pedigree</span>}
                {profile.willingToTravel && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-semibold"><PlaneTakeoff className="w-3 h-3" />Willing to travel</span>}
              </div>
              {!isOwner && !profile.verifiedBy && myVetClinics.length > 0 && (
                <button onClick={verifyProfile} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-[12px] font-semibold hover:bg-primary/10 cursor-pointer"><ShieldCheck className="w-3.5 h-3.5" />Verify from {myVetClinics[0]!.name}</button>
              )}

              <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-outline-variant/20">
                <Link href={`/profile/${profile.owner.username}`}><UserAvatar name={profile.owner.displayName} image={profile.owner.avatarUrl ?? undefined} size="sm" verified={profile.owner.isVerified} /></Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${profile.owner.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{profile.owner.displayName}</Link>
                  <p className="text-[11px] text-outline">Owner</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                {isOwner ? (
                  <button onClick={remove} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 text-red-500 text-label-sm font-semibold hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" />Delete profile</button>
                ) : reqState === 'sent' ? (
                  <button onClick={() => myRequestId && setChat({ requestId: myRequestId, title: `Chat about ${profile.petName}` })} disabled={!myRequestId} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer"><MessageCircle className="w-4 h-4" />Open chat</button>
                ) : (
                  <button onClick={() => setRequestOpen(true)} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer"><HeartHandshake className="w-4 h-4" />Request match</button>
                )}
                {!isOwner && reqState === 'sent' && <p className="flex items-center gap-1 text-[11px] text-emerald-600"><Check className="w-3 h-3" />Request sent — chat privately; details are never auto-shared.</p>}
                <Link href="/vet-finder" className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container-high"><Stethoscope className="w-4 h-4" />Book a pre-mating vet check</Link>
              </div>
            </div>
          </div>

          {/* About + temperament + health + certifications */}
          {(profile.about || profile.temperament.length > 0 || profile.healthTests.length > 0 || profile.certifications.length > 0) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.about && (
                <div className="md:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="text-label-md font-bold text-on-surface mb-1.5">About</h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{profile.about}</p>
                </div>
              )}
              {profile.temperament.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="text-label-md font-bold text-on-surface mb-2">Temperament</h2>
                  <div className="flex flex-wrap gap-1.5">{profile.temperament.map((t) => <span key={t} className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-medium">{t}</span>)}</div>
                </div>
              )}
              {profile.healthTests.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><ShieldCheck className="w-4 h-4 text-emerald-600" />Health tests</h2>
                  <div className="flex flex-wrap gap-1.5">{profile.healthTests.map((t) => <span key={t} className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[11px] font-medium">{t}</span>)}</div>
                </div>
              )}
              {profile.certifications.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><Dna className="w-4 h-4 text-primary" />Certifications</h2>
                  <div className="flex flex-wrap gap-1.5">{profile.certifications.map((c) => <span key={c} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium">{c}</span>)}</div>
                </div>
              )}
              {profile.dnaResults.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><Dna className="w-4 h-4 text-primary" />Genetic (DNA) results</h2>
                  <div className="space-y-1">
                    {profile.dnaResults.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-on-surface-variant">{d.condition}</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${DNA_TONE[d.status] ?? ''}`}>{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profile.documents.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><FileText className="w-4 h-4 text-primary" />Documents</h2>
                  <div className="flex flex-wrap gap-2">{profile.documents.map((u, i) => <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[11px] text-primary hover:underline"><FileText className="w-3.5 h-3.5" />Document {i + 1}</a>)}</div>
                </div>
              )}
            </div>
          )}

          {/* Extra photos */}
          {profile.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {profile.photos.map((u, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-surface-container"><Img src={u} alt="" className="w-full h-full object-cover" /></div>
              ))}
            </div>
          )}

          {/* Reviews / reputation */}
          <div className="mt-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface"><Star className="w-4 h-4 text-amber-500" />Reviews {profile.reviewCount > 0 && <span className="text-outline font-normal">· {profile.rating.toFixed(1)} ({profile.reviewCount})</span>}</h2>
              {!isOwner && myRequestId && <button onClick={() => setReviewOpen(myRequestId)} className="text-[12px] font-semibold text-primary hover:underline cursor-pointer">Leave a review</button>}
            </div>
            {reviews.length === 0 ? (
              <p className="text-label-sm text-outline">No reviews yet. After an accepted match, both owners can review each other.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-outline-variant/15 pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-label-sm font-semibold text-on-surface">{r.author.displayName}</span>
                      <span className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-outline/30'}`} />)}</span>
                    </div>
                    {r.body && <p className="text-label-sm text-on-surface-variant mt-1">{r.body}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Owner: incoming requests + chat per requester */}
          {isOwner && (
            <div className="mt-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
              <h2 className="text-label-md font-bold text-on-surface mb-3">Match requests ({requests.length})</h2>
              {requests.length === 0 ? (
                <p className="text-label-sm text-outline">No requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="flex items-start gap-3">
                      <Link href={`/profile/${r.requester.username}`}><UserAvatar name={r.requester.displayName} image={r.requester.avatarUrl ?? undefined} size="sm" verified={r.requester.isVerified} /></Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${r.requester.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{r.requester.displayName}</Link>
                        {r.message && <p className="text-label-sm text-on-surface-variant mt-0.5">{r.message}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setChat({ requestId: r.id, title: `Chat with ${r.requester.displayName}` })} className="p-2 rounded-lg text-primary hover:bg-primary/10 cursor-pointer" title="Chat"><MessageCircle className="w-4 h-4" /></button>
                        {r.status === 'pending' ? (
                          <>
                            <button onClick={() => respond(r.id, 'accepted')} className="px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 cursor-pointer">Accept</button>
                            <button onClick={() => respond(r.id, 'declined')} className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface-variant text-[12px] font-semibold hover:bg-surface-container cursor-pointer">Decline</button>
                          </>
                        ) : (
                          <>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${r.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-container text-outline'}`}>{r.status}</span>
                            {r.status === 'accepted' && <button onClick={() => setLitterFor(r.id)} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 cursor-pointer">Record litter</button>}
                            {r.status === 'accepted' && <button onClick={() => setReviewOpen(r.id)} className="px-2.5 py-1 rounded-lg border border-outline-variant/50 text-on-surface-variant text-[11px] font-semibold hover:bg-surface-container cursor-pointer">Review</button>}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <MobileTabs currentPage="breeding-match" />

      {requestOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setRequestOpen(false)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-label-md font-bold text-on-surface">Request a match</h2>
              <button onClick={() => setRequestOpen(false)} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-label-sm text-outline mb-3">Introduce yourself and your pet to {profile.owner.displayName}. You&apos;ll chat privately — no personal details are shared automatically.</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Tell them about your pet, health tests, and intentions…"
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
            <button onClick={sendRequest} disabled={reqState === 'sending'} className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              {reqState === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}Send request
            </button>
          </div>
        </div>
      )}

      {chat && <BreedingChat requestId={chat.requestId} title={chat.title} onClose={() => setChat(null)} />}
      {reviewOpen && <ReviewModal requestId={reviewOpen} onClose={() => setReviewOpen(null)} onSaved={(rv) => { setReviewOpen(null); setReviews((prev) => [rv, ...prev]); breedingApi.get(id).then(setProfile).catch(() => {}) }} />}
      {litterFor && <LitterModal requestId={litterFor} onClose={() => setLitterFor(null)} onSaved={() => setLitterFor(null)} />}
    </>
  )
}

function LitterModal({ requestId, onClose, onSaved }: { requestId: string; onClose: () => void; onSaved: () => void }): React.JSX.Element {
  const [matedAt, setMatedAt] = useState('')
  const [expectedAt, setExpectedAt] = useState('')
  const [bornAt, setBornAt] = useState('')
  const [count, setCount] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const input = 'w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'
  const label = 'text-[12px] font-semibold text-outline'
  async function save(): Promise<void> {
    if (saving) return
    setSaving(true); setError('')
    try {
      await breedingApi.createLitter({
        requestId,
        ...(matedAt ? { matedAt } : {}),
        ...(expectedAt ? { expectedAt } : {}),
        ...(bornAt ? { bornAt } : {}),
        ...(count ? { count: Number(count) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
      setDone(true); onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to record litter') } finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-label-md font-bold text-on-surface">Record litter</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        {done ? (
          <div className="py-4 text-center space-y-2">
            <p className="text-label-md font-semibold text-on-surface">Litter recorded</p>
            <p className="text-label-sm text-outline">Manage it and list the offspring for adoption from the <span className="font-semibold">Litters</span> tab.</p>
            <button onClick={onClose} className="mt-1 px-5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer">Done</button>
          </div>
        ) : (
          <>
            <p className="text-label-sm text-outline mb-3">Track this mating from breeding to birth. You can list the puppies/kittens for adoption later.</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Mated on</label><input type="date" value={matedAt} onChange={(e) => setMatedAt(e.target.value)} className={input} /></div>
              <div><label className={label}>Expected birth</label><input type="date" value={expectedAt} onChange={(e) => setExpectedAt(e.target.value)} className={input} /></div>
              <div><label className={label}>Born on</label><input type="date" value={bornAt} onChange={(e) => setBornAt(e.target.value)} className={input} /></div>
              <div><label className={label}>Count</label><input type="number" min="0" value={count} onChange={(e) => setCount(e.target.value)} placeholder="e.g. 5" className={input} /></div>
            </div>
            <div className="mt-3"><label className={label}>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={2} className={`${input} resize-none`} /></div>
            {error && <p className="text-label-sm text-red-500 mt-2">{error}</p>}
            <button onClick={save} disabled={saving} className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save litter
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ReviewModal({ requestId, onClose, onSaved }: { requestId: string; onClose: () => void; onSaved: (r: BreedingReview) => void }): React.JSX.Element {
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  async function save(): Promise<void> {
    if (saving) return
    setSaving(true); setError('')
    try { const r = await breedingApi.createReview(requestId, rating, body.trim() || undefined); onSaved(r) }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed to submit review') } finally { setSaving(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-label-md font-bold text-on-surface">Leave a review</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)} className="cursor-pointer"><Star className={`w-7 h-7 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-outline/30'}`} /></button>
          ))}
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={4} placeholder="How was the experience? (optional)" className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
        {error && <p className="text-label-sm text-red-500 mt-2">{error}</p>}
        <button onClick={save} disabled={saving} className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}Submit review
        </button>
      </div>
    </div>
  )
}
