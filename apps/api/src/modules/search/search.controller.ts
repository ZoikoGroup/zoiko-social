import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { SearchService } from './search.service'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

function parseLimit(limit: string | undefined, fallback = 20): number {
  const n = limit ? parseInt(limit, 10) : fallback
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/**
 * Search serves signed-out visitors too. Every handler already treats the viewer
 * as optional and every service method takes `viewerId: string | undefined` — the
 * viewer only ever narrows results (blocks, mutes, private accounts), so its
 * absence widens nothing it shouldn't.
 */
@Controller('search')
@UseGuards(OptionalAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /** Combined preview across every category — powers the unified search page's "All" tab. */
  @Get()
  async all(@Query('q') q?: string, @CurrentUser() user?: AuthenticatedUser) {
    const result = await this.searchService.searchAll(user?.id, q ?? '')
    return { data: result }
  }

  @Get('people')
  async people(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchPeople(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('hashtags')
  async hashtags(@Query('q') q?: string, @Query('limit') limit?: string) {
    const result = await this.searchService.searchHashtags(q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('posts')
  async posts(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchPosts(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('communities')
  async communities(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchCommunities(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('news')
  async news(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchNews(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('products')
  async products(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchProducts(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('events')
  async events(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchEvents(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('adoption')
  async adoption(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.searchService.searchAdoption(user?.id, q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('lost-found')
  async lostFound(@Query('q') q?: string, @Query('limit') limit?: string) {
    const result = await this.searchService.searchLostFound(q ?? '', parseLimit(limit))
    return { data: result }
  }

  @Get('providers')
  async providers(@Query('q') q?: string, @Query('limit') limit?: string) {
    const result = await this.searchService.searchProviders(q ?? '', parseLimit(limit))
    return { data: result }
  }
}
