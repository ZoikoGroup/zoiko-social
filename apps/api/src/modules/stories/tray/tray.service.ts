import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import type { StoryAuthor } from '../stories.service'

// ── Types ────────────────────────────────────────────────────────────────────

export interface TrayStorySummary {
  id: string
  type: string
  posterUrl: string | null   // preview_url for tray poster (tiny), fallback to thumbnail_url
  blurhash: string | null
  durationMs: number
  seen: boolean
}

export interface TrayRing {
  author: StoryAuthor
  hasUnseen: boolean
  latestStoryAt: string
  stories: TrayStorySummary[]
}

export interface TrayResponse {
  rings: TrayRing[]
}

/**
 * TrayService — builds the story tray for a viewer.
 *
 * Ordering (from §5.1):
 *   1. Own ring → ALWAYS first
 *   2. Unread rings → authors with ≥1 story the viewer hasn't seen,
 *      sorted by most-recent-story DESC
 *   3. Viewed rings → all seen, sorted by most-recent-story DESC
 *
 * Serving pipeline (§5.2):
 *   1. Candidate authors → following ∩ active-stories
 *   2. Ring hydration → story:tray:{authorId} L2 cache (or PG miss)
 *   3. Seen decoration → SMEMBERS seen:{viewerId}
 *   4. Ordering → own → unseen → seen
 *   5. Response → { rings: [...] }
 */
