import { BadRequestException, Controller, Get, Post, Req, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'
import Stripe from 'stripe'
import { OrdersService } from './orders.service'
import { StripeService } from './stripe.service'
import { ConfigService } from '../config/config.service'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { PaymentConfirmationEmailService } from './payment-confirmation-email.service'
import { COMMERCIAL_PLANS } from '../commercial/commercial.constants'

/** Request augmented with the raw request body — see main.ts's content-type parser override. */
type RequestWithRawBody = FastifyRequest & { rawBody?: Buffer }

/** Stripe returns related objects as either a bare ID or an expanded object. */
function stripeId(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null
  return typeof ref === 'string' ? ref : ref.id
}

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private readonly orders: OrdersService,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly paymentEmail: PaymentConfirmationEmailService,
  ) {}


  @Get('orders/mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.orders.listForBuyer(user.id) }
  }

  @Get('orders/selling')
  @UseGuards(JwtAuthGuard)
  async selling(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.orders.listForSeller(user.id) }
  }

  @Post('payments/stripe/webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: RequestWithRawBody) {
    const signature = req.headers['stripe-signature']
    if (!signature || typeof signature !== 'string' || !req.rawBody) {
      throw new BadRequestException({ code: 'INVALID_WEBHOOK_REQUEST', message: 'Missing signature or body' })
    }

    let event: Stripe.Event
    try {
      event = this.stripe.constructWebhookEvent(req.rawBody, signature)
    } catch (err) {
      this.logger.warn(`Stripe webhook signature verification failed: ${(err as Error).message}`)
      throw new BadRequestException({ code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentStatusStr = String(session.payment_status)
        const sessionStatusStr = String(session.status)
        const isPaid = paymentStatusStr === 'paid' || sessionStatusStr === 'complete'
        const isPending = paymentStatusStr === 'unpaid' && sessionStatusStr === 'open'
        const status = isPaid ? 'success' : isPending ? 'pending' : 'failed'

        if (session.mode === 'subscription') {
          const userId = session.client_reference_id;
          const entitlement = session.metadata?.entitlement as import('@prisma/client').SubscriptionEntitlement;
          if (userId && entitlement) {
            const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
            
            if (isPaid) {
              await this.prisma.subscription.create({
                data: {
                  userId,
                  entitlement,
                  stripeId: subscriptionId,
                  status: 'active',
                  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approximate 30 days
                }
              });

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

                await this.prisma.profile.update({
                  where: { id: userId },
                  data: {
                    identityStatus: 'approved',
                    ...(entitlement === 'care_professional' ? { credentialStatus: 'approved' } : {}),
                  },
                });

                const existingProf = await this.prisma.professionalProfile.findUnique({
                  where: { userId },
                });

                const defaultService = category === 'veterinarian' ? 'vet' : category === 'pet_care_service_provider' ? 'care' : 'seller';
                const initialServices = [defaultService];

                if (existingProf) {
                  const currentServices = existingProf.serviceAreas && existingProf.serviceAreas.length > 0 ? existingProf.serviceAreas : initialServices;
                  await this.prisma.professionalProfile.update({
                    where: { userId },
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
                      userId,
                      category,
                      isVerified: true,
                      verifiedAt: new Date(),
                      serviceAreas: initialServices,
                    },
                  });
                }

                await this.prisma.professionalSetting.upsert({
                  where: { userId },
                  create: { userId },
                  update: {},
                });
              } catch (profErr) {
                this.logger.warn(`Could not auto-sync professional profile for user ${userId}: ${(profErr as Error).message}`);
              }
            }

            // Send subscription confirmation / invoice email (for success, pending, or failed)
            try {
              const planKey = entitlement as keyof typeof COMMERCIAL_PLANS;
              const planConfig = COMMERCIAL_PLANS[planKey];
              const planName = planConfig ? planConfig.name : (entitlement.charAt(0).toUpperCase() + entitlement.slice(1).replace('_', ' ') + ' Plan');
              const amountFormatted = planConfig ? `$${planConfig.monthlyPriceUsd.toFixed(2)}/mo` : 'Subscription Fee';

              const recipientEmail = session.customer_details?.email || session.customer_email || undefined;

              await this.paymentEmail.sendPaymentConfirmation({
                userId,
                recipientEmail,
                planName,
                amountFormatted,
                status,
                billingInterval: 'Monthly',
                invoiceNumber: session.id || subscriptionId,
              });
            } catch (emailErr) {
              this.logger.error(`Failed to send subscription confirmation email for user ${userId}: ${(emailErr as Error).message}`);
            }
          }
        } else {
          // One-time order checkout
          if (isPaid) {
            await this.orders.markPaidBySessionId(session.id, stripeId(session.payment_intent))
          }
        }
        break
      }
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          const userId = session.client_reference_id
          const entitlement = session.metadata?.entitlement as import('@prisma/client').SubscriptionEntitlement
          if (userId && entitlement) {
            const planKey = entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${entitlement} Plan`
            const amountFormatted = planConfig ? `$${planConfig.monthlyPriceUsd.toFixed(2)}/mo` : 'Subscription Fee'
            await this.paymentEmail.sendPaymentConfirmation({
              userId,
              recipientEmail: session.customer_details?.email || session.customer_email || undefined,
              planName,
              amountFormatted,
              status: 'success',
              invoiceNumber: session.id,
            })
          }
        } else {
          await this.orders.markPaidBySessionId(session.id, stripeId(session.payment_intent))
        }
        break
      }
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          const userId = session.client_reference_id
          const entitlement = session.metadata?.entitlement as import('@prisma/client').SubscriptionEntitlement
          if (userId && entitlement) {
            const planKey = entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${entitlement} Plan`
            const amountFormatted = planConfig ? `$${planConfig.monthlyPriceUsd.toFixed(2)}/mo` : 'Subscription Fee'
            await this.paymentEmail.sendPaymentConfirmation({
              userId,
              recipientEmail: session.customer_details?.email || session.customer_email || undefined,
              planName,
              amountFormatted,
              status: 'failed',
              invoiceNumber: session.id,
              failureReason: 'Asynchronous payment method failed to clear.',
            })
          }
        } else {
          await this.orders.markCancelledBySessionId(session.id)
        }
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          const userId = session.client_reference_id
          const entitlement = session.metadata?.entitlement as import('@prisma/client').SubscriptionEntitlement
          if (userId && entitlement) {
            const planKey = entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${entitlement} Plan`
            const amountFormatted = planConfig ? `$${planConfig.monthlyPriceUsd.toFixed(2)}/mo` : 'Subscription Fee'
            await this.paymentEmail.sendPaymentConfirmation({
              userId,
              recipientEmail: session.customer_details?.email || session.customer_email || undefined,
              planName,
              amountFormatted,
              status: 'failed',
              invoiceNumber: session.id,
              failureReason: 'The checkout session timed out before payment was completed.',
            })
          }
        } else {
          await this.orders.markCancelledBySessionId(session.id)
        }
        break
      }
      // Reversals arrive keyed by payment intent, not checkout session, and can
      // originate outside the product entirely (a refund issued from the Stripe
      // dashboard). Without these, an order stays `paid` forever after the money
      // has gone back — ZSOC-COM-REV-001 §17, §29 FIN-03.
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await this.orders.recordRefund({
          eventId: event.id,
          paymentIntentId: stripeId(charge.payment_intent),
          chargeId: charge.id,
          amountRefundedCents: charge.amount_refunded,
          currency: charge.currency.toUpperCase(),
          fullyRefunded: charge.refunded,
          reason: charge.refunds?.data[0]?.reason ?? null,
          occurredAt: new Date(event.created * 1000),
        })
        break
      }
      case 'charge.dispute.created':
      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute
        await this.orders.recordDispute({
          eventId: event.id,
          paymentIntentId: stripeId(dispute.payment_intent),
          disputeId: dispute.id,
          amountCents: dispute.amount,
          currency: dispute.currency.toUpperCase(),
          reason: dispute.reason ?? null,
          status: dispute.status,
          closed: event.type === 'charge.dispute.closed',
          occurredAt: new Date(event.created * 1000),
        })
        break
      }
      case 'customer.subscription.deleted': {
        // Scenario 4: Retries exhausted / plan canceled
        const sub = event.data.object as Stripe.Subscription
        this.logger.log(`Handling customer.subscription.deleted for Stripe sub: ${sub.id}`)
        await this.prisma.subscription.updateMany({
          where: { stripeId: sub.id },
          data: { status: 'canceled', cancelAtPeriodEnd: false },
        })

        const dbSub = await this.prisma.subscription.findFirst({
          where: { stripeId: sub.id },
        })
        if (dbSub) {
          // Pause commercial products and breeding profiles without deleting data
          await this.prisma.product.updateMany({
            where: { sellerId: dbSub.userId, status: 'active', isDeleted: false },
            data: { status: 'inactive', hiddenAt: new Date() },
          })
          await this.prisma.breedingProfile.updateMany({
            where: { ownerId: dbSub.userId, availableNow: true, isDeleted: false },
            data: { status: 'paused', availableNow: false },
          })

          // In-app notification
          await this.prisma.notification.create({
            data: {
              userId: dbSub.userId,
              type: 'billing_subscription_canceled',
              title: 'Commercial Selling Paused',
              body: 'Your subscription has ended and commercial listings have been paused. Your data is safely stored and will be restored immediately when you renew.',
            },
          }).catch((err) => {
            this.logger.warn(`Could not create cancellation in-app notification: ${(err as Error).message}`)
          })
        }
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id?: string } | undefined)?.id
        if (stripeSubId) {
          const sub = await this.prisma.subscription.findFirst({
            where: { stripeId: stripeSubId },
          })
          if (sub) {
            // Restore active status
            await this.prisma.subscription.update({
              where: { id: sub.id },
              data: {
                status: 'active',
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            })

            // Unhide any listings that were paused during unpaid/canceled periods
            await this.prisma.product.updateMany({
              where: { sellerId: sub.userId, status: 'inactive', hiddenAt: { not: null }, isDeleted: false },
              data: { status: 'active', hiddenAt: null },
            })
            await this.prisma.breedingProfile.updateMany({
              where: { ownerId: sub.userId, status: 'paused', isDeleted: false },
              data: { status: 'available', availableNow: true },
            })

            const planKey = sub.entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${sub.entitlement} Plan`
            const amountCents = (invoice.amount_paid as number) || (planConfig ? Math.round(planConfig.monthlyPriceUsd * 100) : 0)
            const amountFormatted = `$${(amountCents / 100).toFixed(2)}/mo`

            // Create in-app notification
            await this.prisma.notification.create({
              data: {
                userId: sub.userId,
                type: 'billing_payment_succeeded',
                title: 'Subscription Payment Confirmed',
                body: `Your payment of ${amountFormatted} for ${planName} succeeded. All services and listings are fully active.`,
              },
            }).catch(() => {})

            await this.paymentEmail.sendPaymentConfirmation({
              userId: sub.userId,
              recipientEmail: (invoice.customer_email as string) || undefined,
              planName,
              amountFormatted,
              status: 'success',
              invoiceNumber: (invoice.id as string) || stripeSubId,
            }).catch((err) => {
              this.logger.warn(`Could not send invoice payment success email: ${(err as Error).message}`)
            })
          }
        }
        break
      }
      case 'invoice.payment_action_required': {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id?: string } | undefined)?.id
        if (stripeSubId) {
          const sub = await this.prisma.subscription.findFirst({
            where: { stripeId: stripeSubId },
          })
          if (sub) {
            const planKey = sub.entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${sub.entitlement} Plan`
            const amountCents = (invoice.amount_due as number) || (planConfig ? Math.round(planConfig.monthlyPriceUsd * 100) : 0)
            const amountFormatted = `$${(amountCents / 100).toFixed(2)}/mo`
            await this.paymentEmail.sendPaymentConfirmation({
              userId: sub.userId,
              recipientEmail: (invoice.customer_email as string) || undefined,
              planName,
              amountFormatted,
              status: 'pending',
              invoiceNumber: (invoice.id as string) || stripeSubId,
            }).catch((err) => {
              this.logger.warn(`Could not send invoice action required email: ${(err as Error).message}`)
            })
          }
        }
        break
      }
      case 'invoice.payment_failed': {
        // Scenario 4: Recurring payment failed (Smart Retries & 7-Day Grace Period)
        const invoice = event.data.object as unknown as Record<string, unknown>
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id?: string } | undefined)?.id
        if (stripeSubId) {
          this.logger.warn(`Invoice payment failed for Stripe sub ${stripeSubId}, marking past_due with 7-day grace period`)
          await this.prisma.subscription.updateMany({
            where: { stripeId: stripeSubId },
            data: { status: 'past_due' },
          })

          const sub = await this.prisma.subscription.findFirst({
            where: { stripeId: stripeSubId },
          })
          if (sub) {
            const planKey = sub.entitlement as keyof typeof COMMERCIAL_PLANS
            const planConfig = COMMERCIAL_PLANS[planKey]
            const planName = planConfig ? planConfig.name : `${sub.entitlement} Plan`
            const amountCents = (invoice.amount_due as number) || (planConfig ? Math.round(planConfig.monthlyPriceUsd * 100) : 0)
            const amountFormatted = `$${(amountCents / 100).toFixed(2)}/mo`

            // Create in-app notification immediately
            await this.prisma.notification.create({
              data: {
                userId: sub.userId,
                type: 'billing_payment_failed',
                title: 'Payment Pending: 7-Day Grace Period Active',
                body: `Your recurring payment for ${planName} was unsuccessful. Your commercial services remain active during your 7-day grace period while retries are in progress. Please update your payment method to avoid service interruption.`,
                data: {
                  planName,
                  amountFormatted,
                  invoiceNumber: (invoice.id as string) || stripeSubId,
                },
              },
            }).catch((err) => {
              this.logger.warn(`Could not create payment failed notification: ${(err as Error).message}`)
            })

            // Send transactional email
            await this.paymentEmail.sendPaymentConfirmation({
              userId: sub.userId,
              recipientEmail: (invoice.customer_email as string) || undefined,
              planName,
              amountFormatted,
              status: 'failed',
              invoiceNumber: (invoice.id as string) || stripeSubId,
              failureReason: 'Recurring invoice payment could not be processed by your card issuer. Smart retries are scheduled.',
            }).catch((err) => {
              this.logger.warn(`Could not send invoice payment failure email: ${(err as Error).message}`)
            })
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        // Scenario 3: Plan Downgrade & Quota Orphan Exploitation
        const sub = event.data.object as Stripe.Subscription
        const dbSub = await this.prisma.subscription.findFirst({
          where: { stripeId: sub.id },
        })
        if (dbSub) {
          // Sync status
          const newStatus = (sub.status === 'active' || sub.status === 'trialing') ? 'active' : sub.status === 'canceled' ? 'canceled' : 'past_due'
          const rawPeriodEnd = (sub as unknown as Record<string, unknown>).current_period_end
          const periodEndDate = typeof rawPeriodEnd === 'number' && !isNaN(rawPeriodEnd) ? new Date(rawPeriodEnd * 1000) : undefined

          await this.prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: newStatus as import('@prisma/client').SubscriptionStatus,
              cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
              ...(periodEndDate ? { currentPeriodEnd: periodEndDate } : {}),
            },
          })

          if (newStatus === 'active') {
            await this.prisma.product.updateMany({
              where: { sellerId: dbSub.userId, status: 'inactive', hiddenAt: { not: null }, isDeleted: false },
              data: { status: 'active', hiddenAt: null },
            })
            await this.prisma.breedingProfile.updateMany({
              where: { ownerId: dbSub.userId, status: 'paused', isDeleted: false },
              data: { status: 'available', availableNow: true },
            })
          } else if (newStatus === 'canceled') {
            await this.prisma.product.updateMany({
              where: { sellerId: dbSub.userId, status: 'active', isDeleted: false },
              data: { status: 'inactive', hiddenAt: new Date() },
            })
            await this.prisma.breedingProfile.updateMany({
              where: { ownerId: dbSub.userId, availableNow: true, isDeleted: false },
              data: { status: 'paused', availableNow: false },
            })
          }

          // Check if quota reduction or downgrade happened
          const prof = await this.prisma.professionalProfile.findUnique({
            where: { userId: dbSub.userId },
            select: { serviceAreas: true },
          })

          const activeServices = prof?.serviceAreas || []
          let allowedCount = 1
          if (dbSub.entitlement === 'premium' || dbSub.entitlement === 'care_professional') {
            allowedCount = 4
          } else if (dbSub.entitlement === 'professional' || dbSub.entitlement === 'breeder_professional') {
            allowedCount = 2
          }

          if (activeServices.length > allowedCount) {
            // User has more active services than allowed under new tier
            // Keep the first allowedCount services and pause the orphan ones
            const keepServices = activeServices.slice(0, allowedCount)
            const droppedServices = activeServices.slice(allowedCount)

            await this.prisma.professionalProfile.update({
              where: { userId: dbSub.userId },
              data: { serviceAreas: keepServices },
            })

            if (droppedServices.includes('seller')) {
              await this.prisma.product.updateMany({
                where: { sellerId: dbSub.userId, status: 'active', isDeleted: false },
                data: { status: 'inactive' },
              })
            }
            if (droppedServices.includes('breeder')) {
              await this.prisma.breedingProfile.updateMany({
                where: { ownerId: dbSub.userId, availableNow: true, isDeleted: false },
                data: { availableNow: false },
              })
            }
            this.logger.log(`Auto-adjusted services for user ${dbSub.userId} after subscription update. Retained: ${keepServices.join(', ')}. Suspended: ${droppedServices.join(', ')}`)
          }
        }
        break
      }
      default:
        break
    }

    return { received: true }
  }
}
