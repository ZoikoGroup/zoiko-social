import { z } from 'zod'

export const BREEDING_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'] as const
export type BreedingSpecies = (typeof BREEDING_SPECIES)[number]

const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
const DnaResultSchema = z.object({
  condition: z.string().trim().min(1).max(80),
  status: z.enum(['clear', 'carrier', 'affected']),
})
// Fields shared by create & update (all optional here; create adds required ones).
const advancedFields = {
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  temperament: z.array(z.string().trim().max(40)).max(15).optional(),
  healthTests: z.array(z.string().trim().max(80)).max(20).optional(),
  certifications: z.array(z.string().trim().max(80)).max(20).optional(),
  registered: z.boolean().optional(),
  willingToTravel: z.boolean().optional(),
  dnaResults: z.array(DnaResultSchema).max(30).optional(),
  ageMonths: z.number().int().min(0).max(600).optional(),
  littersCount: z.number().int().min(0).max(100).optional(),
  lastLitterAt: DATE.optional(),
  documents: z.array(z.string().url().max(600)).max(10).optional(),
  heatStatus: z.enum(['unknown', 'in_season', 'due_soon', 'resting']).optional(),
  nextHeatAt: DATE.optional(),
  availableNow: z.boolean().optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  fee: z.number().min(0).max(1000000).optional(),
}

export const CreateBreedingSchema = z.object({
  petId: z.string().uuid().optional(),              // link to a Health Passport pet (auto-fills details)
  petName: z.string().trim().min(1).max(120),
  species: z.enum(BREEDING_SPECIES).optional(),
  breed: z.string().trim().min(1).max(120),
  sex: z.enum(['male', 'female']).optional(),
  age: z.string().trim().max(60).optional(),
  location: z.string().trim().max(160).optional(),
  about: z.string().trim().max(3000).optional(),
  currency: z.string().trim().length(3).optional(),
  ...advancedFields,
})

export const UpdateBreedingSchema = z.object({
  petId: z.string().uuid().optional(),
  petName: z.string().trim().min(1).max(120).optional(),
  species: z.enum(BREEDING_SPECIES).optional(),
  breed: z.string().trim().min(1).max(120).optional(),
  sex: z.enum(['male', 'female']).optional(),
  age: z.string().trim().max(60).optional(),
  location: z.string().trim().max(160).optional(),
  about: z.string().trim().max(3000).optional(),
  status: z.enum(['available', 'paused', 'unavailable']).optional(),
  ...advancedFields,
})

export const RequestSchema = z.object({
  message: z.string().trim().max(1000).optional(),
})

export const RespondRequestSchema = z.object({
  status: z.enum(['accepted', 'declined']),
})

export const RequestMessageSchema = z.object({
  body: z.string().trim().min(1).max(1000),
})

export const CreateReviewSchema = z.object({
  requestId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(2000).optional(),
})

export const CreateAlertSchema = z.object({
  species: z.enum(BREEDING_SPECIES).optional(),
  breed: z.string().trim().max(120).optional(),
  sex: z.enum(['male', 'female']).optional(),
  nearLat: z.number().min(-90).max(90).optional(),
  nearLng: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().int().min(1).max(500).optional(),
})

export const VerifySchema = z.object({
  providerId: z.string().uuid(),
})

export const CreateLitterSchema = z.object({
  requestId: z.string().uuid(),
  matedAt: DATE.optional(),
  expectedAt: DATE.optional(),
  bornAt: DATE.optional(),
  count: z.number().int().min(0).max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
})

export const UpdateLitterSchema = z.object({
  matedAt: DATE.optional(),
  expectedAt: DATE.optional(),
  bornAt: DATE.optional(),
  count: z.number().int().min(0).max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
  status: z.enum(['expecting', 'born']).optional(),
})

export type CreateBreedingInput = z.infer<typeof CreateBreedingSchema>
export type UpdateBreedingInput = z.infer<typeof UpdateBreedingSchema>
export type RequestInput = z.infer<typeof RequestSchema>
export type RespondRequestInput = z.infer<typeof RespondRequestSchema>
export type RequestMessageInput = z.infer<typeof RequestMessageSchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type CreateAlertInput = z.infer<typeof CreateAlertSchema>
export type VerifyInput = z.infer<typeof VerifySchema>
export type CreateLitterInput = z.infer<typeof CreateLitterSchema>
export type UpdateLitterInput = z.infer<typeof UpdateLitterSchema>
