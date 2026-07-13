import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import { SLUG_REGEX, RESERVED_SLUGS, type CreateCommunityInput, type UpdateCommunityInput } from './communities.schemas'
import { ProfanityService } from '../common/moderation/profanity.service'

export interface CommunityResponse {
  id: string
  slug: string
  name: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  category: { id: string; slug: string; label: string } | null
  tags: string[]
  privacy: string
  isVerified: boolean
  membersCount: number
  postsCount: number
  createdAt: string
  rules: { id: string; position: number; title: string; body: string | null }[]
  /** Viewer context — attached per request */
  viewerRole: string | null
  viewerStatus: string | null
}

export interface CommunityCard {
  id: string
  slug: string
  name: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  category: string | null
  membersCount: number
  postsCount: number
  privacy: string
  isVerified: boolean
  viewerStatus: string | null
}

export interface CommunityPage {
  data: CommunityCard[]
  nextCursor: string | null
  hasMore: boolean
}

const MAX_PAGE = 30
const MAX_OWNED = 5

type CommunityWithRelations = Prisma.CommunityGetPayload<{
  include: {
    category: { select: { id: true; slug: true; label: true } }
    rules: true
  }
}>

@Injectable()
export class CommunitiesService {
  private readonly logger = new Logger(CommunitiesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly profanity: ProfanityService,
  ) {}

  private buildSearchDoc(name: string, slug: string, tags: string[], description: string | null): string {
    return `${name} ${slug} ${tags.join(' ')} ${(description ?? '').slice(0, 200)}`.toLowerCase()
  }

  // ── CATEGORIES ──────────────────────────────────────────────────────────────

