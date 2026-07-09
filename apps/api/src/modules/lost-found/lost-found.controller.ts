import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { LostFoundService } from './lost-found.service'
import {
  CreateReportSchema, UpdateReportSchema, SightingSchema,
  type CreateReportInput, type UpdateReportInput, type SightingInput,
} from './lost-found.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly lostFound: LostFoundService) {}

  @Get()
  async browse(
    @Query('kind') kind?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      ...(kind === 'lost' || kind === 'found' ? { kind } : {}),
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
    }
    return { data: await this.lostFound.browse(filters, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { data: await this.lostFound.get(id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateReportInput) {
    return { data: await this.lostFound.create(user.id, CreateReportSchema.parse(body)) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: UpdateReportInput) {
    return { data: await this.lostFound.update(id, user.id, UpdateReportSchema.parse(body)) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.lostFound.remove(id, user.id)
    return { data: { success: true } }
  }

  @Post(':id/sightings')
  @UseGuards(JwtAuthGuard)
  async addSighting(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: SightingInput) {
    return { data: await this.lostFound.addSighting(id, user.id, SightingSchema.parse(body)) }
  }

  @Get(':id/sightings')
  async sightings(@Param('id') id: string) {
    return { data: await this.lostFound.listSightings(id) }
  }
}
