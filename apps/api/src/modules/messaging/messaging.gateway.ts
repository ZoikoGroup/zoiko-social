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
    {
      callerId: string
      callType: 'audio' | 'video'
      acceptedAt: number | null
      isGroup: boolean
      // Users who have accepted (started media). A "participant" is the caller or
      // anyone in this set — only participants may end/record the call.
      acceptedBy: Set<string>
    }
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
    // These three reads are independent; running them concurrently (rather than
    // serially) is what keeps the ring from lagging seconds behind the tap.
    const [memberIds, isMember, identity] = await Promise.all([
      this.messagingService.getOtherMemberIds(body.conversationId, fromUserId),
      this.messagingService.isMember(fromUserId, body.conversationId),
      this.messagingService.getCallIdentity(fromUserId),
    ])
    if (!isMember) return
    if (!memberIds.includes(body.toUserId)) return
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
    // Independent reads run concurrently so the group ring fans out immediately.
    const [isMember, memberIds, identity] = await Promise.all([
      this.messagingService.isMember(fromUserId, body.conversationId),
      this.messagingService.getOtherMemberIds(body.conversationId, fromUserId),
      this.messagingService.getCallIdentity(fromUserId),
    ])
    if (!isMember) return
    const payload = this.buildCallPayload(fromUserId, { ...body, isGroup: true }, identity)
    await Promise.all(memberIds.map((uid) => this.realtimeService.publishToUser(uid, event, payload)))
  }

  /** Close out an in-flight call and write its record into the conversation. */
  private recordCall(conversationId: string | undefined, status: 'ended' | 'missed' | 'declined'): void {
    if (!conversationId) return
    const call = this.activeCalls.get(conversationId)
    if (!call) return
    this.activeCalls.delete(conversationId)
    // A call closed with call:end that was never accepted is a MISSED call, not a
    // completed 1-second one (recordCallMessage floors "ended" duration to 0:01).
    let finalStatus = status
    let durationSec = 0
    if (call.acceptedAt) {
      durationSec = Math.round((Date.now() - call.acceptedAt) / 1000)
    } else if (status === 'ended') {
      finalStatus = 'missed'
    }
    this.messagingService
      .recordCallMessage(call.callerId, conversationId, { kind: call.callType, status: finalStatus, durationSec })
      .catch((err: Error) => this.logger.warn(`Call record failed: ${err.message}`))
  }

  @SubscribeMessage('call:invite')
  async onCallInvite(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    const isGroup = !body?.toUserId || body?.isGroup === true
    if (isGroup) await this.fanOutCall(client, 'call:invite', body)
    else await this.relayCall(client, 'call:invite', body)

    const userId = client.data.userId
    const conversationId = body?.conversationId
    if (!userId || !conversationId) return
    // Never overwrite an in-flight call: a re-dial or a bystander's invite would
    // reset acceptedAt (→ duration 0) and reassign callerId, corrupting the
    // record. And only a member may open call state — the relay above already
    // fails safe for non-members, but the map write did not.
    if (this.activeCalls.has(conversationId)) return
    if (!(await this.messagingService.isMember(userId, conversationId))) return
    this.activeCalls.set(conversationId, {
      callerId: userId,
      callType: body.callType ?? 'audio',
      acceptedAt: null,
      isGroup,
      acceptedBy: new Set<string>(),
    })
  }

  @SubscribeMessage('call:accept')
  async onCallAccept(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:accept', body)
    const userId = client.data.userId
    const conversationId = body?.conversationId
    const call = conversationId ? this.activeCalls.get(conversationId) : undefined
    // Only the invited party (a member who isn't the caller) may start the
    // duration clock — otherwise any socket could forge/inflate call duration by
    // emitting call:accept.
    if (!call || !userId || !conversationId || userId === call.callerId) return
    if (!(await this.messagingService.isMember(userId, conversationId))) return
    call.acceptedBy.add(userId)
    if (!call.acceptedAt) call.acceptedAt = Date.now()
  }

  @SubscribeMessage('call:reject')
  async onCallReject(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    await this.relayCall(client, 'call:reject', body)
    const userId = client.data.userId
    const conversationId = body?.conversationId
    const call = conversationId ? this.activeCalls.get(conversationId) : undefined
    // Group calls: one member declining doesn't finish the call — no record.
    if (!call || call.isGroup || !userId || !conversationId) return
    // Only a member (the invited callee) may finalize a DM as declined/missed.
    if (!(await this.messagingService.isMember(userId, conversationId))) return
    // busy = the callee never saw it ring → record as missed, not declined
    this.recordCall(conversationId, body?.reason === 'busy' ? 'missed' : 'declined')
  }

  @SubscribeMessage('call:cancel')
  async onCallCancel(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    const userId = client.data.userId
    const conversationId = body?.conversationId
    const call = conversationId ? this.activeCalls.get(conversationId) : undefined
    // Group: cancel must stop EVERY member's ringing
    if (call?.isGroup || (!body?.toUserId && conversationId)) {
      await this.fanOutCall(client, 'call:cancel', body)
    } else {
      await this.relayCall(client, 'call:cancel', body)
    }
    // Only the caller can cancel their own ring.
    if (call && conversationId && userId === call.callerId) {
      this.recordCall(conversationId, 'missed')
    }
  }

  @SubscribeMessage('call:end')
  async onCallEnd(@ConnectedSocket() client: AuthSocket, @MessageBody() body: CallSignal): Promise<void> {
    const userId = client.data.userId
    const conversationId = body?.conversationId
    const call = conversationId ? this.activeCalls.get(conversationId) : undefined
    // Group: a member hanging up just leaves the room — others keep talking,
    // so the end signal is NOT relayed. The record is written once (first leave,
    // MVP semantics) and the map delete makes later end signals no-ops.
    if (!call?.isGroup) {
      await this.relayCall(client, 'call:end', body)
    }
    // Only a participant (the caller or someone who accepted) may end + record —
    // otherwise a group member not on the call could terminate it for everyone
    // and write a bogus record.
    if (call && conversationId && userId && (userId === call.callerId || call.acceptedBy.has(userId))) {
      this.recordCall(conversationId, 'ended')
    }
  }
}
