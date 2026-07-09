import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus, BadRequestException,
} from '@nestjs/common'
import { ProvidersService } from './providers.service'
import {
  CreateProviderSchema, UpdateProviderSchema, type CreateProviderInput, type UpdateProviderInput,
} from './providers.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

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
}
