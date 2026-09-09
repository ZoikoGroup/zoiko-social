'use client'

import Link from 'next/link'
import { PawPrint, Siren, CalendarDays, ShoppingBag, Users, ArrowRight, MapPin } from 'lucide-react'
import type { TagEverything } from '@/lib/api'
import { useDateFormat } from '@/hooks/use-date-format'

/**
 * The non-post half of a tag page.
 *
 * A tag used to mean "posts mentioning this word". Someone opening #beagle is
 * usually looking for a beagle — one to adopt, one that's missing, a meetup —
 * not for people discussing the breed, so those sections come first and posts
 * follow underneath.
 *
 * Each section shows a short preview and links through to that feature's own
 * filtered browse page, rather than trying to be a second search UI.
 */

interface TagSectionsProps {
  tag: string
  data: TagEverything | null
}

function SectionHeader({
  label, Icon, href, count,
}: {
  label: string
  Icon: typeof PawPrint
  href: string
  count: number
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 mb-2.5">
      <h2 className="flex items-center gap-1.5 font-headline text-headline-sm text-on-surface">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </h2>
      <Link href={href} className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline">
        See all {count > 0 ? `(${count}+)` : ''}<ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

export function TagSections({ tag, data }: TagSectionsProps): React.JSX.Element | null {
  const { date: formatDate } = useDateFormat()
  // Nothing at all until the data arrives — an empty frame that fills in is
  // worse than a beat of nothing.
  if (!data) return null

  const encoded = encodeURIComponent(tag)
  const anything =
    data.lostFound.length > 0 || data.adoption.length > 0 || data.events.length > 0
    || data.products.length > 0 || data.communities.length > 0
  if (!anything) return null

  return (
    <div className="space-y-7 mb-8">
      {/* A missing animal outranks everything: if that's why someone is here,
          nothing else on the page matters. */}
      {data.lostFound.length > 0 && (
        <section>
          <SectionHeader label="Lost & Found" Icon={Siren} href={`/lost-found?q=${encoded}`} count={data.lostFound.length} />
          <div className="space-y-2">
            {data.lostFound.map((r) => (
              <Link
                key={r.id}
                href={`/lost-found/${r.id}`}
                className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${
                  r.kind === 'lost' ? 'bg-red-500/15 text-red-600' : 'bg-emerald-500/15 text-emerald-600'
                }`}>
                  {r.kind}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate">{r.petName ?? r.species}</p>
                  {r.lastSeenLocation && (
                    <p className="flex items-center gap-1 text-[11px] text-outline truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />{r.lastSeenLocation}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.adoption.length > 0 && (
        <section>
          <SectionHeader label="Looking for a home" Icon={PawPrint} href={`/adoption?q=${encoded}`} count={data.adoption.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.adoption.map((l) => (
              <Link
                key={l.id}
                href={`/adoption/${l.id}`}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 transition-colors group"
              >
                <div className="aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
                  {l.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : <PawPrint className="w-6 h-6 text-outline" />}
                </div>
                <div className="p-2.5">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                    {l.name || l.species}
                  </p>
                  <p className="text-[11px] text-outline truncate">{l.breed ?? l.species}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.events.length > 0 && (
        <section>
          <SectionHeader label="Events" Icon={CalendarDays} href={`/events?q=${encoded}`} count={data.events.length} />
          <div className="space-y-2">
            {data.events.map((e) => {
              const when = new Date(e.startsAt)
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex-shrink-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold uppercase text-primary leading-none">
                      {formatDate(when, 'month')}
                    </span>
                    <span className="text-label-sm font-bold text-primary leading-tight">{when.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-on-surface truncate">{e.title}</p>
                    <p className="text-[11px] text-outline truncate">
                      {e.community ? e.community.name : (e.isOnline ? 'Online' : (e.venueName ?? e.location ?? ''))}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {data.communities.length > 0 && (
        <section>
          <SectionHeader label="Communities" Icon={Users} href={`/communities?q=${encoded}`} count={data.communities.length} />
          <div className="flex flex-wrap gap-2">
            {data.communities.map((c) => (
              <Link
                key={c.id}
                href={`/c/${c.slug}`}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-label-sm font-semibold text-on-surface">{c.name}</span>
                <span className="text-[11px] text-outline">{c.membersCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.products.length > 0 && (
        <section>
          <SectionHeader label="Products" Icon={ShoppingBag} href={`/shop?q=${encoded}`} count={data.products.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.products.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 transition-colors group"
              >
                <div className="aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
                  {p.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : <ShoppingBag className="w-6 h-6 text-outline" />}
                </div>
                <div className="p-2.5">
                  <p className="text-label-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                    {p.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
