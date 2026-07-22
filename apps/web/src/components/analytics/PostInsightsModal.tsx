'use client'

import { useEffect, useState } from 'react'
import { X, Eye, Users, Heart, BarChart3, Loader2, Smartphone, Globe2, Compass } from 'lucide-react'
import { analyticsApi, type PostInsights } from '@/lib/api'

/** Per-post analytics sheet — professional authors only (backend-gated). */
export function PostInsightsModal({ postId, onClose }: { postId: string; onClose: () => void }): React.JSX.Element {
  const [data, setData] = useState<PostInsights | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    analyticsApi.postInsights(postId)
      .then((d) => { if (!cancelled) setData(d) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load insights') })
    return () => { cancelled = true }
  }, [postId])

  const total = data ? data.reachFollowers + data.reachNonFollowers : 0
  const folPct = total > 0 ? Math.round((data!.reachFollowers / total) * 100) : 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Post insights</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto">
          {error ? (
            <p className="text-label-sm text-outline text-center py-8">{error}</p>
          ) : !data ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-5">
              {/* Headline tiles */}
              <div className="grid grid-cols-2 gap-3">
                <Tile Icon={Eye} label="Impressions" value={data.impressions} />
                <Tile Icon={Users} label="Reach" value={data.reach} hint="unique accounts" />
                <Tile Icon={Compass} label="Views" value={data.views} />
                <Tile Icon={Heart} label="Engagement" value={`${(data.engagementRate * 100).toFixed(0)}%`} hint="of reach" />
              </div>

              {/* Follower vs non-follower reach */}
              <div>
                <p className="text-label-sm font-bold text-on-surface mb-1.5">Reach breakdown</p>
                {total > 0 ? (
                  <>
                    <div className="flex h-3 rounded-full overflow-hidden bg-surface-container">
                      <div className="bg-primary" style={{ width: `${folPct}%` }} />
                      <div className="bg-secondary" style={{ width: `${100 - folPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[12px] mt-1.5">
                      <span className="flex items-center gap-1 text-primary font-semibold"><span className="w-2 h-2 rounded-full bg-primary" />Followers {data.reachFollowers}</span>
                      <span className="flex items-center gap-1 text-secondary font-semibold"><span className="w-2 h-2 rounded-full bg-secondary" />Non-followers {data.reachNonFollowers}</span>
                    </div>
                  </>
                ) : <p className="text-[12px] text-outline">No reach data yet.</p>}
              </div>

              {/* Engagement counts */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {([['Likes', data.engagement.likes], ['Comments', data.engagement.comments], ['Saves', data.engagement.saves], ['Shares', data.engagement.shares]] as const).map(([l, v]) => (
                  <div key={l} className="bg-surface-container-low rounded-xl py-2">
                    <p className="text-label-md font-bold text-on-surface tabular-nums">{v}</p>
                    <p className="text-[10px] text-outline">{l}</p>
                  </div>
                ))}
              </div>

              <Breakdown Icon={Compass} title="By source" rows={data.bySurface} />
              <Breakdown Icon={Smartphone} title="By device" rows={data.byDevice} />
              <Breakdown Icon={Globe2} title="By country" rows={data.byCountry} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Tile({ Icon, label, value, hint }: { Icon: typeof Eye; label: string; value: string | number; hint?: string }): React.JSX.Element {
  return (
    <div className="bg-surface-container-low rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-outline"><Icon className="w-3.5 h-3.5" /><span className="text-[11px]">{label}</span></div>
      <p className="text-headline-md font-bold text-on-surface tabular-nums mt-0.5">{value}</p>
      {hint && <p className="text-[10px] text-outline">{hint}</p>}
    </div>
  )
}

function Breakdown({ Icon, title, rows }: { Icon: typeof Eye; title: string; rows: { key: string; count: number }[] }): React.JSX.Element | null {
  if (!rows || rows.length === 0) return null
  const max = Math.max(...rows.map((r) => r.count), 1)
  return (
    <div>
      <p className="text-label-sm font-bold text-on-surface mb-1.5 flex items-center gap-1.5"><Icon className="w-4 h-4 text-primary" />{title}</p>
      <div className="space-y-1.5">
        {rows.slice(0, 6).map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span className="text-[12px] text-on-surface-variant w-20 truncate capitalize">{r.key}</span>
            <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden"><div className="h-full bg-primary/60 rounded-full" style={{ width: `${(r.count / max) * 100}%` }} /></div>
            <span className="text-[12px] text-outline tabular-nums w-8 text-right">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