@Injectable()
export class TrayService {
  private readonly logger = new Logger(TrayService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getTray(viewerId: string): Promise<TrayResponse> {
    // 1. Candidate authors: followees who have active (ready, not expired) stories
    const authorIds = await this.getCandidateAuthors(viewerId)

    if (authorIds.length === 0) {
      // Own ring with zero stories still shows for the "＋ Your Story" button
      return {
        rings: [
          {
            author: await this.getOwnAuthor(viewerId),
            hasUnseen: false,
            latestStoryAt: '',
            stories: [],
          },
        ],
      }
    }

    // 2. Hydrate each author's tray — from Redis cache or PG
    const ringPromises = authorIds.map((authorId) => this.hydrateRing(authorId))
    const rings = await Promise.all(ringPromises)
    const hydrated = rings.filter((r): r is TrayRing => r !== null)

    if (hydrated.length === 0) {
      return {
        rings: [
          {
            author: await this.getOwnAuthor(viewerId),
            hasUnseen: false,
            latestStoryAt: '',
            stories: [],
          },
        ],
      }
    }

    // 3. Seen decoration: load viewer's seen-set
    const seenSet = await this.redis.seenGetAll(viewerId)

    for (const ring of hydrated) {
      let hasUnseen = false
      for (const story of ring.stories) {
        story.seen = seenSet.has(story.id)
        if (!story.seen) hasUnseen = true
      }
      ring.hasUnseen = hasUnseen
    }

    // 4. Order: own → unseen (recent desc) → seen (recent desc)
    const own = hydrated.find((r) => r.author.id === viewerId)
    const unseen = hydrated.filter((r) => r.author.id !== viewerId && r.hasUnseen)
    const viewed = hydrated.filter((r) => r.author.id !== viewerId && !r.hasUnseen)

    unseen.sort((a, b) => b.latestStoryAt.localeCompare(a.latestStoryAt))
    viewed.sort((a, b) => b.latestStoryAt.localeCompare(a.latestStoryAt))

    const ordered: TrayRing[] = []
    if (own) ordered.push(own)
    ordered.push(...unseen, ...viewed)

    // If viewer has no stories, still show own ring with empty story list
    if (!own) {
      ordered.unshift({
        author: await this.getOwnAuthor(viewerId),
        hasUnseen: false,
        latestStoryAt: '',
        stories: [],
      })
    }

    return { rings: ordered }
  }

  /** Get a single author's ring (for the viewer to open). */
  async getUserRing(viewerId: string, authorId: string): Promise<TrayRing | null> {
    const ring = await this.hydrateRing(authorId)
    if (!ring) return null

    // Gate: viewer must be able to see the author's stories
    // (block check, privacy check — reuse a slim version)
    if (authorId !== viewerId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: authorId },
          ],
        },
      })
      if (blocked) return null
    }

    const seenSet = await this.redis.seenGetAll(viewerId)
    let hasUnseen = false
    for (const story of ring.stories) {
      story.seen = seenSet.has(story.id)
      if (!story.seen) hasUnseen = true
    }
    ring.hasUnseen = hasUnseen

    return ring
  }

  // ── INTERNAL ─────────────────────────────────────────────────────────────

  /**
   * Find authors the viewer follows who have ≥1 active (ready, not expired) story.
   *
   * Fast path: intersect Redis `author-activity` ZSET with the viewer's following set.
   * Miss/fallback: SQL query.
   */
  private async getCandidateAuthors(viewerId: string): Promise<string[]> {
    const candidates = new Set<string>()

    // Own ring first (§5.1): include the viewer if they have ≥1 active story.
    const ownActive = await this.prisma.story.count({
      where: {
        authorId: viewerId,
        status: 'ready',
        isDeleted: false,
        expiresAt: { gt: new Date() },
      },
    })
    const ownBias = ownActive > 0 ? 1 : 0
    if (ownActive > 0) candidates.add(viewerId)

    // Followees with active stories — Redis fast path
    const activeAuthors = await this.redis.authorActivityGet(500)
    if (activeAuthors.length > 0) {
      const followingIds = await this.getFollowingIds(viewerId)
      if (followingIds.size > 0) {
        for (const id of activeAuthors) {
          if (followingIds.has(id)) candidates.add(id)
        }
        // Fast path found followee candidates → trust it, skip the SQL fallback
        if (candidates.size > ownBias) return [...candidates]
      }
    }

    // Fallback: SQL — followees with active stories
    const rows = await this.prisma.profile.findMany({
      where: {
        followsAsFollowing: {
          some: { followerId: viewerId, status: 'active' },
        },
        stories: {
          some: {
            status: 'ready',
            isDeleted: false,
            expiresAt: { gt: new Date() },
          },
        },
      },
      select: { id: true },
      take: 200,
    })
    for (const r of rows) candidates.add(r.id)

    return [...candidates]
  }

  /** Fetch the viewer's following set (cached via Redis relationship pattern). */
  private async getFollowingIds(viewerId: string): Promise<Set<string>> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: viewerId, status: 'active' },
      select: { followingId: true },
    })
    return new Set(rows.map((r) => r.followingId))
  }

  /**
   * Hydrate a single author's ring — story summaries with poster/blurhash.
   *
   * Tries Redis cache `story:tray:{authorId}` first, then PG.
   * Only selects stories that are `ready`, not deleted, not expired.
   */
  private async hydrateRing(authorId: string): Promise<TrayRing | null> {
    // Try Redis
    const cached = await this.redis.getStoryTray<TrayRing>(authorId)
    if (cached && cached.stories.length > 0) return cached

    // PG miss — query active stories
    const author = await this.prisma.profile.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        verificationTier: true,
      },
    })
    if (!author) return null

    const stories = await this.prisma.story.findMany({
      where: {
        authorId,
        status: 'ready',
        isDeleted: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'asc' as const }, // oldest first within ring
      select: {
        id: true,
        type: true,
        durationMs: true,
        createdAt: true,
        media: {
          select: {
            previewUrl: true,
            thumbnailUrl: true,
            blurhash: true,
          },
          take: 1,
        },
      },
    })

    if (stories.length === 0) return null

    const ring: TrayRing = {
      author: {
        id: author.id,
        username: author.username,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
        isVerified: author.verificationTier === 'professional',
      },
      hasUnseen: true,
      latestStoryAt: stories[stories.length - 1].createdAt.toISOString(),
      stories: stories.map((s) => {
        const poster = s.media?.[0]
        return {
          id: s.id,
          type: s.type,
          posterUrl: poster?.previewUrl ?? poster?.thumbnailUrl ?? null,
          blurhash: poster?.blurhash ?? null,
          durationMs: s.durationMs,
          seen: false, // will be set by seen decoration
        }
      }),
    }

    // Cache the ring
    await this.redis.setStoryTray(authorId, ring)

    return ring
  }

  private async getOwnAuthor(viewerId: string): Promise<StoryAuthor> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: viewerId },
      select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
    })
    if (!profile) {
      return { id: viewerId, username: 'unknown', displayName: 'Unknown', avatarUrl: null, isVerified: false }
    }
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      isVerified: profile.verificationTier === 'professional',
    }
  }
}
