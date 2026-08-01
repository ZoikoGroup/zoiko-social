import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'
import { ConfigService } from '../config/config.service'

/**
 * AffinityService — the signal-capture half of the personalization engine.
 *
 * Every engagement a user performs nudges their per-user affinity profile in
 * Redis (see RedisService.affinityIncr). Weights encode how strongly each
 * action signals interest:
 *
 *   view      +1   (implicit — cheap, low weight, volume-limited by rate limit)
 *   like      +3   (explicit positive)
 *   comment   +4   (written intent — stronger than a like)
 *   save      +5   (deliberate "keep this" intent)
 *   follow    +5   (explicit author intent)
 *   share     +6   (strongest endorsement)
 *
 * Negative deltas (unlike / unfollow / unsave) walk the profile back so users
 * can correct the model. All writes are fire-and-forget from the callers'
 * perspective (they run inside the existing post-commit `effects()` hooks).
 *
 * Each signal also boosts the post's hashtags, community and kind so the feed
 * can generalise "you like this author" into "you like this topic".
 */

export const AFFINITY_WEIGHTS = {
  view: 1,
  like: 3,
  comment: 4,
  save: 5,
  follow: 5,
  share: 6,
} as const

/** How many hashtags per post are fed into the tag dimension (cap noise). */
const MAX_TAGS_PER_POST = 5

export interface AffinitySignalPost {
  authorId: string
  communityId: string | null
  kind: string
  hashtags: { hashtag: { tag: string } }[]
}

export interface AffinityProfile {
  authors: Map<string, number>
  tags: Map<string, number>
  communities: Map<string, number>
  kinds: Map<string, number>
  /** True when at least one dimension exists — used to detect cold start. */
  known: boolean
}

export const EMPTY_AFFINITY: AffinityProfile = {
  authors: new Map(),
  tags: new Map(),
  communities: new Map(),
  kinds: new Map(),
  known: false,
}

@Injectable()
export class AffinityService {
  private readonly logger = new Logger(AffinityService.name)

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  private get enabled(): boolean {
    return this.config.personalizationEnabled
  }

  private get ttlSeconds(): number {
    return this.config.affinityTtlDays * 24 * 3600
  }

  /**
   * Record a single engagement signal against a post. Skips when the actor is
   * the author (no self-affinity) or when personalization is disabled.
   */
  async record(userId: string, post: AffinitySignalPost, weight: number): Promise<void> {
    if (!this.enabled || !post || userId === post.authorId) return
    try {
      const ttl = this.ttlSeconds
      const writes: Promise<void>[] = [
        this.redis.affinityIncr(userId, 'author', post.authorId, weight, ttl),
        this.redis.affinityIncr(userId, 'kind', post.kind, weight, ttl),
      ]
      if (post.communityId) {
        writes.push(this.redis.affinityIncr(userId, 'community', post.communityId, weight, ttl))
      }
      for (const { hashtag } of post.hashtags?.slice(0, MAX_TAGS_PER_POST) ?? []) {
        writes.push(this.redis.affinityIncr(userId, 'tag', hashtag.tag, weight, ttl))
      }
      // Parallel writes — up to 8 dimensions per signal, but never serialized
      await Promise.all(writes)
    } catch (err) {
      this.logger.warn(`affinity record failed: ${(err as Error).message}`)
    }
  }

  /** Follow/unfollow — author-only signal, no post involved. */
  async recordAuthor(userId: string, authorId: string, delta: number): Promise<void> {
    if (!this.enabled || userId === authorId) return
    try {
      await this.redis.affinityIncr(userId, 'author', authorId, delta, this.ttlSeconds)
    } catch (err) {
      this.logger.warn(`affinity author record failed: ${(err as Error).message}`)
    }
  }

  /**
   * Author-dimension affinity only — the lighter read used by account
   * suggestions (1 HGETALL instead of the full 4-dimension profile).
   */
  async getAuthorAffinity(userId: string): Promise<Map<string, number>> {
    if (!this.enabled) return new Map()
    const authors = await this.redis.affinityGetAll(userId, 'author')
    return authors ?? new Map()
  }

  /**
   * The viewer's top tags by affinity score — powers the "Topics for you"
   * rail. One HGETALL on the tag dimension, sorted desc, capped.
   */
  async getTopTags(userId: string, limit = 10): Promise<string[]> {
    if (!this.enabled) return []
    const tags = await this.redis.affinityGetAll(userId, 'tag')
    if (!tags || tags.size === 0) return []
    return [...tags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag)
  }

  /** Load a user's full affinity profile (all four dimensions). */
  async getProfile(userId: string): Promise<AffinityProfile> {
    if (!this.enabled) return EMPTY_AFFINITY
    const [authors, tags, communities, kinds] = await Promise.all([
      this.redis.affinityGetAll(userId, 'author'),
      this.redis.affinityGetAll(userId, 'tag'),
      this.redis.affinityGetAll(userId, 'community'),
      this.redis.affinityGetAll(userId, 'kind'),
    ])
    return {
      authors: authors ?? new Map(),
      tags: tags ?? new Map(),
      communities: communities ?? new Map(),
      kinds: kinds ?? new Map(),
      known: !!(authors || tags || communities || kinds),
    }
  }

  /**
   * Pool-scoped profile read: fetch affinity ONLY for the dimensions/keys that
   * actually appear in a candidate pool (one HMGET per dimension). Feed ranking
   * uses this so a heavy user's full profile is never pulled per request.
   */
  async getProfileForPool(
    userId: string,
    pool: { authorId: string; communityId: string | null; kind: string; hashtags?: { hashtag: { tag: string } }[] }[],
  ): Promise<AffinityProfile> {
    if (!this.enabled || pool.length === 0) return EMPTY_AFFINITY
    const authors = [...new Set(pool.map((p) => p.authorId))]
    const communities = [...new Set(pool.map((p) => p.communityId).filter((c): c is string => !!c))]
    const kinds = [...new Set(pool.map((p) => p.kind))]
    const tags = [...new Set(pool.flatMap((p) => (p.hashtags ?? []).map((h) => h.hashtag.tag)))]

    const [authorMap, tagMap, communityMap, kindMap] = await Promise.all([
      this.redis.affinityGetMany(userId, 'author', authors),
      this.redis.affinityGetMany(userId, 'tag', tags),
      this.redis.affinityGetMany(userId, 'community', communities),
      this.redis.affinityGetMany(userId, 'kind', kinds),
    ])
    return {
      authors: authorMap,
      tags: tagMap,
      communities: communityMap,
      kinds: kindMap,
      known: authorMap.size > 0 || tagMap.size > 0 || communityMap.size > 0 || kindMap.size > 0,
    }
  }
}
