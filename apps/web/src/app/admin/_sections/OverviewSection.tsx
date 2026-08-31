'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { adminApi, type AdminStats } from '@/lib/api'

/**
 * The numbers, and the warnings that come with them.
 *
 * Two of these turn amber at zero because zero is not a neutral reading: a
 * platform with no staff has queues nobody can work, and one with no news
 * sources ingests nothing. Both were true of this deployment, and neither was
 * visible anywhere until it was put on the front page of the panel.
 */

const STATS: { key: keyof AdminStats; label: string; alertWhenZero?: boolean }[] = [
  { key: 'users', label: 'Members' },
  { key: 'staff', label: 'Staff', alertWhenZero: true },
  { key: 'suspended', label: 'Suspended' },
  { key: 'posts', label: 'Posts' },
  { key: 'communities', label: 'Communities' },
  { key: 'articles', label: 'Articles' },
  { key: 'newsSources', label: 'News sources', alertWhenZero: true },
  { key: 'pendingArticles', label: 'Awaiting review' },
]

export function OverviewSection({
  onGo,
}: {
  /** Jump to another section — the warnings below link to where they are fixed. */
  onGo: (section: string) => void
}): React.JSX.Element {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    adminApi
      .stats()
      .then((s) => { if (!cancelled) setStats(s) })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load stats')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-outline" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 text-red-600 text-label-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error ?? 'Could not load stats'}</span>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-title-md font-bold mb-4">Overview</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {STATS.map(({ key, label, alertWhenZero }) => {
          const wrong = alertWhenZero && stats[key] === 0
          return (
            <div
              key={key}
              className={`p-3 rounded-xl border ${
                wrong
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-surface-container-lowest border-outline-variant/25'
              }`}
            >
              <p className="text-title-md font-bold text-on-surface">{stats[key].toLocaleString()}</p>
              <p className="text-label-sm text-outline">{label}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        {stats.staff === 0 && (
          <Warning onClick={() => onGo('people')}>
            No staff accounts exist, so every review queue has nobody to work it. The first admin
            has to be set directly in the database — an API that let a member promote themselves
            would defeat the whole role ladder.
          </Warning>
        )}
        {stats.newsSources === 0 && (
          <Warning onClick={() => onGo('news')}>
            No news sources are configured, so nothing is ingested. Add a feed under News.
          </Warning>
        )}
        {stats.pendingArticles > 0 && (
          <Warning onClick={() => onGo('news')}>
            {stats.pendingArticles} submitted {stats.pendingArticles === 1 ? 'article is' : 'articles are'}{' '}
            waiting on a decision and will not reach anyone&apos;s feed until reviewed.
          </Warning>
        )}
        {stats.openReports > 0 && (
          <Warning onClick={() => onGo('moderation')}>
            {stats.openReports} open {stats.openReports === 1 ? 'report' : 'reports'} in the
            moderation queue.
          </Warning>
        )}
      </div>
    </div>
  )
}

/** A warning that takes you to where it is fixed, rather than just stating it. */
function Warning({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-label-sm text-left hover:bg-amber-500/15 transition-colors cursor-pointer"
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </button>
  )
}
