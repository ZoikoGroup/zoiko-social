/**
 * Shared Redis failure handling.
 *
 * Extracted from RedisService because it was needed in a second place and the
 * knowledge must not be duplicated: the messaging queue builds its own
 * connection for BullMQ, retried forever without this, and wrote 65,000 lines of
 * identical errors before taking the process down with it.
 */

/**
 * Errors where retrying is pointless. An exhausted request quota does not
 * recover by asking again, and every retry spends another request against the
 * limit — the outage ends up caused by the retrying rather than by Redis.
 *
 * Credential failures are the same shape of problem: retrying a wrong password
 * is never going to start working.
 */
export const FATAL_REDIS_ERROR =
  /max requests limit exceeded|max daily request limit|WRONGPASS|NOAUTH|invalid password/i

export function isFatalRedisError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err)
  return FATAL_REDIS_ERROR.test(message)
}

/**
 * Logs the first occurrence of each distinct error immediately, then at most once
 * a minute, reporting how many were suppressed. Keeps the signal without the flood.
 */
export class ThrottledErrorLog {
  private readonly seen = new Map<string, { last: number; suppressed: number }>()

  /** Returns the line to log, or null when this one should be swallowed. */
  next(key: string, now = Date.now()): string | null {
    const entry = this.seen.get(key)
    if (!entry) {
      this.seen.set(key, { last: now, suppressed: 0 })
      return key
    }
    if (now - entry.last < 60_000) {
      entry.suppressed++
      return null
    }
    const { suppressed } = entry
    entry.last = now
    entry.suppressed = 0
    return suppressed > 0 ? `${key} (${suppressed} identical suppressed in the last minute)` : key
  }
}
