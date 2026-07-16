'use client'

import Link from 'next/link'
import { Users, Plus } from 'lucide-react'
import { communitiesApi, type CommunityCard } from '@/lib/api'
import { useCachedValue } from '@/hooks/use-cache'

export function CommunitiesWidget(): React.JSX.Element {
  const { data, isLoading: loading } = useCachedValue<CommunityCard[]>('communities:mine', () => communitiesApi.mine())
  const communities = (data ?? []).slice(0, 4)

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-md font-bold text-on-surface">My Groups</h3>
        <Link href="/communities" className="text-outline hover:text-primary transition-colors cursor-pointer p-0.5 rounded" aria-label="Browse communities">
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container animate-pulse flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-3 w-28 bg-surface-container rounded animate-pulse" />
                <div className="h-2 w-16 bg-surface-container rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : communities.length === 0 ? (
        <p className="text-label-sm text-outline">
          You haven&apos;t joined any communities yet.{' '}
          <Link href="/communities" className="text-primary hover:underline">Explore</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {communities.map((c, i) => {
            const tints = [
              'bg-red-500/10 text-red-600',
              'bg-blue-500/10 text-blue-600',
              'bg-emerald-500/10 text-emerald-600',
              'bg-primary/10 text-primary',
            ]
            const tint = tints[i % tints.length]
            return (
              <Link key={c.id} href={`/c/${c.slug}`} className="flex items-center gap-3 group cursor-pointer">
                <div className={`w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 ${c.avatarUrl ? '' : tint}`}>
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate leading-tight">{c.name}</div>
                  <div className="text-[11px] text-outline">{compact(c.membersCount)} members</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <Link
        href="/communities"
        className="block w-full mt-4 py-1.5 text-center text-label-sm font-semibold text-primary hover:bg-surface-container transition-colors rounded-lg"
      >
        Discover more groups
      </Link>
    </section>
  )
}

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}
