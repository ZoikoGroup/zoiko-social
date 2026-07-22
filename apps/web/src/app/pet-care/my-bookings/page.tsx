'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar, Clock, MapPin, ChevronDown, Loader2, X, Check, AlertCircle,
  PawPrint, CreditCard, ArrowLeft, Star, MoreHorizontal, Ban, User,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import {
  petCareApi, type PetCareBooking, type ProviderReview,
  BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
} from '@/lib/pet-care-api'

export default function MyBookingsPage(): React.JSX.Element {
  const router = useRouter()
  const { profile, loading: authLoading, isAuthenticated } = useAuth()
  const [role, setRole] = useState<'seeker' | 'provider'>('seeker')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [bookings, setBookings] = useState<PetCareBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reviewBooking, setReviewBooking] = useState<PetCareBooking | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (authLoading || !isAuthenticated) return
    setLoading(true)
    setError('')
    petCareApi.listBookings(role, statusFilter || undefined)
      .then((page) => setBookings(page.data))
      .catch((e) => setError(e.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [authLoading, isAuthenticated, role, statusFilter, refreshKey])

  async function handleCancel(bookingId: string): Promise<void> {
    if (cancelling) return
    setCancelling(true)
    try {
      const updated = await petCareApi.updateBookingStatus(bookingId, 'cancelled', cancelReason || undefined)
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b))
      setCancelId(null)
      setCancelReason('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel booking')
    } finally { setCancelling(false) }
  }

  async function handleStatusUpdate(bookingId: string, status: string): Promise<void> {
    setActionLoading(bookingId)
    try {
      const updated = await petCareApi.updateBookingStatus(bookingId, status)
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update booking')
    } finally { setActionLoading(null) }
  }

  function handleReviewSubmitted(): void {
    setReviewBooking(null)
    setRefreshKey((k) => k + 1)
  }

  if (authLoading || !isAuthenticated) return <LoadingSkeleton />

  const tabClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-label-sm font-semibold transition-all cursor-pointer ${
      active ? 'bg-primary text-white shadow-sm' : 'text-outline hover:text-on-surface hover:bg-surface-container'
    }`

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
            <div className="flex items-center justify-between px-1">
              <div>
                <h1 className="font-headline text-headline-md text-on-surface leading-tight">My Bookings</h1>
                <p className="text-label-sm text-outline">Manage your pet care appointments</p>
              </div>
              <button
                onClick={() => router.push('/pet-care')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-label-sm font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Book a Service
              </button>
            </div>

            {/* Role + Status filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-1.5 bg-surface-container-low rounded-xl p-1">
                <button onClick={() => setRole('seeker')} className={tabClass(role === 'seeker')}>
                  <PawPrint className="w-3.5 h-3.5 inline mr-1" /> As Customer
                </button>
                <button onClick={() => setRole('provider')} className={tabClass(role === 'provider')}>
                  <User className="w-3.5 h-3.5 inline mr-1" /> As Provider
                </button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {['', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={tabClass(statusFilter === s)}
                  >
                    {s ? BOOKING_STATUS_LABELS[s] ?? s : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-label-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <div key={i} className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <Calendar className="w-10 h-10 text-outline/40 mx-auto mb-3" />
                <h3 className="text-label-md font-bold text-on-surface">No bookings found</h3>
                <p className="text-label-sm text-outline mt-1 mb-4">
                  {role === 'seeker' ? 'You haven\'t booked any services yet.' : 'No one has booked your services yet.'}
                </p>
                {role === 'seeker' && (
                  <button onClick={() => router.push('/pet-care')} className="px-5 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold cursor-pointer">
                    Browse Services
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    role={role}
                    onCancel={() => setCancelId(booking.id)}
                    onStatusUpdate={(status) => void handleStatusUpdate(booking.id, status)}
                    actionLoading={actionLoading === booking.id}
                    onReview={() => setReviewBooking(booking)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {/* Cancel modal */}
      {cancelId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-headline text-headline-md text-on-surface">Cancel Booking?</h3>
            <p className="text-label-sm text-outline">Are you sure you want to cancel this booking?</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              rows={2} placeholder="Reason (optional)" className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-2.5 rounded-xl border border-outline-variant cursor-pointer">Keep Booking</button>
              <button onClick={() => void handleCancel(cancelId)} disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
                {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  )
}

// ── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking, role, onCancel, onStatusUpdate, actionLoading, onReview,
}: {
  booking: PetCareBooking
  role: 'seeker' | 'provider'
  onCancel: () => void
  onStatusUpdate: (status: string) => void
  actionLoading: boolean
  onReview?: () => void
}): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const datetime = new Date(booking.scheduledAt)
  const isPast = datetime < new Date()

  const providerActions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed'],
  }

  const canAct = role === 'provider' && (providerActions[booking.status]?.length ?? 0) > 0
  const canCancel = role === 'seeker' && ['pending', 'confirmed'].includes(booking.status)
  const canReview = role === 'seeker' && booking.status === 'completed'

  return (
    <div className={`bg-surface-container-lowest rounded-xl border shadow-sm p-4 transition-all hover:shadow-md ${
      booking.status === 'cancelled' ? 'border-red-200 opacity-70' : 'border-outline-variant/30'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
            {booking.provider.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={booking.provider.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">{booking.service.category === 'grooming' ? '✂️' : booking.service.category === 'walking' ? '🚶' : '📋'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-label-md text-on-surface">{booking.service.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${BOOKING_STATUS_COLORS[booking.status] ?? ''}`}>
                {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </div>
            <p className="text-label-sm text-outline mt-0.5">
              {role === 'seeker' ? booking.provider.name : booking.seeker.displayName}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px] text-outline">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {datetime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {booking.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {booking.location}
                </span>
              )}
            </div>
            {booking.petName && (
              <p className="text-[12px] text-outline mt-1">Pet: <span className="font-medium text-on-surface">{booking.petName}</span></p>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-primary">{booking.priceDisplay}</div>
          <div className="text-[10px] text-outline mt-0.5">{PAYMENT_METHOD_LABELS[booking.paymentMethod] ?? booking.paymentMethod}</div>

          {/* Actions */}
          <div className="relative mt-2" ref={menuRef}>
            {(canAct || canCancel || canReview) && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4 text-outline" />
              </button>
            )}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden z-10">
                {canAct && role === 'provider' && providerActions[booking.status]?.map((action) => (
                  <button
                    key={action}
                    onClick={() => { setMenuOpen(false); onStatusUpdate(action) }}
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 text-left text-label-sm hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2"
                  >
                    {action === 'confirmed' && <Check className="w-3.5 h-3.5 text-green-500" />}
                    {action === 'in_progress' && <Clock className="w-3.5 h-3.5 text-purple-500" />}
                    {action === 'completed' && <Star className="w-3.5 h-3.5 text-green-500" />}
                    {action === 'cancelled' && <Ban className="w-3.5 h-3.5 text-red-500" />}
                    {action === 'confirmed' && 'Confirm'}
                    {action === 'in_progress' && 'Start Service'}
                    {action === 'completed' && 'Mark Completed'}
                    {action === 'cancelled' && 'Cancel'}
                  </button>
                ))}
                {canCancel && (
                  <button
                    onClick={() => { setMenuOpen(false); onCancel() }}
                    className="w-full px-4 py-2.5 text-left text-label-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Ban className="w-3.5 h-3.5" /> Cancel Booking
                  </button>
                )}
                {canReview && onReview && (
                  <button
                    onClick={() => { setMenuOpen(false); onReview() }}
                    className="w-full px-4 py-2.5 text-left text-label-sm text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Star className="w-3.5 h-3.5" /> Write a Review
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({ booking, onClose, onSubmitted }: {
  booking: PetCareBooking
  onClose: () => void
  onSubmitted: () => void
}): React.JSX.Element {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit(): Promise<void> {
    if (rating === 0 || saving) return
    setSaving(true); setError('')
    try {
      await petCareApi.createReview({
        bookingId: booking.id,
        rating,
        ...(body.trim() ? { body: body.trim() } : {}),
      })
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6">
        {success ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-headline text-headline-md text-on-surface">Review Submitted!</h3>
            <p className="text-label-sm text-outline">Your feedback for <strong>{booking.provider.name}</strong> has been posted.</p>
            <button onClick={onSubmitted} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 cursor-pointer">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-headline-md text-on-surface">Write a Review</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service info */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-surface-container-low">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                {booking.service.category === 'grooming' ? '✂️' : booking.service.category === 'walking' ? '🚶' : '📋'}
              </div>
              <div className="min-w-0">
                <p className="text-label-sm font-semibold text-on-surface truncate">{booking.service.name}</p>
                <p className="text-[11px] text-outline">{booking.provider.name} · {new Date(booking.scheduledAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-1 mb-5 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  type="button"
                >
                  <Star className={`w-9 h-9 transition-all ${
                    star <= (hoverRating || rating) ? 'text-amber-400 fill-current drop-shadow-sm' : 'text-outline/25'
                  }`} />
                </button>
              ))}
            </div>

            {/* Review body */}
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)}
              rows={4} placeholder="Tell others about your experience (optional)…"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none resize-none"
            />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-label-sm text-red-600 mt-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-label-md hover:bg-surface-container cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => void submit()}
                disabled={rating === 0 || saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/90"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 hidden lg:block"><div className="h-56 bg-surface-container-lowest rounded-xl animate-pulse" /></div>
          <div className="lg:col-span-6 space-y-3">
            <div className="h-8 w-48 bg-surface-container-lowest rounded animate-pulse" />
            <div className="h-10 bg-surface-container-lowest rounded-xl animate-pulse" />
            {[0, 1, 2].map((i) => <div key={i} className="h-28 bg-surface-container-lowest rounded-xl animate-pulse" />)}
          </div>
        </div>
      </main>
    </>
  )
}
