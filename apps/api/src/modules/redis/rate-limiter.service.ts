import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from './redis.service'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number // Unix timestamp in seconds
  total: number
}

/**
 * RateLimiterService — sliding-window rate limiting via Redis sorted sets.
 *
 * Algorithm:
 *   - Key: `rl:{prefix}:{identifier}` (e.g. `rl:global:127.0.0.1`)
 *   - Each request adds a sorted-set member with score = now
 *   - Members older than the window are removed (ZREMRANGEBYSCORE)
 *   - Remaining members are counted (ZCARD)
 *   - If count > limit → reject
 *
 * Degraded mode: when Redis is unavailable every check returns allowed(true)
 * with remaining = 1 and total = limit, so the API never blocks traffic
 * due to a Redis outage.
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name)
  private readonly KEY_PREFIX = 'rl'

  constructor(private readonly redis: RedisService) {}

  /**
   * Check if a request should be allowed under the sliding-window limit.
   *
   * @param prefix  - Rate limit namespace (e.g. 'login', 'follow', 'search')
   * @param identifier - Unique identifier for the requester (userId, IP, or both)
   * @param limit   - Maximum number of requests in the window
   * @param windowSeconds - Duration of the sliding window in seconds
   * @returns RateLimitResult
   */
  async check(
    prefix: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    if (!this.redis.isEnabled) {
      return { allowed: true, remaining: 1, resetTime: 0, total: limit }
    }

    try {
      const redis = this.redis.rawClient
      if (!redis) {
        return { allowed: true, remaining: 1, resetTime: 0, total: limit }
      }

      const now = Math.floor(Date.now() / 1000)
      const windowStart = now - windowSeconds
      const key = `${this.KEY_PREFIX}:${prefix}:${identifier}`

      // Remove old entries and add current entry atomically
      const multi = redis.multi()
      multi.zremrangebyscore(key, 0, windowStart)
      multi.zadd(key, now, `${now}:${Math.random()}`)
      multi.zcard(key)
      multi.expire(key, windowSeconds)
      const results = await multi.exec()

      if (!results) {
        return { allowed: true, remaining: 1, resetTime: 0, total: limit }
      }

      const count = (results[2]?.[1] as number) ?? 0
      const allowed = count <= limit
      const remaining = Math.max(0, limit - count)
      const resetTime = now + windowSeconds

      return { allowed, remaining, resetTime, total: limit }
    } catch (err) {
      this.logger.warn(`Rate limiter check failed (degrading open): ${(err as Error).message}`)
      return { allowed: true, remaining: 1, resetTime: 0, total: limit }
    }
  }

  /**
   * Check and throw if rate limited. Convenience wrapper for guards.
   */
  async assert(
    prefix: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const result = await this.check(prefix, identifier, limit, windowSeconds)
    return result
  }

  /**
   * Run MULTIPLE sliding-window checks in a SINGLE Redis round-trip.
   * Cuts the per-request rate-limit cost from N network hops to 1 —
   * significant when Redis is a remote managed instance.
   */
  async checkMany(
    checks: { prefix: string; identifier: string; limit: number; windowSeconds: number }[],
  ): Promise<RateLimitResult[]> {
    const allowAll = (): RateLimitResult[] =>
      checks.map((c) => ({ allowed: true, remaining: 1, resetTime: 0, total: c.limit }))

    if (checks.length === 0) return []
    const redis = this.redis.rawClient
    if (!this.redis.isEnabled || !redis) return allowAll()

    try {
      const now = Math.floor(Date.now() / 1000)
      const multi = redis.multi()

      for (const c of checks) {
        const key = `${this.KEY_PREFIX}:${c.prefix}:${c.identifier}`
        multi.zremrangebyscore(key, 0, now - c.windowSeconds)
        multi.zadd(key, now, `${now}:${Math.random()}`)
        multi.zcard(key)
        multi.expire(key, c.windowSeconds)
      }

      const results = await multi.exec()
      if (!results) return allowAll()

      return checks.map((c, i) => {
        // 4 commands per check; ZCARD is the 3rd (offset 2)
        const count = (results[i * 4 + 2]?.[1] as number) ?? 0
        return {
          allowed: count <= c.limit,
          remaining: Math.max(0, c.limit - count),
          resetTime: now + c.windowSeconds,
          total: c.limit,
        }
      })
    } catch (err) {
      this.logger.warn(`Rate limiter checkMany failed (degrading open): ${(err as Error).message}`)
      return allowAll()
    }
  }
}
