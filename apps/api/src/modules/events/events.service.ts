import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { normalizeTags } from '../common/utils/tags'
import { ProfanityService } from '../common/moderation/profanity.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { AffinityService, AFFINITY_WEIGHTS } from '../personalization/affinity.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateEventInput, UpdateEventInput, RsvpInput, ShareLinkInput } from './events.schemas'

export interface EventResponse {
  id: string
  host: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  description: string | null
  location: string | null
  venueName: string | null
  visibility: string
  inviteOnly: boolean
  shareToken: string | null
  shareLinkExtendsInvites: boolean
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
  tags: string[]
  viewerGoing: boolean
  viewerInvited: boolean
  /** Set when a community hosts this event. */
  community: { id: string; slug: string; name: string } | null
}

export interface InviteeItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  status: string
  invitedAt: string
}

export interface EventPage {
  data: EventResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type EventRow = Prisma.EventGetPayload<{
  include: {
    host: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } }
    community: { select: { id: true; slug: true; name: true } }
  }
}>

const MAX = 30

/**
 * How many attendees of each kind an event page lists.
 *
 * Generous for a list a person actually reads, and a ceiling on what one popular
 * event can make the server join and serialise. The counts displayed come from the
 * event row, not from the length of these arrays.
 */
const ATTENDEES_SHOWN = 500

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
    private readonly profanity: ProfanityService,
    private readonly affinity: AffinityService,
  ) {}

  /**
   * Fan a notification out to a set of members, skipping the actor.
   *
   * Every call site is fire-and-forget (`void`): an event action must not fail
   * because a notification could not be queued, and the queue service already
   * falls back to an inline write before giving up.
   */
  private async notifyMany(
    userIds: string[],
    actorId: string,
    payload: { type: string; title: string; body: string; data: Record<string, unknown> },
  ): Promise<void> {
    const recipients = [...new Set(userIds)].filter((id) => id !== actorId)
    for (const userId of recipients) {
      await this.notifications.enqueue({ userId, ...payload })
    }
  }

  /** Display name for notification copy — falls back rather than throwing. */
  private async actorName(userId: string): Promise<string> {
    const p = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { displayName: true },
    })
    return p?.displayName ?? 'Someone'
  }

  /**
   * Feed an RSVP into the interest model.
   *
   * Never throws and never blocks the RSVP — a ranking signal is not worth
   * failing a user action over.
   */
  private async recordRsvpInterest(eventId: string, userId: string): Promise<void> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: { category: true, hostId: true },
      })
      if (!event) return
      if (event.category) {
        await this.affinity.recordInterest(userId, [event.category], AFFINITY_WEIGHTS.eventRsvp)
      }
      // Attending someone's event is also a signal about them.
      await this.affinity.recordAuthor(userId, event.hostId, AFFINITY_WEIGHTS.eventRsvp)
    } catch {
      // Deliberately silent: AffinityService already logs its own failures.
    }
  }

  /**
   * Only a community's owner or admin may host an event in its name.
   *
   * Moderators are excluded on purpose: muting a member and speaking for the
   * community in public are different levels of authority.
   */
  private async assertCanHostForCommunity(userId: string, communityId: string): Promise<void> {
    const membership = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
      select: { role: true, status: true },
    })
    if (membership?.status !== 'active' || !['owner', 'admin'].includes(membership.role)) {
      throw new ForbiddenException({
        code: 'NOT_COMMUNITY_ADMIN',
        message: 'Only a community owner or admin can host an event for it',
      })
    }
  }

  /** Everyone who RSVP'd, so an update or cancellation reaches them. */
  private async attendeeIds(eventId: string): Promise<string[]> {
    const rows = await this.prisma.eventRsvp.findMany({
      where: { eventId },
      select: { userId: true },
    })
    return rows.map((r) => r.userId)
  }

  private hostInclude() {
    return {
      host: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      community: { select: { id: true, slug: true, name: true } },
    }
  }

  private map(e: EventRow, going: boolean, distanceKm: number | null = null, invited = false): EventResponse {
    return {
      id: e.id,
      host: {
        id: e.host.id, username: e.host.username, displayName: e.host.displayName,
        avatarUrl: e.host.avatarUrl, isVerified: e.host.verificationTier === 'professional',
      },
      title: e.title, description: e.description, location: e.location, venueName: e.venueName,
      visibility: e.visibility,
      inviteOnly: e.inviteOnly,
      shareToken: e.shareToken,
      shareLinkExtendsInvites: e.shareLinkExtendsInvites,
      isOnline: e.isOnline, coverUrl: e.coverUrl, videoUrl: e.videoUrl,
      category: e.category, isFree: e.isFree, price: e.price, bookingUrl: e.bookingUrl,
      capacity: e.capacity,
      seatsLeft: e.capacity !== null ? Math.max(0, e.capacity - e.goingCount) : null,
      latitude: e.latitude, longitude: e.longitude, distanceKm,
      startsAt: e.startsAt.toISOString(), endsAt: e.endsAt ? e.endsAt.toISOString() : null,
      goingCount: e.goingCount, tags: e.tags, viewerGoing: going, viewerInvited: invited,
      community: e.community ? { id: e.community.id, slug: e.community.slug, name: e.community.name } : null,
    }
  }

  /** OR-conditions restricting which events a viewer may see. */
  private visibilityWhere(viewerId?: string): Prisma.EventWhereInput[] {
    if (!viewerId) return [{ inviteOnly: false, visibility: 'public' }]
    return [
      { inviteOnly: false, visibility: 'public' },
      { hostId: viewerId }, // own events, any visibility
      { inviteOnly: false, visibility: 'followers', host: { followsAsFollowing: { some: { followerId: viewerId, status: 'active' } } } },
      // Invite-only events: visible to the host or people with an active
      // (non-declined) invite — declined invites leave the viewer's feed/list.
      { inviteOnly: true, invites: { some: { userId: viewerId, status: { not: 'declined' } } } },
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

  /** Set of event IDs where the viewer holds an invite row. */
  private async invitedFlags(eventIds: string[], viewerId?: string): Promise<Set<string>> {
    if (!viewerId || eventIds.length === 0) return new Set()
    const rows = await this.prisma.eventInvite.findMany({
      where: { userId: viewerId, eventId: { in: eventIds }, status: { not: 'declined' } },
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
    filters: { category?: string; isFree?: boolean; q?: string; mine?: boolean; past?: boolean; nearLat?: number; nearLng?: number; communityId?: string; hostId?: string; tag?: string } = {},
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
        ...(filters.communityId ? { communityId: filters.communityId } : {}),
        // Events hosted by one person — powers the Events tab on a profile.
        // The visibility OR-gate below still applies, so a stranger sees only
        // what they were already entitled to see.
        ...(filters.hostId ? { hostId: filters.hostId } : {}),
        ...(filters.tag ? { tags: { has: filters.tag } } : {}),
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
    const [going, invited] = await Promise.all([
      this.goingFlags(items.map((e) => e.id), viewerId),
      this.invitedFlags(items.map((e) => e.id), viewerId),
    ])
    return {
      data: items.map((e) => this.map(e, going.has(e.id), null, invited.has(e.id))),
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
    const [going, invited] = await Promise.all([
      this.goingFlags(slice.map((s) => s.e.id), viewerId),
      this.invitedFlags(slice.map((s) => s.e.id), viewerId),
    ])
    return {
      data: slice.map((s) => this.map(s.e, going.has(s.e.id), Math.round(s.d * 10) / 10, invited.has(s.e.id))),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }
  }

  /** Attendees (going + interested) with profiles — for the event detail/host. */
  async getAttendees(eventId: string, viewerId?: string, shareToken?: string): Promise<{
    going: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }[]
    interested: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }[]
  }> {
    // Reuse get() so followers-only access is enforced before listing attendees.
    await this.get(eventId, viewerId, shareToken)
    /*
     * Every RSVP for the event used to load, each with a join to its user. A
     * hundred-person event is nothing; a popular one is thousands of rows joined
     * and serialised on every view of the page.
     *
     * Capped per status rather than across both: one shared limit would let a
     * few thousand "going" crowd out the "interested" list entirely, since the
     * cheapest ordering fills up before reaching them. The true totals are on the
     * event itself (goingCount), so the numbers shown do not depend on this.
     */
    const attendeeRows = (status: 'going' | 'interested') =>
      this.prisma.eventRsvp.findMany({
        where: { eventId, status },
        orderBy: { createdAt: 'asc' },
        take: ATTENDEES_SHOWN,
        include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
      })

    const [goingRows, interestedRows] = await Promise.all([
      attendeeRows('going'),
      attendeeRows('interested'),
    ])

    const toItem = (u: EventRow['host']) => ({
      id: u.id, username: u.username, displayName: u.displayName,
      avatarUrl: u.avatarUrl, isVerified: u.verificationTier === 'professional',
    })
    return {
      going: goingRows.map((r) => toItem(r.user)),
      interested: interestedRows.map((r) => toItem(r.user)),
    }
  }

  /** Update an event — host only. */
  async update(id: string, userId: string, input: UpdateEventInput): Promise<EventResponse> {
    this.profanity.assertCleanFields(
      { title: input.title, description: input.description, venueName: input.venueName, location: input.location },
      { actorId: userId, entityType: 'event' },
    )
    const existing = await this.prisma.event.findUnique({
      where: { id },
      select: { hostId: true, isDeleted: true, inviteOnly: true },
    })
    if (!existing || existing.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (existing.hostId !== userId) throw new ForbiddenException({ code: 'NOT_HOST', message: 'Only the host can edit this event' })

    const data: Prisma.EventUpdateInput = {}
    if (input.tags !== undefined) data.tags = normalizeTags(input.tags)
    if (input.title !== undefined) data.title = input.title
    if (input.description !== undefined) data.description = input.description
    if (input.location !== undefined) data.location = input.location
    if (input.venueName !== undefined) data.venueName = input.venueName
    if (input.visibility !== undefined) data.visibility = input.visibility
    if (input.inviteOnly !== undefined) data.inviteOnly = input.inviteOnly
    if (input.shareLinkExtendsInvites !== undefined) data.shareLinkExtendsInvites = input.shareLinkExtendsInvites
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

    const updated = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.update({ where: { id }, data, include: this.hostInclude() })
      const isInviteOnly = existing.inviteOnly || input.inviteOnly === true
      // Turning invite-only ON: auto-invite current attendees so nobody who
      // already RSVP'd gets locked out by the new privacy gate.
      if (input.inviteOnly === true && !existing.inviteOnly) {
        const attendees = await tx.eventRsvp.findMany({
          where: { eventId: id },
          select: { userId: true },
        })
        const unique = [...new Set(attendees.map((a) => a.userId))].filter((uid) => uid !== userId)
        if (unique.length > 0) {
          await tx.eventInvite.createMany({
            data: unique.map((inviteeId) => ({ eventId: id, userId: inviteeId, invitedBy: userId })),
            skipDuplicates: true,
          })
        }
      }
      // Add newly-picked invitees from the edit form (host excluded, deduped).
      // Re-picking someone who declined re-invites them.
      if (isInviteOnly && input.invitees?.length) {
        const unique = [...new Set(input.invitees)].filter((uid) => uid !== userId)
        if (unique.length > 0) {
          await tx.eventInvite.updateMany({
            where: { eventId: id, userId: { in: unique }, status: 'declined' },
            data: { status: 'invited' },
          })
          await tx.eventInvite.createMany({
            data: unique.map((inviteeId) => ({ eventId: id, userId: inviteeId, invitedBy: userId })),
            skipDuplicates: true,
          })
        }
      }
      return event
    })

    // New invitees picked in the edit form get the same notification as an
    // invite made from the manage-invites modal.
    if ((existing.inviteOnly || input.inviteOnly === true) && input.invitees?.length) {
      void this.notifyInvitees(
        id,
        userId,
        [...new Set(input.invitees)].filter((uid) => uid !== userId),
      )
    }

    // Only a moved date or a changed venue is worth interrupting someone for —
    // a tweaked description is not. Anything else stays silent on purpose.
    const timeChanged = input.startsAt !== undefined
    const placeChanged = input.location !== undefined || input.venueName !== undefined || input.isOnline !== undefined
    if (timeChanged || placeChanged) {
      void this.notifyEventChanged(id, userId, updated.title, timeChanged)
    }

    const [going, invited] = await Promise.all([
      this.goingFlags([id], userId),
      this.invitedFlags([id], userId),
    ])
    return this.map(updated, going.has(id), null, invited.has(id))
  }

  private async notifyEventChanged(
    eventId: string,
    hostId: string,
    title: string,
    timeChanged: boolean,
  ): Promise<void> {
    const attendees = await this.attendeeIds(eventId)
    await this.notifyMany(attendees, hostId, {
      type: 'event_updated',
      title: timeChanged ? 'Event time changed' : 'Event details changed',
      body: timeChanged
        ? `${title} has been moved — check the new time`
        : `${title} has a new location`,
      data: { eventId, actorId: hostId },
    })
  }

  async get(id: string, viewerId?: string, shareToken?: string): Promise<EventResponse> {
    const e = await this.prisma.event.findUnique({ where: { id }, include: this.hostInclude() })
    if (!e || e.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    // Followers-only events are visible only to the host and their active followers.
    // Invite-only events skip this — the stricter invite/token gate below governs,
    // otherwise a share-link holder who doesn't follow the host would get blocked.
    if (!e.inviteOnly && e.visibility === 'followers' && e.hostId !== viewerId) {
      const follows = viewerId
        ? await this.prisma.follow.findFirst({
            where: { followerId: viewerId, followingId: e.hostId, status: 'active' },
            select: { followerId: true },
          })
        : null
      if (!follows) throw new ForbiddenException({ code: 'EVENT_PRIVATE', message: 'This event is only visible to the host’s followers' })
    }
    // Invite-only events: host, active (non-declined) invitees, and share-link holders.
    if (e.inviteOnly && e.hostId !== viewerId) {
      const invited = viewerId
        ? await this.prisma.eventInvite.findUnique({
            where: { eventId_userId: { eventId: e.id, userId: viewerId } },
            select: { userId: true, status: true },
          })
        : null
      const viaLink = !!shareToken && e.shareToken !== null && shareToken === e.shareToken
      if ((!invited || invited.status === 'declined') && !viaLink) {
        throw new ForbiddenException({ code: 'EVENT_NOT_INVITED', message: 'Only invited people can see this event' })
      }
    }
    const [going, invited] = await Promise.all([
      this.goingFlags([e.id], viewerId),
      this.invitedFlags([e.id], viewerId),
    ])
    return this.map(e, going.has(e.id), null, invited.has(e.id))
  }

  async create(hostId: string, input: CreateEventInput): Promise<EventResponse> {
    // Free-text screening, same gate posts and comments go through.
    this.profanity.assertCleanFields(
      { title: input.title, description: input.description, venueName: input.venueName, location: input.location },
      { actorId: hostId, entityType: 'event' },
    )

    // Hosting for a community is a claim about authority, so it is verified
    // rather than trusted: without this anyone could attach their event to any
    // community and have it appear on that community's page.
    if (input.communityId) await this.assertCanHostForCommunity(hostId, input.communityId)
    const event = await this.prisma.$transaction(async (tx) => {
      const created = await tx.event.create({
        data: {
          hostId, title: input.title, startsAt: new Date(input.startsAt),
          isOnline: input.isOnline ?? false, goingCount: 1,
          isFree: input.isFree ?? true,
          visibility: input.visibility ?? 'public',
          inviteOnly: input.inviteOnly ?? false,
          ...(input.tags ? { tags: normalizeTags(input.tags) } : {}),
          ...(input.communityId ? { communityId: input.communityId } : {}),
          shareToken: randomUUID(),
          shareLinkExtendsInvites: input.shareLinkExtendsInvites ?? false,
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
      // Seed initial invites for invite-only events (host excluded, deduped).
      if (input.inviteOnly && input.invitees?.length) {
        const unique = [...new Set(input.invitees)].filter((id) => id !== hostId)
        if (unique.length > 0) {
          await tx.eventInvite.createMany({
            data: unique.map((userId) => ({ eventId: created.id, userId, invitedBy: hostId })),
            skipDuplicates: true,
          })
        }
      }
      return created
    })

    if (input.inviteOnly && input.invitees?.length) {
      void this.notifyInvitees(
        event.id,
        hostId,
        [...new Set(input.invitees)].filter((id) => id !== hostId),
      )
    }
    return this.map(event, true, null, false)
  }

  async rsvp(eventId: string, userId: string, input: RsvpInput, shareToken?: string): Promise<{ going: boolean; goingCount: number }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, isDeleted: true, capacity: true, hostId: true, inviteOnly: true, shareToken: true },
    })
    if (!event || event.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    // Invite gate — active (non-declined) invitees and share-link holders may join.
    if (event.inviteOnly && event.hostId !== userId) {
      const invited = await this.prisma.eventInvite.findUnique({
        where: { eventId_userId: { eventId, userId } },
        select: { userId: true, status: true },
      })
      const viaLink = !!shareToken && event.shareToken !== null && shareToken === event.shareToken
      if ((!invited || invited.status === 'declined') && !viaLink) {
        throw new ForbiddenException({ code: 'EVENT_NOT_INVITED', message: 'Only invited people can join this event' })
      }
    }
    const status = input.status ?? 'going'

    // Capacity gate — block a new/returning "going" RSVP when the event is full.
    const assertNotFull = async (tx: Prisma.TransactionClient): Promise<void> => {
      if (event.capacity === null) return
      const e = await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
      if ((e?.goingCount ?? 0) >= event.capacity) {
        throw new ConflictException({ code: 'EVENT_FULL', message: 'This event is full' })
      }
    }

    // Turning up somewhere is a stronger statement of interest than a like, so
    // the event's category and title words feed the ranking engine.
    if (status === 'going') void this.recordRsvpInterest(eventId, userId)

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
    const e = await this.prisma.event.findUnique({ where: { id }, select: { hostId: true, title: true } })
    if (!e) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (e.hostId !== userId) throw new ForbiddenException({ code: 'NOT_HOST', message: 'Only the host can delete this event' })

    // Read attendees BEFORE the soft delete — after it the event is invisible to
    // the list queries, but the RSVP rows are what we need and they survive.
    const attendees = await this.attendeeIds(id)
    await this.prisma.event.update({ where: { id }, data: { isDeleted: true } })

    // Someone who planned their day around this needs to hear about it.
    void this.notifyMany(attendees, userId, {
      type: 'event_cancelled',
      title: 'Event cancelled',
      body: `${e.title} has been cancelled by the host`,
      data: { eventId: id, actorId: userId },
    })
  }

  // ── INVITE-ONLY ACCESS ───────────────────────────────────────────────────────

  /** Resolve the event + assert the caller is the host. */
  private async assertHost(eventId: string, userId: string): Promise<{ hostId: string; inviteOnly: boolean }> {
    const e = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { hostId: true, isDeleted: true, inviteOnly: true },
    })
    if (!e || e.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (e.hostId !== userId) throw new ForbiddenException({ code: 'NOT_HOST', message: 'Only the host can manage invites' })
    return { hostId: e.hostId, inviteOnly: e.inviteOnly }
  }

  /**
   * POST /events/:id/invites — add invitees (host only). Requires an
   * invite-only event. Unknown/inactive users are silently dropped.
   */
  async invite(eventId: string, userId: string, userIds: string[]): Promise<{ invited: number }> {
    const event = await this.assertHost(eventId, userId)
    if (!event.inviteOnly) {
      throw new BadRequestException({ code: 'NOT_INVITE_ONLY', message: 'Only invite-only events support invites' })
    }
    const unique = [...new Set(userIds)].filter((id) => id !== userId)
    if (unique.length === 0) return { invited: 0 }

    const existing = await this.prisma.profile.findMany({
      where: { id: { in: unique }, state: 'active' },
      select: { id: true },
    })
    const validIds = existing.map((p) => p.id)
    if (validIds.length === 0) return { invited: 0 }

    // Re-inviting a user who previously declined flips them back to invited.
    await this.prisma.eventInvite.updateMany({
      where: { eventId, userId: { in: validIds }, status: 'declined' },
      data: { status: 'invited' },
    })
    await this.prisma.eventInvite.createMany({
      data: validIds.map((inviteeId) => ({ eventId, userId: inviteeId, invitedBy: userId })),
      skipDuplicates: true,
    })

    void this.notifyInvitees(eventId, userId, validIds)
    return { invited: validIds.length }
  }

  /**
   * Tell people they've been invited.
   *
   * Without this an invite-only event was silent — the only way to discover you
   * were invited was to open the events tab and notice a new entry.
   */
  private async notifyInvitees(eventId: string, hostId: string, inviteeIds: string[]): Promise<void> {
    if (inviteeIds.length === 0) return
    const [event, host] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId }, select: { title: true } }),
      this.actorName(hostId),
    ])
    if (!event) return
    await this.notifyMany(inviteeIds, hostId, {
      type: 'event_invite',
      title: 'Event invitation',
      body: `${host} invited you to ${event.title}`,
      data: { eventId, actorId: hostId },
    })
  }

  /** GET /events/:id/invites — list invitees (host only). */
  async listInvites(eventId: string, userId: string): Promise<InviteeItem[]> {
    await this.assertHost(eventId, userId)
    const rows = await this.prisma.eventInvite.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      },
    })
    return rows.map((r) => ({
      id: r.user.id,
      username: r.user.username,
      displayName: r.user.displayName,
      avatarUrl: r.user.avatarUrl,
      isVerified: r.user.verificationTier === 'professional',
      status: r.status,
      invitedAt: r.createdAt.toISOString(),
    }))
  }

  /**
   * POST /events/:id/join — join via a share link.
   * Valid token holders always get access (get/rsvp also accept ?share=token).
   * When the host has share_link_extends_invites ON and the event is
   * invite-only, the joiner is added to the invite list so the host can
   * manage/revoke them. Returns the event so the client can render immediately.
   */
  async join(eventId: string, userId: string, token: string): Promise<EventResponse> {
    const e = await this.prisma.event.findUnique({ where: { id: eventId }, include: this.hostInclude() })
    if (!e || e.isDeleted) throw new NotFoundException({ code: 'EVENT_NOT_FOUND', message: 'Event not found' })
    if (!e.shareToken || token !== e.shareToken) {
      throw new BadRequestException({ code: 'INVALID_SHARE_LINK', message: 'This share link is invalid or has been reset' })
    }
    // Host is always exempt; invite-only + extends-invites → add to invite list.
    // A declined user joining again via the link re-accepts (flips to invited).
    if (e.inviteOnly && e.hostId !== userId && e.shareLinkExtendsInvites) {
      await this.prisma.eventInvite.updateMany({
        where: { eventId, userId, status: 'declined' },
        data: { status: 'invited' },
      })
      await this.prisma.eventInvite.createMany({
        data: [{ eventId, userId, invitedBy: e.hostId }],
        skipDuplicates: true,
      })
    }
    const [going, invited] = await Promise.all([
      this.goingFlags([e.id], userId),
      this.invitedFlags([e.id], userId),
    ])
    return this.map(e, going.has(e.id), null, invited.has(e.id))
  }

  /**
   * POST /events/:id/invites/decline — an invited guest declines the invite.
   * Marks the invite 'declined' (removing the event from their feed/list and
   * revoking gate access) and drops any RSVP they held so goingCount stays
   * accurate. Idempotent: an already-declined invitee still succeeds.
   */
  async decline(eventId: string, userId: string): Promise<{ declined: boolean; goingCount: number }> {
    const result = await this.declineInTransaction(eventId, userId)

    // The host is planning numbers; a decline is information they need.
    void this.notifyDecline(eventId, userId)
    return result
  }

  private async notifyDecline(eventId: string, userId: string): Promise<void> {
    const [event, guest] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId }, select: { hostId: true, title: true } }),
      this.actorName(userId),
    ])
    if (!event) return
    await this.notifyMany([event.hostId], userId, {
      type: 'event_invite_declined',
      title: 'Invitation declined',
      body: `${guest} can't make ${event.title}`,
      data: { eventId, actorId: userId },
    })
  }

  private async declineInTransaction(eventId: string, userId: string): Promise<{ declined: boolean; goingCount: number }> {
    return this.prisma.$transaction(async (tx) => {
      const invite = await tx.eventInvite.findUnique({
        where: { eventId_userId: { eventId, userId } },
        select: { status: true },
      })
      // Only an actual invitee can decline — otherwise this endpoint would
      // silently drop RSVPs on public events where the caller was never invited.
      if (!invite) {
        throw new NotFoundException({ code: 'NOT_INVITED', message: 'You are not invited to this event' })
      }
      if (invite.status !== 'declined') {
        await tx.eventInvite.update({
          where: { eventId_userId: { eventId, userId } },
          data: { status: 'declined' },
        })
      }
      // Dropping their RSVP keeps goingCount accurate (declining = not attending).
      const rsvp = await tx.eventRsvp.findUnique({ where: { eventId_userId: { eventId, userId } } })
      let goingCount = 0
      if (rsvp) {
        await tx.eventRsvp.delete({ where: { eventId_userId: { eventId, userId } } })
        const e = rsvp.status === 'going'
          ? await tx.event.update({ where: { id: eventId }, data: { goingCount: { decrement: 1 } }, select: { goingCount: true } })
          : await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
        goingCount = e?.goingCount ?? 0
      } else {
        const e = await tx.event.findUnique({ where: { id: eventId }, select: { goingCount: true } })
        goingCount = e?.goingCount ?? 0
      }
      return { declined: true, goingCount }
    })
  }

  /**
   * POST /events/:id/share-link — host-only share-link management.
   *  - extendsInvites: toggle whether link joiners are added to the invite list
   *  - reset: regenerate the token so previously shared links stop working
   */
  async updateShareLink(eventId: string, userId: string, input: ShareLinkInput): Promise<{ shareToken: string; shareLinkExtendsInvites: boolean }> {
    await this.assertHost(eventId, userId)
    const data: Prisma.EventUpdateInput = {}
    if (input.reset) data.shareToken = randomUUID()
    if (input.extendsInvites !== undefined) data.shareLinkExtendsInvites = input.extendsInvites
    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data,
      select: { shareToken: true, shareLinkExtendsInvites: true },
    })
    return { shareToken: updated.shareToken!, shareLinkExtendsInvites: updated.shareLinkExtendsInvites }
  }

  /** DELETE /events/:id/invites/:inviteeId — revoke an invite (host only). */
  async removeInvite(eventId: string, userId: string, inviteeId: string): Promise<void> {
    await this.assertHost(eventId, userId)
    // The host is never invited (they're exempt), so revoking themselves would
    // only delete their own auto-created "going" RSVP. No-op instead.
    if (inviteeId === userId) return
    // Revoking also removes any RSVP the invitee held, so goingCount stays
    // accurate and a revoked guest can't be silently counted as an attendee.
    await this.prisma.$transaction(async (tx) => {
      await tx.eventInvite.delete({
        where: { eventId_userId: { eventId, userId: inviteeId } },
      }).catch((err: { code?: string }) => {
        // Already gone — idempotent. Anything else must surface.
        if (err?.code !== 'P2025') throw err
      })
      const rsvp = await tx.eventRsvp.findUnique({
        where: { eventId_userId: { eventId, userId: inviteeId } },
      })
      if (rsvp) {
        await tx.eventRsvp.delete({ where: { eventId_userId: { eventId, userId: inviteeId } } })
        if (rsvp.status === 'going') {
          await tx.event.update({ where: { id: eventId }, data: { goingCount: { decrement: 1 } } })
        }
      }
    })
  }
}
