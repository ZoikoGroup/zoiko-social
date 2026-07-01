'use client'

import { Heart, Stethoscope, Utensils, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const COMMUNITIES: { name: string; Icon: LucideIcon; color: string }[] = [
  { name: 'Emergency Rescuers', Icon: Heart, color: 'bg-secondary-container text-secondary' },
  { name: 'Veterinary Insights', Icon: Stethoscope, color: 'bg-[#e8efef] text-tertiary' },
  { name: 'Holistic Pet Nutrition', Icon: Utensils, color: 'bg-outline-variant/20 text-outline' },
]

export function CommunitiesWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="text-label-md font-bold mb-4 flex items-center justify-between">
        Professional Groups
        <button className="text-outline hover:text-primary transition-colors cursor-pointer p-0.5 rounded">
          <Plus className="w-4 h-4" />
        </button>
      </h3>
      <div className="space-y-4">
        {COMMUNITIES.map((c) => (
          <a key={c.name} className="flex items-center gap-3 group cursor-pointer" href="#">
            <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center flex-shrink-0`}>
              <c.Icon className="w-4 h-4" />
            </div>
            <span className="text-label-md group-hover:text-primary transition-colors truncate">{c.name}</span>
          </a>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-label-sm font-semibold text-outline hover:bg-surface-container transition-colors rounded-lg cursor-pointer">
        Discover more
      </button>
    </section>
  )
}
