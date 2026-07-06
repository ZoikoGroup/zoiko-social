import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { RealtimeService } from '../../realtime/realtime.service'

// ── Response types ──────────────────────────────────────────────────────────

export interface ArchiveItem {
  storyId: string
  story: {
    id: string
    type: string
    caption: string | null
    media: { previewUrl: string | null; thumbnailUrl: string | null; blurhash: string | null }[]
    createdAt: string
    expiresAt: string | null
  }
  archivedAt: string
  purgeAfter: string
}

export interface ArchivePage {
  data: ArchiveItem[]
  nextCursor: string | null
  hasMore: boolean
}

@Injectable()
export class ArchiveService {
  private readonly logger = new Logger(ArchiveService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
  ) {}

  // ── LIST ARCHIVE ───────────────────────────────────────────────────────

  async listArchive(ownerId: string, cursor?: string, limit = 20): Promise<ArchivePage> {
    const cappedLimit = Math.min(limit, 50)

    const where: Record<string, unknown> = { ownerId }

    if (cursor) {
      where.archivedAt = { lt: new Date(cursor) }
    }

    const items = await this.prisma.storyArchive.findMany({
      where,
      orderBy: { archivedAt: 'desc' },
      take: cappedLimit + 1,
      include: {
        owner: { select: { id: true } },
      },
    })

    const hasMore = items.length > cappedLimit
    const data = items.slice(0, cappedLimit) as Record<string, unknown>[]

    return {
      data: data.map((item) => this.mapArchiveItem(item)),
      nextCursor: hasMore && data.length > 0
        ? (data[data.length - 1]!.archivedAt as Date).toISOString()
        : null,
      hasMore,
    }
  }

  // ── RESTORE TO HIGHLIGHT ──────────────────────────────────────────────

  async restoreToHighlight(
    storyId: string,
    highlightId: string,
    ownerId: string,
  ): Promise<{ success: boolean }> {
    // Verify archive ownership
    const archive = await this.prisma.storyArchive.findUnique({
      where: { storyId },
    })

    if (!archive || archive.ownerId !== ownerId) {
      throw new NotFoundException({ code: 'ARCHIVE_NOT_FOUND', message: 'Archived story not found' })
    }

    // Verify highlight ownership
    const highlight = await this.prisma.storyHighlight.findUnique({
      where: { id: highlightId },
    })

    if (!highlight || highlight.ownerId !== ownerId) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }

    // Check if story is already in the highlight
    const existing = await this.prisma.storyHighlightItem.findUnique({
      where: { highlightId_archivedStoryId: { highlightId, archivedStoryId: storyId } },
    })

    if (existing) {
      return { success: true } // Idempotent
    }

    // Get next position
    const lastItem = await this.prisma.storyHighlightItem.findFirst({
      where: { highlightId },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    // Add to highlight
    await this.prisma.storyHighlightItem.create({
      data: {
        highlightId,
        archivedStoryId: storyId,
        position: (lastItem?.position ?? -1) + 1,
      },
    })

    // Increment highlight counter
    await this.prisma.storyHighlight.update({
      where: { id: highlightId },
      data: { itemsCount: { increment: 1 } },
    })

    this.logger.log(`Story ${storyId} restored to highlight ${highlightId}`)
    return { success: true }
  }

  // ── PERMANENT DELETE ──────────────────────────────────────────────────

  async permanentDelete(storyId: string, ownerId: string): Promise<void> {
    // Verify archive ownership
    const archive = await this.prisma.storyArchive.findUnique({
      where: { storyId },
    })

    if (!archive || archive.ownerId !== ownerId) {
      throw new NotFoundException({ code: 'ARCHIVE_NOT_FOUND', message: 'Archived story not found' })
    }

    // Check if story is referenced by any highlight item
    const highlightRef = await this.prisma.storyHighlightItem.findFirst({
      where: { archivedStoryId: storyId },
    })

    if (highlightRef) {
      throw new BadRequestException({
        code: 'IN_HIGHLIGHT',
        message: 'Remove from highlight before permanently deleting',
      })
    }

    // Delete archive row
    await this.prisma.storyArchive.delete({
      where: { storyId },
    })

    // Mark story as deleted (soft-delete so cascade doesn't break)
    await this.prisma.story.update({
      where: { id: storyId },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    // Emit realtime
    if (archive.ownerId) {
      await this.realtime.publish(`tray:${ownerId}`, 'story:expire', { storyId, authorId: ownerId })
    }

    this.logger.log(`Story ${storyId} permanently deleted from archive by ${ownerId}`)
  }

  // ── EXPIRE STORY (called by BullMQ job) ───────────────────────────────

  /**
   * Expire a story: snapshot to archive, remove from tray/seen Redis, emit realtime.
   * This is the core lifecycle transition — called by the story-expire BullMQ worker.
   */
  async expireStory(storyId: string): Promise<void> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        media: { select: { id: true, imageUrl: true, previewUrl: true, thumbnailUrl: true, blurhash: true, type: true, hlsUrl: true } },
        author: { select: { id: true } },
      },
    })

    if (!story || story.isDeleted) return // Already gone

    const authorId = story.authorId as string
    const snapshot = {
      type: story.type,
      caption: story.caption,
      background: story.background,
      refType: story.refType,
      refId: story.refId,
      durationMs: story.durationMs,
      privacy: story.privacy,
      media: (story.media as Record<string, unknown>[]).map((m) => ({
        id: m.id,
        type: m.type,
        imageUrl: m.imageUrl,
        previewUrl: m.previewUrl,
        thumbnailUrl: m.thumbnailUrl,
        blurhash: m.blurhash,
        hlsUrl: m.hlsUrl,
      })),
    }

    await this.prisma.$transaction(async (tx) => {
      // Mark story as archived (soft)
      await tx.story.update({
        where: { id: storyId },
        data: {
          isArchived: true,
          status: 'ready', // Keep ready so archive viewer can still display it
        },
      })

      // Write archive snapshot
      await tx.storyArchive.upsert({
        where: { storyId },
        create: {
          storyId,
          ownerId: authorId,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          archivedAt: new Date(),
          purgeAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day retention
        },
        update: {
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          archivedAt: new Date(),
          purgeAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    })

    // Redis cleanup
    await this.redis.invalidateStory(storyId)
    await this.redis.invalidateStoryTray(authorId)

    // Emit realtime expire to tray
    await this.realtime.publish(`tray:${authorId}`, 'story:expire', {
      storyId,
      authorId,
    })

    this.logger.log(`Story ${storyId} expired and archived`)
  }

  // ── HELPERS ───────────────────────────────────────────────────────────

  private mapArchiveItem(item: Record<string, unknown>): ArchiveItem {
    const snapshot = item.snapshot as Record<string, unknown> | null
    const media = (snapshot?.media as Record<string, unknown>[]) ?? []

    return {
      storyId: item.storyId as string,
      story: {
        id: item.storyId as string,
        type: (snapshot?.type as string) ?? 'unknown',
        caption: (snapshot?.caption as string) ?? null,
        media: media.map((m: Record<string, unknown>) => ({
          previewUrl: (m.previewUrl as string) ?? null,
          thumbnailUrl: (m.thumbnailUrl as string) ?? null,
          blurhash: (m.blurhash as string) ?? null,
        })),
        createdAt: (snapshot?.createdAt as string) ?? '',
        expiresAt: null,
      },
      archivedAt: (item.archivedAt as Date).toISOString(),
      purgeAfter: (item.purgeAfter as Date).toISOString(),
    }
  }
}
