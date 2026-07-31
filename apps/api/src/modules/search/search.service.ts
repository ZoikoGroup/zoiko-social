import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NetworkService, type UserSearchResult } from '../network/network.service'
import { HashtagsService } from '../hashtags/hashtags.service'
import { PostsService, type PostResponse } from '../posts/posts.service'
import { CommunitiesService, type CommunityCard } from '../communities/communities.service'
import { NewsService, type ArticleResponse } from '../news/news.service'
import { ShopService, type ProductResponse } from '../shop/shop.service'
import { rankByRelevance } from './relevance'

export interface SearchAllResult {
  query: string
  people: UserSearchResult[]
  hashtags: { tag: string; postsCount: number }[]
  posts: PostResponse[]
  communities: CommunityCard[]
  news: ArticleResponse[]
  products: ProductResponse[]
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
  ) {}

  async searchAll(viewerId: string | undefined, rawQuery: string): Promise<SearchAllResult> {
    const query = rawQuery.trim()
    if (query.length < 2) {
      return { query, people: [], hashtags: [], posts: [], communities: [], news: [], products: [] }
    }

    const [people, hashtags, posts, communities, news, products] = await Promise.all([
      this.searchPeople(viewerId, query, ALL_PREVIEW_LIMIT),
      this.searchHashtags(query, ALL_PREVIEW_LIMIT),
      this.searchPosts(viewerId, query, ALL_PREVIEW_LIMIT),
      this.searchCommunities(viewerId, query, ALL_PREVIEW_LIMIT),
      this.searchNews(viewerId, query, ALL_PREVIEW_LIMIT),
      this.searchProducts(viewerId, query, ALL_PREVIEW_LIMIT),
    ])

    return { query, people, hashtags, posts, communities, news, products }
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
}
