import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import type { Server } from 'socket.io'
import type Redis from 'ioredis'
import { RedisService, REALTIME_CHANNEL } from '../redis/redis.service'

/**
 * RealtimeService — single publish surface for all realtime events.
 *
 * Multi-instance topology:
 *   API pod A: service.publish() → Redis PUBLISH zoiko:realtime
 *   API pod B: subscriber → gateway server.to(room).emit(event, payload)
 *
 * Single-instance / degraded (no Redis): publish() emits directly on the
 * locally bound Socket.IO server.
 *
 * Room conventions:
 *   user:{userId}      — private room joined automatically on authenticated connect
 *   profile:{userId}   — public room clients join while viewing a profile (live counters)
 */
@Injectable()
export class RealtimeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RealtimeService.name)
  private server: Server | null = null
  private subscriber: Redis | null = null

  constructor(private readonly redis: RedisService) {}

  onModuleInit(): void {
    this.subscriber = this.redis.createConnection()
    if (!this.subscriber) return

    void this.subscriber.subscribe(REALTIME_CHANNEL)
    this.subscriber.on('message', (_channel: string, raw: string) => {
      try {
        const { room, event, payload } = JSON.parse(raw) as { room: string; event: string; payload: unknown }
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

  /** Fan an event out to a room across all API instances. */
  async publish(room: string, event: string, payload: unknown): Promise<void> {
    const published = await this.redis.publishRealtime(room, event, payload)
    if (!published) {
      // No Redis — single-instance mode, emit straight to local sockets
      this.emitLocal(room, event, payload)
    }
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
