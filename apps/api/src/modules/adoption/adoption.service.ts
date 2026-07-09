import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateListingInput, UpdateListingInput, EnquiryInput, RespondEnquiryInput } from './adoption.schemas'

type ListingRow = Prisma.AdoptionPostGetPayload<{
  include: { poster: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

export interface ListingResponse {
  id: string
  poster: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  name: string
  species: string
  breed: string | null
  age: string | null
  sex: string
  size: string | null
  description: string | null
  location: string | null
  coverUrl: string | null
  photos: string[]
  vaccinated: boolean
  neutered: boolean
  goodWith: string[]
  fee: number | null
  status: string
  enquiriesCount: number
  createdAt: string
  viewerEnquiryStatus: string | null
}

export interface ListingPage { data: ListingResponse[]; nextCursor: string | null; hasMore: boolean }

const MAX = 30

@Injectable()
export class AdoptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private posterInclude() {
    return { poster: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(l: ListingRow, viewerEnquiryStatus: string | null): ListingResponse {
    return {
      id: l.id,
      poster: {
        id: l.poster.id, username: l.poster.username, displayName: l.poster.displayName,
        avatarUrl: l.poster.avatarUrl, isVerified: l.poster.verificationTier === 'professional',
      },
      name: l.name, species: l.species, breed: l.breed, age: l.age, sex: l.sex, size: l.size,
      description: l.description, location: l.location, coverUrl: l.coverUrl, photos: l.photos,
      vaccinated: l.vaccinated, neutered: l.neutered, goodWith: l.goodWith, fee: l.fee,
      status: l.status, enquiriesCount: l.enquiriesCount, createdAt: l.createdAt.toISOString(),
      viewerEnquiryStatus,
    }
  }

  private async enquiryFlags(listingIds: string[], viewerId?: string): Promise<Map<string, string>> {
    if (!viewerId || listingIds.length === 0) return new Map()
    const rows = await this.prisma.adoptionEnquiry.findMany({
      where: { applicantId: viewerId, listingId: { in: listingIds } },
      select: { listingId: true, status: true },
    })
    return new Map(rows.map((r) => [r.listingId, r.status]))
  }

  async browse(
    viewerId: string | undefined,
    filters: { species?: string; status?: string; q?: string },
    cursor: string | null,
    limit = 15,
  ): Promise<ListingPage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const listings = await this.prisma.adoptionPost.findMany({
      where: {
        isDeleted: false,
        ...(filters.status ? { status: filters.status } : { status: { in: ['available', 'pending'] } }),
        ...(filters.species ? { species: { equals: filters.species, mode: 'insensitive' } } : {}),
        ...(filters.q
          ? { OR: [
              { name: { contains: filters.q, mode: 'insensitive' } },
              { breed: { contains: filters.q, mode: 'insensitive' } },
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
      include: this.posterInclude(),
    })
    const hasMore = listings.length > take
    const items = hasMore ? listings.slice(0, take) : listings
    const flags = await this.enquiryFlags(items.map((l) => l.id), viewerId)
    return {
      data: items.map((l) => this.map(l, flags.get(l.id) ?? null)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async get(id: string, viewerId?: string): Promise<ListingResponse> {
    const l = await this.prisma.adoptionPost.findUnique({ where: { id }, include: this.posterInclude() })
    if (!l || l.isDeleted) throw new NotFoundException({ code: 'LISTING_NOT_FOUND', message: 'Listing not found' })
    const flags = await this.enquiryFlags([l.id], viewerId)
    return this.map(l, flags.get(l.id) ?? null)
  }

  async create(posterId: string, input: CreateListingInput): Promise<ListingResponse> {
    const l = await this.prisma.adoptionPost.create({
      data: {
        posterId, name: input.name, species: input.species,
        sex: input.sex ?? 'unknown',
        ...(input.breed ? { breed: input.breed } : {}),
        ...(input.age ? { age: input.age } : {}),
        ...(input.size ? { size: input.size } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos ? { photos: input.photos } : {}),
        ...(input.vaccinated !== undefined ? { vaccinated: input.vaccinated } : {}),
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.goodWith ? { goodWith: input.goodWith } : {}),
        ...(input.fee !== undefined ? { fee: input.fee } : {}),
      },
      include: this.posterInclude(),
    })
    return this.map(l, null)
  }

  async update(id: string, posterId: string, input: UpdateListingInput): Promise<ListingResponse> {
    await this.assertPoster(id, posterId)
    const l = await this.prisma.adoptionPost.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.species !== undefined ? { species: input.species } : {}),
        ...(input.breed !== undefined ? { breed: input.breed || null } : {}),
        ...(input.age !== undefined ? { age: input.age || null } : {}),
        ...(input.sex !== undefined ? { sex: input.sex } : {}),
        ...(input.size !== undefined ? { size: input.size || null } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.location !== undefined ? { location: input.location || null } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl || null } : {}),
        ...(input.photos !== undefined ? { photos: input.photos } : {}),
        ...(input.vaccinated !== undefined ? { vaccinated: input.vaccinated } : {}),
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.goodWith !== undefined ? { goodWith: input.goodWith } : {}),
        ...(input.fee !== undefined ? { fee: input.fee } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.posterInclude(),
    })
    return this.map(l, null)
  }

  async remove(id: string, posterId: string): Promise<void> {
    await this.assertPoster(id, posterId)
    await this.prisma.adoptionPost.update({ where: { id }, data: { isDeleted: true } })
  }

  private async assertPoster(id: string, posterId: string): Promise<void> {
    const l = await this.prisma.adoptionPost.findUnique({ where: { id }, select: { posterId: true } })
    if (!l) throw new NotFoundException({ code: 'LISTING_NOT_FOUND', message: 'Listing not found' })
    if (l.posterId !== posterId) throw new ForbiddenException({ code: 'NOT_POSTER', message: 'You can only manage your own listings' })
  }

  // ── Enquiries ──────────────────────────────────────────────────────────────

  async enquire(listingId: string, applicantId: string, input: EnquiryInput): Promise<{ status: string }> {
    const listing = await this.prisma.adoptionPost.findUnique({
      where: { id: listingId },
      select: { id: true, isDeleted: true, posterId: true, name: true },
    })
    if (!listing || listing.isDeleted) throw new NotFoundException({ code: 'LISTING_NOT_FOUND', message: 'Listing not found' })
    if (listing.posterId === applicantId) throw new BadRequestException({ code: 'OWN_LISTING', message: 'You cannot enquire on your own listing' })

    const existing = await this.prisma.adoptionEnquiry.findUnique({
      where: { listingId_applicantId: { listingId, applicantId } },
      select: { status: true },
    })
    if (existing) return { status: existing.status }

    await this.prisma.$transaction(async (tx) => {
      await tx.adoptionEnquiry.create({
        data: { listingId, applicantId, ...(input.message ? { message: input.message } : {}) },
      })
      await tx.adoptionPost.update({ where: { id: listingId }, data: { enquiriesCount: { increment: 1 } } })
    })

    const applicant = await this.prisma.profile.findUnique({ where: { id: applicantId }, select: { displayName: true, username: true } })
    void this.notifications.enqueue({
      userId: listing.posterId,
      type: 'adoption_enquiry',
      title: 'New adoption enquiry',
      body: `${applicant?.displayName ?? 'Someone'} is interested in ${listing.name}`,
      data: { listingId, applicantUsername: applicant?.username },
    })
    return { status: 'pending' }
  }

  async listEnquiries(listingId: string, posterId: string): Promise<Array<{
    id: string; message: string | null; status: string; createdAt: string
    applicant: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    await this.assertPoster(listingId, posterId)
    const enquiries = await this.prisma.adoptionEnquiry.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: { applicant: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return enquiries.map((e) => ({
      id: e.id, message: e.message, status: e.status, createdAt: e.createdAt.toISOString(),
      applicant: {
        id: e.applicant.id, username: e.applicant.username, displayName: e.applicant.displayName,
        avatarUrl: e.applicant.avatarUrl, isVerified: e.applicant.verificationTier === 'professional',
      },
    }))
  }

  async respondEnquiry(listingId: string, enquiryId: string, posterId: string, input: RespondEnquiryInput): Promise<{ status: string }> {
    await this.assertPoster(listingId, posterId)
    const enquiry = await this.prisma.adoptionEnquiry.findUnique({ where: { id: enquiryId }, select: { id: true, listingId: true, applicantId: true } })
    if (!enquiry || enquiry.listingId !== listingId) throw new NotFoundException({ code: 'ENQUIRY_NOT_FOUND', message: 'Enquiry not found' })

    await this.prisma.adoptionEnquiry.update({ where: { id: enquiryId }, data: { status: input.status } })
    const listing = await this.prisma.adoptionPost.findUnique({ where: { id: listingId }, select: { name: true } })
    void this.notifications.enqueue({
      userId: enquiry.applicantId,
      type: 'adoption_enquiry_response',
      title: input.status === 'accepted' ? 'Adoption enquiry accepted' : 'Adoption enquiry update',
      body: input.status === 'accepted'
        ? `Your enquiry for ${listing?.name ?? 'a pet'} was accepted!`
        : `Your enquiry for ${listing?.name ?? 'a pet'} was not accepted.`,
      data: { listingId },
    })
    return { status: input.status }
  }
}
