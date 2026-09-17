'use client'

import { UserAvatar } from '@/components/UserAvatar'
import type { MentionSuggestion } from '@/lib/api'

/**
 * The list that drops out of a composer when you type "@".
 *
 * Positioned by the caller, which owns the `relative` box around its textarea.
 * Mouse down rather than click, because a click fires after the textarea has
 * already lost focus and the browser has moved the caret — by then there is no
 * token left to replace.
 */
export function MentionSuggestions({
  suggestions,
  loading,
  activeIndex,
  onHover,
  onSelect,
}: {
  suggestions: MentionSuggestion[]
  loading: boolean
  activeIndex: number
  onHover: (index: number) => void
  onSelect: (s: MentionSuggestion) => void
}): React.JSX.Element | null {
  if (!loading && suggestions.length === 0) return null

  return (
    <div
      role="listbox"
      aria-label="People you can tag"
      className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg"
    >
      {suggestions.length === 0 && loading ? (
        <p className="px-4 py-3 text-label-sm text-outline">Searching…</p>
      ) : (
        suggestions.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => onHover(i)}
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(s)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
              i === activeIndex ? 'bg-surface-container' : 'hover:bg-surface-container-low'
            }`}
          >
            <UserAvatar
              name={s.displayName}
              image={s.avatarUrl ?? undefined}
              size="sm"
              verified={s.verificationTier !== 'none'}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label-md font-semibold text-on-surface">
                @{s.username}
              </span>
              <span className="block truncate text-label-sm text-outline">{s.displayName}</span>
            </span>
          </button>
        ))
      )}
    </div>
  )
}
