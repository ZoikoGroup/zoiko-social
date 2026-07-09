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
   * Explore/discovery feed — recent PUBLIC posts from PUBLIC accounts the viewer
   * does NOT already follow (and not their own), excluding blocked either way.
   * This is how a public account "reaches anyone on the platform". Keyset
   * paginated on (created_at, id); no cache (per-viewer, always fresh).
   */
  async getExploreFeed(viewerId: string, cursor: string | null, limit = FEED_PAGE): Promise<PostPage> {
    const take = Math.min(limit, 30)
    const decoded = cursor ? decodeCursor(cursor) : null

    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        visibility: 'public',
        authorId: { not: viewerId },
        author: {
          isPrivate: false,
          state: 'active',
          blockedUsers: { none: { blockedId: viewerId } },
          blockedByUsers: { none: { blockerId: viewerId } },
          // Discovery = accounts you don't already follow
          followsAsFollowing: { none: { followerId: viewerId, status: 'active' } },
        },
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.postsService.postInclude(),
    })

    return this.postsService.buildPage(posts, take, viewerId)
  }
}
