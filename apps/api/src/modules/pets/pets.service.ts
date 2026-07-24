import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import type {
  CreatePetInput, UpdatePetInput, CreateDiaryEntryInput, CreateHealthRecordInput,
} from './pets.schemas'

export interface DiaryEntryResponse {
  id: string
  petId: string
  kind: string
  title: string | null
  body: string | null
  photoUrl: string | null
  entryDate: string
  createdAt: string
}

export interface HealthRecordResponse {
  id: string
  petId: string
  type: string
  title: string
  notes: string | null
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
  isPublic: boolean
  createdAt: string
}

type PetRow = Prisma.PetGetPayload<Record<string, never>>

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

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
        ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
      },
    })
    return this.map(pet)
  }

  async update(id: string, ownerId: string, input: UpdatePetInput): Promise<PetResponse> {
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

  async listDiary(petId: string, ownerId: string): Promise<DiaryEntryResponse[]> {
    await this.assertOwner(petId, ownerId)
    const entries = await this.prisma.petDiaryEntry.findMany({
      where: { petId },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    })
    return entries.map((e) => ({
      id: e.id, petId: e.petId, kind: e.kind, title: e.title, body: e.body,
      photoUrl: e.photoUrl, entryDate: e.entryDate.toISOString().slice(0, 10), createdAt: e.createdAt.toISOString(),
    }))
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
        ...(input.entryDate ? { entryDate: new Date(input.entryDate) } : {}),
      },
    })
    return {
      id: e.id, petId: e.petId, kind: e.kind, title: e.title, body: e.body,
      photoUrl: e.photoUrl, entryDate: e.entryDate.toISOString().slice(0, 10), createdAt: e.createdAt.toISOString(),
    }
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
        ...(input.recordDate ? { recordDate: new Date(input.recordDate) } : {}),
        ...(input.nextDue ? { nextDue: new Date(input.nextDue) } : {}),
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
      id: r.id, petId: r.petId, type: r.type, title: r.title, notes: r.notes,
      recordDate: r.recordDate ? r.recordDate.toISOString().slice(0, 10) : null,
      nextDue: r.nextDue ? r.nextDue.toISOString().slice(0, 10) : null,
      createdAt: r.createdAt.toISOString(),
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
      isPublic: p.isPublic,
      createdAt: p.createdAt.toISOString(),
    }
  }
}
