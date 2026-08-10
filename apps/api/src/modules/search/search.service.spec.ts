import { SearchService } from './search.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { NetworkService } from '../network/network.service'
import type { HashtagsService } from '../hashtags/hashtags.service'
import type { PostsService } from '../posts/posts.service'
import type { CommunitiesService } from '../communities/communities.service'
import type { NewsService } from '../news/news.service'
import type { ShopService } from '../shop/shop.service'
import type { EventsService } from '../events/events.service'
import type { AdoptionService } from '../adoption/adoption.service'
import type { LostFoundService } from '../lost-found/lost-found.service'
import type { ProvidersService } from '../providers/providers.service'

const emptyPage = { data: [], nextCursor: null, hasMore: false }

function buildDeps() {
  const prisma = { post: { findMany: jest.fn() } }
  const networkService = { searchUsers: jest.fn() }
  const hashtagsService = { search: jest.fn() }
  const postsService = { postInclude: jest.fn().mockReturnValue({}), buildPage: jest.fn() }
  const communitiesService = { browse: jest.fn() }
  const newsService = { browse: jest.fn() }
  const shopService = { browse: jest.fn() }
  // The pet surfaces default to empty so the pre-existing tests, which only care
  // about one category each, don't have to stub all four.
  const eventsService = { list: jest.fn().mockResolvedValue(emptyPage) }
  const adoptionService = { browse: jest.fn().mockResolvedValue(emptyPage) }
  const lostFoundService = { browse: jest.fn().mockResolvedValue(emptyPage) }
  const providersService = { browse: jest.fn().mockResolvedValue(emptyPage) }

  const service = new SearchService(
    prisma as unknown as PrismaService,
    networkService as unknown as NetworkService,
    hashtagsService as unknown as HashtagsService,
    postsService as unknown as PostsService,
    communitiesService as unknown as CommunitiesService,
    newsService as unknown as NewsService,
    shopService as unknown as ShopService,
    eventsService as unknown as EventsService,
    adoptionService as unknown as AdoptionService,
    lostFoundService as unknown as LostFoundService,
    providersService as unknown as ProvidersService,
  )

  return {
    service, prisma, networkService, hashtagsService, postsService, communitiesService,
    newsService, shopService, eventsService, adoptionService, lostFoundService, providersService,
  }
}

