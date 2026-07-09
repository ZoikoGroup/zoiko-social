'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import {
  ChevronLeft, MapPin, PawPrint, Check, X, Loader2, Trash2, ShieldCheck, Heart, Syringe, Baby, Dog, Cat,
} from 'lucide-react'
import { adoptionApi, type AdoptionListing, type AdoptionEnquiryItem } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

const GOOD_ICON: Record<string, typeof Baby> = { kids: Baby, dogs: Dog, cats: Cat }

export default function AdoptionDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [listing, setListing] = useState<AdoptionListing | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [enquireOpen, setEnquireOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [enquiring, setEnquiring] = useState(false)
  const [enquiries, setEnquiries] = useState<AdoptionEnquiryItem[]>([])

  const isOwner = !!user && !!listing && user.id === listing.poster.id

  useEffect(() => {
    let cancelled = false
    adoptionApi.get(id)
      .then((l) => { if (!cancelled) setListing(l) })
      .catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  const loadEnquiries = useCallback(() => {
    adoptionApi.enquiries(id).then(setEnquiries).catch(() => {})
  }, [id])

  useEffect(() => {
    if (isOwner) loadEnquiries()
  }, [isOwner, loadEnquiries])

  async function submitEnquiry(): Promise<void> {
    if (!listing || enquiring) return
    setEnquiring(true)
    try {
      const r = await adoptionApi.enquire(id, message.trim() || undefined)
      setListing({ ...listing, viewerEnquiryStatus: r.status, enquiriesCount: listing.enquiriesCount + 1 })
      setEnquireOpen(false); setMessage('')
    } catch { /* ignore */ } finally { setEnquiring(false) }
  }

  async function respond(enquiryId: string, status: 'accepted' | 'rejected'): Promise<void> {
    setEnquiries((prev) => prev.map((e) => e.id === enquiryId ? { ...e, status } : e))
    await adoptionApi.respond(id, enquiryId, status).catch(() => {})
  }

  async function setStatus(status: string): Promise<void> {
    if (!listing) return
    setListing({ ...listing, status })
    await adoptionApi.update(id, { status }).catch(() => {})
  }

  async function remove(): Promise<void> {
    await adoptionApi.remove(id).catch(() => {})
    router.push('/adoption')
  }

  if (notFound) {
    return (
      <><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center"><PawPrint className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Listing not found</p>
        <Link href="/adoption" className="text-primary hover:underline text-label-sm">Back to Adoption</Link></div>
      </main></>
    )
  }
  if (!listing) return <div className="min-h-screen bg-background" />

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-2 md:px-5 py-4 pb-24 space-y-4">
          <Link href="/adoption" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary"><ChevronLeft className="w-4 h-4" />Adoption &amp; Rescue</Link>

          {/* Cover */}
          <div className="rounded-2xl overflow-hidden bg-surface-container aspect-[16/10]">
            {listing.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.coverUrl} alt={listing.name} className="w-full h-full object-cover" />
            ) : <div className="w-full h-full flex items-center justify-center"><PawPrint className="w-14 h-14 text-outline/40" /></div>}
          </div>

          {/* Header */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-headline text-headline-lg text-on-surface">{listing.name}</h1>
                <p className="text-label-md text-on-surface-variant mt-0.5">
                  {listing.species}{listing.breed ? ` · ${listing.breed}` : ''}{listing.age ? ` · ${listing.age}` : ''}{listing.sex !== 'unknown' ? ` · ${listing.sex}` : ''}{listing.size ? ` · ${listing.size}` : ''}
                </p>
                {listing.location && <p className="flex items-center gap-1 text-label-sm text-outline mt-1"><MapPin className="w-3.5 h-3.5" />{listing.location}</p>}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex-shrink-0 ${listing.status === 'available' ? 'bg-emerald-500/10 text-emerald-600' : listing.status === 'adopted' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{listing.status}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {listing.vaccinated && <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[12px] font-medium"><Syringe className="w-3.5 h-3.5" />Vaccinated</span>}
              {listing.neutered && <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[12px] font-medium"><ShieldCheck className="w-3.5 h-3.5" />Neutered</span>}
              {listing.goodWith.map((g) => { const I = GOOD_ICON[g] ?? Heart; return <span key={g} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 text-[12px] font-medium capitalize"><I className="w-3.5 h-3.5" />Good with {g}</span> })}
              {listing.fee != null && <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[12px] font-medium">{listing.fee === 0 ? 'Free to adopt' : `Fee ₹${listing.fee}`}</span>}
            </div>

            {listing.description && <p className="text-label-md text-on-surface-variant mt-4 whitespace-pre-line leading-relaxed">{listing.description}</p>}

            {/* Poster */}
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-outline-variant/20">
              <Link href={`/profile/${listing.poster.username}`}><UserAvatar name={listing.poster.displayName} image={listing.poster.avatarUrl ?? undefined} size="sm" verified={listing.poster.isVerified} /></Link>
              <div>
                <Link href={`/profile/${listing.poster.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{listing.poster.displayName}</Link>
                <p className="text-[11px] text-outline">Listed by · {listing.enquiriesCount} {listing.enquiriesCount === 1 ? 'enquiry' : 'enquiries'}</p>
              </div>
            </div>

            {/* Actions */}
            {!isOwner ? (
              <div className="mt-4">
                {listing.viewerEnquiryStatus ? (
                  <div className={`w-full text-center py-2.5 rounded-xl text-label-md font-semibold ${listing.viewerEnquiryStatus === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' : listing.viewerEnquiryStatus === 'rejected' ? 'bg-surface-container text-outline' : 'bg-primary/10 text-primary'}`}>
                    {listing.viewerEnquiryStatus === 'accepted' ? 'Enquiry accepted 🎉' : listing.viewerEnquiryStatus === 'rejected' ? 'Enquiry not accepted' : 'Enquiry sent — awaiting response'}
                  </div>
                ) : listing.status === 'available' ? (
                  <button onClick={() => setEnquireOpen(true)} className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer">Enquire to adopt</button>
                ) : (
                  <div className="w-full text-center py-2.5 rounded-xl bg-surface-container text-outline text-label-md font-semibold">Not available</div>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.status !== 'adopted' && <button onClick={() => setStatus('adopted')} className="px-4 py-2 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 cursor-pointer">Mark adopted</button>}
                {listing.status === 'available'
                  ? <button onClick={() => setStatus('pending')} className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm cursor-pointer">Mark pending</button>
                  : listing.status !== 'adopted' && <button onClick={() => setStatus('available')} className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-label-sm cursor-pointer">Mark available</button>}
                <button onClick={remove} className="px-4 py-2 rounded-xl border border-red-300 text-red-500 text-label-sm hover:bg-red-50 cursor-pointer flex items-center gap-1.5"><Trash2 className="w-4 h-4" />Delete</button>
              </div>
            )}
          </div>

          {/* Poster: enquiries */}
          {isOwner && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
              <h2 className="text-label-md font-bold text-on-surface mb-3">Enquiries ({enquiries.length})</h2>
              {enquiries.length === 0 ? (
                <p className="text-label-sm text-outline">No enquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((e) => (
                    <div key={e.id} className="flex items-start gap-3 pb-3 border-b border-outline-variant/10 last:border-0 last:pb-0">
                      <Link href={`/profile/${e.applicant.username}`}><UserAvatar name={e.applicant.displayName} image={e.applicant.avatarUrl ?? undefined} size="sm" verified={e.applicant.isVerified} /></Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${e.applicant.username}`} className="text-label-sm font-semibold text-on-surface hover:underline">{e.applicant.displayName}</Link>
                        {e.message && <p className="text-label-sm text-on-surface-variant mt-0.5">{e.message}</p>}
                      </div>
                      {e.status === 'pending' ? (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => respond(e.id, 'accepted')} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer" title="Accept"><Check className="w-4 h-4" /></button>
                          <button onClick={() => respond(e.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer" title="Reject"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <span className={`text-[11px] font-bold uppercase flex-shrink-0 ${e.status === 'accepted' ? 'text-emerald-600' : 'text-outline'}`}>{e.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {enquireOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEnquireOpen(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline text-headline-md text-on-surface">Enquire to adopt {listing.name}</h2>
              <button onClick={() => setEnquireOpen(false)} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Introduce yourself and why you'd be a great home…"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none" />
            <button onClick={submitEnquiry} disabled={enquiring} className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
              {enquiring && <Loader2 className="w-4 h-4 animate-spin" />}Send enquiry
            </button>
          </div>
        </div>
      )}
    </>
  )
}
