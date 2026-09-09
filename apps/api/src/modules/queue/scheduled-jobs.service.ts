import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Queue, Worker } from 'bullmq'
import type Redis from 'ioredis'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { ConfigService } from '../config/config.service'
import { LOW_CHURN_WORKER_OPTS } from './worker-options'
import { ProfileService } from '../profile/profile.service'
import { NotificationQueueService } from './notification-queue.service'
import { NewsIngestService } from '../news/news-ingest.service'

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
 * Post-view cleanup (daily):
 *   Prunes post_views older than POST_VIEW_RETENTION_DAYS (default 30) so the
 *   seen-filter's table stays bounded and old posts can resurface again.
 *
 * Both jobs use separate queues and workers, each with their own Redis
 * connection to avoid blocking.
 */

export const COUNTER_RECONCILE_QUEUE = 'counter-reconcile'
export const NOTIFICATION_CLEANUP_QUEUE = 'notification-cleanup'
export const ACCOUNT_PURGE_QUEUE = 'account-purge'
export const POST_VIEW_CLEANUP_QUEUE = 'post-view-cleanup'
export const AFFINITY_DECAY_QUEUE = 'affinity-decay'
export const EVENT_REMINDER_QUEUE = 'event-reminders'
export const HEALTH_REMINDER_QUEUE = 'health-reminders'
export const NEWS_INGEST_QUEUE = 'news-ingest'

export interface HealthReminderWindow {
  from: Date
  to: Date
  lead: 'week' | 'today'
}

/**
 * The day-wide buckets the health reminder job looks in.
 *
 * Exported and pure so the boundaries can be tested directly: getting these
 * wrong means either double-notifying people or silently missing a due date,
 * and neither is visible from the outside until someone complains.
 */
export function healthReminderWindows(now = new Date()): HealthReminderWindow[] {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const day = 24 * 3_600_000
  return [
    {
      from: new Date(startOfToday.getTime() + 7 * day),
      to: new Date(startOfToday.getTime() + 8 * day),
      lead: 'week',
    },
    { from: startOfToday, to: new Date(startOfToday.getTime() + day), lead: 'today' },
  ]
}

