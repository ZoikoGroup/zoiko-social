import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateReportInput, UpdateReportInput, SightingInput } from './lost-found.schemas'

type Row = Prisma.LostFoundPostGetPayload<{
  include: { reporter: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
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
  sightingsCount: number
  reporter: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  createdAt: string
}

export interface ReportPage { data: ReportResponse[]; nextCursor: string | null; hasMore: boolean }

const MAX = 30

@Injectable()
export class LostFoundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private include() {
    return { reporter: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(r: Row, distanceKm: number | null = null): ReportResponse {
    return {
      id: r.id, kind: r.kind, petName: r.petName, species: r.species, breed: r.breed,
      age: r.age, color: r.color, sex: r.sex, size: r.size, microchipId: r.microchipId,
      collar: r.collar, neutered: r.neutered, vaccinated: r.vaccinated,
      description: r.description, lastSeenLocation: r.lastSeenLocation,
      lastSeenAt: r.lastSeenAt ? r.lastSeenAt.toISOString().slice(0, 10) : null,
      photoUrl: r.photoUrl, photoUrls: r.photoUrls, latitude: r.latitude, longitude: r.longitude, distanceKm,
      contact: r.contact, reward: r.reward, status: r.status, sightingsCount: r.sightingsCount,
      reporter: {
        id: r.reporter.id, username: r.reporter.username, displayName: r.reporter.displayName,
        avatarUrl: r.reporter.avatarUrl, isVerified: r.reporter.verificationTier === 'professional',
      },
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
    filters: { kind?: string; status?: string; q?: string; species?: string; hasReward?: boolean; nearLat?: number; nearLng?: number },
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
    const r = await this.prisma.lostFoundPost.create({
      data: {
        reporterId, kind: input.kind, species: input.species,
        ...(input.petName ? { petName: input.petName } : {}),
        ...(input.breed ? { breed: input.breed } : {}),
        ...(input.age ? { age: input.age } : {}),
        ...(input.color ? { color: input.color } : {}),
        ...(input.sex ? { sex: input.sex } : {}),
        ...(input.size ? { size: input.size } : {}),
        ...(input.microchipId ? { microchipId: input.microchipId } : {}),
        ...(input.collar ? { collar: input.collar } : {}),
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.vaccinated !== undefined ? { vaccinated: input.vaccinated } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.lastSeenLocation ? { lastSeenLocation: input.lastSeenLocation } : {}),
        ...(input.lastSeenAt ? { lastSeenAt: new Date(input.lastSeenAt) } : {}),
        ...(input.photoUrl ? { photoUrl: input.photoUrl } : {}),
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

  async update(id: string, userId: string, input: UpdateReportInput): Promise<ReportResponse> {
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
        data: { postId, reporterId, ...(input.message ? { message: input.message } : {}), ...(input.location ? { location: input.location } : {}) },
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
    reporter: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    const sightings = await this.prisma.lostFoundSighting.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: { reporter: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return sightings.map((s) => ({
      id: s.id, message: s.message, location: s.location, createdAt: s.createdAt.toISOString(),
      reporter: {
        id: s.reporter.id, username: s.reporter.username, displayName: s.reporter.displayName,
        avatarUrl: s.reporter.avatarUrl, isVerified: s.reporter.verificationTier === 'professional',
      },
    }))
  }
}
