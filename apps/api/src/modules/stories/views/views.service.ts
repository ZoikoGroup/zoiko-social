import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { RealtimeService } from '../../realtime/realtime.service'
import type { StoryViewInput } from '../stories.schemas'

export interface ViewerItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  completionPct: number
  viewedAt: string
}

export interface ViewerPage {
  data: ViewerItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface StoryInsights {
  storyId: string
  viewsCount: number
  impressionsCount: number
  reactionsCount: number
  repliesCount: number
  shareCount: number
  profileVisitsCount: number
  completionPctAvg: number
  completionPctDistribution: { range: string; count: number }[]
  /** Pro-only — distinct viewers across the segment group (if applicable) */
  reach: number | null
  /** Pro-only — (reactions + replies + shares) / reach */
  engagementRatePct: number | null
}

/**
 * ViewsService — story view tracking.
 *
 * Every open writes/updates a story_views row (UPSERT on composite PK).
 *   - new row → stories.views_count +1 (TX)
 *   - always → stories.impressions_count +1 (TX)
 *   - HINCRBY cnt:story:{id} views/impressions (Redis mirror)
 *   - WS story:view → author's story:{id} room (live viewer count)
 *
 * View list is always a fresh indexed query — never cached.
 */
@Injectable()
export class ViewsService {
  private readonly logger = new Logger(ViewsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
  ) {}

  // ── RECORD VIEW ──────────────────────────────────────────────────────────

