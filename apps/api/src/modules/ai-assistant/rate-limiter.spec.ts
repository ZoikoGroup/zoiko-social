import { AiRateLimiter } from './rate-limiter'

const HOUR_MS = 60 * 60 * 1000
const LIMIT = 20

describe('AiRateLimiter', () => {
  let limiter: AiRateLimiter

  beforeEach(() => {
    limiter = new AiRateLimiter()
  })

  it('allows requests up to the limit and denies the next one', () => {
    const now = 1_000_000
    for (let i = 0; i < LIMIT; i++) {
      expect(limiter.consume('user-1', now)).toBe(true)
    }
    expect(limiter.consume('user-1', now)).toBe(false)
  })

  it('tracks each member separately', () => {
    const now = 1_000_000
    for (let i = 0; i < LIMIT; i++) limiter.consume('user-1', now)

    expect(limiter.consume('user-1', now)).toBe(false)
    expect(limiter.consume('user-2', now)).toBe(true)
  })

  it('allows requests again once the window has passed', () => {
    const now = 1_000_000
    for (let i = 0; i < LIMIT; i++) limiter.consume('user-1', now)
    expect(limiter.consume('user-1', now)).toBe(false)

    expect(limiter.consume('user-1', now + HOUR_MS + 1)).toBe(true)
  })

  it('slides rather than resetting in fixed blocks', () => {
    const start = 1_000_000
    // Spend the whole allowance across the first half hour.
    for (let i = 0; i < LIMIT; i++) limiter.consume('user-1', start + i)
    expect(limiter.consume('user-1', start + HOUR_MS - 1)).toBe(false)

    // Just past the hour those early hits expire, freeing capacity again.
    expect(limiter.consume('user-1', start + HOUR_MS + 1)).toBe(true)
  })

  it('does not consume the allowance on a denied attempt', () => {
    const now = 1_000_000
    for (let i = 0; i < LIMIT; i++) limiter.consume('user-1', now)

    limiter.consume('user-1', now)
    limiter.consume('user-1', now)

    // Still exactly at the limit, not above it — denied attempts are not recorded.
    expect(limiter.remaining('user-1', now)).toBe(0)
    expect(limiter.consume('user-1', now + HOUR_MS + 1)).toBe(true)
  })

  describe('remaining', () => {
    it('reports the full allowance for an unseen member', () => {
      expect(limiter.remaining('nobody')).toBe(LIMIT)
    })

    it('decreases as the allowance is spent', () => {
      const now = 1_000_000
      limiter.consume('user-1', now)
      limiter.consume('user-1', now)
      expect(limiter.remaining('user-1', now)).toBe(LIMIT - 2)
    })

    it('recovers after the window', () => {
      const now = 1_000_000
      for (let i = 0; i < LIMIT; i++) limiter.consume('user-1', now)
      expect(limiter.remaining('user-1', now)).toBe(0)
      expect(limiter.remaining('user-1', now + HOUR_MS + 1)).toBe(LIMIT)
    })
  })
})
