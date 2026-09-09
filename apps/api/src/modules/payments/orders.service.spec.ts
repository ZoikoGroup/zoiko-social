import { Prisma } from '@prisma/client'
import { IN_APP_ONLY_TYPES } from '../comms/comms.registry'
import { OrdersService } from './orders.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { StripeService } from './stripe.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'
import type { NotificationQueueService } from '../queue/notification-queue.service'

/**
 * Webhook replay and reversal handling — ZSOC-COM-REV-001 §17 (refunds,
 * disputes, chargebacks), §23 S1 (idempotency wherever a retry could duplicate
 * money or a receipt) and §16 L5 (unmatched settlement becomes a reconciliation
 * exception rather than being guessed at or dropped).
 *
 * These are the cases that only show up in production: Stripe redelivering an
 * event, two deliveries landing at once, and a refund issued from the dashboard
 * for a charge the product never saw.
 */

const PAID_ORDER = {
  id: 'ord-1',
  productId: 'prod-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  quantity: 2,
  amountCents: 5000,
  currency: 'USD',
  status: 'paid',
  stripeCheckoutSessionId: 'cs_1',
  stripePaymentIntentId: 'pi_1',
}

function build(overrides: {
  order?: Record<string, unknown> | null
  claimCount?: number
  eventInsertFails?: boolean
} = {}) {
  const order = overrides.order === undefined ? PAID_ORDER : overrides.order
  const claimCount = overrides.claimCount ?? 1

  const tx = {
    order: { updateMany: jest.fn().mockResolvedValue({ count: claimCount }) },
    product: { update: jest.fn().mockResolvedValue({ stock: 5 }) },
  }

  const orderPaymentEventCreate = overrides.eventInsertFails
    ? jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '6.6.0' }),
      )
    : jest.fn().mockResolvedValue({})

  const prisma = {
    order: {
      findUnique: jest.fn().mockResolvedValue(order),
      findFirst: jest.fn().mockResolvedValue(order),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: claimCount }),
    },
    orderPaymentEvent: { create: orderPaymentEventCreate },
    $transaction: jest.fn(async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx)),
  }

  const notifications = { enqueue: jest.fn().mockResolvedValue(undefined) }
  const auditLog = { record: jest.fn().mockResolvedValue(undefined) }

  const service = new OrdersService(
    prisma as unknown as PrismaService,
    { enabled: true } as unknown as StripeService,
    auditLog as unknown as AuditLogService,
    notifications as unknown as NotificationQueueService,
  )

  return { service, prisma, tx, notifications, auditLog }
}

const refund = (over: Partial<Parameters<OrdersService['recordRefund']>[0]> = {}) => ({
  eventId: 'evt_1',
  paymentIntentId: 'pi_1',
  chargeId: 'ch_1',
  amountRefundedCents: 5000,
  currency: 'USD',
  fullyRefunded: true,
  reason: 'requested_by_customer',
  occurredAt: new Date('2026-08-08T00:00:00Z'),
  ...over,
})

const dispute = (over: Partial<Parameters<OrdersService['recordDispute']>[0]> = {}) => ({
  eventId: 'evt_2',
  paymentIntentId: 'pi_1',
  disputeId: 'dp_1',
  amountCents: 5000,
  currency: 'USD',
  reason: 'fraudulent',
  status: 'needs_response',
  closed: false,
  occurredAt: new Date('2026-08-08T00:00:00Z'),
  ...over,
})

describe('the comms registry knows these types', () => {
  // An unregistered type still delivers in-app, but logs as unmapped on every
  // send. Listing them says out loud that in-app-only is the intended outcome
  // until a marketplace commercial sender is approved (§24 T).
  it.each(['order_paid', 'order_refunded', 'order_disputed', 'order_dispute_resolved'])(
    '%s is declared in-app only',
    (type) => {
      expect(IN_APP_ONLY_TYPES.has(type)).toBe(true)
    },
  )
})

