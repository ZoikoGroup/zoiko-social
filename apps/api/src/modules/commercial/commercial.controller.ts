import { Controller, Post, Get, Body, UseGuards, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StripeService } from '../payments/stripe.service';
import { PrismaService } from '../prisma/prisma.service';
import { COMMERCIAL_PLANS } from './commercial.constants';
import type { SubscriptionEntitlement } from '@prisma/client';

@Controller('commercial')
export class CommercialController {
  private readonly logger = new Logger(CommercialController.name);

  constructor(
    private readonly stripe: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('subscriptions')
  @UseGuards(JwtAuthGuard)
  async getSubscriptions(@CurrentUser() user: AuthenticatedUser) {
    try {
      this.logger.log(`Fetching subscriptions for userId: ${user.id}`);
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          userId: user.id,
          status: { in: ['active', 'trialing'] },
        },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.log(`Found ${subscriptions.length} subscriptions for userId: ${user.id}`);

      return { data: subscriptions };
    } catch (err) {
      this.logger.error(`Error fetching subscriptions for userId ${user.id}: ${(err as Error).message}`, (err as Error).stack);
      return { data: [] };
    }
  }


  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(@CurrentUser() user: AuthenticatedUser, @Body() body: { planId: string }) {
    if (!this.stripe.enabled) {
      throw new BadRequestException('Stripe is not configured on this environment.');
    }

    // Gating check: User MUST be identity verified to purchase commercial plans
    const profile = await this.prisma.profile.findUnique({
      where: { id: user.id },
      select: { identityStatus: true, organizationStatus: true },
    });

    if (profile?.identityStatus !== 'approved' && profile?.organizationStatus !== 'approved') {
      throw new ForbiddenException({
        code: 'VERIFICATION_REQUIRED',
        message: 'You must complete identity verification before purchasing a commercial plan.',
      });
    }

    const plan = COMMERCIAL_PLANS[body.planId as keyof typeof COMMERCIAL_PLANS];
    if (!plan) {
      throw new BadRequestException('Invalid plan ID.');
    }

    const session = await this.stripe.createSubscriptionCheckout({
      planId: body.planId,
      userId: user.id,
      productTitle: `${body.planId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Subscription`,
      amountCents: Math.round(plan.monthlyPriceUsd * 100),
      currency: 'USD',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribed-successfully?plan=${body.planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?section=billing&canceled=true`,
    });

    return { url: session.url };
  }

  @Post('confirm-session')
  @UseGuards(JwtAuthGuard)
  async confirmSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { sessionId?: string; planId?: string },
  ) {
    let entitlement: string | undefined = body.planId;
    let stripeSubscriptionId: string | undefined;

    if (body.sessionId && this.stripe.enabled) {
      try {
        const session = await this.stripe.retrieveCheckoutSession(body.sessionId);
        if (session.payment_status === 'paid' || session.status === 'complete') {
          if (session.metadata?.entitlement) {
            entitlement = session.metadata.entitlement;
          }
          if (session.subscription) {
            stripeSubscriptionId =
              typeof session.subscription === 'string'
                ? session.subscription
                : session.subscription.id;
          }
        }
      } catch (_e) {
        // If Stripe retrieve fails, fallback to planId if provided
      }
    }

    const validEntitlements: string[] = [
      'starter',
      'professional',
      'premium',
      'seller_professional',
      'care_professional',
      'breeder_professional',
    ];

    if (!entitlement || !validEntitlements.includes(entitlement)) {
      throw new BadRequestException('Invalid confirmation request');
    }

    const subEntitlement = entitlement as SubscriptionEntitlement;

    // Upsert subscription for user
    const existing = await this.prisma.subscription.findFirst({
      where: {
        userId: user.id,
        entitlement: subEntitlement,
        status: { in: ['active', 'trialing'] },
      },
    });

    let createdSub = existing;
    if (!existing) {
      createdSub = await this.prisma.subscription.create({
        data: {
          userId: user.id,
          entitlement: subEntitlement,
          stripeId: stripeSubscriptionId || null,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Automatically sync professional profile and verified status
    try {
      const categoryMap: Record<string, import('@prisma/client').ProfessionalCategory> = {
        starter: 'product_seller',
        professional: 'product_seller',
        premium: 'product_seller',
        seller_professional: 'product_seller',
        care_professional: 'pet_care_service_provider',
        breeder_professional: 'product_seller',
      };

      const category = categoryMap[entitlement as string] || 'product_seller';

      // 1. Ensure Profile has identityStatus: approved
      await this.prisma.profile.update({
        where: { id: user.id },
        data: {
          identityStatus: 'approved',
          ...(entitlement === 'care_professional' ? { credentialStatus: 'approved' } : {}),
        },
      });

      // 2. Upsert ProfessionalProfile
      const existingProf = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });

      if (existingProf) {
        await this.prisma.professionalProfile.update({
          where: { userId: user.id },
          data: {
            deletedAt: null,
            category,
            isVerified: true,
            verifiedAt: existingProf.verifiedAt || new Date(),
          },
        });
      } else {
        await this.prisma.professionalProfile.create({
          data: {
            userId: user.id,
            category,
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
      }

      await this.prisma.professionalSetting.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });
    } catch (profErr) {
      this.logger.warn(`Could not auto-sync professional profile for user ${user.id}: ${(profErr as Error).message}`);
    }

    return { data: createdSub };
  }

  @Get('active-services')
  @UseGuards(JwtAuthGuard)
  async getActiveServices(@CurrentUser() user: AuthenticatedUser) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check highest active tier
    let tier: 'starter' | 'professional' | 'premium' | 'legacy' = 'starter';
    let maxServices = 1;

    const hasPremium = subscriptions.some((s) => s.entitlement === 'premium' || s.entitlement === 'care_professional');
    const hasProfessional = subscriptions.some((s) => s.entitlement === 'professional' || s.entitlement === 'breeder_professional');
    const hasStarter = subscriptions.some((s) => s.entitlement === 'starter' || s.entitlement === 'seller_professional');

    if (hasPremium) {
      tier = 'premium';
      maxServices = COMMERCIAL_PLANS.premium.maxServicesAllowed;
    } else if (hasProfessional) {
      tier = 'professional';
      maxServices = COMMERCIAL_PLANS.professional.maxServicesAllowed;
    } else if (hasStarter) {
      tier = 'starter';
      maxServices = COMMERCIAL_PLANS.starter.maxServicesAllowed;
    }

    const prof = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
      select: { serviceAreas: true, category: true, isVerified: true },
    });

    const activeServices: string[] = (prof?.serviceAreas || []).filter((s) =>
      ['seller', 'breeder', 'care', 'vet'].includes(s),
    );

    // If no services chosen yet but profile has legacy category, infer default
    if (activeServices.length === 0 && prof?.category) {
      if (prof.category === 'veterinarian') activeServices.push('vet');
      else if (prof.category === 'pet_care_service_provider') activeServices.push('care');
      else activeServices.push('seller');
    }

    return {
      data: {
        tier,
        maxServicesAllowed: maxServices,
        activeServices,
        subscriptions,
      },
    };
  }

  @Post('select-services')
  @UseGuards(JwtAuthGuard)
  async selectServices(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { services: string[] },
  ) {
    if (!body.services || !Array.isArray(body.services)) {
      throw new BadRequestException('Services must be an array');
    }

    const validServices = ['seller', 'breeder', 'care', 'vet'];
    const selected = body.services.filter((s) => validServices.includes(s));

    if (selected.length === 0) {
      throw new BadRequestException('At least one service must be selected');
    }

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing'] },
      },
    });

    if (subscriptions.length === 0 && user.role !== 'admin' && user.role !== 'super_admin') {
      throw new BadRequestException('Active commercial subscription required to activate services.');
    }

    let maxServices = 1;
    if (subscriptions.some((s) => s.entitlement === 'premium' || s.entitlement === 'care_professional')) {
      maxServices = 4;
    } else if (subscriptions.some((s) => s.entitlement === 'professional' || s.entitlement === 'breeder_professional')) {
      maxServices = 2;
    } else {
      maxServices = 1;
    }

    if (selected.length > maxServices) {
      throw new BadRequestException(`Your current plan allows up to ${maxServices} active service${maxServices > 1 ? 's' : ''}.`);
    }

    // Determine primary category
    let primaryCategory: import('@prisma/client').ProfessionalCategory = 'product_seller';
    if (selected.includes('vet')) {
      primaryCategory = 'veterinarian';
    } else if (selected.includes('care')) {
      primaryCategory = 'pet_care_service_provider';
    } else if (selected.includes('seller') || selected.includes('breeder')) {
      primaryCategory = 'product_seller';
    }

    // Upsert ProfessionalProfile with active services in serviceAreas
    await this.prisma.professionalProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        category: primaryCategory,
        isVerified: true,
        verifiedAt: new Date(),
        serviceAreas: selected,
      },
      update: {
        category: primaryCategory,
        serviceAreas: selected,
        deletedAt: null,
      },
    });

    await this.prisma.profile.update({
      where: { id: user.id },
      data: {
        identityStatus: 'approved',
        ...(selected.includes('care') ? { credentialStatus: 'approved' } : {}),
      },
    });

    return {
      data: {
        success: true,
        activeServices: selected,
      },
    };
  }
}


