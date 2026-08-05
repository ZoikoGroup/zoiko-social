import { HttpException, HttpStatus, Logger, type ArgumentsHost } from '@nestjs/common'
import { ZodError, z } from 'zod'
import { HttpExceptionFilter } from './http-exception.filter'
import { AUTH_USER_KEY } from '../../auth/guards/jwt-auth.guard'

interface Sent {
  status: number
  body: {
    success: boolean
    error: { code: string; message: string; requestId?: string; errors?: unknown }
  }
}

/**
 * Minimal stand-in for the Fastify request/reply pair the filter reaches through
 * ArgumentsHost. Returns the captured response so assertions read as the client
 * would see it.
 */
function run(
  exception: unknown,
  request: Record<string, unknown> = { id: 'req-42', method: 'GET', url: '/api/v1/thing' },
): Sent {
  const sent = {} as Sent
  const reply = {
    status(code: number) {
      sent.status = code
      return this
    },
    send(body: Sent['body']) {
      sent.body = body
    },
  }
  const host = {
    switchToHttp: () => ({
      getResponse: () => reply,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost

  new HttpExceptionFilter().catch(exception, host)
  return sent
}

describe('HttpExceptionFilter', () => {
  // The filter logs on server faults; keep the suite output clean but assertable.
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)
  })
  afterEach(() => errorSpy.mockRestore())

  describe('client errors', () => {
    it('maps a raw ZodError to 400 VALIDATION_ERROR rather than a 500', () => {
      let caught: ZodError | undefined
      try {
        z.object({ lat: z.number() }).parse({ lat: 'nope' })
      } catch (err) {
        caught = err as ZodError
      }

      const res = run(caught)

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
      expect(res.body.error.errors).toEqual([{ path: 'lat', message: 'Expected number, received string' }])
    })

    it('carries through the domain code and message from an HttpException', () => {
      const res = run(
        new HttpException({ code: 'HASHTAG_NOT_FOUND', message: 'Hashtag not found' }, HttpStatus.NOT_FOUND),
      )

      expect(res.status).toBe(HttpStatus.NOT_FOUND)
      expect(res.body.error.code).toBe('HASHTAG_NOT_FOUND')
      expect(res.body.error.message).toBe('Hashtag not found')
    })

    it('attaches no requestId to a client error, and logs nothing', () => {
      const res = run(new HttpException({ code: 'MISSING_TOKEN', message: 'nope' }, HttpStatus.UNAUTHORIZED))

      // Correlation ids exist so a tester can quote one on a server fault. A 401
      // is the API working; handing out an id there just invites noise.
      expect(res.body.error.requestId).toBeUndefined()
      expect(errorSpy).not.toHaveBeenCalled()
    })
  })

  describe('server faults', () => {
    it('returns a requestId the reporter can quote', () => {
      const res = run(new Error('Cannot read properties of undefined'))

      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body.error.code).toBe('INTERNAL_ERROR')
      expect(res.body.error.requestId).toBe('req-42')
    })

    it('never leaks the internal message to the client', () => {
      const res = run(new Error('connect ECONNREFUSED 10.0.0.5:5432'))

      expect(res.body.error.message).toBe('Internal server error')
      expect(JSON.stringify(res.body)).not.toContain('ECONNREFUSED')
    })

    it('logs the request id, method, route and caller — not just the message', () => {
      run(new Error('boom'), {
        id: 'req-7',
        method: 'POST',
        url: '/api/v1/posts',
        [AUTH_USER_KEY]: { id: 'user-123', email: 'a@b.c', role: 'member' },
      })

      const [line, stack] = errorSpy.mock.calls[0] as [string, string | undefined]
      expect(line).toContain('[req-7]')
      expect(line).toContain('POST /api/v1/posts')
      expect(line).toContain('user=user-123')
      expect(line).toContain('boom')
      expect(stack).toContain('Error: boom')
    })

    it('says "anonymous" when no guard attached a user', () => {
      run(new Error('boom'))

      expect((errorSpy.mock.calls[0] as [string])[0]).toContain('anonymous')
    })

    it('survives a thrown non-Error without a stack', () => {
      const res = run('just a string')

      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body.error.requestId).toBe('req-42')
      expect((errorSpy.mock.calls[0] as [string])[0]).toContain('just a string')
    })

    it('falls back to "unknown" when the request has no id', () => {
      const res = run(new Error('boom'), { method: 'GET', url: '/x' })

      expect(res.body.error.requestId).toBe('unknown')
    })
  })
})
