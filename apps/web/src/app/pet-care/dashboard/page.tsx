'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, List, CalendarRange, Clock, Star, HeartHandshake, PawPrint,
  Plus, X, Check, ChevronRight, Loader2, AlertCircle, MoreVertical, Edit3, Trash2,
  Pause, Play, Phone, MapPin, Globe, Building2, MessageSquare, Eye,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useCachedValue } from '@/hooks/use-cache'
import { providersApi, type Provider } from '@/lib/api'
import {
  petCareApi, type PetCareService, type PetCareBooking, type ProviderReview,
  type AvailabilitySlot, type NewService, type UpdateServiceInput, type ServiceCategory,
  SERVICE_CATEGORY_LABELS, SERVICE_CATEGORY_ICONS,
  BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, PAYMENT_METHOD_LABELS, DAY_LABELS,
} from '@/lib/pet-care-api'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'

type DashboardTab = 'overview' | 'services' | 'bookings' | 'availability' | 'reviews'

const TAB_META: Record<DashboardTab, { label: string; Icon: typeof LayoutDashboard }> = {
  overview: { label: 'Overview', Icon: LayoutDashboard },
  services: { label: 'Services', Icon: List },
  bookings: { label: 'Bookings', Icon: CalendarRange },
  availability: { label: 'Hours', Icon: Clock },
  reviews: { label: 'Reviews', Icon: Star },
}

// ═════════════════════════════════════════════════════════════════════════════

