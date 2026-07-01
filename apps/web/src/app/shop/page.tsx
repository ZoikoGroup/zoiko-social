'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  ShoppingBag, ChevronLeft, Search, Heart, Star,
  Truck, Filter,
  Package, BadgeCheck, Plus,
} from 'lucide-react'

type ProductCategory = 'all' | 'food' | 'toys' | 'health' | 'grooming' | 'accessories' | 'beds' | 'tech'
type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high'

interface ShopProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: ProductCategory
  shop: string
  shopVerified: boolean
  rating: number
  reviewCount: number
  shipping: string
  inStock: boolean
  badge?: 'bestseller' | 'sale' | 'new' | 'organic' | undefined
  description: string
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'all',          label: 'All Products',   icon: '🛍️' },
  { id: 'food',         label: 'Food & Treats',  icon: '🍖' },
  { id: 'toys',         label: 'Toys & Play',    icon: '🧸' },
  { id: 'health',       label: 'Health & Meds',  icon: '💊' },
  { id: 'grooming',     label: 'Grooming',       icon: '✂️' },
  { id: 'accessories',  label: 'Accessories',    icon: '🧣' },
  { id: 'beds',         label: 'Beds & Crates',  icon: '🛏️' },
  { id: 'tech',         label: 'Tech & Gadgets', icon: '📱' },
]

