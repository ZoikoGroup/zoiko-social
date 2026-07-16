'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import { Img } from '@/components/Img'
import {
  ChevronLeft, Heart, Truck, Package, BadgeCheck, Trash2, Loader2, MessageCircle, Check, MapPin, ShoppingBag,
} from 'lucide-react'
import { shopApi, orderApi, type Product } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  const n = amount.toLocaleString(undefined, { minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
  return sym ? `${sym}${n}` : `${n} ${currency}`
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savesCount, setSavesCount] = useState(0)
  const [slide, setSlide] = useState(0)
  const [enquireOpen, setEnquireOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [enquiryState, setEnquiryState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    shopApi.get(id)
      .then((p) => { if (cancelled) return; setProduct(p); setSaved(p.viewerSaved); setSavesCount(p.savesCount) })
      .catch(() => { if (!cancelled) setNotFound(true) })
    return () => { cancelled = true }
  }, [id])

  async function toggleSave(): Promise<void> {
    const next = !saved
    setSaved(next); setSavesCount((c) => c + (next ? 1 : -1))
    try { const r = await (next ? shopApi.save(id) : shopApi.unsave(id)); setSavesCount(r.savesCount) }
    catch { setSaved(!next); setSavesCount((c) => c + (next ? -1 : 1)) }
  }
  async function remove(): Promise<void> {
    await shopApi.remove(id).catch(() => {})
    router.push('/shop')
  }
  async function sendEnquiry(): Promise<void> {
    if (enquiryState === 'sending') return
    setEnquiryState('sending')
    try {
      await shopApi.enquire(id, message.trim() ? { message: message.trim() } : {})
      setEnquiryState('sent'); setEnquireOpen(false)
    } catch { setEnquiryState('idle') }
  }
  async function buyNow(): Promise<void> {
    if (checkingOut) return
    setCheckingOut(true)
    setCheckoutError(null)
    try {
      const { url } = await orderApi.checkout(id)
      window.location.href = url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout is not available right now')
      setCheckingOut(false)
    }
  }

  if (notFound) {
    return (<><Header /><main className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <div className="text-center"><Package className="w-10 h-10 text-outline mx-auto mb-2" /><p className="text-label-md text-on-surface">Product not found</p>
      <Link href="/shop" className="text-primary hover:underline text-label-sm">Back to Marketplace</Link></div></main></>)
  }
  if (!product) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-2 md:px-5 py-4 pb-24">
          <div className="h-4 w-28 bg-surface-container rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="aspect-square rounded-2xl bg-surface-container animate-pulse" />
            <div className="space-y-4">
              <div className="flex gap-2"><div className="h-5 w-16 bg-surface-container rounded-full animate-pulse" /><div className="h-5 w-16 bg-surface-container rounded-full animate-pulse" /></div>
              <div className="h-7 w-3/4 bg-surface-container rounded animate-pulse" />
              <div className="h-8 w-28 bg-surface-container rounded animate-pulse" />
              <div className="h-4 w-40 bg-surface-container rounded animate-pulse" />
              <div className="flex items-center gap-2.5 pt-4 border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse" />
                <div className="space-y-1.5"><div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" /><div className="h-3 w-14 bg-surface-container rounded animate-pulse" /></div>
              </div>
              <div className="flex gap-2"><div className="h-11 flex-1 bg-surface-container rounded-xl animate-pulse" /><div className="h-11 w-20 bg-surface-container rounded-xl animate-pulse" /></div>
            </div>
          </div>
        </div>
      </main>
    </>
  )

  const gallery = [product.coverUrl, ...product.photos].filter(Boolean) as string[]
  const isOwner = !!user && user.id === product.seller.id
  const onSale = product.compareAt != null && product.compareAt > product.price

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-2 md:px-5 py-4 pb-24">
          <Link href="/shop" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary mb-4"><ChevronLeft className="w-4 h-4" />Marketplace</Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gallery */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
                {gallery[slide] && (
                  <Img src={gallery[slide]} alt="" priority className="w-full h-full object-cover" />
                )}
                {onSale && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold">SALE</span>}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                  {gallery.map((g, i) => (
                    <button key={g} onClick={() => setSlide(i)} className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${i === slide ? 'border-primary' : 'border-transparent'}`}>
                      <Img src={g} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">{product.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">{product.condition}</span>
                {product.inStock ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">In stock</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-semibold text-red-600">Out of stock</span>
                )}
              </div>

              <h1 className="font-headline text-headline-lg font-bold text-on-surface leading-tight text-balance">{product.title}</h1>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-headline-md font-bold text-on-surface">{money(product.price, product.currency)}</span>
                {onSale && <span className="text-label-md text-outline line-through">{money(product.compareAt!, product.currency)}</span>}
              </div>

              {product.shipping && <p className="flex items-center gap-1.5 text-label-sm text-primary mt-2"><Truck className="w-4 h-4" />{product.shipping}</p>}
              {product.location && <p className="flex items-center gap-1.5 text-label-sm text-outline mt-1"><MapPin className="w-4 h-4" />{product.location}</p>}

              <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-outline-variant/20">
                <Link href={`/profile/${product.seller.username}`}><UserAvatar name={product.seller.displayName} image={product.seller.avatarUrl ?? undefined} size="sm" verified={product.seller.isVerified} /></Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${product.seller.username}`} className="text-label-sm font-semibold text-on-surface hover:underline flex items-center gap-1">{product.seller.displayName}{product.seller.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}</Link>
                  <p className="text-[11px] text-outline">Seller</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {isOwner ? (
                  <button onClick={remove} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 text-red-500 text-label-sm font-semibold hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" />Delete listing</button>
                ) : (
                  <>
                    <button onClick={buyNow} disabled={checkingOut || !product.inStock} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-60 cursor-pointer">
                      {checkingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}Buy Now
                    </button>
                    <button onClick={() => setEnquireOpen(true)} disabled={enquiryState === 'sent'} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container disabled:opacity-60 cursor-pointer">
                      {enquiryState === 'sent' ? <><Check className="w-4 h-4" />Enquiry sent</> : <><MessageCircle className="w-4 h-4" />Contact Seller</>}
                    </button>
                  </>
                )}
                <button onClick={toggleSave} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-label-sm font-semibold transition-colors cursor-pointer ${saved ? 'border-red-300 text-red-500 bg-red-50' : 'border-outline-variant/50 text-on-surface-variant hover:border-red-300 hover:text-red-500'}`}>
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />{savesCount > 0 ? savesCount : ''}
                </button>
              </div>
              {checkoutError && <p className="text-label-sm text-red-500 mt-2">{checkoutError}</p>}

              {product.description && (
                <div className="mt-5 pt-5 border-t border-outline-variant/20">
                  <h2 className="text-label-md font-bold text-on-surface mb-1.5">Description</h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="shop" />

      {enquireOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setEnquireOpen(false)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-label-md font-bold text-on-surface mb-1">Contact Seller</h2>
            <p className="text-label-sm text-outline mb-3">Send {product.seller.displayName} a message about “{product.title}”.</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Hi! Is this still available?"
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEnquireOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container cursor-pointer">Cancel</button>
              <button onClick={sendEnquiry} disabled={enquiryState === 'sending'} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                {enquiryState === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
