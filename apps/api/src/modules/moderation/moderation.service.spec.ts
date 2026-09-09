import { ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ModerationService } from './moderation.service'
import type { PrismaService } from '../prisma/prisma.service'
import type { RealtimeService } from '../realtime/realtime.service'
import type { AuditLogService } from '../common/audit-log/audit-log.service'

/**
 * The enforcement path had no tests at all, which is the wrong module to leave
 * uncovered: it is the one that removes content, suspends and bans people, and
 * it is the one the Terms point at. Two properties matter most and neither was
 * pinned down — that every staff action writes an audit entry ("no admin action
 * without audit logging" is a stated non-negotiable), and that a report cannot
 * be actioned twice.
 */

const REVIEWER = 'reviewer-1'
const REPORTER = 'reporter-1'
const AUTHOR = 'author-1'
const REPORT_ID = 'report-1'
const TARGET_ID = 'target-1'

function build(opts: { report?: Record<string, unknown> | null } = {}) {
  const report =
    opts.report === undefined
      ? { id: REPORT_ID, status: 'open', targetType: 'post', targetId: TARGET_ID, reason: 'spam' }
      : opts.report

  const prisma = {
    report: {
      create: jest.fn().mockResolvedValue({ id: REPORT_ID, status: 'open' }),
      findUnique: jest.fn().mockResolvedValue(report),
      update: jest.fn().mockImplementation(({ data }: { data: { status: string } }) =>
        Promise.resolve({ id: REPORT_ID, status: data.status }),
      ),
    },
    post: { update: jest.fn().mockResolvedValue({}), findUnique: jest.fn().mockResolvedValue({ authorId: AUTHOR }) },
    comment: { findUnique: jest.fn().mockResolvedValue({ authorId: AUTHOR }) },
    profile: { update: jest.fn().mockResolvedValue({}) },
  }
  const realtime = { publishToUser: jest.fn().mockResolvedValue(undefined) }
  const auditLog = { record: jest.fn().mockResolvedValue(undefined) }

  const service = new ModerationService(
    prisma as unknown as PrismaService,
    realtime as unknown as RealtimeService,
    auditLog as unknown as AuditLogService,
  )
  return { service, prisma, realtime, auditLog }
}

