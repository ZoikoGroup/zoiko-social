'use client'

import Link from 'next/link'
import { Users, Lock, BadgeCheck } from 'lucide-react'
import type { CommunityCard as CommunityCardData } from '@/lib/api'

function count(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function CommunityCard({ community }: { community: CommunityCardData }): React.JSX.Element {
  return (
    <Link
      href={`/c/${community.slug}`}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:border-primary/40 transition-colors group"
    >
      {/* Cover */}
      <div className="h-20 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 relative">
        {community.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={community.coverUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="px-4 pb-4 -mt-6 flex flex-col flex-1">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-surface-container-lowest overflow-hidden flex items-center justify-center flex-shrink-0">
          {community.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <Users className="w-5 h-5 text-primary" />
          )}
        </div>

        <div className="flex items-center gap-1 mt-2">
          <p className="font-semibold text-label-md text-on-surface leading-tight group-hover:text-primary transition-colors truncate">
            {community.name}
          </p>
          {community.isVerified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
          {community.privacy !== 'public' && <Lock className="w-3 h-3 text-outline flex-shrink-0" />}
        </div>

        {community.description && (
          <p className="text-[11px] text-outline mt-1 leading-snug line-clamp-2">{community.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2 text-[11px] text-outline">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{count(community.membersCount)}</span>
          {community.category && <span className="capitalize">{community.category.replace('-', ' ')}</span>}
        </div>

        {community.viewerStatus === 'active' && (
          <span className="mt-2 self-start px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
            Member
          </span>
        )}
      </div>
    </Link>
  )
}
