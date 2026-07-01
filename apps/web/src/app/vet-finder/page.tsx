'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  ChevronLeft, Search, Star, MapPin, Clock,
  BadgeCheck, Phone, Calendar,
  Filter, Stethoscope,
  AlertCircle, Ambulance,
} from 'lucide-react'

type SpeciesType = 'all' | 'dogs' | 'cats' | 'birds' | 'exotic' | 'reptiles' | 'small-mammals'

interface VetClinic {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  reviewCount: number
  phone: string
  hours: string
  isOpenNow: boolean
  isEmergency: boolean
  species: SpeciesType[]
  services: string[]
  verified: boolean
  image: string
  about: string
  acceptsInsurance: boolean
  waitTime: string
}

const SPECIES_FILTERS: { id: SpeciesType; label: string }[] = [
  { id: 'all',            label: 'All Species' },
  { id: 'dogs',           label: 'Dogs' },
  { id: 'cats',           label: 'Cats' },
  { id: 'birds',          label: 'Birds' },
  { id: 'exotic',         label: 'Exotic' },
  { id: 'reptiles',       label: 'Reptiles' },
  { id: 'small-mammals',  label: 'Small Mammals' },
]

const VET_CLINICS: VetClinic[] = [
  {
    id: 'v1', name: 'Paw Care Veterinary Clinic', address: '1242 Main St, Sacramento, CA',
    distance: '1.2 km', rating: 4.9, reviewCount: 312, phone: '(916) 555-0142',
    hours: 'Mon–Fri 8AM–6PM · Sat 9AM–3PM', isOpenNow: true, isEmergency: false,
    species: ['dogs', 'cats', 'small-mammals'], services: ['Wellness exams', 'Vaccinations', 'Dental care', 'Surgery', 'Microchipping'],
    verified: true, image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
    about: 'Full-service veterinary clinic with state-of-the-art diagnostic equipment. Compassionate care for dogs, cats, and small mammals.',
    acceptsInsurance: true, waitTime: '10–20 min',
  },
  {
    id: 'v2', name: 'Animal Emergency Center', address: '2800 L St, Sacramento, CA',
    distance: '2.8 km', rating: 4.7, reviewCount: 189, phone: '(916) 555-0199',
    hours: '24/7 · 365 days', isOpenNow: true, isEmergency: true,
    species: ['dogs', 'cats', 'birds', 'exotic', 'reptiles', 'small-mammals'],
    services: ['Emergency surgery', 'ICU', 'Toxicology', 'Trauma care', 'Critical care'],
    verified: true, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    about: 'Level 1 veterinary trauma center open 24/7. Board-certified emergency and critical care specialists on-site at all times.',
    acceptsInsurance: true, waitTime: '0–15 min',
  },
  {
    id: 'v3', name: 'Exotic Pet Care Center', address: '3501 Cowell Blvd, Davis, CA',
    distance: '12.5 km', rating: 4.8, reviewCount: 167, phone: '(530) 555-0234',
    hours: 'Tue–Sat 9AM–5PM', isOpenNow: true, isEmergency: false,
    species: ['birds', 'exotic', 'reptiles', 'small-mammals'],
    services: ['Avian medicine', 'Reptile care', 'Small mammal surgery', 'Diagnostic imaging', 'Nutrition counseling'],
    verified: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    about: 'Specialty clinic dedicated to exotic animal medicine. Board-certified exotic animal veterinarians with advanced diagnostic capabilities.',
    acceptsInsurance: false, waitTime: '15–30 min',
  },
  {
    id: 'v4', name: 'Midtown Animal Hospital', address: '1500 J St, Sacramento, CA',
    distance: '0.5 km', rating: 4.6, reviewCount: 245, phone: '(916) 555-0100',
    hours: 'Mon–Fri 7AM–8PM · Sat 8AM–5PM', isOpenNow: true, isEmergency: false,
    species: ['dogs', 'cats'], services: ['Preventive care', 'Dentistry', 'Orthopedics', 'Ultrasound', 'Boarding'],
    verified: true, image: 'https://images.unsplash.com/photo-1603398749947-87246022fbf9?w=600&h=400&fit=crop',
    about: 'Family-owned animal hospital serving Midtown for over 30 years. Comprehensive medical and surgical care in a warm, welcoming environment.',
    acceptsInsurance: true, waitTime: '20–40 min',
  },
  {
    id: 'v5', name: 'VCA Sacramento Veterinary Referral Center', address: '2108 N St, Sacramento, CA',
    distance: '3.5 km', rating: 4.5, reviewCount: 198, phone: '(916) 555-0176',
    hours: 'Mon–Fri 8AM–8PM · Sat 9AM–5PM', isOpenNow: false, isEmergency: false,
    species: ['dogs', 'cats', 'exotic'], services: ['Oncology', 'Neurology', 'Cardiology', 'Internal medicine', 'Rehabilitation'],
    verified: true, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=400&fit=crop',
    about: 'Advanced specialty and referral center with board-certified specialists in oncology, neurology, cardiology, and more.',
    acceptsInsurance: true, waitTime: '30–60 min',
  },
  {
    id: 'v6', name: 'Affordable Pet Care Clinic', address: '5600 Stockton Blvd, Sacramento, CA',
    distance: '5.2 km', rating: 4.3, reviewCount: 87, phone: '(916) 555-0321',
    hours: 'Mon–Wed 9AM–5PM · Thu–Fri 9AM–7PM', isOpenNow: true, isEmergency: false,
    species: ['dogs', 'cats'], services: ['Vaccinations', 'Spay/neuter', 'Wellness exams', 'Microchipping'],
    verified: false, image: 'https://images.unsplash.com/photo-1586754117651-7828f385da48?w=600&h=400&fit=crop',
    about: 'Low-cost veterinary care for the Sacramento community. Vaccination clinics, spay/neuter services, and basic wellness care.',
    acceptsInsurance: false, waitTime: '20–40 min',
  },
]

