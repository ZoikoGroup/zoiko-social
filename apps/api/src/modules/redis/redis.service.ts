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

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private readonly client: Redis | null = null

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
    return new Redis(url, {
      maxRetriesPerRequest: options?.maxRetriesPerRequest === undefined ? 2 : options.maxRetriesPerRequest,
      retryStrategy: (times) => Math.min(times * 500, 5_000),
    })
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
    if (!this.client) return null
    try {
      const raw = await this.client.get(`rel:${userId}:${targetId}`)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  async setRelationship(userId: string, targetId: string, payload: unknown): Promise<void> {
    if (!this.client) return
    try {
      await this.client.set(`rel:${userId}:${targetId}`, JSON.stringify(payload), 'EX', RELATIONSHIP_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setRelationship failed: ${(err as Error).message}`)
    }
  }

  /** Invalidate both directions — a follow/block changes how each side sees the other. */
  async invalidateRelationship(userId: string, targetId: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.del(`rel:${userId}:${targetId}`, `rel:${targetId}:${userId}`)
    } catch (err) {
      this.logger.warn(`invalidateRelationship failed: ${(err as Error).message}`)
    }
  }

  // ── PROFILE CACHE ─────────────────────────────────────────────────────────

  async getProfile<T>(userId: string): Promise<T | null> {
    if (!this.client) return null
    try {
      const raw = await this.client.get(`profile:${userId}`)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  async setProfile(userId: string, payload: unknown): Promise<void> {
    if (!this.client) return
    try {
      await this.client.set(`profile:${userId}`, JSON.stringify(payload), 'EX', PROFILE_TTL_SECONDS)
    } catch (err) {
      this.logger.warn(`setProfile failed: ${(err as Error).message}`)
    }
  }

  async invalidateProfile(userId: string): Promise<void> {
    if (!this.client) return
    try {
      await this.client.del(`profile:${userId}`)
    } catch (err) {
      this.logger.warn(`invalidateProfile failed: ${(err as Error).message}`)
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
