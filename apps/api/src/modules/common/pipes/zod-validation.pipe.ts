import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors,
      })
    }

    return result.data
  }
}
