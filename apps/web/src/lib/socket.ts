import { io, type Socket } from 'socket.io-client'
import { createClient } from '@/lib/supabase/client'

/**
 * Singleton Socket.IO connection to the API, authenticated with the
 * Supabase access token. Reconnects automatically; call disconnectSocket()
 * on sign-out so the next user gets a fresh authenticated connection.
 */

let socket: Socket | null = null

export async function getSocket(): Promise<Socket | null> {
  if (socket?.connected) return socket

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return null

  if (socket) {
    if (!socket.connected) socket.connect()
    return socket
  }

  // `auth` as a FUNCTION is invoked before every (re)connection attempt, so each
  // connect pulls the latest Supabase access token. With a static token object,
  // a long-lived tab kept the token it first connected with; after the ~1h token
  // lifetime any reconnect would send the stale token and the server would reject
  // it in a loop (messaging/calls/presence silently dying until a full reload).
  socket = io(process.env.NEXT_PUBLIC_API_URL ?? '', {
    auth: (cb: (data: { token?: string }) => void) => {
      createClient()
        .auth.getSession()
        .then(({ data: { session: s } }) => cb(s?.access_token ? { token: s.access_token } : {}))
        .catch(() => cb({}))
    },
    transports: ['websocket', 'polling'],
    reconnectionDelayMax: 10_000,
  })

  startHeartbeat(socket)

  return socket
}

/**
 * Tells the server the tab is still here, for as long as it is.
 *
 * Presence expires by design — a crashed API must not leave people showing
 * "online" forever — but nothing on this side ever pushed back against that
 * expiry. Connecting stamped the record once, and a minute later the member
 * went offline while still reading the page.
 *
 * It lives with the socket rather than in a component because presence is a
 * property of the connection, not of whatever happens to be on screen: the
 * profile card, the feed and the inbox would otherwise each need to remember
 * to do it, and a member sitting on a page that forgot would go offline again.
 *
 * Comfortably inside the server's window, which leaves room for the once-a-
 * minute throttle browsers impose on a background tab.
 */
const HEARTBEAT_MS = 30_000

function startHeartbeat(s: Socket): void {
  let timer: ReturnType<typeof setInterval> | null = null

  const stop = (): void => {
    if (timer) clearInterval(timer)
    timer = null
  }

  s.on('connect', () => {
    stop()
    timer = setInterval(() => {
      if (s.connected) s.emit('presence:heartbeat')
    }, HEARTBEAT_MS)
  })

  // A dropped connection stops the beat; reconnecting starts a fresh one, and
  // the server marks the member online again as part of the handshake.
  s.on('disconnect', stop)
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
