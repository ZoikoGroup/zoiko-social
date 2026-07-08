import { z } from 'zod'

export const MediaItemSchema = z.object({
  url: z.string().url().max(600),
  thumbnailUrl: z.string().url().max(600).optional(),
  width: z.number().int().positive().max(10_000).optional(),
  height: z.number().int().positive().max(10_000).optional(),
  fileSize: z.number().int().positive().max(50 * 1024 * 1024).optional(),
  blurhash: z.string().max(120).optional(),
  position: z.number().int().min(0).max(9),
})

export const POST_KINDS = ['standard', 'rescue_case', 'vet_tip', 'lost_found', 'wildlife'] as const

/** Structured, kind-specific fields (all optional; permissive but bounded). */
export const PostMetadataSchema = z.object({
  species: z.string().max(120).optional(),
  condition: z.string().max(300).optional(),
  supportNeeded: z.array(z.string().max(60)).max(6).optional(),
  verifiedBy: z.string().max(120).optional(),
  petName: z.string().max(120).optional(),
  lastSeen: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
})

export const CreatePostSchema = z
  .object({
    caption: z.string().max(2200).optional(),
    visibility: z.enum(['public', 'followers']).optional(),
    commentsDisabled: z.boolean().optional(),
    media: z.array(MediaItemSchema).max(10).optional(),
    kind: z.enum(POST_KINDS).optional(),
    metadata: PostMetadataSchema.optional(),
    communityId: z.string().uuid().optional(),
  })
  .refine((body) => (body.caption?.trim()?.length ?? 0) > 0 || (body.media?.length ?? 0) > 0, {
    message: 'A post needs a caption or at least one image',
    path: ['caption'],
  })

export const UpdatePostSchema = z.object({
  caption: z.string().max(2200).optional(),
  commentsDisabled: z.boolean().optional(),
})

export const CreateCommentSchema = z.object({
  body: z.string().trim().min(1).max(1000),
  parentId: z.string().uuid().optional(),
})

export const UpdateCommentSchema = z.object({
  body: z.string().trim().min(1).max(1000),
})

export const ShareSchema = z.object({
  type: z.enum(['link', 'internal', 'external']),
  /** For internal shares: users to deliver the post to (as notifications until DMs ship) */
  recipients: z.array(z.string().uuid()).max(10).optional(),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>
export type ShareInput = z.infer<typeof ShareSchema>
