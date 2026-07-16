'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Type, ImageIcon, Video, Loader2, ChevronRight, ExternalLink } from 'lucide-react'
import { PrivacyPicker } from './PrivacyPicker'
import { MusicPicker } from './MusicPicker'
import { StickerLayer, type Sticker } from './StickerLayer'
import { StoryRefCard } from './StoryRefCard'
import { useAuth } from '@/hooks/use-auth'
import { storiesApi, type MusicTrackMeta, type StoryItem } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/image'

type ComposeMode = 'text' | 'photo' | 'video' | 'share_ref'

const GRADIENTS = [
  'linear-gradient(135deg, #066879, #E88924)',
  'linear-gradient(135deg, #1a1a2e, #16213e)',
  'linear-gradient(135deg, #0f3443, #34e89e)',
  'linear-gradient(135deg, #232526, #414345)',
  'linear-gradient(135deg, #4a00e0, #8e2de2)',
  'linear-gradient(135deg, #e44d26, #f09819)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #43c6ac, #191654)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
]

// Map refType → story type for the API call
const REF_TYPE_TO_STORY_TYPE: Record<string, string> = {
  feed_post: 'shared_post',
  profile: 'shared_professional_profile',
  community_post: 'shared_community_post',
  product: 'shared_marketplace_product',
}

interface StoryComposerProps {
  onClose: () => void
  onPublished?: (story: StoryItem) => void
  /** When set, composer opens in share-ref mode instead of text/photo/video */
  refType?: string
  refId?: string
}

