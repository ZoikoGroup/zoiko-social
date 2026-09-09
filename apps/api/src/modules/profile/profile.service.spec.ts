import { ProfileService } from './profile.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { RealtimeService } from '../realtime/realtime.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'
import type { ProfanityService } from '../common/moderation/profanity.service'
import type { AuthService } from '../auth/auth.service'
import type { ConfigService } from '../config/config.service'
import type { SupabaseStorageService } from '../storage/supabase-storage.service'

const USER_ID = 'member-1'
const PROFILE = { id: USER_ID, username: 'someone', state: 'active' }

function build(overrides: {
  profile?: unknown
  authThrows?: boolean
  updateThrows?: boolean
  redisThrows?: boolean
  graceDays?: number
} = {}) {
  const prisma = {
    profile: {
      findUnique: jest.fn().mockResolvedValue(overrides.profile === undefined ? PROFILE : overrides.profile),
      update: overrides.updateThrows
        ? jest.fn().mockRejectedValue(new Error('records not found'))
        : jest.fn().mockResolvedValue(PROFILE),
    },
  }
  const redis = {
    invalidateProfile: overrides.redisThrows
      ? jest.fn().mockRejectedValue(new Error('ERR max requests limit exceeded'))
      : jest.fn().mockResolvedValue(undefined),
    invalidateUsername: jest.fn().mockResolvedValue(undefined),
  }
  const realtime = { publishToProfile: jest.fn().mockResolvedValue(undefined) }
  const auditLog = { record: jest.fn().mockResolvedValue(undefined) }
  const authService = {
    logout: jest.fn().mockResolvedValue(undefined),
    deleteAccount: overrides.authThrows
      ? jest.fn().mockRejectedValue(new Error('boom'))
      : jest.fn().mockResolvedValue(undefined),
  }
  const config = { env: { ACCOUNT_DELETION_GRACE_DAYS: overrides.graceDays ?? 30 } }

  const service = new ProfileService(
    prisma as unknown as PrismaService,
    redis as unknown as RedisService,
    realtime as unknown as RealtimeService,
    {} as unknown as NotificationQueueService,
    auditLog as unknown as AuditLogService,
    { assertClean: jest.fn() } as unknown as ProfanityService,
    authService as unknown as AuthService,
    config as unknown as ConfigService,
    { createSignedDownloadUrl: jest.fn() } as unknown as SupabaseStorageService,
    // Only used to read an email for a profile that publishes one, which none
    // of these cases does.
    { auth: { admin: { getUserById: jest.fn() } } } as never,
  )
  return { service, prisma, redis, realtime, auditLog, authService }
}

describe('ProfileService.deactivateAccount', () => {
  it('hides the account without destroying anything', async () => {
    const { service, prisma, authService } = build()

    const result = await service.deactivateAccount(USER_ID)

    expect(result).toEqual({ state: 'deactivated' })
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { state: 'deactivated', deactivatedAt: expect.any(Date), deletionRequestedAt: null },
    })
    // The auth user must survive, or the member could never sign back in.
    expect(authService.deleteAccount).not.toHaveBeenCalled()
  })

  // Supabase revokes by JWT — admin.signOut takes "a valid, logged-in JWT" and
  // there is no revoke-by-id. This previously asserted the user id was passed,
  // which is exactly why every logout failed.
  it('signs every device out using the caller token', async () => {
    const { service, authService } = build()
    await service.deactivateAccount(USER_ID, 'jwt-token')
    expect(authService.logout).toHaveBeenCalledWith('jwt-token')
  })

  it('skips the revoke when there is no token rather than calling with nothing', async () => {
    const { service, authService } = build()
    await service.deactivateAccount(USER_ID)
    expect(authService.logout).not.toHaveBeenCalled()
  })

  it('audits the deactivation', async () => {
    const { service, auditLog } = build()
    await service.deactivateAccount(USER_ID)
    expect(auditLog.record).toHaveBeenCalledWith(expect.objectContaining({
      actorId: USER_ID,
      action: 'account.deactivate',
    }))
  })

  it('still succeeds when sessions cannot be revoked', async () => {
    const { service, authService } = build()
    authService.logout.mockRejectedValue(new Error('signOut failed'))
    await expect(service.deactivateAccount(USER_ID)).resolves.toEqual({ state: 'deactivated' })
  })
})

