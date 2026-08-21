import { PREFERENCE_KEYS, type PreferenceKey } from '../comms/comms.types'

/**
 * Which push category each notification type answers to.
 *
 * Deliberately separate from the comms registry. That registry is an *email*
 * template estate — every entry carries a templateId, and an entry without a
 * template is how a template estate rots. Sixteen of the thirty-three types this
 * app produces have no email template and therefore no registry entry, which
 * meant they pushed with no category control at all: a member could not switch
 * off breeding requests, order updates or pet-care bookings, only every push at
 * once.
 *
 * Push has no such constraint. It needs a category for everything it can
 * deliver, so this map is the authority for the push channel and is allowed to
 * be finer-grained than the email registry. `lost_found_sighting` is the clearest
 * case: email gates it under News, which is where it landed for want of anywhere
 * better, while a lost-pet sighting is plainly not a newsletter.
 *
 * A type absent from this map falls back to the master switch alone — correct for
 * account, security and billing notices, which are not meant to be individually
 * silenceable.
 *
 * `push-categories.spec.ts` asserts every type the app actually enqueues appears
 * here, so adding a producer without a category fails the build rather than
 * quietly shipping an uncontrollable notification.
 */
export const PUSH_CATEGORY: Record<string, PreferenceKey> = {
  // ── Messages ───────────────────────────────────────────────────────────────
  message: PREFERENCE_KEYS.messagesActivity,
  dm: PREFERENCE_KEYS.messagesActivity,
  group: PREFERENCE_KEYS.messagesActivity,
  call: PREFERENCE_KEYS.messagesActivity,

  // ── Social ─────────────────────────────────────────────────────────────────
  new_like: PREFERENCE_KEYS.socialReactions,
  new_comment: PREFERENCE_KEYS.socialCommentsReplies,
  comment_reply: PREFERENCE_KEYS.socialCommentsReplies,
  mention: PREFERENCE_KEYS.socialMentions,
  new_follower: PREFERENCE_KEYS.socialFollowRequests,
  follow_request: PREFERENCE_KEYS.socialFollowRequests,
  follow_request_accepted: PREFERENCE_KEYS.socialFollowRequests,

  // Sharing is not reacting. Someone passing your post around is a different
  // thing from a like, and folding it into Reactions would silence it by surprise.
  post_shared: PREFERENCE_KEYS.socialShares,
  shared_with_you: PREFERENCE_KEYS.socialShares,

  // ── Communities ────────────────────────────────────────────────────────────
  community_invite: PREFERENCE_KEYS.groupsInvitations,
  group_invite: PREFERENCE_KEYS.groupsInvitations,
  community_join_request: PREFERENCE_KEYS.groupsActivity,
  community_request_approved: PREFERENCE_KEYS.groupsActivity,
  // The registry has this one under Events, which looks like a copy-paste: a
  // change to your role in a community is community activity.
  community_role_changed: PREFERENCE_KEYS.groupsActivity,
  community_muted: PREFERENCE_KEYS.groupsActivity,

  // ── Events ─────────────────────────────────────────────────────────────────
  event_invite: PREFERENCE_KEYS.eventsActivity,
  event_reminder: PREFERENCE_KEYS.eventsActivity,
  event_updated: PREFERENCE_KEYS.eventsActivity,
  event_cancelled: PREFERENCE_KEYS.eventsActivity,
  event_invite_declined: PREFERENCE_KEYS.eventsActivity,

  // ── Adoption ───────────────────────────────────────────────────────────────
  // Classed essential_transactional for email, which for push would mean the
  // "Adoption Enquiries" switch did not stop enquiry notifications reaching a
  // phone. A category here makes that switch true.
  adoption_enquiry: PREFERENCE_KEYS.adoptionActivity,
  adoption_enquiry_response: PREFERENCE_KEYS.adoptionActivity,
  adoption_message: PREFERENCE_KEYS.adoptionActivity,

  // ── Breeding ───────────────────────────────────────────────────────────────
  breeding_request: PREFERENCE_KEYS.breedingActivity,
  breeding_request_response: PREFERENCE_KEYS.breedingActivity,
  breeding_message: PREFERENCE_KEYS.breedingActivity,
  breeding_review: PREFERENCE_KEYS.breedingActivity,
  breeding_alert: PREFERENCE_KEYS.breedingActivity,
  breeding_verified: PREFERENCE_KEYS.breedingActivity,

  // ── Shop ───────────────────────────────────────────────────────────────────
  order_paid: PREFERENCE_KEYS.shopActivity,
  order_refunded: PREFERENCE_KEYS.shopActivity,
  order_disputed: PREFERENCE_KEYS.shopActivity,
  order_dispute_resolved: PREFERENCE_KEYS.shopActivity,
  product_enquiry: PREFERENCE_KEYS.shopActivity,

  // ── Pet care ───────────────────────────────────────────────────────────────
  pet_care_booking: PREFERENCE_KEYS.petCareActivity,
  pet_care_booking_update: PREFERENCE_KEYS.petCareActivity,
  vet_visit_summary: PREFERENCE_KEYS.petCareActivity,

  // ── Lost & found ───────────────────────────────────────────────────────────
  lost_found_sighting: PREFERENCE_KEYS.lostFoundAlerts,

  // ── News ───────────────────────────────────────────────────────────────────
  news_comment: PREFERENCE_KEYS.newsActivity,
}

/**
 * The categories the settings screen offers, in the order it shows them.
 *
 * Derived from the map rather than written out again, so a new category cannot
 * appear in one place and be missing from the other. Essential notices are absent
 * because they are absent from the map — there is no switch to offer.
 */
export const PUSH_PREFERENCE_KEYS: PreferenceKey[] = [
  PREFERENCE_KEYS.messagesActivity,
  PREFERENCE_KEYS.socialReactions,
  PREFERENCE_KEYS.socialCommentsReplies,
  PREFERENCE_KEYS.socialMentions,
  PREFERENCE_KEYS.socialFollowRequests,
  PREFERENCE_KEYS.socialShares,
  PREFERENCE_KEYS.groupsActivity,
  PREFERENCE_KEYS.groupsInvitations,
  PREFERENCE_KEYS.eventsActivity,
  PREFERENCE_KEYS.adoptionActivity,
  PREFERENCE_KEYS.breedingActivity,
  PREFERENCE_KEYS.shopActivity,
  PREFERENCE_KEYS.petCareActivity,
  PREFERENCE_KEYS.lostFoundAlerts,
  PREFERENCE_KEYS.newsActivity,
]

/** The category a notification type answers to, if it has one. */
export function pushCategoryFor(type: string): PreferenceKey | undefined {
  return PUSH_CATEGORY[type]
}
