'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, AtSign } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { FollowButton, initialFollowState } from './FollowButton'
import { PROFESSIONAL_CATEGORY_LABELS, type FollowSuggestion } from '@/lib/api'

interface PeopleCardProps {
  suggestion: FollowSuggestion
}

export function PeopleCard({ suggestion }: PeopleCardProps): React.JSX.Element {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return <></>

  const categoryLabel = suggestion.professionalCategory
    ? (PROFESSIONAL_CATEGORY_LABELS[suggestion.professionalCategory] ?? suggestion.professionalCategory)
    : null

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
      {/* Mini cover */}
      <div className="h-14 bg-gradient-to-r from-primary/20 to-secondary/10" />

      <div className="px-4 pb-4 -mt-6 flex flex-col flex-1">
        <Link href={`/profile/${suggestion.username}`} className="group">
          <UserAvatar
            name={suggestion.displayName}
            image={suggestion.avatarUrl ?? undefined}
            size="lg"
            verified={suggestion.isVerified}
            className="ring-2 ring-surface-container-lowest mb-2"
          />
          <p className="font-semibold text-label-md text-on-surface leading-tight group-hover:underline">{suggestion.displayName}</p>
          <p className="flex items-center gap-0.5 text-[11px] text-outline mt-0.5 leading-tight">
            <AtSign className="w-2.5 h-2.5" />{suggestion.username}
          </p>
        </Link>

        {categoryLabel && (
          <span className="mt-1.5 self-start px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-wider rounded-full">
            {categoryLabel}
          </span>
        )}

        {suggestion.bio && (
          <p className="text-[11px] text-outline mt-2 leading-snug line-clamp-2">{suggestion.bio}</p>
        )}

        {suggestion.mutualConnections > 0 && (
          <div className="flex items-center gap-1 mt-2 text-[11px] text-outline">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span>{suggestion.mutualConnections} mutual connection{suggestion.mutualConnections > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-4">
          <FollowButton
            userId={suggestion.id}
            initialState={initialFollowState(suggestion)}
            followsViewer={!!suggestion.followsViewer}
            className="flex-1 py-1.5"
          />
          <button
            onClick={() => setDismissed(true)}
            className="px-3 py-1.5 rounded-lg text-label-sm text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
