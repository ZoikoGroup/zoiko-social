'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  ChevronLeft, Search, Star, MapPin,
  ShieldCheck, BadgeCheck, Filter,
  Heart, Dna, Syringe, Users,
  PawPrint, CheckCircle2, AlertTriangle,
} from 'lucide-react'

type BreedType = 'all' | 'dogs' | 'cats' | 'birds' | 'rabbits' | 'other'

interface BreedingMatch {
  id: string
  name: string
  breed: string
  type: BreedType
  age: string
  location: string
  distance: string
  image: string
  gradient: string
  rating: number
  reviewCount: number
  about: string
  healthTests: string[]
  certifications: string[]
  verified: boolean
  matchScore: number
  available: boolean
  price: string
  litters: number
}

const BREED_TYPES: { id: BreedType; label: string }[] = [
  { id: 'all',     label: 'All Breeds' },
  { id: 'dogs',    label: 'Dogs' },
  { id: 'cats',    label: 'Cats' },
  { id: 'birds',   label: 'Birds' },
  { id: 'rabbits', label: 'Rabbits' },
  { id: 'other',   label: 'Other' },
]

const MATCHES: BreedingMatch[] = [
  {
    id: 'm1', name: 'Bella', breed: 'Golden Retriever', type: 'dogs',
    age: '2 years', location: 'Sacramento, CA', distance: '3.2 km',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#5C9E78,#2a6b4a)',
    rating: 4.9, reviewCount: 87, about: 'Champion-bloodline Golden Retriever with excellent temperament and health clearances. OFA hips/elbows certified, cardiac clear.',
    healthTests: ['OFA Hips', 'OFA Elbows', 'Cardiac', 'Eye CERF', 'DNA profile'],
    certifications: ['AKC Registered', 'Champion Sire', 'Health Tested', 'Temperament Tested'],
    verified: true, matchScore: 95, available: true, price: '$3,500', litters: 2,
  },
  {
    id: 'm2', name: 'Simba', breed: 'Maine Coon', type: 'cats',
    age: '3 years', location: 'Davis, CA', distance: '12.8 km',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)',
    rating: 4.8, reviewCount: 64, about: 'Magnificent Maine Coon with pedigree lineage tracing back 5 generations. HCM screened, negative for PKD and SMA.',
    healthTests: ['HCM DNA test', 'PKD negative', 'SMA negative', 'Blood type A', 'FIV/FeLV negative'],
    certifications: ['TICA Registered', 'CFA Registered', 'Health Guarantee', 'Pedigree Available'],
    verified: true, matchScore: 88, available: true, price: '$2,800', litters: 1,
  },
  {
    id: 'm3', name: 'Kiwi', breed: 'African Grey Parrot', type: 'birds',
    age: '4 years', location: 'Fair Oaks, CA', distance: '8.5 km',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)',
    rating: 4.7, reviewCount: 42, about: 'Hand-raised, DNA-sexed African Grey. Exceptional talking ability, fully weaned, and socialized. Comes with extensive health records.',
    healthTests: ['DNA sexing', 'Psittacosis negative', 'Avian polyomavirus negative', 'PBFD negative', 'Blood panel'],
    certifications: ['USDA Licensed', 'CITES Appendix II', 'Health Certificate', 'Microchipped'],
    verified: true, matchScore: 82, available: false, price: '$4,200', litters: 1,
  },
  {
    id: 'm4', name: 'Snowflake', breed: 'Holland Lop', type: 'rabbits',
    age: '1 year', location: 'Elk Grove, CA', distance: '6.1 km',
    image: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#9e7a5c,#6e5238)',
    rating: 4.6, reviewCount: 38, about: 'Beautiful Holland Lop from show-winning line. Excellent conformation, friendly disposition, and raised with daily handling.',
    healthTests: ['Vet health check', 'EC titer test', 'Dental evaluation', 'Vaccinated'],
    certifications: ['ARBA Registered', 'Show Quality', 'Health Guarantee'],
    verified: true, matchScore: 85, available: true, price: '$450', litters: 2,
  },
  {
    id: 'm5', name: 'Maximus', breed: 'German Shepherd', type: 'dogs',
    age: '2 years', location: 'Roseville, CA', distance: '15.4 km',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)',
    rating: 4.9, reviewCount: 112, about: 'Working-line German Shepherd from import bloodlines. Schutzhund titled, OFA excellent, exceptional drive and temperament.',
    healthTests: ['OFA Hips (Excellent)', 'OFA Elbows', 'Degenerative Myelopathy DNA', 'Cardiac', 'Thyroid'],
    certifications: ['AKC Registered', 'Schutzhund BH', 'Health Tested', 'Imported Bloodline'],
    verified: true, matchScore: 91, available: true, price: '$4,500', litters: 1,
  },
  {
    id: 'm6', name: 'Luna', breed: 'Birman', type: 'cats',
    age: '2.5 years', location: 'Folsom, CA', distance: '10.2 km',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    rating: 4.7, reviewCount: 55, about: 'Stunning Birman with deep blue eyes and silky coat. HCM clear, excellent pedigree, raised in a loving home environment.',
    healthTests: ['HCM DNA test', 'PKD negative', 'FIV/FeLV negative', 'Blood type B'],
    certifications: ['TICA Registered', 'CFA Registered', 'Pedigree 5 gen'],
    verified: false, matchScore: 76, available: true, price: '$2,200', litters: 1,
  },
  {
    id: 'm7', name: 'Coco', breed: 'Cockatiel', type: 'birds',
    age: '6 months', location: 'Sacramento, CA', distance: '4.0 km',
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#a05c2a,#7a3e18)',
    rating: 4.5, reviewCount: 29, about: 'Hand-fed baby Cockatiel, pearl mutation. Tame, friendly, and already starting to whistle. DNA sexed — male.',
    healthTests: ['DNA sexing', 'Wellness check', 'Fecal exam'],
    certifications: ['Health Certificate', 'Hand-fed', 'Socialized'],
    verified: false, matchScore: 73, available: true, price: '$250', litters: 0,
  },
  {
    id: 'm8', name: 'Oreo', breed: 'Flemish Giant', type: 'rabbits',
    age: '8 months', location: 'Citrus Heights, CA', distance: '9.7 km',
    image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg,#5a4a3a,#8a6a4a)',
    rating: 4.4, reviewCount: 22, about: 'Gentle giant Flemish Giant buck from champion lines. Excellent size and temperament, perfect for breeding or show.',
    healthTests: ['Vet health check', 'EC titer', 'Vaccinated (RHDV2)'],
    certifications: ['ARBA Registered', 'Show Quality'],
    verified: false, matchScore: 68, available: true, price: '$350', litters: 0,
  },
]

