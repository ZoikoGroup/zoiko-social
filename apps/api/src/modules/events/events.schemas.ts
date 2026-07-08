import { z } from 'zod'

export const CreateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).optional(),
    location: z.string().trim().max(200).optional(),
    isOnline: z.boolean().optional(),
    coverUrl: z.string().url().max(600).optional(),
    startsAt: z.string().datetime({ message: 'startsAt must be an ISO datetime' }),
    endsAt: z.string().datetime().optional(),
  })
  .refine((e) => !e.endsAt || new Date(e.endsAt) >= new Date(e.startsAt), {
    message: 'endsAt must be after startsAt',
    path: ['endsAt'],
  })

export const RsvpSchema = z.object({
  status: z.enum(['going', 'interested']).optional(),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type RsvpInput = z.infer<typeof RsvpSchema>
