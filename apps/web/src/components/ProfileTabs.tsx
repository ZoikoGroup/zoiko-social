'use client'

import { useCallback, useEffect, useState } from 'react'
import { Link2, Calendar, AtSign, Briefcase, FileText, PawPrint, Bookmark, Grid3X3, Images } from 'lucide-react'
import { profileApi, feedApi, type Profile, type PostItem, PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { PostGrid } from './feed/PostGrid'

type Tab = 'posts' | 'media' | 'saved' | 'about' | 'pets'

function EmptyState({ Icon, title, hint }: { Icon: typeof FileText; title: string; hint: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-outline" />
      </div>
      <p className="text-label-md font-semibold text-on-surface">{title}</p>
      <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">{hint}</p>
    </div>
  )
}

function AboutTab({ profile }: { profile: Profile | null }): React.JSX.Element {
  if (!profile) {
    return <EmptyState Icon={FileText} title="No details yet" hint="Profile information will appear here." />
  }

  const categoryLabel = profile.professionalProfile
    ? (PROFESSIONAL_CATEGORY_LABELS[profile.professionalProfile.category] ?? profile.professionalProfile.category)
    : null

  return (
    <div className="space-y-gutter">
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
        <h3 className="text-label-md font-bold text-on-surface mb-4">Overview</h3>
        <div className="space-y-3 text-label-md text-on-surface-variant">
          <div className="flex items-center gap-3">
            <AtSign className="w-4 h-4 text-outline flex-shrink-0" />@{profile.username}
          </div>
          {profile.websiteUrl && (
            <div className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-outline flex-shrink-0" />
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                {profile.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {categoryLabel && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-outline flex-shrink-0" />
              {categoryLabel}
              {profile.professionalProfile?.businessName && ` · ${profile.professionalProfile.businessName}`}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-outline flex-shrink-0" />
            Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </section>

      {profile.bio && (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
          <h3 className="text-label-md font-bold text-on-surface mb-3">Bio</h3>
          <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{profile.bio}</p>
        </section>
      )}

      {profile.professionalProfile?.description && (
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
          <h3 className="text-label-md font-bold text-on-surface mb-3">About the business</h3>
          <p className="text-body-md text-on-surface-variant leading-relaxed">{profile.professionalProfile.description}</p>
        </section>
      )}
    </div>
  )
}

/** Paged grid backed by an API fetcher — shared by Posts/Media/Saved tabs. */
function GridTab({
  fetcher, emptyTitle, emptyHint,
}: {
  fetcher: (cursor: string | null) => Promise<{ data: PostItem[]; nextCursor: string | null; hasMore: boolean }>
  emptyTitle: string
  emptyHint: string
}): React.JSX.Element {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetcher(null)
      .then((page) => {
        if (cancelled) return
        setPosts(page.data)
        setNextCursor(page.nextCursor)
        setHasMore(page.hasMore)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [fetcher])

  async function loadMore(): Promise<void> {
    if (!nextCursor) return
    const page = await fetcher(nextCursor)
    setPosts((prev) => {
      const seen = new Set(prev.map((p) => p.id))
      return [...prev, ...page.data.filter((p) => !seen.has(p.id))]
    })
    setNextCursor(page.nextCursor)
    setHasMore(page.hasMore)
  }

  return (
    <PostGrid
      posts={posts}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
      emptyTitle={emptyTitle}
      emptyHint={emptyHint}
    />
  )
}

interface ProfileTabsProps {
  /** Omit to show the signed-in user's own profile. */
  profileId?: string | undefined
  /** Pre-fetched by the page — skips this component's own fetch. */
  initialProfile?: Profile | undefined
}

export function ProfileTabs({ profileId, initialProfile }: ProfileTabsProps): React.JSX.Element {
  const { profile: myProfile } = useAuth()
  const [active, setActive] = useState<Tab>('posts')
  const [fetched, setFetched] = useState<Profile | null>(initialProfile ?? null)
  // Own profile comes from the shared context; others from prop or fetch
  const profile: Profile | null = profileId ? fetched : myProfile
  const isOwn = !profileId

  useEffect(() => {
    if (!profileId || initialProfile) return
    let cancelled = false
    profileApi.getById(profileId).then((p) => { if (!cancelled) setFetched(p) }).catch(() => {})
    return () => { cancelled = true }
  }, [profileId, initialProfile])

  const targetId = profile?.id

  const postsFetcher = useCallback(
    (cursor: string | null) =>
      targetId ? feedApi.profilePosts(targetId, cursor) : Promise.resolve({ data: [], nextCursor: null, hasMore: false }),
    [targetId],
  )
  const mediaFetcher = useCallback(
    (cursor: string | null) =>
      targetId ? feedApi.profilePosts(targetId, cursor, true) : Promise.resolve({ data: [], nextCursor: null, hasMore: false }),
    [targetId],
  )
  const savedFetcher = useCallback(
    (cursor: string | null) => feedApi.saved(cursor),
    [],
  )

  const TABS: { id: Tab; label: string; Icon: typeof Grid3X3 }[] = [
    { id: 'posts', label: 'Posts', Icon: Grid3X3 },
    { id: 'media', label: 'Media', Icon: Images },
    ...(isOwn ? [{ id: 'saved' as Tab, label: 'Saved', Icon: Bookmark }] : []),
    { id: 'about', label: 'About', Icon: FileText },
    { id: 'pets', label: 'Pets', Icon: PawPrint },
  ]

  return (
    <div className="space-y-gutter">
      {/* Tab bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 flex-shrink-0 px-5 py-3.5 text-label-md font-semibold border-b-2 transition-colors cursor-pointer ${
                active === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <tab.Icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {active === 'posts' && (
        <GridTab
          fetcher={postsFetcher}
          emptyTitle="No posts yet"
          emptyHint={isOwn ? 'Share your first post from the home feed.' : 'Posts will appear here once shared.'}
        />
      )}
      {active === 'media' && (
        <GridTab
          fetcher={mediaFetcher}
          emptyTitle="No media yet"
          emptyHint="Photo posts will appear here."
        />
      )}
      {active === 'saved' && isOwn && (
        <GridTab
          fetcher={savedFetcher}
          emptyTitle="Nothing saved yet"
          emptyHint="Save posts with the bookmark icon — only you can see this tab."
        />
      )}
      {active === 'about' && <AboutTab profile={profile} />}
      {active === 'pets' && (
        <EmptyState Icon={PawPrint} title="No pets added yet" hint="Pet profiles with diary and health passport will appear here." />
      )}
    </div>
  )
}
