import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { accountStateCache } from '../auth/account-state-cache'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { AuditLogService } from '../common/audit-log/audit-log.service'
import { ProfanityService } from '../common/moderation/profanity.service'
import { AuthService } from '../auth/auth.service'
import { ConfigService } from '../config/config.service'
import { SupabaseStorageService, VERIFICATION_BUCKET } from '../storage/supabase-storage.service'
import { ProfessionalCategory, VerificationRequestStatus } from '@prisma/client'
import { z } from 'zod'
import { httpUrl } from '../common/schemas/http-url'

// ── Validation Schemas ─────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional().nullable(),
  websiteUrl: httpUrl(200).optional().nullable(),
  avatarUrl: httpUrl(500).optional().nullable(),
  bannerUrl: httpUrl(500).optional().nullable(),
  isPrivate: z.boolean().optional(),
  username: z.string().min(3).max(30).optional(),
  currency: z.string().trim().min(2).max(8).optional(),
})

/**
 * Asks the platform's own zone database rather than pattern-matching the name.
 * "Europe/Atlantis" has the right shape and does not exist; a member who saved
 * it would have quiet hours that throw when the window is next evaluated.
 */
function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value })
    return true
  } catch {
    return false
  }
}

export const UpdateSettingsSchema = z.object({
  // Privacy toggles
  showLastActive: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  allowTagging: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  allowMessaging: z.enum(['everyone', 'connections', 'none']).optional(),

  // Notification preferences
  notifLikes: z.boolean().optional(),
  notifComments: z.boolean().optional(),
  notifFollows: z.boolean().optional(),
  notifMentions: z.boolean().optional(),
  notifEvents: z.boolean().optional(),
  notifCommunities: z.boolean().optional(),
  notifNews: z.boolean().optional(),
  notifPromotions: z.boolean().optional(),
  notifMessages: z.boolean().optional(),
  notifAdoption: z.boolean().optional(),
  notifAccountGuidance: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  emailMarketing: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),

  // Quiet hours (§06), as minutes past local midnight. Bounded here as well as
  // by the database check, so a bad value is a 400 naming the field rather than
  // a constraint violation surfacing as a 500.
  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.number().int().min(0).max(1439).optional(),
  quietHoursEnd: z.number().int().min(0).max(1439).optional(),
  // Validated against the runtime's own zone database rather than a regex, so
  // an accepted value is one the formatter can actually use.
  timezone: z
    .string()
    .refine(isValidTimeZone, { message: 'Must be an IANA time zone name, e.g. Europe/London' })
    .optional(),

  // Display preferences
  reducedMotion: z.boolean().optional(),
  compactView: z.boolean().optional(),
})

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>

export const SwitchProfessionalSchema = z.object({
  category: z.nativeEnum(ProfessionalCategory),
  businessName: z.string().min(1).max(100).optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().max(20).optional(),
  businessAddress: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  websiteUrl: httpUrl(200).optional().nullable(),
  serviceAreas: z.array(z.string()).optional(),
  businessHours: z.record(z.any()).optional(),
  licenseNumber: z.string().max(100).optional(),
})

export const UpdateProfessionalSchema = z.object({
  businessName: z.string().min(1).max(100).optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().max(20).optional(),
  businessAddress: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  websiteUrl: httpUrl(200).optional().nullable(),
  serviceAreas: z.array(z.string()).optional(),
  businessHours: z.record(z.any()).optional(),
  availableForBooking: z.boolean().optional(),
})

