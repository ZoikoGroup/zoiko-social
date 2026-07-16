import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateArticleInput, UpdateArticleInput, CommentInput, NewsCategory } from './news.schemas'

export interface ArticleResponse {
  id: string
  author: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  excerpt: string
  body: string | null
  coverUrl: string | null
  category: string
  tier: string
  sourceName: string | null
  sourceUrl: string | null
  readMinutes: number
  likesCount: number
  savesCount: number
  commentsCount: number
  publishedAt: string
  viewerLiked: boolean
  viewerSaved: boolean
}

export interface CommentResponse {
  id: string
  body: string
  createdAt: string
  author: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
}

export interface ArticlePage {
  data: ArticleResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type ArticleRow = Prisma.NewsArticleGetPayload<{
  include: { author: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

const MAX = 30

interface BrowseFilters {
  category?: NewsCategory
  tier?: string
  q?: string
}

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private authorInclude() {
    return {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
      },
    }
  }

  /** Trust tier derived from the author's verification at publish time. */
  private tierFor(author: { verificationTier: string; professionalProfile: { category: string } | null }): string {
    if (author.verificationTier === 'professional') {
      return author.professionalProfile?.category === 'verified_news_publisher' ? 'institutional' : 'verified'
    }
    return 'community'
  }

  private map(a: ArticleRow, liked: boolean, saved: boolean, withBody: boolean): ArticleResponse {
    return {
      id: a.id,
      author: {
        id: a.author.id, username: a.author.username, displayName: a.author.displayName,
        avatarUrl: a.author.avatarUrl, isVerified: a.author.verificationTier === 'professional',
      },
      title: a.title, excerpt: a.excerpt, body: withBody ? a.body : null,
      coverUrl: a.coverUrl, category: a.category, tier: a.tier,
      sourceName: a.sourceName, sourceUrl: a.sourceUrl, readMinutes: a.readMinutes,
      likesCount: a.likesCount, savesCount: a.savesCount, commentsCount: a.commentsCount,
      publishedAt: a.publishedAt.toISOString(),
      viewerLiked: liked, viewerSaved: saved,
    }
  }

  private async viewerFlags(articleIds: string[], viewerId?: string): Promise<{ liked: Set<string>; saved: Set<string> }> {
    if (!viewerId || articleIds.length === 0) return { liked: new Set(), saved: new Set() }
    const [likes, saves] = await Promise.all([
      this.prisma.newsLike.findMany({ where: { userId: viewerId, articleId: { in: articleIds } }, select: { articleId: true } }),
      this.prisma.newsSave.findMany({ where: { userId: viewerId, articleId: { in: articleIds } }, select: { articleId: true } }),
    ])
    return { liked: new Set(likes.map((l) => l.articleId)), saved: new Set(saves.map((s) => s.articleId)) }
  }

  async browse(filters: BrowseFilters, viewerId: string | undefined, cursor: string | null, limit = 15): Promise<ArticlePage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const where: Prisma.NewsArticleWhereInput = {
      isDeleted: false,
      status: 'published',
      hiddenAt: null,
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.tier ? { tier: filters.tier } : {}),
      ...(filters.q ? { OR: [{ title: { contains: filters.q, mode: 'insensitive' } }, { excerpt: { contains: filters.q, mode: 'insensitive' } }] } : {}),
      ...(decoded
        ? {
            OR: [
              { publishedAt: { lt: new Date(decoded.createdAt) } },
              { publishedAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
            ],
          }
        : {}),
    }
    const rows = await this.prisma.newsArticle.findMany({
      where,
      take: take + 1,
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      include: this.authorInclude(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    const flags = await this.viewerFlags(items.map((a) => a.id), viewerId)
    return {
      data: items.map((a) => this.map(a, flags.liked.has(a.id), flags.saved.has(a.id), false)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.publishedAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  /** All articles authored by the current user (any status), newest first. */
  async listMine(authorId: string): Promise<ArticleResponse[]> {
    const rows = await this.prisma.newsArticle.findMany({
      where: { authorId, isDeleted: false },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      include: this.authorInclude(),
    })
    return rows.map((a) => this.map(a, false, false, false))
  }

  /** Top stories — most-liked recent published articles. */
  async featured(viewerId: string | undefined, limit = 3): Promise<ArticleResponse[]> {
    const rows = await this.prisma.newsArticle.findMany({
      where: { isDeleted: false, status: 'published', hiddenAt: null },
      take: Math.min(limit, 6),
      orderBy: [{ likesCount: 'desc' }, { publishedAt: 'desc' }],
      include: this.authorInclude(),
    })
    const flags = await this.viewerFlags(rows.map((a) => a.id), viewerId)
    return rows.map((a) => this.map(a, flags.liked.has(a.id), flags.saved.has(a.id), false))
  }

  async get(id: string, viewerId?: string): Promise<ArticleResponse> {
    const a = await this.prisma.newsArticle.findUnique({ where: { id }, include: this.authorInclude() })
    if (!a || a.isDeleted || a.status !== 'published' || a.hiddenAt) throw new NotFoundException({ code: 'ARTICLE_NOT_FOUND', message: 'Article not found' })
    const flags = await this.viewerFlags([a.id], viewerId)
    return this.map(a, flags.liked.has(a.id), flags.saved.has(a.id), true)
  }

  async create(authorId: string, input: CreateArticleInput): Promise<ArticleResponse> {
    const author = await this.prisma.profile.findUnique({
      where: { id: authorId },
      select: { verificationTier: true, professionalProfile: { select: { category: true } } },
    })
    if (!author) throw new NotFoundException({ code: 'AUTHOR_NOT_FOUND', message: 'Author not found' })
    const tier = this.tierFor(author)
    const created = await this.prisma.newsArticle.create({
      data: {
        authorId, title: input.title, excerpt: input.excerpt, body: input.body, tier,
        category: input.category ?? 'community',
        readMinutes: input.readMinutes ?? Math.max(1, Math.round(input.body.split(/\s+/).length / 200)),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
        ...(input.sourceName ? { sourceName: input.sourceName } : {}),
        ...(input.sourceUrl ? { sourceUrl: input.sourceUrl } : {}),
      },
      include: this.authorInclude(),
    })
    return this.map(created, false, false, true)
  }

  private async assertOwner(id: string, userId: string): Promise<void> {
    const a = await this.prisma.newsArticle.findUnique({ where: { id }, select: { authorId: true } })
    if (!a) throw new NotFoundException({ code: 'ARTICLE_NOT_FOUND', message: 'Article not found' })
    if (a.authorId !== userId) throw new ForbiddenException({ code: 'NOT_AUTHOR', message: 'Only the author can modify this article' })
  }

  async update(id: string, userId: string, input: UpdateArticleInput): Promise<ArticleResponse> {
    await this.assertOwner(id, userId)
    const updated = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.sourceName !== undefined ? { sourceName: input.sourceName } : {}),
        ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl } : {}),
        ...(input.readMinutes !== undefined ? { readMinutes: input.readMinutes } : {}),
      },
      include: this.authorInclude(),
    })
    const flags = await this.viewerFlags([id], userId)
    return this.map(updated, flags.liked.has(id), flags.saved.has(id), true)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwner(id, userId)
    await this.prisma.newsArticle.update({ where: { id }, data: { isDeleted: true } })
  }

