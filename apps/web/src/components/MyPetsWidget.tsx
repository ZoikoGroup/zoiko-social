'use client'

import { useState } from 'react'
import Link from 'next/link'
import { petsApi, type Pet } from '@/lib/api'
import { useCachedValue } from '@/hooks/use-cache'
import { AddPetModal } from './AddPetModal'

const TINTS = ['bg-primary/10 text-primary', 'bg-secondary/10 text-secondary', 'bg-emerald-500/10 text-emerald-600']

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

export function MyPetsWidget(): React.JSX.Element {
  const { data, isLoading: loading, setData } = useCachedValue<Pet[]>('pets:mine', () => petsApi.mine())
  const pets = data ?? []
  const [addOpen, setAddOpen] = useState(false)

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-md font-bold text-on-surface">My Pets</h3>
        <Link href="/pet-diary" className="text-[12px] font-semibold text-primary hover:underline">View all</Link>
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
        <div className="space-y-3">
          {pets.map((pet, i) => (
            <div key={pet.id} className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold border border-outline-variant ${pet.avatarUrl ? '' : TINTS[i % TINTS.length]}`}>
                  {pet.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pet.avatarUrl} alt={pet.name} className="w-full h-full object-cover" />
                  ) : initials(pet.name)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-label-sm font-semibold text-on-surface leading-tight">{pet.name}</div>
                <div className="text-[11px] text-outline truncate">
                  {pet.breed || pet.species}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {i === 0 ? 'Healthy' : 'Up to date'}
                </div>
              </div>
              <Link
                href={i === 0 ? '/health-passport' : '/pet-diary'}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-outline-variant/60 text-[11px] font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                {i === 0 ? 'View Passport' : 'Update Care'}
              </Link>
            </div>
          ))}
        </div>
      )}

      <AddPetModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={(pet) => setData((prev) => [pet, ...(prev ?? [])])} />
    </section>
  )
}
