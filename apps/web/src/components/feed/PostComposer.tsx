'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ImageIcon, X, Loader2, Globe, Users, MapPin,
  Stethoscope, MoreHorizontal, Pencil, PawPrint, Bird,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { useAuth } from '@/hooks/use-auth'
import { postsApi, type PostItem, type NewPostMedia, type PostKind, type PostMetadata } from '@/lib/api'
import { processImage } from '@/lib/image'
import { createClient } from '@/lib/supabase/client'

interface PendingImage {
  preview: string
  processed: Promise<{ blob: Blob; thumbnailBlob: Blob; width: number; height: number; blurhash: string }>
}

interface PostComposerProps {
  onPosted?: (post: PostItem) => void
  /** When set, the post is created inside this community (members only). */
  communityId?: string
  /** Show the home-only "Live Animal Updates" quick-action launcher. */
  showLauncher?: boolean
}

export function PostComposer({ onPosted, communityId, showLauncher = false }: PostComposerProps): React.JSX.Element {
  const { profile } = useAuth()
  const [caption, setCaption] = useState('')
  const [images, setImages] = useState<PendingImage[]>([])
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public')
  const [expanded, setExpanded] = useState(false)
  const [kind, setKind] = useState<PostKind>('standard')
  // Structured metadata fields (used per kind)
  const [species, setSpecies] = useState('')
  const [condition, setCondition] = useState('')
  const [supportNeeded, setSupportNeeded] = useState('')
  const [petName, setPetName] = useState('')
  const [lastSeen, setLastSeen] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setError('')
    setExpanded(true)

    const room = 10 - images.length
    const selected = files.slice(0, room)
    setImages((prev) => [
      ...prev,
      ...selected.map((file) => ({
        preview: URL.createObjectURL(file),
        processed: processImage(file),
      })),
    ])
  }

  function removeImage(index: number): void {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index]!.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  // A structured kind (rescue/lost&found/wildlife) is postable on its metadata alone.
  const hasStructured =
    (kind === 'rescue_case' && !!(species.trim() || condition.trim() || supportNeeded.trim())) ||
    (kind === 'lost_found' && !!(petName.trim() || lastSeen.trim())) ||
    (kind === 'wildlife' && species.trim().length > 0)
  const canPost = caption.trim().length > 0 || images.length > 0 || hasStructured

  async function submit(): Promise<void> {
    if (posting) return
    const trimmed = caption.trim()
    if (!canPost) return
    if (!profile) return

    setPosting(true)
    setError('')
    try {
      // Upload processed images directly to storage (own folder — RLS enforced)
      const supabase = createClient()
      const media: NewPostMedia[] = []
      for (let i = 0; i < images.length; i++) {
        const processed = await images[i]!.processed
        const stamp = Date.now()
        const path = `${profile.id}/${stamp}-${i}.webp`
        const thumbPath = `${profile.id}/${stamp}-${i}-thumb.webp`

        // Full image + 320px thumbnail uploaded in parallel
        const [fullResult, thumbResult] = await Promise.all([
          supabase.storage.from('post-media').upload(path, processed.blob, {
            contentType: 'image/webp',
            cacheControl: '31536000',
          }),
          supabase.storage.from('post-media').upload(thumbPath, processed.thumbnailBlob, {
            contentType: 'image/webp',
            cacheControl: '31536000',
          }),
        ])
        if (fullResult.error) throw new Error(`Image upload failed: ${fullResult.error.message}`)

        const { data } = supabase.storage.from('post-media').getPublicUrl(path)
        const thumbUrl = thumbResult.error
          ? undefined
          : supabase.storage.from('post-media').getPublicUrl(thumbPath).data.publicUrl

        media.push({
          url: data.publicUrl,
          ...(thumbUrl ? { thumbnailUrl: thumbUrl } : {}),
          width: processed.width,
          height: processed.height,
          fileSize: processed.blob.size,
          blurhash: processed.blurhash,
          position: i,
        })
      }

      // Build structured metadata for non-standard kinds
      const metadata: PostMetadata = {}
      if (kind === 'rescue_case') {
        if (species.trim()) metadata.species = species.trim()
        if (condition.trim()) metadata.condition = condition.trim()
        const support = supportNeeded.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
        if (support.length) metadata.supportNeeded = support
      } else if (kind === 'lost_found') {
        if (petName.trim()) metadata.petName = petName.trim()
        if (lastSeen.trim()) metadata.lastSeen = lastSeen.trim()
      } else if (kind === 'wildlife') {
        if (species.trim()) metadata.species = species.trim()
      }
      const hasMeta = Object.keys(metadata).length > 0

      const post = await postsApi.create({
        ...(trimmed ? { caption: trimmed } : {}),
        visibility,
        ...(media.length ? { media } : {}),
        ...(kind !== 'standard' ? { kind } : {}),
        ...(hasMeta ? { metadata } : {}),
        ...(communityId ? { communityId } : {}),
      })

      images.forEach((img) => URL.revokeObjectURL(img.preview))
      setCaption('')
      setImages([])
      setExpanded(false)
      setKind('standard')
      setSpecies(''); setCondition(''); setSupportNeeded(''); setPetName(''); setLastSeen('')
      onPosted?.(post)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to publish post')
    } finally {
      setPosting(false)
    }
  }

  const actions: { name: string; Icon: LucideIcon; ring: string; onClick?: () => void; href?: string }[] = [
    { name: 'Post',        Icon: Pencil,      ring: 'bg-primary',    onClick: () => setExpanded(true) },
    { name: 'Rescue',      Icon: PawPrint,    ring: 'bg-red-500',    onClick: () => { setKind('rescue_case'); setExpanded(true) } },
    { name: 'Vet Tip',     Icon: Stethoscope, ring: 'bg-primary',    onClick: () => { setKind('vet_tip'); setExpanded(true) } },
    { name: 'Lost Nearby', Icon: MapPin,      ring: 'bg-secondary',  href: '/lost-found' },
    { name: 'Wildlife',    Icon: Bird,        ring: 'bg-emerald-500', onClick: () => { setKind('wildlife'); setExpanded(true) } },
  ]

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
      {/* Live Animal Updates — home-only quick-action launcher */}
      {showLauncher && (
        <>
          <h2 className="font-headline text-headline-md font-bold text-on-surface">Live Animal Updates</h2>
          <div className="flex items-start justify-around gap-1 pb-1">
            {actions.map((a) => {
              const inner = (
                <>
                  <span className={`flex items-center justify-center w-12 h-12 rounded-full ${a.ring} text-white shadow-sm`}>
                    <a.Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-medium text-on-surface-variant">{a.name}</span>
                </>
              )
              const cls = 'flex flex-col items-center gap-1.5 cursor-pointer group'
              return a.href ? (
                <Link key={a.name} href={a.href} className={cls}>{inner}</Link>
              ) : (
                <button key={a.name} type="button" onClick={a.onClick} className={cls}>{inner}</button>
              )
            })}
          </div>
        </>
      )}

      <div className="flex gap-3 items-center">
        {profile ? (
          <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
        )}
        <div className="relative flex-1">
          <textarea
            {...(showLauncher ? { id: 'home-composer-textarea' } : {})}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onFocus={() => setExpanded(true)}
            maxLength={2200}
            rows={expanded ? 3 : 1}
            placeholder={communityId ? 'Share something with this community…' : 'Share an update…'}
            className="w-full pl-4 pr-11 py-2.5 bg-surface-container-low rounded-2xl text-label-md border border-outline-variant/20 focus:border-primary focus:outline-none transition-all resize-none"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 10}
            className="absolute right-3 top-2.5 p-1 text-outline hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Add photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap pl-13">
          {images.map((img, i) => (
            <div key={img.preview} className="relative w-20 h-20 rounded-lg overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-label-sm text-red-500">{error}</p>}

      {/* Structured fields for the selected post kind */}
      {kind !== 'standard' && (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
              {kind === 'rescue_case' ? 'Rescue Case' : kind === 'vet_tip' ? 'Vet Tip' : kind === 'lost_found' ? 'Lost & Found' : 'Wildlife Sighting'}
            </span>
            <button onClick={() => setKind('standard')} className="text-[11px] text-outline hover:text-on-surface cursor-pointer">Clear</button>
          </div>
          {kind === 'rescue_case' && (
            <>
              <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Species (e.g. Cat · Domestic Shorthair)" maxLength={120} className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
              <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Condition (e.g. Recovering from malnutrition)" maxLength={300} className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
              <input value={supportNeeded} onChange={(e) => setSupportNeeded(e.target.value)} placeholder="Support needed (comma-separated: Foster home, Vet checkups)" maxLength={200} className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </>
          )}
          {kind === 'lost_found' && (
            <>
              <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Pet name & breed (e.g. Friendly Golden Retriever)" maxLength={120} className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
              <input value={lastSeen} onChange={(e) => setLastSeen(e.target.value)} placeholder="Last seen (e.g. 16th Ave & Judah St, SF)" maxLength={200} className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </>
          )}
          {kind === 'vet_tip' && (
            <p className="text-[11px] text-outline">An educational disclaimer is added automatically to vet tips.</p>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {/* Quick-action chips */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-outline-variant/10">
        <button onClick={() => { setKind('rescue_case'); setExpanded(true) }} className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${kind === 'rescue_case' ? 'text-secondary border-secondary/40 bg-secondary/10' : 'text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary'}`}>
          <PawPrint className="w-4 h-4 text-secondary" />Rescue Case
        </button>
        <button onClick={() => { setKind('lost_found'); setExpanded(true) }} className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${kind === 'lost_found' ? 'text-secondary border-secondary/40 bg-secondary/10' : 'text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary'}`}>
          <MapPin className="w-4 h-4 text-primary" />Lost &amp; Found
        </button>
        <button onClick={() => { setKind('vet_tip'); setExpanded(true) }} className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${kind === 'vet_tip' ? 'text-primary border-primary/40 bg-primary/10' : 'text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary'}`}>
          <Stethoscope className="w-4 h-4 text-primary" />Vet Tip
        </button>
        <button onClick={() => setExpanded(true)} className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer ml-auto">
          <MoreHorizontal className="w-4 h-4" />More
        </button>
      </div>

      {(expanded || caption.trim() || images.length > 0) && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setVisibility((v) => (v === 'public' ? 'followers' : 'public'))}
            className="flex items-center gap-1.5 text-label-sm text-on-surface-variant hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title={visibility === 'public' ? 'Visible to everyone' : 'Followers only'}
          >
            {visibility === 'public' ? <Globe className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            <span className="capitalize">{visibility}</span>
          </button>
          <button
            onClick={submit}
            disabled={posting || !canPost}
            className="px-5 py-2 rounded-full bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-2"
          >
            {posting && <Loader2 className="w-4 h-4 animate-spin" />}
            {posting ? 'Publishing…' : 'Post'}
          </button>
        </div>
      )}
    </div>
  )
}
