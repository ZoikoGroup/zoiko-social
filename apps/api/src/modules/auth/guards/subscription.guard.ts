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

      // If user has subscription but hasn't explicitly selected yet, allow all for premium
      // or auto-allocate the required service if none are chosen yet
      if (!hasRequiredSubscription) {
        if (planEntitlements.includes('premium')) {
          hasRequiredSubscription = true
        } else if (allocatedServices.length === 0) {
          hasRequiredSubscription = true
          const req = requiredEntitlements[0]
          const defaultService = req === 'care_professional' ? 'care' : req === 'breeder_professional' ? 'breeder' : 'seller'
          const defaultCategory = req === 'care_professional' ? 'pet_care_service_provider' : 'product_seller'
          try {
            if (prof) {
              await this.prisma.professionalProfile.update({
                where: { userId: user.id },
                data: {
                  serviceAreas: [defaultService],
                  category: prof.category || defaultCategory,
                  deletedAt: null,
                },
              })
            } else {
              await this.prisma.professionalProfile.create({
                data: {
                  userId: user.id,
                  category: defaultCategory,
                  serviceAreas: [defaultService],
                  isVerified: true,
                  verifiedAt: new Date(),
                },
              })
            }
          } catch {
            // Non-blocking catch
          }
        } else if (prof?.category) {
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
