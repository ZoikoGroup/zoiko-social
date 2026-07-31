import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { PetToolExecutor } from './pet-tool-executor.service'
import { birthdateFromAgeYears, PET_TOOLS, PET_TOOL_NAMES } from './pet-tools'
import type { PetsService } from '../pets/pets.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'
import type { RealtimeService } from '../realtime/realtime.service'

const USER = 'user-1'
const PET_ID = '609ea5d8-9416-4783-980f-36350ccb5bf2'
/** Well-formed, but belonging to a different member. */
const OTHER_PET_ID = 'ffffffff-1111-4222-8333-444444444444'

const PET = {
  id: PET_ID,
  ownerId: USER,
  name: 'Luna',
  species: 'Cat',
  breed: 'Domestic Shorthair',
  sex: 'female',
  avatarUrl: null,
  bio: null,
  birthdate: '2018-07-30',
  color: null,
  microchipId: null,
  neutered: null,
  adoptionDate: null,
  isPublic: true,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function build(overrides: Partial<Record<string, jest.Mock>> = {}) {
  const pets = {
    listMine: jest.fn().mockResolvedValue([PET]),
    create: jest.fn().mockResolvedValue(PET),
    update: jest.fn().mockResolvedValue(PET),
    addDiary: jest.fn().mockResolvedValue({ id: 'd1' }),
    addHealth: jest.fn().mockResolvedValue({ id: 'h1' }),
    ...overrides,
  }
  const auditLog = { record: jest.fn().mockResolvedValue(undefined) }
  const realtime = { publishToUser: jest.fn().mockResolvedValue(undefined) }
  const executor = new PetToolExecutor(
    pets as unknown as PetsService,
    auditLog as unknown as AuditLogService,
    realtime as unknown as RealtimeService,
  )
  return { executor, pets, auditLog, realtime }
}

describe('PET_TOOLS definitions', () => {
  it('exposes no tool that can delete anything', () => {
    const names = PET_TOOLS.map((t) => t.name).join(' ')
    expect(names).not.toMatch(/delete|remove|destroy/i)
  })

  it('never accepts an owner or user id as an argument', () => {
    // The acting user must come from the session only — a tool that took an owner
    // id would let the model choose whose data to touch.
    for (const tool of PET_TOOLS) {
      const props = Object.keys((tool.parameters as { properties: object }).properties)
      for (const p of props) {
        expect(p).not.toMatch(/^(owner|user)_?id$/i)
      }
    }
  })

  it('keeps PET_TOOL_NAMES in sync with the definitions', () => {
    expect(PET_TOOL_NAMES.size).toBe(PET_TOOLS.length)
    for (const t of PET_TOOLS) expect(PET_TOOL_NAMES.has(t.name)).toBe(true)
  })
})

describe('birthdateFromAgeYears', () => {
  const now = new Date('2026-07-30T12:00:00.000Z')

  it('converts whole years', () => {
    expect(birthdateFromAgeYears(8, now)).toBe('2018-07-30')
  })

  it('converts fractional years to months', () => {
    expect(birthdateFromAgeYears(0.5, now)).toBe('2026-01-30')
  })

  it('handles zero', () => {
    expect(birthdateFromAgeYears(0, now)).toBe('2026-07-30')
  })

  it('rejects nonsense ages', () => {
    expect(birthdateFromAgeYears(-1, now)).toBeNull()
    expect(birthdateFromAgeYears(500, now)).toBeNull()
    expect(birthdateFromAgeYears(NaN, now)).toBeNull()
  })
})

describe('PetToolExecutor — ownership', () => {
  // The security property that matters: the model supplies the pet id, so a pet
  // belonging to someone else must fail closed rather than be written to.
  it('reports a clear failure and writes nothing when the pet is not the caller\'s', async () => {
    const { executor, pets } = build({
      update: jest.fn().mockRejectedValue(
        new ForbiddenException({ code: 'NOT_PET_OWNER', message: 'You can only manage your own pets' }),
      ),
    })

    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: OTHER_PET_ID, name: 'Hacked' }))

    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/does not belong to this member/i)
    expect(pets.update).toHaveBeenCalledWith(OTHER_PET_ID, USER, expect.anything())
  })

  it('always passes the session user id through, never anything from the arguments', async () => {
    const { executor, pets } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, ownerId: 'attacker', userId: 'attacker', name: 'Luna' }))
    expect(pets.update).toHaveBeenCalledWith(PET_ID, USER, { name: 'Luna' })
  })

  it('surfaces a missing pet plainly', async () => {
    const { executor } = build({
      update: jest.fn().mockRejectedValue(new NotFoundException({ code: 'PET_NOT_FOUND', message: 'Pet not found' })),
    })
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: OTHER_PET_ID, name: 'X' }))
    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/no pet with that id/i)
  })
})

