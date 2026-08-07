import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { lookupEvent, streamForEvent, IN_APP_ONLY_TYPES, type EventDefinition } from './comms.registry'
import { PREFERENCE_KEYS, isEssential, type DeliveryDecision, type PreferenceKey } from './comms.types'

/**
 * Decides whether an email may be sent — ZS-COMMS-EMAIL-001 §06, §14,
 * deliverable 5 of §16.
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
 */

/**
 * §14 preference key → the UserSettings column that backs it.
 *
 * Not every key has a column yet: messages.activity, adoption.activity and
 * account.guidance have no field. They default to enabled, which matches §14's
 * "on by default" for those categories. Adding the columns is a migration and a
 * settings-UI change, deliberately not bundled into this slice.
 */
const PREFERENCE_COLUMN: Partial<Record<PreferenceKey, keyof UserSettingsRow>> = {
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

    // UserSettings is a separate table keyed by userId; there is no relation on
    // Profile. Absent row means the member never opened settings, which means
    // defaults.
    const settings = (await this.prisma.userSettings.findUnique({
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

    if (!this.preferenceAllows(definition, settings)) {
      return { send: false, reason: 'preference_off' }
    }

    return { send: true, stream: streamForEvent(definition) }
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
