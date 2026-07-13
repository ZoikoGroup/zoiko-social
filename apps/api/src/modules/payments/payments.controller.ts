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
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent?.id ?? null)
        await this.orders.markPaidBySessionId(session.id, paymentIntentId)
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await this.orders.markCancelledBySessionId(session.id)
        break
      }
      default:
        break
    }

    return { received: true }
  }
}
