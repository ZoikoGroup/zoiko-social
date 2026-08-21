import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { LOW_CHURN_WORKER_OPTS } from '../queue/worker-options'
import { ThrottledErrorLog, isFatalRedisError } from '../redis/redis-failure'

@Processor('messaging', LOW_CHURN_WORKER_OPTS)
export class MessagingProcessor extends WorkerHost {
  private readonly workerErrorLog = new ThrottledErrorLog()
  private stopped = false

  private readonly logger = new Logger(MessagingProcessor.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {
    super()
  }

  async process(job: Job<{ type: string; data: Record<string, unknown> }>): Promise<void> {
    switch (job.data.type) {
      case 'send_notification':
        await this.handleSendNotification(job)
        break
      case 'cleanup_expired_requests':
        await this.handleCleanupExpiredRequests()
        break
      case 'spam_check':
        await this.handleSpamCheck(job)
        break
      case 'expire_message_request':
        await this.handleExpireMessageRequest(job)
        break
      default:
        this.logger.warn(`Unknown job type: ${job.data.type}`)
    }
  }

  private async handleSendNotification(job: Job): Promise<void> {
    const { userId, title, body, type, data } = job.data.data as {
      userId: string
      title: string
      body: string
      type: string
      data: Record<string, unknown>
    }

    await this.notifications.enqueue({ userId, title, body, type, data })
  }

  private async handleCleanupExpiredRequests(): Promise<void> {
    const now = new Date()
    const expired = await this.prisma.messageRequest.updateMany({
      where: {
        status: 'pending',
        expiresAt: { lt: now },
      },
      data: { status: 'expired' },
    })

    if (expired.count > 0) {
      this.logger.log(`Expired ${expired.count} message requests`)
    }
  }

  private async handleSpamCheck(job: Job): Promise<void> {
    const { senderId, recipientId, messageContent } = job.data.data as {
      senderId: string
      recipientId: string
      messageContent: string
    }

    // Basic spam detection: check for repeated URLs, excessive caps, etc.
    const urlCount = (messageContent.match(/https?:\/\//g) ?? []).length
    const capsRatio = messageContent.replace(/[^A-Z]/g, '').length / Math.max(messageContent.length, 1)

    const isSpam = urlCount > 3 || capsRatio > 0.5

    if (isSpam) {
      await this.prisma.messageRequest.updateMany({
        where: { senderId, recipientId, status: 'pending' },
        data: { isSpam: true },
      })
      this.logger.warn(`Marked message request from ${senderId} to ${recipientId} as spam`)
    }
  }

  private async handleExpireMessageRequest(job: Job): Promise<void> {
    const { requestId } = job.data.data as { requestId: string }
    // updateMany + status guard: only expire a still-pending request. `update`
    // would (a) clobber a request the recipient already accepted/rejected back
    // to "expired", and (b) throw P2025 (failing the job) if the row was deleted.
    await this.prisma.messageRequest.updateMany({
      where: { id: requestId, status: 'pending' },
      data: { status: 'expired' },
    })
  }

  /**
   * Stops the worker when Redis will never answer again.
   *
   * Bounding the *connection* retries was not enough: a BullMQ worker polls for
   * jobs on a timer, and with an exhausted request quota every poll failed and
   * printed a stack trace. That was still 115,000 log lines and, eventually, a
   * dead API — the outage caused by the polling rather than by Redis.
   *
   * A worker that cannot reach its queue has nothing to do, so it closes. Jobs
   * are not lost by this: producers already fall back to writing inline when the
   * queue is unavailable. Recovery is a restart, which is the right shape for a
   * quota that resets on a billing period rather than in a few seconds.
   */
  @OnWorkerEvent('error')
  onError(error: Error): void {
    if (!isFatalRedisError(error)) {
      const line = this.workerErrorLog.next(`Messaging worker error: ${error.message}`)
      if (line) this.logger.warn(line)
      return
    }

    if (this.stopped) return
    this.stopped = true
    this.logger.error(`Stopping the messaging worker — Redis is refusing commands: ${error.message}`)
    // Detached: this handler is called from the worker's own event loop, and
    // awaiting its close from inside would deadlock.
    void this.worker.close().catch(() => undefined)
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.debug(`Job ${job.id} completed (${job.data.type})`)
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error): void {
    this.logger.error(`Job ${job.id} failed (${job.data.type}): ${error.message}`)
  }
}
