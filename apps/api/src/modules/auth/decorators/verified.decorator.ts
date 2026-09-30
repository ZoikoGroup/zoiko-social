import { SetMetadata } from '@nestjs/common'

export type VerificationScope = 'identity' | 'organization' | 'credential' | 'publisher'

export const VERIFICATION_SCOPES_KEY = 'verification_scopes'

/**
 * Restricts a route to users who have an 'approved' status for specific verification scopes.
 * If multiple scopes are provided, the user must have AT LEAST ONE of them approved.
 * 
 * Must be paired with JwtAuthGuard and VerifiedGuard.
 * 
 * Usage:
 *   @UseGuards(JwtAuthGuard, VerifiedGuard)
 *   @RequireVerified('identity')
 *   // or
 *   @RequireVerified('identity', 'organization')
 */
export const RequireVerified = (...scopes: VerificationScope[]) => SetMetadata(VERIFICATION_SCOPES_KEY, scopes)
