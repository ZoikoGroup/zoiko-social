import { z } from 'zod'

/**
 * Chat settings an owner or admin can change.
 *
 * Every field optional so the client can send one toggle without restating the
 * rest — a PATCH that had to carry all three would race two admins changing
 * different switches, with the last writer silently reverting the other.
 *
 * The ceiling matches the CHECK constraint in migration 074. An hour is already
 * far beyond anything usable; without a ceiling, a slip of the keyboard locks a
 * room for a year and reads as a bug rather than a setting.
 */
export const UpdateCommunityChatSettingsSchema = z
  .object({
    chatEnabled: z.boolean().optional(),
    announcementOnly: z.boolean().optional(),
    slowModeSeconds: z.number().int().min(0).max(3600).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'Nothing to update',
  })

export type UpdateCommunityChatSettingsInput = z.infer<typeof UpdateCommunityChatSettingsSchema>
