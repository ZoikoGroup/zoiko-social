import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StripeService } from '../payments/stripe.service';
import { COMMERCIAL_PLANS } from './commercial.constants';

@Controller('commercial')
export class CommercialController {
  constructor(private readonly stripe: StripeService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(@CurrentUser() user: AuthenticatedUser, @Body() body: { planId: string }) {
    if (!this.stripe.enabled) {
      throw new BadRequestException('Stripe is not configured on this environment.');
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
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=billing&success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=billing&canceled=true`,
    });

    return { url: session.url };
  }
}
