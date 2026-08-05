'use client'

import { useState } from 'react'
import { Hash, X } from 'lucide-react'

/**
 * Tag entry, shared by every form whose entity carries tags.
 *
 * Tags reached the database before this existed — `communities.tags` has been a
 * column since the beginning — but there was no way for anyone to set one, so
 * every array was empty. This is the missing input.
 *
 * Normalisation is mirrored from the server (`common/utils/tags.ts`) so what
 * someone sees in the chips is what gets stored: typing `#Beagle` shows
 * `beagle`, because a chip that then saves as something else is a small lie.
 */

const MAX_TAGS = 10
const MAX_TAG_LENGTH = 40

/** Same rule as the API: letters, digits, underscore. Nothing that creates lookalikes. */
function normalize(raw: string): string | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^#+/, '')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, MAX_TAG_LENGTH)
  return cleaned.length > 0 ? cleaned : null
}

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  /** Shown when empty — worth making specific to the surface. */
  placeholder?: string
  label?: string
  hint?: string
}

export function TagInput({
  value,
  onChange,
  placeholder = 'beagle, rescue, puppy…',
  label = 'Tags',
  hint = 'Helps people find this on the tag page. Press Enter or comma to add.',
}: TagInputProps): React.JSX.Element {
  const [draft, setDraft] = useState('')
  const full = value.length >= MAX_TAGS

  function commit(raw: string): void {
    const tag = normalize(raw)
    setDraft('')
    if (!tag || full || value.includes(tag)) return
    onChange([...value, tag])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(draft)
      return
    }
    // Backspace on an empty box removes the last chip — the behaviour people
    // expect from every other tag field they've used.
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      <label htmlFor="tag-input" className="block text-label-sm font-semibold text-on-surface mb-1.5">
        {label} <span className="font-normal text-outline">({value.length}/{MAX_TAGS})</span>
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-semibold"
            >
              <Hash className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        id="tag-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        // Committing on blur means a typed-but-unconfirmed tag isn't silently
        // lost when someone tabs straight to Save.
        onBlur={() => commit(draft)}
        disabled={full}
        placeholder={full ? `Maximum ${MAX_TAGS} tags` : placeholder}
        className="w-full px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-sm focus:border-primary focus:outline-none disabled:opacity-60"
      />
      <p className="text-[11px] text-outline mt-1">{hint}</p>
    </div>
  )
}
