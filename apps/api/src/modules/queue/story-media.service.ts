import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Queue, Worker, type Job } from 'bullmq'
import * as path from 'path'
import type Redis from 'ioredis'
import { RedisService } from '../redis/redis.service'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'
import { ConfigService } from '../config/config.service'
import { TranscodeService, type TranscodeResult } from '../stories/media/transcode.service'
import { MEDIA_STORAGE, type MediaStorage } from '../stories/media/media-storage.interface'
import { LOW_CHURN_WORKER_OPTS } from './worker-options'

/** URLs of an uploaded transcode tree, or null when running degraded (no ffmpeg). */
type RenditionUrls = {
  hlsUrl: string | null
  mp4FallbackUrl: string | null
  thumbnailUrl: string | null
  previewUrl: string | null
  renditions: Record<string, string>
} | null

export const STORY_MEDIA_QUEUE = 'story-media'
export const STORY_LIFECYCLE_QUEUE = 'story-lifecycle'

export interface ImageOptimizationJob {
  kind: 'image'
  storyId: string
  mediaId: string
  authorId: string
}

export interface VideoTranscodeJob {
  kind: 'video'
  storyId: string
  mediaId: string
  authorId: string
}

export interface StoryExpireJob {
  kind: 'expire'
  storyId: string
  authorId: string
}

export interface StoryCleanupJob {
  kind: 'cleanup'
  before: string // ISO date — purge archives whose purgeAfter is before this
}

type StoryMediaJob = ImageOptimizationJob | VideoTranscodeJob
type StoryLifecycleJob = StoryExpireJob | StoryCleanupJob

/**
 * StoryMediaService — BullMQ queue + worker for story media processing.
 *
 * Image path:   compress → WebP renditions + thumbnail + blurhash verify
 * Video path:   (future) probe → segment >15s → HLS + mp4 fallback
 *
 * On completion: marks story.status = 'ready' and emits `story:new` via
 * Socket.IO to the author's followers' tray rooms.
 *
 * Degraded mode (no Redis): runs inline so stories are never stuck processing.
 */
