import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

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
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack)
    }

    response.status(status).send({
      success: false,
      error: {
        code,
        message,
        ...(errors ? { errors } : {}),
      },
    })
  }
}
