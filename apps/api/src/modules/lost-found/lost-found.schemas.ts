import { z } from 'zod'

export const CreateReportSchema = z.object({
  kind: z.enum(['lost', 'found']),
  petName: z.string().trim().max(80).optional(),
  species: z.string().trim().min(1).max(40),
  breed: z.string().trim().max(60).optional(),
  age: z.string().trim().max(40).optional(),
  color: z.string().trim().max(60).optional(),
  sex: z.enum(['male', 'female', 'unknown']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  microchipId: z.string().trim().max(60).optional(),
  collar: z.string().trim().max(200).optional(),
  neutered: z.boolean().optional(),
  vaccinated: z.boolean().optional(),
  description: z.string().trim().max(2000).optional(),
  lastSeenLocation: z.string().trim().max(200).optional(),
  lastSeenAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD').optional(),
  photoUrl: z.string().url().max(600).optional(),
  photoUrls: z.array(z.string().url().max(600)).max(6).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contact: z.string().trim().max(200).optional(),
  reward: z.number().int().min(0).max(1_000_000).optional(),
})

export const UpdateReportSchema = CreateReportSchema.omit({ kind: true }).partial().extend({
  status: z.enum(['active', 'reunited', 'closed']).optional(),
})

export const SightingSchema = z
  .object({
    message: z.string().trim().max(1000).optional(),
    location: z.string().trim().max(200).optional(),
  })
  .refine((s) => !!(s.message?.trim() || s.location?.trim()), {
    message: 'A sighting needs a note or a location',
    path: ['message'],
  })

export type CreateReportInput = z.infer<typeof CreateReportSchema>
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>
export type SightingInput = z.infer<typeof SightingSchema>
