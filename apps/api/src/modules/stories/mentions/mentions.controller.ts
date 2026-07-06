import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { MentionsService } from './mentions.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'

@Controller()
export class MentionsController {
  constructor(
    private readonly mentionsService: MentionsService,
  ) {}

  /**
   * GET /stories/:id/mentions
   * List users mentioned in a story. Author-only.
   */
  @Get('stories/:id/mentions')
  @UseGuards(JwtAuthGuard)
  async getStoryMentions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const result = await this.mentionsService.getStoryMentions(id, user.id)
    return { data: result }
  }

  /**
   * GET /me/story-mentions
   * Stories where the current user was mentioned. Privacy-gated.
   * Cursor-paginated.
   */
  @Get('me/story-mentions')
  @UseGuards(JwtAuthGuard)
  async getMyMentions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.mentionsService.getMyMentions(
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }
}
