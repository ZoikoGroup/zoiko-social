'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, LayoutDashboard, Settings, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mutate } from '@/lib/api'

interface ConfirmResponse {
  data?: {
    status?: 'success' | 'pending' | 'failed'
    success?: boolean
    message?: string
  }
}

function SubscribedContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'seller_professional'
  const sessionId = searchParams.get('session_id') || undefined
  const rawKeepServices = searchParams.get('keepServices')
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading')

  useEffect(() => {
    let isMounted = true
    let keepServices: string[] | undefined
    if (rawKeepServices) {
      try {
        const parsed = JSON.parse(rawKeepServices)
        if (Array.isArray(parsed)) keepServices = parsed
      } catch {}
    }

    // Confirm and activate subscription directly upon checkout return
    mutate<ConfirmResponse>('/commercial/confirm-session', {
      method: 'POST',
      body: JSON.stringify({ planId: plan, sessionId, keepServices }),
    })
      .then((res) => {
        if (!isMounted) return
        const resultStatus = res?.data?.status
        if (resultStatus === 'pending') {
          setStatus('pending')
        } else if (resultStatus === 'failed') {
          setStatus('failed')
        } else {
          setStatus('success')
        }
      })
      .catch((err) => {
        console.warn('Subscription sync check:', err)
        if (isMounted) {
          // If error response indicates pending or failed
          setStatus('success') // default fallback
        }
      })

    return () => {
      isMounted = false
    }
  }, [plan, sessionId, rawKeepServices])

  let serviceName = 'Starter Plan'
  if (plan === 'starter') serviceName = 'Starter Plan ($19.99/mo)'
  else if (plan === 'professional') serviceName = 'Professional Plan ($29.99/mo)'
  else if (plan === 'premium') serviceName = 'Premium Plan ($49.99/mo)'
  else if (plan === 'seller_professional') serviceName = 'Seller Professional'
  else if (plan === 'breeder_professional') serviceName = 'Breeder Professional'
  else if (plan === 'care_professional') serviceName = 'Care Professional'
  else if (plan) {
    serviceName = plan.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  if (status === 'loading') {
    return (
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center border border-gray-100 dark:border-zinc-800 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Confirming Payment...
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we verify your transaction and send your confirmation email.
        </p>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center border border-amber-100 dark:border-amber-950/30 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-400 ring-8 ring-amber-50/50 dark:ring-amber-950/20">
          <Clock className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Payment Pending
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
          Your payment for{' '}
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {serviceName}
          </span>{' '}
          is currently being processed by your bank.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          A confirmation email has been sent to your inbox. Your subscription will activate automatically as soon as payment clears.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/settings?section=billing" className="w-full">
            <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl shadow-sm">
              <Settings className="w-5 h-5" />
              Check Billing Status
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 rounded-xl font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center border border-red-100 dark:border-red-950/30 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400 ring-8 ring-red-50/50 dark:ring-red-950/20">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Payment Unsuccessful
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
          We could not process payment for{' '}
          <span className="font-semibold text-red-600 dark:text-red-400">
            {serviceName}
          </span>
          .
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          A notification has been sent to your email. Please verify your payment details or try another payment method.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/settings?section=billing" className="w-full">
            <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl shadow-sm">
              <Settings className="w-5 h-5" />
              Update Payment Method
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 rounded-xl font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50/50 dark:ring-emerald-950/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        Subscribed Successfully!
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
        Welcome to your{' '}
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {serviceName}
        </span>
        . Your subscription is active! Next, proceed to your dashboard to choose and activate your services.
      </p>

      <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl py-2 px-3 mb-8">
        A payment confirmation and receipt has been sent to your email.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/dashboard" className="w-full">
          <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
            Go to My Dashboard
          </Button>
        </Link>

        <Link href="/settings?section=billing" className="w-full">
          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center gap-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 py-3 rounded-xl font-medium"
          >
            <Settings className="w-5 h-5" />
            Manage Billing
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function SubscribedSuccessfullyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SubscribedContent />
      </Suspense>
    </div>
  )
}
