import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { lookupEvent, streamForEvent, IN_APP_ONLY_TYPES, type EventDefinition } from './comms.registry'
import {
  PREFERENCE_KEYS,
  isEssential,
  type DeliveryDecision,
  type InAppDecision,
  type PreferenceKey,
} from './comms.types'

/**
 * Decides whether a notification may reach a member on a given channel —
 * ZS-COMMS-EMAIL-001 §06, §14, deliverable 5 of §16.
 *
 * This is also the fix for a live bug. UserSettings has carried eleven
 * notification toggles since before this module existed, the settings API
 * writes them, the UI shows them — and nothing read them. Turning off "notify
 * me about likes" changed a row in the database and nothing else. That is worse
 * than not offering the control, and for emailMarketing it is the consent
 * record that GDPR and CAN-SPAM expect to be honored.
 *
 * §03: "The absence of an email is a designed and auditable outcome." Every
 * refusal returns a reason rather than a bare false, so a missing email can be
 * explained from the ledger instead of guessed at.
 *
 * Two channels, and they fail in opposite directions. Email is recoverable if
 * withheld and unrecoverable if sent, so `decide` fails closed. An in-app
 * notification is the member's only record that something happened, so
 * `decideInApp` fails open: a settings lookup that errors must not silently
 * delete a follow request.
 */

/**
 * §14 preference key → the UserSettings column that backs it.
 *
 * Not every key has a column yet: messages.activity, adoption.activity and
 * account.guidance have no field. They default to enabled, which matches §14's
 * "on by default" for those categories. Adding the columns is a migration and a
 * settings-UI change, deliberately not bundled into this slice.
 */
export const PREFERENCE_COLUMN: Partial<Record<PreferenceKey, keyof UserSettingsRow>> = {
  [PREFERENCE_KEYS.socialReactions]: 'notifLikes',
  [PREFERENCE_KEYS.socialCommentsReplies]: 'notifComments',
  [PREFERENCE_KEYS.socialFollowRequests]: 'notifFollows',
  [PREFERENCE_KEYS.socialMentions]: 'notifMentions',
  [PREFERENCE_KEYS.eventsActivity]: 'notifEvents',
  [PREFERENCE_KEYS.groupsActivity]: 'notifCommunities',
  [PREFERENCE_KEYS.groupsInvitations]: 'notifCommunities',
  [PREFERENCE_KEYS.newsActivity]: 'notifNews',
  [PREFERENCE_KEYS.marketingProduct]: 'emailMarketing',
}

interface UserSettingsRow {
  notifLikes: boolean
  notifComments: boolean
  notifFollows: boolean
  notifMentions: boolean
  notifEvents: boolean
  notifCommunities: boolean
  notifNews: boolean
  notifPromotions: boolean
  emailDigest: boolean
  emailMarketing: boolean
  pushEnabled: boolean
}

@Injectable()
export class CommsDecisionService {
  private readonly logger = new Logger(CommsDecisionService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * May this notification type go out by email to this member?
   *
   * Order matters. Address and account state come first because they are hard
   * facts; preferences only apply to configurable classes; essential mail is
   * never gated (§03).
   */
  async decide(userId: string, notificationType: string): Promise<DeliveryDecision> {
    const definition = lookupEvent(notificationType)
    if (!definition) {
      // In-app only is a legitimate outcome, not a gap — the registry says so
      // explicitly for the types it lists. Anything else is genuinely unmapped
      // and worth surfacing once rather than silently dropping.
      if (!IN_APP_ONLY_TYPES.has(notificationType)) {
        this.logger.debug(`No email template registered for "${notificationType}" — in-app only`)
      }
      return { send: false, reason: 'preference_off' }
    }

    // Deliberately does not resolve the email address. Profile has no email
    // column — addresses live in Supabase auth and cost an admin API call each
    // — so the dispatcher resolves them only for events that survive this gate,
    // rather than paying for every suppressed one.
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { state: true },
    })
    if (!profile) return { send: false, reason: 'no_email_address' }

    // A deactivated, banned or pending-deletion account does not receive
    // activity mail. Essential security still reaches them — an account being
    // banned is exactly when someone needs to be told something.
    if (profile.state !== 'active' && definition.messageClass !== 'essential_security') {
      return { send: false, reason: 'account_not_active' }
    }

    if (isEssential(definition.messageClass)) {
      return { send: true, stream: streamForEvent(definition) }
    }

