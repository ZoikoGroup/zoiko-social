import { ForbiddenException } from '@nestjs/common';
import { CommercialService } from './commercial.service';
import { COMMERCIAL_PLANS, FREE_ANTI_ABUSE_LIMITS } from './commercial.constants';

describe('CommercialService Limits', () => {
  let service: CommercialService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;

  beforeEach(() => {
    prisma = {
      subscription: { findFirst: jest.fn() },
      product: { count: jest.fn() },
      breedingProfile: { count: jest.fn() },
      petCareService: { count: jest.fn() },
      providerTeamMember: { count: jest.fn() },
      adoptionPost: { count: jest.fn() },
      event: { count: jest.fn() },
    };
    service = new CommercialService(prisma);
  });

  describe('checkSellerLimit', () => {
    it('throws if no active seller_professional subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);
      await expect(service.checkSellerLimit('user-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws if active products >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.product.count.mockResolvedValue(COMMERCIAL_PLANS.seller_professional.limits.activeProducts);
      await expect(service.checkSellerLimit('user-1')).rejects.toThrow(/listing limit/);
    });

    it('passes if under limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.product.count.mockResolvedValue(COMMERCIAL_PLANS.seller_professional.limits.activeProducts - 1);
      await expect(service.checkSellerLimit('user-1')).resolves.toBeUndefined();
    });
  });

  describe('checkBreederLimit', () => {
    it('throws if no active breeder_professional subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);
      await expect(service.checkBreederLimit('user-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws if active profiles >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.breedingProfile.count.mockResolvedValue(COMMERCIAL_PLANS.breeder_professional.limits.activeProfiles);
      await expect(service.checkBreederLimit('user-1')).rejects.toThrow(/profile limit/);
    });

    it('passes if under limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.breedingProfile.count.mockResolvedValue(COMMERCIAL_PLANS.breeder_professional.limits.activeProfiles - 1);
      await expect(service.checkBreederLimit('user-1')).resolves.toBeUndefined();
    });
  });

  describe('checkCareProviderLimit', () => {
    it('throws if no active care_professional subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);
      await expect(service.checkCareProviderLimit('user-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws if active services >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.petCareService.count.mockResolvedValue(COMMERCIAL_PLANS.care_professional.limits.activeServices);
      prisma.providerTeamMember.count.mockResolvedValue(0);
      await expect(service.checkCareProviderLimit('user-1')).rejects.toThrow(/services limit/);
    });

    it('throws if team members >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.petCareService.count.mockResolvedValue(0);
      prisma.providerTeamMember.count.mockResolvedValue(COMMERCIAL_PLANS.care_professional.limits.teamMembers);
      await expect(service.checkCareProviderLimit('user-1')).rejects.toThrow(/team members limit/);
    });

    it('passes if under limits', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.petCareService.count.mockResolvedValue(0);
      prisma.providerTeamMember.count.mockResolvedValue(0);
      await expect(service.checkCareProviderLimit('user-1')).resolves.toBeUndefined();
    });
  });

  describe('checkAdoptionLimit', () => {
    it('throws if individual hits limit', async () => {
      prisma.adoptionPost.count.mockResolvedValue(FREE_ANTI_ABUSE_LIMITS.adoption.individual);
      await expect(service.checkAdoptionLimit('user-1', false)).rejects.toThrow(/limit/);
    });

    it('throws if organization hits limit', async () => {
      prisma.adoptionPost.count.mockResolvedValue(FREE_ANTI_ABUSE_LIMITS.adoption.verified_organization);
      await expect(service.checkAdoptionLimit('user-1', true)).rejects.toThrow(/limit/);
    });

    it('passes if under limit', async () => {
      prisma.adoptionPost.count.mockResolvedValue(0);
      await expect(service.checkAdoptionLimit('user-1', false)).resolves.toBeUndefined();
    });
  });

  describe('checkEventsLimit', () => {
    it('throws if events hit standard limit', async () => {
      prisma.event.count.mockResolvedValue(FREE_ANTI_ABUSE_LIMITS.events.standard);
      await expect(service.checkEventsLimit('user-1')).rejects.toThrow(/limit/);
    });

    it('passes if under limit', async () => {
      prisma.event.count.mockResolvedValue(0);
      await expect(service.checkEventsLimit('user-1')).resolves.toBeUndefined();
    });
  });
});
