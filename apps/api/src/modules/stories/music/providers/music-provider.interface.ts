// ── MusicProvider adapter interface ─────────────────────────────────────────
// The entire royalty-free music catalog is behind this adapter so licensed
// providers (Epidemic Sound, Artlist, etc.) can be added later without any
// redesign of the Stories module.
//
// MusicTrack metadata is already defined in Prisma (music_tracks table).
// Audio bytes stream from R2 + CDN via signed URLs.

export interface MusicQuery {
  q?: string
  mood?: string
  category?: string
  genre?: string
  maxDurationMs?: number
  minDurationMs?: number
}

export interface MusicProvider {
  /** Unique provider tag — matches `MusicTrack.provider` in Prisma. */
  readonly name: string

  /**
   * Full-text search against title + artist (pg_trgm). Returns matching
   * active tracks ordered by relevance / title ASC.
   */
  search(query: MusicQuery, limit?: number, offset?: number): Promise<{ tracks: MusicTrackMeta[]; total: number }>

  /**
   * Single-track lookup. Returns null if the track is inactive or not found.
   */
  getTrack(id: string): Promise<MusicTrackMeta | null>

  /**
   * Generate a signed/CDN-backed URL the client can stream.
   * Short TTL (1h default) — the client requests a fresh URL on each render.
   */
  streamUrl(trackId: string, ttlSeconds?: number): Promise<string>

  /**
   * Generate a signed/CDN-backed preview clip URL (30s preview for composer browsing).
   */
  previewUrl(trackId: string, ttlSeconds?: number): Promise<string>

  /**
   * Cover/artwork URL for the track.
   */
  coverUrl(trackId: string): Promise<string | null>
}

/**
 * Lightweight shape returned by the provider — mirrors the public fields
 * of the Prisma `MusicTrack` model.
 */
export interface MusicTrackMeta {
  id: string
  title: string
  artist: string
  album: string | null
  genre: string
  mood: string
  category: string
  durationMs: number
  coverUrl: string | null
  previewUrl: string | null
  audioUrl: string
  license: string
  attribution: string | null
  provider: string
  isActive: boolean
  createdAt: string
}
