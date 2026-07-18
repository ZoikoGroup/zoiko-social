import { z } from 'zod'

// Suggested values for discoverability — NOT enforced. Event type/surface are
// free-form so new event kinds need no code change.
export const EVENT_TYPES = ['impression', 'view', 'profile_tap', 'link_tap', 'video_watch'] as const
export const EVENT_SURFACES = ['feed', 'explore', 'hashtag', 'profile', 'dm_share', 'detail'] as const

// Extensible metadata bag — scalar values only (no nested objects/arrays), so
// it stays cheap to store and safe to group by. Bounded to prevent abuse.
const PropValue = z.union([z.string().max(500), z.number(), z.boolean(), z.null()])
const PropsSchema = z
  .record(PropValue)
  .refine((p) => Object.keys(p).length <= 25, { message: 'Too many prop keys (max 25)' })
  .refine((p) => Object.keys(p).every((k) => /^[a-zA-Z0-9_.]{1,40}$/.test(k)), {
    message: 'Prop keys must be alphanumeric/underscore/dot, max 40 chars',
  })

export const IngestEventSchema = z.object({
  postId: z.string().uuid(),
  type: z.string().min(1).max(40),
  surface: z.string().max(40).optional(),
  // time-on-post for view/watch events (capped at 1h to reject junk)
  dwellMs: z.number().int().min(0).max(3_600_000).optional(),
  // arbitrary event-specific metadata (video %, referrer, cta id, variant, …)
  props: PropsSchema.optional(),
})

export const IngestBatchSchema = z.object({
  events: z.array(IngestEventSchema).min(1).max(50),
})

export type IngestEventInput = z.infer<typeof IngestEventSchema>
export type IngestBatchInput = z.infer<typeof IngestBatchSchema>
