import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type {
  CreateProviderInput, UpdateProviderInput,
  CreateServiceInput, UpdateServiceInput,
  CreateBookingInput, UpdateBookingStatusInput,
  CreateAvailabilityInput, CreateReviewInput,
} from './providers.schemas'

// ── Provider types ───────────────────────────────────────────────────────────

type ProviderRow = Prisma.ServiceProviderGetPayload<{
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
  latitude: number | null
  longitude: number | null
  rating: number
  reviewCount: number
  availableForBooking: boolean
  addedBy: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  createdAt: string
}

export interface ProviderPage { data: ProviderResponse[]; nextCursor: string | null; hasMore: boolean }

// ── Service types ────────────────────────────────────────────────────────────

type ServiceRow = Prisma.PetCareServiceGetPayload<Record<string, never>>

export interface ServiceResponse {
  id: string
  providerId: string
  name: string
  description: string | null
  priceCents: number
  priceDisplay: string
  durationMinutes: number | null
  category: string
  isActive: boolean
  createdAt: string
}

// ── Booking types ────────────────────────────────────────────────────────────

type BookingRow = Prisma.PetCareBookingGetPayload<{
  include: {
    service: { select: { id: true; name: true; category: true; durationMinutes: true } }
    provider: { select: { id: true; name: true; location: true; coverUrl: true } }
    seeker: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } }
  }
}>

export interface BookingResponse {
  id: string
  serviceId: string
  service: { id: string; name: string; category: string; durationMinutes: number | null }
  provider: { id: string; name: string; location: string | null; coverUrl: string | null }
  seeker: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  scheduledAt: string
  endAt: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  petName: string | null
  petSpecies: string | null
  petBreed: string | null
  petWeightKg: number | null
  notes: string | null
  priceCents: number
  priceDisplay: string
  paymentMethod: string
  paymentStatus: string
  status: string
  cancelledBy: string | null
  cancelReason: string | null
  createdAt: string
}

export interface BookingPage { data: BookingResponse[]; nextCursor: string | null; hasMore: boolean }

// ── Availability types ───────────────────────────────────────────────────────

export interface AvailabilityResponse {
  id: string
  providerId: string
  dayOfWeek: number | null
  date: string | null
  startTime: string
  endTime: string
  kind: string
}

// ── Review types ─────────────────────────────────────────────────────────────

