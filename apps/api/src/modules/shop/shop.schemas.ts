import { z } from 'zod'

export const SHOP_CATEGORIES = ['food', 'toys', 'health', 'grooming', 'accessories', 'beds', 'tech'] as const
export type ShopCategory = (typeof SHOP_CATEGORIES)[number]

export const SHOP_SORTS = ['newest', 'price-low', 'price-high', 'popular'] as const
export type ShopSort = (typeof SHOP_SORTS)[number]

export const CreateProductSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(4000).optional(),
  price: z.number().min(0).max(100000),
  compareAt: z.number().min(0).max(100000).optional(),
  currency: z.string().trim().length(3).optional(),
  category: z.enum(SHOP_CATEGORIES).optional(),
  condition: z.enum(['new', 'used']).optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  stock: z.number().int().min(0).max(100000).optional(),
  shipping: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
})

export const UpdateProductSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  price: z.number().min(0).max(100000).optional(),
  compareAt: z.number().min(0).max(100000).optional(),
  category: z.enum(SHOP_CATEGORIES).optional(),
  condition: z.enum(['new', 'used']).optional(),
  coverUrl: z.string().url().max(600).optional(),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  stock: z.number().int().min(0).max(100000).optional(),
  shipping: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
  status: z.enum(['active', 'sold', 'withdrawn']).optional(),
})

export const EnquirySchema = z.object({
  message: z.string().trim().max(1000).optional(),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type EnquiryInput = z.infer<typeof EnquirySchema>
