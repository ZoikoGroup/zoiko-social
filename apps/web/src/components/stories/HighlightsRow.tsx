'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { highlightsApi, type HighlightSummary, type HighlightResponse } from '@/lib/api'

interface HighlightsRowProps {
  profileId: string
  isOwn: boolean
}

export function HighlightsRow({ profileId, isOwn }: HighlightsRowProps): React.JSX.Element {
  const [highlights, setHighlights] = useState<HighlightSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingHighlight, setViewingHighlight] = useState<HighlightResponse | null>(null)

  useEffect(() => {
    highlightsApi.profileHighlights(profileId)
      .then(setHighlights)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profileId])

  if (loading) {
    return (
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
            <div className="w-16 h-16 rounded-full bg-surface-container animate-pulse" />
            <div className="h-2.5 w-12 bg-surface-container rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (highlights.length === 0 && !isOwn) return <></>

  return (
    <>
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
        {highlights.map((hl) => (
          <button
            key={hl.id}
            onClick={() => {
              highlightsApi.get(hl.id).then(setViewingHighlight).catch(() => {})
            }}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[72px] group cursor-pointer"
          >
            <div className="w-[64px] h-[64px] rounded-full ring-2 ring-outline-variant overflow-hidden">
              {hl.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hl.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container flex items-center justify-center">
                  <span className="text-lg font-bold text-on-surface-variant">{hl.title[0]}</span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium truncate w-full text-center leading-tight">
              {hl.title}
            </span>
          </button>
        ))}

        {isOwn && (
          <Link
            href="/me/archive"
            className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[72px] group cursor-pointer"
          >
            <div className="w-[64px] h-[64px] rounded-full ring-2 ring-dashed ring-outline-variant flex items-center justify-center">
              <Plus className="w-6 h-6 text-outline" />
            </div>
            <span className="text-[11px] text-outline font-medium text-center leading-tight">New</span>
          </Link>
        )}
      </div>

      {/* Highlight viewer overlay */}
      {viewingHighlight && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setViewingHighlight(null)}
        >
          <div className="relative w-full max-w-[420px] h-full max-h-[780px]">
            {/* Progress bars */}
            <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
              {viewingHighlight.items.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 rounded-full bg-white/30">
                  <div className="h-full bg-white rounded-full w-full" />
                </div>
              ))}
            </div>

            {/* Title */}
            <div className="absolute top-7 left-4 z-20">
              <p className="text-white text-sm font-semibold">{viewingHighlight.title}</p>
              <p className="text-white/50 text-[11px]">{viewingHighlight.items.length} stories</p>
            </div>

            {/* Items */}
            {viewingHighlight.items.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                {viewingHighlight.items[0]!.story.media[0]?.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewingHighlight.items[0]!.story.media[0].previewUrl!}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white/40 text-lg">{viewingHighlight.title}</div>
                )}
              </div>
            )}

            <button
              onClick={() => setViewingHighlight(null)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