describe('markPaidBySessionId — concurrent delivery (§23 S1)', () => {
  it('applies stock and notification exactly once when it wins the claim', async () => {
    const { service, tx, notifications } = build({ order: { ...PAID_ORDER, status: 'pending' } })
    await service.markPaidBySessionId('cs_1', 'pi_1')

    expect(tx.order.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'ord-1', status: 'pending' } }),
    )
    expect(tx.product.update).toHaveBeenCalledTimes(1)
    expect(notifications.enqueue).toHaveBeenCalledTimes(1)
  })

  it('does nothing when a concurrent delivery already claimed the order', async () => {
    // Both deliveries pass the early-out read; only one matches the guarded
    // UPDATE. The loser must not decrement stock or re-notify the seller.
    const { service, tx, notifications } = build({ order: { ...PAID_ORDER, status: 'pending' }, claimCount: 0 })
    await service.markPaidBySessionId('cs_1', 'pi_1')

    expect(tx.product.update).not.toHaveBeenCalled()
    expect(notifications.enqueue).not.toHaveBeenCalled()
  })

  it('ignores a session that matches no order', async () => {
    const { service, prisma } = build({ order: null })
    await service.markPaidBySessionId('cs_missing', 'pi_1')
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })
})

describe('markCancelledBySessionId', () => {
  it('guards the transition so a late expiry cannot un-pay an order', async () => {
    const { service, prisma } = build()
    await service.markCancelledBySessionId('cs_1')
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'ord-1', status: 'pending' },
      data: { status: 'cancelled' },
    })
  })
})

describe('recordRefund (§17 M3, §29 FIN-03)', () => {
  it('stores the reversal and moves a fully refunded order to refunded', async () => {
    const { service, prisma, auditLog } = build()
    await service.recordRefund(refund())

    expect(prisma.orderPaymentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ kind: 'refund', orderId: 'ord-1' }) }),
    )
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: 'ord-1' }, data: { status: 'refunded' } })
    expect(auditLog.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'order.refunded' }))
  })

  it('never edits the original charge amount', async () => {
    const { service, prisma } = build()
    await service.recordRefund(refund())

    const mutated = prisma.order.update.mock.calls.flatMap((c) => Object.keys((c[0] as { data: object }).data))
    expect(mutated).not.toContain('amountCents')
  })

  it('leaves a partial refund as paid', async () => {
    // Collapsing a partial refund to `refunded` would overstate what came back.
    const { service, prisma } = build()
    await service.recordRefund(refund({ amountRefundedCents: 1000, fullyRefunded: false }))

    expect(prisma.orderPaymentEvent.create).toHaveBeenCalled()
    expect(prisma.order.update).not.toHaveBeenCalled()
  })

  it('is replay-safe — a redelivered event mutates nothing', async () => {
    const { service, prisma, auditLog, notifications } = build({ eventInsertFails: true })
    await service.recordRefund(refund())

    expect(prisma.order.update).not.toHaveBeenCalled()
    expect(auditLog.record).not.toHaveBeenCalled()
    expect(notifications.enqueue).not.toHaveBeenCalled()
  })

  it('tells both the seller and the buyer', async () => {
    const { service, notifications } = build()
    await service.recordRefund(refund())

    const recipients = notifications.enqueue.mock.calls.map((c) => (c[0] as { userId: string }).userId)
    expect(recipients).toEqual(expect.arrayContaining(['seller-1', 'buyer-1']))
  })

  it('says "partially refunded" when that is what happened', async () => {
    const { service, notifications } = build()
    await service.recordRefund(refund({ amountRefundedCents: 1000, fullyRefunded: false }))

    const bodies = notifications.enqueue.mock.calls.map((c) => (c[0] as { body: string }).body)
    expect(bodies.every((b) => b.includes('partially refunded'))).toBe(true)
  })

  it('puts no money amount in the copy (§24 T2)', async () => {
    // Rendering code must not become a hidden financial calculator — the
    // notification points at the order, which holds the authoritative figures.
    const { service, notifications } = build()
    await service.recordRefund(refund())

    const copy = notifications.enqueue.mock.calls
      .map((c) => `${(c[0] as { title: string }).title} ${(c[0] as { body: string }).body}`)
      .join(' ')
    expect(copy).not.toMatch(/\d/)
    expect(copy).not.toMatch(/USD|\$/)
  })

  it('notifies nobody for an unmatched refund', async () => {
    const { service, notifications } = build({ order: null })
    await service.recordRefund(refund({ paymentIntentId: 'pi_unknown' }))
    expect(notifications.enqueue).not.toHaveBeenCalled()
  })

  it('records an unmatched refund rather than dropping it (§16 L5)', async () => {
    const { service, prisma } = build({ order: null })
    await service.recordRefund(refund({ paymentIntentId: 'pi_unknown' }))

    expect(prisma.orderPaymentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ orderId: null, stripePaymentIntentId: 'pi_unknown' }),
      }),
    )
    expect(prisma.order.update).not.toHaveBeenCalled()
  })

  it('records an event with no payment intent as unmatched', async () => {
    const { service, prisma } = build()
    await service.recordRefund(refund({ paymentIntentId: null }))

    expect(prisma.order.findFirst).not.toHaveBeenCalled()
    expect(prisma.orderPaymentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ orderId: null }) }),
    )
  })
})

