import {
  PipeTransform,
  BadRequestException,
} from '@nestjs/common'
import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'

// ⚠️ NOT a NestJS provider — always instantiated manually in controllers (new ZodValidationPipe(schema))
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

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
