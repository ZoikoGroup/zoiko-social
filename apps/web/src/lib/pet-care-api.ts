import { request, cachedGet, mutate } from './api'

// ═════════════════════════════════════════════════════════════════════════════
// Pet Care Booking System — Types & API
// Extends the providers module with services, bookings, availability & reviews.
// ═════════════════════════════════════════════════════════════════════════════

// ── Service Types ────────────────────────────────────────────────────────────

export interface PetCareService {
  id: string
  providerId: string
  name: string
  description: string | null
  priceCents: number
  priceDisplay: string
  durationMinutes: number | null
  category: string
  isActive: boolean
  createdAt: string
}

export type ServiceCategory = 'grooming' | 'boarding' | 'walking' | 'training' | 'sitting' | 'daycare' | 'vet_escort' | 'other'

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  grooming: 'Grooming',
  boarding: 'Boarding',
  walking: 'Walking',
  training: 'Training',
  sitting: 'Pet Sitting',
  daycare: 'Daycare',
  vet_escort: 'Vet Escort',
  other: 'Other',
}

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  grooming: '✂️',
  boarding: '🏠',
  walking: '🚶',
  training: '🎯',
  sitting: '🛋️',
  daycare: '☀️',
  vet_escort: '🚑',
  other: '📋',
}

export interface NewService {
  name: string
  description?: string
  priceCents: number
  durationMinutes?: number
  category?: ServiceCategory | string  // pet-care categories or vet categories (see lib/vet)
}

export interface UpdateServiceInput {
  name?: string
  description?: string
  priceCents?: number
  durationMinutes?: number
  category?: ServiceCategory | string
  isActive?: boolean
}

// ── Booking Types ────────────────────────────────────────────────────────────

export interface PetCareBooking {
  id: string
  serviceId: string
  service: { id: string; name: string; category: string; durationMinutes: number | null }
  provider: { id: string; name: string; location: string | null; coverUrl: string | null }
  seeker: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  petId: string | null
  pet: { id: string; name: string; species: string; breed: string | null; avatarUrl: string | null } | null
  scheduledAt: string
  endAt: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  petName: string | null
  petSpecies: string | null
  petBreed: string | null
  petWeightKg: number | null
  consultMode: string | null
  reason: string | null
  visitSummary: string | null
  prescription: string | null
  followUpAt: string | null
  notes: string | null
  priceCents: number
  priceDisplay: string
  paymentMethod: string
  paymentStatus: string
  status: string
  cancelledBy: string | null
  cancelReason: string | null
  createdAt: string
}

export interface BookingPage { data: PetCareBooking[]; nextCursor: string | null; hasMore: boolean }

export interface NewBooking {
  providerId: string
  serviceId: string
  scheduledAt: string
  endAt?: string
  location?: string
  latitude?: number
  longitude?: number
  petId?: string
  petName?: string
  petSpecies?: string
  petBreed?: string
  petWeightKg?: number
  consultMode?: 'in_clinic' | 'home_visit' | 'video'
  reason?: string
  notes?: string
  paymentMethod?: 'pay_at_visit' | 'pay_now'
}

export interface VisitSummaryInput {
  visitSummary?: string
  prescription?: string
  followUpAt?: string
  addToHealthPassport?: boolean
  recordType?: 'vet_visit' | 'vaccination' | 'medication' | 'note'
}

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
}

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  no_show: 'bg-gray-100 text-gray-700 border-gray-200',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pay_at_visit: 'Pay at Visit',
  pay_now: 'Pay Now',
}

// ── Availability Types ───────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id: string
  providerId: string
  dayOfWeek: number | null
  date: string | null
  startTime: string
  endTime: string
  kind: string
}

export interface NewAvailabilitySlot {
  providerId: string
  dayOfWeek?: number
  date?: string
  startTime: string
  endTime: string
  kind?: 'weekly' | 'override' | 'unavailable'
}

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ── Review Types ─────────────────────────────────────────────────────────────

export interface ProviderReview {
  id: string
  providerId: string
  bookingId: string
  rating: number
  body: string | null
  author: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  createdAt: string
}

export interface NewReview {
  bookingId: string
  rating: number
  body?: string
}

// ═════════════════════════════════════════════════════════════════════════════
// API Client
// ═════════════════════════════════════════════════════════════════════════════

export const petCareApi = {
  // ── Services ────────────────────────────────────────────────────────────────

  /** List all services for a provider */
  listServices: (providerId: string) =>
    cachedGet<PetCareService[]>(`/providers/${providerId}/services`, 30_000),

  /** Create a new service (provider only) */
  createService: (providerId: string, input: NewService) =>
    mutate<PetCareService>(`/providers/${providerId}/services`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  /** Update a service (provider only) */
  updateService: (providerId: string, serviceId: string, input: UpdateServiceInput) =>
    mutate<PetCareService>(`/providers/${providerId}/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  /** Delete a service (provider only) */
  removeService: (providerId: string, serviceId: string) =>
    mutate<{ success: boolean }>(`/providers/${providerId}/services/${serviceId}`, { method: 'DELETE' }),

  // ── Bookings ────────────────────────────────────────────────────────────────

  /** List bookings for the current user (as seeker or provider) */
  listBookings: (role: 'seeker' | 'provider' = 'seeker', status?: string, cursor?: string | null, limit = 15) => {
    const p = new URLSearchParams()
    p.set('role', role)
    p.set('limit', String(limit))
    if (status) p.set('status', status)
    if (cursor) p.set('cursor', cursor)
    return request<BookingPage>(`/providers/bookings/list?${p.toString()}`)
  },

  /** Get a single booking by ID */
  getBooking: (id: string) =>
    request<PetCareBooking>(`/providers/bookings/${id}`),

  /** Create a new booking */
  createBooking: (input: NewBooking) =>
    mutate<PetCareBooking>('/providers/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  /** Update booking status (provider: confirm/in_progress/complete/cancel; seeker: cancel) */
  updateBookingStatus: (id: string, status: string, cancelReason?: string) =>
    mutate<PetCareBooking>(`/providers/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...(cancelReason ? { cancelReason } : {}) }),
    }),

  /** Vet adds a post-visit summary (optionally pushed to the pet's Health Passport) */
  addVisitSummary: (id: string, input: VisitSummaryInput) =>
    mutate<PetCareBooking>(`/providers/bookings/${id}/visit-summary`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  // ── Availability ────────────────────────────────────────────────────────────

  /** List availability slots for a provider */
  listAvailability: (providerId: string) =>
    cachedGet<AvailabilitySlot[]>(`/providers/${providerId}/availability`, 30_000),

  /** Create an availability slot (provider only) */
  createAvailability: (input: NewAvailabilitySlot) =>
    mutate<AvailabilitySlot>('/providers/availability', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  /** Delete an availability slot (provider only) */
  removeAvailability: (id: string) =>
    mutate<{ success: boolean }>(`/providers/availability/${id}`, { method: 'DELETE' }),

  // ── Reviews ─────────────────────────────────────────────────────────────────

  /** List reviews for a provider */
  listReviews: (providerId: string) =>
    cachedGet<ProviderReview[]>(`/providers/${providerId}/reviews`, 30_000),

  /** Create a review (seeker, after completed booking) */
  createReview: (input: NewReview) =>
    mutate<ProviderReview>('/providers/reviews', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  /** Delete a review (author only) */
  deleteReview: (id: string) =>
    mutate<{ success: boolean }>(`/providers/reviews/${id}`, { method: 'DELETE' }),
}
