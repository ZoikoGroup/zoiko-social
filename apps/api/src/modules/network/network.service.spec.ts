import { NetworkService, type FollowSuggestion } from './network.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { RealtimeService } from '../realtime/realtime.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'
import type { AffinityService } from '../personalization/affinity.service'

const VIEWER = 'viewer-1'
const FOLLOWED_A = 'author-a' // high affinity (30 likes' worth)
const FOLLOWED_B = 'author-b' // low affinity (below the like threshold)
const CANDIDATE_X = 'candidate-x'
const CANDIDATE_Y = 'candidate-y'
const CANDIDATE_Z = 'candidate-z'

function profile(id: string) {
  return {
    id,
    username: `user-${id}`,
    displayName: `User ${id}`,
    avatarUrl: null,
    bio: null,
    verificationTier: 'regular',
    professionalProfile: null,
  }
}

function build(overrides: {
  following?: { followingId: string }[]
  blocked?: { blockerId: string; blockedId: string }[]
  affinity?: Map<string, number>
  affinityRows?: { followerId: string; followingId: string }[]
  mutuals?: { followingId: string; _count: { followingId: number } }[]
  profiles?: Record<string, unknown>[]
  followsViewer?: { followerId: string }[]
} = {}) {
  const prisma = {
    follow: {
      findMany: jest
        .fn()
        .mockImplementation((args: {
          where?: { followerId?: string | { in?: string[] }; followingId?: string }
        }) => {
          // attachFollowsViewer — followers of the suggested accounts
          if (args?.where?.followingId === VIEWER) return Promise.resolve(overrides.followsViewer ?? [])
          // the viewer's own following list
          if (args?.where?.followerId === VIEWER) return Promise.resolve(overrides.following ?? [])
          // affinity scan — followed by the viewer's high-affinity authors.
          // Honour the `in` seed filter so rows from below-threshold authors
          // (which the real query would never return) can't sneak in.
          const seedList = (args?.where?.followerId as { in?: string[] } | undefined)?.in
          if (Array.isArray(seedList)) {
            return Promise.resolve((overrides.affinityRows ?? []).filter((r) => seedList.includes(r.followerId)))
          }
          return Promise.resolve([])
        }),
      groupBy: jest.fn().mockResolvedValue(overrides.mutuals ?? []),
    },
    blockedUser: {
      findMany: jest.fn().mockResolvedValue(overrides.blocked ?? []),
    },
    profile: {
      findMany: jest.fn().mockResolvedValue(overrides.profiles ?? []),
    },
  }
  const affinity = {
    getAuthorAffinity: jest.fn().mockResolvedValue(overrides.affinity ?? new Map<string, number>()),
  }

  const service = new NetworkService(
    prisma as unknown as PrismaService,
    {} as unknown as RedisService,
    {} as unknown as RealtimeService,
    {} as unknown as NotificationQueueService,
    affinity as unknown as AffinityService,
  )
  return { service, prisma, affinity }
}

