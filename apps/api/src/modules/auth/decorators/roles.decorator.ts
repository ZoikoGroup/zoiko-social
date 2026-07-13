import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/**
 * Restricts a route to the given Profile.role values. Must be paired with
 * @UseGuards(JwtAuthGuard, RolesGuard) — RolesGuard reads this metadata.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('admin', 'moderator')
 *   @Get('admin/moderation/reports')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
