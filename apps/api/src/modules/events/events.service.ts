import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateEventInput, RsvpInput } from './events.schemas'

export interface EventResponse {
  id: string
  host: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  description: string | null
  location: string | null
  isOnline: boolean
  coverUrl: string | null
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

  private map(e: EventRow, going: boolean): EventResponse {
    return {
      id: e.id,
      host: {
        id: e.host.id, username: e.host.username, displayName: e.host.displayName,
        avatarUrl: e.host.avatarUrl, isVerified: e.host.verificationTier === 'professional',
      },
      title: e.title, description: e.description, location: e.location,
      isOnline: e.isOnline, coverUrl: e.coverUrl,
      startsAt: e.startsAt.toISOString(), endsAt: e.endsAt ? e.endsAt.toISOString() : null,
      goingCount: e.goingCount, viewerGoing: going,
    }
  }

  private async goingFlags(eventIds: string[], viewerId?: string): Promise<Set<string>> {
    if (!viewerId || eventIds.length === 0) return new Set()
    const rows = await this.prisma.eventRsvp.findMany({
      where: { userId: viewerId, eventId: { in: eventIds } },
      select: { eventId: true },
    })
    return new Set(rows.map((r) => r.eventId))
  }

  /** Upcoming events (startsAt >= now), keyset paginated ascending. */
  async listUpcoming(viewerId: string | undefined, cursor: string | null, limit = 15): Promise<EventPage> {
    const take = Math.min(limit, MAX)
    const decoded = cursor ? decodeCursor(cursor) : null
    const events = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        startsAt: { gte: new Date() },
        ...(decoded
          ? {
              OR: [
                { startsAt: { gt: new Date(decoded.createdAt) } },
                { startsAt: new Date(decoded.createdAt), id: { gt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      take: take + 1,
      orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
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

  async get(id: string, viewerId?: string): Promise<EventResponse> {
    const e = await this.prisma.event.findUnique({ where: { id }, include: this.hostInclude() })
    if (!e || e.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    const going = await this.goingFlags([e.id], viewerId)
    return this.map(e, going.has(e.id))
  }

  async create(hostId: string, input: CreateEventInput): Promise<EventResponse> {
    const event = await this.prisma.$transaction(async (tx) => {
      const created = await tx.event.create({
        data: {
          hostId, title: input.title, startsAt: new Date(input.startsAt),
          isOnline: input.isOnline ?? false, goingCount: 1,
          ...(input.description ? { description: input.description } : {}),
          ...(input.location ? { location: input.location } : {}),
          ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
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
    const event = await this.prisma.event.findUnique({ where: { id: eventId }, select: { id: true, isDeleted: true } })
    if (!event || event.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    const status = input.status ?? 'going'

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.eventRsvp.findUnique({ where: { eventId_userId: { eventId, userId } } })
      if (!existing) {
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