function MatchScoreBadge({ score }: { score: number }): React.JSX.Element {
  const color = score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-primary' : score >= 70 ? 'bg-secondary' : 'bg-outline-variant'
  return (
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-label-sm font-bold shadow-sm`}>
      {score}%
    </div>
  )
}

export default function BreedingMatchPage(): React.JSX.Element {
  const [activeBreed, setActiveBreed] = useState<BreedType>('all')
  const [search, setSearch] = useState('')
  const [showAvailable, setShowAvailable] = useState(false)
  const [showVerified, setShowVerified] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<BreedingMatch | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['m1', 'm5']))
  const [minScore, setMinScore] = useState(0)

  function toggleFavorite(id: string): void {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = MATCHES.filter((m) => {
    if (search && !m.breed.toLowerCase().includes(search.toLowerCase()) && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.location.toLowerCase().includes(search.toLowerCase())) return false
    if (activeBreed !== 'all' && m.type !== activeBreed) return false
    if (showAvailable && !m.available) return false
    if (showVerified && !m.verified) return false
    if (minScore > 0 && m.matchScore < minScore) return false
    return true
  }).sort((a, b) => b.matchScore - a.matchScore)

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6 space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-headline-md font-bold text-on-surface">Breeding Match</h1>
                <p className="text-label-sm text-outline">Find health-tested breeding partners for your pets</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                  showFilters
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by breed, name, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Breed type chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {BREED_TYPES.map((b) => {
                const isActive = activeBreed === b.id
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBreed(b.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {b.label}
                  </button>
                )
              })}
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-outline mb-2">Minimum Match Score</p>
                  <div className="flex gap-2">
                    {[0, 70, 80, 90].map((s) => (
                      <button
                        key={s}
                        onClick={() => setMinScore(s)}
                        className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer ${
                          minScore === s
                            ? 'bg-primary text-white'
                            : 'border border-outline-variant text-on-surface-variant hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {s === 0 ? 'Any' : `${s}%+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      role="switch"
                      aria-checked={showAvailable}
                      onClick={() => setShowAvailable(!showAvailable)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${showAvailable ? 'bg-primary' : 'bg-outline-variant'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-label-sm text-on-surface font-semibold">Available only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      role="switch"
                      aria-checked={showVerified}
                      onClick={() => setShowVerified(!showVerified)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${showVerified ? 'bg-primary' : 'bg-outline-variant'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-label-sm text-on-surface font-semibold">Verified breeders</span>
                  </label>
                </div>
              </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Dna className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No matches found</h3>
                <p className="text-label-sm text-outline mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={() => { setSearch(''); setActiveBreed('all'); setShowAvailable(false); setShowVerified(false); setMinScore(0) }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((match) => (
                  <article
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex p-4 gap-4">
                      {/* Avatar with gradient */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-outline-variant/20"
                          style={{ background: match.gradient }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={match.image}
                            alt={match.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {match.available && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">{match.name}</h3>
                              {match.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                              {!match.available && (
                                <span className="text-[9px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md font-semibold">Reserved</span>
                              )}
                            </div>
                            <p className="text-label-sm text-on-surface-variant">{match.breed}</p>
                          </div>
                          <MatchScoreBadge score={match.matchScore} />
                        </div>

                        {/* Location + age */}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-outline">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {match.distance}
                          </span>
                          <span className="text-outline/40">·</span>
                          <span className="flex items-center gap-1">
                            <PawPrint className="w-3.5 h-3.5" />
                            {match.age}
                          </span>
                          <span className="text-outline/40">·</span>
                          <span className="font-semibold text-primary">{match.price}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.round(match.rating) ? 'text-amber-400 fill-amber-400' : 'text-outline/20'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-outline">{match.rating} ({match.reviewCount} reviews)</span>
                        </div>

                        {/* Health tests */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {match.healthTests.slice(0, 3).map((test) => (
                            <span key={test} className="flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[9px] font-medium">
                              <Syringe className="w-2.5 h-2.5" />
                              {test}
                            </span>
                          ))}
                          {match.healthTests.length > 3 && (
                            <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-[9px] font-medium">
                              +{match.healthTests.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {match.certifications.slice(0, 2).map((cert) => (
                            <span key={cert} className="flex items-center gap-0.5 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[9px] font-medium">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {cert}
                            </span>
                          ))}
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10">
                          <div className="flex items-center gap-1.5 text-[10px] text-outline">
                            <Users className="w-3 h-3" />
                            {match.litters} {match.litters === 1 ? 'litter' : 'litters'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation() }}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                            >
                              Connect
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(match.id) }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                favorites.has(match.id) ? 'text-primary bg-primary/10' : 'text-outline hover:text-primary hover:bg-surface-container'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favorites.has(match.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="breeding-match" />

      {/* Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedMatch(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Hero */}
            <div className="relative h-48 overflow-hidden" style={{ background: selectedMatch.gradient }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h2 className="text-headline-md font-bold text-white">{selectedMatch.name}</h2>
                  <p className="text-label-sm text-white/80">{selectedMatch.breed} · {selectedMatch.age}</p>
                </div>
                <MatchScoreBadge score={selectedMatch.matchScore} />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-label-sm font-semibold text-on-surface">{selectedMatch.distance}</p>
                  <p className="text-[9px] text-outline">Distance</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <PawPrint className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <p className="text-label-sm font-semibold text-on-surface">{selectedMatch.age}</p>
                  <p className="text-[9px] text-outline">Age</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <Dna className="w-4 h-4 text-tertiary mx-auto mb-1" />
                  <p className="text-label-sm font-semibold text-on-surface">{selectedMatch.price}</p>
                  <p className="text-[9px] text-outline">Price</p>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">About</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{selectedMatch.about}</p>
              </div>

              {/* Health Tests */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <Syringe className="w-4 h-4 text-green-600" />
                  Health Testing
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.healthTests.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-label-sm font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.certifications.map((c) => (
                    <span key={c} className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-label-sm font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-label-sm font-semibold text-on-surface">{selectedMatch.litters} {selectedMatch.litters === 1 ? 'litter' : 'litters'}</p>
                    <p className="text-[10px] text-outline">Total litters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container">
                  <Star className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-label-sm font-semibold text-on-surface">{selectedMatch.rating}</p>
                    <p className="text-[10px] text-outline">{selectedMatch.reviewCount} reviews</p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className={`rounded-xl p-3 ${selectedMatch.available ? 'bg-green-50 border border-green-200' : 'bg-surface-container border border-outline-variant/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedMatch.available
                      ? <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-label-sm font-semibold text-green-700">Available for matching</span></>
                      : <><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-label-sm font-semibold text-amber-700">Currently reserved</span></>
                    }
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97] cursor-pointer"
                >
                  <Heart className="w-5 h-5" />
                  Connect with Breeder
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedMatch.id) }}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    favorites.has(selectedMatch.id)
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'border-outline-variant text-outline hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.has(selectedMatch.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
