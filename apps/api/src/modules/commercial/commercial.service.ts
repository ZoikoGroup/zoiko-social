import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SERVICE_LIMITS, FREE_ANTI_ABUSE_LIMITS } from './commercial.constants';
import type { SubscriptionEntitlement } from '@prisma/client';

@Injectable()
export class CommercialService {
  constructor(private prisma: PrismaService) {}

  async checkSellerLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: { in: ['seller_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] }, status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Seller Professional subscription is required to publish products.');
    }

    const activeProducts = await this.prisma.product.count({
      where: { sellerId: userId, status: 'active' },
    });

    if (activeProducts >= SERVICE_LIMITS.seller.activeProducts) {
      throw new ForbiddenException('You have reached your active product listing limit (100). Please contact admin for a custom plan.');
    }
  }

  async checkBreederLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: { in: ['breeder_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] }, status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Breeder Professional subscription is required to create breeding profiles.');
    }

    const activeProfiles = await this.prisma.breedingProfile.count({
      where: { ownerId: userId, status: 'active' },
    });

    if (activeProfiles >= SERVICE_LIMITS.breeder.activeProfiles) {
      throw new ForbiddenException('You have reached your active breeding profile limit (5). Please contact admin for a custom plan.');
    }
  }

  async checkCareProviderLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: { in: ['care_professional', 'starter', 'professional', 'premium'] as SubscriptionEntitlement[] }, status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Care Professional subscription is required to add services or team members.');
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
