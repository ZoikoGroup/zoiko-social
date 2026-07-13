import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'
import { AuditLogService } from '../common/audit-log/audit-log.service'
import { decodeCursor, encodeCursor } from '../common/utils/cursor-pagination'
import type { CreateReportInput, ResolveReportInput } from './moderation.schemas'

export interface ReportSummary {
  id: string
  targetType: string
  targetId: string
  reason: string
  note: string | null
  status: string
  reporter: { id: string; username: string; displayName: string } | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
}

export interface AuditLogEntrySummary {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  createdAt: string
}

const TARGET_CONTENT_MODEL = {
  post: 'post',
  comment: 'comment',
  message: 'message',
  story: 'story',
} as const

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
    private readonly auditLog: AuditLogService,
  ) {}

  // ── REPORTS ─────────────────────────────────────────────────────────────

  async createReport(reporterId: string, input: CreateReportInput): Promise<{ id: string; status: string }> {
    try {
      const report = await this.prisma.report.create({
        data: {
          reporterId,
          targetType: input.targetType,
          targetId: input.targetId,
          reason: input.reason,
          note: input.note ?? null,
        },
      })
      return { id: report.id, status: report.status }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException({
          code: 'ALREADY_REPORTED',
          message: 'You have already reported this.',
        })
      }
      throw err
    }
  }

  async listQueue(
    status: string | undefined,
    cursor: string | undefined,
  ): Promise<{ data: ReportSummary[]; nextCursor: string | null; hasMore: boolean }> {
    const take = 21
    const decoded = decodeCursor(cursor)

    const reports = await this.prisma.report.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
    })

    const hasMore = reports.length > take - 1
    const items = hasMore ? reports.slice(0, -1) : reports

    const reporterIds = [...new Set(items.map((r) => r.reporterId))]
    const reporters = reporterIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: reporterIds } },
          select: { id: true, username: true, displayName: true },
        })
      : []
    const reporterMap = new Map(reporters.map((r) => [r.id, r]))

    return {
      data: items.map((r) => ({
        id: r.id,
        targetType: r.targetType,
        targetId: r.targetId,
        reason: r.reason,
        note: r.note,
        status: r.status,
        reporter: reporterMap.get(r.reporterId) ?? null,
        reviewedBy: r.reviewedBy,
        reviewedAt: r.reviewedAt?.toISOString() ?? null,
        createdAt: r.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }

  /** Resolves the user who authored/owns the reported target, for warn/suspend/ban. */
  private async resolveTargetUserId(targetType: string, targetId: string): Promise<string | null> {
    if (targetType === 'user') return targetId

    switch (targetType) {
      case 'post': {
        const post = await this.prisma.post.findUnique({ where: { id: targetId }, select: { authorId: true } })
        return post?.authorId ?? null
      }
      case 'comment': {
        const comment = await this.prisma.comment.findUnique({ where: { id: targetId }, select: { authorId: true } })
        return comment?.authorId ?? null
      }
      case 'message': {
        const message = await this.prisma.message.findUnique({ where: { id: targetId }, select: { senderId: true } })
        return message?.senderId ?? null
      }
      case 'story': {
        const story = await this.prisma.story.findUnique({ where: { id: targetId }, select: { authorId: true } })
        return story?.authorId ?? null
      }
      default:
        return null
    }
  }

  async resolveReport(
    reportId: string,
    reviewerId: string,
    input: ResolveReportInput,
  ): Promise<{ id: string; status: string }> {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } })
    if (!report) throw new NotFoundException({ code: 'REPORT_NOT_FOUND', message: 'Report not found' })
    if (report.status !== 'open') {
      throw new ConflictException({ code: 'REPORT_ALREADY_RESOLVED', message: 'This report has already been reviewed' })
    }

    const status = input.action === 'dismiss' ? 'dismissed' : 'actioned'

    if (input.action === 'remove_content') {
      const model = TARGET_CONTENT_MODEL[report.targetType as keyof typeof TARGET_CONTENT_MODEL]
      if (model) {
        await (this.prisma[model] as { update: (args: unknown) => Promise<unknown> }).update({
          where: { id: report.targetId },
          data: { isDeleted: true },
        })
      }
    }

    let targetUserId: string | null = null
    if (input.action === 'warn' || input.action === 'suspend' || input.action === 'ban') {
      targetUserId = await this.resolveTargetUserId(report.targetType, report.targetId)
      if (targetUserId) {
        if (input.action === 'suspend') await this.setUserState(targetUserId, 'suspended')
        if (input.action === 'ban') await this.setUserState(targetUserId, 'banned')
        await this.realtime.publishToUser(targetUserId, 'moderation.action', {
          action: input.action,
          reason: report.reason,
        })
      }
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status, reviewedBy: reviewerId, reviewedAt: new Date() },
    })

    await this.auditLog.record({
      actorId: reviewerId,
      action: `moderation.report.${input.action}`,
      entityType: report.targetType,
      entityId: report.targetId,
      newData: { reportId, action: input.action, note: input.note ?? null, targetUserId },
    })

    return { id: updated.id, status: updated.status }
  }

  // ── SUSPEND / BAN ───────────────────────────────────────────────────────

  private async setUserState(userId: string, state: 'active' | 'suspended' | 'banned'): Promise<void> {
    await this.prisma.profile.update({ where: { id: userId }, data: { state } })
  }

  async suspendUser(userId: string, reviewerId: string, reason: string): Promise<void> {
    await this.setUserState(userId, 'suspended')
    await this.auditLog.record({
      actorId: reviewerId,
      action: 'moderation.user.suspend',
      entityType: 'user',
      entityId: userId,
      newData: { reason },
    })
    await this.realtime.publishToUser(userId, 'moderation.action', { action: 'suspend', reason })
  }

  async banUser(userId: string, reviewerId: string, reason: string): Promise<void> {
    await this.setUserState(userId, 'banned')
    await this.auditLog.record({
      actorId: reviewerId,
      action: 'moderation.user.ban',
      entityType: 'user',
      entityId: userId,
      newData: { reason },
    })
    await this.realtime.publishToUser(userId, 'moderation.action', { action: 'ban', reason })
  }

  async reinstateUser(userId: string, reviewerId: string): Promise<void> {
    await this.setUserState(userId, 'active')
    await this.auditLog.record({
      actorId: reviewerId,
      action: 'moderation.user.reinstate',
      entityType: 'user',
      entityId: userId,
    })
    await this.realtime.publishToUser(userId, 'moderation.action', { action: 'reinstate' })
  }

  // ── AUDIT LOG READ ──────────────────────────────────────────────────────

  async listAuditLog(
    entityType: string | undefined,
    actorId: string | undefined,
    cursor: string | undefined,
  ): Promise<{ data: AuditLogEntrySummary[]; nextCursor: string | null; hasMore: boolean }> {
    const take = 21
    const decoded = decodeCursor(cursor)

    const entries = await this.prisma.auditLog.findMany({
      where: {
        ...(entityType ? { entityType } : {}),
        ...(actorId ? { actorId } : {}),
        ...(decoded
          ? {
              OR: [
                { createdAt: { lt: new Date(decoded.createdAt) } },
                { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
    })

    const hasMore = entries.length > take - 1
    const items = hasMore ? entries.slice(0, -1) : entries

    return {
      data: items.map((e) => ({
        id: e.id,
        actorId: e.actorId,
        action: e.action,
        entityType: e.entityType,
        entityId: e.entityId,
        createdAt: e.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
      hasMore,
    }
  }
}