@Injectable()
export class ScheduledJobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScheduledJobsService.name)
  private readonly queues: Map<string, Queue> = new Map()
  private readonly workers: Map<string, Worker> = new Map()

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
    private readonly profiles: ProfileService,
    private readonly notifications: NotificationQueueService,
    private readonly newsIngest: NewsIngestService,
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
    const purgeConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const postViewConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const affinityConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const eventReminderConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const healthReminderConn = this.redis.createConnection({ maxRetriesPerRequest: null })
    const newsIngestConn = this.redis.createConnection({ maxRetriesPerRequest: null })

    if (!reconcileConn || !cleanupConn || !purgeConn || !postViewConn || !affinityConn || !eventReminderConn || !healthReminderConn || !newsIngestConn) {
      this.logger.warn('Redis unavailable — scheduled jobs disabled')
      return
    }

    this.setupCounterReconciliation(reconcileConn)
    this.setupNotificationCleanup(cleanupConn)
    this.setupAccountPurge(purgeConn)
    this.setupPostViewCleanup(postViewConn)
    this.setupAffinityDecay(affinityConn)
    this.setupEventReminders(eventReminderConn)
    this.setupHealthReminders(healthReminderConn)
    this.setupNewsIngest(newsIngestConn)

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
  // ── 7. Post-view cleanup (daily) ───────────────────────────────────────

  private setupPostViewCleanup(connection: Redis): void {
    const queue = new Queue(POST_VIEW_CLEANUP_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    // Runs daily at 03:15, after notification cleanup
    queue.add(
      'post-views.cleanup',
      {},
      {
        repeat: { pattern: '15 3 * * *' },
        jobId: 'post-views-cleanup',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register post-view cleanup repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      POST_VIEW_CLEANUP_QUEUE,
      async () => {
        await this.runPostViewCleanup()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Post-view cleanup completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Post-view cleanup failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(POST_VIEW_CLEANUP_QUEUE, queue)
    this.workers.set(POST_VIEW_CLEANUP_QUEUE, worker)
  }

  /**
   * Prune post_views older than the retention period so the table stays
   * bounded and posts can legitimately reappear after the window.
   */
  private async runPostViewCleanup(): Promise<void> {
    const retentionDays = this.config.env.POST_VIEW_RETENTION_DAYS ?? 30
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

    const result = await this.prisma.postView.deleteMany({
      where: { viewedAt: { lt: cutoff } },
    })

    this.logger.log(`Post-view cleanup complete: pruned ${result.count} views older than ${cutoff.toISOString()}`)
  }

  // ── 8. Affinity decay (daily) ──────────────────────────────────────────
  // The personalization model's interests fade over time (multiplicative
  // decay), so a user who liked cats three months ago stops seeing cat posts
  // forever. Runs after the other daily jobs at 03:45.

  private setupAffinityDecay(connection: Redis): void {
    const queue = new Queue(AFFINITY_DECAY_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    queue.add(
      'affinity.decay',
      {},
      {
        repeat: { pattern: '45 3 * * *' }, // Daily at 03:45
        jobId: 'affinity-decay',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register affinity decay repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      AFFINITY_DECAY_QUEUE,
      async () => {
        await this.runAffinityDecay()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Affinity decay completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Affinity decay failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(AFFINITY_DECAY_QUEUE, queue)
    this.workers.set(AFFINITY_DECAY_QUEUE, worker)
  }

  /** Multiply every affinity score by 0.95; drop fields that round to zero. */
  private async runAffinityDecay(): Promise<void> {
    const decayed = await this.redis.affinityDecayAll(0.95, 0.1)
    this.logger.log(`Affinity decay complete: refreshed ${decayed} profile(s)`)
  }

  // ── 9. Event reminders (hourly) ────────────────────────────────────────

  /**
   * Pulls the curated news feeds.
   *
   * Every three hours: publishers in this space post a handful of times a day,
   * so anything more frequent is requests spent to find nothing, and anything
   * less makes the feed's "news" visibly stale.
   *
   * The same work is reachable as POST /news/ingest, which is what runs it
   * while Redis is unavailable — this registration simply takes over once it
   * is back, with no code change either way.
   */
  private setupNewsIngest(connection: Redis): void {
    const queue = new Queue(NEWS_INGEST_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    queue.add(
      'news.ingest',
      {},
      {
        repeat: { pattern: '25 */3 * * *' }, // Every three hours, off the hour
        jobId: 'news-ingest',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register news ingest repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      NEWS_INGEST_QUEUE,
      async () => {
        const result = await this.newsIngest.ingestAll()
        this.logger.log(`News ingest: ${result.created} new from ${result.sources} sources`)
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )
    worker.on('failed', (_job, err) => this.logger.warn(`News ingest failed: ${err.message}`))

    this.queues.set(NEWS_INGEST_QUEUE, queue)
    this.workers.set(NEWS_INGEST_QUEUE, worker)
  }

  private setupEventReminders(connection: Redis): void {
    const queue = new Queue(EVENT_REMINDER_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    queue.add(
      'event.reminders',
      {},
      {
        repeat: { pattern: '10 * * * *' }, // Hourly, ten past
        jobId: 'event-reminders',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register event reminder repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      EVENT_REMINDER_QUEUE,
      async () => {
        await this.runEventReminders()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Event reminders completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Event reminders failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(EVENT_REMINDER_QUEUE, queue)
    this.workers.set(EVENT_REMINDER_QUEUE, worker)
  }

  /**
   * Remind attendees about events starting in roughly a day.
   *
   * Runs hourly and covers the 24–25h window ahead, so each event falls into
   * exactly one run and nobody is reminded twice — no per-event bookkeeping
   * needed. An event created less than 24h before it starts gets no reminder,
   * which is correct: the RSVP itself was the reminder.
   */
  private async runEventReminders(): Promise<void> {
    const from = new Date(Date.now() + 24 * 3_600_000)
    const to = new Date(Date.now() + 25 * 3_600_000)

    const events = await this.prisma.event.findMany({
      where: { isDeleted: false, startsAt: { gte: from, lt: to } },
      select: {
        id: true,
        title: true,
        startsAt: true,
        hostId: true,
        rsvps: { where: { status: 'going' }, select: { userId: true } },
      },
    })

    let sent = 0
    for (const event of events) {
      for (const rsvp of event.rsvps) {
        // The host knows about their own event.
        if (rsvp.userId === event.hostId) continue
        await this.notifications.enqueue({
          userId: rsvp.userId,
          type: 'event_reminder',
          title: 'Event tomorrow',
          body: `${event.title} starts tomorrow`,
          data: { eventId: event.id, startsAt: event.startsAt.toISOString() },
        })
        sent += 1
      }
    }
    this.logger.log(`Event reminders complete: ${sent} reminder(s) for ${events.length} event(s)`)
  }

  // ── 10. Pet health reminders (daily) ───────────────────────────────────

  private setupHealthReminders(connection: Redis): void {
    const queue = new Queue(HEALTH_REMINDER_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    queue.add(
      'health.reminders',
      {},
      {
        repeat: { pattern: '0 8 * * *' }, // Daily at 08:00
        jobId: 'health-reminders',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register health reminder repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      HEALTH_REMINDER_QUEUE,
      async () => {
        await this.runHealthReminders()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Health reminders completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Health reminders failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(HEALTH_REMINDER_QUEUE, queue)
    this.workers.set(HEALTH_REMINDER_QUEUE, worker)
  }

  /**
   * Remind owners about vaccinations, medications and check-ups coming due.
   *
   * `PetHealthRecord.nextDue` has always been captured — the Health Passport
   * even counts overdue items — but nothing ever told the owner, so a booster
   * date could pass in silence. On a platform about animal welfare that was the
   * most useful message we weren't sending.
   *
   * Fires twice per record: a week ahead, then on the day. Each run covers a
   * single day-wide window, so a record lands in exactly one bucket per run and
   * needs no "already reminded" bookkeeping — the same trick the event reminder
   * uses. A date more than a week out is not yet actionable; one already past is
   * left alone, because a daily nag about a vaccination someone has decided to
   * skip is how people turn notifications off.
   */
  private async runHealthReminders(): Promise<void> {
    const windows = healthReminderWindows()

    let sent = 0
    for (const w of windows) {
      const records = await this.prisma.petHealthRecord.findMany({
        where: { nextDue: { gte: w.from, lt: w.to } },
        select: {
          id: true,
          ownerId: true,
          petId: true,
          type: true,
          title: true,
          nextDue: true,
          pet: { select: { name: true } },
        },
      })

      for (const r of records) {
        const petName = r.pet?.name ?? 'your pet'
        const when = w.lead === 'today' ? 'today' : 'in a week'
        await this.notifications.enqueue({
          userId: r.ownerId,
          // Distinct types so a member can mute check-up nudges without losing
          // medication reminders, once notification preferences are per-type.
          type: r.type === 'medication' ? 'medication_due' : 'health_due',
          title: w.lead === 'today' ? 'Due today' : 'Due next week',
          body: `${r.title} for ${petName} is due ${when}`,
          data: {
            petId: r.petId,
            recordId: r.id,
            recordType: r.type,
            dueDate: r.nextDue?.toISOString().slice(0, 10) ?? null,
          },
        })
        sent += 1
      }
    }

    this.logger.log(`Health reminders complete: ${sent} reminder(s) sent`)
  }

  /**
   * Permanently deletes accounts whose deletion grace period has run out.
   *
   * Note this is not the only path: an account past its deadline is also purged
   * the moment it tries to sign in (AuthService.resolveAccountStateOnLogin). That
   * matters because this job needs Redis, and data must not linger indefinitely
   * just because a queue was unavailable.
   */
  private setupAccountPurge(connection: Redis): void {
    const queue = new Queue(ACCOUNT_PURGE_QUEUE, {
      connection,
      defaultJobOptions: {
        removeOnComplete: { age: 7 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    })

    queue.add(
      'account.purge',
      {},
      {
        repeat: { pattern: '30 3 * * *' }, // Daily at 03:30, after notification cleanup
        jobId: 'account-purge',
      },
    ).catch((err) =>
      this.logger.warn(`Could not register account purge repeatable: ${(err as Error).message}`),
    )

    const worker = new Worker(
      ACCOUNT_PURGE_QUEUE,
      async () => {
        await this.runAccountPurge()
      },
      { connection, concurrency: 1, ...LOW_CHURN_WORKER_OPTS },
    )

    worker.on('completed', (job) => {
      this.logger.log(`Account purge completed (job ${job.id})`)
    })
    worker.on('failed', (job, err) => {
      this.logger.error(`Account purge failed (job ${job?.id}): ${err.message}`)
    })

    this.queues.set(ACCOUNT_PURGE_QUEUE, queue)
    this.workers.set(ACCOUNT_PURGE_QUEUE, worker)
  }

  /**
   * One member per iteration with its own try/catch: a single failure (a Supabase
   * hiccup on one account) must not abandon the rest of the batch.
   */
  private async runAccountPurge(): Promise<void> {
    const graceDays = this.config.env.ACCOUNT_DELETION_GRACE_DAYS ?? 30
    const cutoff = new Date(Date.now() - graceDays * 24 * 60 * 60 * 1000)

    const due = await this.prisma.profile.findMany({
      where: { state: 'pending_deletion', deletionRequestedAt: { lt: cutoff } },
      select: { id: true, username: true },
      take: 200,
    })

    if (due.length === 0) {
      this.logger.log('Account purge: nothing past its grace period')
      return
    }

    this.logger.log(`Account purge: ${due.length} account(s) requested deletion before ${cutoff.toISOString()}`)

    let purged = 0
    for (const profile of due) {
      try {
        await this.profiles.purgeAccount(profile.id, 'grace_period_expired')
        purged++
      } catch (err) {
        this.logger.error(`Could not purge ${profile.username} (${profile.id}): ${(err as Error).message}`)
      }
    }

    this.logger.log(`Account purge complete: ${purged}/${due.length} deleted`)
  }
}
