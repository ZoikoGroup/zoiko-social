'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, Check, Loader2, PawPrint, Trash2, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { profileApi, type Pet, type Profile } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { ImageCropper } from '@/components/ImageCropper'
import { AddPetModal } from '@/components/AddPetModal'
import type { User } from '@supabase/supabase-js'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved'

const USERNAME_HINT = '3–30 characters: lowercase letters, numbers, underscores and periods.'

interface Seed {
  firstName: string
  lastName: string
  bio: string
  avatarUrl: string | null
  alreadyCompleted: boolean
}

/**
 * Prefill values, derived from whatever the provider gave us.
 *
 * The profile row is the better source: the signup trigger already split the
 * combined name into columns. Session metadata is the fallback for accounts
 * that predate that trigger.
 */
function buildSeed(profile: Profile, user: User | null): Seed {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>
  const metaName = (typeof meta.full_name === 'string' ? meta.full_name : typeof meta.name === 'string' ? meta.name : '').trim()
  const cut = metaName.lastIndexOf(' ')

  return {
    firstName: profile.firstName ?? (cut > 0 ? metaName.slice(0, cut) : metaName),
    lastName: profile.lastName ?? (cut > 0 ? metaName.slice(cut + 1) : ''),
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? (typeof meta.avatar_url === 'string' ? meta.avatar_url : null),
    alreadyCompleted: profile.onboardingCompleted === true,
  }
}

/**
 * Where an OAuth arrival names themselves.
 *
 * Providers hand us one combined name — Supabase joins Facebook's first/last
 * before we ever see them and drops Google's given_name/family_name entirely —
 * so the signup trigger splits it on the last space and we prefill from that.
 * The split is a guess, which is the whole reason these are editable fields
 * rather than a silent import.
 *
 * The form waits for the profile and then mounts once, seeding its state from
 * props the way AddPetModal does. Nothing syncs props into state afterwards.
 */
export default function OnboardingPage(): React.JSX.Element {
  const { user, profile, loading, refreshProfile } = useAuth()

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {loading ? (
          <Loader2 className="size-8 animate-spin text-primary" />
        ) : (
          <p className="text-body-md text-on-surface-variant">
            We couldn&apos;t load your profile. Please refresh the page.
          </p>
        )}
      </div>
    )
  }

  return <OnboardingForm seed={buildSeed(profile, user)} userId={profile.id} onSaved={refreshProfile} />
}