const PRODUCTS: ShopProduct[] = [
  {
    id: 'p1', name: 'Premium Salmon & Sweet Potato Dog Food (25 lbs)', price: 64.99, originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1565706969-6b5b4a7e3f3a?w=400&h=400&fit=crop',
    category: 'food', shop: 'Pawsome Nutrition Co.', shopVerified: true,
    rating: 4.8, reviewCount: 2341, shipping: 'Free shipping', inStock: true,
    badge: 'bestseller', description: 'Grain-free, high-protein formula with real salmon. Supports healthy skin, coat, and digestion.',
  },
  {
    id: 'p2', name: 'Interactive Treat Dispensing Puzzle Ball', price: 24.99,
    image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=400&fit=crop',
    category: 'toys', shop: 'PetIQ', shopVerified: true,
    rating: 4.5, reviewCount: 876, shipping: 'Free shipping', inStock: true,
    badge: 'bestseller', description: 'Adjustable difficulty levels. Keeps pets mentally stimulated for hours. Dishwasher safe.',
  },
  {
    id: 'p3', name: 'Orthopedic Memory Foam Pet Bed — Large', price: 89.99, originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1547558962-98c4c24e43a9?w=400&h=400&fit=crop',
    category: 'beds', shop: 'CozyPaws', shopVerified: true,
    rating: 4.7, reviewCount: 1543, shipping: 'Free shipping', inStock: true,
    badge: 'sale', description: 'High-density memory foam with cooling gel layer. Removable, machine-washable cover. Supports joints.',
  },
  {
    id: 'p4', name: 'GPS Pet Tracker with Activity Monitoring', price: 129.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&h=400&fit=crop',
    category: 'tech', shop: 'PetTech Labs', shopVerified: true,
    rating: 4.3, reviewCount: 432, shipping: 'Free shipping', inStock: true,
    badge: 'new', description: 'Real-time GPS tracking, activity monitoring, virtual fence alerts. Waterproof. 7-day battery.',
  },
  {
    id: 'p5', name: 'Organic Hemp Calming Chews for Dogs (60 ct)', price: 29.99,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
    category: 'health', shop: 'Natural Pet Wellness', shopVerified: true,
    rating: 4.6, reviewCount: 1209, shipping: 'Free shipping over $35', inStock: true,
    badge: 'organic', description: 'Organic hemp-derived calming support for anxiety, noise phobia, and travel stress. Vet recommended.',
  },
  {
    id: 'p6', name: 'Adjustable No-Pull Dog Harness — Reflective', price: 34.99,
    image: 'https://images.unsplash.com/photo-1574026111796-34c8b6382048?w=400&h=400&fit=crop',
    category: 'accessories', shop: 'WalkWell Gear', shopVerified: false,
    rating: 4.4, reviewCount: 678, shipping: 'Free shipping', inStock: true,
    description: 'Padded, breathable mesh harness with reflective strips. Front and back D-rings. 4 sizes available.',
  },
  {
    id: 'p7', name: 'Self-Cleaning Cat Litter Box — App Connected', price: 499.99,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    category: 'tech', shop: 'SmartCat Systems', shopVerified: true,
    rating: 4.2, reviewCount: 321, shipping: 'Free shipping', inStock: false,
    badge: 'new', description: 'Self-cleaning, health-monitoring smart litter box. Auto-scoops, tracks weight, and syncs to your phone.',
  },
  {
    id: 'p8', name: 'Catnip-Infused Plush Fish Toy Set (5 Pack)', price: 14.99,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop',
    category: 'toys', shop: 'KittyJoy', shopVerified: false,
    rating: 4.9, reviewCount: 2156, shipping: 'Free shipping over $25', inStock: true,
    badge: 'bestseller', description: 'Assorted catnip fish toys with crinkle paper interior. Hand-sewn, non-toxic materials. Cats love them!',
  },
  {
    id: 'p9', name: 'Professional Pet Grooming Kit — Low Noise', price: 59.99, originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=400&fit=crop',
    category: 'grooming', shop: 'FurPerfect', shopVerified: true,
    rating: 4.4, reviewCount: 892, shipping: 'Free shipping', inStock: true,
    badge: 'sale', description: '6-blade kit with ultra-quiet motor. Stainless steel, self-sharpening blades. Includes grooming guide.',
  },
  {
    id: 'p10', name: 'Elevated Dog Bowl Stand — Bamboo (2 Bowls)', price: 44.99,
    image: 'https://images.unsplash.com/photo-1579117097471-7e7a5f9e4c4b?w=400&h=400&fit=crop',
    category: 'accessories', shop: 'EcoPet Home', shopVerified: true,
    rating: 4.6, reviewCount: 543, shipping: 'Free shipping', inStock: true,
    badge: 'organic', description: 'Sustainable bamboo stand with stainless steel bowls. Promotes healthy digestion. Non-slip feet.',
  },
  {
    id: 'p11', name: 'Freeze-Dried Raw Duck Bites (8 oz)', price: 19.99,
    image: 'https://images.unsplash.com/photo-1565706969-6b5b4a7e3f3a?w=400&h=400&fit=crop',
    category: 'food', shop: 'Raw Instinct Pets', shopVerified: true,
    rating: 4.7, reviewCount: 456, shipping: 'Free shipping over $35', inStock: true,
    badge: 'organic', description: 'Single-ingredient freeze-dried duck. High-protein, grain-free training treat. Sourced from USA farms.',
  },
  {
    id: 'p12', name: 'Portable Pet Water Bottle — 20 oz', price: 15.99,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
    category: 'accessories', shop: 'AdventurePup', shopVerified: false,
    rating: 4.3, reviewCount: 234, shipping: '$4.99 shipping', inStock: true,
    description: 'Leak-proof, one-hand operation water bottle with built-in drinking bowl. BPA-free. Perfect for walks.',
  },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }): React.JSX.Element {
  const stars = Math.round(rating)
  const starSize = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-outline/20'}`}
        />
      ))}
    </span>
  )
}

