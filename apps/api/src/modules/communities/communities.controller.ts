import {
  Controller, Get, Post, Patch, Put, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { CommunitiesService } from './communities.service'
import { MembershipService } from './membership/membership.service'
import { CommunityRoleGuard } from './membership/community-role.guard'
import { RequireCommunityRole } from './membership/community-role.decorator'
import {
  CreateCommunitySchema, UpdateCommunitySchema, UpdateRulesSchema, TransferOwnershipSchema,
  type CreateCommunityInput, type UpdateCommunityInput, type UpdateRulesInput,
} from './communities.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { RateLimit } from '../common/decorators/rate-limit.decorator'

@Controller('communities')
export class CommunitiesController {
  constructor(
    private readonly communities: CommunitiesService,
    private readonly membership: MembershipService,
  ) {}

  // ── Discovery ──────────────────────────────────────────────────────────────

  @Get()
  @UseGuards(OptionalAuthGuard)
  async browse(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('cursor') cursor?: string,
  ) {
    const result = await this.communities.browse(user?.id, { q, category, sort, cursor: cursor ?? null })
    return { data: result }
  }

  @Get('categories')
  async categories() {
    return { data: await this.communities.getCategories() }
  }

  @Get('slug-available')
  async slugAvailable(@Query('slug') slug: string) {
    return { data: await this.communities.checkSlug(slug ?? '') }
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 20, windowSeconds: 3600, prefix: 'community.create' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateCommunitySchema)) body: CreateCommunityInput,
  ) {
    return { data: await this.communities.create(user.id, body) }
  }

  @Get(':slug')
  @UseGuards(OptionalAuthGuard)
  async getBySlug(@Param('slug') slug: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.communities.getBySlug(slug, user?.id) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCommunitySchema)) body: UpdateCommunityInput,
  ) {
    return { data: await this.communities.update(id, body) }
  }

  @Put(':id/rules')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('admin')
  async updateRules(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRulesSchema)) body: UpdateRulesInput,
  ) {
    await this.communities.updateRules(id, body.rules)
    return { data: { success: true } }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('owner')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.communities.remove(id)
    return { data: { success: true } }
  }

  @Post(':id/transfer-ownership')
  @UseGuards(JwtAuthGuard, CommunityRoleGuard)
  @RequireCommunityRole('owner')
  @HttpCode(HttpStatus.OK)
  async transfer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TransferOwnershipSchema)) body: { userId: string },
  ) {
    await this.membership.transferOwnership(id, user.id, body.userId)
    return { data: { success: true } }
  }
}

@Controller('me')
export class MyCommunitiesController {
  constructor(private readonly communities: CommunitiesService) {}

  @Get('communities')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.communities.getMyCommunities(user.id) }
  }
}
