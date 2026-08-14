import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import { decodeCursor } from '../common/utils/cursor-pagination'
import { AffinityService } from '../personalization/affinity.service'
import { AdoptionService, type ListingResponse } from '../adoption/adoption.service'
import { EventsService, type EventResponse } from '../events/events.service'
import { LostFoundService, type ReportResponse } from '../lost-found/lost-found.service'
import { ShopService, type ProductResponse } from '../shop/shop.service'
import { CommunitiesService, type CommunityCard } from '../communities/communities.service'
import { normalizeTag } from '../common/utils/tags'

/**
 * Everything carrying one tag, across every entity type that can carry tags.
 *
 * A tag used to reach posts only, so #beagle found people talking about beagles
 * and never the beagle up for adoption, the beagle meetup or the beagle someone
 * was looking for. Each section is fetched through the owning
 * service so its visibility rules apply unchanged — this endpoint widens
 * discovery, it does not widen access.
 */
export interface TagEverythingResult {
  tag: string
  postsCount: number
  adoption: ListingResponse[]
  lostFound: ReportResponse[]
  events: EventResponse[]
  products: ProductResponse[]
  communities: CommunityCard[]
}

/** Enough to show a section is worth opening, few enough to stay one screen. */
const SECTION_LIMIT = 6

@Injectable()
export class HashtagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly postsService: PostsService,
    private readonly affinity: AffinityService,
    private readonly adoptionService: AdoptionService,
    private readonly eventsService: EventsService,
    private readonly lostFoundService: LostFoundService,
    private readonly shopService: ShopService,
    private readonly communitiesService: CommunitiesService,
  ) {}

  /**
   * The non-post half of a tag page.
   *
   * Kept separate from postsByTag so the existing paginated post grid is
   * untouched: this returns a small preview of each other section, and each
   * section links through to its own filtered browse page.
   */
  async everythingByTag(tag: string, viewerId?: string): Promise<TagEverythingResult> {
    const normalized = normalizeTag(tag) ?? ''
    if (!normalized) {
      return { tag: '', postsCount: 0, adoption: [], lostFound: [], events: [], products: [], communities: [] }
    }

    const [hashtag, adoption, lostFound, events, products, communities] = await Promise.all([
      this.prisma.hashtag.findUnique({ where: { tag: normalized }, select: { postsCount: true } }),
      this.adoptionService.browse(viewerId, { tag: normalized }, null, SECTION_LIMIT),
      this.lostFoundService.browse({ tag: normalized }, null, SECTION_LIMIT),
      this.eventsService.list(viewerId, null, SECTION_LIMIT, { tag: normalized }),
      this.shopService.browse({ tag: normalized }, viewerId, null, SECTION_LIMIT),
      this.communitiesService.browse(viewerId, { tag: normalized, limit: SECTION_LIMIT }),
    ])

    return {
      tag: normalized,
      postsCount: hashtag?.postsCount ?? 0,
      adoption: adoption.data,
      lostFound: lostFound.data,
      events: events.data,
      products: products.data,
      communities: communities.data,
    }
  }

  async trending(): Promise<{ tag: string; postsCount: number }[]> {
    const top = await this.redis.trendTop(10)
    if (top.length > 0) {
      const rows = await this.prisma.hashtag.findMany({
        where: { tag: { in: top.map((t) => t.tag) } },
        select: { tag: true, postsCount: true },
      })
      const counts = new Map(rows.map((r) => [r.tag, r.postsCount]))
      return top.map((t) => ({ tag: t.tag, postsCount: counts.get(t.tag) ?? 0 }))
    }
    // Cold start / Redis empty — fall back to all-time popular
    const rows = await this.prisma.hashtag.findMany({
      where: { postsCount: { gt: 0 } },
      orderBy: { postsCount: 'desc' },
      take: 10,
      select: { tag: true, postsCount: true },
    })
    return rows
  }

  /**
   * "Topics for you" — the viewer's top tags by affinity, decorated with live
   * post counts (same enrichment as trending). Falls back to trending when the
   * viewer has no affinity profile yet (cold start).
   */
  async forYou(viewerId: string, limit = 12): Promise<{ tag: string; postsCount: number }[]> {
    const top = await this.affinity.getTopTags(viewerId, limit)
    if (top.length === 0) {
      return this.trending()
    }
    const rows = await this.prisma.hashtag.findMany({
      where: { tag: { in: top } },
      select: { tag: true, postsCount: true },
    })
    const counts = new Map(rows.map((r) => [r.tag, r.postsCount]))
    // Drop stale affinity tags that no longer have live posts (they persist up
    // to 60 days in the profile, but the posts may be gone) and cap at limit.
    const decorated = top
      .map((tag) => ({ tag, postsCount: counts.get(tag) ?? 0 }))
      .filter((t) => t.postsCount > 0)
      .slice(0, limit)
    // If every affinity tag is stale, fall back to trending so the rail stays populated.
    if (decorated.length === 0) {
      return this.trending()
    }
    return decorated
  }

  async search(q: string, limit = 15): Promise<{ tag: string; postsCount: number }[]> {
    const query = q.trim().toLowerCase().replace(/^#/, '')
    if (query.length < 2) return []
    return this.prisma.hashtag.findMany({
      where: { tag: { contains: query }, postsCount: { gt: 0 } },
      orderBy: { postsCount: 'desc' },
      take: Math.min(limit, 30),
      select: { tag: true, postsCount: true },
    })
  }

  async postsByTag(
    tag: string,
    viewerId: string | undefined,
    cursor: string | null,
    limit = 12,
  ): Promise<PostPage & { tag: string; postsCount: number }> {
    const normalized = tag.trim().toLowerCase().replace(/^#/, '')
    // A hashtag row only exists once something has been posted with it, so a tag
    // nobody has used yet is empty rather than missing. Throwing 404 here made
    // the home feed's topic tabs — Local, Rescue, Vet Advice, Lost & Found — all
    // fail on a young platform, because those tags are fixed in the UI and only
    // gain a row when a post first uses them. An empty page reads correctly and
    // starts working by itself as soon as someone posts.
    const hashtag = await this.prisma.hashtag.findUnique({ where: { tag: normalized } })
    if (!hashtag) {
      return { data: [], nextCursor: null, hasMore: false, tag: normalized, postsCount: 0 }
    }

    const take = Math.min(limit, 30)
    const decoded = cursor ? decodeCursor(cursor) : null

    // Privacy at the query level: public authors, OR private authors the
    // viewer follows, OR the viewer's own posts. Blocked authors excluded.
    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        hashtags: { some: { hashtagId: hashtag.id } },
        // Hashtag pages are a public discovery surface: only truly public posts
        // from public accounts (plus the viewer's own posts, any visibility).
        OR: [
          ...(viewerId ? [{ authorId: viewerId }] : []),
          {
            visibility: 'public',
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
        ] as Prisma.PostWhereInput[],
        ...(decoded
          ? {
              AND: [
                {
                  OR: [
                    { createdAt: { lt: new Date(decoded.createdAt) } },
                    { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
                  ],
                },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.postsService.postInclude(),
    })

    const page = await this.postsService.buildPage(posts, take, viewerId)
    return { ...page, tag: normalized, postsCount: hashtag.postsCount }
  }
}
