import { Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'
import { ConfigService } from '../config/config.service'

/**
 * Thin wrapper around the Stripe SDK. The client is only constructed when
 * config.stripeEnabled — callers must check that first (same fail-closed
 * pattern as R2Storage/LiveKit) and get a clear STRIPE_NOT_CONFIGURED error
 * rather than a null-pointer deep in checkout logic.
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name)
  private readonly client: Stripe | null

  constructor(private readonly config: ConfigService) {
    this.client = config.stripeEnabled ? new Stripe(config.stripeSecretKey!) : null
    if (!this.client) {
      this.logger.warn('Stripe credentials not configured — Shop checkout is disabled')
    }
  }

  get enabled(): boolean {
    return this.client !== null
  }

  private require(): Stripe {
    if (!this.client) {
      throw new Error('STRIPE_NOT_CONFIGURED')
    }
    return this.client
  }

  async createCheckoutSession(params: {
    productTitle: string
    productImage?: string | null
    amountCents: number
    currency: string
    quantity: number
    orderId: string
    successUrl: string
    cancelUrl: string
  }): Promise<Stripe.Checkout.Session> {
    return this.require().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            unit_amount: params.amountCents,
            product_data: {
              name: params.productTitle,
              ...(params.productImage ? { images: [params.productImage] } : {}),
            },
          },
          quantity: params.quantity,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { orderId: params.orderId },
    })
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    return this.require().webhooks.constructEvent(rawBody, signature, this.config.stripeWebhookSecret!)
  }
}
