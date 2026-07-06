import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import type { CommunityRole } from '@prisma/client'
import { CommunitiesService } from '../communities.service'
import { COMMUNITY_ROLE_KEY } from './community-role.decorator'
import { AUTH_USER_KEY, type AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'

const RANK: Record<CommunityRole, number> = {
  member: 1,
  moderator: 2,
  admin: 3,
  owner: 4,
}

/**
 * Gates a route on the caller's community role. Runs AFTER JwtAuthGuard.
 * Resolves membership through the Redis-cached snapshot (one L1 read on the
 * hot path). Returns 403 INSUFFICIENT_ROLE; membership resolution uses the
 * community id from the :id or :communityId route param.
 */
@Injectable()
export class CommunityRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly communitiesService: CommunitiesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minRole = this.reflector.get<CommunityRole | undefined>(COMMUNITY_ROLE_KEY, context.getHandler())
    if (!minRole) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = (request as unknown as Record<string, unknown>)[AUTH_USER_KEY] as AuthenticatedUser | undefined
    if (!user) {
      throw new ForbiddenException({ code: 'UNAUTHENTICATED', message: 'Authentication required' })
    }

    const params = request.params as Record<string, string>
    const communityId = params.id ?? params.communityId
    if (!communityId) {
      throw new ForbiddenException({ code: 'COMMUNITY_REQUIRED', message: 'Community context missing' })
    }

    const membership = await this.communitiesService.getMembershipRow(communityId, user.id)
    if (!membership || membership.status !== 'active') {
      throw new ForbiddenException({ code: 'NOT_A_MEMBER', message: 'You are not a member of this community' })
    }
    if (RANK[membership.role as CommunityRole] < RANK[minRole]) {
      throw new ForbiddenException({ code: 'INSUFFICIENT_ROLE', message: 'You do not have permission for this action' })
    }

    return true
  }
}
