import { z } from 'zod'

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const RESERVED_SLUGS = new Set([
  'create', 'new', 'explore', 'trending', 'popular', 'recommended', 'search',
  'admin', 'settings', 'about', 'api', 'help', 'support', 'zoiko', 'zoikosocial',
  'communities', 'community', 'c', 'all', 'categories', 'invites', 'me',
])

const ruleSchema = z.object({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(500).optional(),
})

export const CreateCommunitySchema = z.object({
  name: z.string().trim().min(3).max(60),
  slug: z.string().trim().min(3).max(40),
  description: z.string().max(1000).optional(),
  categoryId: z.string().uuid(),
  privacy: z.enum(['public', 'private', 'invite_only']).optional(),
  tags: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
  avatarUrl: z.string().url().max(600).optional(),
  coverUrl: z.string().url().max(600).optional(),
  rules: z.array(ruleSchema).max(15).optional(),
})

export const UpdateCommunitySchema = z.object({
  name: z.string().trim().min(3).max(60).optional(),
  description: z.string().max(1000).optional().nullable(),
  categoryId: z.string().uuid().optional(),
  privacy: z.enum(['public', 'private', 'invite_only']).optional(),
  tags: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
  avatarUrl: z.string().url().max(600).optional().nullable(),
  coverUrl: z.string().url().max(600).optional().nullable(),
})

export const UpdateRulesSchema = z.object({
  rules: z.array(ruleSchema).max(15),
})

export const JoinSchema = z.object({
  acceptRules: z.boolean().optional(),
})

export const SetRoleSchema = z.object({
  role: z.enum(['admin', 'moderator', 'member']),
})

export const MuteSchema = z.object({
  duration: z.enum(['1h', '24h', '7d']),
})

export const TransferOwnershipSchema = z.object({
  userId: z.string().uuid(),
})

export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>
export type UpdateRulesInput = z.infer<typeof UpdateRulesSchema>
export type JoinInput = z.infer<typeof JoinSchema>
export type SetRoleInput = z.infer<typeof SetRoleSchema>
export type MuteInput = z.infer<typeof MuteSchema>
