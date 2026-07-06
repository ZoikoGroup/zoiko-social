import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { HighlightsService, type HighlightResponse, type HighlightSummary } from './highlights.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'
import { RateLimit } from '../../common/decorators/rate-limit.decorator'

@Controller()
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  /**
   * POST /highlights
   * Create a new highlight collection.
   */
  @Post('highlights')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 20, windowSeconds: 3600, prefix: 'highlights.create' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { title: string; coverUrl?: string },
  ): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.create(user.id, body.title, body.coverUrl)
    return { data: result }
  }

  /**
   * GET /highlights/:id
   * Get a single highlight with its items.
   */
  @Get('highlights/:id')
  @UseGuards(OptionalAuthGuard)
  async getHighlight(@Param('id') id: string): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.getHighlight(id)
    return { data: result }
  }

  /**
   * PATCH /highlights/:id
   * Update highlight title/cover.
   */
  @Patch('highlights/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { title?: string; coverUrl?: string | null },
  ): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.update(id, user.id, body)
    return { data: result }
  }

  /**
   * DELETE /highlights/:id
   * Delete a highlight collection (items cascade).
   */
  @Delete('highlights/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<{ data: { success: boolean } }> {
    await this.highlightsService.delete(id, user.id)
    return { data: { success: true } }
  }

  /**
   * POST /highlights/:id/items
   * Add a story to a highlight.
   */
  @Post('highlights/:id/items')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 60, windowSeconds: 3600, prefix: 'highlights.add-item' })
  @HttpCode(HttpStatus.CREATED)
  async addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { archivedStoryId: string },
  ): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.addItem(id, user.id, body.archivedStoryId)
    return { data: result }
  }

  /**
   * DELETE /highlights/:id/items/:itemId
   * Remove a story from a highlight.
   */
  @Delete('highlights/:id/items/:itemId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.removeItem(id, itemId, user.id)
    return { data: result }
  }

  /**
   * PATCH /highlights/:id/reorder
   * Reorder items in a highlight.
   */
  @Patch('highlights/:id/reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { itemIds: string[] },
  ): Promise<{ data: HighlightResponse }> {
    const result = await this.highlightsService.reorderItems(id, user.id, body.itemIds)
    return { data: result }
  }

  /**
   * GET /profiles/:profileId/highlights
   * Public highlights list for a profile page.
   */
  @Get('profiles/:profileId/highlights')
  @UseGuards(OptionalAuthGuard)
  async profileHighlights(
    @Param('profileId') profileId: string,
  ): Promise<{ data: HighlightSummary[] }> {
    const result = await this.highlightsService.getProfileHighlights(profileId)
    return { data: result }
  }
}
