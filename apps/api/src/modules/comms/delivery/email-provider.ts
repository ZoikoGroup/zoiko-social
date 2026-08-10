import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import type { EmailStream } from '../comms.types'

/**
 * Provider port — ZS-COMMS-EMAIL-001 §05, deliverable 4 of §16.
 *
 * Everything above this interface is provider-agnostic. The spec calls for
 * "provider failover", and the first step toward that is not hard-wiring one
 * vendor's SDK through the codebase: swapping Resend for Postmark or SES should
 * be one file, not a search across the estate.
 */
export interface OutboundEmail {
  to: string
  subject: string
  html: string
  text: string
  stream: EmailStream
  /**
   * §14/RFC 8058. Present only for configurable and marketing mail — Gmail and
   * Yahoo require one-click unsubscribe on bulk mail, and §12 is explicit that
   * it must NOT appear on password resets or receipts.
   */
  listUnsubscribeUrl?: string
  /** Correlates the provider's id back to our ledger. */
  correlationId?: string
}

export interface SendResult {
  ok: boolean
  providerMessageId?: string
  error?: string
}

export abstract class EmailProvider {
  abstract readonly name: string
  abstract send(message: OutboundEmail): Promise<SendResult>
}

/**
 * Default provider: renders and logs, never sends.
 *
 * Used whenever no API key is configured, so a missing key degrades to silence
 * rather than an exception on a request path. Also what local development and
 * CI use — nobody wants a test run to mail real people.
 */
@Injectable()
export class ConsoleEmailProvider extends EmailProvider {
  readonly name = 'console'
  private readonly logger = new Logger(ConsoleEmailProvider.name)

  send(message: OutboundEmail): Promise<SendResult> {
    this.logger.log(
      `[not sent — no provider configured] to=${message.to} stream=${message.stream} subject="${message.subject}"`,
    )
    return Promise.resolve({ ok: true, providerMessageId: 'console' })
  }
}

/**
 * Resend adapter.
 *
 * Uses the REST endpoint directly rather than the SDK: one POST, no dependency,
 * and nothing to keep in step with the SDK's release cycle.
 */
@Injectable()
export class ResendEmailProvider extends EmailProvider {
  readonly name = 'resend'
  private readonly logger = new Logger(ResendEmailProvider.name)
  private static readonly ENDPOINT = 'https://api.resend.com/emails'

  constructor(private readonly config: ConfigService) {
    super()
  }

  async send(message: OutboundEmail): Promise<SendResult> {
    const apiKey = this.config.resendApiKey
    const from = this.config.emailFrom(message.stream)
    if (!apiKey || !from) {
      return { ok: false, error: 'Resend is not configured' }
    }

    const headers: Record<string, string> = {}
    if (message.listUnsubscribeUrl) {
      // RFC 8058: both headers are required for one-click. Providing
      // List-Unsubscribe alone gets the mailbox provider to render a link that
      // does nothing on click, which is worse than omitting it.
      headers['List-Unsubscribe'] = `<${message.listUnsubscribeUrl}>`
      headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
    }

    try {
      const response = await fetch(ResendEmailProvider.ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          // Sent explicitly rather than letting the provider derive it: §08
          // requires the text part to be semantically equivalent, and a
          // generated one is not.
          text: message.text,
          ...(this.config.emailReplyTo ? { reply_to: this.config.emailReplyTo } : {}),
          ...(Object.keys(headers).length ? { headers } : {}),
        }),
      })

      const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }

      if (!response.ok) {
        const detail = body.message ?? body.name ?? `HTTP ${response.status}`
        this.logger.warn(`Resend rejected a message to ${message.to}: ${detail}`)
        return { ok: false, error: detail }
      }

      return { ok: true, providerMessageId: body.id }
    } catch (err) {
      // A provider outage must not surface as a 500 on whatever request
      // triggered the notification.
      const reason = err instanceof Error ? err.message : String(err)
      this.logger.error(`Resend request failed for ${message.to}: ${reason}`)
      return { ok: false, error: reason }
    }
  }
}
