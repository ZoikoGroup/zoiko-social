'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Plus, PawPrint, Dog, Cat, Bird, Rabbit, Fish, ChevronDown, Heart, Send, X, CheckCircle2, ShieldCheck, Syringe, Users, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'

interface PetListing {
  id: string
  name: string
  breed: string
  type: string
  age: string
  gender: string
  location: string
  distance: string
  images: string[]
  gradient: string
  addedAt: string
  vaccinated: boolean
  sterilized: boolean
  friendlyWithChildren: boolean
  friendlyWithPets: boolean
}

const LISTINGS: PetListing[] = [
  {
    id: 'p1', name: 'Cleo', breed: 'Domestic Shorthair', type: 'Cat', age: '2 yrs', gender: 'Female',
    location: 'San Francisco, CA', distance: '1.2 km', addedAt: '2 days ago',
    images: [
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    vaccinated: true, sterilized: true, friendlyWithChildren: true, friendlyWithPets: true,
  },
  {
    id: 'p2', name: 'Bruno', breed: 'German Shepherd', type: 'Dog', age: '3 yrs', gender: 'Male',
    location: 'Berkeley, CA', distance: '3.4 km', addedAt: '5 days ago',
    images: [
      'https://images.unsplash.com/photo-1553882809-a4f35714b272?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)',
    vaccinated: true, sterilized: false, friendlyWithChildren: true, friendlyWithPets: false,
  },
  {
    id: 'p3', name: 'Mochi', breed: 'Ragdoll', type: 'Cat', age: '1.5 yrs', gender: 'Female',
    location: 'Oakland, CA', distance: '5.1 km', addedAt: '1 week ago',
    images: [
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)',
    vaccinated: true, sterilized: true, friendlyWithChildren: true, friendlyWithPets: true,
  },
  {
    id: 'p4', name: 'Kiwi', breed: 'Alexandrine Parakeet', type: 'Bird', age: '4 yrs', gender: 'Male',
    location: 'San Jose, CA', distance: '8.2 km', addedAt: '3 days ago',
    images: [
      'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593181629936-11c0b2c57e1f?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)',
    vaccinated: false, sterilized: false, friendlyWithChildren: true, friendlyWithPets: true,
  },
  {
    id: 'p5', name: 'Snowball', breed: 'Dutch Rabbit', type: 'Rabbit', age: '1 yr', gender: 'Female',
    location: 'Palo Alto, CA', distance: '2.8 km', addedAt: '1 day ago',
    images: [
      'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#9e7a5c,#6e5238)',
    vaccinated: true, sterilized: false, friendlyWithChildren: true, friendlyWithPets: true,
  },
  {
    id: 'p6', name: 'Max', breed: 'Golden Retriever', type: 'Dog', age: '2 yrs', gender: 'Male',
    location: 'San Francisco, CA', distance: '0.8 km', addedAt: 'Just now',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    ],
    gradient: 'linear-gradient(135deg,#5C9E78,#2a6b4a)',
    vaccinated: true, sterilized: true, friendlyWithChildren: true, friendlyWithPets: true,
  },
]

const PET_TYPES = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other']
const TYPE_ICONS: Record<string, typeof Dog> = { Dog, Cat, Bird, Rabbit, Fish }

function PetTypeIcon({ type }: { type: string }): React.JSX.Element {
  const Icon = TYPE_ICONS[type] ?? PawPrint
  return <Icon className="w-3.5 h-3.5" />
}

function highResImage(url: string): string {
  return url.replace(/w=\d+&h=\d+/, 'w=800&h=600')
}

export default function AdoptionListingPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [inquiryPet, setInquiryPet] = useState<PetListing | null>(null)
  const [inquirySent, setInquirySent] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' })
  const [detailPet, setDetailPet] = useState<PetListing | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  const filtered = LISTINGS.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All' || pet.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column: Sidebar */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center Column: Listing Content */}
          <div className="lg:col-span-6 space-y-4 pb-20">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-headline-md font-bold text-on-surface">Adoption &amp; Rescue</h1>
                <p className="text-label-sm text-outline">Find your new best friend</p>
              </div>
              <Link
                href="/adoption/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add a Pet</span>
              </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, breed, or location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/50"
                    aria-label="Search pets"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-label-md font-semibold transition-all duration-200 cursor-pointer ${
                    showFilters
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant/50 hover:bg-surface-container'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable Pet Type Filters */}
              <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                <div className="flex flex-wrap gap-2">
                  {PET_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-all duration-200 cursor-pointer ${
                        selectedType === type
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {type !== 'All' && <PetTypeIcon type={type} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-label-sm text-outline">
              {filtered.length} {filtered.length === 1 ? 'pet' : 'pets'} available for adoption
            </p>

            {/* Pet Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((pet) => (
                  <article
                    key={pet.id}
                    onClick={() => { setDetailPet(pet); setCurrentImage(0) }}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-surface-container-low">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Type badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-on-surface shadow-sm">
                        <PetTypeIcon type={pet.type} />
                        {pet.type}
                      </div>
                      {/* Gender badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold shadow-sm">
                        {pet.gender === 'Female' ? '♀' : '♂'} {pet.gender}
                      </div>
                      {/* Time label */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-[10px] text-white">
                        {pet.addedAt}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-label-md font-bold text-on-surface">{pet.name}</h3>
                        <span className="text-label-sm font-semibold text-primary">{pet.age}</span>
                      </div>
                      <p className="text-label-sm text-on-surface-variant mb-3">{pet.breed}</p>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-label-sm text-outline mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{pet.location}</span>
                        <span className="text-outline/60">· {pet.distance}</span>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {pet.vaccinated && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                            Vaccinated
                          </span>
                        )}
                        {pet.sterilized && (
                          <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-semibold rounded-full">
                            Sterilized
                          </span>
                        )}
                        {pet.friendlyWithChildren && (
                          <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-semibold rounded-full">
                            Kid-friendly
                          </span>
                        )}
                        {pet.friendlyWithPets && (
                          <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed-variant text-[10px] font-semibold rounded-full">
                            Pet-friendly
                          </span>
                        )}
                      </div>

                      {/* Adopt Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setInquiryPet(pet); setInquirySent(false); setInquiryForm({ name: '', email: '', message: '' }) }}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-label-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/20 active:scale-[0.97] cursor-pointer"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Adopt Me</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No pets found</h3>
                <p className="text-label-sm text-outline mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedType('All') }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border border-outline-variant/20 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-headline-md font-bold text-on-surface mb-1">Have a pet to rehome?</h2>
              <p className="text-body-md text-on-surface-variant mb-4 max-w-md mx-auto">
                List your pet for adoption or report an animal that needs rescue.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/adoption/new"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97]"
                >
                  <Plus className="w-4 h-4" />
                  List a Pet for Adoption
                </Link>
                <Link
                  href="/adoption/new?tab=rescue"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-label-md font-semibold hover:bg-secondary/90 transition-all duration-200 shadow-md shadow-secondary/20 active:scale-[0.97]"
                >
                  Report Animal for Rescue
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {/* Pet Detail Modal */}
      {detailPet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setDetailPet(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setDetailPet(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Gallery */}
            <div className="relative bg-surface-container-low">
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={highResImage(detailPet.images[currentImage]!)}
                  alt={`${detailPet.name} photo ${currentImage + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />

                {/* Nav Arrows */}
                {detailPet.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => prev > 0 ? prev - 1 : detailPet.images.length - 1) }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => prev < detailPet.images.length - 1 ? prev + 1 : 0) }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {detailPet.images.length > 1 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[11px] text-white font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" />
                    {currentImage + 1}/{detailPet.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {detailPet.images.length > 1 && (
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
                  {detailPet.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(idx) }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        idx === currentImage ? 'border-primary ring-1 ring-primary/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${detailPet.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Gradient overlay for text */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-headline-md font-bold text-white mb-1">{detailPet.name}</h2>
                <div className="flex items-center gap-3 text-white/80 text-label-sm">
                  <span className="flex items-center gap-1">
                    <PetTypeIcon type={detailPet.type} />
                    {detailPet.type}
                  </span>
                  <span>·</span>
                  <span>{detailPet.breed}</span>
                  <span>·</span>
                  <span>{detailPet.age}</span>
                  <span>·</span>
                  <span>{detailPet.gender}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container rounded-xl p-3 text-center">
                          <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Location</p>
                  <p className="text-label-sm font-semibold text-on-surface truncate">{detailPet.location.split(',')[0]}</p>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <Heart className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Distance</p>
                  <p className="text-label-sm font-semibold text-on-surface">{detailPet.distance}</p>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <PawPrint className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Listed</p>
                  <p className="text-label-sm font-semibold text-on-surface">{detailPet.addedAt}</p>
                </div>
              </div>

              {/* Health & Compatibility */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-3">Health &amp; Compatibility</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${detailPet.vaccinated ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-outline'}`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-on-surface">Vaccinated</p>
                      <p className="text-[10px] text-outline">{detailPet.vaccinated ? 'Up to date' : 'Not vaccinated'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${detailPet.sterilized ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-outline'}`}>
                      <Syringe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-on-surface">Sterilized</p>
                      <p className="text-[10px] text-outline">{detailPet.sterilized ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${detailPet.friendlyWithChildren ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-outline'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-on-surface">Kid-friendly</p>
                      <p className="text-[10px] text-outline">{detailPet.friendlyWithChildren ? 'Good with kids' : 'Not recommended'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${detailPet.friendlyWithPets ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-outline'}`}>
                      <PawPrint className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-label-sm font-semibold text-on-surface">Pet-friendly</p>
                      <p className="text-[10px] text-outline">{detailPet.friendlyWithPets ? 'Good with pets' : 'Prefers alone'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">Location</h3>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-label-sm text-on-surface-variant">{detailPet.location} · {detailPet.distance} away</span>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">About {detailPet.name}</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {detailPet.name} is a {detailPet.age.toLowerCase()} old {detailPet.breed} looking for a loving forever home.
                  {detailPet.vaccinated ? ' Fully vaccinated and ' : ' Not yet vaccinated, '}
                  {detailPet.sterilized ? 'already sterilized.' : 'not yet sterilized.'}
                  {' '}This {detailPet.type.toLowerCase()} would thrive in {detailPet.friendlyWithChildren ? 'a family environment' : 'an adults-only home'}
                  {detailPet.friendlyWithPets ? ' and gets along well with other animals.' : ' and would prefer to be the only pet.'}
                </p>
              </div>

              {/* Adopt Button */}
              <button
                onClick={() => { setDetailPet(null); setInquiryPet(detailPet); setInquirySent(false); setInquiryForm({ name: '', email: '', message: '' }) }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97] cursor-pointer"
              >
                <Heart className="w-5 h-5" />
                <span>Adopt {detailPet.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryPet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setInquiryPet(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-label-md font-bold text-on-surface">Adopt {inquiryPet.name}</h2>
                  <p className="text-[11px] text-outline">{inquiryPet.breed} · {inquiryPet.age}</p>
                </div>
              </div>
              <button
                onClick={() => setInquiryPet(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySent ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">Inquiry Sent!</h3>
                <p className="text-label-sm text-outline mb-5">
                  The pet owner will reach out to you at <strong>{inquiryForm.email}</strong>.
                </p>
                <button
                  onClick={() => setInquiryPet(null)}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Inquiry Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (inquiryForm.name && inquiryForm.email && inquiryForm.message) {
                    setInquirySent(true)
                  }
                }}
                className="p-5 space-y-4"
              >
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Your Name *</label>
                  <input
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/40"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/40"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Message to Owner *</label>
                  <textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={`Hi! I'm interested in adopting ${inquiryPet.name}. I'd love to learn more about their personality and arrange a meet-and-greet.`}
                    rows={4}
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.97] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
