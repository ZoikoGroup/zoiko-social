import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import { PersonalizationService } from '../personalization/personalization.service'

const FEED_PAGE = 15

// Candidate pool bounds — Instagram-style ranked feeds are built from a bounded
// recent pool, scored, then offset-paginated:
//   Home:    everything recent you follow + your own posts + communities.
//            Freshness-biased, but personalized (interest lifts the authors,
//            tags, communities and post kinds you actually engage with).
//   Explore: public posts from public accounts you don't follow (discovery).
const HOME_POOL = 600
const HOME_WINDOW_DAYS = 14
const EXPLORE_POOL = 300
const EXPLORE_WINDOW_DAYS = 60

/** Soft per-author cap on Home so one account can't flood the feed. */
const HOME_MAX_PER_AUTHOR = 3
/** Explore diversity cap (existing behaviour). */
const EXPLORE_MAX_PER_AUTHOR = 2

/**
 * FeedService — personalized pull model (docs/feed-posts-architecture.md §4).
 *
 * Both feeds now rank a bounded recent pool with the affinity-based scoring
 * engine (PersonalizationService): interest × engagement × recency × trust.
 * Cold start (no affinity profile) collapses to the previous popularity/
 * recency ranking — the change is invisible until the model has data.
 *
 * The Home first-page cache is kept (60s, busted by the fanout worker) and the
 * seen-filter is applied LIVE at serve time via viewerFlags; when too few posts
 * survive, the request falls through to the fresh ranked query.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly postsService: PostsService,
    private readonly personalization: PersonalizationService,
  ) {}

  async getHomeFeed(viewerId: string, cursor: string | null, limit = FEED_PAGE): Promise<PostPage> {
    const take = Math.min(limit, 30)
    const isFirstPage = !cursor

    // First page: serve FULL cached payloads — no Postgres hydration.
    // Per-viewer state stays live: flags (liked/saved) are re-attached, and the
    // seen-filter drops anything the viewer has viewed or liked since the
    // cache snapshot was taken. If too little survives, fall through to the
    // fresh ranked query (which excludes seen/liked posts in SQL).
    if (isFirstPage) {
      const cached = await this.redis.getFeedFirst<PostPage>(viewerId)
      if (cached && cached.data.length > 0) {
        const flags = await this.postsService.viewerFlags(cached.data.map((p) => p.id), viewerId)
        const filtered = cached.data.filter((p) => {
          const flag = flags.get(p.id) ?? { liked: false, saved: false, viewed: false }
          return !flag.viewed && !flag.liked
        })
        if (filtered.length >= Math.max(1, Math.floor(take / 2))) {
          return {
            ...cached,
            data: filtered.map((p) => {
              const flag = flags.get(p.id) ?? { liked: false, saved: false, viewed: false }
              return { ...p, viewerLiked: flag.liked, viewerSaved: flag.saved }
            }),
          }
        }
      }
    }

    const offset = cursor ? this.decodeOffset(cursor) : 0

    const pool = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        createdAt: { gte: new Date(Date.now() - HOME_WINDOW_DAYS * 24 * 3_600_000) },
        OR: [
          // Own posts — every visibility, never seen-filtered
          { authorId: viewerId },
          // Followed authors — public + followers-only, skipping what the
          // viewer has already seen or reacted to
          {
            visibility: { in: ['public', 'followers'] },
            author: {
              followsAsFollowing: {
                some: { followerId: viewerId, status: 'active' },
              },
            },
            NOT: {
              OR: [
                { views: { some: { userId: viewerId } } },
                { likes: { some: { userId: viewerId } } },
              ],
            },
          },
          // Posts from communities the viewer is an active member of
          {
            visibility: 'community',
            community: {
              members: { some: { userId: viewerId, status: 'active' } },
            },
            NOT: {
              OR: [
                { views: { some: { userId: viewerId } } },
                { likes: { some: { userId: viewerId } } },
              ],
            },
          },
        ],
      },
      take: HOME_POOL,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.poolInclude(),
    })

    const ranked = await this.personalization.rank(viewerId, pool, 'home')

    // Soft diversity on Home: cap per author so one account can't dominate.
    const perAuthor = new Map<string, number>()
    const diversified: typeof pool = []
    for (const r of ranked) {
      const n = perAuthor.get(r.post.authorId) ?? 0
      if (n >= HOME_MAX_PER_AUTHOR) continue
      perAuthor.set(r.post.authorId, n + 1)
      diversified.push(r.post)
    }

    const slice = diversified.slice(offset, offset + take)
    const hasMore = offset + take < diversified.length
    const flags = await this.postsService.viewerFlags(slice.map((p) => p.id), viewerId)

    const page: PostPage = {
      data: slice.map((p) =>
        this.postsService.mapPost(p, flags.get(p.id) ?? { liked: false, saved: false, viewed: false }),
      ),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }

    if (isFirstPage) {
      // Cache with neutral viewer flags — flags are re-attached per request
      await this.redis.setFeedFirst(viewerId, {
        ...page,
        data: page.data.map((p) => ({ ...p, viewerLiked: false, viewerSaved: false })),
      })
    }

    return page
  }

  /**
   * Explore/discovery feed — personalized RANKED (organic reach v2).
   * Public posts from public accounts the viewer doesn't follow (and not their
   * own), excluding blocks. A bounded recent candidate pool is scored by
   *   interestBoost × engagement_velocity × recency_decay × author_trust
   * then diversified (max 2 posts per author) so good posts reach non-followers
   * on merit. Cold start = previous popularity-only ranking. Offset-paginated.
   */
  async getExploreFeed(viewerId: string, cursor: string | null, limit = FEED_PAGE): Promise<PostPage> {
    const take = Math.min(limit, 30)
    const offset = cursor ? this.decodeOffset(cursor) : 0

    const pool = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        visibility: 'public',
        authorId: { not: viewerId },
        createdAt: { gte: new Date(Date.now() - EXPLORE_WINDOW_DAYS * 24 * 3_600_000) },
        author: {
          isPrivate: false,
          state: 'active',
          blockedUsers: { none: { blockedId: viewerId } },
          blockedByUsers: { none: { blockerId: viewerId } },
          followsAsFollowing: { none: { followerId: viewerId, status: 'active' } },
        },
        // Seen filter: don't re-surface posts the viewer has viewed or liked
        NOT: {
          OR: [
            { views: { some: { userId: viewerId } } },
            { likes: { some: { userId: viewerId } } },
          ],
        },
      },
      take: EXPLORE_POOL,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.poolInclude(),
    })

    const ranked = await this.personalization.rank(viewerId, pool, 'explore')

    // Diversity: no single author dominates a page.
    const perAuthor = new Map<string, number>()
    const rankedList: typeof pool = []
    for (const r of ranked) {
      const n = perAuthor.get(r.post.authorId) ?? 0
      if (n >= EXPLORE_MAX_PER_AUTHOR) continue
      perAuthor.set(r.post.authorId, n + 1)
      rankedList.push(r.post)
    }

    const slice = rankedList.slice(offset, offset + take)
    const hasMore = offset + take < rankedList.length
    const flags = await this.postsService.viewerFlags(slice.map((p) => p.id), viewerId)

    return {
      data: slice.map((p) =>
        this.postsService.mapPost(p, flags.get(p.id) ?? { liked: false, saved: false, viewed: false }),
      ),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }
  }

  /**
   * Post include for ranking pools: the standard post payload PLUS hashtags
   * (needed for tag-affinity scoring). The extra relation is harmless to the
   * response mapping — mapPost simply ignores it.
   */
  private poolInclude() {
    return {
      ...this.postsService.postInclude(),
      hashtags: { include: { hashtag: { select: { tag: true } } } },
    }
  }

  private decodeOffset(cursor: string): number {
    const n = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }
}
