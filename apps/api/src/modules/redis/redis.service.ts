import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigService } from '../config/config.service'
import { ThrottledErrorLog, isFatalRedisError } from './redis-failure'

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

/** Short: a moderator hiding an article should take effect promptly. */
const NEWS_CARDS_TTL_SECONDS = 60

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
      // Returning null stops ioredis reconnecting. Only done for errors that
      // reconnecting cannot fix — otherwise a transient outage must still recover.
      retryStrategy: (times) => (this.fatalRedis ? null : Math.min(times * 500, 5_000)),
    })
    this.client.on('error', (err) => this.onRedisError('Redis error', err))
    this.client.on('ready', () => {
      this.fatalRedis = false
      this.logger.log('Redis connected')
    })
  }

  /** Set once a non-retryable error is seen, so the retry strategy gives up. */
  private fatalRedis = false
  private readonly errorLog = new ThrottledErrorLog()
  /**
   * Child connections handed to BullMQ. Tracked so a fatal error can close them:
   * a worker whose connection stays open keeps polling a Redis that will never
   * answer, and BullMQ prints its own full stack per attempt — seven queues doing
   * that produced 1,630 error traces in 75 seconds, independently of this class's
   * own logging, while burning what is left of the request quota.
   */
  private readonly children: Redis[] = []

  private onRedisError(prefix: string, err: Error): void {
    if (isFatalRedisError(err) && !this.fatalRedis) {
      this.fatalRedis = true
      this.logger.error(
        `${prefix}: ${err.message} — this cannot be fixed by reconnecting, so retries are stopping ` +
          'and queue connections are closing. Cache, queues and pub/sub are in degraded mode until it ' +
          'is resolved; the API keeps serving from PostgreSQL.',
      )
      this.shutdownAfterFatal()
      return
    }
    const line = this.errorLog.next(`${prefix}: ${err.message}`)
    if (line) this.logger.error(line)
  }

  /** Closes every connection so nothing keeps retrying a Redis that cannot answer. */
  private shutdownAfterFatal(): void {
    for (const conn of this.children) {
      try { conn.disconnect() } catch { /* already gone */ }
    }
    this.children.length = 0
    try { this.client?.disconnect() } catch { /* already gone */ }
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
    // Same answer as "not configured" once Redis is fatally unavailable. Every
    // caller already handles null for that case, so this needs no changes there.
    if (this.fatalRedis) return null
    const conn = new Redis(url, {
      maxRetriesPerRequest: options?.maxRetriesPerRequest === undefined ? 2 : options.maxRetriesPerRequest,
      retryStrategy: (times) => (this.fatalRedis ? null : Math.min(times * 500, 5_000)),
    })
    // MUST attach an error listener — an unhandled ioredis 'error' event
    // (e.g. Upstash quota exceeded / outage) otherwise crashes the whole process.
    // Routed through the same throttle: there is one of these per BullMQ worker, so
    // unthrottled they multiply the flood by the number of queues.
    conn.on('error', (err) => this.onRedisError('Redis connection error', err))
    this.children.push(conn)
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

  // ── PUBLIC NEWS LIST CACHE ────────────────────────────────────────────────

  /*
    The article list is the same for everyone, so it is cached once rather than
    fetched per viewer.

    Measured reason: one database round-trip costs ~1.5s on the transaction
    pooler and ~300ms on session mode, while a cache round-trip costs ~217ms and
    an L1 hit costs nothing. `feedCards` makes two trips — this list, and the
    viewer's own likes and saves. Only the first is shareable, and it is the one
    served on /news and on every page of every member's home feed.

    Viewer flags are deliberately NOT cached here: they are per-person and change
    the moment someone taps like, so they stay a live query.

    The TTL is short despite articles changing only every three hours, because a
    moderator hiding an article should not have to wait for the feed to catch up.
  */
  async getNewsCards<T>(skip: number, take: number): Promise<T | null> {
    const key = `news:cards:${skip}:${take}`
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

  async setNewsCards(skip: number, take: number, payload: unknown): Promise<void> {
    const key = `news:cards:${skip}:${take}`
    this.l1.set(key, payload)
    if (!this.client) return
    try {
      await this.client.set(key, JSON.stringify(payload), 'EX', NEWS_CARDS_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setNewsCards failed: ${(err as Error).message}`)
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

  // ── FEED RANKED-ORDER CACHE ────────────────────────────────────────────────
  // The ranked order of a viewer's candidate pool, held briefly so paging
  // through the feed does not re-rank the whole pool per request AND so the
  // order cannot shift underneath the reader between page 1 and page 2.
  //
  // Only ids are stored: post bodies change (edits, counter updates) and the
  // hydration query is cheap for one page, but the ORDER is the expensive,
  // must-stay-stable part.

  async getFeedOrder(userId: string, surface: string): Promise<string[] | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.get(`feed:order:${surface}:${userId}`)
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as string[]) : null
    } catch {
      return null
    }
  }

  async setFeedOrder(userId: string, surface: string, ids: string[], ttlSeconds = 180): Promise<void> {
    if (!this.client) return
    try {
      await this.client.set(
        `feed:order:${surface}:${userId}`,
        JSON.stringify(ids),
        'EX',
        ttlSeconds,
      )
    } catch (err) {
      this.logger.warn(`setFeedOrder failed: ${(err as Error).message}`)
    }
  }

  // ── POST ANALYTICS (fast counters + unique-reach HLL) ──────────────────────
  // Best-effort mirror of the post_events stream (PostgreSQL is source of truth).
  // Degrades silently when Redis is unavailable/over-quota — the analytics read
  // path falls back to aggregating post_events directly.

  /** Increment the per-post counter for an event type (impression/view/...). */
  async postEventIncr(postId: string, type: string): Promise<void> {
    if (!this.client) return
    try {
      const key = `cnt:post:${postId}`
      await this.client.hincrby(key, type, 1)
      await this.client.expire(key, 90 * 24 * 3600)
    } catch (err) {
      this.logger.warn(`postEventIncr failed: ${(err as Error).message}`)
    }
  }

  /** Add a viewer to a post's unique-reach HLLs (total + follower/non-follower). */
  async postReachAdd(postId: string, viewerId: string, isFollower: boolean): Promise<void> {
    if (!this.client) return
    try {
      const seg = isFollower ? 'f' : 'n'
      const ttl = 90 * 24 * 3600
      await this.client.pfadd(`reach:post:${postId}`, viewerId)
      await this.client.pfadd(`reach:post:${postId}:${seg}`, viewerId)
      await this.client.expire(`reach:post:${postId}`, ttl)
      await this.client.expire(`reach:post:${postId}:${seg}`, ttl)
    } catch (err) {
      this.logger.warn(`postReachAdd failed: ${(err as Error).message}`)
    }
  }

  /** Fast-path read of a post's counters + unique reach; null if unavailable. */
  async postStatsGet(
    postId: string,
  ): Promise<{ counters: Record<string, number>; reach: number; reachFollowers: number; reachNonFollowers: number } | null> {
    if (!this.client) return null
    try {
      const [raw, total, f, n] = await Promise.all([
        this.client.hgetall(`cnt:post:${postId}`),
        this.client.pfcount(`reach:post:${postId}`),
        this.client.pfcount(`reach:post:${postId}:f`),
        this.client.pfcount(`reach:post:${postId}:n`),
      ])
      const hasCounters = raw && Object.keys(raw).length > 0
      if (!hasCounters && !total) return null
      const counters: Record<string, number> = {}
      for (const [k, v] of Object.entries(raw ?? {})) counters[k] = Number(v)
      return { counters, reach: total, reachFollowers: f, reachNonFollowers: n }
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

  // ── GENERIC CACHE (typed wrappers for ad-hoc keys) ────────────────────────
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

  // ── AFFINITY (personalization model) ────────────────────────────────────────
  // Per-user interest profiles stored as hashes. Dimensions:
  //   author    — authorId → engagement weight (who you interact with)
  //   tag       — hashtag → weight (what topics you like)
  //   community — communityId → weight (where you're active)
  //   kind      — postKind → weight (which post kinds you like)
  // Keys: aff:{dimension}:{userId}. TTL refreshed on every write so inactive
  // users' profiles age out naturally. The daily decay job multiplies all
  // scores by a decay factor so old interests fade (freshness of the model).

  /** Increment an affinity dimension field (float, may be negative). */
  async affinityIncr(
    userId: string,
    dimension: 'author' | 'tag' | 'community' | 'kind',
    field: string,
    delta: number,
    ttlSeconds = 60 * 24 * 3600,
  ): Promise<void> {
    if (!this.client) return
    try {
      const key = `aff:${dimension}:${userId}`
      await this.client
        .multi()
        .hincrbyfloat(key, field, delta)
        .expire(key, ttlSeconds)
        .exec()
    } catch (err) {
      this.logger.warn(`affinityIncr failed: ${(err as Error).message}`)
    }
  }

  /** Read every field of one affinity dimension as a Map (or null if absent). */
  async affinityGetAll(
    userId: string,
    dimension: 'author' | 'tag' | 'community' | 'kind',
  ): Promise<Map<string, number> | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.hgetall(`aff:${dimension}:${userId}`)
      if (!raw || Object.keys(raw).length === 0) return null
      const out = new Map<string, number>()
      for (const [k, v] of Object.entries(raw)) out.set(k, Number(v))
      return out
    } catch {
      return null
    }
  }

  /**
   * Read ONLY the requested fields of an affinity dimension — one HMGET.
   * Feed ranking only needs the authors/tags/communities/kinds present in the
   * candidate pool, so this avoids pulling a heavy user's entire profile per
   * request (the HGETALL path is kept for rebuild/decay bookkeeping).
   */
  async affinityGetMany(
    userId: string,
    dimension: 'author' | 'tag' | 'community' | 'kind',
    fields: string[],
  ): Promise<Map<string, number>> {
    const out = new Map<string, number>()
    if (!this.client || fields.length === 0) return out
    try {
      const raw = await this.client.hmget(`aff:${dimension}:${userId}`, ...fields)
      fields.forEach((field, i) => {
        const v = raw[i]
        if (v !== null && v !== undefined && v !== '') out.set(field, Number(v))
      })
      return out
    } catch {
      return out
    }
  }

  /**
   * Decay every affinity score by `factor` (e.g. 0.95 daily). Fields that drop
   * below `floor` are removed so the hash stays bounded. SCAN-based — safe to
   * run on a live cluster without blocking.
   */
  async affinityDecayAll(factor = 0.95, floor = 0.1): Promise<number> {
    if (!this.client) return 0
    let decayed = 0
    try {
      let cursor = '0'
      do {
        const [next, keys] = await this.client.scan(cursor, 'MATCH', 'aff:*', 'COUNT', 500)
        cursor = next
        for (const key of keys) {
          const raw = await this.client.hgetall(key)
          if (!raw || Object.keys(raw).length === 0) continue
          const multi = this.client.multi()
          let removedAll = true
          for (const [field, value] of Object.entries(raw)) {
            const nextVal = Number(value) * factor
            if (Math.abs(nextVal) < floor) {
              multi.hdel(key, field)
            } else {
              multi.hset(key, field, String(nextVal))
              removedAll = false
            }
          }
          if (removedAll) multi.del(key) // fully-decayed profile → reclaim the key
          await multi.exec()
          decayed++
        }
      } while (cursor !== '0')
    } catch (err) {
      this.logger.warn(`affinityDecayAll failed: ${(err as Error).message}`)
    }
    return decayed
  }

  // ── PUB/SUB ───────────────────────────────────────────────────────────────

  /**
   * Publish a realtime event for OTHER instances to relay; returns false when
   * Redis is unavailable. `origin` identifies the publishing instance so its
   * own subscriber can skip the message (the publisher already emitted locally).
   */
  async publishRealtime(room: string, event: string, payload: unknown, origin?: string): Promise<boolean> {
    if (!this.client) return false
    try {
      await this.client.publish(REALTIME_CHANNEL, JSON.stringify({ room, event, payload, origin }))
      return true
    } catch (err) {
      this.logger.warn(`publishRealtime failed: ${(err as Error).message}`)
      return false
    }
  }
}
