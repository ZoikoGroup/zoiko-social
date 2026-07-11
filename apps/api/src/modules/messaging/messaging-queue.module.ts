import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import type { RedisOptions } from 'ioredis'
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
 * The connection is passed EXPLICITLY: @nestjs/bullmq has no root BullModule
 * config in this app, so registering a queue without one makes the Queue
 * default to localhost:6379 and the @Processor worker throw
 * "Worker requires a connection" at boot — which crashed every production
 * deploy on Render (Redis lives at REDIS_URL there, not localhost).
 *
 * Usage in MessagingModule:
 *   imports: [MessagingQueueModule.forRoot()]
 */

/** Parse a redis:// or rediss:// URL into ioredis options for BullMQ. */
function parseRedisUrl(redisUrl: string): RedisOptions {
  const u = new URL(redisUrl)
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    ...(u.username ? { username: decodeURIComponent(u.username) } : {}),
    ...(u.password ? { password: decodeURIComponent(u.password) } : {}),
    ...(u.protocol === 'rediss:' ? { tls: {} } : {}),
    // BullMQ requires this for blocking worker connections
    maxRetriesPerRequest: null,
  }
}

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

    const connection = parseRedisUrl(redisUrl)
    // Same worker gate the other queue services honour (feed fanout, notifications)
    const workersEnabled = process.env.ENABLE_WORKERS !== 'false'

    return {
      module: MessagingQueueModule,
      imports: [
        BullModule.registerQueue({
          name: 'messaging',
          connection,
        }),
      ],
      providers: workersEnabled ? [MessagingProcessor] : [],
      exports: [],
    }
  }
}
