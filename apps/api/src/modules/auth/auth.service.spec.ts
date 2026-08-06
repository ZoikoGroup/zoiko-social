import { AuthService } from './auth.service'
import type { ConfigService } from '../config/config.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'
import type { SupabaseAdminClient } from '../database/database.providers'
import type { RedisService } from '../redis/redis.service'

const USER_ID = 'member-1'
const SESSION = { access_token: 'at', refresh_token: 'rt', expires_at: 123 }
const DAY_MS = 86_400_000

function build(opts: {
  profile?: { username: string; state: string; deletionRequestedAt: Date | null } | null
  signInFails?: boolean
  graceDays?: number
} = {}) {
  const prisma = {
    profile: {
      findUnique: jest.fn().mockResolvedValue(opts.profile === undefined ? null : opts.profile),
      update: jest.fn().mockResolvedValue({}),
    },
  }
  const supabaseAdmin = {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue(
        opts.signInFails
          ? { data: {}, error: { message: 'bad creds' } }
          : { data: { session: SESSION, user: { id: USER_ID, email: 'a@b.com' } }, error: null },
      ),
      exchangeCodeForSession: jest.fn().mockResolvedValue({
        data: { session: SESSION, user: { id: USER_ID, email: 'a@b.com' } }, error: null,
      }),
      signInWithOAuth: jest.fn().mockResolvedValue({
        data: { url: 'https://project.supabase.co/auth/v1/authorize?provider=facebook' }, error: null,
      }),
      admin: {
        deleteUser: jest.fn().mockResolvedValue({ error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        getUserById: jest.fn().mockResolvedValue({ data: { user: { email: 'a@b.com' } }, error: null }),
      },
    },
  }
  const auditLog = { record: jest.fn().mockResolvedValue(undefined) }
  const config = { env: { ACCOUNT_DELETION_GRACE_DAYS: opts.graceDays ?? 30 }, allowedOrigin: 'http://x' }

  // Reactivation must clear the cached profile, or the account comes back while
  // its page keeps 404ing under the state gate in getProfileById.
  const redis = {
    invalidateProfile: jest.fn().mockResolvedValue(undefined),
    invalidateUsername: jest.fn().mockResolvedValue(undefined),
  }

  const service = new AuthService(
    supabaseAdmin as unknown as SupabaseAdminClient,
    config as unknown as ConfigService,
    prisma as unknown as PrismaService,
    auditLog as unknown as AuditLogService,
    redis as unknown as RedisService,
  )
  return { service, prisma, supabaseAdmin, auditLog, redis }
}

const active = { username: 'someone', state: 'active', deletionRequestedAt: null }

describe('AuthService.login — ordinary sign-in', () => {
  it('returns a session and leaves an active account alone', async () => {
    const { service, prisma } = build({ profile: active })
    const result = await service.login('a@b.com', 'pw')
    expect(result.accessToken).toBe('at')
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it('rejects bad credentials before touching account state', async () => {
    const { service, prisma } = build({ profile: active, signInFails: true })
    await expect(service.login('a@b.com', 'wrong')).rejects.toMatchObject({
      response: { code: 'INVALID_CREDENTIALS' },
    })
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })
})

// Signing in is the ONLY way back from these states: JwtAuthGuard rejects every
// authenticated request from a non-active account, so there can be no
// "reactivate" endpoint.
describe('AuthService.login — restores a hidden account', () => {
  it('reactivates a deactivated account', async () => {
    const { service, prisma, auditLog } = build({
      profile: { username: 'someone', state: 'deactivated', deletionRequestedAt: null },
    })

    const result = await service.login('a@b.com', 'pw')

    expect(result.accessToken).toBe('at')
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { state: 'active', deactivatedAt: null, deletionRequestedAt: null },
    })
    expect(auditLog.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'account.reactivate' }))
  })

  it('clears the cached profile so the account is visible again', async () => {
    // getProfileById gates on state, and the cached copy still says
    // "deactivated". Without this invalidation the row flips to active while
    // the profile page keeps answering 404 until the entry expires — the
    // account comes back everywhere except where anyone would look.
    const { service, redis } = build({
      profile: { username: 'someone', state: 'deactivated', deletionRequestedAt: null },
    })

    await service.login('a@b.com', 'pw')

    expect(redis.invalidateProfile).toHaveBeenCalledWith(USER_ID)
    expect(redis.invalidateUsername).toHaveBeenCalledWith('someone')
  })

  it('cancels a pending deletion inside the grace period', async () => {
    const { service, prisma, auditLog } = build({
      profile: { username: 'someone', state: 'pending_deletion', deletionRequestedAt: new Date(Date.now() - 5 * DAY_MS) },
    })

    await expect(service.login('a@b.com', 'pw')).resolves.toMatchObject({ accessToken: 'at' })

    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { state: 'active', deactivatedAt: null, deletionRequestedAt: null } }),
    )
    expect(auditLog.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'account.deletion_cancelled' }),
    )
  })

  it('restores on the last day of the window', async () => {
    const { service, prisma } = build({
      profile: { username: 'someone', state: 'pending_deletion', deletionRequestedAt: new Date(Date.now() - 29.5 * DAY_MS) },
    })
    await expect(service.login('a@b.com', 'pw')).resolves.toBeDefined()
    expect(prisma.profile.update).toHaveBeenCalled()
  })

  it('honours a shorter configured grace period', async () => {
    const { service, supabaseAdmin } = build({
      graceDays: 7,
      profile: { username: 'someone', state: 'pending_deletion', deletionRequestedAt: new Date(Date.now() - 10 * DAY_MS) },
    })
    // 10 days is inside 30 but outside 7 — must be treated as expired.
    await expect(service.login('a@b.com', 'pw')).rejects.toMatchObject({
      response: { code: 'INVALID_CREDENTIALS' },
    })
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(USER_ID)
  })
})

