import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import type { Server } from 'socket.io'
import type Redis from 'ioredis'
import { RedisService, REALTIME_CHANNEL } from '../redis/redis.service'

/**
 * RealtimeService — single publish surface for all realtime events.
 *
 * Delivery model (local-first):
 *   1. publish() ALWAYS emits to the locally bound Socket.IO server first —
 *      same-instance recipients get the event even when Redis is down,
 *      over quota, or half-connected (a broken subscriber must never turn
 *      realtime into a black hole).
 *   2. The event is then PUBLISHed to Redis tagged with this instance's id
 *      so OTHER API instances can relay it. Each subscriber skips messages
 *      originating from itself, so nothing is double-delivered.
 *
 * Room conventions:
 *   user:{userId}      — private room joined automatically on authenticated connect
 *   profile:{userId}   — public room clients join while viewing a profile (live counters)
 */
@Injectable()
export class RealtimeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RealtimeService.name)
  private readonly instanceId = crypto.randomUUID()
  private server: Server | null = null
  private subscriber: Redis | null = null

  constructor(private readonly redis: RedisService) {}

  onModuleInit(): void {
    this.subscriber = this.redis.createConnection()
    if (!this.subscriber) return

    this.subscriber.subscribe(REALTIME_CHANNEL).catch((err: Error) => {
      this.logger.warn(`Realtime subscribe failed (local delivery still works): ${err.message}`)
    })
    this.subscriber.on('message', (_channel: string, raw: string) => {
      try {
        const { room, event, payload, origin } = JSON.parse(raw) as {
          room: string
          event: string
          payload: unknown
          origin?: string
        }
        // Already emitted locally by publish() on this instance
        if (origin === this.instanceId) return
        this.emitLocal(room, event, payload)
      } catch (err) {
        this.logger.warn(`Malformed realtime message: ${(err as Error).message}`)
      }
    })
    this.logger.log(`Subscribed to ${REALTIME_CHANNEL}`)
  }

  async onModuleDestroy(): Promise<void> {
    if (this.subscriber) {
      await this.subscriber.quit().catch(() => this.subscriber?.disconnect())
    }
  }

  /** Called by the gateway once Socket.IO is initialised. */
  bindServer(server: Server): void {
    this.server = server
  }

  /** Fan an event out to a room — local sockets first, then other instances via Redis. */
  async publish(room: string, event: string, payload: unknown): Promise<void> {
    // Local-first: never depends on Redis health
    this.emitLocal(room, event, payload)
    // Cross-instance relay (no-op / best-effort when Redis is unavailable)
    await this.redis.publishRealtime(room, event, payload, this.instanceId)
  }

  async publishToUser(userId: string, event: string, payload: unknown): Promise<void> {
    await this.publish(`user:${userId}`, event, payload)
  }

  async publishToProfile(profileId: string, event: string, payload: unknown): Promise<void> {
    await this.publish(`profile:${profileId}`, event, payload)
  }

  private emitLocal(room: string, event: string, payload: unknown): void {
    if (!this.server) return
    this.server.to(room).emit(event, payload)
  }
}
