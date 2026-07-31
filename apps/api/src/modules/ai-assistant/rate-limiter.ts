import { Injectable } from '@nestjs/common'

/**
 * Per-member allowance on assistant replies, as a soft abuse and cost guard.
 *
 * Deliberately in-process rather than Redis-backed: the shared Redis instance is
 * currently over its request quota, and this only needs to stop one member from
 * looping thousands of completions — approximate per-pod accounting is fine for
 * that. Swap to Redis if the limit ever needs to be exact across instances.
 */

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 20
/** Bounds memory if a lot of members chat in one window; oldest entries drop first. */
const MAX_TRACKED_USERS = 10_000

@Injectable()
export class AiRateLimiter {
  private readonly hits = new Map<string, number[]>()

  /** Records an attempt and reports whether it is within the member's allowance. */
  consume(userId: string, now = Date.now()): boolean {
    const cutoff = now - WINDOW_MS
    const recent = (this.hits.get(userId) ?? []).filter((t) => t > cutoff)

    if (recent.length >= MAX_PER_WINDOW) {
      this.hits.set(userId, recent)
      return false
    }

    recent.push(now)

    if (!this.hits.has(userId) && this.hits.size >= MAX_TRACKED_USERS) {
      const oldest = this.hits.keys().next().value
      if (oldest !== undefined) this.hits.delete(oldest)
    }

    this.hits.set(userId, recent)
    return true
  }

  /** Replies still available to this member in the current window. */
  remaining(userId: string, now = Date.now()): number {
    const cutoff = now - WINDOW_MS
    const recent = (this.hits.get(userId) ?? []).filter((t) => t > cutoff)
    return Math.max(0, MAX_PER_WINDOW - recent.length)
  }
}
