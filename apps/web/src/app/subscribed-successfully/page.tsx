'use client'

import React, { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, LayoutDashboard, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mutate } from '@/lib/api'

function SubscribedContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'seller_professional'
  const sessionId = searchParams.get('session_id') || undefined

  useEffect(() => {
    // Confirm and activate subscription directly upon checkout return
    mutate('/commercial/confirm-session', {
      method: 'POST',
      body: JSON.stringify({ planId: plan, sessionId }),
    }).catch((err) => {
      console.warn('Subscription sync check:', err)
    })
  }, [plan, sessionId])

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

  return (
    <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50/50 dark:ring-emerald-950/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        Subscribed Successfully!
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
        Welcome to your{' '}
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {serviceName}
        </span>
        . Your subscription is active! Next, proceed to your dashboard to choose and activate your services.
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
