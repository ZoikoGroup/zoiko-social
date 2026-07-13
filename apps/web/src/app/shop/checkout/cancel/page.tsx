'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <XCircle className="w-12 h-12 text-outline mx-auto mb-3" />
          <h1 className="text-title-lg font-bold mb-2">Checkout cancelled</h1>
          <p className="text-outline text-body-md mb-5">
            No payment was made. You can try again whenever you&apos;re ready.
          </p>
          <Link href="/shop" className="px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90">
            Back to Marketplace
          </Link>
        </div>
      </main>
    </>
  )
}
