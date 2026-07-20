'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSocket } from '@/lib/socket'
import { useAuth } from '@/hooks/use-auth'

export interface PresenceState {
  status: 'online' | 'offline' | 'away' | 'do_not_disturb'
  lastSeen: string | null
  isOnline: boolean
}

/**
 * usePresence — tracks online/offline and typing status of specified users.
 *
 * Usage:
 *   const { getPresence, isUserOnline } = usePresence()
 *   const status = getPresence('user-uuid') // returns PresenceState
 *   const online = isUserOnline('user-uuid')
 *   subscribePresence('user-uuid') // Start listening for updates
 *   unsubscribePresence('user-uuid') // Stop listening
 */
export function usePresence() {
  const { isAuthenticated } = useAuth()
  const [presenceMap, setPresenceMap] = useState<Map<string, PresenceState>>(new Map())
  const [typingMap, setTypingMap] = useState<Map<string, string>>(new Map()) // userId -> conversationId
  const subscribedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setPresenceMap(new Map())
        setTypingMap(new Map())
      }, 0)
      subscribedRef.current.clear()
      return () => clearTimeout(timer)
    }

    let cancelled = false
    // Keep refs to the exact handlers so cleanup can remove THEM. usePresence is
    // called per conversation-list row, so without socket.off these accumulate on
    // the singleton socket on every remount (tab switch, navigation) — an
    // unbounded listener leak that triggers MaxListenersExceededWarning and fires
    // a setState storm on every presence/typing event.
    const onPresence = (data: { userId: string; status: string; lastSeen?: string; isOnline?: boolean }) => {
      setPresenceMap((prev) => {
        const next = new Map(prev)
        next.set(data.userId, {
          status: data.status as PresenceState['status'],
          lastSeen: data.lastSeen ?? null,
          isOnline: data.isOnline ?? data.status !== 'offline',
        })
        return next
      })
    }
    const onTyping = (data: { userId: string; conversationId: string; isTyping: boolean }) => {
      setTypingMap((prev) => {
        const next = new Map(prev)
        if (data.isTyping) {
          next.set(data.userId, data.conversationId)
        } else {
          next.delete(data.userId)
        }
        return next
      })
    }

    let boundSocket: Awaited<ReturnType<typeof getSocket>> | null = null
    getSocket().then((socket) => {
      if (cancelled || !socket) return
      boundSocket = socket
      socket.on('presence:update', onPresence)
      socket.on('typing:update', onTyping)
    })

    return () => {
      cancelled = true
      boundSocket?.off('presence:update', onPresence)
      boundSocket?.off('typing:update', onTyping)
    }
  }, [isAuthenticated])

  const subscribePresence = useCallback((userId: string) => {
    if (subscribedRef.current.has(userId)) return
    subscribedRef.current.add(userId)
    getSocket().then((s) => s?.emit('presence:subscribe', { userId }))
  }, [])

  const unsubscribePresence = useCallback((userId: string) => {
    subscribedRef.current.delete(userId)
    getSocket().then((s) => s?.emit('presence:unsubscribe', { userId }))
  }, [])

  const getPresence = useCallback(
    (userId: string): PresenceState => {
      return presenceMap.get(userId) ?? { status: 'offline', lastSeen: null, isOnline: false }
    },
    [presenceMap],
  )

  const isUserOnline = useCallback(
    (userId: string): boolean => {
      return presenceMap.get(userId)?.isOnline ?? false
    },
    [presenceMap],
  )

  const isUserTyping = useCallback(
    (userId: string, conversationId: string): boolean => {
      return typingMap.get(userId) === conversationId
    },
    [typingMap],
  )

  return {
    getPresence,
    isUserOnline,
    isUserTyping,
    subscribePresence,
    unsubscribePresence,
  }
}
