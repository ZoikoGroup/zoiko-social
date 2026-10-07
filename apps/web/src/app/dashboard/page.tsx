'use client'

import { useEffect, useState } from 'react'
import { useCachedValue } from '@/hooks/use-cache'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import { Img } from '@/components/Img'
import { AccountAnalyticsSection } from '@/components/analytics/AccountAnalyticsSection'
import {
  LayoutDashboard, ShoppingBag, Newspaper, Stethoscope, HandHeart, ShieldCheck, BadgeCheck,
  Plus, Heart, Bookmark, MessageCircle, Package, MailOpen, PawPrint, ChevronRight, Pencil, MapPin,
  Dna, Sparkles, Layers, Sliders, MessageSquare, ExternalLink, Calendar, TrendingUp,
  BarChart2, CheckCircle, RotateCcw, Trash2, Edit3, Loader2, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ServiceSelectionModal } from '@/components/commercial/ServiceSelectionModal'
import { BreedingProfileModal } from '@/components/breeding/BreedingProfileModal'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useCurrency } from '@/hooks/use-currency'
import { useDateFormat } from '@/hooks/use-date-format'
import { DocsHelpLink } from '@/components/DocsHelpLink'
import {
  shopApi, newsApi, providersApi, feedApi, breedingApi, request,
  type Product, type ProductEnquiryInbox, type NewsArticle, type Provider, type PostItem,
  type BreedingProfile, type BreedingLitter, type NewProduct, type NewArticle, type NewProvider, type NewBreedingProfile,
} from '@/lib/api'
import { petCareApi, type PetCareBooking } from '@/lib/pet-care-api'
import { useProfessionalLabel } from '@/hooks/use-professional-label'

// currency formatting now via useCurrency()
function StatTile({ label, value, Icon, tint }: { label: string; value: string | number; Icon: LucideIcon; tint: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
      <div className="flex items-center justify-between">
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${tint}`}><Icon className="w-4 h-4" /></span>
      </div>
      <p className="text-headline-md font-bold text-on-surface mt-2 tabular-nums">{value}</p>
      <p className="text-[11px] text-outline">{label}</p>
    </div>
  )
}

function Card({ title, href, action, children }: { title: string; href?: string; action?: React.ReactNode; children: React.ReactNode }): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-label-md font-bold text-on-surface">{title}</h2>
        {action ?? (href && <Link href={href} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">Manage<ChevronRight className="w-3.5 h-3.5" /></Link>)}
      </div>
      {children}
    </section>
  )
}

function StatusPill({ status }: { status: string }): React.JSX.Element {
  const map: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600', available: 'bg-emerald-500/10 text-emerald-600',
    published: 'bg-emerald-500/10 text-emerald-600', sold: 'bg-surface-container text-outline',
    withdrawn: 'bg-surface-container text-outline', draft: 'bg-amber-500/10 text-amber-600',
    pending: 'bg-amber-500/10 text-amber-600', replied: 'bg-primary/10 text-primary',
  }
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${map[status] ?? 'bg-surface-container text-outline'}`}>{status}</span>
}