export function StoryComposer({ onClose, onPublished, refType, refId }: StoryComposerProps): React.JSX.Element {
  const { profile } = useAuth()
  const [mode, setMode] = useState<ComposeMode>(refType && refId ? 'share_ref' : 'text')
  const [caption, setCaption] = useState('')
  const [gradient, setGradient] = useState(GRADIENTS[0]!)
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'close_friends' | 'professional'>('followers')
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [selectedTrack, setSelectedTrack] = useState<MusicTrackMeta | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Clean previous video
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    setVideoFile(null)
    setVideoPreview(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setMode('photo')
  }, [videoPreview])

  const handleVideoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Clean previous photo
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setMode('video')
  }, [photoPreview])

  const addSticker = useCallback((sticker: Sticker) => {
    setStickers((prev) => [...prev, sticker])
  }, [])

  const removeSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const updateSticker = useCallback((id: string, data: Partial<Sticker>) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  }, [])

  async function getVideoDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration * 1000))
        video.remove()
      }
      video.onerror = () => { resolve(15000); video.remove() } // Default 15s fallback
      video.src = url
    })
  }

  async function publish(): Promise<void> {
    if (posting) return
    if (!profile) return
    const trimmed = caption.trim()
    if (!trimmed && mode === 'text' && !photoPreview && !selectedTrack) return

    setPosting(true)
    setError('')

    try {
      let media: { path: string; width?: number; height?: number; blurhash?: string; durationMs?: number }[] | undefined

      if ((photoPreview && photoFile) || (videoPreview && videoFile)) {
        const isVideo = mode === 'video' && !!videoFile
        const rawFile = isVideo ? videoFile! : photoFile!
        const supabase = createClient()
        const stamp = Date.now()

        // Photos are compressed to a WebP (max edge 1280, q0.70) before upload —
        // a story photo drops from several MB to well under 200 KB. Videos are
        // uploaded as-is (client-side transcoding isn't feasible in the browser).
        let uploadBody: Blob = rawFile
        let contentType = rawFile.type
        let ext = (rawFile.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')).toLowerCase()
        if (!isVideo) {
          const compressed = await compressImage(rawFile, 1280, 0.7)
          uploadBody = compressed.blob
          contentType = compressed.mimeType
          ext = compressed.mimeType === 'image/webp' ? 'webp' : ext
        }

        // Own-path in the existing post-media bucket (satisfies owner-path RLS)
        const path = `${profile.id}/stories/${stamp}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(path, uploadBody, { contentType, cacheControl: '31536000', upsert: true })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        // The story record stores this URL directly as the media source.
        const publicUrl = supabase.storage.from('post-media').getPublicUrl(path).data.publicUrl

        // Get video duration for the progress bar
        let durationMs: number | undefined
        if (isVideo) {
          durationMs = await getVideoDuration(videoPreview ?? '')
        }

        media = [{
          path: publicUrl,
          width: isVideo ? 720 : 1080,
          height: isVideo ? 1280 : 1920,
          ...(durationMs ? { durationMs } : {}),
        }]
      }

      let storyType = 'text'
      if (mode === 'share_ref' && refType && refId) {
        storyType = REF_TYPE_TO_STORY_TYPE[refType] ?? 'shared_post'
      } else if (mode === 'video') {
        storyType = 'video'
      } else if (photoPreview) {
        storyType = 'photo'
      }

      const result = await storiesApi.create({
        type: storyType as 'photo' | 'video' | 'text' | 'shared_post' | 'shared_professional_profile' | 'shared_community_post',
        privacy,
        ...(trimmed ? { caption: trimmed } : {}),
        ...(mode === 'text' ? {
          background: { gradient },
        } : {}),
        ...(media ? { media } : {}),
        ...(refType && refId ? { refType, refId } : {}),
        ...(stickers.length > 0 ? {
          stickers: stickers.map((s) => ({
            kind: s.kind,
            payload: s.payload,
            transform: { x: s.x, y: s.y },
          })),
        } : {}),
        ...(selectedTrack ? {
          music: { trackId: selectedTrack.id, volume: 100 },
        } : {}),
        allowReplies: true,
        allowReactions: true,
      })

      if (photoPreview) URL.revokeObjectURL(photoPreview)
      if (videoPreview) URL.revokeObjectURL(videoPreview)
      onPublished?.(result.story)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to publish story')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" onClick={onClose}>
      <div
        className="relative w-full max-w-[420px] h-full max-h-[780px] mx-4 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background */}
        {mode === 'share_ref' && refType && refId ? (
          <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xs mb-4">
              <StoryRefCard refType={refType} refId={refId} interactive={false} />
            </div>
            {caption && (
              <p className="text-white text-lg font-semibold text-center leading-relaxed max-w-xs break-words drop-shadow-lg">
                {caption}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-white/40 text-[11px]">
              <ExternalLink className="w-3 h-3" />
              <span>Tappable — opens original content</span>
            </div>
          </div>
        ) : mode === 'text' ? (
          <div
            className="absolute inset-0"
            style={{ background: gradient }}
          />
        ) : videoPreview && mode === 'video' ? (
          <video
            src={videoPreview}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : photoPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        {/* Sticker layer */}
        <StickerLayer
          stickers={stickers}
          onAddSticker={addSticker}
          onRemoveSticker={removeSticker}
          onUpdateSticker={updateSticker}
          background={gradient}
        />

        {/* Caption text display for text mode */}
        {mode === 'text' && caption && (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-[5] pointer-events-none">
            <p className="text-white text-xl font-semibold text-center leading-relaxed max-w-xs break-words drop-shadow-lg">
              {caption}
            </p>
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <button onClick={onClose} className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <PrivacyPicker value={privacy} onChange={setPrivacy} />
            <MusicPicker
              selectedTrack={selectedTrack}
              onSelect={setSelectedTrack}
              onRemove={() => setSelectedTrack(null)}
            />
          </div>
        </div>

        {/* Hidden file inputs (always mounted so the mode switcher can trigger them) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
          className="hidden"
          onChange={handleVideoSelect}
        />

        {/* Bottom controls — vertical stack so nothing gets clipped */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-3 bg-gradient-to-t from-black/60 to-transparent">
          {error && (
            <p className="text-red-400 text-[12px] text-center bg-black/50 rounded-lg px-3 py-1.5">{error}</p>
          )}

          {/* Caption input (text or share mode) */}
          {(mode === 'text' || mode === 'share_ref') && (
            <div className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-2.5">
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Type a caption…"
                maxLength={300}
                className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/40 outline-none"
              />
            </div>
          )}

          {/* Gradient picker (text mode) — wraps, never overflows */}
          {mode === 'text' && (
            <div className="flex gap-2 justify-center flex-wrap">
              {GRADIENTS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setGradient(g)}
                  aria-label={`Background ${i + 1}`}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    gradient === g ? 'border-white scale-110' : 'border-white/30'
                  }`}
                  style={{ background: g }}
                />
              ))}
            </div>
          )}

          {/* Action row: mode switcher (left) + Share (right) — always visible */}
          <div className="flex items-center justify-between gap-3">
            {!refType && !refId ? (
              <div className="flex items-center gap-1 bg-black/40 rounded-full p-1">
                <button
                  onClick={() => setMode('text')}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${mode === 'text' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  title="Text"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${mode === 'photo' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  title="Photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${mode === 'video' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  title="Video"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span />
            )}

            {/* Publish button — always on screen, right-aligned */}
            <button
              onClick={publish}
              disabled={posting || (!caption.trim() && mode === 'text' && !photoPreview && !videoPreview)}
              className="flex items-center gap-1.5 pl-5 pr-4 py-2.5 rounded-full bg-primary text-white text-[14px] font-semibold shadow-lg hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
            >
              {posting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sharing…
                </>
              ) : (
                <>
                  Share to story
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
