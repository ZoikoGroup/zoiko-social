import { z } from 'zod'

export const NEWS_CATEGORIES = ['policy', 'science', 'rescue', 'health', 'climate', 'community'] as const
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const CreateArticleSchema = z.object({
  title: z.string().trim().min(4).max(160),
  excerpt: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20).max(20000),
  coverUrl: z.string().url().max(600).optional(),
  category: z.enum(NEWS_CATEGORIES).optional(),
  sourceName: z.string().trim().max(160).optional(),
  sourceUrl: z.string().url().max(600).optional(),
  readMinutes: z.number().int().min(1).max(120).optional(),
})

export const UpdateArticleSchema = z.object({
  title: z.string().trim().min(4).max(160).optional(),
  excerpt: z.string().trim().min(10).max(400).optional(),
  body: z.string().trim().min(20).max(20000).optional(),
  coverUrl: z.string().url().max(600).optional(),
  category: z.enum(NEWS_CATEGORIES).optional(),
  sourceName: z.string().trim().max(160).optional(),
  sourceUrl: z.string().url().max(600).optional(),
  readMinutes: z.number().int().min(1).max(120).optional(),
})

export const CommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
})

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>
export type CommentInput = z.infer<typeof CommentSchema>
