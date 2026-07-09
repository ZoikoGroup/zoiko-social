import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { BreedingService } from './breeding.service'
import {
  CreateBreedingSchema, UpdateBreedingSchema, RequestSchema, RespondRequestSchema, BREEDING_SPECIES,
  type CreateBreedingInput, type UpdateBreedingInput, type RequestInput, type RespondRequestInput, type BreedingSpecies,
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
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const filters = {
      ...(species && (BREEDING_SPECIES as readonly string[]).includes(species) ? { species: species as BreedingSpecies } : {}),
      ...(sex === 'male' || sex === 'female' ? { sex } : {}),
      ...(status ? { status } : {}),
      ...(q && q.trim() ? { q: q.trim() } : {}),
    }
    return { data: await this.breeding.browse(filters, user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
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
