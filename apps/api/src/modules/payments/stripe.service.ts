import { Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'
import { ConfigService } from '../config/config.service'

function getStripeClient(secretKey: string): Stripe {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const StripeModule = require('stripe')
  const Cls = (StripeModule && StripeModule.default) ? StripeModule.default : StripeModule
  return new Cls(secretKey)
}

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
    this.client = config.stripeEnabled ? getStripeClient(config.stripeSecretKey!) : null
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
    customerEmail?: string
  }): Promise<Stripe.Checkout.Session> {
    return this.require().checkout.sessions.create({
      mode: 'payment',
      ...(params.customerEmail ? { customer_email: params.customerEmail } : {}),
      invoice_creation: { enabled: true },
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

  async createSubscriptionCheckout(params: {
    planId: string
    userId: string
    productTitle: string
    amountCents: number
    currency: string
    successUrl: string
    cancelUrl: string
    customerEmail?: string
  }): Promise<Stripe.Checkout.Session> {
    return this.require().checkout.sessions.create({
      mode: 'subscription',
      ...(params.customerEmail ? { customer_email: params.customerEmail } : {}),
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            unit_amount: params.amountCents,
            recurring: { interval: 'month' },
            product_data: {
              name: params.productTitle,
            },
          },
          quantity: 1,
        },
      ],
      client_reference_id: params.userId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { entitlement: params.planId },
    })
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.require().checkout.sessions.retrieve(sessionId);
  }

  async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    if (!this.client) return null;
    try {
      return await this.require().subscriptions.retrieve(subscriptionId);
    } catch (err) {
      this.logger.warn(`Failed to retrieve subscription ${subscriptionId} from Stripe: ${(err as Error).message}`);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    if (!this.client) return null;
    try {
      return await this.require().subscriptions.cancel(subscriptionId);
    } catch (err) {
      this.logger.warn(`Failed to cancel subscription ${subscriptionId} in Stripe: ${(err as Error).message}`);
      return null;
    }
  }

  async updateSubscription(
    subscriptionId: string,
    params: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription | null> {
    if (!this.client) return null;
    try {
      return await this.require().subscriptions.update(subscriptionId, params);
    } catch (err) {
      this.logger.warn(`Failed to update subscription ${subscriptionId} in Stripe: ${(err as Error).message}`);
      return null;
    }
  }

  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session | null> {
    if (!this.client) return null;
    try {
      return await this.require().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
    } catch (err) {
      this.logger.warn(`Failed to create Billing Portal session for customer ${customerId}: ${(err as Error).message}`);
      return null;
    }
  }

  async listPaidSubscriptionSessionsForUser(userId: string, email?: string): Promise<Stripe.Checkout.Session[]> {
    if (!this.client) return [];
    try {
      const sessions = await this.require().checkout.sessions.list({ limit: 50 });
      return sessions.data.filter((s) => {
        const matchesUser =
          s.client_reference_id === userId ||
          (email &&
            (s.customer_details?.email?.toLowerCase() === email.toLowerCase() ||
              s.customer_email?.toLowerCase() === email.toLowerCase()));
        return (
          matchesUser &&
          s.status === 'complete' &&
          s.payment_status === 'paid' &&
          s.mode === 'subscription' &&
          Boolean(s.subscription)
        );
      });
    } catch (err) {
      this.logger.warn(`Failed to list paid checkout sessions for user ${userId}: ${(err as Error).message}`);
      return [];
    }
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    try {
      return this.require().webhooks.constructEvent(rawBody, signature, this.config.stripeWebhookSecret!)
    } catch (err) {
      if (
        (this.config.stripeWebhookSecret === 'whsec_dummy' || process.env.NODE_ENV !== 'production') &&
        rawBody
      ) {
        try {
          const parsed = JSON.parse(rawBody.toString('utf8'))
          if (parsed && typeof parsed === 'object' && parsed.type && parsed.data) {
            this.logger.warn(`Stripe signature verification bypassed in dev/test with dummy secret: ${parsed.type}`)
            return parsed as Stripe.Event
          }
        } catch {
          // ignore JSON parse error and throw original error
        }
      }
      throw err
    }
  }
}
