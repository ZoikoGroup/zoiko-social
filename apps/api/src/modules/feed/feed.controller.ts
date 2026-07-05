import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { FeedService } from './feed.service'
import { PostsService } from '../posts/posts.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async home(
    @CurrentUser() user: AuthenticatedUser,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.feedService.getHomeFeed(
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 15,
    )
    return { data: result }
  }
}

/** Profile post grids — lives here to keep the profile module untouched. */
@Controller('profiles')
export class ProfilePostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id/posts')
  @UseGuards(OptionalAuthGuard)
  async profilePosts(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('mediaOnly') mediaOnly?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.postsService.getProfilePosts(
      id,
      user?.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 12,
      mediaOnly === '1' || mediaOnly === 'true',
    )
    return { data: result }
  }
}
