import { Injectable, NotFoundException } from '@nestjs/common'
import { $Enums, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { PostsService, type PostPage } from '../posts/posts.service'
import { decodeCursor } from '../common/utils/cursor-pagination'

export interface StoryByTagItem {
  id: string
  type: string
  caption: string | null
  privacy: string
  durationMs: number
  posterUrl: string | null
  blurhash: string | null
  createdAt: string
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
}

export interface StoryByTagPage {
  data: StoryByTagItem[]
  nextCursor: string | null
  hasMore: boolean
}

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

  // ── STORIES BY TAG ────────────────────────────────────────────────────────

  /**
   * Active stories for a hashtag. Privacy-gated: only stories the viewer
   * can see (public, or followers if viewer follows). Blended with posts
   * in the same tag feed on the client.
   */
  async storiesByTag(
    tag: string,
    viewerId: string | undefined,
    cursor: string | null,
    limit = 12,
  ): Promise<StoryByTagPage> {
    const normalized = tag.trim().toLowerCase().replace(/^#/, '')
    const hashtag = await this.prisma.hashtag.findUnique({ where: { tag: normalized } })
    if (!hashtag) {
      throw new NotFoundException({ code: 'HASHTAG_NOT_FOUND', message: 'Hashtag not found' })
    }

    const take = Math.min(limit, 30)

    // Privacy: public stories, or private-author stories where viewer follows
    const stories = await this.prisma.story.findMany({
      where: {
        isDeleted: false,
        status: 'ready',
        expiresAt: { gt: new Date() },
        hashtags: { some: { hashtagId: hashtag.id } },
        author: {
          state: 'active',
          ...(viewerId
            ? {
                blockedUsers: { none: { blockedId: viewerId } },
                blockedByUsers: { none: { blockerId: viewerId } },
              }
            : { isPrivate: false }),
        },
        ...(viewerId
          ? {
              OR: [
                { privacy: 'public' },
                { authorId: viewerId },
                {
                  privacy: { in: ['followers', 'professional'] as $Enums.StoryPrivacy[] },
                  author: { followsAsFollowing: { some: { followerId: viewerId, status: 'active' } } },
                },
              ],
            }
          : {}),
      },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
        media: {
          take: 1,
          orderBy: { createdAt: 'asc' },
          select: { imageUrl: true, thumbnailUrl: true, blurhash: true },
        },
      },
    })

    const hasMore = stories.length > take
    const items = hasMore ? stories.slice(0, take) : stories

    return {
      data: items.map((s) => ({
        id: s.id,
        type: s.type,
        caption: s.caption,
        privacy: s.privacy,
        durationMs: s.durationMs,
        posterUrl: s.media[0]?.thumbnailUrl ?? s.media[0]?.imageUrl ?? null,
        blurhash: s.media[0]?.blurhash ?? null,
        createdAt: s.createdAt.toISOString(),
        author: {
          id: s.author.id,
          username: s.author.username,
          displayName: s.author.displayName,
          avatarUrl: s.author.avatarUrl,
          isVerified: s.author.verificationTier === 'professional',
        },
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
      hasMore,
    }
  }
}
