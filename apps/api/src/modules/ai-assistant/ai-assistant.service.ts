import { Injectable, Logger, Inject, type OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ProfanityService } from '../common/moderation/profanity.service'
import { SUPABASE_ADMIN_CLIENT, type SupabaseAdminClient } from '../database/database.providers'
import { GroqClient, type ChatMessage } from './groq.client'
import { AiRateLimiter } from './rate-limiter'
import { retrieveKnowledge, formatKnowledgeContext } from './retrieve'
import { detectOffLimits, deflectionFor, containsTechLeak, looksHealthUrgent } from './guardrails'
import { PET_TOOLS } from './pet-tools'
import { DISCOVERY_TOOLS, DISCOVERY_TOOL_NAMES } from './discovery-tools'
import { PetToolExecutor } from './pet-tool-executor.service'
import { DiscoveryToolExecutor } from './discovery-tool-executor.service'
import { cleanReply } from './reply-format'
import {
  buildSystemPrompt,
  AI_DISPLAY_NAME,
  GREETING_MESSAGE,
  FALLBACK_MESSAGE,
  UNCONFIGURED_MESSAGE,
  RATE_LIMITED_MESSAGE,
  UNSAFE_REPLY_MESSAGE,
  EMERGENCY_FALLBACK_MESSAGE,
} from './system-prompt'

/**
 * ZoikoSocial AI — the assistant every member has a private thread with.
 *
 * Provisioning note: `profiles.id` is a foreign key onto `auth.users(id)`, so the
 * assistant cannot simply be inserted as a profile row. It is created as a real
 * (never-signed-into) Supabase auth user, which the `on_auth_user_created`
 * trigger turns into a profile row; that row is then updated with the assistant's
 * username, name and verified tier. The whole path is idempotent and safe to run
 * on every boot.
 */

export const AI_USERNAME = 'zoikosocial.ai'
const AI_EMAIL = 'ai@zoikosocial.internal'
const AI_BIO =
  'Your ZoikoSocial assistant 🐾 Ask me anything about the app, your pets, adoption, or animal care.'

/** Prior turns replayed to the model so the conversation has continuity. */
const HISTORY_TURNS = 8
/** Long pastes are truncated rather than rejected — keeps prompt cost bounded. */
const MAX_INPUT_CHARS = 2_000
/**
 * How many tool rounds one message may trigger. Observed in practice: the model
 * often burns a round guessing a pet id before calling list_pets, so allow for
 * that recovery plus the real work. The cap still stops a confused model looping.
 */
const MAX_TOOL_ROUNDS = 5
/** Both tool sets are offered on every turn; the model picks. */
const ASSISTANT_TOOLS = [...PET_TOOLS, ...DISCOVERY_TOOLS]
/** Tool calls per round — a single instruction should never fan out wider than this. */
const MAX_CALLS_PER_ROUND = 4

@Injectable()
export class AiAssistantService implements OnModuleInit {
  private readonly logger = new Logger(AiAssistantService.name)
  private aiProfileId: string | null = null

  constructor(
    private readonly prisma: PrismaService,
    private readonly profanity: ProfanityService,
    private readonly groq: GroqClient,
    private readonly rateLimiter: AiRateLimiter,
    private readonly petTools: PetToolExecutor,
    private readonly discoveryTools: DiscoveryToolExecutor,
    @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseAdminClient,
  ) {}

  async onModuleInit(): Promise<void> {
    // Never block or fail boot on assistant provisioning — the rest of the app
    // must come up regardless, with the assistant simply absent.
    try {
      await this.ensureAiProfile()
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      this.logger.warn(`Could not provision ${AI_DISPLAY_NAME} profile: ${reason}`)
    }

    /*
      Say plainly when the assistant cannot actually answer.

      Existing and working are separate things: the profile and its DM thread
      are there whether or not a key is configured, so the log otherwise reads
      as healthy while every reply is the fixed "not quite switched on yet"
      text. Production ran that way long enough to be reported as a bug — "the
      AI gives the same answer to every question", which it does, correctly,
      with no key.

      Here rather than in ensureAiProfile: that returns early on the existing
      profile, so anything logged past that point fires only on the first boot
      of a fresh database and never again.
    */
    if (!this.groq.enabled) {
      this.logger.warn(
        `${AI_DISPLAY_NAME} has no GROQ_API_KEY — every reply will be the "not configured" message`,
      )
    }
  }

