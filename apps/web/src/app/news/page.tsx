'use client'

import { useCallback, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  Newspaper, Search, Bookmark, Clock, BadgeCheck, ShieldCheck,
  Globe, TrendingUp, Filter, Heart, BookOpen, PenSquare, Loader2, X, ImagePlus, MessageCircle,
} from 'lucide-react'
import { newsApi, type NewsArticle, type NewArticle } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { uploadCommunityImage } from '@/lib/community-image'
import { UserAvatar } from '@/components/UserAvatar'

type Tier = 'institutional' | 'verified' | 'community'

const TIER_CONFIG: Record<Tier, { label: string; icon: typeof ShieldCheck; color: string; bgColor: string }> = {
  institutional: { label: 'Institutional', icon: ShieldCheck, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  verified:      { label: 'Verified',      icon: BadgeCheck,  color: 'text-secondary', bgColor: 'bg-amber-50 border-amber-200' },
  community:     { label: 'Community',      icon: Globe,       color: 'text-primary',   bgColor: 'bg-teal-50 border-teal-200' },
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all',       label: 'All News' },
  { id: 'policy',    label: 'Policy & Law' },
  { id: 'science',   label: 'Animal Science' },
  { id: 'rescue',    label: 'Rescue Stories' },
  { id: 'health',    label: 'Pet Health' },
  { id: 'climate',   label: 'Climate & Habitat' },
  { id: 'community', label: 'Community' },
]

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n)
}
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TierBadge({ tier }: { tier: string }): React.JSX.Element {
  const config = TIER_CONFIG[(tier as Tier)] ?? TIER_CONFIG.community
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.bgColor} ${config.color}`}>
      <Icon className="w-3 h-3" />{config.label}
    </span>
  )
}

function SaveButton({ article, small }: { article: NewsArticle; small?: boolean }): React.JSX.Element {
  const [saved, setSaved] = useState(article.viewerSaved)
  // Re-sync when the server truth for this article changes (e.g. after a filter refetch).
  const [seen, setSeen] = useState(article.viewerSaved)
  if (seen !== article.viewerSaved) { setSeen(article.viewerSaved); setSaved(article.viewerSaved) }
  async function toggle(e: React.MouseEvent): Promise<void> {
    e.preventDefault(); e.stopPropagation()
    const next = !saved
    setSaved(next)
    try { await (next ? newsApi.save(article.id) : newsApi.unsave(article.id)) } catch { setSaved(!next) }
  }
  const sz = small ? 'w-3.5 h-3.5' : 'w-4 h-4'
  return (
    <button onClick={toggle} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${saved ? 'text-primary bg-primary/10' : 'text-outline hover:text-primary hover:bg-surface-container'}`}>
      <Bookmark className={`${sz} ${saved ? 'fill-current' : ''}`} />
    </button>
  )
}

