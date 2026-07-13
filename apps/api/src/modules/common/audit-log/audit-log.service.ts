import { Injectable, Logger } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

export interface AuditLogEntry {
  actorId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  oldData?: unknown
  newData?: unknown
  ipAddress?: string | null
  userAgent?: string | null
}

/**
 * Immutable audit trail (Principle 05 — every enforcement/admin action is
 * auditable). A logging failure must never break the action being logged, so
 * every write here is best-effort.
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name)

  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: entry.actorId ?? null,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId ?? null,
          oldData: entry.oldData === undefined ? undefined : (entry.oldData as Prisma.InputJsonValue),
          newData: entry.newData === undefined ? undefined : (entry.newData as Prisma.InputJsonValue),
          ipAddress: entry.ipAddress ?? null,
          userAgent: entry.userAgent ?? null,
        },
      })
    } catch (err) {
      this.logger.error(`Failed to write audit log entry for action "${entry.action}": ${(err as Error).message}`)
    }
  }
}
