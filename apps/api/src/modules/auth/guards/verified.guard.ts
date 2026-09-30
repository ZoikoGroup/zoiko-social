import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { PrismaService } from '../../prisma/prisma.service'
import { VERIFICATION_SCOPES_KEY, type VerificationScope } from '../decorators/verified.decorator'
import { AUTH_USER_KEY, type AuthenticatedUser } from './jwt-auth.guard'

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScopes = this.reflector.getAllAndOverride<VerificationScope[]>(VERIFICATION_SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    
    // If no decorator is present, let it pass
    if (requiredScopes === undefined || requiredScopes.length === 0) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = (request as unknown as Record<string, unknown>)[AUTH_USER_KEY] as AuthenticatedUser | undefined
    if (!user) {
      throw new ForbiddenException({ code: 'VERIFICATION_REQUIRED', message: 'Please verify your account first to access this feature.' })
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.id },
      select: { 
        identityStatus: true,
        organizationStatus: true,
        credentialStatus: true,
        publisherStatus: true,
      },
    })

    if (!profile) {
      throw new ForbiddenException({ code: 'VERIFICATION_REQUIRED', message: 'Please verify your account first to access this feature.' })
    }

    const isApproved = (scope: VerificationScope) => {
      switch (scope) {
        case 'identity': return profile.identityStatus === 'approved'
        case 'organization': return profile.organizationStatus === 'approved'
        case 'credential': return profile.credentialStatus === 'approved'
        case 'publisher': return profile.publisherStatus === 'approved'
        default: return false
      }
    }

    const hasAnyRequiredScope = requiredScopes.some(isApproved)

    if (!hasAnyRequiredScope) {
      const scopeNames = requiredScopes.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' or ')
      throw new ForbiddenException({ 
        code: 'VERIFICATION_SCOPE_REQUIRED', 
        message: `This feature requires ${scopeNames} Verification to be approved.` 
      })
    }

    return true
  }
}
