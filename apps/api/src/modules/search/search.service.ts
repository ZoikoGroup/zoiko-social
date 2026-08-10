import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NetworkService, type UserSearchResult } from '../network/network.service'
import { HashtagsService } from '../hashtags/hashtags.service'
import { PostsService, type PostResponse } from '../posts/posts.service'
import { CommunitiesService, type CommunityCard } from '../communities/communities.service'
import { NewsService, type ArticleResponse } from '../news/news.service'
import { ShopService, type ProductResponse } from '../shop/shop.service'
import { EventsService, type EventResponse } from '../events/events.service'
import { AdoptionService, type ListingResponse } from '../adoption/adoption.service'
import { LostFoundService, type ReportResponse } from '../lost-found/lost-found.service'
import { ProvidersService, type ProviderResponse } from '../providers/providers.service'
import { rankByRelevance } from './relevance'

export interface SearchAllResult {
  query: string
  people: UserSearchResult[]
  hashtags: { tag: string; postsCount: number }[]
  posts: PostResponse[]
  communities: CommunityCard[]
  news: ArticleResponse[]
  products: ProductResponse[]
  events: EventResponse[]
  adoption: ListingResponse[]
  lostFound: ReportResponse[]
  providers: ProviderResponse[]
}

const ALL_PREVIEW_LIMIT = 5

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly networkService: NetworkService,
    private readonly hashtagsService: HashtagsService,
    private readonly postsService: PostsService,
    private readonly communitiesService: CommunitiesService,
    private readonly newsService: NewsService,
    private readonly shopService: ShopService,
    private readonly eventsService: EventsService,
    private readonly adoptionService: AdoptionService,
    private readonly lostFoundService: LostFoundService,
    private readonly providersService: ProvidersService,
  ) {}

  async searchAll(viewerId: string | undefined, rawQuery: string): Promise<SearchAllResult> {
    const query = rawQuery.trim()
    if (query.length < 2) {
      return {
        query, people: [], hashtags: [], posts: [], communities: [], news: [], products: [],
        events: [], adoption: [], lostFound: [], providers: [],
      }
    }

    const [people, hashtags, posts, communities, news, products, events, adoption, lostFound, providers] =
      await Promise.all([
        this.searchPeople(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchHashtags(query, ALL_PREVIEW_LIMIT),
        this.searchPosts(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchCommunities(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchNews(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchProducts(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchEvents(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchAdoption(viewerId, query, ALL_PREVIEW_LIMIT),
        this.searchLostFound(query, ALL_PREVIEW_LIMIT),
        this.searchProviders(query, ALL_PREVIEW_LIMIT),
      ])

    return {
      query, people, hashtags, posts, communities, news, products,
      events, adoption, lostFound, providers,
    }
  }

  /** People search requires a viewer — blocked-account exclusion depends on it. Anonymous visitors get no results. */
  async searchPeople(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<UserSearchResult[]> {
    if (!viewerId) return []
    const results = await this.networkService.searchUsers(viewerId, rawQuery, Math.min(limit, 40))
    return rankByRelevance(rawQuery, results, (p) => [p.username, p.displayName])
  }

  async searchHashtags(rawQuery: string, limit = 20): Promise<{ tag: string; postsCount: number }[]> {
    const results = await this.hashtagsService.search(rawQuery, Math.min(limit, 40))
    return rankByRelevance(rawQuery, results, (h) => [h.tag])
  }

  /** Public posts only — mirrors the explore feed's visibility + blocked-author gate. */
  async searchPosts(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<PostResponse[]> {
    const query = rawQuery.trim()
    if (query.length < 2) return []
    const take = Math.min(limit, 40)

    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        visibility: 'public',
        body: { contains: query, mode: 'insensitive' },
        author: {
          isPrivate: false,
          state: 'active',
          ...(viewerId
            ? {
                blockedUsers: { none: { blockedId: viewerId } },
                blockedByUsers: { none: { blockerId: viewerId } },
              }
            : {}),
        },
      },
      take,
      orderBy: [{ createdAt: 'desc' }],
      include: this.postsService.postInclude(),
    })

    const page = await this.postsService.buildPage(posts, take, viewerId)
    return rankByRelevance(query, page.data, (p) => [p.caption])
  }

  async searchCommunities(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<CommunityCard[]> {
    const page = await this.communitiesService.browse(viewerId, { q: rawQuery, limit: Math.min(limit, 40) })
    return rankByRelevance(rawQuery, page.data, (c) => [c.name, c.slug])
  }

  async searchNews(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<ArticleResponse[]> {
    const page = await this.newsService.browse({ q: rawQuery }, viewerId, null, Math.min(limit, 40))
    return rankByRelevance(rawQuery, page.data, (a) => [a.title, a.excerpt])
  }

  async searchProducts(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<ProductResponse[]> {
    const page = await this.shopService.browse({ q: rawQuery }, viewerId, null, Math.min(limit, 40))
    return rankByRelevance(rawQuery, page.data, (p) => [p.title])
  }

  // ── The pet-specific surfaces ───────────────────────────────────────────────
  // These four were searchable by the AI assistant (which calls the same
  // services through its discovery tools) but not by a member using the search
  // box — so the assistant could find a vet or an adoptable dog and the UI
  // could not. Each delegates to the owning service so its visibility rules
  // (invite-only events, blocked posters, private listings) apply unchanged.

  async searchEvents(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<EventResponse[]> {
    const page = await this.eventsService.list(viewerId, null, Math.min(limit, 40), { q: rawQuery })
    return rankByRelevance(rawQuery, page.data, (e) => [e.title, e.description, e.venueName, e.location])
  }

  async searchAdoption(viewerId: string | undefined, rawQuery: string, limit = 20): Promise<ListingResponse[]> {
    const page = await this.adoptionService.browse(viewerId, { q: rawQuery }, null, Math.min(limit, 40))
    return rankByRelevance(rawQuery, page.data, (l) => [l.name, l.species, l.breed, l.location])
  }

  /** Deliberately viewer-agnostic: a missing pet should be findable by anyone. */
  async searchLostFound(rawQuery: string, limit = 20): Promise<ReportResponse[]> {
    const page = await this.lostFoundService.browse({ q: rawQuery }, null, Math.min(limit, 40))
    return rankByRelevance(rawQuery, page.data, (r) => [r.petName, r.species, r.breed, r.lastSeenLocation])
  }

  /**
   * Vets and pet-care providers in one list. They live behind separate
   * categories in their own browse UI, but someone typing "groomer" into the
   * search box does not care which of the two tabs the answer lives in.
   */
  async searchProviders(rawQuery: string, limit = 20): Promise<ProviderResponse[]> {
    const take = Math.min(limit, 40)
    const [vets, petCare] = await Promise.all([
      this.providersService.browse('vet', { q: rawQuery }, null, take),
      this.providersService.browse('pet_care', { q: rawQuery }, null, take),
    ])
    const combined = [...vets.data, ...petCare.data]
    return rankByRelevance(rawQuery, combined, (p) => [p.name, p.serviceType, p.location]).slice(0, take)
  }
}
