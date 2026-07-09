import {
  Controller, Get, Post, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { EventsService } from './events.service'
import { CreateEventSchema, RsvpSchema, type CreateEventInput, type RsvpInput } from './events.schemas'
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
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return { data: await this.eventsService.listUpcoming(user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.eventsService.get(id, user?.id) }
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
