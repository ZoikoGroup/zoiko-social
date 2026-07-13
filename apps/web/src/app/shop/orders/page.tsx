'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { ChevronLeft, Package, Loader2 } from 'lucide-react'
import { orderApi, type Order } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-secondary/10 text-secondary',
  paid: 'bg-emerald-500/10 text-emerald-600',
  fulfilled: 'bg-primary/10 text-primary',
  cancelled: 'bg-surface-container text-outline',
  refunded: 'bg-red-500/10 text-red-600',
}

function money(amountCents: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  const n = (amountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return sym ? `${sym}${n}` : `${n} ${currency}`
}

export default function MyOrdersPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    orderApi.mine().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [isAuthenticated])

  if (authLoading || !isAuthenticated) return <div className="min-h-screen bg-background" />

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <Link href="/shop" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary mb-4">
            <ChevronLeft className="w-4 h-4" />Marketplace
          </Link>
          <h1 className="text-title-lg font-bold mb-4">My Orders</h1>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-outline" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-outline mx-auto mb-2" />
              <p className="text-outline">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="border border-outline-variant rounded-xl p-4 bg-surface flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-label-md">{money(o.amountCents, o.currency)} · Qty {o.quantity}</p>
                    <p className="text-[11px] text-outline">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[o.status] ?? STATUS_STYLE.cancelled}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <MobileTabs currentPage="shop" />
    </>
  )
}
