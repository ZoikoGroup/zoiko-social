import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateProviderInput, UpdateProviderInput } from './providers.schemas'

type Row = Prisma.ServiceProviderGetPayload<{
  include: { addedByUser: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

export interface ProviderResponse {
  id: string
  category: string
  name: string
  serviceType: string | null
  description: string | null
  location: string | null
  address: string | null
  phone: string | null
  website: string | null
  coverUrl: string | null
  addedBy: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  createdAt: string
}

export interface ProviderPage { data: ProviderResponse[]; nextCursor: string | null; hasMore: boolean }

const MAX = 30

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  private include() {
    return { addedByUser: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(p: Row): ProviderResponse {
    return {
      id: p.id, category: p.category, name: p.name, serviceType: p.serviceType,
      description: p.description, location: p.location, address: p.address, phone: p.phone,
      website: p.website, coverUrl: p.coverUrl,
      addedBy: {
        id: p.addedByUser.id, username: p.addedByUser.username, displayName: p.addedByUser.displayName,
        avatarUrl: p.addedByUser.avatarUrl, isVerified: p.addedByUser.verificationTier === 'professional',
      },
      createdAt: p.createdAt.toISOString(),
    }
  }

  async browse(
    category: string,
    filters: { q?: string; location?: string },
    cursor: string | null,
    limit = 15,
  ): Promise<ProviderPage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const rows = await this.prisma.serviceProvider.findMany({
      where: {
        isDeleted: false,
        category,
        ...(filters.location ? { location: { contains: filters.location, mode: 'insensitive' } } : {}),
        ...(filters.q
          ? { OR: [
              { name: { contains: filters.q, mode: 'insensitive' } },
              { serviceType: { contains: filters.q, mode: 'insensitive' } },
              { description: { contains: filters.q, mode: 'insensitive' } },
            ] }
          : {}),
        ...(decoded
          ? { OR: [
              { createdAt: { lt: new Date(decoded.createdAt) } },
              { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
            ] }
          : {}),
      },
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.include(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: items.map((r) => this.map(r)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async get(id: string): Promise<ProviderResponse> {
    const p = await this.prisma.serviceProvider.findUnique({ where: { id }, include: this.include() })
    if (!p || p.isDeleted) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' })
    return this.map(p)
  }

  /** All listings owned by the current user (any category), newest first. */
  async listMine(userId: string): Promise<ProviderResponse[]> {
    const rows = await this.prisma.serviceProvider.findMany({
      where: { addedBy: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: this.include(),
    })
    return rows.map((r) => this.map(r))
  }

  async create(addedBy: string, input: CreateProviderInput): Promise<ProviderResponse> {
    const p = await this.prisma.serviceProvider.create({
      data: {
        addedBy, category: input.category, name: input.name,
        ...(input.serviceType ? { serviceType: input.serviceType } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.address ? { address: input.address } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.website ? { website: input.website } : {}),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
      },
      include: this.include(),
    })
    return this.map(p)
  }

  async update(id: string, userId: string, input: UpdateProviderInput): Promise<ProviderResponse> {
    await this.assertOwner(id, userId)
    const p = await this.prisma.serviceProvider.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.serviceType !== undefined ? { serviceType: input.serviceType || null } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.location !== undefined ? { location: input.location || null } : {}),
        ...(input.address !== undefined ? { address: input.address || null } : {}),
        ...(input.phone !== undefined ? { phone: input.phone || null } : {}),
        ...(input.website !== undefined ? { website: input.website || null } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl || null } : {}),
      },
      include: this.include(),
    })
    return this.map(p)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwner(id, userId)
    await this.prisma.serviceProvider.update({ where: { id }, data: { isDeleted: true } })
  }

  private async assertOwner(id: string, userId: string): Promise<void> {
    const p = await this.prisma.serviceProvider.findUnique({ where: { id }, select: { addedBy: true } })
    if (!p) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' })
    if (p.addedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER', message: 'You can only manage listings you added' })
  }
}
