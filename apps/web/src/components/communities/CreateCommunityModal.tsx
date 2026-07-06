'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, CheckCircle2, XCircle, Globe, Lock, Mail, Camera, ImagePlus, Users } from 'lucide-react'
import { communitiesApi, type CommunityCategory, type Community } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
type SlugStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken'

interface CreateCommunityModalProps {
  open: boolean
  onClose: () => void
  onCreated: (community: Community) => void
}

export function CreateCommunityModal({ open, onClose, onCreated }: CreateCommunityModalProps): React.JSX.Element | null {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [manualSlug, setManualSlug] = useState<string | null>(null)
  // Slug derives from the name until the user edits it directly (no effect)
  const slug = manualSlug ?? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite_only'>('public')
  const [categories, setCategories] = useState<CommunityCategory[]>([])
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) communitiesApi.categories().then(setCategories).catch(() => {})
  }, [open])

  // Debounced slug availability
  useEffect(() => {
    if (!open) return
    let cancelled = false
    const value = slug
    const timer = setTimeout(async () => {
      if (cancelled) return
      if (!value) { setSlugStatus('idle'); return }
      if (!SLUG_REGEX.test(value) || value.length < 3) { setSlugStatus('invalid'); return }
      setSlugStatus('checking')
      try {
        const r = await communitiesApi.slugAvailable(value)
        if (!cancelled) setSlugStatus(r.available ? 'available' : r.reason === 'taken' ? 'taken' : 'invalid')
      } catch { if (!cancelled) setSlugStatus('idle') }
    }, 400)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [slug, open])

  if (!open) return null

  async function pickImage(kind: 'avatar' | 'cover', e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB'); return }
    setError('')
    setUploading(kind)
    try {
      const url = await uploadCommunityImage(user.id, file, kind)
      if (kind === 'avatar') setAvatarUrl(url)
      else setCoverUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  async function submit(): Promise<void> {
    if (creating || !categoryId) return
    setCreating(true)
    setError('')
    try {
      const community = await communitiesApi.create({
        name: name.trim(),
        slug,
        description: description.trim() || undefined,
        categoryId,
        privacy,
        ...(avatarUrl ? { avatarUrl } : {}),
        ...(coverUrl ? { coverUrl } : {}),
      })
      onCreated(community)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create community'
      setError(msg)
    } finally {
      setCreating(false)
    }
  }

  const canSubmit = name.trim().length >= 3 && slugStatus === 'available' && !!categoryId

  const PRIVACY_OPTS = [
    { value: 'public' as const, label: 'Public', desc: 'Anyone can view and join', Icon: Globe },
    { value: 'private' as const, label: 'Private', desc: 'Anyone can request; approval to join', Icon: Lock },
    { value: 'invite_only' as const, label: 'Invite only', desc: 'People join only via invite', Icon: Mail },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Create a community</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Cover + avatar */}
          <div>
            <button
              onClick={() => coverRef.current?.click()}
              className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center group cursor-pointer"
            >
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading === 'cover' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <ImagePlus className="w-5 h-5 text-white" />}
              </div>
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage('cover', e)} />
            <div className="flex items-center gap-3 -mt-6 ml-3">
              <button
                onClick={() => avatarRef.current?.click()}
                className="relative w-14 h-14 rounded-xl overflow-hidden bg-primary/10 border-2 border-surface-container-lowest flex items-center justify-center group cursor-pointer"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-5 h-5 text-primary" />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploading === 'avatar' ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                </div>
              </button>
              <span className="text-[11px] text-outline mt-5">Add icon &amp; cover (optional)</span>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage('avatar', e)} />
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Golden Retriever Owners"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Community URL</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-label-sm text-outline">/c/</span>
              <input
                value={slug}
                onChange={(e) => setManualSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                maxLength={40}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {slugStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-outline" />}
                {slugStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                {(slugStatus === 'taken' || slugStatus === 'invalid') && <XCircle className="w-4 h-4 text-red-500" />}
              </span>
            </div>
            {slugStatus === 'taken' && <p className="text-[11px] text-red-500 mt-1">That URL is taken.</p>}
            {slugStatus === 'invalid' && <p className="text-[11px] text-red-500 mt-1">3–40 chars: lowercase letters, numbers, hyphens.</p>}
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${
                    categoryId === c.id ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="What is this community about?"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-2">Privacy</label>
            <div className="space-y-2">
              {PRIVACY_OPTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrivacy(opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    privacy === opt.value ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'
                  }`}
                >
                  <opt.Icon className={`w-5 h-5 flex-shrink-0 ${privacy === opt.value ? 'text-primary' : 'text-outline'}`} />
                  <div>
                    <p className="font-semibold text-label-sm text-on-surface">{opt.label}</p>
                    <p className="text-[11px] text-outline">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit || creating}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
            {creating ? 'Creating…' : 'Create community'}
          </button>
        </div>
      </div>
    </div>
  )
}
