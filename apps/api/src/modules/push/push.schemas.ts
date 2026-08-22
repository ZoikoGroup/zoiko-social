import { z } from 'zod'

/**
 * Hosts this server must never be talked into making requests to.
 *
 * A push endpoint is a URL the server posts to, repeatedly, for as long as the
 * subscription lives — so accepting an arbitrary one turns any signed-in member
 * into a request generator pointed wherever they like, from inside the network.
 * `169.254.169.254` is the reason this matters most: it is the cloud metadata
 * service on GCP and AWS alike.
 *
 * A deny list rather than an allow list of known push services. Allowing only
 * today's four vendors would quietly break the first browser that ships a fifth,
 * and the thing actually worth preventing is reaching somewhere private.
 */
const BLOCKED_HOST = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./, // link-local, which is where cloud metadata lives
  /^\[?::1\]?$/,
  // IPv6 unique-local (fc00::/7). The hex-then-colon is load-bearing: matching
  // "starts with fc" alone also matched fcm.googleapis.com, which would have
  // blocked Chrome's push service and every Chromium browser with it.
  /^\[?f[cd][0-9a-f]{0,2}:/i,
]

function isReachablePushEndpoint(value: string): boolean {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  // Push services are HTTPS without exception, and plain HTTP would also mean
  // shipping the encrypted payload over a link anyone can read.
  if (url.protocol !== 'https:') return false

  const host = url.hostname
  return !BLOCKED_HOST.some((pattern) => pattern.test(host))
}

const pushEndpoint = z
  .string()
  .url()
  .max(2048)
  .refine(isReachablePushEndpoint, {
    message: 'Endpoint must be an https URL on a public host',
  })

/**
 * The shape `PushSubscription.toJSON()` produces in the browser, which is what
 * the client sends up verbatim. Validated rather than trusted: the endpoint is a
 * URL this server will later make requests to.
 */
export const SubscribeSchema = z.object({
  endpoint: pushEndpoint,
  keys: z.object({
    p256dh: z.string().min(1).max(512),
    auth: z.string().min(1).max(512),
  }),
})

/**
 * Unsubscribing takes the looser rule on purpose: a subscription stored before
 * the check above existed must still be removable, and deleting a row of your
 * own can harm nothing.
 */
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
