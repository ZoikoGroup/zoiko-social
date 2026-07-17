import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { RealtimeService } from '../realtime/realtime.service'

const PRESENCE_TTL_SECONDS = 60
const PRESENCE_KEY_PREFIX = 'presence:'

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
