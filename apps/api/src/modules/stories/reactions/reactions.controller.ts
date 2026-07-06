import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { StoryReactionSchema, StoryReportSchema, type StoryReactionInput, type StoryReportInput } from '../stories.schemas'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { RateLimit } from '../../common/decorators/rate-limit.decorator'

@Controller('stories')
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
  ) {}

  /**
   * POST /stories/:id/react
   * Record a reaction. Rate-limited to 100 per hour per user.
   */
  @Post(':id/react')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 100, windowSeconds: 3600, prefix: 'story.react' })
  @HttpCode(HttpStatus.OK)
  async react(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(StoryReactionSchema)) body: StoryReactionInput,
  ) {
    const result = await this.reactionsService.react(id, user.id, body)
    return { data: result }
  }

  /**
   * POST /stories/:id/report
   * Submit a moderation report. Rate-limited to 10 per hour per user.
   */
  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 10, windowSeconds: 3600, prefix: 'story.report' })
  @HttpCode(HttpStatus.OK)
  async report(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(StoryReportSchema)) body: StoryReportInput,
  ) {
    const result = await this.reactionsService.report(id, user.id, body)
    return { data: result }
  }

  /**
   * GET /stories/:id/reactions
   * List reactions, newest-first. Author-only. Cursor-paginated.
   * Optional ?kind filter: emoji, quick_reply, share, report.
   */
  @Get(':id/reactions')
  @UseGuards(JwtAuthGuard)
  async getReactions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('kind') kind?: string,
  ) {
    const result = await this.reactionsService.getReactions(
      id,
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 20,
      kind,
    )
    return { data: result }
  }

  /**
   * GET /stories/:id/reactions/counts
   * Aggregated reaction counts by kind. Public — no auth required.
   */
  @Get(':id/reactions/counts')
  @UseGuards(OptionalAuthGuard)
  async getReactionCounts(
    @CurrentUser() user: AuthenticatedUser | null,
    @Param('id') id: string,
  ) {
    // Optional auth so cached counts work for logged-out viewers too
    const result = await this.reactionsService.getReactionCounts(id)
    return { data: result }
  }
}
