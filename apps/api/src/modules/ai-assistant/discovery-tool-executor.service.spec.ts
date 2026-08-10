import { DiscoveryToolExecutor } from './discovery-tool-executor.service'
import { DISCOVERY_TOOLS, DISCOVERY_TOOL_NAMES } from './discovery-tools'
import { PET_TOOLS } from './pet-tools'
import type { ProvidersService } from '../providers/providers.service'
import type { AdoptionService } from '../adoption/adoption.service'
import type { EventsService } from '../events/events.service'
import type { LostFoundService } from '../lost-found/lost-found.service'

const USER = 'member-1'

const PROVIDER = {
  id: 'p1', name: 'City Vet Clinic', serviceType: 'General practice', location: 'Bangalore',
  emergencyAvailable: true, isVerified: true,
}
const LISTING = { id: 'a1', name: 'Rusty', species: 'Dog', breed: 'Beagle', age: '2 yrs', location: 'Pune' }
const EVENT = { id: 'e1', title: 'Adoption Drive', startsAt: '2026-08-15T10:00:00.000Z', location: 'Mumbai' }
const REPORT = { id: 'l1', petName: 'Milo', species: 'Cat', breed: 'Tabby', color: 'Ginger', lastSeenLocation: 'Koramangala' }

function build(overrides: Partial<Record<string, jest.Mock>> = {}) {
  const page = <T,>(data: T[]) => ({ data, nextCursor: null, hasMore: false })
  const providers = { browse: overrides.browseProviders ?? jest.fn().mockResolvedValue(page([PROVIDER])) }
  const adoption = { browse: overrides.browseAdoption ?? jest.fn().mockResolvedValue(page([LISTING])) }
  const events = { list: overrides.listEvents ?? jest.fn().mockResolvedValue(page([EVENT])) }
  const lostFound = { browse: overrides.browseLostFound ?? jest.fn().mockResolvedValue(page([REPORT])) }

  const executor = new DiscoveryToolExecutor(
    providers as unknown as ProvidersService,
    adoption as unknown as AdoptionService,
    events as unknown as EventsService,
    lostFound as unknown as LostFoundService,
  )
  return { executor, providers, adoption, events, lostFound }
}

describe('DISCOVERY_TOOLS definitions', () => {
  it('is read-only — no tool can create, change or delete anything', () => {
    const names = DISCOVERY_TOOLS.map((t) => t.name).join(' ')
    expect(names).not.toMatch(/create|add|update|delete|remove|book|send/i)
    expect(DISCOVERY_TOOLS.every((t) => t.name.startsWith('find_'))).toBe(true)
  })

  it('does not collide with the pet tool names', () => {
    // The service routes by name, so an overlap would send a call to the wrong executor.
    const petNames = new Set(PET_TOOLS.map((t) => t.name))
    for (const t of DISCOVERY_TOOLS) expect(petNames.has(t.name)).toBe(false)
  })

  it('keeps DISCOVERY_TOOL_NAMES in sync', () => {
    expect(DISCOVERY_TOOL_NAMES.size).toBe(DISCOVERY_TOOLS.length)
    for (const t of DISCOVERY_TOOLS) expect(DISCOVERY_TOOL_NAMES.has(t.name)).toBe(true)
  })

  it('never takes a user or owner id — results are scoped by the session, not by argument', () => {
    for (const tool of DISCOVERY_TOOLS) {
      for (const p of Object.keys((tool.parameters as { properties: object }).properties)) {
        expect(p).not.toMatch(/^(owner|user|viewer)_?id$/i)
      }
    }
  })

  it('tells the model it cannot filter by distance', () => {
    // The assistant runs server-side with no coordinates; without this the model
    // implies it knows where the member is.
    const providers = DISCOVERY_TOOLS.find((t) => t.name === 'find_providers')
    expect(providers?.description).toMatch(/distance|place name/i)
  })
})

