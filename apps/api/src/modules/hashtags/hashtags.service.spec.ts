import { HashtagsService } from './hashtags.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { PostsService } from '../posts/posts.service'
import type { AffinityService } from '../personalization/affinity.service'

const VIEWER = 'viewer-1'

function build(overrides: {
  topTags?: string[]
  hashtagRows?: { tag: string; postsCount: number }[]
  trendingRows?: { tag: string; postsCount: number }[]
} = {}) {
  const prisma = {
    hashtag: {
      findMany: jest.fn().mockResolvedValue(overrides.hashtagRows ?? []),
    },
  }
  const redis = {
    trendTop: jest.fn().mockResolvedValue(overrides.trendingRows ?? []),
  }
  const affinity = {
    getTopTags: jest.fn().mockResolvedValue(overrides.topTags ?? []),
  }

  const service = new HashtagsService(
    prisma as unknown as PrismaService,
    redis as unknown as RedisService,
    {} as unknown as PostsService,
    affinity as unknown as AffinityService,
  )
  return { service, prisma, redis, affinity }
}

describe('HashtagsService.forYou', () => {
  it('returns the viewer\'s top affinity tags decorated with live post counts', async () => {
    const { service, prisma, affinity } = build({
      topTags: ['goldenretriever', 'vetadvice', 'rescuedog'],
      hashtagRows: [
        { tag: 'goldenretriever', postsCount: 42 },
        { tag: 'rescuedog', postsCount: 7 },
        // vetadvice missing → defaults to 0
      ],
    })

    const result = await service.forYou(VIEWER, 12)

    expect(affinity.getTopTags).toHaveBeenCalledWith(VIEWER, 12)
    expect(prisma.hashtag.findMany).toHaveBeenCalledWith({
      where: { tag: { in: ['goldenretriever', 'vetadvice', 'rescuedog'] } },
      select: { tag: true, postsCount: true },
    })
    // Affinity order is preserved; stale tags with no live posts are dropped
    expect(result).toEqual([
      { tag: 'goldenretriever', postsCount: 42 },
      { tag: 'rescuedog', postsCount: 7 },
    ])
  })

  it('falls back to trending when every affinity tag is stale (no live posts)', async () => {
    const { service, affinity, redis } = build({
      topTags: ['oldtag1', 'oldtag2'],
      // Trending rows double as the enrichment re-query result: the affinity
      // tags (oldtag1/oldtag2) don't match these rows, so they filter out and
      // the fallback triggers — while trending()'s own findMany re-query for
      // post counts gets the rows it needs.
      hashtagRows: [
        { tag: 'puppies', postsCount: 100 },
        { tag: 'cats', postsCount: 88 },
      ],
      trendingRows: [
        { tag: 'puppies', postsCount: 100 },
        { tag: 'cats', postsCount: 88 },
      ],
    })

    const result = await service.forYou(VIEWER, 12)

    expect(affinity.getTopTags).toHaveBeenCalledWith(VIEWER, 12)
    expect(redis.trendTop).toHaveBeenCalledWith(10)
    expect(result).toEqual([
      { tag: 'puppies', postsCount: 100 },
      { tag: 'cats', postsCount: 88 },
    ])
  })

  it('falls back to trending on cold start (no affinity tags yet)', async () => {
    const { service, affinity, redis } = build({
      topTags: [],
      trendingRows: [
        { tag: 'puppies', postsCount: 100 },
        { tag: 'cats', postsCount: 88 },
      ],
      // trending() re-queries the hashtags table to enrich post counts
      hashtagRows: [
        { tag: 'puppies', postsCount: 100 },
        { tag: 'cats', postsCount: 88 },
      ],
    })

    const result = await service.forYou(VIEWER, 12)

    expect(affinity.getTopTags).toHaveBeenCalledWith(VIEWER, 12)
    expect(redis.trendTop).toHaveBeenCalledWith(10)
    expect(result).toEqual([
      { tag: 'puppies', postsCount: 100 },
      { tag: 'cats', postsCount: 88 },
    ])
  })

  it('respects the limit when reading affinity tags', async () => {
    const { service, affinity } = build({ topTags: ['dogs', 'cats'] })

    await service.forYou(VIEWER, 6)

    expect(affinity.getTopTags).toHaveBeenCalledWith(VIEWER, 6)
  })
})
