'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Users, Compass, UserPlus, BarChart3, Smartphone, Globe2, Loader2 } from 'lucide-react'
import { Img } from '@/components/Img'
import { analyticsApi, type AccountInsights } from '@/lib/api'

/** Account-wide analytics card for the professional dashboard. */
export function AccountAnalyticsSection(): React.JSX.Element | null {
  const [data, setData] = useState<AccountInsights | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    analyticsApi.accountInsights()
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  if (failed) return null // non-pro or no data endpoint access — hide silently

  const total = data ? data.reachFollowers + data.reachNonFollowers : 0
  const folPct = total > 0 ? Math.round((data!.reachFollowers / total) * 100) : 0

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
      <h2 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Analytics</h2>
      {!data ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Tile Icon={Eye} label="Impressions" value={data.impressions} />
            <Tile Icon={Users} label="Reach" value={data.reach} />
            <Tile Icon={Compass} label="Views" value={data.views} />
            <Tile Icon={UserPlus} label="Followers" value={data.followersCount} />
          </div>

          {total > 0 && (
            <div>
              <p className="text-label-sm font-bold text-on-surface mb-1.5">Reach: followers vs non-followers</p>
              <div className="flex h-3 rounded-full overflow-hidden bg-surface-container">
                <div className="bg-primary" style={{ width: `${folPct}%` }} />
                <div className="bg-secondary" style={{ width: `${100 - folPct}%` }} />
              </div>
              <div className="flex justify-between text-[12px] mt-1.5">
                <span className="text-primary font-semibold">Followers {data.reachFollowers} ({folPct}%)</span>
                <span className="text-secondary font-semibold">Non-followers {data.reachNonFollowers}</span>
              </div>
            </div>
          )}

          {data.topPosts.length > 0 && (
            <div>
              <p className="text-label-sm font-bold text-on-surface mb-2">Top posts</p>
              <div className="space-y-2">
                {data.topPosts.map((p) => (
                  <Link key={p.postId} href={`/p/${p.postId}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container transition-colors">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                      {p.coverUrl ? <Img src={p.coverUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Compass className="w-4 h-4 text-outline" /></div>}
                    </div>
                    <p className="flex-1 min-w-0 text-label-sm text-on-surface truncate">{p.caption || 'Post'}</p>
                    <div className="text-right flex-shrink-0">
                      <p className="text-label-sm font-bold text-on-surface tabular-nums">{p.impressions}</p>
                      <p className="text-[10px] text-outline">impressions</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Mini Icon={Smartphone} title="Devices" rows={data.byDevice} />
            <Mini Icon={Globe2} title="Countries" rows={data.byCountry} />
          </div>

          {data.impressions === 0 && (
            <p className="text-[12px] text-outline text-center">No analytics yet — reach and views appear here as people see your posts.</p>
          )}
        </div>
      )}
    </section>
  )
}

function Tile({ Icon, label, value }: { Icon: typeof Eye; label: string; value: number }): React.JSX.Element {
  return (
    <div className="bg-surface-container-low rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-outline"><Icon className="w-3.5 h-3.5" /><span className="text-[11px]">{label}</span></div>
      <p className="text-headline-md font-bold text-on-surface tabular-nums mt-0.5">{value}</p>
    </div>
  )
}

function Mini({ Icon, title, rows }: { Icon: typeof Eye; title: string; rows: { key: string; count: number }[] }): React.JSX.Element {
  const max = Math.max(...rows.map((r) => r.count), 1)
  return (
    <div>
      <p className="text-label-sm font-bold text-on-surface mb-1.5 flex items-center gap-1.5"><Icon className="w-4 h-4 text-primary" />{title}</p>
      {rows.length === 0 ? <p className="text-[12px] text-outline">No data yet.</p> : (
        <div className="space-y-1.5">
          {rows.slice(0, 5).map((r) => (
            <div key={r.key} className="flex items-center gap-2">
              <span className="text-[12px] text-on-surface-variant w-16 truncate capitalize">{r.key}</span>
              <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden"><div className="h-full bg-primary/60 rounded-full" style={{ width: `${(r.count / max) * 100}%` }} /></div>
              <span className="text-[12px] text-outline tabular-nums w-8 text-right">{r.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
