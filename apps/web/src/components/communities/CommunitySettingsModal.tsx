'use client'

import { useRef, useState } from 'react'
import { X, Loader2, Camera, Globe, Lock, Mail, Users, Trash2, ImagePlus } from 'lucide-react'
import { communitiesApi, type Community } from '@/lib/api'
import { uploadCommunityImage } from '@/lib/community-image'
import { useAuth } from '@/hooks/use-auth'

interface CommunitySettingsModalProps {
  open: boolean
  community: Community
  onClose: () => void
  onSaved: (community: Community) => void
  onDeleted: () => void
}

export function CommunitySettingsModal({ open, community, onClose, onSaved, onDeleted }: CommunitySettingsModalProps): React.JSX.Element | null {
  if (!open) return null
  return <SettingsForm community={community} onClose={onClose} onSaved={onSaved} onDeleted={onDeleted} />
}

function SettingsForm({ community, onClose, onSaved, onDeleted }: Omit<CommunitySettingsModalProps, 'open'>): React.JSX.Element {
  const { user } = useAuth()
  const [name, setName] = useState(community.name)
  const [description, setDescription] = useState(community.description ?? '')
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite_only'>(community.privacy as 'public' | 'private' | 'invite_only')
  const [avatarUrl, setAvatarUrl] = useState(community.avatarUrl)
  const [coverUrl, setCoverUrl] = useState(community.coverUrl)
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const isOwner = community.viewerRole === 'owner'

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

  async function save(): Promise<void> {
    setSaving(true)
    setError('')
    try {
      const updated = await communitiesApi.update(community.id, {
        name: name.trim(),
        description: description.trim() || null,
        privacy,
        avatarUrl,
        coverUrl,
      })
      onSaved(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(): Promise<void> {
    setSaving(true)
    try {
      await communitiesApi.remove(community.id)
      onDeleted()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
      setSaving(false)
    }
  }

  const PRIVACY = [
    { value: 'public' as const, label: 'Public', desc: 'Anyone can view and join', Icon: Globe },
    { value: 'private' as const, label: 'Private', desc: 'Requests need approval', Icon: Lock },
    { value: 'invite_only' as const, label: 'Invite only', desc: 'Join via invite only', Icon: Mail },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Community settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Cover */}
          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Cover image</label>
            <button
              onClick={() => coverRef.current?.click()}
              className="relative w-full h-28 rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center group cursor-pointer"
            >
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading === 'cover' ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <ImagePlus className="w-6 h-6 text-white" />}
              </div>
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage('cover', e)} />
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => avatarRef.current?.click()}
              className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 group cursor-pointer"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-primary" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading === 'avatar' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              </div>
            </button>
            <div className="text-label-sm text-outline">Community icon<br />JPG, PNG or WebP · max 10 MB</div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage('avatar', e)} />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-2">Privacy</label>
            <div className="space-y-2">
              {PRIVACY.map((opt) => (
                <button
                  key={opt.value} onClick={() => setPrivacy(opt.value)}
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

          {/* Danger zone — owner only */}
          {isOwner && (
            <div className="pt-2 border-t border-outline-variant/20">
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 text-label-sm font-semibold text-red-500 hover:text-red-600 cursor-pointer">
                  <Trash2 className="w-4 h-4" />Delete community
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-label-sm text-red-600 font-semibold mb-2">Delete this community permanently?</p>
                  <div className="flex gap-2">
                    <button onClick={remove} disabled={saving} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-label-sm font-semibold hover:bg-red-600 disabled:opacity-50 cursor-pointer">
                      Yes, delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !name.trim() || uploading !== null}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
