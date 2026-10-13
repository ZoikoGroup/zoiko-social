'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mutate, request } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import {
  CheckCircle,
  Calendar,
  Sparkles,
  Loader2,
  Layers,
  Sliders,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  ArrowUpRight,
  Lock,
  X,
} from 'lucide-react'
import { ServiceSelectionModal } from '@/components/commercial/ServiceSelectionModal'

interface UserSubscription {
  id: string
  entitlement: 'starter' | 'professional' | 'premium' | 'seller_professional' | 'breeder_professional' | 'care_professional' | string
  status: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export function BillingSettings() {
  const router = useRouter()
  const { profile } = useAuth()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [activeServices, setActiveServices] = useState<string[]>([])
  const [activeTier, setActiveTier] = useState<string>('starter')
  const [maxServicesAllowed, setMaxServicesAllowed] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null)
  const [upgradeTargetPlan, setUpgradeTargetPlan] = useState<{
    id: string
    name: string
    price: string
    badge: string
    features: string[]
    popular: boolean
  } | null>(null)

  const [canceledNotice] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('canceled') === 'true'
    }
    return false
  })

  // Verification status check
  const isVerified =
    profile?.identityStatus === 'approved' ||
    profile?.organizationStatus === 'approved' ||
    profile?.professionalProfile?.isVerified === true

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const [subsRes, servicesRes] = await Promise.allSettled([
          request<UserSubscription[] | { data: UserSubscription[] | { data: UserSubscription[] } }>('/commercial/subscriptions'),
          request<{ data: { tier: string; maxServicesAllowed: number; activeServices: string[] } }>('/commercial/active-services'),
        ])

        if (isMounted) {
          if (subsRes.status === 'fulfilled') {
            const res = subsRes.value
            if (Array.isArray(res)) {
              setSubscriptions(res)
            } else if (Array.isArray(res?.data)) {
              setSubscriptions(res.data as UserSubscription[])
            } else if (Array.isArray((res?.data as { data?: UserSubscription[] })?.data)) {
              setSubscriptions((res.data as { data: UserSubscription[] }).data)
            }
          }

          if (servicesRes.status === 'fulfilled' && servicesRes.value?.data) {
            setActiveServices(servicesRes.value.data.activeServices || [])
            setActiveTier(servicesRes.value.data.tier || 'starter')
            setMaxServicesAllowed(servicesRes.value.data.maxServicesAllowed || 1)
          }
        }
      } catch (err) {
        console.error('Failed to load billing data', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleStripeCheckout = async (plan: string) => {
    if (!isVerified) {
      alert('You must complete identity verification before purchasing a commercial plan.')
      router.push('/verify')
      return
    }

    try {
      setSubscribingPlan(plan)
      const origin = typeof window !== 'undefined' ? window.location.origin : undefined
      const { url } = await mutate<{ url: string }>('/commercial/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          planId: plan,
          origin,
        }),
      })
      window.location.assign(url)
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string }
      if (err?.message?.includes('verification') || err?.code === 'VERIFICATION_REQUIRED') {
        alert('You must complete identity verification before purchasing a commercial plan.')
        router.push('/verify')
      } else {
        alert(err?.message || 'Failed to initiate checkout. Please try again later.')
      }
      console.error(error)
      setSubscribingPlan(null)
    }
  }

  // Find the single currently active subscription (only 1 plan active at any time)
  const activeSubscription = subscriptions.find((s) => s.status === 'active' || s.status === 'trialing')
  const activePlanId = activeSubscription
    ? activeSubscription.entitlement === 'seller_professional'
      ? 'starter'
      : activeSubscription.entitlement === 'breeder_professional'
        ? 'professional'
        : activeSubscription.entitlement === 'care_professional'
          ? 'premium'
          : activeSubscription.entitlement
    : null

  const formatDate = (isoString?: string) => {
    if (!isoString) return null
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$19.99',
      badge: 'Single Service',
      features: [
        'Register & manage 1 service',
        'Choose Seller, Breeder, Vet Clinic, or Pet Care',
        'Standard limits: 100 products / 5 breeding profiles / 50 services',
        'Verified badge for your active service',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$29.99',
      badge: 'Up to 2 Services',
      features: [
        'Register & manage up to 2 services',
        'Combine any 2 services (e.g. Vet Clinic + Pet Care)',
        'Full service limits across both active services',
        'Team member & clinic booking access',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49.99',
      badge: 'All 4 Services',
      features: [
        'Access to all 4 commercial services',
        'Full marketplace, breeding, vet clinic & care management',
        'Priority placement in search & directories',
        'Premium support & multi-service dashboard',
      ],
      popular: false,
    },
  ]

  const currentActivePlan = plans.find((p) => p.id === activePlanId) || null

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (!isVerified) {
      alert('You must complete identity verification before subscribing to any plan.')
      router.push('/verify')
      return
    }

    if (activePlanId) {
      if (plan.id === activePlanId) {
        return // Already on this plan
      }
      // Forceful upgrade / shift: prompt user with confirmation
      setUpgradeTargetPlan(plan)
      return
    }

    // No active subscription: direct subscribe
    handleStripeCheckout(plan.id)
  }

  const serviceNameMap: Record<string, string> = {
    seller: 'Pet Products Seller',
    breeder: 'Breeder & Stud Service',
    vet: 'Veterinary Clinic & Hospital',
    care: 'Pet Care & Boarding Provider',
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-on-surface">Professional Plans & Services</h3>
        <p className="mt-2 text-sm text-outline">
          Choose the right tools to grow your pet business. Each plan unlocks unique professional tools and service limitations for your account.
        </p>
      </div>

      {/* Identity Verification Warning Banner (before verification user cannot purchase) */}
      {!isVerified && !loading && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-on-surface text-sm">Identity Verification Required</h4>
              <p className="text-xs text-outline mt-0.5">
                You must complete identity verification before you can purchase or subscribe to any commercial plan.
              </p>
            </div>
          </div>
          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-colors shadow-sm"
          >
            Get Verified Now
          </Link>
        </div>
      )}

      {canceledNotice && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Checkout was canceled. If you need any assistance or want to choose another plan, you can select one below.</span>
        </div>
      )}

      {/* Active Services Allocation Management Card */}
      {activeSubscription && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-container to-surface-container border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-white">
                <Layers className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-on-surface text-base">Your Active Services</h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                {activeTier} Plan
              </span>
            </div>
            <p className="text-xs text-outline">
              Using <span className="font-semibold text-on-surface">{activeServices.length}</span> of <span className="font-semibold text-on-surface">{maxServicesAllowed}</span> allowed service allocations for this subscription.
            </p>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {activeServices.length === 0 ? (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  No services activated yet. Click manage to choose your services.
                </span>
              ) : (
                activeServices.map((srv) => (
                  <span
                    key={srv}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {serviceNameMap[srv] || srv}
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap self-start sm:self-center"
          >
            <Sliders className="w-3.5 h-3.5" />
            Manage Active Services
          </button>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentActive = activePlanId === plan.id
          const lastBilledDate = isCurrentActive ? formatDate(activeSubscription?.createdAt) : null
          const nextBillingDate = isCurrentActive ? formatDate(activeSubscription?.currentPeriodEnd) : null

          return (
            <div
              key={plan.id}
              className={`bg-surface-container rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col relative ${
                isCurrentActive
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : plan.popular
                    ? 'border-primary shadow-sm'
                    : 'border-outline-variant/30 shadow-sm'
              }`}
            >
              {isCurrentActive ? (
                <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    CURRENT ACTIVE PLAN
                  </span>
                  <span className="text-[11px] font-medium opacity-90">Active</span>
                </div>
              ) : plan.popular ? (
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              ) : null}

              <div className="p-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-on-surface">{plan.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {plan.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-on-surface">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-outline">/mo</span>
                </div>

                {isCurrentActive && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Plan Status: Subscribed (Active)
                    </div>
                    {lastBilledDate && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                        <Calendar className="w-3 h-3" />
                        Last billing date: <span className="font-medium">{lastBilledDate}</span>
                      </div>
                    )}
                    {nextBillingDate && (
                      <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 pl-4.5">
                        Renews on: <span className="font-medium">{nextBillingDate}</span>
                      </div>
                    )}
                  </div>
                )}

                <ul className="mt-6 space-y-3 text-sm text-on-surface">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border-t border-outline-variant/20 bg-surface-container-high/30">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-semibold text-sm cursor-default flex items-center justify-center gap-2 border border-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Current Active Plan
                  </button>
                ) : !isVerified ? (
                  <button
                    onClick={() => router.push('/verify')}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold text-sm border border-amber-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-500" />
                    Verify Identity to Subscribe
                  </button>
                ) : activePlanId ? (
                  <button
                    onClick={() => handlePlanClick(plan)}
                    disabled={subscribingPlan === plan.id || loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm border border-primary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                    Upgrade to {plan.name}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanClick(plan)}
                    disabled={subscribingPlan === plan.id || loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {subscribingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Forceful Upgrade Confirmation Modal */}
      {upgradeTargetPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface-container-high border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setUpgradeTargetPlan(null)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-on-surface">Switch to {upgradeTargetPlan.name} Plan?</h3>
                <p className="text-xs text-outline">Plan change & upgrade confirmation</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2.5 text-xs text-on-surface">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-outline">Current Plan:</span>
                <span className="font-semibold">{currentActivePlan?.name || 'Active Plan'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <span className="text-outline">New Plan:</span>
                <span className="font-bold text-primary">{upgradeTargetPlan.name} ({upgradeTargetPlan.price}/mo)</span>
              </div>

              <div className="pt-1 text-[11px] leading-relaxed space-y-1">
                <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Upgrade Terms:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-outline">
                  <li>Your old plan will be <strong>cancelled immediately</strong> and replaced by the new plan.</li>
                  <li><strong>No refund</strong> will be issued for the remaining time of your current plan.</li>
                  <li>Your business services and listings will continue seamlessly under the new plan limits.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUpgradeTargetPlan(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/40 text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                disabled={subscribingPlan === upgradeTargetPlan.id}
                onClick={() => {
                  const planId = upgradeTargetPlan.id
                  setUpgradeTargetPlan(null)
                  handleStripeCheckout(planId)
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {subscribingPlan === upgradeTargetPlan.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Confirm & Upgrade
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Selection / Allocation Modal */}
      <ServiceSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTier={activeTier}
        maxServicesAllowed={maxServicesAllowed}
        initialSelectedServices={activeServices}
        onSuccess={(updated) => {
          setActiveServices(updated)
        }}
      />
    </div>
  )
}
