'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, MapPin, Users, Globe, Plus } from 'lucide-react'
import { eventsApi, type EventItem } from '@/lib/api'
import { EventFormModal } from '@/components/events/EventFormModal'

/**
 * Events hosted by a community.
 *
 * Events and communities were entirely separate features — a rescue group
 * running a monthly meet had to post the event to the global list and hope its
 * own members noticed. An event can now name the community hosting it, which
 * gives it a home here and attribution wherever it appears.
 *
 * Only an owner or admin sees the create button; the API enforces the same rule,
 * because attaching an event to a community is a claim to speak for it.
 */
export function CommunityEvents({
  communityId,
  communityName,
  canHost,
}: {
  communityId: string
  communityName: string
  canHost: boolean
}): React.JSX.Element {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const load = useCallback(() => {
    eventsApi.upcoming(null, 20, { communityId })
      .then((p) => setEvents(p.data))
      .catch(() => setEvents([]))
  }, [communityId])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface">
          <CalendarDays className="w-4 h-4 text-primary" />
          Events
        </h2>
        {canHost && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />Host an event
          </button>
        )}
      </div>

      {events === null ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center">
          <CalendarDays className="w-8 h-8 text-outline mx-auto mb-2" />
          <p className="text-label-md font-semibold text-on-surface">Nothing planned yet</p>
          <p className="text-label-sm text-outline mt-0.5">
            {canHost
              ? `Host a meetup, workshop or adoption drive as ${communityName}.`
              : 'Events hosted by this community will show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => {
            const when = new Date(e.startsAt)
            const place = e.isOnline ? 'Online' : (e.venueName ?? e.location)
            return (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold uppercase text-primary leading-none">
                    {when.toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                  <span className="text-label-md font-bold text-primary leading-tight">{when.getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm font-semibold text-on-surface truncate">{e.title}</p>
                  <p className="flex items-center gap-2 text-[11px] text-outline mt-0.5">
                    <span>{when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    {place && (
                      <span className="flex items-center gap-0.5 truncate">
                        {e.isOnline ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {place}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{e.goingCount}</span>
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {createOpen && (
        <EventFormModal
          communityId={communityId}
          onClose={() => setCreateOpen(false)}
          onSaved={() => { setCreateOpen(false); load() }}
        />
      )}
    </section>
  )
}
