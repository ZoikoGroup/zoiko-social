import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Queue, Worker, type Job } from 'bullmq'
import type Redis from 'ioredis'
import { RedisService } from '../redis/redis.service'
import { NotificationWriterService, type NotificationJobData } from './notification-writer.service'
import { ConfigService } from '../config/config.service'
import { LOW_CHURN_WORKER_OPTS } from './worker-options'

export const NOTIFICATIONS_QUEUE = 'notifications'

/**
 * NotificationQueueService — producer + worker for notification delivery.
 *
 * Normal path:   enqueue() → BullMQ (Redis) → Worker → NotificationWriterService
 * Degraded path: no Redis → write inline (request path pays the DB cost, but
 *                nothing is lost)
 *
 * BullMQ requires a dedicated connection with maxRetriesPerRequest: null
 * because workers use blocking Redis commands.
 */
@Injectable()
export class NotificationQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationQueueService.name)
  private queue: Queue | null = null
  private worker: Worker | null = null
  private queueConnection: Redis | null = null
  private workerConnection: Redis | null = null

  constructor(
    private readonly redis: RedisService,
    private readonly writer: NotificationWriterService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    if (this.config.env.ENABLE_WORKERS === false) {
      this.logger.log('ENABLE_WORKERS=false — notification worker disabled')
      return
    }

    this.queueConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
    this.workerConnection = this.redis.createConnection({ maxRetriesPerRequest: null })

    if (!this.queueConnection || !this.workerConnection) {
      this.logger.warn('Redis unavailable — notifications will be written inline')
      return
    }

    this.queue = new Queue(NOTIFICATIONS_QUEUE, {
      connection: this.queueConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2_000 },
        removeOnComplete: { count: 1_000 },
        removeOnFail: { count: 5_000 },
      },
    })

    this.worker = new Worker(
      NOTIFICATIONS_QUEUE,
      async (job: Job) => {
        await this.writer.write(job.data as NotificationJobData)
      },
      { connection: this.workerConnection, concurrency: 10, ...LOW_CHURN_WORKER_OPTS },
    )

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Notification job ${job?.id} failed: ${err.message}`)
    })

    this.logger.log('BullMQ notifications queue + worker started')
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close()
    await this.queue?.close()
    await this.queueConnection?.quit().catch(() => this.queueConnection?.disconnect())
    await this.workerConnection?.quit().catch(() => this.workerConnection?.disconnect())
  }

  /** Fire-and-forget from the request path — never throws into the caller. */
  async enqueue(job: NotificationJobData): Promise<void> {
    try {
      if (this.queue) {
        await this.queue.add('notification.create', job)
      } else {
        await this.writer.write(job)
      }
    } catch (err) {
      this.logger.error(`Failed to enqueue notification: ${(err as Error).message}`)
      // Last-resort inline write so user-facing notifications aren't silently dropped
      try {
        await this.writer.write(job)
      } catch (writeErr) {
        this.logger.error(`Inline notification write also failed: ${(writeErr as Error).message}`)
      }
    }
  }
}
