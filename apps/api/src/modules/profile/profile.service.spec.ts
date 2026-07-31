import { ProfileService } from './profile.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { RealtimeService } from '../realtime/realtime.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'
import type { ProfanityService } from '../common/moderation/profanity.service'
import type { AuthService } from '../auth/auth.service'
import type { ConfigService } from '../config/config.service'

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

  it('signs every device out', async () => {
    const { service, authService } = build()
    await service.deactivateAccount(USER_ID)
    expect(authService.logout).toHaveBeenCalledWith(USER_ID)
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
