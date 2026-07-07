'use client'

import Link from 'next/link'
import {
  Newspaper, Calendar, MapPin, ShoppingBag, PawPrint, Dna,
  Stethoscope, Leaf, HeartHandshake, GraduationCap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const LINKS: { name: string; Icon: LucideIcon; badge?: string; href: string }[] = [
  { name: 'Verified News',            Icon: Newspaper,     href: '/news'                        },
  { name: 'Events',                   Icon: Calendar,      href: '/events'                      },
  { name: 'Lost & Found',             Icon: MapPin,        href: '/lost-found', badge: 'New'    },
  { name: 'Marketplace',              Icon: ShoppingBag,   href: '/shop'                        },
  { name: 'Adoption & Rescue',        Icon: PawPrint,      href: '/adoption'                    },
  { name: 'Responsible Breeder Match',Icon: Dna,           href: '/breeding-match'              },
  { name: 'Find a Vet',               Icon: Stethoscope,   href: '/vet-finder'                  },
  { name: 'Wildlife & Conservation',  Icon: Leaf,          href: '/explore'                     },
  { name: 'Pet Care Services',        Icon: HeartHandshake,href: '/pet-care'                    },
  { name: 'Education Hub',            Icon: GraduationCap, href: '/news'                        },
]

export function QuickLinksWidget(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="text-label-md font-bold mb-3 text-on-surface">Explore</h3>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        {LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer group min-w-0"
          >
            <link.Icon className="w-4 h-4 text-outline group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="text-[12px] text-on-surface-variant group-hover:text-on-surface transition-colors truncate flex-1">
              {link.name}
            </span>
            {link.badge && (
              <span className="text-[8px] font-bold px-1 py-0.5 bg-secondary/15 text-secondary rounded uppercase tracking-wide flex-shrink-0">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
