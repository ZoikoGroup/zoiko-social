import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { AdminService, type Role } from './admin.service'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const SetRoleSchema = z.object({
  role: z.enum(['super_admin', 'admin', 'moderator', 'user']),
})
type SetRoleInput = z.infer<typeof SetRoleSchema>

/**
 * The admin console's own endpoints.
 *
 * Reading is open to any staff member; changing a role is not. The service
 * enforces the privilege ladder on top of this — the guard only decides who may
 * attempt it at all.
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  @Roles('moderator', 'admin', 'super_admin')
  async stats() {
    return { data: await this.admin.stats() }
  }

  @Get('users')
  @Roles('moderator', 'admin', 'super_admin')
  async users(
    @Query('q') q?: string,
    @Query('role') role?: string,
    @Query('state') state?: string,
  ) {
    return {
      data: await this.admin.listUsers({
        ...(q ? { q } : {}),
        ...(role ? { role } : {}),
        ...(state ? { state } : {}),
      }),
    }
  }

  /** Admin and above only — a moderator cannot appoint anyone. */
  @Patch('users/:id/role')
  @Roles('admin', 'super_admin')
  async setRole(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(SetRoleSchema)) body: SetRoleInput,
  ) {
    return { data: await this.admin.setRole(user.id, id, body.role as Role) }
  }
}
