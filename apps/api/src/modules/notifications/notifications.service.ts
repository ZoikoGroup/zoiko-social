import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

const MAX_PAGE_SIZE = 50

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    userId: string,
    page = 1,
    limit = 20,
    type?: string,
    cursor?: string,
  ): Promise<{
    data: NotificationItem[]
    total: number
    unreadCount: number
    nextCursor: string | null
    hasMore: boolean
  }> {
    const take = Math.min(limit, MAX_PAGE_SIZE)
    const where = { userId, ...(type ? { type } : {}) }

    // ── Cursor-based pagination ──────────────────────────────────────────
    if (cursor) {
      const decoded = decodeCursor(cursor)
      const notifications = await this.prisma.notification.findMany({
        where: {
          ...where,
          ...(decoded
            ? {
                OR: [
                  { createdAt: { lt: new Date(decoded.createdAt) } },
                  { createdAt: decoded.createdAt, id: { lt: decoded.tiebreaker } },
                ],
              }
            : {}),
        },
        take: take + 1,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      })

      const hasMore = notifications.length > take
      const items = hasMore ? notifications.slice(0, take) : notifications
      const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].id)
        : null


      const [total, unreadCount] = await Promise.all([
        this.prisma.notification.count({ where }),
        this.prisma.notification.count({ where: { userId, isRead: false } }),
      ])

      return {
        data: items.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          data: n.data as Record<string, unknown> | null,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        })),
        total,
        unreadCount,
        nextCursor,
        hasMore,
      }
    }

    // ── Offset-based pagination (backward compatible) ────────────────────
    const skip = (Math.max(page, 1) - 1) * take

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ])

    return {
      data: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        data: n.data as Record<string, unknown> | null,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      total,
      unreadCount,
      nextCursor: null,
      hasMore: skip + take < total,
    }
  }

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } })
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })
    if (result.count === 0) {
      throw new NotFoundException({ code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' })
    }
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return { updated: result.count }
  }
}
