import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import { scanForFraud } from '../common/fraud/fraud-scan'
import type {
  CreateBreedingInput, UpdateBreedingInput, RequestInput, RespondRequestInput, RequestMessageInput,
  CreateReviewInput, CreateAlertInput, CreateLitterInput, UpdateLitterInput, BreedingSpecies,
} from './breeding.schemas'

export interface DnaResult { condition: string; status: 'clear' | 'carrier' | 'affected' }

export interface BreedingResponse {
  id: string
  owner: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  petId: string | null
  petName: string
  species: string
  breed: string
  sex: string
  age: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  distanceKm: number | null
  about: string | null
  temperament: string[]
  healthTests: string[]
  certifications: string[]
  registered: boolean
  willingToTravel: boolean
  vaccinated: boolean
  dnaResults: DnaResult[]
  ageMonths: number | null
  littersCount: number
  lastLitterAt: string | null
  documents: string[]
  heatStatus: string | null
  nextHeatAt: string | null
  availableNow: boolean
  verifiedBy: { id: string; name: string } | null
  verifiedAt: string | null
  rating: number
  reviewCount: number
  coverUrl: string | null
  photos: string[]
  fee: number | null
  currency: string
  status: string
  requestsCount: number
  createdAt: string
  viewerRequested: boolean
  viewerRequestId: string | null
  matchScore: number | null
  matchWarnings: string[]
}

export interface BreedingReviewResponse {
  id: string; rating: number; body: string | null; createdAt: string
  author: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
}

export interface BreedingAlertResponse {
  id: string; species: string | null; breed: string | null; sex: string | null
  nearLat: number | null; nearLng: number | null; radiusKm: number; createdAt: string
}

export interface LitterResponse {
  id: string; requestId: string; petName: string; withName: string
  species: string | null; breed: string | null
  matedAt: string | null; expectedAt: string | null; bornAt: string | null
  count: number | null; notes: string | null; status: string; listedCount: number
  canManage: boolean; createdAt: string
}

export interface BreedingPage {
  data: BreedingResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type BreedingRow = Prisma.BreedingProfileGetPayload<{
  include: {
    owner: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } }
    verifiedByProvider: { select: { id: true; name: true } }
  }
}>

const MAX = 30
const MIN_BREEDING_MONTHS: Record<string, number> = { dog: 18, cat: 12, rabbit: 6, bird: 12, other: 12 }

interface BrowseFilters {
  species?: BreedingSpecies
  sex?: string
  status?: string
  q?: string
  breed?: string
  registered?: boolean
  healthTested?: boolean
  availableNow?: boolean
  nearLat?: number
  nearLng?: number
}

