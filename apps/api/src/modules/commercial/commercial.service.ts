import { Injectable, ForbiddenException, Optional, Logger, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../payments/stripe.service';
import { SERVICE_LIMITS, FREE_ANTI_ABUSE_LIMITS } from './commercial.constants';
import type { SubscriptionEntitlement } from '@prisma/client';

@Injectable()
export class CommercialService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CommercialService.name);
  private initialTimer: NodeJS.Timeout | null = null;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private prisma: PrismaService,
    @Optional() private stripe?: StripeService,
  ) {}

  onModuleInit(): void {
    // Run initial reconciliation 10 seconds after boot
    this.initialTimer = setTimeout(() => {
      void this.reconcileExpiredSubscriptions().catch((err) => {
        this.logger.warn(`Initial expired subscriptions reconciliation error: ${(err as Error).message}`);
      });
    }, 10000);
    this.initialTimer.unref();

    // Check periodically every 15 minutes
    this.timer = setInterval(() => {
      void this.reconcileExpiredSubscriptions().catch((err) => {
        this.logger.warn(`Periodic expired subscriptions reconciliation error: ${(err as Error).message}`);
      });
    }, 15 * 60 * 1000);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.initialTimer) clearTimeout(this.initialTimer);
    if (this.timer) clearInterval(this.timer);
    this.initialTimer = null;
    this.timer = null;
  }

  async syncUserSubscriptionsFromStripe(userId: string, email?: string): Promise<number> {
    if (!this.stripe?.enabled) return 0;
    try {
      const userSessions = await this.stripe.listPaidSubscriptionSessionsForUser(userId, email);
      if (userSessions.length === 0) return 0;

      // Sort newest first to ensure single active subscription rule
      userSessions.sort((a, b) => (b.created || 0) - (a.created || 0));

      let syncedCount = 0;
      let primaryActiveFound = false;

      for (const session of userSessions) {
        const stripeSubId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        if (!stripeSubId) continue;

        const stripeSub = await this.stripe.retrieveSubscription(stripeSubId);
        if (!stripeSub) continue;

        const isStripeActive = stripeSub.status === 'active' || stripeSub.status === 'trialing' || stripeSub.status === 'past_due';
        const shouldBeActive = isStripeActive && !primaryActiveFound;

        const entitlement = (session.metadata?.entitlement || stripeSub.metadata?.entitlement || 'starter') as SubscriptionEntitlement;
        const rawPeriodEnd = (stripeSub as unknown as Record<string, unknown>).current_period_end;
        const periodEnd =
          typeof rawPeriodEnd === 'number' && !isNaN(rawPeriodEnd)
            ? new Date(rawPeriodEnd * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const targetStatus: import('@prisma/client').SubscriptionStatus = shouldBeActive
          ? (stripeSub.status as import('@prisma/client').SubscriptionStatus)
          : 'canceled';

        const existing = await this.prisma.subscription.findFirst({
          where: { userId, stripeId: stripeSubId },
        });

        if (!existing) {
          await this.prisma.subscription.create({
            data: {
              userId,
              stripeId: stripeSubId,
              entitlement,
              status: targetStatus,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: Boolean(stripeSub.cancel_at_period_end),
            },
          });
        } else {
          await this.prisma.subscription.update({
            where: { id: existing.id },
            data: {
              status: targetStatus,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: Boolean(stripeSub.cancel_at_period_end),
            },
          });
        }

        if (shouldBeActive) {
          primaryActiveFound = true;
        }

        // Sync verification & professional profile
        await this.prisma.profile.update({
          where: { id: userId },
          data: { identityStatus: 'approved' },
        });

        const prof = await this.prisma.professionalProfile.findUnique({ where: { userId } });
        const defaultService = entitlement === 'care_professional' ? 'care' : entitlement === 'breeder_professional' ? 'breeder' : 'seller';
        const category = entitlement === 'care_professional' ? 'pet_care_service_provider' : 'product_seller';

        if (prof) {
          const currentServices = prof.serviceAreas && prof.serviceAreas.length > 0 ? prof.serviceAreas : [defaultService];
          await this.prisma.professionalProfile.update({
            where: { userId },
            data: {
              deletedAt: null,
              category: prof.category || category,
              serviceAreas: currentServices,
              isVerified: true,
              verifiedAt: prof.verifiedAt || new Date(),
            },
          });
        } else {
          await this.prisma.professionalProfile.create({
            data: {
              userId,
              category,
              serviceAreas: [defaultService],
              isVerified: true,
              verifiedAt: new Date(),
            },
          });
        }

        syncedCount++;
      }

      if (primaryActiveFound) {
        await this.restoreUserListings(userId);
      } else if (syncedCount > 0) {
        await this.pauseUserListings(userId);
      }

      return syncedCount;
    } catch (err) {
      this.logger.warn(`Stripe sync failed for user ${userId}: ${(err as Error).message}`);
      return 0;
    }
  }

  async pauseUserListings(userId: string): Promise<{ productsPaused: number; profilesPaused: number }> {
    const products = await this.prisma.product.updateMany({
      where: { sellerId: userId, status: 'active', isDeleted: false },
      data: { status: 'inactive', hiddenAt: new Date() },
    });

    const breeding = await this.prisma.breedingProfile.updateMany({
      where: { ownerId: userId, availableNow: true, isDeleted: false },
      data: { status: 'paused', availableNow: false },
    });

    if (products.count > 0 || breeding.count > 0) {
      this.logger.log(`Paused ${products.count} product(s) and ${breeding.count} breeding profile(s) for user ${userId} due to expired/canceled plan.`);
    }
    return { productsPaused: products.count, profilesPaused: breeding.count };
  }

  async restoreUserListings(userId: string): Promise<{ productsRestored: number; profilesRestored: number }> {
    const products = await this.prisma.product.updateMany({
      where: { sellerId: userId, status: 'inactive', hiddenAt: { not: null }, isDeleted: false },
      data: { status: 'active', hiddenAt: null },
    });

    const breeding = await this.prisma.breedingProfile.updateMany({
      where: { ownerId: userId, status: 'paused', isDeleted: false },
      data: { status: 'available', availableNow: true },
    });

    if (products.count > 0 || breeding.count > 0) {
      this.logger.log(`Restored ${products.count} product(s) and ${breeding.count} breeding profile(s) for user ${userId} upon active subscription.`);
    }
    return { productsRestored: products.count, profilesRestored: breeding.count };
  }

  async reconcileExpiredSubscriptions(): Promise<{ expiredSubscriptions: number; listingsPaused: number }> {
    const now = new Date();
    const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
    const graceCutoff = new Date(Date.now() - GRACE_PERIOD_MS);

    let expiredSubscriptions = 0;
    let listingsPaused = 0;

    // 1. Expire past_due subscriptions that exceeded 7-day grace period
    const expiredPastDue = await this.prisma.subscription.findMany({
      where: {
        status: 'past_due',
        updatedAt: { lt: graceCutoff },
      },
      select: { id: true, userId: true },
    });

    const userIdsToCheck = new Set<string>();

    for (const sub of expiredPastDue) {
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'canceled', cancelAtPeriodEnd: false, updatedAt: new Date() },
      });
      expiredSubscriptions++;
      userIdsToCheck.add(sub.userId);
    }

    // 2. Expire non-renewing subscriptions that passed currentPeriodEnd
    const expiredNonRenewing = await this.prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trialing'] },
        cancelAtPeriodEnd: true,
        currentPeriodEnd: { lt: now },
      },
      select: { id: true, userId: true },
    });

    for (const sub of expiredNonRenewing) {
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'canceled', cancelAtPeriodEnd: false, updatedAt: new Date() },
      });
      expiredSubscriptions++;
      userIdsToCheck.add(sub.userId);
    }

    // Pause listings for users whose subscriptions just expired (unless they have another active plan)
    for (const userId of userIdsToCheck) {
      const hasOtherActive = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['active', 'trialing'] },
          currentPeriodEnd: { gte: now },
        },
      });
      if (!hasOtherActive) {
        const res = await this.pauseUserListings(userId);
        listingsPaused += res.productsPaused;
      }
    }

    // 3. Find any sellers who have active products but NO valid commercial subscription
    const activeSellersWithProducts = await this.prisma.product.findMany({
      where: { status: 'active', hiddenAt: null, isDeleted: false },
      select: { sellerId: true },
      distinct: ['sellerId'],
    });

    for (const { sellerId } of activeSellersWithProducts) {
      if (userIdsToCheck.has(sellerId)) continue;
      // Check if seller is admin (admins bypass subscription requirements)
      const profile = await this.prisma.profile.findUnique({
        where: { id: sellerId },
        select: { role: true },
      });
      if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        continue;
      }

      // Check for any currently valid commercial subscription
      const hasValidSub = await this.prisma.subscription.findFirst({
        where: {
          userId: sellerId,
          status: { in: ['active', 'trialing', 'past_due'] },
          OR: [
            { status: { in: ['active', 'trialing'] }, currentPeriodEnd: { gte: now } },
            { status: 'past_due', updatedAt: { gte: graceCutoff } },
          ],
        },
      });

      if (!hasValidSub) {
        const res = await this.pauseUserListings(sellerId);
        listingsPaused += res.productsPaused;
      }
    }

    return { expiredSubscriptions, listingsPaused };
  }

  private assertGracePeriodValid(subscription: { status?: string; updatedAt?: Date | null }) {
    if (subscription?.status === 'past_due') {
      const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
      const elapsed = Date.now() - (subscription.updatedAt ? new Date(subscription.updatedAt).getTime() : Date.now());
      if (elapsed > GRACE_PERIOD_MS) {
        throw new ForbiddenException({
          code: 'GRACE_PERIOD_EXPIRED',
          message: 'Monthly payment failed and your 7-day grace period has expired. Please update your card in Billing Settings to restore services.',
        });
      }
    }
  }

  async checkSellerLimit(userId: string) {
    let subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        entitlement: { in: ['seller_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
        status: { in: ['active', 'trialing', 'past_due'] },
      },
    });

    if (!subscription && this.stripe?.enabled) {
      await this.syncUserSubscriptionsFromStripe(userId);
      subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          entitlement: { in: ['seller_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
          status: { in: ['active', 'trialing', 'past_due'] },
        },
      });
    }

    if (!subscription) {
      throw new ForbiddenException('Seller Professional subscription is required to publish products.');
    }

    this.assertGracePeriodValid(subscription);

    // Verify service allocation if tiered subscription (starter / professional)
    if (subscription.entitlement === 'starter' || subscription.entitlement === 'professional') {
      const prof = await this.prisma.professionalProfile.findUnique({
        where: { userId },
        select: { serviceAreas: true, category: true },
      });
      const activeServices = prof?.serviceAreas || [];
      const hasSeller = activeServices.includes('seller') || activeServices.length === 0 || prof?.category === 'product_seller';
      if (!hasSeller) {
        throw new ForbiddenException('Your current active service does not include Pet Products Seller. Please activate Seller in your dashboard or upgrade your plan.');
      }
      if (activeServices.length === 0) {
        await this.prisma.professionalProfile.upsert({
          where: { userId },
          create: {
            userId,
            category: 'product_seller',
            serviceAreas: ['seller'],
            isVerified: true,
            verifiedAt: new Date(),
          },
          update: {
            serviceAreas: ['seller'],
            deletedAt: null,
          },
        }).catch(() => {});
      }
    }

    const activeProducts = await this.prisma.product.count({
      where: { sellerId: userId, status: 'active' },
    });

    if (activeProducts >= SERVICE_LIMITS.seller.activeProducts) {
      throw new ForbiddenException('You have reached your active product listing limit (100). Please contact admin for a custom plan.');
    }
  }

  async checkBreederLimit(userId: string) {
    let subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        entitlement: { in: ['breeder_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
        status: { in: ['active', 'trialing', 'past_due'] },
      },
    });

    if (!subscription && this.stripe?.enabled) {
      await this.syncUserSubscriptionsFromStripe(userId);
      subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          entitlement: { in: ['breeder_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
          status: { in: ['active', 'trialing', 'past_due'] },
        },
      });
    }

    if (!subscription) {
      throw new ForbiddenException('Breeder Professional subscription is required to create breeding profiles.');
    }

    this.assertGracePeriodValid(subscription);

    // Verify service allocation if tiered subscription (starter / professional)
    if (subscription.entitlement === 'starter' || subscription.entitlement === 'professional') {
      const prof = await this.prisma.professionalProfile.findUnique({
        where: { userId },
        select: { serviceAreas: true, category: true },
      });
      const activeServices = prof?.serviceAreas || [];
      const hasBreeder = activeServices.includes('breeder') || activeServices.length === 0 || prof?.category === 'product_seller';
      if (!hasBreeder) {
        throw new ForbiddenException('Your current active service does not include Breeder & Stud Service. Please activate Breeder in your dashboard or upgrade your plan.');
      }
    }

    const activeProfiles = await this.prisma.breedingProfile.count({
      where: { ownerId: userId, status: 'active' },
    });

    if (activeProfiles >= SERVICE_LIMITS.breeder.activeProfiles) {
      throw new ForbiddenException('You have reached your active breeding profile limit (5). Please contact admin for a custom plan.');
    }
  }

  async checkCareProviderLimit(userId: string) {
    let subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        entitlement: { in: ['care_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
        status: { in: ['active', 'trialing', 'past_due'] },
      },
    });

    if (!subscription && this.stripe?.enabled) {
      await this.syncUserSubscriptionsFromStripe(userId);
      subscription = await this.prisma.subscription.findFirst({
        where: {
          userId,
          entitlement: { in: ['care_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] },
          status: { in: ['active', 'trialing', 'past_due'] },
        },
      });
    }

    if (!subscription) {
      throw new ForbiddenException('Care Professional subscription is required to add services or team members.');
    }

    this.assertGracePeriodValid(subscription);

    // Verify service allocation if tiered subscription (starter / professional)
    if (subscription.entitlement === 'starter' || subscription.entitlement === 'professional') {
      const prof = await this.prisma.professionalProfile.findUnique({
        where: { userId },
        select: { serviceAreas: true, category: true },
      });
      const activeServices = prof?.serviceAreas || [];
      const hasCare =
        activeServices.includes('care') ||
        activeServices.includes('vet') ||
        activeServices.length === 0 ||
        (prof?.category === 'pet_care_service_provider' || prof?.category === 'veterinarian');
      if (!hasCare) {
        throw new ForbiddenException('Your current active service does not include Pet Care or Veterinary Provider. Please activate it in your dashboard or upgrade your plan.');
      }
    }

    // Check services limit
    const activeServices = await this.prisma.petCareService.count({
      where: { provider: { addedBy: userId } },
    });

    if (activeServices >= SERVICE_LIMITS.care.activeServices) {
      throw new ForbiddenException('You have reached your active services limit (50). Please contact admin for a custom plan.');
    }
    
    // Check team members limit
    const teamMembers = await this.prisma.providerTeamMember.count({
      where: { addedBy: userId, isDeleted: false },
    });

    if (teamMembers >= SERVICE_LIMITS.care.teamMembers) {
      throw new ForbiddenException('You have reached your team members limit (10). Please contact admin for a custom plan.');
    }
  }

  async checkAdoptionLimit(userId: string, isOrganization: boolean) {
    const limit = isOrganization ? FREE_ANTI_ABUSE_LIMITS.adoption.verified_organization : FREE_ANTI_ABUSE_LIMITS.adoption.individual;
    
    const activeListings = await this.prisma.adoptionPost.count({
      where: { posterId: userId, status: 'available' },
    });

    if (activeListings >= limit) {
      throw new ForbiddenException(`You have reached your active adoption listing limit (${limit}).`);
    }
  }

  async checkEventsLimit(userId: string) {
    const limit = FREE_ANTI_ABUSE_LIMITS.events.standard;
    const futureEvents = await this.prisma.event.count({
      where: { hostId: userId, startsAt: { gt: new Date() }, isDeleted: false },
    });

    if (futureEvents >= limit) {
      throw new ForbiddenException(`You have reached your active events limit (${limit}).`);
    }
  }
}