  /**
   * Record a story view. Idempotent — UPSERT on the composite PK.
   * completion_pct uses GREATEST(existing, new) so re-opens only increase.
   */
  async recordView(storyId: string, viewerId: string, input: StoryViewInput): Promise<void> {
    // First check the story exists and the viewer has access
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        authorId: true,
        status: true,
        isDeleted: true,
        expiresAt: true,
        author: { select: { isPrivate: true, state: true } },
      },
    })

    if (!story || story.isDeleted || story.status !== 'ready') {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }
    if (story.expiresAt && story.expiresAt <= new Date()) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story has expired' })
    }

    // Block check — viewer who is blocked cannot register a view
    if (story.authorId !== viewerId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: story.authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: story.authorId },
          ],
        },
      })
      if (blocked) throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    // UPSERT view row + atomic counter increment in one transaction
    await this.prisma.$transaction(async (tx) => {
      // Check if this viewer already has a row
      const existing = await tx.storyView.findUnique({
        where: {
          storyId_viewerId: { storyId, viewerId },
        },
        select: { completionPct: true },
      })

      const isNew = !existing

      await tx.storyView.upsert({
        where: {
          storyId_viewerId: { storyId, viewerId },
        },
        create: {
          storyId,
          viewerId,
          completionPct: input.completionPct,
          reacted: false,
          replied: false,
          profileVisited: false,
        },
        update: {
          completionPct: Math.max(existing?.completionPct ?? 0, input.completionPct),
          viewedAt: new Date(),
        },
      })

      // Always increment impressions; only increment views for new viewers
      await tx.story.update({
        where: { id: storyId },
        data: {
          impressionsCount: { increment: 1 },
          ...(isNew ? { viewsCount: { increment: 1 } } : {}),
        },
      })
    })

    // ── Post-commit side effects ──

    // Redis counter mirror (exists-only)
    void this.redis.storyCounterIncr(storyId, 'impressions').catch(() => {})

    // Add to viewer's seen-set
    void this.redis.seenAdd(viewerId, storyId).catch(() => {})

    // Live viewer count to author's story room
    await this.realtime.publish(`story:${storyId}`, 'story:view', {
      storyId,
      viewerId,
    })
  }

  // ── PROFILE VISIT ──────────────────────────────────────────────────────────

  /**
   * POST /stories/:id/viewer/profile-visit
   * Marks that the viewer tapped the author avatar during this story view,
   * a signal used in pro insights (profile visits from story).
   * Idempotent — once set, stays true.
   */
  async recordProfileVisit(storyId: string, viewerId: string): Promise<void> {
    const existing = await this.prisma.storyView.findUnique({
      where: { storyId_viewerId: { storyId, viewerId } },
      select: { profileVisited: true },
    })
    if (!existing || existing.profileVisited) return // already set or no view row

    await this.prisma.storyView.update({
      where: { storyId_viewerId: { storyId, viewerId } },
      data: { profileVisited: true },
    })
  }

  // ── INSIGHTS ───────────────────────────────────────────────────────────────

  /**
   * GET /stories/:id/insights
   * Aggregated analytics for a single story. Author-only.
   * Basic: views, impressions, reactions, replies, completion distribution.
   * Pro: reach (segment-group-unique), engagement rate, share count, profile visits.
   */
  async getInsights(storyId: string, viewerId: string): Promise<StoryInsights> {
    // Fetch story + author info for auth + segment group
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        authorId: true,
        segmentGroupId: true,
        viewsCount: true,
        impressionsCount: true,
        reactionsCount: true,
        repliesCount: true,
        author: { select: { verificationTier: true } },
      },
    })
    if (!story || story.authorId !== viewerId) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    const isPro = story.author.verificationTier === 'professional'

    // Completion distribution — 4 buckets
    const completionBuckets = await this.prisma.storyView.groupBy({
      by: ['completionPct'],
      where: { storyId },
      _count: { completionPct: true },
      orderBy: { completionPct: 'asc' },
    })

    const dist: Record<string, number> = { '0-25': 0, '25-50': 0, '50-75': 0, '75-100': 0 }
    for (const b of completionBuckets) {
      if (b.completionPct <= 25) dist['0-25'] += b._count.completionPct
      else if (b.completionPct <= 50) dist['25-50'] += b._count.completionPct
      else if (b.completionPct <= 75) dist['50-75'] += b._count.completionPct
      else dist['75-100'] += b._count.completionPct
    }
    const completionPctDistribution = Object.entries(dist).map(([range, count]) => ({ range, count }))

    // Average completion percentage
    const avgResult = await this.prisma.storyView.aggregate({
      where: { storyId },
      _avg: { completionPct: true },
    }) as { _avg: { completionPct: number | null } }
    const completionPctAvg = avgResult._avg.completionPct ?? 0

    // Profile visits count
    const profileVisitsCount = await this.prisma.storyView.count({
      where: { storyId, profileVisited: true },
    }) as number

    // Share count via story_reactions where kind = 'share'
    const shareCount = await this.prisma.storyReaction.count({
      where: { storyId, kind: 'share' },
    }) as number

    // Pro-only: reach = distinct viewers across the segment group
    let reach: number | null = null
    let engagementRatePct: number | null = null

    if (isPro) {
      if (story.segmentGroupId) {
        const reachResult = await this.prisma.storyView.groupBy({
          by: ['viewerId'],
          where: {
            story: { segmentGroupId: story.segmentGroupId },
          },
          _count: { viewerId: true },
          orderBy: { viewerId: 'asc' },
        })
        reach = reachResult.length
      } else {
        reach = story.viewsCount
      }

      const numerator = story.reactionsCount + story.repliesCount + shareCount
      engagementRatePct = (reach ?? 0) > 0 ? Math.round((numerator / (reach ?? 1)) * 10000) / 100 : 0
    }

    return {
      storyId,
      viewsCount: story.viewsCount,
      impressionsCount: story.impressionsCount,
      reactionsCount: story.reactionsCount,
      repliesCount: story.repliesCount,
      shareCount,
      profileVisitsCount,
      completionPctAvg: Math.round(completionPctAvg * 100) / 100,
      completionPctDistribution,
      reach,
      engagementRatePct,
    }
  }
  // ── VIEWER LIST ──────────────────────────────────────────────────────────

  /**
   * List viewers for a story, newest-first. Author-only.
   * Always a fresh indexed query — never cached (author-only, correctness > speed).
   */
  async getViewers(
    storyId: string,
    viewerId: string,
    cursor: string | null,
    limit = 20,
  ): Promise<ViewerPage> {
    // Only the story author can see the viewer list
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    })
    if (!story || story.authorId !== viewerId) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    const take = Math.min(limit, 50)

    const views = await this.prisma.storyView.findMany({
      where: { storyId },
      take: take + 1,
      orderBy: [{ viewedAt: 'desc' as const }, { viewerId: 'desc' as const }],
      include: {
        viewer: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            verificationTier: true,
          },
        },
      },
    })

    const hasMore = views.length > take
    const items = hasMore ? views.slice(0, take) : views

    return {
      data: items.map((v) => ({
        id: v.viewer.id,
        username: v.viewer.username,
        displayName: v.viewer.displayName,
        avatarUrl: v.viewer.avatarUrl,
        isVerified: v.viewer.verificationTier === 'professional',
        completionPct: v.completionPct,
        viewedAt: v.viewedAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].viewedAt.toISOString() : null,
      hasMore,
    }
  }
}
