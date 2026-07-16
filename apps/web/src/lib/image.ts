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

export async function processImage(file: File, maxEdge = 1280, quality = 0.7): Promise<ProcessedImage> {
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
    encodeCanvas(thumb, 0.65),
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
  maxEdge = 1600,
  quality = 0.7,
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image could not be loaded'))
    img.src = src
  })
}

/** A crop rectangle in the source image's natural pixel coordinates. */
export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Render a crop region of an image to a fixed output size and return a WebP blob.
 * Used by the avatar/banner editor to bake the user's chosen zoom+position into
 * the uploaded file, so it displays identically everywhere without any position
 * metadata. `imageSrc` is typically an object URL from the selected file.
 */
export async function getCroppedBlob(
  imageSrc: string,
  crop: PixelCrop,
  outWidth: number,
  outHeight: number,
  quality = 0.7,
): Promise<Blob> {
  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = outWidth
  canvas.height = outHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, outWidth, outHeight)
  return encodeCanvas(canvas, quality)
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
