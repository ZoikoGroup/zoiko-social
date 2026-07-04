import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'

export interface NotificationJobData {
  userId: string
  type: string
  title: string
  body?: string
  data?: Record<string, unknown>
}

/**
 * NotificationWriterService — the single write path for notifications.
 * Used by the BullMQ worker in normal operation and called inline when
 * Redis is unavailable, so delivery semantics stay identical either way:
 * persist to PostgreSQL, then push over Socket.IO.
 */
@Injectable()
export class NotificationWriterService {
  private readonly logger = new Logger(NotificationWriterService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async write(job: NotificationJobData): Promise<void> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: job.userId,
        type: job.type,
        title: job.title,
        body: job.body,
        data: (job.data as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    })

    await this.realtime.publishToUser(job.userId, 'notification.new', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    })
  }
}
