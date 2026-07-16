'use client'

import { useCallback, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import { Img } from '@/components/Img'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  ShoppingBag, Search, Heart, Truck, Package, BadgeCheck, Plus, Loader2, X, ImagePlus,
} from 'lucide-react'
import { shopApi, type Product, type NewProduct } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { uploadCommunityImage } from '@/lib/community-image'
import { UserAvatar } from '@/components/UserAvatar'

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all',         label: 'All Products',   icon: '🛍️' },
  { id: 'food',        label: 'Food & Treats',  icon: '🍖' },
  { id: 'toys',        label: 'Toys & Play',    icon: '🧸' },
  { id: 'health',      label: 'Health & Meds',  icon: '💊' },
  { id: 'grooming',    label: 'Grooming',       icon: '✂️' },
  { id: 'accessories', label: 'Accessories',    icon: '🧣' },
  { id: 'beds',        label: 'Beds & Crates',  icon: '🛏️' },
  { id: 'tech',        label: 'Tech & Gadgets', icon: '📱' },
]

const SORTS: { id: string; label: string }[] = [
  { id: 'newest',     label: 'Newest' },
  { id: 'popular',    label: 'Most Saved' },
  { id: 'price-low',  label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
]

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  const n = amount.toLocaleString(undefined, { minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
  return sym ? `${sym}${n}` : `${n} ${currency}`
}

function SaveButton({ product }: { product: Product }): React.JSX.Element {
  const [saved, setSaved] = useState(product.viewerSaved)
  // Re-sync when the server truth for this product changes (e.g. after a filter refetch).
  const [seen, setSeen] = useState(product.viewerSaved)
  if (seen !== product.viewerSaved) { setSeen(product.viewerSaved); setSaved(product.viewerSaved) }
  async function toggle(e: React.MouseEvent): Promise<void> {
    e.preventDefault(); e.stopPropagation()
    const next = !saved
    setSaved(next)
    try { await (next ? shopApi.save(product.id) : shopApi.unsave(product.id)) } catch { setSaved(!next) }
  }
  return (
    <button onClick={toggle} aria-label="Save"
      className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer ${saved ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-red-500'}`}>
      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  )
}

export default function ShopPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [sellOpen, setSellOpen] = useState(false)

  const filters = useCallback(() => ({
    ...(category !== 'all' ? { category } : {}),
    ...(sort !== 'newest' ? { sort } : {}),
    ...(search.trim() ? { q: search.trim() } : {}),
  }), [category, sort, search])

  const listKey = `shop:${category}:${sort}:${search.trim()}`
  const {
    items: products, isLoading: loading, isRefreshing, hasMore, loadingMore, loadMore, patch: patchProducts,
  } = usePagedList<Product>(listKey, (cursor) => shopApi.browse(filters(), cursor, 12))

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-9 space-y-4 pb-20">
            {isRefreshing && !loading && (
              <div className="h-0.5 -mb-3 overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-1/3 bg-primary/60 animate-pulse rounded-full" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/15"><ShoppingBag className="w-5 h-5 text-secondary" /></span>
                <div>
                  <h1 className="font-headline text-headline-md font-bold text-on-surface">Marketplace</h1>
                  <p className="text-label-sm text-outline">Pet food, gear &amp; supplies from trusted sellers</p>
                </div>
              </div>
              {isAuthenticated && (
                <button onClick={() => setSellOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /><span className="hidden sm:inline">Sell an Item</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50" />
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-sm cursor-pointer">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${category === cat.id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
                  <span>{cat.icon}</span>{cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4"><Package className="w-7 h-7 text-outline" /></div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No products yet</h3>
                <p className="text-label-sm text-outline mb-4">Be the first to list an item in the marketplace.</p>
                {isAuthenticated && <button onClick={() => setSellOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Sell an Item</button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div key={p.id} onMouseEnter={() => { void shopApi.get(p.id).catch(() => {}) }} className="group relative bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <Link href={`/shop/${p.id}`} aria-label={p.title} className="absolute inset-0 z-10" />
                      <div className="relative aspect-square bg-surface-container overflow-hidden">
                        {p.coverUrl && (
                          <Img src={p.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                        {p.compareAt && p.compareAt > p.price && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">SALE</span>
                        )}
                        {!p.inStock && (
                          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-label-sm font-bold">Out of stock</span>
                        )}
                        <SaveButton product={p} />
                      </div>
                      <div className="p-3">
                        <h3 className="text-label-sm font-semibold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5em]">{p.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-label-md font-bold text-on-surface">{money(p.price, p.currency)}</span>
                          {p.compareAt && p.compareAt > p.price && <span className="text-[11px] text-outline line-through">{money(p.compareAt, p.currency)}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-[11px] text-outline min-w-0">
                          <UserAvatar name={p.seller.displayName} image={p.seller.avatarUrl ?? undefined} size="xs" />
                          <span className="truncate">{p.seller.displayName}</span>
                          {p.seller.isVerified && <BadgeCheck className="w-3 h-3 text-primary flex-shrink-0" />}
                        </div>
                        {p.shipping && <p className="flex items-center gap-1 text-[10px] text-primary mt-1.5"><Truck className="w-3 h-3" />{p.shipping}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center pt-4">
                    <button onClick={loadMore} disabled={loadingMore} className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all cursor-pointer inline-flex items-center gap-2">
                      {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <MobileTabs currentPage="shop" />

      {sellOpen && <SellModal onClose={() => setSellOpen(false)} onListed={(p) => { setSellOpen(false); patchProducts((prev) => [p, ...prev]) }} />}
    </>
  )
}

function SellModal({ onClose, onListed }: { onClose: () => void; onListed: (p: Product) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [compareAt, setCompareAt] = useState('')
  const [category, setCategory] = useState('accessories')
  const [condition, setCondition] = useState('new')
  const [stock, setStock] = useState('1')
  const [shipping, setShipping] = useState('')
  const [description, setDescription] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const priceNum = parseFloat(price)
  const valid = title.trim().length >= 3 && !isNaN(priceNum) && priceNum >= 0

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(true)
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) } catch { setError('Image upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (!valid || posting) return
    setPosting(true); setError('')
    try {
      const input: NewProduct = {
        title: title.trim(), price: priceNum, category, condition,
        ...(compareAt && !isNaN(parseFloat(compareAt)) ? { compareAt: parseFloat(compareAt) } : {}),
        ...(stock && !isNaN(parseInt(stock, 10)) ? { stock: parseInt(stock, 10) } : {}),
        ...(shipping.trim() ? { shipping: shipping.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(coverUrl ? { coverUrl } : {}),
      }
      onListed(await shopApi.create(input))
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to list') } finally { setPosting(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest">
          <h2 className="text-label-md font-bold text-on-surface">Sell an Item</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block">
            <div className="relative h-36 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-outline text-label-sm">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-6 h-6" />}{uploading ? 'Uploading…' : 'Add product photo'}
                </span>
              )}
              <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
            </div>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder="Product title"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-md border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <div className="flex gap-2">
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="Price"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
            <input value={compareAt} onChange={(e) => setCompareAt(e.target.value)} inputMode="decimal" placeholder="Compare-at (optional)"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 px-3 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none cursor-pointer">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="px-3 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none cursor-pointer">
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" placeholder="Stock"
              className="w-24 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
            <input value={shipping} onChange={(e) => setShipping(e.target.value)} maxLength={120} placeholder="Shipping (e.g. Free shipping)"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={4000} rows={4} placeholder="Describe your item…"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
          {error && <p className="text-label-sm text-red-500">{error}</p>}
          <button onClick={submit} disabled={!valid || posting || uploading}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {posting && <Loader2 className="w-4 h-4 animate-spin" />}{posting ? 'Listing…' : 'List Item'}
          </button>
        </div>
      </div>
    </div>
  )
}
