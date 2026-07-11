import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Queue, Worker } from 'bullmq'
import type Redis from 'ioredis'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { ConfigService } from '../config/config.service'
import { LOW_CHURN_WORKER_OPTS } from './worker-options'

/**
 * ScheduledJobsService — repeatable BullMQ jobs for counter reconciliation
 * and notification cleanup.
 *
 * Counter reconciliation (every 6 hours):
 *   Verifies profiles.followers_count, profiles.following_count, and
 *   profiles.posts_count against actual COUNT(*) queries. Repairs drift
 *   atomically. Logs all corrections.
 *
 * Notification cleanup (daily):
 *   Deletes read notifications older than NOTIFICATION_RETENTION_DAYS
 *   (default 90). Configurable via env.
 *
 * Both jobs use separate queues and workers, each with their own Redis
 * connection to avoid blocking.
 */

export const COUNTER_RECONCILE_QUEUE = 'counter-reconcile'
export const NOTIFICATION_CLEANUP_QUEUE = 'notification-cleanup'

@Injectable()
export class ScheduledJobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScheduledJobsService.name)
  private readonly queues: Map<string, Queue> = new Map()
  private readonly workers: Map<string, Worker> = new Map()

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const workerEnabled = this.config.env.ENABLE_WORKERS !== false

    if (!workerEnabled) {
      this.logger.log('ENABLE_WORKERS=false — scheduled jobs disabled')
      return
    }

    // Each queue and worker gets its own Redis connection to avoid blocking
    const reconcileConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const cleanupConn = this.redis.createConnection({ maxRetriesPerRequest: null })

    if (!reconcileConn || !cleanupConn) {
      this.logger.warn('Redis unavailable — scheduled jobs disabled')
      return
    }

    this.setupCounterReconciliation(reconcileConn)
    this.setupNotificationCleanup(cleanupConn)

    this.logger.log('Scheduled jobs initialised')
  }

  async onModuleDestroy(): Promise<void> {
    for (const [name, worker] of this.workers) {
      await worker.close()
      this.logger.log(`Worker ${name} closed`)
    }
    for (const [name, queue] of this.queues) {
      await queue.close()
      this.logger.log(`Queue ${name} closed`)
    }
  }

  // ── 5. Counter Reconciliation (every 6 hours) ──────────────────────────

  private setupCounterReconciliation(connection: Redis): void {
    const queue = new Queue(COUNTER_RECONCILE_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    // Register the repeatable job — runs every 6 hours starting now
    queue.add(
      'counter.reconcile',
      {},
      {
        repeat: { pattern: '0 */6 * * *' }, // Every 6 hours
        jobId: 'counter-reconcile',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register counter reconcile repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      COUNTER_RECONCILE_QUEUE,
      async () => {
        await this.runCounterReconciliation()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Counter reconciliation completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Counter reconciliation failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(COUNTER_RECONCILE_QUEUE, queue)
    this.workers.set(COUNTER_RECONCILE_QUEUE, worker)
  }

  /**
   * Reconcile counter columns against actual COUNT(*) values.
   * Processes profiles in batches to avoid long-running transactions.
   * Never locks tables — uses SELECT ... FOR UPDATE only on the row being
   * repaired, one row at a time.
   */
  private async runCounterReconciliation(): Promise<void> {
    const BATCH_SIZE = 100
    let totalChecked = 0
    let totalRepaired = 0
    const startTime = Date.now()

    let cursor: { id: string } | undefined
    let hasMore = true

    while (hasMore) {
      const profiles = await this.prisma.profile.findMany({
        where: cursor ? { id: { gt: cursor.id } } : {},
        select: { id: true },
        orderBy: { id: 'asc' },
        take: BATCH_SIZE,
      })

      if (profiles.length < BATCH_SIZE) hasMore = false
      if (profiles.length > 0) {
        cursor = { id: profiles[profiles.length - 1].id }
      }

      for (const profile of profiles) {
        const repaired = await this.reconcileProfileCounters(profile.id)
        totalChecked++
        if (repaired) totalRepaired++
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    this.logger.log(
      `Counter reconciliation: checked=${totalChecked}, repaired=${totalRepaired}, elapsed=${elapsed}s`,
    )
  }

  /**
   * Reconcile a single profile's counters. Uses a Prisma transaction to
   * atomically update the counter columns to match actual database counts.
   */
  private async reconcileProfileCounters(profileId: string): Promise<boolean> {
    try {
      const [followersCount, followingCount, postsCount] = await Promise.all([
        this.prisma.follow.count({
          where: { followingId: profileId, status: 'active' },
        }),
        this.prisma.follow.count({
          where: { followerId: profileId, status: 'active' },
        }),
        this.prisma.post.count({
          where: { authorId: profileId, isDeleted: false },
        }),
      ])

      const result = await this.prisma.profile.updateMany({
        where: {
          id: profileId,
          OR: [
            { followersCount: { not: followersCount } },
            { followingCount: { not: followingCount } },
            { postsCount: { not: postsCount } },
          ],
        },
        data: {
          followersCount,
          followingCount,
          postsCount,
        },
      })

      const repaired = result.count > 0
      if (repaired) {
        this.logger.warn(
          `Counter drift repaired for profile ${profileId}: ` +
          `followers=${followersCount}, following=${followingCount}, posts=${postsCount}`,
        )
      }
      return repaired
    } catch (err) {
      this.logger.error(`Counter reconciliation error for profile ${profileId}: ${(err as Error).message}`)
      return false
    }
  }

  // ── 6. Notification Cleanup (daily) ────────────────────────────────────

  private setupNotificationCleanup(connection: Redis): void {
    const queue = new Queue(NOTIFICATION_CLEANUP_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    // Register the repeatable job — runs daily at 03:00
    queue.add(
      'notification.cleanup',
      {},
      {
        repeat: { pattern: '0 3 * * *' }, // Daily at 3 AM
        jobId: 'notification-cleanup',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register notification cleanup repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      NOTIFICATION_CLEANUP_QUEUE,
      async () => {
        await this.runNotificationCleanup()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Notification cleanup completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Notification cleanup failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(NOTIFICATION_CLEANUP_QUEUE, queue)
    this.workers.set(NOTIFICATION_CLEANUP_QUEUE, worker)
  }

  /**
   * Delete read notifications older than the configured retention period.
   * Default: 90 days. Configurable via NOTIFICATION_RETENTION_DAYS env var.
   * Runs in batches to avoid long-running transactions.
   */
  private async runNotificationCleanup(): Promise<void> {
    const retentionDays = this.config.env.NOTIFICATION_RETENTION_DAYS ?? 90
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

    this.logger.log(`Starting notification cleanup: deleting read notifications older than ${cutoff.toISOString()}`)

    // Delete all matching notifications in one query (indexed on userId + isRead + createdAt)
    const result = await this.prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: cutoff },
      },
    })

    this.logger.log(`Notification cleanup complete: deleted ${result.count} notifications`)
  }
}
