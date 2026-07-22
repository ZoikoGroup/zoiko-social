import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import { decodeCursor } from '../common/utils/cursor-pagination'

const FEED_PAGE = 15

/**
 * FeedService — Phase 1 pull model (see docs/feed-posts-architecture.md §4).
 *
 * One indexed query: posts from the viewer's follow set + own posts, keyset
 * paginated on (created_at, id). First page is L2-cached for 60s and busted
 * by the fanout worker whenever someone the viewer follows publishes.
 *
 * Viewer flags (liked/saved) are attached AFTER the cache — per-viewer data
 * is never cached inside the shared page payload... the cache key is already
 * per-user, but flags change on every like, so they stay live.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly postsService: PostsService,
  ) {}

  async getHomeFeed(viewerId: string, cursor: string | null, limit = FEED_PAGE): Promise<PostPage> {
    const take = Math.min(limit, 30)
    const isFirstPage = !cursor

    // First page: serve FULL cached payloads — no Postgres hydration.
    // Only the per-viewer flags (liked/saved) stay live: one parallel query.
    if (isFirstPage) {
      const cached = await this.redis.getFeedFirst<PostPage>(viewerId)
      if (cached && cached.data.length > 0) {
        const flags = await this.postsService.viewerFlags(cached.data.map((p) => p.id), viewerId)
        return {
          ...cached,
          data: cached.data.map((p) => {
            const flag = flags.get(p.id) ?? { liked: false, saved: false }
            return { ...p, viewerLiked: flag.liked, viewerSaved: flag.saved }
          }),
        }
      }
    }

    const decoded = cursor ? decodeCursor(cursor) : null

    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        OR: [
          // Own posts — every visibility
          { authorId: viewerId },
          // Followed authors — only public + followers-only posts
          // (private stays author-only)
          {
            visibility: { in: ['public', 'followers'] },
            author: {
              followsAsFollowing: {
                some: { followerId: viewerId, status: 'active' },
              },
            },
          },
          // Posts from communities the viewer is an active member of
          {
            visibility: 'community',
            community: {
              members: { some: { userId: viewerId, status: 'active' } },
            },
          },
        ],
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
   * Explore/discovery feed — RANKED (organic reach v1). Public posts from public
   * accounts the viewer doesn't follow (and not their own), excluding blocks.
   * Instead of pure recency, a bounded recent candidate pool is scored by
   *   engagement_velocity × recency_decay × author_trust
   * then diversified (max 2 posts per author) so good posts reach non-followers
   * on merit. Offset-paginated over the ranked pool.
   */
  async getExploreFeed(viewerId: string, cursor: string | null, limit = FEED_PAGE): Promise<PostPage> {
    const take = Math.min(limit, 30)
    const offset = cursor ? Math.max(0, parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10) || 0) : 0
    const POOL = 300
    const since = new Date(Date.now() - 60 * 24 * 3_600_000) // 60-day candidate window

    const pool = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        visibility: 'public',
        authorId: { not: viewerId },
        createdAt: { gte: since },
        author: {
          isPrivate: false,
          state: 'active',
          blockedUsers: { none: { blockedId: viewerId } },
          blockedByUsers: { none: { blockerId: viewerId } },
          followsAsFollowing: { none: { followerId: viewerId, status: 'active' } },
        },
      },
      take: POOL,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.postsService.postInclude(),
    })

    // Score: engagement velocity with gravity-based recency decay + a small
    // professional-author trust boost. Saves/shares weighted highest (intent).
    const now = Date.now()
    const scored = pool
      .map((p) => {
        const ageHours = (now - p.createdAt.getTime()) / 3_600_000
        const engagement = 1 + p.likesCount + 3 * p.commentsCount + 5 * p.savesCount + 6 * p.sharesCount
        const recencyDecay = Math.pow(ageHours + 2, 1.5)
        const authorTrust = p.author.verificationTier === 'professional' ? 1.3 : 1
        return { post: p, score: (engagement / recencyDecay) * authorTrust }
      })
      .sort((a, b) => b.score - a.score)

    // Diversity: no single author dominates a page.
    const perAuthor = new Map<string, number>()
    const ranked: typeof pool = []
    for (const s of scored) {
      const n = perAuthor.get(s.post.authorId) ?? 0
      if (n >= 2) continue
      perAuthor.set(s.post.authorId, n + 1)
      ranked.push(s.post)
    }

    const slice = ranked.slice(offset, offset + take)
    const hasMore = offset + take < ranked.length
    const flags = await this.postsService.viewerFlags(slice.map((p) => p.id), viewerId)
    return {
      data: slice.map((p) => this.postsService.mapPost(p, flags.get(p.id) ?? { liked: false, saved: false })),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }
  }
}
