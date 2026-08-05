'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, ChevronLeft, Users, Hash, FileText, Newspaper, ShoppingBag,
  Heart, MessageCircle, Loader2, CalendarDays, PawPrint, MapPin, Stethoscope,
  BadgeCheck, Siren,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { PeopleCard } from '@/components/PeopleCard'
import { CommunityCard } from '@/components/communities/CommunityCard'
import { UserAvatar } from '@/components/UserAvatar'
import { useCurrency } from '@/hooks/use-currency'
import { useToast } from '@/hooks/use-toast'
import {
  searchApi,
  type SearchAllResult, type FollowSuggestion, type PostItem,
  type CommunityCard as CommunityCardData, type NewsArticle, type Product,
  type EventItem, type AdoptionListing, type LostFoundReport, type Provider,
} from '@/lib/api'

type Tab =
  | 'all' | 'people' | 'hashtags' | 'posts' | 'communities' | 'news' | 'products'
  | 'events' | 'adoption' | 'lostFound' | 'providers'

// Pets, adoption, events, vets and missing animals are what this platform is
// actually for, so they sit alongside the social categories rather than being
// reachable only from their own browse pages.
const TABS: { key: Tab; label: string; Icon: typeof Search }[] = [
  { key: 'all', label: 'All', Icon: Search },
  { key: 'people', label: 'People', Icon: Users },
  { key: 'hashtags', label: 'Hashtags', Icon: Hash },
  { key: 'posts', label: 'Posts', Icon: FileText },
  { key: 'adoption', label: 'Adoption', Icon: PawPrint },
  { key: 'lostFound', label: 'Lost & Found', Icon: Siren },
  { key: 'events', label: 'Events', Icon: CalendarDays },
  { key: 'providers', label: 'Vets & Care', Icon: Stethoscope },
  { key: 'communities', label: 'Communities', Icon: Users },
  { key: 'news', label: 'News', Icon: Newspaper },
  { key: 'products', label: 'Products', Icon: ShoppingBag },
]

const PAGE_SIZE = 20
const MAX_LIMIT = 60

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

