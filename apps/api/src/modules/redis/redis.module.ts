import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { RateLimiterService } from './rate-limiter.service'
import { ConfigModule } from '../config/config.module'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, RateLimiterService],
  exports: [RedisService, RateLimiterService],
})
export class RedisModule {}
