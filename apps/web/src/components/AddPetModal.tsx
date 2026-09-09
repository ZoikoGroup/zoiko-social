'use client'

import { useState } from 'react'
import { X, Loader2, Globe, Lock } from 'lucide-react'
import { petsApi, type Pet } from '@/lib/api'
import { DocsHelpLink } from '@/components/DocsHelpLink'

interface AddPetModalProps {
  open: boolean
  onClose: () => void
  onAdded: (pet: Pet) => void
  /** Pass a pet to edit it in place; omit to add a new one. */
  pet?: Pet | null | undefined
}

const SPECIES = ['Dog', 'Cat', 'Bird', 'Parrot', 'Rabbit', 'Fish', 'Reptile', 'Horse', 'Other']
const SEXES: { value: 'male' | 'female' | 'unknown'; label: string }[] = [
  { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'unknown', label: 'Unknown' },
]
// Tri-state so "not specified" stays distinct from a known "no".
const NEUTERED: { value: 'yes' | 'no' | 'unknown'; label: string }[] = [
  { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unknown', label: 'Not specified' },
]

const TODAY = (): string => new Date().toISOString().slice(0, 10)

/**
 * Add or edit a pet. Mounted only while open (and keyed by pet id) so each open
 * starts from the target pet's current values — no effect syncing props to state.
 */
export function AddPetModal({ open, onClose, onAdded, pet }: AddPetModalProps): React.JSX.Element | null {
  if (!open) return null
  return <PetForm key={pet?.id ?? 'new'} onClose={onClose} onAdded={onAdded} pet={pet ?? null} />
}

function PetForm({
  onClose,
  onAdded,
  pet,
}: {
  onClose: () => void
  onAdded: (pet: Pet) => void
  pet: Pet | null
}): React.JSX.Element {
  const isEdit = !!pet
  const [name, setName] = useState(pet?.name ?? '')
  const [species, setSpecies] = useState(pet?.species ?? 'Dog')
  const [breed, setBreed] = useState(pet?.breed ?? '')
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>(
    (pet?.sex as 'male' | 'female' | 'unknown' | null) ?? 'unknown',
  )
  const [bio, setBio] = useState(pet?.bio ?? '')
  const [birthdate, setBirthdate] = useState(pet?.birthdate ?? '')
  const [color, setColor] = useState(pet?.color ?? '')
  const [microchipId, setMicrochipId] = useState(pet?.microchipId ?? '')
  const [neutered, setNeutered] = useState<'yes' | 'no' | 'unknown'>(
    pet?.neutered === true ? 'yes' : pet?.neutered === false ? 'no' : 'unknown',
  )
  const [adoptionDate, setAdoptionDate] = useState(pet?.adoptionDate ?? '')
  const [isPublic, setIsPublic] = useState(pet?.isPublic ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(): Promise<void> {
    if (saving || !name.trim()) return
    setSaving(true)
    setError('')
    try {
      if (isEdit && pet) {
        // Send every field, including cleared ones — the API treats an empty
        // string as "unset this", which a partial payload could not express.
        const saved = await petsApi.update(pet.id, {
          name: name.trim(),
          species,
          breed: breed.trim(),
          sex,
          bio: bio.trim(),
          // '' and null are the explicit "clear this" signals the API accepts.
          birthdate,
          color: color.trim(),
          microchipId: microchipId.trim(),
          neutered: neutered === 'unknown' ? null : neutered === 'yes',
          adoptionDate,
          isPublic,
        })
        onAdded(saved)
      } else {
        const created = await petsApi.create({
          name: name.trim(),
          species,
          ...(breed.trim() ? { breed: breed.trim() } : {}),
          ...(sex !== 'unknown' ? { sex } : {}),
          ...(bio.trim() ? { bio: bio.trim() } : {}),
          ...(birthdate ? { birthdate } : {}),
          ...(color.trim() ? { color: color.trim() } : {}),
          ...(microchipId.trim() ? { microchipId: microchipId.trim() } : {}),
          ...(neutered !== 'unknown' ? { neutered: neutered === 'yes' } : {}),
          ...(adoptionDate ? { adoptionDate } : {}),
          isPublic,
        })
        onAdded(created)
      }
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${isEdit ? 'save' : 'add'} pet`)
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors'
  const chip = (active: boolean): string =>
    `px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${
      active ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'
    }`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-headline text-headline-md text-on-surface">{isEdit ? `Edit ${pet?.name}` : 'Add a pet'}</h2>
          <div className="flex items-center gap-1">
            <DocsHelpLink href="/docs/profile-and-pets#pet-profiles" />
            <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoFocus
              placeholder="e.g. Luna"
              className={field}
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Species</label>
            <div className="flex flex-wrap gap-2">
              {SPECIES.map((s) => (
                <button key={s} onClick={() => setSpecies(s)} className={chip(species === s)}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Breed <span className="text-outline font-normal">(optional)</span></label>
            <input
              value={breed} onChange={(e) => setBreed(e.target.value)} maxLength={60}
              placeholder="e.g. Domestic Shorthair"
              className={field}
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Sex <span className="text-outline font-normal">(for breeding match)</span></label>
            <div className="flex gap-2">
              {SEXES.map((s) => (
                <button key={s.value} onClick={() => setSex(s.value)} className={chip(sex === s.value)}>{s.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
              Date of birth <span className="text-outline font-normal">(optional)</span>
            </label>
            <input
              type="date" value={birthdate} max={TODAY()}
              onChange={(e) => setBirthdate(e.target.value)}
              className={field}
            />
            <p className="text-[11px] text-outline mt-1">Shows their age and gives you a birthday reminder.</p>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Colour &amp; markings <span className="text-outline font-normal">(optional)</span></label>
            <input
              value={color} onChange={(e) => setColor(e.target.value)} maxLength={60}
              placeholder="e.g. Tabby with white chest"
              className={field}
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Neutered / spayed</label>
            <div className="flex flex-wrap gap-2">
              {NEUTERED.map((n) => (
                <button key={n.value} onClick={() => setNeutered(n.value)} className={chip(neutered === n.value)}>{n.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
              Microchip number <span className="text-outline font-normal">(optional)</span>
            </label>
            <input
              value={microchipId} onChange={(e) => setMicrochipId(e.target.value)} maxLength={60}
              placeholder="e.g. 900215000123456"
              className={field}
            />
            <p className="text-[11px] text-outline mt-1">Only shown to you and on vet passport links you share.</p>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
              Adoption / arrival date <span className="text-outline font-normal">(optional)</span>
            </label>
            <input
              type="date" value={adoptionDate} max={TODAY()}
              onChange={(e) => setAdoptionDate(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">
              About <span className="text-outline font-normal">(optional)</span>
            </label>
            <textarea
              value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3}
              placeholder="Personality, favourite things, anything a sitter should know…"
              className={`${field} resize-none`}
            />
            <p className="text-[11px] text-outline mt-1 text-right">{bio.length}/500</p>
          </div>

          <button
            onClick={() => setIsPublic((v) => !v)}
            className="flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            {isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4" />}
            <span>{isPublic ? 'Visible on your profile' : 'Private (only you)'}</span>
          </button>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 pt-3 flex gap-3 flex-shrink-0 border-t border-outline-variant/20">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || !name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save changes' : 'Add pet')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
