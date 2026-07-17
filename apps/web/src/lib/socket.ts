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

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
