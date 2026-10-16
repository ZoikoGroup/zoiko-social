import { generateKeyPairSync } from 'node:crypto'
import { FcmClient, isTokenGone, parseServiceAccount } from './fcm.client'
import type { FcmMessage, FcmResult } from './fcm.client'
import { RegisterDeviceSchema, UnregisterDeviceSchema } from './push.schemas'
import { PushService } from './push.service'

/**
 * Native push for the Android app: FCM device tokens alongside browser
 * subscriptions. The rules mirror Web Push — best effort, prune what FCM says is
 * gone, tolerate what might be transient — plus the one thing FCM adds: an
 * INVALID_ARGUMENT only counts against the token when FCM says the token is it.
 */

jest.mock('web-push', () => ({ setVapidDetails: jest.fn(), sendNotification: jest.fn() }))

// jose is ESM-only and jest.setup.js stubs it out; FcmClient genuinely signs, so
// this stands in a minimal RS256 signer with jose's call shape (the real library
// is exercised outside Jest — see the PR notes).
jest.mock('jose', () => {
  const { createSign } = jest.requireActual<typeof import('node:crypto')>('node:crypto')
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url')
  class SignJWT {
    private header: Record<string, unknown> = {}
    constructor(private readonly payload: Record<string, unknown>) {}
    setProtectedHeader(h: Record<string, unknown>) { this.header = h; return this }
    setIssuer(v: string) { this.payload.iss = v; return this }
    setSubject(v: string) { this.payload.sub = v; return this }
    setAudience(v: string) { this.payload.aud = v; return this }
    setIssuedAt() { this.payload.iat = Math.floor(Date.now() / 1000); return this }
    setExpirationTime() { this.payload.exp = (this.payload.iat as number) + 3600; return this }
    async sign(key: string) {
      const data = `${b64(this.header)}.${b64(this.payload)}`
      return `${data}.${createSign('RSA-SHA256').update(data).sign(key, 'base64url')}`
    }
  }
  return { importPKCS8: async (pem: string) => pem, SignJWT, createRemoteJWKSet: jest.fn(), jwtVerify: jest.fn() }
})

const USER = 'user-1'
const TOKEN = 'dQw4w9WgXcQ:APA91bH' + 'x'.repeat(140)

describe('device schemas', () => {
  it('accepts an FCM registration token', () => {
    expect(RegisterDeviceSchema.safeParse({ token: TOKEN, platform: 'android' }).success).toBe(true)
  })

  it.each([
    ['too short', 'abc'],
    ['not token characters', 'x'.repeat(40) + ' <script>'],
  ])('refuses a token that is %s', (_label, token) => {
    expect(RegisterDeviceSchema.safeParse({ token, platform: 'android' }).success).toBe(false)
  })

  it('refuses a platform it does not send to', () => {
    expect(RegisterDeviceSchema.safeParse({ token: TOKEN, platform: 'ios' }).success).toBe(false)
  })

  it('always allows unregistering', () => {
    expect(UnregisterDeviceSchema.safeParse({ token: 'legacy' }).success).toBe(true)
  })
})