describe('SearchService', () => {
  describe('searchAll', () => {
    it('short-circuits on a query shorter than 2 characters without calling any dependency', async () => {
      const { service, networkService, hashtagsService, postsService, communitiesService, newsService, shopService } = buildDeps()

      const result = await service.searchAll('viewer-1', ' a ')

      expect(result).toEqual({
        query: 'a', people: [], hashtags: [], posts: [], communities: [], news: [], products: [],
        events: [], adoption: [], lostFound: [], providers: [],
      })
      expect(networkService.searchUsers).not.toHaveBeenCalled()
      expect(hashtagsService.search).not.toHaveBeenCalled()
      expect(postsService.buildPage).not.toHaveBeenCalled()
      expect(communitiesService.browse).not.toHaveBeenCalled()
      expect(newsService.browse).not.toHaveBeenCalled()
      expect(shopService.browse).not.toHaveBeenCalled()
    })

    it('aggregates every category with the preview limit (5)', async () => {
      const { service, networkService, hashtagsService, postsService, communitiesService, newsService, shopService, prisma } = buildDeps()

      networkService.searchUsers.mockResolvedValue([{ id: 'u1', username: 'dane', displayName: 'Dane' }])
      hashtagsService.search.mockResolvedValue([{ tag: 'dane', postsCount: 3 }])
      prisma.post.findMany.mockResolvedValue([{ id: 'p1', createdAt: new Date(), body: 'dane post' }])
      postsService.buildPage.mockResolvedValue({ data: [{ id: 'p1', caption: 'dane post' }], nextCursor: null, hasMore: false })
      communitiesService.browse.mockResolvedValue({ data: [{ id: 'c1', name: 'Dane Club', slug: 'dane-club' }], nextCursor: null, hasMore: false })
      newsService.browse.mockResolvedValue({ data: [{ id: 'n1', title: 'Great Danes', excerpt: '...' }], nextCursor: null, hasMore: false })
      shopService.browse.mockResolvedValue({ data: [{ id: 's1', title: 'Dane Collar' }], nextCursor: null, hasMore: false })

      const result = await service.searchAll('viewer-1', 'dane')

      expect(result.people).toHaveLength(1)
      expect(result.hashtags).toHaveLength(1)
      expect(result.posts).toHaveLength(1)
      expect(result.communities).toHaveLength(1)
      expect(result.news).toHaveLength(1)
      expect(result.products).toHaveLength(1)
      expect(networkService.searchUsers).toHaveBeenCalledWith('viewer-1', 'dane', 5)
      expect(hashtagsService.search).toHaveBeenCalledWith('dane', 5)
    })
  })

  describe('searchPeople', () => {
    it('returns an empty array for an anonymous viewer without calling NetworkService', async () => {
      const { service, networkService } = buildDeps()
      const result = await service.searchPeople(undefined, 'dane', 20)
      expect(result).toEqual([])
      expect(networkService.searchUsers).not.toHaveBeenCalled()
    })

    it('caps the requested limit at 40 and ranks results by relevance', async () => {
      const { service, networkService } = buildDeps()
      networkService.searchUsers.mockResolvedValue([
        { id: 'a', username: 'dane_lover_99', displayName: 'Dane Lover' },
        { id: 'b', username: 'dane', displayName: 'Exact Match' },
      ])

      const result = await service.searchPeople('viewer-1', 'dane', 999)

      expect(networkService.searchUsers).toHaveBeenCalledWith('viewer-1', 'dane', 40)
      expect(result.map((r) => r.id)).toEqual(['b', 'a'])
    })
  })

  describe('searchHashtags', () => {
    it('caps the requested limit at 40', async () => {
      const { service, hashtagsService } = buildDeps()
      hashtagsService.search.mockResolvedValue([])
      await service.searchHashtags('dane', 999)
      expect(hashtagsService.search).toHaveBeenCalledWith('dane', 40)
    })
  })

  describe('searchPosts', () => {
    it('returns an empty array for a query shorter than 2 characters without querying prisma', async () => {
      const { service, prisma } = buildDeps()
      const result = await service.searchPosts('viewer-1', 'a', 20)
      expect(result).toEqual([])
      expect(prisma.post.findMany).not.toHaveBeenCalled()
    })

    it('excludes non-public posts, deleted posts and private/inactive authors', async () => {
      const { service, prisma, postsService } = buildDeps()
      prisma.post.findMany.mockResolvedValue([])
      postsService.buildPage.mockResolvedValue({ data: [], nextCursor: null, hasMore: false })

      await service.searchPosts(undefined, 'dane', 20)

      const call = prisma.post.findMany.mock.calls[0][0]
      expect(call.where.isDeleted).toBe(false)
      expect(call.where.visibility).toBe('public')
      expect(call.where.body).toEqual({ contains: 'dane', mode: 'insensitive' })
      expect(call.where.author.isPrivate).toBe(false)
      expect(call.where.author.state).toBe('active')
      // No viewer — block-exclusion clauses must be absent, not merely empty.
      expect(call.where.author.blockedUsers).toBeUndefined()
    })

    it('excludes posts from authors who blocked (or are blocked by) the viewer', async () => {
      const { service, prisma, postsService } = buildDeps()
      prisma.post.findMany.mockResolvedValue([])
      postsService.buildPage.mockResolvedValue({ data: [], nextCursor: null, hasMore: false })

      await service.searchPosts('viewer-1', 'dane', 20)

      const call = prisma.post.findMany.mock.calls[0][0]
      expect(call.where.author.blockedUsers).toEqual({ none: { blockedId: 'viewer-1' } })
      expect(call.where.author.blockedByUsers).toEqual({ none: { blockerId: 'viewer-1' } })
    })

    it('ranks the returned page by caption relevance', async () => {
      const { service, prisma, postsService } = buildDeps()
      prisma.post.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }])
      postsService.buildPage.mockResolvedValue({
        data: [
          { id: 'p1', caption: 'a post mentioning dane somewhere' },
          { id: 'p2', caption: 'dane' },
        ],
        nextCursor: null,
        hasMore: false,
      })

      const result = await service.searchPosts('viewer-1', 'dane', 20)

      expect(result.map((p) => p.id)).toEqual(['p2', 'p1'])
    })
  })

  describe('searchCommunities', () => {
    it('delegates to CommunitiesService.browse with a capped limit', async () => {
      const { service, communitiesService } = buildDeps()
      communitiesService.browse.mockResolvedValue({ data: [], nextCursor: null, hasMore: false })
      await service.searchCommunities('viewer-1', 'dane', 999)
      expect(communitiesService.browse).toHaveBeenCalledWith('viewer-1', { q: 'dane', limit: 40 })
    })
  })

  describe('searchNews', () => {
    it('delegates to NewsService.browse with a capped limit', async () => {
      const { service, newsService } = buildDeps()
      newsService.browse.mockResolvedValue({ data: [], nextCursor: null, hasMore: false })
      await service.searchNews('viewer-1', 'dane', 999)
      expect(newsService.browse).toHaveBeenCalledWith({ q: 'dane' }, 'viewer-1', null, 40)
    })
  })

  describe('searchProducts', () => {
    it('delegates to ShopService.browse with a capped limit', async () => {
      const { service, shopService } = buildDeps()
      shopService.browse.mockResolvedValue({ data: [], nextCursor: null, hasMore: false })
      await service.searchProducts('viewer-1', 'dane', 999)
      expect(shopService.browse).toHaveBeenCalledWith({ q: 'dane' }, 'viewer-1', null, 40)
    })
  })
})

