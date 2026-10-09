import { EmailProvider } from '../comms/delivery/email-provider'
import { ConfigService } from '../config/config.service'
import { renderHtml, renderText, type LayoutInput } from '../comms/render/layout'
import { Injectable, Logger } from '@nestjs/common'

export interface PaymentConfirmationDetails {
  recipientEmail: string
  recipientName: string
  planName: string
  amountFormatted: string
  billingInterval?: string
  invoiceNumber?: string
  paymentDate?: string
  dashboardUrl?: string
}

@Injectable()
export class PaymentConfirmationEmailService {
  private readonly logger = new Logger(PaymentConfirmationEmailService.name)

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly config: ConfigService,
  ) {}

  async sendSubscriptionConfirmation(details: PaymentConfirmationDetails): Promise<boolean> {
    try {
      const appUrl = (this.config.allowedOrigin || 'http://localhost:3000').replace(/\/+$/, '')
      const dashboardUrl = details.dashboardUrl || `${appUrl}/settings?section=billing`
      const dateStr = details.paymentDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const layoutInput: LayoutInput = {
        subject: `Payment Confirmed: Your ${details.planName} is active!`,
        preheader: `Thank you for your payment of ${details.amountFormatted}. Your subscription invoice and confirmation.`,
        heading: 'Payment Confirmed & Receipt',
        body: [
          `Hello ${details.recipientName || 'Member'},`,
          `Thank you for subscribing to Zoiko Social! Your payment of ${details.amountFormatted} for the ${details.planName} has been processed successfully.`,
          'Your account has been upgraded with the associated commercial benefits and verified privileges.',
        ],
        contextPanel: [
          { label: 'Plan', value: details.planName },
          { label: 'Amount Paid', value: details.amountFormatted },
          { label: 'Billing Period', value: details.billingInterval || 'Monthly' },
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

      const html = renderHtml(layoutInput)
      const text = renderText(layoutInput)

      const res = await this.emailProvider.send({
        to: details.recipientEmail,
        subject: layoutInput.subject,
        html,
        text,
        stream: 'transactional',
      })

      if (res.ok) {
        this.logger.log(`Payment confirmation email sent to ${details.recipientEmail} (${details.planName})`)
        return true
      } else {
        this.logger.warn(`Failed to send payment confirmation email to ${details.recipientEmail}: ${res.error}`)
        return false
      }
    } catch (err) {
      this.logger.error(`Error sending payment confirmation email: ${(err as Error).message}`, (err as Error).stack)
      return false
    }
  }
}
