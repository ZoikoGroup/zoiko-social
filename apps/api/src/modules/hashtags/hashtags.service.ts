import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import { decodeCursor } from '../common/utils/cursor-pagination'

@Injectable()
export class HashtagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly postsService: PostsService,
  ) {}

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

  async search(q: string): Promise<{ tag: string; postsCount: number }[]> {
    const query = q.trim().toLowerCase().replace(/^#/, '')
    if (query.length < 2) return []
    return this.prisma.hashtag.findMany({
      where: { tag: { contains: query }, postsCount: { gt: 0 } },
      orderBy: { postsCount: 'desc' },
      take: 15,
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
    const hashtag = await this.prisma.hashtag.findUnique({ where: { tag: normalized } })
    if (!hashtag) {
      throw new NotFoundException({ code: 'HASHTAG_NOT_FOUND', message: 'Hashtag not found' })
    }

    const take = Math.min(limit, 30)
    const decoded = cursor ? decodeCursor(cursor) : null

    // Privacy at the query level: public authors, OR private authors the
    // viewer follows, OR the viewer's own posts. Blocked authors excluded.
    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        hashtags: { some: { hashtagId: hashtag.id } },
        ...(viewerId
          ? {
              author: {
                state: 'active',
                blockedUsers: { none: { blockedId: viewerId } },
                blockedByUsers: { none: { blockerId: viewerId } },
              },
              OR: [
                { author: { isPrivate: false } },
                { authorId: viewerId },
                { author: { followsAsFollowing: { some: { followerId: viewerId, status: 'active' } } } },
              ],
            }
          : { author: { isPrivate: false, state: 'active' } }),
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
