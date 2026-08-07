import { NotificationWriterService } from './notification-writer.service'
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

  const service = new NotificationWriterService(
    { notification: { create } } as unknown as PrismaService,
    { publishToUser } as unknown as RealtimeService,
    { decideInApp } as unknown as CommsDecisionService,
  )
  return { service, create, publishToUser, decideInApp }
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
})
