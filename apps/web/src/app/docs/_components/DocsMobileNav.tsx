'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DOCS_NAV } from '../_lib/nav'

// Mobile/tablet replacement for the sidebar: a horizontally scrollable chip
// strip, consistent with the `.no-scrollbar` pattern already used elsewhere
// in the app (e.g. the module tray) rather than introducing a new drawer
// pattern just for this section.
export function DocsMobileNav(): React.JSX.Element {
  const pathname = usePathname()

  return (
    <div className="lg:hidden -mx-margin-mobile px-margin-mobile mb-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 w-max pb-1">
        {DOCS_NAV.map((cat) => {
          const active = pathname === `/docs/${cat.slug}`
          return (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-medium whitespace-nowrap border transition-colors ${
                active
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.shortTitle}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