describe('NetworkService.getSuggestions', () => {
  it('ranks accounts followed by high-affinity authors above mutual-only accounts', async () => {
    const { service } = build({
      following: [{ followingId: FOLLOWED_A }, { followingId: FOLLOWED_B }],
      affinity: new Map([
        [FOLLOWED_A, 30], // above the one-like threshold
        [FOLLOWED_B, 2], // below it — ignored as a seed
      ]),
      affinityRows: [{ followerId: FOLLOWED_A, followingId: CANDIDATE_X }],
      mutuals: [
        { followingId: CANDIDATE_Z, _count: { followingId: 5 } },
        { followingId: CANDIDATE_X, _count: { followingId: 1 } },
        // Y is a mutual-only candidate: it appears via the friend-of-friend
        // pool with zero mutuals, not via the affinity scan (its seed author
        // is below the threshold, so the real query never returns that row).
        { followingId: CANDIDATE_Y, _count: { followingId: 0 } },
      ],
      profiles: [profile(CANDIDATE_X), profile(CANDIDATE_Y), profile(CANDIDATE_Z)],
    })

    const result = await service.getSuggestions(VIEWER, 10)

    // X has affinity score log10(1+30); Z has 5 mutuals but no affinity;
    // Y has neither. Affinity is primary → X, then Z (mutuals), then Y.
    expect(result.map((s) => s.id)).toEqual([CANDIDATE_X, CANDIDATE_Z, CANDIDATE_Y])
  })

  it('uses mutual connections as the tiebreaker for equal affinity', async () => {
    const { service } = build({
      following: [{ followingId: FOLLOWED_A }],
      affinity: new Map([[FOLLOWED_A, 30]]),
      affinityRows: [
        { followerId: FOLLOWED_A, followingId: CANDIDATE_X },
        { followerId: FOLLOWED_A, followingId: CANDIDATE_Y },
      ],
      mutuals: [
        { followingId: CANDIDATE_X, _count: { followingId: 2 } },
        { followingId: CANDIDATE_Y, _count: { followingId: 5 } },
      ],
      profiles: [profile(CANDIDATE_X), profile(CANDIDATE_Y)],
    })

    const result = await service.getSuggestions(VIEWER, 10)

    expect(result.map((s) => s.id)).toEqual([CANDIDATE_Y, CANDIDATE_X])
    expect(result[0]?.mutualConnections).toBe(5)
  })

  it('falls back to mutual-only ranking when the viewer has no affinity profile', async () => {
    const { service, affinity } = build({
      following: [{ followingId: FOLLOWED_A }],
      mutuals: [
        { followingId: CANDIDATE_Z, _count: { followingId: 5 } },
        { followingId: CANDIDATE_X, _count: { followingId: 2 } },
      ],
      profiles: [profile(CANDIDATE_X), profile(CANDIDATE_Z)],
    })

    const result = await service.getSuggestions(VIEWER, 10)

    expect(affinity.getAuthorAffinity).toHaveBeenCalledWith(VIEWER)
    expect(result.map((s) => s.id)).toEqual([CANDIDATE_Z, CANDIDATE_X])
  })

  it('excludes the viewer, already-followed and blocked accounts from the affinity scan', async () => {
    const { service, prisma } = build({
      following: [{ followingId: FOLLOWED_A }, { followingId: FOLLOWED_B }],
      blocked: [{ blockerId: VIEWER, blockedId: 'blocked-1' }],
      affinity: new Map([[FOLLOWED_A, 30]]),
      affinityRows: [{ followerId: FOLLOWED_A, followingId: CANDIDATE_X }],
      profiles: [profile(CANDIDATE_X)],
    })

    await service.getSuggestions(VIEWER, 10)

    const affinityScan = prisma.follow.findMany.mock.calls.find((args) =>
      Array.isArray((args[0]?.where?.followerId as { in?: string[] } | undefined)?.in),
    )
    expect(affinityScan?.[0]?.where?.followingId).toEqual({
      notIn: expect.arrayContaining([VIEWER, FOLLOWED_A, FOLLOWED_B, 'blocked-1']),
    })
  })

  it('never uses a blocked user\'s follow-graph as an affinity seed', async () => {
    const { service, prisma } = build({
      following: [{ followingId: FOLLOWED_A }],
      // The viewer liked this user's posts (high affinity) BEFORE blocking them
      blocked: [{ blockerId: VIEWER, blockedId: 'blocked-high-affinity' }],
      affinity: new Map([
        [FOLLOWED_A, 30],
        ['blocked-high-affinity', 50],
      ]),
      affinityRows: [{ followerId: FOLLOWED_A, followingId: CANDIDATE_X }],
      profiles: [profile(CANDIDATE_X)],
    })

    await service.getSuggestions(VIEWER, 10)

    const affinityScan = prisma.follow.findMany.mock.calls.find((args) =>
      Array.isArray((args[0]?.where?.followerId as { in?: string[] } | undefined)?.in),
    )
    expect(affinityScan?.[0]?.where?.followerId).toEqual({
      in: expect.not.arrayContaining(['blocked-high-affinity']),
    })
  })

  it('cold start (no affinity, no mutuals) returns verified professionals', async () => {
    const pros = [
      { ...profile('pro-1'), verificationTier: 'professional', professionalProfile: { category: 'vet', isVerified: true } },
      { ...profile('pro-2'), verificationTier: 'professional', professionalProfile: { category: 'groomer', isVerified: true } },
    ]
    const { service, prisma } = build({ profiles: pros })

    const result = await service.getSuggestions(VIEWER, 10)

    expect(result.map((s) => s.id)).toEqual(['pro-1', 'pro-2'])
    expect(prisma.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ professionalProfile: { isNot: null } }),
      }),
    )
  })

  it('decorates suggestions with the viewer follow state (Follow Back)', async () => {
    const { service } = build({
      following: [{ followingId: FOLLOWED_A }],
      affinity: new Map([[FOLLOWED_A, 30]]),
      affinityRows: [{ followerId: FOLLOWED_A, followingId: CANDIDATE_X }],
      profiles: [profile(CANDIDATE_X)],
      followsViewer: [{ followerId: CANDIDATE_X }],
    })

    const result = await service.getSuggestions(VIEWER, 10)
    const first = result[0] as FollowSuggestion & { followsViewer: boolean }

    expect(first.id).toBe(CANDIDATE_X)
    expect(first.followsViewer).toBe(true)
  })
})
