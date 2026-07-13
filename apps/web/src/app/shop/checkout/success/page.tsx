'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { CheckCircle2 } from 'lucide-react'

export default function CheckoutSuccessPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h1 className="text-title-lg font-bold mb-2">Payment successful</h1>
          <p className="text-outline text-body-md mb-5">
            Your order is confirmed. The seller has been notified — you can track its status in your orders.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/shop/orders" className="px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90">
              View my orders
            </Link>
            <Link href="/shop" className="px-4 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