  /** The assistant's profile id, or null when it has not been provisioned. */
  getAiProfileId(): string | null {
    return this.aiProfileId
  }

  isAiProfile(profileId: string | null | undefined): boolean {
    return !!profileId && profileId === this.aiProfileId
  }

  get greeting(): string {
    return GREETING_MESSAGE
  }

  /**
   * Finds or creates the assistant's profile. Idempotent: a normal boot finds the
   * existing row and returns after one indexed lookup.
   */
  async ensureAiProfile(): Promise<string | null> {
    const existing = await this.prisma.profile.findUnique({
      where: { username: AI_USERNAME },
      select: { id: true },
    })
    if (existing) {
      this.aiProfileId = existing.id
      return existing.id
    }

    const authUserId = await this.findOrCreateAuthUser()
    if (!authUserId) return null

    // The auth trigger has already inserted a profile row derived from the email;
    // give it the assistant's real identity. Upsert covers the case where the
    // trigger is absent (e.g. a database restored without it).
    const profile = await this.prisma.profile.upsert({
      where: { id: authUserId },
      create: {
        id: authUserId,
        username: AI_USERNAME,
        displayName: AI_DISPLAY_NAME,
        bio: AI_BIO,
        verificationTier: 'professional',
        isPrivate: false,
      },
      update: {
        username: AI_USERNAME,
        displayName: AI_DISPLAY_NAME,
        bio: AI_BIO,
        verificationTier: 'professional',
        isPrivate: false,
      },
      select: { id: true },
    })

    this.aiProfileId = profile.id
    this.logger.log(`${AI_DISPLAY_NAME} profile ready (@${AI_USERNAME})`)

    return profile.id
  }

  /** Creates the assistant's auth user, or recovers its id if it already exists. */
  private async findOrCreateAuthUser(): Promise<string | null> {
    const created = await this.supabase.auth.admin.createUser({
      email: AI_EMAIL,
      email_confirm: true,
      user_metadata: { full_name: AI_DISPLAY_NAME },
    })

    if (created.data?.user?.id) return created.data.user.id

    // Already registered (a previous boot created it but the profile rename did
    // not land) — find it by email so provisioning can complete this time.
    const { data, error } = await this.supabase.auth.admin.listUsers()
    if (error) {
      this.logger.warn(`Could not list auth users: ${error.message}`)
      return null
    }
    const match = data?.users?.find((u) => u.email === AI_EMAIL)
    if (!match) {
      this.logger.warn(`Auth user ${AI_EMAIL} could not be created or found`)
      return null
    }
    return match.id
  }