describe('PetToolExecutor — update_pet', () => {
  it('converts age_years to an estimated birthdate and flags the approximation', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, age_years: 8 }))

    const patch = pets.update.mock.calls[0][2]
    expect(patch.birthdate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(out.changed).toBe(true)
    expect(out.result).toMatch(/estimated date of birth/i)
  })

  it('prefers an explicit birthdate over an age', async () => {
    const { executor, pets } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, birthdate: '2019-01-15', age_years: 8 }))
    expect(pets.update.mock.calls[0][2].birthdate).toBe('2019-01-15')
  })

  it('maps snake_case tool arguments onto the API field names', async () => {
    const { executor, pets } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({
      pet_id: PET_ID, microchip_id: '900215000123456', adoption_date: '2021-06-01', color: 'Ginger', neutered: true,
    }))
    expect(pets.update.mock.calls[0][2]).toEqual({
      microchipId: '900215000123456', adoptionDate: '2021-06-01', color: 'Ginger', neutered: true,
    })
  })

  it('accepts neutered false as a real value', async () => {
    const { executor, pets } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, neutered: false }))
    expect(pets.update.mock.calls[0][2]).toEqual({ neutered: false })
  })

  it('rejects an invalid date rather than writing it', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, birthdate: '30/07/2018' }))
    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/birthdate/i)
    expect(pets.update).not.toHaveBeenCalled()
  })

  it('requires a pet id', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ name: 'Luna' }))
    expect(out.result).toMatch(/not a valid pet id/i)
    expect(pets.update).not.toHaveBeenCalled()
  })

  it('refuses a call with no recognisable fields', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, nonsense: 'x' }))
    expect(out.changed).toBe(false)
    expect(pets.update).not.toHaveBeenCalled()
  })
})

describe('PetToolExecutor — other tools', () => {
  it('list_pets returns ids and details without changing anything', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'list_pets', '{}')
    expect(out.changed).toBe(false)
    expect(out.result).toContain(`id=${PET_ID}`)
    expect(out.result).toContain('name=Luna')
  })

  it('list_pets handles an empty account', async () => {
    const { executor } = build({ listMine: jest.fn().mockResolvedValue([]) })
    const out = await executor.run(USER, 'list_pets', '{}')
    expect(out.result).toMatch(/no pets/i)
  })

  it('add_pet requires name and species', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'add_pet', JSON.stringify({ name: 'Mia' }))
    expect(out.changed).toBe(false)
    expect(pets.create).not.toHaveBeenCalled()
  })

  it('add_pet creates with the derived birthdate when given an age', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'add_pet', JSON.stringify({ name: 'Mia', species: 'Cat', age_years: 2 }))
    expect(out.changed).toBe(true)
    expect(pets.create.mock.calls[0][1].birthdate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('log_weight stores a weight health record', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'log_weight', JSON.stringify({ pet_id: PET_ID, weight_kg: 4.2 }))
    expect(out.changed).toBe(true)
    expect(pets.addHealth).toHaveBeenCalledWith(PET_ID, USER, expect.objectContaining({ type: 'weight', title: '4.2 kg' }))
  })

  it('log_weight rejects an implausible weight', async () => {
    const { executor, pets } = build()
    for (const w of [0, -3, 5000]) {
      const out = await executor.run(USER, 'log_weight', JSON.stringify({ pet_id: PET_ID, weight_kg: w }))
      expect(out.changed).toBe(false)
    }
    expect(pets.addHealth).not.toHaveBeenCalled()
  })

  it('add_diary_entry needs some content', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'add_diary_entry', JSON.stringify({ pet_id: PET_ID }))
    expect(out.changed).toBe(false)
    expect(pets.addDiary).not.toHaveBeenCalled()
  })

  it('add_health_record saves a vaccination', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'add_health_record', JSON.stringify({
      pet_id: PET_ID, type: 'vaccination', title: 'Rabies booster', next_due: '2027-07-30',
    }))
    expect(out.changed).toBe(true)
    expect(pets.addHealth).toHaveBeenCalledWith(PET_ID, USER, expect.objectContaining({ type: 'vaccination' }))
  })

  it('rejects an unknown health record type', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'add_health_record', JSON.stringify({ pet_id: PET_ID, type: 'surgery', title: 'x' }))
    expect(out.changed).toBe(false)
    expect(pets.addHealth).not.toHaveBeenCalled()
  })
})

