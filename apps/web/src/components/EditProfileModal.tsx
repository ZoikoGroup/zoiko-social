'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Lock, Camera, AtSign, CheckCircle2, XCircle } from 'lucide-react'
import { profileApi, ApiError, type Profile } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

interface EditProfileModalProps {
  open: boolean
  profile: Profile
  onClose: () => void
  onSaved: (profile: Profile) => void
}

const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/
const USERNAME_COOLDOWN_DAYS = 30

type UsernameStatus = 'unchanged' | 'invalid' | 'checking' | 'available' | 'taken'

export function EditProfileModal({ open, profile, onClose, onSaved }: EditProfileModalProps): React.JSX.Element | null {
  if (!open) return null
  // Remount the form each time the modal opens so state initializes from the latest profile
  return <EditProfileForm profile={profile} onClose={onClose} onSaved={onSaved} />
}

function EditProfileForm({ profile, onClose, onSaved }: Omit<EditProfileModalProps, 'open'>): React.JSX.Element {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl ?? '')
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('unchanged')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Username cooldown: changeable once every 30 days
  const nextUsernameChange = profile.usernameChangedAt
    ? new Date(new Date(profile.usernameChangedAt).getTime() + USERNAME_COOLDOWN_DAYS * 86_400_000)
    : null
  const usernameLocked = !!nextUsernameChange && nextUsernameChange > new Date()

  // Debounced availability check when the username differs from the current one
  useEffect(() => {
    let cancelled = false
    const value = username.trim().toLowerCase()

    const timer = setTimeout(async () => {
      if (cancelled) return
      if (value === profile.username) {
        setUsernameStatus('unchanged')
        return
      }
      if (!USERNAME_REGEX.test(value) || value.startsWith('.') || value.endsWith('.') || value.includes('..')) {
        setUsernameStatus('invalid')
        return
      }
      setUsernameStatus('checking')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profiles/username-available?username=${encodeURIComponent(value)}`,
        )
        const json = await res.json()
        const result = json?.data?.data ?? json?.data
        if (!cancelled) setUsernameStatus(result?.available ? 'available' : 'taken')
      } catch {
        if (!cancelled) setUsernameStatus('unchanged')
      }
    }, 400)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [username, profile.username])

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be under 5 MB')
      return
    }
    setError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!avatarFile) return null
    const supabase = createClient()
    const ext = avatarFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, {
      cacheControl: '3600',
      upsert: true,
    })
    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    setError('')
    try {
      const avatarUrl = await uploadAvatar()

      const changedUsername = username.trim().toLowerCase()
      const updated = await profileApi.update({
        displayName: displayName.trim() || profile.displayName,
        bio: bio.trim(),
        websiteUrl: websiteUrl.trim() || null,
        isPrivate,
        ...(avatarUrl ? { avatarUrl } : {}),
        ...(changedUsername !== profile.username && !usernameLocked ? { username: changedUsername } : {}),
      })
      onSaved(updated)
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const usernameBlocked = usernameStatus === 'invalid' || usernameStatus === 'taken' || usernameStatus === 'checking'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">Edit profile</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Profile photo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Change photo
              </button>
              <p className="text-[10px] text-outline mt-0.5 px-3">JPG, PNG or WebP · max 5 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Username</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                disabled={usernameLocked}
                maxLength={30}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-outline" />}
                {usernameStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <XCircle className="w-4 h-4 text-red-500" />}
              </span>
            </div>
            {usernameLocked ? (
              <p className="text-[11px] text-outline mt-1">
                Username can be changed once every 30 days — next change available{' '}
                {nextUsernameChange?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              </p>
            ) : usernameStatus === 'taken' ? (
              <p className="text-[11px] text-red-500 mt-1">This username is already taken.</p>
            ) : usernameStatus === 'invalid' ? (
              <p className="text-[11px] text-red-500 mt-1">3–30 characters — lowercase letters, numbers, underscores and periods only.</p>
            ) : usernameStatus === 'available' ? (
              <p className="text-[11px] text-green-600 mt-1">Username is available. You can change it once every 30 days.</p>
            ) : (
              <p className="text-[11px] text-outline mt-1">You can change your username once every 30 days.</p>
            )}
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tell the community about yourself and your animals…"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors resize-none"
            />
            <p className="text-[10px] text-outline mt-1 text-right">{bio.length}/500</p>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Website</label>
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://…"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 text-label-md text-on-surface">
              <Lock className="w-4 h-4 text-outline" />
              Private account
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isPrivate}
              onClick={() => setIsPrivate((v) => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${isPrivate ? 'bg-primary' : 'bg-outline-variant'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
          <p className="text-[11px] text-outline -mt-2">
            When private, new followers must send a request you approve. Switching back to public accepts all pending requests.
          </p>

          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
          )}
        </div>

        <div className="p-5 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !displayName.trim() || (username !== profile.username && usernameBlocked)}
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
