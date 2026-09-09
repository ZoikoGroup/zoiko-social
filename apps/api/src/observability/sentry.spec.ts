import * as Sentry from '@sentry/node'
import { initSentry, isSentryEnabled, captureServerError, closeSentry } from './sentry'

jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  close: jest.fn().mockResolvedValue(true),
  captureException: jest.fn(),
  withScope: jest.fn((cb: (scope: unknown) => void) =>
    cb({
      setTag: jest.fn(),
      setUser: jest.fn(),
      setContext: jest.fn(),
      setTransactionName: jest.fn(),
    }),
  ),
}))

/**
 * The behaviour that has to hold on this deployment is the *disabled* one: there
 * is no DSN, so nothing may initialise and no call may throw. The enabled path
 * is verified for wiring only — whether events actually reach Sentry cannot be
 * tested without a real project.
 */
describe('error reporting', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('with no DSN — the current deployment', () => {
    it('does not initialise', () => {
      initSentry({ dsn: undefined, environment: 'test' })

      expect(Sentry.init).not.toHaveBeenCalled()
      expect(isSentryEnabled()).toBe(false)
    })

    it('treats an empty DSN as absent', () => {
      initSentry({ dsn: '', environment: 'test' })

      expect(Sentry.init).not.toHaveBeenCalled()
      expect(isSentryEnabled()).toBe(false)
    })

    it('captures nothing, and does not throw', () => {
      initSentry({ dsn: undefined, environment: 'test' })

      expect(() =>
        captureServerError(new Error('boom'), { requestId: 'req-1', method: 'GET', url: '/x' }),
      ).not.toThrow()
      expect(Sentry.captureException).not.toHaveBeenCalled()
      expect(Sentry.withScope).not.toHaveBeenCalled()
    })

    it('closes cleanly without a client', async () => {
      initSentry({ dsn: undefined, environment: 'test' })

      await expect(closeSentry()).resolves.toBeUndefined()
      expect(Sentry.close).not.toHaveBeenCalled()
    })
  })

  describe('with a DSN', () => {
    const DSN = 'https://abc@o1.ingest.sentry.io/1'

    it('initialises with tracing off and PII off', () => {
      initSentry({ dsn: DSN, environment: 'production', release: 'abc123' })

      expect(isSentryEnabled()).toBe(true)
      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: DSN,
          environment: 'production',
          release: 'abc123',
          // Tracing samples every request; it is the usual way a quota vanishes.
          tracesSampleRate: 0,
          // Bodies and headers carry tokens, DMs and health records.
          sendDefaultPii: false,
        }),
      )
    })

    it('reports the error with the request id, and only the user id', () => {
      initSentry({ dsn: DSN, environment: 'production' })
      const scope = {
        setTag: jest.fn(),
        setUser: jest.fn(),
        setContext: jest.fn(),
        setTransactionName: jest.fn(),
      }
      ;(Sentry.withScope as jest.Mock).mockImplementation((cb: (s: unknown) => void) => cb(scope))

      const err = new Error('kaboom')
      captureServerError(err, {
        requestId: 'req-42',
        method: 'POST',
        url: '/api/v1/posts',
        userId: 'user-7',
      })

      expect(scope.setTag).toHaveBeenCalledWith('request_id', 'req-42')
      expect(scope.setTransactionName).toHaveBeenCalledWith('POST /api/v1/posts')
      // Id only: no email, no display name.
      expect(scope.setUser).toHaveBeenCalledWith({ id: 'user-7' })
      expect(Sentry.captureException).toHaveBeenCalledWith(err)
    })

    it('omits the user entirely for an anonymous request', () => {
      initSentry({ dsn: DSN, environment: 'production' })
      const scope = {
        setTag: jest.fn(),
        setUser: jest.fn(),
        setContext: jest.fn(),
        setTransactionName: jest.fn(),
      }
      ;(Sentry.withScope as jest.Mock).mockImplementation((cb: (s: unknown) => void) => cb(scope))

      captureServerError(new Error('x'), { requestId: 'req-2', method: 'GET', url: '/health' })

      expect(scope.setUser).not.toHaveBeenCalled()
    })

    it('flushes on shutdown so the last event is not lost', async () => {
      initSentry({ dsn: DSN, environment: 'production' })

      await closeSentry(1500)

      expect(Sentry.close).toHaveBeenCalledWith(1500)
    })
  })
})
