'use client'

import { useEffect, useState } from 'react'
import { Link2, Calendar, AtSign, Briefcase, FileText, PawPrint, ImageIcon } from 'lucide-react'
import { profileApi, type Profile, PROFESSIONAL_CATEGORY_LABELS } from '@/lib/api'

type Tab = 'posts' | 'about' | 'pets' | 'media'

const TABS: { id: Tab; label: string }[] = [
  { id: 'posts',  label: 'Posts'  },
  { id: 'about',  label: 'About'  },
  { id: 'pets',   label: 'Pets'   },
  { id: 'media',  label: 'Media'  },
]

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
          <p className="text-body-md text-on-surface-variant leading-relaxed">{profile.bio}</p>
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

interface ProfileTabsProps {
  /** Omit to show the signed-in user's own profile. */
  profileId?: string | undefined
}

export function ProfileTabs({ profileId }: ProfileTabsProps): React.JSX.Element {
  const [active, setActive] = useState<Tab>('posts')
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = profileId ? profileApi.getById(profileId) : profileApi.getMe()
    load.then((p) => { if (!cancelled) setProfile(p) }).catch(() => {})
    return () => { cancelled = true }
  }, [profileId])

  return (
    <div className="space-y-gutter">
      {/* Tab bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-shrink-0 px-5 py-3.5 text-label-md font-semibold border-b-2 transition-colors cursor-pointer ${
                active === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content — posts/pets/media render real data once their modules ship */}
      {active === 'posts' && (
        <EmptyState Icon={FileText} title="No posts yet" hint="Posts will appear here once shared." />
      )}
      {active === 'about' && <AboutTab profile={profile} />}
      {active === 'pets' && (
        <EmptyState Icon={PawPrint} title="No pets added yet" hint="Pet profiles with diary and health passport will appear here." />
      )}
      {active === 'media' && (
        <EmptyState Icon={ImageIcon} title="No media yet" hint="Photos and videos from posts will appear here." />
      )}
    </div>
  )
}
