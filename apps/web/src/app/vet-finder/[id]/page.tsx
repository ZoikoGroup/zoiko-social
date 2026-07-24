'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Stethoscope, Star, Phone, Globe, BadgeCheck, Siren, Clock, ArrowLeft,
  Video, Home, Building2, ShieldCheck, Users, CalendarPlus, Languages as LangIcon,
} from 'lucide-react'
import { providersApi, type Provider, type TeamMember } from '@/lib/api'
import { petCareApi, type PetCareService, type ProviderReview } from '@/lib/pet-care-api'
import { CONSULT_MODE_LABELS, VET_SERVICE_CATEGORY_LABELS, DAY_LABELS, formatTime, todayHoursLabel } from '@/lib/vet'
import { AppointmentModal } from '@/components/vet/AppointmentModal'
import { LocationLink } from '@/components/LocationLink'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { useAuth } from '@/hooks/use-auth'

const MODE_ICON: Record<string, typeof Video> = { in_clinic: Building2, home_visit: Home, video: Video }

export default function VetClinicDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { profile } = useAuth()
  const [clinic, setClinic] = useState<Provider | null>(null)
  const [services, setServices] = useState<PetCareService[]>([])
  const [reviews, setReviews] = useState<ProviderReview[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    providersApi.get(id)
      .then((c) => { if (!cancelled) setClinic(c) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    petCareApi.listServices(id).then((s) => { if (!cancelled) setServices(s) }).catch(() => {})
    petCareApi.listReviews(id).then((r) => { if (!cancelled) setReviews(r) }).catch(() => {})
    providersApi.team(id).then((t) => { if (!cancelled) setTeam(t) }).catch(() => {})
    return () => { cancelled = true }
  }, [id])

  if (loading) return (
    <><Header /><main className="pt-20 min-h-screen bg-background"><div className="max-w-2xl mx-auto p-4 space-y-3"><div className="h-48 bg-surface-container-lowest rounded-xl animate-pulse" /><div className="h-32 bg-surface-container-lowest rounded-xl animate-pulse" /></div></main></>
  )
  if (!clinic) return (
    <><Header /><main className="pt-20 min-h-screen bg-background"><div className="max-w-2xl mx-auto p-12 text-center"><p className="text-label-lg font-semibold text-on-surface">Clinic not found</p><Link href="/vet-finder" className="text-primary text-label-md hover:underline mt-2 inline-block">Back to Vet Finder</Link></div></main></>
  )

  const isOwner = profile?.id === clinic.addedBy.id
  const verified = clinic.isVerified || clinic.addedBy.isVerified
  const openLabel = todayHoursLabel(clinic.hours, clinic.is24x7)

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-2 md:px-4 py-4 space-y-4">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-label-sm text-outline hover:text-on-surface cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>

          {/* Hero */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
            <div className="h-36 bg-primary/10 relative">
              {clinic.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={clinic.coverUrl} alt="" className="w-full h-full object-cover" />
              )}
              {clinic.emergencyAvailable && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-600 text-white"><Siren className="w-3 h-3" />Emergency</span>}
            </div>
            <div className="p-4 -mt-10">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-lowest border-4 border-surface-container-lowest overflow-hidden flex items-center justify-center shadow">
                {clinic.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={clinic.logoUrl} alt="" className="w-full h-full object-cover" />
                ) : <Stethoscope className="w-9 h-9 text-primary" />}
              </div>
              <div className="flex items-start justify-between gap-2 mt-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-headline text-headline-md text-on-surface">{clinic.name}</h1>
                    {verified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
                  </div>
                  {clinic.serviceType && <p className="text-label-sm text-on-surface-variant">{clinic.serviceType}</p>}
                  <div className="flex items-center gap-3 mt-1 text-[12px]">
                    {clinic.reviewCount > 0 && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /><span className="font-semibold text-on-surface">{clinic.rating.toFixed(1)}</span><span className="text-outline">({clinic.reviewCount})</span></span>}
                    <span className={`flex items-center gap-1 font-semibold ${clinic.is24x7 || clinic.openNow ? 'text-green-600' : 'text-outline'}`}><Clock className="w-3.5 h-3.5" />{openLabel}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {isOwner ? (
                  <Link href="/vet-finder/dashboard" className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90">Manage in dashboard</Link>
                ) : (
                  <button onClick={() => setBooking(true)} className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer"><CalendarPlus className="w-4 h-4" />Book appointment</button>
                )}
                {clinic.phone && <a href={`tel:${clinic.phone}`} className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-label-md font-semibold ${clinic.emergencyAvailable ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}><Phone className="w-4 h-4" />Call</a>}
                {clinic.website && <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-label-md font-semibold hover:bg-surface-container-high"><Globe className="w-4 h-4" />Website</a>}
              </div>
            </div>
          </div>

          {/* About */}
          {clinic.description && (
            <Section title="About">
              <p className="text-label-md text-on-surface-variant whitespace-pre-wrap">{clinic.description}</p>
            </Section>
          )}

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-2">
            {clinic.consultModes.length > 0 && (
              <Fact title="Consultation">
                <div className="flex flex-wrap gap-1.5">
                  {clinic.consultModes.map((m) => { const I = MODE_ICON[m] ?? Building2; return <span key={m} className="flex items-center gap-1 text-[12px] text-on-surface"><I className="w-3.5 h-3.5 text-primary" />{CONSULT_MODE_LABELS[m] ?? m}</span> })}
                </div>
              </Fact>
            )}
            {clinic.acceptsWalkins && <Fact title="Walk-ins"><span className="text-[12px] text-on-surface">Accepted</span></Fact>}
            {clinic.languages.length > 0 && <Fact title="Languages"><span className="flex items-center gap-1 text-[12px] text-on-surface"><LangIcon className="w-3.5 h-3.5 text-primary" />{clinic.languages.join(', ')}</span></Fact>}
            {clinic.licenseNo && <Fact title="Registration"><span className="flex items-center gap-1 text-[12px] text-on-surface"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{clinic.licenseNo}</span></Fact>}
          </div>

          {/* Specialties / species / facilities */}
          {clinic.specialties.length > 0 && <ChipSection title="Specialties" items={clinic.specialties} />}
          {clinic.species.length > 0 && <ChipSection title="Species treated" items={clinic.species} />}
          {clinic.facilities.length > 0 && <ChipSection title="Facilities" items={clinic.facilities} />}

          {/* Services */}
          {services.length > 0 && (
            <Section title="Services & fees">
              <div className="space-y-2">
                {services.filter((s) => s.isActive).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant/15 last:border-0">
                    <div className="min-w-0">
                      <p className="text-label-md font-semibold text-on-surface">{s.name}</p>
                      <p className="text-[11px] text-outline">{VET_SERVICE_CATEGORY_LABELS[s.category] ?? s.category}{s.durationMinutes ? ` · ${s.durationMinutes} min` : ''}</p>
                    </div>
                    <span className="text-label-md font-bold text-on-surface flex-shrink-0">{s.priceDisplay}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Team */}
          {team.length > 0 && (
            <Section title={<span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" />Our vets</span>}>
              <div className="space-y-2.5">
                {team.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {t.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : <span className="text-label-sm font-bold text-primary">{t.name.slice(0, 1)}</span>}
                    </div>
                    <div>
                      <p className="text-label-md font-semibold text-on-surface">{t.name}</p>
                      {t.role && <p className="text-[11px] text-outline">{t.role}{t.licenseNo ? ` · ${t.licenseNo}` : ''}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Hours */}
          {!clinic.is24x7 && clinic.hours && clinic.hours.length > 0 && (
            <Section title="Opening hours">
              <div className="space-y-1">
                {clinic.hours.map((h) => (
                  <div key={h.day} className={`flex items-center justify-between text-[13px] ${h.day === new Date().getDay() ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                    <span>{DAY_LABELS[h.day]}</span>
                    <span>{h.closed || !h.open ? 'Closed' : `${formatTime(h.open)} – ${formatTime(h.close)}`}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Location + map */}
          {(clinic.address || clinic.location) && (
            <Section title="Location">
              {clinic.address && <p className="text-label-md text-on-surface-variant mb-2">{clinic.address}</p>}
              {clinic.location && <LocationLink location={clinic.location} iconClassName="w-4 h-4" />}
              {clinic.latitude != null && clinic.longitude != null && (
                <iframe
                  title="map"
                  className="w-full h-52 rounded-xl mt-3 border border-outline-variant/20"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${clinic.longitude - 0.01}%2C${clinic.latitude - 0.01}%2C${clinic.longitude + 0.01}%2C${clinic.latitude + 0.01}&layer=mapnik&marker=${clinic.latitude}%2C${clinic.longitude}`}
                />
              )}
            </Section>
          )}

          {/* Reviews */}
          <Section title={`Reviews${reviews.length ? ` (${reviews.length})` : ''}`}>
            {reviews.length === 0 ? (
              <p className="text-label-sm text-outline">No reviews yet. After a completed appointment, clients can leave a review.</p>
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
          </Section>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {booking && <AppointmentModal provider={clinic} services={services} onClose={() => setBooking(false)} onBooked={() => {}} />}
    </>
  )
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
      <h2 className="font-headline text-label-lg font-bold text-on-surface mb-2">{title}</h2>
      {children}
    </div>
  )
}
function Fact({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
      <p className="text-[11px] font-semibold text-outline uppercase tracking-wide mb-1">{title}</p>
      {children}
    </div>
  )
}
function ChipSection({ title, items }: { title: string; items: string[] }): React.JSX.Element {
  return (
    <Section title={title}>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => <span key={s} className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{s}</span>)}
      </div>
    </Section>
  )
}
