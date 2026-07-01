'use client'

import { useState } from 'react'
import { MapPin, Clock, Eye, Users, UserCheck, CheckCircle2, Share2 } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { MarkFoundModal } from './MarkFoundModal'

export type Visibility = 'public' | 'communities' | 'close-friends'
export type PetStatus = 'lost' | 'found'

export interface LostPet {
  id: string
  petName: string
  species: string
  breed: string
  age: string
  color: string
  image: string
  lastSeenLocation: string
  lastSeenDate: string
  description: string
  ownerName: string
  ownerVerified?: boolean
  visibility: Visibility
  status: PetStatus
  postedAgo: string
}

const VISIBILITY_CONFIG: Record<Visibility, { label: string; Icon: typeof Eye; color: string }> = {
  'public':        { label: 'Public',        Icon: Eye,       color: 'bg-primary/10 text-primary'    },
  'communities':   { label: 'Communities',   Icon: Users,     color: 'bg-secondary/10 text-secondary' },
  'close-friends': { label: 'Close Friends', Icon: UserCheck, color: 'bg-tertiary/20 text-tertiary'   },
}

interface LostPetCardProps {
  pet: LostPet
  isOwner?: boolean
  onStatusChange?: (id: string, status: PetStatus) => void
}

export function LostPetCard({ pet, isOwner = false, onStatusChange }: LostPetCardProps): React.JSX.Element {
  const [showFoundModal, setShowFoundModal] = useState(false)
  const vis = VISIBILITY_CONFIG[pet.visibility]

  return (
    <>
      <MarkFoundModal
        open={showFoundModal}
        onClose={() => setShowFoundModal(false)}
        pet={pet}
        onConfirm={() => {
          setShowFoundModal(false)
          onStatusChange?.(pet.id, 'found')
        }}
      />

      <article className={`bg-surface-container-lowest rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all ${
        pet.status === 'found' ? 'border-green-200 opacity-75' : 'border-outline-variant/30'
      }`}>
        {/* Status banner */}
        {pet.status === 'found' && (
          <div className="bg-green-500 text-white text-center text-label-sm font-bold py-1.5 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Reunited!
          </div>
        )}

        {/* Image */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pet.image}
            alt={pet.petName}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
          {/* Visibility badge */}
          <span className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${vis.color}`}>
            <vis.Icon className="w-3 h-3" />
            {vis.label}
          </span>
          {/* Species chip */}
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm">
            {pet.species}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-headline text-headline-md text-on-surface leading-tight">{pet.petName}</h3>
              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                pet.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
              }`}>
                {pet.status}
              </span>
            </div>
            <p className="text-label-sm text-outline mt-0.5">{pet.breed} · {pet.age} · {pet.color}</p>
          </div>

          <div className="space-y-1.5 text-label-sm text-on-surface-variant">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="leading-tight">Last seen: <span className="font-semibold text-on-surface">{pet.lastSeenLocation}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-outline flex-shrink-0" />
              <span>{pet.lastSeenDate} · {pet.postedAgo}</span>
            </div>
          </div>

          <p className="text-label-sm text-on-surface-variant leading-relaxed line-clamp-2">{pet.description}</p>

          {/* Owner */}
          <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
            <UserAvatar name={pet.ownerName} size="xs" verified={pet.ownerVerified} />
            <span className="text-[11px] text-outline flex-1">Posted by <span className="font-semibold text-on-surface">{pet.ownerName}</span></span>
            <button className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          {pet.status === 'lost' && (
            <div className="flex gap-2">
              {isOwner ? (
                <button
                  onClick={() => onStatusChange?.(pet.id, 'found')}
                  className="flex-1 py-2 rounded-lg bg-green-500 text-white text-label-sm font-semibold hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Reunited
                </button>
              ) : (
                <button
                  onClick={() => setShowFoundModal(true)}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I Found This Pet
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
