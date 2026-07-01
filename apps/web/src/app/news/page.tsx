'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  Newspaper, ChevronLeft, Search, Bookmark, Share2,
  Clock, BadgeCheck, ShieldCheck,
  Globe, TrendingUp, Filter,
  Heart, MessageSquare, BookOpen,
} from 'lucide-react'

type Tier = 'institutional' | 'verified' | 'community'
type Category = 'all' | 'policy' | 'science' | 'rescue' | 'health' | 'climate' | 'community'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  image: string
  category: Category
  tier: Tier
  author: string
  authorAvatar: string
  source: string
  time: string
  readTime: string
  likes: number
  comments: number
  featured: boolean
  saved: boolean
  url: string
}

const TIER_CONFIG: Record<Tier, {
  label: string
  icon: typeof ShieldCheck
  color: string
  bgColor: string
  description: string
}> = {
  institutional: {
    label: 'Institutional',
    icon: ShieldCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Verified government or research institution source',
  },
  verified: {
    label: 'Verified',
    icon: BadgeCheck,
    color: 'text-secondary',
    bgColor: 'bg-amber-50 border-amber-200',
    description: 'Reviewed and verified by ZoikoSocial fact-checkers',
  },
  community: {
    label: 'Community',
    icon: Globe,
    color: 'text-primary',
    bgColor: 'bg-teal-50 border-teal-200',
    description: 'Shared by community members with strong reputation',
  },
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',       label: 'All News' },
  { id: 'policy',    label: 'Policy & Law' },
  { id: 'science',   label: 'Animal Science' },
  { id: 'rescue',    label: 'Rescue Stories' },
  { id: 'health',    label: 'Pet Health' },
  { id: 'climate',   label: 'Climate & Habitat' },
  { id: 'community', label: 'Community' },
]

