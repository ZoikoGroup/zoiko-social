import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'

/*
  How long a presence record stays trustworthy without being refreshed.

  Two things expire on this clock: the Redis key's TTL, and the staleness check
  against `lastSeen` in the database. Both exist so that an API crash cannot
  leave somebody showing "online" forever, since a process that dies never runs
  setOffline.

  It used to be 60 seconds, and nothing ever refreshed either signal —
  `setOnline` stamped them once when the socket connected and that was the last
  word on the subject. So everyone went offline exactly a minute after
  connecting while still sitting on the page, which is what the heartbeat below
  now prevents. The window is wide enough that a heartbeat throttled to once a
  minute — what browsers do to a background tab — still lands inside it.
*/
const PRESENCE_TTL_SECONDS = 120
const PRESENCE_KEY_PREFIX = 'presence:'

/**
 * Least time between two database writes for the same member's heartbeat.
 *
 * The heartbeat is client-driven, so this is what stops a tab — broken or
 * hostile — turning a 30-second beat into a write per frame. Well under the
 * TTL, so honest beats are never the ones dropped.
 */
const TOUCH_MIN_INTERVAL_MS = 10_000

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly realtime: RealtimeService,
  ) {}

  async setOnline(userId: string, device?: string): Promise<void> {
    const presence = { status: 'online' as const, lastSeen: new Date().toISOString(), device: device ?? 'web' }
    await this.storePresence(userId, presence)
    await this.realtime.publishToUser(userId, 'presence:update', { userId, ...presence })

    // Also broadcast to followers who care
    await this.broadcastPresenceToConnections(userId, 'online')
  }

  /**
   * "Still here" — refreshes the freshness signals without changing status.
   *
   * Sent periodically by every connected socket. Without it, presence answered
   * a question nobody asked: not "is this member here?" but "did this member
   * connect within the last minute?" — so an hour of reading the feed looked
   * identical to having closed the tab.
   *
   * Status is deliberately left alone. Someone who set themselves to away or
   * do-not-disturb stays that way however active they are; only the timestamp
   * that proves the record is current gets moved.
   *
   * A member with no row is skipped rather than created. The row is written by
   * setOnline when the socket connects, and a heartbeat arriving without one
   * means a disconnect has already cleaned up — recreating it here would put
   * somebody back online who is not.
   */
  async touch(userId: string): Promise<void> {
    const now = Date.now()
    if (now - (this.lastTouchAt.get(userId) ?? 0) < TOUCH_MIN_INTERVAL_MS) return
    this.lastTouchAt.set(userId, now)
    this.pruneTouchLog(now)

    const lastSeen = new Date(now)
    const row = await this.prisma.userPresence
      .update({ where: { userId }, data: { lastSeen }, select: { status: true } })
      .catch(() => null)
    if (!row) return

    try {
      const key = `${PRESENCE_KEY_PREFIX}user:${userId}`
      await this.redis.rawClient?.hset(key, {
        status: row.status,
        lastSeen: lastSeen.toISOString(),
      })
      await this.redis.rawClient?.expire(key, PRESENCE_TTL_SECONDS)
    } catch {
      // Redis is only the fast path; the row above is what getPresence falls
      // back to, and it is already current.
    }
  }

  /** Last heartbeat write per member, for the throttle above. */
  private readonly lastTouchAt = new Map<string, number>()
  private lastPruneAt = 0

  /**
   * Drops heartbeat entries for members who have long since gone.
   *
   * The throttle map would otherwise hold one entry per member who has ever
   * connected to this process, for the life of the process.
   */
  private pruneTouchLog(now: number): void {
    if (now - this.lastPruneAt < PRESENCE_TTL_SECONDS * 1000) return
    this.lastPruneAt = now
    const cutoff = now - PRESENCE_TTL_SECONDS * 1000
    for (const [userId, at] of this.lastTouchAt) {
      if (at < cutoff) this.lastTouchAt.delete(userId)
    }
  }

  async setOffline(userId: string): Promise<void> {
    const presence = { status: 'offline' as const, lastSeen: new Date().toISOString() }
    await this.storePresence(userId, presence)
    await this.realtime.publishToUser(userId, 'presence:update', { userId, ...presence })
    await this.broadcastPresenceToConnections(userId, 'offline')
  }

  async setAway(userId: string): Promise<void> {
    const presence = { status: 'away' as const, lastSeen: new Date().toISOString() }
    await this.storePresence(userId, presence)
    await this.realtime.publishToUser(userId, 'presence:update', { userId, ...presence })
  }

  async setDoNotDisturb(userId: string): Promise<void> {
    const presence = { status: 'do_not_disturb' as const, lastSeen: new Date().toISOString() }
    await this.storePresence(userId, presence)
    await this.realtime.publishToUser(userId, 'presence:update', { userId, ...presence })
  }

  async setTyping(userId: string, conversationId: string, isTyping: boolean): Promise<void> {
    // Best-effort — a Redis outage/quota rejection must never break typing events
    try {
      if (isTyping) {
        await this.redis.rawClient?.setex(
          `${PRESENCE_KEY_PREFIX}typing:${conversationId}:${userId}`,
          15,
          '1',
        )
      } else {
        await this.redis.rawClient?.del(`${PRESENCE_KEY_PREFIX}typing:${conversationId}:${userId}`)
      }
    } catch {
      // degrade silently — the broadcast below still tells clients
    }

    // Broadcast to the conversation room
    await this.realtime.publish(`conversation:${conversationId}`, 'typing:update', {
      userId,
      conversationId,
      isTyping,
    })
  }

  async getPresence(userId: string): Promise<{ status: string; lastSeen: string | null; isOnline: boolean }> {
    // Check Redis first (fast path) — fall through to the DB on any Redis failure
    let cached: Record<string, string> | undefined
    try {
      cached = await this.redis.rawClient?.hgetall(`${PRESENCE_KEY_PREFIX}user:${userId}`)
    } catch {
      cached = undefined
    }
    if (cached?.status) {
      return {
        status: cached.status,
        lastSeen: cached.lastSeen ?? null,
        isOnline: cached.status !== 'offline',
      }
    }

    // Fall back to database. The Redis key (with its TTL) is the freshness
    // signal; if it has expired we're here. The DB row has no expiry, so on an
    // API crash/restart a user who never sent setOffline would otherwise appear
    // "online" forever. Treat a stale `online` row (lastSeen older than the
    // Redis TTL) as offline.
    const dbPresence = await this.prisma.userPresence.findUnique({
      where: { userId },
      select: { status: true, lastSeen: true },
    })

    const isStale =
      !dbPresence?.lastSeen ||
      Date.now() - dbPresence.lastSeen.getTime() > PRESENCE_TTL_SECONDS * 1000
    const isOnline = dbPresence?.status === 'online' && !isStale

    return {
      status: isOnline ? (dbPresence?.status ?? 'offline') : 'offline',
      lastSeen: dbPresence?.lastSeen?.toISOString() ?? null,
      isOnline,
    }
  }

  /**
   * Presence for many users at once.
   *
   * The conversation list needs the other participant's presence for every DM on
   * the page, which used to mean one `getPresence` round trip per conversation.
   * This pipelines the Redis reads and resolves whatever Redis didn't answer for
   * with a single `IN` query, so an inbox page costs two round trips instead of
   * twenty-one.
   */
  async getPresenceMany(
    userIds: string[],
  ): Promise<Map<string, { status: string; lastSeen: string | null; isOnline: boolean }>> {
    const result = new Map<string, { status: string; lastSeen: string | null; isOnline: boolean }>()
    const unique = [...new Set(userIds)]
    if (unique.length === 0) return result

    const missing: string[] = []
    const client = this.redis.rawClient
    if (client) {
      try {
        const pipeline = client.pipeline()
        for (const id of unique) pipeline.hgetall(`${PRESENCE_KEY_PREFIX}user:${id}`)
        const replies = await pipeline.exec()
        unique.forEach((id, i) => {
          const [err, value] = replies?.[i] ?? [new Error('no reply'), null]
          const hash = !err && value ? (value as Record<string, string>) : null
          if (hash?.status) {
            result.set(id, {
              status: hash.status,
              lastSeen: hash.lastSeen ?? null,
              isOnline: hash.status !== 'offline',
            })
          } else {
            missing.push(id)
          }
        })
      } catch {
        // Redis unavailable — everything falls through to the DB below.
        missing.push(...unique.filter((id) => !result.has(id)))
      }
    } else {
      missing.push(...unique)
    }

    if (missing.length > 0) {
      const rows = await this.prisma.userPresence.findMany({
        where: { userId: { in: missing } },
        select: { userId: true, status: true, lastSeen: true },
      })
      const byUser = new Map(rows.map((r) => [r.userId, r]))
      for (const id of missing) {
        const row = byUser.get(id)
        // Same staleness rule as getPresence: an `online` row older than the
        // Redis TTL means the process died without writing setOffline.
        const isStale =
          !row?.lastSeen || Date.now() - row.lastSeen.getTime() > PRESENCE_TTL_SECONDS * 1000
        const isOnline = row?.status === 'online' && !isStale
        result.set(id, {
          status: isOnline ? (row?.status ?? 'offline') : 'offline',
          lastSeen: row?.lastSeen?.toISOString() ?? null,
          isOnline,
        })
      }
    }

    return result
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const presence = await this.getPresence(userId)
    return presence.isOnline
  }

  async isTyping(conversationId: string, userId: string): Promise<boolean> {
    try {
      const exists = await this.redis.rawClient?.exists(
        `${PRESENCE_KEY_PREFIX}typing:${conversationId}:${userId}`,
      )
      return exists === 1
    } catch {
      return false
    }
  }

  private async storePresence(userId: string, data: { status: string; lastSeen: string; device?: string }): Promise<void> {
    const redisKey = `${PRESENCE_KEY_PREFIX}user:${userId}`

    // Redis cache — best-effort; the DB below is the source of truth
    try {
      await this.redis.rawClient?.hset(redisKey, data)
      await this.redis.rawClient?.expire(redisKey, PRESENCE_TTL_SECONDS)
    } catch {
      // degrade to DB-only presence
    }

    // Database
    await this.prisma.userPresence.upsert({
      where: { userId },
      update: {
        status: data.status as never,
        lastSeen: new Date(data.lastSeen),
        device: data.device,
      },
      create: {
        userId,
        status: data.status as never,
        lastSeen: new Date(data.lastSeen),
        device: data.device,
      },
    })
  }

  private async broadcastPresenceToConnections(userId: string, status: string): Promise<void> {
    // Notify all followers who have them in their conversation list
    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId, status: 'active' },
      select: { followerId: true },
      take: 200,
    })

    for (const f of followers) {
      await this.realtime.publishToUser(f.followerId, 'presence:update', { userId, status, lastSeen: new Date().toISOString() })
    }
  }
}
