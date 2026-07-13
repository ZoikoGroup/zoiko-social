import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
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

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'paid', stripePaymentIntentId: paymentIntentId },
      })
      const product = await tx.product.update({
        where: { id: order.productId },
        data: { stock: { decrement: order.quantity } },
        select: { stock: true },
      })
      if (product.stock <= 0) {
        await tx.product.update({ where: { id: order.productId }, data: { status: 'sold' } })
      }
    })

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
    if (!order || order.status !== 'pending') return
    await this.prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled' } })
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
