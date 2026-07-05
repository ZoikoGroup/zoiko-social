import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { PostsService } from '../posts/posts.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'

export interface LikerItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  viewerFollows: boolean
  followsViewer: boolean
  isMe: boolean
  likedAt: string
}

const MAX_PAGE = 50

@Injectable()
export class EngagementService {
  private readonly logger = new Logger(EngagementService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
    private readonly postsService: PostsService,
  ) {}

  // ── LIKE / UNLIKE ─────────────────────────────────────────────────────────
  // Single-statement CTE writes: insert-if-absent + counter update happen in
  // ONE database round-trip, atomically — no interactive transaction. Side
  // effects (cache, realtime, notifications) run fire-and-forget so the
  // response returns the moment the row commits.

  /** Run post-commit side effects without blocking the response. */
  private effects(label: string, fn: () => Promise<unknown>): void {
    void fn().catch((err) => this.logger.warn(`${label} side effects failed: ${(err as Error).message}`))
  }

  async like(userId: string, postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, userId)

    const rows = await this.prisma.$queryRaw<{ likes_count: number; inserted: number }[]>`
      WITH ins AS (
        INSERT INTO likes (user_id, post_id)
        VALUES (${userId}::uuid, ${postId}::uuid)
        ON CONFLICT (user_id, post_id) DO NOTHING
        RETURNING 1
      )
      UPDATE posts
      SET likes_count = likes_count + (SELECT COUNT(*)::int FROM ins)
      WHERE id = ${postId}::uuid
      RETURNING likes_count, (SELECT COUNT(*)::int FROM ins) AS inserted
    `
    const likesCount = rows[0]?.likes_count ?? post.likesCount
    const created = (rows[0]?.inserted ?? 0) > 0

    if (created) {
      this.effects('like', async () => {
        await Promise.all([
          this.redis.invalidatePost(postId),
          this.realtime.publish(`post:${postId}`, 'post:liked', { postId, likesCount }),
        ])
        if (post.authorId !== userId) {
          const liker = await this.prisma.profile.findUnique({
            where: { id: userId },
            select: { username: true, displayName: true },
          })
          await this.notifications.enqueue({
            userId: post.authorId,
            type: 'new_like',
            title: 'New Like',
            body: `${liker?.displayName ?? 'Someone'} liked your post`,
            data: { postId, username: liker?.username, actorId: userId },
          })
        }
      })
    }

