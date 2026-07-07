'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Info, AtSign, MapPin, TrendingUp, Calendar, ShieldCheck, ChevronRight } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { FollowButton, initialFollowState } from './FollowButton'
import { SkeletonWidget } from './Skeletons'
import { networkApi, hashtagsApi, PROFESSIONAL_CATEGORY_LABELS, type FollowSuggestion } from '@/lib/api'

interface Trending { tag: string; postsCount: number }

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

function Section({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-md font-bold text-on-surface">{title}</h3>
        {href && (
          <Link href={href} className="text-[11px] text-primary hover:underline font-medium">
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export function RightPanel(): React.JSX.Element {
  const [suggestions, setSuggestions] = useState<FollowSuggestion[]>([])
  const [trending, setTrending] = useState<Trending[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([networkApi.getSuggestions(), hashtagsApi.trending()])
      .then(([sug, trend]) => {
        if (cancelled) return
        if (sug.status === 'fulfilled') setSuggestions(sug.value.slice(0, 4))
        if (trend.status === 'fulfilled') setTrending(trend.value.slice(0, 5))
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-gutter">
      {/* Local Alerts — welfare/safety near you (live source wired later) */}
      <Section title="Local Alerts" href="/lost-found">
        <div className="flex items-center gap-2 text-label-sm text-outline py-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Alerts near you will appear here — check Lost &amp; Found for the latest.</span>
        </div>
      </Section>

      {/* People & Orgs to Follow — real network suggestions */}
      <Section title="People &amp; Orgs to Follow" href="/network">
        {loading ? (
          <SkeletonWidget />
        ) : suggestions.length === 0 ? (
          <p className="text-label-sm text-outline py-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            No suggestions yet.
          </p>
        ) : (
          <div className="space-y-3.5">
            {suggestions.map((person) => {
              const categoryLabel = person.professionalCategory
                ? (PROFESSIONAL_CATEGORY_LABELS[person.professionalCategory] ?? person.professionalCategory)
                : null
              return (
                <div key={person.id} className="flex items-center gap-3">
                  <Link href={`/profile/${person.username}`}>
                    <UserAvatar name={person.displayName} image={person.avatarUrl ?? undefined} size="md" verified={person.isVerified} />
                  </Link>
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link href={`/profile/${person.username}`} className="text-label-sm font-semibold truncate hover:underline">
                      {person.displayName}
                    </Link>
                    <span className="text-[11px] text-outline leading-tight truncate">
                      {categoryLabel ?? (
                        <span className="flex items-center gap-0.5"><AtSign className="w-2.5 h-2.5" />{person.username}</span>
                      )}
                    </span>
                  </div>
                  <FollowButton
                    userId={person.id}
                    initialState={initialFollowState(person)}
                    followsViewer={!!person.followsViewer}
                    className="px-3 py-1 text-[12px] flex-shrink-0"
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Trending in Animal Welfare — real trending hashtags */}
      {(loading || trending.length > 0) && (
        <Section title="Trending in Animal Welfare" href="/explore">
          {loading ? (
            <SkeletonWidget />
          ) : (
            <div className="space-y-2.5">
              {trending.map((t) => (
                <Link
                  key={t.tag}
                  href={`/explore/tags/${encodeURIComponent(t.tag)}`}
                  className="flex items-center justify-between group"
                >
                  <span className="flex items-center gap-1.5 text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    #{t.tag}
                  </span>
                  <span className="text-[11px] text-outline flex-shrink-0">{formatCount(t.postsCount)} posts</span>
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Upcoming Events */}
      <Section title="Upcoming Events" href="/events">
        <div className="flex items-center gap-2 text-label-sm text-outline py-2">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Find adoption days, workshops and meetups on the Events page.</span>
        </div>
      </Section>

      {/* Build trust / Verify profile CTA */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-4 shadow-sm">
        <div className="flex items-start gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-label-md font-bold text-on-surface leading-tight">Build trust on ZoikoSocial</h3>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Verify your profile to show credibility and unlock exclusive features.
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className="mt-1 flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Verify Your Profile
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap gap-x-3 gap-y-1.5 px-2 text-[11px] text-outline">
        <Link href="/settings" className="hover:text-primary hover:underline">About</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Accessibility</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Help Center</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Privacy &amp; Terms</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Ad Choices</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">Community Guidelines</Link>
        <p className="mt-1.5 w-full">&copy; 2026 ZoikoSocial. All rights reserved.</p>
      </footer>
    </div>
  )
}
