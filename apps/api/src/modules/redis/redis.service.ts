import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigService } from '../config/config.service'

/**
 * RedisService — central cache + pub/sub layer.
 *
 * Key namespaces:
 *   cnt:{userId}              — hash { followers, following, posts } (counter mirror, TTL 6h)
 *   rel:{userId}:{targetId}   — JSON relationship snapshot            (TTL 5m)
 *   profile:{userId}          — JSON profile snapshot                 (TTL 5m)
 *
 * Pub/sub channel:
 *   zoiko:realtime — JSON { room, event, payload } relayed by the Socket.IO gateway
 *
 * Degraded mode: when REDIS_URL is not configured every method becomes a no-op
 * and reads return null, so the API keeps working straight off PostgreSQL.
 */

export interface CounterSnapshot {
  followers: number
  following: number
  posts: number
}

export const REALTIME_CHANNEL = 'zoiko:realtime'

const COUNTER_TTL_SECONDS = 6 * 60 * 60
const RELATIONSHIP_TTL_SECONDS = 5 * 60
const PROFILE_TTL_SECONDS = 5 * 60

// ── L1 in-process cache ─────────────────────────────────────────────────────
// Sits in front of Redis (L2): hot reads cost ~0ms instead of a network
// round-trip. Short TTL bounds cross-pod staleness; same-pod mutations
// invalidate immediately. Capped size with FIFO eviction.
const L1_TTL_MS = 15_000
const L1_MAX_ENTRIES = 5_000

class L1Cache {
  private readonly map = new Map<string, { data: unknown; expires: number }>()

  get<T>(key: string): T | null {
    const entry = this.map.get(key)
    if (!entry) return null
    if (Date.now() > entry.expires) {
      this.map.delete(key)
      return null
    }
    return entry.data as T
  }

  set(key: string, data: unknown, ttlMs = L1_TTL_MS): void {
    if (this.map.size >= L1_MAX_ENTRIES) {
      // FIFO eviction — drop the oldest entry
      const oldest = this.map.keys().next().value
      if (oldest !== undefined) this.map.delete(oldest)
    }
    this.map.set(key, { data, expires: Date.now() + ttlMs })
  }

  delete(...keys: string[]): void {
    for (const key of keys) this.map.delete(key)
  }
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private readonly client: Redis | null = null
  private readonly l1 = new L1Cache()

