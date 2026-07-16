'use client'

import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { getCroppedBlob } from '@/lib/image'

interface ImageCropperProps {
  /** Object URL (or data URL) of the image being cropped. */
  imageSrc: string
  /** Crop frame aspect ratio (width / height). 1 for a square avatar, 4 for a wide banner. */
  aspect: number
  /** Circular mask for avatars, rectangular for banners. */
  cropShape?: 'round' | 'rect'
  /** Baked output dimensions in pixels. */
  outputWidth: number
  outputHeight: number
  /** WebP encode quality (0–1). Lower = smaller file. */
  quality?: number
  title: string
  onCancel: () => void
  onApply: (blob: Blob) => void
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1

/**
 * WhatsApp/LinkedIn-style image editor: drag to reposition, pinch/scroll/slider
 * to zoom, then bake the visible crop into a WebP blob. Presented as its own
 * modal layered above whatever opened it.
 */
export function ImageCropper({
  imageSrc,
  aspect,
  cropShape = 'rect',
  outputWidth,
  outputHeight,
  quality,
  title,
  onCancel,
  onApply,
}: ImageCropperProps): React.JSX.Element {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels)
  }, [])

  async function handleApply(): Promise<void> {
    if (!croppedArea) return
    setProcessing(true)
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea, outputWidth, outputHeight, quality)
      onApply(blob)
    } finally {
      setProcessing(false)
    }
  }

  const clampZoom = (z: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20">
          <h3 className="font-headline text-headline-md text-on-surface">{title}</h3>
          <p className="text-[11px] text-outline mt-0.5">Drag to reposition · scroll or use the slider to zoom</p>
        </div>

        {/* Crop stage */}
        <div className="relative w-full h-[340px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            restrictPosition
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom control */}
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            aria-label="Zoom"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary cursor-pointer"
          />
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-t border-outline-variant/20 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={processing || !croppedArea}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
            {processing ? 'Applying…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}
