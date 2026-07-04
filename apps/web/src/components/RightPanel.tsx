'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Info, AtSign } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { FollowButton, initialFollowState } from './FollowButton'
import { SkeletonWidget } from './Skeletons'
import { networkApi, PROFESSIONAL_CATEGORY_LABELS, type FollowSuggestion } from '@/lib/api'

export function RightPanel(): React.JSX.Element {
  const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    networkApi.getSuggestions(3)
      .then((data) => { if (!cancelled) setSuggestions(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-gutter">
      {/* Suggestions */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
        <h3 className="text-label-md font-bold mb-4 flex items-center justify-between">
          Suggested for you
          <Info className="w-4 h-4 text-outline" />
        </h3>
        {loading ? (
          <SkeletonWidget />
        ) : suggestions.length === 0 ? (
          <p className="text-label-sm text-outline py-2">
            No suggestions yet — explore the <Link href="/network" className="text-primary hover:underline">network</Link> to find people.
          </p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((person) => {
              const categoryLabel = person.professionalCategory
                ? (PROFESSIONAL_CATEGORY_LABELS[person.professionalCategory] ?? person.professionalCategory)
                : null
              return (
                <div key={person.id} className="flex items-start gap-3">
                  <Link href={`/profile/${person.username}`}>
                    <UserAvatar name={person.displayName} image={person.avatarUrl ?? undefined} size="md" verified={person.isVerified} />
                  </Link>
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link href={`/profile/${person.username}`} className="text-label-md font-semibold truncate hover:underline">
                      {person.displayName}
                    </Link>
                    <span className="flex items-center gap-0.5 text-[11px] text-outline leading-tight truncate">
                      <AtSign className="w-2.5 h-2.5" />{person.username}
                    </span>
                    {categoryLabel && (
                      <span className="text-[10px] text-secondary font-semibold truncate">{categoryLabel}</span>
                    )}
                    <FollowButton
                      userId={person.id}
                      initialState={initialFollowState(person)}
                      followsViewer={!!person.followsViewer}
                      className="mt-2 w-fit px-3 py-1"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Link href="/network" className="block mt-4 text-label-sm text-primary hover:underline">
          See all suggestions
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-[11px] text-outline">
        <Link href="/settings" className="hover:text-primary hover:underline">About</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Accessibility</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Help Center</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Privacy &amp; Terms</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Ad Choices</Link>
        <p className="mt-2 w-full">ZoikoSocial &copy; 2026</p>
      </footer>
    </div>
  )
}
