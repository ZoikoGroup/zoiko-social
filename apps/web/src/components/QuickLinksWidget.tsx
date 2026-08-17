'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Search, Stethoscope, Heart, Users, Briefcase, PawPrint } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// `key` indexes the `shortcuts` namespace, except lostFound which reuses the
// module name so this tile and the nav entry stay in step.
const SHORTCUTS: { key: string; module?: boolean; Icon: LucideIcon; href: string }[] = [
  { key: 'lostFound', module: true, Icon: Search,      href: '/lost-found'   },
  { key: 'findVet',                 Icon: Stethoscope, href: '/vet-finder'   },
  { key: 'adoption',                Icon: Heart,       href: '/adoption'     },
  { key: 'groups',                  Icon: Users,       href: '/communities'  },
  { key: 'services',                Icon: Briefcase,   href: '/pet-care'     },
]

export function QuickLinksWidget(): React.JSX.Element {
  const t = useTranslations('shortcuts')
  const tm = useTranslations('modules')
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary/15">
          <PawPrint className="w-4 h-4 text-secondary" />
        </span>
        <h3 className="text-label-md font-bold text-on-surface">{t('title')}</h3>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-outline-variant/40 py-2.5 px-1 hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <s.Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-[9px] leading-tight text-center text-on-surface-variant group-hover:text-on-surface transition-colors">
              {s.module ? tm(s.key) : t(s.key)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
