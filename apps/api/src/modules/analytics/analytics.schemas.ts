import { z } from 'zod'

// Interaction types worth measuring for reach/engagement.
export const EVENT_TYPES = ['impression', 'view', 'profile_tap', 'link_tap'] as const
// Where the impression happened — powers "reach by source".
export const EVENT_SURFACES = ['feed', 'explore', 'hashtag', 'profile', 'dm_share', 'detail'] as const

export const IngestEventSchema = z.object({
  postId: z.string().uuid(),
  type: z.enum(EVENT_TYPES),
  surface: z.enum(EVENT_SURFACES).optional(),
  // time-on-post for `view` events (capped at 1h to reject junk)
  dwellMs: z.number().int().min(0).max(3_600_000).optional(),
})

export const IngestBatchSchema = z.object({
  // one network call carries many impressions; cap the batch to bound work
  events: z.array(IngestEventSchema).min(1).max(50),
})

export type IngestEventInput = z.infer<typeof IngestEventSchema>
export type IngestBatchInput = z.infer<typeof IngestBatchSchema>
