import { PresenceService } from './presence.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { RealtimeService } from '../realtime/realtime.service'

/**
 * Presence expires on purpose, and something has to push back.
 *
 * The expiry exists so a crashed API cannot leave people showing "online"
 * forever: a process that dies never runs setOffline, so the record has to go
 * stale on its own. But nothing ever refreshed it — connecting stamped the
 * record once and that was the last word — so every member went offline a
 * minute after arriving while still reading the page.
 *
 * These pin both halves: the stamp keeps moving while a socket is open, and it
 * stops moving the moment one is not.
 */

const USER = 'member-1'

function build(opts: { row?: { status: string } | null; redis?: boolean } = {}) {
  const update = jest.fn().mockImplementation(async () =>
    opts.row === undefined ? { status: 'online' } : opts.row === null ? Promise.reject(new Error('no row')) : opts.row,
  )
  const prisma = { userPresence: { update } }
  const hset = jest.fn().mockResolvedValue(undefined)
  const expire = jest.fn().mockResolvedValue(undefined)
  const redis = { rawClient: opts.redis === false ? null : { hset, expire } }
  const service = new PresenceService(
    prisma as unknown as PrismaService,
    redis as unknown as RedisService,
    {} as unknown as RealtimeService,
  )
  return { service, update, hset, expire }
}

describe('PresenceService.touch — the heartbeat', () => {
  it('moves the freshness stamp forward while the socket is open', async () => {
    const { service, update } = build()
    await service.touch(USER)
    expect(update).toHaveBeenCalledTimes(1)
    const call = update.mock.calls[0]![0]
    expect(call.where).toEqual({ userId: USER })
    expect(call.data.lastSeen).toBeInstanceOf(Date)
  })

  it('never changes the status, so away and do-not-disturb survive activity', async () => {
    // Someone who marked themselves away is still away however much they scroll.
    const { service, update } = build({ row: { status: 'away' } })
    await service.touch(USER)
    expect(update.mock.calls[0]![0].data).not.toHaveProperty('status')
  })

  it('refreshes the cached copy and its expiry to match', async () => {
    const { service, hset, expire } = build({ row: { status: 'online' } })
    await service.touch(USER)
    expect(hset).toHaveBeenCalled()
    // The TTL has to be renewed too — writing the value and leaving the old
    // expiry in place would let the key die mid-session anyway.
    expect(expire).toHaveBeenCalled()
    expect(expire.mock.calls[0]![1]).toBeGreaterThan(60)
  })

  it('still records the beat when the cache is unavailable', async () => {
    // Redis is the fast path, not the record. With it gone the database row is
    // what getPresence reads, so the beat must reach it regardless.
    const { service, update } = build({ redis: false })
    await service.touch(USER)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('ignores a beat from a member with no presence row', async () => {
    // The row is created when the socket connects. A beat without one means the
    // disconnect already ran, and recreating it would put them back online.
    const { service, hset } = build({ row: null })
    await expect(service.touch(USER)).resolves.toBeUndefined()
    expect(hset).not.toHaveBeenCalled()
  })

  it('throttles a client that beats far too often', async () => {
    const { service, update } = build()
    await service.touch(USER)
    await service.touch(USER)
    await service.touch(USER)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('throttles each member separately', async () => {
    const { service, update } = build()
    await service.touch('one')
    await service.touch('two')
    expect(update).toHaveBeenCalledTimes(2)
  })

  it('accepts the next beat once the throttle window has passed', async () => {
    jest.useFakeTimers()
    try {
      const { service, update } = build()
      await service.touch(USER)
      jest.advanceTimersByTime(11_000)
      await service.touch(USER)
      expect(update).toHaveBeenCalledTimes(2)
    } finally {
      jest.useRealTimers()
    }
  })
})
