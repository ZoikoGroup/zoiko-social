import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Queue, Worker, type Job } from 'bullmq'
import type Redis from 'ioredis'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'
import { PrismaService } from '../prisma/prisma.service'
import { ConfigService } from '../config/config.service'
import { LOW_CHURN_WORKER_OPTS } from './worker-options'

export const FEED_QUEUE = 'feed'

interface FanoutJob {
  postId: string
  authorId: string
}

/**
 * FeedFanoutService — on new post:
 *   1. bust every follower's cached feed first-page (they see the post next load)
 *   2. emit `post:new` to each follower's feed room (the "New posts ↑" pill)
 *
 * Phase 2 (timeline push model) plugs into the same worker — see
 * docs/feed-posts-architecture.md §4.1.
 *
 * Degraded mode (no Redis): runs inline so nothing is lost.
 */
@Injectable()
export class FeedFanoutService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FeedFanoutService.name)
  private queue: Queue | null = null
  private worker: Worker | null = null
  private queueConnection: Redis | null = null
  private workerConnection: Redis | null = null

  constructor(
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    this.queueConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
    if (!this.queueConnection) {
      this.logger.warn('Redis unavailable — feed fanout runs inline')
      return
    }

    this.queue = new Queue(FEED_QUEUE, {
      connection: this.queueConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2_000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 1_000 },
      },
    })

    if (this.config.env.ENABLE_WORKERS !== false) {
      this.workerConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
      if (this.workerConnection) {
        this.worker = new Worker(
          FEED_QUEUE,
          async (job: Job) => this.process(job.data as FanoutJob),
          { connection: this.workerConnection, concurrency: 5, ...LOW_CHURN_WORKER_OPTS },
        )
        this.worker.on('failed', (job, err) => {
          this.logger.error(`Feed fanout job ${job?.id} failed: ${err.message}`)
        })
        this.logger.log('Feed fanout worker started')
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close()
    await this.queue?.close()
    await this.queueConnection?.quit().catch(() => this.queueConnection?.disconnect())
    await this.workerConnection?.quit().catch(() => this.workerConnection?.disconnect())
  }

  async enqueue(postId: string, authorId: string): Promise<void> {
    try {
      if (this.queue) {
        await this.queue.add('feed.fanout', { postId, authorId } satisfies FanoutJob)
      } else {
        await this.process({ postId, authorId })
      }
    } catch (err) {
      this.logger.error(`Feed fanout enqueue failed: ${(err as Error).message}`)
    }
  }

  private async process(job: FanoutJob): Promise<void> {
    const author = await this.prisma.profile.findUnique({
      where: { id: job.authorId },
      select: { id: true, username: true, displayName: true, avatarUrl: true },
    })

    // Chunked follower scan — bounded memory even for large accounts
    const CHUNK = 1_000
    let cursor: { followerId: string; followingId: string } | undefined

    for (;;) {
      const follows = await this.prisma.follow.findMany({
        where: { followingId: job.authorId, status: 'active' },
        select: { followerId: true, followingId: true },
        take: CHUNK,
        ...(cursor ? { skip: 1, cursor: { followerId_followingId: cursor } } : {}),
        orderBy: { followerId: 'asc' },
      })
      if (follows.length === 0) break

      const followerIds = follows.map((f) => f.followerId)
      await this.redis.delFeedFirst(followerIds)

      // Realtime pill — cheap emits through the existing pub/sub relay
      for (const followerId of followerIds) {
        await this.realtime.publish(`feed:${followerId}`, 'post:new', {
          postId: job.postId,
          author,
        })
      }

      if (follows.length < CHUNK) break
      const last = follows[follows.length - 1]!
      cursor = { followerId: last.followerId, followingId: last.followingId }
    }

    // The author's own feed shows the post immediately too
    await this.redis.delFeedFirst([job.authorId])
  }
}
