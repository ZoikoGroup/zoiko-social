import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import type { RedisOptions } from 'ioredis'
import { Logger } from '@nestjs/common'
import { ThrottledErrorLog, isFatalRedisError } from '../redis/redis-failure'
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

/**
 * Parse a redis:// or rediss:// URL into ioredis options for BullMQ.
 *
 * The retry policy is the important part. This connection had none, so when the
 * Redis provider started refusing every command — an exhausted request quota,
 * which no amount of asking again will fix — BullMQ's queue and worker retried
 * without limit. That wrote 65,000 lines of the same error and eventually took
 * the API down with it, which is an outage caused by the retrying rather than by
 * Redis being unavailable.
 *
 * RedisService learned this already; the predicate and the throttled log are
 * shared with it rather than reimplemented.
 */
function parseRedisUrl(redisUrl: string): RedisOptions {
  const u = new URL(redisUrl)
  const logger = new Logger('MessagingQueue')
  const errorLog = new ThrottledErrorLog()
  let fatal = false

  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    ...(u.username ? { username: decodeURIComponent(u.username) } : {}),
    ...(u.password ? { password: decodeURIComponent(u.password) } : {}),
    ...(u.protocol === 'rediss:' ? { tls: {} } : {}),
    // BullMQ requires this for blocking worker connections
    maxRetriesPerRequest: null,

    // Commands fail fast instead of queueing up while disconnected. A buffer of
    // messaging jobs that will never be sent is worse than an immediate refusal
    // the caller can fall back from.
    enableOfflineQueue: false,

    /**
     * Give up entirely once the failure is one that cannot recover, and bound the
     * attempts even when it might. Returning null stops ioredis reconnecting.
     */
    retryStrategy: (times) => {
      if (fatal) return null
      if (times > 10) {
        logger.warn('Giving up on Redis after 10 attempts — messaging jobs will run inline')
        return null
      }
      return Math.min(times * 500, 5_000)
    },

    reconnectOnError: (err) => {
      if (isFatalRedisError(err)) {
        if (!fatal) {
          fatal = true
          logger.error(`Redis is refusing commands and will not be retried: ${err.message}`)
        }
        return false
      }
      const line = errorLog.next(`Messaging queue Redis error: ${err.message}`)
      if (line) logger.warn(line)
      return true
    },
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
