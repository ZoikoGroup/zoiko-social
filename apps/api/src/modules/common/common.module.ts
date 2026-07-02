import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor'
import { ZodValidationPipe } from './pipes/zod-validation.pipe'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    ZodValidationPipe,
  ],
  exports: [ZodValidationPipe],
})
export class CommonModule {}
