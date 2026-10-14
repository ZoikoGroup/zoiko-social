import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
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
  CreditCard,
  RotateCcw,
  Clock,
} from 'lucide-react'
import { ServiceSelectionModal } from '@/components/commercial/ServiceSelectionModal'
import { DowngradeServiceModal, type DowngradeTargetPlan } from '@/components/commercial/DowngradeServiceModal'

interface UserSubscription {
  id: string
  entitlement: 'starter' | 'professional' | 'premium' | 'seller_professional' | 'breeder_professional' | 'care_professional' | string
  status: string
  cancelAtPeriodEnd?: boolean
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

const emptySubscribe = () => () => {}

export function BillingSettings() {
  const router = useRouter()
  const { profile } = useAuth()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [activeServices, setActiveServices] = useState<string[]>(
    () => profile?.professionalProfile?.serviceAreas || []
  )
  const [activeTier, setActiveTier] = useState<string>(() => {
    const areas = profile?.professionalProfile?.serviceAreas || []
    return areas.length > 2 ? 'premium' : areas.length > 1 ? 'professional' : 'starter'
  })
  const [maxServicesAllowed, setMaxServicesAllowed] = useState<number>(() => {
    const areas = profile?.professionalProfile?.serviceAreas || []
    return areas.length > 2 ? 4 : areas.length > 1 ? 2 : 1
  })
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
  const [downgradeTargetPlan, setDowngradeTargetPlan] = useState<DowngradeTargetPlan | null>(null)
  const [cancelingAutopay, setCancelingAutopay] = useState(false)
  const [resumingAutopay, setResumingAutopay] = useState(false)
  const [showCancelAutopayModal, setShowCancelAutopayModal] = useState(false)
  const [autopayFeedback, setAutopayFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [openingPortal, setOpeningPortal] = useState(false)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  // Lock body scroll and listen for Escape key when modals are open
  useEffect(() => {
    if (showCancelAutopayModal || upgradeTargetPlan || downgradeTargetPlan) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowCancelAutopayModal(false)
          setUpgradeTargetPlan(null)
          setDowngradeTargetPlan(null)
        }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = prevOverflow
        window.removeEventListener('keydown', onKeyDown)
      }
    }
    return undefined
  }, [showCancelAutopayModal, upgradeTargetPlan, downgradeTargetPlan])

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
          request<{
            tier?: string
            maxServicesAllowed?: number
            activeServices?: string[]
            data?: { tier?: string; maxServicesAllowed?: number; activeServices?: string[] }
          }>('/commercial/active-services'),
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

          if (servicesRes.status === 'fulfilled' && servicesRes.value) {
            const rawVal = servicesRes.value
            const sData = (rawVal?.data && (rawVal.data.activeServices !== undefined || rawVal.data.tier !== undefined))
              ? rawVal.data
              : rawVal
            if (sData) {
              const maxAllowed = sData.maxServicesAllowed || 1
              const rawLoadedServices: string[] = Array.isArray(sData.activeServices) && sData.activeServices.length > 0
                ? sData.activeServices
                : (profile?.professionalProfile?.serviceAreas || [])
              const loadedServices = rawLoadedServices.slice(0, maxAllowed)
              setActiveServices(loadedServices)
              if (sData.tier) setActiveTier(sData.tier)
              if (sData.maxServicesAllowed) setMaxServicesAllowed(sData.maxServicesAllowed)
            }
          } else if (profile?.professionalProfile?.serviceAreas && profile.professionalProfile.serviceAreas.length > 0) {
            setActiveServices(profile.professionalProfile.serviceAreas.slice(0, maxServicesAllowed || 1))
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
  }, [profile?.professionalProfile?.serviceAreas, maxServicesAllowed])

  const handleStripeCheckout = async (plan: string, keepServices?: string[]) => {
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
          keepServices,
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

  const handleCancelAutopay = async () => {
    try {
      setCancelingAutopay(true)
      setAutopayFeedback(null)
      const res = await mutate<{ success: boolean; message: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: string }>(
        '/commercial/cancel-autopay',
        { method: 'POST' }
      )
      if (res?.success) {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === activeSubscription?.id ? { ...sub, cancelAtPeriodEnd: true } : sub
          )
        )
        setShowCancelAutopayModal(false)
        setAutopayFeedback({
          type: 'success',
          message: 'Auto-renewal has been cancelled. Your plan and services stay 100% active until your 30-day period completes. No future charges will be made.',
        })
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      setAutopayFeedback({
        type: 'error',
        message: err?.message || 'Failed to cancel auto-renewal. Please try again.',
      })
    } finally {
      setCancelingAutopay(false)
    }
  }

  const handleResumeAutopay = async () => {
    try {
      setResumingAutopay(true)
      setAutopayFeedback(null)
      const res = await mutate<{ success: boolean; message: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: string }>(
        '/commercial/resume-autopay',
        { method: 'POST' }
      )
      if (res?.success) {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === activeSubscription?.id ? { ...sub, cancelAtPeriodEnd: false } : sub
          )
        )
        setAutopayFeedback({
          type: 'success',
          message: 'Auto-renewal has been resumed. Your subscription will renew automatically at the end of the billing period.',
        })
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      setAutopayFeedback({
        type: 'error',
        message: err?.message || 'Failed to resume auto-renewal. Please try again.',
      })
    } finally {
      setResumingAutopay(false)
    }
  }

  const handleOpenBillingPortal = async () => {
    try {
      setOpeningPortal(true)
      const res = await mutate<{ url?: string }>('/commercial/create-portal-session', {
        method: 'POST',
        body: JSON.stringify({
          returnUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      if (res?.url) {
        window.location.assign(res.url)
      } else {
        alert('Unable to load billing portal. Please contact support.')
      }
    } catch (err: unknown) {
      console.error('Failed to open billing portal', err)
      alert('Failed to launch billing portal. Please try again.')
    } finally {
      setOpeningPortal(false)
    }
  }

  // Find the single currently active subscription (or in grace period past_due)
  const activeSubscription = subscriptions.find((s) => s.status === 'active' || s.status === 'trialing' || s.status === 'past_due')
  const isPastDue = activeSubscription?.status === 'past_due'
  const isDisputed = subscriptions.some((s) => s.status === 'paused')
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

  const PLAN_SERVICE_LIMITS: Record<string, number> = {
    starter: 1,
    seller_professional: 1,
    professional: 2,
    breeder_professional: 2,
    premium: 4,
    care_professional: 4,
  }

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

      const targetLimit = PLAN_SERVICE_LIMITS[plan.id] || 1
      const currentLimit = PLAN_SERVICE_LIMITS[activePlanId] || 1

      // If downgrading and user currently holds more active services than target plan allows:
      if (targetLimit < currentLimit && activeServices.length > targetLimit) {
        setDowngradeTargetPlan({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          maxServicesAllowed: targetLimit,
        })
        return
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

      {/* Services Exceeding Plan Allowance Warning Banner (e.g. after external downgrade) */}
      {activeServices.length > maxServicesAllowed && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-on-surface text-sm">
                Your new plan includes {maxServicesAllowed} service{maxServicesAllowed > 1 ? 's' : ''}. Please select which service you wish to keep active.
              </h4>
              <p className="text-xs text-outline mt-0.5 leading-relaxed">
                You have {activeServices.length} active services, but your current plan only permits {maxServicesAllowed}. Choose which {maxServicesAllowed === 1 ? 'service' : `${maxServicesAllowed} services`} should remain active.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-colors shadow-sm"
          >
            Select Active Service
          </button>
        </div>
      )}

      {/* Disputed / Suspended Subscription Alert Banner */}
      {isDisputed && (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-on-surface text-sm">
                Commercial Subscription Suspended: Payment Disputed
              </h4>
              <p className="text-xs text-outline mt-0.5 leading-relaxed">
                Your commercial subscription and shop listings have been suspended due to an open bank chargeback dispute. Public sales and business features are paused until the dispute is resolved.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@zoikosocial.com"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-colors shadow-sm"
          >
            Contact Support
          </a>
        </div>
      )}

      {/* 7-Day Grace Period & Payment Failed Alert Banner */}
      {isPastDue && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-on-surface text-sm">Monthly payment failed. You have 7 days to update your card before services are paused.</h4>
              <p className="text-xs text-outline mt-0.5 leading-relaxed">
                Your latest recurring plan payment was unsuccessful. Your commercial services, listings, and verification remain <strong>100% active during your 7-day grace period</strong> while Stripe retries charging your card. Please update your payment method now to ensure uninterrupted service.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenBillingPortal}
            disabled={openingPortal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-colors shadow-sm disabled:opacity-60"
          >
            {openingPortal ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Opening...
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                Update Payment Method
              </>
            )}
          </button>
        </div>
      )}

      {/* Autopay Feedback Message */}
      {autopayFeedback && (
        <div
          className={`flex items-start justify-between gap-3 p-4 rounded-2xl border text-sm animate-in fade-in ${
            autopayFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-500/10 border-red-500/25 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {autopayFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span className="text-xs font-medium">{autopayFeedback.message}</span>
          </div>
          <button
            onClick={() => setAutopayFeedback(null)}
            className="text-outline hover:text-on-surface p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading Skeletons for Status & Services Cards */}
      {loading ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-pulse">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-container-high" />
                <div className="h-5 w-48 bg-surface-container-high rounded-md" />
                <div className="h-5 w-24 bg-surface-container-high rounded-full" />
              </div>
              <div className="h-3.5 w-72 bg-surface-container-high rounded" />
            </div>
            <div className="h-9 w-32 bg-surface-container-high rounded-xl self-start md:self-center" />
          </div>
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-container-high" />
                <div className="h-5 w-40 bg-surface-container-high rounded-md" />
                <div className="h-5 w-20 bg-surface-container-high rounded-full" />
              </div>
              <div className="h-3.5 w-60 bg-surface-container-high rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-36 bg-surface-container-high rounded-lg" />
              </div>
            </div>
            <div className="h-9 w-36 bg-surface-container-high rounded-xl self-start sm:self-center" />
          </div>
        </div>
      ) : (
        <>
          {/* Active Subscription & Autopay Status Card */}
          {activeSubscription && (
            <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600/15 text-emerald-600 dark:text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-on-surface text-base">
                    Billing & Membership Status
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                    {activeSubscription.entitlement.replace('_professional', '').replace('_', ' ')} Plan
                  </span>
                  {isPastDue ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Payment Pending (Grace Period Active)
                    </span>
                  ) : activeSubscription.cancelAtPeriodEnd ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Auto-Renewal OFF
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Auto-Renewal ON
                    </span>
                  )}
                </div>

                <div className="text-xs text-outline space-y-1">
                  {isPastDue ? (
                    <p className="text-amber-600 dark:text-amber-400 font-medium">
                      Your recurring payment failed and is currently in a <strong>7-day grace period</strong>. Smart retries are scheduled. Your business services and listings stay online so your business is not interrupted.
                    </p>
                  ) : activeSubscription.cancelAtPeriodEnd ? (
                    <p className="text-amber-600 dark:text-amber-400 font-medium">
                      Auto-renewal has been cancelled. Your membership and commercial tools stay <strong>fully active until {formatDate(activeSubscription.currentPeriodEnd)}</strong>. You will not be charged again.
                    </p>
                  ) : (
                    <p>
                      Your membership automatically renews on <strong className="text-on-surface">{formatDate(activeSubscription.currentPeriodEnd)}</strong>. Next billing cycle amount: {currentActivePlan?.price || '$49.99'}/mo.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                {isPastDue ? (
                  <button
                    type="button"
                    onClick={handleOpenBillingPortal}
                    disabled={openingPortal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {openingPortal ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        Update Payment Method
                      </>
                    )}
                  </button>
                ) : activeSubscription.cancelAtPeriodEnd ? (
                  <button
                    type="button"
                    onClick={handleResumeAutopay}
                    disabled={resumingAutopay}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {resumingAutopay ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        Resume Auto-Renewal
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCancelAutopayModal(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-xs font-semibold text-on-surface hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Autopay
                  </button>
                )}
              </div>
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
        </>
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
              ) : !isVerified ? (
                <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-700 dark:text-amber-400 border-b border-l border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-bl-lg flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" />
                  VERIFICATION REQUIRED
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
                  <div
                    className={`mt-4 p-3 rounded-xl border space-y-1.5 ${
                      isPastDue
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                        : activeSubscription?.cancelAtPeriodEnd
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {isPastDue ? 'Plan Status: Grace Period' : 'Plan Status: Active'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isPastDue
                            ? 'bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            : activeSubscription?.cancelAtPeriodEnd
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {isPastDue ? 'Payment Pending' : activeSubscription?.cancelAtPeriodEnd ? 'Autopay OFF' : 'Autopay ON'}
                      </span>
                    </div>
                    {lastBilledDate && (
                      <div className="flex items-center gap-1.5 text-[11px] opacity-90">
                        <Calendar className="w-3 h-3" />
                        Last billing date: <span className="font-medium">{lastBilledDate}</span>
                      </div>
                    )}
                    {isPastDue ? (
                      <div className="flex items-center gap-1.5 text-[11px] opacity-90">
                        <Clock className="w-3 h-3" />
                        <span>Smart retries in progress (7-day grace period)</span>
                      </div>
                    ) : nextBillingDate ? (
                      <div className="flex items-center gap-1.5 text-[11px] opacity-90">
                        <Clock className="w-3 h-3" />
                        {activeSubscription?.cancelAtPeriodEnd ? (
                          <span>
                            Expires on: <span className="font-medium">{nextBillingDate}</span> (No renewal)
                          </span>
                        ) : (
                          <span>
                            Renews on: <span className="font-medium">{nextBillingDate}</span>
                          </span>
                        )}
                      </div>
                    ) : null}
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
                {loading ? (
                  <div className="w-full h-10 rounded-lg bg-surface-container-high animate-pulse" />
                ) : isCurrentActive ? (
                  <div className="space-y-2">
                    {isPastDue ? (
                      <button
                        type="button"
                        onClick={handleOpenBillingPortal}
                        disabled={openingPortal}
                        className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-60"
                      >
                        {openingPortal ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Opening Portal...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            Update Payment Method
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-semibold text-xs cursor-default flex items-center justify-center gap-2 border border-emerald-500/30"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Current Active Plan
                      </button>
                    )}
                    {!isPastDue && (
                      activeSubscription?.cancelAtPeriodEnd ? (
                        <button
                          type="button"
                          onClick={handleResumeAutopay}
                          disabled={resumingAutopay}
                          className="w-full py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {resumingAutopay ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3 h-3" />
                          )}
                          Resume Auto-Renewal
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCancelAutopayModal(true)}
                          className="w-full py-1.5 px-3 rounded-lg hover:bg-amber-500/10 text-xs font-medium text-outline hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5"
                        >
                          Turn off auto-renewal
                        </button>
                      )
                    )}
                  </div>
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
      {mounted && typeof document !== 'undefined' && upgradeTargetPlan && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setUpgradeTargetPlan(null)}
        >
          <div
            className="bg-surface-container-high dark:bg-zinc-900 border border-outline-variant/30 dark:border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setUpgradeTargetPlan(null)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface dark:hover:text-white p-1.5 rounded-xl hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-on-surface">Switch to {upgradeTargetPlan.name} Plan?</h3>
                <p className="text-xs text-outline dark:text-zinc-400">Plan change & upgrade confirmation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container/70 dark:bg-zinc-800/60 border border-outline-variant/20 dark:border-white/5 space-y-2.5 text-xs text-on-surface">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 dark:border-zinc-700/50">
                <span className="text-outline dark:text-zinc-400">Current Plan:</span>
                <span className="font-semibold">{currentActivePlan?.name || 'Active Plan'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 dark:border-zinc-700/50">
                <span className="text-outline dark:text-zinc-400">New Plan:</span>
                <span className="font-bold text-primary">{upgradeTargetPlan.name} ({upgradeTargetPlan.price}/mo)</span>
              </div>

              <div className="pt-1 text-[11px] leading-relaxed space-y-1">
                <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Upgrade Terms:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-outline dark:text-zinc-400">
                  <li>Your old plan will be <strong>cancelled immediately</strong> and replaced by the new plan.</li>
                  <li><strong>No refund</strong> will be issued for the remaining time of your current plan.</li>
                  <li>Your business services and listings will continue seamlessly under the new plan limits.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setUpgradeTargetPlan(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/40 dark:border-zinc-700 text-on-surface font-semibold text-xs hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
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
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.99] text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
        </div>,
        document.body
      )}

      {/* Cancel Autopay Confirmation Modal */}
      {mounted && typeof document !== 'undefined' && showCancelAutopayModal && activeSubscription && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setShowCancelAutopayModal(false)}
        >
          <div
            className="bg-surface-container-high dark:bg-zinc-900 border border-outline-variant/30 dark:border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCancelAutopayModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface dark:hover:text-white p-1.5 rounded-xl hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-on-surface">Turn Off Auto-Renewal?</h3>
                <p className="text-xs text-outline dark:text-zinc-400">Cancel next month&apos;s automatic recurring payment</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container/70 dark:bg-zinc-800/60 border border-outline-variant/20 dark:border-white/5 space-y-3.5 text-xs text-on-surface">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface font-semibold text-xs">You Keep Your Plan & Benefits:</strong>
                  <p className="text-outline dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                    Because you have already paid for the current month, your <strong>{activeTier.toUpperCase()}</strong> plan, verified badge, and all business tools stay 100% active until <strong>{formatDate(activeSubscription.currentPeriodEnd)}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface font-semibold text-xs">No Future Charges:</strong>
                  <p className="text-outline dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                    When your 30-day period completes on <strong>{formatDate(activeSubscription.currentPeriodEnd)}</strong>, Stripe will NOT charge your card again and the plan simply expires.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface font-semibold text-xs">You Can Resume Anytime:</strong>
                  <p className="text-outline dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                    If you change your mind before {formatDate(activeSubscription.currentPeriodEnd)}, you can resume auto-renewal with a single click.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowCancelAutopayModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/40 dark:border-zinc-700 text-on-surface font-semibold text-xs hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
              >
                Keep Auto-Renewal ON
              </button>
              <button
                type="button"
                disabled={cancelingAutopay}
                onClick={handleCancelAutopay}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
              >
                {cancelingAutopay ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Turning off...
                  </>
                ) : (
                  'Turn Off Auto-Renewal'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
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

      {/* Downgrade Service Selection Modal */}
      <DowngradeServiceModal
        key={downgradeTargetPlan?.id || 'none'}
        isOpen={Boolean(downgradeTargetPlan)}
        onClose={() => setDowngradeTargetPlan(null)}
        targetPlan={downgradeTargetPlan}
        currentActiveServices={activeServices}
        loading={subscribingPlan === downgradeTargetPlan?.id}
        onConfirm={async (selected) => {
          const target = downgradeTargetPlan
          if (!target) return
          setDowngradeTargetPlan(null)
          await handleStripeCheckout(target.id, selected)
        }}
      />
    </div>
  )
}