function buildService(opts: {
  devices?: { id: string; failureCount?: number }[]
  fcmResults?: FcmResult[]
  fcmConfigured?: boolean
}) {
  const prisma = {
    pushSubscription: { findMany: jest.fn().mockResolvedValue([]) },
    pushDevice: {
      upsert: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockImplementation((args: { skip?: number }) =>
        // The per-member ceiling query (skip) finds nothing over the limit here.
        Promise.resolve(
          args.skip !== undefined
            ? []
            : (opts.devices ?? []).map((d) => ({
                id: d.id,
                token: `${TOKEN}-${d.id}`,
                failureCount: d.failureCount ?? 0,
              })),
        ),
      ),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  }
  const results = [...(opts.fcmResults ?? [])]
  const fcm = {
    isConfigured: () => opts.fcmConfigured ?? true,
    send: jest.fn((_m: FcmMessage) => Promise.resolve(results.shift() ?? 'sent')),
  }
  // VAPID deliberately off: devices must not depend on Web Push being configured.
  const service = new PushService(prisma as never, { pushConfigured: false } as never, fcm as never)
  service.onModuleInit()
  return { service, prisma, fcm }
}

describe('PushService devices', () => {
  it('keys on the token and moves the device to whoever registers it', async () => {
    const { service, prisma } = buildService({})
    await service.registerDevice(USER, { token: TOKEN, platform: 'android' })
    expect(prisma.pushDevice.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: TOKEN },
        update: expect.objectContaining({ userId: USER, failureCount: 0 }),
      }),
    )
  })

  it('unregisters by token alone, since a signed-out app has no session', async () => {
    const { service, prisma } = buildService({})
    await service.unregisterDevice(TOKEN)
    expect(prisma.pushDevice.deleteMany).toHaveBeenCalledWith({ where: { token: TOKEN } })
  })

  it('sends a data message with string values to every device, without VAPID keys', async () => {
    const { service, fcm } = buildService({ devices: [{ id: 'a' }, { id: 'b' }] })
    const result = await service.sendToUser(USER, {
      title: 'Ada',
      body: 'hi',
      type: 'new_message',
      id: 'm1',
      url: '/messages?conversation=c1',
    })
    expect(result).toEqual({ sent: 2, pruned: 0 })
    expect(fcm.send).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { title: 'Ada', body: 'hi', type: 'new_message', id: 'm1', url: '/messages?conversation=c1' },
        collapseKey: 'new_message',
        ttlSeconds: 86400,
      }),
    )
  })

  it('gives a ringing call a short life, so a late ring never arrives', async () => {
    const { service, fcm } = buildService({ devices: [{ id: 'a' }] })
    await service.sendToUser(USER, { title: 'Ada', type: 'call_invite', collapseKey: 'call.incoming' })
    expect(fcm.send).toHaveBeenCalledWith(expect.objectContaining({ ttlSeconds: 60, collapseKey: 'call.incoming' }))
  })

  it('deletes a token FCM reports gone', async () => {
    const { service, prisma } = buildService({ devices: [{ id: 'dead' }], fcmResults: ['gone'] })
    await expect(service.sendToUser(USER, { title: 't', type: 'x' })).resolves.toEqual({ sent: 0, pruned: 1 })
    expect(prisma.pushDevice.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['dead'] } } })
  })

  it('keeps a token that failed for a reason that might pass, and gives up after three', async () => {
    const flaky = buildService({ devices: [{ id: 'flaky' }], fcmResults: ['failed'] })
    await flaky.service.sendToUser(USER, { title: 't', type: 'x' })
    expect(flaky.prisma.pushDevice.update).toHaveBeenCalledWith({ where: { id: 'flaky' }, data: { failureCount: 1 } })

    const tired = buildService({ devices: [{ id: 'tired', failureCount: 2 }], fcmResults: ['failed'] })
    await expect(tired.service.sendToUser(USER, { title: 't', type: 'x' })).resolves.toEqual({ sent: 0, pruned: 1 })
  })

  it('clears the failure count of a device that recovers', async () => {
    const { service, prisma } = buildService({ devices: [{ id: 'back', failureCount: 2 }] })
    await service.sendToUser(USER, { title: 't', type: 'x' })
    expect(prisma.pushDevice.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['back'] } },
      data: { failureCount: 0 },
    })
  })

  it('does nothing for devices when FCM is not configured', async () => {
    const { service, prisma } = buildService({ devices: [{ id: 'a' }], fcmConfigured: false })
    await expect(service.sendToUser(USER, { title: 't', type: 'x' })).resolves.toEqual({ sent: 0, pruned: 0 })
    expect(prisma.pushDevice.findMany).not.toHaveBeenCalled()
  })
})

describe('FCM error mapping', () => {
  const fcmError = (errorCode: string, message = '') => ({ error: { message, details: [{ errorCode }] } })

  it('treats UNREGISTERED as gone', () => {
    expect(isTokenGone(404, fcmError('UNREGISTERED'))).toBe(true)
  })

  it('treats an invalid registration token as gone', () => {
    expect(isTokenGone(400, fcmError('INVALID_ARGUMENT', 'The registration token is not a valid FCM registration token'))).toBe(true)
  })

  // A bad payload is our bug, not the device's — it must not delete every device.
  it('does not treat a malformed message as a dead token', () => {
    expect(isTokenGone(400, fcmError('INVALID_ARGUMENT', 'Invalid value at message.android.ttl'))).toBe(false)
  })

  it.each([429, 500, 503])('keeps the token on %i', (status) => {
    expect(isTokenGone(status, null)).toBe(false)
  })
})

