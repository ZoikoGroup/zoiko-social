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
})

export const UpdateProviderSchema = CreateProviderSchema.omit({ category: true }).partial()

export type CreateProviderInput = z.infer<typeof CreateProviderSchema>
export type UpdateProviderInput = z.infer<typeof UpdateProviderSchema>
