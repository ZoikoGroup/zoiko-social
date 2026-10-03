import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { PrismaService } from '../../prisma/prisma.service'
import { REQUIRED_SUBSCRIPTIONS_KEY } from '../decorators/subscription.decorator'
import { AUTH_USER_KEY, type AuthenticatedUser } from './jwt-auth.guard'
import { SubscriptionEntitlement, SubscriptionStatus } from '@prisma/client'

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredEntitlements = this.reflector.getAllAndOverride<SubscriptionEntitlement[]>(REQUIRED_SUBSCRIPTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    
    // If no decorator is present, let it pass
    if (requiredEntitlements === undefined || requiredEntitlements.length === 0) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = (request as unknown as Record<string, unknown>)[AUTH_USER_KEY] as AuthenticatedUser | undefined
    
    if (!user) {
      throw new ForbiddenException({ code: 'SUBSCRIPTION_REQUIRED', message: 'You must be logged in and have an active subscription to access this feature.' })
    }

    // Admins bypass subscription requirements
    if (user.role === 'admin' || user.role === 'super_admin') {
      return true
    }

    // Fetch the user's subscriptions
    const subscriptions = await this.prisma.subscription.findMany({
      where: { 
        userId: user.id,
        status: {
          in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
        }
      },
      select: { entitlement: true }
    })

    const activeEntitlements = subscriptions.map(sub => sub.entitlement)

    // Check if the user has any of the required entitlements
    const hasRequiredSubscription = requiredEntitlements.some(entitlement => activeEntitlements.includes(entitlement))

    if (!hasRequiredSubscription) {
      // 402 Payment Required might be more appropriate for monetization logic, 
      // but in NestJS standard exceptions, 403 Forbidden is used for access control.
      // The client can interpret the custom 'SUBSCRIPTION_REQUIRED' code.
      throw new ForbiddenException({ 
        code: 'SUBSCRIPTION_REQUIRED', 
        message: 'This feature requires an active commercial subscription plan.' 
      })
    }

    return true
  }
}
