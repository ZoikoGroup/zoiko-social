import type { Logger } from '@nestjs/common'
import type { Server, Socket } from 'socket.io'
import type { JwtVerificationService } from '../auth/jwt-verification.service'

/** Every socket carries the resolved user id, plus why auth failed if it did. */
export interface SocketAuthData {
  userId?: string
  authError?: string
}

/**
 * Authenticate a socket in Socket.IO middleware rather than in handleConnection.
 *
 * handleConnection is async — it verified the token and only then set
 * `data.userId`. Socket.IO does not wait for it before dispatching buffered
 * events, and the client emits the moment the transport is up:
 * getSocket() resolves as soon as io() returns, and HomeFeed, CommentThread and
 * MessageConversation each emit immediately after. So `feed.subscribe`,
 * `post.subscribe` and `conversation:join` regularly arrived before the token
 * had been verified, read `data.userId` as undefined and returned { ok: false }.
 * Measured locally: two of three connections lost the race. The socket stayed
 * connected and nothing errored, so the room was silently never joined — live
 * feed updates, comment updates, typing, presence and message delivery just did
 * not arrive, and a reload "fixed" it.
 *
 * Middleware closes the window: it runs before the connection completes and
 * before any event is dispatched, so a handler can rely on data.userId.
 *
 * Deliberately always calls next(): rejecting here would surface as
 * `connect_error` on the client, whereas today an unauthenticated socket gets an
 * `error` event then a disconnect from handleConnection. Auth is still enforced
 * there — this only moves *when* the identity is resolved, not whether it is
 * required. handleConnection reads the result instead of verifying again, so
 * there is still exactly one verification per connection.
 */
export function registerSocketAuth(
  server: Server,
  jwtVerification: JwtVerificationService,
  logger: Logger,
): void {
  // Both gateways share the default namespace and each registers this, so guard
  // against verifying the same socket twice.
  const FLAG = '__zoikoAuthApplied'
  const marked = server as unknown as Record<string, boolean>
  if (marked[FLAG]) return
  marked[FLAG] = true

  server.use((socket: Socket, next: (err?: Error) => void) => {
    const data = socket.data as SocketAuthData
    if (data.userId) return next()

    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '')

    if (!token) {
      data.authError = 'Access token required'
      return next()
    }

    jwtVerification
      .verify(token)
      .then((user) => {
        data.userId = user.id
        next()
      })
      .catch((err: Error) => {
        data.authError = err.message
        logger.warn(`Socket auth failed: ${err.message}`)
        next()
      })
  })
}
