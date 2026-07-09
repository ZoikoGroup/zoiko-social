import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateBreedingInput, UpdateBreedingInput, RequestInput, RespondRequestInput, BreedingSpecies } from './breeding.schemas'

export interface BreedingResponse {
  id: string
  owner: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  petName: string
  species: string
  breed: string
  sex: string
  age: string | null
  location: string | null
  about: string | null
  healthTests: string[]
  certifications: string[]
  coverUrl: string | null
  photos: string[]
  fee: number | null
  currency: string
  status: string
  requestsCount: number
  createdAt: string
  viewerRequested: boolean
}

export interface BreedingPage {
  data: BreedingResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type BreedingRow = Prisma.BreedingProfileGetPayload<{
  include: { owner: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

const MAX = 30

interface BrowseFilters {
  species?: BreedingSpecies
  sex?: string
  status?: string
  q?: string
}

@Injectable()
export class BreedingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private ownerInclude() {
    return { owner: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(p: BreedingRow, requested: boolean): BreedingResponse {
    return {
      id: p.id,
      owner: {
        id: p.owner.id, username: p.owner.username, displayName: p.owner.displayName,
        avatarUrl: p.owner.avatarUrl, isVerified: p.owner.verificationTier === 'professional',
      },
      petName: p.petName, species: p.species, breed: p.breed, sex: p.sex, age: p.age,
      location: p.location, about: p.about, healthTests: p.healthTests, certifications: p.certifications,
      coverUrl: p.coverUrl, photos: p.photos, fee: p.feeCents !== null ? p.feeCents / 100 : null,
      currency: p.currency, status: p.status, requestsCount: p.requestsCount,
      createdAt: p.createdAt.toISOString(), viewerRequested: requested,
    }
  }

  private async requestedFlags(ids: string[], viewerId?: string): Promise<Set<string>> {
    if (!viewerId || ids.length === 0) return new Set()
    const rows = await this.prisma.breedingRequest.findMany({ where: { requesterId: viewerId, profileId: { in: ids } }, select: { profileId: true } })
    return new Set(rows.map((r) => r.profileId))
  }

  async browse(filters: BrowseFilters, viewerId: string | undefined, cursor: string | null, limit = 15): Promise<BreedingPage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const where: Prisma.BreedingProfileWhereInput = {
      isDeleted: false,
      ...(filters.status ? { status: filters.status } : { status: 'available' }),
      ...(filters.species ? { species: filters.species } : {}),
      ...(filters.sex ? { sex: filters.sex } : {}),
      ...(filters.q ? { OR: [{ petName: { contains: filters.q, mode: 'insensitive' } }, { breed: { contains: filters.q, mode: 'insensitive' } }] } : {}),
      ...(decoded
        ? { OR: [{ createdAt: { lt: new Date(decoded.createdAt) } }, { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } }] }
        : {}),
    }
    const rows = await this.prisma.breedingProfile.findMany({
      where, take: take + 1, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], include: this.ownerInclude(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    const requested = await this.requestedFlags(items.map((p) => p.id), viewerId)
    return {
      data: items.map((p) => this.map(p, requested.has(p.id))),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async get(id: string, viewerId?: string): Promise<BreedingResponse> {
    const p = await this.prisma.breedingProfile.findUnique({ where: { id }, include: this.ownerInclude() })
    if (!p || p.isDeleted) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    const requested = await this.requestedFlags([p.id], viewerId)
    return this.map(p, requested.has(p.id))
  }

  async create(ownerId: string, input: CreateBreedingInput): Promise<BreedingResponse> {
    const created = await this.prisma.breedingProfile.create({
      data: {
        ownerId, petName: input.petName, breed: input.breed,
        species: input.species ?? 'dog', sex: input.sex ?? 'male',
        healthTests: input.healthTests ?? [], certifications: input.certifications ?? [],
        ...(input.age ? { age: input.age } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.about ? { about: input.about } : {}),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos ? { photos: input.photos } : {}),
        ...(input.fee !== undefined ? { feeCents: Math.round(input.fee * 100) } : {}),
        ...(input.currency ? { currency: input.currency.toUpperCase() } : {}),
      },
      include: this.ownerInclude(),
    })
    return this.map(created, false)
  }

  private async assertOwner(id: string, ownerId: string): Promise<void> {
    const p = await this.prisma.breedingProfile.findUnique({ where: { id }, select: { ownerId: true } })
    if (!p) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    if (p.ownerId !== ownerId) throw new ForbiddenException({ code: 'NOT_OWNER', message: 'You can only manage your own breeding profiles' })
  }

  async update(id: string, ownerId: string, input: UpdateBreedingInput): Promise<BreedingResponse> {
    await this.assertOwner(id, ownerId)
    const updated = await this.prisma.breedingProfile.update({
      where: { id },
      data: {
        ...(input.petName !== undefined ? { petName: input.petName } : {}),
        ...(input.species !== undefined ? { species: input.species } : {}),
        ...(input.breed !== undefined ? { breed: input.breed } : {}),
        ...(input.sex !== undefined ? { sex: input.sex } : {}),
        ...(input.age !== undefined ? { age: input.age } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.about !== undefined ? { about: input.about } : {}),
        ...(input.healthTests !== undefined ? { healthTests: input.healthTests } : {}),
        ...(input.certifications !== undefined ? { certifications: input.certifications } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos !== undefined ? { photos: input.photos } : {}),
        ...(input.fee !== undefined ? { feeCents: Math.round(input.fee * 100) } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.ownerInclude(),
    })
    const requested = await this.requestedFlags([id], ownerId)
    return this.map(updated, requested.has(id))
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.assertOwner(id, ownerId)
    await this.prisma.breedingProfile.update({ where: { id }, data: { isDeleted: true } })
  }

  async request(id: string, requesterId: string, input: RequestInput): Promise<{ status: string }> {
    const profile = await this.prisma.breedingProfile.findUnique({ where: { id }, select: { id: true, isDeleted: true, ownerId: true, petName: true } })
    if (!profile || profile.isDeleted) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    if (profile.ownerId === requesterId) throw new BadRequestException({ code: 'OWN_PROFILE', message: 'You cannot request a match on your own profile' })

    const existing = await this.prisma.breedingRequest.findUnique({ where: { profileId_requesterId: { profileId: id, requesterId } }, select: { status: true } })
    if (existing) return { status: existing.status }

    await this.prisma.$transaction(async (tx) => {
      await tx.breedingRequest.create({ data: { profileId: id, requesterId, ...(input.message ? { message: input.message } : {}) } })
      await tx.breedingProfile.update({ where: { id }, data: { requestsCount: { increment: 1 } } })
    })

    const requester = await this.prisma.profile.findUnique({ where: { id: requesterId }, select: { displayName: true, username: true } })
    void this.notifications.enqueue({
      userId: profile.ownerId,
      type: 'breeding_request',
      title: 'New match request',
      body: `${requester?.displayName ?? 'Someone'} is interested in breeding with ${profile.petName}`,
      data: { profileId: id, requesterUsername: requester?.username },
    })
    return { status: 'pending' }
  }

  async listRequests(id: string, ownerId: string): Promise<Array<{
    id: string; message: string | null; status: string; createdAt: string
    requester: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    await this.assertOwner(id, ownerId)
    const rows = await this.prisma.breedingRequest.findMany({
      where: { profileId: id },
      orderBy: { createdAt: 'desc' },
      include: { requester: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return rows.map((r) => ({
      id: r.id, message: r.message, status: r.status, createdAt: r.createdAt.toISOString(),
      requester: {
        id: r.requester.id, username: r.requester.username, displayName: r.requester.displayName,
        avatarUrl: r.requester.avatarUrl, isVerified: r.requester.verificationTier === 'professional',
      },
    }))
  }

  async respondRequest(profileId: string, requestId: string, ownerId: string, input: RespondRequestInput): Promise<{ status: string }> {
    await this.assertOwner(profileId, ownerId)
    const req = await this.prisma.breedingRequest.findUnique({ where: { id: requestId }, select: { id: true, profileId: true, requesterId: true } })
    if (!req || req.profileId !== profileId) throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Request not found' })

    await this.prisma.breedingRequest.update({ where: { id: requestId }, data: { status: input.status } })
    const profile = await this.prisma.breedingProfile.findUnique({ where: { id: profileId }, select: { petName: true } })
    void this.notifications.enqueue({
      userId: req.requesterId,
      type: 'breeding_request_response',
      title: input.status === 'accepted' ? 'Match request accepted' : 'Match request update',
      body: input.status === 'accepted'
        ? `Your match request for ${profile?.petName ?? 'a pet'} was accepted`
        : `Your match request for ${profile?.petName ?? 'a pet'} was declined`,
      data: { profileId },
    })
    return { status: input.status }
  }
}
