'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HeartHandshake, MapPin, Phone, Globe, ArrowLeft, Star, Clock,
  Calendar, Plus, X, Loader2, Check, AlertCircle,
  CreditCard, Building2, MessageSquare, Save, Edit3, Pencil,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useCachedValue } from '@/hooks/use-cache'
import { providersApi, type Provider } from '@/lib/api'
import {
  petCareApi, type PetCareService, type PetCareBooking, type ProviderReview,
  type AvailabilitySlot, type ServiceCategory, SERVICE_CATEGORY_LABELS, SERVICE_CATEGORY_ICONS,
  BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, PAYMENT_METHOD_LABELS, DAY_LABELS,
} from '@/lib/pet-care-api'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { LocationLink } from '@/components/LocationLink'
import { UserAvatar } from '@/components/UserAvatar'

export default function ProviderDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { profile, loading: authLoading, isAuthenticated } = useAuth()

  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services')
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<PetCareService | null>(null)
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [servicesKey, setServicesKey] = useState(0)
  const [reviewsKey] = useState(0)
  const [availabilityKey, setAvailabilityKey] = useState(0)
  const [profileKey, setProfileKey] = useState(0)

  const { data: provider, isLoading: providerLoading } = useCachedValue<Provider>(
    `provider:${id}:${profileKey}`, () => providersApi.get(id),
  )

  const { data: services } = useCachedValue<PetCareService[]>(
    `services:${id}:${servicesKey}`, () => petCareApi.listServices(id),
  )

  const { data: reviews } = useCachedValue<ProviderReview[]>(
    `reviews:${id}:${reviewsKey}`, () => petCareApi.listReviews(id),
  )

  const { data: availability } = useCachedValue<AvailabilitySlot[]>(
    `availability:${id}:${availabilityKey}`, () => petCareApi.listAvailability(id),
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  const isOwner = provider && profile && provider.addedBy.id === profile.id
  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const refreshServices = useCallback(() => setServicesKey((k) => k + 1), [])
  const refreshAvailability = useCallback(() => setAvailabilityKey((k) => k + 1), [])

  if (authLoading || providerLoading || !provider) return <LoadingSkeleton />

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
            <button
              onClick={() => router.push('/pet-care')}
              className="flex items-center gap-2 text-label-sm text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Pet Care
            </button>

            {/* Provider header */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-surface-container-lowest">
                {provider.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="px-5 pb-5 -mt-10 relative">
                <div className="flex items-end justify-between mb-4">
                  <div className="flex items-end gap-4">
                    {isOwner && (
                      <button
                        onClick={() => setEditProfileOpen(true)}
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-label-sm font-semibold text-on-surface hover:bg-white transition-all shadow-sm cursor-pointer z-10"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    )}
                    <div className="w-20 h-20 rounded-2xl bg-primary/15 border-4 border-surface-container-lowest overflow-hidden flex items-center justify-center shadow-lg">
                      {provider.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <HeartHandshake className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="pb-1">
                      <h1 className="font-headline text-headline-md text-on-surface">{provider.name}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        {provider.serviceType && (
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {provider.serviceType}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-label-sm font-semibold text-on-surface">{avgRating}</span>
                          <span className="text-label-sm text-outline">({reviews?.length ?? 0})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={() => { setSelectedService(null); setBookingOpen(true) }}
                      className="px-5 py-2.5 rounded-xl bg-primary text-white text-label-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.97] shadow-sm cursor-pointer flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Book Now
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-label-sm text-outline">
                  {provider.location && <LocationLink location={provider.location} iconClassName="w-3.5 h-3.5" />}
                  {provider.phone && (
                    <a href={`tel:${provider.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Phone className="w-3.5 h-3.5" /> {provider.phone}
                    </a>
                  )}
                  {provider.website && (
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                  )}
                  {provider.address && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {provider.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30">
              {(['services', 'reviews', 'about'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-label-sm font-semibold capitalize transition-colors cursor-pointer relative ${
                    activeTab === tab ? 'text-primary' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {tab === 'services' ? `Services (${services?.length ?? 0})` : tab === 'reviews' ? `Reviews (${reviews?.length ?? 0})` : 'About'}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            {activeTab === 'services' && (
              <ServicesTab
                services={services ?? []}
                isOwner={isOwner ?? false}
                onBook={(s) => { setSelectedService(s); setBookingOpen(true) }}
                onAdd={() => setAddServiceOpen(true)}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab reviews={reviews ?? []} isOwner={isOwner ?? false} />
            )}

            {activeTab === 'about' && (
              <AboutTab
                provider={provider}
                availability={availability ?? []}
                isOwner={isOwner ?? false}
                providerId={id}
                onRefresh={refreshAvailability}
              />
            )}
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {bookingOpen && (
        <BookingModal
          provider={provider}
          services={services ?? []}
          selectedService={selectedService}
          onClose={() => setBookingOpen(false)}
        />
      )}

      {addServiceOpen && (
        <AddServiceModal
          providerId={id}
          onClose={() => setAddServiceOpen(false)}
          onAdded={() => refreshServices()}
        />
      )}

      {editProfileOpen && provider && (
        <EditProfileModal
          provider={provider}
          onClose={() => setEditProfileOpen(false)}
          onSaved={() => { setProfileKey((k) => k + 1); setEditProfileOpen(false) }}
        />
      )}
    </>
  )
}

// ── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 hidden lg:block"><div className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" /></div>
          <div className="lg:col-span-6 space-y-3">
            <div className="h-8 w-32 bg-surface-container-lowest rounded animate-pulse" />
            <div className="h-52 bg-surface-container-lowest rounded-2xl animate-pulse" />
            <div className="h-12 bg-surface-container-lowest rounded-xl animate-pulse" />
            {[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl animate-pulse" />)}
          </div>
        </div>
      </main>
    </>
  )
}

// ── Services Tab ─────────────────────────────────────────────────────────────

function ServicesTab({ services, isOwner, onBook, onAdd }: {
  services: PetCareService[]
  isOwner: boolean
  onBook: (s: PetCareService) => void
  onAdd: () => void
}): React.JSX.Element {
  return (
    <div className="space-y-3">
      {isOwner && (
        <button onClick={onAdd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/40 text-label-sm font-semibold text-outline hover:text-primary hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
        ><Plus className="w-4 h-4" /> Add a Service</button>
      )}
      {services.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
          <HeartHandshake className="w-10 h-10 text-outline/40 mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">No services listed yet</p>
          <p className="text-label-sm text-outline mt-1">Check back later for available services.</p>
        </div>
      ) : (
        services.filter((s) => s.isActive || isOwner).map((service) => (
          <div key={service.id}
            className={`bg-surface-container-lowest rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${
              service.isActive ? 'border-outline-variant/30' : 'border-outline-variant/20 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                  {SERVICE_CATEGORY_ICONS[service.category as keyof typeof SERVICE_CATEGORY_ICONS] ?? '📋'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-label-md text-on-surface">{service.name}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {SERVICE_CATEGORY_LABELS[service.category as keyof typeof SERVICE_CATEGORY_LABELS] ?? service.category}
                    </span>
                    {!service.isActive && <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Inactive</span>}
                  </div>
                  {service.description && <p className="text-label-sm text-on-surface-variant mt-1 line-clamp-2">{service.description}</p>}
                  {service.durationMinutes && (
                    <div className="flex items-center gap-4 mt-2 text-label-sm text-outline">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.durationMinutes} min</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-primary">{service.priceDisplay}</div>
                {!isOwner && service.isActive && (
                  <button onClick={() => onBook(service)}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary/90 transition-all active:scale-[0.97] cursor-pointer"
                  >Book</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── Reviews Tab ──────────────────────────────────────────────────────────────

function ReviewsTab({ reviews, isOwner }: {
  reviews: ProviderReview[]
  isOwner: boolean
}): React.JSX.Element {
  return (
    <div className="space-y-3">
      {!isOwner && (
        <Link href="/pet-care/my-bookings"
          className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/40 text-label-sm font-semibold text-outline hover:text-primary hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
        ><Star className="w-4 h-4" /> Review a completed booking</Link>
      )}
      {reviews.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
          <MessageSquare className="w-10 h-10 text-outline/40 mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">No reviews yet</p>
          <p className="text-label-sm text-outline mt-1">Be the first to leave a review!</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <UserAvatar name={review.author.displayName} image={review.author.avatarUrl ?? undefined} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-label-sm text-on-surface">{review.author.displayName}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-outline/30'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-outline">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {review.body && <p className="text-label-sm text-on-surface-variant mt-2">{review.body}</p>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── About Tab (with availability management for owners) ──────────────────────

function AboutTab({ provider, availability, isOwner, providerId, onRefresh }: {
  provider: Provider
  availability: AvailabilitySlot[]
  isOwner: boolean
  providerId: string
  onRefresh: () => void
}): React.JSX.Element {
  const weeklySlots = availability.filter((a) => a.kind === 'weekly')
  const [showForm, setShowForm] = useState(false)
  const [newDay, setNewDay] = useState('0')
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('17:00')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function addSlot(): Promise<void> {
    if (saving) return
    setSaving(true)
    try {
      await petCareApi.createAvailability({
        providerId,
        dayOfWeek: parseInt(newDay, 10),
        startTime: newStart,
        endTime: newEnd,
      })
      setShowForm(false)
      onRefresh()
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  async function removeSlot(id: string): Promise<void> {
    setDeleting(id)
    try {
      await petCareApi.removeAvailability(id)
      onRefresh()
    } catch { /* ignore */ } finally { setDeleting(null) }
  }

  const input = 'w-full px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none'
  const select = `${input} appearance-none`

  return (
    <div className="space-y-4">
      {/* About description */}
      {provider.description && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
          <h3 className="font-bold text-label-md text-on-surface mb-2">About</h3>
          <p className="text-label-sm text-on-surface-variant whitespace-pre-wrap">{provider.description}</p>
        </div>
      )}

      {/* Business Hours — always shown for owners (even empty), shown for visitors only when slots exist */}
      {(isOwner || weeklySlots.length > 0) && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-label-md text-on-surface">Business Hours</h3>
            {isOwner && (
              <button
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showForm ? 'Cancel' : 'Add Hours'}
              </button>
            )}
          </div>

          {/* Inline add form */}
          {isOwner && showForm && (
            <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <p className="text-[11px] font-semibold text-primary">Add Weekly Hours</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-outline block mb-1">Day</label>
                  <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className={select}>
                    {DAY_LABELS.map((label, idx) => <option key={idx} value={idx}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-outline block mb-1">Start</label>
                  <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="text-[10px] text-outline block mb-1">End</label>
                  <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className={input} />
                </div>
              </div>
              <button
                onClick={() => void addSlot()}
                disabled={saving || !newStart || !newEnd}
                className="w-full py-2 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {saving ? 'Adding…' : 'Add Slot'}
              </button>
            </div>
          )}

          {/* Hours grid */}
          <div className="space-y-1">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const slots = weeklySlots.filter((a) => a.dayOfWeek === day)
              return (
                <div key={day} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-b-0">
                  <span className="text-label-sm font-medium text-on-surface w-20">{DAY_LABELS[day]}</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    {slots.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {slots.map((s) => (
                          <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-low text-[11px] text-on-surface-variant font-medium">
                            {s.startTime}–{s.endTime}
                            {isOwner && (
                              <button
                                onClick={() => void removeSlot(s.id)}
                                disabled={deleting === s.id}
                                className="p-0.5 rounded hover:bg-red-100 text-outline hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                                title="Remove slot"
                              >
                                {deleting === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-label-sm text-outline/50">—</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state for owners */}
          {isOwner && weeklySlots.length === 0 && !showForm && (
            <div className="text-center py-4">
              <p className="text-[11px] text-outline">No hours set yet. Click “Add Hours” to set your weekly availability.</p>
            </div>
          )}
        </div>
      )}

      {/* Location */}
      {(provider.address || (provider.latitude && provider.longitude)) && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
          <h3 className="font-bold text-label-md text-on-surface mb-2">Location</h3>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-outline mt-0.5 flex-shrink-0" />
            <div>
              {provider.address && <p className="text-label-sm text-on-surface-variant">{provider.address}</p>}
              {provider.location && <p className="text-label-sm text-outline mt-0.5">{provider.location}</p>}
            </div>
          </div>
          {provider.latitude && provider.longitude && (
            <div className="mt-3 h-36 bg-surface-container rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-[11px] text-outline font-medium">{provider.location ?? provider.name}</p>
                  <p className="text-[10px] text-outline/60">{provider.latitude.toFixed(4)}, {provider.longitude.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({ provider, services, selectedService, onClose }: {
  provider: Provider
  services: PetCareService[]
  selectedService: PetCareService | null
  onClose: () => void
}): React.JSX.Element {
  const { profile } = useAuth()
  const [step, setStep] = useState<'service' | 'datetime' | 'details' | 'confirm'>(
    selectedService ? 'datetime' : 'service',
  )
  const [serviceId, setServiceId] = useState(selectedService?.id ?? '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [petName, setPetName] = useState('')
  const [petSpecies, setPetSpecies] = useState('')
  const [petBreed, setPetBreed] = useState('')
  const [petWeight, setPetWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_visit' | 'pay_now'>('pay_at_visit')
  const [location, setLocation] = useState(provider.address ?? provider.location ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<PetCareBooking | null>(null)

  const selectedSvc = services.find((s) => s.id === serviceId)

  // Pre-fill pet name from user's display name
  useEffect(() => {
    if (!petName && profile?.displayName) {
      const firstName = profile.displayName.split(' ')[0]
      const t = setTimeout(() => setPetName(`${firstName}'s pet`), 0)
      return () => clearTimeout(t)
    }
    return undefined
  }, [profile, petName])

  async function submit(): Promise<void> {
    if (!serviceId || !date || !time || saving) return
    setSaving(true); setError('')
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString()
      const booking = await petCareApi.createBooking({
        providerId: provider.id, serviceId, scheduledAt,
        ...(location ? { location } : {}),
        ...(petName ? { petName } : {}),
        ...(petSpecies ? { petSpecies } : {}),
        ...(petBreed ? { petBreed } : {}),
        ...(petWeight ? { petWeightKg: parseFloat(petWeight) } : {}),
        ...(notes ? { notes } : {}),
        paymentMethod,
      })
      setSuccess(booking)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create booking')
    } finally { setSaving(false) }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'service' && (
              <button onClick={() => setStep('service')} className="p-1 rounded-lg hover:bg-surface-container cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-outline" />
              </button>
            )}
            <h2 className="font-headline text-headline-md text-on-surface">
              {success ? 'Booking Confirmed! 🎉' : 'Book a Service'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-green-600" /></div>
            <h3 className="text-label-lg font-bold text-on-surface">{success.service.name}</h3>
            <p className="text-label-sm text-outline">with <span className="font-semibold text-on-surface">{success.provider.name}</span></p>
            <div className="bg-surface-container-low rounded-xl p-4 space-y-2 text-left text-label-sm">
              <div className="flex justify-between"><span className="text-outline">Date</span><span className="font-medium">{new Date(success.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-outline">Time</span><span className="font-medium">{new Date(success.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex justify-between"><span className="text-outline">Payment</span><span className="font-medium">{PAYMENT_METHOD_LABELS[success.paymentMethod] ?? success.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-outline">Amount</span><span className="font-bold text-primary">{success.priceDisplay}</span></div>
              <div className="flex justify-between"><span className="text-outline">Status</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${BOOKING_STATUS_COLORS[success.status] ?? ''}`}>{BOOKING_STATUS_LABELS[success.status] ?? success.status}</span></div>
            </div>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-2">
              {['service', 'datetime', 'details', 'confirm'].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    ['service', 'datetime', 'details', 'confirm'].indexOf(step) >= i ? 'bg-primary text-white' : 'bg-surface-container text-outline'
                  }`}>{i + 1}</div>
                  {i < 3 && <div className={`flex-1 h-0.5 ${['service', 'datetime', 'details', 'confirm'].indexOf(step) > i ? 'bg-primary' : 'bg-outline/20'}`} />}
                </div>
              ))}
            </div>

            {step === 'service' && (
              <div className="space-y-3">
                <p className="text-label-sm text-outline">Choose a service to book</p>
                {services.filter((s) => s.isActive).map((s) => (
                  <button key={s.id} onClick={() => { setServiceId(s.id); setStep('datetime') }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      serviceId === s.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-label-md text-on-surface">{s.name}</div>
                        {s.durationMinutes && <div className="text-label-sm text-outline mt-0.5">{s.durationMinutes} min</div>}
                      </div>
                      <div className="text-lg font-bold text-primary">{s.priceDisplay}</div>
                    </div>
                    {s.description && <p className="text-label-sm text-on-surface-variant mt-1">{s.description}</p>}
                  </button>
                ))}
              </div>
            )}

            {step === 'datetime' && (
              <div className="space-y-4">
                <p className="text-label-sm text-outline">When would you like the service?</p>
                <div>
                  <label className="text-label-sm font-medium text-on-surface block mb-1.5">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} className={input} />
                </div>
                <div>
                  <label className="text-label-sm font-medium text-on-surface block mb-1.5">Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="text-label-sm font-medium text-on-surface block mb-1.5">Location (optional)</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where should the service take place?" className={input} />
                </div>
                <button onClick={() => setStep('details')} disabled={!date || !time}
                  className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer">Continue</button>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-4">
                <p className="text-label-sm text-outline">Tell us about your pet</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-label-sm font-medium text-on-surface block mb-1.5">Pet Name</label>
                    <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Buddy" className={input} />
                  </div>
                  <div>
                    <label className="text-label-sm font-medium text-on-surface block mb-1.5">Species</label>
                    <select value={petSpecies} onChange={(e) => setPetSpecies(e.target.value)} className={input}>
                      <option value="">Select…</option>
                      <option value="dog">Dog</option><option value="cat">Cat</option>
                      <option value="bird">Bird</option><option value="rabbit">Rabbit</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-label-sm font-medium text-on-surface block mb-1.5">Breed (optional)</label>
                    <input value={petBreed} onChange={(e) => setPetBreed(e.target.value)} placeholder="e.g. Golden Retriever" className={input} />
                  </div>
                  <div>
                    <label className="text-label-sm font-medium text-on-surface block mb-1.5">Weight (kg, optional)</label>
                    <input type="number" value={petWeight} onChange={(e) => setPetWeight(e.target.value)} placeholder="e.g. 25" className={input} />
                  </div>
                </div>
                <div>
                  <label className="text-label-sm font-medium text-on-surface block mb-1.5">Notes (optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                    placeholder="Any special requests…" className={`${input} resize-none`} />
                </div>
                <button onClick={() => setStep('confirm')} className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 cursor-pointer">Continue</button>
              </div>
            )}

            {step === 'confirm' && selectedSvc && (
              <div className="space-y-4">
                <p className="text-label-sm text-outline">Review and confirm your booking</p>
                <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="text-label-sm font-medium text-on-surface">Service</span>
                    <span className="text-label-sm font-semibold text-on-surface">{selectedSvc.name}</span>
                  </div>
                  <div className="flex items-center justify-between"><span className="text-label-sm text-outline">Provider</span><span className="text-label-sm font-medium text-on-surface">{provider.name}</span></div>
                  <div className="flex items-center justify-between"><span className="text-label-sm text-outline">Date</span><span className="text-label-sm font-medium text-on-surface">{new Date(`${date}T${time}`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                  <div className="flex items-center justify-between"><span className="text-label-sm text-outline">Time</span><span className="text-label-sm font-medium text-on-surface">{new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
                  {petName && <div className="flex items-center justify-between"><span className="text-label-sm text-outline">Pet</span><span className="text-label-sm font-medium text-on-surface">{petName}{petSpecies ? ` (${petSpecies})` : ''}</span></div>}
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                    <span className="text-label-md font-bold text-on-surface">Total</span>
                    <span className="text-lg font-bold text-primary">{selectedSvc.priceDisplay}</span>
                  </div>
                </div>

                <div>
                  <label className="text-label-sm font-medium text-on-surface block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPaymentMethod('pay_at_visit')}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'pay_at_visit' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-outline" />
                      <div className="text-label-sm font-semibold text-on-surface">Pay at Visit</div>
                      <div className="text-[10px] text-outline mt-0.5">Pay when service is delivered</div>
                    </button>
                    <button onClick={() => setPaymentMethod('pay_now')}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'pay_now' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <div className="text-label-sm font-semibold text-on-surface">Pay Now</div>
                      <div className="text-[10px] text-outline mt-0.5">Secure online payment</div>
                    </button>
                  </div>
                </div>

                {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-label-sm text-red-600"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}

                <button onClick={() => void submit()} disabled={saving}
                  className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
                >{saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Booking…' : `Confirm Booking — ${selectedSvc.priceDisplay}`}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add Service Modal ────────────────────────────────────────────────────────

// ── Edit Profile Modal ────────────────────────────────────────────────────────

function EditProfileModal({ provider, onClose, onSaved }: {
  provider: Provider
  onClose: () => void
  onSaved: () => void
}): React.JSX.Element {
  const [name, setName] = useState(provider.name)
  const [serviceType, setServiceType] = useState(provider.serviceType ?? '')
  const [description, setDescription] = useState(provider.description ?? '')
  const [phone, setPhone] = useState(provider.phone ?? '')
  const [website, setWebsite] = useState(provider.website ?? '')
  const [location, setLocation] = useState(provider.location ?? '')
  const [address, setAddress] = useState(provider.address ?? '')
  const [coverUrl, setCoverUrl] = useState(provider.coverUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  async function submit(): Promise<void> {
    if (!name.trim() || saving) return
    setSaving(true); setError('')
    try {
      await providersApi.update(provider.id, {
        name: name.trim(),
        ...(serviceType.trim() ? { serviceType: serviceType.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(website.trim() ? { website: website.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(coverUrl.trim() ? { coverUrl: coverUrl.trim() } : {}),
      })
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" /> Edit Profile
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Name */}
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Business Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your business name" className={input} />
          </div>

          {/* Service Type */}
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Service Type</label>
            <input value={serviceType} onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. Dog Grooming, Pet Boarding" className={input} />
          </div>

          {/* Description */}
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Tell clients about your business…" className={`${input} resize-none`} />
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                type="tel" placeholder="+1 (555) 123-4567" className={input} />
            </div>
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">Website</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)}
                type="url" placeholder="https://example.com" className={input} />
            </div>
          </div>

          {/* Location info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">City / Area</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY" className={input} />
            </div>
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">Full Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Suite 100" className={input} />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Cover Image URL</label>
            <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}
              type="url" placeholder="https://example.com/cover.jpg" className={input} />
            {coverUrl && (
              <div className="mt-2 h-24 rounded-xl overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-label-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>
        <div className="p-5 border-t border-outline-variant/20 flex-shrink-0">
          <button
            onClick={() => void submit()}
            disabled={saving || !name.trim()}
            className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Service Modal ────────────────────────────────────────────────────────

function AddServiceModal({ providerId, onClose, onAdded }: {
  providerId: string
  onClose: () => void
  onAdded: () => void
}): React.JSX.Element {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceDollars, setPriceDollars] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [category, setCategory] = useState<string>('grooming')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const input = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  async function submit(): Promise<void> {
    const priceCents = Math.round(parseFloat(priceDollars || '0') * 100)
    if (!name.trim() || priceCents <= 0 || saving) return
    setSaving(true); setError('')
    try {
      await petCareApi.createService(providerId, {
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        priceCents,
        ...(durationMinutes ? { durationMinutes } : {}),
        category: category as ServiceCategory,
      })
      onAdded(); onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add service')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <h3 className="font-headline text-headline-md text-on-surface">Add a Service</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name *" className={input} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description (optional)" className={`${input} resize-none`} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm text-outline block mb-1">Price ($)</label>
            <input type="number" min={0} step="0.01" value={priceDollars} onChange={(e) => setPriceDollars(e.target.value)} placeholder="0.00" className={input} />
          </div>
          <div>
            <label className="text-label-sm text-outline block mb-1">Duration (min)</label>
            <input type="number" min={5} step={5} value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 60)} className={input} />
          </div>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
          {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        {error && <p className="text-label-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-outline-variant cursor-pointer">Cancel</button>
          <button onClick={() => void submit()} disabled={saving || !name.trim() || !priceDollars}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >{saving && <Loader2 className="w-4 h-4 animate-spin" />}Add Service</button>
        </div>
      </div>
    </div>
  )
}