describe('ModerationService', () => {
  describe('createReport', () => {
    it('files a report', async () => {
      const { service, prisma } = build()

      await expect(
        service.createReport(REPORTER, { targetType: 'post', targetId: TARGET_ID, reason: 'spam' } as never),
      ).resolves.toEqual({ id: REPORT_ID, status: 'open' })

      expect(prisma.report.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ reporterId: REPORTER, targetId: TARGET_ID, reason: 'spam' }),
        }),
      )
    })

    it('turns a duplicate into ALREADY_REPORTED rather than a 500', async () => {
      const { service, prisma } = build()
      prisma.report.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: '6.6.0' }),
      )

      await expect(
        service.createReport(REPORTER, { targetType: 'post', targetId: TARGET_ID, reason: 'spam' } as never),
      ).rejects.toBeInstanceOf(ConflictException)
    })

    it('does not swallow an unrelated database failure', async () => {
      const { service, prisma } = build()
      prisma.report.create.mockRejectedValue(new Error('connection lost'))

      await expect(
        service.createReport(REPORTER, { targetType: 'post', targetId: TARGET_ID, reason: 'spam' } as never),
      ).rejects.toThrow('connection lost')
    })
  })

  describe('resolveReport', () => {
    it('refuses a report that does not exist', async () => {
      const { service } = build({ report: null })

      await expect(
        service.resolveReport(REPORT_ID, REVIEWER, { action: 'dismiss' } as never),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('refuses to action an already-reviewed report', async () => {
      // Without this, two reviewers opening the same queue item could each ban
      // the same person and write two audit entries for one offence.
      const { service } = build({
        report: { id: REPORT_ID, status: 'actioned', targetType: 'post', targetId: TARGET_ID, reason: 'spam' },
      })

      await expect(
        service.resolveReport(REPORT_ID, REVIEWER, { action: 'ban' } as never),
      ).rejects.toBeInstanceOf(ConflictException)
    })

    it('dismisses without touching the content or the author', async () => {
      const { service, prisma, realtime } = build()

      const res = await service.resolveReport(REPORT_ID, REVIEWER, { action: 'dismiss' } as never)

      expect(res.status).toBe('dismissed')
      expect(prisma.post.update).not.toHaveBeenCalled()
      expect(prisma.profile.update).not.toHaveBeenCalled()
      expect(realtime.publishToUser).not.toHaveBeenCalled()
    })

    it('removes content by soft-deleting the reported row', async () => {
      const { service, prisma } = build()

      const res = await service.resolveReport(REPORT_ID, REVIEWER, { action: 'remove_content' } as never)

      expect(res.status).toBe('actioned')
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: TARGET_ID },
        data: { isDeleted: true },
      })
    })

    it('suspends the content author and tells them why', async () => {
      const { service, prisma, realtime } = build()

      await service.resolveReport(REPORT_ID, REVIEWER, { action: 'suspend' } as never)

      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { id: AUTHOR },
        data: { state: 'suspended' },
      })
      expect(realtime.publishToUser).toHaveBeenCalledWith(
        AUTHOR,
        'moderation.action',
        expect.objectContaining({ action: 'suspend' }),
      )
    })

    it('bans the content author', async () => {
      const { service, prisma } = build()

      await service.resolveReport(REPORT_ID, REVIEWER, { action: 'ban' } as never)

      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { id: AUTHOR },
        data: { state: 'banned' },
      })
    })

    it('warns without changing account state', async () => {
      const { service, prisma, realtime } = build()

      await service.resolveReport(REPORT_ID, REVIEWER, { action: 'warn' } as never)

      expect(prisma.profile.update).not.toHaveBeenCalled()
      expect(realtime.publishToUser).toHaveBeenCalledWith(
        AUTHOR,
        'moderation.action',
        expect.objectContaining({ action: 'warn' }),
      )
    })

    it('still resolves when the author can no longer be found', async () => {
      // The reported row may already be gone. The report must still close
      // rather than leaving the queue item stuck open forever.
      const { service, prisma } = build()
      prisma.post.findUnique.mockResolvedValue(null)

      const res = await service.resolveReport(REPORT_ID, REVIEWER, { action: 'ban' } as never)

      expect(res.status).toBe('actioned')
      expect(prisma.profile.update).not.toHaveBeenCalled()
    })

    it.each(['dismiss', 'remove_content', 'warn', 'suspend', 'ban'])(
      'writes an audit entry naming the reviewer for %s',
      async (action) => {
        // "No admin action without audit logging" — a stated non-negotiable.
        const { service, auditLog } = build()

        await service.resolveReport(REPORT_ID, REVIEWER, { action, note: 'because' } as never)

        expect(auditLog.record).toHaveBeenCalledWith(
          expect.objectContaining({
            actorId: REVIEWER,
            action: `moderation.report.${action}`,
            entityId: TARGET_ID,
          }),
        )
      },
    )
  })

  describe('direct enforcement', () => {
    it('suspends, audits and notifies', async () => {
      const { service, prisma, auditLog, realtime } = build()

      await service.suspendUser(AUTHOR, REVIEWER, 'spamming')

      expect(prisma.profile.update).toHaveBeenCalledWith({ where: { id: AUTHOR }, data: { state: 'suspended' } })
      expect(auditLog.record).toHaveBeenCalledWith(
        expect.objectContaining({ actorId: REVIEWER, action: 'moderation.user.suspend' }),
      )
      expect(realtime.publishToUser).toHaveBeenCalled()
    })

    it('bans, audits and notifies', async () => {
      const { service, prisma, auditLog } = build()

      await service.banUser(AUTHOR, REVIEWER, 'animal welfare')

      expect(prisma.profile.update).toHaveBeenCalledWith({ where: { id: AUTHOR }, data: { state: 'banned' } })
      expect(auditLog.record).toHaveBeenCalledWith(
        expect.objectContaining({ actorId: REVIEWER, action: 'moderation.user.ban' }),
      )
    })

    it('reinstates back to active, and audits that too', async () => {
      const { service, prisma, auditLog } = build()

      await service.reinstateUser(AUTHOR, REVIEWER)

      expect(prisma.profile.update).toHaveBeenCalledWith({ where: { id: AUTHOR }, data: { state: 'active' } })
      expect(auditLog.record).toHaveBeenCalledWith(
        expect.objectContaining({ actorId: REVIEWER, action: 'moderation.user.reinstate' }),
      )
    })

    it('records the stated reason, so an appeal has something to answer', async () => {
      const { service, auditLog } = build()

      await service.banUser(AUTHOR, REVIEWER, 'repeated animal welfare violations')

      expect(auditLog.record).toHaveBeenCalledWith(
        expect.objectContaining({ newData: { reason: 'repeated animal welfare violations' } }),
      )
    })
  })
})
