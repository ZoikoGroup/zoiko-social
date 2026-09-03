'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link2, BadgeCheck, Briefcase, Lock, Pencil, Loader2, MoreHorizontal, VolumeX, Volume2, UserMinus2, UserCheck2, Flag, MapPin, Clock } from 'lucide-react'
import { SwitchProfessionalModal } from './SwitchProfessionalModal'
import { EditProfileModal } from './EditProfileModal'
import { FollowListModal } from './FollowListModal'
import { MessageButton } from './MessageButton'
import { ReportContentModal } from './ReportContentModal'
import { ConfirmDialog } from './ConfirmDialog'
import { profileApi, networkApi, type Profile, type Relationship } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useProfessionalLabel } from '@/hooks/use-professional-label'
import { useTranslations } from 'next-intl'
import { UserContent } from '@/components/UserContent'
import { formatCompact } from '@/lib/number'
import { formatRelativeTime } from '@/lib/datetime'
import { useFormat } from '@/hooks/use-format'

interface ProfileHeaderProps {
  /** Omit or pass undefined to show the signed-in user's own profile. */
  profileId?: string | undefined
  /** Pre-fetched data from the page — skips this component's own fetches. */
  initialProfile?: Profile | undefined
  initialRelationship?: Relationship | null | undefined
}

/**
 * Hand-rolled M/k suffixes plus a bare toLocaleString(), which took the browser's
 * locale rather than the chosen one. Intl's compact notation is locale-correct
 * ("1,2 Mio." in German, not "1.2M") and needs no thresholds of its own.
 */
function formatCount(value: number, locale: string): string {
  return formatCompact(value, locale)
}

/** Banner-style header skeleton — mirrors the real layout, no spinners. */
function HeaderSkeleton(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Same 4:1 as the real banner, so the layout does not jump on load. */}
      <div className="aspect-[4/1] bg-surface-container animate-pulse" />
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

