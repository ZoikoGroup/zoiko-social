import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { ConfigService } from '../../../config/config.service'
import type { MusicProvider, MusicQuery, MusicTrackMeta } from './music-provider.interface'

/**
 * InternalMusicProvider — curated royalty-free catalog stored in the
 * `music_tracks` table, with audio files hosted on R2/CDN.
 *
 * This is the default (and only active) provider. Licensed providers
 * (Epidemic Sound, Artlist, etc.) will register alongside this one
 * once their contracts are integrated.
 */
@Injectable()
export class InternalMusicProvider implements MusicProvider {
  readonly name = 'internal'
  private readonly logger = new Logger(InternalMusicProvider.name)
  private readonly baseCdnUrl: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.baseCdnUrl = this.config.env.R2_PUBLIC_URL ?? 'https://cdn.zoikosocial.com'
  }

  async search(
    query: MusicQuery,
    limit = 30,
    offset = 0,
  ): Promise<{ tracks: MusicTrackMeta[]; total: number }> {
    const capLimit = Math.min(limit, 50)

    const where: Record<string, unknown> = { isActive: true }

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { artist: { contains: query.q, mode: 'insensitive' } },
      ]
    }
    if (query.mood) where.mood = query.mood
    if (query.category) where.category = query.category
    if (query.genre) where.genre = query.genre
    if (query.maxDurationMs !== undefined) {
      where.durationMs = { ...(where.durationMs as Record<string, number> ?? {}), lte: query.maxDurationMs }
    }
    if (query.minDurationMs !== undefined) {
      where.durationMs = { ...(where.durationMs as Record<string, number> ?? {}), gte: query.minDurationMs }
    }

    const [rows, total] = await Promise.all([
      this.prisma.musicTrack.findMany({
        where,
        orderBy: { title: 'asc' },
        take: capLimit,
        skip: offset,
      }),
      this.prisma.musicTrack.count({ where }),
    ])

    return {
      tracks: rows.map((r: Record<string, unknown>) => this.toMeta(r)),
      total,
    }
  }

  async getTrack(id: string): Promise<MusicTrackMeta | null> {
    const row = await this.prisma.musicTrack.findUnique({
      where: { id, isActive: true },
    })
    return row ? this.toMeta(row) : null
  }

  async streamUrl(trackId: string, _ttlSeconds = 3600): Promise<string> {
    const track = await this.getTrack(trackId)
    if (!track) throw new Error(`Track ${trackId} not found or inactive`)
    // Audio lives on R2/CDN; return the URL directly (CDN is public-read).
    // In production, generate a signed URL with ttlSeconds.
    return track.audioUrl
  }

  async previewUrl(trackId: string, _ttlSeconds = 3600): Promise<string> {
    const track = await this.getTrack(trackId)
    if (!track) throw new Error(`Track ${trackId} not found or inactive`)
    return track.previewUrl ?? track.audioUrl
  }

  async coverUrl(trackId: string): Promise<string | null> {
    const track = await this.getTrack(trackId)
    return track?.coverUrl ?? null
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private toMeta(row: Record<string, unknown>): MusicTrackMeta {
    return {
      id: row.id as string,
      title: row.title as string,
      artist: row.artist as string,
      album: (row.album as string) ?? null,
      genre: row.genre as string,
      mood: row.mood as string,
      category: row.category as string,
      durationMs: row.durationMs as number,
      coverUrl: (row.coverUrl as string) ?? null,
      previewUrl: (row.previewUrl as string) ?? null,
      audioUrl: row.audioUrl as string,
      license: row.license as string,
      attribution: (row.attribution as string) ?? null,
      provider: (row.provider as string) ?? 'internal',
      isActive: row.isActive as boolean,
      createdAt: (row.createdAt as Date).toISOString(),
    }
  }
}
