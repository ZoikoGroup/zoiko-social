import { SetMetadata } from '@nestjs/common'

export const RATE_LIMIT_KEY = 'rate_limit'

export interface RateLimitMetadata {
  /** Requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
  /** Optional prefix override (defaults to route name) */
  prefix?: string
}

/**
 * Decorator to set a custom rate limit on a route handler.
 *
 * Usage:
 *   @RateLimit({ limit: 10, windowSeconds: 60 })  // 10 requests per minute
 *   @Post('login')
 *   async login() { ... }
 *
 * When not specified, the default global rate limit applies.
 */
export const RateLimit = (metadata: RateLimitMetadata) =>
  SetMetadata(RATE_LIMIT_KEY, metadata)
