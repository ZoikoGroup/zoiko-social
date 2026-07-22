import { z } from 'zod'

export const CreateProviderSchema = z.object({
  category: z.enum(['vet', 'pet_care']),
  name: z.string().trim().min(1).max(120),
  serviceType: z.string().trim().max(60).optional(),
  description: z.string().trim().max(2000).optional(),
  location: z.string().trim().max(120).optional(),
  address: z.string().trim().max(300).optional(),
  phone: z.string().trim().max(40).optional(),
  website: z.string().url().max(300).optional(),
  coverUrl: z.string().url().max(600).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export const UpdateProviderSchema = CreateProviderSchema.omit({ category: true }).partial()

export type CreateProviderInput = z.infer<typeof CreateProviderSchema>
export type UpdateProviderInput = z.infer<typeof UpdateProviderSchema>

// ── Pet Care Service ─────────────────────────────────────────────────────────

export const CreateServiceSchema = z.object({
  providerId: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().min(0).max(10_000_000),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  category: z.enum(['grooming', 'boarding', 'walking', 'training', 'sitting', 'daycare', 'vet_escort', 'other']).optional(),
})

export const UpdateServiceSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().min(0).max(10_000_000).optional(),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  category: z.enum(['grooming', 'boarding', 'walking', 'training', 'sitting', 'daycare', 'vet_escort', 'other']).optional(),
  isActive: z.boolean().optional(),
})

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>

// ── Pet Care Booking ─────────────────────────────────────────────────────────

export const CreateBookingSchema = z.object({
  providerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  location: z.string().trim().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  petName: z.string().trim().max(120).optional(),
  petSpecies: z.string().trim().max(60).optional(),
  petBreed: z.string().trim().max(60).optional(),
  petWeightKg: z.number().min(0).max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
  paymentMethod: z.enum(['pay_at_visit', 'pay_now']).optional(),
})

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  cancelReason: z.string().trim().max(500).optional(),
})

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusSchema>

// ── Provider Availability ────────────────────────────────────────────────────

export const CreateAvailabilitySchema = z.object({
  providerId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  date: z.string().optional(),  // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  kind: z.enum(['weekly', 'override', 'unavailable']).optional(),
})

export type CreateAvailabilityInput = z.infer<typeof CreateAvailabilitySchema>

// ── Provider Review ──────────────────────────────────────────────────────────

export const CreateReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(2000).optional(),
})

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