describe('FcmClient', () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  const account = { project_id: 'zoiko-test', client_email: 'push@zoiko-test.iam.gserviceaccount.com', private_key: pem }

  it('reads the key as JSON, as base64, and with escaped newlines', () => {
    const json = JSON.stringify(account)
    expect(parseServiceAccount(json)?.project_id).toBe('zoiko-test')
    expect(parseServiceAccount(Buffer.from(json).toString('base64'))?.client_email).toBe(account.client_email)
    const escaped = JSON.stringify({ ...account, private_key: pem.replace(/\n/g, '\\n') })
    expect(parseServiceAccount(escaped)?.private_key).toBe(pem)
    expect(parseServiceAccount('{"type":"not a key"}')).toBeNull()
  })

  describe('send', () => {
    const realFetch = global.fetch
    afterEach(() => {
      global.fetch = realFetch
    })

    function client(): FcmClient {
      const c = new FcmClient({ fcmServiceAccountJson: JSON.stringify(account) } as never)
      c.onModuleInit()
      return c
    }

    function mockFetch(sendStatus: number, sendBody: unknown = {}) {
      const fetchMock = jest.fn((url: string) =>
        Promise.resolve(
          url.startsWith('https://oauth2.googleapis.com/')
            ? new Response(JSON.stringify({ access_token: 'ya29.test', expires_in: 3600 }), { status: 200 })
            : new Response(JSON.stringify(sendBody), { status: sendStatus }),
        ),
      )
      global.fetch = fetchMock as never
      return fetchMock
    }

    const message: FcmMessage = { token: TOKEN, data: { title: 'Hi', type: 'x' }, collapseKey: 'x', ttlSeconds: 60 }

    it('authenticates with a signed assertion and posts a high-priority data message', async () => {
      const fetchMock = mockFetch(200, { name: 'projects/zoiko-test/messages/1' })
      await expect(client().send(message)).resolves.toBe('sent')

      const [tokenUrl, tokenInit] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(tokenUrl).toBe('https://oauth2.googleapis.com/token')
      const form = new URLSearchParams(String(tokenInit.body))
      expect(form.get('grant_type')).toBe('urn:ietf:params:oauth:grant-type:jwt-bearer')
      const claims = JSON.parse(Buffer.from(String(form.get('assertion')).split('.')[1], 'base64url').toString())
      expect(claims).toMatchObject({
        iss: account.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
      })

      const [sendUrl, sendInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit]
      expect(sendUrl).toBe('https://fcm.googleapis.com/v1/projects/zoiko-test/messages:send')
      expect((sendInit.headers as Record<string, string>).Authorization).toBe('Bearer ya29.test')
      expect(JSON.parse(String(sendInit.body))).toEqual({
        message: {
          token: TOKEN,
          data: { title: 'Hi', type: 'x' },
          android: { priority: 'HIGH', ttl: '60s', collapse_key: 'x' },
        },
      })
    })

    it('reuses the access token across sends', async () => {
      const fetchMock = mockFetch(200)
      const c = client()
      await c.send(message)
      await c.send(message)
      expect(fetchMock.mock.calls.filter(([u]) => String(u).includes('oauth2')).length).toBe(1)
    })

    it('reports a token FCM no longer knows as gone', async () => {
      mockFetch(404, { error: { status: 'NOT_FOUND', details: [{ errorCode: 'UNREGISTERED' }] } })
      await expect(client().send(message)).resolves.toBe('gone')
    })

    it('reports a server error as a failure, not a dead token', async () => {
      mockFetch(503, { error: { status: 'UNAVAILABLE' } })
      await expect(client().send(message)).resolves.toBe('failed')
    })

    it('is inert without a key', async () => {
      const fetchMock = mockFetch(200)
      const c = new FcmClient({ fcmServiceAccountJson: undefined } as never)
      c.onModuleInit()
      expect(c.isConfigured()).toBe(false)
      await expect(c.send(message)).resolves.toBe('failed')
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
