import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { PrismaService } from '../../prisma/prisma.service'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { AUTH_USER_KEY, type AuthenticatedUser } from './jwt-auth.guard'

/**
 * RolesGuard — checks the authenticated user's Profile.role (app-level role:
 * user | moderator | admin | super_admin) against @Roles(...) metadata.
 *
 * Must run AFTER JwtAuthGuard: @UseGuards(JwtAuthGuard, RolesGuard).
 * Profile.role is looked up from the DB — it is NOT the same as the Supabase
 * auth role on AuthenticatedUser.role (JWT-verified but a different concept).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || requiredRoles.length === 0) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = (request as unknown as Record<string, unknown>)[AUTH_USER_KEY] as
      | AuthenticatedUser
      | undefined
    if (!user) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'You do not have permission to perform this action' })
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (!profile || !requiredRoles.includes(profile.role)) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'You do not have permission to perform this action' })
    }

    return true
  }
}
