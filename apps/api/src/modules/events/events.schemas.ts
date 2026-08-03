import { z } from 'zod'

export const EVENT_CATEGORIES = [
  'adoption_drive', 'vet_camp', 'workshop', 'meetup', 'fundraiser', 'competition', 'awareness',
  'birthday', 'wedding', 'naming_ceremony', 'gotcha_day', 'funeral', 'farewell', 'playdate',
  'other',
] as const

export const CreateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    /** Free tags; normalised server-side so #Beagle and beagle are one tag. */
    tags: z.array(z.string().trim().max(40)).max(10).optional(),
    description: z.string().trim().max(2000).optional(),
    location: z.string().trim().max(200).optional(),
    venueName: z.string().trim().max(160).optional(),
    /**
     * Host on behalf of a community. Only its owner or an admin may do this —
     * checked in the service, since a schema cannot know the caller's role.
     */
    communityId: z.string().uuid().optional(),
    visibility: z.enum(['public', 'followers']).optional(),
    inviteOnly: z.boolean().optional(),
    /** Whether people who join via the share link are added to the invite list. */
    shareLinkExtendsInvites: z.boolean().optional(),
    /** Initial invitees for an invite-only event — validated to exist, host excluded. */
    invitees: z.array(z.string().min(1)).max(500).optional(),
    isOnline: z.boolean().optional(),
    coverUrl: z.string().url().max(600).optional(),
    videoUrl: z.string().url().max(600).optional(),
    category: z.enum(EVENT_CATEGORIES).optional(),
    isFree: z.boolean().optional(),
    price: z.string().trim().max(60).optional(),
    bookingUrl: z.string().url().max(600).optional(),
    capacity: z.number().int().min(1).max(1_000_000).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    startsAt: z.string().datetime({ message: 'startsAt must be an ISO datetime' }),
    endsAt: z.string().datetime().optional(),
  })
  .refine((e) => !e.endsAt || new Date(e.endsAt) >= new Date(e.startsAt), {
    message: 'endsAt must be after startsAt',
    path: ['endsAt'],
  })

// Editable fields (host only). All optional; startsAt/endsAt validated when present.
export const UpdateEventSchema = z
  .object({
    tags: z.array(z.string().trim().max(40)).max(10).optional(),
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    location: z.string().trim().max(200).nullable().optional(),
    venueName: z.string().trim().max(160).nullable().optional(),
    visibility: z.enum(['public', 'followers']).optional(),
    inviteOnly: z.boolean().optional(),
    /** Whether people who join via the share link are added to the invite list. */
    shareLinkExtendsInvites: z.boolean().optional(),
    /** Additional invitees to add on edit (invite-only events only). */
    invitees: z.array(z.string().min(1)).max(500).optional(),
    isOnline: z.boolean().optional(),
    coverUrl: z.string().url().max(600).nullable().optional(),
    videoUrl: z.string().url().max(600).nullable().optional(),
    category: z.enum(EVENT_CATEGORIES).nullable().optional(),
    isFree: z.boolean().optional(),
    price: z.string().trim().max(60).nullable().optional(),
    bookingUrl: z.string().url().max(600).nullable().optional(),
    capacity: z.number().int().min(1).max(1_000_000).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().nullable().optional(),
  })

/** Add invitees to an invite-only event (host only). */
export const InviteSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1).max(500),
})

/** Join an event via its share link (token from the URL). */
export const JoinEventSchema = z.object({
  token: z.string().min(1).max(200),
})

/** Host share-link management: toggle extends-invites and/or regenerate the token. */
export const ShareLinkSchema = z.object({
  extendsInvites: z.boolean().optional(),
  reset: z.boolean().optional(),
})

export const RsvpSchema = z.object({
  status: z.enum(['going', 'interested']).optional(),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type InviteInput = z.infer<typeof InviteSchema>
export type JoinInput = z.infer<typeof JoinEventSchema>
export type ShareLinkInput = z.infer<typeof ShareLinkSchema>
export type RsvpInput = z.infer<typeof RsvpSchema>