describe('PetToolExecutor — audit trail', () => {
  // The platform's doctrine is that every trust-sensitive action is auditable.
  // An assistant writing to member data plainly qualifies.
  it('records an audit entry attributing the change to the member, via the assistant', async () => {
    const { executor, auditLog } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, color: 'Ginger' }))

    expect(auditLog.record).toHaveBeenCalledWith({
      actorId: USER,
      action: 'ai.pet.update',
      entityType: 'pet',
      entityId: PET_ID,
      newData: { fields: { color: 'Ginger' }, via: 'ai_assistant' },
    })
  })

  it.each([
    ['add_pet', { name: 'Mia', species: 'Cat' }, 'ai.pet.create'],
    ['log_weight', { pet_id: PET_ID, weight_kg: 4.2 }, 'ai.pet.weight_log'],
    ['add_diary_entry', { pet_id: PET_ID, body: 'First walk' }, 'ai.pet.diary_add'],
    ['add_health_record', { pet_id: PET_ID, type: 'vaccination', title: 'Rabies' }, 'ai.pet.health_add'],
  ])('audits %s as %s', async (tool, args, action) => {
    const { executor, auditLog } = build()
    await executor.run(USER, tool, JSON.stringify(args))
    expect(auditLog.record).toHaveBeenCalledWith(expect.objectContaining({ actorId: USER, action }))
  })

  it('records a blocked cross-account attempt even though nothing changed', async () => {
    const { executor, auditLog } = build({
      update: jest.fn().mockRejectedValue(
        new ForbiddenException({ code: 'NOT_PET_OWNER', message: 'You can only manage your own pets' }),
      ),
    })

    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: OTHER_PET_ID, name: 'Hacked' }))

    expect(auditLog.record).toHaveBeenCalledWith({
      actorId: USER,
      action: 'ai.pet.access_denied',
      entityType: 'pet',
      entityId: OTHER_PET_ID,
      newData: { tool: 'update_pet', via: 'ai_assistant' },
    })
  })

  it('does not audit reads, or writes that never happened', async () => {
    const { executor, auditLog } = build()
    await executor.run(USER, 'list_pets', '{}')
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: 'unknown', name: 'X' }))
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, birthdate: 'nonsense' }))
    expect(auditLog.record).not.toHaveBeenCalled()
  })
})

