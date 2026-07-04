import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'
import { RealtimeService } from './realtime.service'
import { JwtVerificationService } from '../auth/jwt-verification.service'

interface AuthenticatedSocket extends Socket {
  data: { userId?: string }
}

/**
 * RealtimeGateway — Socket.IO entry point.
 *
 * Handshake: client passes the Supabase access token via
 *   io(url, { auth: { token } })
 * The token is verified against Supabase Auth; on success the socket joins
 * its private `user:{id}` room. Unauthenticated sockets are disconnected.
 *
 * Client-initiated subscriptions:
 *   profile.subscribe   { profileId } — join profile:{id} for live counters
 *   profile.unsubscribe { profileId }
 */
@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name)

  @WebSocketServer()
  server!: Server

  constructor(
    private readonly jwtVerification: JwtVerificationService,
    private readonly realtimeService: RealtimeService,
  ) {}

  afterInit(server: Server): void {
    this.realtimeService.bindServer(server)
    this.logger.log('Socket.IO gateway initialised')
  }

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    const token =
      (client.handshake.auth?.token as string | undefined) ??
      client.handshake.headers.authorization?.replace(/^Bearer\s+/i, '')

    if (!token) {
      client.emit('error', { code: 'UNAUTHENTICATED', message: 'Access token required' })
      client.disconnect(true)
      return
    }

    try {
      const user = await this.jwtVerification.verify(token)
      client.data.userId = user.id
      await client.join(`user:${user.id}`)
      client.emit('connected', { userId: user.id })
    } catch (err) {
      this.logger.error(`Socket auth failed: ${(err as Error).message}`)
      client.emit('error', { code: 'AUTH_FAILED', message: 'Invalid or expired token' })
      client.disconnect(true)
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    // Rooms are cleaned up automatically by Socket.IO
    if (client.data.userId) {
      this.logger.debug(`Socket disconnected for user ${client.data.userId}`)
    }
  }

  @SubscribeMessage('profile.subscribe')
  async onProfileSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { profileId?: string },
  ): Promise<{ ok: boolean }> {
    if (!client.data.userId || !body?.profileId) return { ok: false }
    await client.join(`profile:${body.profileId}`)
    return { ok: true }
  }

  @SubscribeMessage('profile.unsubscribe')
  async onProfileUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { profileId?: string },
  ): Promise<{ ok: boolean }> {
    if (!body?.profileId) return { ok: false }
    await client.leave(`profile:${body.profileId}`)
    return { ok: true }
  }
}
