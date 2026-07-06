import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { MembershipService } from './membership.service'
import { CommunitiesService } from '../communities.service'
import { CommunityRoleGuard } from './community-role.guard'
import { RequireCommunityRole } from './community-role.decorator'
import { JoinSchema, SetRoleSchema, MuteSchema, type JoinInput, type SetRoleInput, type MuteInput } from '../communities.schemas'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { RateLimit } from '../../common/decorators/rate-limit.decorator'

@Controller('communities/:id')
export class MembershipController {
  constructor(
    private readonly membership: MembershipService,
    private readonly communities: CommunitiesService,
  ) {}

  // ── Join / Leave ───────────────────────────────────────────────────────────

  @Post('join')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 20, windowSeconds: 3600, prefix: 'community.join' })
  @HttpCode(HttpStatus.OK)
  async join(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(JoinSchema)) body: JoinInput,
  ) {
    return { data: await this.membership.join(user.id, id, body.acceptRules) }
  }

  @Delete('join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async leave(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.membership.leave(user.id, id)
    return { data: { success: true } }
  }

  // ── Members list (privacy-gated) ───────────────────────────────────────────

  @Get('members')
  @UseGuards(JwtAuthGuard)
  async members(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('role') role?: string,
    @Query('cursor') cursor?: string,
  ) {
    // Private communities: members-only visibility
    const community = await this.communities.getById(id, user.id)
    if (community.privacy !== 'public' && community.viewerStatus !== 'active') {
      return { data: { data: [], nextCursor: null, hasMore: false } }
    }
    return { data: await this.membership.listMembers(id, role, cursor ?? null) }
  }

  // ── Requests (admin+) ──────────────────────────────────────────────────────

  @Get('requests')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  async requests(@Param('id') id: string, @Query('cursor') cursor?: string) {
    return { data: await this.membership.listRequests(id, cursor ?? null) }
  }

  @Post('requests/:userId/approve')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Param('userId') userId: string) {
    await this.membership.respondToRequest(id, userId, 'approve')
    return { data: { success: true } }
  }

  @Post('requests/:userId/reject')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Param('userId') userId: string) {
    await this.membership.respondToRequest(id, userId, 'reject')
    return { data: { success: true } }
  }

  @Post('requests/:userId/block')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async block(@Param('id') id: string, @Param('userId') userId: string) {
    await this.membership.respondToRequest(id, userId, 'block')
    return { data: { success: true } }
  }

  // ── Member management ──────────────────────────────────────────────────────

  @Post('members/:userId/role')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async setRole(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(SetRoleSchema)) body: SetRoleInput,
  ) {
    const me = await this.communities.getMembershipRow(id, user.id)
    await this.membership.setRole(id, me?.role ?? 'member', userId, body.role)
    return { data: { success: true } }
  }

  @Post('members/:userId/remove')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const me = await this.communities.getMembershipRow(id, user.id)
    await this.membership.removeMember(id, me?.role ?? 'member', userId, false)
    return { data: { success: true } }
  }

  @Post('members/:userId/ban')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async ban(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const me = await this.communities.getMembershipRow(id, user.id)
    await this.membership.removeMember(id, me?.role ?? 'member', userId, true)
    return { data: { success: true } }
  }

  @Delete('members/:userId/ban')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async unban(@Param('id') id: string, @Param('userId') userId: string) {
    await this.membership.unban(id, userId)
    return { data: { success: true } }
  }

  @Post('members/:userId/mute')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('moderator')
  @HttpCode(HttpStatus.OK)
  async mute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(MuteSchema)) body: MuteInput,
  ) {
    const me = await this.communities.getMembershipRow(id, user.id)
    await this.membership.setMute(id, me?.role ?? 'member', userId, body.duration)
    return { data: { success: true } }
  }

  @Delete('members/:userId/mute')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('moderator')
  @HttpCode(HttpStatus.OK)
  async unmute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const me = await this.communities.getMembershipRow(id, user.id)
    await this.membership.setMute(id, me?.role ?? 'member', userId, null)
    return { data: { success: true } }
  }
}
