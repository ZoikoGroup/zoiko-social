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
  Search, Users, Hash, ChevronLeft,
  Shield, FlaskConical, Leaf, MapPin, PawPrint,
  MessageSquare, Verified,
} from 'lucide-react'

type CategoryTag = 'all' | 'species' | 'rescue' | 'climate' | 'science' | 'local'

const CATEGORIES: { id: CategoryTag; label: string; Icon: typeof Users }[] = [
  { id: 'all',      label: 'All Communities',  Icon: Users },
  { id: 'species',  label: 'Species & Breeds',  Icon: PawPrint },
  { id: 'rescue',   label: 'Rescue & Welfare',  Icon: Shield },
  { id: 'climate',  label: 'Climate & Env',     Icon: Leaf },
  { id: 'science',  label: 'Science & Tech',    Icon: FlaskConical },
  { id: 'local',    label: 'Local',              Icon: MapPin },
]

interface Community {
  id: string
  name: string
  tag: string
  tagColor: string
  description: string
  memberCount: string
  postCount: string
  gradient: string
  joined: boolean
  featured: boolean
  category: CategoryTag
  type: 'public' | 'private'
  online: number
}

const COMMUNITIES: Community[] = [
  // Featured
  { id: 'c1',  name: 'Golden Retriever Owners',       tag: 'Dogs',     tagColor: 'from-emerald-500 to-teal-500', description: 'Tips, health advice and heartwarming moments for golden families worldwide.',     memberCount: '42,180', postCount: '15.2k', gradient: 'linear-gradient(135deg,#1e5c48,#3d9a78)', joined: false, featured: true,  category: 'species', type: 'public',  online: 342 },
  { id: 'c2',  name: 'Street Cat Rescue Network',     tag: 'Rescue',   tagColor: 'from-orange-500 to-red-500',   description: 'Coordinating TNR programmes, foster homes and adoption drives globally.',        memberCount: '18,934', postCount: '8.7k',  gradient: 'linear-gradient(135deg,#8C3D2A,#c4622a)', joined: true,  featured: true,  category: 'rescue',  type: 'public',  online: 187 },
  { id: 'c3',  name: 'Marine Life Guardians',          tag: 'Wildlife', tagColor: 'from-cyan-500 to-blue-500',    description: 'Ocean health, coral reef monitoring, marine mammal conservation and citizen science.', memberCount: '29,441', postCount: '12.1k', gradient: 'linear-gradient(135deg,#2a4858,#5a9aa8)', joined: true,  featured: true,  category: 'climate', type: 'public',  online: 98 },
  // Species
  { id: 'c4',  name: 'Parrot Enrichment Guild',        tag: 'Parrots',  tagColor: 'from-purple-500 to-violet-500', description: 'Foraging toys, training science, nutrition and sanctuary partnerships.',          memberCount: '8,820',  postCount: '3.4k',  gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)', joined: false, featured: false, category: 'species', type: 'public',  online: 56 },
  { id: 'c5',  name: 'Cat Lovers International',       tag: 'Cats',     tagColor: 'from-pink-500 to-rose-500',    description: 'Everything feline: health, behaviour, nutrition, and adorable photos.',            memberCount: '56,210', postCount: '22.8k', gradient: 'linear-gradient(135deg,#a05c6a,#7a3a4a)', joined: false, featured: false, category: 'species', type: 'public',  online: 521 },
  { id: 'c6',  name: 'Reptile & Amphibian Keepers',    tag: 'Exotic',   tagColor: 'from-lime-500 to-green-500',   description: 'Responsible reptile keeping, bioactive enclosures, and species-specific care guides.', memberCount: '5,430', postCount: '2.1k',  gradient: 'linear-gradient(135deg,#3a6a2a,#5a9a3a)', joined: false, featured: false, category: 'species', type: 'private', online: 34 },
  // Rescue
  { id: 'c7',  name: 'Wildlife Rehab Network',         tag: 'Rescue',   tagColor: 'from-orange-500 to-red-500',   description: 'Supporting wildlife rehabilitators with resources, training, and emergency coordination.', memberCount: '12,678', postCount: '5.9k',  gradient: 'linear-gradient(135deg,#7a4a2a,#b86a3a)', joined: false, featured: false, category: 'rescue',  type: 'public',  online: 143 },
  { id: 'c8',  name: 'No-Kill Shelter Alliance',       tag: 'Welfare',  tagColor: 'from-teal-500 to-emerald-500', description: 'Advocating for no-kill policies and supporting shelters in the transition.',         memberCount: '9,340',  postCount: '4.2k',  gradient: 'linear-gradient(135deg,#1a5c4a,#2a8a6a)', joined: false, featured: false, category: 'rescue',  type: 'public',  online: 67 },
  // Climate
  { id: 'c9',  name: 'Urban Wildlife Corridors',       tag: 'Climate',  tagColor: 'from-emerald-500 to-teal-500',  description: 'Creating green passages in cities for hedgehogs, foxes, pollinators and birds.',    memberCount: '11,257', postCount: '4.8k',  gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)', joined: false, featured: false, category: 'climate', type: 'public',  online: 89 },
  { id: 'c10', name: 'Ocean Plastic Watch',            tag: 'Climate',  tagColor: 'from-blue-500 to-cyan-500',    description: 'Tracking plastic pollution, beach cleanups, and advocating for policy change.',      memberCount: '22,340', postCount: '9.1k',  gradient: 'linear-gradient(135deg,#1a3a5a,#2a6a8a)', joined: false, featured: false, category: 'climate', type: 'public',  online: 112 },
  // Science
  { id: 'c11', name: 'Animal Cognition Research',      tag: 'Science',  tagColor: 'from-yellow-500 to-amber-500', description: 'Sharing peer-reviewed studies on animal intelligence, emotion and social behaviour.', memberCount: '6,103',  postCount: '2.7k',  gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)', joined: true,  featured: false, category: 'science', type: 'public',  online: 41 },
  { id: 'c12', name: 'Veterinary Science Network',     tag: 'Science',  tagColor: 'from-indigo-500 to-blue-500',  description: 'For vets, researchers and students to share clinical insights and research.',         memberCount: '15,890', postCount: '6.3k',  gradient: 'linear-gradient(135deg,#3a4a6a,#2a6a8a)', joined: false, featured: false, category: 'science', type: 'private', online: 203 },
  // Local
  { id: 'c13', name: 'Sacramento Dog Owners',          tag: 'Local',    tagColor: 'from-red-500 to-pink-500',     description: 'Local meetups, vet recommendations, and lost & found alerts for Sacramento.',       memberCount: '3,450',  postCount: '1.2k',  gradient: 'linear-gradient(135deg,#8a2a2a,#c44a3a)', joined: false, featured: false, category: 'local',   type: 'public',  online: 28 },
  { id: 'c14', name: 'Bay Area Bird Watchers',         tag: 'Local',    tagColor: 'from-green-500 to-emerald-500', description: 'Birding trips, species spotting, and habitat conservation in the Bay Area.',         memberCount: '2,180',  postCount: '890',   gradient: 'linear-gradient(135deg,#2a5a3a,#4a8a5a)', joined: false, featured: false, category: 'local',   type: 'public',  online: 15 },
  { id: 'c15', name: 'Portland Ferret Friends',        tag: 'Local',    tagColor: 'from-stone-500 to-zinc-500',   description: 'Ferrets of Portland — playdates, health tips, and care advice.',                     memberCount: '890',    postCount: '340',   gradient: 'linear-gradient(135deg,#5a4a3a,#8a6a4a)', joined: false, featured: false, category: 'local',   type: 'private', online: 7 },
]

