import {
  Controller, Get, Post, Delete, Body, Param,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { z } from 'zod'
import { InvitesService } from './invites.service'
import { CommunityRoleGuard } from '../membership/community-role.guard'
import { RequireCommunityRole } from '../membership/community-role.decorator'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { RateLimit } from '../../common/decorators/rate-limit.decorator'

const InviteBodySchema = z.union([
  z.object({ username: z.string().trim().min(3).max(30) }),
  z.object({
    type: z.literal('link'),
    expiresInDays: z.number().int().min(1).max(30).optional(),
    maxUses: z.number().int().positive().max(1000).optional(),
  }),
])

const AcceptSchema = z.object({ acceptRules: z.boolean().optional() })

@Controller('communities/:id/invites')
export class CommunityInvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @RateLimit({ limit: 30, windowSeconds: 3600, prefix: 'community.invite' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(InviteBodySchema)) body: { username: string } | { type: 'link'; expiresInDays?: number; maxUses?: number },
  ) {
    if ('username' in body) {
      return { data: await this.invites.inviteByUsername(id, user.id, body.username) }
    }
    return { data: await this.invites.createLink(id, user.id, { expiresInDays: body.expiresInDays, maxUses: body.maxUses }) }
  }

  @Get()
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  async list(@Param('id') id: string) {
    return { data: await this.invites.listInvites(id) }
  }

  @Delete(':inviteId')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  @HttpCode(HttpStatus.OK)
  async revoke(@Param('inviteId') inviteId: string) {
    await this.invites.revoke(inviteId)
    return { data: { success: true } }
  }
}

@Controller('invites')
export class InviteRedeemController {
  constructor(private readonly invites: InvitesService) {}

  @Get(':code')
  @UseGuards(JwtAuthGuard)
  async preview(@Param('code') code: string) {
    return { data: await this.invites.previewByCode(code) }
  }

  @Post(':code/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async accept(
    @CurrentUser() user: AuthenticatedUser,
    @Param('code') code: string,
    @Body(new ZodValidationPipe(AcceptSchema)) body: { acceptRules?: boolean },
  ) {
    return { data: await this.invites.acceptByCode(code, user.id, body.acceptRules) }
  }
}