describe('AuthService.login — grace period expired', () => {
  const expired = {
    username: 'someone',
    state: 'pending_deletion',
    deletionRequestedAt: new Date(Date.now() - 31 * DAY_MS),
  }

  it('purges the account and refuses the sign-in', async () => {
    // Done here rather than left to the nightly job because that job needs Redis;
    // a deadline must not fail to hold because a queue was down.
    const { service, supabaseAdmin } = build({ profile: expired })

    await expect(service.login('a@b.com', 'pw')).rejects.toMatchObject({
      response: { code: 'INVALID_CREDENTIALS' },
    })
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(USER_ID)
  })

  it('records the purge with a null actor, since the profile is being removed', async () => {
    const { service, auditLog } = build({ profile: expired })
    await expect(service.login('a@b.com', 'pw')).rejects.toBeDefined()
    expect(auditLog.record).toHaveBeenCalledWith({
      actorId: null,
      action: 'account.delete',
      entityType: 'profile',
      entityId: USER_ID,
      newData: { username: 'someone', deletedBy: 'grace_period_expired' },
    })
  })

  it('never reactivates an expired account', async () => {
    const { service, prisma } = build({ profile: expired })
    await expect(service.login('a@b.com', 'pw')).rejects.toBeDefined()
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it('still refuses the sign-in if the purge itself fails', async () => {
    // Better to deny access than to let someone back into an account that is
    // past its deletion deadline.
    const { service, supabaseAdmin } = build({ profile: expired })
    supabaseAdmin.auth.admin.deleteUser.mockRejectedValue(new Error('supabase down'))
    await expect(service.login('a@b.com', 'pw')).rejects.toMatchObject({
      response: { code: 'INVALID_CREDENTIALS' },
    })
  })

  it('treats a missing request date as not expired rather than purging', async () => {
    // Guards against a null timestamp being read as epoch 0 and deleting an account.
    const { service, prisma, supabaseAdmin } = build({
      profile: { username: 'someone', state: 'pending_deletion', deletionRequestedAt: null },
    })
    await expect(service.login('a@b.com', 'pw')).resolves.toBeDefined()
    expect(supabaseAdmin.auth.admin.deleteUser).not.toHaveBeenCalled()
    expect(prisma.profile.update).toHaveBeenCalled()
  })
})

describe('AuthService.login — moderated accounts are not touched', () => {
  it.each(['suspended', 'banned'])('leaves a %s account in that state', async (state) => {
    // Signing in must not undo a moderator's decision. The guard blocks the
    // account on its next request instead.
    const { service, prisma, auditLog } = build({
      profile: { username: 'someone', state, deletionRequestedAt: null },
    })

    await service.login('a@b.com', 'pw')

    expect(prisma.profile.update).not.toHaveBeenCalled()
    expect(auditLog.record).not.toHaveBeenCalled()
  })

  it('does nothing when the profile row is missing', async () => {
    const { service, prisma } = build({ profile: null })
    await expect(service.login('a@b.com', 'pw')).resolves.toBeDefined()
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })
})

describe('AuthService.handleOAuthCallback', () => {
  it('restores a hidden account on OAuth sign-in too', async () => {
    const { service, prisma } = build({
      profile: { username: 'someone', state: 'deactivated', deletionRequestedAt: null },
    })
    await service.handleOAuthCallback('code')
    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { state: 'active', deactivatedAt: null, deletionRequestedAt: null } }),
    )
  })

  it('refuses an expired account on OAuth sign-in', async () => {
    const { service, supabaseAdmin } = build({
      profile: { username: 'someone', state: 'pending_deletion', deletionRequestedAt: new Date(Date.now() - 31 * DAY_MS) },
    })
    await expect(service.handleOAuthCallback('code')).rejects.toBeDefined()
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(USER_ID)
  })
})

