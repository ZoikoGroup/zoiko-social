'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, BadgeCheck, ChevronLeft, Users } from 'lucide-react'
import { SkeletonPeopleGrid } from '@/components/Skeletons'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { PeopleCard } from '@/components/PeopleCard'
import { PendingInvitations } from '@/components/PendingInvitations'
import { RightPanel } from '@/components/RightPanel'
import { networkApi, type FollowSuggestion } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const CATEGORY_FILTERS = [
  { slug: 'all', label: 'All' },
  { slug: 'veterinarian', label: 'Veterinarians' },
  { slug: 'pet_care_service_provider', label: 'Pet Care' },
  { slug: 'product_seller', label: 'Sellers' },
  { slug: 'verified_news_publisher', label: 'News Publishers' },
  { slug: 'personal', label: 'Pet Lovers' },
]

export default function NetworkPage(): React.JSX.Element {
  const toast = useToast()
  // Support deep links from the header search: /network?q=term
  const [search, setSearch] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') ?? ''
  })
  const [activeCategory, setActiveCategory] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([])
  const [searchResults, setSearchResults] = useState<FollowSuggestion[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let cancelled = false
    networkApi.getSuggestions()
      .then((data) => { if (!cancelled) setSuggestions(data) })        .catch(() => { if (!cancelled) toast.error('Failed to load suggestions', 'Could not fetch people you may know') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Server-side search across ALL accounts (debounced) — not just suggestions
  useEffect(() => {
    let cancelled = false
    const q = search.trim()

    const timer = setTimeout(() => {
      if (cancelled) return
      if (q.length < 2) {
        setSearchResults(null)
        setSearching(false)
        return
      }
      setSearching(true)
      networkApi.search(q, 20)
        .then((data) => { if (!cancelled) setSearchResults(data) })
        .catch(() => {
          if (!cancelled) {
            setSearchResults([])
            toast.error('Search failed', 'Could not search for people. Please try again.')
          }
        })
        .finally(() => { if (!cancelled) setSearching(false) })
    }, 350)

    return () => { cancelled = true; clearTimeout(timer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const isSearchMode = search.trim().length >= 2
  const source = isSearchMode ? (searchResults ?? []) : suggestions

  const filtered = source.filter((p) => {
    if (activeCategory === 'personal' && p.isProfessional) return false
    if (activeCategory !== 'all' && activeCategory !== 'personal' && p.professionalCategory !== activeCategory) return false
    if (verifiedOnly && !p.isVerified) return false
    return true
  })

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter">

            {/* Left: filters */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 sticky top-24 space-y-5">
                <h3 className="font-headline text-headline-md text-on-surface">Filter</h3>

                {/* Verified toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-label-md text-on-surface">
                    <BadgeCheck className="w-4 h-4 text-primary" />Verified only
                  </span>
                  <button
                    role="switch"
                    aria-checked={verifiedOnly}
                    onClick={() => setVerifiedOnly((v) => !v)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${verifiedOnly ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>

                {/* Category filter */}
                <div>
                  <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Category</p>
                  <div className="space-y-1">
                    {CATEGORY_FILTERS.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => setActiveCategory(c.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-label-md transition-colors cursor-pointer ${
                          activeCategory === c.slug ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center */}
            <div className="lg:col-span-6 space-y-gutter pb-20">
              {/* Back button + search */}
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer flex-shrink-0"
                  aria-label="Back to home"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, username, or category…"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters((f) => !f)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile filter chips */}
              {showFilters && (
                <div className="lg:hidden bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_FILTERS.map((c) => (
                      <button key={c.slug} onClick={() => setActiveCategory(c.slug)}
                        className={`px-3 py-1 rounded-full text-label-sm transition-colors cursor-pointer ${activeCategory === c.slug ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}
                      >{c.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending follow requests */}
              <PendingInvitations />

              {/* Search results / People you may know */}
              <section>
                <h2 className="font-headline text-headline-md text-on-surface mb-4">
                  {isSearchMode ? `Results for “${search.trim()}”` : 'People you may know'}
                  {isSearchMode && !searching && (
                    <span className="ml-2 text-label-sm text-outline font-normal">({filtered.length} found)</span>
                  )}
                </h2>
                {(isSearchMode ? searching : loading) ? (
                  <SkeletonPeopleGrid count={4} />
                ) : filtered.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-outline" />
                    </div>
                    <p className="text-label-md font-semibold text-on-surface">
                      {isSearchMode ? 'No accounts found' : suggestions.length === 0 ? 'No suggestions yet' : 'No results found'}
                    </p>
                    <p className="text-label-sm text-outline mt-1 max-w-sm mx-auto">
                      {isSearchMode
                        ? 'Check the spelling or try a different name or username.'
                        : suggestions.length === 0
                          ? 'Follow a few people and we’ll suggest accounts based on your connections.'
                          : 'Try adjusting your filters.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filtered.map((p) => <PeopleCard key={p.id} suggestion={p} />)}
                  </div>
                )}
              </section>
            </div>

            {/* Right */}
            <div className="lg:col-span-3 hidden xl:block">
              <RightPanel />
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="network" />
    </>
  )
}