describe('recordDispute (§17)', () => {
  it('moves a paid order to disputed when one opens', async () => {
    const { service, prisma } = build()
    await service.recordDispute(dispute())

    expect(prisma.orderPaymentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ kind: 'dispute_opened' }) }),
    )
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: 'ord-1' }, data: { status: 'disputed' } })
  })

  it('returns a won dispute to paid', async () => {
    const { service, prisma } = build({ order: { ...PAID_ORDER, status: 'disputed' } })
    await service.recordDispute(dispute({ eventId: 'evt_3', closed: true, status: 'won' }))
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: 'ord-1' }, data: { status: 'paid' } })
  })

  it('treats a lost dispute as a reversal', async () => {
    const { service, prisma } = build({ order: { ...PAID_ORDER, status: 'disputed' } })
    await service.recordDispute(dispute({ eventId: 'evt_4', closed: true, status: 'lost' }))
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: 'ord-1' }, data: { status: 'refunded' } })
  })

  it('leaves the order alone on an ambiguous close, and says nothing', async () => {
    // warning_closed is not an outcome — guessing either way would invent
    // commercial truth, and a notification would imply one.
    const { service, prisma, notifications } = build({ order: { ...PAID_ORDER, status: 'disputed' } })
    await service.recordDispute(dispute({ eventId: 'evt_5', closed: true, status: 'warning_closed' }))

    expect(prisma.orderPaymentEvent.create).toHaveBeenCalled()
    expect(prisma.order.update).not.toHaveBeenCalled()
    expect(notifications.enqueue).not.toHaveBeenCalled()
  })

  it('tells the seller only — the buyer raised it with their own bank', async () => {
    const { service, notifications } = build()
    await service.recordDispute(dispute())

    expect(notifications.enqueue).toHaveBeenCalledTimes(1)
    expect(notifications.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'seller-1', type: 'order_disputed' }),
    )
  })

  it('reports the outcome when a dispute closes', async () => {
    const won = build({ order: { ...PAID_ORDER, status: 'disputed' } })
    await won.service.recordDispute(dispute({ eventId: 'evt_7', closed: true, status: 'won' }))
    expect(won.notifications.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'order_dispute_resolved', title: expect.stringContaining('in your favour') }),
    )

    const lost = build({ order: { ...PAID_ORDER, status: 'disputed' } })
    await lost.service.recordDispute(dispute({ eventId: 'evt_8', closed: true, status: 'lost' }))
    expect(lost.notifications.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'order_dispute_resolved', title: expect.stringContaining('against a sale') }),
    )
  })

  it('does not re-open a dispute on a refunded order', async () => {
    const { service, prisma } = build({ order: { ...PAID_ORDER, status: 'refunded' } })
    await service.recordDispute(dispute({ eventId: 'evt_6' }))
    expect(prisma.order.update).not.toHaveBeenCalled()
  })
})
