'use client'

import { Newspaper, Calendar, PawPrint, MapPin, ShoppingBag, HandHeart, Dna } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const LINKS: { name: string; Icon: LucideIcon; badge?: string; href?: string }[] = [
  { name: 'Verified News',     Icon: Newspaper   },
  { name: 'Events',            Icon: Calendar    },
  { name: 'Adoption & Rescue', Icon: PawPrint,    href: '/adoption' },
  { name: 'Lost & Found',      Icon: MapPin,     badge: 'New' },
  { name: 'Shop',              Icon: ShoppingBag },
  { name: 'Pet Care Services', Icon: HandHeart   },
  { name: 'Breeding Match',    Icon: Dna         },
]

export function QuickLinksWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="text-label-md font-bold mb-3">Explore</h3>
      <nav className="space-y-0.5">
        {LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href ?? '#'}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer group"
          >
            <link.Icon className="w-4 h-4 text-outline group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors flex-1">
              {link.name}
            </span>
            {link.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-secondary-container text-on-secondary-container rounded uppercase tracking-wider">
                {link.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
    </section>
  )
}
