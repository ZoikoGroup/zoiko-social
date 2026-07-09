import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'
import { JwtVerificationService } from '../auth/jwt-verification.service'
import { MessagingService } from './messaging.service'
import { PresenceService } from './presence.service'

interface AuthSocket extends Socket {
  data: { userId?: string }
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessagingGateway.name)

  @WebSocketServer()
  server!: Server

  constructor(
    private readonly jwtVerification: JwtVerificationService,
    private readonly messagingService: MessagingService,
    private readonly presenceService: PresenceService,
  ) {}

  async handleConnection(client: AuthSocket): Promise<void> {
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

      // Set online
      await this.presenceService.setOnline(user.id)

      client.emit('connected', { userId: user.id })
    } catch (err) {
      this.logger.error(`Messaging socket auth failed: ${(err as Error).message}`)
      client.emit('error', { code: 'AUTH_FAILED', message: 'Invalid or expired token' })
      client.disconnect(true)
    }
  }

  async handleDisconnect(client: AuthSocket): Promise<void> {
    if (client.data.userId) {
      // Set offline with a small delay to handle reconnections
      setTimeout(() => {
        void this.presenceService.setOffline(client.data.userId!)
      }, 5_000)
    }
  }

  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string },
  ): Promise<{ ok: boolean }> {
    if (!client.data.userId || !body?.conversationId) return { ok: false }
    await client.join(`conversation:${body.conversationId}`)
    return { ok: true }
  }

  @SubscribeMessage('conversation:leave')
  async onLeaveConversation(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string },
  ): Promise<{ ok: boolean }> {
    if (!body?.conversationId) return { ok: false }
    await client.leave(`conversation:${body.conversationId}`)
    return { ok: true }
  }

  @SubscribeMessage('typing:start')
  async onTypingStart(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string },
  ): Promise<void> {
    if (!client.data.userId || !body?.conversationId) return
    await this.presenceService.setTyping(client.data.userId, body.conversationId, true)
  }

  @SubscribeMessage('typing:stop')
  async onTypingStop(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string },
  ): Promise<void> {
    if (!client.data.userId || !body?.conversationId) return
    await this.presenceService.setTyping(client.data.userId, body.conversationId, false)
  }

  @SubscribeMessage('messages:read')
  async onMessagesRead(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string; messageId?: string },
  ): Promise<void> {
    if (!client.data.userId || !body?.conversationId) return
    await this.messagingService.markConversationRead(client.data.userId, body.conversationId, body.messageId)
  }

  @SubscribeMessage('presence:subscribe')
  async onPresenceSubscribe(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { userId?: string },
  ): Promise<void> {
    if (!body?.userId) return
    await client.join(`presence:${body.userId}`)
    // Send current presence
    const presence = await this.presenceService.getPresence(body.userId)
    client.emit('presence:update', { userId: body.userId, ...presence })
  }

  @SubscribeMessage('presence:unsubscribe')
  async onPresenceUnsubscribe(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { userId?: string },
  ): Promise<void> {
    if (!body?.userId) return
    await client.leave(`presence:${body.userId}`)
  }
}
