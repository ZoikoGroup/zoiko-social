import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { HashtagsService } from './hashtags.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('trending')
  async trending() {
    const result = await this.hashtagsService.trending()
    return { data: result }
  }

  /** Personalized "Topics for you" rail — top tags by the viewer's affinity. */
  @Get('for-you')
  @UseGuards(JwtAuthGuard)
  async forYou(@CurrentUser() user: AuthenticatedUser, @Query('limit') limit?: string) {
    const result = await this.hashtagsService.forYou(user.id, limit ? parseInt(limit, 10) : 12)
    return { data: result }
  }

  @Get('search')
  async search(@Query('q') q?: string, @Query('limit') limit?: string) {
    const result = await this.hashtagsService.search(q ?? '', limit ? parseInt(limit, 10) : 15)
    return { data: result }
  }

  /**
   * Everything else carrying this tag — adoption listings, lost & found reports,
   * events, products and communities. Posts and stories keep their own
   * paginated routes; this is the preview that makes a tag page whole.
   */
  @Get(':tag/everything')
  @UseGuards(OptionalAuthGuard)
  async everything(@Param('tag') tag: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.hashtagsService.everythingByTag(tag, user?.id) }
  }

  @Get(':tag/posts')
  @UseGuards(OptionalAuthGuard)
  async posts(
    @Param('tag') tag: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.hashtagsService.postsByTag(
      tag,
      user?.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 12,
    )
    return { data: result }
  }

  @Get(':tag/stories')
  @UseGuards(OptionalAuthGuard)
  async stories(
    @Param('tag') tag: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.hashtagsService.storiesByTag(
      tag,
      user?.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 12,
    )
    return { data: result }
  }
}
