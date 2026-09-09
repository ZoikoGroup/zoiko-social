import { Body, Controller, Headers, HttpCode, HttpStatus, Logger, Post, Req } from '@nestjs/common'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { FastifyRequest } from 'fastify'
import type { EmailDeliveryState } from '@prisma/client'
import { ConfigService } from '../../config/config.service'
import { PrismaService } from '../../prisma/prisma.service'
import { CommsLedgerService } from '../comms-ledger.service'
import { CommsSuppressionService } from '../comms-suppression.service'

/**
 * Provider feedback ingestion — §07 `POST /v1/provider-webhooks/{provider}`.
 *
 * This is the loop that keeps the suppression list honest. Without it, bounces
 * and complaints are invisible, the list never grows, and the same dead
 * addresses get mailed until a mailbox provider stops trusting the domain.
 *
 * §07 requires signature verification and deduplication on the provider's event
 * id, in that order — an unverified payload must not even be deduplicated,
 * since that would let an attacker burn event ids.
 */

/** Resend event names → our ledger states. */
const STATE_BY_EVENT: Readonly<Record<string, EmailDeliveryState>> = {
  'email.sent': 'provider_accepted',
  'email.delivered': 'delivered',
  'email.delivery_delayed': 'deferred',
  'email.bounced': 'hard_bounced',
  'email.complained': 'complaint',
  'email.failed': 'failed',
}

interface ResendWebhookBody {
  type?: string
  created_at?: string
  data?: {
    email_id?: string
    to?: string[] | string
    subject?: string
    bounce?: { type?: string; message?: string }
  }
}

@Controller('comms/provider-webhooks')
export class ProviderWebhookController {
  private readonly logger = new Logger(ProviderWebhookController.name)

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly ledger: CommsLedgerService,
    private readonly suppression: CommsSuppressionService,
  ) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(
    @Req() request: FastifyRequest & { rawBody?: Buffer },
    @Body() body: ResendWebhookBody,
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') svixTimestamp?: string,
    @Headers('svix-signature') svixSignature?: string,
  ): Promise<{ received: boolean }> {
    const secret = process.env.RESEND_WEBHOOK_SECRET
    if (secret) {
      const ok = this.verify(request.rawBody, secret, svixId, svixTimestamp, svixSignature)
      if (!ok) {
        // 200 on purpose: a rejected payload should not tell a prober whether
        // it guessed the secret, and a provider retrying a bad signature helps
        // nobody. The refusal is logged instead.
        this.logger.warn('Rejected a Resend webhook with an invalid signature')
        return { received: true }
      }
    } else {
      // Loud, because an unverified webhook endpoint accepts forged bounces,
      // and a forged bounce permanently suppresses a real address.
      this.logger.warn('RESEND_WEBHOOK_SECRET is not set — webhook signatures are NOT being verified')
    }

    const eventType = body.type
    const emailId = body.data?.email_id
    if (!eventType || !emailId) return { received: true }

    // §07: deduplicate on provider event id, after verification. Providers
    // retry, and a complaint processed twice would double-suppress and corrupt
    // the audit trail.
    const providerEventId = svixId ?? `${emailId}:${eventType}:${body.created_at ?? ''}`
    try {
      await this.prisma.emailProviderEvent.create({
        data: { provider: 'resend', providerEventId, eventType },
      })
    } catch {
      // Unique violation — already handled.
      return { received: true }
    }

    const state = STATE_BY_EVENT[eventType]
    if (state) {
      await this.ledger.applyProviderState(emailId, state, body.data?.bounce?.message)
    }

    // A hard bounce or a complaint suppresses the address permanently.
    // Delivery delays and soft failures deliberately do not: a full mailbox
    // recovers, and suppressing on it would lose a real recipient.
    const address = Array.isArray(body.data?.to) ? body.data?.to[0] : body.data?.to
    if (address) {
      if (eventType === 'email.bounced' && body.data?.bounce?.type !== 'Transient') {
        await this.suppression.suppress(address, 'hard_bounce', 'resend', body.data?.bounce?.message)
      } else if (eventType === 'email.complained') {
        await this.suppression.suppress(address, 'complaint', 'resend')
      }
    }

    return { received: true }
  }

  /**
   * Svix signature verification, which is what Resend uses.
   *
   * Signs `id.timestamp.body` with the base64 secret and compares in constant
   * time. The header can carry several space-separated versioned signatures
   * during a secret rotation, so every v1 entry is checked.
   */
  private verify(
    rawBody: Buffer | undefined,
    secret: string,
    id?: string,
    timestamp?: string,
    signature?: string,
  ): boolean {
    if (!rawBody || !id || !timestamp || !signature) return false

    // Reject anything older than five minutes, so a captured payload cannot be
    // replayed later.
    const age = Math.abs(Date.now() / 1000 - Number(timestamp))
    if (!Number.isFinite(age) || age > 300) return false

    const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
    const expected = createHmac('sha256', key)
      .update(`${id}.${timestamp}.${rawBody.toString('utf8')}`)
      .digest('base64')

    return signature
      .split(' ')
      .filter((part) => part.startsWith('v1,'))
      .some((part) => {
        const provided = Buffer.from(part.slice(3), 'base64')
        const mine = Buffer.from(expected, 'base64')
        return provided.length === mine.length && timingSafeEqual(provided, mine)
      })
  }
}
