import { LostFoundService } from './lost-found.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'
import type { ProfanityService } from '../common/moderation/profanity.service'

const OWNER = 'owner-1'
const STRANGER = 'stranger-1'
const PET_ID = 'pet-1'

const PET = {
  id: PET_ID,
  name: 'Biscuit',
  species: 'dog',
  breed: 'Beagle',
  color: 'tricolour',
  sex: 'male',
  microchipId: '900123456789',
  avatarUrl: 'https://cdn.example/biscuit.jpg',
  neutered: true,
}

function build(opts: { pet?: typeof PET | null } = {}) {
  const created: Record<string, unknown>[] = []

  const prisma = {
    pet: {
      // Mirrors the real query: ownership is part of the WHERE, so a pet that
      // isn't the caller's comes back as null rather than being filtered later.
      findFirst: jest.fn().mockImplementation((args: { where: { id: string; ownerId: string } }) => {
        const pet = opts.pet === undefined ? PET : opts.pet
        if (!pet) return Promise.resolve(null)
        return Promise.resolve(args.where.ownerId === OWNER && args.where.id === pet.id ? pet : null)
      }),
    },
    lostFoundPost: {
      create: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) => {
        created.push(data)
        return Promise.resolve({
          id: 'report-1', kind: 'lost', petName: null, species: 'dog', breed: null, age: null,
          color: null, sex: null, size: null, microchipId: null, collar: null, neutered: null,
          vaccinated: null, description: null, lastSeenLocation: null, lastSeenAt: null,
          photoUrl: null, photoUrls: [], latitude: null, longitude: null, contact: null,
          reward: null, status: 'active', sightingsCount: 0, isDeleted: false,
          createdAt: new Date('2026-08-03T00:00:00Z'),
          reporter: { id: OWNER, username: 'owner', displayName: 'Owner', avatarUrl: null, verificationTier: 'none' },
          pet: null,
          ...data,
        })
      }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  }

  const service = new LostFoundService(
    prisma as unknown as PrismaService,
    { enqueue: jest.fn() } as unknown as NotificationQueueService,
    { assertCleanFields: jest.fn(), assertClean: jest.fn() } as unknown as ProfanityService,
  )
  return { service, prisma, created }
}

describe('LostFoundService.create — reporting your own pet', () => {
  it('fills breed, colour, microchip and photo from the pet profile', async () => {
    // The whole point: nobody recalls a 15-digit microchip number at the moment
    // their animal goes missing, and it is the field that actually reunites them.
    const { service, created } = build()

    await service.create(OWNER, { kind: 'lost', species: '', petId: PET_ID })

    expect(created[0]).toMatchObject({
      petId: PET_ID,
      petName: 'Biscuit',
      species: 'dog',
      breed: 'Beagle',
      color: 'tricolour',
      sex: 'male',
      microchipId: '900123456789',
      photoUrl: 'https://cdn.example/biscuit.jpg',
      neutered: true,
    })
  })

  it('lets anything typed in the form override the profile', async () => {
    // Colour can legitimately differ from the profile — a summer clip, or the
    // owner realising the profile was wrong. The form is the fresher signal.
    const { service, created } = build()

    await service.create(OWNER, {
      kind: 'lost', species: 'dog', petId: PET_ID,
      petName: 'Biscuit (now very muddy)', color: 'brown',
    })

    expect(created[0]).toMatchObject({
      petName: 'Biscuit (now very muddy)',
      color: 'brown',
      breed: 'Beagle', // untouched fields still come from the profile
    })
  })

  it('ignores a pet id belonging to someone else', async () => {
    // Otherwise the id would be a way to read another member's pet details.
    const { service, created } = build()

    await service.create(STRANGER, { kind: 'found', species: 'cat', petId: PET_ID })

    expect(created[0]!.petId).toBeUndefined()
    expect(created[0]!.microchipId).toBeUndefined()
    expect(created[0]!.species).toBe('cat')
  })

  it('still files the report when the pet id does not exist', async () => {
    // A bad id must not stop someone reporting a missing animal.
    const { service, created } = build({ pet: null })

    const result = await service.create(OWNER, { kind: 'lost', species: 'dog', petId: 'nope' })

    expect(result.id).toBe('report-1')
    expect(created[0]!.petId).toBeUndefined()
  })

  it('works with no pet id at all — the common found-pet case', async () => {
    const { service, prisma, created } = build()

    await service.create(STRANGER, { kind: 'found', species: 'cat', color: 'tabby' })

    expect(prisma.pet.findFirst).not.toHaveBeenCalled()
    expect(created[0]).toMatchObject({ species: 'cat', color: 'tabby' })
    expect(created[0]!.petId).toBeUndefined()
  })

  it('falls back to "other" when neither the form nor a pet supplies a species', async () => {
    const { service, created } = build({ pet: null })

    await service.create(OWNER, { kind: 'found', species: '' })

    expect(created[0]!.species).toBe('other')
  })
})

describe('LostFoundService.activeForPet', () => {
  it('returns nothing for a pet the caller does not own', async () => {
    const { service, prisma } = build()

    const result = await service.activeForPet(STRANGER, PET_ID)

    expect(result).toEqual([])
    // Must not even reach the reports table — that would leak whether someone
    // else's animal is currently missing.
    expect(prisma.lostFoundPost.findMany).not.toHaveBeenCalled()
  })

  it('queries only active, non-deleted reports for the owner\'s pet', async () => {
    const { service, prisma } = build()

    await service.activeForPet(OWNER, PET_ID)

    expect(prisma.lostFoundPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { petId: PET_ID, isDeleted: false, status: 'active' },
      }),
    )
  })
})
