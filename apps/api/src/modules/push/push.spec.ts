import { NotificationPreferenceService } from './notification-preference.service'
import { PushService } from './push.service'

/**
 * The two decisions that matter here.
 *
 * Preferences: push must answer to its own switches, not the in-app ones, and it
 * must fail closed — a push withheld by mistake costs nothing because the in-app
 * record is already saved, while a push sent against the member's wishes cannot
 * be taken back.
 *
 * Pruning: a push service answers 404 or 410 when an endpoint is gone for good.
 * Keeping those rows means a failed request on every future notification, so
 * they have to delete themselves.
 */

jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
}))

import * as webpush from 'web-push'

const USER = 'user-1'
const KEY = 'social.reactions'

function buildPreferences(opts: {
  pushEnabled?: boolean | null
  row?: boolean | null
  throws?: boolean
}) {
  const prisma = {
    userSettings: {
      findUnique: jest.fn().mockImplementation(() =>
        opts.throws
          ? Promise.reject(new Error('database unreachable'))
          : Promise.resolve(
              opts.pushEnabled === null ? null : { pushEnabled: opts.pushEnabled ?? true },
            ),
      ),
    },
    notificationPreference: {
      findUnique: jest
        .fn()
        .mockResolvedValue(
          opts.row === null || opts.row === undefined ? null : { enabled: opts.row },
        ),
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({}),
    },
  }
  return { service: new NotificationPreferenceService(prisma as never), prisma }
}

describe('NotificationPreferenceService.allowsPush', () => {
  it('delivers when nothing has been changed', async () => {
    const { service } = buildPreferences({ pushEnabled: true, row: null })
    await expect(service.allowsPush(USER, KEY)).resolves.toBe(true)
  })

  it('delivers when the member has no settings row at all', async () => {
    const { service } = buildPreferences({ pushEnabled: null, row: null })
    await expect(service.allowsPush(USER, KEY)).resolves.toBe(true)
  })

  it('withholds when the master switch is off', async () => {
    const { service } = buildPreferences({ pushEnabled: false, row: true })
    await expect(service.allowsPush(USER, KEY)).resolves.toBe(false)
  })

  it('withholds when the category is off', async () => {
    const { service } = buildPreferences({ pushEnabled: true, row: false })
    await expect(service.allowsPush(USER, KEY)).resolves.toBe(false)
  })

  // A type with no registry key has no category control, but "no notifications
  // on my device" must still mean all of them.
  it('applies the master switch to types with no category', async () => {
    const { service, prisma } = buildPreferences({ pushEnabled: false, row: null })
    await expect(service.allowsPush(USER, undefined)).resolves.toBe(false)
    expect(prisma.notificationPreference.findUnique).not.toHaveBeenCalled()
  })

  it('fails closed when the lookup errors', async () => {
    const { service } = buildPreferences({ throws: true })
    await expect(service.allowsPush(USER, KEY)).resolves.toBe(false)
  })

  it('refuses to store a key the registry does not define', async () => {
    const { service, prisma } = buildPreferences({})
    await expect(service.set(USER, 'not.a.real.key', 'push', false)).resolves.toBe(false)
    expect(prisma.notificationPreference.upsert).not.toHaveBeenCalled()
  })

  it('fills in defaults for categories with no stored row', async () => {
    const { service } = buildPreferences({})
    const prefs = await service.getForChannel(USER, 'push')
    expect(prefs['social.reactions']).toBe(true)
    expect(prefs['messages.activity']).toBe(true)
  })
})

function buildSender(subs: { id: string; failureCount?: number }[]) {
  const prisma = {
    pushSubscription: {
      findMany: jest.fn().mockResolvedValue(
        subs.map((s) => ({
          id: s.id,
          endpoint: 'https://push.example/' + s.id,
          p256dh: 'key',
          auth: 'auth',
          failureCount: s.failureCount ?? 0,
        })),
      ),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  }
  const config = {
    pushConfigured: true,
    vapidPublicKey: 'pub',
    vapidPrivateKey: 'priv',
    vapidSubject: 'mailto:support@example.com',
  }
  const service = new PushService(prisma as never, config as never)
  service.onModuleInit()
  return { service, prisma }
}

const payload = { title: 'Hello', type: 'new_like' }
const mockSend = webpush.sendNotification as unknown as jest.Mock

describe('PushService.sendToUser', () => {
  beforeEach(() => jest.clearAllMocks())

  it('sends to every device the member has', async () => {
    const { service } = buildSender([{ id: 'a' }, { id: 'b' }])
    mockSend.mockResolvedValue({})
    await expect(service.sendToUser(USER, payload)).resolves.toEqual({ sent: 2, pruned: 0 })
  })

  it.each([404, 410])('deletes an endpoint reported gone (%i)', async (status) => {
    const { service, prisma } = buildSender([{ id: 'dead' }])
    mockSend.mockRejectedValue({ statusCode: status })
    await expect(service.sendToUser(USER, payload)).resolves.toEqual({ sent: 0, pruned: 1 })
    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['dead'] } },
    })
  })

  it('keeps an endpoint that failed for a reason that might pass', async () => {
    const { service, prisma } = buildSender([{ id: 'flaky' }])
    mockSend.mockRejectedValue({ statusCode: 500 })
    await expect(service.sendToUser(USER, payload)).resolves.toEqual({ sent: 0, pruned: 0 })
    expect(prisma.pushSubscription.update).toHaveBeenCalledWith({
      where: { id: 'flaky' },
      data: { failureCount: 1 },
    })
  })

  it('gives up on an endpoint that keeps failing', async () => {
    const { service, prisma } = buildSender([{ id: 'tired', failureCount: 2 }])
    mockSend.mockRejectedValue({ statusCode: 500 })
    await expect(service.sendToUser(USER, payload)).resolves.toEqual({ sent: 0, pruned: 1 })
    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['tired'] } },
    })
  })

  // Three failures spread over months must not add up to a deletion.
  it('clears the failure count of a device that recovers', async () => {
    const { service, prisma } = buildSender([{ id: 'back', failureCount: 2 }])
    mockSend.mockResolvedValue({})
    await service.sendToUser(USER, payload)
    expect(prisma.pushSubscription.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['back'] } },
      data: { failureCount: 0 },
    })
  })

  it('does not clear the count of a device that just failed', async () => {
    const { service, prisma } = buildSender([{ id: 'still-bad', failureCount: 1 }])
    mockSend.mockRejectedValue({ statusCode: 503 })
    await service.sendToUser(USER, payload)
    expect(prisma.pushSubscription.updateMany).not.toHaveBeenCalled()
  })

  it('does nothing without VAPID keys, rather than throwing', async () => {
    const prisma = { pushSubscription: { findMany: jest.fn() } }
    const service = new PushService(prisma as never, { pushConfigured: false } as never)
    service.onModuleInit()
    await expect(service.sendToUser(USER, payload)).resolves.toEqual({ sent: 0, pruned: 0 })
    expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled()
  })
})
