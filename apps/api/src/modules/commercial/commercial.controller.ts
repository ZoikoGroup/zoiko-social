import { Controller, Post, Get, Body, Req, UseGuards, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StripeService } from '../payments/stripe.service';
import { PrismaService } from '../prisma/prisma.service';
import { COMMERCIAL_PLANS } from './commercial.constants';
import type { SubscriptionEntitlement } from '@prisma/client';

import { PaymentConfirmationEmailService } from '../payments/payment-confirmation-email.service';

@Controller('commercial')
export class CommercialController {
  private readonly logger = new Logger(CommercialController.name);

  constructor(
    private readonly stripe: StripeService,
    private readonly prisma: PrismaService,
    private readonly paymentEmail: PaymentConfirmationEmailService,
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
  async subscribe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { planId: string; origin?: string },
    @Req() req: FastifyRequest,
  ) {
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

    // Determine the base client application URL dynamically:
    // 1. Explicit body.origin sent from the client
    // 2. HTTP Origin header from browser request
    // 3. HTTP Referer header origin
    // 4. NEXT_PUBLIC_APP_URL or APP_BASE_URL or ALLOWED_ORIGIN env vars
    // 5. Fallback http://localhost:3000
    const rawOrigin =
      body.origin ||
      (req.headers.origin as string) ||
      (req.headers.referer ? new URL(req.headers.referer as string).origin : '') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      process.env.ALLOWED_ORIGIN ||
      'http://localhost:3000';
    const appUrl = rawOrigin.replace(/\/+$/, '');

    if (!this.stripe.enabled) {
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        this.logger.warn(`Stripe not configured — using dev fallback mock checkout session for user ${user.id} and plan ${body.planId}`);
        return {
          url: `${appUrl}/subscribed-successfully?plan=${body.planId}&session_id=mock_dev_session_${Date.now()}`,
        };
      }
      throw new BadRequestException('Stripe is not configured on this environment.');
    }

    const session = await this.stripe.createSubscriptionCheckout({
      planId: body.planId,
      userId: user.id,
      productTitle: `${body.planId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Subscription`,
      amountCents: Math.round(plan.monthlyPriceUsd * 100),
      currency: 'USD',
      successUrl: `${appUrl}/subscribed-successfully?plan=${body.planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/settings?section=billing&canceled=true`,
      customerEmail: user.email,
    });

    return { url: session.url };
  }

  @Post('confirm-session')
  @UseGuards(JwtAuthGuard)
  async confirmSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { sessionId?: string; planId?: string },
  ) {
    let entitlement: string | undefined;
    let stripeSubscriptionId: string | undefined;

    if (this.stripe.enabled) {
      if (!body.sessionId) {
        throw new BadRequestException('Checkout session ID is required to confirm payment');
      }
      try {
        const session = await this.stripe.retrieveCheckoutSession(body.sessionId);
        const isPaid = session.payment_status === 'paid' || session.status === 'complete';
        if (!isPaid) {
          throw new BadRequestException('Payment has not been completed for this session');
        }

        // Verify session belongs to the current user if client_reference_id is present
        if (session.client_reference_id && session.client_reference_id !== user.id) {
          throw new ForbiddenException('Checkout session does not belong to the authenticated user');
        }

        entitlement = session.metadata?.entitlement || body.planId;
        if (session.subscription) {
          stripeSubscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;
        }
      } catch (err) {
        if (err instanceof BadRequestException || err instanceof ForbiddenException) throw err;
        throw new BadRequestException('Could not verify checkout session with payment provider: ' + (err as Error).message);
      }
    } else {
      // In local development / mock testing mode when Stripe keys are not configured
      entitlement = body.planId;
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

      const defaultService = category === 'veterinarian' ? 'vet' : category === 'pet_care_service_provider' ? 'care' : 'seller';
      const initialServices = [defaultService];

      if (existingProf) {
        const currentServices = existingProf.serviceAreas && existingProf.serviceAreas.length > 0 ? existingProf.serviceAreas : initialServices;
        await this.prisma.professionalProfile.update({
          where: { userId: user.id },
          data: {
            deletedAt: null,
            category,
            isVerified: true,
            verifiedAt: existingProf.verifiedAt || new Date(),
            serviceAreas: currentServices,
          },
        });
      } else {
        await this.prisma.professionalProfile.create({
          data: {
            userId: user.id,
            category,
            isVerified: true,
            verifiedAt: new Date(),
            serviceAreas: initialServices,
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

    // Send confirmation and invoice email to subscriber
    try {
      const planKey = (subEntitlement as unknown) as keyof typeof COMMERCIAL_PLANS;
      const planConfig = COMMERCIAL_PLANS[planKey];
      const planName = planConfig ? planConfig.name : (subEntitlement.charAt(0).toUpperCase() + subEntitlement.slice(1).replace('_', ' ') + ' Plan');
      const amountFormatted = planConfig ? `$${planConfig.monthlyPriceUsd.toFixed(2)}/mo` : 'Subscription Fee';

      // Find user name / profile
      const userProfile = await this.prisma.profile.findUnique({
        where: { id: user.id },
        select: { displayName: true, firstName: true, lastName: true },
      });
      const fullName = [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ');
      const recipientName = userProfile?.displayName || fullName || 'Member';

      if (user.email) {
        await this.paymentEmail.sendSubscriptionConfirmation({
          recipientEmail: user.email,
          recipientName,
          planName,
          amountFormatted,
          billingInterval: 'Monthly',
          invoiceNumber: body.sessionId || stripeSubscriptionId,
        });
      }
    } catch (emailErr) {
      this.logger.error(`Failed to send subscription confirmation email to ${user.email}: ${(emailErr as Error).message}`);
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

    // Retrieve currently active services to identify deactivated ones
    const currentProf = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
      select: { serviceAreas: true },
    });
    const previousServices = currentProf?.serviceAreas || [];
    const deactivatedServices = previousServices.filter((s) => !selected.includes(s));

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

    // Plug Loophole: Automatically pause / mark inactive any listings for deactivated services
    if (deactivatedServices.length > 0) {
      if (deactivatedServices.includes('seller')) {
        // Deactivate active products so they do not stay publicly listed
        await this.prisma.product.updateMany({
          where: { sellerId: user.id, status: 'active', isDeleted: false },
          data: { status: 'inactive' },
        });
      }
      if (deactivatedServices.includes('breeder')) {
        // Pause active breeding profiles so they do not show in available listings
        await this.prisma.breedingProfile.updateMany({
          where: { ownerId: user.id, isDeleted: false, availableNow: true },
          data: { availableNow: false },
        });
      }
    }

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