export const SubmitVerificationSchema = z.object({
  type: z.enum(['professional', 'identity', 'organization']),
  categorySlug: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type SwitchProfessionalInput = z.infer<typeof SwitchProfessionalSchema>
export type UpdateProfessionalInput = z.infer<typeof UpdateProfessionalSchema>
export type SubmitVerificationInput = z.infer<typeof SubmitVerificationSchema>

// ── Prisma Payload Types ───────────────────────────────────────────────────

type ProfileWithProfessional = Prisma.ProfileGetPayload<{
  include: { professionalProfile: true }
}>

type ProfessionalProfileRecord = Prisma.ProfessionalProfileGetPayload<Record<string, never>>

const VERIFICATION_REQUEST_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const

type VerificationRequestWithDocs = Prisma.VerificationRequestGetPayload<{
  include: { documents: true; user: { select: typeof VERIFICATION_REQUEST_USER_SELECT } }
}>

// ── Profile Response Types ─────────────────────────────────────────────────

export interface ProfileResponse {
  id: string
  username: string
  displayName: string
  firstName: string | null
  lastName: string | null
  bio: string | null
  city: string | null
  avatarUrl: string | null
  bannerUrl: string | null
  websiteUrl: string | null
  state: string
  role: string
  verificationTier: string
  isPrivate: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  trustScore: number
  currency: string | null
  usernameChangedAt: string | null
  /** False until the person has been through /onboarding and named themselves. */
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
  /**
   * When this person was last online, or null.
   *
   * Null means "not being shown", and covers three different reasons on
   * purpose: the owner has Show last active off, they have no recorded
   * presence, or they are currently online (in which case `isOnline` carries
   * the information instead). A viewer cannot tell which, so the setting does
   * not leak by its own absence.
   */
  lastActiveAt: string | null
  /** True only when presence says online AND the owner shows last active. */
  isOnline: boolean
  professionalProfile: ProfessionalProfileResponse | null
}

export interface ProfessionalProfileResponse {
  id: string
  category: string
  businessName: string | null
  businessEmail: string | null
  businessPhone: string | null
  businessAddress: string | null
  description: string | null
  websiteUrl: string | null
  logoUrl: string | null
  serviceAreas: string[]
  businessHours: Record<string, unknown> | null
  isVerified: boolean
  verifiedAt: string | null
}

export interface VerificationRequestResponse {
  id: string
  userId: string
  user: { id: string; username: string; displayName: string; avatarUrl: string | null } | null
  type: string
  status: string
  categorySlug: string | null
  notes: string | null
  reviewedBy: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  documents: VerificationDocumentResponse[]
}

export interface VerificationDocumentResponse {
  id: string
  documentType: string
  documentUrl: string
  fileName: string | null
  status: string
  createdAt: string
}

export interface RelationshipResponse {
  following: boolean
  followedBy: boolean
  followBack: boolean
  requested: boolean
  blocked: boolean
  blockedBy: boolean
  muted: boolean
}

// ── Username Rules (Instagram-style) ───────────────────────────────────────

export const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/

export const RESERVED_USERNAMES = new Set([
  'admin', 'administrator', 'root', 'support', 'help', 'moderator', 'mod',
  'zoiko', 'zoikosocial', 'zoikogroup', 'official',
  'api', 'www', 'mail', 'app', 'web', 'dev', 'test', 'staging',
  'login', 'signup', 'register', 'logout', 'auth', 'settings', 'profile',
  'explore', 'notifications', 'messages', 'news', 'events', 'shop', 'adoption',
  'about', 'contact', 'privacy', 'terms', 'security', 'onboarding',
])

export interface UsernameAvailability {
  username: string
  available: boolean
  reason: 'invalid' | 'reserved' | 'taken' | null
}

/**
 * What we ask an OAuth arrival for. No password — they have none — and no email,
 * which the provider already vouched for.
 */
export const CompleteOnboardingSchema = z.object({
  firstName: z.string().trim().min(1).max(40),
  lastName: z.string().trim().max(40).optional(),
  username: z.string().trim().min(3).max(30),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: httpUrl(500).optional().nullable(),
})

export type CompleteOnboardingInput = z.infer<typeof CompleteOnboardingSchema>

// ── Profile Service ────────────────────────────────────────────────────────

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
    private readonly auditLog: AuditLogService,
    private readonly profanity: ProfanityService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly storage: SupabaseStorageService,
  ) {}

  // ── USERNAME AVAILABILITY ─────────────────────────────────────────────────

  /**
   * Instagram-style username validation:
   * 3–30 chars of a-z 0-9 . _ · no leading/trailing/consecutive periods ·
   * not reserved · unique. The signup trigger enforces the same rules.
   */
  async checkUsernameAvailability(raw: string): Promise<UsernameAvailability> {
    const username = (raw ?? '').trim().toLowerCase()

    const invalid =
      !USERNAME_REGEX.test(username) ||
      username.startsWith('.') ||
      username.endsWith('.') ||
      username.includes('..')

    if (invalid) {
      return { username, available: false, reason: 'invalid' }
    }
    if (RESERVED_USERNAMES.has(username)) {
      return { username, available: false, reason: 'reserved' }
    }

    const existing = await this.prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    })
    return { username, available: !existing, reason: existing ? 'taken' : null }
  }

  /**
   * Offer handles built from the name the provider gave us, in descending order
   * of how much they look like a person's own choice. Only available ones come
   * back, so anything the caller shows can be taken without a second round trip.
   */
  async suggestUsernames(firstName: string, lastName: string, limit = 5): Promise<string[]> {
    const first = ProfileService.usernameToken(firstName)
    const last = ProfileService.usernameToken(lastName)

    const raw: string[] = []
    if (first && last) {
      raw.push(`${first}.${last}`, `${first}${last}`, `${first}_${last}`, `${first}.${last.slice(0, 1)}`)
    }
    if (first) raw.push(first)
    if (last) raw.push(last)

    // Numbered variants so a common name can still fill the list.
    const seed = raw[0]
    if (seed) {
      for (let n = 1; n <= limit * 2; n++) raw.push(`${seed.slice(0, 27)}${n}`)
    }

    const candidates = [
      ...new Set(
        raw
          .map((r) => ProfileService.normalizeUsernameCandidate(r))
          .filter((u): u is string => u !== null),
      ),
    ]
    if (candidates.length === 0) return []

    const taken = new Set(
      (
        await this.prisma.profile.findMany({
          where: { username: { in: candidates } },
          select: { username: true },
        })
      ).map((p) => p.username),
    )

    return candidates.filter((u) => !taken.has(u)).slice(0, limit)
  }

  /** Reduce a display name to the letters and digits a handle can be built from. */
  private static usernameToken(raw: string): string {
    return (raw ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // drop accents rather than the letter
      .replace(/[^a-z0-9]/g, '')
  }

  /** Coerce a candidate to a legal handle, or null when nothing legal remains. */
  private static normalizeUsernameCandidate(raw: string): string | null {
    const trimmed = raw
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, '')
      .replace(/\.{2,}/g, '.')
      .slice(0, 30)
      .replace(/^\.+/, '')
      .replace(/\.+$/, '')

    if (!USERNAME_REGEX.test(trimmed)) return null
    if (RESERVED_USERNAMES.has(trimmed)) return null
    return trimmed
  }

  /**
   * The one pass where a new OAuth account names itself. Deliberately NOT
   * updateProfile: that stamps usernameChangedAt and starts the 30-day cooldown,
   * which would spend the user's first rename on replacing a handle they never
   * chose — the trigger derived it from their email address.
   */
  async completeOnboarding(
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<ProfileResponse> {
    const before = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { username: true, onboardingCompletedAt: true },
    })
    if (!before) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }
    if (before.onboardingCompletedAt) {
      throw new ConflictException({
        code: 'ONBOARDING_ALREADY_COMPLETE',
        message: 'Onboarding has already been completed for this account.',
      })
    }

    this.profanity.assertClean(input.firstName, { actorId: userId, entityType: 'profile.firstName' })
    if (input.lastName) {
      this.profanity.assertClean(input.lastName, { actorId: userId, entityType: 'profile.lastName' })
    }
    if (input.bio) {
      this.profanity.assertClean(input.bio, { actorId: userId, entityType: 'profile.bio' })
    }
    this.profanity.assertClean(input.username, { actorId: userId, entityType: 'profile.username' })

    const username = input.username.trim().toLowerCase()

    // Keeping the provisional handle is legitimate — it is already theirs, and
    // re-checking it would report it as taken by its own owner.
    if (username !== before.username) {
      const availability = await this.checkUsernameAvailability(username)
      if (!availability.available) {
        throw new ConflictException(
          availability.reason === 'taken'
            ? { code: 'USERNAME_TAKEN', message: 'This username is already taken.' }
            : {
                code: 'USERNAME_INVALID',
                message:
                  'Usernames are 3–30 characters: lowercase letters, numbers, underscores and periods.',
              },
        )
      }
    }

    const firstName = input.firstName.trim()
    const lastName = input.lastName?.trim() || null
    const displayName = [firstName, lastName].filter(Boolean).join(' ')

    const profile = await this.prisma.profile.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        displayName,
        username,
        bio: input.bio?.trim() || null,
        avatarUrl: input.avatarUrl ?? undefined,
        onboardingCompletedAt: new Date(),
      },
      include: { professionalProfile: true },
    })

    await this.redis.invalidateProfile(userId)
    if (username !== before.username) {
      await this.redis.invalidateUsername(before.username, username)
    }
    this.logger.log(`User ${userId} completed onboarding as @${username}`)

    return this.mapProfile(profile)
  }

  // ── PERSONAL PROFILE ──────────────────────────────────────────────────────

  async getProfileByUsername(username: string, currentUserId?: string): Promise<ProfileResponse> {
    const normalized = username.toLowerCase()

    // Cached username → id mapping (usernames change at most every 30 days)
    const cachedId = await this.redis.getUsernameId(normalized)
    if (cachedId) {
      return this.getProfileById(cachedId, currentUserId)
    }

    const row = await this.prisma.profile.findUnique({
      where: { username: normalized },
      select: { id: true },
    })
    if (!row) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }
    await this.redis.setUsernameId(normalized, row.id)
    return this.getProfileById(row.id, currentUserId)
  }

  async getProfileById(id: string, currentUserId?: string): Promise<ProfileResponse> {
    // Redis read-through: the FULL profile is cached; per-viewer privacy
    // redaction is applied after retrieval so one cache entry serves everyone.
    const cached = await this.redis.getProfile<ProfileResponse>(id)
    if (cached) {
      await this.assertProfileVisible(cached, currentUserId)
      return await this.redactForViewer(cached, currentUserId)
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { professionalProfile: true },
    })

    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }

    const mapped = this.mapProfile(profile)
    // Cached before the gate on purpose: the cache is viewer-agnostic, and
    // gating on read means a hidden account still gets one entry rather than
    // hitting PostgreSQL on every probe.
    await this.redis.setProfile(id, mapped)
    await this.assertProfileVisible(mapped, currentUserId)
    return await this.redactForViewer(mapped, currentUserId)
  }

  /**
   * Only active accounts are visible to other people.
   *
   * Search already filtered on `state = 'active'`, and the feed and post grid
   * gated on it too, but the profile lookup itself never did — so a
   * deactivated, suspended, banned or pending-deletion account still answered
   * 200 at /profiles/:id and /profiles/username/:username. For a ban that
   * undercuts the enforcement: the account is removed from every listing and
   * its posts 404, while its profile page stays up. Deactivation carries the
   * same promise in its own wording — "everyone else stops seeing the member".
   *
   * 404 rather than 403, matching how posts handle it: refusing without
   * confirming the account exists.
   *
   * Two exemptions. The owner keeps seeing their own profile, because
   * deactivation is reversible and signing back in has to lead somewhere. Staff
   * keep seeing it because reviewing a banned account is the point of banning
   * one. The staff lookup only runs for a non-active profile viewed by a
   * non-owner, so the common path costs nothing.
   */
  private async assertProfileVisible(
    profile: ProfileResponse,
    currentUserId?: string,
  ): Promise<void> {
    if (profile.state === 'active') return
    if (currentUserId && profile.id === currentUserId) return

    if (currentUserId) {
      try {
        await this.requireAdminOrModerator(currentUserId)
        return
      } catch {
        // Not staff — fall through to the same 404 everyone else gets.
      }
    }

    throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
  }

  /**
   * Applies everything about a profile that depends on who is looking.
   *
   * Two jobs: hide what the owner has chosen not to share, and fill in the
   * fields that only make sense per-viewer. Both live here because both need
   * the owner's privacy settings, and one lookup can serve them.
   */
  private async redactForViewer(profile: ProfileResponse, currentUserId?: string): Promise<ProfileResponse> {
    const isOwner = profile.id === currentUserId

    let result = profile
    if (profile.isPrivate && !isOwner) {
      result = { ...result, bio: null, websiteUrl: null, city: null }
    }

    // Looking at your own profile: nothing is hidden from you, and your own
    // last-active time tells you nothing you do not already know.
    if (isOwner) return result

    /*
      Defaults matter here, and they are not the same for both toggles:
      `showLastActive` defaults to true, `showLocation` to false (see the
      schema, and the client's own defaults, which agree).

      A member with no settings row must therefore be treated as location
      hidden. The previous version read a missing row as "show", which
      contradicted the column default and leaked a city the member had never
      agreed to publish.
    */
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId: profile.id },
      select: { showLocation: true, showLastActive: true },
    })
    const showLocation = settings?.showLocation ?? false
    const showLastActive = settings?.showLastActive ?? true

    /*
      Applies to a logged-out visitor too.

      This check used to require a `currentUserId`, so an anonymous visitor —
      the least-trusted viewer there is — skipped the gate entirely and saw the
      city regardless of the setting.
    */
    if (result.city && !showLocation) {
      result = { ...result, city: null }
    }

    if (!showLastActive) return result

    const presence = await this.prisma.userPresence.findFirst({
      where: { userId: profile.id },
      select: { status: true, lastSeen: true },
    })
    if (!presence) return result

    const online = presence.status === 'online'
    return {
      ...result,
      isOnline: online,
      // Omitted while online: "online now" is the useful statement, and a
      // timestamp alongside it only invites the question of which to believe.
      lastActiveAt: online ? null : (presence.lastSeen?.toISOString() ?? null),
    }
  }

  /**
   * Profile + viewer relationship in ONE call — removes the client-side
   * profile→relationship waterfall (two round-trips become one).
   */
  async getProfileWithViewer(
    id: string,
    currentUserId?: string,
  ): Promise<ProfileResponse & { viewer: RelationshipResponse | null }> {
    const [profile, viewer] = await Promise.all([
      this.getProfileById(id, currentUserId),
      currentUserId && currentUserId !== id ? this.getRelationship(currentUserId, id) : Promise.resolve(null),
    ])
    return { ...profile, viewer }
  }

  private static readonly USERNAME_COOLDOWN_DAYS = 30

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    const before = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { isPrivate: true, username: true, usernameChangedAt: true },
    })
    if (!before) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }

    const goingPublic = before.isPrivate && input.isPrivate === false

    if (input.displayName) this.profanity.assertClean(input.displayName, { actorId: userId, entityType: 'profile.displayName' })
    if (input.bio) this.profanity.assertClean(input.bio, { actorId: userId, entityType: 'profile.bio' })
    if (input.username) this.profanity.assertClean(input.username, { actorId: userId, entityType: 'profile.username' })

    // ── Username change: valid format, not reserved, unique, 30-day cooldown ──
    const { username: requestedUsername, ...rest } = input
    const data: Record<string, unknown> = { ...rest }

    if (requestedUsername !== undefined) {
      const username = requestedUsername.trim().toLowerCase()
      if (username !== before.username) {
        const invalid =
          !USERNAME_REGEX.test(username) ||
          username.startsWith('.') ||
          username.endsWith('.') ||
          username.includes('..')
        if (invalid || RESERVED_USERNAMES.has(username)) {
          throw new ConflictException({
            code: 'USERNAME_INVALID',
            message: 'Usernames are 3–30 characters: lowercase letters, numbers, underscores and periods.',
          })
        }

        if (before.usernameChangedAt) {
          const nextAllowed = new Date(before.usernameChangedAt)
          nextAllowed.setDate(nextAllowed.getDate() + ProfileService.USERNAME_COOLDOWN_DAYS)
          if (nextAllowed > new Date()) {
            const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / 86_400_000)
            throw new ConflictException({
              code: 'USERNAME_COOLDOWN',
              message: `You can change your username once every 30 days. Try again in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`,
            })
          }
        }

        const taken = await this.prisma.profile.findUnique({
          where: { username },
          select: { id: true },
        })
        if (taken) {
          throw new ConflictException({
            code: 'USERNAME_TAKEN',
            message: 'This username is already taken.',
          })
        }

        data.username = username
        data.usernameChangedAt = new Date()
        this.logger.log(`User ${userId} changed username: ${before.username} → ${username}`)
      }
    }

    const profile = await this.prisma.profile.update({
      where: { id: userId },
      data,
      include: { professionalProfile: true },
    })

    // Instagram semantics: switching private → public auto-accepts all
    // pending follow requests in a single transaction.
    if (goingPublic) {
      await this.acceptAllPendingRequests(userId)
    }

    await this.redis.invalidateProfile(userId)
    // Username changed → bust the old and new username→id mappings
    if (data.username) {
      await this.redis.invalidateUsername(before.username, data.username as string)
    }
    await this.realtime.publishToProfile(userId, 'profile.updated', {
      userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
    })

    return this.mapProfile(profile)
  }

  /**
   * Auto-accept every pending follow request when an account goes public.
   * Follow rows, request statuses, and both sides' counters commit atomically;
   * notifications fan out through the queue afterwards.
   */
  private async acceptAllPendingRequests(userId: string): Promise<void> {
    const { accepted, pendingIds } = await this.prisma.$transaction(async (tx) => {
      const pending = await tx.followRequest.findMany({
        where: { receiverId: userId, status: 'pending' },
        select: { id: true, senderId: true },
      })
      if (pending.length === 0) return { accepted: [], pendingIds: [] }

      // Skip senders that somehow already follow (defensive against drift)
      const existing = await tx.follow.findMany({
        where: { followingId: userId, followerId: { in: pending.map((p) => p.senderId) } },
        select: { followerId: true },
      })
      const alreadyFollowing = new Set(existing.map((f) => f.followerId))
      const toCreate = pending.filter((p) => !alreadyFollowing.has(p.senderId))

      if (toCreate.length > 0) {
        await tx.follow.createMany({
          data: toCreate.map((p) => ({ followerId: p.senderId, followingId: userId, status: 'active' as const })),
          skipDuplicates: true,
        })
        await tx.profile.update({
          where: { id: userId },
          data: { followersCount: { increment: toCreate.length } },
        })
        await tx.profile.updateMany({
          where: { id: { in: toCreate.map((p) => p.senderId) } },
          data: { followingCount: { increment: 1 } },
        })
      }

      await tx.followRequest.updateMany({
        where: { id: { in: pending.map((p) => p.id) } },
        data: { status: 'accepted' },
      })

      return { accepted: toCreate, pendingIds: pending.map((p) => p.id) }
    })

    /*
      Sync the receiver's pending follow_request notifications to "accepted".

      This used to run one query per pending request and then one update per
      notification found, all in turn. Going public with twenty pending requests
      therefore cost twenty round-trips before the updates even started, and a
      round-trip here is ~1.5s on the transaction pooler.

      Now: one query for every still-pending follow_request notification this
      member has, matched against the accepted ids in memory. Each row still
      needs its own update because the merged JSON differs per row, but they no
      longer wait on each other.
    */
    if (pendingIds.length > 0) {
      const idSet = new Set(pendingIds)
      const pendingNotifications = await this.prisma.notification.findMany({
        where: {
          userId,
          type: 'follow_request',
          data: { path: ['status'], equals: 'pending' },
        },
      })

      await Promise.all(
        pendingNotifications
          .filter((n) => idSet.has((n.data as Record<string, unknown>)?.requestId as string))
          .map((notification) =>
            this.prisma.notification.update({
              where: { id: notification.id },
              data: {
                data: { ...(notification.data as Record<string, unknown>), status: 'accepted' },
                isRead: true,
              },
            }),
          ),
      )
    }

    // Cache busts and notifications for every accepted sender, together rather
    // than one sender at a time.
    await Promise.all([
      this.redis.invalidateProfile(userId),
      ...accepted.flatMap((request) => [
        this.redis.invalidateRelationship(request.senderId, userId),
        this.redis.invalidateProfile(request.senderId),
        this.notifications.enqueue({
          userId: request.senderId,
          type: 'follow_request_accepted',
          title: 'Follow Request Accepted',
          body: 'Your follow request was accepted',
          data: { userId },
        }),
      ]),
    ])
    if (accepted.length > 0) {
      this.logger.log(`Auto-accepted ${accepted.length} follow requests for user ${userId} (went public)`)
    }
  }

  async getMyProfile(userId: string): Promise<ProfileResponse> {
    return this.getProfileById(userId, userId)
  }

  // ── PROFESSIONAL PROFILE ──────────────────────────────────────────────────

  async switchToProfessional(userId: string, input: SwitchProfessionalInput): Promise<ProfessionalProfileResponse> {
    const existing = await this.prisma.professionalProfile.findUnique({ where: { userId } })
    if (existing && !existing.deletedAt) {
      throw new ConflictException({ code: 'ALREADY_PROFESSIONAL', message: 'You are already a professional account' })
    }

    // Reactivate a previously-reverted professional profile (personal → professional again).
    if (existing) {
      const [reactivated] = await this.prisma.$transaction([
        this.prisma.professionalProfile.update({
          where: { userId },
          data: {
            deletedAt: null,
            category: input.category,
            businessName: input.businessName,
            businessEmail: input.businessEmail,
            businessPhone: input.businessPhone,
            businessAddress: input.businessAddress,
            description: input.description,
            websiteUrl: input.websiteUrl,
            serviceAreas: input.serviceAreas ?? [],
            businessHours: (input.businessHours as Prisma.InputJsonValue) ?? Prisma.JsonNull,
            licenseNumber: input.licenseNumber,
          },
        }),
        this.prisma.professionalSetting.upsert({ where: { userId }, create: { userId }, update: {} }),
        this.prisma.verificationRequest.create({
          data: { userId, type: 'professional', categorySlug: input.category },
        }),
        // Restore listings hidden when they previously switched to personal.
        this.prisma.product.updateMany({ where: { sellerId: userId, hiddenAt: { not: null } }, data: { hiddenAt: null } }),
        this.prisma.newsArticle.updateMany({ where: { authorId: userId, hiddenAt: { not: null } }, data: { hiddenAt: null } }),
        this.prisma.serviceProvider.updateMany({ where: { addedBy: userId, hiddenAt: { not: null } }, data: { hiddenAt: null } }),
      ])
      await this.redis.invalidateProfile(userId)
      this.logger.log(`User ${userId} re-activated professional (${input.category})`)
      return this.mapProfessionalProfile(reactivated)
    }

    const [professional] = await this.prisma.$transaction([
      this.prisma.professionalProfile.create({
        data: {
          userId,
          category: input.category,
          businessName: input.businessName,
          businessEmail: input.businessEmail,
          businessPhone: input.businessPhone,
          businessAddress: input.businessAddress,
          description: input.description,
          websiteUrl: input.websiteUrl,
          serviceAreas: input.serviceAreas ?? [],
          businessHours: (input.businessHours as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          licenseNumber: input.licenseNumber,
        },
      }),
      this.prisma.professionalSetting.create({ data: { userId } }),
      this.prisma.verificationRequest.create({
        data: { userId, type: 'professional', categorySlug: input.category },
      }),
    ])

    await this.redis.invalidateProfile(userId)
    this.logger.log(`User ${userId} switched to professional (${input.category})`)
    return this.mapProfessionalProfile(professional)
  }

  async getProfessionalProfile(userId: string): Promise<ProfessionalProfileResponse | null> {
    const professional = await this.prisma.professionalProfile.findUnique({ where: { userId } })
    if (!professional) return null
    return this.mapProfessionalProfile(professional)
  }

  async updateProfessionalProfile(userId: string, input: UpdateProfessionalInput): Promise<ProfessionalProfileResponse> {
    const professional = await this.prisma.professionalProfile.findUnique({ where: { userId } })
    if (!professional) {
      throw new NotFoundException({ code: 'NOT_PROFESSIONAL', message: 'You are not a professional account' })
    }

    const updated = await this.prisma.professionalProfile.update({
      where: { userId },
      data: {
        businessName: input.businessName,
        businessEmail: input.businessEmail,
        businessPhone: input.businessPhone,
        businessAddress: input.businessAddress,
        description: input.description,
        websiteUrl: input.websiteUrl,
        serviceAreas: input.serviceAreas,
        businessHours: (input.businessHours as Prisma.InputJsonValue) ?? undefined,
      },
    })

    if (input.availableForBooking !== undefined) {
      await this.prisma.professionalSetting.upsert({
        where: { userId },
        create: { userId, availableForBooking: input.availableForBooking },
        update: { availableForBooking: input.availableForBooking },
      })
    }

    return this.mapProfessionalProfile(updated)
  }

  async revertToPersonal(userId: string): Promise<void> {
    const professional = await this.prisma.professionalProfile.findUnique({ where: { userId } })
    if (!professional) {
      throw new NotFoundException({ code: 'NOT_PROFESSIONAL', message: 'You are not a professional account' })
    }

    const now = new Date()
    const ops: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.professionalProfile.update({ where: { userId }, data: { deletedAt: now } }),
      this.prisma.professionalSetting.deleteMany({ where: { userId } }),
      // Fully stop professional activity: drop the verified tier + badge.
      this.prisma.profile.update({ where: { id: userId }, data: { verificationTier: 'none' } }),
    ]
    // Hide the pro's public listings for their category (restored on switch-back).
    if (professional.category === 'product_seller') {
      ops.push(this.prisma.product.updateMany({ where: { sellerId: userId, isDeleted: false, status: 'active', hiddenAt: null }, data: { hiddenAt: now } }))
    } else if (professional.category === 'verified_news_publisher') {
      ops.push(this.prisma.newsArticle.updateMany({ where: { authorId: userId, isDeleted: false, status: 'published', hiddenAt: null }, data: { hiddenAt: now } }))
    } else if (professional.category === 'veterinarian' || professional.category === 'pet_care_service_provider') {
      ops.push(this.prisma.serviceProvider.updateMany({ where: { addedBy: userId, isDeleted: false, hiddenAt: null }, data: { hiddenAt: now } }))
    }
    await this.prisma.$transaction(ops)

    await this.redis.invalidateProfile(userId)
    this.logger.log(`User ${userId} reverted to personal account`)
  }

  // ── VERIFICATION ─────────────────────────────────────────────────────────

  async submitVerificationRequest(userId: string, input: SubmitVerificationInput): Promise<VerificationRequestResponse> {
    const pending = await this.prisma.verificationRequest.findFirst({
      where: { userId, status: { in: ['pending', 'under_review'] } },
    })

    if (pending) {
      throw new ConflictException({
        code: 'PENDING_REQUEST',
        message: 'You already have a pending verification request',
      })
    }

    const request = await this.prisma.verificationRequest.create({
      data: {
        userId,
        type: input.type,
        categorySlug: input.categorySlug,
        notes: input.notes,
      },
      include: { documents: true, user: { select: VERIFICATION_REQUEST_USER_SELECT } },
    })

    this.logger.log(`Verification request ${request.id} created for user ${userId}`)
    return this.mapVerificationRequest(request)
  }

  async getVerificationStatus(userId: string): Promise<VerificationRequestResponse | null> {
    const request = await this.prisma.verificationRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { documents: true, user: { select: VERIFICATION_REQUEST_USER_SELECT } },
    })
    if (!request) return null
    return this.mapVerificationRequest(request)
  }

  async getVerificationRequests(status?: string): Promise<VerificationRequestResponse[]> {
    const where = status ? { status: status as VerificationRequestStatus } : {}
    const requests = await this.prisma.verificationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { documents: true, user: { select: VERIFICATION_REQUEST_USER_SELECT } },
    })
    return requests.map((r) => this.mapVerificationRequest(r))
  }

  async reviewVerificationRequest(
    requestId: string,
    reviewerId: string,
    approved: boolean,
    rejectionReason?: string,
  ): Promise<VerificationRequestResponse> {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { documents: true, user: { select: VERIFICATION_REQUEST_USER_SELECT } },
    })

    if (!request) {
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Verification request not found' })
    }

    const status = approved ? VerificationRequestStatus.approved : VerificationRequestStatus.rejected

    // Wrap all mutations in a single transaction for atomicity
    const [updated] = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          status,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          rejectionReason: approved ? null : (rejectionReason ?? ''),
        },
        include: { documents: true, user: { select: VERIFICATION_REQUEST_USER_SELECT } },
      })

      if (approved) {
        await tx.professionalProfile.updateMany({
          where: { userId: request.userId },
          data: { isVerified: true, verifiedAt: new Date() },
        })

        await tx.profile.update({
          where: { id: request.userId },
          data: { verificationTier: 'professional' },
        })

        await tx.notification.create({
          data: {
            userId: request.userId,
            type: 'verification_approved',
            title: 'Verification Approved',
            body: 'Your professional account has been verified. You now have a verified badge on your profile.',
            data: { requestId },
          },
        })
      } else {
        await tx.notification.create({
          data: {
            userId: request.userId,
            type: 'verification_rejected',
            title: 'Verification Update',
            body: rejectionReason
              ? `Your verification was rejected: ${rejectionReason}`
              : 'Your verification was rejected. Please submit a new request with correct documents.',
            data: { requestId, rejectionReason },
          },
        })
      }

      return [updated]
    })

    // Post-commit: bust caches and push the outcome to the user in realtime
    await this.redis.invalidateProfile(request.userId)
    await this.realtime.publishToUser(request.userId, 'verification.reviewed', {
      requestId,
      status,
      rejectionReason: approved ? null : (rejectionReason ?? null),
    })

    await this.auditLog.record({
      actorId: reviewerId,
      action: 'verification.review',
      entityType: 'verification_request',
      entityId: requestId,
      newData: { status, rejectionReason: approved ? null : (rejectionReason ?? null), targetUserId: request.userId },
    })

    return this.mapVerificationRequest(updated)
  }

  async uploadVerificationDocument(
    userId: string,
    requestId: string,
    documentType: string,
    documentUrl: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
  ): Promise<VerificationDocumentResponse> {
    const request = await this.prisma.verificationRequest.findUnique({ where: { id: requestId } })
    if (!request || request.userId !== userId) {
      // Same error for "not found" and "not yours" — don't leak request existence
      throw new NotFoundException({ code: 'REQUEST_NOT_FOUND', message: 'Verification request not found' })
    }
    if (request.status === 'approved' || request.status === 'rejected') {
      throw new ConflictException({
        code: 'REQUEST_CLOSED',
        message: 'This verification request has already been reviewed',
      })
    }

    const doc = await this.prisma.verificationDocument.create({
      data: { requestId, documentType, documentUrl, fileName, fileSize, mimeType },
    })

    return {
      id: doc.id,
      documentType: doc.documentType,
      documentUrl: doc.documentUrl,
      fileName: doc.fileName,
      status: doc.status,
      createdAt: doc.createdAt.toISOString(),
    }
  }

  /**
   * Short-lived read URL for a verification document.
   *
   * The documents live in a private bucket (migrations/055), so `documentUrl`
   * holds a storage key rather than a fetchable URL — identity documents must
   * not be readable by anyone who happens to have the link. Only the member who
   * uploaded it and staff reviewing it can obtain a signed URL, and it expires
   * in five minutes.
   */
  async getVerificationDocumentUrl(requesterId: string, documentId: string): Promise<string> {
    const doc = await this.prisma.verificationDocument.findUnique({
      where: { id: documentId },
      select: { documentUrl: true, request: { select: { userId: true } } },
    })
    if (!doc) {
      throw new NotFoundException({ code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' })
    }

    if (doc.request.userId !== requesterId) {
      // Throws ForbiddenException for non-staff, so a member cannot probe for
      // other people's document ids.
      await this.requireAdminOrModerator(requesterId)
    }

    return this.storage.createSignedDownloadUrl(VERIFICATION_BUCKET, doc.documentUrl)
  }

  // ── RELATIONSHIP ENGINE ───────────────────────────────────────────────────

  async getRelationship(userId: string, targetUserId: string): Promise<RelationshipResponse> {
    const cached = await this.redis.getRelationship<RelationshipResponse>(userId, targetUserId)
    if (cached) return cached

    const [follow, reverseFollow, followRequest, block, reverseBlock, mute] = await Promise.all([
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
      }),
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: targetUserId, followingId: userId } },
      }),
      this.prisma.followRequest.findUnique({
        where: { senderId_receiverId: { senderId: userId, receiverId: targetUserId } },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: userId, blockedId: targetUserId } },
      }),
      this.prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: targetUserId, blockedId: userId } },
      }),
      this.prisma.mutedUser.findUnique({
        where: { muterId_mutedId: { muterId: userId, mutedId: targetUserId } },
      }),
    ])

    const relationship: RelationshipResponse = {
      following: follow?.status === 'active',
      followedBy: reverseFollow?.status === 'active',
      followBack: follow?.status === 'active' && reverseFollow?.status === 'active',
      requested: followRequest?.status === 'pending',
      blocked: !!block,
      blockedBy: !!reverseBlock,
      muted: !!mute,
    }

    await this.redis.setRelationship(userId, targetUserId, relationship)
    return relationship
  }

  // ── ADMIN / ROLE HELPERS ──────────────────────────────────────────────────

  async requireAdminOrModerator(userId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator' && profile.role !== 'super_admin')) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      })
    }
  }

  // ── DEACTIVATION AND DELETION ──────────────────────────────────────────────

  /** Days a member has to sign back in and cancel a pending deletion. */
  get deletionGraceDays(): number {
    return this.config.env.ACCOUNT_DELETION_GRACE_DAYS ?? 30
  }

  /**
   * Temporarily hide the account. Nothing is destroyed: signing back in restores
   * it (see AuthService.restoreOnLogin). Everyone else stops seeing the member
   * and their content for free, because profile visibility across feed, search,
   * posts, comments and messaging is gated on `state = 'active'`.
   */
  async deactivateAccount(userId: string, accessToken?: string): Promise<{ state: string }> {
    const profile = await this.loadForStateChange(userId)

    await this.prisma.profile.update({
      where: { id: userId },
      data: { state: 'deactivated', deactivatedAt: new Date(), deletionRequestedAt: null },
    })
    await this.afterStateChange(userId, profile.username, 'account.deactivated')
    await this.auditLog.record({
      actorId: userId,
      action: 'account.deactivate',
      entityType: 'profile',
      entityId: userId,
      newData: { username: profile.username },
    })
    // Sign every device out, so the account really does go quiet.
    await this.revokeSessions(accessToken)

    this.logger.log(`Account deactivated for ${userId}`)
    return { state: 'deactivated' }
  }

  /**
   * Schedule the account for deletion after the grace period.
   *
   * Deliberately does NOT touch Supabase Auth: the login has to keep working, or
   * the member could never sign in to change their mind. The irreversible part
   * happens later, in `purgeAccount` — either from the daily job or the moment an
   * expired account tries to sign in.
   */
  async requestAccountDeletion(userId: string, accessToken?: string): Promise<{ scheduledFor: string; graceDays: number }> {
    const profile = await this.loadForStateChange(userId)

    const requestedAt = new Date()
    const scheduledFor = new Date(requestedAt.getTime() + this.deletionGraceDays * 86_400_000)

    await this.prisma.profile.update({
      where: { id: userId },
      data: { state: 'pending_deletion', deletionRequestedAt: requestedAt, deactivatedAt: null },
    })
    await this.afterStateChange(userId, profile.username, 'account.deletion_scheduled')
    await this.auditLog.record({
      actorId: userId,
      action: 'account.deletion_requested',
      entityType: 'profile',
      entityId: userId,
      newData: { username: profile.username, graceDays: this.deletionGraceDays, scheduledFor: scheduledFor.toISOString() },
    })
    await this.revokeSessions(accessToken)

    this.logger.log(`Deletion scheduled for ${userId} at ${scheduledFor.toISOString()}`)
    return { scheduledFor: scheduledFor.toISOString(), graceDays: this.deletionGraceDays }
  }

  /**
   * Irreversibly delete the account. Deleting the Supabase auth user cascades the
   * profile row away, so this is a hard delete despite the `deleted` state value.
   *
   * Everything after the auth call is best-effort: the irreversible part has
   * already happened, so a failure in the tidy-up must not report failure to
   * someone whose account is in fact gone.
   */
  async purgeAccount(userId: string, deletedBy: 'self' | 'grace_period_expired'): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    })
    const username = profile?.username ?? null

    try {
      await this.authService.deleteAccount(userId)
    } catch (error) {
      this.logger.error(`Auth deletion failed for user ${userId}: ${(error as Error).message}`)
      throw new BadRequestException({
        code: 'ACCOUNT_DELETION_FAILED',
        message: 'Failed to delete account. Please try again later.',
      })
    }

    // The auth cascade normally removes this row already; if it survived, mark it.
    try {
      await this.prisma.profile.update({ where: { id: userId }, data: { state: 'deleted' } })
    } catch {
      this.logger.log(`Profile row for ${userId} was already removed by the auth cascade`)
    }

    try {
      await this.redis.invalidateProfile(userId)
      if (username) await this.redis.invalidateUsername(username)
      await this.realtime.publishToProfile(userId, 'account.deleted', { userId })
    } catch (error) {
      this.logger.warn(`Post-deletion cleanup failed for ${userId}: ${(error as Error).message}`)
    }

    // actorId must be null: the profile it would reference no longer exists, and a
    // non-null value fails the foreign key — which is why deletions previously
    // left no trail at all. Identity is kept in entityId and newData, neither of
    // which is a foreign key.
    await this.auditLog.record({
      actorId: null,
      action: 'account.delete',
      entityType: 'profile',
      entityId: userId,
      newData: { username, deletedBy },
    })

    this.logger.log(`Account purged for ${userId} (${deletedBy})`)
  }

  /** Rejects states that must not be changed by the member themselves. */
  private async loadForStateChange(userId: string): Promise<{ username: string; state: string }> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { username: true, state: true },
    })
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }
    if (profile.state === 'deleted') {
      throw new ConflictException({ code: 'ALREADY_DELETED', message: 'Account is already deleted' })
    }
    // A moderator's decision is not something the member can step around by
    // deactivating and signing back in.
    if (profile.state === 'suspended' || profile.state === 'banned') {
      throw new ConflictException({
        code: 'ACCOUNT_RESTRICTED',
        message: 'This account is restricted. Contact support.',
      })
    }
    return profile
  }

  private async afterStateChange(userId: string, username: string, event: string): Promise<void> {
    // Not inside the try: the guard consults this on every request, so a stale
    // entry would keep letting the member through for up to five seconds. It is a
    // synchronous map delete and cannot throw, but it must not sit behind
    // something that can.
    accountStateCache.invalidate(userId)

    try {
      await this.redis.invalidateProfile(userId)
      await this.redis.invalidateUsername(username)
      await this.realtime.publishToProfile(userId, event, { userId })
    } catch (error) {
      this.logger.warn(`Cache/realtime update failed for ${userId}: ${(error as Error).message}`)
    }
  }

  /**
   * Best effort: the state change has already committed, and failing to reach
   * Supabase should not undo it. Takes the caller's JWT because that is what
   * admin.signOut accepts — it was being handed a user id, so this never
   * actually revoked anything and the warning was never logged either, since
   * the id was rejected rather than throwing here.
   */
  private async revokeSessions(accessToken?: string): Promise<void> {
    if (!accessToken) return
    try {
      await this.authService.logout(accessToken)
    } catch (error) {
      this.logger.warn(`Could not revoke sessions: ${(error as Error).message}`)
    }
  }

  // ── USER SETTINGS ───────────────────────────────────────────────────────────

  /**
   * Get the user's settings — creates a row with defaults on first access.
   */
  async getSettings(userId: string) {
    const existing = await this.prisma.userSettings.findUnique({
      where: { userId },
    })
    if (existing) return existing

    // First access: create with defaults (model defaults match the settings page)
    return this.prisma.userSettings.create({
      data: { userId },
    })
  }

  /**
   * Update user settings — upserts so it works on first save too.
   */
  async updateSettings(userId: string, input: UpdateSettingsInput) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...input },
      update: input,
    })

    await this.redis.invalidateProfile(userId)
    return settings
  }

  // ── PROFESSIONAL CATEGORIES ───────────────────────────────────────────────

  async getProfessionalCategories() {
    return Object.values(ProfessionalCategory).map((cat) => ({
      slug: cat,
      name: this.formatCategoryName(cat),
      permissions: this.getCategoryPermissions(cat),
    }))
  }

  async getCategoryPermissions(category: ProfessionalCategory): Promise<string[]> {
    const permissionsMap: Record<ProfessionalCategory, string[]> = {
      verified_news_publisher: ['publish_blogs', 'submit_news', 'manage_drafts', 'view_publishing_status'],
      product_seller: ['create_products', 'manage_products', 'view_orders', 'view_inventory'],
      pet_care_service_provider: ['create_services', 'manage_services', 'manage_bookings', 'availability_calendar'],
      veterinarian: ['create_professional_profile', 'accept_appointments', 'view_appointment_requests', 'manage_professional_info'],
    }
    return permissionsMap[category] ?? []
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  private formatCategoryName(cat: ProfessionalCategory): string {
    const names: Record<ProfessionalCategory, string> = {
      verified_news_publisher: 'Verified News Publisher',
      product_seller: 'Product Seller',
      pet_care_service_provider: 'Pet Care Service Provider',
      veterinarian: 'Veterinarian',
    }
    return names[cat]
  }

  private mapProfile(profile: ProfileWithProfessional): ProfileResponse {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      firstName: profile.firstName ?? null,
      lastName: profile.lastName ?? null,
      bio: profile.bio,
      city: profile.city ?? null,
      avatarUrl: profile.avatarUrl,
      bannerUrl: profile.bannerUrl,
      websiteUrl: profile.websiteUrl,
      state: profile.state,
      role: profile.role,
      verificationTier: profile.verificationTier,
      isPrivate: profile.isPrivate,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      postsCount: profile.postsCount,
      trustScore: profile.trustScore,
      currency: profile.currency ?? null,
      usernameChangedAt: profile.usernameChangedAt?.toISOString() ?? null,
      onboardingCompleted: profile.onboardingCompletedAt !== null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      // Fail closed. redactForViewer fills these in when the owner allows it,
      // so any path that skips it discloses nothing rather than everything.
      lastActiveAt: null,
      isOnline: false,
      professionalProfile: profile.professionalProfile && !profile.professionalProfile.deletedAt
        ? this.mapProfessionalProfile(profile.professionalProfile)
        : null,
    }
  }

  private mapProfessionalProfile(prof: ProfessionalProfileRecord): ProfessionalProfileResponse {
    return {
      id: prof.id,
      category: prof.category,
      businessName: prof.businessName,
      businessEmail: prof.businessEmail,
      businessPhone: prof.businessPhone,
      businessAddress: prof.businessAddress,
      description: prof.description,
      websiteUrl: prof.websiteUrl,
      logoUrl: prof.logoUrl,
      serviceAreas: prof.serviceAreas ?? [],
      businessHours: prof.businessHours as Record<string, unknown> | null,
      isVerified: prof.isVerified,
      verifiedAt: prof.verifiedAt?.toISOString() ?? null,
    }
  }

  private mapVerificationRequest(req: VerificationRequestWithDocs): VerificationRequestResponse {
    return {
      id: req.id,
      userId: req.userId,
      user: req.user,
      type: req.type,
      status: req.status,
      categorySlug: req.categorySlug,
      notes: req.notes,
      reviewedBy: req.reviewedBy,
      rejectionReason: req.rejectionReason,
      createdAt: req.createdAt.toISOString(),
      updatedAt: req.updatedAt.toISOString(),
      documents: req.documents.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        documentUrl: doc.documentUrl,
        fileName: doc.fileName,
        status: doc.status,
        createdAt: doc.createdAt.toISOString(),
      })),
    }
  }
}
