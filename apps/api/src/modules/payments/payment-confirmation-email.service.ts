import { EmailProvider } from '../comms/delivery/email-provider'
import { ConfigService } from '../config/config.service'
import { renderHtml, renderText, type LayoutInput } from '../comms/render/layout'
import { Inject, Injectable, Logger, Optional } from '@nestjs/common'
import { SUPABASE_ADMIN_CLIENT, type SupabaseAdminClient } from '../database/database.providers'
import { PrismaService } from '../prisma/prisma.service'
import { CommsLedgerService } from '../comms/comms-ledger.service'

export type PaymentConfirmationStatus = 'success' | 'failed' | 'pending'

export interface PaymentConfirmationDetails {
  recipientEmail?: string
  userId?: string
  recipientName?: string
  planName?: string
  planOrItemName?: string
  amountFormatted: string
  status?: PaymentConfirmationStatus | string
  billingInterval?: string
  invoiceNumber?: string
  paymentDate?: string
  dashboardUrl?: string
  failureReason?: string
  paymentMethodType?: string
}

export interface OrderPaymentConfirmationDetails {
  orderId: string
  buyerId?: string
  sellerId?: string
  recipientEmail?: string
  recipientName?: string
  productTitle?: string
  quantity?: number
  amountCents?: number
  currency?: string
  amountFormatted?: string
  status?: PaymentConfirmationStatus | string
  sessionId?: string
  invoiceNumber?: string
  failureReason?: string
  dashboardUrl?: string
}

function normalizeStatus(status?: string): PaymentConfirmationStatus {
  if (!status) return 'success'
  const s = status.toLowerCase()
  if (['success', 'paid', 'active', 'completed', 'succeeded'].includes(s)) return 'success'
  if (['pending', 'processing', 'requires_action', 'open', 'unpaid', 'incomplete', 'reserved'].includes(s)) return 'pending'
  if (['failed', 'declined', 'canceled', 'cancelled', 'expired', 'past_due', 'unsuccessful'].includes(s)) return 'failed'
  return 'success'
}