export default function CommunitiesPage(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryTag>('all')
  const [search, setSearch] = useState('')
  const [communities, setCommunities] = useState(COMMUNITIES)

  function toggleJoin(id: string): void {
    setCommunities((prev) => prev.map((c) => c.id === id ? { ...c, joined: !c.joined } : c))
  }

  const filtered = communities.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== 'all' && c.category !== activeCategory) return false
    return true
  })

  const yourCommunities = filtered.filter((c) => c.joined)
  const discoverCommunities = filtered.filter((c) => !c.joined)
  const featuredCommunities = discoverCommunities.filter((c) => c.featured)

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
              <div>
                <h1 className="text-headline-md font-bold text-on-surface">Communities</h1>
                <p className="text-label-sm text-outline">
                  {communities.filter((c) => c.joined).length} joined · {communities.length} total
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    <cat.Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Results count */}
            {search && (
              <p className="text-label-sm text-outline">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            )}

            {/* Your Communities */}
            {yourCommunities.length > 0 && activeCategory === 'all' && !search && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h2 className="text-label-md font-bold text-on-surface">Your Communities</h2>
                  <span className="text-label-sm text-outline">({yourCommunities.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {yourCommunities.map((c) => (
                    <CommunityCard key={c.id} community={c} onToggleJoin={toggleJoin} />
                  ))}
                </div>
              </section>
            )}

            {/* Featured Communities */}
            {featuredCommunities.length > 0 && activeCategory === 'all' && !search && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Verified className="w-4 h-4 text-secondary" />
                  <h2 className="text-label-md font-bold text-on-surface">Featured Communities</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredCommunities.map((c) => (
                    <CommunityCard key={c.id} community={c} onToggleJoin={toggleJoin} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Discover */}
            <section>
              {!search && (yourCommunities.length > 0 || featuredCommunities.length > 0) && activeCategory === 'all' && (
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-outline" />
                  <h2 className="text-label-md font-bold text-on-surface">Discover More</h2>
                </div>
              )}
              {discoverCommunities.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-outline" />
                  </div>
                  <h3 className="text-label-md font-bold text-on-surface mb-1">No communities found</h3>
                  <p className="text-label-sm text-outline mb-4">Try a different category or search term</p>
                  <button
                    onClick={() => { setSearch(''); setActiveCategory('all') }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {discoverCommunities.map((c) => (
                    <CommunityCard key={c.id} community={c} onToggleJoin={toggleJoin} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="communities" />
    </>
  )
}

// ── Community Card Sub-component ────────────────────────────

function CommunityCard({ community, onToggleJoin, featured }: {
  community: Community
  onToggleJoin: (id: string) => void
  featured?: boolean
}): React.JSX.Element {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 ${
        featured ? 'border-secondary/30 shadow-sm shadow-secondary/5' : 'border-outline-variant/30 hover:shadow-md'
      }`}
    >
      {/* Cover */}
      <div
        className="h-20 flex items-end p-3 relative"
        style={{ background: community.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`relative z-10 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white border border-white/10 bg-gradient-to-r ${community.tagColor}`}>
          {community.tag}
        </span>
        {community.type === 'private' && (
          <span className="relative z-10 ml-2 text-[9px] text-white/70 bg-white/10 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            Private
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="text-label-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{community.name}</h3>
        <p className="text-[11px] text-outline leading-relaxed mb-3 line-clamp-2">{community.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-[10px] text-outline">
            <Users className="w-3 h-3" />
            {community.memberCount}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-outline">
            <MessageSquare className="w-3 h-3" />
            {community.postCount} posts
          </span>
          <span className="flex items-center gap-1 text-[10px] text-green-600 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {community.online} online
          </span>
        </div>

        {/* Join/Joined Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleJoin(community.id) }}
          className={`w-full h-8 rounded-lg text-label-sm font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer ${
            community.joined
              ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
              : 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20'
          }`}
        >
          {community.joined ? 'Joined ✓' : 'Join Community'}
        </button>
      </div>
    </div>
  )
}
