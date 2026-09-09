import { createHmac } from 'node:crypto'
import { ProviderWebhookController } from './provider-webhook.controller'
import type { ConfigService } from '../../config/config.service'
import type { PrismaService } from '../../prisma/prisma.service'
import type { CommsLedgerService } from '../comms-ledger.service'
import type { CommsSuppressionService } from '../comms-suppression.service'

/**
 * Signature verification for provider webhooks — ZS-COMMS-EMAIL-001 §07.
 *
 * Worth testing properly rather than trusting by inspection, because both
 * failure directions are damaging and silent. Verification that is too loose
 * accepts a forged bounce, which permanently suppresses a real address and
 * quietly stops someone receiving password resets. Verification that is too
 * strict rejects real feedback, so the suppression list never grows and the
 * sending domain is burned by repeated mail to dead addresses.
 *
 * The signature is built here the way Svix builds it — sign `id.timestamp.body`
 * with the base64-decoded secret — so this checks the implementation against
 * the scheme, not against itself.
 */

const SECRET = 'whsec_dGVzdHNlY3JldGZvcnVuaXR0ZXN0aW5nb25seQ=='

function sign(id: string, timestamp: string, body: string, secret = SECRET): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  return `v1,${createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64')}`
}

function build(opts: { alreadySeen?: boolean } = {}) {
  const prisma = {
    emailProviderEvent: {
      create: opts.alreadySeen
        ? jest.fn().mockRejectedValue(new Error('unique violation'))
        : jest.fn().mockResolvedValue({}),
    },
  }
  const ledger = { applyProviderState: jest.fn().mockResolvedValue(1) }
  const suppression = { suppress: jest.fn().mockResolvedValue(undefined) }
  const controller = new ProviderWebhookController(
    {} as ConfigService,
    prisma as unknown as PrismaService,
    ledger as unknown as CommsLedgerService,
    suppression as unknown as CommsSuppressionService,
  )
  return { controller, prisma, ledger, suppression }
}

function call(
  controller: ProviderWebhookController,
  body: Record<string, unknown>,
  opts: { sign?: boolean; secret?: string; timestamp?: string; id?: string } = {},
) {
  const raw = Buffer.from(JSON.stringify(body))
  const id = opts.id ?? 'msg_1'
  const ts = opts.timestamp ?? String(Math.floor(Date.now() / 1000))
  const signature =
    opts.sign === false ? 'v1,not-a-real-signature' : sign(id, ts, raw.toString('utf8'), opts.secret)
  return controller.resend({ rawBody: raw } as never, body as never, id, ts, signature)
}

describe('provider webhook signature (§07)', () => {
  const OLD = process.env.RESEND_WEBHOOK_SECRET
  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET
    jest.clearAllMocks()
  })
  afterAll(() => {
    if (OLD === undefined) delete process.env.RESEND_WEBHOOK_SECRET
    else process.env.RESEND_WEBHOOK_SECRET = OLD
  })

  it('accepts a correctly signed event and advances the ledger', async () => {
    const { controller, ledger } = build()

    await call(controller, { type: 'email.delivered', data: { email_id: 'em_1' } })

    expect(ledger.applyProviderState).toHaveBeenCalledWith('em_1', 'delivered', undefined)
  })

  it('rejects a bad signature without touching the ledger', async () => {
    const { controller, ledger, suppression } = build()

    const res = await call(
      controller,
      { type: 'email.bounced', data: { email_id: 'em_1', to: ['victim@example.com'] } },
      { sign: false },
    )

    // 200 on purpose: a rejected payload must not tell a prober it guessed
    // wrong, and a provider retrying a bad signature helps nobody.
    expect(res).toEqual({ received: true })
    expect(ledger.applyProviderState).not.toHaveBeenCalled()
    expect(suppression.suppress).not.toHaveBeenCalled()
  })

  it('rejects a signature made with a different secret', async () => {
    const { controller, suppression } = build()

    await call(
      controller,
      { type: 'email.complained', data: { email_id: 'em_1', to: ['victim@example.com'] } },
      { secret: 'whsec_b3RoZXJzZWNyZXRvdGhlcnNlY3JldG90aGVy' },
    )

    expect(suppression.suppress).not.toHaveBeenCalled()
  })

  it('rejects a replayed payload older than the window', async () => {
    const { controller, ledger } = build()
    const stale = String(Math.floor(Date.now() / 1000) - 3600)

    await call(controller, { type: 'email.delivered', data: { email_id: 'em_1' } }, { timestamp: stale })

    expect(ledger.applyProviderState).not.toHaveBeenCalled()
  })
})

describe('provider webhook handling', () => {
  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET
    jest.clearAllMocks()
  })

  it('permanently suppresses on a hard bounce', async () => {
    const { controller, suppression } = build()

    await call(controller, {
      type: 'email.bounced',
      data: { email_id: 'em_1', to: ['dead@example.com'], bounce: { type: 'Permanent', message: 'no mailbox' } },
    })

    expect(suppression.suppress).toHaveBeenCalledWith('dead@example.com', 'hard_bounce', 'resend', 'no mailbox')
  })

  it('does NOT suppress on a transient bounce', async () => {
    // A full mailbox recovers. Suppressing on it loses a real recipient
    // permanently, which is the more expensive mistake.
    const { controller, suppression } = build()

    await call(controller, {
      type: 'email.bounced',
      data: { email_id: 'em_1', to: ['busy@example.com'], bounce: { type: 'Transient', message: 'mailbox full' } },
    })

    expect(suppression.suppress).not.toHaveBeenCalled()
  })

  it('permanently suppresses on a complaint', async () => {
    const { controller, suppression } = build()

    await call(controller, {
      type: 'email.complained',
      data: { email_id: 'em_1', to: ['annoyed@example.com'] },
    })

    expect(suppression.suppress).toHaveBeenCalledWith('annoyed@example.com', 'complaint', 'resend')
  })

  it('does not suppress on a delivery delay', async () => {
    const { controller, suppression } = build()

    await call(controller, { type: 'email.delivery_delayed', data: { email_id: 'em_1', to: ['x@example.com'] } })

    expect(suppression.suppress).not.toHaveBeenCalled()
  })

  it('ignores a duplicate delivery of the same provider event', async () => {
    // Providers retry. A complaint processed twice would double-suppress and
    // corrupt the audit trail.
    const { controller, ledger, suppression } = build({ alreadySeen: true })

    await call(controller, {
      type: 'email.complained',
      data: { email_id: 'em_1', to: ['annoyed@example.com'] },
    })

    expect(ledger.applyProviderState).not.toHaveBeenCalled()
    expect(suppression.suppress).not.toHaveBeenCalled()
  })

  it('shrugs off a payload with no email id', async () => {
    const { controller, ledger } = build()

    await expect(call(controller, { type: 'email.delivered', data: {} })).resolves.toEqual({ received: true })
    expect(ledger.applyProviderState).not.toHaveBeenCalled()
  })
})
