import { Controller, Get, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ModerationService } from './moderation.service'
import {
  CreateReportSchema,
  ResolveReportSchema,
  ModerationReasonSchema,
  type CreateReportInput,
  type ResolveReportInput,
  type ModerationReasonInput,
} from './moderation.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const STAFF_ROLES = ['admin', 'moderator', 'super_admin']

@Controller()
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  // ── PUBLIC: report a post/comment/message/user/story ─────────────────────

  @Post('moderation/reports')
  @UseGuards(JwtAuthGuard)
  async report(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateReportInput) {
    const input = CreateReportSchema.parse(body)
    return { data: await this.moderation.createReport(user.id, input) }
  }

  // ── ADMIN: moderation queue ────────────────────────────────────────────────

  @Get('admin/moderation/reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  async queue(@Query('status') status?: string, @Query('cursor') cursor?: string) {
    return await this.moderation.listQueue(status, cursor)
  }

  @Post('admin/moderation/reports/:id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  async resolve(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: ResolveReportInput,
  ) {
    const input = ResolveReportSchema.parse(body)
    return { data: await this.moderation.resolveReport(id, user.id, input) }
  }

  // ── ADMIN: direct user actions ─────────────────────────────────────────────

  @Post('admin/users/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  @HttpCode(HttpStatus.OK)
  async suspend(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: ModerationReasonInput) {
    const input = ModerationReasonSchema.parse(body)
    await this.moderation.suspendUser(id, user.id, input.reason)
    return { data: { success: true } }
  }

  @Post('admin/users/:id/ban')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  @HttpCode(HttpStatus.OK)
  async ban(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: ModerationReasonInput) {
    const input = ModerationReasonSchema.parse(body)
    await this.moderation.banUser(id, user.id, input.reason)
    return { data: { success: true } }
  }

  @Post('admin/users/:id/reinstate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  @HttpCode(HttpStatus.OK)
  async reinstate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.moderation.reinstateUser(id, user.id)
    return { data: { success: true } }
  }

  // ── ADMIN: audit log ────────────────────────────────────────────────────────

  @Get('admin/audit-log')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF_ROLES)
  async auditLog(
    @Query('entityType') entityType?: string,
    @Query('actorId') actorId?: string,
    @Query('cursor') cursor?: string,
  ) {
    return await this.moderation.listAuditLog(entityType, actorId, cursor)
  }
}
