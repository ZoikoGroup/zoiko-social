'use client'

import { useCallback, useEffect, useState } from 'react'
import { Link2, Calendar, AtSign, Briefcase, FileText, PawPrint, Bookmark, Grid3X3, Images, UsersRound, Lock } from 'lucide-react'
import Link from 'next/link'
import { profileApi, feedApi, petsApi, eventsApi, communitiesApi, type Profile, type PostItem, type Pet, type EventItem, type CommunityCard, PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'
import { ageOf } from '@/lib/pet'
import { useAuth } from '@/hooks/use-auth'
import { PostGrid } from './feed/PostGrid'

type Tab = 'posts' | 'media' | 'saved' | 'about' | 'pets' | 'events' | 'communities'

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
    { id: 'pets', label: 'Pets', Icon: PawPrint },
    // What someone organises says as much about them as what they post.
    { id: 'events', label: 'Events', Icon: Calendar },
    { id: 'communities', label: 'Communities', Icon: UsersRound },
    { id: 'about', label: 'About', Icon: FileText },
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
      {/* This tab used to render a hardcoded empty state — it never listed a
          single pet, however many the member had. */}
      {active === 'pets' && <PetsTab profileId={targetId} isOwn={isOwn} />}
      {active === 'events' && <EventsTab profileId={targetId} isOwn={isOwn} />}
      {active === 'communities' && <CommunitiesTab profileId={targetId} isOwn={isOwn} />}
    </div>
  )
}

// ── Pets ─────────────────────────────────────────────────────────────────────

/**
 * The member's pets.
 *
 * `byProfile` already applies each pet's `isPublic` flag, so a private pet stays
 * hidden from other people without any filtering here.
 */
function PetsTab({ profileId, isOwn }: { profileId: string | undefined; isOwn: boolean }): React.JSX.Element {
  const [pets, setPets] = useState<Pet[] | null>(null)

  useEffect(() => {
    if (!profileId) return
    let cancelled = false
    const load = isOwn ? petsApi.mine() : petsApi.byProfile(profileId)
    load.then((p) => { if (!cancelled) setPets(p) }).catch(() => { if (!cancelled) setPets([]) })
    return () => { cancelled = true }
  }, [profileId, isOwn])

  if (pets === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-surface-container animate-pulse" />
        ))}
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <EmptyState
        Icon={PawPrint}
        title="No pets added yet"
        hint={isOwn
          ? 'Add a pet to start a diary and a Health Passport for them.'
          : 'Pet profiles will appear here once added.'}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {pets.map((pet) => (
        <Link
          key={pet.id}
          href={isOwn ? '/health-passport' : `/profile/${pet.ownerId}`}
          className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 transition-colors group"
        >
          <div className="aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
            {pet.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pet.avatarUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : <PawPrint className="w-7 h-7 text-outline" />}
          </div>
          <div className="p-3">
            <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{pet.name}</p>
            <p className="text-[11px] text-outline truncate capitalize">
              {[pet.breed, ageOf(pet.birthdate)].filter(Boolean).join(' · ') || pet.species}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ── Events ───────────────────────────────────────────────────────────────────

/**
 * Upcoming events this member is hosting.
 *
 * Filtered server-side by host, and the list's normal visibility gate still
 * applies — a follower-only or invite-only event does not become visible just
 * because it is listed on a profile.
 */
function EventsTab({ profileId, isOwn }: { profileId: string | undefined; isOwn: boolean }): React.JSX.Element {
  const [events, setEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    if (!profileId) return
    let cancelled = false
    eventsApi.upcoming(null, 20, { hostId: profileId })
      .then((p) => { if (!cancelled) setEvents(p.data) })
      .catch(() => { if (!cancelled) setEvents([]) })
    return () => { cancelled = true }
  }, [profileId])

  if (events === null) {
    return (
      <div className="space-y-2">
        {[0, 1].map((i) => <div key={i} className="h-16 rounded-xl bg-surface-container animate-pulse" />)}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        Icon={Calendar}
        title="No upcoming events"
        hint={isOwn ? 'Events you host will show up here.' : 'Events this member hosts will show up here.'}
      />
    )
  }

  return (
    <div className="space-y-2">
      {events.map((e) => {
        const when = new Date(e.startsAt)
        return (
          <Link
            key={e.id}
            href={`/events/${e.id}`}
            className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold uppercase text-primary leading-none">
                {when.toLocaleDateString('en-GB', { month: 'short' })}
              </span>
              <span className="text-label-md font-bold text-primary leading-tight">{when.getDate()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-label-sm font-semibold text-on-surface truncate">{e.title}</p>
              <p className="text-[11px] text-outline truncate">
                {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                {e.community ? ` · ${e.community.name}` : ''}
                {e.isOnline ? ' · Online' : e.venueName ? ` · ${e.venueName}` : ''}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ── Communities ──────────────────────────────────────────────────────────────

/**
 * Communities this member belongs to.
 *
 * Other people's profiles show **public communities only**: belonging to a
 * private or invite-only community is itself private information — a support
 * group, a breeder circle — and a profile page is exactly where it would leak to
 * people who were never admitted. Your own tab has no such restriction, so the
 * note below explains the difference rather than letting it look like a bug.
 */
function CommunitiesTab({ profileId, isOwn }: { profileId: string | undefined; isOwn: boolean }): React.JSX.Element {
  const [communities, setCommunities] = useState<CommunityCard[] | null>(null)

  useEffect(() => {
    if (!profileId) return
    let cancelled = false
    const load = isOwn ? communitiesApi.mine() : communitiesApi.forProfile(profileId)
    load.then((c) => { if (!cancelled) setCommunities(c) }).catch(() => { if (!cancelled) setCommunities([]) })
    return () => { cancelled = true }
  }, [profileId, isOwn])

  if (communities === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-xl bg-surface-container animate-pulse" />)}
      </div>
    )
  }

  if (communities.length === 0) {
    return (
      <EmptyState
        Icon={UsersRound}
        title="No communities yet"
        hint={isOwn
          ? 'Communities you join will show up here.'
          : 'Public communities this member belongs to will show up here.'}
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/c/${c.slug}`}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 hover:border-primary/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center mb-2">
              {c.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : <UsersRound className="w-5 h-5 text-primary" />}
            </div>
            <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{c.name}</p>
            <p className="text-[11px] text-outline">{c.membersCount.toLocaleString()} members</p>
          </Link>
        ))}
      </div>
      {!isOwn && (
        <p className="flex items-center gap-1.5 text-[11px] text-outline">
          <Lock className="w-3 h-3" />
          Only public communities are shown.
        </p>
      )}
    </div>
  )
}
