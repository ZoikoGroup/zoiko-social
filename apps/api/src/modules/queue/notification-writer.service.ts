import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CommsDecisionService } from '../comms/comms-decision.service'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'
import { NotificationPreferenceService } from '../push/notification-preference.service'
import { PushService } from '../push/push.service'
import { pushCategoryFor } from '../push/push-categories'
import { lookupEvent } from '../comms/comms.registry'
import { isEssential } from '../comms/comms.types'

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
    private readonly push: PushService,
    private readonly pushPreferences: NotificationPreferenceService,
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

    // Last, and never in a way that can undo the two steps above: the record is
    // saved and any open tab already knows. A push is the copy that reaches a
    // member who is not looking at the app, so failing to send one costs nothing.
    await this.pushIfWanted(job, notification.id)
  }

  /**
   * Sends the push for a notification that has already been written.
   *
   * Push answers to its own preference rather than the in-app one, because
   * silencing a phone and erasing the record are different requests. Essential
   * notifications skip the check entirely, exactly as they do for in-app and
   * email — a member who muted community activity still has to hear that their
   * account was suspended.
   */
  private async pushIfWanted(job: NotificationJobData, notificationId: string): Promise<void> {
    try {
      /*
       * The category comes from the push map, not the email registry. Sixteen of
       * the types this app produces have no registry entry — no email template
       * exists for them — and gating on the registry meant those pushed with no
       * category control at all.
       *
       * A type with no category falls through to the master switch alone, unless
       * it is essential (account, security, billing), which nothing should be
       * able to silence individually.
       */
      const category = pushCategoryFor(job.type)

      if (category) {
        if (!(await this.pushPreferences.allowsPush(job.userId, category))) return
      } else {
        const definition = lookupEvent(job.type)
        const essential = definition ? isEssential(definition.messageClass) : false
        // Still the master switch even for an unmapped type: "no notifications on
        // my device" cannot have exceptions the member never agreed to.
        if (!essential && !(await this.pushPreferences.allowsPush(job.userId))) return
      }

      await this.push.sendToUser(job.userId, {
        title: job.title,
        body: job.body,
        type: job.type,
        id: notificationId,
        url: this.deepLink(job),
        // The registry already groups related events for email — "twelve people
        // liked your post", not twelve emails. Push reuses those groupings so a
        // like and a reaction land in the same slot rather than one each.
        //
        // Not dailyCap, though: capping is an email rule, born of email being the
        // channel of last resort. Applying it here would silence notifications a
        // member asked for on the one channel meant to be timely.
        ...(lookupEvent(job.type)?.collapseKey
          ? { collapseKey: lookupEvent(job.type)?.collapseKey as string }
          : {}),
      })
    } catch (err) {
      // A notification that is saved and shown in-app has done its job. Push is
      // an extra, so its failure is a log line, not an exception.
      this.logger.warn(`Push for "${job.type}" failed: ${(err as Error).message}`)
    }
  }

  /**
   * Where a tapped notification should land.
   *
   * Producers already put the ids the client needs into `data`, so this reads
   * them rather than inventing a second convention. Anything unrecognised falls
   * back to the notifications list, which is never wrong — only less direct.
   */
  private deepLink(job: NotificationJobData): string {
    const data = (job.data ?? {}) as Record<string, unknown>
    const str = (key: string): string | undefined =>
      typeof data[key] === 'string' ? (data[key] as string) : undefined

    const conversationId = str('conversationId')
    if (conversationId) return `/messages?conversation=${conversationId}`

    // `/p/:postId`, not `/post/:id` — the web app's route is the short one, and
    // the long form I first wrote was a 404 that would have looked like push
    // being broken rather than a wrong link.
    const postId = str('postId')
    if (postId) return `/p/${postId}`

    if (job.type === 'new_follower' || job.type === 'follow_request') {
      const username = str('actorUsername') ?? str('username')
      return username ? `/profile/${username}` : '/network'
    }

    const eventId = str('eventId')
    if (eventId) return `/events/${eventId}`

    // The communities page is a list; there is no per-community route to open,
    // so this lands on the list rather than on a URL that does not resolve.
    if (str('communityId')) return '/communities'

    if (str('orderId')) return '/shop/orders'

    return '/notifications'
  }
}