function OnboardingForm({
  seed,
  userId,
  onSaved,
}: {
  seed: Seed
  userId: string
  /** Re-reads the shared profile; the returned value is not needed here. */
  onSaved: () => Promise<unknown>
}): React.JSX.Element {
  const router = useRouter()

  // Frozen at mount, so finishing step 1 does not bounce us off step 2.
  const [alreadyCompleted] = useState(seed.alreadyCompleted)

  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState(seed.firstName)
  const [lastName, setLastName] = useState(seed.lastName)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState(seed.bio)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(seed.avatarUrl)

  const [checked, setChecked] = useState<{ username: string; status: UsernameStatus } | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Avatar picking: crop first, upload only on save.
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const [pets, setPets] = useState<Pet[]>([])
  const [petModalOpen, setPetModalOpen] = useState(false)

  // Someone who has already been through this has no business here.
  useEffect(() => {
    if (alreadyCompleted) router.replace('/')
  }, [alreadyCompleted, router])

  // ── Suggestions ───────────────────────────────────────────────────────────
  // Built from the name, and used to prefill the handle only while the field is
  // still untouched — never overwriting something the person typed.
  const usernameTouched = useRef(false)

  useEffect(() => {
    const first = firstName.trim()
    if (!first) return

    let cancelled = false
    const timer = setTimeout(() => {
      void profileApi
        .suggestUsernames(first, lastName.trim())
        .then((res) => {
          if (cancelled) return
          setSuggestions(res.suggestions)
          if (!usernameTouched.current && res.suggestions[0]) setUsername(res.suggestions[0])
        })
        .catch(() => {
          /* Suggestions are a convenience — a failure must not block the form. */
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [firstName, lastName])

  // ── Live availability ─────────────────────────────────────────────────────
  const candidate = username.trim().toLowerCase()

  useEffect(() => {
    if (!candidate) return

    let cancelled = false
    const timer = setTimeout(() => {
      void profileApi
        .checkUsername(candidate)
        .then((res) => {
          if (cancelled) return
          setChecked({
            username: candidate,
            status: res.available
              ? 'available'
              : res.reason === 'taken'
                ? 'taken'
                : res.reason === 'reserved'
                  ? 'reserved'
                  : 'invalid',
          })
        })
        .catch(() => {
          if (!cancelled) setChecked({ username: candidate, status: 'idle' })
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [candidate])

  // Derived rather than stored, so it can never lag behind what is in the box.
  const usernameStatus: UsernameStatus = !candidate
    ? 'idle'
    : checked?.username === candidate
      ? checked.status
      : 'checking'

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    e.target.value = '' // so re-picking the same file still fires onChange
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be under 5 MB')
      return
    }
    setError('')
    setCropSrc(URL.createObjectURL(file))
  }

  function applyCrop(blob: Blob): void {
    setAvatarFile(new File([blob], 'avatar.webp', { type: 'image/webp' }))
    setAvatarUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(blob)
    })
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  function clearPhoto(): void {
    setAvatarFile(null)
    setAvatarUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return null
    })
  }

  /** The cropper already emits a sized WebP, so it goes up as-is. */
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    const supabase = createClient()
    const path = `${userId}/avatar-${Date.now()}.webp`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
      cacheControl: '31536000',
      contentType: 'image/webp',
      upsert: true,
    })
    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }, [userId])

  const canContinue = firstName.trim().length > 0 && usernameStatus === 'available' && !saving

  async function handleContinue(): Promise<void> {
    if (!canContinue) return
    setSaving(true)
    setError('')
    try {
      // A blob: preview is local-only; anything else is already a real URL —
      // the provider's picture, or one uploaded on an earlier attempt.
      let finalAvatar = avatarUrl
      if (avatarFile) finalAvatar = await uploadAvatar(avatarFile)
      else if (avatarUrl?.startsWith('blob:')) finalAvatar = null

      await profileApi.completeOnboarding({
        firstName: firstName.trim(),
        ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
        username: candidate,
        ...(bio.trim() ? { bio: bio.trim() } : {}),
        avatarUrl: finalAvatar,
      })
      await onSaved()
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg rounded-xl border border-outline-variant/40 bg-surface p-8 shadow-sm md:p-10">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          {([1, 2] as const).map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${step >= n ? 'bg-primary' : 'bg-outline-variant/40'}`}
            />
          ))}
          <span className="text-label-md text-on-surface-variant">{step} / 2</span>
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-headline-md text-on-surface">Welcome to ZoikoSocial</h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              We pulled what we could from your account — check it over and change anything.
            </p>

            {/* Avatar */}
            <div className="mt-7 flex items-center gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-primary-container">
                {avatarUrl ? (
                  // Provider and Storage hosts are not in the next/image config,
                  // and a blob: preview cannot be optimised at all.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Your profile photo" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-headline-md text-primary">
                    {(firstName.trim()[0] ?? '?').toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/60 px-3 py-2 text-label-md text-on-surface transition-colors hover:bg-on-surface/5"
                >
                  <Camera className="size-4" />
                  {avatarUrl ? 'Change photo' : 'Add photo'}
                </button>
                {avatarUrl ? (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/60 px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-on-surface/5"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                ) : null}
              </div>
              <input ref={fileInput} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
            </div>

            {/* Names */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="firstName">
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={40}
                  autoComplete="given-name"
                  className={inputClass}
                />
              </Field>
              <Field label="Last name" htmlFor="lastName" optional>
                <input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={40}
                  autoComplete="family-name"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Username */}
            <div className="mt-5">
              <Field label="Username" htmlFor="username">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant">
                    @
                  </span>
                  <input
                    id="username"
                    value={username}
                    onChange={(e) => {
                      usernameTouched.current = true
                      setUsername(e.target.value.toLowerCase())
                    }}
                    maxLength={30}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${inputClass} pl-7 pr-9`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' ? (
                      <Loader2 className="size-4 animate-spin text-on-surface-variant" />
                    ) : usernameStatus === 'available' ? (
                      <Check className="size-4 text-primary" />
                    ) : usernameStatus === 'idle' ? null : (
                      <X className="size-4 text-error" />
                    )}
                  </span>
                </div>
              </Field>
              <p
                className={`mt-1.5 text-label-md ${
                  usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'reserved'
                    ? 'text-error'
                    : 'text-on-surface-variant'
                }`}
              >
                {usernameStatus === 'taken'
                  ? 'That username is already taken.'
                  : usernameStatus === 'reserved'
                    ? 'That username is reserved.'
                    : usernameStatus === 'invalid'
                      ? USERNAME_HINT
                      : usernameStatus === 'available'
                        ? 'Available.'
                        : USERNAME_HINT}
              </p>

              {suggestions.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-label-md text-on-surface-variant">Suggestions:</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        usernameTouched.current = true
                        setUsername(s)
                      }}
                      className="rounded-full border border-outline-variant/60 px-3 py-1 text-label-md text-on-surface transition-colors hover:bg-primary/10"
                    >
                      @{s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Bio */}
            <div className="mt-5">
              <Field label="Bio" htmlFor="bio" optional>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Tell the community a little about you and your animals."
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <p className="mt-1.5 text-right text-label-md text-on-surface-variant">{bio.length}/500</p>
            </div>

            {error ? (
              <p className="mt-5 rounded-lg bg-error-container px-3 py-2 text-body-md text-error">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={() => void handleContinue()}
              disabled={!canContinue}
              className="mt-7 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-label-md font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? <Loader2 className="size-5 animate-spin" /> : 'Continue'}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-headline-md text-on-surface">Add your first pet</h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Optional — you can add pets any time from your profile.
            </p>

            {pets.length > 0 ? (
              <ul className="mt-6 space-y-2">
                {pets.map((pet) => (
                  <li key={pet.id} className="flex items-center gap-3 rounded-lg border border-outline-variant/40 p-3">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary-container">
                      {pet.avatarUrl ? (
                        <Image src={pet.avatarUrl} alt="" width={40} height={40} className="size-full object-cover" />
                      ) : (
                        <PawPrint className="size-5 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-body-md text-on-surface">{pet.name}</p>
                      <p className="truncate text-label-md text-on-surface-variant">
                        {[pet.species, pet.breed].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <Check className="ml-auto size-5 text-primary" />
                  </li>
                ))}
              </ul>
            ) : null}

            <button
              type="button"
              onClick={() => setPetModalOpen(true)}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant text-label-md text-on-surface transition-colors hover:bg-on-surface/5"
            >
              <PawPrint className="size-4" />
              {pets.length > 0 ? 'Add another pet' : 'Add a pet'}
            </button>

            <button
              type="button"
              onClick={() => router.replace('/')}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-label-md font-semibold text-on-primary transition-colors hover:bg-primary/90"
            >
              {pets.length > 0 ? 'Done' : 'Skip for now'}
            </button>
          </>
        )}
      </div>

      {cropSrc ? (
        <ImageCropper
          imageSrc={cropSrc}
          aspect={1}
          cropShape="round"
          outputWidth={400}
          outputHeight={400}
          quality={0.8}
          title="Crop your photo"
          onCancel={() => {
            URL.revokeObjectURL(cropSrc)
            setCropSrc(null)
          }}
          onApply={applyCrop}
        />
      ) : null}

      <AddPetModal
        open={petModalOpen}
        onClose={() => setPetModalOpen(false)}
        onAdded={(pet) => {
          setPets((prev) => [...prev, pet])
          setPetModalOpen(false)
        }}
      />
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-outline-variant/60 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/70 focus:border-primary'

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-label-md font-semibold text-on-surface">
        {label}
        {optional ? <span className="ml-1 font-normal text-on-surface-variant">(optional)</span> : null}
      </label>
      {children}
    </div>
  )
}
