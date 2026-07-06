import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { StoryAuthor } from '../stories.service'

export interface MentionItem {
  id: string
  storyId: string
  storyAuthor: StoryAuthor
  caption: string | null
  type: string
  createdAt: string
}

export interface MentionPage {
  data: MentionItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface StoryMentionItem {
  id: string
  mentionedUser: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  actor: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  }
  createdAt: string
}

/**
 * MentionsService — story mentions.
 *
 * Mentions are created during story creation (parsed from caption via
 * `parseMentions()` or explicitly provided in the request body). This
 * service provides read access:
 *
 *   - getStoryMentions()  → author-only, lists who was mentioned in a story
 *   - getMyMentions()     → viewer's inbox of stories where they were mentioned
 */
@Injectable()
export class MentionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ── STORY MENTIONS (author-only) ──────────────────────────────────────────

  /**
   * GET /stories/:id/mentions
   * List users mentioned in a story. Author-only — only the story author can
   * see the mention list.
   */
  async getStoryMentions(
    storyId: string,
    viewerId: string,
  ): Promise<StoryMentionItem[]> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    })
    if (!story || story.authorId !== viewerId) {
      throw new NotFoundException({ code: 'STORY_NOT_FOUND', message: 'Story not found' })
    }

    const mentions = await this.prisma.storyMention.findMany({
      where: { storyId },
      orderBy: { createdAt: 'asc' },
      include: {
        mentionedUser: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
        actor: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    })

    return mentions.map((m) => ({
      id: m.id,
      mentionedUser: {
        id: m.mentionedUser.id,
        username: m.mentionedUser.username,
        displayName: m.mentionedUser.displayName,
        avatarUrl: m.mentionedUser.avatarUrl,
        isVerified: m.mentionedUser.verificationTier === 'professional',
      },
      actor: {
        id: m.actor.id,
        username: m.actor.username,
        displayName: m.actor.displayName,
        avatarUrl: m.actor.avatarUrl,
      },
      createdAt: m.createdAt.toISOString(),
    }))
  }

  // ── MY MENTIONS INBOX ─────────────────────────────────────────────────────

  /**
   * GET /me/story-mentions
   * Stories where the current user was mentioned. Privacy-gated — only
   * returns stories the viewer can actually see.
   * Cursor-paginated, newest-first.
   */
  async getMyMentions(
    userId: string,
    cursor: string | null,
    limit = 20,
  ): Promise<MentionPage> {
    const take = Math.min(limit, 50)

    const mentions = await this.prisma.storyMention.findMany({
      where: {
        mentionedUserId: userId,
        story: {
          isDeleted: false,
          status: 'ready',
          expiresAt: { gt: new Date() },
          author: { state: 'active' },
        },
      },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        story: {
          select: {
            id: true,
            type: true,
            caption: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                verificationTier: true,
              },
            },
          },
        },
      },
    })

    const hasMore = mentions.length > take
    const items = hasMore ? mentions.slice(0, take) : mentions

    return {
      data: items.map((m) => ({
        id: m.id,
        storyId: m.story.id,
        storyAuthor: {
          id: m.story.author.id,
          username: m.story.author.username,
          displayName: m.story.author.displayName,
          avatarUrl: m.story.author.avatarUrl,
          isVerified: m.story.author.verificationTier === 'professional',
        },
        caption: m.story.caption,
        type: m.story.type,
        createdAt: m.story.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
      hasMore,
    }
  }
}
