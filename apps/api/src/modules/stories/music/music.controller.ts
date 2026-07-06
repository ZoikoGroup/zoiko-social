import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { MusicService, type MusicSearchResult, type MusicBrowseResult, type MusicTrendingItem } from './music.service'
import type { MusicTrackMeta } from './providers/music-provider.interface'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  /**
   * GET /music/search?q=&mood=&category=&genre=&page=&limit=
   * Full-text search against title + artist with optional facet filters.
   */
  @Get('search')
  @UseGuards(OptionalAuthGuard)
  async search(
    @Query('q') q?: string,
    @Query('mood') mood?: string,
    @Query('category') category?: string,
    @Query('genre') genre?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: MusicSearchResult }> {
    const result = await this.musicService.search(
      { q, mood, category, genre },
      page ? Math.max(1, parseInt(page, 10)) : 1,
      limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 30,
    )
    return { data: result }
  }

  /**
   * GET /music/browse?mood=&category=&genre=&offset=&limit=
   * Faceted browse without query text — cursor-paginated (offset-based).
   */
  @Get('browse')
  @UseGuards(OptionalAuthGuard)
  async browse(
    @Query('mood') mood?: string,
    @Query('category') category?: string,
    @Query('genre') genre?: string,
    @Query('minDurationMs') minDurationMs?: string,
    @Query('maxDurationMs') maxDurationMs?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: MusicBrowseResult }> {
    const result = await this.musicService.browse(
      {
        mood,
        category,
        genre,
        minDurationMs: minDurationMs ? parseInt(minDurationMs, 10) : undefined,
        maxDurationMs: maxDurationMs ? parseInt(maxDurationMs, 10) : undefined,
      },
      offset ? Math.max(0, parseInt(offset, 10)) : 0,
      limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 30,
    )
    return { data: result }
  }

  /**
   * GET /music/trending?limit=
   * Most-used tracks in stories over the last 48h.
   */
  @Get('trending')
  @UseGuards(OptionalAuthGuard)
  async trending(
    @Query('limit') limit?: string,
  ): Promise<{ data: MusicTrendingItem[] }> {
    const result = await this.musicService.getTrending(
      limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 20,
    )
    return { data: result }
  }

  /**
   * GET /music/:id
   * Single track metadata (24h cached).
   */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async getTrack(@Param('id') id: string): Promise<{ data: MusicTrackMeta }> {
    const result = await this.musicService.getTrack(id)
    return { data: result }
  }

  /**
   * GET /music/:id/stream
   * Signed stream URL for composer preview (1h TTL).
   */
  @Get(':id/stream')
  @UseGuards(JwtAuthGuard)
  async streamUrl(@Param('id') id: string): Promise<{ data: { url: string } }> {
    const url = await this.musicService.getStreamUrl(id)
    return { data: { url } }
  }

  /**
   * GET /music/:id/preview
   * Signed preview clip URL (30s trimmed preview for composer browsing).
   */
  @Get(':id/preview')
  @UseGuards(OptionalAuthGuard)
  async previewUrl(@Param('id') id: string): Promise<{ data: { url: string } }> {
    const url = await this.musicService.getPreviewUrl(id)
    return { data: { url } }
  }

  /**
   * GET /music/:id/cover
   * Cover/artwork URL for the track.
   */
  @Get(':id/cover')
  @UseGuards(OptionalAuthGuard)
  async coverUrl(@Param('id') id: string): Promise<{ data: { url: string | null } }> {
    const url = await this.musicService.getCoverUrl(id)
    return { data: { url } }
  }
}