// Supabase builds an authorize URL for any provider it knows by name, enabled or
// not — it only says no when the URL is visited. Answering 200 with such a URL
// sends the visitor to a raw GoTrue JSON error page, so getOAuthUrl checks first.
describe('AuthService.getOAuthUrl — provider enablement', () => {
  const fetchMock = jest.fn()
  const realFetch = global.fetch

  beforeEach(() => fetchMock.mockReset())
  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch
  })
  afterAll(() => {
    global.fetch = realFetch
  })

  it('returns the URL when authorize redirects to the provider', async () => {
    const { service } = build()
    fetchMock.mockResolvedValue({ status: 302 })
    await expect(service.getOAuthUrl('facebook')).resolves.toEqual({
      url: 'https://project.supabase.co/auth/v1/authorize?provider=facebook',
    })
  })

  it('refuses with a message worth showing when the provider is not enabled', async () => {
    const { service } = build()
    fetchMock.mockResolvedValue({ status: 400 })
    await expect(service.getOAuthUrl('facebook')).rejects.toMatchObject({
      response: {
        code: 'OAUTH_PROVIDER_DISABLED',
        message: 'Facebook sign-in is not available right now.',
      },
    })
  })

  it('probes an enabled provider once and remembers it', async () => {
    const { service } = build()
    fetchMock.mockResolvedValue({ status: 302 })
    await service.getOAuthUrl('facebook')
    await service.getOAuthUrl('facebook')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  // Nothing negative is cached, so enabling a provider in the Supabase dashboard
  // takes effect without an API restart.
  it('re-probes a disabled provider every time', async () => {
    const { service } = build()
    fetchMock.mockResolvedValue({ status: 400 })
    await expect(service.getOAuthUrl('facebook')).rejects.toBeDefined()
    fetchMock.mockResolvedValue({ status: 302 })
    await expect(service.getOAuthUrl('facebook')).resolves.toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  // Our own probe failing is not evidence against the provider.
  it('lets the caller through when the probe cannot reach Supabase', async () => {
    const { service } = build()
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'))
    await expect(service.getOAuthUrl('facebook')).resolves.toEqual({
      url: 'https://project.supabase.co/auth/v1/authorize?provider=facebook',
    })
  })
})
