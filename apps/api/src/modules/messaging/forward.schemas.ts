import { z } from 'zod'

/**
 * Forward targets.
 *
 * Capped at five, the same limit WhatsApp settled on. Forwarding is the cheapest
 * way to blast identical content across an app, and an uncapped list turns one
 * tap into a broadcast.
 */
export const ForwardMessageSchema = z.object({
  conversationIds: z.array(z.string().uuid()).min(1).max(5),
})

export type ForwardMessageInput = z.infer<typeof ForwardMessageSchema>
