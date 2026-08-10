import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import {
  PersonalizationService,
  type ScoreablePost,
  type RankMode,
} from '../personalization/personalization.service'

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

    const order = await this.rankedOrder(viewerId, 'home', offset, () =>
      this.prisma.post.findMany({
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
      }),
      HOME_MAX_PER_AUTHOR,
    )

    const page = await this.pageFromOrder(order, viewerId, offset, take)

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

    const order = await this.rankedOrder(viewerId, 'explore', offset, () =>
      this.prisma.post.findMany({
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
      }),
      EXPLORE_MAX_PER_AUTHOR,
    )

    return this.pageFromOrder(order, viewerId, offset, take)
  }

  /**
   * The viewer's ranked post ids for a surface, cached for the length of a
   * scroll session.
   *
   * Two problems this solves. Cost: without it, every page re-read the whole
   * candidate pool (600 posts on Home, hydrated with author, media and
   * community) and re-scored all of it just to return fifteen — page 5 cost
   * exactly what page 1 did. Correctness: scores move with live engagement and
   * affinity, so re-ranking between requests reshuffled the list under the
   * reader, who then saw some posts twice and never saw others at all.
   *
   * Freezing the order for a few minutes fixes both. A cache miss mid-scroll
   * (expiry, or Redis unavailable) rebuilds it and lands the reader at roughly
   * the same place, since the inputs have barely changed.
   */
  private async rankedOrder<T extends ScoreablePost>(
    viewerId: string,
    surface: RankMode,
    offset: number,
    loadPool: () => Promise<T[]>,
    maxPerAuthor: number,
  ): Promise<string[]> {
    // Only trust a cached order when continuing a scroll. A fresh visit to the
    // feed should see current ranking, not a snapshot from three minutes ago.
    if (offset > 0) {
      const cached = await this.redis.getFeedOrder(viewerId, surface)
      if (cached && cached.length > 0) return cached
    }

    const pool = await loadPool()
    const ranked = await this.personalization.rank(viewerId, pool, surface)

    // Soft diversity cap so one prolific account cannot dominate the feed.
    const perAuthor = new Map<string, number>()
    const ids: string[] = []
    for (const r of ranked) {
      const n = perAuthor.get(r.post.authorId) ?? 0
      if (n >= maxPerAuthor) continue
      perAuthor.set(r.post.authorId, n + 1)
      ids.push(r.post.id)
    }

    await this.redis.setFeedOrder(viewerId, surface, ids)
    return ids
  }

  /**
   * Hydrate one page out of a ranked id list.
   *
   * Only the ids on this page are fetched, and they are re-sorted into the
   * ranked order Postgres knows nothing about. Posts deleted since the order
   * was computed simply fall out, which is why `hasMore` comes from the id list
   * rather than from how many rows came back.
   */
  private async pageFromOrder(
    order: string[],
    viewerId: string,
    offset: number,
    take: number,
  ): Promise<PostPage> {
    const pageIds = order.slice(offset, offset + take)
    const hasMore = offset + take < order.length

    if (pageIds.length === 0) {
      return { data: [], nextCursor: null, hasMore: false }
    }

    const [rows, flags] = await Promise.all([
      this.prisma.post.findMany({
        where: { id: { in: pageIds }, isDeleted: false },
        include: this.poolInclude(),
      }),
      this.postsService.viewerFlags(pageIds, viewerId),
    ])

    const byId = new Map(rows.map((p) => [p.id, p]))
    const ordered = pageIds.map((id) => byId.get(id)).filter((p): p is (typeof rows)[number] => !!p)

    return {
      data: ordered.map((p) =>
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
