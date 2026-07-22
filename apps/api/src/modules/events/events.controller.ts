import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { EventsService } from './events.service'
import { CreateEventSchema, UpdateEventSchema, RsvpSchema, EVENT_CATEGORIES, type CreateEventInput, type UpdateEventInput, type RsvpInput } from './events.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async upcoming(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('free') free?: string,
    @Query('q') q?: string,
    @Query('mine') mine?: string,
    @Query('past') past?: string,
    @Query('nearLat') nearLat?: string,
    @Query('nearLng') nearLng?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const lat = nearLat !== undefined ? Number(nearLat) : NaN
    const lng = nearLng !== undefined ? Number(nearLng) : NaN
    const filters = {
      ...(category && (EVENT_CATEGORIES as readonly string[]).includes(category) ? { category } : {}),
      ...(free === '1' || free === 'true' ? { isFree: true } : {}),
      ...(q && q.trim() ? { q: q.trim() } : {}),
      ...(mine === '1' || mine === 'true' ? { mine: true } : {}),
      ...(past === '1' || past === 'true' ? { past: true } : {}),
      ...(Number.isFinite(lat) && Number.isFinite(lng) ? { nearLat: lat, nearLng: lng } : {}),
    }
    return { data: await this.eventsService.list(user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15, filters) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.eventsService.get(id, user?.id) }
  }

  @Get(':id/attendees')
  @UseGuards(OptionalAuthGuard)
  async attendees(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.eventsService.getAttendees(id, user?.id) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: UpdateEventInput) {
    const input = UpdateEventSchema.parse(body)
    return { data: await this.eventsService.update(id, user.id, input) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateEventInput) {
    const input = CreateEventSchema.parse(body)
    return { data: await this.eventsService.create(user.id, input) }
  }

  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  async rsvp(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: RsvpInput) {
    const input = RsvpSchema.parse(body ?? {})
    return { data: await this.eventsService.rsvp(id, user.id, input) }
  }

  @Delete(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelRsvp(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.eventsService.cancelRsvp(id, user.id) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.eventsService.remove(id, user.id)
    return { data: { success: true } }
  }
}
