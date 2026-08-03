import { HashtagsService } from './hashtags.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { PostsService } from '../posts/posts.service'
import type { AffinityService } from '../personalization/affinity.service'
import type { AdoptionService } from '../adoption/adoption.service'
import type { EventsService } from '../events/events.service'
import type { LostFoundService } from '../lost-found/lost-found.service'
import type { ShopService } from '../shop/shop.service'
import type { CommunitiesService } from '../communities/communities.service'

const emptyPage = { data: [], nextCursor: null, hasMore: false }

const VIEWER = 'viewer-1'

function build(overrides: {
  topTags?: string[]
  hashtagRows?: { tag: string; postsCount: number }[]
  trendingRows?: { tag: string; postsCount: number }[]
  postsCount?: number
  sections?: Partial<Record<'adoption' | 'lostFound' | 'events' | 'products' | 'communities', unknown[]>>
} = {}) {
  const prisma = {
    hashtag: {
      findMany: jest.fn().mockResolvedValue(overrides.hashtagRows ?? []),
      findUnique: jest.fn().mockResolvedValue(overrides.postsCount !== undefined ? { postsCount: overrides.postsCount } : null),
    },
  }
  const redis = {
    trendTop: jest.fn().mockResolvedValue(overrides.trendingRows ?? []),
  }
  const affinity = {
    getTopTags: jest.fn().mockResolvedValue(overrides.topTags ?? []),
  }

  const page = (rows?: unknown[]) => ({ ...emptyPage, data: rows ?? [] })
  const adoptionService = { browse: jest.fn().mockResolvedValue(page(overrides.sections?.adoption)) }
  const eventsService = { list: jest.fn().mockResolvedValue(page(overrides.sections?.events)) }
  const lostFoundService = { browse: jest.fn().mockResolvedValue(page(overrides.sections?.lostFound)) }
  const shopService = { browse: jest.fn().mockResolvedValue(page(overrides.sections?.products)) }
  const communitiesService = { browse: jest.fn().mockResolvedValue(page(overrides.sections?.communities)) }

  const service = new HashtagsService(
    prisma as unknown as PrismaService,
    redis as unknown as RedisService,
    {} as unknown as PostsService,
    affinity as unknown as AffinityService,
    adoptionService as unknown as AdoptionService,
    eventsService as unknown as EventsService,
    lostFoundService as unknown as LostFoundService,
    shopService as unknown as ShopService,
    communitiesService as unknown as CommunitiesService,
  )
  return {
    service, prisma, redis, affinity,
    adoptionService, eventsService, lostFoundService, shopService, communitiesService,
  }
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

describe('HashtagsService.everythingByTag', () => {
  it('normalises the tag before querying, so #Beagle and beagle agree', async () => {
    // Tags are stored normalised, so an un-normalised lookup would silently
    // return nothing rather than erroring — the worst kind of bug here.
    const { service, adoptionService, eventsService, lostFoundService, shopService, communitiesService } = build()

    const result = await service.everythingByTag('#Beagle', VIEWER)

    expect(result.tag).toBe('beagle')
    expect(adoptionService.browse).toHaveBeenCalledWith(VIEWER, { tag: 'beagle' }, null, 6)
    expect(lostFoundService.browse).toHaveBeenCalledWith({ tag: 'beagle' }, null, 6)
    expect(eventsService.list).toHaveBeenCalledWith(VIEWER, null, 6, { tag: 'beagle' })
    expect(shopService.browse).toHaveBeenCalledWith({ tag: 'beagle' }, VIEWER, null, 6)
    expect(communitiesService.browse).toHaveBeenCalledWith(VIEWER, { tag: 'beagle', limit: 6 })
  })

  it('passes the viewer through so each section keeps its own visibility rules', async () => {
    // This endpoint widens discovery, not access: an invite-only event or a
    // private listing must stay hidden exactly as it would elsewhere.
    const { service, eventsService, adoptionService } = build()

    await service.everythingByTag('beagle', VIEWER)

    expect(eventsService.list.mock.calls[0]![0]).toBe(VIEWER)
    expect(adoptionService.browse.mock.calls[0]![0]).toBe(VIEWER)
  })

  it('works for an anonymous viewer', async () => {
    const { service, eventsService } = build()

    await service.everythingByTag('beagle')

    expect(eventsService.list.mock.calls[0]![0]).toBeUndefined()
  })

  it('returns an empty shell for a tag that normalises to nothing', async () => {
    // '###' would otherwise become a lookup for the empty string, which the GIN
    // index would happily run against every row.
    const { service, adoptionService } = build()

    const result = await service.everythingByTag('###')

    expect(result).toEqual({
      tag: '', postsCount: 0, adoption: [], lostFound: [], events: [], products: [], communities: [],
    })
    expect(adoptionService.browse).not.toHaveBeenCalled()
  })

  it('collects each section into its own field', async () => {
    const { service } = build({
      postsCount: 12,
      sections: {
        adoption: [{ id: 'a1' }],
        lostFound: [{ id: 'l1' }, { id: 'l2' }],
        events: [{ id: 'e1' }],
        products: [{ id: 'p1' }],
        communities: [{ id: 'c1' }],
      },
    })

    const result = await service.everythingByTag('beagle', VIEWER)

    expect(result.postsCount).toBe(12)
    expect(result.adoption).toHaveLength(1)
    expect(result.lostFound).toHaveLength(2)
    expect(result.events).toHaveLength(1)
    expect(result.products).toHaveLength(1)
    expect(result.communities).toHaveLength(1)
  })

  it('reports zero posts for a tag with no hashtag row rather than failing', async () => {
    const { service } = build()
    const result = await service.everythingByTag('nothinghere', VIEWER)
    expect(result.postsCount).toBe(0)
  })
})