@Injectable()
export class StoryMediaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StoryMediaService.name)
  private queue: Queue | null = null
  private worker: Worker | null = null
  private lifecycleQueue: Queue | null = null
  private lifecycleWorker: Worker | null = null
  private queueConnection: Redis | null = null
  private workerConnection: Redis | null = null
  private lifecycleConnection: Redis | null = null

  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
    private readonly config: ConfigService,
    private readonly transcode: TranscodeService,
    @Inject(MEDIA_STORAGE) private readonly storage: MediaStorage,
  ) {
    this.logger.log('StoryMediaService initialized')
  }

  onModuleInit(): void {
    this.queueConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
    if (!this.queueConnection) {
      this.logger.warn('Redis unavailable — story media processing runs inline')
      return
    }

    this.queue = new Queue(STORY_MEDIA_QUEUE, {
      connection: this.queueConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2_000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 1_000 },
      },
    })

    // Story lifecycle queue (expire + cleanup)
    this.lifecycleConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
    if (this.lifecycleConnection) {
      this.lifecycleQueue = new Queue(STORY_LIFECYCLE_QUEUE, {
        connection: this.lifecycleConnection,
        defaultJobOptions: {
          attempts: 2,
          backoff: { type: 'fixed', delay: 10_000 },
          removeOnComplete: { count: 1_000 },
          removeOnFail: { count: 500 },
        },
      })
    }

    if (this.config.env.ENABLE_WORKERS !== false) {
      this.workerConnection = this.redis.createConnection({ maxRetriesPerRequest: null })
      if (this.workerConnection) {
        this.worker = new Worker(
          STORY_MEDIA_QUEUE,
          async (job: Job) => this.process(job.data as StoryMediaJob),
          { connection: this.workerConnection, concurrency: 4, ...LOW_CHURN_WORKER_OPTS },
        )
        this.worker.on('failed', (job, err) => {
          this.logger.error(`Story media job ${job?.id} failed: ${err.message}`)
        })
        this.logger.log('Story media processing worker started')
      }

      // Lifecycle worker
      if (this.lifecycleConnection) {
        this.lifecycleWorker = new Worker(
          STORY_LIFECYCLE_QUEUE,
          async (job: Job) => this.processLifecycle(job.data as StoryLifecycleJob),
          { connection: this.lifecycleConnection, concurrency: 2, ...LOW_CHURN_WORKER_OPTS },
        )
        this.lifecycleWorker.on('failed', (job, err) => {
          this.logger.error(`Story lifecycle job ${job?.id} failed: ${err.message}`)
        })
        this.logger.log('Story lifecycle worker started')
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close()
    await this.lifecycleWorker?.close()
    await this.queue?.close()
    await this.lifecycleQueue?.close()
    await this.queueConnection?.quit().catch(() => this.queueConnection?.disconnect())
    await this.workerConnection?.quit().catch(() => this.workerConnection?.disconnect())
    await this.lifecycleConnection?.quit().catch(() => this.lifecycleConnection?.disconnect())
  }

  async enqueueImageOptimization(storyId: string, mediaId: string, authorId: string): Promise<void> {
    try {
      if (this.queue) {
        await this.queue.add('story.image-optimize', { kind: 'image', storyId, mediaId, authorId } satisfies ImageOptimizationJob)
      } else {
        await this.process({ kind: 'image', storyId, mediaId, authorId })
      }
    } catch (err) {
      this.logger.error(`Failed to enqueue image optimization: ${(err as Error).message}`)
    }
  }

  async enqueueVideoTranscode(storyId: string, mediaId: string, authorId: string): Promise<void> {
    try {
      if (this.queue) {
        await this.queue.add('story.video-transcode', { kind: 'video', storyId, mediaId, authorId } satisfies VideoTranscodeJob)
      } else {
        await this.process({ kind: 'video', storyId, mediaId, authorId })
      }
    } catch (err) {
      this.logger.error(`Failed to enqueue video transcode: ${(err as Error).message}`)
    }
  }

  // ── PROCESSOR ────────────────────────────────────────────────────────────

  private async process(job: StoryMediaJob): Promise<void> {
    const { storyId, mediaId, authorId } = job

    try {
      // Route by kind discriminator — added to both job interfaces
      if (job.kind === 'video') {
        await this.processVideo(storyId, mediaId, authorId)
      } else {
        await this.processImage(storyId)
      }
    } catch (err) {
      this.logger.error(`Media processing failed for story ${storyId}: ${(err as Error).message}`)
      await this.markFailed(storyId).catch((e) =>
        this.logger.error(`Failed to mark story ${storyId} as failed: ${(e as Error).message}`),
      )
    }
  }



  /**
   * Process image stories: mark ready directly.
   * The client already sends a processed image, so the story is viewable immediately.
   */
  private async processImage(storyId: string): Promise<void> {
    await this.markReady(storyId)
  }

  /**
   * Process a video story: probe → segment (if >15s) → transcode to HLS →
   * upload renditions → mark ready.
   *
   * When ffmpeg is unavailable on this pod, degrades gracefully by marking
   * the story ready with the raw uploaded file.
   */
  private async processVideo(storyId: string, _mediaId: string, authorId: string): Promise<void> {
    // Load the story + media to get the upload path
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: { media: true, music: { include: { track: true } } },
    })
    if (!story) {
      await this.markFailed(storyId)
      return
    }

    const media = story.media?.[0]
    if (!media?.imageUrl) {
      // No media to transcode — just mark ready
      await this.markReady(storyId)
      return
    }

    // 1. Probe the uploaded video
    const probe = await this.transcode.probeMedia(media.imageUrl)

    // 2. Segment if >15s (creates additional story rows sharing segment_group_id)
    const storyIds = await this.transcode.segmentVideo(storyId, authorId, probe)

    // 3. Transcode to HLS renditions + generate poster + preview
    const audioTrackPath = story.music?.track?.audioUrl
    const audioOptions = story.music
      ? { volume: story.music.volume, fadeIn: story.music.fadeIn, fadeOut: story.music.fadeOut }
      : undefined

    const result = await this.transcode.transcodeToHLS(
      media.imageUrl,
      `story-${storyId}`,
      audioTrackPath,
      audioOptions,
    )

    // 4. Upload the transcode output tree to storage ONCE, then point every
    //    segment's media row at the resulting URLs. (Degraded/no-ffmpeg path
    //    returns null and leaves the raw uploaded file as the playable source.)
    const basePath = `${authorId}/stories/renditions/${storyId}/`
    const urls = await this.uploadTranscodeTree(result, basePath)
    const durationMs = result.durationMs || probe.durationMs

    for (const storySegmentId of storyIds) {
      await this.applyRenditions(storySegmentId, urls, durationMs)
    }

    // 5. Mark all segments as ready
    for (const storySegmentId of storyIds) {
      await this.markReady(storySegmentId)
    }

    // 6. Clean up local transcode files
    if (result.localDir) this.transcode.cleanupDir(result.localDir)
  }

  /**
   * Upload the full transcode output tree (master.m3u8, per-rendition
   * playlists + .ts segments, mp4 fallback, poster, preview) to storage under
   * `basePath`, preserving directory structure so the relative HLS references
   * resolve. Returns the public URLs, or null in the degraded (no-ffmpeg)
   * path where the raw upload remains the playable source.
   */
  private async uploadTranscodeTree(
    result: TranscodeResult,
    basePath: string,
  ): Promise<RenditionUrls> {
    if (!this.transcode.ffmpegAvailable || !result.localDir) return null

    const localDir = result.localDir
    const files = this.transcode.listOutputFiles(localDir)
    const publicByRel = new Map<string, string>()

    for (const rel of files) {
      const localPath = path.join(localDir, rel)
      const destPath = `${basePath}${rel}`
      const { publicUrl } = await this.storage.uploadFile(
        localPath,
        destPath,
        TranscodeService.contentTypeFor(rel),
      )
      publicByRel.set(rel, publicUrl)
    }

    const renditions: Record<string, string> = {}
    for (const label of Object.keys(result.renditions)) {
      const url = publicByRel.get(`${label}/index.m3u8`)
      if (url) renditions[label] = url
    }

    return {
      hlsUrl: publicByRel.get('master.m3u8') ?? null,
      mp4FallbackUrl: publicByRel.get('fallback.mp4') ?? null,
      thumbnailUrl: publicByRel.get('poster.jpg') ?? null,
      previewUrl: publicByRel.get('preview.webp') ?? null,
      renditions,
    }
  }

  /**
   * Point a story's media row at the uploaded rendition URLs. No-op in the
   * degraded path (urls === null) where the raw upload is already playable.
   */
  private async applyRenditions(
    storyId: string,
    urls: RenditionUrls,
    durationMs: number,
  ): Promise<void> {
    if (!urls) return

    const media = await this.prisma.storyMedia.findFirst({
      where: { storyId },
      select: { id: true },
    })
    if (!media) return

    await this.prisma.storyMedia.update({
      where: { id: media.id },
      data: {
        renditions: urls.renditions,
        ...(urls.hlsUrl ? { hlsUrl: urls.hlsUrl } : {}),
        ...(urls.mp4FallbackUrl ? { mp4FallbackUrl: urls.mp4FallbackUrl } : {}),
        ...(urls.thumbnailUrl ? { thumbnailUrl: urls.thumbnailUrl } : {}),
        ...(urls.previewUrl ? { previewUrl: urls.previewUrl } : {}),
        ...(durationMs ? { durationMs } : {}),
      },
    })

    this.logger.log(`Applied renditions for story ${storyId}`)
  }

  private async markReady(storyId: string): Promise<void> {
    const story = await this.prisma.story.update({
      where: { id: storyId },
      data: {
        status: 'ready',
        publishedAt: new Date(),
      },
      select: { id: true, authorId: true, expiresAt: true },
    })

    // Invalidate cache so the tray picks it up
    await this.redis.invalidateStory(story.id)

    // Cache the story tray for the author
    await this.redis.invalidateStoryTray(story.authorId)

    // Emit realtime event to followers' tray rooms
    await this.realtime.publish(`tray:${story.authorId}`, 'story:new', {
      authorId: story.authorId,
      storyId: story.id,
    })

    // Enqueue the expire job — fires at expiresAt (usually 24h from publish)
    if (story.expiresAt) {
      void this.enqueueExpire(story.id, story.authorId, story.expiresAt)
    }

    this.logger.log(`Story ${storyId} is now ready`)
  }

  private async markFailed(storyId: string): Promise<void> {
    await this.prisma.story.update({
      where: { id: storyId },
      data: { status: 'failed' },
    })
    // No realtime emit — failed stories never enter the tray
  }

  // ── LIFECYCLE: EXPIRE ────────────────────────────────────────────────────

  /**
   * Enqueue a story-expire job that fires at the story's expiresAt time.
   * Call this when a story is created and reaches 'ready' status.
   */
  async enqueueExpire(storyId: string, authorId: string, expiresAt: Date): Promise<void> {
    const delayMs = Math.max(0, expiresAt.getTime() - Date.now())
    try {
      if (this.lifecycleQueue) {
        await this.lifecycleQueue.add(
          'story.expire',
          { kind: 'expire', storyId, authorId } satisfies StoryExpireJob,
          { delay: delayMs },
        )
        this.logger.log(`Expire enqueued for story ${storyId} (in ${Math.round(delayMs / 1000)}s)`)
      } else {
        // Degraded: run inline with setTimeout
        setTimeout(() => {
          void this.expireStory(storyId).catch((err) =>
            this.logger.error(`Inline expire failed for story ${storyId}: ${(err as Error).message}`),
          )
        }, delayMs)
      }
    } catch (err) {
      this.logger.error(`Failed to enqueue expire for story ${storyId}: ${(err as Error).message}`)
    }
  }

  /**
   * Enqueue a cleanup job to purge archives past the retention window.
   */
  async enqueueCleanup(): Promise<void> {
    const before = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    try {
      if (this.lifecycleQueue) {
        await this.lifecycleQueue.add(
          'story.cleanup',
          { kind: 'cleanup', before } satisfies StoryCleanupJob,
          { removeOnComplete: { count: 10 }, removeOnFail: { count: 5 } },
        )
      }
    } catch (err) {
      this.logger.error(`Failed to enqueue cleanup: ${(err as Error).message}`)
    }
  }

  // ── LIFECYCLE PROCESSOR ─────────────────────────────────────────────────

  private async processLifecycle(job: StoryLifecycleJob): Promise<void> {
    if (job.kind === 'expire') {
      await this.expireStory(job.storyId)
    } else {
      await this.purgeArchives(job.before)
    }
  }

  /**
   * Expire a story: snapshot to archive, mark archived, invalidate caches,
   * emit realtime expire event to tray.
   */
  private async expireStory(storyId: string): Promise<void> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        media: { select: { id: true, imageUrl: true, previewUrl: true, thumbnailUrl: true, blurhash: true, type: true, hlsUrl: true } },
        author: { select: { id: true } },
      },
    })

    if (!story || story.isDeleted) return // Already gone

    const authorId = story.authorId as string
    const snapshot = {
      type: story.type,
      caption: story.caption,
      background: story.background,
      refType: story.refType,
      refId: story.refId,
      durationMs: story.durationMs,
      privacy: story.privacy,
      media: (story.media as Record<string, unknown>[]).map((m: Record<string, unknown>) => ({
        id: m.id,
        type: m.type,
        imageUrl: m.imageUrl,
        previewUrl: m.previewUrl,
        thumbnailUrl: m.thumbnailUrl,
        blurhash: m.blurhash,
        hlsUrl: m.hlsUrl,
      })),
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.story.update({
        where: { id: storyId },
        data: { isArchived: true, status: 'ready' },
      })
      await tx.storyArchive.upsert({
        where: { storyId },
        create: {
          storyId,
          ownerId: authorId,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          archivedAt: new Date(),
          purgeAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          archivedAt: new Date(),
          purgeAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    })

    // Redis cleanup
    await this.redis.invalidateStory(storyId)
    await this.redis.invalidateStoryTray(authorId)

    // Emit realtime expire event
    await this.realtime.publish(`tray:${authorId}`, 'story:expire', { storyId, authorId })

    this.logger.log(`Story ${storyId} expired and archived`)
  }

  /**
   * Purge archive rows past the 30-day retention window.
   * Runs once daily via external cron / ScheduledJobsService.
   */
  private async purgeArchives(before: string): Promise<void> {
    const cutoff = new Date(before)
    const oldArchives = await this.prisma.storyArchive.findMany({
      where: { purgeAfter: { lt: cutoff } },
      select: { storyId: true },
    })

    if (oldArchives.length === 0) {
      this.logger.log('No archives to purge')
      return
    }

    const storyIds = oldArchives.map((a: Record<string, unknown>) => a.storyId as string)

    await this.prisma.$transaction(async (tx) => {
      // Delete archive rows
      await tx.storyArchive.deleteMany({
        where: { storyId: { in: storyIds } },
      })
      // Soft-delete the stories
      await tx.story.updateMany({
        where: { id: { in: storyIds } },
        data: { isDeleted: true, deletedAt: new Date() },
      })
    })

    // Invalidate caches
    for (const sid of storyIds) {
      await this.redis.invalidateStory(sid).catch(() => {})
    }

    this.logger.log(`Purged ${oldArchives.length} expired archives before ${before}`)
  }
}