describe('PetToolExecutor — live refresh broadcast', () => {
  it('notifies the member so open pages can refresh', async () => {
    const { executor, realtime } = build()
    await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, color: 'Ginger' }))
    expect(realtime.publishToUser).toHaveBeenCalledWith(USER, 'pet:updated', {
      petId: PET_ID,
      action: 'pet.update',
    })
  })

  it('still reports success when the broadcast fails', async () => {
    // The broadcast crosses Redis, which is currently over its quota. A publish
    // failure must never make a write that already succeeded look failed.
    const { executor, realtime } = build()
    realtime.publishToUser.mockRejectedValue(new Error('ERR max requests limit exceeded'))

    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, color: 'Ginger' }))

    expect(out.changed).toBe(true)
    expect(out.result).toMatch(/^Updated Luna/)
  })

  it('does not broadcast when nothing changed', async () => {
    const { executor, realtime } = build()
    await executor.run(USER, 'list_pets', '{}')
    expect(realtime.publishToUser).not.toHaveBeenCalled()
  })
})

describe('PetToolExecutor — invented pet ids', () => {
  // Seen live: the model guesses a placeholder id when it skips list_pets. That
  // must never reach Postgres, which would raise a raw driver error and put
  // database detail into the model's context.
  const placeholders = ['unknown', 'my_pet', 'PET_ID_FROM_LIST_PETS_FUNCTION', 'pet-1', '12345', '']

  it.each(placeholders)('rejects %p without touching the database', async (bad) => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: bad, name: 'X' }))

    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/not a valid pet id/i)
    // Phrased so the model's next move is to fetch the real id.
    expect(out.result).toMatch(/list_pets/)
    expect(pets.update).not.toHaveBeenCalled()
  })

  it('guards every tool that takes a pet id, not just update_pet', async () => {
    const { executor, pets } = build()
    const calls: [string, object][] = [
      ['log_weight', { pet_id: 'unknown', weight_kg: 4 }],
      ['add_diary_entry', { pet_id: 'unknown', body: 'hello' }],
      ['add_health_record', { pet_id: 'unknown', type: 'vaccination', title: 'Rabies' }],
    ]
    for (const [tool, args] of calls) {
      const out = await executor.run(USER, tool, JSON.stringify(args))
      expect(out.changed).toBe(false)
      expect(out.result).toMatch(/not a valid pet id/i)
    }
    expect(pets.addHealth).not.toHaveBeenCalled()
    expect(pets.addDiary).not.toHaveBeenCalled()
  })

  it('accepts a real UUID', async () => {
    const { executor, pets } = build()
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, name: 'Luna' }))
    expect(out.changed).toBe(true)
    expect(pets.update).toHaveBeenCalled()
  })
})

describe('PetToolExecutor — malformed model output', () => {
  it('handles arguments that are not valid JSON', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'update_pet', '{not json')
    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/not valid JSON/i)
  })

  it('handles an unknown tool name', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'delete_everything', '{}')
    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/unknown tool/i)
  })

  it('never throws, whatever the service does', async () => {
    const { executor } = build({ update: jest.fn().mockRejectedValue(new Error('db exploded')) })
    await expect(executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, name: 'X' }))).resolves.toEqual(
      expect.objectContaining({ changed: false }),
    )
  })

  it('never leaks a database error into the text handed back to the model', async () => {
    // A driver message names tables and columns, and this string goes into the
    // model's context where it can be quoted to the member.
    const prismaish = new Error(
      'Invalid `prisma.pet.update()` invocation:\nError converting field "id" to UUID. Table public.pets, column id.',
    )
    const { executor } = build({ update: jest.fn().mockRejectedValue(prismaish) })

    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, name: 'X' }))

    expect(out.changed).toBe(false)
    expect(out.result).toBe('Error: the action could not be completed just now')
    for (const leak of ['prisma', 'public.pets', 'column', 'UUID', 'invocation']) {
      expect(out.result.toLowerCase()).not.toContain(leak.toLowerCase())
    }
  })

  it('still relays our own thrown messages, which are written for members', async () => {
    const { executor } = build({
      update: jest.fn().mockRejectedValue({ response: { code: 'SOMETHING_ELSE', message: 'That name is already taken' } }),
    })
    const out = await executor.run(USER, 'update_pet', JSON.stringify({ pet_id: PET_ID, name: 'X' }))
    expect(out.result).toBe('Error: That name is already taken')
  })
})
