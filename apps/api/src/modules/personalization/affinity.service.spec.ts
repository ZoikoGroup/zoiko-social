import { AffinityService, AFFINITY_WEIGHTS, EMPTY_AFFINITY } from './affinity.service'
import type { AffinitySignalPost } from './affinity.service'
import type { RedisService } from '../redis/redis.service'
import type { ConfigService } from '../config/config.service'

function makeConfig(overrides: Record<string, unknown> = {}): Pick<ConfigService, 'personalizationEnabled' | 'affinityTtlDays'> {
  return {
    personalizationEnabled: true,
    affinityTtlDays: 60,
    ...overrides,
  } as ConfigService
}

function makeRedis() {
  const calls: { dimension: string; userId: string; field: string; delta: number; ttl: number }[] = []
  const affinityGetAll = jest.fn<Promise<Map<string, number> | null>, [string, string]>().mockResolvedValue(null)
  return {
    affinityIncr: jest.fn(async (userId: string, dimension: string, field: string, delta: number, ttl: number) => {
      calls.push({ dimension, userId, field, delta, ttl })
    }),
    affinityGetAll,
    calls,
  }
}

describe('AffinityService.getTopTags', () => {
  it('returns the top tags by affinity score, capped at the limit', async () => {
    const redis = makeRedis()
    redis.affinityGetAll.mockImplementation(async (_userId, dimension) =>
      dimension === 'tag'
        ? new Map([
            ['dogs', 40],
            ['cats', 90],
            ['rescue', 10],
          ])
        : null,
    )
    const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
    const tags = await service.getTopTags('user-1', 2)
    expect(tags).toEqual(['cats', 'dogs'])
  })

  it('returns an empty list when there is no tag affinity', async () => {
    const redis = makeRedis()
    const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
    expect(await service.getTopTags('user-1', 10)).toEqual([])
  })

  it('returns an empty list when personalization is disabled', async () => {
    const redis = makeRedis()
    const service = new AffinityService(
      redis as unknown as RedisService,
      makeConfig({ personalizationEnabled: false }) as ConfigService,
    )
    expect(await service.getTopTags('user-1', 10)).toEqual([])
  })
})

const post: AffinitySignalPost = {
  authorId: 'author-1',
  communityId: 'comm-1',
  kind: 'standard',
  hashtags: [
    { hashtag: { tag: 'dogs' } },
    { hashtag: { tag: 'puppies' } },
  ],
}

describe('AffinityService', () => {
  describe('record', () => {
    it('writes author, community, kind and each hashtag with the given weight', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)

      await service.record('user-1', post, AFFINITY_WEIGHTS.like)

      const byField = Object.fromEntries(redis.calls.map((c) => [c.field, c.delta]))
      expect(byField).toEqual({
        'author-1': AFFINITY_WEIGHTS.like,
        'comm-1': AFFINITY_WEIGHTS.like,
        standard: AFFINITY_WEIGHTS.like,
        dogs: AFFINITY_WEIGHTS.like,
        puppies: AFFINITY_WEIGHTS.like,
      })
      // All writes carry the configured TTL
      expect(redis.calls.every((c) => c.ttl === 60 * 24 * 3600)).toBe(true)
    })

    it('skips self-affinity (acting on your own post)', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      await service.record('author-1', post, AFFINITY_WEIGHTS.like)
      expect(redis.calls).toHaveLength(0)
    })

    it('caps hashtags to MAX_TAGS_PER_POST', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      const manyTags: AffinitySignalPost = {
        ...post,
        hashtags: Array.from({ length: 10 }, (_, i) => ({ hashtag: { tag: `tag-${i}` } })),
      }
      await service.record('user-1', manyTags, AFFINITY_WEIGHTS.comment)
      const tagCalls = redis.calls.filter((c) => c.dimension === 'tag')
      expect(tagCalls).toHaveLength(5)
    })

    it('is a no-op when personalization is disabled', async () => {
      const redis = makeRedis()
      const service = new AffinityService(
        redis as unknown as RedisService,
        makeConfig({ personalizationEnabled: false }) as ConfigService,
      )
      await service.record('user-1', post, AFFINITY_WEIGHTS.like)
      expect(redis.calls).toHaveLength(0)
    })

    it('applies negative deltas (unlike walks the like back)', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      await service.record('user-1', post, -AFFINITY_WEIGHTS.like)
      expect(redis.calls.every((c) => c.delta === -AFFINITY_WEIGHTS.like)).toBe(true)
    })
  })

  describe('recordAuthor', () => {
    it('writes a follow signal to the author dimension', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      await service.recordAuthor('user-1', 'author-2', AFFINITY_WEIGHTS.follow)
      expect(redis.calls).toEqual([
        { dimension: 'author', userId: 'user-1', field: 'author-2', delta: AFFINITY_WEIGHTS.follow, ttl: 60 * 24 * 3600 },
      ])
    })

    it('skips self-follow', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      await service.recordAuthor('user-1', 'user-1', AFFINITY_WEIGHTS.follow)
      expect(redis.calls).toHaveLength(0)
    })
  })

  describe('getProfile', () => {
    it('returns an empty (unknown) profile when nothing exists', async () => {
      const redis = makeRedis()
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      const profile = await service.getProfile('user-1')
      expect(profile.known).toBe(false)
      expect(profile.authors.size).toBe(0)
    })

    it('marks the profile known when any dimension exists', async () => {
      const redis = makeRedis()
      redis.affinityGetAll.mockImplementation(async (_userId, dimension) =>
        dimension === 'author' ? new Map([['author-1', 12]]) : null,
      )
      const service = new AffinityService(redis as unknown as RedisService, makeConfig() as ConfigService)
      const profile = await service.getProfile('user-1')
      expect(profile.known).toBe(true)
      expect(profile.authors.get('author-1')).toBe(12)
    })

    it('returns EMPTY_AFFINITY when personalization is disabled', async () => {
      const redis = makeRedis()
      const service = new AffinityService(
        redis as unknown as RedisService,
        makeConfig({ personalizationEnabled: false }) as ConfigService,
      )
      const profile = await service.getProfile('user-1')
      expect(profile).toEqual(EMPTY_AFFINITY)
    })
  })
})
