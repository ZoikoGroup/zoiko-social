import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateNewsSourceInput, UpdateNewsSourceInput } from './news-source.schemas'

/**
 * The curated publisher list.
 *
 * This is the trust boundary of the whole hybrid: an article from a source here
 * publishes straight into every member's home feed without review, carrying
 * whatever tier the source was given. Curating the list IS the review, which
 * makes adding a source an editorial act rather than configuration.
 */
@Injectable()
export class NewsSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.newsSource.findMany({
      orderBy: [{ enabled: 'desc' }, { name: 'asc' }],
      include: { _count: { select: { articles: true } } },
    })
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      feedUrl: r.feedUrl,
      homepageUrl: r.homepageUrl,
      logoUrl: r.logoUrl,
      tier: r.tier,
      category: r.category,
      enabled: r.enabled,
      // Operational state belongs in the list: a feed that has been failing for
      // a week looks identical to a quiet one without it.
      lastFetchedAt: r.lastFetchedAt?.toISOString() ?? null,
      lastStatus: r.lastStatus,
      lastError: r.lastError,
      articleCount: r._count.articles,
    }))
  }

  async create(input: CreateNewsSourceInput) {
    // Both slug and feedUrl are unique. Catching it here turns a 500 into a
    // sentence that says which one collided.
    const clash = await this.prisma.newsSource.findFirst({
      where: { OR: [{ slug: input.slug }, { feedUrl: input.feedUrl }] },
      select: { slug: true, feedUrl: true },
    })
    if (clash) {
      throw new ConflictException({
        code: 'SOURCE_EXISTS',
        message: clash.slug === input.slug ? 'That slug is taken' : 'That feed is already in the list',
      })
    }

    return this.prisma.newsSource.create({
      data: {
        name: input.name,
        slug: input.slug,
        feedUrl: input.feedUrl,
        tier: input.tier,
        category: input.category,
        enabled: input.enabled,
        ...(input.homepageUrl ? { homepageUrl: input.homepageUrl } : {}),
        ...(input.logoUrl ? { logoUrl: input.logoUrl } : {}),
      },
    })
  }

  async update(id: string, input: UpdateNewsSourceInput) {
    await this.assertExists(id)
    return this.prisma.newsSource.update({
      where: { id },
      // Only what was sent, so two curators editing different fields do not
      // revert each other.
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.feedUrl !== undefined ? { feedUrl: input.feedUrl } : {}),
        ...(input.homepageUrl !== undefined ? { homepageUrl: input.homepageUrl } : {}),
        ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
        ...(input.tier !== undefined ? { tier: input.tier } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
      },
    })
  }

  /** The panic switch. Stops future ingestion; already-published items stay. */
  async setEnabled(id: string, enabled: boolean) {
    await this.assertExists(id)
    return this.prisma.newsSource.update({ where: { id }, data: { enabled } })
  }

  /**
   * Removes a source from the list.
   *
   * Its articles survive with `source_id` set to null by the foreign key —
   * deleting a publisher should not silently erase months of feed history that
   * members may have saved or commented on.
   */
  async remove(id: string): Promise<void> {
    await this.assertExists(id)
    await this.prisma.newsSource.delete({ where: { id } })
  }

  private async assertExists(id: string): Promise<void> {
    const found = await this.prisma.newsSource.findUnique({ where: { id }, select: { id: true } })
    if (!found) throw new NotFoundException({ code: 'SOURCE_NOT_FOUND', message: 'Source not found' })
  }
}
