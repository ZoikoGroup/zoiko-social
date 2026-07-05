import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { ProfessionalCategory, VerificationRequestStatus } from '@prisma/client'
import { z } from 'zod'

// ── Validation Schemas ─────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  websiteUrl: z.string().url().max(200).optional().nullable(),
  avatarUrl: z.string().url().max(500).optional().nullable(),
  isPrivate: z.boolean().optional(),
  username: z.string().min(3).max(30).optional(),
})

export const SwitchProfessionalSchema = z.object({
  category: z.nativeEnum(ProfessionalCategory),
  businessName: z.string().min(1).max(100).optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().max(20).optional(),
  businessAddress: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  websiteUrl: z.string().url().max(200).optional().nullable(),
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
  websiteUrl: z.string().url().max(200).optional().nullable(),
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

type VerificationRequestWithDocs = Prisma.VerificationRequestGetPayload<{
  include: { documents: true }
}>

// ── Profile Response Types ─────────────────────────────────────────────────

export interface ProfileResponse {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  websiteUrl: string | null
  state: string
  role: string
  verificationTier: string
  isPrivate: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  trustScore: number
  usernameChangedAt: string | null
  createdAt: string
  updatedAt: string
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
  'about', 'contact', 'privacy', 'terms', 'security',
])

export interface UsernameAvailability {
  username: string
  available: boolean
  reason: 'invalid' | 'reserved' | 'taken' | null
}

// ── Profile Service ────────────────────────────────────────────────────────

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly notifications: NotificationQueueService,
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
      return this.redactForViewer(cached, currentUserId)
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { professionalProfile: true },
    })

    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
    }

    const mapped = this.mapProfile(profile)
    await this.redis.setProfile(id, mapped)
    return this.redactForViewer(mapped, currentUserId)
  }

  /** Hide private-account details from non-owners. */
  private redactForViewer(profile: ProfileResponse, currentUserId?: string): ProfileResponse {
    if (profile.isPrivate && profile.id !== currentUserId) {
      return { ...profile, bio: null, websiteUrl: null }
    }
    return profile
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

    // Sync the receiver's pending follow_request notifications to "accepted"
    for (const requestId of pendingIds) {
      const pendingNotifications = await this.prisma.notification.findMany({
        where: {
          userId,
          type: 'follow_request',
          AND: [
            { data: { path: ['requestId'], equals: requestId } },
            { data: { path: ['status'], equals: 'pending' } },
          ],
        },
      })
      for (const notification of pendingNotifications) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            data: { ...(notification.data as Record<string, unknown>), status: 'accepted' },
            isRead: true,
          },
        })
      }
    }

    await this.redis.invalidateProfile(userId)
    for (const request of accepted) {
      await this.redis.invalidateRelationship(request.senderId, userId)
      await this.redis.invalidateProfile(request.senderId)
      await this.notifications.enqueue({
        userId: request.senderId,
        type: 'follow_request_accepted',
        title: 'Follow Request Accepted',
        body: 'Your follow request was accepted',
        data: { userId },
      })
    }
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
    if (existing) {
      throw new ConflictException({ code: 'ALREADY_PROFESSIONAL', message: 'You are already a professional account' })
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

    await this.prisma.$transaction([
      this.prisma.professionalProfile.update({
        where: { userId },
        data: { deletedAt: new Date() },
      }),
      this.prisma.professionalSetting.deleteMany({ where: { userId } }),
    ])

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
      include: { documents: true },
    })

    this.logger.log(`Verification request ${request.id} created for user ${userId}`)
    return this.mapVerificationRequest(request)
  }

  async getVerificationStatus(userId: string): Promise<VerificationRequestResponse | null> {
    const request = await this.prisma.verificationRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { documents: true },
    })
    if (!request) return null
    return this.mapVerificationRequest(request)
  }

  async getVerificationRequests(status?: string): Promise<VerificationRequestResponse[]> {
    const where = status ? { status: status as VerificationRequestStatus } : {}
    const requests = await this.prisma.verificationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { documents: true },
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
      include: { documents: true },
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
        include: { documents: true },
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
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      websiteUrl: profile.websiteUrl,
      state: profile.state,
      role: profile.role,
      verificationTier: profile.verificationTier,
      isPrivate: profile.isPrivate,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      postsCount: profile.postsCount,
      trustScore: profile.trustScore,
      usernameChangedAt: profile.usernameChangedAt?.toISOString() ?? null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      professionalProfile: profile.professionalProfile
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
