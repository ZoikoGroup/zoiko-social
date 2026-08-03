import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { nanoid } from 'nanoid'
import { PrismaService } from '../prisma/prisma.service'
import { ProfanityService } from '../common/moderation/profanity.service'
import type {
  CreatePetInput, UpdatePetInput, CreateDiaryEntryInput, UpdateDiaryEntryInput,
  CreateHealthRecordInput, UpdateHealthRecordInput,
} from './pets.schemas'

export interface DiaryEntryResponse {
  id: string
  petId: string
  kind: string
  title: string | null
  body: string | null
  photoUrl: string | null
  photoUrls: string[]
  tags: string[]
  entryDate: string
  createdAt: string
}

export interface HealthRecordResponse {
  id: string
  petId: string
  type: string
  title: string
  notes: string | null
  attachments: string[]
  recordDate: string | null
  nextDue: string | null
  createdAt: string
}

export interface PetResponse {
  id: string
  ownerId: string
  name: string
  species: string
  breed: string | null
  sex: string | null
  avatarUrl: string | null
  bio: string | null
  birthdate: string | null
  color: string | null
  microchipId: string | null
  neutered: boolean | null
  adoptionDate: string | null
  isPublic: boolean
  createdAt: string
}

export interface PublicPassportResponse {
  pet: {
    name: string
    species: string
    breed: string | null
    sex: string | null
    avatarUrl: string | null
    birthdate: string | null
    color: string | null
    // Included deliberately: the passport link is owner-issued and revocable,
    // and the chip number is exactly what a vet or shelter needs to identify a pet.
    microchipId: string | null
    neutered: boolean | null
    ownerName: string | null
  }
  records: HealthRecordResponse[]
}

