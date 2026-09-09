import {
  VERIFICATION_WRITE_PATHS,
  NON_MONETIZABLE_CORE,
  COMMERCIAL_SIGNALS,
  findCommercialSignals,
  stripComments,
  mayAuthorizeCharge,
  readModuleFile,
} from './commercial-separation'

/**
 * ZSOC-COM-REV-001's two Critical separations, as release tests.
 *
 * These fail the build on the change that introduces the drift, not on the
 * release that ships it. §34 rates pay-to-verify Critical because it is the
 * kind of coupling nobody decides to add — it arrives as a convenient lookup
 * inside an unrelated feature.
 */

describe('verification is never derived from payment (§29 COM-02)', () => {
  it.each(VERIFICATION_WRITE_PATHS)('%s consults no commercial signal', (path) => {
    const found = findCommercialSignals(readModuleFile(path))
    expect(found).toEqual([])
  })

  it('names every file allowed to mutate verification state', () => {
    // A file added here should draw a reviewer's eye. An empty list would mean
    // the guard covers nothing.
    expect(VERIFICATION_WRITE_PATHS.length).toBeGreaterThan(0)
  })
})

describe('free core is never entitlement-gated (§6 B7, §29 SAFE-01)', () => {
  const cases = NON_MONETIZABLE_CORE.flatMap((entry) =>
    entry.paths.map((path) => ({ path, capability: entry.capability, clause: entry.clause })),
  )

  it.each(cases)('$capability — $path is free of paywall checks', ({ path, clause }) => {
    const found = findCommercialSignals(readModuleFile(path))
    expect(found).toEqual([])
    expect(clause).toBeTruthy()
  })

  it('covers reporting, blocking and account security', () => {
    // The three §29 SAFE-01 names them explicitly. Losing one silently would
    // leave the most monetizable safety capability unguarded.
    const capabilities = NON_MONETIZABLE_CORE.map((c) => c.capability)
    expect(capabilities).toEqual(
      expect.arrayContaining(['safety-reporting', 'blocking-and-muting', 'account-security']),
    )
  })
})

describe('the guard itself', () => {
  it('detects a subscription lookup', () => {
    const drifted = `
      const sub = await this.prisma.subscription.findFirst({ where: { userId } })
      if (sub?.status === 'active') await this.grantVerifiedBadge(userId)
    `
    expect(findCommercialSignals(drifted)).toContain('subscription')
  })

  it('detects an entitlement gate on a safety path', () => {
    expect(findCommercialSignals('if (!user.entitlement) throw new Error("upgrade")')).toContain('entitlement')
  })

  it('allows prose explaining the rule', () => {
    // A protected file must be able to document why it does NOT consult
    // subscription state, or the guard would punish the comment that prevents
    // the mistake.
    const documented = `
      // Verification state must never derive from subscription or billing.
      /* Premium unlocks professional tooling; the badge is issued elsewhere. */
      await this.prisma.profile.update({ data: { verificationTier: tier } })
    `
    expect(findCommercialSignals(documented)).toEqual([])
  })

  it('does not mistake a url for a comment', () => {
    expect(stripComments('const u = "https://example.com/x" // trailing')).toContain('https://example.com/x')
  })

  it('watches for the signals that matter', () => {
    expect(COMMERCIAL_SIGNALS).toEqual(expect.arrayContaining(['subscription', 'entitlement', 'premium', 'stripe']))
  })
})

describe('charge authorization fails closed (§26 V1)', () => {
  it('permits only deliberately commercial classifications', () => {
    expect(mayAuthorizeCharge('commercial_premium')).toBe(true)
    expect(mayAuthorizeCharge('partner_contract')).toBe(true)
  })

  it.each(['commercial_free', 'pilot_non_billable', 'internal', 'demo', 'sandbox', 'qa_automation', 'legacy_review'] as const)(
    'refuses %s',
    (classification) => {
      expect(mayAuthorizeCharge(classification)).toBe(false)
    },
  )

  it('refuses the default a new account is created with', () => {
    // migration 066 defaults to commercial_free, so a signup can never drift
    // into a chargeable state by omission.
    expect(mayAuthorizeCharge('commercial_free')).toBe(false)
  })
})
