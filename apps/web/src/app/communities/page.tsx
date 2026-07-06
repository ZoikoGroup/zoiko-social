'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, ChevronLeft, Users } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { CommunityCard } from '@/components/communities/CommunityCard'
import { CreateCommunityModal } from '@/components/communities/CreateCommunityModal'
import { communitiesApi, type CommunityCard as CommunityCardData, type CommunityCategory } from '@/lib/api'
import { useRouter } from 'next/navigation'

function GridSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="h-20 bg-surface-container animate-pulse" />
          <div className="px-4 pb-4 -mt-6 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-surface-container animate-pulse" />
            <div className="h-3.5 w-24 bg-surface-container rounded animate-pulse" />
            <div className="h-3 w-32 bg-surface-container rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CommunitiesPage(): React.JSX.Element {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [sort, setSort] = useState<'popular' | 'newest'>('popular')
  const [communities, setCommunities] = useState<CommunityCardData[]>([])
  const [categories, setCategories] = useState<CommunityCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    communitiesApi.categories().then(setCategories).catch(() => {})
  }, [])

  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const result = await communitiesApi.browse({
        q: search.trim() || undefined,
        category: category || undefined,
        sort,
      })
      setCommunities(result.data)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [search, category, sort])

  // Debounced reload on filter changes
  useEffect(() => {
    const timer = setTimeout(() => { void load() }, search ? 350 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-gutter pb-24">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer" aria-label="Back">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-headline text-headline-lg text-on-surface">Communities</h1>
              <p className="text-label-sm text-outline">Find your people — by species, cause, or expertise</p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>

          {/* Search + sort */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities…"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'popular' | 'newest')}
              className="px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1.5 rounded-full text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
                category === '' ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`px-3 py-1.5 rounded-full text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
                  category === c.slug ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <GridSkeleton />
          ) : communities.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-label-md font-semibold text-on-surface">
                {search ? 'No communities found' : 'No communities yet'}
              </p>
              <p className="text-label-sm text-outline mt-1 max-w-sm mx-auto">
                {search ? 'Try a different search or category.' : 'Be the first — create a community for your corner of the animal world.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {communities.map((c) => <CommunityCard key={c.id} community={c} />)}
            </div>
          )}
        </div>
      </main>

      <CreateCommunityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(community) => { setCreateOpen(false); router.push(`/c/${community.slug}`) }}
      />
      <MobileTabs currentPage="communities" />
    </>
  )
}
