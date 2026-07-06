'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ImageOff, ExternalLink, User, FileText } from 'lucide-react'
import { storiesApi, type StoryRefResult } from '@/lib/api'

interface StoryRefCardProps {
  refType: string
  refId: string
  /** When true, tapping navigates to the source (viewer mode). When false, shows static preview (composer mode). */
  interactive?: boolean
  /** Callback when the card content is clicked in interactive mode */
  onNavigate?: () => void
}

export function StoryRefCard({ refType, refId, interactive = true, onNavigate }: StoryRefCardProps): React.JSX.Element {
  const [ref, setRef] = useState<StoryRefResult | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    storiesApi.resolveRef(refType, refId)
      .then((result) => { if (!cancelled) setRef(result) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [refType, refId])

  // Unavailable content
  if (error || (ref && !ref.available)) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-white/50" />
        </div>
        <div>
          <p className="text-white text-[13px] font-semibold">Content unavailable</p>
          <p className="text-white/50 text-[11px]">This content is no longer available</p>
        </div>
      </div>
    )
  }

  if (!ref) {
    // Loading skeleton
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-32 bg-white/10 rounded" />
          <div className="h-2.5 w-20 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  const isProfile = ref.type === 'profile'
  const Icon = isProfile ? User : FileText

  const cardContent = (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 group hover:bg-black/30 transition-colors">
      {/* Thumbnail/avatar */}
      {ref.thumbnailUrl || ref.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ref.thumbnailUrl ?? ref.avatarUrl!}
          alt=""
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white/60" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold truncate leading-tight">
          {ref.title}
          {interactive && <ExternalLink className="w-3 h-3 inline-block ml-1 text-white/40 group-hover:text-white/70 transition-colors" />}
        </p>
        <p className="text-white/50 text-[11px] truncate leading-tight mt-0.5">{ref.subtitle}</p>
      </div>
      {interactive && (
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
          <ExternalLink className="w-3.5 h-3.5 text-white/60" />
        </div>
      )}
    </div>
  )

  // Interactive → wrap in <a> to open source
  if (interactive && ref.available) {
    return (
      <Link href={ref.deepLink} {...(onNavigate ? { onClick: onNavigate } : {})} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
