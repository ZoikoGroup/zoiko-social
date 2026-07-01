'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { LostPetCard, type LostPet, type PetStatus } from '@/components/LostPetCard'
import { ReportLostPetModal } from '@/components/ReportLostPetModal'

const INITIAL_PETS: LostPet[] = [
  {
    id: '1',
    petName: 'Luna',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: '2 years',
    color: 'Grey & White',
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=400&fit=crop',
    lastSeenLocation: 'Riverside Park, North Entrance',
    lastSeenDate: 'Jun 29, 2026',
    description: 'Luna has a small pink collar with a bell. Very friendly, responds to her name. She has a tiny white patch on her left ear.',
    ownerName: 'Alex Rivera',
    ownerVerified: true,
    visibility: 'public',
    status: 'lost',
    postedAgo: '2 hours ago',
  },
  {
    id: '2',
    petName: 'Bruno',
    species: 'Dog',
    breed: 'Labrador Mix',
    age: '4 years',
    color: 'Golden',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    lastSeenLocation: 'Greenview Market, near the bus stop',
    lastSeenDate: 'Jun 28, 2026',
    description: 'Bruno is wearing a blue harness and has a red ID tag. He is neutered and microchipped. Very friendly with people.',
    ownerName: 'Priya Nair',
    ownerVerified: false,
    visibility: 'communities',
    status: 'lost',
    postedAgo: 'Yesterday',
  },
  {
    id: '3',
    petName: 'Kiwi',
    species: 'Bird',
    breed: 'Budgerigar',
    age: '1 year',
    color: 'Green & Yellow',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=600&h=400&fit=crop',
    lastSeenLocation: 'Sector 12, Garden Colony',
    lastSeenDate: 'Jun 27, 2026',
    description: 'Kiwi flew out of an open window. Very tame, will fly toward people. Says "Kiwi hello" if spoken to. Last seen heading east.',
    ownerName: 'Meera Singh',
    ownerVerified: true,
    visibility: 'public',
    status: 'lost',
    postedAgo: '2 days ago',
  },
  {
    id: '4',
    petName: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '3 years',
    color: 'Black & Tan',
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=600&h=400&fit=crop',
    lastSeenLocation: 'City Centre, near Metro Station',
    lastSeenDate: 'Jun 25, 2026',
    description: 'Max has a GPS collar but battery may have died. He responds to "Max" and "Sit". Scar on right hind leg.',
    ownerName: 'Carlos Mendoza',
    ownerVerified: true,
    visibility: 'public',
    status: 'found',
    postedAgo: '4 days ago',
  },
]

const SPECIES_FILTERS = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other']

export default function LostFoundPage(): React.JSX.Element {
  const [pets, setPets] = useState<LostPet[]>(INITIAL_PETS)
  const [search, setSearch] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found'>('all')
  const [showReport, setShowReport] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  function handleStatusChange(id: string, status: PetStatus): void {
    setPets((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
  }

  const filtered = pets.filter((p) => {
    if (search && !p.petName.toLowerCase().includes(search.toLowerCase()) && !p.lastSeenLocation.toLowerCase().includes(search.toLowerCase())) return false
    if (speciesFilter !== 'All' && p.species !== speciesFilter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  const lostCount  = pets.filter((p) => p.status === 'lost').length
  const foundCount = pets.filter((p) => p.status === 'found').length

  return (
    <>
      <Header />
      <ReportLostPetModal
        open={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={(data) => {
          const newPet: LostPet = {
            id: String(Date.now()),
            ...data,
            image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=400&fit=crop',
            ownerName: 'Alex Rivera',
            ownerVerified: true,
            status: 'lost',
            postedAgo: 'Just now',
          }
          setPets((prev) => [newPet, ...prev])
        }}
      />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">

          {/* Page header with back button */}
          <div className="flex items-start justify-between gap-4 mb-gutter">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
                aria-label="Back to home"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-headline text-headline-lg text-on-surface">Lost & Found</h1>
                <p className="text-label-md text-outline mt-1">Help reunite pets with their families</p>
              </div>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Lost Pet
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 mb-gutter">
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-headline-md text-red-600">{lostCount}</p>
                <p className="text-[11px] text-red-400">Currently lost</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex-1">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-headline-md text-green-600">{foundCount}</p>
                <p className="text-[11px] text-green-400">Reunited</p>
              </div>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="flex gap-3 mb-gutter">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pet name or location…"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-label-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline text-label-md">Filter</span>
            </button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 mb-gutter space-y-3">
              <div>
                <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Species</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIES_FILTERS.map((s) => (
                    <button key={s} onClick={() => setSpeciesFilter(s)}
                      className={`px-3 py-1.5 rounded-full text-label-sm transition-colors cursor-pointer ${speciesFilter === s ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Status</p>
                <div className="flex gap-2">
                  {(['all', 'lost', 'found'] as const).map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-full text-label-sm capitalize transition-colors cursor-pointer ${statusFilter === s ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                      {s === 'all' ? 'All' : s === 'lost' ? '🔴 Lost' : '🟢 Reunited'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          {(search || speciesFilter !== 'All' || statusFilter !== 'all') && (
            <p className="text-label-sm text-outline mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
          )}

          {/* Pet grid */}
          {filtered.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="font-semibold text-label-md text-on-surface">No lost pets found</p>
              <p className="text-label-sm text-outline mt-1">Try adjusting your filters, or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-20">
              {filtered.map((pet) => (
                <LostPetCard
                  key={pet.id}
                  pet={pet}
                  isOwner={pet.ownerName === 'Alex Rivera'}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileTabs currentPage="lost-found" />
    </>
  )
}