// ── Product Seller ───────────────────────────────────────────────────────────
function SellerDashboard(): React.JSX.Element {
  const { ago } = useDateFormat()
  const { format } = useCurrency()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data, isLoading: loading, setData } = useCachedValue<{ products: Product[]; inbox: ProductEnquiryInbox[] }>('dash:seller', async () => {
    const [m, i] = await Promise.allSettled([shopApi.mine(), shopApi.enquiryInbox()])
    return {
      products: m.status === 'fulfilled' ? m.value : [],
      inbox: i.status === 'fulfilled' ? i.value : [],
    }
  })
  const products = data?.products ?? []
  const inbox = data?.inbox ?? []

  const active = products.filter((p) => p.status === 'active').length
  const totalSaves = products.reduce((s, p) => s + p.savesCount, 0)
  const sold = products.filter((p) => p.status === 'sold').length

  // Calculate enquiries by product id for per-item insights
  const enquiriesByProduct = inbox.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = (acc[item.product.id] || 0) + 1
    return acc
  }, {})

  const { success: toastSuccess, error: toastError } = useToast()
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stockInput, setStockInput] = useState<string>('')
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState<string>('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const handleUpdatePrice = async (p: Product) => {
    const newPrice = parseFloat(priceInput)
    if (isNaN(newPrice) || newPrice < 0) {
      toastError('Invalid Price', 'Please enter a valid price.')
      return
    }
    setActionLoadingId(p.id)
    try {
      const updated = await shopApi.update(p.id, { price: newPrice })
      setData((prev) => {
        const current = prev ?? { products: [], inbox: [] }
        return {
          ...current,
          products: current.products.map((item) => item.id === p.id ? { ...item, ...updated, price: newPrice } : item),
        }
      })
      setEditingPriceId(null)
      toastSuccess('Price updated', `Price for "${p.title}" set to ${format(newPrice, p.currency)}.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSaveProductEdit = async (updatedFields: Partial<Product>) => {
    if (!editingProduct) return
    setActionLoadingId(editingProduct.id)
    try {
      const payload: Partial<NewProduct> = {}
      if (updatedFields.title !== undefined) payload.title = updatedFields.title
      if (updatedFields.price !== undefined) payload.price = updatedFields.price
      if (updatedFields.stock !== undefined) payload.stock = updatedFields.stock
      if (updatedFields.category !== undefined) payload.category = updatedFields.category
      if (updatedFields.condition !== undefined) payload.condition = updatedFields.condition
      if (updatedFields.description) payload.description = updatedFields.description
      if (updatedFields.shipping) payload.shipping = updatedFields.shipping
      if (updatedFields.location) payload.location = updatedFields.location

      const updated = await shopApi.update(editingProduct.id, payload)
      setData((prev) => {
        const current = prev ?? { products: [], inbox: [] }
        return {
          ...current,
          products: current.products.map((item) => item.id === editingProduct.id ? { ...item, ...updated, ...updatedFields } : item),
        }
      })
      setEditingProduct(null)
      toastSuccess('Product updated', `"${updatedFields.title ?? editingProduct.title}" updated successfully.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleUpdateStock = async (p: Product) => {
    const newStock = parseInt(stockInput, 10)
    if (isNaN(newStock) || newStock < 0) {
      toastError('Invalid Stock', 'Please enter a valid stock number (0 or more).')
      return
    }
    setActionLoadingId(p.id)
    try {
      const updated = await shopApi.update(p.id, {
        stock: newStock,
        status: newStock === 0 ? 'sold' : p.status === 'sold' ? 'active' : p.status,
      })
      setData((prev) => {
        const current = prev ?? { products: [], inbox: [] }
        return {
          ...current,
          products: current.products.map((item) => item.id === p.id ? { ...item, ...updated } : item),
        }
      })
      setEditingStockId(null)
      toastSuccess('Stock updated', `Stock for "${p.title}" set to ${newStock}.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleSold = async (p: Product) => {
    const isSold = p.status === 'sold'
    const nextStatus = isSold ? 'active' : 'sold'
    const nextStock = isSold && p.stock === 0 ? 1 : p.stock
    setActionLoadingId(p.id)
    try {
      const updated = await shopApi.update(p.id, {
        status: nextStatus,
        stock: nextStock,
      })
      setData((prev) => {
        const current = prev ?? { products: [], inbox: [] }
        return {
          ...current,
          products: current.products.map((item) => item.id === p.id ? { ...item, ...updated, status: nextStatus, stock: nextStock } : item),
        }
      })
      toastSuccess(
        isSold ? 'Listing reactivated' : 'Marked as sold',
        isSold ? `"${p.title}" is now active in the marketplace.` : `"${p.title}" is marked as sold and hidden from active buyers.`,
      )
    } catch (e) {
      toastError('Failed to update status', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRemoveProduct = async (p: Product) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${p.title}" from your listings?`)) {
      return
    }
    setActionLoadingId(p.id)
    try {
      await shopApi.remove(p.id)
      setData((prev) => {
        const current = prev ?? { products: [], inbox: [] }
        return {
          ...current,
          products: current.products.filter((item) => item.id !== p.id),
        }
      })
      toastSuccess('Product removed', `"${p.title}" was removed from your listings.`)
    } catch (e) {
      toastError('Failed to remove product', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Active listings" value={active} Icon={Package} tint="bg-primary/10 text-primary" />
        <StatTile label="Total saves" value={totalSaves} Icon={Heart} tint="bg-red-500/10 text-red-500" />
        <StatTile label="Enquiries" value={inbox.length} Icon={MailOpen} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Sold items" value={sold} Icon={ShoppingBag} tint="bg-emerald-500/10 text-emerald-600" />
      </div>

      <Card
        title="My Listed Products & Insights"
        action={
          <Link href="/shop" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" />List item
          </Link>
        }
      >
        {loading ? <Skeleton rows={3} /> : products.length === 0 ? (
          <Empty text="No products listed yet." cta={{ href: '/shop', label: 'Create your first product listing' }} />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {products.map((p) => {
              const productEnquiryCount = enquiriesByProduct[p.id] || p.enquiriesCount || 0
              const isActionLoading = actionLoadingId === p.id
              const isSold = p.status === 'sold'
              const isEditingStock = editingStockId === p.id

              return (
                <div key={p.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Link href={`/shop/${p.id}`} className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/20 shadow-xs block">
                      <Thumb url={p.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/shop/${p.id}`} className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span className="truncate">{p.title}</span>
                        <ExternalLink className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {/* Price inline editor */}
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[11px] text-outline">{p.currency}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={priceInput}
                              onChange={(e) => setPriceInput(e.target.value)}
                              className="w-20 px-1.5 py-0.5 text-[11px] rounded bg-surface-container border border-primary text-on-surface focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdatePrice(p)
                                if (e.key === 'Escape') setEditingPriceId(null)
                              }}
                            />
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleUpdatePrice(p)}
                              className="px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-semibold hover:bg-primary/90 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="text-[10px] text-outline hover:text-on-surface cursor-pointer px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPriceInput(String(p.price))
                              setEditingPriceId(p.id)
                            }}
                            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer group/price"
                            title="Click to edit price"
                          >
                            <span>{format(p.price, p.currency)}</span>
                            <Edit3 className="w-2.5 h-2.5 text-outline opacity-60 group-hover/price:opacity-100" />
                          </button>
                        )}
                        <span className="text-outline/40">·</span>

                        {/* Stock inline editor */}
                        {isEditingStock ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="number"
                              min="0"
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              className="w-16 px-1.5 py-0.5 text-[11px] rounded bg-surface-container border border-primary text-on-surface focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateStock(p)
                                if (e.key === 'Escape') setEditingStockId(null)
                              }}
                            />
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleUpdateStock(p)}
                              className="px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-semibold hover:bg-primary/90 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStockId(null)}
                              className="text-[10px] text-outline hover:text-on-surface cursor-pointer px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setStockInput(String(p.stock))
                              setEditingStockId(p.id)
                            }}
                            className="inline-flex items-center gap-1 text-[11px] hover:text-primary transition-colors cursor-pointer group/stock"
                            title="Click to edit stock"
                          >
                            <span className={p.stock > 0 && !isSold ? 'text-on-surface-variant font-medium' : 'text-red-500 font-semibold'}>
                              {p.stock} in stock
                            </span>
                            <Edit3 className="w-2.5 h-2.5 text-outline opacity-60 group-hover/stock:opacity-100" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap self-end md:self-center">
                    {/* Per-item KPI counters */}
                    <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/20 text-[11px]">
                      <span className="flex items-center gap-1 text-on-surface-variant" title="Saves count">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500/20" />
                        <span className="font-semibold">{p.savesCount}</span>
                      </span>
                      <span className="text-outline-variant/40">|</span>
                      <span className="flex items-center gap-1 text-on-surface-variant" title="Buyer enquiries received">
                        <MessageSquare className="w-3 h-3 text-secondary" />
                        <span className="font-semibold">{productEnquiryCount}</span>
                      </span>
                    </div>

                    <StatusPill status={p.status} />

                    {/* Edit Info button */}
                    <button
                      type="button"
                      onClick={() => setEditingProduct(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
                      title="Edit product info, price, description"
                    >
                      <Edit3 className="w-3 h-3 text-outline" />
                      Edit Info
                    </button>

                    {/* Mark as Sold / Reactivate button */}
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleToggleSold(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                        isSold
                          ? 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                      title={isSold ? 'Reactivate listing' : 'Mark listing as sold'}
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isSold ? (
                        <RotateCcw className="w-3 h-3" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      <span>{isSold ? 'Re-list' : 'Mark as Sold'}</span>
                    </button>

                    {/* Insights button */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold transition-colors cursor-pointer"
                      title="View detailed product performance"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      Insights
                    </button>

                    {/* Delete listing button */}
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleRemoveProduct(p)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-outline hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove product listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Enquiry Inbox with 1-Click Direct DM */}
      <Card title="Enquiry Inbox (Buyer Messages)">
        {loading ? <Skeleton rows={2} /> : inbox.length === 0 ? (
          <Empty text="No enquiries yet. When buyers message you about your items, you can reply directly from here." />
        ) : (
          <div className="space-y-3">
            {inbox.map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <Link href={`/profile/${e.buyer.username}`}>
                    <UserAvatar name={e.buyer.displayName} image={e.buyer.avatarUrl ?? undefined} size="sm" verified={e.buyer.isVerified} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-label-sm font-semibold text-on-surface">{e.buyer.displayName}</span>
                      <span className="text-[11px] text-outline">@{e.buyer.username}</span>
                      <span className="text-[11px] text-outline">· {ago(e.createdAt)}</span>
                      <StatusPill status={e.status} />
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Interested in: <Link href={`/shop/${e.product.id}`} className="text-primary hover:underline font-medium">{e.product.title}</Link>
                    </p>
                    {e.message && (
                      <div className="mt-2 p-2.5 rounded-lg bg-surface-container text-label-sm text-on-surface border border-outline-variant/15">
                        <p className="italic text-[12.5px] leading-relaxed">&ldquo;{e.message}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0 pt-1">
                  {/* Direct DM Reply Button */}
                  <Link
                    href={`/messages?user=${e.buyer.id}&productId=${e.product.id}&productTitle=${encodeURIComponent(e.product.title)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary/90 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply in DM
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Product Detailed Insights Modal / Sheet */}
      {selectedProduct && (
        <ProductInsightsModal
          product={selectedProduct}
          enquiriesCount={enquiriesByProduct[selectedProduct.id] || selectedProduct.enquiriesCount || 0}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Product Edit Info Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProductEdit}
          onClose={() => setEditingProduct(null)}
          loading={actionLoadingId === editingProduct.id}
        />
      )}
    </>
  )
}

// ── Verified News Publisher ──────────────────────────────────────────────────
function PublisherDashboard(): React.JSX.Element {
  const { ago } = useDateFormat()
  const { success: toastSuccess, error: toastError } = useToast()
  const { data, isLoading: loading, setData } = useCachedValue<NewsArticle[]>('dash:publisher', () => newsApi.mine())
  const articles = data ?? []
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const likes = articles.reduce((s, a) => s + a.likesCount, 0)
  const saves = articles.reduce((s, a) => s + a.savesCount, 0)
  const comments = articles.reduce((s, a) => s + a.commentsCount, 0)

  const handleSaveArticleEdit = async (updatedFields: { title: string; excerpt: string; category: string; sourceName?: string; sourceUrl?: string }) => {
    if (!editingArticle) return
    setActionLoadingId(editingArticle.id)
    try {
      const payload: Partial<NewArticle> = {
        title: updatedFields.title,
        excerpt: updatedFields.excerpt,
        category: updatedFields.category,
      }
      if (updatedFields.sourceName) payload.sourceName = updatedFields.sourceName
      if (updatedFields.sourceUrl) payload.sourceUrl = updatedFields.sourceUrl

      const updated = await newsApi.update(editingArticle.id, payload)
      setData((prev) => (prev ?? []).map((a) => (a.id === editingArticle.id ? { ...a, ...updated, ...updatedFields } : a)))
      setEditingArticle(null)
      toastSuccess('Article updated', `"${updatedFields.title}" updated successfully.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteArticle = async (a: NewsArticle) => {
    if (!window.confirm(`Are you sure you want to delete "${a.title}"?`)) return
    setActionLoadingId(a.id)
    try {
      await newsApi.remove(a.id)
      setData((prev) => (prev ?? []).filter((item) => item.id !== a.id))
      toastSuccess('Article removed', `"${a.title}" was removed.`)
    } catch (e) {
      toastError('Failed to remove article', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Articles" value={articles.length} Icon={Newspaper} tint="bg-primary/10 text-primary" />
        <StatTile label="Total likes" value={likes} Icon={Heart} tint="bg-red-500/10 text-red-500" />
        <StatTile label="Total saves" value={saves} Icon={Bookmark} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Comments" value={comments} Icon={MessageCircle} tint="bg-emerald-500/10 text-emerald-600" />
      </div>

      <Card title="My Articles" action={<Link href="/news" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90"><Pencil className="w-3.5 h-3.5" />Write</Link>}>
        {loading ? <Skeleton rows={3} /> : articles.length === 0 ? (
          <Empty text="You haven't published any articles yet." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {articles.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 group">
                <Link href={`/news/${a.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                    <Thumb url={a.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span className="truncate">{a.title}</span>
                      <ExternalLink className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </p>
                    <p className="text-[11px] text-outline capitalize">{a.category} · {ago(a.publishedAt)}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-2 text-[11px] text-outline bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20">
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-red-500" />{a.likesCount}</span>
                    <span className="text-outline-variant/40">|</span>
                    <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3 text-secondary" />{a.commentsCount}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingArticle(a)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
                    title="Edit article info and content"
                  >
                    <Edit3 className="w-3 h-3 text-outline" />
                    Edit Info
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === a.id}
                    onClick={() => handleDeleteArticle(a)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-outline hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          onSave={handleSaveArticleEdit}
          onClose={() => setEditingArticle(null)}
          loading={actionLoadingId === editingArticle.id}
        />
      )}
    </>
  )
}

// ── Veterinarian ─────────────────────────────────────────────────────────────
function VetDashboard(): React.JSX.Element {
  const { ago } = useDateFormat()
  const { profile } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const pid = profile?.id ?? ''
  const { data, isLoading: loading, setData } = useCachedValue<{ tips: PostItem[]; listings: Provider[]; bookings: PetCareBooking[] }>(`dash:vet:${pid}`, async () => {
    if (!pid) return { tips: [], listings: [], bookings: [] }
    const [p, l, b] = await Promise.allSettled([
      feedApi.profilePosts(pid, null, false, 30),
      providersApi.mine(),
      petCareApi.listBookings('provider', undefined, null, 50),
    ])
    return {
      tips: p.status === 'fulfilled' ? p.value.data.filter((x) => x.kind === 'vet_tip') : [],
      listings: l.status === 'fulfilled' ? l.value.filter((x) => x.category === 'vet') : [],
      bookings: b.status === 'fulfilled' ? b.value.data : [],
    }
  })
  const tips = data?.tips ?? []
  const listings = data?.listings ?? []
  const bookings = data?.bookings ?? []

  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const tipSaves = tips.reduce((s, t) => s + t.savesCount, 0)

  // Calculate monthly contacts/consultations (bookings created or scheduled this month)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthlyContacts = bookings.filter((b) => {
    const d = new Date(b.createdAt || b.scheduledAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length

  const handleSaveListingEdit = async (updatedFields: { name: string; serviceType?: string; description?: string; location?: string; phone?: string; website?: string }) => {
    if (!editingProvider) return
    setActionLoadingId(editingProvider.id)
    try {
      const payload: Partial<Omit<NewProvider, 'category'>> = { name: updatedFields.name }
      if (updatedFields.serviceType) payload.serviceType = updatedFields.serviceType
      if (updatedFields.description) payload.description = updatedFields.description
      if (updatedFields.location) payload.location = updatedFields.location
      if (updatedFields.phone) payload.phone = updatedFields.phone
      if (updatedFields.website) payload.website = updatedFields.website

      const updated = await providersApi.update(editingProvider.id, payload)
      setData((prev) => {
        const cur = prev ?? { tips: [], listings: [], bookings: [] }
        return {
          ...cur,
          listings: cur.listings.map((item) => (item.id === editingProvider.id ? { ...item, ...updated, ...updatedFields } : item)),
        }
      })
      setEditingProvider(null)
      toastSuccess('Practice updated', `"${updatedFields.name}" details updated successfully.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Contacts this month" value={monthlyContacts} Icon={Calendar} tint="bg-primary/10 text-primary" />
        <StatTile label="Practice listings" value={listings.length} Icon={MapPin} tint="bg-emerald-500/10 text-emerald-600" />
        <StatTile label="Vet tips" value={tips.length} Icon={Stethoscope} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Advice saved" value={tipSaves} Icon={Bookmark} tint="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Patient Inquiries & Consultations with Direct DM Reply */}
      <Card
        title="Patient Contacts & Consultations (This Month)"
        action={
          <Link href="/vet-finder/dashboard" className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">
            Clinic Manager<ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {loading ? <Skeleton rows={2} /> : bookings.length === 0 ? (
          <Empty text="No patient contacts or appointments scheduled yet this month." cta={{ href: '/vet-finder/dashboard', label: 'Manage Clinic & Availability' }} />
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <Link href={`/profile/${b.seeker.username}`}>
                    <UserAvatar name={b.seeker.displayName} image={b.seeker.avatarUrl ?? undefined} size="sm" verified={b.seeker.isVerified} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-label-sm font-semibold text-on-surface">{b.seeker.displayName}</span>
                      <span className="text-[11px] text-outline">@{b.seeker.username}</span>
                      <span className="text-[11px] text-outline">· {ago(b.createdAt)}</span>
                      <StatusPill status={b.status} />
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Service: <span className="font-semibold text-on-surface">{b.service?.name ?? 'Veterinary Consult'}</span>
                      {b.petName && ` for ${b.petName} (${b.petSpecies ?? 'Pet'})`}
                    </p>
                    {b.reason && (
                      <p className="text-label-sm text-on-surface-variant mt-1 italic text-[12px]">
                        &ldquo;{b.reason}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0 pt-1">
                  <Link
                    href={`/messages?user=${b.seeker.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary/90 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply in DM
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="My Practice Listing" action={<Link href="/vet-finder" className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">Vet Finder<ChevronRight className="w-3.5 h-3.5" /></Link>}>
        {loading ? <Skeleton rows={1} /> : listings.length === 0 ? (
          <Empty text="You're not listed in the Vet Finder yet." cta={{ href: '/vet-finder', label: 'Add your practice' }} />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {listings.map((l) => (
              <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 group">
                <Link href={`/vet-finder`} className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 flex-shrink-0"><Stethoscope className="w-5 h-5 text-primary" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span className="truncate">{l.name}</span>
                      <ExternalLink className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </p>
                    <p className="text-[11px] text-outline truncate">{l.serviceType ?? 'Veterinary practice'}{l.location ? ` · ${l.location}` : ''}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingProvider(l)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
                    title="Edit practice info, location, and contact"
                  >
                    <Edit3 className="w-3 h-3 text-outline" />
                    Edit Info
                  </button>
                  <Link
                    href="/vet-finder/dashboard"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold transition-colors"
                  >
                    Manage Clinic
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="My Vet Tips" action={<Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90"><Plus className="w-3.5 h-3.5" />Post tip</Link>}>
        {loading ? <Skeleton rows={2} /> : tips.length === 0 ? (
          <Empty text="Share your first Vet Tip from the home composer." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {tips.map((t) => (
              <Link key={t.id} href={`/p/${t.id}`} className="flex items-center gap-3 py-2.5 group">
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 flex-shrink-0"><Stethoscope className="w-5 h-5 text-primary" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{t.caption ?? 'Vet tip'}</p>
                  <p className="text-[11px] text-outline">{ago(t.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 text-[11px] text-outline">
                  <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{t.likesCount}</span>
                  <span className="flex items-center gap-0.5"><Bookmark className="w-3 h-3" />{t.savesCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {editingProvider && (
        <EditProviderListingModal
          provider={editingProvider}
          title="Edit Veterinary Practice"
          onSave={handleSaveListingEdit}
          onClose={() => setEditingProvider(null)}
          loading={actionLoadingId === editingProvider.id}
        />
      )}
    </>
  )
}

// ── Pet Care Service Provider ────────────────────────────────────────────────
function PetCareDashboard(): React.JSX.Element {
  const { profile } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const { data, isLoading: loading, setData } = useCachedValue<Provider[]>('dash:petcare', async () => {
    const l = await providersApi.mine()
    return l.filter((x) => x.category === 'pet_care')
  })
  const listings = data ?? []
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const handleSaveCareEdit = async (updatedFields: { name: string; serviceType?: string; description?: string; location?: string; phone?: string; website?: string }) => {
    if (!editingProvider) return
    setActionLoadingId(editingProvider.id)
    try {
      const payload: Partial<Omit<NewProvider, 'category'>> = { name: updatedFields.name }
      if (updatedFields.serviceType) payload.serviceType = updatedFields.serviceType
      if (updatedFields.description) payload.description = updatedFields.description
      if (updatedFields.location) payload.location = updatedFields.location
      if (updatedFields.phone) payload.phone = updatedFields.phone
      if (updatedFields.website) payload.website = updatedFields.website

      const updated = await providersApi.update(editingProvider.id, payload)
      setData((prev) => (prev ?? []).map((item) => (item.id === editingProvider.id ? { ...item, ...updated, ...updatedFields } : item)))
      setEditingProvider(null)
      toastSuccess('Service listing updated', `"${updatedFields.name}" details updated successfully.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Service listings" value={listings.length} Icon={HandHeart} tint="bg-primary/10 text-primary" />
        <StatTile label="Followers" value={profile?.followersCount ?? 0} Icon={PawPrint} tint="bg-red-500/10 text-red-500" />
        <StatTile label="Following" value={profile?.followingCount ?? 0} Icon={PawPrint} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Trust score" value={profile?.trustScore ?? 0} Icon={ShieldCheck} tint="bg-emerald-500/10 text-emerald-600" />
      </div>

      <Card title="My Service Listings" action={<Link href="/pet-care/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90"><LayoutDashboard className="w-3.5 h-3.5" />Dashboard</Link>}>
        {loading ? <Skeleton rows={2} /> : listings.length === 0 ? (
          <Empty text="You have no pet-care service listings yet." cta={{ href: '/pet-care/dashboard', label: 'Open Dashboard' }} />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {listings.map((l) => (
              <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 group">
                <Link href="/pet-care/dashboard" className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Thumb url={l.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" fallback={<HandHeart className="w-5 h-5 text-primary" />} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span className="truncate">{l.name}</span>
                      <ExternalLink className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </p>
                    <p className="text-[11px] text-outline truncate">{l.serviceType ?? 'Pet care service'}{l.location ? ` · ${l.location}` : ''}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingProvider(l)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
                    title="Edit service provider info and location"
                  >
                    <Edit3 className="w-3 h-3 text-outline" />
                    Edit Info
                  </button>
                  <Link
                    href="/pet-care/dashboard"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {editingProvider && (
        <EditProviderListingModal
          provider={editingProvider}
          title="Edit Pet Care Service"
          onSave={handleSaveCareEdit}
          onClose={() => setEditingProvider(null)}
          loading={actionLoadingId === editingProvider.id}
        />
      )}
    </>
  )
}

// ── Breeder Professional ─────────────────────────────────────────────────────
function BreederDashboard(): React.JSX.Element {
  const { format } = useCurrency()
  const { success: toastSuccess, error: toastError } = useToast()
  const { data, isLoading: loading, setData } = useCachedValue<{ profiles: BreedingProfile[]; litters: BreedingLitter[] }>('dash:breeder', async () => {
    const [p, l] = await Promise.allSettled([breedingApi.mine(), breedingApi.litters()])
    return {
      profiles: p.status === 'fulfilled' ? p.value : [],
      litters: l.status === 'fulfilled' ? l.value : [],
    }
  })
  const profiles = data?.profiles ?? []
  const litters = data?.litters ?? []

  const [editingProfile, setEditingProfile] = useState<BreedingProfile | null>(null)
  const [createProfileOpen, setCreateProfileOpen] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null)
  const [feeInput, setFeeInput] = useState<string>('')

  const activeProfiles = profiles.filter((p) => p.status === 'active' || p.availableNow).length
  const totalLitters = litters.length
  const totalRequests = profiles.reduce((acc, p) => acc + (p.requestsCount || 0), 0)

  const handleUpdateFee = async (p: BreedingProfile) => {
    const newFee = parseFloat(feeInput)
    if (isNaN(newFee) || newFee < 0) {
      toastError('Invalid Fee', 'Please enter a valid breeding/stud fee.')
      return
    }
    setActionLoadingId(p.id)
    try {
      const updated = await breedingApi.update(p.id, { fee: newFee })
      setData((prev) => {
        const cur = prev ?? { profiles: [], litters: [] }
        return {
          ...cur,
          profiles: cur.profiles.map((item) => (item.id === p.id ? { ...item, ...updated, fee: newFee } : item)),
        }
      })
      setEditingFeeId(null)
      toastSuccess('Fee updated', `Fee for "${p.petName}" set to ${format(newFee, p.currency || 'INR')}.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSaveProfileEdit = async (updatedFields: { petName: string; breed: string; fee?: number; location?: string; about?: string; availableNow?: boolean }) => {
    if (!editingProfile) return
    setActionLoadingId(editingProfile.id)
    try {
      const payload: Partial<NewBreedingProfile> = {
        petName: updatedFields.petName,
        breed: updatedFields.breed,
      }
      if (updatedFields.fee !== undefined) payload.fee = updatedFields.fee
      if (updatedFields.location) payload.location = updatedFields.location
      if (updatedFields.about) payload.about = updatedFields.about
      if (updatedFields.availableNow !== undefined) payload.availableNow = updatedFields.availableNow

      const updated = await breedingApi.update(editingProfile.id, payload)
      setData((prev) => {
        const cur = prev ?? { profiles: [], litters: [] }
        return {
          ...cur,
          profiles: cur.profiles.map((item) => (item.id === editingProfile.id ? { ...item, ...updated, ...updatedFields } : item)),
        }
      })
      setEditingProfile(null)
      toastSuccess('Breeding profile updated', `"${updatedFields.petName}" details updated successfully.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleAvailable = async (p: BreedingProfile) => {
    const nextVal = !p.availableNow
    setActionLoadingId(p.id)
    try {
      const updated = await breedingApi.update(p.id, { availableNow: nextVal, status: nextVal ? 'active' : 'inactive' })
      setData((prev) => {
        const cur = prev ?? { profiles: [], litters: [] }
        return {
          ...cur,
          profiles: cur.profiles.map((item) => (item.id === p.id ? { ...item, ...updated, availableNow: nextVal, status: nextVal ? 'active' : 'inactive' } : item)),
        }
      })
      toastSuccess(nextVal ? 'Profile available' : 'Profile paused', `"${p.petName}" is now ${nextVal ? 'open for breeding requests' : 'paused'}.`)
    } catch (e) {
      toastError('Update failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Breeding profiles" value={profiles.length} Icon={Dna} tint="bg-primary/10 text-primary" />
        <StatTile label="Active profiles" value={activeProfiles} Icon={PawPrint} tint="bg-emerald-500/10 text-emerald-600" />
        <StatTile label="Total Litters" value={totalLitters} Icon={Package} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Match Requests" value={totalRequests} Icon={Heart} tint="bg-red-500/10 text-red-500" />
      </div>

      <Card
        title="My Breeding Profiles"
        action={
          <button
            type="button"
            onClick={() => setCreateProfileOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />Add Profile
          </button>
        }
      >
        {loading ? (
          <Skeleton rows={3} />
        ) : profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-label-sm text-outline mb-3">No breeding profiles created yet.</p>
            <button
              type="button"
              onClick={() => setCreateProfileOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create breeding profile
            </button>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {profiles.map((p) => {
              const isEditingFee = editingFeeId === p.id
              const isActionLoading = actionLoadingId === p.id

              return (
                <div key={p.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Link href={`/breeding-match/${p.id}`} className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center border border-outline-variant/20 block">
                      <Thumb url={p.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" fallback={<Dna className="w-5 h-5 text-primary" />} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/breeding-match/${p.id}`} className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span className="truncate">{p.petName}</span>
                        <ExternalLink className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-outline truncate">
                          {p.breed} · {p.sex ? (p.sex.charAt(0).toUpperCase() + p.sex.slice(1)) : 'Male'}{p.location ? ` · ${p.location}` : ''}
                        </span>
                        <span className="text-outline/40">·</span>

                        {/* Interactive Inline Fee Editor */}
                        {isEditingFee ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[11px] text-outline">{p.currency || 'INR'}</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={feeInput}
                              onChange={(e) => setFeeInput(e.target.value)}
                              className="w-20 px-1.5 py-0.5 text-[11px] rounded bg-surface-container border border-primary text-on-surface focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateFee(p)
                                if (e.key === 'Escape') setEditingFeeId(null)
                              }}
                            />
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleUpdateFee(p)}
                              className="px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-semibold hover:bg-primary/90 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFeeId(null)}
                              className="text-[10px] text-outline hover:text-on-surface cursor-pointer px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setFeeInput(p.fee != null ? String(p.fee) : '0')
                              setEditingFeeId(p.id)
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer group/fee"
                            title="Click to edit breeding / stud fee"
                          >
                            <span>{p.fee != null ? `Fee: ${format(p.fee, p.currency || 'INR')}` : 'Set Fee'}</span>
                            <Edit3 className="w-2.5 h-2.5 text-outline opacity-60 group-hover/fee:opacity-100" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
                    <span className="flex items-center gap-0.5 text-[11px] text-outline bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20">
                      <Heart className="w-3 h-3 text-red-500" />
                      {p.requestsCount || 0} reqs
                    </span>

                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleToggleAvailable(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                        p.availableNow
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
                          : 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                      }`}
                      title={p.availableNow ? 'Click to mark unavailable' : 'Click to mark available'}
                    >
                      {p.availableNow ? <CheckCircle className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      <span>{p.availableNow ? 'Available' : 'Paused'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProfile(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
                      title="Edit breeding profile info, location, fee"
                    >
                      <Edit3 className="w-3 h-3 text-outline" />
                      Edit Info
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card
        title="My Litters (Pipeline)"
        action={
          <Link href="/breeding-match" className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">
            Breeding Hub<ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {loading ? (
          <Skeleton rows={2} />
        ) : litters.length === 0 ? (
          <Empty text="No litters recorded yet." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {litters.map((l) => (
              <div key={l.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-label-sm font-semibold text-on-surface">{l.petName} & {l.withName}</p>
                  <p className="text-[11px] text-outline">
                    {l.species || 'Pet'} {l.breed ? `(${l.breed})` : ''} · {l.count ? `${l.count} offspring` : 'Litter tracked'}
                  </p>
                </div>
                <StatusPill status={l.status || 'planned'} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {createProfileOpen && (
        <BreedingProfileModal
          onClose={() => setCreateProfileOpen(false)}
          onSaved={(newProf) => {
            setCreateProfileOpen(false)
            setData((prev) => {
              const cur = prev ?? { profiles: [], litters: [] }
              return {
                ...cur,
                profiles: [newProf, ...cur.profiles],
              }
            })
            toastSuccess('Breeding profile created', `"${newProf.petName}" has been added to your breeding profiles.`)
          }}
        />
      )}

      {editingProfile && (
        <EditBreedingProfileModal
          profile={editingProfile}
          onSave={handleSaveProfileEdit}
          onClose={() => setEditingProfile(null)}
          loading={actionLoadingId === editingProfile.id}
        />
      )}
    </>
  )
}

function Thumb({ url, className, fallback }: { url: string | null; className: string; fallback?: React.ReactNode }): React.JSX.Element {
  if (!url) return <>{fallback ?? null}</>
  return <Img src={url} alt="" className={className} />
}

function Skeleton({ rows }: { rows: number }): React.JSX.Element {
  return <div className="space-y-2">{Array.from({ length: rows }).map((_, i) => <div key={i} className="h-12 bg-surface-container rounded-lg animate-pulse" />)}</div>
}
function ProductInsightsModal({
  product,
  enquiriesCount,
  onClose,
}: {
  product: Product
  enquiriesCount: number
  onClose: () => void
}): React.JSX.Element {
  const { format } = useCurrency()
  const { ago, date: formatDate } = useDateFormat()

  // Derive estimated conversion & popularity metrics
  const saveRate = product.savesCount > 0 ? ((enquiriesCount / Math.max(1, product.savesCount)) * 100).toFixed(0) : '0'
  const isLowStock = product.stock <= 2 && product.stock > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden border border-outline-variant/20 flex-shrink-0">
              <Thumb url={product.coverUrl} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Product Insights
              </span>
              <h3 className="font-headline text-label-lg font-bold text-on-surface truncate mt-1">
                {product.title}
              </h3>
              <p className="text-[11px] text-outline">
                Listed {formatDate(product.createdAt, 'dayMonthLong')} · {ago(product.createdAt)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 4 Key Product Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
            <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <p className="text-headline-sm font-bold text-on-surface tabular-nums">{product.savesCount}</p>
            <p className="text-[10px] text-outline">Total Saves</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
            <MessageSquare className="w-4 h-4 text-secondary mx-auto mb-1" />
            <p className="text-headline-sm font-bold text-on-surface tabular-nums">{enquiriesCount}</p>
            <p className="text-[10px] text-outline">Buyer Enquiries</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-headline-sm font-bold text-on-surface tabular-nums">{saveRate}%</p>
            <p className="text-[10px] text-outline">Inquiry Ratio</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
            <Package className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className={`text-headline-sm font-bold tabular-nums ${isLowStock ? 'text-red-500' : 'text-on-surface'}`}>
              {product.stock}
            </p>
            <p className="text-[10px] text-outline">In Stock</p>
          </div>
        </div>

        {/* Details & Commercial Health */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/15 text-label-sm">
          <div className="flex justify-between items-center py-1 border-b border-outline-variant/10 text-[12px]">
            <span className="text-outline">Selling Price</span>
            <span className="font-bold text-on-surface">{format(product.price, product.currency)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-outline-variant/10 text-[12px]">
            <span className="text-outline">Category / Condition</span>
            <span className="font-semibold text-on-surface capitalize">{product.category} · {product.condition}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-outline-variant/10 text-[12px]">
            <span className="text-outline">Listing Status</span>
            <StatusPill status={product.status} />
          </div>
          <div className="flex justify-between items-center py-1 text-[12px]">
            <span className="text-outline">Shipping Support</span>
            <span className="text-on-surface">{product.shipping || 'Standard Local delivery / Pickup'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-outline-variant/20">
          <Link
            href={`/shop/${product.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Page
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-label-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function EditProductModal({
  product,
  onSave,
  onClose,
  loading,
}: {
  product: Product
  onSave: (fields: Partial<Product>) => Promise<void>
  onClose: () => void
  loading?: boolean
}): React.JSX.Element {
  const [title, setTitle] = useState(product.title)
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [category, setCategory] = useState(product.category || 'accessories')
  const [condition, setCondition] = useState(product.condition || 'new')
  const [description, setDescription] = useState(product.description || '')
  const [shipping, setShipping] = useState(product.shipping || '')
  const [location, setLocation] = useState(product.location || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numPrice = parseFloat(price)
    const numStock = parseInt(stock, 10)
    if (isNaN(numPrice) || numPrice < 0) return
    if (isNaN(numStock) || numStock < 0) return

    onSave({
      title: title.trim(),
      price: numPrice,
      stock: numStock,
      category,
      condition,
      description: description.trim() || null,
      shipping: shipping.trim() || null,
      location: location.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="text-label-lg font-bold text-on-surface">Edit Product Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Price ({product.currency})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Stock</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary capitalize"
              >
                {['food', 'toys', 'accessories', 'grooming', 'healthcare', 'clothing', 'bedding', 'other'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary capitalize"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Shipping Note</label>
              <input
                type="text"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                placeholder="e.g. Free shipping, In-store pickup"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Article Modal ───────────────────────────────────────────────────────
function EditArticleModal({
  article,
  onSave,
  onClose,
  loading,
}: {
  article: NewsArticle
  onSave: (fields: { title: string; excerpt: string; category: string; sourceName?: string; sourceUrl?: string }) => void
  onClose: () => void
  loading?: boolean
}): React.JSX.Element {
  const [title, setTitle] = useState(article.title)
  const [excerpt, setExcerpt] = useState(article.excerpt)
  const [category, setCategory] = useState(article.category)
  const [sourceName, setSourceName] = useState(article.sourceName ?? '')
  const [sourceUrl, setSourceUrl] = useState(article.sourceUrl ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: { title: string; excerpt: string; category: string; sourceName?: string; sourceUrl?: string } = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
    }
    if (sourceName.trim()) payload.sourceName = sourceName.trim()
    if (sourceUrl.trim()) payload.sourceUrl = sourceUrl.trim()
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="text-label-lg font-bold text-on-surface">Edit Article</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Excerpt / Summary</label>
            <textarea
              rows={3}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Source Name (Optional)</label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. Associated Press"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Source URL (Optional)</label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Provider Listing Modal (Vet & Pet Care) ─────────────────────────────
function EditProviderListingModal({
  provider,
  title,
  onSave,
  onClose,
  loading,
}: {
  provider: Provider
  title: string
  onSave: (fields: { name: string; serviceType?: string; description?: string; location?: string; phone?: string; website?: string }) => void
  onClose: () => void
  loading?: boolean
}): React.JSX.Element {
  const [name, setName] = useState(provider.name)
  const [serviceType, setServiceType] = useState(provider.serviceType ?? '')
  const [location, setLocation] = useState(provider.location ?? '')
  const [phone, setPhone] = useState(provider.phone ?? '')
  const [website, setWebsite] = useState(provider.website ?? '')
  const [description, setDescription] = useState(provider.description ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: { name: string; serviceType?: string; description?: string; location?: string; phone?: string; website?: string } = {
      name: name.trim(),
    }
    if (serviceType.trim()) payload.serviceType = serviceType.trim()
    if (location.trim()) payload.location = location.trim()
    if (phone.trim()) payload.phone = phone.trim()
    if (website.trim()) payload.website = website.trim()
    if (description.trim()) payload.description = description.trim()
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="text-label-lg font-bold text-on-surface">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Practice / Business Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Service Type</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="e.g. Veterinary Hospital, Boarding"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 ..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">Description / Services Offered</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell clients about your facilities, experience, and services..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Breeding Profile Modal ──────────────────────────────────────────────
function EditBreedingProfileModal({
  profile,
  onSave,
  onClose,
  loading,
}: {
  profile: BreedingProfile
  onSave: (fields: { petName: string; breed: string; fee?: number; location?: string; about?: string; availableNow?: boolean }) => void
  onClose: () => void
  loading?: boolean
}): React.JSX.Element {
  const [petName, setPetName] = useState(profile.petName)
  const [breed, setBreed] = useState(profile.breed)
  const [fee, setFee] = useState<string>(profile.fee != null ? String(profile.fee) : '')
  const [location, setLocation] = useState(profile.location ?? '')
  const [about, setAbout] = useState(profile.about ?? '')
  const [availableNow, setAvailableNow] = useState(profile.availableNow ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedFee = fee.trim() ? parseFloat(fee) : undefined
    const payload: { petName: string; breed: string; fee?: number; location?: string; about?: string; availableNow?: boolean } = {
      petName: petName.trim(),
      breed: breed.trim(),
      availableNow,
    }
    if (parsedFee !== undefined && !isNaN(parsedFee)) payload.fee = parsedFee
    if (location.trim()) payload.location = location.trim()
    if (about.trim()) payload.about = about.trim()
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <h3 className="text-label-lg font-bold text-on-surface">Edit Breeding Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Pet Name</label>
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Breed</label>
              <input
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Fee ({profile.currency || 'INR'})</label>
              <input
                type="number"
                min="0"
                step="1"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-on-surface mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-on-surface mb-1">About / Lineage Details</label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Describe temperament, pedigree, and health certifications..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-label-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="breeding-available"
              checked={availableNow}
              onChange={(e) => setAvailableNow(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="breeding-available" className="text-label-sm font-medium text-on-surface cursor-pointer">
              Available for breeding & stud matching
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Empty({ text, cta }: { text: string; cta?: { href: string; label: string } }): React.JSX.Element {
  return (
    <div className="text-center py-6">
      <p className="text-label-sm text-outline">{text}</p>
      {cta && <Link href={cta.href} className="inline-block mt-2 text-label-sm font-semibold text-primary hover:underline">{cta.label}</Link>}
    </div>
  )
}

const ROLE_META: Record<string, { label: string; Icon: LucideIcon; render: () => React.JSX.Element }> = {
  product_seller: { label: 'Seller Dashboard', Icon: ShoppingBag, render: () => <SellerDashboard /> },
  breeder_professional: { label: 'Breeder Dashboard', Icon: Dna, render: () => <BreederDashboard /> },
  pet_care_service_provider: { label: 'Care Provider Dashboard', Icon: HandHeart, render: () => <PetCareDashboard /> },
  verified_news_publisher: { label: 'Publisher Dashboard', Icon: Newspaper, render: () => <PublisherDashboard /> },
  veterinarian: { label: 'Veterinarian Dashboard', Icon: Stethoscope, render: () => <VetDashboard /> },
}

interface UserSub {
  id: string
  entitlement: string
  status: string
}

export default function DashboardPage(): React.JSX.Element {
  const profLabel = useProfessionalLabel()
  const { date: formatDate } = useDateFormat()
  const { loading, isAuthenticated, profile, refreshProfile } = useAuth()
  const [activeSubscriptions, setActiveSubscriptions] = useState<UserSub[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [userTier, setUserTier] = useState<'starter' | 'professional' | 'premium' | string>('starter')
  const [maxServicesAllowed, setMaxServicesAllowed] = useState<number>(1)
  const [allocatedServices, setAllocatedServices] = useState<string[]>([])
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [hasPromptedSelection, setHasPromptedSelection] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) window.location.replace('/login')
  }, [loading, isAuthenticated])

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const [subsRes, servicesRes] = await Promise.allSettled([
          request<UserSub[] | { data: UserSub[] }>('/commercial/subscriptions'),
          request<{ data: { tier: string; maxServicesAllowed: number; activeServices: string[] } }>('/commercial/active-services'),
        ])

        if (isMounted) {
          if (subsRes.status === 'fulfilled') {
            const subs = Array.isArray(subsRes.value) ? subsRes.value : Array.isArray(subsRes.value?.data) ? subsRes.value.data : []
            setActiveSubscriptions(subs)
          }

          if (servicesRes.status === 'fulfilled' && servicesRes.value?.data) {
            const sData = servicesRes.value.data
            setUserTier(sData.tier || 'starter')
            setMaxServicesAllowed(sData.maxServicesAllowed || 1)
            setAllocatedServices(sData.activeServices || [])

            // If user has subscription but hasn't configured services yet, automatically open selection wizard once
            if ((sData.activeServices || []).length === 0 && !hasPromptedSelection) {
              setIsServiceModalOpen(true)
              setHasPromptedSelection(true)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load dashboard data', e)
      }
    }
    if (isAuthenticated) {
      loadData()
      refreshProfile().catch((e) => console.warn('Failed to refresh profile', e))
    }
    return () => {
      isMounted = false
    }
  }, [isAuthenticated, refreshProfile, hasPromptedSelection])

  // Determine available dashboards for user
  const availableDashboards: Array<{ id: string; label: string; Icon: LucideIcon; render: () => React.JSX.Element }> = []

  // 1. Add services explicitly selected and allocated by the user
  if (allocatedServices.includes('seller') && !availableDashboards.some((d) => d.id === 'product_seller')) {
    const meta = ROLE_META.product_seller
    if (meta) availableDashboards.push({ id: 'product_seller', ...meta })
  }
  if (allocatedServices.includes('breeder') && !availableDashboards.some((d) => d.id === 'breeder_professional')) {
    const meta = ROLE_META.breeder_professional
    if (meta) availableDashboards.push({ id: 'breeder_professional', ...meta })
  }
  if (allocatedServices.includes('vet') && !availableDashboards.some((d) => d.id === 'veterinarian')) {
    const meta = ROLE_META.veterinarian
    if (meta) availableDashboards.push({ id: 'veterinarian', ...meta })
  }
  if (allocatedServices.includes('care') && !availableDashboards.some((d) => d.id === 'pet_care_service_provider')) {
    const meta = ROLE_META.pet_care_service_provider
    if (meta) availableDashboards.push({ id: 'pet_care_service_provider', ...meta })
  }

  // 2. Check commercial subscriptions (fallback & backwards compatibility)
  activeSubscriptions.forEach((sub) => {
    if (sub.status === 'active' || sub.status === 'trialing') {
      if (sub.entitlement === 'seller_professional' && !availableDashboards.some((d) => d.id === 'product_seller')) {
        const meta = ROLE_META.product_seller
        if (meta) availableDashboards.push({ id: 'product_seller', ...meta })
      } else if (sub.entitlement === 'breeder_professional' && !availableDashboards.some((d) => d.id === 'breeder_professional')) {
        const meta = ROLE_META.breeder_professional
        if (meta) availableDashboards.push({ id: 'breeder_professional', ...meta })
      } else if (sub.entitlement === 'care_professional' && !availableDashboards.some((d) => d.id === 'pet_care_service_provider')) {
        const meta = ROLE_META.pet_care_service_provider
        if (meta) availableDashboards.push({ id: 'pet_care_service_provider', ...meta })
      }
    }
  })

  // 3. Check verified professional profile role as well
  const role = profile?.professionalProfile?.category ?? null
  if (role && ROLE_META[role] && !availableDashboards.some((d) => d.id === role)) {
    const meta = ROLE_META[role]
    if (meta) availableDashboards.push({ id: role, ...meta })
  }

  // Active dashboard selection
  const currentTab = activeTab && availableDashboards.some((d) => d.id === activeTab)
    ? activeTab
    : availableDashboards[0]?.id || null

  const activeMeta = currentTab ? availableDashboards.find((d) => d.id === currentTab) : null
  const roleLabel = profLabel(role)
  const verifiedAt = profile?.professionalProfile?.verifiedAt ?? null

  if (loading || !isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-container-max mx-auto px-5 py-4">
          <div className="h-40 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-9 space-y-4 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-5">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-white flex-shrink-0">
                  {activeMeta ? <activeMeta.Icon className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h1 className="font-headline text-headline-md font-bold text-on-surface leading-tight">
                    {activeMeta?.label || 'Professional Dashboard'}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {activeMeta ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold">
                        <BadgeCheck className="w-3 h-3" />
                        {activeMeta.label}
                      </span>
                    ) : roleLabel ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                        <BadgeCheck className="w-3 h-3" />
                        {roleLabel}
                      </span>
                    ) : null}
                    {verifiedAt && <span className="text-[11px] text-outline">Verified {formatDate(verifiedAt, 'monthYear')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(activeSubscriptions.length > 0 || allocatedServices.length > 0) && (
                    <button
                      onClick={() => setIsServiceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors shadow-sm"
                    >
                      <Sliders className="w-3.5 h-3.5 text-primary" />
                      Manage Services
                    </button>
                  )}
                  <DocsHelpLink href="/docs/profile-and-pets#professional-verification" />
                </div>
              </div>

              {/* Multi-Dashboard Switcher Tabs */}
              {availableDashboards.length > 1 && (
                <div className="mt-4 pt-4 border-t border-primary/15 flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-outline mr-1 flex items-center gap-1 flex-shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                      My Services:
                    </span>
                    {availableDashboards.map((dash) => {
                      const isSelected = currentTab === dash.id
                      const DashIcon = dash.Icon
                      return (
                        <button
                          key={dash.id}
                          onClick={() => setActiveTab(dash.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            isSelected
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          <DashIcon className="w-3.5 h-3.5" />
                          {dash.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {activeMeta && <AccountAnalyticsSection />}

            {activeMeta ? (
              activeMeta.render()
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-label-md font-bold text-on-surface mb-1">Professional Dashboard</h2>
                <p className="text-label-sm text-outline max-w-sm mx-auto mb-4">
                  Choose a professional plan or get verified to unlock dedicated management tools, analytics, and business limits.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/settings?section=billing"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    View Professional Plans
                  </Link>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Get Verified
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" />

      {/* Post-Payment & Active Services Selection Modal */}
      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        currentTier={userTier}
        maxServicesAllowed={maxServicesAllowed}
        initialSelectedServices={allocatedServices}
        onSuccess={(updatedServices) => {
          setAllocatedServices(updatedServices)
          refreshProfile().catch((e) => console.warn('Failed to refresh profile', e))
          // Automatically focus the first newly selected service tab
          if (updatedServices.length > 0 && updatedServices[0]) {
            const roleMap: Record<string, string> = {
              seller: 'product_seller',
              breeder: 'breeder_professional',
              vet: 'veterinarian',
              care: 'pet_care_service_provider',
            }
            const firstService = updatedServices[0]
            const targetTab = roleMap[firstService]
            if (targetTab) setActiveTab(targetTab)
          }
        }}
      />
    </>
  )
}
