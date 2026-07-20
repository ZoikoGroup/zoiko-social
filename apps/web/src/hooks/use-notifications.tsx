'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { notificationsApi, type NotificationItem } from '@/lib/api'
import { getSocket, disconnectSocket } from '@/lib/socket'
import type { Socket } from 'socket.io-client'

// Module-level map to store socket cleanup functions without relying on `any` casts
const notifCleanups = new Map<Socket, () => void>()

interface NotificationsContextValue {
  unreadCount: number
  /** Most recent realtime notification — pages can react to it (e.g. prepend to a list). */
  latest: NotificationItem | null
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  setUnreadCount: (n: number) => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [latest, setLatest] = useState<NotificationItem | null>(null)

  // Initial unread count + realtime subscription
  useEffect(() => {
    let cancelled = false

    if (!isAuthenticated) {
      disconnectSocket()
      // Deferred reset — avoids synchronous setState inside the effect body
      const timer = setTimeout(() => {
        if (!cancelled) {
          setUnreadCount(0)
          setLatest(null)
        }
      }, 0)
      return () => { cancelled = true; clearTimeout(timer) }
    }

    notificationsApi.unreadCount()
      .then((c) => { if (!cancelled) setUnreadCount(c) })
      .catch(() => {})

    void getSocket().then((socket) => {
      if (!socket || cancelled) return

      // The alerts bell/feed is for follows, likes, comments, mentions and
      // system notices only. Direct messages are deliberately excluded — they
      // have their own unread badge in the Messages tab, so they must not inflate
      // the notifications bell or show up in the alerts list. (The messaging hook
      // handles its own message toast/sound off the realtime message events.)
      const onNotification = (notification: NotificationItem): void => {
        if (notification.type === 'message') return
        setLatest(notification)
        setUnreadCount((c) => c + 1)
      }

      socket.on('notification:new', onNotification)

      // Store cleanup
      notifCleanups.set(socket, () => {
        socket.off('notification:new', onNotification)
      })
    })

    return () => {
      cancelled = true
      // Clean up notification listeners if they were registered
      getSocket().then((s) => {
        if (s) {
          const cleanup = notifCleanups.get(s)
          cleanup?.()
          notifCleanups.delete(s)
        }
      })
    }
  }, [isAuthenticated])

  const markRead = useCallback(async (id: string) => {
    await notificationsApi.markRead(id)
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await notificationsApi.markAllRead()
    setUnreadCount(0)
  }, [])

  return (
    <NotificationsContext.Provider value={{ unreadCount, latest, markRead, markAllRead, setUnreadCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
