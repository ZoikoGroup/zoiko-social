'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { LocationLink } from '@/components/LocationLink'
import { UserAvatar } from '@/components/UserAvatar'
import {
  ChevronLeft, PawPrint, Check, X, Loader2, Trash2, ShieldCheck, Heart, Syringe, Baby, Dog, Cat,
  MessageCircle, Tag, Gift, Navigation,
} from 'lucide-react'
import { adoptionApi, type AdoptionListing, type AdoptionEnquiryItem } from '@/lib/api'
import { AdoptionChat } from '@/components/adoption/AdoptionChat'
import { Img } from '@/components/Img'
import { useAuth } from '@/hooks/use-auth'

const GOOD_ICON: Record<string, typeof Baby> = { kids: Baby, dogs: Dog, cats: Cat }

export default function AdoptionDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [listing, setListing] = useState<AdoptionListing | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [enquiries, setEnquiries] = useState<AdoptionEnquiryItem[]>([])
  const [chat, setChat] = useState<{ id: string; title: string } | null>(null)
  const [starting, setStarting] = useState(false)

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

  async function startChat(): Promise<void> {
    if (!listing || starting) return
    setStarting(true)
    try {
      const r = await adoptionApi.enquire(id) // creates or resumes the private thread
      if (!listing.viewerEnquiryStatus) setListing({ ...listing, viewerEnquiryStatus: r.status, enquiriesCount: listing.enquiriesCount + 1 })
      setChat({ id: r.id, title: `Chat · ${listing.name}` })
    } catch { /* ignore */ } finally { setStarting(false) }
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
  if (!listing) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-2 md:px-5 py-4 pb-24 space-y-4">
          <div className="h-4 w-32 bg-surface-container rounded animate-pulse" />
          <div className="rounded-2xl bg-surface-container animate-pulse aspect-[16/10]" />
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 space-y-3">
            <div className="h-7 w-1/2 bg-surface-container rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-surface-container rounded animate-pulse" />
            <div className="flex gap-2"><div className="h-7 w-24 bg-surface-container rounded-lg animate-pulse" /><div className="h-7 w-24 bg-surface-container rounded-lg animate-pulse" /></div>
            <div className="space-y-2 pt-2">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-4 w-full bg-surface-container rounded animate-pulse" />)}</div>
            <div className="h-11 w-full bg-surface-container rounded-xl animate-pulse mt-2" />
          </div>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-2 md:px-5 py-4 pb-24 space-y-4">
          <Link href="/adoption" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary"><ChevronLeft className="w-4 h-4" />Adoption &amp; Rescue</Link>

          {/* Cover */}
          <div className="rounded-2xl overflow-hidden bg-surface-container aspect-[16/10]">
            {listing.coverUrl ? (
              <Img src={listing.coverUrl} alt={listing.name} priority className="w-full h-full object-cover" />
            ) : <div className="w-full h-full flex items-center justify-center"><PawPrint className="w-14 h-14 text-outline/40" /></div>}
          </div>

          {/* Header */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${listing.listingType === 'sale' ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
                    {listing.listingType === 'sale' ? <><Tag className="w-2.5 h-2.5" />For sale</> : <><Gift className="w-2.5 h-2.5" />For adoption</>}
                  </span>
                </div>
                <h1 className="font-headline text-headline-lg text-on-surface">{listing.name}</h1>
                <p className="text-label-md text-on-surface-variant mt-0.5">
                  {listing.species}{listing.breed ? ` · ${listing.breed}` : ''}{listing.age ? ` · ${listing.age}` : ''}{listing.sex !== 'unknown' ? ` · ${listing.sex}` : ''}{listing.size ? ` · ${listing.size}` : ''}
                </p>
                {listing.location && (
                  <span className="flex items-center gap-2 mt-1">
                    <LocationLink location={listing.location} iconClassName="w-3.5 h-3.5" className="text-label-sm text-outline" />
                    {listing.distanceKm != null && <span className="text-[11px] text-outline flex items-center gap-0.5"><Navigation className="w-3 h-3" />{listing.distanceKm} km</span>}
                  </span>
                )}
                <p className="text-headline-md font-bold text-on-surface mt-2">
                  {listing.listingType === 'sale'
                    ? (listing.price != null ? `₹${listing.price.toLocaleString()}` : 'Price on request')
                    : (listing.fee != null && listing.fee > 0 ? `Adoption fee ₹${listing.fee}` : 'Free to adopt')}
                  {listing.listingType === 'sale' && listing.negotiable && <span className="text-label-sm font-medium text-outline"> · Negotiable</span>}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex-shrink-0 ${listing.status === 'available' ? 'bg-emerald-500/10 text-emerald-600' : listing.status === 'adopted' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{listing.status}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {listing.vaccinated && <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[12px] font-medium"><Syringe className="w-3.5 h-3.5" />Vaccinated</span>}
              {listing.neutered && <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[12px] font-medium"><ShieldCheck className="w-3.5 h-3.5" />Neutered</span>}
              {listing.goodWith.map((g) => { const I = GOOD_ICON[g] ?? Heart; return <span key={g} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 text-[12px] font-medium capitalize"><I className="w-3.5 h-3.5" />Good with {g}</span> })}
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
                {listing.status === 'available' || listing.status === 'pending' ? (
                  <button onClick={startChat} disabled={starting} className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                    {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                    {listing.listingType === 'sale' ? 'Chat with seller' : 'Chat with owner'}
                  </button>
                ) : (
                  <div className="w-full text-center py-2.5 rounded-xl bg-surface-container text-outline text-label-md font-semibold">Not available</div>
                )}
                <p className="text-[11px] text-outline text-center mt-2">Your phone number and personal details are never shared. Chat safely in-app.</p>
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
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setChat({ id: e.id, title: e.applicant.displayName })} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" title="Chat"><MessageCircle className="w-4 h-4" /></button>
                        {e.status === 'pending' ? (
                          <>
                            <button onClick={() => respond(e.id, 'accepted')} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer" title="Accept"><Check className="w-4 h-4" /></button>
                            <button onClick={() => respond(e.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer" title="Reject"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <span className={`text-[11px] font-bold uppercase ${e.status === 'accepted' ? 'text-emerald-600' : 'text-outline'}`}>{e.status}</span>
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
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {chat && <AdoptionChat enquiryId={chat.id} title={chat.title} onClose={() => setChat(null)} />}
    </>
  )
}
