import { z } from 'zod'

/**
 * The shape `PushSubscription.toJSON()` produces in the browser, which is what
 * the client sends up verbatim. Validated rather than trusted: the endpoint is a
 * URL this server will later make requests to, so it has to be a URL.
 */
export const SubscribeSchema = z.object({
  endpoint: z.string().url().max(2048),
  keys: z.object({
    p256dh: z.string().min(1).max(512),
    auth: z.string().min(1).max(512),
  }),
})

export const UnsubscribeSchema = z.object({
  endpoint: z.string().url().max(2048),
})

export type SubscribeInput = z.infer<typeof SubscribeSchema>
export type UnsubscribeInput = z.infer<typeof UnsubscribeSchema>

/**
 * A single category toggle. The key is checked against the registry in the
 * service rather than enumerated here, so adding a category needs one change
 * rather than two.
 */
export const SetPreferenceSchema = z.object({
  preferenceKey: z.string().min(1).max(64),
  enabled: z.boolean(),
})

export type SetPreferenceInput = z.infer<typeof SetPreferenceSchema>