@Injectable()
export class PaymentConfirmationEmailService {
  private readonly logger = new Logger(PaymentConfirmationEmailService.name)

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly config: ConfigService,
    @Optional() @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabaseAdmin?: SupabaseAdminClient,
    @Optional() private readonly prisma?: PrismaService,
    @Optional() private readonly ledger?: CommsLedgerService,
  ) {}

  /**
   * Resolves recipient email and display name with fallback to Supabase auth admin and profile.
   */
  async resolveRecipient(
    userId?: string,
    providedEmail?: string,
    providedName?: string,
  ): Promise<{ email: string | null; name: string }> {
    let email = providedEmail?.trim() || null
    let name = providedName?.trim() || 'Member'

    if (userId) {
      if (!email && this.supabaseAdmin) {
        try {
          const { data, error } = await this.supabaseAdmin.auth.admin.getUserById(userId)
          if (!error && data?.user?.email) {
            email = data.user.email
          }
        } catch (err) {
          this.logger.warn(`Could not resolve user email for ${userId}: ${(err as Error).message}`)
        }
      }

      if ((!name || name === 'Member') && this.prisma) {
        try {
          const profile = await this.prisma.profile.findUnique({
            where: { id: userId },
            select: { displayName: true, firstName: true, lastName: true },
          })
          if (profile) {
            const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
            name = profile.displayName || fullName || 'Member'
          }
        } catch (err) {
          this.logger.warn(`Could not resolve user name for ${userId}: ${(err as Error).message}`)
        }
      }
    }

    return { email, name }
  }

  /**
   * Universal payment confirmation email sender for all statuses: success, failed, pending.
   */
  async sendPaymentConfirmation(details: PaymentConfirmationDetails): Promise<boolean> {
    try {
      const { email, name } = await this.resolveRecipient(
        details.userId,
        details.recipientEmail,
        details.recipientName,
      )

      if (!email) {
        this.logger.warn(`Cannot send payment confirmation email: No email address found for user ${details.userId || 'unknown'}`)
        return false
      }

      const status = normalizeStatus(details.status)
      const appUrl = (this.config.allowedOrigin || this.config.appBaseUrl || 'http://localhost:3000').replace(/\/+$/, '')
      const dashboardUrl = details.dashboardUrl || `${appUrl}/settings?section=billing`
      const itemOrPlan = details.planOrItemName || details.planName || 'Commercial Plan'
      const dateStr = details.paymentDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      let layoutInput: LayoutInput

      if (status === 'success') {
        layoutInput = {
          subject: `Payment Confirmed: Your ${itemOrPlan} is active!`,
          preheader: `Thank you for your payment of ${details.amountFormatted}. Here is your payment confirmation and receipt.`,
          heading: 'Payment Confirmed & Receipt',
          body: [
            `Hello ${name},`,
            `Thank you for subscribing to Zoiko Social! Your payment of ${details.amountFormatted} for the ${itemOrPlan} has been processed successfully.`,
            'Your account has been upgraded with the associated commercial benefits and verified privileges.',
          ],
          contextPanel: [
            { label: 'Plan', value: itemOrPlan },
            { label: 'Amount Paid', value: details.amountFormatted },
            ...(details.billingInterval ? [{ label: 'Billing Period', value: details.billingInterval }] : []),
            { label: 'Date', value: dateStr },
            ...(details.invoiceNumber ? [{ label: 'Invoice / Reference', value: details.invoiceNumber }] : []),
            { label: 'Status', value: 'Paid (Active)' },
          ],
          cta: {
            label: 'View Billing & Invoices',
            url: dashboardUrl,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'billing and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      } else if (status === 'pending') {
        layoutInput = {
          subject: `Payment Pending: We're processing your ${itemOrPlan} payment`,
          preheader: `Your payment of ${details.amountFormatted} has been initiated and is currently pending confirmation.`,
          heading: 'Payment Pending Confirmation',
          body: [
            `Hello ${name},`,
            `Your payment of ${details.amountFormatted} for the ${itemOrPlan} has been initiated and is currently awaiting confirmation.`,
            'Some payment methods require extra processing time or authorization from your financial institution (such as 3D Secure verification). We are monitoring the status and will notify you as soon as the transaction is completed.',
          ],
          contextPanel: [
            { label: 'Plan', value: itemOrPlan },
            { label: 'Amount', value: details.amountFormatted },
            ...(details.billingInterval ? [{ label: 'Billing Period', value: details.billingInterval }] : []),
            { label: 'Date', value: dateStr },
            ...(details.invoiceNumber ? [{ label: 'Reference', value: details.invoiceNumber }] : []),
            { label: 'Status', value: 'Pending Confirmation' },
          ],
          cta: {
            label: 'Check Payment Status',
            url: dashboardUrl,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'billing and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      } else {
        // failed
        const failureReasonText = details.failureReason
          ? `Reason: ${details.failureReason}`
          : 'Your payment could not be authorized by your card issuer or the checkout session timed out.'

        layoutInput = {
          subject: `Payment Failed: Action required for your ${itemOrPlan}`,
          preheader: `Your payment of ${details.amountFormatted} could not be processed. Please update your payment method.`,
          heading: 'Payment Unsuccessful',
          body: [
            `Hello ${name},`,
            `We were unable to process your payment of ${details.amountFormatted} for the ${itemOrPlan}.`,
            failureReasonText,
            'Please review your payment information or use an alternative payment method to ensure uninterrupted service.',
          ],
          contextPanel: [
            { label: 'Plan', value: itemOrPlan },
            { label: 'Amount', value: details.amountFormatted },
            ...(details.billingInterval ? [{ label: 'Billing Period', value: details.billingInterval }] : []),
            { label: 'Date', value: dateStr },
            ...(details.invoiceNumber ? [{ label: 'Reference', value: details.invoiceNumber }] : []),
            ...(details.failureReason ? [{ label: 'Failure Reason', value: details.failureReason }] : []),
            { label: 'Status', value: 'Failed / Declined' },
          ],
          cta: {
            label: 'Update Payment Details',
            url: dashboardUrl,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'billing and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      }

      const html = renderHtml(layoutInput)
      const text = renderText(layoutInput)

      const res = await this.emailProvider.send({
        to: email,
        subject: layoutInput.subject,
        html,
        text,
        stream: 'transactional',
      })

      if (this.ledger && details.userId) {
        try {
          const key = this.ledger.idempotencyKey({
            eventName: `payment.${status}`,
            recipient: details.userId,
            sourceObjectId: details.invoiceNumber,
            qualifier: `${status}_${Date.now()}`,
          })
          await this.ledger.record({
            idempotencyKey: key,
            eventName: `payment.${status}`,
            templateId: `ZS-EM-PAY-${status.toUpperCase()}`,
            messageClass: 'essential_transactional',
            stream: 'transactional',
            recipientHash: this.ledger.hashAddress(email),
            state: res.ok ? 'provider_accepted' : 'failed',
            userId: details.userId,
            subject: layoutInput.subject,
            provider: this.emailProvider.name,
            providerMessageId: res.providerMessageId,
            failureDetail: res.error,
          })
        } catch (ledgerErr) {
          this.logger.debug(`Could not write to comms ledger: ${(ledgerErr as Error).message}`)
        }
      }

      if (res.ok) {
        this.logger.log(`Payment confirmation email (${status}) sent to ${email} (${itemOrPlan})`)
        return true
      } else {
        this.logger.warn(`Failed to send payment confirmation email (${status}) to ${email}: ${res.error}`)
        return false
      }
    } catch (err) {
      this.logger.error(`Error sending payment confirmation email: ${(err as Error).message}`, (err as Error).stack)
      return false
    }
  }

  /**
   * Backward-compatible alias for subscription confirmations.
   */
  async sendSubscriptionConfirmation(details: PaymentConfirmationDetails): Promise<boolean> {
    return this.sendPaymentConfirmation(details)
  }

  /**
   * Sends confirmation email for marketplace shop orders (success, failed, pending).
   */
  async sendOrderPaymentConfirmation(details: OrderPaymentConfirmationDetails): Promise<boolean> {
    try {
      const { email, name } = await this.resolveRecipient(
        details.buyerId,
        details.recipientEmail,
        details.recipientName,
      )

      if (!email) {
        this.logger.warn(`Cannot send order confirmation email: No email address found for buyer ${details.buyerId || 'unknown'}`)
        return false
      }

      const status = normalizeStatus(details.status)
      const appUrl = (this.config.allowedOrigin || this.config.appBaseUrl || 'http://localhost:3000').replace(/\/+$/, '')
      const dashboardUrl = details.dashboardUrl || `${appUrl}/shop/orders`
      const productTitle = details.productTitle || 'Marketplace Item'
      const amountFormatted = details.amountFormatted || (details.amountCents != null ? `$${(details.amountCents / 100).toFixed(2)}` : 'Order Total')
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      let layoutInput: LayoutInput

      if (status === 'success') {
        layoutInput = {
          subject: `Order Payment Confirmed: #${details.orderId}`,
          preheader: `Thank you for your order payment of ${amountFormatted}. Here is your order confirmation.`,
          heading: 'Order Payment Confirmed',
          body: [
            `Hello ${name},`,
            `Your payment of ${amountFormatted} for order #${details.orderId} (${productTitle}${details.quantity ? ` x${details.quantity}` : ''}) has been confirmed!`,
            'The seller has been notified to prepare your items for fulfillment.',
          ],
          contextPanel: [
            { label: 'Order ID', value: details.orderId },
            { label: 'Item', value: productTitle },
            ...(details.quantity ? [{ label: 'Quantity', value: String(details.quantity) }] : []),
            { label: 'Total Paid', value: amountFormatted },
            { label: 'Status', value: 'Paid (Confirmed)' },
            { label: 'Date', value: dateStr },
          ],
          cta: {
            label: 'View My Orders',
            url: dashboardUrl,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'order and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      } else if (status === 'pending') {
        layoutInput = {
          subject: `Order Payment Pending: #${details.orderId}`,
          preheader: `Your order #${details.orderId} has been placed and payment is pending.`,
          heading: 'Order Payment Pending',
          body: [
            `Hello ${name},`,
            `Your order #${details.orderId} for ${productTitle} (${amountFormatted}) has been received and is pending payment.`,
            'Please arrange payment with the seller or allow time for your payment method to complete.',
          ],
          contextPanel: [
            { label: 'Order ID', value: details.orderId },
            { label: 'Item', value: productTitle },
            ...(details.quantity ? [{ label: 'Quantity', value: String(details.quantity) }] : []),
            { label: 'Total', value: amountFormatted },
            { label: 'Status', value: 'Payment Pending / Reserved' },
            { label: 'Date', value: dateStr },
          ],
          cta: {
            label: 'View Order Details',
            url: dashboardUrl,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'order and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      } else {
        // failed
        layoutInput = {
          subject: `Order Payment Failed: #${details.orderId}`,
          preheader: `Your payment for order #${details.orderId} could not be processed.`,
          heading: 'Order Payment Failed',
          body: [
            `Hello ${name},`,
            `We were unable to process payment for order #${details.orderId} (${productTitle}).`,
            details.failureReason ? `Reason: ${details.failureReason}` : 'The transaction was declined by your payment provider or the checkout session timed out.',
            'You may re-order the item from the marketplace using an updated payment method.',
          ],
          contextPanel: [
            { label: 'Order ID', value: details.orderId },
            { label: 'Item', value: productTitle },
            { label: 'Total', value: amountFormatted },
            { label: 'Status', value: 'Payment Failed / Cancelled' },
            { label: 'Date', value: dateStr },
          ],
          cta: {
            label: 'Return to Marketplace',
            url: `${appUrl}/shop`,
          },
          messageClass: 'essential_transactional',
          categoryLabel: 'order and payment confirmations',
          legal: {
            entityName: this.config.legalEntityName,
            postalAddress: this.config.legalPostalAddress,
          },
          links: {
            privacyUrl: `${appUrl}/privacy`,
            communityStandardsUrl: `${appUrl}/terms`,
            helpCenterUrl: `${appUrl}/docs/marketplace-and-services`,
            communicationsHistoryUrl: `${appUrl}/settings`,
            preferencesUrl: `${appUrl}/settings`,
          },
        }
      }

      const html = renderHtml(layoutInput)
      const text = renderText(layoutInput)

      const res = await this.emailProvider.send({
        to: email,
        subject: layoutInput.subject,
        html,
        text,
        stream: 'transactional',
      })

      return res.ok
    } catch (err) {
      this.logger.error(`Error sending order payment email: ${(err as Error).message}`, (err as Error).stack)
      return false
    }
  }
}