export default function SearchPage(): React.JSX.Element {
  const router = useRouter()
  const toast = useToast()
  const { format: formatMoney } = useCurrency()

  // Support deep links from the header search: /search?q=term
  const [query, setQuery] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') ?? ''
  })
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)

  const [allResult, setAllResult] = useState<SearchAllResult | null>(null)
  const [people, setPeople] = useState<FollowSuggestion[]>([])
  const [hashtags, setHashtags] = useState<{ tag: string; postsCount: number }[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [communities, setCommunities] = useState<CommunityCardData[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [adoption, setAdoption] = useState<AdoptionListing[]>([])
  const [lostFound, setLostFound] = useState<LostFoundReport[]>([])
  const [providers, setProviders] = useState<Provider[]>([])

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    setLimit(PAGE_SIZE)
  }, [])

  const goToTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setLimit(PAGE_SIZE)
  }, [])

  useEffect(() => {
    let cancelled = false
    const q = query.trim()

    const timer = setTimeout(() => {
      if (cancelled) return
      if (q.length < 2) {
        setAllResult(null); setPeople([]); setHashtags([]); setPosts([])
        setCommunities([]); setNews([]); setProducts([])
        setEvents([]); setAdoption([]); setLostFound([]); setProviders([])
        setLoading(false)
        return
      }

      setLoading(true)
      const task =
        activeTab === 'all' ? searchApi.all(q).then((d) => { if (!cancelled) setAllResult(d) }) :
        activeTab === 'people' ? searchApi.people(q, limit).then((d) => { if (!cancelled) setPeople(d) }) :
        activeTab === 'hashtags' ? searchApi.hashtags(q, limit).then((d) => { if (!cancelled) setHashtags(d) }) :
        activeTab === 'posts' ? searchApi.posts(q, limit).then((d) => { if (!cancelled) setPosts(d) }) :
        activeTab === 'communities' ? searchApi.communities(q, limit).then((d) => { if (!cancelled) setCommunities(d) }) :
        activeTab === 'news' ? searchApi.news(q, limit).then((d) => { if (!cancelled) setNews(d) }) :
        activeTab === 'events' ? searchApi.events(q, limit).then((d) => { if (!cancelled) setEvents(d) }) :
        activeTab === 'adoption' ? searchApi.adoption(q, limit).then((d) => { if (!cancelled) setAdoption(d) }) :
        activeTab === 'lostFound' ? searchApi.lostFound(q, limit).then((d) => { if (!cancelled) setLostFound(d) }) :
        activeTab === 'providers' ? searchApi.providers(q, limit).then((d) => { if (!cancelled) setProviders(d) }) :
        searchApi.products(q, limit).then((d) => { if (!cancelled) setProducts(d) })

      task
        .catch(() => { if (!cancelled) toast.error('Search failed', 'Could not load results. Please try again.') })
        .finally(() => { if (!cancelled) setLoading(false) })

      router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
    }, 300)

    return () => { cancelled = true; clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTab, limit])

  const isSearching = query.trim().length >= 2
  const showLoadMore = activeTab !== 'all' && limit < MAX_LIMIT

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          <div className="max-w-4xl mx-auto space-y-gutter pb-20">

            {/* Back + search input */}
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
                  autoFocus
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search people, pets for adoption, missing pets, vets, events…"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => goToTab(t.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-label-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === t.key
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  <t.Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {!isSearching ? (
              <EmptyState
                icon={Search}
                title="Search ZoikoSocial"
                subtitle="Find people, pets looking for a home, missing pets, vets, events, communities, news and products — all in one place."
              />
            ) : loading && !allResult && people.length === 0 && hashtags.length === 0 && posts.length === 0 && communities.length === 0 && news.length === 0 && products.length === 0 && events.length === 0 && adoption.length === 0 && lostFound.length === 0 && providers.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-outline animate-spin" />
              </div>
            ) : activeTab === 'all' ? (
              <AllResults result={allResult} onSeeAll={goToTab} formatMoney={formatMoney} />
            ) : (
              <>
                {activeTab === 'people' && (
                  people.length === 0
                    ? <EmptyState icon={Users} title="No people found" subtitle="Try a different name or username." />
                    : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{people.map((p) => <PeopleCard key={p.id} suggestion={p} />)}</div>
                )}
                {activeTab === 'hashtags' && (
                  hashtags.length === 0
                    ? <EmptyState icon={Hash} title="No hashtags found" subtitle="Try a different keyword." />
                    : <div className="flex flex-wrap gap-2">{hashtags.map((h) => <HashtagChip key={h.tag} tag={h.tag} postsCount={h.postsCount} />)}</div>
                )}
                {activeTab === 'posts' && (
                  posts.length === 0
                    ? <EmptyState icon={FileText} title="No posts found" subtitle="Try a different keyword." />
                    : <div className="space-y-2">{posts.map((p) => <PostRow key={p.id} post={p} />)}</div>
                )}
                {activeTab === 'communities' && (
                  communities.length === 0
                    ? <EmptyState icon={Users} title="No communities found" subtitle="Try a different name or tag." />
                    : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{communities.map((c) => <CommunityCard key={c.id} community={c} />)}</div>
                )}
                {activeTab === 'news' && (
                  news.length === 0
                    ? <EmptyState icon={Newspaper} title="No articles found" subtitle="Try a different keyword." />
                    : <div className="space-y-2">{news.map((a) => <NewsRow key={a.id} article={a} />)}</div>
                )}
                {activeTab === 'products' && (
                  products.length === 0
                    ? <EmptyState icon={ShoppingBag} title="No products found" subtitle="Try a different keyword." />
                    : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{products.map((p) => <ProductTile key={p.id} product={p} formatMoney={formatMoney} />)}</div>
                )}
                {activeTab === 'adoption' && (
                  adoption.length === 0
                    ? <EmptyState icon={PawPrint} title="No pets found" subtitle="Try a breed, species or place — or browse all listings on the Adoption page." />
                    : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{adoption.map((l) => <AdoptionTile key={l.id} listing={l} />)}</div>
                )}
                {activeTab === 'lostFound' && (
                  lostFound.length === 0
                    ? <EmptyState icon={Siren} title="No reports found" subtitle="Try a pet name, breed or the area they went missing." />
                    : <div className="space-y-2">{lostFound.map((r) => <LostFoundRow key={r.id} report={r} />)}</div>
                )}
                {activeTab === 'events' && (
                  events.length === 0
                    ? <EmptyState icon={CalendarDays} title="No events found" subtitle="Try a different name, place or category." />
                    : <div className="space-y-2">{events.map((e) => <EventRow key={e.id} event={e} />)}</div>
                )}
                {activeTab === 'providers' && (
                  providers.length === 0
                    ? <EmptyState icon={Stethoscope} title="No vets or providers found" subtitle="Try a clinic name, a service like grooming, or a town." />
                    : <div className="space-y-2">{providers.map((p) => <ProviderRow key={p.id} provider={p} />)}</div>
                )}

                {showLoadMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setLimit((l) => Math.min(l + PAGE_SIZE, MAX_LIMIT))}
                      disabled={loading}
                      className="px-5 py-2 rounded-full border border-outline-variant text-label-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {loading ? 'Loading…' : 'Load more'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <MobileTabs currentPage="search" />
    </>
  )
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof Search; title: string; subtitle: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-outline" />
      </div>
      <p className="text-label-md font-semibold text-on-surface">{title}</p>
      <p className="text-label-sm text-outline mt-1 max-w-sm mx-auto">{subtitle}</p>
    </div>
  )
}

