import { z } from 'zod'

/**
 * What can be reported.
 *
 * The pet surfaces were missing, which meant a suspicious adoption listing, a
 * fake lost-pet report claiming a reward, an unlicensed breeder or a
 * misrepresented clinic could not be flagged at all — on a platform whose
 * report reasons include `animal_welfare`. Those are exactly the listings where
 * a member is the only person in a position to notice.
 */
export const ReportTargetType = z.enum([
  'post', 'comment', 'message', 'user', 'story',
  'adoption_listing', 'lost_found_report', 'event', 'product', 'provider',
  'breeding_profile', 'community',
])
export const ReportReason = z.enum(['spam', 'harassment', 'abuse', 'animal_welfare', 'impersonation', 'other'])
export const ResolveAction = z.enum(['dismiss', 'remove_content', 'warn', 'suspend', 'ban'])

export const CreateReportSchema = z.object({
  targetType: ReportTargetType,
  targetId: z.string().uuid(),
  reason: ReportReason,
  note: z.string().max(1000).optional(),
})
export type CreateReportInput = z.infer<typeof CreateReportSchema>

export const ResolveReportSchema = z.object({
  action: ResolveAction,
  note: z.string().max(1000).optional(),
})
export type ResolveReportInput = z.infer<typeof ResolveReportSchema>

export const ModerationReasonSchema = z.object({
  reason: z.string().min(1).max(500),
})
export type ModerationReasonInput = z.infer<typeof ModerationReasonSchema>

export const ReportQueueQuerySchema = z.object({
  status: z.enum(['open', 'actioned', 'dismissed']).optional(),
  cursor: z.string().optional(),
})
export type ReportQueueQuery = z.infer<typeof ReportQueueQuerySchema>