  async setLike(id: string, userId: string, on: boolean): Promise<{ liked: boolean; likesCount: number }> {
    const a = await this.prisma.newsArticle.findUnique({ where: { id }, select: { id: true, isDeleted: true } })
    if (!a || a.isDeleted) throw new NotFoundException({ code: 'ARTICLE_NOT_FOUND', message: 'Article not found' })
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.newsLike.findUnique({ where: { articleId_userId: { articleId: id, userId } } })
      if (on && !existing) {
        await tx.newsLike.create({ data: { articleId: id, userId } })
        const u = await tx.newsArticle.update({ where: { id }, data: { likesCount: { increment: 1 } }, select: { likesCount: true } })
        return { liked: true, likesCount: u.likesCount }
      }
      if (!on && existing) {
        await tx.newsLike.delete({ where: { articleId_userId: { articleId: id, userId } } })
        const u = await tx.newsArticle.update({ where: { id }, data: { likesCount: { decrement: 1 } }, select: { likesCount: true } })
        return { liked: false, likesCount: u.likesCount }
      }
      const cur = await tx.newsArticle.findUnique({ where: { id }, select: { likesCount: true } })
      return { liked: on, likesCount: cur?.likesCount ?? 0 }
    })
  }

  async setSave(id: string, userId: string, on: boolean): Promise<{ saved: boolean; savesCount: number }> {
    const a = await this.prisma.newsArticle.findUnique({ where: { id }, select: { id: true, isDeleted: true } })
    if (!a || a.isDeleted) throw new NotFoundException({ code: 'ARTICLE_NOT_FOUND', message: 'Article not found' })
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.newsSave.findUnique({ where: { articleId_userId: { articleId: id, userId } } })
      if (on && !existing) {
        await tx.newsSave.create({ data: { articleId: id, userId } })
        const u = await tx.newsArticle.update({ where: { id }, data: { savesCount: { increment: 1 } }, select: { savesCount: true } })
        return { saved: true, savesCount: u.savesCount }
      }
      if (!on && existing) {
        await tx.newsSave.delete({ where: { articleId_userId: { articleId: id, userId } } })
        const u = await tx.newsArticle.update({ where: { id }, data: { savesCount: { decrement: 1 } }, select: { savesCount: true } })
        return { saved: false, savesCount: u.savesCount }
      }
      const cur = await tx.newsArticle.findUnique({ where: { id }, select: { savesCount: true } })
      return { saved: on, savesCount: cur?.savesCount ?? 0 }
    })
  }

  // ── Comments ─────────────────────────────────────────────────────────────

  private mapComment(c: Prisma.NewsCommentGetPayload<{
    include: { author: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
  }>): CommentResponse {
    return {
      id: c.id, body: c.body, createdAt: c.createdAt.toISOString(),
      author: {
        id: c.author.id, username: c.author.username, displayName: c.author.displayName,
        avatarUrl: c.author.avatarUrl, isVerified: c.author.verificationTier === 'professional',
      },
    }
  }

  async listComments(articleId: string, cursor: string | null, limit = 20): Promise<{ data: CommentResponse[]; nextCursor: string | null; hasMore: boolean }> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const rows = await this.prisma.newsComment.findMany({
      where: {
        articleId, isDeleted: false,
        ...(decoded
          ? { OR: [{ createdAt: { lt: new Date(decoded.createdAt) } }, { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } }] }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: items.map((c) => this.mapComment(c)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async addComment(articleId: string, authorId: string, input: CommentInput): Promise<CommentResponse> {
    const article = await this.prisma.newsArticle.findUnique({ where: { id: articleId }, select: { id: true, isDeleted: true, status: true, authorId: true, title: true } })
    if (!article || article.isDeleted || article.status !== 'published') throw new NotFoundException({ code: 'ARTICLE_NOT_FOUND', message: 'Article not found' })

    const created = await this.prisma.$transaction(async (tx) => {
      const c = await tx.newsComment.create({
        data: { articleId, authorId, body: input.body },
        include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
      })
      await tx.newsArticle.update({ where: { id: articleId }, data: { commentsCount: { increment: 1 } } })
      return c
    })

    if (article.authorId !== authorId) {
      const commenter = await this.prisma.profile.findUnique({ where: { id: authorId }, select: { displayName: true, username: true } })
      void this.notifications.enqueue({
        userId: article.authorId,
        type: 'news_comment',
        title: 'New comment on your article',
        body: `${commenter?.displayName ?? 'Someone'} commented on “${article.title}”`,
        data: { articleId, commenterUsername: commenter?.username },
      })
    }
    return this.mapComment(created)
  }

  async deleteComment(articleId: string, commentId: string, userId: string): Promise<void> {
    const comment = await this.prisma.newsComment.findUnique({ where: { id: commentId }, select: { id: true, articleId: true, authorId: true, isDeleted: true } })
    if (!comment || comment.isDeleted || comment.articleId !== articleId) throw new NotFoundException({ code: 'COMMENT_NOT_FOUND', message: 'Comment not found' })
    // The comment's author OR the article's author may delete it.
    const article = await this.prisma.newsArticle.findUnique({ where: { id: articleId }, select: { authorId: true } })
    if (comment.authorId !== userId && article?.authorId !== userId) {
      throw new ForbiddenException({ code: 'NOT_ALLOWED', message: 'You cannot delete this comment' })
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.newsComment.update({ where: { id: commentId }, data: { isDeleted: true } })
      await tx.newsArticle.update({ where: { id: articleId }, data: { commentsCount: { decrement: 1 } } })
    })
  }
}
