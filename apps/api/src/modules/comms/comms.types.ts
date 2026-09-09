/**
 * Communications platform — core vocabulary.
 *
 * Implements ZS-COMMS-EMAIL-001 v2.0.0 §03 (doctrine and classification),
 * §05 (streams and sender reputation) and §14 (preference keys).
 *
 * The governing rule from §04 is that product services publish events and never
 * render or send email themselves. That already matches how this codebase
 * works: 45 call sites enqueue notification jobs and a single writer fans them
 * out, so email becomes another channel behind that writer rather than a new
 * thing every module has to remember to call.
 */

/**
 * §03 message classes. The class decides what a member can switch off, not the
 * template — which is why it lives on the event and not in the copy.
 */
export const MESSAGE_CLASSES = [
  /** Verification, authentication, recovery, material account changes. */
  'essential_account',
  /** Security, safety, privacy, legal. Exempt from quiet hours and caps. */
  'essential_security',
  /** Receipts, orders, bookings, subscriptions, contractual notices. */
  'essential_transactional',
  /** Social, group, message, event, adoption, news activity. */
  'configurable_activity',
  /** Product announcements, recommendations, win-back. Consent required. */
  'marketing',
  /** One-time invitation or statutory notice to an address with no account. */
  'non_member',
] as const
export type MessageClass = (typeof MESSAGE_CLASSES)[number]

/** Classes a member can never switch off (§03). */
const ESSENTIAL_CLASSES: ReadonlySet<MessageClass> = new Set([
  'essential_account',
  'essential_security',
  'essential_transactional',
])

export function isEssential(cls: MessageClass): boolean {
  return ESSENTIAL_CLASSES.has(cls)
}

/**
 * Only essential security/safety/privacy/legal is exempt from quiet hours and
 * activity caps (§03). Essential account and transactional mail is still
 * essential, but a receipt does not need to arrive at 3am.
 */
export function bypassesQuietHours(cls: MessageClass): boolean {
  return cls === 'essential_security'
}

/**
 * §05 reputation streams. Separate senders, return paths and DKIM selectors per
 * stream so a marketing complaint cannot take down password resets. The doc is
 * explicit that this reduces blast radius rather than guaranteeing independence.
 */
export const EMAIL_STREAMS = ['transactional', 'notification', 'marketing'] as const
export type EmailStream = (typeof EMAIL_STREAMS)[number]

/** Which stream a class must travel on. Not a per-template choice. */
export function streamForClass(cls: MessageClass): EmailStream {
  switch (cls) {
    case 'essential_account':
    case 'essential_security':
    case 'essential_transactional':
    case 'non_member':
      return 'transactional'
    case 'configurable_activity':
      return 'notification'
    case 'marketing':
      return 'marketing'
  }
}

/**
 * §14 preference keys. Essential keys are listed so the decision engine can
 * assert they are never gated, rather than relying on every caller to remember.
 */
export const PREFERENCE_KEYS = {
  accountEssential: 'account.essential',
  accountGuidance: 'account.guidance',
  securityEssential: 'security.essential',
  safetyEssential: 'safety.essential',
  privacyEssential: 'privacy.essential',
  billingEssential: 'billing.essential',
  socialFollowRequests: 'social.follow_requests',
  socialMentions: 'social.mentions',
  socialCommentsReplies: 'social.comments_replies',
  socialReactions: 'social.reactions',
  socialDigest: 'social.digest',
  groupsInvitations: 'groups.invitations',
  groupsActivity: 'groups.activity',
  messagesActivity: 'messages.activity',
  eventsActivity: 'events.activity',
  adoptionActivity: 'adoption.activity',
  newsActivity: 'news.activity',
  marketingProduct: 'marketing.product',

  // Domains that produce notifications but had no preference key, so a member
  // could not switch them off. Added for the push channel, which needs a
  // category for every type it can deliver; the email estate has no templates
  // for these, so they carry no PREFERENCE_COLUMN and email is unaffected.
  breedingActivity: 'breeding.activity',
  shopActivity: 'shop.activity',
  petCareActivity: 'pet_care.activity',
  socialShares: 'social.shares',
  lostFoundAlerts: 'lost_found.alerts',
} as const
export type PreferenceKey = (typeof PREFERENCE_KEYS)[keyof typeof PREFERENCE_KEYS]

/** Preference keys that are always on (§14 "Always on"). */
export const ESSENTIAL_PREFERENCE_KEYS: ReadonlySet<string> = new Set([
  PREFERENCE_KEYS.accountEssential,
  PREFERENCE_KEYS.securityEssential,
  PREFERENCE_KEYS.safetyEssential,
  PREFERENCE_KEYS.privacyEssential,
  PREFERENCE_KEYS.billingEssential,
])

/**
 * Why a message was not sent.
 *
 * §03: "The absence of an email is a designed and auditable outcome."
 * Every decision the engine makes is one of these, so a missing email can be
 * explained rather than guessed at.
 */
export const SUPPRESSION_REASONS = [
  'preference_off',
  'quiet_hours',
  'rate_capped',
  'collapsed',
  'already_seen_in_product',
  'hard_bounced',
  'complained',
  'unsubscribed',
  'no_email_address',
  'account_not_active',
  'provider_not_configured',
] as const
export type SuppressionReason = (typeof SUPPRESSION_REASONS)[number]

export type DeliveryDecision =
  | { send: true; stream: EmailStream }
  | { send: false; reason: SuppressionReason }

/**
 * The in-product equivalent. Carries the preference key rather than a
 * SuppressionReason, because the only way an in-app notification is withheld is
 * a member switching its category off — there is no address to bounce, no
 * provider to fail, and no suppression list.
 */
export type InAppDecision = { deliver: true } | { deliver: false; reason: PreferenceKey }
