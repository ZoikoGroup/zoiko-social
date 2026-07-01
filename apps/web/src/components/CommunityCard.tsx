'use client'

import { useState } from 'react'

interface Community {
  name: string
  tag: string
  description: string
  members: string
  gradient: string
  joined: boolean
}

const COMMUNITIES: Community[] = [
  { name: 'Golden Retriever Owners', tag: 'Dogs', description: 'Tips, health advice and heartwarming moments for golden families worldwide.', members: '42,180', gradient: 'linear-gradient(135deg,#1e5c48,#3d9a78)', joined: false },
  { name: 'Street Cat Rescue Network', tag: 'Rescue', description: 'Coordinating TNR programmes, foster homes and adoption drives globally.', members: '18,934', gradient: 'linear-gradient(135deg,#8C3D2A,#c4622a)', joined: false },
  { name: 'Marine Life Guardians', tag: 'Wildlife', description: 'Ocean health, coral reef monitoring, marine mammal conservation and citizen science.', members: '29,441', gradient: 'linear-gradient(135deg,#2a4858,#5a9aa8)', joined: true },
  { name: 'Urban Wildlife Corridors', tag: 'Climate', description: 'Creating green passages in cities for hedgehogs, foxes, pollinators and birds.', members: '11,257', gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)', joined: false },
  { name: 'Parrot Enrichment Guild', tag: 'Parrots', description: 'Foraging toys, training science, nutrition and sanctuary partnerships for companion parrots.', members: '8,820', gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)', joined: false },
  { name: 'Animal Cognition Research', tag: 'Science', description: 'Sharing peer-reviewed studies on animal intelligence, emotion and social behaviour.', members: '6,103', gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)', joined: false },
]

export function CommunityCard(): React.JSX.Element {
  const [communities, setCommunities] = useState(COMMUNITIES)

  function toggleJoin(index: number): void {
    setCommunities((prev) => prev.map((c, i) => (i === index ? { ...c, joined: !c.joined } : c)))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {communities.map((community, index) => (
        <div
          key={community.name}
          className="bg-white rounded-xl overflow-hidden cursor-pointer border border-[#E2DDD7]/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-200 card-shadow"
        >
          <div
            className="h-[88px] flex items-end p-3 relative"
            style={{ background: community.gradient }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="relative z-10 text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/10">
              {community.tag}
            </span>
          </div>
          <div className="p-3.5">
            <h3 className="text-sm font-semibold mb-1">{community.name}</h3>
            <p className="text-[0.72rem] text-teal-muted/80 mb-3 leading-relaxed">{community.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] text-[#a8b0ab] flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#a8b0ab]">
                  <circle cx="7" cy="8" r="3" /><circle cx="14" cy="7" r="2.5" /><path d="M1 17c0-3 2-5 5-5h4c3 0 5 2 5 5" />
                </svg>
                {community.members} members
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleJoin(index) }}
                className={`h-[28px] px-3.5 rounded-full text-[0.68rem] font-semibold cursor-pointer transition-all duration-200 active:scale-95 ${
                  community.joined
                    ? 'bg-sage text-white border-0 shadow-[0_2px_6px_rgba(92,158,120,0.3)]'
                    : 'bg-transparent text-sage border border-sage hover:bg-sage hover:text-white'
                }`}
              >
                {community.joined ? 'Joined ✓' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
