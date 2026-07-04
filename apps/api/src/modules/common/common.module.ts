import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor'
import { RateLimiterGuard } from './guards/rate-limiter.guard'

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
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class CommonModule {}
