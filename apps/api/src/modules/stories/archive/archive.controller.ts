import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ArchiveService, type ArchivePage } from './archive.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'

@Controller('me/archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  /**
   * GET /me/archive?cursor=&limit=
   * Owner-only archive of expired stories, newest-first.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: ArchivePage }> {
    const result = await this.archiveService.listArchive(
      user.id,
      cursor,
      limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 20,
    )
    return { data: result }
  }

  /**
   * POST /me/archive/:storyId/restore
   * Restore an archived story to a highlight.
   */
  @Post(':storyId/restore')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async restore(
    @CurrentUser() user: AuthenticatedUser,
    @Param('storyId') storyId: string,
    @Body() body: { highlightId: string },
  ): Promise<{ data: { success: boolean } }> {
    const result = await this.archiveService.restoreToHighlight(storyId, body.highlightId, user.id)
    return { data: result }
  }

  /**
   * DELETE /me/archive/:storyId
   * Permanently delete an archived story (must not be in a highlight).
   */
  @Delete(':storyId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('storyId') storyId: string,
  ): Promise<{ data: { success: boolean } }> {
    await this.archiveService.permanentDelete(storyId, user.id)
    return { data: { success: true } }
  }
}
