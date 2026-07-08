import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { Prisma, $Enums } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { FeedFanoutService } from '../queue/feed-fanout.service'
import { parseHashtags, parseMentions } from './caption-parser'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import type { CreatePostInput, UpdatePostInput } from './posts.schemas'

// ── Response shapes ─────────────────────────────────────────────────────────

export interface PostAuthor {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  professionalCategory: string | null
}

export interface PostMediaItem {
  id: string
  position: number
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  blurhash: string | null
}

export interface PostResponse {
  id: string
  author: PostAuthor
  community: { name: string; slug: string } | null
  kind: string
  metadata: Record<string, unknown> | null
  caption: string | null
  visibility: string
  media: PostMediaItem[]
  likesCount: number
  commentsCount: number
  savesCount: number
  sharesCount: number
  commentsDisabled: boolean
  createdAt: string
  /** Viewer flags — attached per request, never cached */
  viewerLiked: boolean
  viewerSaved: boolean
}

export interface PostPage {
  data: PostResponse[]
  nextCursor: string | null
  hasMore: boolean
}

const MAX_PAGE = 30

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    media: true
    author: {
      select: {
        id: true; username: true; displayName: true; avatarUrl: true
        verificationTier: true; isPrivate: true
        professionalProfile: { select: { category: true } }
      }
    }
    community: { select: { name: true; slug: true } }
  }
}>

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
    private readonly feedFanout: FeedFanoutService,
  ) {}

  // ── CREATE ────────────────────────────────────────────────────────────────

  async createPost(authorId: string, input: CreatePostInput): Promise<PostResponse> {
    const caption = input.caption?.trim() || null
    const media = [...(input.media ?? [])].sort((a, b) => a.position - b.position)

    // Anti-hotlink: media must live in the author's own storage folder
    for (const item of media) {
      if (!item.url.includes(`/post-media/${authorId}/`) && !item.url.includes(`/${authorId}/`)) {
        throw new BadRequestException({
          code: 'MEDIA_NOT_OWNED',
          message: 'Media must be uploaded to your own storage folder',
        })
      }
    }

    const hashtags = caption ? parseHashtags(caption) : []
    const mentionUsernames = caption ? parseMentions(caption) : []

    // Resolve mentioned users up front (invalid usernames silently dropped)
    const mentionedUsers = mentionUsernames.length
      ? await this.prisma.profile.findMany({
          where: { username: { in: mentionUsernames }, state: 'active', id: { not: authorId } },
          select: { id: true, username: true },
        })
      : []

    // Community post: only active members may post; forces visibility=community
    if (input.communityId) {
      const member = await this.prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: input.communityId, userId: authorId } },
        select: { status: true },
      })
      if (member?.status !== 'active') {
        throw new ForbiddenException({ code: 'NOT_COMMUNITY_MEMBER', message: 'Join the community to post in it' })
      }
    }

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          authorId,
          type: media.length > 0 ? 'image' : 'text',
          kind: input.kind ?? 'standard',
          ...(input.metadata ? { metadata: input.metadata as Prisma.InputJsonValue } : {}),
          ...(input.communityId ? { communityId: input.communityId } : {}),
          body: caption,
          visibility: input.communityId ? 'community' : (input.visibility ?? 'public'),
          commentsDisabled: input.commentsDisabled ?? false,
          media: {
            create: media.map((m) => ({
              position: m.position,
              url: m.url,
              thumbnailUrl: m.thumbnailUrl,
              width: m.width,
              height: m.height,
              fileSize: m.fileSize,
              blurhash: m.blurhash,
            })),
          },
        },
        include: this.postInclude(),
      })

      // Hashtags: upsert each tag with counter +1
      for (const tag of hashtags) {
        const hashtag = await tx.hashtag.upsert({
          where: { tag },
          create: { tag, postsCount: 1 },
          update: { postsCount: { increment: 1 } },
        })
        await tx.postHashtag.create({ data: { postId: created.id, hashtagId: hashtag.id } })
      }

      if (mentionedUsers.length > 0) {
        await tx.mention.createMany({
          data: mentionedUsers.map((u) => ({
            mentionedUserId: u.id,
            actorId: authorId,
            postId: created.id,
          })),
        })
      }

      await tx.profile.update({
        where: { id: authorId },
        data: { postsCount: { increment: 1 } },
      })

      return created
    })

    // ── Post-commit side effects ──
    await this.redis.invalidateProfile(authorId) // posts_count changed
    for (const tag of hashtags) {
      void this.redis.trendIncr(tag)
    }

    const author = await this.prisma.profile.findUnique({
      where: { id: authorId },
      select: { username: true, displayName: true },
    })

    // Mention notifications (skip if the mentioned user blocked the author)
    for (const mentioned of mentionedUsers) {
      const blocked = await this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: mentioned.id, blockedId: authorId } },
      })
      if (blocked) continue
      await this.notifications.enqueue({
        userId: mentioned.id,
        type: 'mention',
        title: 'Mentioned You',
        body: `${author?.displayName ?? 'Someone'} mentioned you in a post`,
        data: { postId: post.id, username: author?.username, actorId: authorId },
      })
    }

    // Feed fanout: bust followers' first pages + realtime post:new
    await this.feedFanout.enqueue(post.id, authorId)

    return this.mapPost(post, { liked: false, saved: false })
  }

  // ── READ ──────────────────────────────────────────────────────────────────

  async getPost(postId: string, viewerId?: string): Promise<PostResponse> {
    const post = await this.loadPost(postId)
    await this.assertCanViewPost(post, viewerId)
    const flags = viewerId ? await this.viewerFlags([postId], viewerId) : new Map()
    const flag = flags.get(postId) ?? { liked: false, saved: false }
    return this.mapPost(post, flag)
  }

  /** Profile grid — the author's posts, privacy-gated, cursor-paginated. */
  async getProfilePosts(
    profileId: string,
    viewerId: string | undefined,
    cursor: string | null,
    limit = 12,
    mediaOnly = false,
  ): Promise<PostPage> {
    await this.assertCanViewAuthor(profileId, viewerId)
    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null

    // Per-post visibility on the profile grid:
    //   self → every post; accepted follower → public + followers; else → public only.
    //   (private account + non-follower already rejected by assertCanViewAuthor above)
    let visibilityFilter: Prisma.PostWhereInput = {}
    if (profileId !== viewerId) {
      let isFollower = false
      if (viewerId) {
        const f = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: profileId } },
          select: { status: true },
        })
        isFollower = f?.status === 'active'
      }
      const allowed = (isFollower ? ['public', 'followers'] : ['public']) as $Enums.PostVisibility[]
      visibilityFilter = { visibility: { in: allowed } }
    }

    const posts = await this.prisma.post.findMany({
      where: {
        authorId: profileId,
        isDeleted: false,
        ...visibilityFilter,
        ...(mediaOnly ? { media: { some: {} } } : {}),
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
      include: this.postInclude(),
    })

    return this.buildPage(posts, take, viewerId)
  }

  /** Private saved grid — strictly the viewer's own saves. */
  async getSavedPosts(viewerId: string, cursor: string | null, limit = 12): Promise<PostPage> {
    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null

    const saves = await this.prisma.savedPost.findMany({
      where: {
        userId: viewerId,
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), postId: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { postId: 'desc' }],
      include: {
        post: { include: this.postInclude() },
      },
    })

    const hasMore = saves.length > take
    const items = hasMore ? saves.slice(0, take) : saves
    const visible = items.filter((s) => !s.post.isDeleted)
    const flags = await this.viewerFlags(visible.map((s) => s.postId), viewerId)

    return {
      data: visible.map((s) =>
        this.mapPost(s.post, flags.get(s.postId) ?? { liked: false, saved: true }),
      ),
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.postId)
        : null,
      hasMore,
    }
  }

  /** A community's post feed — active members only. */
  async getCommunityPosts(
    communityId: string,
    viewerId: string,
    cursor: string | null,
    limit = 15,
  ): Promise<PostPage> {
    const member = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: viewerId } },
      select: { status: true },
    })
    if (member?.status !== 'active') {
      throw new ForbiddenException({ code: 'NOT_COMMUNITY_MEMBER', message: 'Join the community to view its posts' })
    }

    const take = Math.min(limit, MAX_PAGE)
    const decoded = cursor ? decodeCursor(cursor) : null
    const posts = await this.prisma.post.findMany({
      where: {
        communityId,
        isDeleted: false,
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
      include: this.postInclude(),
    })
    return this.buildPage(posts, take, viewerId)
  }

  // ── UPDATE / DELETE ───────────────────────────────────────────────────────

  async updatePost(postId: string, authorId: string, input: UpdatePostInput): Promise<PostResponse> {
    const post = await this.loadPost(postId)
    if (post.authorId !== authorId) {
      throw new ForbiddenException({ code: 'NOT_AUTHOR', message: 'You can only edit your own posts' })
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(input.caption !== undefined ? { body: input.caption.trim() || null } : {}),
        ...(input.commentsDisabled !== undefined ? { commentsDisabled: input.commentsDisabled } : {}),
      },
      include: this.postInclude(),
    })

    await this.redis.invalidatePost(postId)
    await this.realtime.publish(`post:${postId}`, 'post:updated', {
      postId,
      caption: updated.body,
      commentsDisabled: updated.commentsDisabled,
    })

    const flags = await this.viewerFlags([postId], authorId)
    return this.mapPost(updated, flags.get(postId) ?? { liked: false, saved: false })
  }

  async deletePost(postId: string, authorId: string): Promise<void> {
    const post = await this.loadPost(postId)
    if (post.authorId !== authorId) {
      throw new ForbiddenException({ code: 'NOT_AUTHOR', message: 'You can only delete your own posts' })
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id: postId },
        data: { isDeleted: true, deletedAt: new Date() },
      })
      await tx.profile.update({
        where: { id: authorId },
        data: { postsCount: { decrement: 1 } },
      })
      // Hashtag counters −1
      const tags = await tx.postHashtag.findMany({ where: { postId }, select: { hashtagId: true } })
      if (tags.length) {
        await tx.hashtag.updateMany({
          where: { id: { in: tags.map((t) => t.hashtagId) } },
          data: { postsCount: { decrement: 1 } },
        })
      }
    })

    await this.redis.invalidatePost(postId)
    await this.redis.invalidateProfile(authorId)
    await this.realtime.publish(`post:${postId}`, 'post:deleted', { postId })
    this.logger.log(`Post ${postId} soft-deleted by author ${authorId}`)
  }

  // ── PRIVACY GATE ──────────────────────────────────────────────────────────

  /**
   * Instagram semantics: a post the viewer cannot see is a 404, never a 403 —
   * don't confirm existence.
   */
  async assertCanViewPost(
    post: {
      authorId: string
      isDeleted: boolean
      visibility?: string
      communityId?: string | null
      author?: { isPrivate: boolean }
    },
    viewerId?: string,
  ): Promise<void> {
    const notFound = new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Post not found' })
    if (post.isDeleted) throw notFound
    if (post.authorId === viewerId) return // own post — any visibility

    // Account-level gate (block + private account → accepted followers only)
    await this.assertCanViewAuthor(post.authorId, viewerId, post.author?.isPrivate)

    // Per-post visibility gate (applies even when the author's account is public)
    const visibility = post.visibility ?? 'public'
    if (visibility === 'public') return
    if (visibility === 'private') throw notFound // author-only (author already returned)

    if (visibility === 'community') {
      if (!viewerId || !post.communityId) throw notFound
      const member = await this.prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: post.communityId, userId: viewerId } },
        select: { status: true },
      })
      if (member?.status !== 'active') throw notFound
      return
    }

    // 'followers' → must be an accepted follower
    if (!viewerId) throw notFound
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: viewerId, followingId: post.authorId } },
      select: { status: true },
    })
    if (follow?.status !== 'active') throw notFound
  }

  async assertCanViewAuthor(authorId: string, viewerId?: string, knownIsPrivate?: boolean): Promise<void> {
    if (authorId === viewerId) return

    const notFound = new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Post not found' })

    if (viewerId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: authorId },
          ],
        },
      })
      if (blocked) throw notFound
    }

    let isPrivate = knownIsPrivate
    if (isPrivate === undefined) {
      const author = await this.prisma.profile.findUnique({
        where: { id: authorId },
        select: { isPrivate: true, state: true },
      })
      if (!author || author.state !== 'active') throw notFound
      isPrivate = author.isPrivate
    }

    if (!isPrivate) return

    if (!viewerId) throw notFound
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: viewerId, followingId: authorId } },
    })
    if (follow?.status !== 'active') throw notFound
  }

  // ── SHARED HELPERS (used by feed / engagement / comments) ────────────────

  postInclude() {
    return {
      media: { orderBy: { position: 'asc' as const } },
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          verificationTier: true,
          isPrivate: true,
          professionalProfile: { select: { category: true } },
        },
      },
      community: { select: { name: true, slug: true } },
    }
  }

  /**
   * Slim loader for engagement/comment gates — skips the heavy media/author
   * includes when only identity + privacy fields are needed.
   */
  async loadPostSlim(postId: string): Promise<{
    id: string
    authorId: string
    isDeleted: boolean
    commentsDisabled: boolean
    likesCount: number
    visibility: string
    communityId: string | null
    author: { isPrivate: boolean; state: string }
  }> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        isDeleted: true,
        commentsDisabled: true,
        likesCount: true,
        visibility: true,
        communityId: true,
        author: { select: { isPrivate: true, state: true } },
      },
    })
    if (!post || post.isDeleted) {
      throw new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Post not found' })
    }
    return post
  }

  async loadPost(postId: string): Promise<PostWithRelations> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: this.postInclude(),
    })
    if (!post || post.isDeleted) {
      throw new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Post not found' })
    }
    return post
  }

  /** Batch viewer flags for a page of posts — 2 IN-queries, never N+1. */
  async viewerFlags(
    postIds: string[],
    viewerId: string,
  ): Promise<Map<string, { liked: boolean; saved: boolean }>> {
    if (postIds.length === 0) return new Map()
    const [likes, saves] = await Promise.all([
      this.prisma.like.findMany({
        where: { userId: viewerId, postId: { in: postIds } },
        select: { postId: true },
      }),
      this.prisma.savedPost.findMany({
        where: { userId: viewerId, postId: { in: postIds } },
        select: { postId: true },
      }),
    ])
    const likedSet = new Set(likes.map((l) => l.postId))
    const savedSet = new Set(saves.map((s) => s.postId))
    return new Map(postIds.map((id) => [id, { liked: likedSet.has(id), saved: savedSet.has(id) }]))
  }

  async buildPage(
    posts: PostWithRelations[],
    take: number,
    viewerId?: string,
  ): Promise<PostPage> {
    const hasMore = posts.length > take
    const items = hasMore ? posts.slice(0, take) : posts
    const flags = viewerId ? await this.viewerFlags(items.map((p) => p.id), viewerId) : new Map()

    return {
      data: items.map((p) => this.mapPost(p, flags.get(p.id) ?? { liked: false, saved: false })),
      nextCursor: hasMore
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id)
        : null,
      hasMore,
    }
  }

  mapPost(post: PostWithRelations, viewer: { liked: boolean; saved: boolean }): PostResponse {
    return {
      id: post.id,
      author: {
        id: post.author.id,
        username: post.author.username,
        displayName: post.author.displayName,
        avatarUrl: post.author.avatarUrl,
        isVerified: post.author.verificationTier === 'professional',
        professionalCategory: post.author.professionalProfile?.category ?? null,
      },
      community: post.community ? { name: post.community.name, slug: post.community.slug } : null,
      kind: post.kind,
      metadata: (post.metadata as Record<string, unknown> | null) ?? null,
      caption: post.body,
      visibility: post.visibility,
      media: post.media.map((m) => ({
        id: m.id,
        position: m.position,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        width: m.width,
        height: m.height,
        blurhash: m.blurhash,
      })),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      savesCount: post.savesCount,
      sharesCount: post.sharesCount,
      commentsDisabled: post.commentsDisabled,
      createdAt: post.createdAt.toISOString(),
      viewerLiked: viewer.liked,
      viewerSaved: viewer.saved,
    }
  }
}
