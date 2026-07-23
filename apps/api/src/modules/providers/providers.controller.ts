import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus, BadRequestException,
} from '@nestjs/common'
import { ProvidersService } from './providers.service'
import {
  CreateProviderSchema, UpdateProviderSchema, type CreateProviderInput, type UpdateProviderInput,
  CreateServiceSchema, UpdateServiceSchema, type CreateServiceInput, type UpdateServiceInput,
  CreateBookingSchema, UpdateBookingStatusSchema, type CreateBookingInput, type UpdateBookingStatusInput,
  CreateAvailabilitySchema, type CreateAvailabilityInput,
  CreateReviewSchema, type CreateReviewInput,
} from './providers.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

  // ════════════════════════════════════════════════════════════════════════════
  // PROVIDERS (existing)
  // ════════════════════════════════════════════════════════════════════════════

  @Get()
  async browse(
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('location') location?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    if (category !== 'vet' && category !== 'pet_care') {
      throw new BadRequestException({ code: 'INVALID_CATEGORY', message: 'category must be vet or pet_care' })
    }
    const filters = { ...(q ? { q } : {}), ...(location ? { location } : {}) }
    return { data: await this.providers.browse(category, filters, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.providers.listMine(user.id) }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { data: await this.providers.get(id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateProviderInput) {
    return { data: await this.providers.create(user.id, CreateProviderSchema.parse(body)) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: UpdateProviderInput) {
    return { data: await this.providers.update(id, user.id, UpdateProviderSchema.parse(body)) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.providers.remove(id, user.id)
    return { data: { success: true } }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PET CARE SERVICES
  // ════════════════════════════════════════════════════════════════════════════

  @Get(':id/services')
  @UseGuards(OptionalAuthGuard)
  async listServices(@Param('id') id: string) {
    return { data: await this.providers.listServices(id) }
  }

  @Post(':id/services')
  @UseGuards(JwtAuthGuard)
  async createService(@CurrentUser() user: AuthenticatedUser, @Param('id') providerId: string, @Body() body: CreateServiceInput) {
    return { data: await this.providers.createService(user.id, CreateServiceSchema.parse({ ...body, providerId })) }
  }

  @Patch(':providerId/services/:serviceId')
  @UseGuards(JwtAuthGuard)
  async updateService(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId') serviceId: string,
    @Body() body: UpdateServiceInput,
  ) {
    return { data: await this.providers.updateService(serviceId, user.id, UpdateServiceSchema.parse(body)) }
  }

  @Delete(':providerId/services/:serviceId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeService(@CurrentUser() user: AuthenticatedUser, @Param('serviceId') serviceId: string) {
    await this.providers.removeService(serviceId, user.id)
    return { data: { success: true } }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BOOKINGS
  // ════════════════════════════════════════════════════════════════════════════

  @Get('bookings/list')
  @UseGuards(JwtAuthGuard)
  async listBookings(
    @CurrentUser() user: AuthenticatedUser,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return {
      data: await this.providers.listBookings(
        user.id,
        role === 'provider' ? 'provider' : 'seeker',
        status ?? undefined,
        cursor ?? null,
        limit ? parseInt(limit, 10) : 15,
      ),
    }
  }

  @Get('bookings/:id')
  @UseGuards(JwtAuthGuard)
  async getBooking(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.providers.getBooking(id, user.id) }
  }

  @Post('bookings')
  @UseGuards(JwtAuthGuard)
  async createBooking(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateBookingInput) {
    return { data: await this.providers.createBooking(user.id, CreateBookingSchema.parse(body)) }
  }

  @Patch('bookings/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: UpdateBookingStatusInput,
  ) {
    return { data: await this.providers.updateBookingStatus(id, user.id, UpdateBookingStatusSchema.parse(body)) }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // AVAILABILITY
  // ════════════════════════════════════════════════════════════════════════════

  @Get(':id/availability')
  @UseGuards(OptionalAuthGuard)
  async listAvailability(@Param('id') id: string) {
    return { data: await this.providers.listAvailability(id) }
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard)
  async createAvailability(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateAvailabilityInput) {
    return { data: await this.providers.createAvailability(user.id, CreateAvailabilitySchema.parse(body)) }
  }

  @Delete('availability/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeAvailability(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.providers.removeAvailability(id, user.id)
    return { data: { success: true } }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REVIEWS
  // ════════════════════════════════════════════════════════════════════════════

  @Get(':id/reviews')
  @UseGuards(OptionalAuthGuard)
  async listReviews(@Param('id') id: string) {
    return { data: await this.providers.listReviews(id) }
  }

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async createReview(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateReviewInput) {
    return { data: await this.providers.createReview(user.id, CreateReviewSchema.parse(body)) }
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteReview(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.providers.deleteReview(id, user.id)
    return { data: { success: true } }
  }
}