describe('ProfileService.requestAccountDeletion', () => {
  it('schedules deletion for the end of the grace period without deleting anything', async () => {
    const { service, prisma, authService } = build()

    const result = await service.requestAccountDeletion(USER_ID)

    expect(result.graceDays).toBe(30)
    const days = (new Date(result.scheduledFor).getTime() - Date.now()) / 86_400_000
    expect(days).toBeGreaterThan(29.9)
    expect(days).toBeLessThan(30.1)
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { state: 'pending_deletion', deletionRequestedAt: expect.any(Date), deactivatedAt: null },
    })
    // Nothing irreversible happens here — that is the whole point of the window.
    expect(authService.deleteAccount).not.toHaveBeenCalled()
  })

  it('honours a configured grace period', async () => {
    const { service } = build({ graceDays: 7 })
    const result = await service.requestAccountDeletion(USER_ID)
    expect(result.graceDays).toBe(7)
  })

  it('records the scheduled date in the audit trail', async () => {
    const { service, auditLog } = build()
    await service.requestAccountDeletion(USER_ID)
    expect(auditLog.record).toHaveBeenCalledWith(expect.objectContaining({
      actorId: USER_ID,
      action: 'account.deletion_requested',
      newData: expect.objectContaining({ graceDays: 30 }),
    }))
  })
})

