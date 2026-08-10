import {
  PREFERENCE_KEYS,
  streamForClass,
  type EmailStream,
  type MessageClass,
  type PreferenceKey,
} from './comms.types'

/**
 * Notification Event Registry — ZS-COMMS-EMAIL-001 §07, deliverable 1 of §16.
 *
 * The single machine-readable statement of what each event is: template id,
 * class, stream, preference key, collapse key and cap. §12 is explicit that the
 * prose copy "is not the schema", so this is the schema.
 *
 * Keyed by the notification `type` values this codebase already emits from its
 * 45 producer sites, so no caller changes to add email — the writer looks the
 * type up here.
 *
 * Scope decision (agreed 2026-08-07): the estate covers the domains that map to
 * shipped features. PREM, PAY, ADS and CRTR are deliberately absent — there is
 * no subscription, billing, advertising or creator product to describe, and copy
 * written against a guess would be rewritten when those ship. Registering an
 * event with no product is how a template estate rots.
 */
export interface EventDefinition {
  /** Canonical template family, e.g. ZS-EM-AUTH-001 (§11). */
  templateId: string
  /** §03 class. Decides gating, quiet hours and caps. */
  messageClass: MessageClass
  /** §14 key. Absent for essential mail, which is never preference-gated. */
  preferenceKey?: PreferenceKey
  /**
   * Events sharing a collapse key inside the window arrive as one message
   * (§06). "Twelve people liked your post", not twelve emails.
   */
  collapseKey?: string
  /** Max sends per recipient per rolling day for this event (§06). */
  dailyCap?: number
  /**
   * §03: "Email is the channel of last resort for configurable activity. If the
   * recipient has already seen or acted on the information in-product, the
   * queued email is canceled." Delay before dispatch, in seconds.
   */
  inProductGraceSeconds?: number
}

/**
 * The registry. Keys are the `type` strings already passed to
 * NotificationQueueService.enqueue().
 */
