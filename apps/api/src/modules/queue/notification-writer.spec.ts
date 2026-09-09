import { NotificationWriterService } from './notification-writer.service'
import type { PushService } from '../push/push.service'
import type { NotificationPreferenceService } from '../push/notification-preference.service'
import type { CommsDecisionService } from '../comms/comms-decision.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RealtimeService } from '../realtime/realtime.service'

/**
 * The single write path for notifications.
 *
 * Preferences are enforced here rather than at the ~45 producer sites, so these
 * tests guard the property that makes that safe: a withheld notification must
 * leave no trace on *either* channel. Skipping the row but still pushing over
 * the socket would put a toast on screen with nothing behind it, and the bell
 * count would disagree with the list.
 */

function build(deliver: boolean) {
  const create = jest.fn().mockResolvedValue({
    id: 'n1',
    type: 'new_like',
    title: 'Someone liked your post',
    body: null,
    data: null,
    isRead: false,
    createdAt: new Date('2026-08-07T10:00:00Z'),
  })
  const publishToUser = jest.fn().mockResolvedValue(undefined)
  const decideInApp = jest.fn().mockResolvedValue(
    deliver ? { deliver: true } : { deliver: false, reason: 'social.reactions' },
  )

  // Push is stubbed rather than exercised: these tests cover the in-app write
  // path and push has its own suite. What matters here is only that a push
  // cannot disturb the record it follows.
  const sendToUser = jest.fn().mockResolvedValue({ sent: 0, pruned: 0 })
  const allowsPush = jest.fn().mockResolvedValue(true)

  const service = new NotificationWriterService(
    { notification: { create } } as unknown as PrismaService,
    { publishToUser } as unknown as RealtimeService,
    { decideInApp } as unknown as CommsDecisionService,
    { sendToUser } as unknown as PushService,
    { allowsPush } as unknown as NotificationPreferenceService,
  )
  return { service, create, publishToUser, decideInApp, sendToUser, allowsPush }
}

const JOB = { userId: 'u1', type: 'new_like', title: 'Someone liked your post' }

describe('notification writer', () => {
  it('persists and pushes when the preference allows it', async () => {
    const { service, create, publishToUser } = build(true)

    await service.write(JOB)

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: 'u1' }) }))
    expect(publishToUser).toHaveBeenCalledWith('u1', 'notification.new', expect.objectContaining({ id: 'n1' }))
  })

  it('writes nothing and pushes nothing when the preference is off', async () => {
    const { service, create, publishToUser } = build(false)

    await service.write(JOB)

    expect(create).not.toHaveBeenCalled()
    expect(publishToUser).not.toHaveBeenCalled()
  })

  it('asks about the recipient and type it was actually given', async () => {
    // A gate that looked up the wrong user would read the sender's preferences
    // and silence notifications for everyone but them.
    const { service, decideInApp } = build(true)

    await service.write({ userId: 'recipient-9', type: 'new_comment', title: 'x' })

    expect(decideInApp).toHaveBeenCalledWith('recipient-9', 'new_comment')
  })

  it('resolves quietly when it withholds, so the queue does not retry', async () => {
    const { service } = build(false)
    await expect(service.write(JOB)).resolves.toBeUndefined()
  })

  // ── Push ───────────────────────────────────────────────────────────────────

  it('sends a push after the record is saved', async () => {
    const { service, sendToUser } = build(true)

    await service.write({ ...JOB, data: { postId: 'post-7' } })

    expect(sendToUser).toHaveBeenCalledWith(
      JOB.userId,
      expect.objectContaining({ title: JOB.title, type: 'new_like', url: '/p/post-7' }),
    )
  })

  it('does not push when the push preference is off, but still writes the record', async () => {
    // The whole point of separating the channels: a silent phone must not mean a
    // missing notification.
    const { service, create, publishToUser, sendToUser, allowsPush } = build(true)
    allowsPush.mockResolvedValue(false)

    await service.write(JOB)

    expect(create).toHaveBeenCalled()
    expect(publishToUser).toHaveBeenCalled()
    expect(sendToUser).not.toHaveBeenCalled()
  })

  // Every one of these has to be a route the web app actually serves. The first
  // version sent people to /post/:id and /communities/:id, neither of which
  // exists — a tapped notification would have opened a 404, which reads as push
  // being broken rather than as one wrong string.
  it.each([
    [{ conversationId: 'c1' }, '/messages?conversation=c1'],
    [{ postId: 'p1' }, '/p/p1'],
    [{ eventId: 'e1' }, '/events/e1'],
    [{ communityId: 'g1' }, '/communities'],
    [{ orderId: 'o1' }, '/shop/orders'],
    [{}, '/notifications'],
  ])('links %j to %s', async (data, expected) => {
    const { service, sendToUser } = build(true)
    await service.write({ ...JOB, data })
    expect(sendToUser).toHaveBeenCalledWith(JOB.userId, expect.objectContaining({ url: expected }))
  })

  it('sends a follower notification to the profile, not the notification list', async () => {
    const { service, sendToUser } = build(true)
    await service.write({ userId: 'u1', type: 'new_follower', title: 'x', data: { actorUsername: 'ada' } })
    expect(sendToUser).toHaveBeenCalledWith('u1', expect.objectContaining({ url: '/profile/ada' }))
  })

  // Twelve likes should occupy one slot on the device, not twelve. The registry
  // already groups these for email; push reuses the same grouping.
  it('sends the registry collapse key so related alerts group', async () => {
    const { service, sendToUser } = build(true)
    await service.write({ ...JOB, type: 'new_like' })
    expect(sendToUser).toHaveBeenCalledWith(
      JOB.userId,
      expect.objectContaining({ collapseKey: 'social.reactions' }),
    )
  })

  it('omits the collapse key for a type that has no group', async () => {
    const { service, sendToUser } = build(true)
    await service.write({ userId: 'u1', type: 'breeding_request', title: 'x' })
    expect(sendToUser.mock.calls[0][1]).not.toHaveProperty('collapseKey')
  })

  it('survives a push that throws, because the record is already saved', async () => {
    const { service, create, sendToUser } = build(true)
    sendToUser.mockRejectedValue(new Error('push service unreachable'))

    await expect(service.write(JOB)).resolves.toBeUndefined()
    expect(create).toHaveBeenCalled()
  })
})
