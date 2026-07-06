'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Plus } from 'lucide-react'
import { communitiesApi, type CommunityCard } from '@/lib/api'

export function CommunitiesWidget(): React.JSX.Element {
  const [communities, setCommunities] = useState<CommunityCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    communitiesApi.mine()
      .then((data) => { if (!cancelled) setCommunities(data.slice(0, 4)) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="text-label-md font-bold mb-4 flex items-center justify-between">
        Your Communities
        <Link href="/communities" className="text-outline hover:text-primary transition-colors cursor-pointer p-0.5 rounded" aria-label="Browse communities">
          <Plus className="w-4 h-4" />
        </Link>
      </h3>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container animate-pulse flex-shrink-0" />
              <div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" />
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
          {communities.map((c) => (
            <Link key={c.id} href={`/c/${c.slug}`} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-4 h-4 text-primary" />
                )}
              </div>
              <span className="text-label-md group-hover:text-primary transition-colors truncate">{c.name}</span>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/communities"
        className="block w-full mt-4 py-2 text-center text-label-sm font-semibold text-outline hover:bg-surface-container hover:text-primary transition-colors rounded-lg"
      >
        Discover more
      </Link>
    </section>
  )
}
