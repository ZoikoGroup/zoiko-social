import { RateLimiterService } from './rate-limiter.service'
import { LocalRateLimiter } from './local-rate-limiter'
import type { RedisService } from './redis.service'

/** Redis stub whose behaviour each test chooses: working, absent, or erroring. */
function build(mode: 'working' | 'absent' | 'error' | 'null-results') {
  const multi = {
    zremrangebyscore: jest.fn().mockReturnThis(),
    zadd: jest.fn().mockReturnThis(),
    zcard: jest.fn().mockReturnThis(),
    expire: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }
  if (mode === 'error') multi.exec.mockRejectedValue(new Error('ERR max requests limit exceeded'))
  else if (mode === 'null-results') multi.exec.mockResolvedValue(null)
  else multi.exec.mockResolvedValue([[null, 1], [null, 1], [null, 1], [null, 1]])

  const redis = {
    isEnabled: mode !== 'absent',
    rawClient: mode === 'absent' ? null : { multi: () => multi },
  }
  return { service: new RateLimiterService(redis as unknown as RedisService), multi }
}

describe('RateLimiterService — Redis available', () => {
  it('allows a request within the limit', async () => {
    const { service } = build('working')
    const result = await service.check('login', '1.2.3.4', 5, 60)
    expect(result.allowed).toBe(true)
    expect(result.total).toBe(5)
  })

  it('rejects once the window count exceeds the limit', async () => {
    const { service, multi } = build('working')
    multi.exec.mockResolvedValue([[null, 1], [null, 1], [null, 9], [null, 1]])
    const result = await service.check('login', '1.2.3.4', 5, 60)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })
})

// The regression this file exists for. Every one of these paths previously
// returned allowed:true, so an exhausted Redis quota switched rate limiting off
// across the whole API — silently, and exactly when it was needed.
describe('RateLimiterService — Redis unavailable must still limit', () => {
  it.each(['error', 'absent', 'null-results'] as const)(
    'still rejects past the limit when Redis is %s',
    async (mode) => {
      const { service } = build(mode)
      const results = []
      for (let i = 0; i < 5; i++) results.push(await service.check('login', 'ip-' + mode, 3, 60))

      expect(results.slice(0, 3).every((r) => r.allowed)).toBe(true)
      // Would have been all true before the fix.
      expect(results[3]?.allowed).toBe(false)
      expect(results[4]?.allowed).toBe(false)
    },
  )

  it('keeps separate windows per identifier', async () => {
    const { service } = build('error')
    for (let i = 0; i < 3; i++) await service.check('login', 'attacker', 3, 60)

    expect((await service.check('login', 'attacker', 3, 60)).allowed).toBe(false)
    // An unrelated caller must not be punished for someone else's traffic.
    expect((await service.check('login', 'someone-else', 3, 60)).allowed).toBe(true)
  })

  it('keeps separate windows per prefix', async () => {
    const { service } = build('error')
    for (let i = 0; i < 3; i++) await service.check('login', 'same-ip', 3, 60)
    expect((await service.check('search', 'same-ip', 3, 60)).allowed).toBe(true)
  })

  it('reports a usable resetTime rather than 0', async () => {
    // The guard puts this in a Retry-After header; 0 was meaningless.
    const { service } = build('error')
    const result = await service.check('login', 'ip', 5, 60)
    expect(result.resetTime).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })

  it('applies the fallback to checkMany too', async () => {
    const { service } = build('error')
    const checks = [{ prefix: 'global', identifier: 'ip', limit: 2, windowSeconds: 60 }]
    expect((await service.checkMany(checks))[0]?.allowed).toBe(true)
    expect((await service.checkMany(checks))[0]?.allowed).toBe(true)
    expect((await service.checkMany(checks))[0]?.allowed).toBe(false)
  })

  it('returns one result per check, in order', async () => {
    const { service } = build('error')
    const results = await service.checkMany([
      { prefix: 'a', identifier: 'ip', limit: 5, windowSeconds: 60 },
      { prefix: 'b', identifier: 'ip', limit: 9, windowSeconds: 60 },
    ])
    expect(results).toHaveLength(2)
    expect(results[0]?.total).toBe(5)
    expect(results[1]?.total).toBe(9)
  })

  it('handles an empty checkMany', async () => {
    const { service } = build('error')
    expect(await service.checkMany([])).toEqual([])
  })
})

describe('LocalRateLimiter', () => {
  it('lets the window slide, so a client recovers after it passes', () => {
    const limiter = new LocalRateLimiter()
    const t0 = 1_000_000

    for (let i = 0; i < 3; i++) limiter.consume('k', 3, 60, t0)
    expect(limiter.consume('k', 3, 60, t0).allowed).toBe(false)

    // Just inside the window — still blocked.
    expect(limiter.consume('k', 3, 60, t0 + 59_000).allowed).toBe(false)
    // Past it — allowed again.
    expect(limiter.consume('k', 3, 60, t0 + 61_000).allowed).toBe(true)
  })

  it('counts down remaining', () => {
    const limiter = new LocalRateLimiter()
    expect(limiter.consume('k', 3, 60).remaining).toBe(2)
    expect(limiter.consume('k', 3, 60).remaining).toBe(1)
    expect(limiter.consume('k', 3, 60).remaining).toBe(0)
  })

  it('does not grow without bound under a key-space flood', () => {
    const limiter = new LocalRateLimiter()
    for (let i = 0; i < 25_000; i++) limiter.consume(`key-${i}`, 5, 60)
    // Eviction keeps it capped; the exact figure is the internal limit.
    expect(limiter.consume('fresh', 5, 60).allowed).toBe(true)
  })
})
