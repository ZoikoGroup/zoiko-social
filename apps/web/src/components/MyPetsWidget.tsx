'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ShieldCheck, HeartHandshake, Plus } from 'lucide-react'
import { petsApi, type Pet } from '@/lib/api'
import { AddPetModal } from './AddPetModal'

const CHIPS = [
  { label: 'Diary', Icon: BookOpen, href: '/pet-diary' },
  { label: 'Passport', Icon: ShieldCheck, href: '/health-passport' },
  { label: 'Care Team', Icon: HeartHandshake, href: '/pet-care' },
]

const TINTS = ['bg-primary/10 text-primary', 'bg-secondary/10 text-secondary', 'bg-emerald-500/10 text-emerald-600']

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

export function MyPetsWidget(): React.JSX.Element {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    petsApi.mine()
      .then((data) => { if (!cancelled) setPets(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-md font-bold text-on-surface">My Pets</h3>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline cursor-pointer">
          <Plus className="w-3.5 h-3.5" />Add Pet
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse" />
              <div className="space-y-1"><div className="h-3 w-20 bg-surface-container rounded animate-pulse" /><div className="h-2 w-28 bg-surface-container rounded animate-pulse" /></div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <p className="text-label-sm text-outline">
          No pets yet.{' '}
          <button onClick={() => setAddOpen(true)} className="text-primary hover:underline cursor-pointer">Add your first pet</button>
        </p>
      ) : (
        <div className="space-y-3.5">
          {pets.map((pet, i) => (
            <div key={pet.id}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold border border-outline-variant ${pet.avatarUrl ? '' : TINTS[i % TINTS.length]}`}>
                    {pet.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pet.avatarUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : initials(pet.name)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-container-lowest" />
                </div>
                <div className="min-w-0">
                  <div className="text-label-sm font-semibold text-on-surface leading-tight">{pet.name}</div>
                  <div className="text-[11px] text-outline truncate">
                    {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-[46px]">
                {CHIPS.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-outline-variant/60 text-[10px] font-medium text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                  >
                    <chip.Icon className="w-3 h-3" />{chip.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {pets.length > 0 && (
        <Link href="/pet-diary" className="block w-full mt-4 py-1.5 text-center text-label-sm font-semibold text-primary hover:bg-surface-container transition-colors rounded-lg">
          View all pets
        </Link>
      )}

      <AddPetModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={(pet) => setPets((prev) => [pet, ...prev])} />
    </section>
  )
}
