import { z } from 'zod'

export const BREEDING_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'] as const
export type BreedingSpecies = (typeof BREEDING_SPECIES)[number]

export const CreateBreedingSchema = z.object({
  petName: z.string().trim().min(1).max(120),
  species: z.enum(BREEDING_SPECIES).optional(),
  breed: z.string().trim().min(1).max(120),
  sex: z.enum(['male', 'female']).optional(),
  age: z.string().trim().max(60).optional(),
  location: z.string().trim().max(160).optional(),
  about: z.string().trim().max(3000).optional(),
  healthTests: z.array(z.string().trim().max(80)).max(20).optional(),
  certifications: z.array(z.string().trim().max(80)).max(20).optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  fee: z.number().min(0).max(1000000).optional(),
  currency: z.string().trim().length(3).optional(),
})

export const UpdateBreedingSchema = z.object({
  petName: z.string().trim().min(1).max(120).optional(),
  species: z.enum(BREEDING_SPECIES).optional(),
  breed: z.string().trim().min(1).max(120).optional(),
  sex: z.enum(['male', 'female']).optional(),
  age: z.string().trim().max(60).optional(),
  location: z.string().trim().max(160).optional(),
  about: z.string().trim().max(3000).optional(),
  healthTests: z.array(z.string().trim().max(80)).max(20).optional(),
  certifications: z.array(z.string().trim().max(80)).max(20).optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  fee: z.number().min(0).max(1000000).optional(),
  status: z.enum(['available', 'paused', 'unavailable']).optional(),
})

export const RequestSchema = z.object({
  message: z.string().trim().max(1000).optional(),
})

export const RespondRequestSchema = z.object({
  status: z.enum(['accepted', 'declined']),
})

export type CreateBreedingInput = z.infer<typeof CreateBreedingSchema>
export type UpdateBreedingInput = z.infer<typeof UpdateBreedingSchema>
export type RequestInput = z.infer<typeof RequestSchema>
export type RespondRequestInput = z.infer<typeof RespondRequestSchema>
