'use client'

import { useEffect } from 'react'
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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  shopApi, newsApi, providersApi, feedApi,
  type Product, type ProductEnquiryInbox, type NewsArticle, type Provider, type PostItem,
  PROFESSIONAL_CATEGORY_LABELS,
} from '@/lib/api'

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  return sym ? `${sym}${amount.toLocaleString()}` : `${amount.toLocaleString()} ${currency}`
}
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 604800) return `${Math.floor(s / 86400)}d`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
  const { data, isLoading: loading } = useCachedValue<{ products: Product[]; inbox: ProductEnquiryInbox[] }>('dash:seller', async () => {
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Active listings" value={active} Icon={Package} tint="bg-primary/10 text-primary" />
        <StatTile label="Total saves" value={totalSaves} Icon={Heart} tint="bg-red-500/10 text-red-500" />
        <StatTile label="Enquiries" value={inbox.length} Icon={MailOpen} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Sold" value={sold} Icon={ShoppingBag} tint="bg-emerald-500/10 text-emerald-600" />
      </div>

      <Card title="My Listings" action={<Link href="/shop" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90"><Plus className="w-3.5 h-3.5" />List item</Link>}>
        {loading ? <Skeleton rows={3} /> : products.length === 0 ? (
          <Empty text="No products listed yet." />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="flex items-center gap-3 py-2.5 group">
                <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                  <Thumb url={p.coverUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{p.title}</p>
                  <p className="text-[11px] text-outline">{money(p.price, p.currency)} · {p.stock} in stock</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-0.5 text-[11px] text-outline"><Heart className="w-3 h-3" />{p.savesCount}</span>
                  <StatusPill status={p.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card title="Enquiry Inbox">
        {loading ? <Skeleton rows={2} /> : inbox.length === 0 ? (
          <Empty text="No enquiries yet. Buyers who message you appear here." />
        ) : (
          <div className="space-y-3">
            {inbox.map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <Link href={`/profile/${e.buyer.username}`}><UserAvatar name={e.buyer.displayName} image={e.buyer.avatarUrl ?? undefined} size="sm" verified={e.buyer.isVerified} /></Link>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm text-on-surface"><span className="font-semibold">{e.buyer.displayName}</span> <span className="text-outline">· {timeAgo(e.createdAt)}</span></p>
                  <p className="text-[11px] text-outline">on <Link href={`/shop/${e.product.id}`} className="text-primary hover:underline">{e.product.title}</Link></p>
                  {e.message && <p className="text-label-sm text-on-surface-variant mt-0.5">{e.message}</p>}
                </div>
                <StatusPill status={e.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

// ── Verified News Publisher ──────────────────────────────────────────────────
function PublisherDashboard(): React.JSX.Element {
  const { data, isLoading: loading } = useCachedValue<NewsArticle[]>('dash:publisher', () => newsApi.mine())
  const articles = data ?? []

  const likes = articles.reduce((s, a) => s + a.likesCount, 0)
  const saves = articles.reduce((s, a) => s + a.savesCount, 0)
  const comments = articles.reduce((s, a) => s + a.commentsCount, 0)

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
              <Link key={a.id} href={`/news/${a.id}`} className="flex items-center gap-3 py-2.5 group">
                <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                  <Thumb url={a.coverUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{a.title}</p>
                  <p className="text-[11px] text-outline capitalize">{a.category} · {timeAgo(a.publishedAt)}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 text-[11px] text-outline">
                  <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{a.likesCount}</span>
                  <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{a.commentsCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

// ── Veterinarian ─────────────────────────────────────────────────────────────
function VetDashboard(): React.JSX.Element {
  const { profile } = useAuth()
  const pid = profile?.id ?? ''
  const { data, isLoading: loading } = useCachedValue<{ tips: PostItem[]; listings: Provider[] }>(`dash:vet:${pid}`, async () => {
    if (!pid) return { tips: [], listings: [] }
    const [p, l] = await Promise.allSettled([feedApi.profilePosts(pid, null, false, 30), providersApi.mine()])
    return {
      tips: p.status === 'fulfilled' ? p.value.data.filter((x) => x.kind === 'vet_tip') : [],
      listings: l.status === 'fulfilled' ? l.value.filter((x) => x.category === 'vet') : [],
    }
  })
  const tips = data?.tips ?? []
  const listings = data?.listings ?? []

  const tipSaves = tips.reduce((s, t) => s + t.savesCount, 0)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Vet tips" value={tips.length} Icon={Stethoscope} tint="bg-primary/10 text-primary" />
        <StatTile label="Advice saved" value={tipSaves} Icon={Bookmark} tint="bg-secondary/10 text-secondary" />
        <StatTile label="Practice listings" value={listings.length} Icon={MapPin} tint="bg-emerald-500/10 text-emerald-600" />
        <StatTile label="Followers" value={profile?.followersCount ?? 0} Icon={PawPrint} tint="bg-red-500/10 text-red-500" />
      </div>

      <Card title="My Practice Listing" action={<Link href="/vet-finder" className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-0.5">Vet Finder<ChevronRight className="w-3.5 h-3.5" /></Link>}>
        {loading ? <Skeleton rows={1} /> : listings.length === 0 ? (
          <Empty text="You're not listed in the Vet Finder yet." cta={{ href: '/vet-finder', label: 'Add your practice' }} />
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {listings.map((l) => (
              <Link key={l.id} href={`/vet-finder`} className="flex items-center gap-3 py-2.5 group">
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 flex-shrink-0"><Stethoscope className="w-5 h-5 text-primary" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{l.name}</p>
                  <p className="text-[11px] text-outline truncate">{l.serviceType ?? 'Veterinary practice'}{l.location ? ` · ${l.location}` : ''}</p>
                </div>
              </Link>
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
                  <p className="text-[11px] text-outline">{timeAgo(t.createdAt)}</p>
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
    </>
  )
}

// ── Pet Care Service Provider ────────────────────────────────────────────────
function PetCareDashboard(): React.JSX.Element {
  const { profile } = useAuth()
  const { data, isLoading: loading } = useCachedValue<Provider[]>('dash:petcare', async () => {
    const l = await providersApi.mine()
    return l.filter((x) => x.category === 'pet_care')
  })
  const listings = data ?? []

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
              <Link key={l.id} href="/pet-care/dashboard" className="flex items-center gap-3 py-2.5 group">
                <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Thumb url={l.coverUrl} className="w-full h-full object-cover" fallback={<HandHeart className="w-5 h-5 text-primary" />} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{l.name}</p>
                  <p className="text-[11px] text-outline truncate">{l.serviceType ?? 'Pet care service'}{l.location ? ` · ${l.location}` : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
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
function Empty({ text, cta }: { text: string; cta?: { href: string; label: string } }): React.JSX.Element {
  return (
    <div className="text-center py-6">
      <p className="text-label-sm text-outline">{text}</p>
      {cta && <Link href={cta.href} className="inline-block mt-2 text-label-sm font-semibold text-primary hover:underline">{cta.label}</Link>}
    </div>
  )
}

const ROLE_META: Record<string, { Icon: LucideIcon; render: () => React.JSX.Element }> = {
  product_seller: { Icon: ShoppingBag, render: () => <SellerDashboard /> },
  verified_news_publisher: { Icon: Newspaper, render: () => <PublisherDashboard /> },
  veterinarian: { Icon: Stethoscope, render: () => <VetDashboard /> },
  pet_care_service_provider: { Icon: HandHeart, render: () => <PetCareDashboard /> },
}

export default function DashboardPage(): React.JSX.Element {
  const { loading, isAuthenticated, profile } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) window.location.replace('/login')
  }, [loading, isAuthenticated])

  if (loading || !isAuthenticated || !profile) {
    return <div className="min-h-screen bg-background pt-20"><div className="max-w-container-max mx-auto px-5 py-4"><div className="h-40 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" /></div></div>
  }

  const role = profile.professionalProfile?.category ?? null
  const meta = role ? ROLE_META[role] : null
  const roleLabel = role ? (PROFESSIONAL_CATEGORY_LABELS[role] ?? role) : null
  const verifiedAt = profile.professionalProfile?.verifiedAt ?? null

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
                  {meta ? <meta.Icon className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h1 className="font-headline text-headline-md font-bold text-on-surface leading-tight">Professional Dashboard</h1>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {roleLabel && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold"><BadgeCheck className="w-3 h-3" />{roleLabel}</span>}
                    {verifiedAt && <span className="text-[11px] text-outline">Verified {new Date(verifiedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                  </div>
                </div>
              </div>
            </div>

            {meta && <AccountAnalyticsSection />}

            {meta ? (
              meta.render()
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-7 h-7 text-primary" /></div>
                <h2 className="text-label-md font-bold text-on-surface mb-1">This dashboard is for verified professionals</h2>
                <p className="text-label-sm text-outline max-w-sm mx-auto mb-4">Get verified as a veterinarian, pet-care provider, product seller, or news publisher to unlock your professional tools and analytics.</p>
                <Link href="/settings" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors"><ShieldCheck className="w-4 h-4" />Get Verified</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" />
    </>
  )
}
