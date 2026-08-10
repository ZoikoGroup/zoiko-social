import { Injectable, Logger } from '@nestjs/common'
import { PetsService } from '../pets/pets.service'
import { CreatePetSchema, UpdatePetSchema, CreateDiaryEntrySchema, CreateHealthRecordSchema } from '../pets/pets.schemas'
import { AuditLogService } from '../common/audit-log/audit-log.service'
import { RealtimeService } from '../realtime/realtime.service'
import { birthdateFromAgeYears } from './pet-tools'
import { ageOf } from './age'

/**
 * Runs the assistant's pet tools against PetsService.
 *
 * The `userId` passed in comes from the authenticated session. Nothing the model
 * produces can influence whose data is touched: every mutation below goes through
 * PetsService, whose write methods each call assertOwner, so a pet id belonging to
 * another member fails closed. Arguments are re-validated with the same Zod
 * schemas the HTTP layer uses — the model's JSON is treated as untrusted input.
 *
 * Every result is a short string fed back to the model as the tool's output, and
 * `changed` records what actually happened for logging and for the reply text.
 */

export interface ToolOutcome {
  /** Text handed back to the model. Kept human-readable so it can quote it. */
  result: string
  /** True when data was actually written — used for audit logging. */
  changed: boolean
}

type Args = Record<string, unknown>

/**
 * Pet ids are UUIDs. Models reliably invent placeholders ("unknown",
 * "PET_ID_FROM_LIST_PETS") when they skip list_pets, and passing one straight to
 * Postgres produces a raw driver error — ugly, and it would put database detail
 * into the model's context. Checking the shape first keeps the failure clean.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isPetId(value: string | undefined): value is string {
  return !!value && UUID.test(value)
}

/** Phrased as an instruction so the model's next move is to fetch the real id. */
const BAD_ID =
  'Error: that is not a valid pet id. Call list_pets to get the real id, then try again with it.'