export function ProfileHeader({ profileId, initialProfile, initialRelationship }: ProfileHeaderProps): React.JSX.Element {
  const { locale } = useFormat()
  const tpr = useTranslations('profile')
  const profLabel = useProfessionalLabel()
  const { profile: myProfile, user, refreshProfile } = useAuth()
  // Other users' profiles are fetched (unless pre-fetched by the page);
  // own profile derives from the shared auth context — no loading flash.
  const [fetched, setFetched] = useState<Profile | null>(initialProfile ?? null)
  const [loading, setLoading] = useState(!!profileId && !initialProfile)
  const profile: Profile | null = profileId ? fetched : myProfile

  const [professionalModalOpen, setProfessionalModalOpen] = useState(false)
  const [revertOpen, setRevertOpen] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [followListTab, setFollowListTab] = useState<'followers' | 'following' | null>(null)
  const [following, setFollowing] = useState(initialRelationship?.following ?? false)
  const [requested, setRequested] = useState(initialRelationship?.requested ?? false)
  const [followedBy, setFollowedBy] = useState(initialRelationship?.followedBy ?? false)
  const [followBusy, setFollowBusy] = useState(false)
  const [muted, setMuted] = useState(initialRelationship?.muted ?? false)
  const [blocked, setBlocked] = useState(initialRelationship?.blocked ?? false)
  const [actionsOpen, setActionsOpen] = useState(false)
  /** Where to draw the actions menu, in viewport coordinates. */
  const [actionsPos, setActionsPos] = useState<{ top: number; right: number } | null>(null)
  const actionsButtonRef = useRef<HTMLButtonElement>(null)

  /*
    Dismiss the actions menu on an outside click or Escape.
    
    There was no such handler before — the menu only closed by choosing one of
    its own items. That was survivable while it was clipped inside the header;
    now that it floats over the page it would sit there until something else was
    clicked.

    Listening for 'click' rather than 'mousedown' is deliberate: mousedown fires
    before the menu item's own onClick, so closing on it would unmount the button
    before the click could land — the item would appear to do nothing.
  */
  useEffect(() => {
    if (!actionsOpen) return undefined
    const onClick = (e: MouseEvent) => {
      // The trigger toggles on its own; handling it here too would reopen and
      // immediately close it.
      if (actionsButtonRef.current?.contains(e.target as Node)) return
      setActionsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActionsOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [actionsOpen])
  const [reportOpen, setReportOpen] = useState(false)
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false)
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
          setMuted(data.viewer.muted)
          setBlocked(data.viewer.blocked)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : tpr('loadFailed'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [profileId, initialProfile, tpr])

  async function handleFollowToggle(): Promise<void> {
    if (!profile || followBusy) return
    setFollowBusy(true)
    try {
      if (following) {
        // Instagram: click "Following" → unfollow (no notification sent)
        await networkApi.unfollow(profile.id)
        setFollowing(false)
        setFetched((p) => p ? { ...p, followersCount: Math.max(0, p.followersCount - 1) } : p)
        toast.success(tpr('unfollowed'), `You are no longer following ${profile.displayName}`)
      } else if (requested) {
        // Instagram: click "Requested" → cancel the pending request
        await networkApi.cancelRequest(profile.id)
        setRequested(false)
        toast.info(tpr('requestCancelled'), `Follow request to ${profile.displayName} was cancelled`)
      } else {
        const result = await networkApi.follow(profile.id)
        if (result.status === 'following' || result.status === 'already_following') {
          setFollowing(true)
          setFetched((p) => p ? { ...p, followersCount: p.followersCount + 1 } : p)
          toast.success('Following', `You are now following ${profile.displayName}`)
        } else if (result.status === 'request_sent' || result.status === 'request_pending') {
          setRequested(true)
          toast.success(tpr('requestSent'), `Follow request sent to ${profile.displayName}`)
        }
      }
    } catch (e) {
      // Leave state unchanged on failure
      toast.error(tpr('actionFailed'), e instanceof Error ? e.message : tpr('followFailed'))
    } finally {
      setFollowBusy(false)
    }
  }

  async function handleToggleMute(): Promise<void> {
    if (!profile) return
    setActionsOpen(false)
    try {
      if (muted) {
        await networkApi.unmute(profile.id)
        setMuted(false)
        toast.success(tpr('unmuted'), `You'll see posts from ${profile.displayName} again.`)
      } else {
        await networkApi.mute(profile.id)
        setMuted(true)
        toast.success(tpr('muted'), `You won't see posts from ${profile.displayName} in your feed.`)
      }
    } catch (e) {
      toast.error(tpr('actionFailed'), e instanceof Error ? e.message : tpr('pleaseTryAgain'))
    }
  }

  async function handleUnblock(): Promise<void> {
    if (!profile) return
    setActionsOpen(false)
    try {
      await networkApi.unblock(profile.id)
      setBlocked(false)
      toast.success(tpr('unblocked'), `${profile.displayName} can now see your profile and message you again.`)
    } catch (e) {
      toast.error(tpr('actionFailed'), e instanceof Error ? e.message : tpr('pleaseTryAgain'))
    }
  }

  async function handleBlock(): Promise<void> {
    if (!profile) return
    await networkApi.block(profile.id)
    setBlocked(true)
    setFollowing(false)
    setFollowedBy(false)
    toast.success(tpr('blocked'), `${profile.displayName} can no longer see your profile or message you.`)
  }

  async function handleRevertToPersonal(): Promise<void> {
    if (reverting) return
    setReverting(true)
    try {
      await profileApi.revertToPersonal()
      await refreshProfile()
      setRevertOpen(false)
      toast.success(tpr('switchedToPersonal'), tpr('switchedBody'))
    } catch (e) {
      toast.error(tpr('couldNotSwitch'), e instanceof Error ? e.message : tpr('pleaseTryAgain'))
    } finally {
      setReverting(false)
    }
  }

  if ((profileId && loading) || (!profileId && !profile && !error)) {
    return <HeaderSkeleton />
  }

  if (error || !profile) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-8 text-center text-outline">
        {error || tpr('notFound')}
      </section>
    )
  }

  const isVerified = profile.verificationTier === 'professional'
  const professional = profile.professionalProfile
  const categoryLabel = profLabel(professional?.category)

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
      {revertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !reverting && setRevertOpen(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="font-headline text-headline-md text-on-surface">{tpr('switchConfirm')}</h2>
            <p className="text-label-sm text-on-surface-variant mt-2 leading-relaxed">
              Your professional dashboard, verified badge, and category will be turned off. Your posts, followers, messages, and listings stay — switch back to professional anytime to restore your dashboard and badge.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setRevertOpen(false)} disabled={reverting} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container disabled:opacity-50 cursor-pointer">Cancel</button>
              <button onClick={handleRevertToPersonal} disabled={reverting} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                {reverting && <Loader2 className="w-4 h-4 animate-spin" />}<span>{tpr('switchToPersonal')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
        {/* Cover banner — user image when set, brand gradient fallback */}
        {/* 4:1 to match what the crop editor produces. It was a fixed height with
            a fluid width, so the display box was 4:1 at exactly one window size
            and something else everywhere else — object-cover then trimmed the
            banner a second time, and differently per screen, which is why a
            carefully positioned crop still came out cut. Now the frame the
            visitor cropped inside is the frame they get. */}
        <div className="relative aspect-[4/1] bg-gradient-to-r from-primary via-teal-700 to-emerald-600 overflow-hidden">
          {profile.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute right-24 bottom-0 size-24 rounded-full bg-secondary/25 blur-xl" />
              <div className="pointer-events-none absolute left-1/3 -bottom-8 size-28 rounded-full bg-white/5" />
            </>
          )}
          {isOwnProfile && (
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 transition-colors cursor-pointer"
              aria-label={tpr('editProfile')}
              title={tpr('editProfile')}
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
          </div>

          {/* Identity */}
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-on-surface">{profile.displayName}</h1>
              {isVerified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
              {profile.isPrivate && <Lock className="w-4 h-4 text-outline flex-shrink-0" />}
              {followedBy && !following && !requested && !isOwnProfile && (
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10.5px] font-semibold text-outline">{tpr('followsYou')}</span>
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
              <UserContent as="p" className="mt-2 text-label-md text-on-surface-variant leading-relaxed whitespace-pre-line max-w-xl">{profile.bio}</UserContent>
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
            {profile.city && (
              <p className="mt-1.5 flex items-center gap-1 text-label-sm text-outline">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {profile.city}
              </p>
            )}

            {/*
              Online state, when the owner shares it.

              The "Show last active status" toggle wrote to the database and
              nothing ever read it — there was no indicator here to render, so
              turning it on visibly did nothing. The server decides what may be
              shown; both of these are absent unless it says otherwise, so this
              markup cannot leak a setting that is switched off.
            */}
            {profile.isOnline ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-label-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden />
                {tpr('online')}
              </p>
            ) : profile.lastActiveAt ? (
              <p className="mt-1.5 flex items-center gap-1 text-label-sm text-outline">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                {tpr('lastActive', { when: formatRelativeTime(profile.lastActiveAt, locale) })}
              </p>
            ) : null}

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
                    <span className="font-bold text-primary">{formatCount(value, locale)}</span>{' '}
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
                  {tpr('editProfile')}
                </button>
                {!professional ? (
                  <button
                    onClick={() => setProfessionalModalOpen(true)}
                    className="flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-primary/50 text-primary text-[13px] font-semibold hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {tpr('goProfessional')}
                  </button>
                ) : (
                  <button
                    onClick={() => setRevertOpen(true)}
                    className="flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-outline-variant/60 text-on-surface-variant text-[13px] font-semibold hover:bg-surface-container active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {tpr('switchToPersonal')}
                  </button>
                )}
              </>
            ) : (
              <>
                {blocked ? (
                  <span className="flex-1 basis-0 sm:flex-none sm:min-w-[160px] h-10 px-4 sm:px-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-outline-variant/40 text-outline text-[13px] font-semibold">
                    Blocked
                  </span>
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
                <div className="relative">
                  <button
                    ref={actionsButtonRef}
                    onClick={() => {
                      // Measured at open time, not at render: the header moves
                      // with scroll and with the cover image loading.
                      const rect = actionsButtonRef.current?.getBoundingClientRect()
                      if (rect) {
                        setActionsPos({
                          top: rect.bottom + 8,
                          // Right-aligned to the button, clamped so a menu near
                          // the viewport edge cannot open off-screen.
                          right: Math.max(8, window.innerWidth - rect.right),
                        })
                      }
                      setActionsOpen((o) => !o)
                    }}
                    className="flex items-center justify-center size-10 rounded-full border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                    aria-label={tpr('moreActions')}
                    aria-expanded={actionsOpen}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {/*
                    Rendered into document.body rather than here.

                    This <section> sets overflow-hidden so the cover image is
                    clipped to its rounded corners, and an absolutely positioned
                    menu inside it is clipped by exactly the same rule — the menu
                    opened downward and was sliced off, which is what QA saw as a
                    cropped profile. A portal escapes the clip without giving up
                    the rounded cover.
                  */}
                  {actionsOpen && actionsPos && createPortal(
                    <div
                      className="fixed w-52 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl overflow-hidden z-50"
                      style={{ top: actionsPos.top, right: actionsPos.right }}
                    >
                      <button
                        onClick={() => void handleToggleMute()}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-sm text-on-surface hover:bg-surface-container cursor-pointer"
                      >
                        {muted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        <span>{muted ? tpr('unmute') : tpr('mute')} @{profile.username}</span>
                      </button>
                      <button
                        onClick={() => (blocked ? void handleUnblock() : (setActionsOpen(false), setConfirmBlockOpen(true)))}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-sm text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        {blocked ? <UserCheck2 className="w-4 h-4" /> : <UserMinus2 className="w-4 h-4" />}
                        <span>{blocked ? tpr('unblock') : tpr('block')} @{profile.username}</span>
                      </button>
                      <button
                        onClick={() => { setActionsOpen(false); setReportOpen(true) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-sm text-yellow-600 hover:bg-yellow-50 cursor-pointer"
                      >
                        <Flag className="w-4 h-4" />
                        Report @{profile.username}
                      </button>
                    </div>,
                    document.body,
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {reportOpen && (
        <ReportContentModal targetType="user" targetId={profile.id} onClose={() => setReportOpen(false)} />
      )}
      {confirmBlockOpen && (
        <ConfirmDialog
          title={`Block @${profile.username}?`}
          body="They won't be able to see your profile, follow you, or message you. Existing follows between you will be removed. You can unblock them anytime."
          confirmLabel="Block"
          onConfirm={handleBlock}
          onClose={() => setConfirmBlockOpen(false)}
        />
      )}
    </>
  )
}
