import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { EmailSuppressionReason } from '@prisma/client'

/**
 * Suppression list — ZS-COMMS-EMAIL-001 §07, §08, §14.
 *
 * The list that keeps a sending domain alive. Mailbox providers judge a sender
 * on complaint and bounce rates; continuing to mail an address that already
 * hard-bounced or complained is the fastest way to have everything filtered,
 * including password resets.
 *
 * §08 (Suppression Console): "Explain exact suppression layer and source;
 * restrict manual overrides; preserve complaints and hard bounces." So hard
 * bounces and complaints are permanent here and `lift()` refuses them —
 * enforced in code rather than left to console discipline.
 */
@Injectable()
export class CommsSuppressionService {
  private readonly logger = new Logger(CommsSuppressionService.name)

  /** Reasons no operator may clear. */
  private static readonly PERMANENT: ReadonlySet<EmailSuppressionReason> = new Set([
    'hard_bounce',
    'complaint',
  ])

  constructor(private readonly prisma: PrismaService) {}

  private normalize(address: string): string {
    return address.trim().toLowerCase()
  }

  /**
   * Checked before every send, including essential mail.
   *
   * §00 is explicit that a hard-bounced or blocked address is never overridden
   * even for legally required notices — those route to an alternate channel
   * instead. Sending to a dead address is not delivery, it is reputation damage
   * plus a false record of having told someone.
   */
  async isSuppressed(address: string): Promise<boolean> {
    const row = await this.prisma.emailSuppression.findUnique({
      where: { address: this.normalize(address) },
      select: { id: true },
    })
    return row !== null
  }

  async reasonFor(address: string): Promise<EmailSuppressionReason | null> {
    const row = await this.prisma.emailSuppression.findUnique({
      where: { address: this.normalize(address) },
      select: { reason: true },
    })
    return row?.reason ?? null
  }

  /**
   * Adds or upgrades a suppression.
   *
   * Never downgrades: an address suppressed by a complaint that later
   * unsubscribes stays a complaint, because the stronger signal is the one that
   * matters to a mailbox provider.
   */
  async suppress(
    address: string,
    reason: EmailSuppressionReason,
    source?: string,
    detail?: string,
  ): Promise<void> {
    const normalized = this.normalize(address)
    const permanent = CommsSuppressionService.PERMANENT.has(reason)

    try {
      const existing = await this.prisma.emailSuppression.findUnique({
        where: { address: normalized },
        select: { permanent: true },
      })

      if (existing?.permanent && !permanent) return

      await this.prisma.emailSuppression.upsert({
        where: { address: normalized },
        create: { address: normalized, reason, permanent, source: source ?? null, detail: detail ?? null },
        update: { reason, permanent, source: source ?? null, detail: detail ?? null },
      })
      this.logger.log(`Suppressed an address (${reason}${source ? ` via ${source}` : ''})`)
    } catch (err) {
      this.logger.warn(`Suppression write failed: ${(err as Error).message}`)
    }
  }

  /**
   * Removes a suppression. Refuses the permanent ones.
   *
   * Returns whether it was lifted, so a console can explain the refusal rather
   * than appearing to succeed.
   */
  async lift(address: string): Promise<{ lifted: boolean; reason?: string }> {
    const normalized = this.normalize(address)
    const existing = await this.prisma.emailSuppression.findUnique({
      where: { address: normalized },
      select: { reason: true, permanent: true },
    })
    if (!existing) return { lifted: true }

    if (existing.permanent) {
      return {
        lifted: false,
        reason: `${existing.reason} suppressions are permanent and cannot be lifted`,
      }
    }

    await this.prisma.emailSuppression.delete({ where: { address: normalized } })
    return { lifted: true }
  }
}
