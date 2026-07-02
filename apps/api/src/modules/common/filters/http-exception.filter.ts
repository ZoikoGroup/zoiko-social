import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let code = 'INTERNAL_ERROR'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      if (typeof res === 'string') {
        message = res
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>
        message = (body.message as string) || exception.message
        code = (body.code as string) || code
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack)
    }

    response.status(status).send({
      success: false,
      error: {
        code,
        message,
      },
    })
  }
}
