import { SetMetadata } from '@nestjs/common'
import { SubscriptionEntitlement } from '@prisma/client'

export const REQUIRED_SUBSCRIPTIONS_KEY = 'required_subscriptions'

/**
 * Restricts a route to verified professionals who have an active subscription
 * for specific entitlements (e.g., 'seller_professional', 'care_professional').
 * 
 * If multiple entitlements are provided, the user must have an active
 * subscription for AT LEAST ONE of them.
 * 
 * Must be paired with JwtAuthGuard.
 * 
 * Usage:
 *   @UseGuards(JwtAuthGuard, SubscriptionGuard)
 *   @RequireSubscription('seller_professional')
 *   // or
 *   @RequireSubscription('care_professional', 'care_additional_location')
 */
export const RequireSubscription = (...entitlements: SubscriptionEntitlement[]) => SetMetadata(REQUIRED_SUBSCRIPTIONS_KEY, entitlements)
