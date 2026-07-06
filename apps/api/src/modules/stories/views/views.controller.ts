import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ViewsService } from './views.service'
import { StoryViewSchema, type StoryViewInput } from '../stories.schemas'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { RateLimit } from '../../common/decorators/rate-limit.decorator'

@Controller('stories')
export class ViewsController {
  constructor(
    private readonly viewsService: ViewsService,
  ) {}

  /**
   * POST /stories/:id/view
   * Record a view. Idempotent — UPSERT on (story_id, viewer_id).
   * completion_pct is the max fraction watched (0–100).
   */
  @Post(':id/view')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 200, windowSeconds: 3600, prefix: 'story.view' })
  @HttpCode(HttpStatus.OK)
  async recordView(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(StoryViewSchema)) body: StoryViewInput,
  ) {
    await this.viewsService.recordView(id, user.id, body)
    return { data: { success: true } }
  }

  /**
   * GET /stories/:id/viewers
   * List viewers, newest-first. Author-only. Cursor-paginated.
   */
  @Get(':id/viewers')
  @UseGuards(JwtAuthGuard)
  async getViewers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.viewsService.getViewers(
      id,
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  /**
   * POST /stories/:id/viewer/profile-visit
   * Marks that the viewer tapped the author's avatar during this session.
   * Used in pro insights to track profile visits from stories.
   * Idempotent.
   */
  @Post(':id/viewer/profile-visit')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 100, windowSeconds: 3600, prefix: 'story.profile-visit' })
  @HttpCode(HttpStatus.OK)
  async recordProfileVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.viewsService.recordProfileVisit(id, user.id)
    return { data: { success: true } }
  }

  /**
   * GET /stories/:id/insights
   * Aggregated analytics for a story. Author-only.
   * Basic: views, impressions, completion distribution.
   * Pro accounts also get: reach (segment-group distinct), engagement rate.
   */
  @Get(':id/insights')
  @UseGuards(JwtAuthGuard)
  async getInsights(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const result = await this.viewsService.getInsights(id, user.id)
    return { data: result }
  }
}
