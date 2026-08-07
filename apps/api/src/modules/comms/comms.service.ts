import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { SUPABASE_ADMIN_CLIENT, type SupabaseAdminClient } from '../database/database.providers'
import { CommsDecisionService } from './comms-decision.service'
import { CommsLedgerService } from './comms-ledger.service'
import { CommsSuppressionService } from './comms-suppression.service'
import { lookupEvent, streamForEvent } from './comms.registry'
import { EmailProvider, type OutboundEmail } from './delivery/email-provider'
import { renderHtml, renderText, type FooterLinks, type LayoutInput } from './render/layout'
import { AUTH_TEMPLATES, toLayoutInput, type AuthVars, type TemplateContent } from './templates/auth.templates'
import { isEssential } from './comms.types'

/**
 * Dispatcher — decision, render, send.
 *
 * The one place email leaves the system, so the controls in §§03/05/08 are
 * applied in one place rather than per caller. Product code never touches this
 * directly: it enqueues a notification as it always has, and the writer asks
 * here whether that event also travels by email.
 */
@Injectable()
export class CommsService {
  private readonly logger = new Logger(CommsService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly decision: CommsDecisionService,
    private readonly ledger: CommsLedgerService,
    private readonly suppression: CommsSuppressionService,
    private readonly provider: EmailProvider,
    @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabaseAdmin: SupabaseAdminClient,
  ) {}

  /**
   * Sends one templated email if the decision engine permits it.
   *
   * Returns what happened rather than a boolean: §03 requires the absence of an
   * email to be a recorded outcome, and the caller cannot record what it is not
   * told. The delivery ledger consumes this next.
   */
  async sendForEvent(input: {
    userId: string
    notificationType: string
    vars: AuthVars
    /** Distinguishes a legitimate repeat from a retry (§07). */
    dedupeQualifier?: string
    sourceObjectId?: string
    correlationId?: string
  }): Promise<{ sent: boolean; reason?: string; providerMessageId?: string }> {
    const definition = lookupEvent(input.notificationType)
    if (!definition) return { sent: false, reason: 'not_registered' }

    const key = this.ledger.idempotencyKey({
      eventName: input.notificationType,
      recipient: input.userId,
      sourceObjectId: input.sourceObjectId,
      qualifier: input.dedupeQualifier,
    })

    // Every outcome below is written to the ledger, including the refusals.
    // §03 requires the absence of an email to be auditable, which means a
    // suppression is a record rather than a missing row.
    const base = {
      idempotencyKey: key,
      eventName: input.notificationType,
      templateId: definition.templateId,
      messageClass: definition.messageClass,
      stream: streamForEvent(definition),
      userId: input.userId,
      preferenceKey: definition.preferenceKey,
      correlationId: input.correlationId,
    }

    const decision = await this.decision.decide(input.userId, input.notificationType)
    if (!decision.send) {
      await this.ledger.record({
        ...base,
        recipientHash: this.ledger.hashAddress(input.userId),
        state: 'suppressed',
        suppressionReason: decision.reason,
      })
      return { sent: false, reason: decision.reason }
    }

    const template = AUTH_TEMPLATES[definition.templateId]
    if (!template) {
      // Registered but not yet written. Worth a warning: it means the registry
      // promises an email the estate cannot produce.
      this.logger.warn(`No template implementation for ${definition.templateId}`)
      await this.ledger.record({
        ...base,
        recipientHash: this.ledger.hashAddress(input.userId),
        state: 'failed',
        failureDetail: 'template_missing',
      })
      return { sent: false, reason: 'template_missing' }
    }

    const address = await this.resolveEmail(input.userId)
    if (!address) {
      await this.ledger.record({
        ...base,
        recipientHash: this.ledger.hashAddress(input.userId),
        state: 'suppressed',
        suppressionReason: 'no_email_address',
      })
      return { sent: false, reason: 'no_email_address' }
    }

    const recipientHash = this.ledger.hashAddress(address)

    // Checked for every class, essential included. §00: a hard-bounced or
    // blocked address is never overridden — legally required notices route to
    // an alternate channel instead of being thrown at a dead mailbox.
    if (await this.suppression.isSuppressed(address)) {
      const reason = await this.suppression.reasonFor(address)
      await this.ledger.record({
        ...base,
        recipientHash,
        state: 'suppressed',
        suppressionReason: reason ?? 'unsubscribed',
      })
      return { sent: false, reason: reason ?? 'suppressed' }
    }

    const content = template(input.vars)
    const message = this.compose(content, address, decision.stream)
    await this.ledger.record({ ...base, recipientHash, state: 'rendered', subject: content.subject })

    const result = await this.provider.send(message)
    if (!result.ok) {
      this.logger.warn(`Email not delivered to ${input.userId}: ${result.error}`)
      await this.ledger.record({
        ...base,
        recipientHash,
        state: 'failed',
        subject: content.subject,
        provider: this.provider.name,
        failureDetail: result.error,
      })
      return { sent: false, reason: 'provider_error' }
    }

    await this.ledger.record({
      ...base,
      recipientHash,
      state: 'provider_accepted',
      subject: content.subject,
      provider: this.provider.name,
      providerMessageId: result.providerMessageId,
    })
    return { sent: true, providerMessageId: result.providerMessageId }
  }

  /** Renders without sending — used by previews and tests. */
  compose(
    content: TemplateContent,
    to: string,
    stream: 'transactional' | 'notification' | 'marketing',
  ): OutboundEmail {
    const layout: LayoutInput = toLayoutInput(content, {
      legal: {
        entityName: this.config.legalEntityName,
        postalAddress: this.config.legalPostalAddress,
      },
      links: this.footerLinks(content),
    })

    return {
      to,
      subject: content.subject,
      html: renderHtml(layout),
      text: renderText(layout),
      stream,
      // §12: one-click unsubscribe belongs on configurable and marketing mail
      // only. Attaching it to a password reset would invite someone to
      // unsubscribe from their own account security.
      listUnsubscribeUrl: isEssential(content.messageClass) ? undefined : layout.links.unsubscribeUrl,
    }
  }

  private footerLinks(content: TemplateContent): FooterLinks {
    const base = this.config.appBaseUrl
    return {
      privacyUrl: `${base}/privacy`,
      communityStandardsUrl: `${base}/docs/safety-and-trust`,
      helpCenterUrl: `${base}/docs`,
      communicationsHistoryUrl: `${base}/settings`,
      preferencesUrl: `${base}/settings`,
      // Essential mail gets no unsubscribe at all, per §08's footer variants.
      unsubscribeUrl: isEssential(content.messageClass) ? undefined : `${base}/settings`,
    }
  }

  /**
   * Profile carries no email column — addresses live in Supabase auth, so this
   * costs one admin call per recipient. Called only after the decision engine
   * has already agreed to send, so suppressed events never pay for it.
   */
  private async resolveEmail(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.getUserById(userId)
      if (error || !data.user?.email) return null
      return data.user.email
    } catch (err) {
      this.logger.warn(`Could not resolve an address for ${userId}: ${(err as Error).message}`)
      return null
    }
  }
}
