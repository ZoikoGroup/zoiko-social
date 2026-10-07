'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ExternalLink } from 'lucide-react'
import { shopApi, type Product } from '@/lib/api'
import { Img } from '../Img'

const productCache = new Map<string, Product | 'missing'>()

export function ProductCardPreview({
  productId,
  productTitle,
  isMine,
}: {
  productId: string
  productTitle?: string
  isMine: boolean
}): React.JSX.Element {
  const cached = productCache.get(productId)
  const [product, setProduct] = useState<Product | null>(cached && cached !== 'missing' ? cached : null)
  const [loading, setLoading] = useState(cached === undefined)

  useEffect(() => {
    if (cached !== undefined) return
    let cancelled = false
    shopApi.get(productId)
      .then((res) => {
        productCache.set(productId, res)
        if (!cancelled) setProduct(res)
      })
      .catch(() => {
        productCache.set(productId, 'missing')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [productId, cached])

  const cardBorder = isMine ? 'border-white/20 bg-white/10 text-white' : 'border-outline-variant/30 bg-surface-container-low text-on-surface'
  const title = product?.title || productTitle || 'View Product Listing'
  const priceDisplay = product ? `$${(product.price / 100).toFixed(2)}` : null
  const cover = product?.coverUrl || product?.photos?.[0]

  if (loading && !productTitle) {
    return (
      <div className={`-mx-2 my-1 w-64 max-w-full rounded-2xl border ${cardBorder} p-3 overflow-hidden animate-pulse flex items-center gap-3`}>
        <div className="size-14 rounded-xl bg-surface-container flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 bg-surface-container rounded" />
          <div className="h-2.5 w-16 bg-surface-container rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={`-mx-1 my-1.5 w-72 max-w-full rounded-2xl border ${cardBorder} overflow-hidden shadow-sm backdrop-blur-sm transition-all`}>
      <div className="p-3 flex items-center gap-3">
        {cover ? (
          <div className="size-14 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/15">
            <Img src={cover} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`size-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isMine ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
            <ShoppingBag className="w-6 h-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isMine ? 'bg-white/20 text-white' : 'bg-primary/15 text-primary'}`}>
              Marketplace Item
            </span>
          </div>
          <h4 className="text-label-sm font-semibold truncate mt-0.5" title={title}>
            {title}
          </h4>
          {priceDisplay && (
            <p className={`text-[12px] font-bold mt-0.5 ${isMine ? 'text-white/90' : 'text-primary'}`}>
              {priceDisplay}
              {product?.condition && (
                <span className="font-normal opacity-75 capitalize text-[11px] ml-1.5">
                  · {product.condition}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className={`px-3 py-2 border-t flex items-center justify-between text-[11.5px] font-semibold ${isMine ? 'border-white/15 bg-white/5' : 'border-outline-variant/15 bg-surface-container/40'}`}>
        <Link
          href={`/shop/${productId}`}
          target="_blank"
          className="inline-flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View Listing</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
        <span className="opacity-70 text-[10px]">Product Inquiry</span>
      </div>
    </div>
  )
}
