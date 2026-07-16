import { encode, decode } from 'blurhash'

/**
 * Client-side image pipeline for post uploads:
 * resize to max edge → WebP → blurhash placeholder.
 * A phone photo becomes ~100-300KB before it ever leaves the device.
 */

export interface ProcessedImage {
  blob: Blob
  /** 320px thumbnail — grids and small slots load ~10× less data */
  thumbnailBlob: Blob
  width: number
  height: number
  blurhash: string
}

function encodeCanvas(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Image encoding failed'))),
      'image/webp',
      quality,
    )
  })
}

function drawScaled(bitmap: ImageBitmap, maxEdge: number): HTMLCanvasElement {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas
}

export async function processImage(file: File, maxEdge = 1440, quality = 0.82): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file)

  const full = drawScaled(bitmap, maxEdge)
  const thumb = drawScaled(bitmap, 320)

  // Blurhash from a tiny downscale (32px) — encoding full-size is slow
  const bhCanvas = drawScaled(bitmap, 32)
  const bhCtx = bhCanvas.getContext('2d')!
  const pixels = bhCtx.getImageData(0, 0, bhCanvas.width, bhCanvas.height)
  const blurhash = encode(pixels.data, pixels.width, pixels.height, 4, 3)

  bitmap.close()

  const [blob, thumbnailBlob] = await Promise.all([
    encodeCanvas(full, quality),
    encodeCanvas(thumb, 0.8),
  ])

  return { blob, thumbnailBlob, width: full.width, height: full.height, blurhash }
}

/**
 * Compress an image for chat/attachment upload: resize to max edge → WebP.
 * Animated GIFs are returned untouched (canvas re-encoding would freeze them),
 * and if compression doesn't actually shrink the file the original is kept.
 */
export async function compressImage(
  file: File,
  maxEdge = 1920,
  quality = 0.82,
): Promise<{ blob: Blob; fileName: string; mimeType: string }> {
  if (file.type === 'image/gif') {
    return { blob: file, fileName: file.name, mimeType: file.type }
  }

  try {
    const bitmap = await createImageBitmap(file)
    const canvas = drawScaled(bitmap, maxEdge)
    bitmap.close()
    const blob = await encodeCanvas(canvas, quality)

    if (blob.size >= file.size) {
      return { blob: file, fileName: file.name, mimeType: file.type }
    }
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return { blob, fileName: `${baseName}.webp`, mimeType: 'image/webp' }
  } catch {
    // Undecodable in this browser — upload the original rather than failing
    return { blob: file, fileName: file.name, mimeType: file.type }
  }
}

/** Render a blurhash to a data URL for use as an <img> placeholder. */
export function blurhashToDataURL(hash: string, width = 32, height = 32): string {
  try {
    const pixels = decode(hash, width, height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  } catch {
    return ''
  }
}

// ── Image CDN Optimization ─────────────────────────────────────────────────────
// Supabase Storage has a built-in image transformation endpoint that serves
// auto-format (WebP/AVIF), resized, and quality-optimized images. We auto-detect
// Supabase public URLs and rewrite them to use this endpoint.

const SUPABASE_RENDER_RE = /^https:\/\/[^.]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/i

/**
 * Common responsive breakpoints used across the app.
 * These match typical Tailwind container widths the images appear in.
 */
export const IMG_BREAKPOINTS = [320, 640, 960, 1280] as const

/**
 * Rewrite a Supabase Storage public URL to use the render (transform) endpoint
 * with `format=auto` (serves WebP/AVIF depending on browser support) and
 * optional resizing. Returns the original URL unchanged for non-Supabase URLs.
 *
 * If the URL already has query parameters (unusual for public Supabase URLs,
 * but possible with presigned or migrated URLs), pass it through unchanged
 * to avoid double `?` corruption.
 *
 * @example
 *   input:  https://abc.supabase.co/storage/v1/object/public/post-media/photo.webp
 *   output: https://abc.supabase.co/storage/v1/render/image/public/post-media/photo.webp?format=auto&quality=78
 */
export function getOptimizedUrl(src: string, width?: number): string {
  // Pass through if already has query params (avoids double-? corruption)
  if (src.includes('?')) return src

  const match = src.match(SUPABASE_RENDER_RE)
  if (!match) return src // pass-through for R2 / external URLs

  const params = new URLSearchParams()
  params.set('format', 'auto')
  params.set('quality', '78')
  if (width) params.set('width', String(width))

  // Rewrite to the render endpoint
  const base = src.replace(
    /^(https:\/\/[^.]+\.supabase\.co)\/storage\/v1\/object\/public\//i,
    '$1/storage/v1/render/image/public/',
  )
  return `${base}?${params.toString()}`
}

/**
 * Generate a responsive `srcSet` string from a Supabase storage URL.
 * Returns undefined for non-Supabase URLs so the consumer can fall back.
 */
export function getSrcSet(src: string): string | undefined {
  if (!SUPABASE_RENDER_RE.test(src)) return undefined
  return IMG_BREAKPOINTS
    .map((w) => `${getOptimizedUrl(src, w)} ${w}w`)
    .join(', ')
}

/**
 * Default `sizes` attribute — covers the most common layouts.
 * Consumption pages can override this via the `sizes` prop on `Img`.
 */
export const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
