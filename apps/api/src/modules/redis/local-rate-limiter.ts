/**
 * In-process sliding-window counter, used as the fallback when Redis cannot
 * answer a rate-limit check.
 *
 * Redis is the primary limiter because it is shared across pods. When it is
 * unavailable the previous behaviour was to allow every request — which meant an
 * exhausted Redis quota silently switched rate limiting off across the whole API,
 * exactly when a limiter is most likely to be needed.
 *
 * Per-pod accounting is weaker than a shared window: with N pods a client can get
 * up to N × limit. That is still a bound, and vastly better than none. Kept
 * deliberately simple — no timers, pruning happens on read.
 */

/** Bounds memory under a key-space flood; oldest keys are evicted first. */
const MAX_TRACKED_KEYS = 20_000

export class LocalRateLimiter {
  private readonly hits = new Map<string, number[]>()

  /**
   * Records a hit and reports whether it falls within the limit.
   *
   * `limit` and `windowSeconds` are passed per call rather than fixed at
   * construction, because every route carries its own allowance.
   */
  consume(key: string, limit: number, windowSeconds: number, now = Date.now()): {
    allowed: boolean
    remaining: number
  } {
    const cutoff = now - windowSeconds * 1000
    const recent = (this.hits.get(key) ?? []).filter((t) => t > cutoff)

    if (recent.length >= limit) {
      this.hits.set(key, recent)
      return { allowed: false, remaining: 0 }
    }

    recent.push(now)

    if (!this.hits.has(key) && this.hits.size >= MAX_TRACKED_KEYS) {
      const oldest = this.hits.keys().next().value
      if (oldest !== undefined) this.hits.delete(oldest)
    }
    this.hits.set(key, recent)

    return { allowed: true, remaining: Math.max(0, limit - recent.length) }
  }

  /** Test seam. */
  reset(): void {
    this.hits.clear()
  }
}
