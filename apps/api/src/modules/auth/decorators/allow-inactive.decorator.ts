import { SetMetadata } from '@nestjs/common'

export const ALLOW_INACTIVE_ACCOUNT = 'allowInactiveAccount'

/**
 * Lets a route run for an account whose state is not `active`.
 *
 * JwtAuthGuard otherwise refuses every request from a deactivated or
 * pending-deletion account, which is what made restoring one impossible to do
 * deliberately: there was nowhere to put a "reactivate" endpoint, so signing in
 * had to perform the restore silently as a side effect.
 *
 * Use on reactivation only. It weakens the guard's central invariant, so a route
 * carrying it must read and write nothing but the caller's own account state —
 * never other members' data, and never anything a suspension is meant to stop.
 * Moderator-imposed states (suspended, banned, deleted) are still refused here;
 * this covers the two the member chose themselves.
 */
export const AllowInactiveAccount = () => SetMetadata(ALLOW_INACTIVE_ACCOUNT, true)
