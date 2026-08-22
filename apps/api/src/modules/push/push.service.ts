import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
// Namespace import, not default: this tsconfig sets allowSyntheticDefaultImports
// without esModuleInterop, so a default import of a CommonJS module type-checks
// and is undefined at runtime.
import * as webpush from 'web-push'
import { ConfigService } from '../config/config.service'
import { PrismaService } from '../prisma/prisma.service'
import type { SubscribeInput } from './push.schemas'

/**
 * What a browser receives. Kept deliberately small: a push payload has a hard
 * size limit (~4 KB after encryption) and the service worker only needs enough
 * to draw a notification and know where to go when it is tapped.
 */
export interface PushPayload {
  title: string
  body?: string
  /** In-app path to open when the notification is clicked. */
  url?: string
  /** Notification type, so the worker can group and tag related alerts. */
  type: string
  /** Notification id, so a tap can mark it read. */
  id?: string
  /**
   * Groups related alerts into one slot on the device, so twelve likes replace
   * each other instead of stacking twelve deep. Falls back to the type when the
   * event has no key of its own.
   */
  collapseKey?: string
}

/**
 * A subscription that keeps failing without being outright rejected is deleted
 * at this many consecutive failures. Low on purpose: a browser that cannot be
 * reached three times running is not coming back, and every send iterates every
 * subscription a member has.
 */
const MAX_CONSECUTIVE_FAILURES = 3

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name)
  private configured = false

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    if (!this.config.pushConfigured) {
      // Not an error. A local environment without keys should run normally with
      // push unavailable, rather than fail to boot over a feature it is not using.
      this.logger.warn('Web Push disabled — VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set')
      return
    }

    webpush.setVapidDetails(
      this.config.vapidSubject,
      this.config.vapidPublicKey as string,
      this.config.vapidPrivateKey as string,
    )
    this.configured = true
    this.logger.log('Web Push configured')
  }

  /** The browser needs this to subscribe. Public by design. */
  getPublicKey(): string | null {
    return this.config.pushConfigured ? (this.config.vapidPublicKey as string) : null
  }

  isConfigured(): boolean {
    return this.configured
  }

  /**
   * Records a browser's subscription.
   *
   * Upserted on the endpoint rather than inserted: a browser can hand out the
   * same endpoint again after a permission re-prompt or a service worker update,
   * and each of those must not leave another row behind. The endpoint is also
   * how a subscription moves between accounts — sign out, sign in as someone
   * else, same browser — so userId is part of the update, not just the insert.
   */
  async subscribe(userId: string, input: SubscribeInput, userAgent?: string): Promise<void> {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      create: {
        userId,
        endpoint: input.endpoint,
        p256dh: input.keys.p256dh,
        auth: input.keys.auth,
        userAgent: userAgent?.slice(0, 500),
        lastSeenAt: new Date(),
      },
      update: {
        userId,
        p256dh: input.keys.p256dh,
        auth: input.keys.auth,
        userAgent: userAgent?.slice(0, 500),
        lastSeenAt: new Date(),
        failureCount: 0,
      },
    })
  }

  /**
   * Scoped to the caller so one member cannot delete another's subscription by
   * guessing an endpoint. deleteMany rather than delete because unsubscribing
   * twice is a normal thing for a client to do, and the second call should be a
   * no-op rather than a 404.
   */
  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    await this.prisma.pushSubscription.deleteMany({ where: { userId, endpoint } })
  }

  /**
   * Sends to every browser the member has registered.
   *
   * Best effort by design: this is called from the notification write path, and
   * the notification itself is already saved. A push that cannot be delivered
   * must never be the reason a member loses the in-app record, so nothing here
   * throws.
   */
  async sendToUser(userId: string, payload: PushPayload): Promise<{ sent: number; pruned: number }> {
    if (!this.configured) return { sent: 0, pruned: 0 }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
      select: { id: true, endpoint: true, p256dh: true, auth: true, failureCount: true },
    })
    if (subscriptions.length === 0) return { sent: 0, pruned: 0 }

    const body = JSON.stringify(payload)
    const succeeded: string[] = []
    const dead: string[] = []
    const failed: { id: string; count: number }[] = []

    // Concurrently: these are independent HTTP requests to a push service, and a
    // member with several devices should not wait for them in series.
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            body,
            { TTL: 60 * 60 * 24 },
          )
          succeeded.push(sub.id)
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode

          // 404 and 410 are the push service telling us this endpoint is gone for
          // good — uninstalled browser, cleared site data, expired subscription.
          // Keeping it would mean a failed request on every future notification.
          if (status === 404 || status === 410) {
            dead.push(sub.id)
            return
          }

          // Anything else may be transient (a 500 from the push service, a
          // network blip), so the row survives and only its failure count moves.
          failed.push({ id: sub.id, count: sub.failureCount + 1 })
          this.logger.debug(`Push to ${sub.id} failed with ${status ?? 'no status'}`)
        }
      }),
    )

    const exhausted = failed.filter((f) => f.count >= MAX_CONSECUTIVE_FAILURES).map((f) => f.id)
    const stillTrying = failed.filter((f) => f.count < MAX_CONSECUTIVE_FAILURES)
    const toPrune = [...dead, ...exhausted]

    if (toPrune.length > 0) {
      await this.prisma.pushSubscription.deleteMany({ where: { id: { in: toPrune } } })
    }
    if (stillTrying.length > 0) {
      await Promise.all(
        stillTrying.map((f) =>
          this.prisma.pushSubscription.update({
            where: { id: f.id },
            data: { failureCount: f.count },
          }),
        ),
      )
    }
    // A send that worked clears that subscription's count, so three failures
    // spread over months never add up to a deletion. Scoped to the ones that
    // actually succeeded — resetting by "failureCount > 0" would undo the
    // increments written immediately above for the ones that just failed.
    const recovered = succeeded.filter(
      (id) => (subscriptions.find((s) => s.id === id)?.failureCount ?? 0) > 0,
    )
    if (recovered.length > 0) {
      await this.prisma.pushSubscription.updateMany({
        where: { id: { in: recovered } },
        data: { failureCount: 0 },
      })
    }

    return { sent: succeeded.length, pruned: toPrune.length }
  }
}
