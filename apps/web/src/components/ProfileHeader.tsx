'use client'

import { useEffect, useState } from 'react'
import { Link2, BadgeCheck, Briefcase, Lock, Send } from 'lucide-react'
import { SwitchProfessionalModal } from './SwitchProfessionalModal'
import { EditProfileModal } from './EditProfileModal'
import { FollowListModal } from './FollowListModal'
import { profileApi, networkApi, type Profile, type Relationship, PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

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

/** Instagram-style header skeleton — mirrors the real layout, no spinners. */
function HeaderSkeleton(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sm:p-8">
      <div className="flex gap-6 sm:gap-10 items-start">
        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-1">
          <div className="flex items-center gap-4">
            <div className="h-6 w-40 bg-surface-container rounded animate-pulse" />
            <div className="h-8 w-24 bg-surface-container rounded-lg animate-pulse hidden sm:block" />
          </div>
          <div className="flex gap-6">
            <div className="h-4 w-16 bg-surface-container rounded animate-pulse" />
            <div className="h-4 w-20 bg-surface-container rounded animate-pulse" />
            <div className="h-4 w-20 bg-surface-container rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-64 bg-surface-container rounded animate-pulse" />
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
      } else if (requested) {
        // Instagram: click "Requested" → cancel the pending request
        await networkApi.cancelRequest(profile.id)
        setRequested(false)
      } else {
        const result = await networkApi.follow(profile.id)
        if (result.status === 'following' || result.status === 'already_following') {
          setFollowing(true)
          setFetched((p) => p ? { ...p, followersCount: p.followersCount + 1 } : p)
        } else if (result.status === 'request_sent' || result.status === 'request_pending') {
          setRequested(true)
        }
      }
    } catch {
      // Leave state unchanged on failure
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

      {/* Instagram-style header — avatar left, identity + stats right, no cover banner */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sm:p-8">
        <div className="flex gap-6 sm:gap-10 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full ring-2 ring-outline-variant/30 ring-offset-2 ring-offset-surface-container-lowest overflow-hidden bg-primary/10 flex items-center justify-center">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  {profile.displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Identity + stats */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Row 1: username + badges + actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-medium text-on-surface truncate">{profile.username}</h1>
              {isVerified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
              {profile.isPrivate && <Lock className="w-4 h-4 text-outline flex-shrink-0" />}

              <div className="flex items-center gap-2 ml-auto sm:ml-2">
                {onShareToStory && !isOwnProfile && (
                  <button
                    onClick={() => onShareToStory('profile', profile.id)}
                    className="p-1.5 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer"
                    title="Share to Story"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}

                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setEditModalOpen(true)}
                      className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Edit profile
                    </button>
                    {!professional && (
                      <button
                        onClick={() => setProfessionalModalOpen(true)}
                        className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        Go Professional
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {followedBy && !following && !requested && (
                      <span className="text-[11px] text-outline">Follows you</span>
                    )}
                    <button
                      onClick={handleFollowToggle}
                      disabled={followBusy}
                      className={`px-5 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                        following || requested
                          ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {requested ? 'Requested' : following ? 'Following' : followedBy ? 'Follow Back' : 'Follow'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Row 2: stats */}
            <div className="flex gap-6 sm:gap-8 mt-4">
              {([
                { label: 'posts',     value: profile.postsCount,     tab: null },
                { label: 'followers', value: profile.followersCount, tab: 'followers' as const },
                { label: 'following', value: profile.followingCount, tab: 'following' as const },
              ]).map(({ label, value, tab }) => (
                <button
                  key={label}
                  onClick={() => { if (tab) setFollowListTab(tab) }}
                  className={`text-label-md text-on-surface ${tab ? 'cursor-pointer hover:opacity-70' : 'cursor-default'} transition-opacity`}
                >
                  <span className="font-bold">{formatCount(value)}</span>{' '}
                  <span className="text-on-surface-variant">{label}</span>
                </button>
              ))}
            </div>

            {/* Row 3: display name, professional chip, bio, links */}
            <div className="mt-4 space-y-1">
              <p className="font-semibold text-label-md text-on-surface">{profile.displayName}</p>
              {categoryLabel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-full">
                  <Briefcase className="w-2.5 h-2.5" />
                  {categoryLabel}
                  {professional?.isVerified && ' · Verified'}
                </span>
              )}
              {profile.bio && (
                <p className="text-label-md text-on-surface-variant leading-relaxed whitespace-pre-line max-w-xl">{profile.bio}</p>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  {profile.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
