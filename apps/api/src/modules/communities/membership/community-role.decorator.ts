import { SetMetadata } from '@nestjs/common'
import type { CommunityRole } from '@prisma/client'

export const COMMUNITY_ROLE_KEY = 'community_role'

/**
 * Requires the caller to hold at least `minRole` in the community identified
 * by the `:id` (or `:communityId`) route param. Enforced by CommunityRoleGuard.
 */
export const RequireCommunityRole = (minRole: CommunityRole) =>
  SetMetadata(COMMUNITY_ROLE_KEY, minRole)
