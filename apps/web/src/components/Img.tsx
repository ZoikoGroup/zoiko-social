'use client'

import { useState } from 'react'
import { blurhashToDataURL, getOptimizedUrl, getSrcSet, DEFAULT_SIZES } from '@/lib/image'

/**
 * Host-agnostic performant image:
 *  - lazy-loads offscreen (defers network) unless `priority`
 *  - async decode (no main-thread jank on scroll)
 *  - blurhash placeholder shows through until the real image paints over it
 *  - Auto-detects Supabase Storage URLs and serves them through the
 *    /render/image endpoint with format=auto (WebP/AVIF), quality=78,
 *    and responsive srcSet (320w, 640w, 960w, 1280w).
 *  - Non-Supabase URLs (R2, Unsplash) pass through unchanged.
 *
 * A drop-in replacement for <img> that preserves layout (no fixed dimensions
 * required), so it behaves the same on Vercel today and Cloud Run later.
 */
interface ImgProps {
  src: string
  alt?: string
  className?: string
  blurhash?: string | null | undefined
  priority?: boolean
  /**
   * Override the default `sizes` attribute for the responsive srcSet.
   * Default: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
   */
  sizes?: string
}

export function Img({ src, alt = '', className = '', blurhash, priority = false, sizes = DEFAULT_SIZES }: ImgProps): React.JSX.Element {
  // If the optimized (transform) URL fails to load, fall back to the original
  // src (and drop the responsive srcSet, which points at the same endpoint).
  const [failed, setFailed] = useState(false)
  const blur = blurhash ? blurhashToDataURL(blurhash) : undefined
  const optimizedSrc = failed ? src : getOptimizedUrl(src)
  const srcSet = failed || priority ? undefined : getSrcSet(src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={() => { if (!failed) setFailed(true) }}
      {...(srcSet ? { srcSet, sizes } : {})}
      style={blur ? { backgroundImage: `url(${blur})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    />
  )
}
