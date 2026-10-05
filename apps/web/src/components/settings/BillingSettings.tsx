'use client'

import React, { useEffect, useState } from 'react'
import { mutate, request } from '@/lib/api'
import { CheckCircle, Calendar, Sparkles, Loader2, Layers, Sliders } from 'lucide-react'
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
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [activeServices, setActiveServices] = useState<string[]>([])
  const [activeTier, setActiveTier] = useState<string>('starter')
  const [maxServicesAllowed, setMaxServicesAllowed] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null)

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
    try {
      setSubscribingPlan(plan)
      const { url } = await mutate<{ url: string }>('/commercial/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: plan }),
      })
      window.location.assign(url)
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string }
      if (err?.message?.includes('verification') || err?.code === 'VERIFICATION_REQUIRED') {
        alert('You must complete identity verification before purchasing a commercial plan.')
        window.location.assign('/verify')
      } else {
        alert(err?.message || 'Failed to initiate checkout. Please try again later.')
      }
      console.error(error)
      setSubscribingPlan(null)
    }
  }

  const getSubForPlan = (planKey: string) => {
    return subscriptions.find(
      (s) => {
        if (s.status !== 'active' && s.status !== 'trialing') return false
        if (s.entitlement === planKey) return true
        if (planKey === 'starter' && s.entitlement === 'seller_professional') return true
        if (planKey === 'professional' && s.entitlement === 'breeder_professional') return true
        if (planKey === 'premium' && s.entitlement === 'care_professional') return true
        return false
      },
    )
  }

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

      {/* Active Services Allocation Management Card */}
      {subscriptions.length > 0 && (
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const activeSub = getSubForPlan(plan.id)
          const isSubscribed = Boolean(activeSub)
          const lastBilledDate = formatDate(activeSub?.createdAt)
          const nextBillingDate = formatDate(activeSub?.currentPeriodEnd)

          return (
            <div
              key={plan.id}
              className={`bg-surface-container rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col relative ${
                isSubscribed
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : plan.popular
                    ? 'border-primary shadow-sm'
                    : 'border-outline-variant/30 shadow-sm'
              }`}
            >
              {isSubscribed ? (
                <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    SUBSCRIBED SERVICE
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

                {isSubscribed && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Plan Status: Subscribed
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
                {isSubscribed ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-semibold text-sm cursor-default flex items-center justify-center gap-2 border border-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Current Active Service
                  </button>
                ) : (
                  <button
                    onClick={() => handleStripeCheckout(plan.id)}
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