function SectionHeader({ label, count, onSeeAll }: { label: string; count: number; onSeeAll?: () => void }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-headline text-headline-sm text-on-surface">{label}</h2>
      {onSeeAll && count > 0 && (
        <button onClick={onSeeAll} className="text-label-sm font-semibold text-primary hover:underline cursor-pointer">
          See all
        </button>
      )}
    </div>
  )
}

function AllResults({
  result, onSeeAll, formatMoney,
}: {
  result: SearchAllResult | null
  onSeeAll: (tab: Tab) => void
  formatMoney: (amount: number, from?: string) => string
}): React.JSX.Element {
  if (!result) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-outline animate-spin" /></div>

  const hasAny = result.people.length > 0 || result.hashtags.length > 0 || result.posts.length > 0
    || result.communities.length > 0 || result.news.length > 0 || result.products.length > 0
    || result.events.length > 0 || result.adoption.length > 0
    || result.lostFound.length > 0 || result.providers.length > 0

  if (!hasAny) {
    return <EmptyState icon={Search} title={`No results for "${result.query}"`} subtitle="Try a different name, keyword or hashtag." />
  }

  return (
    <div className="space-y-7">
      {result.people.length > 0 && (
        <section>
          <SectionHeader label="People" count={result.people.length} onSeeAll={() => onSeeAll('people')} />
          <div className="flex gap-4 overflow-x-auto pb-1">
            {result.people.map((p) => <div key={p.id} className="w-40 flex-shrink-0"><PeopleCard suggestion={p} /></div>)}
          </div>
        </section>
      )}

      {result.hashtags.length > 0 && (
        <section>
          <SectionHeader label="Hashtags" count={result.hashtags.length} onSeeAll={() => onSeeAll('hashtags')} />
          <div className="flex flex-wrap gap-2">
            {result.hashtags.map((h) => <HashtagChip key={h.tag} tag={h.tag} postsCount={h.postsCount} />)}
          </div>
        </section>
      )}

      {/* A missing pet outranks everything else on the page — if someone is
          searching for one, that is the whole reason they are here. */}
      {result.lostFound.length > 0 && (
        <section>
          <SectionHeader label="Lost & Found" count={result.lostFound.length} onSeeAll={() => onSeeAll('lostFound')} />
          <div className="space-y-2">{result.lostFound.map((r) => <LostFoundRow key={r.id} report={r} />)}</div>
        </section>
      )}

      {result.adoption.length > 0 && (
        <section>
          <SectionHeader label="Looking for a home" count={result.adoption.length} onSeeAll={() => onSeeAll('adoption')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.adoption.map((l) => <AdoptionTile key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {result.providers.length > 0 && (
        <section>
          <SectionHeader label="Vets & pet care" count={result.providers.length} onSeeAll={() => onSeeAll('providers')} />
          <div className="space-y-2">{result.providers.map((p) => <ProviderRow key={p.id} provider={p} />)}</div>
        </section>
      )}

      {result.events.length > 0 && (
        <section>
          <SectionHeader label="Events" count={result.events.length} onSeeAll={() => onSeeAll('events')} />
          <div className="space-y-2">{result.events.map((e) => <EventRow key={e.id} event={e} />)}</div>
        </section>
      )}

      {result.posts.length > 0 && (
        <section>
          <SectionHeader label="Posts" count={result.posts.length} onSeeAll={() => onSeeAll('posts')} />
          <div className="space-y-2">{result.posts.map((p) => <PostRow key={p.id} post={p} />)}</div>
        </section>
      )}

      {result.communities.length > 0 && (
        <section>
          <SectionHeader label="Communities" count={result.communities.length} onSeeAll={() => onSeeAll('communities')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.communities.map((c) => <CommunityCard key={c.id} community={c} />)}
          </div>
        </section>
      )}

      {result.news.length > 0 && (
        <section>
          <SectionHeader label="News" count={result.news.length} onSeeAll={() => onSeeAll('news')} />
          <div className="space-y-2">{result.news.map((a) => <NewsRow key={a.id} article={a} />)}</div>
        </section>
      )}

      {result.products.length > 0 && (
        <section>
          <SectionHeader label="Products" count={result.products.length} onSeeAll={() => onSeeAll('products')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.products.map((p) => <ProductTile key={p.id} product={p} formatMoney={formatMoney} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function HashtagChip({ tag, postsCount }: { tag: string; postsCount: number }): React.JSX.Element {
  return (
    <Link
      href={`/explore/tags/${encodeURIComponent(tag)}`}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors group"
    >
      <Hash className="w-3.5 h-3.5 text-primary" />
      <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{tag}</span>
      <span className="text-[11px] text-outline">{postsCount}</span>
    </Link>
  )
}

function PostRow({ post }: { post: PostItem }): React.JSX.Element {
  const thumb = post.media[0]?.thumbnailUrl ?? post.media[0]?.url ?? null
  return (
    <Link
      href={`/p/${post.id}`}
      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
    >
      <UserAvatar name={post.author.displayName} image={post.author.avatarUrl ?? undefined} size="sm" verified={post.author.isVerified} />
      <div className="flex-1 min-w-0">
        <p className="text-label-sm font-semibold text-on-surface truncate">{post.author.displayName}</p>
        <p className="text-[12px] text-outline line-clamp-1">{post.caption ?? '(no caption)'}</p>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-outline">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likesCount}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.commentsCount}</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
      </div>
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
      )}
    </Link>
  )
}

function NewsRow({ article }: { article: NewsArticle }): React.JSX.Element {
  return (
    <Link
      href={`/news/${article.id}`}
      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
    >
      <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center">
        {article.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : <Newspaper className="w-5 h-5 text-outline" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label-sm font-semibold text-on-surface line-clamp-1">{article.title}</p>
        <p className="text-[12px] text-outline line-clamp-1">{article.excerpt}</p>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-outline capitalize">
          <span>{article.category}</span>·<span>{article.tier}</span>
        </div>
      </div>
    </Link>
  )
}

function ProductTile({
  product, formatMoney,
}: { product: Product; formatMoney: (amount: number, from?: string) => string }): React.JSX.Element {
  return (
    <Link
      href={`/shop/${product.id}`}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 transition-colors group"
    >
      <div className="aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
        {product.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : <ShoppingBag className="w-6 h-6 text-outline" />}
      </div>
      <div className="p-3">
        <p className="text-label-sm font-semibold text-on-surface line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">{product.title}</p>
        <p className="text-label-md font-bold text-on-surface mt-1">{formatMoney(product.price, product.currency)}</p>
      </div>
    </Link>
  )
}

// ── The pet surfaces ─────────────────────────────────────────────────────────

function AdoptionTile({ listing }: { listing: AdoptionListing }): React.JSX.Element {
  const detail = [listing.breed, listing.age, listing.sex].filter(Boolean).join(' · ')
  return (
    <Link
      href={`/adoption/${listing.id}`}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 transition-colors group"
    >
      <div className="aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
        {listing.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : <PawPrint className="w-6 h-6 text-outline" />}
      </div>
      <div className="p-3">
        <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
          {listing.name || listing.species}
        </p>
        {detail && <p className="text-[11px] text-outline truncate mt-0.5">{detail}</p>}
        {listing.location && (
          <p className="flex items-center gap-1 text-[11px] text-outline truncate mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />{listing.location}
          </p>
        )}
      </div>
    </Link>
  )
}

function LostFoundRow({ report }: { report: LostFoundReport }): React.JSX.Element {
  const isLost = report.kind === 'lost'
  const detail = [report.breed, report.color, report.sex].filter(Boolean).join(' · ')
  return (
    <Link
      href={`/lost-found/${report.id}`}
      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
    >
      <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center">
        {report.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={report.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : <PawPrint className="w-5 h-5 text-outline" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
            isLost ? 'bg-red-500/15 text-red-600' : 'bg-emerald-500/15 text-emerald-600'
          }`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
          <p className="text-label-sm font-semibold text-on-surface truncate">
            {report.petName ?? report.species}
          </p>
        </div>
        {detail && <p className="text-[12px] text-outline truncate mt-0.5">{detail}</p>}
        {report.lastSeenLocation && (
          <p className="flex items-center gap-1 text-[11px] text-outline truncate mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />Last seen near {report.lastSeenLocation}
          </p>
        )}
      </div>
      {report.reward !== null && report.reward > 0 && (
        <span className="flex-shrink-0 text-[11px] font-semibold text-secondary">Reward</span>
      )}
    </Link>
  )
}

function EventRow({ event }: { event: EventItem }): React.JSX.Element {
  const when = new Date(event.startsAt)
  const place = event.isOnline ? 'Online' : (event.venueName ?? event.location)
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
    >
      {/* Date block rather than a cover image: when it happens is the thing
          someone scanning a list of events actually needs. */}
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex-shrink-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold uppercase text-primary leading-none">
          {when.toLocaleDateString('en-GB', { month: 'short' })}
        </span>
        <span className="text-label-md font-bold text-primary leading-tight">{when.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-label-sm font-semibold text-on-surface truncate">{event.title}</p>
          {event.inviteOnly && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold uppercase tracking-wide">
              Invite only
            </span>
          )}
        </div>
        <p className="text-[12px] text-outline truncate mt-0.5">
          {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          {place ? ` · ${place}` : ''}
        </p>
        <p className="text-[11px] text-outline mt-0.5">
          {event.goingCount} going{event.isFree ? ' · Free' : ''}
        </p>
      </div>
    </Link>
  )
}

function ProviderRow({ provider }: { provider: Provider }): React.JSX.Element {
  const isVet = provider.category === 'vet'
  return (
    <Link
      href={`/${isVet ? 'vet-finder' : 'pet-care'}/${provider.id}`}
      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
    >
      <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center">
        {provider.logoUrl ?? provider.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={provider.logoUrl ?? provider.coverUrl ?? ''} alt="" className="w-full h-full object-cover" />
        ) : <Stethoscope className="w-5 h-5 text-outline" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-label-sm font-semibold text-on-surface truncate">{provider.name}</p>
          {provider.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
        </div>
        <p className="text-[12px] text-outline truncate mt-0.5">
          {provider.serviceType ?? (isVet ? 'Veterinary clinic' : 'Pet care')}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-outline">
          {provider.location && (
            <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{provider.location}</span>
          )}
          {provider.emergencyAvailable && <span className="text-red-600 font-semibold">Emergency</span>}
        </div>
      </div>
    </Link>
  )
}