type PetRow = Prisma.PetGetPayload<Record<string, never>>

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profanity: ProfanityService,
  ) {}

  /** The signed-in user's pets (all, public + private). */
  async listMine(ownerId: string): Promise<PetResponse[]> {
    const pets = await this.prisma.pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    })
    return pets.map((p) => this.map(p))
  }

  /** A profile's pets — public only, unless the viewer is the owner. */
  async listByOwner(ownerId: string, viewerId?: string): Promise<PetResponse[]> {
    const pets = await this.prisma.pet.findMany({
      where: { ownerId, ...(ownerId === viewerId ? {} : { isPublic: true }) },
      orderBy: { createdAt: 'desc' },
    })
    return pets.map((p) => this.map(p))
  }

  async create(ownerId: string, input: CreatePetInput): Promise<PetResponse> {
    // Free-text screening, same gate posts and comments go through.
    this.profanity.assertCleanFields({ name: input.name, breed: input.breed, bio: input.bio, color: input.color }, { actorId: ownerId, entityType: 'pet' })
    const pet = await this.prisma.pet.create({
      data: {
        ownerId,
        name: input.name,
        species: input.species,
        ...(input.breed ? { breed: input.breed } : {}),
        ...(input.sex ? { sex: input.sex } : {}),
        ...(input.avatarUrl ? { avatarUrl: input.avatarUrl } : {}),
        ...(input.bio ? { bio: input.bio } : {}),
        ...(input.birthdate ? { birthdate: new Date(input.birthdate) } : {}),
        ...(input.color ? { color: input.color } : {}),
        ...(input.microchipId ? { microchipId: input.microchipId } : {}),
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.adoptionDate ? { adoptionDate: new Date(input.adoptionDate) } : {}),
        ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
      },
    })
    return this.map(pet)
  }

  async update(id: string, ownerId: string, input: UpdatePetInput): Promise<PetResponse> {
    // Free-text screening, same gate posts and comments go through.
    this.profanity.assertCleanFields({ name: input.name, breed: input.breed, bio: input.bio, color: input.color }, { actorId: ownerId, entityType: 'pet' })
    await this.assertOwner(id, ownerId)
    const pet = await this.prisma.pet.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.species !== undefined ? { species: input.species } : {}),
        ...(input.breed !== undefined ? { breed: input.breed || null } : {}),
        ...(input.sex !== undefined ? { sex: input.sex } : {}),
        ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl || null } : {}),
        ...(input.bio !== undefined ? { bio: input.bio || null } : {}),
        ...(input.birthdate !== undefined ? { birthdate: input.birthdate ? new Date(input.birthdate) : null } : {}),
        ...(input.color !== undefined ? { color: input.color || null } : {}),
        ...(input.microchipId !== undefined ? { microchipId: input.microchipId || null } : {}),
        // Tri-state: null clears it back to "not specified", false means "not neutered".
        ...(input.neutered !== undefined ? { neutered: input.neutered } : {}),
        ...(input.adoptionDate !== undefined ? { adoptionDate: input.adoptionDate ? new Date(input.adoptionDate) : null } : {}),
        ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
      },
    })
    return this.map(pet)
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.assertOwner(id, ownerId)
    await this.prisma.pet.delete({ where: { id } })
  }

  private async assertOwner(id: string, ownerId: string): Promise<void> {
    const pet = await this.prisma.pet.findUnique({ where: { id }, select: { ownerId: true } })
    if (!pet) throw new NotFoundException({ code: 'PET_NOT_FOUND', message: 'Pet not found' })
    if (pet.ownerId !== ownerId) {
      throw new ForbiddenException({ code: 'NOT_PET_OWNER', message: 'You can only manage your own pets' })
    }
  }

  // ── DIARY ─────────────────────────────────────────────────────────────────

  private mapDiary(e: Prisma.PetDiaryEntryGetPayload<Record<string, never>>): DiaryEntryResponse {
    return {
      id: e.id, petId: e.petId, kind: e.kind, title: e.title, body: e.body,
      photoUrl: e.photoUrl, photoUrls: e.photoUrls, tags: e.tags,
      entryDate: e.entryDate.toISOString().slice(0, 10), createdAt: e.createdAt.toISOString(),
    }
  }

  async listDiary(petId: string, ownerId: string): Promise<DiaryEntryResponse[]> {
    await this.assertOwner(petId, ownerId)
    const entries = await this.prisma.petDiaryEntry.findMany({
      where: { petId },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    })
    return entries.map((e) => this.mapDiary(e))
  }

  async addDiary(petId: string, ownerId: string, input: CreateDiaryEntryInput): Promise<DiaryEntryResponse> {
    await this.assertOwner(petId, ownerId)
    const e = await this.prisma.petDiaryEntry.create({
      data: {
        petId, ownerId,
        kind: input.kind ?? 'note',
        ...(input.title ? { title: input.title } : {}),
        ...(input.body ? { body: input.body } : {}),
        ...(input.photoUrl ? { photoUrl: input.photoUrl } : {}),
        ...(input.photoUrls ? { photoUrls: input.photoUrls } : {}),
        ...(input.tags ? { tags: input.tags } : {}),
        ...(input.entryDate ? { entryDate: new Date(input.entryDate) } : {}),
      },
    })
    return this.mapDiary(e)
  }

  async updateDiary(petId: string, entryId: string, ownerId: string, input: UpdateDiaryEntryInput): Promise<DiaryEntryResponse> {
    await this.assertOwner(petId, ownerId)
    const existing = await this.prisma.petDiaryEntry.findFirst({ where: { id: entryId, petId, ownerId }, select: { id: true } })
    if (!existing) throw new NotFoundException({ code: 'DIARY_ENTRY_NOT_FOUND', message: 'Diary entry not found' })
    const e = await this.prisma.petDiaryEntry.update({
      where: { id: entryId },
      data: {
        ...(input.kind !== undefined ? { kind: input.kind } : {}),
        ...(input.title !== undefined ? { title: input.title || null } : {}),
        ...(input.body !== undefined ? { body: input.body || null } : {}),
        ...(input.photoUrl !== undefined ? { photoUrl: input.photoUrl || null } : {}),
        ...(input.photoUrls !== undefined ? { photoUrls: input.photoUrls } : {}),
        ...(input.tags !== undefined ? { tags: input.tags } : {}),
        ...(input.entryDate !== undefined ? { entryDate: new Date(input.entryDate) } : {}),
      },
    })
    return this.mapDiary(e)
  }

  async removeDiary(petId: string, entryId: string, ownerId: string): Promise<void> {
    await this.assertOwner(petId, ownerId)
    await this.prisma.petDiaryEntry.deleteMany({ where: { id: entryId, petId, ownerId } })
  }

  // ── HEALTH ────────────────────────────────────────────────────────────────

  async listHealth(petId: string, ownerId: string): Promise<HealthRecordResponse[]> {
    await this.assertOwner(petId, ownerId)
    const records = await this.prisma.petHealthRecord.findMany({
      where: { petId },
      orderBy: [{ recordDate: 'desc' }, { createdAt: 'desc' }],
    })
    return records.map((r) => this.mapHealth(r))
  }

  async addHealth(petId: string, ownerId: string, input: CreateHealthRecordInput): Promise<HealthRecordResponse> {
    await this.assertOwner(petId, ownerId)
    const r = await this.prisma.petHealthRecord.create({
      data: {
        petId, ownerId, type: input.type, title: input.title,
        ...(input.notes ? { notes: input.notes } : {}),
        ...(input.attachments ? { attachments: input.attachments } : {}),
        ...(input.recordDate ? { recordDate: new Date(input.recordDate) } : {}),
        ...(input.nextDue ? { nextDue: new Date(input.nextDue) } : {}),
      },
    })
    return this.mapHealth(r)
  }

  async updateHealth(petId: string, recordId: string, ownerId: string, input: UpdateHealthRecordInput): Promise<HealthRecordResponse> {
    await this.assertOwner(petId, ownerId)
    const existing = await this.prisma.petHealthRecord.findFirst({ where: { id: recordId, petId, ownerId }, select: { id: true } })
    if (!existing) throw new NotFoundException({ code: 'HEALTH_RECORD_NOT_FOUND', message: 'Health record not found' })
    const r = await this.prisma.petHealthRecord.update({
      where: { id: recordId },
      data: {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.notes !== undefined ? { notes: input.notes || null } : {}),
        ...(input.attachments !== undefined ? { attachments: input.attachments } : {}),
        ...(input.recordDate !== undefined ? { recordDate: input.recordDate ? new Date(input.recordDate) : null } : {}),
        ...(input.nextDue !== undefined ? { nextDue: input.nextDue ? new Date(input.nextDue) : null } : {}),
      },
    })
    return this.mapHealth(r)
  }

  async removeHealth(petId: string, recordId: string, ownerId: string): Promise<void> {
    await this.assertOwner(petId, ownerId)
    await this.prisma.petHealthRecord.deleteMany({ where: { id: recordId, petId, ownerId } })
  }

  private mapHealth(r: Prisma.PetHealthRecordGetPayload<Record<string, never>>): HealthRecordResponse {
    return {
      id: r.id, petId: r.petId, type: r.type, title: r.title, notes: r.notes, attachments: r.attachments,
      recordDate: r.recordDate ? r.recordDate.toISOString().slice(0, 10) : null,
      nextDue: r.nextDue ? r.nextDue.toISOString().slice(0, 10) : null,
      createdAt: r.createdAt.toISOString(),
    }
  }

  // ── PUBLIC SHARE (vet card) ─────────────────────────────────────────────────

  /** Enables (or returns the existing) revocable public share token for a pet. */
  async enableHealthShare(petId: string, ownerId: string): Promise<{ token: string }> {
    await this.assertOwner(petId, ownerId)
    const pet = await this.prisma.pet.findUnique({ where: { id: petId }, select: { healthShareToken: true } })
    if (pet?.healthShareToken) return { token: pet.healthShareToken }
    const token = nanoid(24)
    await this.prisma.pet.update({ where: { id: petId }, data: { healthShareToken: token } })
    return { token }
  }

  async disableHealthShare(petId: string, ownerId: string): Promise<void> {
    await this.assertOwner(petId, ownerId)
    await this.prisma.pet.update({ where: { id: petId }, data: { healthShareToken: null } })
  }

  /** Public, unauthenticated read of a shared pet's health card. */
  async publicPassport(token: string): Promise<PublicPassportResponse> {
    const pet = await this.prisma.pet.findFirst({
      where: { healthShareToken: token },
      select: {
        id: true, name: true, species: true, breed: true, sex: true, avatarUrl: true, birthdate: true,
        color: true, microchipId: true, neutered: true,
        owner: { select: { displayName: true } },
      },
    })
    if (!pet) throw new NotFoundException({ code: 'PASSPORT_NOT_FOUND', message: 'This share link is invalid or has been revoked' })
    const records = await this.prisma.petHealthRecord.findMany({
      where: { petId: pet.id },
      orderBy: [{ recordDate: 'desc' }, { createdAt: 'desc' }],
    })
    return {
      pet: {
        name: pet.name, species: pet.species, breed: pet.breed, sex: pet.sex,
        avatarUrl: pet.avatarUrl,
        birthdate: pet.birthdate ? pet.birthdate.toISOString().slice(0, 10) : null,
        color: pet.color,
        microchipId: pet.microchipId,
        neutered: pet.neutered,
        ownerName: pet.owner?.displayName ?? null,
      },
      records: records.map((r) => this.mapHealth(r)),
    }
  }

  private map(p: PetRow): PetResponse {
    return {
      id: p.id,
      ownerId: p.ownerId,
      name: p.name,
      species: p.species,
      breed: p.breed,
      sex: p.sex,
      avatarUrl: p.avatarUrl,
      bio: p.bio,
      birthdate: p.birthdate ? p.birthdate.toISOString().slice(0, 10) : null,
      color: p.color,
      microchipId: p.microchipId,
      neutered: p.neutered,
      adoptionDate: p.adoptionDate ? p.adoptionDate.toISOString().slice(0, 10) : null,
      isPublic: p.isPublic,
      createdAt: p.createdAt.toISOString(),
    }
  }
}
