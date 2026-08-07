import { CommsDecisionService, PREFERENCE_COLUMN } from './comms-decision.service'
import { EVENT_REGISTRY } from './comms.registry'
import type { PrismaService } from '../prisma/prisma.service'

/**
 * In-product notification gating — §14 preferences applied to the bell.
 *
 * Tested carefully because this gate *destroys* notifications: a refusal here
 * means no row, so there is no inbox to recover it from and no ledger recording
 * the absence. The exemptions are therefore the important cases, not the happy
 * path — an over-eager gate silently swallows a moderation notice or a follow
 * request and the member never learns it existed.
 */

function build(settings: Record<string, boolean> | null, opts: { throws?: boolean } = {}) {
  const findUnique = opts.throws
    ? jest.fn().mockRejectedValue(new Error('db down'))
    : jest.fn().mockResolvedValue(settings)
  const prisma = { userSettings: { findUnique } }
  return {
    service: new CommsDecisionService(prisma as unknown as PrismaService),
    findUnique,
  }
}

const ALL_OFF = {
  notifLikes: false,
  notifComments: false,
  notifFollows: false,
  notifMentions: false,
  notifEvents: false,
  notifCommunities: false,
  notifNews: false,
  notifPromotions: false,
  emailDigest: false,
  emailMarketing: false,
  pushEnabled: false,
}

describe('in-app gating honours the toggle', () => {
  it('withholds a like when reactions are off', async () => {
    const { service } = build(ALL_OFF)
    await expect(service.decideInApp('u1', 'new_like')).resolves.toMatchObject({ deliver: false })
  })

  it('delivers a like when reactions are on', async () => {
    const { service } = build({ ...ALL_OFF, notifLikes: true })
    await expect(service.decideInApp('u1', 'new_like')).resolves.toEqual({ deliver: true })
  })

  it('reports which preference withheld it', async () => {
    const { service } = build(ALL_OFF)
    const decision = await service.decideInApp('u1', 'new_comment')
    expect(decision).toMatchObject({ deliver: false, reason: expect.stringContaining('comments') })
  })

  it('maps each category to its own toggle, not one shared flag', async () => {
    // Only comments on. Everything else must stay off, which catches a
    // mis-wired column far better than a single-type assertion.
    const { service } = build({ ...ALL_OFF, notifComments: true })

    await expect(service.decideInApp('u1', 'new_comment')).resolves.toEqual({ deliver: true })
    await expect(service.decideInApp('u1', 'new_like')).resolves.toMatchObject({ deliver: false })
    await expect(service.decideInApp('u1', 'mention')).resolves.toMatchObject({ deliver: false })
    await expect(service.decideInApp('u1', 'event_invite')).resolves.toMatchObject({ deliver: false })
  })
})

describe('in-app gating exemptions', () => {
  it('never withholds essential security, whatever the member muted', async () => {
    const { service } = build(ALL_OFF)
    for (const type of ['auth.password_reset', 'verification_approved', 'community_muted']) {
      await expect(service.decideInApp('u1', type)).resolves.toEqual({ deliver: true })
    }
  })

  it('never withholds essential account or transactional notices', async () => {
    const { service } = build(ALL_OFF)
    for (const type of ['community_role_changed', 'event_cancelled', 'adoption_enquiry']) {
      await expect(service.decideInApp('u1', type)).resolves.toEqual({ deliver: true })
    }
  })

  it('delivers types the registry marks in-app only', async () => {
    // These have no email template by design, which must not be mistaken for
    // "no preference, so drop it".
    const { service } = build(ALL_OFF)
    for (const type of ['post_shared', 'order_paid', 'vaccination']) {
      await expect(service.decideInApp('u1', type)).resolves.toEqual({ deliver: true })
    }
  })

  it('delivers a type nobody has registered at all', async () => {
    const { service } = build(ALL_OFF)
    await expect(service.decideInApp('u1', 'something_new_next_week')).resolves.toEqual({ deliver: true })
  })

  it('does not query settings when the type cannot be gated', async () => {
    const { service, findUnique } = build(ALL_OFF)
    await service.decideInApp('u1', 'auth.password_reset')
    expect(findUnique).not.toHaveBeenCalled()
  })
})

describe('in-app gating defaults', () => {
  it('delivers when the member never opened settings', async () => {
    const { service } = build(null)
    await expect(service.decideInApp('u1', 'new_like')).resolves.toEqual({ deliver: true })
  })

  it('fails open when the settings lookup errors', async () => {
    // Opposite direction to email on purpose. An unsent email can be sent
    // later; an unwritten notification is gone.
    const { service } = build(null, { throws: true })
    await expect(service.decideInApp('u1', 'new_like')).resolves.toEqual({ deliver: true })
  })
})

describe('coverage of the settings screen', () => {
  it('gates every toggle the UI offers, or names it as not yet wired', async () => {
    // The bug this module exists to fix was a screen full of switches that
    // changed a database row and nothing else. This asserts the inventory
    // directly, so a toggle added to the UI without a matching event fails here
    // rather than shipping dead.
    const { service } = build(ALL_OFF)
    const gated = new Set<string>()

    for (const type of Object.keys(EVENT_REGISTRY)) {
      const decision = await service.decideInApp('u1', type)
      if (!decision.deliver) gated.add(PREFERENCE_COLUMN[decision.reason] ?? decision.reason)
    }

    expect(gated).toEqual(
      new Set(['notifLikes', 'notifComments', 'notifFollows', 'notifMentions', 'notifEvents', 'notifCommunities', 'notifNews']),
    )
    // notifPromotions and emailDigest are deliberately absent: no marketing
    // event and no digest assembly exist yet, so both remain inert. They are
    // the last two switches on that screen that still do nothing.
  })
})
