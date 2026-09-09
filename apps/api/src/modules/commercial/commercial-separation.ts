import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { CommercialClassification } from '@prisma/client'

/**
 * The two separations ZSOC-COM-REV-001 treats as non-negotiable, expressed as
 * something the build can check.
 *
 *   1. Verification is never derived from payment (§4 blocker 4, §5 A4, §8 D1,
 *      §29 COM-02, §34 "verification monetization conflict" — Critical).
 *   2. Free Core safety capability is never entitlement-gated (§6 B7,
 *      §29 SAFE-01).
 *
 * Both hold trivially today, because there is no billing code to violate them.
 * That is exactly why they are pinned now: the cost of writing this while the
 * invariant is free is near zero, and the cost of untangling a subscription
 * check that has already grown into the verification path is not. §34 rates
 * the pay-to-verify drift Critical precisely because it arrives by accident.
 *
 * The checks are source-level fitness functions rather than unit tests, because
 * the thing being prevented is a FUTURE import — no runtime assertion can catch
 * code that has not been written yet, but a guard over the sanctioned files
 * fires the day someone reaches for a subscription lookup in the wrong module.
 */

const MODULES_DIR = resolve(__dirname, '..')

/**
 * The only files permitted to mutate verification state (§5 A4: verification is
 * "issued only by the independent verification workflow"). Adding a file here
 * is a deliberate act that should draw a reviewer's eye — which is the point.
 */
export const VERIFICATION_WRITE_PATHS = ['profile/profile.service.ts'] as const

/**
 * Capabilities that must never sit behind a paywall (§6 B7's NON_MONETIZABLE_CORE,
 * enforced by "entitlement service and release tests" — this is the release test).
 *
 * §29 SAFE-01: "Safety reporting, blocking, appeals and essential security are
 * not Premium-gated; payment status cannot improve moderation outcome."
 */
export const NON_MONETIZABLE_CORE: { capability: string; clause: string; paths: string[] }[] = [
  {
    capability: 'safety-reporting',
    clause: '§6 B7 / §29 SAFE-01 — reporting abuse must never require payment',
    paths: ['moderation/moderation.service.ts', 'safety/safety.service.ts'],
  },
  {
    capability: 'blocking-and-muting',
    clause: '§6 B7 — blocking an account is a protection, not a feature',
    paths: ['network/network.service.ts'],
  },
  {
    capability: 'account-security',
    clause: '§6 B7 / §29 SAFE-01 — essential security is never premium-gated',
    paths: ['auth/auth.service.ts'],
  },
]

/**
 * Identifiers that mean "money changed hands" or "this account paid". Their
 * presence in a protected file is the signal of drift.
 *
 * Kept deliberately narrow. A broad list produces false positives, a noisy
 * guard gets suppressed, and a suppressed guard protects nothing.
 */
export const COMMERCIAL_SIGNALS = [
  'subscription',
  'entitlement',
  'premium',
  'billing',
  'stripe',
  'payout',
  'planId',
  'plan_id',
  'catalogVersion',
  'catalog_version',
  'commercialAccount',
  'commercial_account',
  'paywall',
  'isPaid',
  'hasPaid',
] as const

/**
 * Comments are stripped before scanning. A file is allowed to EXPLAIN that it
 * must not consult subscription state — that prose is the documentation of the
 * rule, not a breach of it. Only executable references count.
 */
export function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

export function findCommercialSignals(source: string): string[] {
  const code = stripComments(source)
  return COMMERCIAL_SIGNALS.filter((signal) => new RegExp(`\\b${signal}\\b`, 'i').test(code))
}

/** Throws if the file is missing — a renamed or deleted guard must fail loudly. */
export function readModuleFile(relativePath: string): string {
  return readFileSync(resolve(MODULES_DIR, relativePath), 'utf8')
}

/**
 * Charge authorization per §26 V1: classification is necessary but never
 * sufficient — "commercial_classification + billing_source + approved
 * catalog/contract + transaction eligibility".
 *
 * Only two classifications can ever reach a charge. Everything else — including
 * an unclassified `legacy_review` account — fails closed, which is the
 * standard's response to uncertain commercial truth throughout.
 *
 * Not yet wired into checkout: the other three parts of §26 V1 do not exist,
 * and gating on this alone would block every existing account's Shop purchase.
 * See supabase/migrations/066.
 */
export const CHARGEABLE_CLASSIFICATIONS: CommercialClassification[] = [
  'commercial_premium',
  'partner_contract',
]

export function mayAuthorizeCharge(classification: CommercialClassification): boolean {
  return CHARGEABLE_CLASSIFICATIONS.includes(classification)
}
