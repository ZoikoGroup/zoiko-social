'use client'

import { useState } from 'react'
import { UserAvatar } from './UserAvatar'

interface Invitation {
  id: string
  name: string
  role: string
  mutualConnections: number
  verified?: boolean
}

const INITIAL: Invitation[] = [
  { id: '1', name: 'Dr. Priya Nair',     role: 'Veterinary Surgeon · Mumbai',         mutualConnections: 12, verified: true  },
  { id: '2', name: 'Sam Okafor',         role: 'Animal Rescue Coordinator · Lagos',   mutualConnections: 5,  verified: false },
  { id: '3', name: 'Elena Vasquez',      role: 'Certified Pet Trainer · Madrid',       mutualConnections: 3,  verified: true  },
]

export function PendingInvitations(): React.JSX.Element {
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL)
  const [expanded, setExpanded] = useState(false)

  function dismiss(id: string): void {
    setInvitations((prev) => prev.filter((i) => i.id !== id))
  }

  if (invitations.length === 0) return <></>

  const visible = expanded ? invitations : invitations.slice(0, 2)

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline text-headline-md text-on-surface">
          Invitations
          <span className="ml-2 px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded-full">{invitations.length}</span>
        </h2>
        {invitations.length > 2 && (
          <button onClick={() => setExpanded((e) => !e)} className="text-label-sm text-primary hover:underline cursor-pointer">
            {expanded ? 'Show less' : `See all ${invitations.length}`}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3">
            <UserAvatar name={inv.name} size="md" verified={inv.verified} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-label-md text-on-surface truncate">{inv.name}</p>
              <p className="text-[11px] text-outline truncate">{inv.role}</p>
              {inv.mutualConnections > 0 && (
                <p className="text-[10px] text-outline">{inv.mutualConnections} mutual connections</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => dismiss(inv.id)}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => dismiss(inv.id)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
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
