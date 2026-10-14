import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Optional } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { PrismaService } from '../../prisma/prisma.service'
import { REQUIRED_SUBSCRIPTIONS_KEY } from '../decorators/subscription.decorator'
import { AUTH_USER_KEY, type AuthenticatedUser } from './jwt-auth.guard'
import { SubscriptionEntitlement, SubscriptionStatus } from '@prisma/client'
import { CommercialService } from '../../commercial/commercial.service'

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    @Optional() private readonly commercial?: CommercialService,
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

    // 7-day grace period (in ms) for past_due recurring payments
    const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000

    const fetchValidSubscriptions = async () => {
      const records = await this.prisma.subscription.findMany({
        where: { 
          userId: user.id,
          status: {
            in: [SubscriptionStatus.active, SubscriptionStatus.trialing, SubscriptionStatus.past_due],
          },
        },
        select: { entitlement: true, status: true, updatedAt: true },
      })

      // Keep active/trialing directly; keep past_due only if within the 7-day grace period
      return records.filter((sub) => {
        if (sub.status === SubscriptionStatus.active || sub.status === SubscriptionStatus.trialing) {
          return true
        }
        if (sub.status === SubscriptionStatus.past_due) {
          const elapsed = Date.now() - sub.updatedAt.getTime()
          return elapsed <= GRACE_PERIOD_MS
        }
        return false
      })
    }

    // Fetch the user's subscriptions
    let subscriptions = await fetchValidSubscriptions()

    // If no subscriptions found in DB, check Stripe to reconcile any paid sessions
    if (subscriptions.length === 0 && this.commercial) {
      await this.commercial.syncUserSubscriptionsFromStripe(user.id, user.email)
      subscriptions = await fetchValidSubscriptions()
    }

    const activeEntitlements = subscriptions.map((sub) => sub.entitlement)

    // Map required entitlement to service keyword
    const entitlementToService: Record<string, string> = {
      seller_professional: 'seller',
      breeder_professional: 'breeder',
      care_professional: 'care',
    }

    // Determine highest active tier and maxServicesAllowed
    let maxAllowedServices = 0
    const hasPremium = activeEntitlements.includes('premium' as SubscriptionEntitlement)
    const hasProfessional = activeEntitlements.includes('professional' as SubscriptionEntitlement)
    const hasStarter = activeEntitlements.includes('starter' as SubscriptionEntitlement)

    if (hasPremium) {
      maxAllowedServices = 4
    } else if (hasProfessional) {
      maxAllowedServices = 2
    } else if (hasStarter) {
      maxAllowedServices = 1
    } else if (
      activeEntitlements.includes('care_professional' as SubscriptionEntitlement) ||
      activeEntitlements.includes('breeder_professional' as SubscriptionEntitlement) ||
      activeEntitlements.includes('seller_professional' as SubscriptionEntitlement)
    ) {
      maxAllowedServices = 1
    }

    let hasRequiredSubscription = false

    if (maxAllowedServices > 0) {
      const prof = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { serviceAreas: true, category: true },
      })

      // Premium unlocks all commercial services
      if (hasPremium || maxAllowedServices >= 4) {
        hasRequiredSubscription = true
      } else {
        const rawServices = (prof?.serviceAreas || []).filter((s) =>
          ['seller', 'breeder', 'care', 'vet'].includes(s),
        )

        // Strictly enforce maxAllowedServices quota (e.g. Starter = 1, Professional = 2)
        let effectiveServices = rawServices.slice(0, maxAllowedServices)
        if (effectiveServices.length === 0 && prof?.category) {
          const defaultService =
            prof.category === 'veterinarian'
              ? 'vet'
              : prof.category === 'pet_care_service_provider'
                ? 'care'
                : 'seller'
          effectiveServices = [defaultService]
        }

        // Check if required entitlement matches user's active, allowed services
        for (const req of requiredEntitlements) {
          // Direct legacy entitlement match (only if holding that specific legacy subscription)
          if (activeEntitlements.includes(req) && !hasStarter && !hasProfessional) {
            hasRequiredSubscription = true
            break
          }

          if (req === 'care_professional' && (effectiveServices.includes('care') || effectiveServices.includes('vet'))) {
            hasRequiredSubscription = true
            break
          }

          const sKey = entitlementToService[req as string]
          if (sKey && effectiveServices.includes(sKey)) {
            hasRequiredSubscription = true
            break
          }
        }
      }
    }

    if (!hasRequiredSubscription) {
      const expiredPastDueSub = await this.prisma.subscription.findFirst({
        where: { userId: user.id, status: SubscriptionStatus.past_due },
        orderBy: { updatedAt: 'desc' },
      })

      if (expiredPastDueSub) {
        throw new ForbiddenException({
          code: 'GRACE_PERIOD_EXPIRED',
          message: 'Monthly payment failed and your 7-day grace period has expired. Please update your card in Billing Settings to restore services.',
        })
      }

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