function ProductBadge({ badge }: { badge: ShopProduct['badge'] }): React.JSX.Element | null {
  if (!badge) return null
  const styles: Record<string, string> = {
    bestseller: 'bg-secondary/10 text-secondary border-secondary/20',
    sale: 'bg-red-50 text-red-600 border-red-200',
    new: 'bg-primary/10 text-primary border-primary/20',
    organic: 'bg-green-50 text-green-600 border-green-200',
  }
  return (
    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${styles[badge] ?? styles.bestseller}`}>
      {badge === 'bestseller' ? '⭐ Best Seller' : badge === 'sale' ? '🔥 Sale' : badge === 'new' ? '✨ New' : '🌿 Organic'}
    </span>
  )
}

export default function ShopPage(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('popular')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(['p1', 'p8', 'p5']))
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)

  function toggleWishlist(id: string): void {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = [...PRODUCTS].filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.shop.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    return true
  }).sort((a, b) => {
    switch (sort) {
      case 'popular': return b.reviewCount - a.reviewCount
      case 'newest': return (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0) // rough
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      default: return 0
    }
  })

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-9 space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-headline-md font-bold text-on-surface">Shop</h1>
                <p className="text-label-sm text-outline">Find the best products for your pets</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                    showFilters
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <button className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-all duration-200 cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                  {wishlist.size > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[8px] text-white font-bold flex items-center justify-center">
                      {wishlist.size}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, or categories..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Category chips + sort */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              <div className="flex gap-2 flex-1">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      <span className="text-sm">{cat.icon}</span>
                      {cat.label}
                    </button>
                  )
                })}
              </div>
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="flex-shrink-0 px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant focus:border-primary focus:outline-none cursor-pointer appearance-none"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Results count */}
            <p className="text-label-sm text-outline">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
              {wishlist.size > 0 && (
                <span className="ml-2">· <Heart className="w-3 h-3 inline-block text-primary" /> {wishlist.size} saved</span>
              )}
            </p>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No products found</h3>
                <p className="text-label-sm text-outline mb-4">Try a different category or search term</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all') }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((product) => (
                  <article
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <ProductBadge badge={product.badge} />
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          wishlist.has(product.id)
                            ? 'bg-white text-primary shadow-md'
                            : 'bg-white/80 text-outline hover:text-primary hover:bg-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-white text-on-surface px-3 py-1 rounded-full text-label-sm font-semibold shadow-md">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-3">
                      {/* Shop name */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] text-outline truncate">{product.shop}</span>
                        {product.shopVerified && (
                          <BadgeCheck className="w-3 h-3 text-primary flex-shrink-0" />
                        )}
                      </div>

                      <h3 className="text-label-sm font-semibold text-on-surface leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <StarRating rating={product.rating} size="xs" />
                        <span className="text-[10px] text-outline">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-label-md font-bold text-on-surface">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-outline line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      {/* Shipping + Add */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                          <Truck className="w-3 h-3" />
                          {product.shipping === 'Free shipping' ? 'Free' : product.shipping}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation() }}
                          className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-[0.92]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Promo banner */}
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border border-outline-variant/20 p-5 text-center">
              <h2 className="text-label-md font-bold text-on-surface mb-1">🐾 Free Shipping on Orders Over $35</h2>
              <p className="text-label-sm text-outline">Plus, all purchases support animal rescue organizations. Shop with purpose!</p>
            </div>
          </div>
        </div>
      </main>

      <MobileTabs currentPage="shop" />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Image */}
            <div className="relative aspect-square bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <ProductBadge badge={selectedProduct.badge} />
            </div>

            <div className="p-5 space-y-4">
              {/* Title + price */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-label-md font-bold text-on-surface">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-outline">by {selectedProduct.shop}</span>
                      {selectedProduct.shopVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-headline-md font-bold text-on-surface">${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.originalPrice && (
                      <div className="text-[11px] text-outline line-through">${selectedProduct.originalPrice.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={selectedProduct.rating} />
                <span className="text-label-sm text-on-surface-variant font-semibold">{selectedProduct.rating}</span>
                <span className="text-label-sm text-outline">({selectedProduct.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-body-md text-on-surface-variant leading-relaxed">{selectedProduct.description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[11px] text-on-surface-variant">{selectedProduct.shipping}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container">
                  <Package className="w-4 h-4 text-secondary" />
                  <span className="text-[11px] text-on-surface-variant">{selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97] cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(selectedProduct.id) }}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    wishlist.has(selectedProduct.id)
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'border-outline-variant text-outline hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.has(selectedProduct.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
