'use client'

import { useState } from 'react'

interface Animal {
  id: string
  name: string
  breed: string
  location: string
  distance: string
  date: string
  status: 'lost' | 'found'
  gradient: string
  photoLabel: string
}

const ANIMALS: Animal[] = [
  { id: 'l1', name: 'Bruno', breed: 'German Shepherd · Male · 3 yrs', location: 'Koramangala, Bangalore', distance: '1.2 km', date: 'Missing since 24 Jun 2026', status: 'lost', gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)', photoLabel: 'Dog\nPhoto' },
  { id: 'l2', name: 'Mochi', breed: 'Ragdoll · Female · 1.5 yrs', location: 'Indiranagar, Bangalore', distance: '3.4 km', date: 'Missing since 21 Jun 2026', status: 'lost', gradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)', photoLabel: 'Cat\nPhoto' },
  { id: 'l3', name: 'Kiwi', breed: 'Alexandrine Parakeet · Male · 4 yrs', location: 'HSR Layout, Bangalore', distance: '5.1 km', date: 'Missing since 18 Jun 2026', status: 'lost', gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)', photoLabel: 'Parrot\nPhoto' },
  { id: 'f1', name: 'Unknown Dog', breed: 'Labrador mix · Male · ~2 yrs', location: 'JP Nagar, Bangalore', distance: '2.8 km', date: 'Found on 27 Jun 2026', status: 'found', gradient: 'linear-gradient(135deg,#5C9E78,#2a6b4a)', photoLabel: 'Dog\nPhoto' },
  { id: 'f2', name: 'Tabby Cat', breed: 'Domestic Shorthair · Female · ~3 yrs', location: 'Whitefield, Bangalore', distance: '8.2 km', date: 'Found on 25 Jun 2026', status: 'found', gradient: 'linear-gradient(135deg,#8C5C9E,#5a3a72)', photoLabel: 'Cat\nPhoto' },
  { id: 'f3', name: 'White Rabbit', breed: 'Dutch breed · Unknown · ~1 yr', location: 'Jayanagar, Bangalore', distance: '4.5 km', date: 'Found on 26 Jun 2026', status: 'found', gradient: 'linear-gradient(135deg,#9e7a5c,#6e5238)', photoLabel: 'Rabbit\nPhoto' },
]

export function AnimalCard(): React.JSX.Element {
  const [tab, setTab] = useState<'lost' | 'found'>('lost')
  const filtered = ANIMALS.filter((a) => a.status === tab)

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <div className="flex-1 w-full">
        {/* Tabs */}
        <div className="flex mb-4 bg-white border border-[#E2DDD7]/60 rounded-xl p-1 gap-1 card-shadow">
          <button
            onClick={() => setTab('lost')}
            className={`flex-1 h-[34px] rounded-lg border-0 text-xs font-semibold cursor-pointer transition-all duration-200 ${
              tab === 'lost'
                ? 'bg-teal-deep text-white shadow-sm'
                : 'bg-transparent text-teal-muted/70 hover:bg-[#F5F2ED]/60'
            }`}
          >
            Lost Animals
          </button>
          <button
            onClick={() => setTab('found')}
            className={`flex-1 h-[34px] rounded-lg border-0 text-xs font-semibold cursor-pointer transition-all duration-200 ${
              tab === 'found'
                ? 'bg-teal-deep text-white shadow-sm'
                : 'bg-transparent text-teal-muted/70 hover:bg-[#F5F2ED]/60'
            }`}
          >
            Found Animals
          </button>
        </div>

        {/* Animal cards */}
        {filtered.map((animal) => (
          <div key={animal.id} className="bg-white rounded-xl border border-[#E2DDD7]/60 mb-2.5 flex gap-3.5 p-3.5 items-start transition-all duration-200 card-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div
              className="w-[72px] h-[72px] rounded-xl flex-shrink-0 flex items-center justify-center text-[0.6rem] font-semibold text-white/80 text-center leading-snug shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              style={{ background: animal.gradient }}
            >
              {animal.photoLabel.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-semibold">{animal.name}</h3>
                <span className={`text-[0.55rem] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  animal.status === 'lost' ? 'bg-red-50 text-red-500' : 'bg-sage/10 text-sage'
                }`}>
                  {animal.status === 'lost' ? 'LOST' : 'FOUND'}
                </span>
              </div>
              <div className="text-[0.72rem] text-teal-muted/70 mb-1.5">{animal.breed}</div>
              <div className="text-[0.68rem] text-[#a8b0ab] flex items-center gap-1 mb-1">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 2a5 5 0 015 5c0 4-5 11-5 11S5 11 5 7a5 5 0 015-5z" />
                </svg>
                {animal.location} · {animal.distance}
              </div>
              <div className="text-[0.65rem] text-[#a8b0ab] mb-2">{animal.date}</div>
              <button className={`h-[28px] px-3.5 rounded-lg border text-[0.68rem] font-semibold cursor-pointer transition-all duration-200 active:scale-95 ${
                tab === 'lost'
                  ? 'border-amber-light bg-transparent text-amber-light hover:bg-amber-light hover:text-white'
                  : 'border-sage bg-transparent text-sage hover:bg-sage hover:text-white'
              }`}>
                {tab === 'lost' ? 'Contact Owner' : 'I Know This Pet'}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-teal-muted/50 text-sm">
            No {tab} animals in your area
          </div>
        )}
      </div>

      {/* Map placeholder */}
      <div className="hidden lg:block w-[220px] flex-shrink-0">
        <div
          className="rounded-xl overflow-hidden h-80 bg-gradient-to-br from-teal-deep via-teal-mid to-[#2a6b5a] flex flex-col items-center justify-center text-white/50 text-xs text-center gap-2.5 sticky top-20 border border-white/5 shadow-lg"
          aria-label="Map of lost and found animal sightings"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
              <path d="M20 5a10 10 0 0110 10c0 8-10 22-10 22S10 23 10 15A10 10 0 0120 5z" />
              <circle cx="20" cy="15" r="3.5" />
              <circle cx="13" cy="22" r="2.5" />
              <circle cx="27" cy="18" r="2.5" />
            </svg>
          </div>
          <div className="font-medium">Sighting Map</div>
          <div className="text-white/25 text-[0.65rem] tracking-wider uppercase">Bangalore · 5 km radius</div>
        </div>
      </div>
    </div>
  )
}