describe('ProfileService — states the member may not change', () => {
  it.each(['suspended', 'banned'])('refuses to deactivate a %s account', async (state) => {
    // Otherwise deactivating and signing back in would clear a moderator's decision.
    const { service, prisma } = build({ profile: { ...PROFILE, state } })
    await expect(service.deactivateAccount(USER_ID)).rejects.toMatchObject({
      response: { code: 'ACCOUNT_RESTRICTED' },
    })
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it.each(['suspended', 'banned'])('refuses deletion of a %s account', async (state) => {
    const { service } = build({ profile: { ...PROFILE, state } })
    await expect(service.requestAccountDeletion(USER_ID)).rejects.toMatchObject({
      response: { code: 'ACCOUNT_RESTRICTED' },
    })
  })

  it('rejects an already-deleted account', async () => {
    const { service } = build({ profile: { ...PROFILE, state: 'deleted' } })
    await expect(service.requestAccountDeletion(USER_ID)).rejects.toMatchObject({
      response: { code: 'ALREADY_DELETED' },
    })
  })

  it('rejects an unknown profile', async () => {
    const { service } = build({ profile: null })
    await expect(service.deactivateAccount(USER_ID)).rejects.toMatchObject({
      response: { code: 'PROFILE_NOT_FOUND' },
    })
  })
})

describe('ProfileService.purgeAccount', () => {
  it('deletes the auth user, which is the irreversible step', async () => {
    const { service, authService } = build()
    await service.purgeAccount(USER_ID, 'self')
    expect(authService.deleteAccount).toHaveBeenCalledWith(USER_ID)
  })

  // Regression: deleting the auth user cascades the profile row away, so the
  // follow-up update hit a missing record and surfaced as a 500 in Settings —
  // while the account had in fact been deleted.
  it('succeeds when the profile row has already been cascaded away', async () => {
    const { service } = build({ updateThrows: true })
    await expect(service.purgeAccount(USER_ID, 'self')).resolves.toBeUndefined()
  })

  it('succeeds when cache invalidation or the realtime notice fails', async () => {
    const { service } = build({ redisThrows: true })
    await expect(service.purgeAccount(USER_ID, 'self')).resolves.toBeUndefined()
  })

  // Regression: the audit row used to carry actorId of the profile that had just
  // been removed, which fails the foreign key. AuditLogService swallows its own
  // errors, so account deletions left no trail whatsoever.
  it('audits with a null actor so the row is actually storable', async () => {
    const { service, auditLog } = build()
    await service.purgeAccount(USER_ID, 'grace_period_expired')
    expect(auditLog.record).toHaveBeenCalledWith({
      actorId: null,
      action: 'account.delete',
      entityType: 'profile',
      entityId: USER_ID,
      newData: { username: PROFILE.username, deletedBy: 'grace_period_expired' },
    })
  })

  it('reports failure when auth deletion fails, leaving the account intact', async () => {
    const { service, prisma, auditLog } = build({ authThrows: true })
    await expect(service.purgeAccount(USER_ID, 'self')).rejects.toMatchObject({
      response: { code: 'ACCOUNT_DELETION_FAILED' },
    })
    expect(prisma.profile.update).not.toHaveBeenCalled()
    expect(auditLog.record).not.toHaveBeenCalled()
  })
})

// ── ONBOARDING ──────────────────────────────────────────────────────────────
// A new OAuth account arrives already wearing a username the signup trigger
// derived from its email address, and a name the provider gave us as one string.
// These cover the two things that makes tricky: suggesting a handle worth
// choosing, and renaming without spending the 30-day cooldown.

const RECORD = {
  id: USER_ID,
  username: 'someone',
  displayName: '',
  firstName: null as string | null,
  lastName: null as string | null,
  bio: null as string | null,
  avatarUrl: null as string | null,
  bannerUrl: null,
  websiteUrl: null,
  state: 'active',
  role: 'user',
  verificationTier: 'none',
  isPrivate: false,
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  trustScore: 100,
  currency: null,
  usernameChangedAt: null as Date | null,
  onboardingCompletedAt: null as Date | null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  professionalProfile: null,
}

function buildOnboarding(
  opts: { onboardedAt?: Date | null; usernameTaken?: boolean; takenSuggestions?: string[] } = {},
) {
  const ctx = build()
  const p = ctx.prisma.profile as unknown as Record<string, jest.Mock>

  // Arg-aware: an { id } lookup is "who is this", a { username } lookup is
  // "is this handle free".
  p.findUnique = jest.fn(({ where }: { where: Record<string, unknown> }) =>
    Promise.resolve(
      'username' in where
        ? opts.usernameTaken
          ? { id: 'someone-else' }
          : null
        : { ...RECORD, onboardingCompletedAt: opts.onboardedAt ?? null },
    ),
  )
  p.findMany = jest
    .fn()
    .mockResolvedValue((opts.takenSuggestions ?? []).map((username) => ({ username })))
  p.update = jest.fn(({ data }: { data: Record<string, unknown> }) =>
    Promise.resolve({ ...RECORD, ...data }),
  )
  return ctx
}

describe('ProfileService.suggestUsernames', () => {
  it('leads with the handle a person would pick for themselves', async () => {
    const { service } = buildOnboarding()
    const out = await service.suggestUsernames('Vignesh', 'K')
    expect(out[0]).toBe('vignesh.k')
    expect(out).toContain('vigneshk')
  })

  it('offers only free handles', async () => {
    const { service } = buildOnboarding({ takenSuggestions: ['vignesh.k', 'vigneshk'] })
    const out = await service.suggestUsernames('Vignesh', 'K')
    expect(out).not.toContain('vignesh.k')
    expect(out).not.toContain('vigneshk')
    expect(out.length).toBeGreaterThan(0)
  })

  it('drops accents and punctuation rather than the letters under them', async () => {
    const { service } = buildOnboarding()
    const out = await service.suggestUsernames('José', "O'Brien")
    expect(out).toContain('jose.obrien')
  })

  it('still fills the list when every plain handle is taken', async () => {
    const { service } = buildOnboarding({ takenSuggestions: ['vignesh.k', 'vigneshk', 'vignesh_k', 'vignesh.k1'] })
    const out = await service.suggestUsernames('Vignesh', 'K')
    expect(out.length).toBeGreaterThan(0)
    expect(out).not.toContain('vignesh.k1')
  })

  it('returns nothing rather than something illegal when a name has no usable letters', async () => {
    const { service } = buildOnboarding()
    await expect(service.suggestUsernames('!!', '@@')).resolves.toEqual([])
  })

  it('never suggests a reserved handle', async () => {
    const { service } = buildOnboarding()
    const out = await service.suggestUsernames('admin', '')
    expect(out).not.toContain('admin')
  })
})

describe('ProfileService.completeOnboarding', () => {
  const input = { firstName: 'Vignesh', lastName: 'K', username: 'vignesh.k' }

  it('stores both name parts and the joined display name', async () => {
    const { service, prisma } = buildOnboarding()
    await service.completeOnboarding(USER_ID, input)
    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          firstName: 'Vignesh',
          lastName: 'K',
          displayName: 'Vignesh K',
          username: 'vignesh.k',
        }),
      }),
    )
  })

  // The whole reason this is not updateProfile. Stamping usernameChangedAt here
  // would spend the user's one rename per 30 days on replacing a handle they
  // never chose.
  it('does not start the 30-day username cooldown', async () => {
    const { service, prisma } = buildOnboarding()
    await service.completeOnboarding(USER_ID, input)
    const data = (prisma.profile.update as jest.Mock).mock.calls[0][0].data
    expect(data).not.toHaveProperty('usernameChangedAt')
    expect(data.onboardingCompletedAt).toBeInstanceOf(Date)
  })

  it('drops a last name that was left blank rather than storing an empty one', async () => {
    const { service, prisma } = buildOnboarding()
    await service.completeOnboarding(USER_ID, { ...input, lastName: '' })
    const data = (prisma.profile.update as jest.Mock).mock.calls[0][0].data
    expect(data.lastName).toBeNull()
    expect(data.displayName).toBe('Vignesh')
  })

  // Re-checking it would report the handle as taken by its own owner.
  it('lets someone keep the provisional handle the trigger gave them', async () => {
    const { service, prisma, redis } = buildOnboarding({ usernameTaken: true })
    await expect(
      service.completeOnboarding(USER_ID, { ...input, username: 'someone' }),
    ).resolves.toBeDefined()
    expect((prisma.profile.update as jest.Mock).mock.calls[0][0].data.username).toBe('someone')
    // Nothing moved, so there is no stale username→id mapping to bust.
    expect(redis.invalidateUsername).not.toHaveBeenCalled()
  })

  it('refuses a handle someone else already holds', async () => {
    const { service } = buildOnboarding({ usernameTaken: true })
    await expect(service.completeOnboarding(USER_ID, input)).rejects.toMatchObject({
      response: { code: 'USERNAME_TAKEN' },
    })
  })

  it('refuses to run twice', async () => {
    const { service } = buildOnboarding({ onboardedAt: new Date('2026-02-02') })
    await expect(service.completeOnboarding(USER_ID, input)).rejects.toMatchObject({
      response: { code: 'ONBOARDING_ALREADY_COMPLETE' },
    })
  })
})

