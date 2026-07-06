import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { $Enums } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { RealtimeService } from '../../realtime/realtime.service'
import { NotificationQueueService } from '../../queue/notification-queue.service'
import type { StoryReactionInput, StoryReportInput } from '../stories.schemas'

export interface ReactionItem {
  id: string
  kind: string
  emoji: string | null
  message: string | null
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  createdAt: string
}

export interface ReactionPage {
  data: ReactionItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface ReactionCounts {
  emoji: number
  quickReply: number
  share: number
  total: number
}

/**
 * ReactionsService — handles all 5 story reaction kinds.
 *
 * Every reaction (except `report`) increments `stories.reactions_count` and
 * marks `story_views.reacted=true` in one TX.
 *
 *   - emoji       → quick tap, no message
 *   - quick_reply → short preset or free text
 *   - dm_reply    → hands off to Messaging (degrades to quick_reply when feature flag is off)
 *   - share       → re-share (content attribution TBD in Stories module)
 *   - report      → moderation queue entry (no counter increment, no author notification)
 *
 * Post-commit side effects (fire-and-forget):
 *   Redis counter mirror  → HINCRBY cnt:story:{id} reactions
 *   Realtime              → story:reaction / story:reply → story:{id} room
 *   Notification          → author notified (debounced 5-min per story)
 */
@Injectable()
export class ReactionsService {
  private readonly logger = new Logger(ReactionsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
  ) {}

  // ── REACT ──────────────────────────────────────────────────────────────────

