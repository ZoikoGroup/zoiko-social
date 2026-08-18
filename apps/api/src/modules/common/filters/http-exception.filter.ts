import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { AUTH_USER_KEY, type AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { captureServerError } from '../../../observability/sentry'

/**
 * Prisma errors that are the caller's fault, not ours.
 *
 * Without this they all fell through to 500 INTERNAL_ERROR. The common one is
 * P2023: any `:id` route given a non-UUID — `GET /posts/not-a-uuid` — answered
 * 500 and wrote a stack trace, on four of five endpoints checked. That is the
 * wrong status for bad input, and it let anyone fill the error log with a curl
 * loop, burying real faults. Mapping them to 4xx also stops the logging, since
 * only 5xx is logged.
 */
const PRISMA_CLIENT_ERRORS: Record<string, { status: HttpStatus; code: string; message: string }> = {
  // "Inconsistent column data" — in practice a malformed UUID in a filter.
  P2023: { status: HttpStatus.BAD_REQUEST, code: 'INVALID_ID', message: 'Malformed identifier' },
  // Unique constraint — the caller is recreating something that exists.
  P2002: { status: HttpStatus.CONFLICT, code: 'ALREADY_EXISTS', message: 'Resource already exists' },
  // Foreign key constraint — the caller referenced something that does not exist.
  P2003: { status: HttpStatus.BAD_REQUEST, code: 'INVALID_REFERENCE', message: 'Referenced resource does not exist' },
  // update/delete matched no row.
  P2025: { status: HttpStatus.NOT_FOUND, code: 'NOT_FOUND', message: 'Resource not found' },
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let code = 'INTERNAL_ERROR'
    let errors: Array<{ path: string; message: string }> | undefined
    // Extra fields a thrower may attach, forwarded by name rather than by
    // spreading the payload — spreading would leak whatever an exception happens
    // to carry. `since` is the date an account was deactivated or scheduled for
    // deletion, which the sign-in screen needs to say "you deactivated this
    // 3 days ago" instead of just refusing.
    let since: string | undefined

    if (exception instanceof ZodError) {
      // Raw schema.parse() failures surface here — treat as a client validation error, not a 500.
      status = HttpStatus.BAD_REQUEST
      code = 'VALIDATION_ERROR'
      message = 'Validation failed'
      errors = exception.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      PRISMA_CLIENT_ERRORS[exception.code]
    ) {
      // A caller-caused database error. Deliberately does not echo Prisma's
      // message, which names tables, columns and source files.
      const mapped = PRISMA_CLIENT_ERRORS[exception.code]!
      status = mapped.status
      code = mapped.code
      message = mapped.message
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      if (typeof res === 'string') {
        message = res
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>
        message = (body.message as string) || exception.message
        code = (body.code as string) || code
        if (Array.isArray(body.errors)) errors = body.errors as Array<{ path: string; message: string }>
        if (typeof body.since === 'string') since = body.since
      }
    }

    // Fastify gives every request an id, and it is already on each access-log
    // line, so it is the one value that ties a bug report back to a stack trace.
    const requestId = String(request?.id ?? 'unknown')

    // Only unexpected failures are logged. A 404 or a validation error is the API
    // working as designed, and logging those buries the ones that matter.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const user = (request as unknown as Record<string, unknown> | undefined)?.[
        AUTH_USER_KEY
      ] as AuthenticatedUser | undefined

      // Context, not just the message. "Cannot read properties of undefined" plus
      // a stack cannot be triaged from a bug report; with the method, route and
      // caller it usually can.
      const where = `${request?.method ?? '?'} ${request?.url ?? '?'}`
      const who = user ? `user=${user.id}` : 'anonymous'
      const detail = exception instanceof Error ? exception.message : String(exception)

      this.logger.error(
        `[${requestId}] ${where} — ${who} — ${detail}`,
        exception instanceof Error ? exception.stack : undefined,
      )

      // Same context, forwarded to error reporting. No-op unless SENTRY_DSN is
      // set, so this is free when it is not configured. Only 5xx: a 404 or a
      // validation error is the API working, and paging on those trains people
      // to ignore the alerts.
      captureServerError(exception, {
        requestId,
        method: request?.method ?? '-',
        url: request?.url ?? '-',
        userId: user?.id,
      })
    }

    response.status(status).send({
      success: false,
      error: {
        code,
        message,
        ...(errors ? { errors } : {}),
        ...(since ? { since } : {}),
        // Returned on server faults only, so a tester can quote it and we can
        // find the exact log line. Client errors need no correlation id.
        ...(status >= HttpStatus.INTERNAL_SERVER_ERROR ? { requestId } : {}),
      },
    })
  }
}