const ARTICLES: NewsArticle[] = [
  // Featured
  {
    id: 'a1', title: 'California Passes Landmark Wildlife Corridor Protection Act',
    excerpt: 'The new legislation allocates $180M for wildlife crossings and habitat connectivity across the state, aiming to reduce road mortality by 40% within five years.',
    image: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd8e?w=800&h=500&fit=crop',
    category: 'policy', tier: 'institutional', author: 'Dr. Maria Santos', authorAvatar: 'MS',
    source: 'California Dept. of Wildlife', time: '2h ago', readTime: '4 min read',
    likes: 892, comments: 134, featured: true, saved: true, url: '#',
  },
  {
    id: 'a2', title: 'New Study Reveals Dogs Can Detect Early-Stage Parkinson\'s Disease',
    excerpt: 'Researchers at the University of Cambridge have published groundbreaking findings showing trained canines can identify Parkinson\'s biomarkers with 93% accuracy.',
    image: 'https://images.unsplash.com/photo-1553882809-a4f35714b272?w=800&h=500&fit=crop',
    category: 'science', tier: 'institutional', author: 'Prof. James Whitfield', authorAvatar: 'JW',
    source: 'Cambridge Veterinary Journal', time: '8h ago', readTime: '6 min read',
    likes: 2341, comments: 412, featured: true, saved: false, url: '#',
  },
  {
    id: 'a3', title: 'Global Heat Season: Essential Safety Guide for Pet Owners',
    excerpt: 'Veterinary associations worldwide issue updated guidelines as temperatures rise, including paw pad protection, hydration schedules, and recognizing heatstroke signs.',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=500&fit=crop',
    category: 'health', tier: 'verified', author: 'PawsWild Rescue', authorAvatar: 'PW',
    source: 'ZoikoSocial Verified Content', time: '1d ago', readTime: '3 min read',
    likes: 1567, comments: 289, featured: true, saved: true, url: '#',
  },
  // Regular articles
  {
    id: 'a4', title: 'Record Number of Sea Turtle Nests Recorded on Costa Rican Beaches',
    excerpt: 'Conservation efforts pay off as olive ridley sea turtle nesting sites see a 35% increase compared to last year, marking the highest count in a decade.',
    image: 'https://images.unsplash.com/photo-1570488344398-9b5f4b3c6c3b?w=600&h=400&fit=crop',
    category: 'climate', tier: 'verified', author: 'Marine Life Guardians', authorAvatar: 'ML',
    source: 'ZoikoSocial Verified Content', time: '1d ago', readTime: '3 min read',
    likes: 1203, comments: 178, featured: false, saved: false, url: '#',
  },
  {
    id: 'a5', title: 'Meet the Volunteers Rehabilitating Orphaned Baby Elephants in Kenya',
    excerpt: 'A heartwarming look at the Sheldrick Wildlife Trust\'s elephant orphanage, where dedicated keepers raise and release orphaned calves back into the wild.',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef76?w=600&h=400&fit=crop',
    category: 'rescue', tier: 'community', author: 'Sara Renfeld', authorAvatar: 'SR',
    source: 'Community Contribution', time: '2d ago', readTime: '5 min read',
    likes: 3456, comments: 521, featured: false, saved: true, url: '#',
  },
  {
    id: 'a6', title: 'FDA Approves First Oral Treatment for Canine Cognitive Dysfunction',
    excerpt: 'The new medication aims to improve quality of life for aging dogs suffering from dementia-like symptoms, with clinical trials showing promising results.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    category: 'health', tier: 'institutional', author: 'FDA Communications', authorAvatar: 'FD',
    source: 'U.S. Food & Drug Administration', time: '3d ago', readTime: '4 min read',
    likes: 987, comments: 156, featured: false, saved: false, url: '#',
  },
  {
    id: 'a7', title: 'Urban Beekeeping Initiatives Are Thriving in Major Cities Worldwide',
    excerpt: 'From rooftop hives in New York to community gardens in Tokyo, urban beekeeping is helping restore pollinator populations and raise environmental awareness.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
    category: 'climate', tier: 'community', author: 'ClimateEdu', authorAvatar: 'CE',
    source: 'Community Contribution', time: '4d ago', readTime: '3 min read',
    likes: 654, comments: 89, featured: false, saved: false, url: '#',
  },
  {
    id: 'a8', title: 'New Zealand Bans Cosmetic Testing on Animals Effective Immediately',
    excerpt: 'New Zealand becomes the 45th country to ban cosmetic animal testing, joining a growing global movement for cruelty-free beauty standards.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
    category: 'policy', tier: 'institutional', author: 'NZ Ministry for Primary Industries', authorAvatar: 'NZ',
    source: 'Government of New Zealand', time: '5d ago', readTime: '2 min read',
    likes: 4210, comments: 623, featured: false, saved: true, url: '#',
  },
  {
    id: 'a9', title: 'Community Effort Saves 150 Stranded Dolphins on Cape Cod Beach',
    excerpt: 'A coordinated rescue operation involving over 200 volunteers successfully returned a pod of stranded common dolphins to deep waters off the coast.',
    image: 'https://images.unsplash.com/photo-1570488344398-9b5f4b3c6c3b?w=600&h=400&fit=crop',
    category: 'rescue', tier: 'verified', author: 'Ocean Guardian Network', authorAvatar: 'OG',
    source: 'ZoikoSocial Verified Content', time: '6d ago', readTime: '4 min read',
    likes: 5678, comments: 890, featured: false, saved: false, url: '#',
  },
  {
    id: 'a10', title: 'Breakthrough in Avian Flu Vaccine Development for Poultry',
    excerpt: 'Scientists at the Royal Veterinary College have developed a new mRNA-based vaccine that could dramatically reduce avian flu outbreaks in commercial poultry flocks.',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=600&h=400&fit=crop',
    category: 'science', tier: 'institutional', author: 'Dr. Helen Park', authorAvatar: 'HP',
    source: 'Royal Veterinary College', time: '1w ago', readTime: '5 min read',
    likes: 1234, comments: 198, featured: false, saved: false, url: '#',
  },
]

function TierBadge({ tier }: { tier: Tier }): React.JSX.Element {
  const config = TIER_CONFIG[tier]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.bgColor} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

