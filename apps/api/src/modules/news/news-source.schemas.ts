import { z } from 'zod'
import { httpUrl } from '../common/schemas/http-url'

/**
 * A curated publisher.
 *
 * Every URL goes through `httpUrl` rather than the plain validator: these are
 * rendered as links and, in the feed's case, fetched by the server. A
 * `javascript:` or `file:` URL here would be both a stored-XSS vector and a way
 * to point the ingester at the local disk.
 */
export const CreateNewsSourceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  feedUrl: httpUrl(600),
  homepageUrl: httpUrl(600).optional(),
  logoUrl: httpUrl(600).optional(),
  // Whoever curates the list decides what carries an "Institutional" badge, so
  // this is a deliberate editorial act rather than something derived.
  tier: z.enum(['institutional', 'verified', 'community']).default('verified'),
  category: z.enum(['policy', 'science', 'rescue', 'health', 'climate', 'community']).default('community'),
  enabled: z.boolean().default(true),
})

export const UpdateNewsSourceSchema = CreateNewsSourceSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'Nothing to update' },
)

export type CreateNewsSourceInput = z.infer<typeof CreateNewsSourceSchema>
export type UpdateNewsSourceInput = z.infer<typeof UpdateNewsSourceSchema>
