import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { normalizeTags } from '../common/utils/tags'
import { ProfanityService } from '../common/moderation/profanity.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateReportInput, UpdateReportInput, SightingInput } from './lost-found.schemas'

type Row = Prisma.LostFoundPostGetPayload<{
  include: {
    reporter: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } }
    pet: { select: { id: true; name: true; avatarUrl: true } }
  }
}>

export interface ReportResponse {
  id: string
  kind: string
  petName: string | null
  species: string
  breed: string | null
  age: string | null
  color: string | null
  sex: string | null
  size: string | null
  microchipId: string | null
  collar: string | null
  neutered: boolean | null
  vaccinated: boolean | null
  description: string | null
  lastSeenLocation: string | null
  lastSeenAt: string | null
  photoUrl: string | null
  photoUrls: string[]
  latitude: number | null
  longitude: number | null
  distanceKm: number | null
  contact: string | null
  reward: number | null
  status: string
  tags: string[]
  sightingsCount: number
  reporter: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  /** Set when the reporter linked their own pet profile — enables both-way navigation. */
  pet: { id: string; name: string; avatarUrl: string | null } | null
  createdAt: string
}

export interface ReportPage { data: ReportResponse[]; nextCursor: string | null; hasMore: boolean }

const MAX = 30

@Injectable()
export class LostFoundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
    private readonly profanity: ProfanityService,
  ) {}

  private include() {
    return {
      reporter: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      pet: { select: { id: true, name: true, avatarUrl: true } },
    }
  }

  private map(r: Row, distanceKm: number | null = null): ReportResponse {
    return {
      id: r.id, kind: r.kind, petName: r.petName, species: r.species, breed: r.breed,
      age: r.age, color: r.color, sex: r.sex, size: r.size, microchipId: r.microchipId,
      collar: r.collar, neutered: r.neutered, vaccinated: r.vaccinated,
      description: r.description, lastSeenLocation: r.lastSeenLocation,
      lastSeenAt: r.lastSeenAt ? r.lastSeenAt.toISOString().slice(0, 10) : null,
      photoUrl: r.photoUrl, photoUrls: r.photoUrls, latitude: r.latitude, longitude: r.longitude, distanceKm,
      contact: r.contact, reward: r.reward, status: r.status, tags: r.tags, sightingsCount: r.sightingsCount,
      reporter: {
        id: r.reporter.id, username: r.reporter.username, displayName: r.reporter.displayName,
        avatarUrl: r.reporter.avatarUrl, isVerified: r.reporter.verificationTier === 'professional',
      },
      pet: r.pet ? { id: r.pet.id, name: r.pet.name, avatarUrl: r.pet.avatarUrl } : null,
      createdAt: r.createdAt.toISOString(),
    }
  }

  private static haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
    const R = 6371
    const dLat = ((bLat - aLat) * Math.PI) / 180
    const dLng = ((bLng - aLng) * Math.PI) / 180
    const s = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(s))
  }

  async browse(
    filters: { kind?: string; status?: string; q?: string; species?: string; hasReward?: boolean; nearLat?: number; nearLng?: number; tag?: string },
    cursor: string | null,
    limit = 15,
  ): Promise<ReportPage> {
    const take = Math.min(limit, MAX)
    if (filters.nearLat !== undefined && filters.nearLng !== undefined) {
      return this.browseNearby(filters, cursor, take, filters.nearLat, filters.nearLng)
    }
    const decoded = cursor ? decodeCursor(cursor) : null
    const rows = await this.prisma.lostFoundPost.findMany({
      where: {
        isDeleted: false,
        ...(filters.kind ? { kind: filters.kind } : {}),
        ...(filters.status ? { status: filters.status } : { status: 'active' }),
        ...(filters.species ? { species: filters.species } : {}),
        ...(filters.hasReward ? { reward: { gt: 0 } } : {}),
        // Exact containment — normalised on write, so an index lookup.
        ...(filters.tag ? { tags: { has: filters.tag } } : {}),
        ...(filters.q
          ? { OR: [
              { petName: { contains: filters.q, mode: 'insensitive' } },
              { breed: { contains: filters.q, mode: 'insensitive' } },
              { lastSeenLocation: { contains: filters.q, mode: 'insensitive' } },
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

  /** Reports with coordinates, sorted by distance from the viewer. */
  private async browseNearby(
    filters: { kind?: string; status?: string; q?: string; species?: string; hasReward?: boolean },
    cursor: string | null,
    take: number,
    lat: number,
    lng: number,
  ): Promise<ReportPage> {
    const offset = cursor ? Math.max(0, parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10) || 0) : 0
    const pool = await this.prisma.lostFoundPost.findMany({
      where: {
        isDeleted: false,
        latitude: { not: null },
        longitude: { not: null },
        ...(filters.kind ? { kind: filters.kind } : {}),
        ...(filters.status ? { status: filters.status } : { status: 'active' }),
        ...(filters.species ? { species: filters.species } : {}),
        ...(filters.hasReward ? { reward: { gt: 0 } } : {}),
        ...(filters.q ? { OR: [
          { petName: { contains: filters.q, mode: 'insensitive' } },
          { breed: { contains: filters.q, mode: 'insensitive' } },
          { lastSeenLocation: { contains: filters.q, mode: 'insensitive' } },
        ] } : {}),
      },
      take: 200,
      orderBy: [{ createdAt: 'desc' }],
      include: this.include(),
    })
    const withDist = pool
      .map((r) => ({ r, d: LostFoundService.haversineKm(lat, lng, r.latitude!, r.longitude!) }))
      .sort((a, b) => a.d - b.d)
    const slice = withDist.slice(offset, offset + take)
    const hasMore = offset + take < withDist.length
    return {
      data: slice.map((s) => this.map(s.r, Math.round(s.d * 10) / 10)),
      nextCursor: hasMore ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore,
    }
  }

  /**
   * Possible matches for a report: opposite kind, same species, still active,
   * reported in the last 120 days. If the report has coordinates, results are
   * sorted by proximity and annotated with distance; otherwise most-recent.
   */
  async getMatches(id: string): Promise<ReportResponse[]> {
    const report = await this.prisma.lostFoundPost.findUnique({
      where: { id },
      select: { id: true, kind: true, species: true, latitude: true, longitude: true, isDeleted: true },
    })
    if (!report || report.isDeleted) throw new NotFoundException({ code: 'REPORT_NOT_FOUND', message: 'Report not found' })

    const since = new Date(Date.now() - 120 * 24 * 3_600_000)
    const candidates = await this.prisma.lostFoundPost.findMany({
      where: {
        isDeleted: false,
        status: 'active',
        id: { not: id },
        kind: report.kind === 'lost' ? 'found' : 'lost',
        species: report.species,
        createdAt: { gte: since },
      },
      take: 50,
      orderBy: [{ createdAt: 'desc' }],
      include: this.include(),
    })

    if (report.latitude !== null && report.longitude !== null) {
      return candidates
        .map((r) => ({
          r,
          d: r.latitude !== null && r.longitude !== null
            ? LostFoundService.haversineKm(report.latitude!, report.longitude!, r.latitude, r.longitude)
            : Number.POSITIVE_INFINITY,
        }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 8)
        .map((s) => this.map(s.r, Number.isFinite(s.d) ? Math.round(s.d * 10) / 10 : null))
    }
    return candidates.slice(0, 8).map((r) => this.map(r))
  }

  async get(id: string): Promise<ReportResponse> {
    const r = await this.prisma.lostFoundPost.findUnique({ where: { id }, include: this.include() })
    if (!r || r.isDeleted) throw new NotFoundException({ code: 'REPORT_NOT_FOUND', message: 'Report not found' })
    return this.map(r)
  }

  async create(reporterId: string, input: CreateReportInput): Promise<ReportResponse> {
    // Free-text screening, same gate posts and comments go through.
    this.profanity.assertCleanFields({ petName: input.petName, breed: input.breed, color: input.color, collar: input.collar, description: input.description, lastSeenLocation: input.lastSeenLocation }, { actorId: reporterId, entityType: 'lost_found_report' })

    // Reporting your own pet: fill anything the form left blank from the pet
    // profile, so a member in a panic doesn't have to remember the microchip
    // number. Ownership is checked — a pet id you don't own is simply dropped
    // rather than rejected, since the report itself is still worth filing.
    const linked = input.petId ? await this.loadOwnedPet(reporterId, input.petId) : null

    // What the form sent always wins; the pet profile only fills the gaps.
    const fromPet = <T>(supplied: T | undefined, fallback: T | null | undefined): T | undefined =>
      supplied !== undefined && supplied !== null ? supplied : (fallback ?? undefined)

    const petName = fromPet(input.petName, linked?.name)
    const breed = fromPet(input.breed, linked?.breed)
    const color = fromPet(input.color, linked?.color)
    const sex = fromPet(input.sex, linked?.sex)
    const microchipId = fromPet(input.microchipId, linked?.microchipId)
    const photoUrl = fromPet(input.photoUrl, linked?.avatarUrl)
    const neutered = fromPet(input.neutered, linked?.neutered)

    const r = await this.prisma.lostFoundPost.create({
      data: {
        reporterId,
        kind: input.kind,
        ...(input.tags ? { tags: normalizeTags(input.tags) } : {}),
        species: input.species || linked?.species || 'other',
        ...(linked ? { petId: linked.id } : {}),
        ...(petName ? { petName } : {}),
        ...(breed ? { breed } : {}),
        ...(input.age ? { age: input.age } : {}),
        ...(color ? { color } : {}),
        ...(sex ? { sex } : {}),
        ...(input.size ? { size: input.size } : {}),
        ...(microchipId ? { microchipId } : {}),
        ...(input.collar ? { collar: input.collar } : {}),
        ...(neutered !== undefined ? { neutered } : {}),
        ...(input.vaccinated !== undefined ? { vaccinated: input.vaccinated } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.lastSeenLocation ? { lastSeenLocation: input.lastSeenLocation } : {}),
        ...(input.lastSeenAt ? { lastSeenAt: new Date(input.lastSeenAt) } : {}),
        ...(photoUrl ? { photoUrl } : {}),
        ...(input.photoUrls ? { photoUrls: input.photoUrls } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.contact ? { contact: input.contact } : {}),
        ...(input.reward !== undefined ? { reward: input.reward } : {}),
      },
      include: this.include(),
    })
    return this.map(r)
  }

  /**
   * Open reports the owner has filed about one of their own pets.
   *
   * Scoped to the caller's pets so this cannot be used to discover whether
   * someone else's animal is missing.
   */
  async activeForPet(ownerId: string, petId: string): Promise<ReportResponse[]> {
    const pet = await this.loadOwnedPet(ownerId, petId)
    if (!pet) return []
    const rows = await this.prisma.lostFoundPost.findMany({
      where: { petId, isDeleted: false, status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: this.include(),
    })
    return rows.map((r) => this.map(r))
  }

  /**
   * The reporter's own pet, or null.
   *
   * Returns null rather than throwing for a pet that isn't theirs: the point of
   * the id is convenience, and refusing to file a missing-pet report over a bad
   * id would be the wrong trade. It also means the id can't be used to read
   * other people's pet details.
   */
  private async loadOwnedPet(ownerId: string, petId: string) {
    return this.prisma.pet.findFirst({
      where: { id: petId, ownerId },
      select: {
        id: true, name: true, species: true, breed: true, color: true,
        sex: true, microchipId: true, avatarUrl: true, neutered: true,
      },
    })
  }

  async update(id: string, userId: string, input: UpdateReportInput): Promise<ReportResponse> {
    // Free-text screening, same gate posts and comments go through.
    this.profanity.assertCleanFields({ petName: input.petName, breed: input.breed, color: input.color, collar: input.collar, description: input.description, lastSeenLocation: input.lastSeenLocation }, { actorId: userId, entityType: 'lost_found_report' })
    await this.assertOwner(id, userId)
    const r = await this.prisma.lostFoundPost.update({
      where: { id },
      data: {
        ...(input.petName !== undefined ? { petName: input.petName || null } : {}),
        ...(input.species !== undefined ? { species: input.species } : {}),
        ...(input.breed !== undefined ? { breed: input.breed || null } : {}),
        ...(input.age !== undefined ? { age: input.age || null } : {}),
        ...(input.color !== undefined ? { color: input.color || null } : {}),
        ...(input.sex !== undefined ? { sex: input.sex ?? null } : {}),
        ...(input.size !== undefined ? { size: input.size ?? null } : {}),
        ...(input.microchipId !== undefined ? { microchipId: input.microchipId || null } : {}),
        ...(input.collar !== undefined ? { collar: input.collar || null } : {}),
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.vaccinated !== undefined ? { vaccinated: input.vaccinated } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.lastSeenLocation !== undefined ? { lastSeenLocation: input.lastSeenLocation || null } : {}),
        ...(input.lastSeenAt !== undefined ? { lastSeenAt: input.lastSeenAt ? new Date(input.lastSeenAt) : null } : {}),
        ...(input.photoUrl !== undefined ? { photoUrl: input.photoUrl || null } : {}),
        ...(input.photoUrls !== undefined ? { photoUrls: input.photoUrls ?? [] } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.contact !== undefined ? { contact: input.contact || null } : {}),
        ...(input.reward !== undefined ? { reward: input.reward } : {}),
        ...(input.tags !== undefined ? { tags: normalizeTags(input.tags) } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.include(),
    })
    return this.map(r)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwner(id, userId)
    await this.prisma.lostFoundPost.update({ where: { id }, data: { isDeleted: true } })
  }

  private async assertOwner(id: string, userId: string): Promise<void> {
    const r = await this.prisma.lostFoundPost.findUnique({ where: { id }, select: { reporterId: true } })
    if (!r) throw new NotFoundException({ code: 'REPORT_NOT_FOUND', message: 'Report not found' })
    if (r.reporterId !== userId) throw new ForbiddenException({ code: 'NOT_REPORTER', message: 'You can only manage your own reports' })
  }

  // ── Sightings ────────────────────────────────────────────────────────────

  async addSighting(postId: string, reporterId: string, input: SightingInput): Promise<{ id: string }> {
    const post = await this.prisma.lostFoundPost.findUnique({
      where: { id: postId }, select: { id: true, isDeleted: true, reporterId: true, petName: true, species: true },
    })
    if (!post || post.isDeleted) throw new NotFoundException({ code: 'REPORT_NOT_FOUND', message: 'Report not found' })
    if (post.reporterId === reporterId) throw new BadRequestException({ code: 'OWN_REPORT', message: 'You cannot add a sighting to your own report' })

    const sighting = await this.prisma.$transaction(async (tx) => {
      const s = await tx.lostFoundSighting.create({
        data: {
          postId,
          reporterId,
          ...(input.message ? { message: input.message } : {}),
          ...(input.location ? { location: input.location } : {}),
          ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
          ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        },
      })
      await tx.lostFoundPost.update({ where: { id: postId }, data: { sightingsCount: { increment: 1 } } })
      return s
    })

    const reporter = await this.prisma.profile.findUnique({ where: { id: reporterId }, select: { displayName: true, username: true } })
    void this.notifications.enqueue({
      userId: post.reporterId,
      type: 'lost_found_sighting',
      title: 'New sighting reported',
      body: `${reporter?.displayName ?? 'Someone'} reported a sighting of ${post.petName ?? post.species}`,
      data: { postId, sightingBy: reporter?.username },
    })
    return { id: sighting.id }
  }

  async listSightings(postId: string): Promise<Array<{
    id: string; message: string | null; location: string | null; createdAt: string
    latitude: number | null; longitude: number | null; distanceKm: number | null
    reporter: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    const [post, sightings] = await Promise.all([
      this.prisma.lostFoundPost.findUnique({
        where: { id: postId },
        select: { latitude: true, longitude: true },
      }),
      this.prisma.lostFoundSighting.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' },
        include: { reporter: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
      }),
    ])

    // Distance from where the animal was last seen — the number that tells you
    // whether it is drifting in one direction or circling.
    const origin = post?.latitude !== null && post?.latitude !== undefined && post.longitude !== null
      ? { lat: post.latitude, lng: post.longitude }
      : null

    return sightings.map((s) => ({
      id: s.id, message: s.message, location: s.location, createdAt: s.createdAt.toISOString(),
      latitude: s.latitude, longitude: s.longitude,
      distanceKm: origin && s.latitude !== null && s.longitude !== null
        ? Math.round(LostFoundService.haversineKm(origin.lat, origin.lng, s.latitude, s.longitude) * 10) / 10
        : null,
      reporter: {
        id: s.reporter.id, username: s.reporter.username, displayName: s.reporter.displayName,
        avatarUrl: s.reporter.avatarUrl, isVerified: s.reporter.verificationTier === 'professional',
      },
    }))
  }
}
