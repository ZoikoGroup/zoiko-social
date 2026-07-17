import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import type { IngestEventInput } from './analytics.schemas'

interface IngestContext {
  userAgent?: string | null
  country?: string | null
}

export interface PostInsights {
  postId: string
  impressions: number
  views: number
  profileTaps: number
  linkTaps: number
  reach: number
  reachFollowers: number
  reachNonFollowers: number
  engagement: { likes: number; comments: number; saves: number; shares: number }
  engagementRate: number
  byDevice: { key: string; count: number }[]
  bySurface: { key: string; count: number }[]
  byCountry: { key: string; count: number }[]
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Ingest a batch of impression/interaction events. Only events for posts by
   * PROFESSIONAL accounts are stored (analytics is a pro feature) — this also
   * keeps event volume small. The author's own views are dropped. Each event is
   * enriched with follow-status (for the reach split), device, and country.
   */
  async ingest(viewerId: string, events: IngestEventInput[], ctx: IngestContext): Promise<{ accepted: number }> {
    if (events.length === 0) return { accepted: 0 }

    const postIds = [...new Set(events.map((e) => e.postId))]

    // Keep only posts authored by a currently-professional account.
    const posts = await this.prisma.post.findMany({
      where: { id: { in: postIds }, isDeleted: false },
      select: {
        id: true,
        authorId: true,
        author: { select: { professionalProfile: { select: { deletedAt: true } } } },
      },
    })
    const authorByPost = new Map<string, string>()
    for (const p of posts) {
      const pro = p.author.professionalProfile && !p.author.professionalProfile.deletedAt
      if (pro) authorByPost.set(p.id, p.authorId)
    }
    if (authorByPost.size === 0) return { accepted: 0 }

    // Which of these authors does the viewer follow? (reach split, one query)
    const authorIds = [...new Set([...authorByPost.values()])]
    const follows = await this.prisma.follow.findMany({
      where: { followerId: viewerId, followingId: { in: authorIds }, status: 'active' },
      select: { followingId: true },
    })
    const followedAuthors = new Set(follows.map((f) => f.followingId))

    // Enrich device/os once per request (same UA for the whole batch).
    const { deviceType, os } = this.parseUa(ctx.userAgent)
    const country = this.normalizeCountry(ctx.country)

    const rows = events
      .map((e) => {
        const authorId = authorByPost.get(e.postId)
        if (!authorId) return null
        if (authorId === viewerId) return null // never count the author's own views
        return {
          postId: e.postId,
          authorId,
          viewerId,
          type: e.type,
          surface: e.surface ?? null,
          viewerIsFollower: followedAuthors.has(authorId),
          deviceType,
          os,
          country,
          dwellMs: e.dwellMs ?? null,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)

    if (rows.length === 0) return { accepted: 0 }

    await this.prisma.postEvent.createMany({ data: rows })

    // Best-effort Redis mirror (fast reads once Redis is upgraded). Degrades
    // silently — PostgreSQL above is the source of truth.
    for (const r of rows) {
      void this.redis.postEventIncr(r.postId, r.type)
      if (r.type === 'impression' || r.type === 'view') {
        void this.redis.postReachAdd(r.postId, viewerId, r.viewerIsFollower)
      }
    }

    return { accepted: rows.length }
  }

  /**
   * Per-post insights. Only the post's own (professional) author may read them.
   * Aggregated from post_events so it is correct even while Redis is degraded.
   */
  async getPostInsights(requesterId: string, postId: string): Promise<PostInsights> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        likesCount: true,
        commentsCount: true,
        savesCount: true,
        sharesCount: true,
        author: { select: { professionalProfile: { select: { deletedAt: true } } } },
      },
    })
    if (!post) throw new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Post not found' })

    const isPro = post.author.professionalProfile && !post.author.professionalProfile.deletedAt
    if (post.authorId !== requesterId || !isPro) {
      throw new ForbiddenException({
        code: 'ANALYTICS_FORBIDDEN',
        message: 'Post analytics are available to the professional account that owns the post',
      })
    }

    const [counts, reach, byDevice, bySurface, byCountry] = await Promise.all([
      this.prisma.$queryRaw<{ type: string; c: number }[]>`
        SELECT type, COUNT(*)::int AS c FROM post_events WHERE post_id = ${postId}::uuid GROUP BY type`,
      this.prisma.$queryRaw<{ reach: number; followers: number; non_followers: number }[]>`
        SELECT
          COUNT(DISTINCT viewer_id)::int AS reach,
          COUNT(DISTINCT viewer_id) FILTER (WHERE viewer_is_follower)::int AS followers,
          COUNT(DISTINCT viewer_id) FILTER (WHERE NOT viewer_is_follower)::int AS non_followers
        FROM post_events
        WHERE post_id = ${postId}::uuid AND type IN ('impression', 'view')`,
      this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(device_type, 'unknown') AS key, COUNT(*)::int AS count
        FROM post_events WHERE post_id = ${postId}::uuid AND type = 'impression'
        GROUP BY 1 ORDER BY count DESC`,
      this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(surface, 'unknown') AS key, COUNT(*)::int AS count
        FROM post_events WHERE post_id = ${postId}::uuid AND type = 'impression'
        GROUP BY 1 ORDER BY count DESC`,
      this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(country, 'unknown') AS key, COUNT(*)::int AS count
        FROM post_events WHERE post_id = ${postId}::uuid AND type = 'impression'
        GROUP BY 1 ORDER BY count DESC LIMIT 20`,
    ])

    const countBy = (t: string): number => counts.find((c) => c.type === t)?.c ?? 0
    const r = reach[0] ?? { reach: 0, followers: 0, non_followers: 0 }
    const engagementTotal = post.likesCount + post.commentsCount + post.savesCount + post.sharesCount

    return {
      postId,
      impressions: countBy('impression'),
      views: countBy('view'),
      profileTaps: countBy('profile_tap'),
      linkTaps: countBy('link_tap'),
      reach: r.reach,
      reachFollowers: r.followers,
      reachNonFollowers: r.non_followers,
      engagement: {
        likes: post.likesCount,
        comments: post.commentsCount,
        saves: post.savesCount,
        shares: post.sharesCount,
      },
      engagementRate: r.reach > 0 ? Math.round((engagementTotal / r.reach) * 1000) / 1000 : 0,
      byDevice,
      bySurface,
      byCountry,
    }
  }

  private parseUa(ua?: string | null): { deviceType: string; os: string | null } {
    if (!ua) return { deviceType: 'unknown', os: null }
    try {
      const parser = new UAParser(ua)
      const device = parser.getDevice()
      const os = parser.getOS()
      // ua-parser leaves device.type undefined for desktops
      const deviceType = device.type ?? 'desktop'
      return { deviceType, os: os.name ?? null }
    } catch {
      return { deviceType: 'unknown', os: null }
    }
  }

  private normalizeCountry(country?: string | null): string | null {
    if (!country) return null
    const c = country.trim().toUpperCase()
    return /^[A-Z]{2}$/.test(c) ? c : null
  }
}
