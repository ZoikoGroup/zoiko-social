import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from './redis.service'
import { LocalRateLimiter } from './local-rate-limiter'

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
 * Degraded mode: when Redis cannot answer, checks fall back to an in-process
 * sliding window (see LocalRateLimiter) rather than allowing everything. This
 * previously returned allowed(true) on any Redis error, which meant an exhausted
 * Redis quota switched rate limiting off across the entire API — silently, and at
 * precisely the moment a limiter matters. Per-pod accounting is a weaker bound
 * than a shared one, but it is a bound.
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name)
  private readonly KEY_PREFIX = 'rl'
  private readonly local = new LocalRateLimiter()
  /** Redis failures are per-request; without throttling this logs on every one. */
  private lastDegradedLogAt = 0

  constructor(private readonly redis: RedisService) {}

  /** Logs the fall-back at most once a minute, so an outage cannot flood the logs. */
  private noteDegraded(context: string, message: string): void {
    const now = Date.now()
    if (now - this.lastDegradedLogAt > 60_000) {
      this.lastDegradedLogAt = now
      this.logger.warn(`Rate limiter ${context} falling back to in-process limits: ${message}`)
    }
  }

  /** Applies the in-process window and shapes it like a Redis result. */
  private localResult(
    prefix: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): RateLimitResult {
    const { allowed, remaining } = this.local.consume(
      `${this.KEY_PREFIX}:${prefix}:${identifier}`,
      limit,
      windowSeconds,
    )
    return {
      allowed,
      remaining,
      resetTime: Math.floor(Date.now() / 1000) + windowSeconds,
      total: limit,
    }
  }

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
      // No Redis configured at all — local limiting is the only option.
      return this.localResult(prefix, identifier, limit, windowSeconds)
    }

    try {
      const redis = this.redis.rawClient
      if (!redis) {
        return this.localResult(prefix, identifier, limit, windowSeconds)
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
        return this.localResult(prefix, identifier, limit, windowSeconds)
      }

      const count = (results[2]?.[1] as number) ?? 0
      const allowed = count <= limit
      const remaining = Math.max(0, limit - count)
      const resetTime = now + windowSeconds

      return { allowed, remaining, resetTime, total: limit }
    } catch (err) {
      this.noteDegraded('check', (err as Error).message)
      return this.localResult(prefix, identifier, limit, windowSeconds)
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
    // Same reasoning as check(): a Redis failure must not mean no limit at all.
    const localAll = (): RateLimitResult[] =>
      checks.map((c) => this.localResult(c.prefix, c.identifier, c.limit, c.windowSeconds))

    if (checks.length === 0) return []
    const redis = this.redis.rawClient
    if (!this.redis.isEnabled || !redis) return localAll()

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
      if (!results) return localAll()

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
      this.noteDegraded('checkMany', (err as Error).message)
      return localAll()
    }
  }
}
