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

    // Check if the user has any of the directly matching required entitlements
    let hasRequiredSubscription = requiredEntitlements.some(entitlement => activeEntitlements.includes(entitlement))

    // If not directly matched, check if user has active plan tier (starter, professional, premium)
    // and whether the required entitlement matches their selected services
    const planEntitlements: string[] = activeEntitlements
    if (!hasRequiredSubscription && (planEntitlements.includes('starter') || planEntitlements.includes('professional') || planEntitlements.includes('premium'))) {
      // Map required entitlement to service keyword
      const entitlementToService: Record<string, string> = {
        seller_professional: 'seller',
        breeder_professional: 'breeder',
        care_professional: 'care',
      }

      const prof = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { serviceAreas: true, category: true }
      })

      const allocatedServices = prof?.serviceAreas || []

      for (const req of requiredEntitlements) {
        if (req === 'care_professional' && (allocatedServices.includes('care') || allocatedServices.includes('vet'))) {
          hasRequiredSubscription = true
          break
        }
        const sKey = entitlementToService[req as string]
        if (sKey && allocatedServices.includes(sKey)) {
          hasRequiredSubscription = true
          break
        }
      }

      // If user has subscription but hasn't explicitly selected yet, allow all only for premium
      // For starter/professional, only fallback if legacy category matches the required entitlement
      if (!hasRequiredSubscription) {
        if (planEntitlements.includes('premium')) {
          hasRequiredSubscription = true
        } else if (allocatedServices.length === 0 && prof?.category) {
          const cat = prof.category
          if (requiredEntitlements.includes('seller_professional') && cat === 'product_seller') {
            hasRequiredSubscription = true
          } else if (requiredEntitlements.includes('breeder_professional') && cat === 'product_seller') {
            hasRequiredSubscription = true
          } else if (requiredEntitlements.includes('care_professional') && (cat === 'pet_care_service_provider' || cat === 'veterinarian')) {
            hasRequiredSubscription = true
          }
        }
      }
    }

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