export default function NewsPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured] = useState<NewsArticle[]>([])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [category, setCategory] = useState('all')
  const [tier, setTier] = useState<Tier | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)

  const filters = useCallback(() => ({
    ...(category !== 'all' ? { category } : {}),
    ...(tier !== 'all' ? { tier } : {}),
    ...(search.trim() ? { q: search.trim() } : {}),
  }), [category, tier, search])

  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => {
      if (cancelled) return
      setLoading(true)
      Promise.all([newsApi.featured(3), newsApi.browse(filters(), null, 12)])
        .then(([feat, page]) => {
          if (cancelled) return
          setFeatured(feat)
          setArticles(page.data)
          setCursor(page.nextCursor)
          setHasMore(page.hasMore)
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 250)
    return () => { cancelled = true; clearTimeout(t) }
  }, [filters])

  function loadMore(): void {
    if (loadingMore || !cursor) return
    setLoadingMore(true)
    newsApi.browse(filters(), cursor, 12)
      .then((page) => {
        setArticles((prev) => {
          const seen = new Set(prev.map((a) => a.id))
          return [...prev, ...page.data.filter((a) => !seen.has(a.id))]
        })
        setCursor(page.nextCursor)
        setHasMore(page.hasMore)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }

  const showFeatured = category === 'all' && tier === 'all' && !search.trim()
  const featuredIds = new Set(featured.map((a) => a.id))
  // Only de-dupe against the featured section when it's actually rendered — otherwise
  // a filtered view would silently drop articles that happen to be in the global top-3.
  const latest = showFeatured ? articles.filter((a) => !featuredIds.has(a.id)) : articles

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-4 pb-20">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h1 className="font-headline text-headline-md font-bold text-on-surface">Verified News</h1>
                <p className="text-label-sm text-outline">Curated, fact-checked animal &amp; conservation news</p>
              </div>
              {isAuthenticated && (
                <button onClick={() => setComposeOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                  <PenSquare className="w-4 h-4" /><span className="hidden sm:inline">Write</span>
                </button>
              )}
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold transition-all cursor-pointer ${showFilters ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                <Filter className="w-4 h-4" /><span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news articles..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50" />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${category === cat.id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {showFilters && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
                <p className="text-[10px] font-bold tracking-wider uppercase text-outline mb-2">Source Tier</p>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'institutional', 'verified', 'community'] as const).map((t) => (
                    <button key={t} onClick={() => setTier(t)}
                      className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${tier === t ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary/30 hover:text-primary'}`}>
                      {t === 'all' ? 'All Sources' : TIER_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <div key={i} className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}
              </div>
            ) : latest.length === 0 && featured.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No articles yet</h3>
                <p className="text-label-sm text-outline mb-4">Be the first to publish verified news for the community.</p>
                {isAuthenticated && (
                  <button onClick={() => setComposeOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Write an Article</button>
                )}
              </div>
            ) : (
              <>
                {showFeatured && featured.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-secondary" />
                      <h2 className="text-label-md font-bold text-on-surface">Top Stories</h2>
                    </div>
                    <div className="relative block bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
                      <Link href={`/news/${featured[0]!.id}`} aria-label={featured[0]!.title} className="absolute inset-0 z-10" />
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-surface-container">
                        {featured[0]!.coverUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featured[0]!.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TierBadge tier={featured[0]!.tier} />
                            <span className="text-[10px] font-medium text-white/80 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">{featured[0]!.readMinutes} min read</span>
                          </div>
                          <h3 className="text-label-md font-bold text-white leading-snug line-clamp-2">{featured[0]!.title}</h3>
                          <p className="text-[11px] text-white/70 mt-1 line-clamp-1">{featured[0]!.excerpt}</p>
                        </div>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={featured[0]!.author.displayName} image={featured[0]!.author.avatarUrl ?? undefined} size="sm" verified={featured[0]!.author.isVerified} />
                          <span className="text-[11px] text-outline">{featured[0]!.author.displayName}</span>
                          <span className="text-[10px] text-outline/60">·</span>
                          <span className="text-[11px] text-outline">{timeAgo(featured[0]!.publishedAt)}</span>
                        </div>
                        <span className="relative z-20"><SaveButton article={featured[0]!} /></span>
                      </div>
                    </div>

                    {featured.length > 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {featured.slice(1, 3).map((a) => (
                          <div key={a.id} className="relative block bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
                            <Link href={`/news/${a.id}`} aria-label={a.title} className="absolute inset-0 z-10" />
                            <div className="relative h-32 overflow-hidden bg-surface-container">
                              {a.coverUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={a.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              <div className="absolute top-2 left-2"><TierBadge tier={a.tier} /></div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <h3 className="text-label-sm font-bold text-white leading-tight line-clamp-2">{a.title}</h3>
                              </div>
                            </div>
                            <div className="p-3 flex items-center justify-between">
                              <span className="text-[10px] text-outline/60">{timeAgo(a.publishedAt)} · {a.readMinutes} min</span>
                              <span className="relative z-20"><SaveButton article={a} small /></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Newspaper className="w-4 h-4 text-primary" />
                    <h2 className="text-label-md font-bold text-on-surface">
                      {category === 'all' ? 'Latest News' : CATEGORIES.find((c) => c.id === category)?.label ?? 'Articles'}
                    </h2>
                    <span className="text-label-sm text-outline">({latest.length})</span>
                  </div>

                  <div className="space-y-3">
                    {latest.map((a) => (
                      <div key={a.id} className="relative block bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                        <Link href={`/news/${a.id}`} aria-label={a.title} className="absolute inset-0 z-10" />
                        <div className="flex flex-col sm:flex-row">
                          {a.coverUrl && (
                            <div className="sm:w-44 h-32 sm:h-auto flex-shrink-0 overflow-hidden bg-surface-container">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={a.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                          )}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <TierBadge tier={a.tier} />
                                <span className="text-[10px] text-outline/60 capitalize">{a.category}</span>
                              </div>
                              <h3 className="text-label-md font-bold text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug line-clamp-2">{a.title}</h3>
                              <p className="text-[11px] text-outline leading-relaxed line-clamp-2">{a.excerpt}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                              <div className="flex items-center gap-2 min-w-0">
                                <UserAvatar name={a.author.displayName} image={a.author.avatarUrl ?? undefined} size="sm" verified={a.author.isVerified} />
                                <div className="min-w-0">
                                  <span className="text-[10px] font-medium text-on-surface-variant truncate block">{a.author.displayName}</span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-outline/60">
                                    <Clock className="w-3 h-3" /><span>{timeAgo(a.publishedAt)}</span>
                                    <span>·</span><BookOpen className="w-3 h-3" /><span>{a.readMinutes} min</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 relative z-20">
                                <span className="flex items-center gap-0.5 text-[10px] text-outline/60 mr-1"><Heart className="w-3 h-3" />{compact(a.likesCount)}</span>
                                <span className="flex items-center gap-0.5 text-[10px] text-outline/60 mr-1"><MessageCircle className="w-3 h-3" />{compact(a.commentsCount)}</span>
                                <SaveButton article={a} small />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="text-center pt-4">
                      <button onClick={loadMore} disabled={loadingMore} className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all cursor-pointer inline-flex items-center gap-2">
                        {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}Load More Articles
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          {/* Right */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="news" />

      {composeOpen && (
        <WriteArticleModal
          onClose={() => setComposeOpen(false)}
          onPublished={(a) => { setComposeOpen(false); setArticles((prev) => [a, ...prev]) }}
        />
      )}
    </>
  )
}

function WriteArticleModal({ onClose, onPublished }: { onClose: () => void; onPublished: (a: NewsArticle) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('community')
  const [sourceName, setSourceName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const valid = title.trim().length >= 4 && excerpt.trim().length >= 10 && body.trim().length >= 20

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !profile) return
    setUploading(true)
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) } catch { setError('Cover upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (!valid || posting) return
    setPosting(true); setError('')
    try {
      const input: NewArticle = {
        title: title.trim(), excerpt: excerpt.trim(), body: body.trim(), category,
        ...(coverUrl ? { coverUrl } : {}),
        ...(sourceName.trim() ? { sourceName: sourceName.trim() } : {}),
        ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
      }
      onPublished(await newsApi.create(input))
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to publish') } finally { setPosting(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest">
          <h2 className="text-label-md font-bold text-on-surface">Write an Article</h2>
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
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                  {uploading ? 'Uploading…' : 'Add cover image'}
                </span>
              )}
              <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
            </div>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder="Headline"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-md border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={400} rows={2} placeholder="Short summary (shown in the feed)…"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={20000} rows={6} placeholder="Write the full article…"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
          <div className="flex gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none cursor-pointer">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} maxLength={160} placeholder="Source name (optional, e.g. Cambridge Vet Journal)"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} maxLength={600} placeholder="Source URL (optional)"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          {error && <p className="text-label-sm text-red-500">{error}</p>}
          <p className="text-[11px] text-outline">Your trust tier is set automatically from your verified status.</p>
          <button onClick={submit} disabled={!valid || posting || uploading}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {posting && <Loader2 className="w-4 h-4 animate-spin" />}{posting ? 'Publishing…' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  )
}
