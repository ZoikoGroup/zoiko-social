import { z } from 'zod'

// ── Shared sub-schemas ──────────────────────────────────────────────────────

export const StoryMediaItemSchema = z.object({
  path: z.string().min(1).max(600),
  width: z.number().int().positive().max(10_000).optional(),
  height: z.number().int().positive().max(10_000).optional(),
  blurhash: z.string().max(120).optional(),
  durationMs: z.number().int().positive().max(15_000).optional(),
})

export const StickerTransformSchema = z.object({
  x: z.number(),
  y: z.number(),
  scale: z.number().min(0.1).max(5).optional(),
  rotation: z.number().min(-360).max(360).optional(),
  z: z.number().int().optional(),
})

export const StickerSchema = z.object({
  kind: z.enum(['emoji', 'text', 'gif', 'mention', 'hashtag', 'time', 'date']),
  payload: z.record(z.unknown()),
  transform: StickerTransformSchema,
})

export const MusicRefSchema = z.object({
  trackId: z.string().uuid(),
  startMs: z.number().int().min(0).optional(),
  durationMs: z.number().int().positive().optional(),
  volume: z.number().int().min(0).max(100).optional(),
  fadeIn: z.boolean().optional(),
  fadeOut: z.boolean().optional(),
  muteOriginal: z.boolean().optional(),
})

// ── Upload URL query ─────────────────────────────────────────────────────────

export const UploadUrlQuerySchema = z.object({
  kind: z.enum(['image', 'video']),
  mime: z.string().regex(/^(image|video)\/\w+$/, 'Must be a valid image or video MIME type'),
})

// ── Create story body ────────────────────────────────────────────────────────

export const CreateStorySchema = z
  .object({
    type: z.enum([
      'photo',
      'video',
      'text',
      'shared_post',
      'shared_professional_profile',
      'shared_community_post',
    ]),
    privacy: z.enum(['public', 'followers', 'close_friends', 'professional']).optional(),
    media: z.array(StoryMediaItemSchema).max(10).optional(),
    caption: z.string().max(2200).optional(),
    background: z
      .object({
        gradient: z.string().optional(),
        color: z.string().optional(),
        font: z.string().optional(),
        align: z.enum(['left', 'center', 'right']).optional(),
      })
      .optional(),
    refType: z.enum(['feed_post', 'profile', 'community_post']).optional(),
    refId: z.string().uuid().optional(),
    stickers: z.array(StickerSchema).max(20).optional(),
    mentions: z.array(z.string()).max(20).optional(),
    hashtags: z.array(z.string().max(50)).max(30).optional(),
    music: MusicRefSchema.optional(),
    allowReplies: z.boolean().optional(),
    allowReactions: z.boolean().optional(),
  })
  .refine(
    (body) => {
      // photo/video/text need no ref; shared types need refType+refId
      if (['photo', 'video', 'text'].includes(body.type)) return true
      return !!body.refType && !!body.refId
    },
    { message: 'Shared story types require refType and refId', path: ['refType'] },
  )
  .refine(
    (body) => {
      if (body.type === 'text') return !!body.background?.gradient || !!body.background?.color || !!body.caption
      if (body.type === 'photo' || body.type === 'video') return (body.media?.length ?? 0) > 0 || !!body.caption
      return true
    },
    { message: 'Story must have content (media, caption, or background)', path: ['caption'] },
  )

export const StoryViewSchema = z.object({
  completionPct: z.number().int().min(0).max(100),
})

export const StoryReactionSchema = z.object({
  kind: z.enum(['emoji', 'quick_reply', 'dm_reply', 'share', 'report']),
  emoji: z.string().max(10).optional(),
  message: z.string().max(1000).optional(),
})

export const StoryReportSchema = z.object({
  reason: z.string().min(1).max(500),
})

// ── Types ────────────────────────────────────────────────────────────────────

export type CreateStoryInput = z.infer<typeof CreateStorySchema>
export type UploadUrlQuery = z.infer<typeof UploadUrlQuerySchema>
export type StoryViewInput = z.infer<typeof StoryViewSchema>
export type StoryReactionInput = z.infer<typeof StoryReactionSchema>
export type StoryReportInput = z.infer<typeof StoryReportSchema>
export type StoryMediaItemInput = z.infer<typeof StoryMediaItemSchema>
