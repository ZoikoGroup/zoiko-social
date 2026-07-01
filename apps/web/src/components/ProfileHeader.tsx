'use client'

import { useState } from 'react'
import { MapPin, Link2, Calendar, BadgeCheck, Edit2, Briefcase, Users, FileText } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { SwitchProfessionalModal } from './SwitchProfessionalModal'

interface ProfileHeaderProps {
  isOwnProfile?: boolean
}

const PROFILE = {
  name: 'Alex Rivera',
  role: 'Pet Nutrition Specialist',
  professional: null as string | null,
  bio: 'Passionate about animal welfare and holistic pet nutrition. Rescue advocate for 8+ years. Based in San Francisco — fostering cats, helping communities feed their animals better.',
  location: 'San Francisco, CA',
  website: 'alexrivera.pets',
  joined: 'Joined March 2022',
  followers: '2,401',
  following: '312',
  posts: '48',
  verified: true,
}

export function ProfileHeader({ isOwnProfile = true }: ProfileHeaderProps): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)
  const [professional, setProfessional] = useState<string | null>(PROFILE.professional)
  const [following, setFollowing] = useState(false)

  return (
    <>
      <SwitchProfessionalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(role) => { setProfessional(role.label); setModalOpen(false) }}
      />

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 sm:h-44 bg-gradient-to-br from-primary via-primary/80 to-secondary relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {isOwnProfile && (
            <button className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/20 text-white text-label-sm hover:bg-black/30 transition-colors cursor-pointer flex items-center gap-1.5">
              <Edit2 className="w-3 h-3" />
              Edit cover
            </button>
          )}
        </div>

        {/* Avatar + info */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="ring-4 ring-surface-container-lowest rounded-full">
              <UserAvatar name={PROFILE.name} size="xl" verified={PROFILE.verified} />
            </div>

            {isOwnProfile ? (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {professional ? professional : 'Go Professional'}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-primary text-primary text-label-sm font-semibold hover:bg-primary/5 transition-colors cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit profile
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container transition-colors cursor-pointer">
                  Message
                </button>
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`px-4 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${
                    following ? 'border border-primary text-primary hover:bg-primary/5' : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {following ? 'Following' : '+ Follow'}
                </button>
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="flex items-start gap-2 flex-wrap">
            <h1 className="font-headline text-headline-md text-on-surface">{PROFILE.name}</h1>
            {PROFILE.verified && <BadgeCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />}
          </div>

          <p className="text-label-md text-on-surface-variant mt-0.5">
            {professional ?? PROFILE.role}
          </p>
          {professional && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Briefcase className="w-2.5 h-2.5" />
              Professional
            </span>
          )}

          <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed max-w-2xl">{PROFILE.bio}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-label-sm text-outline">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{PROFILE.location}</span>
            <span className="flex items-center gap-1"><Link2 className="w-3.5 h-3.5" />{PROFILE.website}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{PROFILE.joined}</span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-outline-variant/20">
            {[
              { label: 'Posts',     value: PROFILE.posts,      Icon: FileText },
              { label: 'Followers', value: PROFILE.followers,  Icon: Users },
              { label: 'Following', value: PROFILE.following,  Icon: Users },
            ].map(({ label, value, Icon }) => (
              <button key={label} className="flex flex-col items-start cursor-pointer group">
                <span className="text-headline-md font-bold text-primary group-hover:underline">{value}</span>
                <span className="flex items-center gap-1 text-label-sm text-outline">
                  <Icon className="w-3 h-3" />{label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