export default function NewsPage(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState<Set<string>>(new Set(['a1', 'a3', 'a5', 'a8']))
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  function toggleSave(id: string): void {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = ARTICLES.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== 'all' && a.category !== activeCategory) return false
    if (tierFilter !== 'all' && a.tier !== tierFilter) return false
    return true
  })

  const featuredArticles = filtered.filter((a) => a.featured)
  const regularArticles = filtered.filter((a) => !a.featured)

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
          <div className="lg:col-span-6 space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-headline-md font-bold text-on-surface">Verified News</h1>
                <p className="text-label-sm text-outline">Curated, fact-checked animal &amp; conservation news</p>
              </div>
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
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news articles..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
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
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Tier filter pills */}
            {showFilters && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
                <p className="text-[10px] font-bold tracking-wider uppercase text-outline mb-2">Source Tier</p>
                <div className="flex gap-2">
                  {(['all', 'institutional', 'verified', 'community'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTierFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${
                        tierFilter === t
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant text-on-surface-variant hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {t === 'all' ? 'All Sources' : TIER_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No articles found</h3>
                <p className="text-label-sm text-outline mb-4">Try a different category, search term, or filter</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all'); setTierFilter('all') }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Featured hero */}
                {featuredArticles.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-secondary" />
                      <h2 className="text-label-md font-bold text-on-surface">Top Stories</h2>
                    </div>
                    {featuredArticles.slice(0, 1).map((article) => (
                      <article
                        key={article.id}
                        className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TierBadge tier={article.tier} />
                              <span className="text-[10px] font-medium text-white/70 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {article.readTime}
                              </span>
                            </div>
                            <h3 className="text-label-md font-bold text-white leading-snug line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-[11px] text-white/70 mt-1 line-clamp-1">{article.excerpt}</p>
                          </div>
                        </div>
                        <div className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                              {article.authorAvatar}
                            </div>
                            <span className="text-[11px] text-outline">{article.author}</span>
                            <span className="text-[10px] text-outline/60">·</span>
                            <span className="text-[11px] text-outline">{article.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                saved.has(article.id) ? 'text-primary bg-primary/10' : 'text-outline hover:text-primary hover:bg-surface-container'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${saved.has(article.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}

                    {/* Second and third featured */}
                    {featuredArticles.length > 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {featuredArticles.slice(1, 3).map((article) => (
                          <article
                            key={article.id}
                            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                          >
                            <div className="relative h-32 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              <div className="absolute top-2 left-2">
                                <TierBadge tier={article.tier} />
                              </div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <h3 className="text-label-sm font-bold text-white leading-tight line-clamp-2">{article.title}</h3>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-[11px] text-outline line-clamp-2 mb-2">{article.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-outline/60">{article.time} · {article.readTime}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    saved.has(article.id) ? 'text-primary' : 'text-outline hover:text-primary'
                                  }`}
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${saved.has(article.id) ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Latest news */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Newspaper className="w-4 h-4 text-primary" />
                    <h2 className="text-label-md font-bold text-on-surface">
                      {activeCategory === 'all' ? 'Latest News' : CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'Articles'}
                    </h2>
                    <span className="text-label-sm text-outline">({regularArticles.length})</span>
                  </div>

                  <div className="space-y-3">
                    {regularArticles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Thumbnail */}
                          <div className="sm:w-44 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <TierBadge tier={article.tier} />
                                <span className="text-[10px] text-outline/60">{article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                              </div>
                              <h3 className="text-label-md font-bold text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug">
                                {article.title}
                              </h3>
                              <p className="text-[11px] text-outline leading-relaxed line-clamp-2">{article.excerpt}</p>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[9px] font-bold text-on-surface-variant">
                                  {article.authorAvatar}
                                </div>
                                <div>
                                  <span className="text-[10px] font-medium text-on-surface-variant">{article.author}</span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-outline/60">
                                    <Clock className="w-3 h-3" />
                                    <span>{article.time}</span>
                                    <span>·</span>
                                    <BookOpen className="w-3 h-3" />
                                    <span>{article.readTime}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-2 mr-2 text-[10px] text-outline/60">
                                  <span className="flex items-center gap-0.5">
                                    <Heart className="w-3 h-3" />
                                    {article.likes >= 1000 ? `${(article.likes / 1000).toFixed(1)}k` : article.likes}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <MessageSquare className="w-3 h-3" />
                                    {article.comments}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    saved.has(article.id) ? 'text-primary bg-primary/10' : 'text-outline hover:text-primary hover:bg-surface-container'
                                  }`}
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${saved.has(article.id) ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Load more */}
                {regularArticles.length >= 8 && (
                  <div className="text-center pt-2">
                    <button className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all duration-200 cursor-pointer">
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="news" />
    </>
  )
}
