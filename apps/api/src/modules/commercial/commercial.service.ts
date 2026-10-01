import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { COMMERCIAL_PLANS, FREE_ANTI_ABUSE_LIMITS } from './commercial.constants';

@Injectable()
export class CommercialService {
  constructor(private prisma: PrismaService) {}

  async checkSellerLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: 'seller_professional', status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Seller Professional subscription is required to publish products.');
    }

    const activeProducts = await this.prisma.product.count({
      where: { sellerId: userId, status: 'active' },
    });

    if (activeProducts >= COMMERCIAL_PLANS.seller_professional.limits.activeProducts) {
      throw new ForbiddenException('You have reached your active product listing limit (100).');
    }
  }

  async checkBreederLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: 'breeder_professional', status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Breeder Professional subscription is required to create breeding profiles.');
    }

    const activeProfiles = await this.prisma.breedingProfile.count({
      where: { ownerId: userId, status: 'active' },
    });

    if (activeProfiles >= COMMERCIAL_PLANS.breeder_professional.limits.activeProfiles) {
      throw new ForbiddenException('You have reached your active breeding profile limit (5).');
    }
  }

  async checkCareProviderLimit(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, entitlement: 'care_professional', status: 'active' },
    });

    if (!subscription) {
      throw new ForbiddenException('Care Professional subscription is required to add services or team members.');
    }

    // Check services limit
    const activeServices = await this.prisma.petCareService.count({
      where: { provider: { addedBy: userId } },
    });

    if (activeServices >= COMMERCIAL_PLANS.care_professional.limits.activeServices) {
      throw new ForbiddenException('You have reached your active services limit (50).');
    }
    
    // Check team members limit
    const teamMembers = await this.prisma.providerTeamMember.count({
      where: { addedBy: userId, isDeleted: false },
    });

    if (teamMembers >= COMMERCIAL_PLANS.care_professional.limits.teamMembers) {
      throw new ForbiddenException('You have reached your team members limit (10).');
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