export default function ProviderDashboardPage(): React.JSX.Element {
  const router = useRouter()
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  // Read ?tab= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    const validTabs: string[] = ['overview','services','bookings','availability','reviews']
    if (tab && validTabs.includes(tab)) {
      const t = setTimeout(() => setActiveTab(tab as DashboardTab), 0)
      return () => clearTimeout(t)
    }
    return undefined
  }, [])

  const { data: allProviders, isLoading: providersLoading } = useCachedValue<Provider[]>('dash:my-providers', () =>
    providersApi.mine().then((list) => list.filter((p) => p.category === 'pet_care')),
  )

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  if (authLoading || providersLoading) return <LoadingSkeleton />
  if (!allProviders || allProviders.length === 0) return <EmptyDashboard />

  const providers = allProviders
  const selectedProvider = providers.find((p) => p.id === selectedProviderId) ?? providers[0]!
  const activeProviderId = selectedProvider.id

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-9 space-y-4 pb-20">
            {/* Provider selector */}
            {providers.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProviderId(p.id); setActiveTab('overview') }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-label-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      p.id === activeProviderId
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:border-primary/40'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Header card */}
            <ProviderHeader provider={selectedProvider} />

            {/* Tab bar */}
            <div className="flex border-b border-outline-variant/30 overflow-x-auto">
              {(Object.keys(TAB_META) as DashboardTab[]).map((tab) => {
                const { label, Icon } = TAB_META[tab]
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-label-sm font-semibold capitalize transition-colors cursor-pointer relative flex-shrink-0 ${
                      activeTab === tab ? 'text-primary' : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <TabContent
              providerId={activeProviderId}
              provider={selectedProvider}
              activeTab={activeTab}
            />
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" />
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Tab Content (fetches data for the current tab)
// ═════════════════════════════════════════════════════════════════════════════

function TabContent({ providerId, provider, activeTab }: {
  providerId: string
  provider: Provider
  activeTab: DashboardTab
}): React.JSX.Element {
  const [servicesKey, setServicesKey] = useState(0)
  const [bookingsKey, setBookingsKey] = useState(0)
  const [availabilityKey, setAvailabilityKey] = useState(0)
  const [reviewsKey, setReviewsKey] = useState(0)

  const { data: services } = useCachedValue<PetCareService[]>(
    `dash:services:${providerId}:${servicesKey}`, () => petCareApi.listServices(providerId),
  )
  const { data: bookings } = useCachedValue<PetCareBooking[]>(
    `dash:bookings:${providerId}:${bookingsKey}`, async () => {
      const page = await petCareApi.listBookings('provider', undefined, null, 50)
      return page.data
    },
  )
  const { data: availability } = useCachedValue<AvailabilitySlot[]>(
    `dash:availability:${providerId}:${availabilityKey}`, () => petCareApi.listAvailability(providerId),
  )
  const { data: reviews } = useCachedValue<ProviderReview[]>(
    `dash:reviews:${providerId}:${reviewsKey}`, () => petCareApi.listReviews(providerId),
  )

  const refreshServices = useCallback(() => setServicesKey((k) => k + 1), [])
  const refreshBookings = useCallback(() => setBookingsKey((k) => k + 1), [])
  const refreshAvailability = useCallback(() => setAvailabilityKey((k) => k + 1), [])
  const refreshReviews = useCallback(() => setReviewsKey((k) => k + 1), [])

  switch (activeTab) {
    case 'overview':
      return (
        <OverviewTab
          provider={provider}
          services={services ?? []}
          bookings={bookings ?? []}
          reviews={reviews ?? []}
        />
      )
    case 'services':
      return (
        <ServicesTab
          providerId={providerId}
          services={services ?? []}
          onRefresh={refreshServices}
        />
      )
    case 'bookings':
      return (
        <BookingsTab
          providerId={providerId}
          bookings={bookings ?? []}
          onRefresh={refreshBookings}
        />
      )
    case 'availability':
      return (
        <AvailabilityTab
          providerId={providerId}
          availability={availability ?? []}
          onRefresh={refreshAvailability}
        />
      )
    case 'reviews':
      return (
        <ReviewsTab
          providerId={providerId}
          reviews={reviews ?? []}
          onRefresh={refreshReviews}
        />
      )
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// Provider Header
// ═════════════════════════════════════════════════════════════════════════════

function ProviderHeader({ provider }: { provider: Provider }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {provider.coverUrl && (
        <div className="relative h-28 bg-gradient-to-br from-primary/20 via-primary/5 to-surface-container-lowest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      <div className={`px-5 pb-5 ${provider.coverUrl ? '-mt-8 relative' : 'pt-5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`${provider.coverUrl ? 'w-16 h-16 border-4 border-surface-container-lowest' : 'w-14 h-14'} rounded-2xl bg-primary/15 overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0`}>
              {provider.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <HeartHandshake className="w-7 h-7 text-primary" />
              )}
            </div>
            <div>
              <h1 className="font-headline text-headline-md text-on-surface">{provider.name}</h1>
              {provider.serviceType && (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                  {provider.serviceType}
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/pet-care/${provider.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant/30 text-label-sm font-semibold text-on-surface hover:bg-surface-container hover:border-primary/40 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" /> View Public
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-label-sm text-outline">
          {provider.location && (
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {provider.location}</span>
          )}
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
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {provider.address}</span>
          )}
        </div>
      </div>
    </div>
  )
}



// ═════════════════════════════════════════════════════════════════════════════
// Overview Tab
// ═════════════════════════════════════════════════════════════════════════════

function StatTile({ label, value, Icon, tint }: {
  label: string; value: string | number; Icon: typeof LayoutDashboard; tint: string
}): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
      <div className="flex items-center justify-between">
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${tint}`}><Icon className="w-4 h-4" /></span>
      </div>
      <p className="text-headline-md font-bold text-on-surface mt-2 tabular-nums">{value}</p>
      <p className="text-[11px] text-outline">{label}</p>
    </div>
  )
}

function OverviewTab({ services, bookings, reviews }: {
  provider: Provider
  services: PetCareService[]
  bookings: PetCareBooking[]
  reviews: ProviderReview[]
}): React.JSX.Element {
  const activeServices = services.filter((s) => s.isActive).length
  const upcomingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress')
  const completedBookings = bookings.filter((b) => b.status === 'completed')
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Active Services" value={activeServices} Icon={List} tint="bg-primary/10 text-primary" />
        <StatTile label="Upcoming Bookings" value={upcomingBookings.length} Icon={CalendarRange} tint="bg-blue-500/10 text-blue-600" />
        <StatTile label="Completed" value={completedBookings.length} Icon={Check} tint="bg-emerald-500/10 text-emerald-600" />
        <StatTile label="Rating" value={avgRating} Icon={Star} tint="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Upcoming bookings */}
      <Card title="Upcoming Bookings" href="/pet-care/dashboard?tab=bookings">
        {upcomingBookings.length === 0 ? (
          <Empty text="No upcoming bookings. When clients book your services, they'll appear here." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {upcomingBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                  {SERVICE_CATEGORY_ICONS[b.service.category as keyof typeof SERVICE_CATEGORY_ICONS] ?? '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate">{b.service.name}</p>
                  <p className="text-[11px] text-outline flex items-center gap-1">
                    <CalendarRange className="w-3 h-3" />
                    {new Date(b.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-1">·</span>
                    {b.seeker.displayName}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${BOOKING_STATUS_COLORS[b.status] ?? ''}`}>
                  {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent reviews */}
      <Card title="Recent Reviews">
        {reviews.length === 0 ? (
          <Empty text="No reviews yet. Reviews appear after clients complete bookings." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="py-2.5">
                <div className="flex items-center gap-2 text-label-sm">
                  <span className="font-semibold text-on-surface">{r.author.displayName}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-400 fill-current' : 'text-outline/30'}`} />
                    ))}
                  </div>
                  <span className="text-outline ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.body && <p className="text-label-sm text-on-surface-variant mt-1 line-clamp-2">{r.body}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
        <h2 className="text-label-md font-bold text-on-surface mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction icon={Plus} label="Add Service" href="/pet-care/dashboard?tab=services" />
          <QuickAction icon={CalendarRange} label="View Bookings" href="/pet-care/dashboard?tab=bookings" />
          <QuickAction icon={Clock} label="Set Hours" href="/pet-care/dashboard?tab=availability" />
          <QuickAction icon={Star} label="View Reviews" href="/pet-care/dashboard?tab=reviews" />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, href }: { icon: typeof Plus; label: string; href: string }): React.JSX.Element {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-[11px] font-semibold text-outline group-hover:text-on-surface transition-colors">{label}</span>
    </Link>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Services Tab
// ═════════════════════════════════════════════════════════════════════════════

function ServicesTab({ providerId, services, onRefresh }: {
  providerId: string
  services: PetCareService[]
  onRefresh: () => void
}): React.JSX.Element {
  const [addOpen, setAddOpen] = useState(false)
  const [editingService, setEditingService] = useState<PetCareService | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function toggleActive(service: PetCareService): Promise<void> {
    await petCareApi.updateService(providerId, service.id, { isActive: !service.isActive })
    onRefresh()
  }

  async function deleteService(id: string): Promise<void> {
    setDeleting(id)
    try {
      await petCareApi.removeService(providerId, id)
      onRefresh()
    } catch { /* ignore */ } finally { setDeleting(null) }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setAddOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/40 text-label-sm font-semibold text-outline hover:text-primary hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add a Service
      </button>

      {services.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
          <HeartHandshake className="w-10 h-10 text-outline/40 mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">No services yet</p>
          <p className="text-label-sm text-outline mt-1">Add your first service above.</p>
        </div>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className={`bg-surface-container-lowest rounded-xl border shadow-sm p-4 transition-all hover:shadow-md ${
              service.isActive ? 'border-outline-variant/30' : 'border-outline-variant/20 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                  {SERVICE_CATEGORY_ICONS[service.category as keyof typeof SERVICE_CATEGORY_ICONS] ?? '📋'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-label-md text-on-surface">{service.name}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {SERVICE_CATEGORY_LABELS[service.category as keyof typeof SERVICE_CATEGORY_LABELS] ?? service.category}
                    </span>
                  </div>
                  {service.description && <p className="text-label-sm text-on-surface-variant mt-0.5 line-clamp-1">{service.description}</p>}
                  {service.durationMinutes && (
                    <p className="text-label-sm text-outline mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.durationMinutes} min
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-semibold text-outline hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => void toggleActive(service)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-semibold text-outline hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      {service.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {service.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => void deleteService(service.id)}
                      disabled={deleting === service.id}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-semibold text-outline hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {deleting === service.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-primary">{service.priceDisplay}</div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  service.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      {addOpen && (
        <ServiceFormModal
          providerId={providerId}
          onClose={() => setAddOpen(false)}
          onSaved={onRefresh}
        />
      )}

      {editingService && (
        <ServiceFormModal
          providerId={providerId}
          service={editingService}
          onClose={() => setEditingService(null)}
          onSaved={onRefresh}
        />
      )}
    </div>
  )
}

// ── Add / Edit Service Modal ─────────────────────────────────────────────────

function ServiceFormModal({ providerId, service, onClose, onSaved }: {
  providerId: string
  service?: PetCareService
  onClose: () => void
  onSaved: () => void
}): React.JSX.Element {
  const [name, setName] = useState(service?.name ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [priceDollars, setPriceDollars] = useState(service ? String(service.priceCents / 100) : '')
  const [duration, setDuration] = useState(service?.durationMinutes ? String(service.durationMinutes) : '')
  const [category, setCategory] = useState(service?.category ?? 'other')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!service

  async function submit(): Promise<void> {
    if (!name.trim() || !priceDollars || saving) return
    const priceCents = Math.round(parseFloat(priceDollars) * 100)
    if (priceCents <= 0) { setError('Price must be greater than 0'); return }
    setSaving(true); setError('')
    try {
      const input: NewService = {
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        priceCents,
        ...(duration ? { durationMinutes: parseInt(duration, 10) } : {}),
        category: category as ServiceCategory,
      }
      if (isEditing) {
        await petCareApi.updateService(providerId, service.id, input as UpdateServiceInput)
      } else {
        await petCareApi.createService(providerId, input)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally { setSaving(false) }
  }

  const inputCss = 'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline text-headline-md text-on-surface">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Service Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Full Grooming" className={inputCss} />
          </div>
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCss}>
              {(Object.keys(SERVICE_CATEGORY_LABELS) as Array<keyof typeof SERVICE_CATEGORY_LABELS>).map((k) => (
                <option key={k} value={k}>{SERVICE_CATEGORY_ICONS[k]} {SERVICE_CATEGORY_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-label-sm font-medium text-on-surface block mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder="Describe what this service includes…" className={`${inputCss} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                placeholder="0.00" className={inputCss} />
            </div>
            <div>
              <label className="text-label-sm font-medium text-on-surface block mb-1.5">Duration (min)</label>
              <input type="number" min="5" step="5" value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60" className={inputCss} />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-label-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <button onClick={() => void submit()} disabled={saving || !name.trim() || !priceDollars}
            className="w-full py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving…' : isEditing ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Bookings Tab
// ═════════════════════════════════════════════════════════════════════════════

const BOOKING_FILTERS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const

function BookingsTab({ bookings, onRefresh }: {
  providerId: string
  bookings: PetCareBooking[]
  onRefresh: () => void
}): React.JSX.Element {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter)

  const counts = Object.fromEntries(
    BOOKING_FILTERS.map((f) => [f, f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length]),
  ) as Record<string, number>

  return (
    <div className="space-y-3">
      {/* Status filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {BOOKING_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === f
                ? 'bg-primary text-white'
                : 'bg-surface-container-lowest border border-outline-variant/30 text-outline hover:text-on-surface'
            }`}
          >
            {BOOKING_STATUS_LABELS[f] ?? 'All'}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              statusFilter === f ? 'bg-white/20' : 'bg-surface-container text-outline'
            }`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
          <CalendarRange className="w-10 h-10 text-outline/40 mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">No bookings found</p>
          <p className="text-label-sm text-outline mt-1">
            {statusFilter === 'all' ? 'When clients book your services, they\'ll appear here.' : `No ${BOOKING_STATUS_LABELS[statusFilter]?.toLowerCase() ?? statusFilter} bookings.`}
          </p>
        </div>
      ) : (
        filtered.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onRefresh={onRefresh} />
        ))
      )}
    </div>
  )
}

function BookingCard({ booking, onRefresh }: {
  booking: PetCareBooking
  onRefresh: () => void
}): React.JSX.Element {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCancelReason, setShowCancelReason] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  async function updateStatus(status: string, reason?: string): Promise<void> {
    setActionLoading(status)
    setMenuOpen(false)
    try {
      await petCareApi.updateBookingStatus(booking.id, status, reason)
      onRefresh()
    } catch { /* ignore */ } finally { setActionLoading(null); setShowCancelReason(false) }
  }

  // Available actions based on status
  const actions: { label: string; status: string; color: string; reason?: boolean }[] = []
  if (booking.status === 'pending') {
    actions.push({ label: 'Confirm', status: 'confirmed', color: 'text-blue-600 hover:bg-blue-50' })
    actions.push({ label: 'Cancel', status: 'cancelled', color: 'text-red-600 hover:bg-red-50', reason: true })
  } else if (booking.status === 'confirmed') {
    actions.push({ label: 'Start', status: 'in_progress', color: 'text-purple-600 hover:bg-purple-50' })
    actions.push({ label: 'Cancel', status: 'cancelled', color: 'text-red-600 hover:bg-red-50', reason: true })
  } else if (booking.status === 'in_progress') {
    actions.push({ label: 'Complete', status: 'completed', color: 'text-emerald-600 hover:bg-emerald-50' })
    actions.push({ label: 'No Show', status: 'no_show', color: 'text-red-600 hover:bg-red-50' })
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-base flex-shrink-0">
            {SERVICE_CATEGORY_ICONS[booking.service.category as keyof typeof SERVICE_CATEGORY_ICONS] ?? '📋'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-label-md text-on-surface">{booking.service.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${BOOKING_STATUS_COLORS[booking.status] ?? ''}`}>
                {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-label-sm text-outline">
              <span className="flex items-center gap-1">
                <CalendarRange className="w-3 h-3" />
                {new Date(booking.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1"><PawPrint className="w-3 h-3" /> {booking.seeker.displayName}</span>
              {booking.petName && <span>Pet: {booking.petName}</span>}
            </div>
            {booking.notes && <p className="text-label-sm text-on-surface-variant mt-1 italic">&ldquo;{booking.notes}&rdquo;</p>}
            {booking.cancelReason && (
              <p className="text-label-sm text-red-500 mt-1">Reason: {booking.cancelReason}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-label-sm font-semibold text-primary">{booking.priceDisplay}</span>
              <span className="text-[11px] text-outline">· {PAYMENT_METHOD_LABELS[booking.paymentMethod] ?? booking.paymentMethod}</span>
              {booking.paymentStatus === 'paid' && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Paid</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions dropdown */}
        {actions.length > 0 && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl py-1 min-w-[140px]">
                  {actions.map((action) => (
                    <button
                      key={action.status}
                      onClick={() => {
                        if (action.reason) { setShowCancelReason(true); setMenuOpen(false) }
                        else void updateStatus(action.status)
                      }}
                      className={`w-full text-left px-4 py-2 text-label-sm ${action.color} transition-colors cursor-pointer flex items-center gap-2`}
                    >
                      {action.status === 'confirmed' ? <Check className="w-3.5 h-3.5" /> :
                       action.status === 'cancelled' ? <X className="w-3.5 h-3.5" /> :
                       action.status === 'in_progress' ? <Play className="w-3.5 h-3.5" /> :
                       action.status === 'completed' ? <Check className="w-3.5 h-3.5" /> :
                       <AlertCircle className="w-3.5 h-3.5" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cancel reason modal */}
      {showCancelReason && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelReason(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-label-md text-on-surface mb-3">Cancel Booking</h3>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              rows={3} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCancelReason(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-label-sm font-semibold text-outline hover:bg-surface-container cursor-pointer">Keep</button>
              <button onClick={() => void updateStatus('cancelled', cancelReason.trim() || undefined)}
                disabled={actionLoading !== null}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-label-sm font-semibold hover:bg-red-700 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
              >
                {actionLoading === 'cancelled' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Availability Tab
// ═════════════════════════════════════════════════════════════════════════════

function AvailabilityTab({ providerId, availability, onRefresh }: {
  providerId: string
  availability: AvailabilitySlot[]
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
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-label-md text-on-surface">Weekly Business Hours</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : 'Add Hours'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
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
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <SaveIcon className="w-3 h-3" />}
              {saving ? 'Adding…' : 'Add Slot'}
            </button>
          </div>
        )}

        {/* Weekly grid */}
        <div className="space-y-1">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const slots = weeklySlots.filter((a) => a.dayOfWeek === day)
            return (
              <div key={day} className="flex items-center justify-between py-2.5 border-b border-outline-variant/10 last:border-b-0">
                <span className="text-label-sm font-medium text-on-surface w-20">{DAY_LABELS[day]}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  {slots.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {slots.map((s) => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-[11px] text-on-surface-variant font-medium">
                          <Clock className="w-3 h-3" /> {s.startTime}–{s.endTime}
                          <button
                            onClick={() => void removeSlot(s.id)}
                            disabled={deleting === s.id}
                            className="p-0.5 rounded hover:bg-red-100 text-outline hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            {deleting === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                          </button>
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

        {weeklySlots.length === 0 && !showForm && (
          <div className="text-center py-4">
            <p className="text-[11px] text-outline">No hours set yet. Click &ldquo;Add Hours&rdquo; to set your weekly availability.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SaveIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Reviews Tab
// ═════════════════════════════════════════════════════════════════════════════

function ReviewsTab({ reviews }: {
  providerId: string
  reviews: ProviderReview[]
  onRefresh: () => void
}): React.JSX.Element {
  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'
  const distribution = [0, 0, 0, 0, 0]
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1]!++ })

  return (
    <div className="space-y-3">
      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[44px] font-bold text-on-surface leading-none">{avg}</div>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? 'text-amber-400 fill-current' : 'text-outline/30'}`} />
                ))}
              </div>
              <p className="text-[11px] text-outline mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star - 1]!
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-[11px] text-outline">
                    <span className="w-6 text-right">{star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-5 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
          <MessageSquare className="w-10 h-10 text-outline/40 mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">No reviews yet</p>
          <p className="text-label-sm text-outline mt-1">When clients review your services, they&apos;ll appear here.</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-label-sm font-bold text-primary flex-shrink-0">
                {review.author.displayName.charAt(0).toUpperCase()}
              </div>
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
                  <span className="text-[11px] text-outline">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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

// ═════════════════════════════════════════════════════════════════════════════
// Shared helpers
// ═════════════════════════════════════════════════════════════════════════════

function Card({ title, children, href }: {
  title: string
  children: React.ReactNode
  href?: string
}): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-label-md font-bold text-on-surface">{title}</h2>
        {href && <Link href={href} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">Manage<ChevronRight className="w-3.5 h-3.5" /></Link>}
      </div>
      {children}
    </section>
  )
}

function Empty({ text }: { text: string }): React.JSX.Element {
  return <p className="text-label-sm text-outline py-3 text-center">{text}</p>
}

// ═════════════════════════════════════════════════════════════════════════════
// Empty state (no pet care providers)
// ═════════════════════════════════════════════════════════════════════════════

function EmptyDashboard(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-5 py-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <HeartHandshake className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-headline text-headline-lg font-bold text-on-surface mb-2">Provider Dashboard</h1>
          <p className="text-label-md text-outline max-w-md mx-auto mb-6">
            You don&apos;t have any pet care provider listings yet. Create one to start managing services, bookings, and reviews.
          </p>
          <Link
            href="/pet-care"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create a Provider Listing
          </Link>
        </div>
      </main>
      <MobileTabs currentPage="home" />
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Loading skeleton
// ═════════════════════════════════════════════════════════════════════════════

function LoadingSkeleton(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 hidden lg:block"><div className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" /></div>
          <div className="lg:col-span-9 space-y-3">
            <div className="h-40 bg-surface-container-lowest rounded-2xl animate-pulse" />
            <div className="h-12 bg-surface-container-lowest rounded-xl animate-pulse" />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-container-lowest rounded-xl animate-pulse" />)}
            </div>
            {[0, 1, 2].map((i) => <div key={i} className="h-20 bg-surface-container-lowest rounded-xl animate-pulse" />)}
          </div>
        </div>
      </main>
    </>
  )
}
