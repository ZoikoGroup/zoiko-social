'use client'

import { useState } from 'react'
import { MapPin, Users } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

interface PeopleCardProps {
  name: string
  role: string
  location: string
  species: string[]
  mutualConnections: number
  verified?: boolean
  professional?: boolean
  image?: string
}

export function PeopleCard({
  name, role, location, species, mutualConnections, verified = false, professional = false, image,
}: PeopleCardProps): React.JSX.Element {
  const [connected, setConnected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return <></>

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
      {/* Mini cover */}
      <div className="h-14 bg-gradient-to-r from-primary/20 to-secondary/10" />

      <div className="px-4 pb-4 -mt-6 flex flex-col flex-1">
        <UserAvatar name={name} image={image} size="lg" verified={verified} className="ring-2 ring-surface-container-lowest mb-2" />

        <p className="font-semibold text-label-md text-on-surface leading-tight">{name}</p>
        <p className="text-[11px] text-outline mt-0.5 leading-tight line-clamp-2">{role}</p>

        {professional && (
          <span className="mt-1.5 self-start px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-wider rounded-full">
            Professional
          </span>
        )}

        <div className="flex items-center gap-1 mt-2 text-[11px] text-outline">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {mutualConnections > 0 && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-outline">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span>{mutualConnections} mutual connection{mutualConnections > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-2">
          {species.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-primary/8 text-primary text-[9px] font-semibold rounded-full border border-primary/20">
              {s}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-4">
          <button
            onClick={() => setConnected((c) => !c)}
            className={`flex-1 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${
              connected
                ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                : 'border border-primary text-primary hover:bg-primary/5'
            }`}
          >
            {connected ? 'Connected' : '+ Connect'}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-3 py-1.5 rounded-lg text-label-sm text-outline hover:bg-surface-container transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
