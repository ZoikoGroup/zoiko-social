import { CommsLedgerService } from './comms-ledger.service'
import { CommsSuppressionService } from './comms-suppression.service'
import type { PrismaService } from '../prisma/prisma.service'

/**
 * Ledger and suppression rules from ZS-COMMS-EMAIL-001 §07/§08.
 *
 * The suppression rules are the ones that protect the sending domain: a
 * complaint that can be cleared by an operator, or a soft bounce mistaken for a
 * hard one, is how a sender ends up filtered everywhere.
 */

function ledger() {
  const prisma = {
    emailDelivery: {
      upsert: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  }
  return { service: new CommsLedgerService(prisma as unknown as PrismaService), prisma }
}

function suppression(existing: { permanent: boolean; reason: string } | null = null) {
  const prisma = {
    emailSuppression: {
      findUnique: jest.fn().mockResolvedValue(existing),
      upsert: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
  }
  return { service: new CommsSuppressionService(prisma as unknown as PrismaService), prisma }
}

describe('idempotency (§07)', () => {
  it('is deterministic for identical inputs', () => {
    const { service } = ledger()
    const a = service.idempotencyKey({ eventName: 'auth.password_reset', recipient: 'u1' })
    const b = service.idempotencyKey({ eventName: 'auth.password_reset', recipient: 'u1' })
    expect(a).toBe(b)
  })

  it('lets a genuine repeat through on a new qualifier', () => {
    // §07: "A second password-reset request has a new business qualifier; a
    // repeated webhook for the same payment does not."
    const { service } = ledger()
    const first = service.idempotencyKey({ eventName: 'auth.password_reset', recipient: 'u1', qualifier: 'req-1' })
    const second = service.idempotencyKey({ eventName: 'auth.password_reset', recipient: 'u1', qualifier: 'req-2' })
    expect(first).not.toBe(second)
  })

  it('separates recipients and source objects', () => {
    const { service } = ledger()
    const base = { eventName: 'new_comment', recipient: 'u1', sourceObjectId: 'p1' }
    expect(service.idempotencyKey(base)).not.toBe(service.idempotencyKey({ ...base, recipient: 'u2' }))
    expect(service.idempotencyKey(base)).not.toBe(service.idempotencyKey({ ...base, sourceObjectId: 'p2' }))
  })
})

describe('address hashing (§07)', () => {
  it('never stores the address itself, and normalises case and spacing', () => {
    const { service } = ledger()
    const h = service.hashAddress('  Person@Example.COM ')
    expect(h).not.toContain('@')
    expect(h).toBe(service.hashAddress('person@example.com'))
    expect(h).toHaveLength(64)
  })
})

describe('ledger writes (§03)', () => {
  it('records a suppression as an entry, not a missing row', async () => {
    // "The absence of an email is a designed and auditable outcome."
    const { service, prisma } = ledger()

    await service.record({
      idempotencyKey: 'k', eventName: 'new_like', templateId: 'ZS-EM-SOC-004',
      messageClass: 'configurable_activity', stream: 'notification',
      recipientHash: 'h', state: 'suppressed', suppressionReason: 'preference_off',
    })

    expect(prisma.emailDelivery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ state: 'suppressed', suppressionReason: 'preference_off' }),
      }),
    )
  })

  it('never lets a ledger failure break the send it is recording', async () => {
    const { service, prisma } = ledger()
    prisma.emailDelivery.upsert.mockRejectedValue(new Error('db down'))

    await expect(
      service.record({
        idempotencyKey: 'k', eventName: 'x', templateId: 't', messageClass: 'c',
        stream: 'notification', recipientHash: 'h', state: 'rendered',
      }),
    ).resolves.toBeUndefined()
  })

  it('upserts on the idempotency key so a retry advances one row', async () => {
    const { service, prisma } = ledger()
    await service.record({
      idempotencyKey: 'same', eventName: 'x', templateId: 't', messageClass: 'c',
      stream: 'notification', recipientHash: 'h', state: 'rendered',
    })
    expect(prisma.emailDelivery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { idempotencyKey: 'same' } }),
    )
  })
})

describe('suppression (§08)', () => {
  it('refuses to lift a complaint', async () => {
    // §08: "preserve complaints and hard bounces". An operator clearing one is
    // how a sender gets itself blocked again.
    const { service } = suppression({ permanent: true, reason: 'complaint' })

    const result = await service.lift('someone@example.com')

    expect(result.lifted).toBe(false)
    expect(result.reason).toContain('permanent')
  })

  it('refuses to lift a hard bounce', async () => {
    const { service } = suppression({ permanent: true, reason: 'hard_bounce' })
    await expect(service.lift('x@example.com')).resolves.toMatchObject({ lifted: false })
  })

  it('does lift a plain unsubscribe, which is the member re-subscribing', async () => {
    const { service, prisma } = suppression({ permanent: false, reason: 'unsubscribed' })

    await expect(service.lift('x@example.com')).resolves.toMatchObject({ lifted: true })
    expect(prisma.emailSuppression.delete).toHaveBeenCalled()
  })

  it('marks complaints and hard bounces permanent on write', async () => {
    for (const reason of ['complaint', 'hard_bounce'] as const) {
      const { service, prisma } = suppression()
      await service.suppress('x@example.com', reason, 'resend')
      expect(prisma.emailSuppression.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ create: expect.objectContaining({ permanent: true }) }),
      )
    }
  })

  it('does not downgrade a complaint to an unsubscribe', async () => {
    // The stronger signal is the one a mailbox provider judges you on.
    const { service, prisma } = suppression({ permanent: true, reason: 'complaint' })

    await service.suppress('x@example.com', 'unsubscribed')

    expect(prisma.emailSuppression.upsert).not.toHaveBeenCalled()
  })

  it('normalises the address so case cannot bypass the list', async () => {
    const { service, prisma } = suppression()
    await service.isSuppressed('  Person@Example.COM ')
    expect(prisma.emailSuppression.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { address: 'person@example.com' } }),
    )
  })
})
