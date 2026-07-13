import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { Prisma, $Enums } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { StoryMediaService } from '../queue/story-media.service'
import { MEDIA_STORAGE, type MediaStorage } from './media/media-storage.interface'
import { RefResolverService } from './refs/ref-resolver.service'
import type { StoryRefResult } from './refs/ref-resolver.interface'
import { parseHashtags, parseMentions } from '../posts/caption-parser'
import type { CreateStoryInput, UploadUrlQuery } from './stories.schemas'
import { StickerRegistryService, type StickerInput } from './stickers/sticker-registry.service'
import type { StickerRenderItem } from './stickers/sticker-handler.interface'
import { ProfanityService } from '../common/moderation/profanity.service'

// ── Response shapes ─────────────────────────────────────────────────────────

export interface StoryAuthor {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

export interface StoryMediaItem {
  id: string
  type: string
  imageUrl: string | null
  hlsUrl: string | null
  thumbnailUrl: string | null
  previewUrl: string | null
  blurhash: string | null
  width: number | null
  height: number | null
  durationMs: number | null
}

export interface StoryMusicInfo {
  trackId: string
  title: string
  artist: string
  album: string | null
  coverUrl: string | null
  durationMs: number
  startMs: number
  volume: number
  fadeIn: boolean
  fadeOut: boolean
  muteOriginal: boolean
  attribution: string | null
}

export interface StoryResponse {
  id: string
  author: StoryAuthor
  type: string
  status: string
  privacy: string
  caption: string | null
  background: Record<string, unknown> | null
  media: StoryMediaItem[]
  durationMs: number
  viewsCount: number
  reactionsCount: number
  repliesCount: number
  allowReplies: boolean
  allowReactions: boolean
  createdAt: string
  expiresAt: string | null
  /** Resolved share-to-story reference card — null for non-shared types */
  ref: StoryRefResult | null
  /** Music track attached to the story — null for stories without music */
  music: StoryMusicInfo | null
  /** Overlay stickers — hydrated at view time */
  stickers: StickerRenderItem[]
  /** Viewer flags — attached per request, never cached */
  viewerSeen: boolean
  viewerReacted: boolean
}

// ── Response shapes (mirrors the Prisma Story model + joins) ────────────────
// Prisma client types are unavailable until `prisma generate` runs on the
// updated schema. This local shape mirrors `Prisma.StoryGetPayload<…>`.

export interface StoryRow {
  id: string
  authorId: string
  type: string
  status: string
  privacy: string
  segmentIndex: number
  segmentGroupId: string | null
  caption: string | null
  background: unknown | null
  refType: string | null
  refId: string | null
  durationMs: number
  viewsCount: number
  reactionsCount: number
  repliesCount: number
  impressionsCount: number
  allowReplies: boolean
  allowReactions: boolean
  isArchived: boolean
  isDeleted: boolean
  publishedAt: Date | null
  expiresAt: Date | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  /** Joined relations */
  stickers: {
    id: string
    storyId: string
    kind: string
    payload: unknown
    transform: unknown
    createdAt: Date
  }[]
  music: ({
    trackId: string
    startMs: number
    durationMs: number | null
    volume: number
    fadeIn: boolean
    fadeOut: boolean
    muteOriginal: boolean
    track: {
      id: string
      title: string
      artist: string
      album: string | null
      coverUrl: string | null
      durationMs: number
      license: string
      attribution: string | null
    }
  }) | null
  media: {
    id: string
    storyId: string
    type: string
    hlsUrl: string | null
    mp4FallbackUrl: string | null
    imageUrl: string | null
    renditions: unknown | null
    thumbnailUrl: string | null
    previewUrl: string | null
    blurhash: string | null
    width: number | null
    height: number | null
    durationMs: number | null
    fileSize: number | null
    createdAt: Date
  }[]
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    verificationTier: string
    isPrivate: boolean
    state: string
  }
}

/**
 * Minimal story shape for privacy-gate queries — no media, just identity +
 * permission fields. Reduces query size for the hottest path (tray hydration
 * asserts privacy on every candidate ring).
 */
