import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'

@Processor('messaging')
export class MessagingProcessor extends WorkerHost {
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
    await this.prisma.messageRequest.update({
      where: { id: requestId },
      data: { status: 'expired' },
    })
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