  constructor(private readonly config: ConfigService) {
    const url = this.config.redisUrl
    if (!url) {
      this.logger.warn('REDIS_URL not set — cache and pub/sub disabled (degraded mode)')
      return
    }

    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      retryStrategy: (times) => Math.min(times * 500, 5_000),
    })
    this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`))
    this.client.on('ready', () => this.logger.log('Redis connected'))
  }

  get isEnabled(): boolean {
    return this.client !== null
  }

  /**
   * Expose the underlying ioredis client for advanced operations such as
   * rate limiting, custom scripting, and direct key manipulation that
   * doesn't fit the higher-level methods above.
   * Returns null when Redis is unavailable (degraded mode).
   */
  get rawClient(): Redis | null {
    return this.client
  }

  /** Dedicated connection for blocking consumers (BullMQ workers, pub/sub subscribers). */
  createConnection(options?: { maxRetriesPerRequest?: number | null }): Redis | null {
    const url = this.config.redisUrl
    if (!url) return null
    const conn = new Redis(url, {
      maxRetriesPerRequest: options?.maxRetriesPerRequest === undefined ? 2 : options.maxRetriesPerRequest,
      retryStrategy: (times) => Math.min(times * 500, 5_000),
    })
    // MUST attach an error listener — an unhandled ioredis 'error' event
    // (e.g. Upstash quota exceeded / outage) otherwise crashes the whole process.
    conn.on('error', (err) => this.logger.error(`Redis connection error: ${err.message}`))
    return conn
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit().catch(() => this.client?.disconnect())
    }
  }

  // ── COUNTERS ──────────────────────────────────────────────────────────────

  async getCounters(userId: string): Promise<CounterSnapshot | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.hgetall(`cnt:${userId}`)
      if (!raw || raw.followers === undefined) return null
      return {
        followers: Number(raw.followers),
        following: Number(raw.following),
        posts: Number(raw.posts ?? 0),
      }
    } catch {
      return null
    }
  }

  async setCounters(userId: string, counters: CounterSnapshot): Promise<void> {
    if (!this.client) return
    try {
      const key = `cnt:${userId}`
      await this.client
        .multi()
        .hset(key, {
          followers: counters.followers,
          following: counters.following,
          posts: counters.posts,
        })
        .expire(key, COUNTER_TTL_SECONDS)
        .exec()
    } catch (err) {
      this.logger.warn(`setCounters failed: ${(err as Error).message}`)
    }
  }

  /**
   * Atomically adjust cached counters. Only applies when the hash already
   * exists — otherwise the next read repopulates from PostgreSQL (source of truth).
   */
  async adjustCounters(userId: string, delta: { followers?: number; following?: number; posts?: number }): Promise<void> {
    if (!this.client) return
    try {
      const key = `cnt:${userId}`
      const exists = await this.client.exists(key)
      if (!exists) return
      const multi = this.client.multi()
      if (delta.followers) multi.hincrby(key, 'followers', delta.followers)
      if (delta.following) multi.hincrby(key, 'following', delta.following)
      if (delta.posts) multi.hincrby(key, 'posts', delta.posts)
      multi.expire(key, COUNTER_TTL_SECONDS)
      await multi.exec()
    } catch (err) {
      this.logger.warn(`adjustCounters failed: ${(err as Error).message}`)
    }
  }

  // ── RELATIONSHIP CACHE ────────────────────────────────────────────────────

  async getRelationship<T>(userId: string, targetId: string): Promise<T | null> {
    const key = `rel:${userId}:${targetId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setRelationship(userId: string, targetId: string, payload: unknown): Promise<void> {
    const key = `rel:${userId}:${targetId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', RELATIONSHIP_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setRelationship failed: ${(err as Error).message}`)
    }
  }

  /** Invalidate both directions — a follow/block changes how each side sees the other. */
  async invalidateRelationship(userId: string, targetId: string): Promise<void> {
    this.l1.delete(`rel:${userId}:${targetId}`, `rel:${targetId}:${userId}`)
    if (!this.client) return
    try {
      await this.client.del(`rel:${userId}:${targetId}`, `rel:${targetId}:${userId}`)
    } catch (err) {
      this.logger.warn(`invalidateRelationship failed: ${(err as Error).message}`)
    }
  }

  // ── PROFILE CACHE ─────────────────────────────────────────────────────────

  async getProfile<T>(userId: string): Promise<T | null> {
    const key = `profile:${userId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setProfile(userId: string, payload: unknown): Promise<void> {
    const key = `profile:${userId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setProfile failed: ${(err as Error).message}`)
    }
  }

  async invalidateProfile(userId: string): Promise<void> {
    this.l1.delete(`profile:${userId}`)
    if (!this.client) return
    try {
      await this.client.del(`profile:${userId}`)
    } catch (err) {
      this.logger.warn(`invalidateProfile failed: ${(err as Error).message}`)
    }
  }

  // ── POST CACHE ─────────────────────────────────────────────────────────────

  async getPost<T>(postId: string): Promise<T | null> {
    const key = `post:${postId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setPost(postId: string, payload: unknown): Promise<void> {
    const key = `post:${postId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setPost failed: ${(err as Error).message}`)
    }
  }

  async invalidatePost(postId: string): Promise<void> {
    this.l1.delete(`post:${postId}`)
    if (!this.client) return
    try {
      await this.client.del(`post:${postId}`)
    } catch (err) {
      this.logger.warn(`invalidatePost failed: ${(err as Error).message}`)
    }
  }

  // ── FEED FIRST-PAGE CACHE ──────────────────────────────────────────────────

  async getFeedFirst<T>(userId: string): Promise<T | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.get(`feed:first:${userId}`)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  async setFeedFirst(userId: string, payload: unknown): Promise<void> {
    if (!this.client) return
    try {
      await this.client.set(`feed:first:${userId}`, JSON.stringify(payload), 'EX', 60)
    } catch (err) {
      this.logger.warn(`setFeedFirst failed: ${(err as Error).message}`)
    }
  }

  /** Bust many users' first-page caches (fanout on new post). Chunked UNLINK. */
  async delFeedFirst(userIds: string[]): Promise<void> {
    if (!this.client || userIds.length === 0) return
    try {
      const keys = userIds.map((id) => `feed:first:${id}`)
      for (let i = 0; i < keys.length; i += 500) {
        await this.client.unlink(...keys.slice(i, i + 500))
      }
    } catch (err) {
      this.logger.warn(`delFeedFirst failed: ${(err as Error).message}`)
    }
  }

  // ── STORY SEEN-SET ─────────────────────────────────────────────────────────
  // TTL = 25h (> story lifetime) so seen state naturally ages out as stories expire.

  async seenAdd(viewerId: string, storyId: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.sadd(`seen:${viewerId}`, storyId)
      await this.client.expire(`seen:${viewerId}`, 25 * 3600)
    } catch (err) {
      this.logger.warn(`seenAdd failed: ${(err as Error).message}`)
    }
  }

  async seenCheck(viewerId: string, storyId: string): Promise<boolean> {
    if (!this.client) return false
    try {
      return (await this.client.sismember(`seen:${viewerId}`, storyId)) === 1
    } catch {
      return false
    }
  }

  async seenGetAll(viewerId: string): Promise<Set<string>> {
    if (!this.client) return new Set()
    try {
      const members = await this.client.smembers(`seen:${viewerId}`)
      return new Set(members)
    } catch {
      return new Set()
    }
  }

  // ── AUTHOR ACTIVITY ZSET ───────────────────────────────────────────────────
  // Tracks the latest story publish timestamp per author for tray ordering.

  async authorActivityAdd(authorId: string, timestampMs: number): Promise<void> {
    if (!this.client) return
    try {
      await this.client.zadd('author-activity', timestampMs, authorId)
    } catch (err) {
      this.logger.warn(`authorActivityAdd failed: ${(err as Error).message}`)
    }
  }

  /** Returns author IDs with activity, sorted by most-recent-first. */
  async authorActivityGet(limit = 200): Promise<string[]> {
    if (!this.client) return []
    try {
      return await this.client.zrevrange('author-activity', 0, limit - 1)
    } catch {
      return []
    }
  }

  async authorActivityRemove(authorId: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.zrem('author-activity', authorId)
    } catch (err) {
      this.logger.warn(`authorActivityRemove failed: ${(err as Error).message}`)
    }
  }

  // ── STORY COUNTER MIRROR (exists-only — source of truth is PostgreSQL) ─────

  async storyCounterIncr(storyId: string, field: 'views' | 'impressions' | 'reactions' | 'replies'): Promise<void> {
    if (!this.client) return
    try {
      const key = `cnt:story:${storyId}`
      await this.client.hincrby(key, field, 1)
      // Extend TTL on each write
      await this.client.expire(key, 25 * 3600)
    } catch (err) {
      this.logger.warn(`storyCounterIncr failed: ${(err as Error).message}`)
    }
  }

  async storyCounterGet(storyId: string): Promise<Record<string, number> | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.hgetall(`cnt:story:${storyId}`)
      if (!raw || Object.keys(raw).length === 0) return null
      const out: Record<string, number> = {}
      for (const [k, v] of Object.entries(raw)) out[k] = Number(v)
      return out
    } catch {
      return null
    }
  }

  // ── TRENDING HASHTAGS ──────────────────────────────────────────────────────

  async trendIncr(tag: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.zincrby('trend:hashtags', 1, tag)
    } catch (err) {
      this.logger.warn(`trendIncr failed: ${(err as Error).message}`)
    }
  }

  async trendTop(limit = 10): Promise<{ tag: string; score: number }[]> {
    if (!this.client) return []
    try {
      const raw = await this.client.zrevrange('trend:hashtags', 0, limit - 1, 'WITHSCORES')
      const out: { tag: string; score: number }[] = []
      for (let i = 0; i < raw.length; i += 2) {
        out.push({ tag: raw[i]!, score: Number(raw[i + 1]) })
      }
      return out
    } catch {
      return []
    }
  }

  /** Periodic decay so trending reflects the last ~48h, not all time. */
  async trendDecay(factor = 0.85): Promise<void> {
    if (!this.client) return
    try {
      const members = await this.client.zrange('trend:hashtags', 0, -1, 'WITHSCORES')
      const multi = this.client.multi()
      for (let i = 0; i < members.length; i += 2) {
        const tag = members[i]!
        const score = Number(members[i + 1]) * factor
        if (score < 0.5) multi.zrem('trend:hashtags', tag)
        else multi.zadd('trend:hashtags', score, tag)
      }
      await multi.exec()
    } catch (err) {
      this.logger.warn(`trendDecay failed: ${(err as Error).message}`)
    }
  }

  // ── COMMUNITY CACHE ─────────────────────────────────────────────────────────

  async getCommunity<T>(id: string): Promise<T | null> {
    const key = `community:${id}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setCommunity(id: string, payload: unknown): Promise<void> {
    const key = `community:${id}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setCommunity failed: ${(err as Error).message}`)
    }
  }

  async invalidateCommunity(id: string): Promise<void> {
    this.l1.delete(`community:${id}`)
    if (!this.client) return
    try {
      await this.client.del(`community:${id}`)
    } catch (err) {
      this.logger.warn(`invalidateCommunity failed: ${(err as Error).message}`)
    }
  }

  // Membership snapshot — powers every community permission check
  async getMembership<T>(communityId: string, userId: string): Promise<T | null> {
    const key = `cmember:${communityId}:${userId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setMembership(communityId: string, userId: string, payload: unknown): Promise<void> {
    const key = `cmember:${communityId}:${userId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setMembership failed: ${(err as Error).message}`)
    }
  }

  async invalidateMembership(communityId: string, userId: string): Promise<void> {
    this.l1.delete(`cmember:${communityId}:${userId}`, `cmemberships:${userId}`)
    if (!this.client) return
    try {
      await this.client.del(`cmember:${communityId}:${userId}`, `cmemberships:${userId}`)
    } catch (err) {
      this.logger.warn(`invalidateMembership failed: ${(err as Error).message}`)
    }
  }

  // ── USERNAME → ID MAPPING ──────────────────────────────────────────────────
  // Usernames change at most once per 30 days — safe to cache aggressively.

  async getUsernameId(username: string): Promise<string | null> {
    const key = `uname:${username}`
    const l1Hit = this.l1.get<string>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const id = await this.client.get(key)
      if (id) this.l1.set(key, id, 60_000)
      return id
    } catch {
      return null
    }
  }

  async setUsernameId(username: string, userId: string): Promise<void> {
    const key = `uname:${username}`
    this.l1.set(key, userId, 60_000)
    if (!this.client) return
    try {
      await this.client.set(key, userId, 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setUsernameId failed: ${(err as Error).message}`)
    }
  }

  async invalidateUsername(...usernames: string[]): Promise<void> {
    const keys = usernames.map((u) => `uname:${u}`)
    this.l1.delete(...keys)
    if (!this.client || keys.length === 0) return
    try {
      await this.client.del(...keys)
    } catch (err) {
      this.logger.warn(`invalidateUsername failed: ${(err as Error).message}`)
    }
  }

  // ── STORY CACHE ────────────────────────────────────────────────────────────

  async getStory<T>(storyId: string): Promise<T | null> {
    const key = `story:${storyId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setStory(storyId: string, payload: unknown): Promise<void> {
    const key = `story:${storyId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setStory failed: ${(err as Error).message}`)
    }
  }

  async invalidateStory(storyId: string): Promise<void> {
    this.l1.delete(`story:${storyId}`)
    if (!this.client) return
    try {
      await this.client.del(`story:${storyId}`)
    } catch (err) {
      this.logger.warn(`invalidateStory failed: ${(err as Error).message}`)
    }
  }

  // Story tray — ordered list of ready story ids + posters for an author
  async getStoryTray<T>(authorId: string): Promise<T | null> {
    const key = `story:tray:${authorId}`
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setStoryTray(authorId: string, payload: unknown): Promise<void> {
    const key = `story:tray:${authorId}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setStoryTray failed: ${(err as Error).message}`)
    }
  }

  async invalidateStoryTray(authorId: string): Promise<void> {
    this.l1.delete(`story:tray:${authorId}`)
    if (!this.client) return
    try {
      await this.client.del(`story:tray:${authorId}`)
    } catch (err) {
      this.logger.warn(`invalidateStoryTray failed: ${(err as Error).message}`)
    }
  }

  // ── TRENDING MUSIC ─────────────────────────────────────────────────────────

  async musicTrendIncr(trackId: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.zincrby('trend:music', 1, trackId)
    } catch (err) {
      this.logger.warn(`musicTrendIncr failed: ${(err as Error).message}`)
    }
  }

  async getTrendingMusic(limit = 20): Promise<{ id: string; score: number }[]> {
    if (!this.client) return []
    try {
      const raw = await this.client.zrevrange('trend:music', 0, limit - 1, 'WITHSCORES')
      const out: { id: string; score: number }[] = []
      for (let i = 0; i < raw.length; i += 2) {
        out.push({ id: raw[i]!, score: Number(raw[i + 1]) })
      }
      return out
    } catch {
      return []
    }
  }

  // ── GENERIC CACHE (for ad-hoc keys like music search/browse/trending) ─────
  // These are typed wrappers around get/set with L1 + L2 cascade.

  async getCache<T>(key: string): Promise<T | null> {
    const l1Hit = this.l1.get<T>(key)
    if (l1Hit !== null) return l1Hit
    if (!this.client) return null
    try {
      const raw = await this.client.get(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as T
      this.l1.set(key, parsed)
      return parsed
    } catch {
      return null
    }
  }

  async setCache(key: string, payload: unknown, ttlSeconds = 300): Promise<void> {
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', ttlSeconds)
    } catch (err) {
      this.logger.warn(`setCache(${key}) failed: ${(err as Error).message}`)
    }
  }

  async invalidateCache(...keys: string[]): Promise<void> {
    this.l1.delete(...keys)
    if (!this.client || keys.length === 0) return
    try {
      await this.client.del(...keys)
    } catch (err) {
      this.logger.warn(`invalidateCache failed: ${(err as Error).message}`)
    }
  }

  // ── PUB/SUB ───────────────────────────────────────────────────────────────

  /** Publish a realtime event; returns false when Redis is unavailable so callers can fall back to local emit. */
  async publishRealtime(room: string, event: string, payload: unknown): Promise<boolean> {
    if (!this.client) return false
    try {
      await this.client.publish(REALTIME_CHANNEL, JSON.stringify({ room, event, payload }))
      return true
    } catch (err) {
      this.logger.warn(`publishRealtime failed: ${(err as Error).message}`)
      return false
    }
  }
}
