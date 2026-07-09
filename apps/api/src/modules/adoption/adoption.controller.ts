import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { AdoptionService } from './adoption.service'
import {
  CreateListingSchema, UpdateListingSchema, EnquirySchema, RespondEnquirySchema,
  type CreateListingInput, type UpdateListingInput, type EnquiryInput, type RespondEnquiryInput,
} from './adoption.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('adoption')
export class AdoptionController {
  constructor(private readonly adoption: AdoptionService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async browse(
    @Query('species') species?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const filters = {
      ...(species ? { species } : {}),
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
    }
    return { data: await this.adoption.browse(user?.id, filters, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.adoption.get(id, user?.id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateListingInput) {
    return { data: await this.adoption.create(user.id, CreateListingSchema.parse(body)) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: UpdateListingInput) {
    return { data: await this.adoption.update(id, user.id, UpdateListingSchema.parse(body)) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.adoption.remove(id, user.id)
    return { data: { success: true } }
  }

  // ── Enquiries ──
  @Post(':id/enquiries')
  @UseGuards(JwtAuthGuard)
  async enquire(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: EnquiryInput) {
    return { data: await this.adoption.enquire(id, user.id, EnquirySchema.parse(body ?? {})) }
  }

  @Get(':id/enquiries')
  @UseGuards(JwtAuthGuard)
  async enquiries(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.adoption.listEnquiries(id, user.id) }
  }

  @Patch(':id/enquiries/:enquiryId')
  @UseGuards(JwtAuthGuard)
  async respond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('enquiryId') enquiryId: string,
    @Body() body: RespondEnquiryInput,
  ) {
    return { data: await this.adoption.respondEnquiry(id, enquiryId, user.id, RespondEnquirySchema.parse(body)) }
  }
}
