import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AUTH_USER_KEY, type AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'

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

    if (exception instanceof ZodError) {
      // Raw schema.parse() failures surface here — treat as a client validation error, not a 500.
      status = HttpStatus.BAD_REQUEST
      code = 'VALIDATION_ERROR'
      message = 'Validation failed'
      errors = exception.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
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
    }

    response.status(status).send({
      success: false,
      error: {
        code,
        message,
        ...(errors ? { errors } : {}),
        // Returned on server faults only, so a tester can quote it and we can
        // find the exact log line. Client errors need no correlation id.
        ...(status >= HttpStatus.INTERNAL_SERVER_ERROR ? { requestId } : {}),
      },
    })
  }
}
