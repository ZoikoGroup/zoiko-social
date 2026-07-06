import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

// ── Response types ──────────────────────────────────────────────────────────

export interface HighlightItem {
  id: string
  highlightId: string
  story: {
    id: string
    type: string
    media: { previewUrl: string | null; thumbnailUrl: string | null; blurhash: string | null }[]
    createdAt: string
  }
  position: number
  addedAt: string
}

export interface HighlightResponse {
  id: string
  title: string
  coverUrl: string | null
  position: number
  itemsCount: number
  createdAt: string
  updatedAt: string
  items: HighlightItem[]
}

export interface HighlightSummary {
  id: string
  title: string
  coverUrl: string | null
  position: number
  itemsCount: number
  createdAt: string
}

@Injectable()
export class HighlightsService {
  private readonly logger = new Logger(HighlightsService.name)

  constructor(private readonly prisma: PrismaService) {}

  // ── CREATE ─────────────────────────────────────────────────────────────

  async create(ownerId: string, title: string, coverUrl?: string): Promise<HighlightResponse> {
    if (!title.trim()) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Title is required' })
    }
    if (title.length > 100) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Title must be at most 100 characters' })
    }

    // Get next position
    const last = await this.prisma.storyHighlight.findFirst({
      where: { ownerId },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const highlight = await this.prisma.storyHighlight.create({
      data: {
        ownerId,
        title: title.trim(),
        ...(coverUrl ? { coverUrl } : {}),
        position: (last?.position ?? -1) + 1,
      },
    })

    return this.mapHighlight(highlight, [])
  }

  // ── UPDATE ─────────────────────────────────────────────────────────────

  async update(id: string, ownerId: string, data: { title?: string; coverUrl?: string | null }): Promise<HighlightResponse> {
    await this.assertOwner(id, ownerId)

    if (data.title !== undefined) {
      if (!data.title.trim()) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Title is required' })
      if (data.title.length > 100) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Title must be at most 100 characters' })
    }

    const updated = await this.prisma.storyHighlight.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.coverUrl !== undefined ? { coverUrl: data.coverUrl } : {}),
      },
    })

    return this.mapHighlight(updated, [])
  }

  // ── DELETE ─────────────────────────────────────────────────────────────

  async delete(id: string, ownerId: string): Promise<void> {
    await this.assertOwner(id, ownerId)
    await this.prisma.storyHighlight.delete({ where: { id } })
    this.logger.log(`Highlight ${id} deleted by owner ${ownerId}`)
  }

  // ── ADD ITEM ───────────────────────────────────────────────────────────

  async addItem(highlightId: string, ownerId: string, archivedStoryId: string): Promise<HighlightResponse> {
    const highlight = await this.assertOwner(highlightId, ownerId)

    // Story must belong to the owner
    const story = await this.prisma.story.findUnique({
      where: { id: archivedStoryId },
      select: { authorId: true },
    })

    if (!story || story.authorId !== ownerId) {
      throw new BadRequestException({ code: 'STORY_NOT_FOUND', message: 'Story not found or not yours' })
    }

    // Get next position
    const lastItem = await this.prisma.storyHighlightItem.findFirst({
      where: { highlightId },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    await this.prisma.storyHighlightItem.create({
      data: {
        highlightId,
        archivedStoryId,
        position: (lastItem?.position ?? -1) + 1,
      },
    })

    // Update counter
    await this.prisma.storyHighlight.update({
      where: { id: highlightId },
      data: { itemsCount: { increment: 1 } },
    })

    const items = await this.getItems(highlightId)
    return this.mapHighlight(highlight, items)
  }

  // ── REMOVE ITEM ────────────────────────────────────────────────────────

  async removeItem(highlightId: string, itemId: string, ownerId: string): Promise<HighlightResponse> {
    await this.assertOwner(highlightId, ownerId)

    await this.prisma.storyHighlightItem.delete({
      where: { id: itemId },
    })

    // Update counter
    await this.prisma.storyHighlight.update({
      where: { id: highlightId },
      data: { itemsCount: { decrement: 1 } },
    })

    const updated = await this.prisma.storyHighlight.findUnique({ where: { id: highlightId } })
    if (!updated) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }
    const items = await this.getItems(highlightId)
    return this.mapHighlight(updated, items)
  }

  // ── REORDER ITEMS ──────────────────────────────────────────────────────

  async reorderItems(highlightId: string, ownerId: string, itemIds: string[]): Promise<HighlightResponse> {
    await this.assertOwner(highlightId, ownerId)

    // Update position for each item atomically
    await this.prisma.$transaction(
      itemIds.map((itemId, index) =>
        this.prisma.storyHighlightItem.update({
          where: { id: itemId },
          data: { position: index },
        }),
      ),
    )

    const updated = await this.prisma.storyHighlight.findUnique({ where: { id: highlightId } })
    if (!updated) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }
    const items = await this.getItems(highlightId)
    return this.mapHighlight(updated, items)
  }

  // ── GET FOR PROFILE ────────────────────────────────────────────────────

  async getProfileHighlights(profileId: string): Promise<HighlightSummary[]> {
    const highlights = await this.prisma.storyHighlight.findMany({
      where: { ownerId: profileId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        position: true,
        itemsCount: true,
        createdAt: true,
      },
    })

    return highlights.map((h: Record<string, unknown>) => ({
      id: h.id as string,
      title: h.title as string,
      coverUrl: (h.coverUrl as string) ?? null,
      position: h.position as number,
      itemsCount: h.itemsCount as number,
      createdAt: (h.createdAt as Date).toISOString(),
    }))
  }

  // ── GET SINGLE (with items) ────────────────────────────────────────────

  async getHighlight(id: string): Promise<HighlightResponse> {
    const highlight = await this.prisma.storyHighlight.findUnique({ where: { id } })
    if (!highlight) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }
    const items = await this.getItems(id)
    return this.mapHighlight(highlight, items)
  }

  // ── HELPERS ────────────────────────────────────────────────────────────

  private async assertOwner(id: string, ownerId: string): Promise<Record<string, unknown>> {
    const highlight = await this.prisma.storyHighlight.findUnique({ where: { id } })
    if (!highlight) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }
    if (highlight.ownerId !== ownerId) {
      throw new NotFoundException({ code: 'HIGHLIGHT_NOT_FOUND', message: 'Highlight not found' })
    }
    return highlight
  }

  private async getItems(highlightId: string): Promise<HighlightItem[]> {
    const items = await this.prisma.storyHighlightItem.findMany({
      where: { highlightId },
      orderBy: { position: 'asc' },
      include: {
        story: {
          select: {
            id: true,
            type: true,
            media: {
              select: { previewUrl: true, thumbnailUrl: true, blurhash: true },
              take: 1,
            },
            createdAt: true,
          },
        },
      },
    })

    return items.map((item: Record<string, unknown>) => {
      const story = item.story as Record<string, unknown>
      const media = (story.media as Record<string, unknown>[]) ?? []
      return {
        id: item.id as string,
        highlightId: item.highlightId as string,
        story: {
          id: story.id as string,
          type: story.type as string,
          media: media.map((m: Record<string, unknown>) => ({
            previewUrl: (m.previewUrl as string) ?? null,
            thumbnailUrl: (m.thumbnailUrl as string) ?? null,
            blurhash: (m.blurhash as string) ?? null,
          })),
          createdAt: (story.createdAt as Date).toISOString(),
        },
        position: item.position as number,
        addedAt: (item.addedAt as Date).toISOString(),
      }
    })
  }

  private mapHighlight(highlight: Record<string, unknown>, items: HighlightItem[]): HighlightResponse {
    return {
      id: highlight.id as string,
      title: highlight.title as string,
      coverUrl: (highlight.coverUrl as string) ?? null,
      position: highlight.position as number,
      itemsCount: highlight.itemsCount as number,
      createdAt: (highlight.createdAt as Date).toISOString(),
      updatedAt: (highlight.updatedAt as Date).toISOString(),
      items,
    }
  }
}
