import { Reflector } from '@nestjs/core'
import type { ExecutionContext } from '@nestjs/common'
import { RateLimiterGuard } from './rate-limiter.guard'
import type { RateLimiterService } from '../../redis/rate-limiter.service'

/**
 * The identifier the limiter counts against.
 *
 * The API sits behind Cloudflare, so `request.ip` is an edge address shared by
 * every anonymous caller routed through that datacentre. Counting against it put
 * all of them in one bucket — one abuser exhausted the allowance for everybody
 * and a per-IP limit isolated nobody. These tests pin the resulting rule so a
 * future refactor cannot quietly restore that behaviour.
 */

function contextFor(request: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => function handler() {},
    getClass: () => class Controller {},
  } as unknown as ExecutionContext
}

/** Captures what the limiter was asked to count, without touching Redis. */
function makeLimiter() {
  const calls: { prefix: string; identifier: string }[] = []
  const service = {
    checkMany: async (
      checks: { prefix: string; identifier: string; limit: number; windowSeconds: number }[],
    ) => {
      calls.push(...checks.map((c) => ({ prefix: c.prefix, identifier: c.identifier })))
      return checks.map(() => ({ allowed: true, remaining: 1, resetTime: 0, total: 10 }))
    },
    assert: async () => ({ allowed: true, remaining: 1, resetTime: 0, total: 10 }),
  } as unknown as RateLimiterService
  return { service, calls }
}

describe('RateLimiterGuard — which caller gets counted', () => {
  it('prefers CF-Connecting-IP over the Cloudflare edge address', async () => {
    const { service, calls } = makeLimiter()
    const guard = new RateLimiterGuard(new Reflector(), service)

    await guard.canActivate(
      contextFor({
        method: 'POST',
        url: '/api/v1/auth/login',
        ip: '172.68.1.1', // a Cloudflare edge, identical for many real users
        headers: { 'cf-connecting-ip': '203.0.113.7' },
      }),
    )

    expect(calls.length).toBeGreaterThan(0)
    for (const call of calls) expect(call.identifier).toBe('203.0.113.7')
  })

  it('gives two callers behind one edge separate buckets', async () => {
    const { service, calls } = makeLimiter()
    const guard = new RateLimiterGuard(new Reflector(), service)

    for (const client of ['203.0.113.7', '203.0.113.8']) {
      await guard.canActivate(
        contextFor({
          method: 'POST',
          url: '/api/v1/auth/login',
          ip: '172.68.1.1',
          headers: { 'cf-connecting-ip': client },
        }),
      )
    }

    // The whole point of the fix: same edge, different identifiers.
    const identifiers = new Set(calls.map((c) => c.identifier))
    expect(identifiers).toEqual(new Set(['203.0.113.7', '203.0.113.8']))
  })

  it('ignores a client-supplied X-Forwarded-For', async () => {
    const { service, calls } = makeLimiter()
    const guard = new RateLimiterGuard(new Reflector(), service)

    await guard.canActivate(
      contextFor({
        method: 'POST',
        url: '/api/v1/auth/login',
        ip: '198.51.100.4',
        // Forgeable on a direct connection. Honouring it would let an attacker
        // mint a fresh identity per request and evade the limit entirely.
        headers: { 'x-forwarded-for': '203.0.113.99' },
      }),
    )

    for (const call of calls) expect(call.identifier).toBe('198.51.100.4')
  })

  it('falls back to request.ip when Cloudflare has not set the header', async () => {
    const { service, calls } = makeLimiter()
    const guard = new RateLimiterGuard(new Reflector(), service)

    await guard.canActivate(
      contextFor({
        method: 'POST',
        url: '/api/v1/auth/login',
        ip: '198.51.100.4',
        headers: {},
      }),
    )

    for (const call of calls) expect(call.identifier).toBe('198.51.100.4')
  })

  it('still keys an authenticated caller by user id, not address', async () => {
    const { service, calls } = makeLimiter()
    const guard = new RateLimiterGuard(new Reflector(), service)

    await guard.canActivate(
      contextFor({
        method: 'POST',
        url: '/api/v1/auth/login',
        ip: '172.68.1.1',
        headers: { 'cf-connecting-ip': '203.0.113.7' },
        auth_user: { id: 'user-123' },
      }),
    )

    for (const call of calls) expect(call.identifier).toBe('user-123')
  })
})
