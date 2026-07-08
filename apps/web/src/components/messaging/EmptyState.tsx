'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Send, MessageCircle, AtSign } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { MessageButton } from '@/components/MessageButton'
import { useAuth } from '@/hooks/use-auth'
import { useMessaging } from '@/hooks/use-messaging'
import type { Suggestion } from '@/hooks/use-messaging'

interface EmptyStateProps {
  onStartNewMessage: (() => void) | undefined
}

export function EmptyState({ onStartNewMessage }: EmptyStateProps): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const { suggestions, refreshSuggestions } = useMessaging()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      void refreshSuggestions().finally(() => setLoading(false))
    }
  }, [isAuthenticated, refreshSuggestions])

  return (
    <div className="flex-1 flex flex-col bg-surface-container-low overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center">
        {/* Large illustration */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mb-6 shadow-inner">
          <Send className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-2xl font-light text-on-surface mb-2">Your Messages</h2>
        <p className="text-label-md text-outline mb-8 max-w-xs">
          Send private messages to friends, professionals, and communities.
        </p>

        {/* CTA button */}
        <button
          onClick={onStartNewMessage}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-label-md hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          Send Message
        </button>
      </div>

      {/* Suggested users */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-label-md font-bold text-on-surface">Suggested</h3>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-surface-container" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-surface-container rounded" />
                  <div className="h-2.5 w-24 bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-1">
            {suggestions.slice(0, 5).map((person) => (
              <SuggestedUserCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <p className="text-label-sm text-outline text-center py-4">
            No suggestions yet — <Link href="/network" className="text-primary hover:underline">find people</Link> to connect with.
          </p>
        )}

        {suggestions.length > 5 && (
          <button
            onClick={() => onStartNewMessage?.()}
            className="w-full mt-2 text-label-sm text-primary hover:underline py-2 cursor-pointer"
          >
            See all
          </button>
        )}
      </div>
    </div>
  )
}

function SuggestedUserCard({ person }: { person: Suggestion }): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors group">
      <Link href={`/profile/${person.username}`} className="flex-shrink-0">
        <UserAvatar
          name={person.displayName}
          image={person.avatarUrl ?? undefined}
          size="md"
          verified={person.isVerified}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${person.username}`}
          className="text-label-md font-semibold text-on-surface hover:underline truncate block leading-tight"
        >
          {person.displayName}
        </Link>
        <div className="flex items-center gap-1 text-[11px] text-outline">
          <AtSign className="w-2.5 h-2.5" />
          <span className="truncate">{person.username}</span>
        </div>
        {person.isOnline && (
          <span className="text-[10px] text-green-600 font-medium">Active now</span>
        )}
      </div>
      <MessageButton userId={person.id} size="sm" />
    </div>
  )
}
