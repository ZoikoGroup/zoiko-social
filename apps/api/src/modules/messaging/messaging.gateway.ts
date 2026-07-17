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

/**
 * Ephemeral call signaling relayed between participants (no DB state).
 * DM calls target a single `toUserId`; group calls omit it and the gateway
 * fans the signal out to every other member of the conversation.
 */
interface CallSignal {
  conversationId?: string
  toUserId?: string
  callType?: 'audio' | 'video'
  roomName?: string
  fromDisplayName?: string
  fromAvatarUrl?: string | null
  reason?: string
  isGroup?: boolean
  conversationName?: string
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
    { callerId: string; callType: 'audio' | 'video'; acceptedAt: number | null; isGroup: boolean }
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
    const userId = client.data.userId
    if (!userId) return
    // Set offline with a small delay to handle reconnections, but only if the
    // user has no other live sockets. Without the refcount check, closing one of
    // several tabs — or a brief network blip that triggers a reconnect — would
    // flip a still-connected user to "offline" 5s later (presence flapping).
    // A disconnected socket auto-leaves its rooms, and a reconnect re-joins
    // `user:{id}` in handleConnection, so the room reflects only live sockets.
    setTimeout(() => {
      void (async () => {
        try {
          const remaining = await this.server.in(`user:${userId}`).allSockets()
          if (remaining.size > 0) return
          await this.presenceService.setOffline(userId)
        } catch (err) {
          this.logger.warn(`setOffline failed for ${userId}: ${(err as Error).message}`)
        }
      })()
    }, 5_000)
  }

  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: { conversationId?: string },
  ): Promise<{ ok: boolean }> {
    if (!client.data.userId || !body?.conversationId) return { ok: false }
    // Membership gate: without it any authenticated socket could join
    // `conversation:<any-id>` and receive every message/edit/reaction/typing
    // event broadcast to that room (cross-conversation data leak).
    if (!(await this.messagingService.isMember(client.data.userId, body.conversationId))) {
      return { ok: false }
    }
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

  // ── CALL SIGNALING (1:1 and group audio/video) ─────────────────────────────
  // Relays ephemeral signaling to user rooms. LiveKit carries the actual media
  // (its rooms are natively multi-party); these events only coordinate
  // ring/accept/reject/end. DM signals target one user; group signals fan out
  // to every other conversation member.

  private buildCallPayload(
    fromUserId: string,
    body: CallSignal,
    identity: { displayName?: string; avatarUrl?: string | null },
  ) {
    return {
      conversationId: body.conversationId,
      callType: body.callType ?? 'audio',
      roomName: body.roomName ?? `call:${body.conversationId}`,
      fromUserId,
      // Identity is resolved server-side from the authenticated caller — never
      // trust body.fromDisplayName/fromAvatarUrl (client-spoofable impersonation).
      fromDisplayName: identity.displayName,
      fromAvatarUrl: identity.avatarUrl ?? null,
      reason: body.reason,
      isGroup: body.isGroup ?? false,
      conversationName: body.conversationName,
    }
  }

  private async relayCall(
    client: AuthSocket,
    event: 'call:invite' | 'call:accept' | 'call:reject' | 'call:cancel' | 'call:end',
    body: CallSignal,
  ): Promise<void> {
    const fromUserId = client.data.userId
    if (!fromUserId || !body?.toUserId || !body?.conversationId) return
    // Caller must belong to the conversation, and the target must be a co-member —
    // otherwise anyone could ring an arbitrary user via any conversation id.
    const memberIds = await this.messagingService.getOtherMemberIds(body.conversationId, fromUserId)
    if (!(await this.messagingService.isMember(fromUserId, body.conversationId))) return
    if (!memberIds.includes(body.toUserId)) return
    const identity = await this.messagingService.getCallIdentity(fromUserId)
    await this.realtimeService.publishToUser(body.toUserId, event, this.buildCallPayload(fromUserId, body, identity))
  }

  /** Fan a group-call signal out to every other active member of the conversation. */
  private async fanOutCall(
    client: AuthSocket,
    event: 'call:invite' | 'call:cancel' | 'call:end',
    body: CallSignal,
  ): Promise<void> {
    const fromUserId = client.data.userId
    if (!fromUserId || !body?.conversationId) return
    if (!(await this.messagingService.isMember(fromUserId, body.conversationId))) return
    const memberIds = await this.messagingService.getOtherMemberIds(body.conversationId, fromUserId)
    const identity = await this.messagingService.getCallIdentity(fromUserId)
    const payload = this.buildCallPayload(fromUserId, { ...body, isGroup: true }, identity)
    await Promise.all(memberIds.map((uid) => this.realtimeService.publishToUser(uid, event, payload)))
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
    const isGroup = !body?.toUserId || body?.isGroup === true
    if (isGroup) await this.fanOutCall(client, 'call:invite', body)
    else await this.relayCall(client, 'call:invite', body)

    if (client.data.userId && body?.conversationId) {
      this.activeCalls.set(body.conversationId, {
        callerId: client.data.userId,
        callType: body.callType ?? 'audio',
        acceptedAt: null,
        isGroup,
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
    // Group calls: one member declining doesn't finish the call — no record.
    const call = body?.conversationId ? this.activeCalls.get(body.conversationId) : undefined
    if (call?.isGroup) return
    // busy = the callee never saw it ring → record as missed, not declined
    this.recordCall(body?.conversationId, body?.reason === 'busy' ? 'missed' : 'declined')
  }

  @SubscribeMessage('call:cancel')
  async onCallCancel(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    const call = body?.conversationId ? this.activeCalls.get(body.conversationId) : undefined
    // Group: cancel must stop EVERY member's ringing
    if (call?.isGroup || (!body?.toUserId && body?.conversationId)) {
      await this.fanOutCall(client, 'call:cancel', body)
    } else {
      await this.relayCall(client, 'call:cancel', body)
    }
    this.recordCall(body?.conversationId, 'missed')
  }

  @SubscribeMessage('call:end')
  async onCallEnd(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    const call = body?.conversationId ? this.activeCalls.get(body.conversationId) : undefined
    // Group: a member hanging up just leaves the room — others keep talking,
    // so the end signal is NOT relayed. The record is written once (first leave,
    // MVP semantics) and the map delete makes later end signals no-ops.
    if (!call?.isGroup) {
      await this.relayCall(client, 'call:end', body)
    }
    this.recordCall(body?.conversationId, 'ended')
  }
}