type ReviewRow = Prisma.ProviderReviewGetPayload<{
  include: { author: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

export interface ReviewResponse {
  id: string
  providerId: string
  bookingId: string
  rating: number
  body: string | null
  author: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  createdAt: string
}

// ── Constants ────────────────────────────────────────────────────────────────

const MAX = 30

@Injectable()
export class ProvidersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  // ════════════════════════════════════════════════════════════════════════════
  // PROVIDERS (existing)
  // ════════════════════════════════════════════════════════════════════════════

  private providerInclude() {
    return { addedByUser: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private mapProvider(p: ProviderRow): ProviderResponse {
    return {
      id: p.id, category: p.category, name: p.name, serviceType: p.serviceType,
      description: p.description, location: p.location, address: p.address, phone: p.phone,
      website: p.website, coverUrl: p.coverUrl,
      latitude: p.latitude, longitude: p.longitude,
      rating: p.rating, reviewCount: p.reviewCount, availableForBooking: p.availableForBooking,
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
        hiddenAt: null,
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
      include: this.providerInclude(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: items.map((r) => this.mapProvider(r)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async get(id: string): Promise<ProviderResponse> {
    const p = await this.prisma.serviceProvider.findUnique({ where: { id }, include: this.providerInclude() })
    if (!p || p.isDeleted || p.hiddenAt) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' })
    return this.mapProvider(p)
  }

  /** All listings owned by the current user (any category), newest first. */
  async listMine(userId: string): Promise<ProviderResponse[]> {
    const rows = await this.prisma.serviceProvider.findMany({
      where: { addedBy: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: this.providerInclude(),
    })
    return rows.map((r) => this.mapProvider(r))
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
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      },
      include: this.providerInclude(),
    })
    return this.mapProvider(p)
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
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      },
      include: this.providerInclude(),
    })
    return this.mapProvider(p)
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

  // ════════════════════════════════════════════════════════════════════════════
  // PET CARE SERVICES
  // ════════════════════════════════════════════════════════════════════════════

  private centsToDollars(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`
  }

  private mapService(s: ServiceRow): ServiceResponse {
    return {
      id: s.id, providerId: s.providerId, name: s.name,
      description: s.description, priceCents: s.priceCents,
      priceDisplay: this.centsToDollars(s.priceCents),
      durationMinutes: s.durationMinutes, category: s.category,
      isActive: s.isActive, createdAt: s.createdAt.toISOString(),
    }
  }

  async listServices(providerId: string): Promise<ServiceResponse[]> {
    const rows = await this.prisma.petCareService.findMany({
      where: { providerId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
    })
    return rows.map((r) => this.mapService(r))
  }

  async createService(userId: string, input: CreateServiceInput): Promise<ServiceResponse> {
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { id: input.providerId },
      select: { addedBy: true, isDeleted: true },
    })
    if (!provider || provider.isDeleted) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND' })
    if (provider.addedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    const s = await this.prisma.petCareService.create({
      data: {
        providerId: input.providerId, createdBy: userId,
        name: input.name, description: input.description ?? null,
        priceCents: input.priceCents, durationMinutes: input.durationMinutes ?? null,
        category: input.category ?? 'other',
      },
    })
    return this.mapService(s)
  }

  async updateService(serviceId: string, userId: string, input: UpdateServiceInput): Promise<ServiceResponse> {
    const s = await this.prisma.petCareService.findUnique({ where: { id: serviceId }, select: { createdBy: true, providerId: true } })
    if (!s) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Service not found' })
    if (s.createdBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    const updated = await this.prisma.petCareService.update({
      where: { id: serviceId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.priceCents !== undefined ? { priceCents: input.priceCents } : {}),
        ...(input.durationMinutes !== undefined ? { durationMinutes: input.durationMinutes } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    })
    return this.mapService(updated)
  }

  async removeService(serviceId: string, userId: string): Promise<void> {
    const s = await this.prisma.petCareService.findUnique({ where: { id: serviceId }, select: { createdBy: true, providerId: true } })
    if (!s) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND' })
    if (s.createdBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    await this.prisma.petCareService.update({ where: { id: serviceId }, data: { isDeleted: true } })
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BOOKINGS
  // ════════════════════════════════════════════════════════════════════════════

  private mapBooking(b: BookingRow): BookingResponse {
    return {
      id: b.id, serviceId: b.serviceId,
      service: { id: b.service.id, name: b.service.name, category: b.service.category, durationMinutes: b.service.durationMinutes },
      provider: { id: b.provider.id, name: b.provider.name, location: b.provider.location, coverUrl: b.provider.coverUrl },
      seeker: {
        id: b.seeker.id, username: b.seeker.username, displayName: b.seeker.displayName,
        avatarUrl: b.seeker.avatarUrl, isVerified: b.seeker.verificationTier === 'professional',
      },
      scheduledAt: b.scheduledAt.toISOString(), endAt: b.endAt?.toISOString() ?? null,
      location: b.location, latitude: b.latitude, longitude: b.longitude,
      petName: b.petName, petSpecies: b.petSpecies, petBreed: b.petBreed, petWeightKg: b.petWeightKg,
      notes: b.notes, priceCents: b.priceCents, priceDisplay: this.centsToDollars(b.priceCents),
      paymentMethod: b.paymentMethod, paymentStatus: b.paymentStatus,
      status: b.status, cancelledBy: b.cancelledBy, cancelReason: b.cancelReason,
      createdAt: b.createdAt.toISOString(),
    }
  }

  private bookingInclude() {
    return {
      service: { select: { id: true, name: true, category: true, durationMinutes: true } },
      provider: { select: { id: true, name: true, location: true, coverUrl: true } },
      seeker: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
    }
  }

  /** List bookings — as seeker or provider (for pet_care providers). */
  async listBookings(
    userId: string,
    role: 'seeker' | 'provider',
    status?: string,
    cursor?: string | null,
    limit = 15,
  ): Promise<BookingPage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const where: Prisma.PetCareBookingWhereInput = {
      isDeleted: false,
      ...(role === 'seeker' ? { seekerId: userId } : {}),
      ...(role === 'provider' ? { provider: { addedBy: userId } } : {}),
      ...(status ? { status } : {}),
      ...(decoded
        ? { OR: [
            { createdAt: { lt: new Date(decoded.createdAt) } },
            { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
          ] }
        : {}),
    }

    const rows = await this.prisma.petCareBooking.findMany({
      where,
      take: take + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: this.bookingInclude(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: items.map((r) => this.mapBooking(r)),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  async getBooking(bookingId: string, userId: string): Promise<BookingResponse> {
    const b = await this.prisma.petCareBooking.findUnique({
      where: { id: bookingId },
      include: this.bookingInclude(),
    })
    if (!b || b.isDeleted) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found' })
    // Check access: seeker or the provider's owner
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: b.providerId }, select: { addedBy: true } })
    if (b.seekerId !== userId && provider?.addedBy !== userId) {
      throw new ForbiddenException({ code: 'ACCESS_DENIED', message: 'You can only view your own bookings' })
    }
    return this.mapBooking(b)
  }

  async createBooking(userId: string, input: CreateBookingInput): Promise<BookingResponse> {
    // Validate provider
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { id: input.providerId },
      select: { id: true, addedBy: true, isDeleted: true, availableForBooking: true, name: true },
    })
    if (!provider || provider.isDeleted) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' })
    if (provider.addedBy === userId) throw new BadRequestException({ code: 'OWN_SERVICE', message: 'You cannot book your own service' })

    // Validate service
    const service = await this.prisma.petCareService.findUnique({
      where: { id: input.serviceId },
      select: { id: true, providerId: true, priceCents: true, name: true, isActive: true, isDeleted: true },
    })
    if (!service || service.isDeleted || !service.isActive || service.providerId !== input.providerId) {
      throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Service not found or inactive' })
    }

    const scheduledAt = new Date(input.scheduledAt)
    const endAt = input.endAt ? new Date(input.endAt) : null

    const b = await this.prisma.petCareBooking.create({
      data: {
        serviceId: input.serviceId, providerId: input.providerId, seekerId: userId,
        scheduledAt, endAt,
        location: input.location ?? null, latitude: input.latitude ?? null, longitude: input.longitude ?? null,
        petName: input.petName ?? null, petSpecies: input.petSpecies ?? null,
        petBreed: input.petBreed ?? null, petWeightKg: input.petWeightKg ?? null,
        notes: input.notes ?? null, priceCents: service.priceCents,
        paymentMethod: input.paymentMethod ?? 'pay_at_visit',
      },
      include: this.bookingInclude(),
    })

    // Notify the provider
    const seeker = await this.prisma.profile.findUnique({ where: { id: userId }, select: { displayName: true } })
    void this.notifications.enqueue({
      userId: provider.addedBy,
      type: 'pet_care_booking',
      title: 'New booking request',
      body: `${seeker?.displayName ?? 'Someone'} booked ${service.name}`,
      data: { bookingId: b.id, providerId: input.providerId },
    })

    return this.mapBooking(b)
  }

  async updateBookingStatus(bookingId: string, userId: string, input: UpdateBookingStatusInput): Promise<BookingResponse> {
    const b = await this.prisma.petCareBooking.findUnique({
      where: { id: bookingId },
      include: this.bookingInclude(),
    })
    if (!b || b.isDeleted) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found' })

    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: b.providerId }, select: { addedBy: true } })

    // Seekers can only cancel their own bookings
    if (input.status === 'cancelled' && b.seekerId === userId) {
      const updated = await this.prisma.petCareBooking.update({
        where: { id: bookingId },
        data: { status: 'cancelled', cancelledBy: 'seeker', cancelReason: input.cancelReason ?? null },
        include: this.bookingInclude(),
      })
      return this.mapBooking(updated)
    }

    // Providers can confirm, start, complete, cancel, mark no-show
    if (provider?.addedBy !== userId) {
      throw new ForbiddenException({ code: 'ACCESS_DENIED', message: 'Only the provider can manage this booking' })
    }

    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed'],
    }
    const allowed = validTransitions[b.status] ?? []
    if (!allowed.includes(input.status)) {
      throw new BadRequestException({ code: 'INVALID_TRANSITION', message: `Cannot change booking from ${b.status} to ${input.status}` })
    }

    const updateData: Prisma.PetCareBookingUpdateInput = { status: input.status }
    if (input.status === 'cancelled') {
      updateData.cancelledBy = 'provider'
      updateData.cancelReason = input.cancelReason ?? null
    }

    const updated = await this.prisma.petCareBooking.update({
      where: { id: bookingId },
      data: updateData,
      include: this.bookingInclude(),
    })

    // Notify seeker on status change
    if (input.status === 'confirmed' || input.status === 'cancelled') {
      const providerName = b.provider.name
      void this.notifications.enqueue({
        userId: b.seekerId,
        type: 'pet_care_booking_update',
        title: input.status === 'confirmed' ? 'Booking confirmed 🎉' : 'Booking cancelled',
        body: input.status === 'confirmed'
          ? `${providerName} confirmed your booking for ${b.service.name}`
          : `${providerName} cancelled your booking for ${b.service.name}`,
        data: { bookingId, providerId: b.providerId },
      })
    }

    return this.mapBooking(updated)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // AVAILABILITY
  // ════════════════════════════════════════════════════════════════════════════

  private mapAvailability(a: Prisma.ProviderAvailabilityGetPayload<Record<string, never>>): AvailabilityResponse {
    return {
      id: a.id, providerId: a.providerId,
      dayOfWeek: a.dayOfWeek, date: a.date?.toISOString() ?? null,
      startTime: a.startTime, endTime: a.endTime, kind: a.kind,
    }
  }

  async listAvailability(providerId: string): Promise<AvailabilityResponse[]> {
    const rows = await this.prisma.providerAvailability.findMany({
      where: { providerId, isDeleted: false },
      orderBy: [{ kind: 'asc' }, { dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
    return rows.map((r) => this.mapAvailability(r))
  }

  async createAvailability(userId: string, input: CreateAvailabilityInput): Promise<AvailabilityResponse> {
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: input.providerId }, select: { addedBy: true, isDeleted: true } })
    if (!provider || provider.isDeleted) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND' })
    if (provider.addedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    const a = await this.prisma.providerAvailability.create({
      data: {
        providerId: input.providerId, addedBy: userId,
        dayOfWeek: input.dayOfWeek ?? null,
        date: input.date ? new Date(input.date) : null,
        startTime: input.startTime, endTime: input.endTime,
        kind: input.kind ?? 'weekly',
      },
    })
    return this.mapAvailability(a)
  }

  async removeAvailability(availabilityId: string, userId: string): Promise<void> {
    const a = await this.prisma.providerAvailability.findUnique({ where: { id: availabilityId }, select: { addedBy: true } })
    if (!a) throw new NotFoundException({ code: 'AVAILABILITY_NOT_FOUND' })
    if (a.addedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    await this.prisma.providerAvailability.update({ where: { id: availabilityId }, data: { isDeleted: true } })
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REVIEWS
  // ════════════════════════════════════════════════════════════════════════════

  private mapReview(r: ReviewRow): ReviewResponse {
    return {
      id: r.id, providerId: r.providerId, bookingId: r.bookingId,
      rating: r.rating, body: r.body,
      author: {
        id: r.author.id, username: r.author.username, displayName: r.author.displayName,
        avatarUrl: r.author.avatarUrl, isVerified: r.author.verificationTier === 'professional',
      },
      createdAt: r.createdAt.toISOString(),
    }
  }

  async listReviews(providerId: string): Promise<ReviewResponse[]> {
    const rows = await this.prisma.providerReview.findMany({
      where: { providerId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return rows.map((r) => this.mapReview(r))
  }

  async createReview(userId: string, input: CreateReviewInput): Promise<ReviewResponse> {
    const booking = await this.prisma.petCareBooking.findUnique({
      where: { id: input.bookingId },
      select: { id: true, seekerId: true, providerId: true, status: true },
    })
    if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND' })
    if (booking.seekerId !== userId) throw new ForbiddenException({ code: 'ACCESS_DENIED' })
    if (booking.status !== 'completed') throw new BadRequestException({ code: 'NOT_COMPLETED', message: 'Can only review completed bookings' })

    // Check duplicate
    const existing = await this.prisma.providerReview.findUnique({
      where: { bookingId_authorId: { bookingId: input.bookingId, authorId: userId } },
    })
    if (existing) throw new BadRequestException({ code: 'ALREADY_REVIEWED', message: 'You already reviewed this booking' })

    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: booking.providerId }, select: { addedBy: true } })
    if (!provider) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND' })

    const review = await this.prisma.providerReview.create({
      data: {
        providerId: booking.providerId, bookingId: input.bookingId,
        authorId: userId, targetId: provider.addedBy,
        rating: input.rating, body: input.body ?? null,
      },
      include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })

    // Recalculate provider rating
    const agg = await this.prisma.providerReview.aggregate({
      where: { providerId: booking.providerId, isDeleted: false },
      _avg: { rating: true },
      _count: true,
    })
    await this.prisma.serviceProvider.update({
      where: { id: booking.providerId },
      data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count },
    })

    return this.mapReview(review)
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const r = await this.prisma.providerReview.findUnique({ where: { id: reviewId }, select: { authorId: true, providerId: true } })
    if (!r) throw new NotFoundException({ code: 'REVIEW_NOT_FOUND' })
    if (r.authorId !== userId) throw new ForbiddenException({ code: 'ACCESS_DENIED' })
    await this.prisma.providerReview.update({ where: { id: reviewId }, data: { isDeleted: true } })

    // Recalculate provider rating
    const agg = await this.prisma.providerReview.aggregate({
      where: { providerId: r.providerId, isDeleted: false },
      _avg: { rating: true },
      _count: true,
    })
    await this.prisma.serviceProvider.update({
      where: { id: r.providerId },
      data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count },
    })
  }
}
