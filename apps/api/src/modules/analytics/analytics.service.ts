import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { UAParser } from 'ua-parser-js'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import type { IngestEventInput } from './analytics.schemas'

// Event types that represent a real "saw the post" — used for unique reach.
const REACH_TYPES = ['impression', 'view'] as const

interface IngestContext {
  userAgent?: string | null
  country?: string | null
}

export interface PostInsights {
  postId: string
  /** Count per event type — dynamic, so new event kinds appear automatically. */
  countsByType: Record<string, number>
  impressions: number
  views: number
  reach: number
  reachFollowers: number
  reachNonFollowers: number
  engagement: { likes: number; comments: number; saves: number; shares: number }
  engagementRate: number
  byDevice: { key: string; count: number }[]
  bySurface: { key: string; count: number }[]
  byCountry: { key: string; count: number }[]
  /** Breakdown by a requested prop key (null unless ?prop= was passed). */
  byProp: { prop: string; values: { key: string; count: number }[] } | null
}

export interface AccountInsights {
  impressions: number
  views: number
  reach: number
  reachFollowers: number
  reachNonFollowers: number
  followersCount: number
  postsCount: number
  byDevice: { key: string; count: number }[]
  byCountry: { key: string; count: number }[]
  topPosts: { postId: string; caption: string | null; coverUrl: string | null; impressions: number; reach: number }[]
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
          ...(e.props ? { props: e.props as Prisma.InputJsonValue } : {}),
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
  async getPostInsights(requesterId: string, postId: string, prop?: string): Promise<PostInsights> {
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
        WHERE post_id = ${postId}::uuid AND type IN (${Prisma.join([...REACH_TYPES])})`,
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

    const countsByType: Record<string, number> = {}
    for (const c of counts) countsByType[c.type] = c.c
    const r = reach[0] ?? { reach: 0, followers: 0, non_followers: 0 }
    const engagementTotal = post.likesCount + post.commentsCount + post.savesCount + post.sharesCount

    // Optional breakdown by an arbitrary prop key (validated to a safe charset).
    let byProp: PostInsights['byProp'] = null
    if (prop && /^[a-zA-Z0-9_.]{1,40}$/.test(prop)) {
      const values = await this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(props ->> ${prop}, '(none)') AS key, COUNT(*)::int AS count
        FROM post_events
        WHERE post_id = ${postId}::uuid AND jsonb_exists(props, ${prop})
        GROUP BY 1 ORDER BY count DESC LIMIT 50`
      byProp = { prop, values }
    }

    return {
      postId,
      countsByType,
      impressions: countsByType.impression ?? 0,
      views: countsByType.view ?? 0,
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
      byProp,
    }
  }

  /** Account-wide analytics across all of a professional account's posts. */
  async getAccountInsights(userId: string): Promise<AccountInsights> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: {
        followersCount: true, postsCount: true,
        professionalProfile: { select: { deletedAt: true } },
      },
    })
    if (!profile) throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    if (!profile.professionalProfile || profile.professionalProfile.deletedAt) {
      throw new ForbiddenException({ code: 'ANALYTICS_FORBIDDEN', message: 'Account analytics are available to professional accounts' })
    }

    const [totals, byDevice, byCountry, top] = await Promise.all([
      this.prisma.$queryRaw<{ impressions: number; views: number; reach: number; followers: number; non_followers: number }[]>`
        SELECT
          COUNT(*) FILTER (WHERE type = 'impression')::int AS impressions,
          COUNT(*) FILTER (WHERE type = 'view')::int AS views,
          COUNT(DISTINCT viewer_id) FILTER (WHERE type IN ('impression','view'))::int AS reach,
          COUNT(DISTINCT viewer_id) FILTER (WHERE type IN ('impression','view') AND viewer_is_follower)::int AS followers,
          COUNT(DISTINCT viewer_id) FILTER (WHERE type IN ('impression','view') AND NOT viewer_is_follower)::int AS non_followers
        FROM post_events WHERE author_id = ${userId}::uuid`,
      this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(device_type,'unknown') AS key, COUNT(*)::int AS count
        FROM post_events WHERE author_id = ${userId}::uuid AND type='impression' GROUP BY 1 ORDER BY count DESC`,
      this.prisma.$queryRaw<{ key: string; count: number }[]>`
        SELECT COALESCE(country,'unknown') AS key, COUNT(*)::int AS count
        FROM post_events WHERE author_id = ${userId}::uuid AND type='impression' GROUP BY 1 ORDER BY count DESC LIMIT 20`,
      this.prisma.$queryRaw<{ post_id: string; impressions: number; reach: number }[]>`
        SELECT post_id, COUNT(*) FILTER (WHERE type='impression')::int AS impressions,
               COUNT(DISTINCT viewer_id)::int AS reach
        FROM post_events WHERE author_id = ${userId}::uuid GROUP BY post_id ORDER BY impressions DESC LIMIT 5`,
    ])

    const t = totals[0] ?? { impressions: 0, views: 0, reach: 0, followers: 0, non_followers: 0 }
    const posts = top.length
      ? await this.prisma.post.findMany({
          where: { id: { in: top.map((p) => p.post_id) } },
          select: { id: true, body: true, media: { take: 1, orderBy: { position: 'asc' }, select: { url: true, thumbnailUrl: true } } },
        })
      : []
    const postMap = new Map(posts.map((p) => [p.id, p]))

    return {
      impressions: t.impressions,
      views: t.views,
      reach: t.reach,
      reachFollowers: t.followers,
      reachNonFollowers: t.non_followers,
      followersCount: profile.followersCount,
      postsCount: profile.postsCount,
      byDevice,
      byCountry,
      topPosts: top.map((p) => {
        const post = postMap.get(p.post_id)
        return {
          postId: p.post_id,
          caption: post?.body ?? null,
          coverUrl: post?.media[0]?.thumbnailUrl ?? post?.media[0]?.url ?? null,
          impressions: p.impressions,
          reach: p.reach,
        }
      }),
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
