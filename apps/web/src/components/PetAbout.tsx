'use client'

import { Cake, Palette, ScanLine, Scissors, Home, Scale, Pencil } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ageOf, formatPetDate, neuteredLabel } from '@/lib/pet'

interface AboutPet {
  species: string
  breed: string | null
  sex: string | null
  bio: string | null
  birthdate: string | null
  color: string | null
  microchipId: string | null
  neutered: boolean | null
  adoptionDate?: string | null
}

interface PetAboutProps {
  pet: AboutPet
  /** Latest logged weight in kg. Sourced from health records — never stored on the pet. */
  latestWeightKg?: number | undefined
  /** Owner-only affordance; omit on shared/read-only views. */
  onEdit?: (() => void) | undefined
  /** Hidden on views where the chip number should not be shown. */
  showMicrochip?: boolean | undefined
  className?: string | undefined
}

interface Row {
  Icon: LucideIcon
  label: string
  value: string
  hint?: string | undefined
}

export function PetAbout({
  pet,
  latestWeightKg,
  onEdit,
  showMicrochip = true,
  className = '',
}: PetAboutProps): React.JSX.Element | null {
  const age = ageOf(pet.birthdate)
  const born = formatPetDate(pet.birthdate)
  const neutered = neuteredLabel(pet.neutered)
  const adopted = formatPetDate(pet.adoptionDate)

  const rows: Row[] = []
  if (age) rows.push({ Icon: Cake, label: 'Age', value: age, hint: born ?? undefined })
  if (pet.color) rows.push({ Icon: Palette, label: 'Colour & markings', value: pet.color })
  if (latestWeightKg !== undefined) {
    rows.push({ Icon: Scale, label: 'Weight', value: `${latestWeightKg} kg`, hint: 'latest logged' })
  }
  if (neutered) rows.push({ Icon: Scissors, label: 'Neutered / spayed', value: neutered })
  if (adopted) rows.push({ Icon: Home, label: 'Adopted', value: adopted })
  if (showMicrochip && pet.microchipId) {
    rows.push({ Icon: ScanLine, label: 'Microchip', value: pet.microchipId })
  }

  // Nothing filled in and nothing to do about it — render nothing rather than an
  // empty shell. Owners still get the prompt below via onEdit.
  if (rows.length === 0 && !pet.bio && !onEdit) return null

  return (
    <div className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-sm font-bold text-on-surface">About</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline cursor-pointer no-print"
          >
            <Pencil className="w-3.5 h-3.5" />Edit
          </button>
        )}
      </div>

      {pet.bio && <p className="text-[13px] text-on-surface-variant leading-relaxed mb-3">{pet.bio}</p>}

      {rows.length > 0 ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-2.5 min-w-0">
              <r.Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-outline">{r.label}</dt>
                <dd className="text-label-sm font-semibold text-on-surface break-words">
                  {r.value}
                  {r.hint && <span className="ml-1.5 font-normal text-[11px] text-outline">({r.hint})</span>}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      ) : (
        !pet.bio && (
          <p className="text-[12px] text-outline">
            No details yet — add a birthday, colour or microchip number so vets and sitters have what they need.
          </p>
        )
      )}
    </div>
  )
}
