'use client'

import Link from 'next/link'
import { BookOpen, ShieldCheck, HeartHandshake, Plus } from 'lucide-react'

// Pet records are a per-user dataset; wired to a pets API when it ships.
const PETS = [
  { name: 'Luna', species: 'Cat · Domestic Shorthair', initials: 'LU', color: 'bg-primary/10 text-primary' },
  { name: 'Bruno', species: 'Dog · Labrador Mix', initials: 'BR', color: 'bg-secondary/10 text-secondary' },
  { name: 'Pip', species: 'Parrot · African Grey', initials: 'PI', color: 'bg-emerald-500/10 text-emerald-600' },
]

const CHIPS = [
  { label: 'Diary', Icon: BookOpen, href: '/pet-diary' },
  { label: 'Passport', Icon: ShieldCheck, href: '/health-passport' },
  { label: 'Care Team', Icon: HeartHandshake, href: '/pet-care' },
]

export function MyPetsWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label-md font-bold text-on-surface">My Pets</h3>
        <Link href="/adoption/new" className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline">
          <Plus className="w-3.5 h-3.5" />Add Pet
        </Link>
      </div>

      <div className="space-y-3.5">
        {PETS.map((pet) => (
          <div key={pet.name}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="relative flex-shrink-0">
                <div className={`w-9 h-9 rounded-full ${pet.color} flex items-center justify-center text-[11px] font-bold border border-outline-variant`}>
                  {pet.initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-container-lowest" />
              </div>
              <div className="min-w-0">
                <div className="text-label-sm font-semibold text-on-surface leading-tight">{pet.name}</div>
                <div className="text-[11px] text-outline truncate">{pet.species}</div>
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

      <Link
        href="/pet-diary"
        className="block w-full mt-4 py-1.5 text-center text-label-sm font-semibold text-primary hover:bg-surface-container transition-colors rounded-lg"
      >
        View all pets
      </Link>
    </section>
  )
}
