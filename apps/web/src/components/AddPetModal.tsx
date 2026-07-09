'use client'

import { useState } from 'react'
import { X, Loader2, Globe, Lock } from 'lucide-react'
import { petsApi, type Pet } from '@/lib/api'

interface AddPetModalProps {
  open: boolean
  onClose: () => void
  onAdded: (pet: Pet) => void
}

const SPECIES = ['Dog', 'Cat', 'Bird', 'Parrot', 'Rabbit', 'Fish', 'Reptile', 'Horse', 'Other']

export function AddPetModal({ open, onClose, onAdded }: AddPetModalProps): React.JSX.Element | null {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('Dog')
  const [breed, setBreed] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function submit(): Promise<void> {
    if (saving || !name.trim()) return
    setSaving(true)
    setError('')
    try {
      const pet = await petsApi.create({
        name: name.trim(),
        species,
        ...(breed.trim() ? { breed: breed.trim() } : {}),
        isPublic,
      })
      onAdded(pet)
      onClose()
      setName(''); setBreed(''); setSpecies('Dog'); setIsPublic(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add pet')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="font-headline text-headline-md text-on-surface">Add a pet</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoFocus
              placeholder="e.g. Luna"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Species</label>
            <div className="flex flex-wrap gap-2">
              {SPECIES.map((s) => (
                <button
                  key={s} onClick={() => setSpecies(s)}
                  className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${
                    species === s ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-sm font-semibold text-on-surface block mb-1.5">Breed <span className="text-outline font-normal">(optional)</span></label>
            <input
              value={breed} onChange={(e) => setBreed(e.target.value)} maxLength={60}
              placeholder="e.g. Domestic Shorthair"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setIsPublic((v) => !v)}
            className="flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            {isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4" />}
            {isPublic ? 'Visible on your profile' : 'Private (only you)'}
          </button>

          {error && <p className="text-label-sm text-red-500">{error}</p>}
        </div>

        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || !name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Adding…' : 'Add pet'}
          </button>
        </div>
      </div>
    </div>
  )
}
