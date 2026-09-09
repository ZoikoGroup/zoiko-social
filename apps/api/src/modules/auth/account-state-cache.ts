/**
 * A short-lived memory of each member's account state, read by the auth guard on
 * every authenticated request and cleared by whatever changes that state.
 */

export type AccountState = {
  state: string
  deactivatedAt: Date | null
  deletionRequestedAt: Date | null
} | null

/**
 * The account-state lookup, remembered for a few seconds.
 *
 * Every authenticated request re-read the same row, and one database round-trip
 * is 150 ms from here — on a screen that calls eight endpoints, that is 1.2 s
 * spent asking the same question eight times.
 *
 * The trade-off is enforcement lag: a moderator's suspension takes effect up to
 * ACCOUNT_STATE_TTL_MS late for someone already sending requests. Five seconds is
 * short enough to be unusable as a workaround and long enough to collapse a page
 * load's worth of calls into one read. The window is deliberately small rather
 * than absent — the check exists for Trust & Safety, so it must not go stale in
 * any way a suspended member could actually exploit.
 *
 * Kept per-process and unshared on purpose: a cache miss costs one read, so
 * co-ordinating this across instances would buy nothing.
 */
export const ACCOUNT_STATE_TTL_MS = 5_000
export const ACCOUNT_STATE_MAX_ENTRIES = 20_000

export class AccountStateCache {
  private readonly entries = new Map<string, { value: AccountState; expires: number }>()

  get(userId: string, now: number): { value: AccountState } | null {
    const hit = this.entries.get(userId)
    if (!hit) return null
    if (hit.expires <= now) {
      this.entries.delete(userId)
      return null
    }
    return { value: hit.value }
  }

  set(userId: string, value: AccountState, now: number): void {
    // Expired entries are only dropped on read, so a large burst of one-off users
    // would otherwise grow this without bound. Sweep before it gets big.
    if (this.entries.size >= ACCOUNT_STATE_MAX_ENTRIES) {
      for (const [key, entry] of this.entries) {
        if (entry.expires <= now) this.entries.delete(key)
      }
      // Still full: everything is live, so give up the oldest insertions.
      if (this.entries.size >= ACCOUNT_STATE_MAX_ENTRIES) {
        let drop = Math.ceil(ACCOUNT_STATE_MAX_ENTRIES / 10)
        for (const key of this.entries.keys()) {
          this.entries.delete(key)
          if (--drop <= 0) break
        }
      }
    }
    this.entries.set(userId, { value, expires: now + ACCOUNT_STATE_TTL_MS })
  }

  /** Called when a state change must be visible immediately rather than in 5 s. */
  invalidate(userId: string): void {
    this.entries.delete(userId)
  }
}

export const accountStateCache = new AccountStateCache()
