import type { ToolDefinition } from './groq.client'

/**
 * Read-only tools that let the assistant actually find things on the platform
 * instead of describing where to look.
 *
 * Every one of these is a search. Nothing here writes, so unlike the pet tools
 * there is no ownership question to get wrong — but each still runs through the
 * same service the HTTP endpoint uses, with the member's own id as viewer, so
 * visibility rules (private accounts, hidden listings) apply exactly as they do
 * everywhere else.
 *
 * Location note: the assistant runs server-side and has no access to the
 * member's coordinates, so these use text filters. "Near me" is therefore
 * answered by place name rather than distance; the tools say so in their
 * descriptions to stop the model implying it knows where someone is.
 */

const EVENT_CATEGORIES = [
  'adoption_drive', 'vet_camp', 'workshop', 'meetup', 'fundraiser', 'competition',
  'awareness', 'birthday', 'wedding', 'naming_ceremony', 'gotcha_day', 'funeral',
  'farewell', 'playdate', 'other',
] as const

const SPECIES = {
  type: 'string',
  description: 'Animal type to filter by, e.g. Dog, Cat, Bird, Rabbit.',
}

export const DISCOVERY_TOOLS: ToolDefinition[] = [
  {
    name: 'find_providers',
    description:
      "Search vets and pet-care professionals (groomers, trainers, sitters, boarding) listed on ZoikoSocial. Use this whenever someone asks you to find or recommend a vet or service rather than telling them to browse. You cannot filter by distance — pass a place name in `location` if they mention one, and do not imply you know where they are.",
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['vet', 'pet_care'],
          description: "'vet' for veterinary clinics, 'pet_care' for groomers, trainers, sitters and boarding.",
        },
        q: { type: 'string', description: 'Free-text match on name, service or description.' },
        location: { type: 'string', description: 'Place name as the member wrote it, e.g. "Bangalore".' },
        emergency: { type: 'boolean', description: 'Only providers offering emergency care. Use for urgent questions.' },
        species: SPECIES,
      },
      required: ['category'],
    },
  },
  {
    name: 'find_adoption_listings',
    description:
      'Search animals currently listed for adoption or rehoming. Use this when someone asks what is available rather than pointing them at the Adoption page.',
    parameters: {
      type: 'object',
      properties: {
        species: SPECIES,
        q: { type: 'string', description: 'Free-text match, e.g. a breed like "beagle".' },
        listing_type: {
          type: 'string',
          enum: ['adopt', 'sale'],
          description: "'adopt' for rescue and rehoming, 'sale' for listings with a price.",
        },
      },
      required: [],
    },
  },
  {
    name: 'find_events',
    description:
      'Search upcoming pet and animal events — adoption drives, vet camps, workshops, meetups, fundraisers.',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: [...EVENT_CATEGORIES] },
        q: { type: 'string', description: 'Free-text match on title or description.' },
        free_only: { type: 'boolean', description: 'Only events with no ticket price.' },
      },
      required: [],
    },
  },
  {
    name: 'find_lost_found_reports',
    description:
      "Search lost and found animal reports. Use 'lost' when someone is looking for their own missing animal to check whether anyone has reported finding it, and 'found' when they have found one and want to see who is looking.",
    parameters: {
      type: 'object',
      properties: {
        kind: {
          type: 'string',
          enum: ['lost', 'found'],
          description: "'lost' = reports of missing animals, 'found' = reports of animals someone has found.",
        },
        species: SPECIES,
        q: { type: 'string', description: 'Free-text match, e.g. breed or colour.' },
      },
      required: ['kind'],
    },
  },
]

export const DISCOVERY_TOOL_NAMES: ReadonlySet<string> = new Set(DISCOVERY_TOOLS.map((t) => t.name))