  async getCategories() {
    return this.prisma.communityCategory.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      select: { id: true, slug: true, label: true, icon: true },
    })
  }

  // ── SLUG AVAILABILITY ─────────────────────────────────────────────────────

  async checkSlug(raw: string): Promise<{ slug: string; available: boolean; reason: 'invalid' | 'reserved' | 'taken' | null }> {
    const slug = (raw ?? '').trim().toLowerCase()
    if (!SLUG_REGEX.test(slug) || slug.length < 3 || slug.length > 40) {
      return { slug, available: false, reason: 'invalid' }
    }
    if (RESERVED_SLUGS.has(slug)) {
      return { slug, available: false, reason: 'reserved' }
    }
    const existing = await this.prisma.community.findUnique({ where: { slug }, select: { id: true } })
    return { slug, available: !existing, reason: existing ? 'taken' : null }
  }

  // ── CREATE ────────────────────────────────────────────────────────────────

  async create(userId: string, input: CreateCommunityInput): Promise<CommunityResponse> {
    this.profanity.assertClean(input.name, { actorId: userId, entityType: 'community.name' })
    if (input.description) this.profanity.assertClean(input.description, { actorId: userId, entityType: 'community.description' })

    const check = await this.checkSlug(input.slug)
    if (!check.available) {
      throw new ConflictException({
        code: check.reason === 'taken' ? 'SLUG_TAKEN' : 'SLUG_INVALID',
        message: check.reason === 'taken' ? 'That community URL is already taken' : 'Invalid community URL',
      })
    }

    const owned = await this.prisma.community.count({ where: { createdBy: userId, isDeleted: false } })
    if (owned >= MAX_OWNED) {
      throw new ConflictException({
        code: 'COMMUNITY_LIMIT',
        message: `You can create up to ${MAX_OWNED} communities`,
      })
    }

    const tags = input.tags?.map((t) => t.toLowerCase()) ?? []
    const slug = input.slug.toLowerCase()

    const community = await this.prisma.$transaction(async (tx) => {
      const created = await tx.community.create({
        data: {
          slug,
          name: input.name,
          description: input.description,
          categoryId: input.categoryId,
          privacy: input.privacy ?? 'public',
          tags,
          avatarUrl: input.avatarUrl,
          coverUrl: input.coverUrl,
          createdBy: userId,
          membersCount: 1,
          searchDoc: this.buildSearchDoc(input.name, slug, tags, input.description ?? null),
          ...(input.rules?.length ? { rulesUpdatedAt: new Date() } : {}),
        },
      })

      // Creator becomes owner
      await tx.communityMember.create({
        data: { communityId: created.id, userId, role: 'owner', status: 'active', acceptedRulesAt: new Date() },
      })
      await tx.communitySettings.create({ data: { communityId: created.id } })

      if (input.rules?.length) {
        await tx.communityRule.createMany({
          data: input.rules.map((r, i) => ({ communityId: created.id, position: i, title: r.title, body: r.body })),
        })
      }

      return created
    })

    await this.redis.invalidateMembership(community.id, userId)
    this.logger.log(`Community ${community.slug} created by ${userId}`)
    return this.getById(community.id, userId)
  }

  // ── READ ──────────────────────────────────────────────────────────────────

  async getBySlug(slug: string, viewerId?: string): Promise<CommunityResponse> {
    const row = await this.prisma.community.findUnique({
      where: { slug: slug.toLowerCase() },
      select: { id: true },
    })
    if (!row) {
      throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
    }
    return this.getById(row.id, viewerId)
  }

  async getById(id: string, viewerId?: string): Promise<CommunityResponse> {
    const cached = await this.redis.getCommunity<CommunityResponse>(id)
    let base: CommunityResponse
    if (cached) {
      base = cached
    } else {
      const community = await this.prisma.community.findUnique({
        where: { id },
        include: {
          category: { select: { id: true, slug: true, label: true } },
          rules: { orderBy: { position: 'asc' } },
        },
      })
      if (!community || community.isDeleted) {
        throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
      }
      base = this.mapCommunity(community)
      await this.redis.setCommunity(id, base)
    }

    // Attach viewer membership (never cached in the shared payload)
    const membership = viewerId ? await this.getMembershipRow(id, viewerId) : null

    // Private community: non-members get a header-only preview
    if (base.privacy !== 'public' && membership?.status !== 'active') {
      return {
        ...base,
        viewerRole: membership?.role ?? null,
        viewerStatus: membership?.status ?? null,
      }
    }

    return {
      ...base,
      viewerRole: membership?.role ?? null,
      viewerStatus: membership?.status ?? null,
    }
  }

  /** Cached membership snapshot — the hot path for permission checks. */
  async getMembershipRow(
    communityId: string,
    userId: string,
  ): Promise<{ role: string; status: string; mutedUntil: string | null } | null> {
    const cached = await this.redis.getMembership<{ role: string; status: string; mutedUntil: string | null }>(communityId, userId)
    if (cached) return cached

    const row = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
      select: { role: true, status: true, mutedUntil: true },
    })
    if (!row) return null
    const snapshot = { role: row.role, status: row.status, mutedUntil: row.mutedUntil?.toISOString() ?? null }
    await this.redis.setMembership(communityId, userId, snapshot)
    return snapshot
  }

  // ── DISCOVERY ───────────────────────────────────────────────────────────────

  async browse(
    viewerId: string | undefined,
    opts: { q?: string; category?: string; sort?: string; cursor?: string | null; limit?: number },
  ): Promise<CommunityPage> {
    const take = Math.min(opts.limit ?? 18, MAX_PAGE)
    const q = opts.q?.trim().toLowerCase()

    // Search mode: trigram on search_doc (offset paginated — search sets are small)
    if (q && q.length >= 2) {
      const rows = await this.prisma.community.findMany({
        where: {
          isDeleted: false,
          searchDoc: { contains: q },
          ...(opts.category ? { category: { slug: opts.category } } : {}),
        },
        include: { category: { select: { slug: true } } },
        orderBy: { membersCount: 'desc' },
        take,
      })
      return { data: await this.decorateCards(rows, viewerId), nextCursor: null, hasMore: false }
    }

    const orderBy: Prisma.CommunityOrderByWithRelationInput =
      opts.sort === 'newest'
        ? { createdAt: 'desc' }
        : { membersCount: 'desc' } // 'popular' / 'trending' default

    const decoded = opts.cursor ? decodeCursor(opts.cursor) : null

    const rows = await this.prisma.community.findMany({
      where: {
        isDeleted: false,
        ...(opts.category ? { category: { slug: opts.category } } : {}),
        ...(decoded && opts.sort === 'newest'
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      include: { category: { select: { slug: true } } },
      orderBy: opts.sort === 'newest' ? [{ createdAt: 'desc' }, { id: 'desc' }] : orderBy,
      take: take + 1,
    })

    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: await this.decorateCards(items, viewerId),
      nextCursor: hasMore && opts.sort === 'newest'
        ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id)
        : null,
      hasMore: hasMore && opts.sort === 'newest',
    }
  }

  async getMyCommunities(userId: string): Promise<CommunityCard[]> {
    const memberships = await this.prisma.communityMember.findMany({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: {
        community: { include: { category: { select: { slug: true } } } },
      },
    })
    return memberships
      .filter((m) => !m.community.isDeleted)
      .map((m) => ({
        id: m.community.id,
        slug: m.community.slug,
        name: m.community.name,
        description: m.community.description,
        avatarUrl: m.community.avatarUrl,
        coverUrl: m.community.coverUrl,
        category: m.community.category?.slug ?? null,
        membersCount: m.community.membersCount,
        postsCount: m.community.postsCount,
        privacy: m.community.privacy,
        isVerified: m.community.isVerified,
        viewerStatus: m.status,
      }))
  }

  // ── UPDATE / DELETE ───────────────────────────────────────────────────────

  async update(id: string, input: UpdateCommunityInput): Promise<CommunityResponse> {
    if (input.name) this.profanity.assertClean(input.name, { entityType: 'community.name' })
    if (input.description) this.profanity.assertClean(input.description, { entityType: 'community.description' })

    const existing = await this.prisma.community.findUnique({
      where: { id },
      select: { name: true, slug: true, tags: true, description: true },
    })
    if (!existing) {
      throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
    }

    const tags = input.tags?.map((t) => t.toLowerCase())
    const nextName = input.name ?? existing.name
    const nextTags = tags ?? existing.tags
    const nextDesc = input.description !== undefined ? input.description : existing.description

    await this.prisma.community.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        ...(input.privacy !== undefined ? { privacy: input.privacy } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
        searchDoc: this.buildSearchDoc(nextName, existing.slug, nextTags, nextDesc ?? null),
      },
    })

    await this.redis.invalidateCommunity(id)
    return this.getById(id)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.community.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    })
    await this.redis.invalidateCommunity(id)
    this.logger.log(`Community ${id} soft-deleted`)
  }

  async updateRules(id: string, rules: { title: string; body?: string }[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.communityRule.deleteMany({ where: { communityId: id } }),
      this.prisma.communityRule.createMany({
        data: rules.map((r, i) => ({ communityId: id, position: i, title: r.title, body: r.body })),
      }),
      this.prisma.community.update({ where: { id }, data: { rulesUpdatedAt: new Date() } }),
    ])
    await this.redis.invalidateCommunity(id)
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  private async decorateCards(
    rows: (Prisma.CommunityGetPayload<{ include: { category: { select: { slug: true } } } }>)[],
    viewerId?: string,
  ): Promise<CommunityCard[]> {
    let statusMap = new Map<string, string>()
    if (viewerId && rows.length) {
      const memberships = await this.prisma.communityMember.findMany({
        where: { userId: viewerId, communityId: { in: rows.map((r) => r.id) } },
        select: { communityId: true, status: true },
      })
      statusMap = new Map(memberships.map((m) => [m.communityId, m.status]))
    }
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      avatarUrl: r.avatarUrl,
      coverUrl: r.coverUrl,
      category: r.category?.slug ?? null,
      membersCount: r.membersCount,
      postsCount: r.postsCount,
      privacy: r.privacy,
      isVerified: r.isVerified,
      viewerStatus: statusMap.get(r.id) ?? null,
    }))
  }

  private mapCommunity(c: CommunityWithRelations): CommunityResponse {
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      avatarUrl: c.avatarUrl,
      coverUrl: c.coverUrl,
      category: c.category ? { id: c.category.id, slug: c.category.slug, label: c.category.label } : null,
      tags: c.tags,
      privacy: c.privacy,
      isVerified: c.isVerified,
      membersCount: c.membersCount,
      postsCount: c.postsCount,
      createdAt: c.createdAt.toISOString(),
      rules: c.rules.map((r) => ({ id: r.id, position: r.position, title: r.title, body: r.body })),
      viewerRole: null,
      viewerStatus: null,
    }
  }
}
