import { z } from 'zod'

export const EVENT_CATEGORIES = [
  'adoption_drive', 'vet_camp', 'workshop', 'meetup', 'fundraiser', 'competition', 'awareness',
  'birthday', 'wedding', 'naming_ceremony', 'gotcha_day', 'funeral', 'farewell', 'playdate',
  'other',
] as const

export const CreateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).optional(),
    location: z.string().trim().max(200).optional(),
    venueName: z.string().trim().max(160).optional(),
    visibility: z.enum(['public', 'followers']).optional(),
    isOnline: z.boolean().optional(),
    coverUrl: z.string().url().max(600).optional(),
    videoUrl: z.string().url().max(600).optional(),
    category: z.enum(EVENT_CATEGORIES).optional(),
    isFree: z.boolean().optional(),
    price: z.string().trim().max(60).optional(),
    bookingUrl: z.string().url().max(600).optional(),
    capacity: z.number().int().min(1).max(1_000_000).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    startsAt: z.string().datetime({ message: 'startsAt must be an ISO datetime' }),
    endsAt: z.string().datetime().optional(),
  })
  .refine((e) => !e.endsAt || new Date(e.endsAt) >= new Date(e.startsAt), {
    message: 'endsAt must be after startsAt',
    path: ['endsAt'],
  })

// Editable fields (host only). All optional; startsAt/endsAt validated when present.
export const UpdateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    location: z.string().trim().max(200).nullable().optional(),
    venueName: z.string().trim().max(160).nullable().optional(),
    visibility: z.enum(['public', 'followers']).optional(),
    isOnline: z.boolean().optional(),
    coverUrl: z.string().url().max(600).nullable().optional(),
    videoUrl: z.string().url().max(600).nullable().optional(),
    category: z.enum(EVENT_CATEGORIES).nullable().optional(),
    isFree: z.boolean().optional(),
    price: z.string().trim().max(60).nullable().optional(),
    bookingUrl: z.string().url().max(600).nullable().optional(),
    capacity: z.number().int().min(1).max(1_000_000).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().nullable().optional(),
  })

export const RsvpSchema = z.object({
  status: z.enum(['going', 'interested']).optional(),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type RsvpInput = z.infer<typeof RsvpSchema>