interface StoryPrivacyShape {
  id: string
  authorId: string
  status: string
  privacy: string
  isDeleted: boolean
  expiresAt: Date | null
  author: {
    isPrivate: boolean
    state: string
    verificationTier: string
  }
}

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
    private readonly storyMedia: StoryMediaService,
    @Inject(MEDIA_STORAGE) private readonly storage: MediaStorage,
    private readonly refResolver: RefResolverService,
    private readonly stickerRegistry: StickerRegistryService,
    private readonly profanity: ProfanityService,
  ) {}

  // ── UPLOAD URL ────────────────────────────────────────────────────────────

  async getUploadUrl(userId: string, query: UploadUrlQuery): Promise<{ uploadUrl: string; path: string }> {
    const ext = query.mime.split('/')[1] ?? 'bin'
    const filename = `story-${Date.now()}.${ext}`
    const result = await this.storage.createUploadUrl(userId, filename, query.mime)
    return { uploadUrl: result.uploadUrl, path: result.path }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────

  async createStory(authorId: string, input: CreateStoryInput): Promise<{ story: StoryResponse; status: string }> {
    const caption = input.caption?.trim() || null
    if (caption) this.profanity.assertClean(caption, { actorId: authorId, entityType: 'story' })
    const media = (input.media ?? []).sort((a, b) => (a.path < b.path ? -1 : 1))

    // Anti-hotlink: media must live in the author's own storage folder
    for (const item of media) {
      if (!item.path.includes(`/${authorId}/`)) {
        throw new BadRequestException({
          code: 'MEDIA_NOT_OWNED',
          message: 'Media must be uploaded to your own storage folder',
        })
      }
    }

    // Parse caption for hashtags and mentions; merge with explicitly provided ones
    const captionHashtags = caption ? parseHashtags(caption) : []
    const captionMentions = caption ? parseMentions(caption) : []
    const uniqueHashtags = [...new Set([...captionHashtags, ...(input.hashtags ?? []).map((t) => t.toLowerCase())])]
    const mentionUsernames = [...new Set([...captionMentions, ...(input.mentions ?? [])])]

    // Resolve mentioned users up front (invalid usernames silently dropped)
    const mentionedUsers = mentionUsernames.length
      ? await this.prisma.profile.findMany({
          where: {
            username: { in: mentionUsernames },
            state: 'active',
            id: { not: authorId },
          },
          select: { id: true, username: true },
        })
      : []

    const durationMs = media.length > 0 ? (media[0]?.durationMs ?? 5_000) : 5_000

    // Validate stickers via the registry before the TX
    const validatedStickers = input.stickers?.length
      ? this.stickerRegistry.validateBatch(input.stickers as StickerInput[])
      : []

    const story = await this.prisma.$transaction(async (tx) => {
      const created = await tx.story.create({
        data: {
          authorId,
          type: input.type,
          // text stories are synchronously ready; photo/video wait for the media worker
          status: input.type === 'text' ? 'ready' : 'processing',
          privacy: input.privacy ?? 'followers',
          caption,
          ...(input.background ? { background: input.background as Prisma.InputJsonValue } : {}),
          ...(input.refType ? { refType: input.refType } : {}),
          ...(input.refId ? { refId: input.refId } : {}),
          durationMs,
          publishedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          allowReplies: input.allowReplies ?? true,
          allowReactions: input.allowReactions ?? true,
          ...(validatedStickers.length > 0
            ? {
                stickers: {
                  create: validatedStickers.map((s) => ({
                    kind: s.kind as $Enums.StickerType,
                    payload: s.payload as Prisma.InputJsonValue,
                    transform: s.transform as unknown as Prisma.InputJsonValue,
                  })),
                },
              }
            : {}),
          ...(media.length > 0
            ? {
                media: {
                  create: media.map((m) => ({
                    type: (input.type === 'video' ? 'video' : 'image') as $Enums.StoryMediaType,
                    imageUrl: m.path,
                    width: m.width,
                    height: m.height,
                    blurhash: m.blurhash,
                    durationMs: m.durationMs,
                  })),
                },
              }
            : {}),
        },
        include: this.storyInclude(),
      })

      // Hashtags: upsert each tag with counter +1
      for (const tag of uniqueHashtags) {
        const hashtag = await tx.hashtag.upsert({
          where: { tag },
          create: { tag, postsCount: 1 },
          update: { postsCount: { increment: 1 } },
        })
        await tx.storyHashtag.create({
          data: { storyId: created.id, hashtagId: hashtag.id },
        })
      }

      // Create mention rows
      if (mentionedUsers.length > 0) {
        await tx.storyMention.createMany({
          data: mentionedUsers.map((u) => ({
            mentionedUserId: u.id,
            actorId: authorId,
            storyId: created.id,
          })),
        })
      }

      return created
    })

    // ── Post-commit side effects ──

    // Trend hashtags in Redis
    for (const tag of uniqueHashtags) {
      void this.redis.trendIncr(tag).catch(() => {})
    }

    // Trend music in Redis (if a music track was attached)
    if (input.music?.trackId) {
      void this.redis.musicTrendIncr(input.music.trackId).catch(() => {})
    }

    // Text stories are immediately ready — push to followers' trays
    if (input.type === 'text') {
      await this.realtime.publish(`tray:${authorId}`, 'story:new', {
        authorId,
        storyId: story.id,
      })
    }

    // Enqueue media processing (status=processing → worker flips to ready)
    if (input.type === 'video') {
      for (const m of story.media) {
        await this.storyMedia.enqueueVideoTranscode(story.id, m.id, authorId)
      }
    } else if (input.type === 'photo') {
      for (const m of story.media) {
        await this.storyMedia.enqueueImageOptimization(story.id, m.id, authorId)
      }
    }

    // Mention notifications (skip if the mentioned user blocked the author)
    const author = await this.prisma.profile.findUnique({
      where: { id: authorId },
      select: { username: true, displayName: true },
    })

    for (const mentioned of mentionedUsers) {
      const blocked = await this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: mentioned.id, blockedId: authorId } },
      })
      if (blocked) continue
      await this.notifications.enqueue({
        userId: mentioned.id,
        type: 'story_mention',
        title: 'Mentioned You',
        body: `${author?.displayName ?? 'Someone'} mentioned you in their story`,
        data: { storyId: story.id, username: author?.username, actorId: authorId },
      })
    }

    return {
      story: this.mapStory(story, { seen: false, reacted: false }),
      status: story.status,
    }
  }

  // ── READ ──────────────────────────────────────────────────────────────────

  async getStory(storyId: string, viewerId?: string): Promise<StoryResponse> {
    const story = await this.loadStory(storyId)
    await this.assertCanViewStory(story, viewerId)
    const flags = viewerId ? await this.viewerFlags([storyId], viewerId) : new Map()
    const flag = flags.get(storyId) ?? { seen: false, reacted: false }

    // Resolve share-to-story reference for shared types
    let ref: StoryRefResult | null = null
    if (story.refType && story.refId) {
      ref = await this.refResolver.resolve(story.refType, story.refId, viewerId)
    }

    // Hydrate stickers for the viewer
    const stickers = await this.stickerRegistry.hydrateBatch(
      (story.stickers ?? []).map((s: { id: string; kind: string; payload: unknown; transform: unknown }) => ({
        id: s.id,
        kind: s.kind as import('./stickers/sticker-handler.interface').StickerKind,
        payload: s.payload as Record<string, unknown>,
        transform: s.transform as import('./stickers/sticker-handler.interface').StickerTransform,
      })),
      viewerId,
    )

    return this.mapStory(story, flag, ref, stickers)
  }

  /**
   * GET /stories/ref/:refType/:refId
   * Resolve a share-to-story reference independently — used by the composer
   * to preview the reference card before publishing.
   */
  async resolveRef(refType: string, refId: string, viewerId?: string): Promise<StoryRefResult> {
    return this.refResolver.resolve(refType, refId, viewerId)
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  async deleteStory(storyId: string, authorId: string): Promise<void> {
    const story = await this.loadStory(storyId)
    if (story.authorId !== authorId) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.story.update({
        where: { id: storyId },
        data: { isDeleted: true, deletedAt: new Date() },
      })
    })

    await this.redis.invalidateStory(storyId)
    await this.realtime.publish(`tray:${authorId}`, 'story:delete', { storyId, authorId })
    this.logger.log(`Story ${storyId} soft-deleted by author ${authorId}`)
  }

  // ── PRIVACY GATE ──────────────────────────────────────────────────────────

  /**
   * Instagram semantics: a story the viewer cannot see is a 404, never a 403 —
   * don't confirm existence.
   *
   * Matrix (see docs/stories-architecture.md §6):
   *   public      → anyone who can see the profile
   *   followers   → accepted followers (default)
   *   close_friends → curated list — not yet implementable, degrades to 404
   *   professional  → followers of a professional/verified account
   */
  async assertCanViewStory(
    story: StoryPrivacyShape,
    viewerId?: string,
  ): Promise<void> {
    const notFound = new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })

    if (story.isDeleted) throw notFound
    if (story.status !== 'ready' && story.authorId !== viewerId) throw notFound
    if (story.expiresAt && story.expiresAt <= new Date()) throw notFound

    if (story.authorId === viewerId) return

    // Block check (either direction)
    if (viewerId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: story.authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: story.authorId },
          ],
        },
      })
      if (blocked) throw notFound
    }

    // Author state check
    if (!story.author || story.author.state !== 'active') throw notFound

    // Privacy matrix
    switch (story.privacy) {
      case 'public':
        return // anyone can see

      case 'followers': {
        if (!viewerId) throw notFound
        if (story.author.isPrivate) {
          const follow = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: viewerId, followingId: story.authorId } },
          })
          if (follow?.status !== 'active') throw notFound
        }
        return
      }

      case 'close_friends':
        // No close_friends table yet — always 404 until that feature ships
        throw notFound

      case 'professional': {
        if (!viewerId) throw notFound
        if (story.author.verificationTier !== 'professional') throw notFound
        const follow = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: story.authorId } },
        })
        if (follow?.status !== 'active') throw notFound
        return
      }

      default:
        throw notFound
    }
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  private storyInclude() {
    return {
      media: true,
      stickers: true,
      music: {
        include: {
          track: {
            select: {
              id: true,
              title: true,
              artist: true,
              album: true,
              coverUrl: true,
              durationMs: true,
              license: true,
              attribution: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          verificationTier: true,
          isPrivate: true,
          state: true,
        },
      },
    } as const
  }

  /** Full story loader — includes media + author. */
  async loadStory(storyId: string): Promise<StoryRow> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: this.storyInclude(),
    })
    if (!story || story.isDeleted) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }
    return story
  }

  /** Batch viewer flags for a page of stories — 2 IN-queries, never N+1. */
  async viewerFlags(
    storyIds: string[],
    viewerId: string,
  ): Promise<Map<string, { seen: boolean; reacted: boolean }>> {
    if (storyIds.length === 0) return new Map()
    const [views, reactions] = await Promise.all([
      this.prisma.storyView.findMany({
        where: { viewerId, storyId: { in: storyIds } },
        select: { storyId: true },
      }),
      this.prisma.storyReaction.findMany({
        where: { userId: viewerId, storyId: { in: storyIds } },
        select: { storyId: true },
      }),
    ])
    const seenSet = new Set(views.map((v: { storyId: string }) => v.storyId))
    const reactedSet = new Set(reactions.map((r: { storyId: string }) => r.storyId))
    return new Map(storyIds.map((id: string) => [id, { seen: seenSet.has(id), reacted: reactedSet.has(id) }]))
  }

  private mapStory(
    story: StoryRow,
    viewer: { seen: boolean; reacted: boolean },
    ref: StoryRefResult | null = null,
    stickers: StickerRenderItem[] = [],
  ): StoryResponse {
    return {
      id: story.id,
      author: {
        id: story.author.id,
        username: story.author.username,
        displayName: story.author.displayName,
        avatarUrl: story.author.avatarUrl,
        isVerified: story.author.verificationTier === 'professional',
      },
      type: story.type,
      status: story.status,
      privacy: story.privacy,
      caption: story.caption,
      background: story.background as Record<string, unknown> | null,
      media: story.media.map((m) => ({
        id: m.id,
        type: m.type,
        imageUrl: m.imageUrl,
        hlsUrl: m.hlsUrl,
        thumbnailUrl: m.thumbnailUrl,
        previewUrl: m.previewUrl,
        blurhash: m.blurhash,
        width: m.width,
        height: m.height,
        durationMs: m.durationMs,
      })),
      durationMs: story.durationMs,
      viewsCount: story.viewsCount,
      reactionsCount: story.reactionsCount,
      repliesCount: story.repliesCount,
      allowReplies: story.allowReplies,
      allowReactions: story.allowReactions,
      music: story.music
        ? {
            trackId: story.music.track.id,
            title: story.music.track.title,
            artist: story.music.track.artist,
            album: story.music.track.album,
            coverUrl: story.music.track.coverUrl,
            durationMs: story.music.track.durationMs,
            startMs: story.music.startMs,
            volume: story.music.volume,
            fadeIn: story.music.fadeIn,
            fadeOut: story.music.fadeOut,
            muteOriginal: story.music.muteOriginal,
            attribution: story.music.track.attribution,
          }
        : null,
      stickers,
      createdAt: story.createdAt.toISOString(),
      expiresAt: story.expiresAt?.toISOString() ?? null,
      ref,
      viewerSeen: viewer.seen,
      viewerReacted: viewer.reacted,
    }
  }
}
