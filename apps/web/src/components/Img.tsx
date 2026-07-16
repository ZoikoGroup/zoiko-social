'use client'

import { blurhashToDataURL } from '@/lib/image'

/**
 * Host-agnostic performant image:
 *  - lazy-loads offscreen (defers network) unless `priority`
 *  - async decode (no main-thread jank on scroll)
 *  - blurhash placeholder shows through until the real image paints over it
 *
 * A drop-in replacement for <img> that preserves layout (no fixed dimensions
 * required), so it behaves the same on Vercel today and Cloud Run later.
 * Add an image CDN (Cloudflare Images / a GCS resizer) later for automatic
 * responsive resizing without touching any call site.
 */
interface ImgProps {
  src: string
  alt?: string
  className?: string
  blurhash?: string | null | undefined
  priority?: boolean
}

export function Img({ src, alt = '', className = '', blurhash, priority = false }: ImgProps): React.JSX.Element {
  const blur = blurhash ? blurhashToDataURL(blurhash) : undefined
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={blur ? { backgroundImage: `url(${blur})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    />
  )
}
