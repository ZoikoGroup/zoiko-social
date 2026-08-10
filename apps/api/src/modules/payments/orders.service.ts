import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { OrderStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { canTransition } from './order-status'
import { StripeService } from './stripe.service'
import { AuditLogService } from '../common/audit-log/audit-log.service'
import { NotificationQueueService } from '../queue/notification-queue.service'

export interface OrderResponse {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  quantity: number
  amountCents: number
  currency: string
  status: string
  createdAt: string
}

function mapOrder(o: {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  quantity: number
  amountCents: number
  currency: string
  status: string
  createdAt: Date
}): OrderResponse {
  return {
    id: o.id,
    productId: o.productId,
    buyerId: o.buyerId,
    sellerId: o.sellerId,
    quantity: o.quantity,
    amountCents: o.amountCents,
    currency: o.currency,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
    private readonly auditLog: AuditLogService,
    private readonly notifications: NotificationQueueService,
  ) {}

  /** Creates a pending Order + Stripe Checkout Session, returns the session URL. */
  async checkout(
    productId: string,
    buyerId: string,
    quantity: number,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; orderId: string }> {
    if (!this.stripe.enabled) {
      throw new BadRequestException({ code: 'STRIPE_NOT_CONFIGURED', message: 'Checkout is not available right now' })
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, coverUrl: true, priceCents: true, currency: true, stock: true, sellerId: true, isDeleted: true, status: true },
    })
    if (!product || product.isDeleted || product.status !== 'active') {
      throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    }
    if (product.sellerId === buyerId) {
      throw new BadRequestException({ code: 'OWN_PRODUCT', message: 'You cannot buy your own listing' })
    }
    if (product.stock < quantity) {
      throw new BadRequestException({ code: 'INSUFFICIENT_STOCK', message: 'Not enough stock available' })
    }

    const amountCents = product.priceCents * quantity

    const order = await this.prisma.order.create({
      data: {
        productId,
        buyerId,
        sellerId: product.sellerId,
        quantity,
        amountCents,
        currency: product.currency,
        status: 'pending',
      },
    })

    const session = await this.stripe.createCheckoutSession({
      productTitle: product.title,
      productImage: product.coverUrl,
      amountCents,
      currency: product.currency,
      quantity,
      orderId: order.id,
      successUrl,
      cancelUrl,
    })

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    })

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL')
    }
    return { url: session.url, orderId: order.id }
  }

  /** Idempotent — Stripe may retry webhook delivery. */
  async markPaidBySessionId(sessionId: string, paymentIntentId: string | null): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { stripeCheckoutSessionId: sessionId } })
    if (!order) {
      this.logger.warn(`No order found for Stripe session ${sessionId}`)
      return
    }
    if (order.status !== 'pending') return

    // The read above is a cheap early-out, not the guard. Two concurrent
    // deliveries of the same event can both pass it, so the pending→paid
    // transition is claimed atomically inside the transaction: whoever's
    // updateMany matches a row owns the side effects, and the loser stops
    // before double-decrementing stock and re-notifying the seller.
    const claimed = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: order.id, status: 'pending' },
        data: { status: 'paid', stripePaymentIntentId: paymentIntentId },
      })
      if (count === 0) return false

      const product = await tx.product.update({
        where: { id: order.productId },
        data: { stock: { decrement: order.quantity } },
        select: { stock: true },
      })
      if (product.stock <= 0) {
        await tx.product.update({ where: { id: order.productId }, data: { status: 'sold' } })
      }
      return true
    })
    if (!claimed) return

    await this.auditLog.record({
      actorId: order.buyerId,
      action: 'order.paid',
      entityType: 'order',
      entityId: order.id,
      newData: { amountCents: order.amountCents, currency: order.currency },
    })

    void this.notifications.enqueue({
      userId: order.sellerId,
      type: 'order_paid',
      title: 'Your item sold!',
      body: `An order for ${order.quantity} item(s) was just paid.`,
      data: { orderId: order.id, productId: order.productId },
    })
  }

  async markCancelledBySessionId(sessionId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { stripeCheckoutSessionId: sessionId } })
    if (!order) return
    // Guarded in the WHERE for the same reason as markPaidBySessionId, and so a
    // late `expired` can never overwrite an order that has since been paid.
    await this.prisma.order.updateMany({
      where: { id: order.id, status: 'pending' },
      data: { status: 'cancelled' },
    })
  }

  /**
   * Records a refund against an order (ZSOC-COM-REV-001 §17 M3, §29 FIN-03).
   *
   * The refund is stored as a new linked fact event; the order's original
   * `amountCents` is never edited, so the authorized amount and the amount
   * returned stay separately answerable (§31).
   *
   * Stock is deliberately NOT restored. Whether a refunded item returns to sale
   * is a product decision — the goods may already have shipped, and silently
   * resurrecting a sold-out listing would be the system inventing commercial
   * truth. Logged instead, for whoever owns that call.
   */
  async recordRefund(params: {
    eventId: string
    paymentIntentId: string | null
    chargeId: string
    amountRefundedCents: number
    currency: string
    fullyRefunded: boolean
    reason: string | null
    occurredAt: Date
  }): Promise<void> {
    const order = await this.findOrderByPaymentIntent(params.paymentIntentId, params.eventId)

    const stored = await this.storeEvent({
      kind: 'refund',
      orderId: order?.id ?? null,
      stripeEventId: params.eventId,
      stripeObjectId: params.chargeId,
      stripePaymentIntentId: params.paymentIntentId,
      amountCents: params.amountRefundedCents,
      currency: params.currency,
      fullyRefunded: params.fullyRefunded,
      reason: params.reason,
      outcome: null,
      occurredAt: params.occurredAt,
    })
    if (!stored || !order) return

    // A partial refund leaves the order `paid` — the money that came back is on
    // the event, and collapsing a partial to `refunded` would overstate it.
    // A full refund moves the order only if the machine allows it from here:
    // a duplicate arriving for an already-refunded order changes nothing.
    if (params.fullyRefunded && canTransition(order.status, 'refunded')) {
      await this.prisma.order.update({ where: { id: order.id }, data: { status: 'refunded' } })
    }

    this.logger.log(
      `Refund recorded for order ${order.id} (${params.amountRefundedCents} ${params.currency}, ` +
        `full=${params.fullyRefunded}); stock not restored — see recordRefund()`,
    )

    await this.auditLog.record({
      actorId: null,
      action: 'order.refunded',
      entityType: 'order',
      entityId: order.id,
      newData: {
        amountRefundedCents: params.amountRefundedCents,
        currency: params.currency,
        fullyRefunded: params.fullyRefunded,
        reason: params.reason,
        stripeEventId: params.eventId,
      },
    })

    // Both sides, in-app only. A seller told "your item sold!" and never told it
    // was reversed is the worst version of this. Email is a separate matter —
    // §24 T requires an approved sender boundary per domain and there is no
    // marketplace commercial sender yet, so `order_*` stays in the registry's
    // IN_APP_ONLY_TYPES.
    //
    // No amounts in the copy. §24 T2: rendering code must not become a hidden
    // financial calculator — it points at the order, which holds the
    // authoritative figures.
    const wording = params.fullyRefunded ? 'refunded' : 'partially refunded'
    void this.notifications.enqueue({
      userId: order.sellerId,
      type: 'order_refunded',
      title: 'A sale was refunded',
      body: `An order you sold has been ${wording}. Open your sold orders for the details.`,
      data: { orderId: order.id, productId: order.productId },
    })
    void this.notifications.enqueue({
      userId: order.buyerId,
      type: 'order_refunded',
      title: 'Your refund was processed',
      body: `One of your orders has been ${wording}. Open your order history for the details.`,
      data: { orderId: order.id, productId: order.productId },
    })
  }

  /**
   * Records a dispute opening or closing (§17, §33 — "refund after payout" and
   * dispute rate are required observability signals).
   *
   * On close, a won dispute returns the order to `paid` and a lost one to
   * `refunded`, because a lost dispute is a reversal in substance. Any other
   * close status leaves the order alone rather than guessing.
   */
  async recordDispute(params: {
    eventId: string
    paymentIntentId: string | null
    disputeId: string
    amountCents: number
    currency: string
    reason: string | null
    status: string
    closed: boolean
    occurredAt: Date
  }): Promise<void> {
    const order = await this.findOrderByPaymentIntent(params.paymentIntentId, params.eventId)

    const stored = await this.storeEvent({
      kind: params.closed ? 'dispute_closed' : 'dispute_opened',
      orderId: order?.id ?? null,
      stripeEventId: params.eventId,
      stripeObjectId: params.disputeId,
      stripePaymentIntentId: params.paymentIntentId,
      amountCents: params.amountCents,
      currency: params.currency,
      fullyRefunded: false,
      reason: params.reason,
      outcome: params.closed ? params.status : null,
      occurredAt: params.occurredAt,
    })
    if (!stored || !order) return

    // Proposed move, then checked against the state machine rather than
    // trusted. §31: webhook ordering may be non-sequential, so a late dispute
    // for an order that has since been refunded is expected traffic — it gets
    // recorded above and declined here, not applied.
    let proposed: OrderStatus | null = null
    if (!params.closed) {
      proposed = 'disputed'
    } else if (params.status === 'won') {
      proposed = 'paid'
    } else if (params.status === 'lost') {
      proposed = 'refunded'
    }

    const nextStatus = proposed && canTransition(order.status, proposed) ? proposed : null

    if (nextStatus) {
      await this.prisma.order.update({ where: { id: order.id }, data: { status: nextStatus } })
    }

    await this.auditLog.record({
      actorId: null,
      action: params.closed ? 'order.dispute_closed' : 'order.dispute_opened',
      entityType: 'order',
      entityId: order.id,
      newData: {
        amountCents: params.amountCents,
        currency: params.currency,
        disputeStatus: params.status,
        reason: params.reason,
        stripeEventId: params.eventId,
      },
    })

    // Seller only. The buyer raised the dispute with their own bank and is being
    // kept informed by it; telling them what they just did would be noise.
    // Notified only when the order state actually moved, so an ambiguous close
    // (`warning_closed`) stays silent rather than implying an outcome.
    if (!nextStatus) return

    const copy = !params.closed
      ? {
          type: 'order_disputed',
          title: 'A sale is disputed',
          body: 'A payment for one of your sold orders is being disputed. We will update this once it is resolved.',
        }
      : params.status === 'won'
        ? {
            type: 'order_dispute_resolved',
            title: 'A dispute was resolved in your favour',
            body: 'The dispute on one of your sold orders was resolved and the payment stands.',
          }
        : {
            type: 'order_dispute_resolved',
            title: 'A dispute was decided against a sale',
            body: 'The dispute on one of your sold orders was decided against it, and the payment has been returned.',
          }

    void this.notifications.enqueue({
      userId: order.sellerId,
      ...copy,
      data: { orderId: order.id, productId: order.productId },
    })
  }

  private async findOrderByPaymentIntent(paymentIntentId: string | null, eventId: string) {
    if (!paymentIntentId) {
      this.logger.warn(`Stripe event ${eventId} carries no payment intent — recording as unmatched`)
      return null
    }
    const order = await this.prisma.order.findFirst({ where: { stripePaymentIntentId: paymentIntentId } })
    if (!order) {
      // §16 L5: unmatched settlement enters a reconciliation exception state.
      // The event is still stored, with a null orderId, for someone to resolve.
      this.logger.warn(`No order matches payment intent ${paymentIntentId} (event ${eventId}) — recording as unmatched`)
    }
    return order
  }

  /**
   * Writes the fact event first, so the unique index on `stripeEventId` is what
   * makes the whole handler replay-safe: a redelivered event loses the insert
   * and returns false before any order mutation runs.
   */
  private async storeEvent(data: {
    kind: string
    orderId: string | null
    stripeEventId: string
    stripeObjectId: string | null
    stripePaymentIntentId: string | null
    amountCents: number
    currency: string
    fullyRefunded: boolean
    reason: string | null
    outcome: string | null
    occurredAt: Date
  }): Promise<boolean> {
    try {
      await this.prisma.orderPaymentEvent.create({ data })
      return true
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        this.logger.debug(`Stripe event ${data.stripeEventId} already processed`)
        return false
      }
      throw err
    }
  }

  async listForBuyer(buyerId: string): Promise<OrderResponse[]> {
    const rows = await this.prisma.order.findMany({ where: { buyerId }, orderBy: { createdAt: 'desc' } })
    return rows.map(mapOrder)
  }

  async listForSeller(sellerId: string): Promise<OrderResponse[]> {
    const rows = await this.prisma.order.findMany({ where: { sellerId }, orderBy: { createdAt: 'desc' } })
    return rows.map(mapOrder)
  }
}
