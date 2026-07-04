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
    socket.auth = { token: session.access_token }
    if (!socket.connected) socket.connect()
    return socket
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL ?? '', {
    auth: { token: session.access_token },
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
