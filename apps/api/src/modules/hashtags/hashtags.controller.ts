import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { HashtagsService } from './hashtags.service'
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

  @Get('search')
  async search(@Query('q') q?: string) {
    const result = await this.hashtagsService.search(q ?? '')
    return { data: result }
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
}
