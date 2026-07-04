'use client'

import Link from 'next/link'
import { AtSign, BadgeCheck } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { UserAvatar } from './UserAvatar'

export function ProfileCard(): React.JSX.Element {
  const { profile } = useAuth()

  if (!profile) {
    // Skeleton — never show placeholder identity data
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="h-16 bg-surface-container animate-pulse" />
        <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest bg-surface-container animate-pulse" />
          <div className="mt-3 h-4 w-32 bg-surface-container rounded animate-pulse" />
          <div className="mt-2 h-3 w-24 bg-surface-container rounded animate-pulse" />
          <div className="w-full h-[1px] bg-outline-variant/30 my-4" />
          <div className="w-full h-8 bg-surface-container rounded animate-pulse" />
        </div>
      </section>
    )
  }

  const isVerified = profile.verificationTier === 'professional'

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
      {/* Cover */}
      <div className="h-16 bg-gradient-to-r from-primary/30 via-primary/10 to-secondary/20" />

      <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
        <Link href="/profile" className="ring-4 ring-surface-container-lowest rounded-full">
          <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="lg" verified={isVerified} />
        </Link>
        <Link href="/profile" className="mt-3 flex items-center gap-1 hover:underline">
          <h2 className="font-headline text-headline-md text-on-surface">{profile.displayName}</h2>
          {isVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
        </Link>
        <p className="flex items-center gap-0.5 text-label-sm text-outline">
          <AtSign className="w-3 h-3" />{profile.username}
        </p>
        {profile.bio && (
          <p className="text-label-sm text-outline text-center mt-1 line-clamp-2">{profile.bio}</p>
        )}

        <div className="w-full h-[1px] bg-outline-variant/30 my-4" />

        <div className="w-full flex justify-around text-center">
          <Link href="/profile" className="flex flex-col cursor-pointer group">
            <span className="text-label-md font-bold text-primary group-hover:underline">{profile.followersCount}</span>
            <span className="text-[11px] text-outline">Followers</span>
          </Link>
          <Link href="/profile" className="flex flex-col cursor-pointer group">
            <span className="text-label-md font-bold text-primary group-hover:underline">{profile.followingCount}</span>
            <span className="text-[11px] text-outline">Following</span>
          </Link>
          <Link href="/profile" className="flex flex-col cursor-pointer group">
            <span className="text-label-md font-bold text-primary group-hover:underline">{profile.postsCount}</span>
            <span className="text-[11px] text-outline">Posts</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
