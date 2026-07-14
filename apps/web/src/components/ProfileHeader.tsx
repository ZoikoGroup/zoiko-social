'use client'

import { useEffect, useState } from 'react'
import { Link2, BadgeCheck, Briefcase, Lock, Send, Pencil } from 'lucide-react'
import { SwitchProfessionalModal } from './SwitchProfessionalModal'
import { EditProfileModal } from './EditProfileModal'
import { FollowListModal } from './FollowListModal'
import { MessageButton } from './MessageButton'
import { profileApi, networkApi, type Profile, type Relationship, PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface ProfileHeaderProps {
  /** Omit or pass undefined to show the signed-in user's own profile. */
  profileId?: string | undefined
  /** Pre-fetched data from the page — skips this component's own fetches. */
  initialProfile?: Profile | undefined
  initialRelationship?: Relationship | null | undefined
  /** Callback when user clicks 'Share to Story' for this profile */
  onShareToStory?: (refType: string, refId: string) => void
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

/** Banner-style header skeleton — mirrors the real layout, no spinners. */
function HeaderSkeleton(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="h-28 sm:h-40 bg-surface-container animate-pulse" />
      <div className="px-5 sm:px-8 pb-6">
        <div className="-mt-10 sm:-mt-14 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest animate-pulse" />
        <div className="mt-4 space-y-3">
          <div className="h-6 w-44 bg-surface-container rounded animate-pulse" />
          <div className="h-4 w-28 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-64 bg-surface-container rounded animate-pulse" />
          <div className="flex gap-3 pt-1">
            <div className="h-9 w-32 bg-surface-container rounded-full animate-pulse" />
            <div className="h-9 w-32 bg-surface-container rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProfileHeader({ profileId, initialProfile, initialRelationship, onShareToStory }: ProfileHeaderProps): React.JSX.Element {
  const { profile: myProfile, user, refreshProfile } = useAuth()
  // Other users' profiles are fetched (unless pre-fetched by the page);
  // own profile derives from the shared auth context — no loading flash.
  const [fetched, setFetched] = useState<Profile | null>(initialProfile ?? null)
  const [loading, setLoading] = useState(!!profileId && !initialProfile)
  const profile: Profile | null = profileId ? fetched : myProfile

  const [professionalModalOpen, setProfessionalModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [followListTab, setFollowListTab] = useState<'followers' | 'following' | null>(null)
  const [following, setFollowing] = useState(initialRelationship?.following ?? false)
  const [requested, setRequested] = useState(initialRelationship?.requested ?? false)
  const [followedBy, setFollowedBy] = useState(initialRelationship?.followedBy ?? false)
  const [followBusy, setFollowBusy] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  // Own profile even when reached via /profile/[username] with an explicit id —
  // compare against the auth user id (available before the profile context loads)
  // so a Follow button can never render on your own account.
  const isOwnProfile = !profileId || profileId === user?.id

  useEffect(() => {
    // Pre-fetched by the page — nothing to load here
    if (!profileId || initialProfile) return
    let cancelled = false
    async function load(): Promise<void> {
      try {
        // Profile + relationship in ONE round-trip
        const data = await profileApi.getByIdWithViewer(profileId!)
        if (cancelled) return
        setFetched(data)
        if (data.viewer) {
          setFollowing(data.viewer.following)
          setRequested(data.viewer.requested)
          setFollowedBy(data.viewer.followedBy)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [profileId, initialProfile])

  async function handleFollowToggle(): Promise<void> {
    if (!profile || followBusy) return
    setFollowBusy(true)
    try {
      if (following) {
        // Instagram: click "Following" → unfollow (no notification sent)
        await networkApi.unfollow(profile.id)
        setFollowing(false)
        setFetched((p) => p ? { ...p, followersCount: Math.max(0, p.followersCount - 1) } : p)
        toast.success('Unfollowed', `You are no longer following ${profile.displayName}`)
      } else if (requested) {
        // Instagram: click "Requested" → cancel the pending request
        await networkApi.cancelRequest(profile.id)
        setRequested(false)
        toast.info('Request cancelled', `Follow request to ${profile.displayName} was cancelled`)
      } else {
        const result = await networkApi.follow(profile.id)
        if (result.status === 'following' || result.status === 'already_following') {
          setFollowing(true)
          setFetched((p) => p ? { ...p, followersCount: p.followersCount + 1 } : p)
          toast.success('Following', `You are now following ${profile.displayName}`)
        } else if (result.status === 'request_sent' || result.status === 'request_pending') {
          setRequested(true)
          toast.success('Request sent', `Follow request sent to ${profile.displayName}`)
        }
      }
    } catch (e) {
      // Leave state unchanged on failure
      toast.error('Action failed', e instanceof Error ? e.message : 'Could not update follow status')
    } finally {
      setFollowBusy(false)
    }
  }

  if ((profileId && loading) || (!profileId && !profile && !error)) {
    return <HeaderSkeleton />
  }

  if (error || !profile) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-8 text-center text-outline">
        {error || 'Profile not found'}
      </section>
    )
  }

  const isVerified = profile.verificationTier === 'professional'
  const professional = profile.professionalProfile
  const categoryLabel = professional ? (PROFESSIONAL_CATEGORY_LABELS[professional.category] ?? professional.category) : null

  return (
    <>
      <SwitchProfessionalModal
        open={professionalModalOpen}
        onClose={() => setProfessionalModalOpen(false)}
        onSwitched={() => {
          void refreshProfile()
          setProfessionalModalOpen(false)
        }}
      />
      <EditProfileModal
        open={editModalOpen}
        profile={profile}
        onClose={() => setEditModalOpen(false)}
        onSaved={() => {
          void refreshProfile()
          setEditModalOpen(false)
        }}
      />
      <FollowListModal
        open={followListTab !== null}
        userId={profile.id}
        isOwnProfile={isOwnProfile}
        initialTab={followListTab ?? 'followers'}
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
        onClose={() => setFollowListTab(null)}
      />

      {/* Banner-style header (LinkedIn-inspired): cover, overlapping avatar, pill actions */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Cover banner — brand gradient with soft decorative shapes */}
        <div className="relative h-28 sm:h-40 bg-gradient-to-r from-primary via-teal-700 to-emerald-600">
          <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute right-24 bottom-0 size-24 rounded-full bg-secondary/25 blur-xl" />
          <div className="pointer-events-none absolute left-1/3 -bottom-8 size-28 rounded-full bg-white/5" />
          {isOwnProfile && (
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 transition-colors cursor-pointer"
              aria-label="Edit profile"
              title="Edit profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-5 sm:px-8 pb-6">
          {/* Avatar overlapping the banner */}
          <div className="flex items-end justify-between">
            {/* relative z-10: the banner above is position:relative, and positioned
                elements paint over static ones — without this the banner covers
                the avatar's overlapping top half */}
            <div className="relative z-10 -mt-10 sm:-mt-14 w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-surface-container-lowest overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-md">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {profile.displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
            </div>
            {onShareToStory && !isOwnProfile && (
              <button
                onClick={() => onShareToStory('profile', profile.id)}
                className="mb-1 flex size-9 items-center justify-center rounded-full border border-outline-variant/40 text-outline hover:bg-surface-container transition-colors cursor-pointer"
                title="Share to Story"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Identity */}
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-on-surface">{profile.displayName}</h1>
              {isVerified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
              {profile.isPrivate && <Lock className="w-4 h-4 text-outline flex-shrink-0" />}
              {followedBy && !following && !requested && !isOwnProfile && (
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10.5px] font-semibold text-outline">Follows you</span>
              )}
            </div>
            <p className="text-label-sm text-outline mt-0.5">@{profile.username}</p>

            {categoryLabel && (
              <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/10 text-secondary text-[10.5px] font-bold uppercase tracking-wider rounded-full">
                <Briefcase className="w-3 h-3" />
                {categoryLabel}
                {professional?.isVerified && ' · Verified'}
              </span>
            )}

            {profile.bio && (
              <p className="mt-2 text-label-md text-on-surface-variant leading-relaxed whitespace-pre-line max-w-xl">{profile.bio}</p>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline"
              >
                <Link2 className="w-3.5 h-3.5" />
                {profile.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}

            {/* Stats — accent-colored counts, LinkedIn-style single line */}
            <div className="mt-3 flex items-center gap-1.5 text-label-md flex-wrap">
              {([
                { label: 'followers', value: profile.followersCount, tab: 'followers' as const },
                { label: 'following', value: profile.followingCount, tab: 'following' as const },
                { label: 'posts',     value: profile.postsCount,     tab: null },
              ]).map(({ label, value, tab }, i) => (
                <span key={label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-outline/50">·</span>}
                  <button
                    onClick={() => { if (tab) setFollowListTab(tab) }}
                    className={`${tab ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
                  >
                    <span className="font-bold text-primary">{formatCount(value)}</span>{' '}
                    <span className="text-on-surface-variant">{label}</span>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action pills — equal width (basis-0) and fixed height so labels never
              wrap the buttons out of alignment */}
          <div className="mt-4 flex items-center gap-2.5">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-6 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Edit profile
                </button>
                {!professional && (
                  <button
                    onClick={() => setProfessionalModalOpen(true)}
                    className="flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-primary/50 text-primary text-[13px] font-semibold hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Go Professional
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  disabled={followBusy}
                  className={`flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-7 inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px] font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 ${
                    following || requested
                      ? 'border border-outline-variant/60 text-on-surface hover:bg-surface-container'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {requested ? 'Requested' : following ? 'Following' : followedBy ? 'Follow Back' : 'Follow'}
                </button>
                <MessageButton userId={profile.id} size="md" />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