    return { liked: true, likesCount }
  }

  async unlike(userId: string, postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const post = await this.postsService.loadPostSlim(postId)

    const rows = await this.prisma.$queryRaw<{ likes_count: number; removed: number }[]>`
      WITH del AS (
        DELETE FROM likes
        WHERE user_id = ${userId}::uuid AND post_id = ${postId}::uuid
        RETURNING 1
      )
      UPDATE posts
      SET likes_count = GREATEST(likes_count - (SELECT COUNT(*)::int FROM del), 0)
      WHERE id = ${postId}::uuid
      RETURNING likes_count, (SELECT COUNT(*)::int FROM del) AS removed
    `
    const likesCount = rows[0]?.likes_count ?? post.likesCount
    const removed = (rows[0]?.removed ?? 0) > 0

    if (removed) {
      this.effects('unlike', async () => {
        await Promise.all([
          this.redis.invalidatePost(postId),
          this.realtime.publish(`post:${postId}`, 'post:unliked', { postId, likesCount }),
        ])
        // No notification on unlike — Instagram parity
      })
    }

    return { liked: false, likesCount }
  }

  /** Liked-by list — decorated with viewer follow state (Follow buttons). */
  async getLikers(
    postId: string,
    viewerId: string,
    cursor: string | null,
    limit = 20,
  ): Promise<{ data: LikerItem[]; nextCursor: string | null; hasMore: boolean }> {
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, viewerId)

    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null

    const likes = await this.prisma.like.findMany({
      where: {
        postId,
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), userId: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { userId: 'desc' }],
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
      },
    })

    const hasMore = likes.length > take
    const items = hasMore ? likes.slice(0, take) : likes
    const ids = items.map((l) => l.userId).filter((id) => id !== viewerId)

    const [viewerFollows, followsViewer] = ids.length
      ? await Promise.all([
          this.prisma.follow.findMany({
            where: { followerId: viewerId, followingId: { in: ids }, status: 'active' },
            select: { followingId: true },
          }),
          this.prisma.follow.findMany({
            where: { followerId: { in: ids }, followingId: viewerId, status: 'active' },
            select: { followerId: true },
          }),
        ])
      : [[], []]

    const followsSet = new Set(viewerFollows.map((f) => f.followingId))
    const followedBySet = new Set(followsViewer.map((f) => f.followerId))

    return {
      data: items.map((l) => ({
        id: l.user.id,
        username: l.user.username,
        displayName: l.user.displayName,
        avatarUrl: l.user.avatarUrl,
        isVerified: l.user.verificationTier === 'professional',
        viewerFollows: followsSet.has(l.userId),
        followsViewer: followedBySet.has(l.userId),
        isMe: l.userId === viewerId,
        likedAt: l.createdAt.toISOString(),
      })),
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.userId)
        : null,
      hasMore,
    }
  }

  // ── SAVE / UNSAVE ─────────────────────────────────────────────────────────

  async save(userId: string, postId: string): Promise<{ saved: boolean }> {
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, userId)

    await this.prisma.$executeRaw`
      WITH ins AS (
        INSERT INTO saved_posts (user_id, post_id)
        VALUES (${userId}::uuid, ${postId}::uuid)
        ON CONFLICT (user_id, post_id) DO NOTHING
        RETURNING 1
      )
      UPDATE posts
      SET saves_count = saves_count + (SELECT COUNT(*)::int FROM ins)
      WHERE id = ${postId}::uuid
    `

    this.effects('save', () => this.redis.invalidatePost(postId))
    return { saved: true }
  }

  async unsave(userId: string, postId: string): Promise<{ saved: boolean }> {
    await this.prisma.$executeRaw`
      WITH del AS (
        DELETE FROM saved_posts
        WHERE user_id = ${userId}::uuid AND post_id = ${postId}::uuid
        RETURNING 1
      )
      UPDATE posts
      SET saves_count = GREATEST(saves_count - (SELECT COUNT(*)::int FROM del), 0)
      WHERE id = ${postId}::uuid
    `

    this.effects('unsave', () => this.redis.invalidatePost(postId))
    return { saved: false }
  }

  // ── SHARE ─────────────────────────────────────────────────────────────────

  async share(
    userId: string,
    postId: string,
    type: 'link' | 'internal' | 'external',
    recipients?: string[],
  ): Promise<{ url: string; sharesCount: number; sentTo: number }> {
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, userId)

    // Recipient validation stays synchronous — sentTo is part of the response
    let targetIds: string[] = []
    if (type === 'internal' && recipients?.length) {
      const targets = await this.prisma.profile.findMany({
        where: {
          id: { in: recipients.filter((id) => id !== userId) },
          state: 'active',
          // Respect blocks in both directions
          blockedUsers: { none: { blockedId: userId } },
          blockedByUsers: { none: { blockerId: userId } },
        },
        select: { id: true },
      })
      targetIds = targets.map((t) => t.id)
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: { sharesCount: { increment: 1 } },
      select: { sharesCount: true },
    })

    // Delivery + cache + author notice all run without blocking the response
    this.effects('share', async () => {
      await this.redis.invalidatePost(postId)
      const sharer = await this.prisma.profile.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      })
      for (const targetId of targetIds) {
        await this.notifications.enqueue({
          userId: targetId,
          type: 'shared_with_you',
          title: 'Shared a Post',
          body: `${sharer?.displayName ?? 'Someone'} shared a post with you`,
          data: { postId, username: sharer?.username, actorId: userId },
        })
      }
      if (post.authorId !== userId && type === 'internal') {
        await this.notifications.enqueue({
          userId: post.authorId,
          type: 'post_shared',
          title: 'Post Shared',
          body: `${sharer?.displayName ?? 'Someone'} shared your post`,
          data: { postId, username: sharer?.username },
        })
      }
    })

    const base = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000'
    return { url: `${base}/p/${postId}`, sharesCount: updated.sharesCount, sentTo: targetIds.length }
  }
}
