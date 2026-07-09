import { z } from 'zod'

export const CreatePetSchema = z.object({
  name: z.string().trim().min(1).max(60),
  species: z.string().trim().min(1).max(40),
  breed: z.string().trim().max(60).optional(),
  avatarUrl: z.string().url().max(600).optional(),
  bio: z.string().trim().max(500).optional(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD').optional(),
  isPublic: z.boolean().optional(),
})

export const UpdatePetSchema = CreatePetSchema.partial()

const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

export const CreateDiaryEntrySchema = z
  .object({
    kind: z.enum(['note', 'milestone', 'photo', 'checkup']).optional(),
    title: z.string().trim().max(120).optional(),
    body: z.string().trim().max(2000).optional(),
    photoUrl: z.string().url().max(600).optional(),
    entryDate: DATE.optional(),
  })
  .refine((d) => !!(d.title?.trim() || d.body?.trim() || d.photoUrl), {
    message: 'A diary entry needs text or a photo',
    path: ['body'],
  })

export const CreateHealthRecordSchema = z.object({
  type: z.enum(['vaccination', 'vet_visit', 'medication', 'allergy', 'weight', 'note']),
  title: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).optional(),
  recordDate: DATE.optional(),
  nextDue: DATE.optional(),
})

export type CreatePetInput = z.infer<typeof CreatePetSchema>
export type UpdatePetInput = z.infer<typeof UpdatePetSchema>
export type CreateDiaryEntryInput = z.infer<typeof CreateDiaryEntrySchema>
export type CreateHealthRecordInput = z.infer<typeof CreateHealthRecordSchema>
