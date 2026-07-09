import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { MessagingProcessor } from './messaging.processor'

/**
 * MessagingQueueModule — conditionally registers BullMQ only when REDIS_URL
 * is configured and a Redis server is expected to be available.
 *
 * When Redis is unavailable (e.g. local dev without a Redis server), the
 * BullMQ queue + worker are omitted so the API doesn't crash at startup.
 * Background messaging jobs (notification dispatch, spam checks, etc.)
 * will simply be skipped until Redis is configured.
 *
 * Usage in MessagingModule:
 *   imports: [MessagingQueueModule.forRoot()]
 */
@Module({})
export class MessagingQueueModule {
  static forRoot(): DynamicModule {
    const redisUrl = process.env.REDIS_URL
    const isRedisEnabled = !!redisUrl

    if (!isRedisEnabled) {
      return {
        module: MessagingQueueModule,
        providers: [],
        exports: [],
      }
    }

    return {
      module: MessagingQueueModule,
      imports: [
        BullModule.registerQueue({
          name: 'messaging',
        }),
      ],
      providers: [MessagingProcessor],
      exports: [],
    }
  }
}
