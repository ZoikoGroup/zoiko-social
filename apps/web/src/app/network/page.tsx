'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, BadgeCheck } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { PeopleCard } from '@/components/PeopleCard'
import { PendingInvitations } from '@/components/PendingInvitations'
import { RightPanel } from '@/components/RightPanel'

const ROLE_FILTERS = ['All', 'Veterinarian', 'Rescuer', 'Trainer', 'Caretaker', 'Seller', 'Shelter', 'Breeder']
const SPECIES_FILTERS = ['Dogs', 'Cats', 'Birds', 'Exotic', 'Wildlife', 'Small Mammals']

const SUGGESTIONS = [
  { name: 'Dr. Amara Osei',        role: 'Veterinary Surgeon · Small Animal Specialist',    location: 'Accra, Ghana',         species: ['Dogs', 'Cats'],         mutualConnections: 8,  verified: true,  professional: true  },
  { name: 'Ravi Krishnamurthy',     role: 'Animal Rescue Coordinator · Street Dog Welfare',  location: 'Chennai, India',       species: ['Dogs'],                 mutualConnections: 14, verified: false, professional: true  },
  { name: 'Sofia Andersson',        role: 'Certified Dog Trainer & Behaviourist',             location: 'Stockholm, Sweden',    species: ['Dogs'],                 mutualConnections: 3,  verified: true,  professional: true  },
  { name: 'Carlos Mendoza',         role: 'Exotic Bird Specialist & Avian Vet',               location: 'Mexico City, Mexico',  species: ['Birds', 'Exotic'],      mutualConnections: 6,  verified: true,  professional: true  },
  { name: 'Nadia Petrova',          role: 'Feline Behaviour Consultant',                       location: 'Moscow, Russia',       species: ['Cats'],                 mutualConnections: 2,  verified: false, professional: true  },
  { name: 'James Odhiambo',         role: 'Wildlife Conservation Officer · Big Cats',          location: 'Nairobi, Kenya',       species: ['Wildlife'],             mutualConnections: 9,  verified: true,  professional: true  },
  { name: 'Mei Lin Zhang',          role: 'Pet Groomer & Caretaker · Premium Boarding',        location: 'Shanghai, China',      species: ['Dogs', 'Cats'],         mutualConnections: 1,  verified: false, professional: false },
  { name: 'Arjun Patel',            role: 'Responsible Breeder · Golden Retrievers',            location: 'Pune, India',          species: ['Dogs'],                 mutualConnections: 7,  verified: true,  professional: true  },
]

const NEARBY = [
  { name: 'Paws Rescue SF',        role: 'Animal Shelter & Rescue',       distance: '1.2 km' },
  { name: 'Dr. Marcus Webb DVM',   role: 'Veterinary Clinic · All Species', distance: '2.8 km' },
  { name: 'Bay Area Pet Trainers', role: 'Group Training & Boarding',      distance: '4.1 km' },
]

export default function NetworkPage(): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('All')
  const [activeSpecies, setActiveSpecies] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  function toggleSpecies(s: string): void {
    setActiveSpecies((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  const filtered = SUGGESTIONS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.role.toLowerCase().includes(search.toLowerCase())) return false
    if (activeRole !== 'All' && !p.role.toLowerCase().includes(activeRole.toLowerCase())) return false
    if (activeSpecies.length > 0 && !activeSpecies.some((s) => p.species.includes(s))) return false
    if (verifiedOnly && !p.verified) return false
    return true
  })

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter">

            {/* Left: filters */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 sticky top-24 space-y-5">
                <h3 className="font-headline text-headline-md text-on-surface">Filter</h3>

                {/* Verified toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-label-md text-on-surface">
                    <BadgeCheck className="w-4 h-4 text-primary" />Verified only
                  </span>
                  <button
                    role="switch"
                    aria-checked={verifiedOnly}
                    onClick={() => setVerifiedOnly((v) => !v)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${verifiedOnly ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>

                {/* Nearby */}
                <label className="flex items-center gap-2 text-label-md text-on-surface cursor-pointer">
                  <MapPin className="w-4 h-4 text-outline" />Near me
                </label>

                {/* Role filter */}
                <div>
                  <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Role</p>
                  <div className="space-y-1">
                    {ROLE_FILTERS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setActiveRole(r)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-label-md transition-colors cursor-pointer ${
                          activeRole === r ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Species filter */}
                <div>
                  <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Species</p>
                  <div className="flex flex-wrap gap-2">
                    {SPECIES_FILTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSpecies(s)}
                        className={`px-3 py-1 rounded-full text-label-sm transition-colors cursor-pointer ${
                          activeSpecies.includes(s)
                            ? 'bg-primary text-white'
                            : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center */}
            <div className="lg:col-span-6 space-y-gutter pb-20">
              {/* Search + mobile filter toggle */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, role, or species…"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters((f) => !f)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile filter chips */}
              {showFilters && (
                <div className="lg:hidden bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {ROLE_FILTERS.map((r) => (
                      <button key={r} onClick={() => setActiveRole(r)}
                        className={`px-3 py-1 rounded-full text-label-sm transition-colors cursor-pointer ${activeRole === r ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}
                      >{r}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SPECIES_FILTERS.map((s) => (
                      <button key={s} onClick={() => toggleSpecies(s)}
                        className={`px-3 py-1 rounded-full text-label-sm transition-colors cursor-pointer ${activeSpecies.includes(s) ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending invitations */}
              <PendingInvitations />

              {/* People you may know */}
              <section>
                <h2 className="font-headline text-headline-md text-on-surface mb-4">
                  People you may know
                  {filtered.length !== SUGGESTIONS.length && (
                    <span className="ml-2 text-label-sm text-outline font-normal">({filtered.length} results)</span>
                  )}
                </h2>
                {filtered.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-10 text-center text-outline">
                    No results found — try adjusting your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filtered.map((p) => <PeopleCard key={p.name} {...p} />)}
                  </div>
                )}
              </section>

              {/* Nearby professionals */}
              <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4">
                <h2 className="font-headline text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />Near you
                </h2>
                <div className="space-y-3">
                  {NEARBY.map((n) => (
                    <div key={n.name} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-label-md text-on-surface">{n.name}</p>
                        <p className="text-[11px] text-outline">{n.role}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-label-sm text-secondary font-semibold">{n.distance}</span>
                        <button className="px-3 py-1.5 rounded-lg border border-primary text-primary text-label-sm hover:bg-primary/5 transition-colors cursor-pointer">
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="lg:col-span-3 hidden xl:block">
              <RightPanel />
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="network" />
    </>
  )
}
