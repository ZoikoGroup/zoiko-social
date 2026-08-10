import { BadRequestException, Controller, Get, Post, Param, Body, Req, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'
import Stripe from 'stripe'
import { OrdersService } from './orders.service'
import { StripeService } from './stripe.service'
import { ConfigService } from '../config/config.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const CheckoutSchema = z.object({ quantity: z.number().int().positive().max(20).default(1) })

/** Request augmented with the raw request body — see main.ts's content-type parser override. */
type RequestWithRawBody = FastifyRequest & { rawBody?: Buffer }

/** Stripe returns related objects as either a bare ID or an expanded object. */
function stripeId(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null
  return typeof ref === 'string' ? ref : ref.id
}

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private readonly orders: OrdersService,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) {}

  @Post('shop/:id/checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: unknown) {
    const input = CheckoutSchema.parse(body ?? {})
    const webOrigin = this.config.allowedOrigin
    const result = await this.orders.checkout(
      id,
      user.id,
      input.quantity,
      `${webOrigin}/shop/checkout/success?orderId={CHECKOUT_SESSION_ID}`,
      `${webOrigin}/shop/checkout/cancel`,
    )
    return { data: result }
  }

  @Get('orders/mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.orders.listForBuyer(user.id) }
  }

  @Get('orders/selling')
  @UseGuards(JwtAuthGuard)
  async selling(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.orders.listForSeller(user.id) }
  }

  @Post('payments/stripe/webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: RequestWithRawBody) {
    const signature = req.headers['stripe-signature']
    if (!signature || typeof signature !== 'string' || !req.rawBody) {
      throw new BadRequestException({ code: 'INVALID_WEBHOOK_REQUEST', message: 'Missing signature or body' })
    }

    let event: Stripe.Event
    try {
      event = this.stripe.constructWebhookEvent(req.rawBody, signature)
    } catch (err) {
      this.logger.warn(`Stripe webhook signature verification failed: ${(err as Error).message}`)
      throw new BadRequestException({ code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await this.orders.markPaidBySessionId(session.id, stripeId(session.payment_intent))
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await this.orders.markCancelledBySessionId(session.id)
        break
      }
      // Reversals arrive keyed by payment intent, not checkout session, and can
      // originate outside the product entirely (a refund issued from the Stripe
      // dashboard). Without these, an order stays `paid` forever after the money
      // has gone back — ZSOC-COM-REV-001 §17, §29 FIN-03.
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await this.orders.recordRefund({
          eventId: event.id,
          paymentIntentId: stripeId(charge.payment_intent),
          chargeId: charge.id,
          amountRefundedCents: charge.amount_refunded,
          currency: charge.currency.toUpperCase(),
          fullyRefunded: charge.refunded,
          reason: charge.refunds?.data[0]?.reason ?? null,
          occurredAt: new Date(event.created * 1000),
        })
        break
      }
      case 'charge.dispute.created':
      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute
        await this.orders.recordDispute({
          eventId: event.id,
          paymentIntentId: stripeId(dispute.payment_intent),
          disputeId: dispute.id,
          amountCents: dispute.amount,
          currency: dispute.currency.toUpperCase(),
          reason: dispute.reason ?? null,
          status: dispute.status,
          closed: event.type === 'charge.dispute.closed',
          occurredAt: new Date(event.created * 1000),
        })
        break
      }
      default:
        break
    }

    return { received: true }
  }
}
