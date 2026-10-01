import React from 'react'
import { mutate } from '@/lib/api'

export function BillingSettings() {
  const handleStripeCheckout = async (plan: string) => {
    try {
      const { url } = await mutate<{ url: string }>('/commercial/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: plan }),
      })
      window.location.href = url
    } catch (error) {
      alert('Failed to initiate checkout. Please try again later.')
      console.error(error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-on-surface">Professional Plans</h3>
        <p className="mt-2 text-sm text-outline">
          Choose the right tools to grow your pet business, whether you are a seller, breeder, or care provider.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Seller Professional */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <h3 className="text-lg font-bold text-on-surface">Seller Professional</h3>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold text-on-surface">
              $24.99<span className="ml-1 text-sm font-medium text-outline">/mo</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-sm text-on-surface">
              <li>• Up to 100 active products</li>
              <li>• Verified Seller badge</li>
              <li>• External purchase links</li>
            </ul>
          </div>
          <div className="p-4 border-t border-outline-variant/20">
            <button
              onClick={() => handleStripeCheckout('seller_professional')}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Breeder Professional */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <h3 className="text-lg font-bold text-on-surface">Breeder Professional</h3>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold text-on-surface">
              $29.99<span className="ml-1 text-sm font-medium text-outline">/mo</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-sm text-on-surface">
              <li>• Up to 5 active profiles</li>
              <li>• Health/DNA evidence</li>
              <li>• Litter tracking & reviews</li>
            </ul>
          </div>
          <div className="p-4 border-t border-outline-variant/20">
            <button
              onClick={() => handleStripeCheckout('breeder_professional')}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Care Professional */}
        <div className="bg-surface-container rounded-2xl border border-primary shadow-sm overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <div className="p-6 flex-1">
            <h3 className="text-lg font-bold text-on-surface">Care Professional</h3>
            <div className="mt-4 flex items-baseline text-3xl font-extrabold text-on-surface">
              $39.99<span className="ml-1 text-sm font-medium text-outline">/mo</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-sm text-on-surface">
              <li>• 1 location, 10 team members</li>
              <li>• Up to 50 active services</li>
              <li>• In-app booking & reviews</li>
            </ul>
          </div>
          <div className="p-4 border-t border-outline-variant/20">
            <button
              onClick={() => handleStripeCheckout('care_professional')}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