    let settings: UserSettingsRow | null
    try {
      settings = await this.loadSettings(userId)
    } catch (err) {
      // Fail closed, the opposite of the in-app gate below. An email sent
      // against a preference cannot be recalled, and a lookup that errors is
      // not evidence of consent. Withholding costs one delayed notification.
      this.logger.warn(`Preference lookup failed for ${notificationType}; withholding email`, err as Error)
      return { send: false, reason: 'preference_off' }
    }

    if (!this.preferenceAllows(definition, settings)) {
      return { send: false, reason: 'preference_off' }
    }

    return { send: true, stream: streamForEvent(definition) }
  }

  /**
   * May this notification type appear in-product for this member?
   *
   * The same stored toggles, read for the channel the settings screen actually
   * names. "Likes & Reactions" sits under a Notifications heading, so a member
   * who switches it off reasonably expects the bell to go quiet too — not just
   * their inbox.
   *
   * Narrower than the email gate on purpose. Account state is not consulted: a
   * deactivated member is not being written to, and if they reactivate, the
   * history should be intact. Suppression lists are an email concern. What is
   * left is the preference itself.
   */
  async decideInApp(userId: string, notificationType: string): Promise<InAppDecision> {
    const definition = lookupEvent(notificationType)

    // No registry entry, or an entry with no preference key, means there is no
    // control the member could have switched off — including every type in
    // IN_APP_ONLY_TYPES. Nothing to honour, so it stands.
    if (!definition?.preferenceKey) return { deliver: true }

    // Essential account, security and transactional notifications are never
    // preference-gated (§03). A member who muted community activity still needs
    // to learn they were removed as a moderator.
    if (isEssential(definition.messageClass)) return { deliver: true }

    const column = this.inAppColumn(definition.messageClass, definition.preferenceKey)
    if (!column) return { deliver: true }

    try {
      const settings = await this.loadSettings(userId)
      // No row means the member never opened settings, so defaults apply, and
      // every in-product default in §14 is on.
      if (!settings) return { deliver: true }
      if (settings[column] === false) return { deliver: false, reason: definition.preferenceKey }
      return { deliver: true }
    } catch (err) {
      // Fail open. A notification not written is gone for good, and losing a
      // follow request to a transient database error is a worse outcome than
      // showing one the member had muted.
      this.logger.warn(`Preference lookup failed for ${notificationType}; delivering anyway`, err as Error)
      return { deliver: true }
    }
  }

  /**
   * In-app promotional notices answer to the toggle the settings screen labels
   * "Promotions & Tips", not to the email marketing consent record. They are
   * different permissions: emailMarketing is the GDPR/CAN-SPAM basis for mailing
   * someone, and it defaults off for that reason. A notice inside a product the
   * member has opened is not the same act.
   */
  private inAppColumn(
    messageClass: EventDefinition['messageClass'],
    key: PreferenceKey,
  ): keyof UserSettingsRow | undefined {
    if (messageClass === 'marketing') return 'notifPromotions'
    return PREFERENCE_COLUMN[key]
  }

  /**
   * UserSettings is a separate table keyed by userId; there is no relation on
   * Profile. Absent row means the member never opened settings.
   */
  private async loadSettings(userId: string): Promise<UserSettingsRow | null> {
    return (await this.prisma.userSettings.findUnique({
      where: { userId },
      select: {
        notifLikes: true,
        notifComments: true,
        notifFollows: true,
        notifMentions: true,
        notifEvents: true,
        notifCommunities: true,
        notifNews: true,
        notifPromotions: true,
        emailDigest: true,
        emailMarketing: true,
        pushEnabled: true,
      },
    })) as UserSettingsRow | null
  }

  /**
   * Reads the member's stored preference for this event.
   *
   * Absent settings row means defaults, and every configurable default in §14
   * is on except marketing. Absent column means the category has no control
   * yet, which also means on.
   */
  private preferenceAllows(definition: EventDefinition, settings: UserSettingsRow | null): boolean {
    const key = definition.preferenceKey
    if (!key) return true

    // Marketing needs an affirmative basis, so its default is off, not on.
    if (definition.messageClass === 'marketing') {
      return settings?.emailMarketing === true
    }

    if (!settings) return true

    const column = PREFERENCE_COLUMN[key]
    if (!column) return true

    return settings[column] !== false
  }
}
