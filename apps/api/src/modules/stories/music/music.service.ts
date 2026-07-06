import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { RedisService } from '../../redis/redis.service'
import { InternalMusicProvider } from './providers/internal.provider'
import type { MusicQuery, MusicTrackMeta } from './providers/music-provider.interface'

// ── Response types ──────────────────────────────────────────────────────────

export interface MusicSearchResult {
  tracks: MusicTrackMeta[]
  total: number
}

export interface MusicBrowseResult {
  data: MusicTrackMeta[]
  total: number
  hasMore: boolean
  nextOffset: number | null
}

export interface MusicTrendingItem {
  track: MusicTrackMeta
  usageCount: number
}

// ── Cache TTLs ──────────────────────────────────────────────────────────────

const TRACK_TTL_SECONDS = 86_400 // 24h — catalog metadata is near-static
const SEARCH_TTL_SECONDS = 300 // 5m
const TRENDING_TTL_SECONDS = 600 // 10m

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name)

  constructor(
    private readonly internalProvider: InternalMusicProvider,
    private readonly redis: RedisService,
  ) {}

  // ── SEARCH ──────────────────────────────────────────────────────────────

  async search(query: MusicQuery, page = 1, limit = 30): Promise<MusicSearchResult> {
    const cappedLimit = Math.min(limit, 50)
    const offset = (page - 1) * cappedLimit

    // Cache key varies by query params + page + limit
    const cacheKey = this.searchCacheKey(query, page, cappedLimit)

    // Try L1/L2 cache first
    const cached = await this.redis.getCache<MusicSearchResult>(cacheKey)
    if (cached) return cached

    const result = await this.internalProvider.search(query, cappedLimit, offset)

    // Only cache non-empty results for query-less browse
    if (result.tracks.length > 0 || !query.q) {
      await this.redis.setCache(cacheKey, result, SEARCH_TTL_SECONDS)
    }

    return result
  }

  // ── BROWSE (faceted, cursor-paginated) ──────────────────────────────────

  async browse(
    filters: Omit<MusicQuery, 'q'>,
    offset = 0,
    limit = 30,
  ): Promise<MusicBrowseResult> {
    const cappedLimit = Math.min(limit, 50)

    const cacheKey = `music:browse:${JSON.stringify(filters)}:${offset}:${cappedLimit}`
    const cached = await this.redis.getCache<MusicBrowseResult>(cacheKey)
    if (cached) return cached

    // Fetch N+1 for hasMore detection
    const result = await this.internalProvider.search(filters as MusicQuery, cappedLimit + 1, offset)

    const hasMore = result.tracks.length > cappedLimit
    const tracks = result.tracks.slice(0, cappedLimit)

    const browseResult: MusicBrowseResult = {
      data: tracks,
      total: result.total,
      hasMore,
      nextOffset: hasMore ? offset + cappedLimit : null,
    }

    await this.redis.setCache(cacheKey, browseResult, SEARCH_TTL_SECONDS)
    return browseResult
  }

  // ── SINGLE TRACK ────────────────────────────────────────────────────────

  async getTrack(id: string): Promise<MusicTrackMeta> {
    const cacheKey = `music:track:${id}`
    const cached = await this.redis.getCache<MusicTrackMeta>(cacheKey)
    if (cached) return cached

    const track = await this.internalProvider.getTrack(id)
    if (!track) {
      throw new NotFoundException({ code: 'TRACK_NOT_FOUND', message: 'Music track not found' })
    }

    await this.redis.setCache(cacheKey, track, TRACK_TTL_SECONDS)
    return track
  }

  // ── TRENDING ────────────────────────────────────────────────────────────

  /**
   * Trending tracks: sorted by total usage count across all stories from the
   * `trend:music` ZSET. The ZSET is incremented each time a story is created
   * with a music track attached.
   */
  async getTrending(limit = 20): Promise<MusicTrendingItem[]> {
    const cappedLimit = Math.min(limit, 50)
    const cacheKey = 'music:trending'
    const cached = await this.redis.getCache<MusicTrendingItem[]>(cacheKey)
    if (cached) return cached.slice(0, cappedLimit)

    // Read the top N track IDs from the ZSET
    const trackIds = await this.redis.getTrendingMusic(cappedLimit)

    if (trackIds.length === 0) {
      // Fallback: return recently added tracks as trending
      return this.fallbackTrending(cappedLimit)
    }

    const tracks = await Promise.all(
      trackIds.map(async (item: { id: string; score: number }) => {
        try {
          const track = await this.getTrack(item.id)
          return { track, usageCount: item.score }
        } catch {
          return null
        }
      }),
    )

    const result = tracks.filter(Boolean) as MusicTrendingItem[]
    await this.redis.setCache(cacheKey, result, TRENDING_TTL_SECONDS)
    return result.slice(0, cappedLimit)
  }

  // ── STREAM URL (for composer preview) ───────────────────────────────────

  async getStreamUrl(trackId: string): Promise<string> {
    return this.internalProvider.streamUrl(trackId)
  }

  async getPreviewUrl(trackId: string): Promise<string> {
    return this.internalProvider.previewUrl(trackId)
  }

  // ── COVER URL ───────────────────────────────────────────────────────────

  async getCoverUrl(trackId: string): Promise<string | null> {
    return this.internalProvider.coverUrl(trackId)
  }

  // ── HELPERS ─────────────────────────────────────────────────────────────

  private async fallbackTrending(limit: number): Promise<MusicTrendingItem[]> {
    const result = await this.internalProvider.search({}, limit, 0)
    return result.tracks.map((track) => ({ track, usageCount: 0 }))
  }

  private searchCacheKey(query: MusicQuery, page: number, limit: number): string {
    const parts = [`music:search:${page}:${limit}`]
    if (query.q) parts.push(`q:${query.q.toLowerCase().trim()}`)
    if (query.mood) parts.push(`mood:${query.mood}`)
    if (query.category) parts.push(`cat:${query.category}`)
    if (query.genre) parts.push(`genre:${query.genre}`)
    if (query.minDurationMs) parts.push(`minDur:${query.minDurationMs}`)
    if (query.maxDurationMs) parts.push(`maxDur:${query.maxDurationMs}`)
    return parts.join(':')
  }
}
