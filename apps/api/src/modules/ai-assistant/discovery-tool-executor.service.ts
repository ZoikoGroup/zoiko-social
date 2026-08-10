import { Injectable, Logger } from '@nestjs/common'
import { ProvidersService } from '../providers/providers.service'
import { AdoptionService } from '../adoption/adoption.service'
import { EventsService } from '../events/events.service'
import { LostFoundService } from '../lost-found/lost-found.service'
import type { ToolOutcome } from './pet-tool-executor.service'

/**
 * Runs the assistant's discovery tools.
 *
 * All read-only, so there is no ownership hazard as there is with pet writes.
 * Each still goes through the same service the HTTP layer uses, passing the
 * member as viewer, so visibility rules apply unchanged.
 *
 * Results are formatted as short lines rather than JSON: the model reads them and
 * writes prose, and terse lines keep the token cost of a search sensible.
 */

type Args = Record<string, unknown>

/** Enough to answer a question, few enough not to flood the model's context. */
const RESULT_LIMIT = 5

function str(args: Args, key: string): string | undefined {
  const v = args[key]
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined
}
function bool(args: Args, key: string): boolean | undefined {
  const v = args[key]
  if (typeof v === 'boolean') return v
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

@Injectable()
export class DiscoveryToolExecutor {
  private readonly logger = new Logger(DiscoveryToolExecutor.name)

  constructor(
    private readonly providers: ProvidersService,
    private readonly adoption: AdoptionService,
    private readonly events: EventsService,
    private readonly lostFound: LostFoundService,
  ) {}

  /** Never throws — a failed search is reported as text so the reply survives. */
  async run(userId: string, name: string, rawArguments: string): Promise<ToolOutcome> {
    let args: Args
    try {
      const parsed: unknown = JSON.parse(rawArguments || '{}')
      args = parsed && typeof parsed === 'object' ? (parsed as Args) : {}
    } catch {
      return { result: 'Error: arguments were not valid JSON.', changed: false }
    }

    try {
      switch (name) {
        case 'find_providers': return await this.findProviders(args)
        case 'find_adoption_listings': return await this.findAdoption(userId, args)
        case 'find_events': return await this.findEvents(userId, args)
        case 'find_lost_found_reports': return await this.findLostFound(args)
        default:
          return { result: `Error: unknown tool "${name}".`, changed: false }
      }
    } catch (error) {
      // Same reasoning as the pet executor: only our own messages are relayed, so
      // a driver error cannot put database detail into the model's context.
      this.logger.warn(`Discovery tool ${name} failed for ${userId}: ${(error as Error).message.slice(0, 200)}`)
      return { result: 'Error: that search could not be completed just now.', changed: false }
    }
  }

  private async findProviders(args: Args): Promise<ToolOutcome> {
    const category = str(args, 'category') === 'pet_care' ? 'pet_care' : 'vet'
    const page = await this.providers.browse(
      category,
      {
        ...(str(args, 'q') ? { q: str(args, 'q')! } : {}),
        ...(str(args, 'location') ? { location: str(args, 'location')! } : {}),
        ...(str(args, 'species') ? { species: str(args, 'species')! } : {}),
        ...(bool(args, 'emergency') !== undefined ? { emergency: bool(args, 'emergency')! } : {}),
      },
      null,
      RESULT_LIMIT,
    )

    if (page.data.length === 0) {
      return { result: `No ${category === 'vet' ? 'vets' : 'pet-care providers'} matched that search.`, changed: false }
    }
    const lines = page.data.map((p) => {
      const bits = [
        p.name,
        p.serviceType ?? null,
        p.location ?? null,
        p.emergencyAvailable ? 'emergency care' : null,
        p.isVerified ? 'verified' : null,
        `link=/vet-finder/${p.id}`,
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    return { result: `Found ${page.data.length}:\n${lines.join('\n')}`, changed: false }
  }

  private async findAdoption(userId: string, args: Args): Promise<ToolOutcome> {
    const page = await this.adoption.browse(
      userId,
      {
        ...(str(args, 'species') ? { species: str(args, 'species')! } : {}),
        ...(str(args, 'q') ? { q: str(args, 'q')! } : {}),
        ...(str(args, 'listing_type') ? { listingType: str(args, 'listing_type')! } : {}),
      },
      null,
      RESULT_LIMIT,
    )

    if (page.data.length === 0) {
      return { result: 'No adoption listings matched that search.', changed: false }
    }
    const lines = page.data.map((l) => {
      const bits = [
        l.name || l.species,
        l.breed ?? null,
        l.age ?? null,
        l.location ?? null,
        `link=/adoption/${l.id}`,
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    return { result: `Found ${page.data.length}:\n${lines.join('\n')}`, changed: false }
  }

  private async findEvents(userId: string, args: Args): Promise<ToolOutcome> {
    const page = await this.events.list(userId, null, RESULT_LIMIT, {
      ...(str(args, 'category') ? { category: str(args, 'category')! } : {}),
      ...(str(args, 'q') ? { q: str(args, 'q')! } : {}),
      ...(bool(args, 'free_only') ? { isFree: true } : {}),
    })

    if (page.data.length === 0) {
      return { result: 'No upcoming events matched that search.', changed: false }
    }
    const lines = page.data.map((e) => {
      const bits = [
        e.title,
        e.startsAt ? e.startsAt.slice(0, 10) : null,
        e.location ?? null,
        `link=/events/${e.id}`,
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    return { result: `Found ${page.data.length}:\n${lines.join('\n')}`, changed: false }
  }

  private async findLostFound(args: Args): Promise<ToolOutcome> {
    const kind = str(args, 'kind') === 'found' ? 'found' : 'lost'
    const page = await this.lostFound.browse(
      {
        kind,
        ...(str(args, 'species') ? { species: str(args, 'species')! } : {}),
        ...(str(args, 'q') ? { q: str(args, 'q')! } : {}),
      },
      null,
      RESULT_LIMIT,
    )

    if (page.data.length === 0) {
      return { result: `No ${kind} reports matched that search.`, changed: false }
    }
    const lines = page.data.map((r) => {
      const bits = [
        r.petName ?? r.species,
        r.breed ?? null,
        r.color ?? null,
        r.lastSeenLocation ?? null,
        `link=/lost-found/${r.id}`,
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    return { result: `Found ${page.data.length} ${kind} report(s):\n${lines.join('\n')}`, changed: false }
  }
}