/*
  The email gate.

  Worth its own tests because the failure mode is silent: nothing about a
  profile page looks wrong when it publishes an address the member never agreed
  to publish. The cases below fix each rule so a later refactor has to break a
  test rather than a promise.
*/
describe('ProfileService.getProfileById — the email gate', () => {
  const OWNER = 'member-1'
  const EMAIL = 'member@example.com'

  const RECORD = {
    id: OWNER,
    username: 'someone',
    displayName: 'Someone',
    firstName: null,
    lastName: null,
    bio: null,
    city: null,
    avatarUrl: null,
    bannerUrl: null,
    websiteUrl: null,
    state: 'active',
    role: 'user',
    verificationTier: 'none',
    isPrivate: false,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    trustScore: 0,
    currency: null,
    usernameChangedAt: null,
    onboardingCompletedAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    professionalProfile: null,
  }

  function buildGate(opts: { settings?: unknown; isPrivate?: boolean; authFails?: boolean } = {}) {
    const getUserById = jest.fn().mockImplementation(async () =>
      opts.authFails
        ? { data: { user: null }, error: { message: 'auth unreachable' } }
        : { data: { user: { id: OWNER, email: EMAIL } }, error: null },
    )
    const prisma = {
      profile: {
        findUnique: jest.fn().mockResolvedValue({ ...RECORD, isPrivate: opts.isPrivate ?? false }),
      },
      // `settings: null` stands for a member who has never opened Settings.
      userSettings: {
        findUnique: jest.fn().mockResolvedValue(
          opts.settings === undefined ? { showLocation: false, showLastActive: false, showEmail: false } : opts.settings,
        ),
      },
      userPresence: { findFirst: jest.fn().mockResolvedValue(null) },
    }
    const redis = {
      getProfile: jest.fn().mockResolvedValue(null),
      setProfile: jest.fn().mockResolvedValue(undefined),
    }

    const service = new ProfileService(
      prisma as unknown as PrismaService,
      redis as unknown as RedisService,
      {} as unknown as RealtimeService,
      {} as unknown as NotificationQueueService,
      {} as unknown as AuditLogService,
      {} as unknown as ProfanityService,
      {} as unknown as AuthService,
      {} as unknown as ConfigService,
      {} as unknown as SupabaseStorageService,
      { auth: { admin: { getUserById } } } as never,
    )
    return { service, getUserById }
  }

  it('publishes the address to a logged-out visitor once the member switches it on', async () => {
    const { service } = buildGate({ settings: { showLocation: false, showLastActive: false, showEmail: true } })
    const profile = await service.getProfileById(OWNER)
    expect(profile.email).toBe(EMAIL)
  })

  it('withholds it from a signed-in stranger while the toggle is off', async () => {
    const { service, getUserById } = buildGate({
      settings: { showLocation: false, showLastActive: false, showEmail: false },
    })
    const profile = await service.getProfileById(OWNER, 'someone-else')
    expect(profile.email).toBeNull()
    // Not merely hidden after the fact: auth was never asked.
    expect(getUserById).not.toHaveBeenCalled()
  })

  it('withholds it when the member has no settings row at all', async () => {
    // The column defaults to false, and a missing row has to mean the same
    // thing — reading it as "show" would publish an address nobody chose to.
    const { service } = buildGate({ settings: null })
    const profile = await service.getProfileById(OWNER, 'someone-else')
    expect(profile.email).toBeNull()
  })

  it('withholds it on a private account even with the toggle on', async () => {
    const { service } = buildGate({
      settings: { showLocation: false, showLastActive: false, showEmail: true },
      isPrivate: true,
    })
    const profile = await service.getProfileById(OWNER, 'someone-else')
    expect(profile.email).toBeNull()
  })

  it('always shows the owner their own address, whatever the toggle says', async () => {
    const { service } = buildGate({ settings: { showLocation: false, showLastActive: false, showEmail: false } })
    const profile = await service.getProfileById(OWNER, OWNER)
    expect(profile.email).toBe(EMAIL)
  })

  it('returns null rather than failing the request when auth is unreachable', async () => {
    const { service } = buildGate({
      settings: { showLocation: false, showLastActive: false, showEmail: true },
      authFails: true,
    })
    const profile = await service.getProfileById(OWNER)
    expect(profile.email).toBeNull()
    expect(profile.username).toBe('someone')
  })

  it('keeps the address out of the shared cache entry', async () => {
    // One cache entry serves every viewer, so anything viewer-specific written
    // into it would leak to the next reader.
    const { service } = buildGate({ settings: { showLocation: false, showLastActive: false, showEmail: true } })
    await service.getProfileById(OWNER)
    const redis = (service as unknown as { redis: { setProfile: jest.Mock } }).redis
    expect(redis.setProfile).toHaveBeenCalledWith(OWNER, expect.objectContaining({ email: null }))
  })
})
