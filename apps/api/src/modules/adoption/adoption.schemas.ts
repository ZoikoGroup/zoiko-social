import { z } from 'zod'

export const CreateListingSchema = z.object({
  name: z.string().trim().min(1).max(80),
  species: z.string().trim().min(1).max(40),
  breed: z.string().trim().max(60).optional(),
  age: z.string().trim().max(40).optional(),
  sex: z.enum(['male', 'female', 'unknown']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  description: z.string().trim().max(3000).optional(),
  location: z.string().trim().max(200).optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(10).optional(),
  vaccinated: z.boolean().optional(),
  neutered: z.boolean().optional(),
  goodWith: z.array(z.enum(['kids', 'dogs', 'cats'])).max(3).optional(),
  fee: z.number().int().min(0).max(1_000_000).optional(),
})

export const UpdateListingSchema = CreateListingSchema.partial().extend({
  status: z.enum(['available', 'pending', 'adopted', 'withdrawn']).optional(),
})

export const EnquirySchema = z.object({
  message: z.string().trim().max(1000).optional(),
})

export const RespondEnquirySchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export type CreateListingInput = z.infer<typeof CreateListingSchema>
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>
export type EnquiryInput = z.infer<typeof EnquirySchema>
export type RespondEnquiryInput = z.infer<typeof RespondEnquirySchema>
