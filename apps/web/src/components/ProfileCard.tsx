'use client'

import Link from 'next/link'
import { AtSign, BadgeCheck, MapPin } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { UserAvatar } from './UserAvatar'
import { PROFESSIONAL_CATEGORY_LABELS, type Profile } from '@/lib/api'

function strength(p: Profile): number {
  let s = 40
  if (p.avatarUrl) s += 15
  if (p.bio) s += 15
  if (p.websiteUrl || p.professionalProfile) s += 15
  if (p.verificationTier === 'professional') s += 15
  return Math.min(100, s)
}

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export function ProfileCard(): React.JSX.Element {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="h-16 bg-surface-container animate-pulse" />
        <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest bg-surface-container animate-pulse" />
          <div className="mt-3 h-4 w-32 bg-surface-container rounded animate-pulse" />
          <div className="mt-2 h-3 w-24 bg-surface-container rounded animate-pulse" />
          <div className="w-full h-8 bg-surface-container rounded animate-pulse mt-4" />
        </div>
      </section>
    )
  }

  const isVerified = profile.verificationTier === 'professional'
  const headline =
    profile.bio ||
    (profile.professionalProfile
      ? PROFESSIONAL_CATEGORY_LABELS[profile.professionalProfile.category] ?? profile.professionalProfile.category
      : null)
  const location = profile.professionalProfile?.businessAddress ?? null
  const pct = strength(profile)

  const stats = [
    { label: 'Connections', value: compact(profile.followersCount) },
    { label: 'Following', value: compact(profile.followingCount) },
    { label: 'Posts', value: compact(profile.postsCount) },
  ]

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-primary/40 via-primary/15 to-secondary/30 relative" />

      <div className="px-4 pb-4">
        {/* Avatar overlapping cover */}
        <div className="-mt-9 mb-2 flex items-end justify-between">
          <Link href="/profile" className="relative ring-4 ring-surface-container-lowest rounded-full">
            <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="lg" verified={isVerified} />
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface-container-lowest" />
          </Link>
        </div>

        <Link href="/profile" className="flex items-center gap-1 hover:underline">
          <h2 className="font-headline text-headline-md text-on-surface leading-tight">{profile.displayName}</h2>
          {isVerified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
        </Link>

        {headline ? (
          <p className="text-label-sm text-on-surface-variant mt-0.5 line-clamp-2">{headline}</p>
        ) : (
          <p className="flex items-center gap-0.5 text-label-sm text-outline mt-0.5">
            <AtSign className="w-3 h-3" />{profile.username}
          </p>
        )}

        {location && (
          <p className="flex items-center gap-1 text-[11px] text-outline mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />{location}
          </p>
        )}

        {/* Profile strength */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-on-surface-variant font-medium">Profile Strength</span>
            <span className="font-semibold text-primary">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* 3-stat grid */}
        <div className="mt-4 grid grid-cols-3 gap-1 border-t border-outline-variant/30 pt-3">
          {stats.map((s) => (
            <Link key={s.label} href="/profile" className="flex flex-col items-center text-center group">
              <span className="text-label-md font-bold text-primary leading-tight group-hover:underline">{s.value}</span>
              <span className="text-[10px] text-outline leading-tight mt-0.5">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
