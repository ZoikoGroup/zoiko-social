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
import { RealtimeService } from '../realtime/realtime.service'

interface AuthSocket extends Socket {
  data: { userId?: string }
}

/** Ephemeral 1:1 call signaling relayed between participants (no DB state). */
interface CallSignal {
  conversationId?: string
  toUserId?: string
  callType?: 'audio' | 'video'
  roomName?: string
  fromDisplayName?: string
  fromAvatarUrl?: string | null
  reason?: string
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessagingGateway.name)

  /**
   * In-flight 1:1 calls keyed by conversationId — used to write a call record
   * ("Voice call · 2:05" / "Missed video call") into the chat when the call
   * finishes. In-memory state: fine on a single API instance (current
   * deployment); calls are short-lived and a lost record is non-critical.
   */
  private readonly activeCalls = new Map<
    string,
    { callerId: string; callType: 'audio' | 'video'; acceptedAt: number | null }
  >()

  @WebSocketServer()
  server!: Server

  constructor(
    private readonly jwtVerification: JwtVerificationService,
    private readonly messagingService: MessagingService,
    private readonly presenceService: PresenceService,
    private readonly realtimeService: RealtimeService,
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
      // Set offline with a small delay to handle reconnections.
      // MUST catch: a rejection here (e.g. Redis/DB hiccup) is otherwise an
      // unhandled rejection, which kills the whole process on Node ≥15.
      setTimeout(() => {
        this.presenceService.setOffline(client.data.userId!).catch((err: Error) => {
          this.logger.warn(`setOffline failed for ${client.data.userId}: ${err.message}`)
        })
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

  // ── CALL SIGNALING (1:1 audio/video) ────────────────────────────────────────
  // Relays ephemeral signaling to the target user's private room. LiveKit carries
  // the actual media; these events only coordinate ring/accept/reject/end.

  private async relayCall(
    client: AuthSocket,
    event: 'call:invite' | 'call:accept' | 'call:reject' | 'call:cancel' | 'call:end',
    body: CallSignal,
  ): Promise<void> {
    const fromUserId = client.data.userId
    if (!fromUserId || !body?.toUserId || !body?.conversationId) return
    await this.realtimeService.publishToUser(body.toUserId, event, {
      conversationId: body.conversationId,
      callType: body.callType ?? 'audio',
      roomName: body.roomName ?? `call:${body.conversationId}`,
      fromUserId,
      fromDisplayName: body.fromDisplayName,
      fromAvatarUrl: body.fromAvatarUrl ?? null,
      reason: body.reason,
    })
  }

  /** Close out an in-flight call and write its record into the conversation. */
  private recordCall(conversationId: string | undefined, status: 'ended' | 'missed' | 'declined'): void {
    if (!conversationId) return
    const call = this.activeCalls.get(conversationId)
    if (!call) return
    this.activeCalls.delete(conversationId)
    const durationSec = call.acceptedAt ? Math.round((Date.now() - call.acceptedAt) / 1000) : 0
    this.messagingService
      .recordCallMessage(call.callerId, conversationId, { kind: call.callType, status, durationSec })
      .catch((err: Error) => this.logger.warn(`Call record failed: ${err.message}`))
  }

  @SubscribeMessage('call:invite')
  async onCallInvite(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:invite', body)
    if (client.data.userId && body?.conversationId) {
      this.activeCalls.set(body.conversationId, {
        callerId: client.data.userId,
        callType: body.callType ?? 'audio',
        acceptedAt: null,
      })
    }
  }

  @SubscribeMessage('call:accept')
  async onCallAccept(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:accept', body)
    const call = body?.conversationId ? this.activeCalls.get(body.conversationId) : undefined
    if (call && !call.acceptedAt) call.acceptedAt = Date.now()
  }

  @SubscribeMessage('call:reject')
  async onCallReject(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:reject', body)
    // busy = the callee never saw it ring → record as missed, not declined
    this.recordCall(body?.conversationId, body?.reason === 'busy' ? 'missed' : 'declined')
  }

  @SubscribeMessage('call:cancel')
  async onCallCancel(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:cancel', body)
    this.recordCall(body?.conversationId, 'missed')
  }

  @SubscribeMessage('call:end')
  async onCallEnd(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:end', body)
    this.recordCall(body?.conversationId, 'ended')
  }
}