describe('find_providers', () => {
  it('summarises matches with a link', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_providers', JSON.stringify({ category: 'vet' }))

    expect(out.changed).toBe(false)
    expect(out.result).toContain('City Vet Clinic')
    expect(out.result).toContain('Bangalore')
    expect(out.result).toContain('/vet-finder/p1')
  })

  it('passes the text filters through', async () => {
    const { executor, providers } = build()
    await executor.run(USER, 'find_providers', JSON.stringify({
      category: 'pet_care', q: 'grooming', location: 'Bangalore', emergency: true, species: 'Dog',
    }))
    expect(providers.browse).toHaveBeenCalledWith(
      'pet_care',
      { q: 'grooming', location: 'Bangalore', species: 'Dog', emergency: true },
      null, 5,
    )
  })

  it('defaults an unrecognised category to vet rather than failing', async () => {
    const { executor, providers } = build()
    await executor.run(USER, 'find_providers', JSON.stringify({ category: 'nonsense' }))
    expect(providers.browse.mock.calls[0][0]).toBe('vet')
  })

  it('reports no matches plainly', async () => {
    const { executor } = build({ browseProviders: jest.fn().mockResolvedValue({ data: [], nextCursor: null, hasMore: false }) })
    const out = await executor.run(USER, 'find_providers', JSON.stringify({ category: 'vet' }))
    expect(out.result).toMatch(/no vets matched/i)
  })

  it('surfaces emergency availability, which is the point of asking urgently', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_providers', JSON.stringify({ category: 'vet', emergency: true }))
    expect(out.result).toContain('emergency care')
  })
})

describe('find_adoption_listings', () => {
  it('searches as the member, so visibility rules apply', async () => {
    const { executor, adoption } = build()
    await executor.run(USER, 'find_adoption_listings', JSON.stringify({ species: 'Dog', q: 'beagle' }))
    expect(adoption.browse).toHaveBeenCalledWith(USER, { species: 'Dog', q: 'beagle' }, null, 5)
  })

  it('summarises a listing', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_adoption_listings', '{}')
    expect(out.result).toContain('Rusty')
    expect(out.result).toContain('Beagle')
    expect(out.result).toContain('/adoption/a1')
  })
})

describe('find_events', () => {
  it('searches as the member and maps free_only', async () => {
    const { executor, events } = build()
    await executor.run(USER, 'find_events', JSON.stringify({ category: 'adoption_drive', free_only: true }))
    expect(events.list).toHaveBeenCalledWith(USER, null, 5, { category: 'adoption_drive', isFree: true })
  })

  it('shows the date as a plain day', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_events', '{}')
    expect(out.result).toContain('2026-08-15')
    expect(out.result).not.toContain('T10:00')
  })
})

describe('find_lost_found_reports', () => {
  it('defaults to lost reports', async () => {
    const { executor, lostFound } = build()
    await executor.run(USER, 'find_lost_found_reports', '{}')
    expect(lostFound.browse.mock.calls[0][0].kind).toBe('lost')
  })

  it('searches found reports when asked', async () => {
    const { executor, lostFound } = build()
    await executor.run(USER, 'find_lost_found_reports', JSON.stringify({ kind: 'found', species: 'Cat' }))
    expect(lostFound.browse).toHaveBeenCalledWith({ kind: 'found', species: 'Cat' }, null, 5)
  })

  it('includes the identifying details someone would match against', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_lost_found_reports', JSON.stringify({ kind: 'lost' }))
    expect(out.result).toContain('Milo')
    expect(out.result).toContain('Ginger')
    expect(out.result).toContain('Koramangala')
  })
})

describe('DiscoveryToolExecutor — failures', () => {
  it('handles malformed arguments', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_providers', '{not json')
    expect(out.changed).toBe(false)
    expect(out.result).toMatch(/not valid JSON/i)
  })

  it('rejects an unknown tool', async () => {
    const { executor } = build()
    const out = await executor.run(USER, 'find_nuclear_codes', '{}')
    expect(out.result).toMatch(/unknown tool/i)
  })

  it('never leaks a database error into the model context', async () => {
    const { executor } = build({
      browseProviders: jest.fn().mockRejectedValue(
        new Error('Invalid `prisma.serviceProvider.findMany()` — table public.service_providers'),
      ),
    })
    const out = await executor.run(USER, 'find_providers', JSON.stringify({ category: 'vet' }))

    expect(out.result).toBe('Error: that search could not be completed just now.')
    for (const leak of ['prisma', 'public.service_providers', 'findMany']) {
      expect(out.result.toLowerCase()).not.toContain(leak.toLowerCase())
    }
  })

  it('never reports changed:true — nothing here writes', async () => {
    const { executor } = build()
    for (const tool of DISCOVERY_TOOLS) {
      const out = await executor.run(USER, tool.name, JSON.stringify({ category: 'vet', kind: 'lost' }))
      expect(out.changed).toBe(false)
    }
  })
})
