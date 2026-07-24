import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus, BadRequestException,
} from '@nestjs/common'
import { BreedingService } from './breeding.service'
import {
  CreateBreedingSchema, UpdateBreedingSchema, RequestSchema, RespondRequestSchema, RequestMessageSchema,
  CreateReviewSchema, CreateAlertSchema, VerifySchema, CreateLitterSchema, UpdateLitterSchema, BREEDING_SPECIES,
  type CreateBreedingInput, type UpdateBreedingInput, type RequestInput, type RespondRequestInput, type RequestMessageInput,
  type CreateReviewInput, type CreateAlertInput, type VerifyInput, type CreateLitterInput, type UpdateLitterInput, type BreedingSpecies,
} from './breeding.schemas'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('breeding')
export class BreedingController {
  constructor(private readonly breeding: BreedingService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async browse(
    @Query('species') species?: string,
    @Query('sex') sex?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('breed') breed?: string,
    @Query('registered') registered?: string,
    @Query('healthTested') healthTested?: string,
    @Query('availableNow') availableNow?: string,
    @Query('nearLat') nearLat?: string,
    @Query('nearLng') nearLng?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const lat = nearLat !== undefined ? Number(nearLat) : NaN
    const lng = nearLng !== undefined ? Number(nearLng) : NaN
    const filters = {
      ...(species && (BREEDING_SPECIES as readonly string[]).includes(species) ? { species: species as BreedingSpecies } : {}),
      ...(sex === 'male' || sex === 'female' ? { sex } : {}),
      ...(status ? { status } : {}),
      ...(q && q.trim() ? { q: q.trim() } : {}),
      ...(breed && breed.trim() ? { breed: breed.trim() } : {}),
      ...(registered === 'true' ? { registered: true } : {}),
      ...(healthTested === 'true' ? { healthTested: true } : {}),
      ...(availableNow === 'true' ? { availableNow: true } : {}),
      ...(Number.isFinite(lat) && Number.isFinite(lng) ? { nearLat: lat, nearLng: lng } : {}),
    }
    return { data: await this.breeding.browse(filters, user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  // ── Saved-search alerts (static routes — declared before :id) ──
  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  async listAlerts(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.breeding.listAlerts(user.id) }
  }

  @Post('alerts')
  @UseGuards(JwtAuthGuard)
  async createAlert(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateAlertSchema)) body: CreateAlertInput) {
    return { data: await this.breeding.createAlert(user.id, body) }
  }

  @Delete('alerts/:alertId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeAlert(@CurrentUser() user: AuthenticatedUser, @Param('alertId') alertId: string) {
    await this.breeding.removeAlert(alertId, user.id)
    return { data: { success: true } }
  }

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async createReview(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateReviewSchema)) body: CreateReviewInput) {
    return { data: await this.breeding.createReview(user.id, body) }
  }

  // ── Litters (static routes — before :id) ──
  @Get('litters')
  @UseGuards(JwtAuthGuard)
  async litters(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.breeding.listMyLitters(user.id) }
  }

  @Post('litters')
  @UseGuards(JwtAuthGuard)
  async createLitter(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateLitterSchema)) body: CreateLitterInput) {
    return { data: await this.breeding.createLitter(user.id, body) }
  }

  @Patch('litters/:litterId')
  @UseGuards(JwtAuthGuard)
  async updateLitter(@CurrentUser() user: AuthenticatedUser, @Param('litterId') litterId: string, @Body(new ZodValidationPipe(UpdateLitterSchema)) body: UpdateLitterInput) {
    return { data: await this.breeding.updateLitter(litterId, user.id, body) }
  }

  @Post('litters/:litterId/listed')
  @UseGuards(JwtAuthGuard)
  async markListed(@CurrentUser() user: AuthenticatedUser, @Param('litterId') litterId: string) {
    return { data: await this.breeding.markOffspringListed(litterId, user.id) }
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.breeding.listMine(user.id) }
  }

  @Get('matches')
  @UseGuards(JwtAuthGuard)
  async matches(@CurrentUser() user: AuthenticatedUser, @Query('petId') petId?: string) {
    if (!petId) throw new BadRequestException({ code: 'PET_REQUIRED', message: 'petId is required' })
    return { data: await this.breeding.matchesForPet(petId, user.id) }
  }

  // ── Request chat (private per-request thread) ──
  @Get('requests/:requestId/messages')
  @UseGuards(JwtAuthGuard)
  async messages(@CurrentUser() user: AuthenticatedUser, @Param('requestId') requestId: string) {
    return { data: await this.breeding.listMessages(requestId, user.id) }
  }

  @Post('requests/:requestId/messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@CurrentUser() user: AuthenticatedUser, @Param('requestId') requestId: string, @Body(new ZodValidationPipe(RequestMessageSchema)) body: RequestMessageInput) {
    return { data: await this.breeding.sendMessage(requestId, user.id, body) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.breeding.get(id, user?.id) }
  }

  @Get(':id/requests')
  @UseGuards(JwtAuthGuard)
  async requests(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.breeding.listRequests(id, user.id) }
  }

  @Get(':id/reviews')
  @UseGuards(OptionalAuthGuard)
  async reviews(@Param('id') id: string) {
    return { data: await this.breeding.listReviews(id) }
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  async verify(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(VerifySchema)) body: VerifyInput) {
    return { data: await this.breeding.verify(id, user.id, body.providerId) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateBreedingSchema)) body: CreateBreedingInput) {
    return { data: await this.breeding.create(user.id, body) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(UpdateBreedingSchema)) body: UpdateBreedingInput) {
    return { data: await this.breeding.update(id, user.id, body) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.breeding.remove(id, user.id)
    return { data: { success: true } }
  }

  @Post(':id/requests')
  @UseGuards(JwtAuthGuard)
  async request(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(RequestSchema)) body: RequestInput) {
    return { data: await this.breeding.request(id, user.id, body) }
  }

  @Patch(':id/requests/:requestId')
  @UseGuards(JwtAuthGuard)
  async respond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('requestId') requestId: string,
    @Body(new ZodValidationPipe(RespondRequestSchema)) body: RespondRequestInput,
  ) {
    return { data: await this.breeding.respondRequest(id, requestId, user.id, body) }
  }
}
