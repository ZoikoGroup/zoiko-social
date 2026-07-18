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
  Venus, Mars, HeartHandshake, PawPrint,
} from 'lucide-react'
import { breedingApi, type BreedingProfile, type BreedingRequest } from '@/lib/api'
import { Img } from '@/components/Img'
import { useAuth } from '@/hooks/use-auth'

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

  const isOwner = !!user && !!profile && user.id === profile.owner.id

  useEffect(() => {
    let cancelled = false
    breedingApi.get(id)
      .then((p) => { if (cancelled) return; setProfile(p); if (p.viewerRequested) setReqState('sent') })
      .catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  const loadRequests = useCallback(() => { breedingApi.requests(id).then(setRequests).catch(() => {}) }, [id])
  useEffect(() => {
    if (!isOwner) return
    const t = setTimeout(loadRequests, 0)
    return () => clearTimeout(t)
  }, [isOwner, loadRequests])

  async function sendRequest(): Promise<void> {
    if (reqState === 'sending') return
    setReqState('sending')
    try { await breedingApi.request(id, message.trim() ? { message: message.trim() } : {}); setReqState('sent'); setRequestOpen(false) }
    catch { setReqState('idle') }
  }
  async function respond(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
    setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status } : r))
    await breedingApi.respond(id, requestId, status).catch(() => {})
  }
  async function remove(): Promise<void> {
    await breedingApi.remove(id).catch(() => {})
    router.push('/breeding-match')
  }

  if (notFound) {
    return (<><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center"><PawPrint className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Profile not found</p>
      <Link href="/breeding-match" className="text-primary hover:underline text-label-sm">Back to Breeder Match</Link></div></main></>)
  }
  if (!profile) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-2 md:px-5 py-4 pb-24">
          <div className="h-4 w-28 bg-surface-container rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="aspect-square rounded-2xl bg-surface-container animate-pulse" />
            <div className="space-y-4">
              <div className="flex gap-2"><div className="h-5 w-16 bg-surface-container rounded-full animate-pulse" /><div className="h-5 w-16 bg-surface-container rounded-full animate-pulse" /></div>
              <div className="h-7 w-2/3 bg-surface-container rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-surface-container rounded animate-pulse" />
              <div className="h-8 w-24 bg-surface-container rounded animate-pulse" />
              <div className="flex items-center gap-2.5 pt-4 border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse" />
                <div className="space-y-1.5"><div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" /><div className="h-3 w-16 bg-surface-container rounded animate-pulse" /></div>
              </div>
              <div className="h-11 w-full bg-surface-container rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </>
  )

  const gallery = [profile.coverUrl, ...profile.photos].filter(Boolean) as string[]
  const female = profile.sex === 'female'

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-2 md:px-5 py-4 pb-24">
          <Link href="/breeding-match" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary mb-4"><ChevronLeft className="w-4 h-4" />Breeder Match</Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
                {gallery[0] && (
                  <Img src={gallery[0]} alt="" priority className="w-full h-full object-cover" />
                )}
                {profile.owner.isVerified && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-primary text-[11px] font-bold"><BadgeCheck className="w-3.5 h-3.5" />Verified Breeder</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${female ? 'bg-pink-500/10 text-pink-600' : 'bg-blue-500/10 text-blue-600'}`}>
                  {female ? <Venus className="w-3 h-3" /> : <Mars className="w-3 h-3" />}{female ? 'Female' : 'Male'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">{profile.species}</span>
                {profile.status !== 'available' && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-semibold text-red-600 capitalize">{profile.status}</span>}
              </div>

              <h1 className="font-headline text-headline-lg font-bold text-on-surface leading-tight">{profile.petName}</h1>
              <p className="text-label-md text-on-surface-variant mt-0.5">{profile.breed}{profile.age ? ` · ${profile.age}` : ''}</p>
              {profile.location && <LocationLink location={profile.location} iconClassName="w-4 h-4" className="text-label-sm text-outline mt-1" />}
              {profile.fee != null && <p className="text-headline-md font-bold text-secondary mt-2">{money(profile.fee, profile.currency)}</p>}

              <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-outline-variant/20">
                <Link href={`/profile/${profile.owner.username}`}><UserAvatar name={profile.owner.displayName} image={profile.owner.avatarUrl ?? undefined} size="sm" verified={profile.owner.isVerified} /></Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${profile.owner.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{profile.owner.displayName}</Link>
                  <p className="text-[11px] text-outline">Owner / Breeder</p>
                </div>
              </div>

              <div className="mt-4">
                {isOwner ? (
                  <button onClick={remove} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 text-red-500 text-label-sm font-semibold hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" />Delete profile</button>
                ) : (
                  <button onClick={() => setRequestOpen(true)} disabled={reqState === 'sent'} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer">
                    {reqState === 'sent' ? <><Check className="w-4 h-4" />Request sent</> : <><HeartHandshake className="w-4 h-4" />Request Match</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Health & certifications */}
          {(profile.healthTests.length > 0 || profile.certifications.length > 0 || profile.about) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.about && (
                <div className="md:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="text-label-md font-bold text-on-surface mb-1.5">About</h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{profile.about}</p>
                </div>
              )}
              {profile.healthTests.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><ShieldCheck className="w-4 h-4 text-emerald-600" />Health Tests</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.healthTests.map((t) => <span key={t} className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[11px] font-medium">{t}</span>)}
                  </div>
                </div>
              )}
              {profile.certifications.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
                  <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface mb-2"><Dna className="w-4 h-4 text-primary" />Certifications</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.certifications.map((c) => <span key={c} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium">{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Owner: incoming requests */}
          {isOwner && (
            <div className="mt-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
              <h2 className="text-label-md font-bold text-on-surface mb-3">Match Requests ({requests.length})</h2>
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
                      {r.status === 'pending' ? (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => respond(r.id, 'accepted')} className="px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 cursor-pointer">Accept</button>
                          <button onClick={() => respond(r.id, 'declined')} className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface-variant text-[12px] font-semibold hover:bg-surface-container cursor-pointer">Decline</button>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize flex-shrink-0 ${r.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-container text-outline'}`}>{r.status}</span>
                      )}
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
              <h2 className="text-label-md font-bold text-on-surface">Request a Match</h2>
              <button onClick={() => setRequestOpen(false)} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-label-sm text-outline mb-3">Introduce yourself and your pet to {profile.owner.displayName}.</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Tell them about your pet, health tests, and intentions…"
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
            <button onClick={sendRequest} disabled={reqState === 'sending'} className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              {reqState === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}Send Request
            </button>
          </div>
        </div>
      )}
    </>
  )
}
