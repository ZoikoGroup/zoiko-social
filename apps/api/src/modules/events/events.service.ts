import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateEventInput, UpdateEventInput, RsvpInput } from './events.schemas'

export interface EventResponse {
  id: string
  host: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  description: string | null
  location: string | null
  venueName: string | null
  visibility: string
  isOnline: boolean
  coverUrl: string | null
  videoUrl: string | null
  category: string | null
  isFree: boolean
  price: string | null
  bookingUrl: string | null
  capacity: number | null
  seatsLeft: number | null
  latitude: number | null
  longitude: number | null
  distanceKm: number | null
  startsAt: string
  endsAt: string | null
  goingCount: number
  viewerGoing: boolean
}

export interface EventPage {
  data: EventResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type EventRow = Prisma.EventGetPayload<{
  include: { host: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

const MAX = 30

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private hostInclude() {
    return { host: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(e: EventRow, going: boolean, distanceKm: number | null = null): EventResponse {
    return {
      id: e.id,
      host: {
        id: e.host.id, username: e.host.username, displayName: e.host.displayName,
        avatarUrl: e.host.avatarUrl, isVerified: e.host.verificationTier === 'professional',
      },
      title: e.title, description: e.description, location: e.location, venueName: e.venueName,
      visibility: e.visibility,
      isOnline: e.isOnline, coverUrl: e.coverUrl, videoUrl: e.videoUrl,
      category: e.category, isFree: e.isFree, price: e.price, bookingUrl: e.bookingUrl,
      capacity: e.capacity,
      seatsLeft: e.capacity !== null ? Math.max(0, e.capacity - e.goingCount) : null,
      latitude: e.latitude, longitude: e.longitude, distanceKm,
      startsAt: e.startsAt.toISOString(), endsAt: e.endsAt ? e.endsAt.toISOString() : null,
      goingCount: e.goingCount, viewerGoing: going,
    }
  }

  /** OR-conditions restricting which events a viewer may see. */
  private visibilityWhere(viewerId?: string): Prisma.EventWhereInput[] {
    if (!viewerId) return [{ visibility: 'public' }]
    return [
      { visibility: 'public' },
      { hostId: viewerId }, // own events, any visibility
      { visibility: 'followers', host: { followsAsFollowing: { some: { followerId: viewerId, status: 'active' } } } },
    ]
  }

  private async goingFlags(eventIds: string[], viewerId?: string): Promise<Set<string>> {
    if (!viewerId || eventIds.length === 0) return new Set()
    const rows = await this.prisma.eventRsvp.findMany({
      where: { userId: viewerId, eventId: { in: eventIds } },
      select: { eventId: true },
    })
    return new Set(rows.map((r) => r.eventId))
  }

  /**
   * List events with filters + keyset pagination.
   *  - default: upcoming (startsAt >= now), soonest first
   *  - past: startsAt < now, most-recent first
   *  - mine: the viewer's own hosted events (all times), most-recent first
   * Plus optional category / free-only / title search.
   */
  async list(
    viewerId: string | undefined,
    cursor: string | null,
    limit = 15,
    filters: { category?: string; isFree?: boolean; q?: string; mine?: boolean; past?: boolean; nearLat?: number; nearLng?: number } = {},
  ): Promise<EventPage> {
    const take = Math.min(limit, MAX)
    if (filters.nearLat !== undefined && filters.nearLng !== undefined) {
      return this.nearby(viewerId, cursor, take, filters.nearLat, filters.nearLng, filters)
    }
    const decoded = cursor ? decodeCursor(cursor) : null
    const now = new Date()
    const mine = filters.mine && !!viewerId
    const desc = !!(mine || filters.past)

    const cursorClause = decoded
      ? desc
        ? [{ OR: [{ startsAt: { lt: new Date(decoded.createdAt) } }, { startsAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } }] }]
        : [{ OR: [{ startsAt: { gt: new Date(decoded.createdAt) } }, { startsAt: new Date(decoded.createdAt), id: { gt: decoded.tiebreaker } }] }]
      : []

    const events = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        ...(mine ? { hostId: viewerId } : filters.past ? { startsAt: { lt: now } } : { startsAt: { gte: now } }),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.isFree !== undefined ? { isFree: filters.isFree } : {}),
        ...(filters.q ? { title: { contains: filters.q, mode: 'insensitive' } } : {}),
        AND: [
          ...(mine ? [] : [{ OR: this.visibilityWhere(viewerId) }]),
          ...cursorClause,
        ],
      },
      take: take + 1,
      orderBy: [{ startsAt: desc ? 'desc' : 'asc' }, { id: desc ? 'desc' : 'asc' }],
      include: this.hostInclude(),
    })
    const hasMore = events.length > take
    const items = hasMore ? events.slice(0, take) : events
    const going = await this.goingFlags(items.map((e) => e.id), viewerId)
    return {
      data: items.map((e) => this.map(e, going.has(e.id))),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.startsAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  private static haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
    const R = 6371
    const dLat = ((bLat - aLat) * Math.PI) / 180
    const dLng = ((bLng - aLng) * Math.PI) / 180
    const s = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(s))
  }

  /** Upcoming events with coordinates, sorted by distance from the viewer. */
  private async nearby(
    viewerId: string | undefined,
    cursor: string | null,
    take: number,
    lat: number,
    lng: number,
    filters: { category?: string; isFree?: boolean; q?: string },
  ): Promise<EventPage> {
    const offset = cursor ? Math.max(0, parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10) || 0) : 0
    const pool = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        startsAt: { gte: new Date() },
        latitude: { not: null },
        longitude: { not: null },
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.isFree !== undefined ? { isFree: filters.isFree } : {}),
        ...(filters.q ? { title: { contains: filters.q, mode: 'insensitive' } } : {}),
        AND: [{ OR: this.visibilityWhere(viewerId) }],
      },
      take: 200,
      orderBy: [{ startsAt: 'asc' }],
      include: this.hostInclude(),
    })
    const withDist = pool
      .map((e) => ({ e, d: EventsService.haversineKm(lat, lng, e.latitude!, e.longitude!) }))
      .sort((a, b) => a.d - b.d)
    const slice = withDist.slice(offset, offset + take)
    const hasMore = offset + take < withDist.length
    const going = await this.goingFlags(slice.map((s) => s.e.id), viewerId)
    return {
      data: slice.map((s) => this.map(s.e, going.has(s.e.id), Math.round(s.d * 10) / 10)),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }
  }

  /** Attendees (going + interested) with profiles — for the event detail/host. */
  async getAttendees(eventId: string, viewerId?: string): Promise<{
    going: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }[]
    interested: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }[]
  }> {
    // Reuse get() so followers-only access is enforced before listing attendees.
    await this.get(eventId, viewerId)
    const rows = await this.prisma.eventRsvp.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    const toItem = (u: EventRow['host']) => ({
      id: u.id, username: u.username, displayName: u.displayName,
      avatarUrl: u.avatarUrl, isVerified: u.verificationTier === 'professional',
    })
    return {
      going: rows.filter((r) => r.status === 'going').map((r) => toItem(r.user)),
      interested: rows.filter((r) => r.status === 'interested').map((r) => toItem(r.user)),
    }
  }

  /** Update an event — host only. */
  async update(id: string, userId: string, input: UpdateEventInput): Promise<EventResponse> {
    const existing = await this.prisma.event.findUnique({ where: { id }, select: { hostId: true, isDeleted: true } })
    if (!existing || existing.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (existing.hostId !== userId) throw new ForbiddenException({ code: 'NOT_HOST', message: 'Only the host can edit this event' })

    const data: Prisma.EventUpdateInput = {}
    if (input.title !== undefined) data.title = input.title
    if (input.description !== undefined) data.description = input.description
    if (input.location !== undefined) data.location = input.location
    if (input.venueName !== undefined) data.venueName = input.venueName
    if (input.visibility !== undefined) data.visibility = input.visibility
    if (input.isOnline !== undefined) data.isOnline = input.isOnline
    if (input.coverUrl !== undefined) data.coverUrl = input.coverUrl
    if (input.videoUrl !== undefined) data.videoUrl = input.videoUrl
    if (input.category !== undefined) data.category = input.category
    if (input.isFree !== undefined) data.isFree = input.isFree
    if (input.price !== undefined) data.price = input.price
    if (input.bookingUrl !== undefined) data.bookingUrl = input.bookingUrl
    if (input.capacity !== undefined) data.capacity = input.capacity
    if (input.latitude !== undefined) data.latitude = input.latitude
    if (input.longitude !== undefined) data.longitude = input.longitude
    if (input.startsAt !== undefined) data.startsAt = new Date(input.startsAt)
    if (input.endsAt !== undefined) data.endsAt = input.endsAt ? new Date(input.endsAt) : null

    const updated = await this.prisma.event.update({ where: { id }, data, include: this.hostInclude() })
    const going = await this.goingFlags([id], userId)
    return this.map(updated, going.has(id))
  }

  async get(id: string, viewerId?: string): Promise<EventResponse> {
    const e = await this.prisma.event.findUnique({ where: { id }, include: this.hostInclude() })
    if (!e || e.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    // Followers-only events are visible only to the host and their active followers.
    if (e.visibility === 'followers' && e.hostId !== viewerId) {
      const follows = viewerId
        ? await this.prisma.follow.findFirst({
            where: { followerId: viewerId, followingId: e.hostId, status: 'active' },
            select: { followerId: true },
          })
        : null
      if (!follows) throw new ForbiddenException({ code: 'EVENT_PRIVATE', message: 'This event is only visible to the host’s followers' })
    }
    const going = await this.goingFlags([e.id], viewerId)
    return this.map(e, going.has(e.id))
  }

  async create(hostId: string, input: CreateEventInput): Promise<EventResponse> {
    const event = await this.prisma.$transaction(async (tx) => {
      const created = await tx.event.create({
        data: {
          hostId, title: input.title, startsAt: new Date(input.startsAt),
          isOnline: input.isOnline ?? false, goingCount: 1,
          isFree: input.isFree ?? true,
          visibility: input.visibility ?? 'public',
          ...(input.description ? { description: input.description } : {}),
          ...(input.location ? { location: input.location } : {}),
          ...(input.venueName ? { venueName: input.venueName } : {}),
          ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
          ...(input.videoUrl ? { videoUrl: input.videoUrl } : {}),
          ...(input.category ? { category: input.category } : {}),
          ...(input.price ? { price: input.price } : {}),
          ...(input.bookingUrl ? { bookingUrl: input.bookingUrl } : {}),
          ...(input.capacity ? { capacity: input.capacity } : {}),
          ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
          ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
          ...(input.endsAt ? { endsAt: new Date(input.endsAt) } : {}),
        },
        include: this.hostInclude(),
      })
      // Host auto-RSVPs as going
      await tx.eventRsvp.create({ data: { eventId: created.id, userId: hostId, status: 'going' } })
      return created
    })
    return this.map(event, true)
  }

  async rsvp(eventId: string, userId: string, input: RsvpInput): Promise<{ going: boolean; goingCount: number }> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId }, select: { id: true, isDeleted: true, capacity: true } })
    if (!event || event.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    const status = input.status ?? 'going'

    // Capacity gate — block a new/returning "going" RSVP when the event is full.
    const assertNotFull = async (tx: Prisma.TransactionClient): Promise<void> => {
      if (event.capacity === null) return
      const e = await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
      if ((e?.goingCount ?? 0) >= event.capacity) {
        throw new ConflictException({ code: 'EVENT_FULL', message: 'This event is full' })
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.eventRsvp.findUnique({ where: { eventId_userId: { eventId, userId } } })
      if (!existing) {
        if (status === 'going') await assertNotFull(tx)
        await tx.eventRsvp.create({ data: { eventId, userId, status } })
        if (status === 'going') {
          const e = await tx.event.update({ where: { id: eventId }, data: { goingCount: { increment: 1 } }, select: { goingCount: true } })
          return { going: true, goingCount: e.goingCount }
        }
        const e = await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
        return { going: false, goingCount: e?.goingCount ?? 0 }
      }
      // Toggle status
      const wasGoing = existing.status === 'going'
      const nowGoing = status === 'going'
      if (!wasGoing && nowGoing) await assertNotFull(tx)
      await tx.eventRsvp.update({ where: { eventId_userId: { eventId, userId } }, data: { status } })
      let delta = 0
      if (wasGoing && !nowGoing) delta = -1
      else if (!wasGoing && nowGoing) delta = 1
      const e = delta
        ? await tx.event.update({ where: { id: eventId }, data: { goingCount: { increment: delta } }, select: { goingCount: true } })
        : await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
      return { going: nowGoing, goingCount: e?.goingCount ?? 0 }
    })
  }

  async cancelRsvp(eventId: string, userId: string): Promise<{ going: boolean; goingCount: number }> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.eventRsvp.findUnique({ where: { eventId_userId: { eventId, userId } } })
      if (!existing) {
        const e = await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
        return { going: false, goingCount: e?.goingCount ?? 0 }
      }
      await tx.eventRsvp.delete({ where: { eventId_userId: { eventId, userId } } })
      const e = existing.status === 'going'
        ? await tx.event.update({ where: { id: eventId }, data: { goingCount: { decrement: 1 } }, select: { goingCount: true } })
        : await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
      return { going: false, goingCount: e?.goingCount ?? 0 }
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    const e = await this.prisma.event.findUnique({ where: { id }, select: { hostId: true } })
    if (!e) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (e.hostId !== userId) throw new ForbiddenException({ code: 'NOT_HOST', message: 'Only the host can delete this event' })
    await this.prisma.event.update({ where: { id }, data: { isDeleted: true } })
  }
}
