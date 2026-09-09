import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditLogService } from '../common/audit-log/audit-log.service'

/**
 * Platform administration.
 *
 * The gap this fills: the app could ban and suspend people but had no way to
 * make anyone staff, so the database contained zero admins and zero moderators.
 * Every staff-only screen was unreachable by everyone, and the first admin had
 * to be created with hand-written SQL.
 *
 * Role changes are the most dangerous write in the system — one of them can
 * hand somebody the ability to make the change again — so the ladder below is
 * deliberately strict, and every change is recorded.
 */

/** Highest first. A role may only be granted by someone strictly above it. */
const ROLE_ORDER = ['super_admin', 'admin', 'moderator', 'user'] as const
export type Role = (typeof ROLE_ORDER)[number]

function rank(role: string): number {
  const i = ROLE_ORDER.indexOf(role as Role)
  // An unknown role ranks below everything, so it can never outrank a caller.
  return i === -1 ? ROLE_ORDER.length : i
}

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  // ── Overview ───────────────────────────────────────────────────────────────

  /**
   * The numbers an operator actually acts on, not vanity metrics.
   *
   * Counted in one batch: seven sequential counts against a distant database is
   * most of a second for a screen that shows them side by side anyway.
   */
  async stats() {
    const [
      users, staff, suspended, posts, communities, articles, pendingArticles, openReports, newsSources,
    ] = await Promise.all([
      this.prisma.profile.count(),
      this.prisma.profile.count({ where: { role: { in: ['moderator', 'admin', 'super_admin'] } } }),
      this.prisma.profile.count({ where: { state: { in: ['suspended', 'banned'] } } }),
      this.prisma.post.count({ where: { isDeleted: false } }),
      this.prisma.community.count({ where: { isDeleted: false } }),
      this.prisma.newsArticle.count({ where: { isDeleted: false } }),
      this.prisma.newsArticle.count({ where: { reviewStatus: 'pending', isDeleted: false } }),
      this.prisma.report.count({ where: { status: 'open' } }).catch(() => 0),
      this.prisma.newsSource.count(),
    ])

    return {
      users,
      staff,
      suspended,
      posts,
      communities,
      articles,
      pendingArticles,
      openReports,
      newsSources,
    }
  }

  // ── People ─────────────────────────────────────────────────────────────────

  /**
   * Finds accounts to act on.
   *
   * Search rather than a full listing: an operator arrives here knowing who
   * they are looking for, and paging through every member to find one person is
   * not a workflow.
   */
  async listUsers(filters: { q?: string; role?: string; state?: string }, take = 40) {
    const rows = await this.prisma.profile.findMany({
      where: {
        ...(filters.q
          ? {
              OR: [
                { username: { contains: filters.q, mode: 'insensitive' as const } },
                { displayName: { contains: filters.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
        ...(filters.role ? { role: filters.role as Role } : {}),
        ...(filters.state ? { state: filters.state as 'active' } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
      take: Math.min(take, 100),
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        state: true,
        verificationTier: true,
        createdAt: true,
      },
    })
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
  }

  /**
   * Changes someone's role.
   *
   * Four rules, each closing a way this could be abused:
   *
   *   1. Nobody changes their OWN role. Otherwise the whole ladder is theatre —
   *      any admin could promote themselves to super_admin.
   *   2. You may not grant a role at or above your own. An admin creating
   *      another admin is lateral escalation, and an admin creating a
   *      super_admin is escalation outright.
   *   3. You may not change someone at or above your own rank. Two admins must
   *      not be able to demote each other.
   *   4. Every change is written to the audit log with both the old and new
   *      value, because "who made this person an admin" is exactly the question
   *      asked after something goes wrong.
   */
  async setRole(actorId: string, targetId: string, nextRole: Role) {
    if (!ROLE_ORDER.includes(nextRole)) {
      throw new BadRequestException({ code: 'INVALID_ROLE', message: 'Unknown role' })
    }
    if (actorId === targetId) {
      throw new ForbiddenException({
        code: 'CANNOT_CHANGE_OWN_ROLE',
        message: 'You cannot change your own role',
      })
    }

    const [actor, target] = await Promise.all([
      this.prisma.profile.findUnique({ where: { id: actorId }, select: { role: true, username: true } }),
      this.prisma.profile.findUnique({
        where: { id: targetId },
        select: { role: true, username: true },
      }),
    ])
    if (!actor) throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Not permitted' })
    if (!target) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })

    const actorRank = rank(actor.role)

    if (rank(nextRole) <= actorRank) {
      throw new ForbiddenException({
        code: 'ROLE_TOO_HIGH',
        message: 'You cannot grant a role at or above your own',
      })
    }
    if (rank(target.role) <= actorRank) {
      throw new ForbiddenException({
        code: 'TARGET_OUTRANKS',
        message: 'You cannot change the role of someone at or above your own level',
      })
    }

    const updated = await this.prisma.profile.update({
      where: { id: targetId },
      data: { role: nextRole },
      select: { id: true, username: true, role: true },
    })

    await this.audit.record({
      actorId,
      action: 'user.role_changed',
      entityType: 'profile',
      entityId: targetId,
      oldData: { role: target.role },
      newData: { role: nextRole },
    })

    return updated
  }
}