@Injectable()
export class BreedingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private ownerInclude() {
    return {
      owner: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      verifiedByProvider: { select: { id: true, name: true } },
    }
  }

  private parseDna(raw: unknown): DnaResult[] {
    if (!Array.isArray(raw)) return []
    const out: DnaResult[] = []
    for (const e of raw) {
      if (e && typeof e === 'object' && typeof (e as { condition?: unknown }).condition === 'string') {
        const r = e as { condition: string; status?: string }
        const status = r.status === 'carrier' || r.status === 'affected' ? r.status : 'clear'
        out.push({ condition: r.condition, status })
      }
    }
    return out
  }

  private static haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
    const R = 6371
    const dLat = ((bLat - aLat) * Math.PI) / 180
    const dLng = ((bLng - aLng) * Math.PI) / 180
    const s = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10
  }

  private map(
    p: BreedingRow, requestId: string | null, distanceKm: number | null = null, vaccinated = false,
    matchScore: number | null = null, matchWarnings: string[] = [],
  ): BreedingResponse {
    return {
      id: p.id,
      owner: {
        id: p.owner.id, username: p.owner.username, displayName: p.owner.displayName,
        avatarUrl: p.owner.avatarUrl, isVerified: p.owner.verificationTier === 'professional',
      },
      petId: p.petId, petName: p.petName, species: p.species, breed: p.breed, sex: p.sex, age: p.age,
      location: p.location, latitude: p.latitude, longitude: p.longitude, distanceKm,
      about: p.about, temperament: p.temperament, healthTests: p.healthTests, certifications: p.certifications,
      registered: p.registered, willingToTravel: p.willingToTravel, vaccinated,
      dnaResults: this.parseDna(p.dnaResults), ageMonths: p.ageMonths,
      littersCount: p.littersCount, lastLitterAt: p.lastLitterAt ? p.lastLitterAt.toISOString().slice(0, 10) : null,
      documents: p.documents, heatStatus: p.heatStatus,
      nextHeatAt: p.nextHeatAt ? p.nextHeatAt.toISOString().slice(0, 10) : null,
      availableNow: p.availableNow,
      verifiedBy: p.verifiedByProvider ? { id: p.verifiedByProvider.id, name: p.verifiedByProvider.name } : null,
      verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString() : null,
      rating: p.rating, reviewCount: p.reviewCount,
      coverUrl: p.coverUrl, photos: p.photos, fee: p.feeCents !== null ? p.feeCents / 100 : null,
      currency: p.currency, status: p.status, requestsCount: p.requestsCount,
      createdAt: p.createdAt.toISOString(), viewerRequested: !!requestId, viewerRequestId: requestId,
      matchScore, matchWarnings,
    }
  }

  /** Map of profileId → the viewer's existing request id (for resuming chat). */
  private async requestedFlags(ids: string[], viewerId?: string): Promise<Map<string, string>> {
    if (!viewerId || ids.length === 0) return new Map()
    const rows = await this.prisma.breedingRequest.findMany({ where: { requesterId: viewerId, profileId: { in: ids } }, select: { profileId: true, id: true } })
    return new Map(rows.map((r) => [r.profileId, r.id]))
  }

  /** Which of these linked pets have a vaccination record in their Health Passport. */
  private async vaccinatedFlags(petIds: Array<string | null>): Promise<Set<string>> {
    const ids = petIds.filter((x): x is string => !!x)
    if (ids.length === 0) return new Set()
    const rows = await this.prisma.petHealthRecord.findMany({
      where: { petId: { in: ids }, type: 'vaccination' },
      select: { petId: true },
      distinct: ['petId'],
    })
    return new Set(rows.map((r) => r.petId))
  }

  private async decorate(items: BreedingRow[], viewerId: string | undefined, dist?: Map<string, number>): Promise<BreedingResponse[]> {
    const requested = await this.requestedFlags(items.map((p) => p.id), viewerId)
    const vacc = await this.vaccinatedFlags(items.map((p) => p.petId))
    return items.map((p) => this.map(p, requested.get(p.id) ?? null, dist?.get(p.id) ?? null, !!(p.petId && vacc.has(p.petId))))
  }

  private baseWhere(filters: BrowseFilters): Prisma.BreedingProfileWhereInput {
    return {
      isDeleted: false,
      ...(filters.status ? { status: filters.status } : { status: 'available' }),
      ...(filters.species ? { species: filters.species } : {}),
      ...(filters.sex ? { sex: filters.sex } : {}),
      ...(filters.breed ? { breed: { contains: filters.breed, mode: 'insensitive' } } : {}),
      ...(filters.registered ? { registered: true } : {}),
      ...(filters.availableNow ? { availableNow: true } : {}),
      ...(filters.healthTested ? { NOT: { healthTests: { isEmpty: true } } } : {}),
      ...(filters.q ? { OR: [{ petName: { contains: filters.q, mode: 'insensitive' } }, { breed: { contains: filters.q, mode: 'insensitive' } }] } : {}),
    }
  }

  async browse(filters: BrowseFilters, viewerId: string | undefined, cursor: string | null, limit = 15): Promise<BreedingPage> {
    const take = Math.min(limit, MAX)
    if (filters.nearLat !== undefined && filters.nearLng !== undefined) {
      return this.browseNearby(filters, viewerId, cursor, take, filters.nearLat, filters.nearLng)
    }
    const decoded = cursor ? decodeCursor(cursor) : null
    const where: Prisma.BreedingProfileWhereInput = {
      ...this.baseWhere(filters),
      ...(decoded
        ? { OR: [{ createdAt: { lt: new Date(decoded.createdAt) } }, { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } }] }
        : {}),
    }
    const rows = await this.prisma.breedingProfile.findMany({
      where, take: take + 1, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], include: this.ownerInclude(),
    })
    const hasMore = rows.length > take
    const items = hasMore ? rows.slice(0, take) : rows
    return {
      data: await this.decorate(items, viewerId),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  /** Profiles with coordinates, sorted by distance from the viewer. */
  private async browseNearby(filters: BrowseFilters, viewerId: string | undefined, cursor: string | null, take: number, lat: number, lng: number): Promise<BreedingPage> {
    const offset = cursor ? Math.max(0, parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10) || 0) : 0
    const pool = await this.prisma.breedingProfile.findMany({
      where: { ...this.baseWhere(filters), latitude: { not: null }, longitude: { not: null } },
      take: 200, orderBy: [{ createdAt: 'desc' }], include: this.ownerInclude(),
    })
    const withDist = pool
      .map((p) => ({ p, d: BreedingService.haversineKm(lat, lng, p.latitude!, p.longitude!) }))
      .sort((a, b) => a.d - b.d)
    const slice = withDist.slice(offset, offset + take)
    const dist = new Map(slice.map((s) => [s.p.id, s.d]))
    return {
      data: await this.decorate(slice.map((s) => s.p), viewerId, dist),
      nextCursor: offset + take < withDist.length ? Buffer.from(String(offset + take)).toString('base64') : null,
      hasMore: offset + take < withDist.length,
    }
  }

  /** Compatible mates for one of the viewer's pets: same species, opposite sex, breed-first. */
  async matchesForPet(petId: string, viewerId: string): Promise<BreedingResponse[]> {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId }, select: { ownerId: true, species: true, breed: true, sex: true } })
    if (!pet) throw new NotFoundException({ code: 'PET_NOT_FOUND', message: 'Pet not found' })
    if (pet.ownerId !== viewerId) throw new ForbiddenException({ code: 'NOT_PET_OWNER', message: 'Not your pet' })

    const species = this.normalizeSpecies(pet.species)
    const oppositeSex = pet.sex === 'male' ? 'female' : pet.sex === 'female' ? 'male' : undefined
    const rows = await this.prisma.breedingProfile.findMany({
      where: {
        isDeleted: false, status: 'available', species,
        ownerId: { not: viewerId },
        ...(oppositeSex ? { sex: oppositeSex } : {}),
      },
      take: 40, orderBy: [{ createdAt: 'desc' }], include: this.ownerInclude(),
    })

    // The viewer's own listing for this pet (if any) supplies DNA for carrier×carrier checks.
    const mine = await this.prisma.breedingProfile.findFirst({
      where: { petId, ownerId: viewerId, isDeleted: false },
      select: { dnaResults: true },
    })
    const myDna = this.parseDna(mine?.dnaResults)
    const breed = pet.breed?.toLowerCase().trim()

    const requested = await this.requestedFlags(rows.map((p) => p.id), viewerId)
    const vacc = await this.vaccinatedFlags(rows.map((p) => p.petId))

    const scored = rows.map((p) => {
      const vaccinated = !!(p.petId && vacc.has(p.petId))
      const { score, warnings } = this.computeMatch(p, { breed, species, myDna }, vaccinated)
      return { p, vaccinated, score, warnings }
    }).sort((a, b) => b.score - a.score).slice(0, 20)

    return scored.map((s) => this.map(s.p, requested.get(s.p.id) ?? null, null, s.vaccinated, s.score, s.warnings))
  }

  /** Compatibility score (0-100) + genetic/welfare warnings for a candidate. */
  private computeMatch(
    candidate: BreedingRow,
    ctx: { breed?: string; species: string; myDna: DnaResult[] },
    vaccinated: boolean,
  ): { score: number; warnings: string[] } {
    let score = 0
    if (ctx.breed && candidate.breed.toLowerCase().trim() === ctx.breed) score += 45
    if (candidate.healthTests.length > 0) score += 20
    if (vaccinated) score += 15
    if (candidate.registered) score += 10
    const candDna = this.parseDna(candidate.dnaResults)
    if (candDna.length > 0) score += 10

    const warnings: string[] = []
    // Carrier × carrier / affected genetic risk
    if (ctx.myDna.length > 0 && candDna.length > 0) {
      const risky = (s: string): boolean => s === 'carrier' || s === 'affected'
      for (const mine of ctx.myDna) {
        if (!risky(mine.status)) continue
        const theirs = candDna.find((d) => d.condition.toLowerCase().trim() === mine.condition.toLowerCase().trim())
        if (theirs && risky(theirs.status)) warnings.push(`Genetic risk: both may carry ${mine.condition}`)
      }
    }
    // Age-minimum welfare guard
    const minMonths = MIN_BREEDING_MONTHS[ctx.species] ?? 12
    if (candidate.ageMonths != null && candidate.ageMonths < minMonths) warnings.push('Below recommended breeding age')
    // Over-breeding welfare guard
    if (candidate.littersCount >= 5) warnings.push(`Has ${candidate.littersCount} litters — check breeding frequency`)
    if (candidate.lastLitterAt) {
      const months = (Date.now() - candidate.lastLitterAt.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      if (months < 6) warnings.push('Recent litter — may need rest between breedings')
    }
    return { score: Math.min(100, score), warnings }
  }

  private normalizeSpecies(raw: string): string {
    const s = raw.toLowerCase().trim()
    return ['dog', 'cat', 'bird', 'rabbit'].includes(s) ? s : 'other'
  }

  private ageFromBirthdate(birthdate: Date | null): string | null {
    if (!birthdate) return null
    const months = Math.max(0, Math.floor((Date.now() - birthdate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
    if (months < 12) return `${months} mo`
    const years = Math.floor(months / 12)
    return `${years} yr${years > 1 ? 's' : ''}`
  }

  async get(id: string, viewerId?: string): Promise<BreedingResponse> {
    const p = await this.prisma.breedingProfile.findUnique({ where: { id }, include: this.ownerInclude() })
    if (!p || p.isDeleted) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    const [decorated] = await this.decorate([p], viewerId)
    return decorated!
  }

  async listMine(ownerId: string): Promise<BreedingResponse[]> {
    const rows = await this.prisma.breedingProfile.findMany({
      where: { ownerId, isDeleted: false }, orderBy: { createdAt: 'desc' }, include: this.ownerInclude(),
    })
    return this.decorate(rows, ownerId)
  }

  async create(ownerId: string, input: CreateBreedingInput): Promise<BreedingResponse> {
    // Pull details from the linked Health Passport pet when provided.
    let petId: string | null = null
    let species = input.species ?? 'dog'
    let breed = input.breed
    let sex = input.sex ?? 'male'
    let age = input.age ?? null
    let ageMonths = input.ageMonths ?? null
    if (input.petId) {
      const pet = await this.prisma.pet.findUnique({ where: { id: input.petId }, select: { ownerId: true, species: true, breed: true, sex: true, birthdate: true } })
      if (!pet || pet.ownerId !== ownerId) throw new BadRequestException({ code: 'PET_NOT_FOUND', message: 'Pet not found' })
      petId = input.petId
      species = this.normalizeSpecies(pet.species) as BreedingSpecies
      if (pet.breed) breed = pet.breed
      if (pet.sex === 'male' || pet.sex === 'female') sex = pet.sex
      age = input.age ?? this.ageFromBirthdate(pet.birthdate)
      ageMonths = input.ageMonths ?? this.monthsFromBirthdate(pet.birthdate)
    }

    const created = await this.prisma.breedingProfile.create({
      data: {
        ownerId, petName: input.petName, breed, species, sex,
        healthTests: input.healthTests ?? [], certifications: input.certifications ?? [],
        temperament: input.temperament ?? [], documents: input.documents ?? [],
        ...(petId ? { petId } : {}),
        ...(age ? { age } : {}),
        ...(ageMonths != null ? { ageMonths } : {}),
        ...(input.dnaResults ? { dnaResults: input.dnaResults } : {}),
        ...(input.littersCount !== undefined ? { littersCount: input.littersCount } : {}),
        ...(input.lastLitterAt ? { lastLitterAt: new Date(input.lastLitterAt) } : {}),
        ...(input.heatStatus ? { heatStatus: input.heatStatus } : {}),
        ...(input.nextHeatAt ? { nextHeatAt: new Date(input.nextHeatAt) } : {}),
        ...(input.availableNow !== undefined ? { availableNow: input.availableNow } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.about ? { about: input.about } : {}),
        ...(input.registered !== undefined ? { registered: input.registered } : {}),
        ...(input.willingToTravel !== undefined ? { willingToTravel: input.willingToTravel } : {}),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos ? { photos: input.photos } : {}),
        ...(input.fee !== undefined ? { feeCents: Math.round(input.fee * 100) } : {}),
        ...(input.currency ? { currency: input.currency.toUpperCase() } : {}),
      },
      include: this.ownerInclude(),
    })
    void this.notifyMatchingAlerts(created)
    const [decorated] = await this.decorate([created], ownerId)
    return decorated!
  }

  private monthsFromBirthdate(birthdate: Date | null): number | null {
    if (!birthdate) return null
    return Math.max(0, Math.floor((Date.now() - birthdate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
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
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.about !== undefined ? { about: input.about } : {}),
        ...(input.temperament !== undefined ? { temperament: input.temperament } : {}),
        ...(input.healthTests !== undefined ? { healthTests: input.healthTests } : {}),
        ...(input.certifications !== undefined ? { certifications: input.certifications } : {}),
        ...(input.registered !== undefined ? { registered: input.registered } : {}),
        ...(input.willingToTravel !== undefined ? { willingToTravel: input.willingToTravel } : {}),
        ...(input.dnaResults !== undefined ? { dnaResults: input.dnaResults } : {}),
        ...(input.ageMonths !== undefined ? { ageMonths: input.ageMonths } : {}),
        ...(input.littersCount !== undefined ? { littersCount: input.littersCount } : {}),
        ...(input.lastLitterAt !== undefined ? { lastLitterAt: input.lastLitterAt ? new Date(input.lastLitterAt) : null } : {}),
        ...(input.documents !== undefined ? { documents: input.documents } : {}),
        ...(input.heatStatus !== undefined ? { heatStatus: input.heatStatus } : {}),
        ...(input.nextHeatAt !== undefined ? { nextHeatAt: input.nextHeatAt ? new Date(input.nextHeatAt) : null } : {}),
        ...(input.availableNow !== undefined ? { availableNow: input.availableNow } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos !== undefined ? { photos: input.photos } : {}),
        ...(input.fee !== undefined ? { feeCents: Math.round(input.fee * 100) } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.ownerInclude(),
    })
    const [decorated] = await this.decorate([updated], ownerId)
    return decorated!
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.assertOwner(id, ownerId)
    await this.prisma.breedingProfile.update({ where: { id }, data: { isDeleted: true } })
  }

  async request(id: string, requesterId: string, input: RequestInput): Promise<{ id: string; status: string }> {
    const profile = await this.prisma.breedingProfile.findUnique({ where: { id }, select: { id: true, isDeleted: true, ownerId: true, petName: true } })
    if (!profile || profile.isDeleted) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    if (profile.ownerId === requesterId) throw new BadRequestException({ code: 'OWN_PROFILE', message: 'You cannot request a match on your own profile' })

    const existing = await this.prisma.breedingRequest.findUnique({ where: { profileId_requesterId: { profileId: id, requesterId } }, select: { id: true, status: true } })
    if (existing) return { id: existing.id, status: existing.status }

    const created = await this.prisma.$transaction(async (tx) => {
      const r = await tx.breedingRequest.create({ data: { profileId: id, requesterId, lastMessageAt: new Date(), ...(input.message ? { message: input.message } : {}) } })
      if (input.message?.trim()) {
        const scan = scanForFraud(input.message)
        await tx.breedingRequestMessage.create({ data: { requestId: r.id, senderId: requesterId, body: input.message.trim(), flagged: scan.flagged } })
      }
      await tx.breedingProfile.update({ where: { id }, data: { requestsCount: { increment: 1 } } })
      return r
    })

    const requester = await this.prisma.profile.findUnique({ where: { id: requesterId }, select: { displayName: true, username: true } })
    void this.notifications.enqueue({
      userId: profile.ownerId,
      type: 'breeding_request',
      title: 'New match request',
      body: `${requester?.displayName ?? 'Someone'} is interested in breeding with ${profile.petName}`,
      data: { profileId: id, requesterUsername: requester?.username },
    })
    return { id: created.id, status: 'pending' }
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

  // ── Private request chat (fraud-scanned; no phone/personal details) ─────────

  private async loadThread(requestId: string, userId: string): Promise<{ requesterId: string; ownerId: string; profileId: string }> {
    const req = await this.prisma.breedingRequest.findUnique({
      where: { id: requestId },
      select: { requesterId: true, profileId: true, profile: { select: { ownerId: true } } },
    })
    if (!req) throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Conversation not found' })
    if (userId !== req.requesterId && userId !== req.profile.ownerId) {
      throw new ForbiddenException({ code: 'NOT_PARTICIPANT', message: 'You are not part of this conversation' })
    }
    return { requesterId: req.requesterId, ownerId: req.profile.ownerId, profileId: req.profileId }
  }

  async listMessages(requestId: string, userId: string): Promise<Array<{
    id: string; body: string; flagged: boolean; createdAt: string; mine: boolean
    sender: { id: string; username: string; displayName: string; avatarUrl: string | null }
  }>> {
    await this.loadThread(requestId, userId)
    const msgs = await this.prisma.breedingRequestMessage.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
    })
    return msgs.map((m) => ({
      id: m.id, body: m.body, flagged: m.flagged, createdAt: m.createdAt.toISOString(), mine: m.senderId === userId,
      sender: { id: m.sender.id, username: m.sender.username, displayName: m.sender.displayName, avatarUrl: m.sender.avatarUrl },
    }))
  }

  async sendMessage(requestId: string, userId: string, input: RequestMessageInput): Promise<{ id: string; flagged: boolean; reasons: string[] }> {
    const { requesterId, ownerId, profileId } = await this.loadThread(requestId, userId)
    const scan = scanForFraud(input.body)
    const msg = await this.prisma.breedingRequestMessage.create({
      data: { requestId, senderId: userId, body: input.body.trim(), flagged: scan.flagged },
    })
    await this.prisma.breedingRequest.update({ where: { id: requestId }, data: { lastMessageAt: new Date() } })

    const recipientId = userId === ownerId ? requesterId : ownerId
    const sender = await this.prisma.profile.findUnique({ where: { id: userId }, select: { displayName: true } })
    void this.notifications.enqueue({
      userId: recipientId,
      type: 'breeding_message',
      title: 'New message',
      body: `${sender?.displayName ?? 'Someone'}: ${input.body.slice(0, 80)}`,
      data: { profileId, requestId },
    })
    return { id: msg.id, flagged: scan.flagged, reasons: scan.reasons }
  }

  // ── Vet verification ────────────────────────────────────────────────────────

  /** A vet clinic owner verifies a breeding profile's health clearances. */
  async verify(profileId: string, userId: string, providerId: string): Promise<BreedingResponse> {
    const profile = await this.prisma.breedingProfile.findUnique({ where: { id: profileId }, select: { id: true, isDeleted: true, ownerId: true } })
    if (!profile || profile.isDeleted) throw new NotFoundException({ code: 'BREEDING_NOT_FOUND', message: 'Breeding profile not found' })
    if (profile.ownerId === userId) throw new BadRequestException({ code: 'OWN_PROFILE', message: 'You cannot verify your own profile' })
    const provider = await this.prisma.serviceProvider.findUnique({ where: { id: providerId }, select: { addedBy: true, category: true, isDeleted: true } })
    if (!provider || provider.isDeleted || provider.category !== 'vet') throw new NotFoundException({ code: 'CLINIC_NOT_FOUND', message: 'Vet clinic not found' })
    if (provider.addedBy !== userId) throw new ForbiddenException({ code: 'NOT_CLINIC_OWNER', message: 'You can only verify from your own clinic' })

    const updated = await this.prisma.breedingProfile.update({
      where: { id: profileId },
      data: { verifiedByProviderId: providerId, verifiedAt: new Date() },
      include: this.ownerInclude(),
    })
    void this.notifications.enqueue({
      userId: profile.ownerId, type: 'breeding_verified', title: 'Profile vet-verified',
      body: 'A vet clinic verified your breeding profile', data: { profileId },
    })
    const [decorated] = await this.decorate([updated], userId)
    return decorated!
  }

  // ── Reviews & reputation ────────────────────────────────────────────────────

  async createReview(userId: string, input: CreateReviewInput): Promise<BreedingReviewResponse> {
    const req = await this.prisma.breedingRequest.findUnique({
      where: { id: input.requestId },
      select: { id: true, status: true, requesterId: true, profileId: true, profile: { select: { ownerId: true } } },
    })
    if (!req) throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Request not found' })
    if (req.status !== 'accepted') throw new BadRequestException({ code: 'NOT_ACCEPTED', message: 'You can only review after a match is accepted' })
    const ownerId = req.profile.ownerId
    if (userId !== req.requesterId && userId !== ownerId) throw new ForbiddenException({ code: 'NOT_PARTICIPANT', message: 'Not part of this match' })
    const targetId = userId === ownerId ? req.requesterId : ownerId

    const existing = await this.prisma.breedingReview.findUnique({ where: { requestId_authorId: { requestId: input.requestId, authorId: userId } }, select: { id: true } })
    if (existing) throw new BadRequestException({ code: 'ALREADY_REVIEWED', message: 'You already reviewed this match' })

    const review = await this.prisma.breedingReview.create({
      data: { profileId: req.profileId, requestId: input.requestId, authorId: userId, targetId, rating: input.rating, body: input.body ?? null },
      include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    // Recompute the profile's reputation.
    const agg = await this.prisma.breedingReview.aggregate({ where: { profileId: req.profileId, isDeleted: false }, _avg: { rating: true }, _count: true })
    await this.prisma.breedingProfile.update({ where: { id: req.profileId }, data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count } })

    void this.notifications.enqueue({ userId: targetId, type: 'breeding_review', title: 'New review', body: `${review.author.displayName} left you a ${input.rating}★ review`, data: { profileId: req.profileId } })
    return this.mapReview(review)
  }

  async listReviews(profileId: string): Promise<BreedingReviewResponse[]> {
    const rows = await this.prisma.breedingReview.findMany({
      where: { profileId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return rows.map((r) => this.mapReview(r))
  }

  private mapReview(r: Prisma.BreedingReviewGetPayload<{ include: { author: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } } }>): BreedingReviewResponse {
    return {
      id: r.id, rating: r.rating, body: r.body, createdAt: r.createdAt.toISOString(),
      author: { id: r.author.id, username: r.author.username, displayName: r.author.displayName, avatarUrl: r.author.avatarUrl, isVerified: r.author.verificationTier === 'professional' },
    }
  }

  // ── Saved-search alerts ─────────────────────────────────────────────────────

  async createAlert(userId: string, input: CreateAlertInput): Promise<BreedingAlertResponse> {
    const a = await this.prisma.breedingAlert.create({
      data: {
        userId,
        ...(input.species ? { species: input.species } : {}),
        ...(input.breed ? { breed: input.breed } : {}),
        ...(input.sex ? { sex: input.sex } : {}),
        ...(input.nearLat !== undefined ? { nearLat: input.nearLat } : {}),
        ...(input.nearLng !== undefined ? { nearLng: input.nearLng } : {}),
        ...(input.radiusKm !== undefined ? { radiusKm: input.radiusKm } : {}),
      },
    })
    return this.mapAlert(a)
  }

  async listAlerts(userId: string): Promise<BreedingAlertResponse[]> {
    const rows = await this.prisma.breedingAlert.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return rows.map((a) => this.mapAlert(a))
  }

  async removeAlert(id: string, userId: string): Promise<void> {
    const a = await this.prisma.breedingAlert.findUnique({ where: { id }, select: { userId: true } })
    if (!a) throw new NotFoundException({ code: 'ALERT_NOT_FOUND' })
    if (a.userId !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    await this.prisma.breedingAlert.delete({ where: { id } })
  }

  private mapAlert(a: Prisma.BreedingAlertGetPayload<Record<string, never>>): BreedingAlertResponse {
    return { id: a.id, species: a.species, breed: a.breed, sex: a.sex, nearLat: a.nearLat, nearLng: a.nearLng, radiusKm: a.radiusKm, createdAt: a.createdAt.toISOString() }
  }

  /** Notify users whose saved search matches a newly-listed profile. */
  private async notifyMatchingAlerts(profile: BreedingRow): Promise<void> {
    const alerts = await this.prisma.breedingAlert.findMany({
      where: {
        userId: { not: profile.ownerId },
        AND: [
          { OR: [{ species: null }, { species: profile.species }] },
          { OR: [{ sex: null }, { sex: profile.sex }] },
        ],
      },
      take: 500,
    })
    for (const a of alerts) {
      if (a.breed && !profile.breed.toLowerCase().includes(a.breed.toLowerCase())) continue
      if (a.nearLat != null && a.nearLng != null && profile.latitude != null && profile.longitude != null) {
        const d = BreedingService.haversineKm(a.nearLat, a.nearLng, profile.latitude, profile.longitude)
        if (d > a.radiusKm) continue
      }
      void this.notifications.enqueue({
        userId: a.userId, type: 'breeding_alert', title: 'New breeding match',
        body: `${profile.petName} (${profile.breed}) matches your saved search`,
        data: { profileId: profile.id },
      })
    }
  }

  // ── Litters (Litter → Adoption pipeline) ────────────────────────────────────

  private litterInclude() {
    return {
      request: {
        select: {
          id: true, requesterId: true,
          requester: { select: { displayName: true } },
          profile: { select: { petName: true, breed: true, species: true, ownerId: true, owner: { select: { displayName: true } } } },
        },
      },
    }
  }

  private mapLitter(l: Prisma.BreedingLitterGetPayload<{ include: ReturnType<BreedingService['litterInclude']> }>, userId: string): LitterResponse {
    const ownerId = l.request.profile.ownerId
    const withName = userId === ownerId ? l.request.requester.displayName : l.request.profile.owner.displayName
    return {
      id: l.id, requestId: l.requestId, petName: l.request.profile.petName, withName,
      species: l.species, breed: l.breed,
      matedAt: l.matedAt ? l.matedAt.toISOString().slice(0, 10) : null,
      expectedAt: l.expectedAt ? l.expectedAt.toISOString().slice(0, 10) : null,
      bornAt: l.bornAt ? l.bornAt.toISOString().slice(0, 10) : null,
      count: l.count, notes: l.notes, status: l.status, listedCount: l.listedCount,
      canManage: l.recordedBy === userId, createdAt: l.createdAt.toISOString(),
    }
  }

  async createLitter(userId: string, input: CreateLitterInput): Promise<LitterResponse> {
    const req = await this.prisma.breedingRequest.findUnique({
      where: { id: input.requestId },
      select: { id: true, status: true, requesterId: true, profile: { select: { ownerId: true, breed: true, species: true } } },
    })
    if (!req) throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Match not found' })
    if (req.status !== 'accepted') throw new BadRequestException({ code: 'NOT_ACCEPTED', message: 'Record a litter only after the match is accepted' })
    if (userId !== req.requesterId && userId !== req.profile.ownerId) throw new ForbiddenException({ code: 'NOT_PARTICIPANT', message: 'Not part of this match' })

    const created = await this.prisma.breedingLitter.create({
      data: {
        requestId: input.requestId, recordedBy: userId,
        species: req.profile.species, breed: req.profile.breed,
        status: input.bornAt ? 'born' : 'expecting',
        ...(input.matedAt ? { matedAt: new Date(input.matedAt) } : {}),
        ...(input.expectedAt ? { expectedAt: new Date(input.expectedAt) } : {}),
        ...(input.bornAt ? { bornAt: new Date(input.bornAt) } : {}),
        ...(input.count !== undefined ? { count: input.count } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
      },
      include: this.litterInclude(),
    })
    return this.mapLitter(created, userId)
  }

  async listMyLitters(userId: string): Promise<LitterResponse[]> {
    const rows = await this.prisma.breedingLitter.findMany({
      where: {
        isDeleted: false,
        OR: [
          { recordedBy: userId },
          { request: { requesterId: userId } },
          { request: { profile: { ownerId: userId } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: this.litterInclude(),
    })
    return rows.map((l) => this.mapLitter(l, userId))
  }

  async updateLitter(id: string, userId: string, input: UpdateLitterInput): Promise<LitterResponse> {
    const l = await this.prisma.breedingLitter.findUnique({ where: { id }, select: { recordedBy: true } })
    if (!l) throw new NotFoundException({ code: 'LITTER_NOT_FOUND' })
    if (l.recordedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    const updated = await this.prisma.breedingLitter.update({
      where: { id },
      data: {
        ...(input.matedAt ? { matedAt: new Date(input.matedAt) } : {}),
        ...(input.expectedAt ? { expectedAt: new Date(input.expectedAt) } : {}),
        ...(input.bornAt ? { bornAt: new Date(input.bornAt), status: 'born' } : {}),
        ...(input.count !== undefined ? { count: input.count } : {}),
        ...(input.notes !== undefined ? { notes: input.notes || null } : {}),
        ...(input.status ? { status: input.status } : {}),
      },
      include: this.litterInclude(),
    })
    return this.mapLitter(updated, userId)
  }

  /** Record that an offspring from this litter was listed to Adoption. */
  async markOffspringListed(id: string, userId: string): Promise<{ listedCount: number }> {
    const l = await this.prisma.breedingLitter.findUnique({ where: { id }, select: { recordedBy: true } })
    if (!l) throw new NotFoundException({ code: 'LITTER_NOT_FOUND' })
    if (l.recordedBy !== userId) throw new ForbiddenException({ code: 'NOT_OWNER' })
    const updated = await this.prisma.breedingLitter.update({ where: { id }, data: { listedCount: { increment: 1 } }, select: { listedCount: true } })
    return { listedCount: updated.listedCount }
  }
}
