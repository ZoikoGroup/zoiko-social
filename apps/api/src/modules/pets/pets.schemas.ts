import { z } from 'zod'
import { httpUrl } from '../common/schemas/http-url'

const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

export const CreatePetSchema = z.object({
  name: z.string().trim().min(1).max(60),
  species: z.string().trim().min(1).max(40),
  breed: z.string().trim().max(60).optional(),
  sex: z.enum(['male', 'female', 'unknown']).optional(),
  avatarUrl: httpUrl(600).optional(),
  bio: z.string().trim().max(500).optional(),
  birthdate: DATE.optional(),
  // About details. No weight here — it is tracked over time as a health record
  // of type 'weight' so the growth chart stays the single source of truth.
  color: z.string().trim().max(60).optional(),
  microchipId: z.string().trim().max(60).optional(),
  neutered: z.boolean().optional(),
  adoptionDate: DATE.optional(),
  isPublic: z.boolean().optional(),
})

/**
 * On update, a date or tri-state must be clearable back to "not set". An empty
 * string (dates) and null (neutered) mean "unset this"; omitting the key means
 * "leave it alone". Without these, a cleared field would silently stay put.
 */
const CLEARABLE_DATE = z.union([DATE, z.literal('')])

export const UpdatePetSchema = CreatePetSchema.partial().extend({
  birthdate: CLEARABLE_DATE.optional(),
  adoptionDate: CLEARABLE_DATE.optional(),
  neutered: z.boolean().nullable().optional(),
})

export const CreateDiaryEntrySchema = z
  .object({
    kind: z.enum(['note', 'milestone', 'photo', 'checkup']).optional(),
    title: z.string().trim().max(120).optional(),
    body: z.string().trim().max(2000).optional(),
    photoUrl: httpUrl(600).optional(),
    photoUrls: z.array(httpUrl(600)).max(8).optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
    entryDate: DATE.optional(),
  })
  .refine((d) => !!(d.title?.trim() || d.body?.trim() || d.photoUrl || (d.photoUrls && d.photoUrls.length > 0)), {
    message: 'A diary entry needs text or a photo',
    path: ['body'],
  })

export const UpdateDiaryEntrySchema = z.object({
  kind: z.enum(['note', 'milestone', 'photo', 'checkup']).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(2000).optional(),
  photoUrl: httpUrl(600).optional(),
  photoUrls: z.array(httpUrl(600)).max(8).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
  entryDate: DATE.optional(),
})

export const CreateHealthRecordSchema = z.object({
  type: z.enum(['vaccination', 'vet_visit', 'medication', 'allergy', 'weight', 'note']),
  title: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).optional(),
  attachments: z.array(httpUrl(600)).max(10).optional(),
  recordDate: DATE.optional(),
  nextDue: DATE.optional(),
})

export const UpdateHealthRecordSchema = z.object({
  type: z.enum(['vaccination', 'vet_visit', 'medication', 'allergy', 'weight', 'note']).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
  attachments: z.array(httpUrl(600)).max(10).optional(),
  recordDate: DATE.optional(),
  nextDue: DATE.optional(),
})

export type CreatePetInput = z.infer<typeof CreatePetSchema>
export type UpdatePetInput = z.infer<typeof UpdatePetSchema>
export type CreateDiaryEntryInput = z.infer<typeof CreateDiaryEntrySchema>
export type UpdateDiaryEntryInput = z.infer<typeof UpdateDiaryEntrySchema>
export type CreateHealthRecordInput = z.infer<typeof CreateHealthRecordSchema>
export type UpdateHealthRecordInput = z.infer<typeof UpdateHealthRecordSchema>
