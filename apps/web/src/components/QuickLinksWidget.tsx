'use client'

import Link from 'next/link'
import { Search, Stethoscope, Heart, Users, Briefcase, PawPrint } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const SHORTCUTS: { name: string; Icon: LucideIcon; href: string }[] = [
  { name: 'Lost & Found', Icon: Search,      href: '/lost-found'   },
  { name: 'Find a Vet',   Icon: Stethoscope, href: '/vet-finder'   },
  { name: 'Adoption',     Icon: Heart,       href: '/adoption'     },
  { name: 'Groups',       Icon: Users,       href: '/communities'  },
  { name: 'Services',     Icon: Briefcase,   href: '/pet-care'     },
]

export function QuickLinksWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary/15">
          <PawPrint className="w-4 h-4 text-secondary" />
        </span>
        <h3 className="text-label-md font-bold text-on-surface">Shortcuts</h3>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-outline-variant/40 py-2.5 px-1 hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <s.Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-[9px] leading-tight text-center text-on-surface-variant group-hover:text-on-surface transition-colors">
              {s.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
