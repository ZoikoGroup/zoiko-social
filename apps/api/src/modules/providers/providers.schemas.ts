import { z } from 'zod'

// Weekly opening hours: one entry per weekday used (0=Sun … 6=Sat).
const HoursEntrySchema = z.object({
  day: z.number().int().min(0).max(6),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
  closed: z.boolean().optional(),
})

const strList = (max: number, itemMax = 40) => z.array(z.string().trim().min(1).max(itemMax)).max(max)

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
  // ── Vet-clinic profile fields ──
  logoUrl: z.string().url().max(600).optional(),
  photoUrls: strList(12, 600).optional(),
  specialties: strList(20).optional(),
  species: strList(15).optional(),
  facilities: strList(20).optional(),
  consultModes: z.array(z.enum(['in_clinic', 'home_visit', 'video'])).max(3).optional(),
  languages: strList(15).optional(),
  emergencyAvailable: z.boolean().optional(),
  is24x7: z.boolean().optional(),
  acceptsWalkins: z.boolean().optional(),
  hours: z.array(HoursEntrySchema).max(7).optional(),
  licenseNo: z.string().trim().max(80).optional(),
})

export const UpdateProviderSchema = CreateProviderSchema.omit({ category: true }).partial()

export type CreateProviderInput = z.infer<typeof CreateProviderSchema>
export type UpdateProviderInput = z.infer<typeof UpdateProviderSchema>

// ── Pet Care / Vet Service ───────────────────────────────────────────────────
// Shared catalog: pet-care categories + vet-clinic categories.
const ServiceCategoryEnum = z.enum([
  // pet care
  'grooming', 'boarding', 'walking', 'training', 'sitting', 'daycare', 'vet_escort',
  // vet
  'consultation', 'vaccination', 'deworming', 'surgery', 'dental', 'diagnostics',
  'emergency', 'telemedicine', 'microchip', 'health_certificate',
  'other',
])

export const CreateServiceSchema = z.object({
  providerId: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().min(0).max(10_000_000),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  category: ServiceCategoryEnum.optional(),
})

export const UpdateServiceSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  priceCents: z.number().int().min(0).max(10_000_000).optional(),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  category: ServiceCategoryEnum.optional(),
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
  petId: z.string().uuid().optional(),
  petName: z.string().trim().max(120).optional(),
  petSpecies: z.string().trim().max(60).optional(),
  petBreed: z.string().trim().max(60).optional(),
  petWeightKg: z.number().min(0).max(1000).optional(),
  consultMode: z.enum(['in_clinic', 'home_visit', 'video']).optional(),
  reason: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(1000).optional(),
  paymentMethod: z.enum(['pay_at_visit', 'pay_now']).optional(),
})

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  cancelReason: z.string().trim().max(500).optional(),
})

// Vet adds a post-visit summary (optionally pushed to the pet's Health Passport).
export const VisitSummarySchema = z.object({
  visitSummary: z.string().trim().max(4000).optional(),
  prescription: z.string().trim().max(4000).optional(),
  followUpAt: z.string().optional(),  // YYYY-MM-DD
  addToHealthPassport: z.boolean().optional(),
  recordType: z.enum(['vet_visit', 'vaccination', 'medication', 'note']).optional(),
})

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusSchema>
export type VisitSummaryInput = z.infer<typeof VisitSummarySchema>

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

// ── Provider Team Members ────────────────────────────────────────────────────

export const CreateTeamMemberSchema = z.object({
  providerId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(80).optional(),
  licenseNo: z.string().trim().max(80).optional(),
  photoUrl: z.string().url().max(600).optional(),
})

export type CreateTeamMemberInput = z.infer<typeof CreateTeamMemberSchema>
