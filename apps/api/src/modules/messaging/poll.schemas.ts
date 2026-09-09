import { z } from 'zod'

/**
 * A vote. The option is checked against the poll's own options in the service —
 * a well-formed uuid here says nothing about whether it belongs to this poll.
 */
export const VotePollSchema = z.object({
  optionId: z.string().uuid(),
})

export type VotePollInput = z.infer<typeof VotePollSchema>
