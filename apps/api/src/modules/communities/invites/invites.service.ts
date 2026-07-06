import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  GoneException,
} from '@nestjs/common'
import { randomBytes } from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { NotificationQueueService } from '../../queue/notification-queue.service'

export interface InviteResult {
  id: string
  type: 'user' | 'link'
  url?: string
  invitee?: { username: string; displayName: string } | null
  expiresAt: string | null
}

const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateCode(length = 22): string {
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += BASE62[bytes[i]! % 62]
  return out
}

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private async loadCommunity(communityId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, slug: true, name: true, isDeleted: true },
    })
    if (!community || community.isDeleted) {
      throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
    }
    return community
  }

  // ── Invite by username ──────────────────────────────────────────────────────

  async inviteByUsername(communityId: string, inviterId: string, username: string): Promise<InviteResult> {
    const community = await this.loadCommunity(communityId)

    const invitee = await this.prisma.profile.findUnique({
      where: { username: username.trim().toLowerCase() },
      select: { id: true, username: true, displayName: true },
    })
    if (!invitee) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })
    }
    if (invitee.id === inviterId) {
      throw new BadRequestException({ code: 'CANNOT_INVITE_SELF', message: 'You cannot invite yourself' })
    }

    // Blocks in either direction
    const blocked = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: inviterId, blockedId: invitee.id },
          { blockerId: invitee.id, blockedId: inviterId },
        ],
      },
    })
    if (blocked) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' })
    }

    // Already a member / banned?
    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: invitee.id } },
    })
    if (existing?.status === 'active') {
      throw new ConflictException({ code: 'ALREADY_MEMBER', message: 'Already a member' })
    }
    if (existing?.status === 'banned') {
      throw new ForbiddenException({ code: 'BANNED', message: 'This user is banned from the community' })
    }

    // One live user-invite per invitee+community
    const liveInvite = await this.prisma.communityInvite.findFirst({
      where: { communityId, inviteeId: invitee.id, type: 'user', revokedAt: null },
    })
    if (liveInvite) {
      return { id: liveInvite.id, type: 'user', invitee: { username: invitee.username, displayName: invitee.displayName }, expiresAt: liveInvite.expiresAt?.toISOString() ?? null }
    }

    const expiresAt = new Date(Date.now() + 7 * 86_400_000)
    const invite = await this.prisma.communityInvite.create({
      data: { communityId, type: 'user', inviteeId: invitee.id, createdBy: inviterId, expiresAt },
    })

    const inviter = await this.prisma.profile.findUnique({
      where: { id: inviterId },
      select: { username: true, displayName: true },
    })
    void this.notifications.enqueue({
      userId: invitee.id,
      type: 'community_invite',
      title: 'Community Invite',
      body: `${inviter?.displayName ?? 'Someone'} invited you to join ${community.name}`,
      data: { communityId, slug: community.slug, inviteId: invite.id, username: inviter?.username },
    }).catch(() => {})

    return {
      id: invite.id,
      type: 'user',
      invitee: { username: invitee.username, displayName: invitee.displayName },
      expiresAt: expiresAt.toISOString(),
    }
  }

  // ── Invite link ─────────────────────────────────────────────────────────────

  async createLink(
    communityId: string,
    inviterId: string,
    opts: { expiresInDays?: number; maxUses?: number },
  ): Promise<InviteResult> {
    const community = await this.loadCommunity(communityId)
    const days = Math.min(Math.max(opts.expiresInDays ?? 7, 1), 30)
    const expiresAt = new Date(Date.now() + days * 86_400_000)
    const code = generateCode()

    const invite = await this.prisma.communityInvite.create({
      data: {
        communityId,
        type: 'link',
        code,
        createdBy: inviterId,
        expiresAt,
        maxUses: opts.maxUses ?? null,
      },
    })

    const base = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000'
    return {
      id: invite.id,
      type: 'link',
      url: `${base}/c/${community.slug}?invite=${code}`,
      expiresAt: expiresAt.toISOString(),
    }
  }

  async listInvites(communityId: string) {
    const invites = await this.prisma.communityInvite.findMany({
      where: { communityId, revokedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { invitee: { select: { username: true, displayName: true, avatarUrl: true } } },
    })
    const base = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000'
    const community = await this.prisma.community.findUnique({ where: { id: communityId }, select: { slug: true } })
    return invites
      .filter((i) => !i.expiresAt || i.expiresAt > new Date())
      .map((i) => ({
        id: i.id,
        type: i.type,
        invitee: i.invitee ? { username: i.invitee.username, displayName: i.invitee.displayName, avatarUrl: i.invitee.avatarUrl } : null,
        url: i.type === 'link' && i.code ? `${base}/c/${community?.slug}?invite=${i.code}` : undefined,
        uses: i.uses,
        maxUses: i.maxUses,
        expiresAt: i.expiresAt?.toISOString() ?? null,
      }))
  }

  async revoke(inviteId: string): Promise<void> {
    await this.prisma.communityInvite.update({
      where: { id: inviteId },
      data: { revokedAt: new Date() },
    })
  }

  // ── Invite preview + accept (by code) ───────────────────────────────────────

  async previewByCode(code: string) {
    const invite = await this.validateCode(code)
    const community = await this.prisma.community.findUnique({
      where: { id: invite.communityId },
      select: { id: true, slug: true, name: true, description: true, avatarUrl: true, membersCount: true, privacy: true },
    })
    if (!community) throw new NotFoundException({ code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' })
    return { community, inviteId: invite.id }
  }

  async acceptByCode(code: string, userId: string, acceptRules?: boolean): Promise<{ status: string; slug: string }> {
    const invite = await this.validateCode(code)
    const community = await this.loadCommunity(invite.communityId)

    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId } },
    })
    if (existing?.status === 'banned') {
      throw new ForbiddenException({ code: 'BANNED', message: 'You are banned from this community' })
    }
    if (existing?.status === 'active') {
      return { status: 'joined', slug: community.slug }
    }

    // Rules consent
    const ruleCount = await this.prisma.communityRule.count({ where: { communityId: community.id } })
    if (ruleCount > 0 && !acceptRules) {
      throw new BadRequestException({ code: 'RULES_NOT_ACCEPTED', message: 'You must accept the community rules to join' })
    }

    await this.prisma.$transaction([
      this.prisma.communityMember.upsert({
        where: { communityId_userId: { communityId: community.id, userId } },
        create: { communityId: community.id, userId, role: 'member', status: 'active', acceptedRulesAt: new Date(), invitedBy: invite.createdBy },
        update: { status: 'active', acceptedRulesAt: new Date() },
      }),
      this.prisma.community.update({ where: { id: community.id }, data: { membersCount: { increment: 1 } } }),
      // Link invites: count a use. User invites: consume (revoke).
      invite.type === 'link'
        ? this.prisma.communityInvite.update({ where: { id: invite.id }, data: { uses: { increment: 1 } } })
        : this.prisma.communityInvite.update({ where: { id: invite.id }, data: { revokedAt: new Date() } }),
    ])

    await this.redis.invalidateMembership(community.id, userId)
    await this.redis.invalidateCommunity(community.id)
    return { status: 'joined', slug: community.slug }
  }

  private async validateCode(code: string) {
    const invite = await this.prisma.communityInvite.findFirst({
      where: { code, revokedAt: null },
    })
    if (!invite) {
      throw new GoneException({ code: 'INVITE_INVALID', message: 'This invite is invalid or has been revoked' })
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new GoneException({ code: 'INVITE_EXPIRED', message: 'This invite has expired' })
    }
    if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
      throw new GoneException({ code: 'INVITE_EXHAUSTED', message: 'This invite has reached its limit' })
    }
    return invite
  }
}
