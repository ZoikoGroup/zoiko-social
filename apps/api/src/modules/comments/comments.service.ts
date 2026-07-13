import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { PostsService } from '../posts/posts.service'
import { parseMentions } from '../posts/caption-parser'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import { ProfanityService } from '../common/moderation/profanity.service'

export interface CommentResponse {
  id: string
  postId: string
  parentId: string | null
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  body: string
  likesCount: number
  repliesCount: number
  isPinned: boolean
  isEdited: boolean
  isDeleted: boolean
  viewerLiked: boolean
  createdAt: string
}

const MAX_PAGE = 50
const EDIT_WINDOW_MS = 15 * 60 * 1000
const MAX_PINNED = 3

const authorSelect = {
  select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
} as const

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
    private readonly postsService: PostsService,
    private readonly profanity: ProfanityService,
  ) {}

  /** Run post-commit side effects without blocking the response. */
  private effects(label: string, fn: () => Promise<unknown>): void {
    void fn().catch((err) => this.logger.warn(`${label} side effects failed: ${(err as Error).message}`))
  }

  // ── CREATE ────────────────────────────────────────────────────────────────

  async create(userId: string, postId: string, body: string, parentId?: string): Promise<CommentResponse> {
    this.profanity.assertClean(body, { actorId: userId, entityType: 'comment' })
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, userId)

    if (post.commentsDisabled) {
      throw new ForbiddenException({ code: 'COMMENTS_DISABLED', message: 'Comments are turned off for this post' })
    }

    // 1-level threads: replying to a reply re-parents to its top-level parent
    let resolvedParentId: string | null = null
    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true, parentId: true, authorId: true, isDeleted: true },
      })
      if (!parent || parent.postId !== postId || parent.isDeleted) {
        throw new NotFoundException({ code: 'COMMENT_NOT_FOUND', message: 'Parent comment not found' })
      }
      resolvedParentId = parent.parentId ?? parent.id
    }

    const comment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.comment.create({
        data: { postId, authorId: userId, parentId: resolvedParentId, body },
        include: { author: authorSelect },
      })
      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      })
      if (resolvedParentId) {
        await tx.comment.update({
          where: { id: resolvedParentId },
          data: { repliesCount: { increment: 1 } },
        })
      }
      return created
    })

    const mapped = this.map(comment, false)

    // Everything after the commit runs without blocking the response:
    // cache bust, realtime, author/reply/mention notifications
    this.effects('comment.create', async () => {
      await Promise.all([
        this.redis.invalidatePost(postId),
        this.realtime.publish(`post:${postId}`, 'comment:new', mapped),
      ])

      const actor = await this.prisma.profile.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      })
      const preview = body.length > 40 ? `${body.slice(0, 40)}…` : body

      // Notify post author (skip self)
      if (post.authorId !== userId) {
        await this.notifications.enqueue({
          userId: post.authorId,
          type: 'new_comment',
          title: 'New Comment',
          body: `${actor?.displayName ?? 'Someone'} commented: “${preview}”`,
          data: { postId, commentId: comment.id, username: actor?.username },
        })
      }

      // Notify parent-comment author on replies (skip self and post author double-notify)
      if (resolvedParentId) {
        const parentAuthor = await this.prisma.comment.findUnique({
          where: { id: resolvedParentId },
          select: { authorId: true },
        })
        if (parentAuthor && parentAuthor.authorId !== userId && parentAuthor.authorId !== post.authorId) {
          await this.notifications.enqueue({
            userId: parentAuthor.authorId,
            type: 'comment_reply',
            title: 'New Reply',
            body: `${actor?.displayName ?? 'Someone'} replied to your comment`,
            data: { postId, commentId: comment.id, username: actor?.username },
          })
        }
      }

      // Mentions in comment body
      const mentionUsernames = parseMentions(body)
      if (mentionUsernames.length) {
        const mentioned = await this.prisma.profile.findMany({
          where: { username: { in: mentionUsernames }, state: 'active', id: { notIn: [userId, post.authorId] } },
          select: { id: true },
        })
        for (const m of mentioned) {
          await this.prisma.mention.create({
            data: { mentionedUserId: m.id, actorId: userId, commentId: comment.id, postId },
          })
          await this.notifications.enqueue({
            userId: m.id,
            type: 'mention',
            title: 'Mentioned You',
            body: `${actor?.displayName ?? 'Someone'} mentioned you in a comment`,
            data: { postId, commentId: comment.id, username: actor?.username },
          })
        }
      }
    })

    return mapped
  }

  // ── READ ──────────────────────────────────────────────────────────────────

  async listThread(
    postId: string,
    viewerId: string | undefined,
    cursor: string | null,
    limit = 20,
  ): Promise<{ data: CommentResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const post = await this.postsService.loadPostSlim(postId)
    await this.postsService.assertCanViewPost(post, viewerId)

    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null

    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
        // Cursor pages after the pinned block: pinned comments only appear on page 1
        ...(decoded
          ? {
              isPinned: false,
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      include: { author: authorSelect },
    })

    return this.buildPage(comments, take, viewerId)
  }

  async listReplies(
    commentId: string,
    viewerId: string | undefined,
    cursor: string | null,
    limit = 10,
  ): Promise<{ data: CommentResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const parent = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    })
    if (!parent) {
      throw new NotFoundException({ code: 'COMMENT_NOT_FOUND', message: 'Comment not found' })
    }
    const post = await this.postsService.loadPostSlim(parent.postId)
    await this.postsService.assertCanViewPost(post, viewerId)

    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null

    // Replies read oldest-first (conversation order)
    const replies = await this.prisma.comment.findMany({
      where: {
        parentId: commentId,
        ...(decoded
          ? {
              OR: [
                { createdAt: { gt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { gt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      include: { author: authorSelect },
    })

    return this.buildPage(replies, take, viewerId)
  }

  // ── EDIT / DELETE ─────────────────────────────────────────────────────────

  async edit(commentId: string, userId: string, body: string): Promise<CommentResponse> {
    this.profanity.assertClean(body, { actorId: userId, entityType: 'comment' })
    const comment = await this.loadComment(commentId)
    if (comment.authorId !== userId) {
      throw new ForbiddenException({ code: 'NOT_AUTHOR', message: 'You can only edit your own comments' })
    }
    const engaged = comment.likesCount > 0 || comment.repliesCount > 0
    const windowClosed = Date.now() - comment.createdAt.getTime() > EDIT_WINDOW_MS
    if (engaged && windowClosed) {
      throw new ForbiddenException({
        code: 'EDIT_WINDOW_CLOSED',
        message: 'Comments can be edited within 15 minutes or before anyone engages',
      })
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { body },
      include: { author: authorSelect },
    })

    await this.redis.invalidatePost(comment.postId)
    const mapped = this.map(updated, false)
    await this.realtime.publish(`post:${comment.postId}`, 'comment:updated', mapped)
    return mapped
  }

  /** Author of the comment OR author of the post may delete (Instagram parity). */
  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.loadComment(commentId)
    const post = await this.postsService.loadPostSlim(comment.postId)

    if (comment.authorId !== userId && post.authorId !== userId) {
      throw new ForbiddenException({ code: 'NOT_ALLOWED', message: 'You cannot delete this comment' })
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.comment.update({
        where: { id: commentId },
        data: { isDeleted: true, isPinned: false },
      })
      await tx.post.update({
        where: { id: comment.postId },
        data: { commentsCount: { decrement: 1 } },
      })
      if (comment.parentId) {
        await tx.comment.update({
          where: { id: comment.parentId },
          data: { repliesCount: { decrement: 1 } },
        })
      }
    })

    await this.redis.invalidatePost(comment.postId)
    await this.realtime.publish(`post:${comment.postId}`, 'comment:deleted', {
      commentId,
      postId: comment.postId,
    })
  }

  // ── COMMENT LIKES ─────────────────────────────────────────────────────────

  async likeComment(userId: string, commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const comment = await this.loadComment(commentId)
    const post = await this.postsService.loadPostSlim(comment.postId)
    await this.postsService.assertCanViewPost(post, userId)

    const result = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
      })
      if (existing) return { created: false, likesCount: comment.likesCount }
      await tx.commentLike.create({ data: { userId, commentId } })
      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { likesCount: { increment: 1 } },
        select: { likesCount: true },
      })
      return { created: true, likesCount: updated.likesCount }
    })

    return { liked: true, likesCount: result.likesCount }
  }

  async unlikeComment(userId: string, commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const comment = await this.loadComment(commentId)

    const result = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
      })
      if (!existing) return { removed: false, likesCount: comment.likesCount }
      await tx.commentLike.delete({ where: { userId_commentId: { userId, commentId } } })
      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { likesCount: { decrement: 1 } },
        select: { likesCount: true },
      })
      return { removed: true, likesCount: updated.likesCount }
    })

    return { liked: false, likesCount: result.likesCount }
  }

  // ── PIN / UNPIN ───────────────────────────────────────────────────────────

  async setPinned(postId: string, commentId: string, userId: string, pinned: boolean): Promise<void> {
    const post = await this.postsService.loadPostSlim(postId)
    if (post.authorId !== userId) {
      throw new ForbiddenException({ code: 'NOT_AUTHOR', message: 'Only the post author can pin comments' })
    }
    const comment = await this.loadComment(commentId)
    if (comment.postId !== postId || comment.parentId) {
      throw new NotFoundException({ code: 'COMMENT_NOT_FOUND', message: 'Comment not found on this post' })
    }

    if (pinned) {
      const pinnedCount = await this.prisma.comment.count({
        where: { postId, isPinned: true, isDeleted: false },
      })
      if (pinnedCount >= MAX_PINNED) {
        throw new ConflictException({ code: 'PIN_LIMIT', message: `You can pin up to ${MAX_PINNED} comments` })
      }
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { isPinned: pinned },
    })
    await this.redis.invalidatePost(postId)
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  private async loadComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment || comment.isDeleted) {
      throw new NotFoundException({ code: 'COMMENT_NOT_FOUND', message: 'Comment not found' })
    }
    return comment
  }

  private async buildPage(
    comments: Array<Parameters<CommentsService['map']>[0]>,
    take: number,
    viewerId?: string,
  ): Promise<{ data: CommentResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const hasMore = comments.length > take
    const items = hasMore ? comments.slice(0, take) : comments

    let likedSet = new Set<string>()
    if (viewerId && items.length) {
      const liked = await this.prisma.commentLike.findMany({
        where: { userId: viewerId, commentId: { in: items.map((c) => c.id) } },
        select: { commentId: true },
      })
      likedSet = new Set(liked.map((l) => l.commentId))
    }

    return {
      data: items.map((c) => this.map(c, likedSet.has(c.id))),
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id)
        : null,
      hasMore,
    }
  }

  private map(
    comment: {
      id: string
      postId: string
      parentId: string | null
      body: string
      likesCount: number
      repliesCount: number
      isPinned: boolean
      isDeleted: boolean
      createdAt: Date
      updatedAt: Date
      author: { id: string; username: string; displayName: string; avatarUrl: string | null; verificationTier: string }
    },
    viewerLiked: boolean,
  ): CommentResponse {
    return {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        displayName: comment.author.displayName,
        avatarUrl: comment.author.avatarUrl,
        isVerified: comment.author.verificationTier === 'professional',
      },
      body: comment.isDeleted ? '' : comment.body,
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      isPinned: comment.isPinned,
      isEdited: comment.updatedAt.getTime() - comment.createdAt.getTime() > 2_000,
      isDeleted: comment.isDeleted,
      viewerLiked,
      createdAt: comment.createdAt.toISOString(),
    }
  }
}
