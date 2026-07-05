'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Lock, UserX } from 'lucide-react'
import { Header } from '@/components/Header'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileTabs } from '@/components/ProfileTabs'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { profileApi, ApiError, type Profile, type Relationship } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }): React.JSX.Element {
  const { username } = use(params)
  const { profile: myProfile } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    // ONE round-trip: profile + viewer relationship together (client-cached)
    profileApi.getByUsernameWithViewer(username)
      .then((p) => {
        if (cancelled) return
        setProfile(p)
        setRelationship(p.viewer)
      })
      .catch((e) => {
        if (!cancelled && e instanceof ApiError) setNotFound(true)
      })
    return () => { cancelled = true }
  }, [username])

  const isOwn = !!(myProfile && profile && myProfile.id === profile.id)
  // Instagram gate: private account content is hidden unless owner or accepted follower
  const canViewContent = !!profile && (isOwn || !profile.isPrivate || !!relationship?.following)

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          {/* Back button */}
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/network"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            {profile && <span className="text-label-md font-semibold text-on-surface">@{profile.username}</span>}
          </div>

          {notFound ? (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-16 text-center">
              <UserX className="w-10 h-10 text-outline mx-auto mb-4" />
              <h1 className="font-headline text-headline-md text-on-surface">User not found</h1>
              <p className="text-label-md text-outline mt-2">
                This account doesn&apos;t exist or isn&apos;t available.
              </p>
              <Link href="/network" className="inline-block mt-5 px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors">
                Explore the network
              </Link>
            </section>
          ) : (
            <>
              <div className="mb-gutter">
                {/* Own profile via username URL renders with own controls */}
                {profile ? (
                  <ProfileHeader
                    profileId={isOwn ? undefined : profile.id}
                    initialProfile={isOwn ? undefined : profile}
                    initialRelationship={isOwn ? undefined : relationship}
                  />
                ) : (
                  <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sm:p-8">
                    <div className="flex gap-6 sm:gap-10 items-start">
                      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-4 pt-1">
                        <div className="h-6 w-40 bg-surface-container rounded animate-pulse" />
                        <div className="flex gap-6">
                          <div className="h-4 w-16 bg-surface-container rounded animate-pulse" />
                          <div className="h-4 w-20 bg-surface-container rounded animate-pulse" />
                          <div className="h-4 w-20 bg-surface-container rounded animate-pulse" />
                        </div>
                        <div className="h-3 w-64 bg-surface-container rounded animate-pulse" />
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-8 pb-20">
                  {profile && !canViewContent ? (
                    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-outline-variant flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-7 h-7 text-outline" />
                      </div>
                      <h2 className="text-label-md font-bold text-on-surface">This account is private</h2>
                      <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">
                        Follow this account to see their posts, pets, and activity.
                      </p>
                    </section>
                  ) : (
                    profile && (
                      <ProfileTabs
                        profileId={isOwn ? undefined : profile.id}
                        initialProfile={isOwn ? undefined : profile}
                      />
                    )
                  )}
                </div>

                <div className="lg:col-span-4 space-y-gutter hidden xl:block">
                  <RightPanel />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <MobileTabs currentPage="profile" />
    </>
  )
}
