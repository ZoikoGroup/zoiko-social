import { ForbiddenException } from '@nestjs/common';
import { CommercialService } from './commercial.service';
import { SERVICE_LIMITS, FREE_ANTI_ABUSE_LIMITS } from './commercial.constants';

describe('CommercialService Limits', () => {
  let service: CommercialService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;

  beforeEach(() => {
    prisma = {
      subscription: { findFirst: jest.fn(), findMany: jest.fn().mockResolvedValue([]), update: jest.fn() },
      product: { count: jest.fn(), updateMany: jest.fn().mockResolvedValue({ count: 2 }), findMany: jest.fn().mockResolvedValue([]) },
      breedingProfile: { count: jest.fn(), updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      serviceProvider: { count: jest.fn(), updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      petCareService: { count: jest.fn() },
      providerTeamMember: { count: jest.fn() },
      adoptionPost: { count: jest.fn() },
      event: { count: jest.fn() },
      profile: { findUnique: jest.fn() },
    };
    service = new CommercialService(prisma);
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  describe('checkSellerLimit', () => {
    it('throws if no active seller_professional subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);
      await expect(service.checkSellerLimit('user-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws if active products >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.product.count.mockResolvedValue(SERVICE_LIMITS.seller.activeProducts);
      await expect(service.checkSellerLimit('user-1')).rejects.toThrow(/listing limit/);
    });

    it('passes if under limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.product.count.mockResolvedValue(SERVICE_LIMITS.seller.activeProducts - 1);
      await expect(service.checkSellerLimit('user-1')).resolves.toBeUndefined();
    });

    it('passes if past_due subscription is within 7-day grace period', async () => {
      prisma.subscription.findFirst.mockResolvedValue({
        id: 'sub-1',
        status: 'past_due',
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      });
      prisma.product.count.mockResolvedValue(0);
      await expect(service.checkSellerLimit('user-1')).resolves.toBeUndefined();
    });

    it('throws if past_due subscription exceeds 7-day grace period', async () => {
      prisma.subscription.findFirst.mockResolvedValue({
        id: 'sub-1',
        status: 'past_due',
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      });
      await expect(service.checkSellerLimit('user-1')).rejects.toThrow(/grace period has expired/);
    });
  });

  describe('checkBreederLimit', () => {
    it('throws if no active breeder_professional subscription', async () => {
      prisma.subscription.findFirst.mockResolvedValue(null);
      await expect(service.checkBreederLimit('user-1')).rejects.toThrow(ForbiddenException);
    });

    it('throws if active profiles >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.breedingProfile.count.mockResolvedValue(SERVICE_LIMITS.breeder.activeProfiles);
      await expect(service.checkBreederLimit('user-1')).rejects.toThrow(/profile limit/);
    });

    it('passes if under limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.breedingProfile.count.mockResolvedValue(SERVICE_LIMITS.breeder.activeProfiles - 1);
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
      prisma.petCareService.count.mockResolvedValue(SERVICE_LIMITS.care.activeServices);
      prisma.providerTeamMember.count.mockResolvedValue(0);
      await expect(service.checkCareProviderLimit('user-1')).rejects.toThrow(/services limit/);
    });

    it('throws if team members >= limit', async () => {
      prisma.subscription.findFirst.mockResolvedValue({ id: 'sub-1' });
      prisma.petCareService.count.mockResolvedValue(0);
      prisma.providerTeamMember.count.mockResolvedValue(SERVICE_LIMITS.care.teamMembers);
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

  describe('pauseUserListings and restoreUserListings', () => {
    it('pauses active products and breeding profiles when plan cancels/expires', async () => {
      const res = await service.pauseUserListings('user-1');
      expect(res.productsPaused).toBe(2);
      expect(res.profilesPaused).toBe(1);
      expect(res.providersPaused).toBe(1);
      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: { sellerId: 'user-1', status: 'active', isDeleted: false },
        data: { status: 'inactive', hiddenAt: expect.any(Date) },
      });
      expect(prisma.breedingProfile.updateMany).toHaveBeenCalledWith({
        where: { ownerId: 'user-1', availableNow: true, isDeleted: false },
        data: { status: 'paused', availableNow: false },
      });
      expect(prisma.serviceProvider.updateMany).toHaveBeenCalledWith({
        where: { addedBy: 'user-1', availableForBooking: true, isDeleted: false },
        data: { availableForBooking: false, hiddenAt: expect.any(Date) },
      });
    });

    it('restores paused products and breeding profiles when plan renews', async () => {
      const res = await service.restoreUserListings('user-1');
      expect(res.productsRestored).toBe(2);
      expect(res.profilesRestored).toBe(1);
      expect(res.providersRestored).toBe(1);
      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: { sellerId: 'user-1', status: 'inactive', hiddenAt: { not: null }, isDeleted: false },
        data: { status: 'active', hiddenAt: null },
      });
      expect(prisma.breedingProfile.updateMany).toHaveBeenCalledWith({
        where: { ownerId: 'user-1', status: 'paused', isDeleted: false },
        data: { status: 'available', availableNow: true },
      });
      expect(prisma.serviceProvider.updateMany).toHaveBeenCalledWith({
        where: { addedBy: 'user-1', availableForBooking: false, hiddenAt: { not: null }, isDeleted: false },
        data: { availableForBooking: true, hiddenAt: null },
      });
    });
  });

  describe('reconcileExpiredSubscriptions', () => {
    it('finds expired past_due and non-renewing subscriptions and pauses orphan seller listings', async () => {
      prisma.subscription.findMany
        .mockResolvedValueOnce([{ id: 'sub-past-due', userId: 'user-1' }]) // expired past_due
        .mockResolvedValueOnce([{ id: 'sub-non-renew', userId: 'user-2' }]); // expired non-renewing
      prisma.product.findMany.mockResolvedValueOnce([{ sellerId: 'user-3' }]); // orphan seller with active products
      prisma.profile.findUnique.mockResolvedValueOnce({ role: 'user' });
      prisma.subscription.findFirst.mockResolvedValueOnce(null); // user-3 has no active plan

      const res = await service.reconcileExpiredSubscriptions();
      expect(res.expiredSubscriptions).toBe(2);
      expect(res.listingsPaused).toBe(6); // 2 each from user-1, user-2, user-3
      expect(prisma.subscription.update).toHaveBeenCalledTimes(2);
    });
  });
});
