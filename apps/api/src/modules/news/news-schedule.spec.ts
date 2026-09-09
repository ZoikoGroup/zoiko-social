import { NewsScheduleService } from './news-schedule.service'
import type { NewsIngestService } from './news-ingest.service'
import type { PrismaService } from '../prisma/prisma.service'

/**
 * The scheduled news refresh.
 *
 * The behaviour that matters is not "a timer exists" but "it only fetches when
 * something is actually due, and never twice at once" — the two properties that
 * make it safe to run on more than one instance and safe to restart in a loop.
 */

function makeService(opts: { due: number; ingest?: () => Promise<unknown> }) {
  const calls = { count: 0 }
  const ingest = {
    ingestAll: async () => {
      calls.count++
      if (opts.ingest) await opts.ingest()
      return { sources: 1, created: 3, removed: 0, results: [] }
    },
  } as unknown as NewsIngestService

  const prisma = {
    newsSource: { count: async () => opts.due },
  } as unknown as PrismaService

  return { service: new NewsScheduleService(ingest, prisma), calls }
}

describe('NewsScheduleService', () => {
  it('does nothing when every source was refreshed recently', async () => {
    const { service, calls } = makeService({ due: 0 })

    await expect(service.runIfDue()).resolves.toBe(false)
    expect(calls.count).toBe(0)
  })

  it('ingests when a source is stale', async () => {
    const { service, calls } = makeService({ due: 2 })

    await expect(service.runIfDue()).resolves.toBe(true)
    expect(calls.count).toBe(1)
  })

  it('does not start a second run while one is still going', async () => {
    let release: (() => void) | undefined
    const inFlight = new Promise<void>((resolve) => { release = resolve })
    const { service, calls } = makeService({ due: 1, ingest: () => inFlight })

    const first = service.runIfDue()
    // The tick that lands while the first run is mid-flight must be dropped,
    // or a slow publisher would stack overlapping ingests.
    await expect(service.runIfDue()).resolves.toBe(false)

    release?.()
    await expect(first).resolves.toBe(true)
    expect(calls.count).toBe(1)
  })

  it('survives a failing ingest instead of taking the process down', async () => {
    const { service } = makeService({
      due: 1,
      ingest: () => Promise.reject(new Error('publisher unreachable')),
    })

    await expect(service.runIfDue()).resolves.toBe(false)
  })

  it('runs again after a failure — one bad cycle is not permanent', async () => {
    let fail = true
    const { service, calls } = makeService({
      due: 1,
      ingest: () => {
        if (fail) { fail = false; return Promise.reject(new Error('temporary')) }
        return Promise.resolve()
      },
    })

    await expect(service.runIfDue()).resolves.toBe(false)
    await expect(service.runIfDue()).resolves.toBe(true)
    expect(calls.count).toBe(2)
  })

  it('schedules nothing when disabled by env', () => {
    const previous = process.env.NEWS_INGEST_DISABLED
    process.env.NEWS_INGEST_DISABLED = 'true'
    try {
      const { service } = makeService({ due: 5 })
      service.onModuleInit()
      // No timers to clean up, and onModuleDestroy must stay safe to call.
      expect(() => service.onModuleDestroy()).not.toThrow()
    } finally {
      if (previous === undefined) delete process.env.NEWS_INGEST_DISABLED
      else process.env.NEWS_INGEST_DISABLED = previous
    }
  })

  it('clears its timers on shutdown', () => {
    const previous = process.env.NEWS_INGEST_DISABLED
    delete process.env.NEWS_INGEST_DISABLED
    try {
      const { service } = makeService({ due: 0 })
      service.onModuleInit()
      expect(() => service.onModuleDestroy()).not.toThrow()
      // Idempotent: shutdown can be called twice without a null deref.
      expect(() => service.onModuleDestroy()).not.toThrow()
    } finally {
      if (previous !== undefined) process.env.NEWS_INGEST_DISABLED = previous
    }
  })
})
