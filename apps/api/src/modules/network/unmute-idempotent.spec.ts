import { NetworkService } from './network.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RedisService } from '../redis/redis.service'
import type { RealtimeService } from '../realtime/realtime.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'
import type { AffinityService } from '../personalization/affinity.service'

/**
 * Unmuting something that is not muted.
 *
 * This used to throw 404 NOT_MUTED, which broke the mute control whenever the
 * client's cached relationship disagreed with the server: a stale `muted: true`
 * sent an unmute for a mute that was not there, and the member was shown
 * "Action failed — Resource not found" for an action whose goal — not muted —
 * was already met.
 *
 * `muteUser` upserts, so it has always been idempotent. The pair has to agree,
 * or the control is only reliable in one direction.
 */

function build(deletedCount: number) {
  const deleteMany = jest.fn().mockResolvedValue({ count: deletedCount })
  const invalidateRelationship = jest.fn().mockResolvedValue(undefined)

  const prisma = { mutedUser: { deleteMany } } as unknown as PrismaService
  const redis = { invalidateRelationship } as unknown as RedisService

  const service = new NetworkService(
    prisma,
    redis,
    {} as RealtimeService,
    {} as NotificationQueueService,
    {} as AffinityService,
  )

  return { service, deleteMany, invalidateRelationship }
}

describe('NetworkService.unmuteUser', () => {
  it('resolves when there was no mute to remove', async () => {
    const { service } = build(0)
    await expect(service.unmuteUser('me', 'them')).resolves.toBeUndefined()
  })

  it('resolves when a mute was removed', async () => {
    const { service } = build(1)
    await expect(service.unmuteUser('me', 'them')).resolves.toBeUndefined()
  })

  it('targets exactly the one pair', async () => {
    const { service, deleteMany } = build(1)
    await service.unmuteUser('me', 'them')
    expect(deleteMany).toHaveBeenCalledWith({ where: { muterId: 'me', mutedId: 'them' } })
  })

  it('busts the relationship cache when something changed', async () => {
    const { service, invalidateRelationship } = build(1)
    await service.unmuteUser('me', 'them')
    expect(invalidateRelationship).toHaveBeenCalledWith('me', 'them')
  })

  it('does not bust the cache when nothing changed', async () => {
    // A no-op should not cost a cache round-trip, and should not look like a
    // write in whatever reads that invalidation.
    const { service, invalidateRelationship } = build(0)
    await service.unmuteUser('me', 'them')
    expect(invalidateRelationship).not.toHaveBeenCalled()
  })

  it('can be called twice in a row without failing the second time', async () => {
    // The shape of the original bug: two clicks, or one click against a stale
    // cached state.
    const { service } = build(0)
    await expect(service.unmuteUser('me', 'them')).resolves.toBeUndefined()
    await expect(service.unmuteUser('me', 'them')).resolves.toBeUndefined()
  })
})
