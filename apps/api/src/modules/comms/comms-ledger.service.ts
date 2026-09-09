import { Injectable, Logger } from '@nestjs/common'
import { createHash } from 'node:crypto'
import { PrismaService } from '../prisma/prisma.service'
import type { EmailDeliveryState } from '@prisma/client'
import type { EmailStream, SuppressionReason } from './comms.types'

/**
 * Delivery ledger and suppression list — ZS-COMMS-EMAIL-001 §07,
 * deliverable 2 of §16.
 *
 * The ledger records attempts that never left the building as well as those
 * that did. §03: "The absence of an email is a designed and auditable outcome.
 * Suppression, cancellation, supersession, and expiry receive ledger records."
 * A missing row would make "why didn't I get it" unanswerable.
 */
@Injectable()
export class CommsLedgerService {
  private readonly logger = new Logger(CommsLedgerService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * §07 idempotency formula: hash(event_name, event_version, recipient
   * identity, source_object_id, business_dedupe_qualifier).
   *
   * The qualifier is what lets a legitimate repeat through: a second
   * password-reset request supplies a new one, a retried webhook for the same
   * payment does not.
   */
  idempotencyKey(parts: {
    eventName: string
    eventVersion?: string
    recipient: string
    sourceObjectId?: string
    qualifier?: string
  }): string {
    return createHash('sha256')
      .update(
        [
          parts.eventName,
          parts.eventVersion ?? '1.0.0',
          parts.recipient,
          parts.sourceObjectId ?? '',
          parts.qualifier ?? '',
        ].join('|'),
      )
      .digest('hex')
  }

  /**
   * The ledger stores a digest, never the address. §07 models the recipient as
   * an address record rather than raw mail, and a permanent audit log is the
   * last place that should stay re-identifiable.
   */
  hashAddress(address: string): string {
    return createHash('sha256').update(address.trim().toLowerCase()).digest('hex')
  }

  /**
   * Writes or advances a ledger entry.
   *
   * Upsert on the idempotency key, so a producer that retries updates the
   * existing record instead of creating a second one — which is the whole point
   * of the key.
   */
  async record(entry: {
    idempotencyKey: string
    eventName: string
    templateId: string
    messageClass: string
    stream: EmailStream
    recipientHash: string
    state: EmailDeliveryState
    userId?: string
    preferenceKey?: string
    correlationId?: string
    suppressionReason?: SuppressionReason | string
    provider?: string
    providerMessageId?: string
    subject?: string
    failureDetail?: string
  }): Promise<void> {
    const data = {
      eventName: entry.eventName,
      templateId: entry.templateId,
      messageClass: entry.messageClass,
      stream: entry.stream,
      recipientHash: entry.recipientHash,
      state: entry.state,
      userId: entry.userId ?? null,
      preferenceKey: entry.preferenceKey ?? null,
      correlationId: entry.correlationId ?? null,
      suppressionReason: entry.suppressionReason ?? null,
      provider: entry.provider ?? null,
      providerMessageId: entry.providerMessageId ?? null,
      subject: entry.subject ?? null,
      failureDetail: entry.failureDetail ?? null,
    }

    try {
      await this.prisma.emailDelivery.upsert({
        where: { idempotencyKey: entry.idempotencyKey },
        create: { idempotencyKey: entry.idempotencyKey, ...data },
        update: data,
      })
    } catch (err) {
      // The ledger must never break the thing it is recording. A notification
      // that sends but goes unlogged is bad; a notification that fails because
      // logging failed is worse.
      this.logger.warn(`Ledger write failed for ${entry.eventName}: ${(err as Error).message}`)
    }
  }

  /** Attaches the provider's id once a handoff is accepted. */
  async markProviderAccepted(idempotencyKey: string, provider: string, providerMessageId?: string): Promise<void> {
    await this.prisma.emailDelivery
      .update({
        where: { idempotencyKey },
        data: { state: 'provider_accepted', provider, providerMessageId: providerMessageId ?? null },
      })
      .catch(() => undefined)
  }

  /** Advances state from a provider webhook, matched on the provider's id. */
  async applyProviderState(
    providerMessageId: string,
    state: EmailDeliveryState,
    detail?: string,
  ): Promise<number> {
    const result = await this.prisma.emailDelivery.updateMany({
      where: { providerMessageId },
      data: { state, failureDetail: detail ?? null },
    })
    return result.count
  }
}
