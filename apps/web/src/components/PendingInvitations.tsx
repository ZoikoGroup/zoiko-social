'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AtSign } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { networkApi, type FollowRequestItem } from '@/lib/api'

export function PendingInvitations(): React.JSX.Element {
  const [requests, setRequests] = useState<FollowRequestItem[]>([])
  const [expanded, setExpanded] = useState(false)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    networkApi.getRequests()
      .then((result) => { if (!cancelled) setRequests(result.data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  async function respond(id: string, action: 'accept' | 'reject'): Promise<void> {
    if (busyIds.has(id)) return
    setBusyIds((prev) => new Set(prev).add(id))
    try {
      if (action === 'accept') {
        await networkApi.acceptRequest(id)
      } else {
        await networkApi.rejectRequest(id)
      }
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // Keep the request visible on failure
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  if (requests.length === 0) return <></>

  const visible = expanded ? requests : requests.slice(0, 2)

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline text-headline-md text-on-surface">
          Follow Requests
          <span className="ml-2 px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded-full">{requests.length}</span>
        </h2>
        {requests.length > 2 && (
          <button onClick={() => setExpanded((e) => !e)} className="text-label-sm text-primary hover:underline cursor-pointer">
            {expanded ? 'Show less' : `See all ${requests.length}`}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map((req) => (
          <div key={req.id} className="flex items-center gap-3">
            <Link href={`/profile/${req.sender.username}`}>
              <UserAvatar name={req.sender.displayName} image={req.sender.avatarUrl ?? undefined} size="md" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${req.sender.username}`} className="font-semibold text-label-md text-on-surface truncate hover:underline block">
                {req.sender.displayName}
              </Link>
              <p className="flex items-center gap-0.5 text-[11px] text-outline truncate">
                <AtSign className="w-2.5 h-2.5" />{req.sender.username}
              </p>
              {req.message && (
                <p className="text-[10px] text-outline truncate italic">&ldquo;{req.message}&rdquo;</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => respond(req.id, 'accept')}
                disabled={busyIds.has(req.id)}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => respond(req.id, 'reject')}
                disabled={busyIds.has(req.id)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container disabled:opacity-50 transition-colors cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
