'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Hash, TrendingUp } from 'lucide-react'
import { hashtagsApi } from '@/lib/api'
import { useFormat } from '@/hooks/use-format'

interface TopicChip {
  tag: string
  postsCount: number
}

function TopicChip({ tag, postsCount }: TopicChip): React.JSX.Element {
  const { n } = useFormat()
  return (
    <Link
      href={`/explore/tags/${encodeURIComponent(tag)}`}
      className="group flex flex-shrink-0 items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-lowest px-4 py-2 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.97]"
    >
      <Hash className="size-3.5 text-primary/70 group-hover:text-primary" />
      <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary">
        {tag}
      </span>
      <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-[11px] font-medium text-outline group-hover:bg-primary/10 group-hover:text-primary/80">
        {n(postsCount)}
      </span>
    </Link>
  )
}

function TopicsSkeleton(): React.JSX.Element {
  return (
    <div className="flex gap-2.5 overflow-hidden">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="h-9 w-24 flex-shrink-0 rounded-full bg-surface-container animate-pulse"
        />
      ))}
    </div>
  )
}

/**
 * TopicsRail — the "Topics for you" discovery rail. Pulls the viewer's top
 * hashtags by affinity score (aff:tag:{userId}) with live post counts, and
 * links each chip to its hashtag discovery page. Hidden entirely when there is
 * nothing to show (cold start, empty profile, or fetch failure).
 */
export function TopicsRail(): React.JSX.Element | null {
  const [topics, setTopics] = useState<TopicChip[] | null>(null)

  useEffect(() => {
    let cancelled = false
    hashtagsApi
      .forYou()
      .then((data) => {
        if (!cancelled) setTopics(data)
      })
      .catch(() => {
        if (!cancelled) setTopics([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (topics === null) return <TopicsSkeleton />
  if (topics.length === 0) return null

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/25 p-3 shadow-sm">
      <div className="flex items-center gap-2 px-1 pb-2.5">
        <TrendingUp className="size-4 text-primary" />
        <h2 className="text-label-md font-bold text-on-surface">Topics for you</h2>
        <span className="text-label-sm text-outline">based on what you like</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
        {topics.map((t) => (
          <TopicChip key={t.tag} tag={t.tag} postsCount={t.postsCount} />
        ))}
      </div>
    </div>
  )
}