function StarRating({ rating }: { rating: number }): React.JSX.Element {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-outline/20'}`} />
      ))}
    </span>
  )
}

export default function VetFinderPage(): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [activeSpecies, setActiveSpecies] = useState<SpeciesType>('all')
  const [showOpenNow, setShowOpenNow] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVet, setSelectedVet] = useState<VetClinic | null>(null)

  const filtered = VET_CLINICS.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.address.toLowerCase().includes(search.toLowerCase())) return false
    if (activeSpecies !== 'all' && !v.species.includes(activeSpecies)) return false
    if (showOpenNow && !v.isOpenNow) return false
    if (showEmergency && !v.isEmergency) return false
    return true
  })

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
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
                <h1 className="text-headline-md font-bold text-on-surface">Vet Finder</h1>
                <p className="text-label-sm text-outline">Find the best veterinary care for your pets</p>
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
                placeholder="Search by clinic name or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Species filter chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {SPECIES_FILTERS.map((s) => {
                const isActive = activeSpecies === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSpecies(s.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>

            {/* Quick filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowOpenNow(!showOpenNow)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                  showOpenNow
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-green-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                Open Now
              </button>
              <button
                onClick={() => setShowEmergency(!showEmergency)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                  showEmergency
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-red-300'
                }`}
              >
                <Ambulance className="w-4 h-4" />
                24/7 Emergency
              </button>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No clinics found</h3>
                <p className="text-label-sm text-outline mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={() => { setSearch(''); setActiveSpecies('all'); setShowOpenNow(false); setShowEmergency(false) }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((vet) => (
                  <article
                    key={vet.id}
                    onClick={() => setSelectedVet(vet)}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vet.image}
                          alt={vet.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {vet.isEmergency && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <Ambulance className="w-3 h-3" />
                            24/7
                          </div>
                        )}
                        {vet.isOpenNow && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Open
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">{vet.name}</h3>
                              {vet.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-0.5">{vet.address}</p>
                          </div>
                          <div className="flex items-center gap-1 text-label-sm font-semibold text-outline flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                            {vet.distance}
                          </div>
                        </div>

                        {/* Rating + Reviews */}
                        <div className="flex items-center gap-2 mt-2">
                          <StarRating rating={vet.rating} />
                          <span className="text-label-sm font-semibold text-on-surface-variant">{vet.rating}</span>
                          <span className="text-[10px] text-outline">({vet.reviewCount})</span>
                          <span className="text-outline/40">·</span>
                          <span className="text-[10px] text-outline">{vet.waitTime} wait</span>
                        </div>

                        {/* Hours */}
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-outline">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{vet.hours}</span>
                        </div>

                        {/* Species badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {vet.species.map((s) => {
                            const label = SPECIES_FILTERS.find((f) => f.id === s)?.label ?? s
                            return (
                              <span key={s} className="px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-medium">
                                {label}
                              </span>
                            )
                          })}
                          {vet.acceptsInsurance && (
                            <span className="px-2 py-0.5 bg-secondary/5 text-secondary rounded-full text-[10px] font-medium">
                              Insurance accepted
                            </span>
                          )}
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10">
                          <div className="flex items-center gap-1.5 text-[10px] text-outline">
                            <Phone className="w-3 h-3" />
                            {vet.phone}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation() }}
                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                          >
                            Book Visit
                          </button>
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

      <MobileTabs currentPage="vet-finder" />

      {/* Vet Detail Modal */}
      {selectedVet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedVet(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVet(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Hero */}
            <div className="relative h-40 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedVet.image} alt={selectedVet.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-label-md font-bold text-white">{selectedVet.name}</h2>
                  {selectedVet.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[11px] text-white/70">{selectedVet.address}</p>
              </div>
              {selectedVet.isEmergency && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  24/7 Emergency
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Quick info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-label-md font-bold text-on-surface">{selectedVet.rating}</p>
                  <p className="text-[9px] text-outline">{selectedVet.reviewCount} reviews</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-label-md font-bold text-on-surface">{selectedVet.distance}</p>
                  <p className="text-[9px] text-outline">Distance</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-container">
                  <Clock className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <p className="text-label-md font-bold text-on-surface">{selectedVet.waitTime}</p>
                  <p className="text-[9px] text-outline">Wait time</p>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">About</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{selectedVet.about}</p>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVet.services.map((s) => (
                    <span key={s} className="px-3 py-1 bg-surface-container rounded-lg text-label-sm text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="bg-surface-container rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-label-sm font-semibold text-on-surface">Hours</span>
                  </div>
                  <span className={`text-[11px] font-semibold ${selectedVet.isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedVet.isOpenNow ? 'Open now' : 'Closed'}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">{selectedVet.hours}</p>
              </div>

              {/* Contact */}
              <div className="bg-surface-container rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-label-sm font-semibold text-on-surface">{selectedVet.phone}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {selectedVet.acceptsInsurance ? '✅ Most major insurance plans accepted' : '❌ Does not accept insurance'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedVet(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97] cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </button>
                <button className="p-3 rounded-xl border border-outline-variant text-outline hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