  /**
   * POST /stories/:id/react
   * Record a reaction. Each kind has its own rules (see §8 in architecture docs).
   *
   * For `dm_reply`: if `STORY_DM_REPLY` feature flag is off (default), degrades
   * to `quick_reply`. Once the Messaging contract lands, this will create/use a
   * DM conversation and store the conversation_id.
   */
  async react(
    storyId: string,
    userId: string,
    input: StoryReactionInput,
  ): Promise<{ id: string }> {
    // Privacy gate — must be able to view the story to react
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        authorId: true,
        status: true,
        isDeleted: true,
        expiresAt: true,
        allowReactions: true,
        allowReplies: true,
        author: { select: { isPrivate: true, state: true, verificationTier: true } },
      },
    })

    if (!story || story.isDeleted || story.status !== 'ready') {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }
    if (story.expiresAt && story.expiresAt <= new Date()) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story has expired' })
    }

    // Block check (either direction)
    if (story.authorId !== userId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: story.authorId, blockedId: userId },
            { blockerId: userId, blockedId: story.authorId },
          ],
        },
      })
      if (blocked) throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    // Validate reaction kind against story settings
    const kind = input.kind

    // Share and report are always allowed (they don't use allowReactions)
    if (kind !== 'share' && kind !== 'report') {
      if (!story.allowReactions) {
        throw new BadRequestException({ code: 'REACTIONS_DISABLED', message: 'Reactions are disabled on this story' })
      }
    }

    // quick_reply and dm_reply need allowReplies
    if ((kind === 'quick_reply' || kind === 'dm_reply') && !story.allowReplies) {
      throw new BadRequestException({ code: 'REPLIES_DISABLED', message: 'Replies are disabled on this story' })
    }

    // Enforce emoji presence for emoji kind
    if (kind === 'emoji' && !input.emoji) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Emoji is required for emoji reactions' })
    }

    // Enforce message for quick_reply and dm_reply
    if ((kind === 'quick_reply' || kind === 'dm_reply') && !input.message) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Message is required for reply reactions' })
    }

    // Resolve dm_reply — degrade to quick_reply until Messaging contract lands
    const resolvedKind = kind === 'dm_reply' ? 'quick_reply' : kind

    // For `report`, write directly and return (no counter increment, no notification)
    if (resolvedKind === 'report') {
      const reaction = await this.prisma.storyReaction.create({
        data: {
          storyId,
          userId,
          kind: 'report',
          message: input.message ?? null,
        },
        select: { id: true },
      })
      // Report goes to moderation queue — TBD
      return { id: reaction.id }
    }

    // TX: INSERT reaction + increment counters + mark story_views.reacted
    const reaction = await this.prisma.$transaction(async (tx) => {
      const created = await tx.storyReaction.create({
        data: {
          storyId,
          userId,
          kind: resolvedKind,
          ...(input.emoji ? { emoji: input.emoji } : {}),
          ...(input.message ? { message: input.message } : {}),
        },
        select: { id: true, kind: true, emoji: true, message: true },
      })

      // Increment reactions_count
      await tx.story.update({
        where: { id: storyId },
        data: { reactionsCount: { increment: 1 } },
      })

      // Mark story_views.reacted = true for this viewer
      try {
        await tx.storyView.update({
          where: { storyId_viewerId: { storyId, viewerId: userId } },
          data: { reacted: true },
        })
      } catch {
        // No view row yet — that's fine, the viewer flag is best-effort
      }

      return created
    })

    // ── Post-commit side effects ──

    // Redis counter mirror
    void this.redis.storyCounterIncr(storyId, 'reactions').catch(() => {})

    if (resolvedKind === 'quick_reply') {
      await this.realtime.publish(`story:${storyId}`, 'story:reply', {
        storyId,
        userId,
        kind: resolvedKind,
        message: input.message,
      })

      // Notify the author
      if (story.authorId !== userId) {
        await this.notifications.enqueue({
          userId: story.authorId,
          type: 'story_reply',
          title: 'Story Reply',
          body: `${input.message}`,
          data: { storyId, kind: resolvedKind, actorId: userId },
        })
      }
    } else if (resolvedKind === 'share') {
      // story_shared notification — no realtime event for shares
      if (story.authorId !== userId) {
        await this.notifications.enqueue({
          userId: story.authorId,
          type: 'story_shared',
          title: 'Story Shared',
          body: 'Someone shared your story',
          data: { storyId, actorId: userId },
        })
      }
    } else {
      await this.realtime.publish(`story:${storyId}`, 'story:reaction', {
        storyId,
        userId,
        kind: resolvedKind,
        emoji: input.emoji ?? null,
      })

      // Notify the author (reactions are debounced by the notification writer)
      if (story.authorId !== userId) {
        await this.notifications.enqueue({
          userId: story.authorId,
          type: 'story_reaction',
          title: 'Story Reaction',
          body: `${input.emoji ?? 'Reacted'} to your story`,
          data: { storyId, kind: resolvedKind, emoji: input.emoji, actorId: userId },
        })
      }
    }

    return { id: reaction.id }
  }

  // ── REPORT ─────────────────────────────────────────────────────────────────

  /**
   * POST /stories/:id/report
   * Submit a moderation report. Creates a story_reaction with kind='report'.
   * Lightweight path — no counter increment, no notification to author.
   */
  async report(
    storyId: string,
    userId: string,
    input: StoryReportInput,
  ): Promise<{ id: string }> {
    return this.react(storyId, userId, { kind: 'report', message: input.reason })
  }

  // ── LIST REACTIONS ─────────────────────────────────────────────────────────

  /**
   * GET /stories/:id/reactions
   * List reactions for a story, newest-first. Author-only.
   * Cursor-paginated. Filtered by kind when provided.
   */
  async getReactions(
    storyId: string,
    viewerId: string,
    cursor: string | null,
    limit = 20,
    kind?: string,
  ): Promise<ReactionPage> {
    // Only the story author can see the reaction list
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    })
    if (!story || story.authorId !== viewerId) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    const take = Math.min(limit, 50)

    const reactions = await this.prisma.storyReaction.findMany({
      where: {
        storyId,
        ...(kind ? { kind: kind as $Enums.StoryReactionKind } : {}),
      },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ createdAt: 'desc' as const }, { id: 'desc' as const }],
      include: {
        user: {
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

    const hasMore = reactions.length > take
    const items = hasMore ? reactions.slice(0, take) : reactions

    return {
      data: items.map((r) => ({
        id: r.id,
        kind: r.kind,
        emoji: r.emoji,
        message: r.message,
        user: {
          id: r.user.id,
          username: r.user.username,
          displayName: r.user.displayName,
          avatarUrl: r.user.avatarUrl,
          isVerified: r.user.verificationTier === 'professional',
        },
        createdAt: r.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
      hasMore,
    }
  }

  // ── REACTION COUNTS ────────────────────────────────────────────────────────

  /**
   * GET /stories/:id/reactions/counts
   * Aggregated breakdown of reaction counts by kind.
   * Public — any viewer can see counts.
   */
  async getReactionCounts(storyId: string): Promise<ReactionCounts> {
    const counts = await this.prisma.storyReaction.groupBy({
      by: ['kind'],
      where: { storyId },
      _count: { kind: true },
      orderBy: { kind: 'asc' },
    })

    const result: ReactionCounts = { emoji: 0, quickReply: 0, share: 0, total: 0 }

    for (const c of counts) {
      if (c.kind === 'emoji') result.emoji += c._count.kind
      else if (c.kind === 'quick_reply' || c.kind === 'dm_reply') result.quickReply += c._count.kind
      else if (c.kind === 'share') result.share += c._count.kind
      result.total += c._count.kind
    }

    return result
  }
}