// ── The pet surfaces ─────────────────────────────────────────────────────────
// These four were reachable by the AI assistant's discovery tools but not from
// the search box. Each delegates to the owning service so its visibility rules
// keep applying — which is why the tests assert delegation rather than SQL.

describe('SearchService — pet surfaces', () => {
  it('searchEvents passes the viewer through so invite-only events stay hidden', async () => {
    const { service, eventsService } = buildDeps()
    await service.searchEvents('viewer-1', 'meetup', 999)
    expect(eventsService.list).toHaveBeenCalledWith('viewer-1', null, 40, { q: 'meetup' })
  })

  it('searchAdoption delegates with a capped limit', async () => {
    const { service, adoptionService } = buildDeps()
    await service.searchAdoption('viewer-1', 'beagle', 999)
    expect(adoptionService.browse).toHaveBeenCalledWith('viewer-1', { q: 'beagle' }, null, 40)
  })

  it('searchLostFound works without a viewer — a missing pet must be findable by anyone', async () => {
    const { service, lostFoundService } = buildDeps()
    await service.searchLostFound('tabby', 20)
    expect(lostFoundService.browse).toHaveBeenCalledWith({ q: 'tabby' }, null, 20)
  })

  it('searchProviders merges vets and pet-care into one ranked list', async () => {
    const { service, providersService } = buildDeps()
    providersService.browse
      .mockResolvedValueOnce({ data: [{ id: 'v1', name: 'City Vets', serviceType: null, location: null }], nextCursor: null, hasMore: false })
      .mockResolvedValueOnce({ data: [{ id: 'g1', name: 'Groom', serviceType: 'grooming', location: null }], nextCursor: null, hasMore: false })

    const result = await service.searchProviders('groom', 20)

    expect(providersService.browse).toHaveBeenCalledWith('vet', { q: 'groom' }, null, 20)
    expect(providersService.browse).toHaveBeenCalledWith('pet_care', { q: 'groom' }, null, 20)
    // The exact-ish match ranks above the unrelated vet clinic.
    expect(result[0]?.id).toBe('g1')
  })

  it('searchProviders honours the limit across BOTH categories, not per category', async () => {
    // Two browses of `take` each could otherwise return 2×take results.
    const { service, providersService } = buildDeps()
    const many = (prefix: string) =>
      Array.from({ length: 40 }, (_, i) => ({ id: `${prefix}${i}`, name: 'Pet Place', serviceType: null, location: null }))
    providersService.browse
      .mockResolvedValueOnce({ data: many('v'), nextCursor: null, hasMore: false })
      .mockResolvedValueOnce({ data: many('g'), nextCursor: null, hasMore: false })

    const result = await service.searchProviders('pet', 10)

    expect(result).toHaveLength(10)
  })

  it('searchAll includes the pet surfaces in its preview', async () => {
    const { service, networkService, hashtagsService, postsService, communitiesService, newsService, shopService, prisma, eventsService, adoptionService, lostFoundService, providersService } = buildDeps()

    networkService.searchUsers.mockResolvedValue([])
    hashtagsService.search.mockResolvedValue([])
    prisma.post.findMany.mockResolvedValue([])
    postsService.buildPage.mockResolvedValue(emptyPage)
    communitiesService.browse.mockResolvedValue(emptyPage)
    newsService.browse.mockResolvedValue(emptyPage)
    shopService.browse.mockResolvedValue(emptyPage)
    eventsService.list.mockResolvedValue({ data: [{ id: 'e1', title: 'Dane Meetup' }], nextCursor: null, hasMore: false })
    adoptionService.browse.mockResolvedValue({ data: [{ id: 'a1', name: 'Dane' }], nextCursor: null, hasMore: false })
    lostFoundService.browse.mockResolvedValue({ data: [{ id: 'l1', petName: 'Dane' }], nextCursor: null, hasMore: false })
    providersService.browse.mockResolvedValue({ data: [{ id: 'pr1', name: 'Dane Vets' }], nextCursor: null, hasMore: false })

    const result = await service.searchAll('viewer-1', 'dane')

    expect(result.events).toHaveLength(1)
    expect(result.adoption).toHaveLength(1)
    expect(result.lostFound).toHaveLength(1)
    // Both provider categories return the same row here, so dedupe-by-nothing
    // yields two — the point is only that providers reach the result at all.
    expect(result.providers.length).toBeGreaterThan(0)
    expect(eventsService.list).toHaveBeenCalledWith('viewer-1', null, 5, { q: 'dane' })
  })
})