export const EVENT_REGISTRY: Readonly<Record<string, EventDefinition>> = {
  // ── AUTH — identity, authentication, security ────────────────────────────
  // Essential security. No preference key, no quiet hours, no cap: a password
  // reset that arrives tomorrow morning is not a password reset.
  'auth.verify_email': { templateId: 'ZS-EM-AUTH-001', messageClass: 'essential_account' },
  'auth.verify_expired': { templateId: 'ZS-EM-AUTH-002', messageClass: 'essential_account' },
  'auth.welcome': {
    templateId: 'ZS-EM-AUTH-003',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.accountGuidance,
  },
  'auth.sign_in_code': { templateId: 'ZS-EM-AUTH-004', messageClass: 'essential_security' },
  'auth.password_reset': { templateId: 'ZS-EM-AUTH-005', messageClass: 'essential_security' },

  // ── SOC — social activity ────────────────────────────────────────────────
  new_follower: {
    templateId: 'ZS-EM-SOC-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialFollowRequests,
    collapseKey: 'social.followers',
    dailyCap: 3,
    inProductGraceSeconds: 900,
  },
  follow_request: {
    templateId: 'ZS-EM-SOC-002',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialFollowRequests,
    collapseKey: 'social.follow_requests',
    dailyCap: 3,
    inProductGraceSeconds: 900,
  },
  follow_request_accepted: {
    templateId: 'ZS-EM-SOC-003',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialFollowRequests,
    inProductGraceSeconds: 900,
  },
  // Reactions are digest-or-off in §14 — never immediate. A popular post would
  // otherwise be an outage of the recipient's inbox.
  new_like: {
    templateId: 'ZS-EM-SOC-004',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialReactions,
    collapseKey: 'social.reactions',
    dailyCap: 1,
    inProductGraceSeconds: 3600,
  },
  new_comment: {
    templateId: 'ZS-EM-SOC-005',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialCommentsReplies,
    collapseKey: 'social.comments',
    dailyCap: 5,
    inProductGraceSeconds: 900,
  },
  comment_reply: {
    templateId: 'ZS-EM-SOC-006',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialCommentsReplies,
    collapseKey: 'social.comments',
    dailyCap: 5,
    inProductGraceSeconds: 900,
  },
  mention: {
    templateId: 'ZS-EM-SOC-007',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.socialMentions,
    dailyCap: 10,
    inProductGraceSeconds: 900,
  },

  // ── MSG — messaging ──────────────────────────────────────────────────────
  // Long grace: a DM notification is pointless once the tab is open.
  dm: {
    templateId: 'ZS-EM-MSG-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.messagesActivity,
    collapseKey: 'messages.unread',
    dailyCap: 3,
    inProductGraceSeconds: 1800,
  },
  message: {
    templateId: 'ZS-EM-MSG-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.messagesActivity,
    collapseKey: 'messages.unread',
    dailyCap: 3,
    inProductGraceSeconds: 1800,
  },
  group: {
    templateId: 'ZS-EM-MSG-002',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.messagesActivity,
    collapseKey: 'messages.unread',
    dailyCap: 3,
    inProductGraceSeconds: 1800,
  },
  group_invite: {
    templateId: 'ZS-EM-MSG-003',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.groupsInvitations,
    inProductGraceSeconds: 900,
  },
  // A missed call is only useful promptly, so no grace period.
  call: {
    templateId: 'ZS-EM-MSG-004',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.messagesActivity,
    dailyCap: 5,
  },

  // ── GRP — communities ────────────────────────────────────────────────────
  community_invite: {
    templateId: 'ZS-EM-GRP-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.groupsInvitations,
    inProductGraceSeconds: 900,
  },
  community_join_request: {
    templateId: 'ZS-EM-GRP-002',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.groupsActivity,
    collapseKey: 'groups.requests',
    dailyCap: 3,
    inProductGraceSeconds: 900,
  },
  community_request_approved: {
    templateId: 'ZS-EM-GRP-003',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.groupsActivity,
    inProductGraceSeconds: 900,
  },
  // A role change and a mute are governance outcomes, not activity: the member
  // needs to know even with group activity switched off.
  community_role_changed: { templateId: 'ZS-EM-GRP-004', messageClass: 'essential_account' },
  community_muted: { templateId: 'ZS-EM-GRP-005', messageClass: 'essential_security' },

  // ── EVT — events ─────────────────────────────────────────────────────────
  event_invite: {
    templateId: 'ZS-EM-EVT-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.eventsActivity,
    inProductGraceSeconds: 900,
  },
  event_reminder: {
    templateId: 'ZS-EM-EVT-002',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.eventsActivity,
  },
  // Cancellations and time changes are contractual-ish: someone may be about to
  // travel. Not preference-gated.
  event_cancelled: { templateId: 'ZS-EM-EVT-003', messageClass: 'essential_transactional' },
  event_updated: { templateId: 'ZS-EM-EVT-004', messageClass: 'essential_transactional' },
  event_invite_declined: {
    templateId: 'ZS-EM-EVT-005',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.eventsActivity,
    collapseKey: 'events.rsvp',
    dailyCap: 2,
  },

  // ── ADOPT — adoption ─────────────────────────────────────────────────────
  // An animal's placement is time-critical for its welfare, which the doctrine
  // puts above engagement. Capped but not silenced.
  adoption_enquiry: {
    templateId: 'ZS-EM-ADOPT-001',
    messageClass: 'essential_transactional',
    dailyCap: 20,
  },
  adoption_enquiry_response: {
    templateId: 'ZS-EM-ADOPT-002',
    messageClass: 'essential_transactional',
  },
  adoption_message: {
    templateId: 'ZS-EM-ADOPT-003',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.adoptionActivity,
    collapseKey: 'adoption.messages',
    dailyCap: 5,
    inProductGraceSeconds: 1800,
  },
  // A sighting of a missing animal is the clearest welfare-urgent event here.
  lost_found_sighting: { templateId: 'ZS-EM-ADOPT-004', messageClass: 'essential_transactional' },

  // ── SAFE / PRIV — safety, moderation, verification ───────────────────────
  // Moderation and verification outcomes are essential security under §03 and
  // are exempt from quiet hours: the member needs to know what happened.
  verification_approved: { templateId: 'ZS-EM-SAFE-001', messageClass: 'essential_security' },
  verification_rejected: { templateId: 'ZS-EM-SAFE-002', messageClass: 'essential_security' },

  // ── NEWS ─────────────────────────────────────────────────────────────────
  news_comment: {
    templateId: 'ZS-EM-NEWS-001',
    messageClass: 'configurable_activity',
    preferenceKey: PREFERENCE_KEYS.newsActivity,
    collapseKey: 'news.comments',
    dailyCap: 3,
    inProductGraceSeconds: 900,
  },
}

export function lookupEvent(type: string): EventDefinition | undefined {
  return EVENT_REGISTRY[type]
}

/** Stream is derived from class, never chosen per template (§05). */
export function streamForEvent(def: EventDefinition): EmailStream {
  return streamForClass(def.messageClass)
}

/**
 * Notification types this codebase emits that have no email template.
 *
 * Not an oversight — in-app only is a valid outcome, and the registry is the
 * place that says so out loud. Anything here either belongs to an unbuilt
 * product (orders, bookings, breeding) or is noise that email would not improve
 * (shares, reposts).
 */
export const IN_APP_ONLY_TYPES: ReadonlySet<string> = new Set([
  'post_shared',
  'shared_post',
  'shared_with_you',
  'order_paid',
  // Reversals are in-app for the same reason `order_paid` is: §24 T requires an
  // approved sender boundary per commercial domain, and no marketplace
  // commercial sender exists yet. Silence would be worse — a seller told their
  // item sold and never told it was refunded.
  'order_refunded',
  'order_disputed',
  'order_dispute_resolved',
  'product_enquiry',
  'pet_care_booking',
  'pet_care_booking_update',
  'vet_visit_summary',
  'breeding_request',
  'breeding_request_response',
  'breeding_message',
  'breeding_alert',
  'breeding_review',
  'breeding_verified',
  'vaccination',
  'surgery',
  'weight',
])
