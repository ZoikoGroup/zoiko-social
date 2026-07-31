import type { ToolDefinition } from './groq.client'

/**
 * Pet actions the assistant may take on behalf of the member it is talking to.
 *
 * Two rules hold for every tool here:
 *   1. The acting user id comes from the authenticated session, never from the
 *      model. A tool argument can name a pet, never an owner.
 *   2. Execution goes through PetsService, whose mutations all call assertOwner.
 *      So a hallucinated or guessed petId belonging to someone else fails as
 *      NOT_PET_OWNER rather than writing to a stranger's pet.
 *
 * Deletion is deliberately absent: nothing here can destroy a pet, a diary entry
 * or a health record. Losing a pet's history to a misread instruction is not an
 * acceptable failure mode, so removal stays a deliberate action in the UI.
 */

const SEX_VALUES = ['male', 'female', 'unknown'] as const
const HEALTH_TYPES = ['vaccination', 'vet_visit', 'medication', 'allergy', 'weight', 'note'] as const

const PET_ID = {
  type: 'string',
  description:
    "The pet's id — a UUID exactly as returned by list_pets. Never invent or guess this, and never use a placeholder: if you do not already have the real id from list_pets, call list_pets first and wait for the result.",
}

const DATE = {
  type: 'string',
  description: 'Date in YYYY-MM-DD format.',
}

export const PET_TOOLS: ToolDefinition[] = [
  {
    name: 'list_pets',
    description:
      "List the member's own pets with their ids and current details. Call this before any update so you use the right pet id, and to check whether a name they mention is ambiguous.",
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'update_pet',
    description:
      "Change details on one of the member's pets. Only include the fields being changed. Use age_years when they give an age like '8 years old'; use birthdate when they give an actual date.",
    parameters: {
      type: 'object',
      properties: {
        pet_id: PET_ID,
        name: { type: 'string', description: "The pet's name." },
        breed: { type: 'string' },
        sex: { type: 'string', enum: [...SEX_VALUES] },
        color: { type: 'string', description: 'Colour and markings, free text.' },
        microchip_id: { type: 'string' },
        neutered: { type: 'boolean', description: 'Whether the pet is neutered or spayed.' },
        birthdate: DATE,
        age_years: {
          type: 'number',
          description:
            'Approximate age in years. Stored as a birthdate this many years before today, so it is an estimate — say so when confirming.',
        },
        adoption_date: DATE,
        bio: { type: 'string', description: 'Short about text for the pet.' },
      },
      required: ['pet_id'],
    },
  },
  {
    name: 'add_pet',
    description: "Add a new pet to the member's account.",
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        species: { type: 'string', description: 'e.g. Dog, Cat, Bird, Rabbit.' },
        breed: { type: 'string' },
        sex: { type: 'string', enum: [...SEX_VALUES] },
        color: { type: 'string' },
        birthdate: DATE,
        age_years: { type: 'number', description: 'Use when an age is given instead of a date.' },
        bio: { type: 'string' },
      },
      required: ['name', 'species'],
    },
  },
  {
    name: 'log_weight',
    description:
      "Record a weight for one of the member's pets. Weights build the growth chart in Pet Diary and Health Passport.",
    parameters: {
      type: 'object',
      properties: {
        pet_id: PET_ID,
        weight_kg: { type: 'number', description: 'Weight in kilograms.' },
        date: DATE,
      },
      required: ['pet_id', 'weight_kg'],
    },
  },
  {
    name: 'add_diary_entry',
    description: "Add an entry to one of the member's pet diaries.",
    parameters: {
      type: 'object',
      properties: {
        pet_id: PET_ID,
        title: { type: 'string' },
        body: { type: 'string', description: 'What happened.' },
        kind: { type: 'string', enum: ['note', 'milestone', 'photo', 'checkup'] },
        date: DATE,
      },
      required: ['pet_id'],
    },
  },
  {
    name: 'add_health_record',
    description:
      "Add a health record — a vaccination, vet visit, medication, allergy or note — to one of the member's pets. For weights use log_weight instead.",
    parameters: {
      type: 'object',
      properties: {
        pet_id: PET_ID,
        type: { type: 'string', enum: [...HEALTH_TYPES] },
        title: { type: 'string', description: 'Short label, e.g. "Rabies booster".' },
        notes: { type: 'string' },
        record_date: DATE,
        next_due: { type: 'string', description: 'When it is next due, YYYY-MM-DD.' },
      },
      required: ['pet_id', 'type', 'title'],
    },
  },
]

export const PET_TOOL_NAMES: ReadonlySet<string> = new Set(PET_TOOLS.map((t) => t.name))

/** Converts an age in years to an approximate birthdate, as YYYY-MM-DD. */
export function birthdateFromAgeYears(ageYears: number, now: Date = new Date()): string | null {
  if (!Number.isFinite(ageYears) || ageYears < 0 || ageYears > 200) return null
  const d = new Date(now.getTime())
  const whole = Math.floor(ageYears)
  const months = Math.round((ageYears - whole) * 12)
  d.setFullYear(d.getFullYear() - whole)
  if (months > 0) d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}
