'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import { DOCS_NAV } from '../_lib/nav'

// Desktop-only sticky sidebar. Split from DocsMobileNav so the layout grid
// can place each in the right column at each breakpoint without one
// component juggling two totally different DOM shapes.
export function DocsSidebar(): React.JSX.Element {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation sections" className="hidden lg:block lg:col-span-3">
      <div className="sticky top-24 space-y-0.5">
        <Link
          href="/docs"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors ${
            pathname === '/docs'
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
          }`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          Help Center Home
        </Link>

        <div className="h-px bg-outline-variant/30 my-2" />

        {DOCS_NAV.map((cat) => {
          const active = pathname === `/docs/${cat.slug}`
          return (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors ${
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
              }`}
            >
              <cat.icon className="w-4 h-4 flex-shrink-0" />
              {cat.shortTitle}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