  /**
   * Produces the assistant's reply to a member's message.
   *
   * Never throws and never returns an empty string — every failure path resolves
   * to a friendly fallback, because this runs inside the message-send flow and
   * must not be able to break it.
   */
  async generateReply(conversationId: string, userId: string, text: string): Promise<string> {
    const input = (text ?? '').trim().slice(0, MAX_INPUT_CHARS)
    if (!input) return FALLBACK_MESSAGE

    // Off-limits questions are answered here, without a model call at all.
    const offLimits = detectOffLimits(input)
    if (offLimits) {
      this.logger.log(`Deflected ${offLimits} question from ${userId}`)
      return deflectionFor(offLimits, input)
    }

    // Whenever a real answer cannot be produced, a possible emergency gets sent to
    // a vet rather than fobbed off. Every failure path below routes through this.
    const failureReply = looksHealthUrgent(input) ? EMERGENCY_FALLBACK_MESSAGE : null

    if (!this.groq.enabled) return failureReply ?? UNCONFIGURED_MESSAGE
    if (!this.rateLimiter.consume(userId)) return failureReply ?? RATE_LIMITED_MESSAGE

    const knowledge = formatKnowledgeContext(retrieveKnowledge(input))
    const history = await this.loadHistory(conversationId)

    const messages: ChatMessage[] = [
      { role: 'system', content: buildSystemPrompt(knowledge) },
      ...history,
      { role: 'user', content: input },
    ]

    const raw = await this.completeWithPetTools(messages, userId)
    // Strips leaked tool syntax and markdown. A reply that was only markup cleans
    // down to nothing, which is correctly treated as no usable reply.
    const reply = cleanReply(raw)
    if (!reply) return failureReply ?? FALLBACK_MESSAGE

    // Last line of defence on generated text: the profanity standard applies to
    // the assistant exactly as it does to members, and implementation detail must
    // not leak even if the model volunteers it.
    const failedScreen = this.profanity.check(reply).blocked
      ? 'profanity'
      : containsTechLeak(reply)
        ? 'tech-leak'
        : null
    if (failedScreen) {
      // Naming the screen matters: a spike in tech-leak means the prompt is
      // slipping, whereas profanity means the model itself misbehaved.
      this.logger.warn(`Generated reply failed outbound screening (${failedScreen}) — substituting fallback`)
      return failureReply ?? UNSAFE_REPLY_MESSAGE
    }

    return reply
  }

  /**
   * Runs the completion, executing any pet tools the model asks for and feeding the
   * results back until it produces prose. The acting user id is fixed to the member
   * whose thread this is, so the model can only ever act on their own pets.
   */
  private async completeWithPetTools(messages: ChatMessage[], userId: string): Promise<string | null> {
    const thread = [...messages]

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const result = await this.groq.completeWithTools(thread, ASSISTANT_TOOLS)
      if (!result) return null

      if (result.toolCalls.length === 0) return result.content

      const calls = result.toolCalls.slice(0, MAX_CALLS_PER_ROUND)
      if (result.toolCalls.length > calls.length) {
        this.logger.warn(
          `Model requested ${result.toolCalls.length} tools in one round; running the first ${calls.length}`,
        )
      }

      // Replay the model's own tool request, then each result, exactly as the
      // chat-completions contract requires.
      thread.push({
        role: 'assistant',
        content: result.content,
        tool_calls: calls.map((c) => ({
          id: c.id,
          type: 'function' as const,
          function: { name: c.name, arguments: c.arguments },
        })),
      })

      for (const call of calls) {
        // Discovery tools only read; pet tools write and carry the ownership checks.
        const executor = DISCOVERY_TOOL_NAMES.has(call.name) ? this.discoveryTools : this.petTools
        const outcome = await executor.run(userId, call.name, call.arguments)
        thread.push({ role: 'tool', tool_call_id: call.id, content: outcome.result })
      }
    }

    // Out of rounds. Ask for prose with the tool results already in context rather
    // than dropping everything the member asked for.
    this.logger.warn(`Tool loop hit ${MAX_TOOL_ROUNDS} rounds for ${userId} — forcing a text reply`)
    return this.groq.complete(thread)
  }

  /** Recent turns of this thread, oldest first, as model-role messages. */
  private async loadHistory(conversationId: string): Promise<ChatMessage[]> {
    try {
      const rows = await this.prisma.message.findMany({
        where: { conversationId, isDeleted: false, body: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: HISTORY_TURNS,
        select: { body: true, senderId: true },
      })

      return rows
        .reverse()
        .filter((m): m is { body: string; senderId: string } => !!m.body)
        .map((m) => ({
          role: this.isAiProfile(m.senderId) ? ('assistant' as const) : ('user' as const),
          content: m.body.slice(0, MAX_INPUT_CHARS),
        }))
    } catch (error) {
      // History is a nicety; a failure here should still yield a reply.
      const reason = error instanceof Error ? error.message : String(error)
      this.logger.warn(`Could not load assistant history: ${reason}`)
      return []
    }
  }
}