function str(args: Args, key: string): string | undefined {
  const v = args[key]
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined
}
function num(args: Args, key: string): number | undefined {
  const v = args[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  return undefined
}
function bool(args: Args, key: string): boolean | undefined {
  const v = args[key]
  if (typeof v === 'boolean') return v
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

@Injectable()
export class PetToolExecutor {
  private readonly logger = new Logger(PetToolExecutor.name)

  constructor(
    private readonly pets: PetsService,
    private readonly auditLog: AuditLogService,
    private readonly realtime: RealtimeService,
  ) {}

  /**
   * Records an assistant-driven write and nudges the member's open tabs.
   *
   * The actor is the member, not the assistant — they instructed the change and it
   * happened under their own permissions. `via: 'ai_assistant'` is what
   * distinguishes it from a manual edit in the UI when reading the trail back.
   *
   * The broadcast is deliberately fire-and-forget: it crosses Redis, and a
   * publish failure (an exhausted quota, say) must never make a write that
   * already succeeded look like it failed to the member.
   */
  private async recordWrite(
    userId: string,
    action: string,
    petId: string | null,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.auditLog.record({
      actorId: userId,
      action: `ai.${action}`,
      entityType: 'pet',
      entityId: petId,
      newData: { ...data, via: 'ai_assistant' },
    })
    void this.realtime
      .publishToUser(userId, 'pet:updated', { petId, action })
      .catch(() => { /* best-effort: the write already stands */ })
  }

  /**
   * Executes one tool call. Never throws — a failure is returned as text so the
   * model can explain it to the member instead of the reply collapsing.
   */
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
        case 'list_pets': return await this.listPets(userId)
        case 'update_pet': return await this.updatePet(userId, args)
        case 'add_pet': return await this.addPet(userId, args)
        case 'log_weight': return await this.logWeight(userId, args)
        case 'add_diary_entry': return await this.addDiaryEntry(userId, args)
        case 'add_health_record': return await this.addHealthRecord(userId, args)
        default:
          return { result: `Error: unknown tool "${name}".`, changed: false }
      }
    } catch (error) {
      // Ownership failures land here as NOT_PET_OWNER and are reported plainly.
      const message = this.describeError(error)
      this.logger.warn(`Tool ${name} failed for ${userId}: ${message}`)
      // A blocked attempt to reach another member's pet is worth a trail of its
      // own — nothing changed, but someone tried, and that is worth being able
      // to look up later.
      if (this.isOwnershipDenial(error)) {
        await this.auditLog.record({
          actorId: userId,
          action: 'ai.pet.access_denied',
          entityType: 'pet',
          entityId: str(args, 'pet_id') ?? null,
          newData: { tool: name, via: 'ai_assistant' },
        })
      }
      return { result: `Error: ${message}`, changed: false }
    }
  }

  private async listPets(userId: string): Promise<ToolOutcome> {
    const pets = await this.pets.listMine(userId)
    if (pets.length === 0) {
      return { result: 'This member has no pets on their account yet.', changed: false }
    }
    const lines = pets.map((p) => {
      const bits = [
        `id=${p.id}`,
        `name=${p.name}`,
        `species=${p.species}`,
        p.breed ? `breed=${p.breed}` : null,
        p.sex ? `sex=${p.sex}` : null,
        p.birthdate ? `birthdate=${p.birthdate} (age ${ageOf(p.birthdate)})` : 'birthdate=not set',
        p.color ? `colour=${p.color}` : null,
        p.microchipId ? `microchip=${p.microchipId}` : null,
        p.neutered === null ? null : `neutered=${p.neutered ? 'yes' : 'no'}`,
        p.adoptionDate ? `adopted=${p.adoptionDate}` : null,
      ].filter(Boolean)
      return bits.join(', ')
    })
    return { result: `Pets (${pets.length}):\n${lines.join('\n')}`, changed: false }
  }

  private async updatePet(userId: string, args: Args): Promise<ToolOutcome> {
    const petId = str(args, 'pet_id')
    if (!isPetId(petId)) return { result: BAD_ID, changed: false }

    const { patch, notes } = this.buildPetFields(args)
    if (Object.keys(patch).length === 0) {
      return { result: 'Error: no recognised fields to change were supplied.', changed: false }
    }

    const validated = UpdatePetSchema.safeParse(patch)
    if (!validated.success) {
      return { result: `Error: ${this.describeZod(validated.error)}`, changed: false }
    }

    const pet = await this.pets.update(petId, userId, validated.data)
    const summary = Object.keys(validated.data).join(', ')
    this.logger.log(`AI updated pet ${petId} for ${userId}: ${summary}`)
    await this.recordWrite(userId, 'pet.update', petId, { fields: validated.data })
    return {
      result: `Updated ${pet.name}. Fields now: ${this.describePet(pet)}.${notes ? ` Note: ${notes}` : ''}`,
      changed: true,
    }
  }

  private async addPet(userId: string, args: Args): Promise<ToolOutcome> {
    const name = str(args, 'name')
    const species = str(args, 'species')
    if (!name || !species) {
      return { result: 'Error: both name and species are required to add a pet.', changed: false }
    }

    const { patch, notes } = this.buildPetFields(args)
    const validated = CreatePetSchema.safeParse({ ...patch, name, species })
    if (!validated.success) {
      return { result: `Error: ${this.describeZod(validated.error)}`, changed: false }
    }

    const pet = await this.pets.create(userId, validated.data)
    this.logger.log(`AI added pet ${pet.id} for ${userId}`)
    await this.recordWrite(userId, 'pet.create', pet.id, { name: pet.name, species: pet.species })
    return {
      result: `Added ${pet.name} (id=${pet.id}). ${this.describePet(pet)}.${notes ? ` Note: ${notes}` : ''}`,
      changed: true,
    }
  }

  private async logWeight(userId: string, args: Args): Promise<ToolOutcome> {
    const petId = str(args, 'pet_id')
    const weight = num(args, 'weight_kg')
    if (!isPetId(petId)) return { result: BAD_ID, changed: false }
    if (weight === undefined || weight <= 0 || weight > 1000) {
      return { result: 'Error: weight_kg must be a positive number of kilograms.', changed: false }
    }

    const input = {
      type: 'weight' as const,
      title: `${weight} kg`,
      ...(str(args, 'date') ? { recordDate: str(args, 'date')! } : {}),
    }
    const validated = CreateHealthRecordSchema.safeParse(input)
    if (!validated.success) {
      return { result: `Error: ${this.describeZod(validated.error)}`, changed: false }
    }

    await this.pets.addHealth(petId, userId, validated.data)
    this.logger.log(`AI logged weight for pet ${petId} (${userId})`)
    await this.recordWrite(userId, 'pet.weight_log', petId, { weightKg: weight })
    return { result: `Logged ${weight} kg. It now appears on the weight chart.`, changed: true }
  }

  private async addDiaryEntry(userId: string, args: Args): Promise<ToolOutcome> {
    const petId = str(args, 'pet_id')
    if (!isPetId(petId)) return { result: BAD_ID, changed: false }

    const title = str(args, 'title')
    const body = str(args, 'body')
    if (!title && !body) {
      return { result: 'Error: a diary entry needs a title or some text.', changed: false }
    }

    const validated = CreateDiaryEntrySchema.safeParse({
      ...(title ? { title } : {}),
      ...(body ? { body } : {}),
      ...(str(args, 'kind') ? { kind: str(args, 'kind') } : {}),
      ...(str(args, 'date') ? { entryDate: str(args, 'date')! } : {}),
    })
    if (!validated.success) {
      return { result: `Error: ${this.describeZod(validated.error)}`, changed: false }
    }

    await this.pets.addDiary(petId, userId, validated.data)
    this.logger.log(`AI added diary entry for pet ${petId} (${userId})`)
    await this.recordWrite(userId, 'pet.diary_add', petId, { kind: validated.data.kind ?? 'note' })
    return { result: 'Diary entry saved.', changed: true }
  }

  private async addHealthRecord(userId: string, args: Args): Promise<ToolOutcome> {
    const petId = str(args, 'pet_id')
    const type = str(args, 'type')
    const title = str(args, 'title')
    if (!isPetId(petId)) return { result: BAD_ID, changed: false }
    if (!type || !title) {
      return { result: 'Error: both type and title are required.', changed: false }
    }

    const validated = CreateHealthRecordSchema.safeParse({
      type,
      title,
      ...(str(args, 'notes') ? { notes: str(args, 'notes')! } : {}),
      ...(str(args, 'record_date') ? { recordDate: str(args, 'record_date')! } : {}),
      ...(str(args, 'next_due') ? { nextDue: str(args, 'next_due')! } : {}),
    })
    if (!validated.success) {
      return { result: `Error: ${this.describeZod(validated.error)}`, changed: false }
    }

    await this.pets.addHealth(petId, userId, validated.data)
    this.logger.log(`AI added ${type} record for pet ${petId} (${userId})`)
    await this.recordWrite(userId, 'pet.health_add', petId, { type, title })
    return { result: `Saved a ${type.replace('_', ' ')} record: ${title}.`, changed: true }
  }

  /**
   * Shared field mapping for add/update. Returns the patch plus any caveat the
   * reply should mention (an age converts to an approximate birthdate).
   */
  private buildPetFields(args: Args): { patch: Record<string, unknown>; notes: string | null } {
    const patch: Record<string, unknown> = {}
    let notes: string | null = null

    const simple: [string, string][] = [
      ['name', 'name'], ['breed', 'breed'], ['sex', 'sex'], ['color', 'color'],
      ['microchip_id', 'microchipId'], ['bio', 'bio'],
      ['birthdate', 'birthdate'], ['adoption_date', 'adoptionDate'],
    ]
    for (const [from, to] of simple) {
      const v = str(args, from)
      if (v !== undefined) patch[to] = v
    }

    const neutered = bool(args, 'neutered')
    if (neutered !== undefined) patch['neutered'] = neutered

    // An age is only ever an estimate, so never let it overwrite a real date.
    const age = num(args, 'age_years')
    if (age !== undefined && patch['birthdate'] === undefined) {
      const derived = birthdateFromAgeYears(age)
      if (derived) {
        patch['birthdate'] = derived
        notes = `age ${age} was stored as an estimated date of birth of ${derived}; an exact date can be set in the pet's Edit form`
      }
    }

    return { patch, notes }
  }

  private describePet(pet: {
    name: string; species: string; breed: string | null; sex: string | null
    birthdate: string | null; color: string | null; microchipId: string | null
    neutered: boolean | null; adoptionDate: string | null
  }): string {
    const bits = [
      `species ${pet.species}`,
      pet.breed ? `breed ${pet.breed}` : null,
      pet.sex ? `sex ${pet.sex}` : null,
      pet.birthdate ? `born ${pet.birthdate} (age ${ageOf(pet.birthdate)})` : null,
      pet.color ? `colour ${pet.color}` : null,
      pet.microchipId ? `microchip ${pet.microchipId}` : null,
      pet.neutered === null ? null : `neutered ${pet.neutered ? 'yes' : 'no'}`,
      pet.adoptionDate ? `adopted ${pet.adoptionDate}` : null,
    ].filter(Boolean)
    return bits.join(', ')
  }

  private describeZod(error: { issues: { path: (string | number)[]; message: string }[] }): string {
    const first = error.issues[0]
    if (!first) return 'the values supplied were not valid'
    const field = first.path.join('.')
    return field ? `${field} — ${first.message}` : first.message
  }

  private isOwnershipDenial(error: unknown): boolean {
    const response = (error as { response?: { code?: string } })?.response
    return response?.code === 'NOT_PET_OWNER'
  }

  /**
   * Turns a Nest exception into something the model can relay verbatim.
   *
   * Only our own thrown messages are passed through. Anything else — a Prisma
   * driver error, a connection failure — is replaced with a generic line: those
   * messages carry table names, SQL and stack detail, and this string goes
   * straight into the model's context and can end up quoted to the member.
   */
  private describeError(error: unknown): string {
    const response = (error as { response?: unknown })?.response
    if (response && typeof response === 'object') {
      const code = (response as { code?: string }).code
      if (code === 'NOT_PET_OWNER') return 'that pet does not belong to this member, so nothing was changed'
      if (code === 'PET_NOT_FOUND') return 'no pet with that id exists'
      const message = (response as { message?: string }).message
      if (message) return message.slice(0, 200)
    }
    this.logger.warn(
      `Unexpected tool error: ${(error instanceof Error ? error.message : String(error)).slice(0, 300)}`,
    )
    return 'the action could not be completed just now'
  }
}
