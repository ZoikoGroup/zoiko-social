import { Logger } from '@nestjs/common'
import { registerSocketAuth, type SocketAuthData } from './socket-auth.middleware'
import type { JwtVerificationService } from '../auth/jwt-verification.service'

/**
 * The regression this locks down: identity used to be resolved inside the async
 * handleConnection, which Socket.IO does not await before dispatching buffered
 * events. Clients emit the instant the transport is up, so subscribe handlers
 * read `data.userId` as undefined and silently returned { ok: false } — no room
 * joined, no live updates, no error. Middleware must resolve it before the
 * connection is allowed to proceed.
 */

const USER = 'user-1'

interface FakeSocket {
  data: SocketAuthData
  handshake: { auth?: Record<string, unknown>; headers: Record<string, string | undefined> }
}

function build(verify: jest.Mock) {
  const middlewares: ((socket: unknown, next: (err?: Error) => void) => void)[] = []
  const server = { use: (fn: (s: unknown, n: (e?: Error) => void) => void) => middlewares.push(fn) }
  const logger = { warn: jest.fn(), log: jest.fn(), error: jest.fn() } as unknown as Logger
  registerSocketAuth(server as never, { verify } as unknown as JwtVerificationService, logger)
  const run = (socket: FakeSocket) =>
    new Promise<Error | undefined>((resolve) => middlewares[0]!(socket, resolve))
  return { server, run, logger, count: () => middlewares.length }
}

function socket(opts: { token?: string; header?: string } = {}): FakeSocket {
  return {
    data: {},
    handshake: {
      auth: opts.token ? { token: opts.token } : {},
      headers: opts.header ? { authorization: opts.header } : {},
    },
  }
}

describe('socket auth middleware', () => {
  it('resolves the user id BEFORE the connection proceeds', async () => {
    const verify = jest.fn().mockResolvedValue({ id: USER })
    const { run } = build(verify)
    const s = socket({ token: 'good' })

    const err = await run(s)

    // The ordering guarantee: by the time next() fires, userId is populated —
    // so no event handler can ever observe an unauthenticated socket.
    expect(err).toBeUndefined()
    expect(s.data.userId).toBe(USER)
  })

  it('accepts a bearer header as well as the auth payload', async () => {
    const verify = jest.fn().mockResolvedValue({ id: USER })
    const { run } = build(verify)
    const s = socket({ header: 'Bearer good' })

    await run(s)

    expect(verify).toHaveBeenCalledWith('good')
    expect(s.data.userId).toBe(USER)
  })

  it('records the reason and leaves userId unset when the token is missing', async () => {
    const verify = jest.fn()
    const { run } = build(verify)
    const s = socket()

    await run(s)

    expect(s.data.userId).toBeUndefined()
    expect(s.data.authError).toBe('Access token required')
    expect(verify).not.toHaveBeenCalled()
  })

  it('records the reason and leaves userId unset when the token is bad', async () => {
    const verify = jest.fn().mockRejectedValue(new Error('jwt expired'))
    const { run } = build(verify)
    const s = socket({ token: 'stale' })

    await run(s)

    expect(s.data.userId).toBeUndefined()
    expect(s.data.authError).toBe('jwt expired')
  })

  it('never rejects the connection itself — handleConnection still enforces', async () => {
    const verify = jest.fn().mockRejectedValue(new Error('nope'))
    const { run } = build(verify)

    // Rejecting here would change a client-visible `error` + disconnect into a
    // `connect_error`. Enforcement stays in handleConnection on purpose.
    await expect(run(socket({ token: 'bad' }))).resolves.toBeUndefined()
  })

  it('installs itself only once per server, even though both gateways register it', () => {
    const verify = jest.fn()
    const middlewares: unknown[] = []
    const server = { use: (fn: unknown) => middlewares.push(fn) }
    const logger = { warn: jest.fn() } as unknown as Logger
    const svc = { verify } as unknown as JwtVerificationService

    registerSocketAuth(server as never, svc, logger)
    registerSocketAuth(server as never, svc, logger)
    registerSocketAuth(server as never, svc, logger)

    // Two gateways share the default namespace; double-verifying every socket
    // would double the JWKS work per connection.
    expect(middlewares).toHaveLength(1)
  })

  it('does not re-verify a socket that already carries an identity', async () => {
    const verify = jest.fn().mockResolvedValue({ id: 'someone-else' })
    const { run } = build(verify)
    const s = socket({ token: 'good' })
    s.data.userId = USER

    await run(s)

    expect(verify).not.toHaveBeenCalled()
    expect(s.data.userId).toBe(USER)
  })
})
