import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PUSH_PREFERENCE_KEYS } from './push-categories'

/**
 * Per-channel notification preferences.
 *
 * The eleven booleans on UserSettings are shared between in-app and email, so
 * switching off "Likes & Reactions" to stop a phone buzzing also removed the
 * in-app record of what happened. Push therefore gets its own answer, stored one
 * row per (member, category, channel).
 *
 * Absence means on. Rows exist only where a member has changed something, which
 * keeps the table small and means a new category needs no backfill.
 */

export type PreferenceChannel = 'push' | 'in_app' | 'email'

const PUSH_KEY_SET = new Set<string>(PUSH_PREFERENCE_KEYS)

@Injectable()
export class NotificationPreferenceService {
  private readonly logger = new Logger(NotificationPreferenceService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Every push category with the member's current answer, defaults included, so
   * the settings screen can render without knowing which rows happen to exist.
   */
  async getForChannel(
    userId: string,
    channel: PreferenceChannel,
  ): Promise<Record<string, boolean>> {
    const rows = await this.prisma.notificationPreference.findMany({
      where: { userId, channel },
      select: { preferenceKey: true, enabled: true },
    })
    const stored = new Map(rows.map((r) => [r.preferenceKey, r.enabled]))

    const result: Record<string, boolean> = {}
    for (const key of PUSH_PREFERENCE_KEYS) {
      result[key] = stored.get(key) ?? true
    }
    return result
  }

  /**
   * Writes one category's answer.
   *
   * Unknown keys are refused rather than stored: the registry decides which keys
   * exist, and quietly accepting a typo would leave a row that nothing reads and
   * a member believing they had switched something off.
   */
  async set(
    userId: string,
    preferenceKey: string,
    channel: PreferenceChannel,
    enabled: boolean,
  ): Promise<boolean> {
    if (!PUSH_KEY_SET.has(preferenceKey)) return false

    await this.prisma.notificationPreference.upsert({
      where: { userId_preferenceKey_channel: { userId, preferenceKey, channel } },
      create: { userId, preferenceKey, channel, enabled },
      update: { enabled },
    })
    return true
  }

  /**
   * Whether this category may reach the member as a push.
   *
   * Two gates, because they answer different questions. `pushEnabled` on
   * UserSettings is the master switch the settings screen has always shown as
   * "Receive notifications on your device" — and which nothing read until now, so
   * turning it off changed a row and nothing else. The per-category row is the
   * finer control. Either one being off is enough to withhold.
   *
   * Fails closed, unlike the in-app gate. The reasoning differs by channel: an
   * in-app notification is the member's only record that something happened, so
   * losing one to a transient error is unacceptable and that gate delivers on
   * failure. A push is a second copy of a record already saved — withholding it
   * loses nothing, while sending one the member switched off is both irritating
   * and impossible to take back.
   */
  async allowsPush(userId: string, preferenceKey?: string): Promise<boolean> {
    try {
      // Both at once: they are independent reads and a notification should not
      // wait for two database round-trips to find out it is unwanted.
      const [settings, row] = await Promise.all([
        this.prisma.userSettings.findUnique({
          where: { userId },
          select: { pushEnabled: true },
        }),
        // A type with no registry key has no category control, so only the
        // master switch can apply to it. Still gated by that, though — "no
        // notifications on my device" has to mean all of them.
        preferenceKey
          ? this.prisma.notificationPreference.findUnique({
              where: { userId_preferenceKey_channel: { userId, preferenceKey, channel: 'push' } },
              select: { enabled: true },
            })
          : Promise.resolve(null),
      ])

      // No settings row means the member never opened settings, and the default
      // is on — same rule the in-app and email gates use.
      if (settings?.pushEnabled === false) return false

      // No preference row means this category was never changed, so it is on.
      return row?.enabled ?? true
    } catch (err) {
      this.logger.warn(`Push preference lookup failed for ${preferenceKey}; withholding`, err as Error)
      return false
    }
  }
}
