'use client'

import { useState } from 'react'
import { MapPin, BarChart2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The message kinds composed in a dialog rather than typed: a shared location
 * and a poll.
 *
 * Both were being stored correctly and drawn as nothing. A location message
 * carries its coordinates in `metadata` and a poll carries its options in a
 * relation, and neither was returned by the API or rendered here — so sharing a
 * location produced an empty bubble with a delivered tick on it.
 */

// ── Location ─────────────────────────────────────────────────────────────────

export interface MessageLocation {
  lat: number
  lng: number
  label?: string
}

/** Reads the location out of a message's metadata, or null if it isn't one. */
export function locationFrom(metadata: unknown): MessageLocation | null {
  if (!metadata || typeof metadata !== 'object') return null
  const loc = (metadata as { location?: unknown }).location
  if (!loc || typeof loc !== 'object') return null
  const { lat, lng, label } = loc as { lat?: unknown; lng?: unknown; label?: unknown }
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, ...(typeof label === 'string' && label ? { label } : {}) }
}

/**
 * A shared location.
 *
 * Deliberately a link out to a map rather than an embedded one: an embed needs
 * a keyed tile provider and would load a third-party script into every chat,
 * and the thing someone actually wants from a shared pin is directions.
 */
export function LocationBubble({
  location,
  isMine,
}: {
  location: MessageLocation
  isMine: boolean
}): React.JSX.Element {
  const { lat, lng, label } = location
  const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors no-underline',
        isMine ? 'bg-white/15 hover:bg-white/25' : 'bg-surface-container hover:bg-surface-container-high',
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center size-9 rounded-lg flex-shrink-0',
          isMine ? 'bg-white/20' : 'bg-rose-500/15',
        )}
      >
        <MapPin className={cn('size-5', isMine ? 'text-white' : 'text-rose-500')} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium truncate">{label ?? 'Shared location'}</span>
        <span className={cn('block text-[11px] tabular-nums', isMine ? 'opacity-80' : 'text-muted-foreground')}>
          {coords}
        </span>
        <span className={cn('block text-[11px] font-medium', isMine ? 'opacity-90' : 'text-primary')}>
          Open in Maps
        </span>
      </span>
    </a>
  )
}

// ── Poll ─────────────────────────────────────────────────────────────────────

export interface MessagePoll {
  id: string
  question: string
  totalVotes: number
  options: { id: string; text: string; votes: number; votedByMe: boolean }[]
}

/**
 * A poll, with its result bars.
 *
 * Results are always visible rather than hidden until you vote: this is a chat
 * among people who already know each other, not a secret ballot, and hiding the
 * tally mostly teaches people to vote at random to reveal it.
 */
export function PollBubble({
  poll,
  isMine,
  onVote,
}: {
  poll: MessagePoll
  isMine: boolean
  onVote: (optionId: string) => Promise<void>
}): React.JSX.Element {
  const [busy, setBusy] = useState<string | null>(null)

  const vote = async (optionId: string) => {
    if (busy) return
    setBusy(optionId)
    try {
      await onVote(optionId)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mt-1 min-w-[220px] max-w-[300px]">
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart2 className={cn('size-3.5 flex-shrink-0', isMine ? 'opacity-80' : 'text-emerald-500')} />
        <span className={cn('text-[11px] font-semibold uppercase tracking-wide', isMine ? 'opacity-80' : 'text-muted-foreground')}>
          Poll
        </span>
      </div>

      <p className="text-sm font-medium mb-2">{poll.question}</p>

      <div className="space-y-1.5">
        {poll.options.map((option) => {
          // Percentages are of votes cast, so an unvoted poll shows empty bars
          // rather than dividing by zero.
          const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
          return (
            <button
              key={option.id}
              onClick={() => void vote(option.id)}
              disabled={busy !== null}
              className={cn(
                'relative w-full text-left px-2.5 py-1.5 rounded-lg overflow-hidden transition-colors cursor-pointer disabled:opacity-60',
                isMine ? 'bg-white/15 hover:bg-white/25' : 'bg-surface-container hover:bg-surface-container-high',
                option.votedByMe && (isMine ? 'ring-1 ring-white/50' : 'ring-1 ring-primary/50'),
              )}
            >
              {/* The bar sits behind the label so the text stays readable at any width. */}
              <span
                className={cn(
                  'absolute inset-y-0 left-0 transition-all duration-300',
                  isMine ? 'bg-white/20' : 'bg-primary/15',
                )}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
              <span className="relative flex items-center gap-1.5">
                {option.votedByMe && <Check className="size-3.5 flex-shrink-0" />}
                <span className="flex-1 text-[13px] truncate">{option.text}</span>
                <span className="text-[11px] tabular-nums opacity-80 flex-shrink-0">{pct}%</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className={cn('text-[11px] mt-1.5', isMine ? 'opacity-70' : 'text-muted-foreground')}>
        {poll.totalVotes === 0
          ? 'No votes yet'
          : `${poll.totalVotes} ${poll.totalVotes === 1 ? 'vote' : 'votes'}`}
        {poll.options.some((o) => o.votedByMe) && ' · tap your choice again to undo'}
      </p>
    </div>
  )
}
