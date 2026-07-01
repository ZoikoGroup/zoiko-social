'use client'

import { BookOpen, ShieldCheck, Plus } from 'lucide-react'

const PETS = [
  { name: 'Luna', species: 'Cat · Domestic Shorthair', initials: 'LU', color: 'bg-primary/10 text-primary' },
  { name: 'Bruno', species: 'Dog · Labrador Mix', initials: 'BR', color: 'bg-secondary/10 text-secondary' },
]

export function MyPetsWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="text-label-md font-bold mb-4 flex items-center justify-between">
        My Pets
        <button className="text-outline hover:text-primary transition-colors cursor-pointer p-0.5 rounded" aria-label="Add pet">
          <Plus className="w-4 h-4" />
        </button>
      </h3>
      <div className="space-y-3">
        {PETS.map((pet) => (
          <div key={pet.name}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 rounded-full ${pet.color} flex items-center justify-center text-[10px] font-bold flex-shrink-0 border border-outline-variant`}>
                {pet.initials}
              </div>
              <div className="min-w-0">
                <div className="text-label-md font-semibold leading-tight">{pet.name}</div>
                <div className="text-[10px] text-outline truncate">{pet.species}</div>
              </div>
            </div>
            <div className="flex gap-3 pl-9">
              <a href="#" className="flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <BookOpen className="w-3 h-3" />
                <span>Diary</span>
              </a>
              <span className="text-outline-variant text-[11px]">·</span>
              <a href="#" className="flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <ShieldCheck className="w-3 h-3" />
                <span>Health Passport</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-1.5 text-label-sm font-semibold text-outline hover:bg-surface-container transition-colors rounded-lg cursor-pointer">
        + Add a pet
      </button>
    </section>
  )
}
