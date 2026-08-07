import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CommsDecisionService } from '../comms/comms-decision.service'
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
    private readonly decision: CommsDecisionService,
  ) {}

  async write(job: NotificationJobData): Promise<void> {
    // The member's notification preferences are honoured here rather than at
    // the ~45 producer sites, for the same reason the write path itself is
    // central: a check that has to be repeated is a check that gets forgotten.
    // Essential account and security notifications are exempt and never reach
    // this gate as a refusal.
    const decision = await this.decision.decideInApp(job.userId, job.type)
    if (!decision.deliver) {
      this.logger.debug(`Skipped "${job.type}" for ${job.userId}: ${decision.reason} is off`)
      return
    }

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
