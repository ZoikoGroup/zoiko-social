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
  ChevronLeft, Heart, MessageSquare, Share2,
  Camera, Calendar, MapPin, Award, Plus,
  MoreHorizontal,
} from 'lucide-react'

interface DiaryEntry {
  id: string
  type: 'photo' | 'milestone' | 'note' | 'checkup'
  petName: string
  petAvatar: string
  petGradient: string
  image?: string
  content: string
  date: string
  time: string
  location?: string
  likes: number
  comments: number
  liked: boolean
  tags: string[]
}

const ENTRIES: DiaryEntry[] = [
  {
    id: 'e1', type: 'photo', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    image: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?w=600&h=600&fit=crop',
    content: 'Cleo discovered the sunbeam spot in the living room. She spent 3 hours here and I got zero work done. Worth it. ☀️🐱',
    date: 'Today', time: '2 hours ago', location: 'Living Room, Sacramento',
    likes: 42, comments: 8, liked: true, tags: ['cat', 'sunbeam', 'cute'],
  },
  {
    id: 'e2', type: 'milestone', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    content: '🎉 Cleo\'s 2nd Adoption Anniversary! Two years since she chose us at the shelter. She went from hiding under the couch to ruling the entire house. Happy gotcha day, princess!',
    date: 'Yesterday', time: '10:00 AM',
    likes: 128, comments: 23, liked: false, tags: ['milestone', 'adoption-story', 'anniversary'],
  },
  {
    id: 'e3', type: 'photo', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    image: 'https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=600&h=600&fit=crop',
    content: 'New cat tree day! 🏰 She approved after a thorough 15-minute inspection of every platform level. The top perch is her throne now.',
    date: '3 days ago', time: '4:30 PM',
    likes: 67, comments: 12, liked: true, tags: ['cat-tree', 'new-toy', 'cleo'],
  },
  {
    id: 'e4', type: 'note', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    content: 'Cleo has been drinking more water than usual this week. Monitoring her intake. Will mention it at the next vet visit. Also noticed she\'s been more affectionate — sleeping on my pillow every night.',
    date: '1 week ago', time: '9:15 PM',
    likes: 15, comments: 3, liked: false, tags: ['health-note', 'behavior', 'observation'],
  },
  {
    id: 'e5', type: 'checkup', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    content: 'Annual checkup at Paw Care Vet. Weight: 4.2 kg (healthy!). All vaccines up to date. Blood work normal. The vet said she\'s in perfect health. Proud cat mom moment! 🏆',
    date: '2 weeks ago', time: '2:00 PM', location: 'Paw Care Veterinary Clinic',
    likes: 89, comments: 14, liked: true, tags: ['vet-visit', 'health', 'all-clear'],
  },
  {
    id: 'e6', type: 'photo', petName: 'Cleo', petAvatar: 'CL', petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=600&fit=crop',
    content: 'Saturday morning snuggles are the best. She waited until I was done with coffee then claimed my lap for 2 hours. Not complaining. 🥰',
    date: '2 weeks ago', time: '10:30 AM',
    likes: 103, comments: 19, liked: false, tags: ['snuggle', 'weekend', 'lap-cat'],
  },
]

export default function PetDiaryPage(): React.JSX.Element {
  const [entries, setEntries] = useState(ENTRIES)
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'milestone' | 'note' | 'checkup'>('all')

  function toggleLike(id: string): void {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, liked: !e.liked, likes: e.liked ? e.likes - 1 : e.likes + 1 } : e))
  }

  const filtered = activeFilter === 'all' ? entries : entries.filter((e) => e.type === activeFilter)

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
                <h1 className="text-headline-md font-bold text-on-surface">Pet Diary</h1>
                <p className="text-label-sm text-outline">Capture every moment with your pets</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/20 active:scale-[0.97] cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Entry</span>
              </button>
            </div>

            {/* Filter tabs */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-1 shadow-sm">
              <div className="flex gap-1">
                {(['all', 'photo', 'milestone', 'note', 'checkup'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`flex-1 px-3 py-2 rounded-lg text-label-sm font-semibold capitalize transition-all duration-200 cursor-pointer ${
                      activeFilter === f
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'checkup' ? 'Check-ups' : `${f}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet selector */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {['Cleo'].map((pet) => (
                <button
                  key={pet}
                  className="flex items-center gap-2 px-3.5 py-2 bg-primary/10 text-primary rounded-xl text-label-sm font-semibold border border-primary/20 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white">CL</div>
                  {pet}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 rounded-xl text-label-sm font-semibold hover:border-primary/30 hover:text-primary transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                Add Pet
              </button>
            </div>

            {/* Diary entries */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No entries yet</h3>
                <p className="text-label-sm text-outline mb-4">Start capturing memories with your pet</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                  Create First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((entry) => (
                  <article
                    key={entry.id}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3.5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
                        style={{ background: entry.petGradient }}
                      >
                        {entry.petAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-sm font-bold text-on-surface">{entry.petName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant capitalize">
                            {entry.type === 'checkup' ? 'Check-up' : entry.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-outline">
                          <span>{entry.date} · {entry.time}</span>
                          {entry.location && (
                            <>
                              <span>·</span>
                              <MapPin className="w-3 h-3" />
                              <span>{entry.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image */}
                    {entry.image && (
                      <div className="relative bg-surface-container-low">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.image}
                          alt="Pet photo"
                          className="w-full aspect-square object-cover max-h-[500px]"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-3.5">
                      {/* Type-specific badge */}
                      {entry.type === 'milestone' && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Award className="w-4 h-4 text-secondary" />
                          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Milestone</span>
                        </div>
                      )}
                      {entry.type === 'checkup' && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Vet Visit</span>
                        </div>
                      )}

                      <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">{entry.content}</p>

                      {/* Tags */}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between px-3.5 pb-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(entry.id) }}
                          className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                            entry.liked ? 'text-primary bg-primary/10' : 'text-outline hover:text-primary hover:bg-surface-container'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${entry.liked ? 'fill-current' : ''}`} />
                          <span className="text-label-sm font-semibold">{entry.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-label-sm font-semibold">{entry.comments}</span>
                        </button>
                      </div>
                      <button className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                        <Share2 className="w-4 h-4" />
                      </button>
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

      <MobileTabs currentPage="pet-diary" />
    </>
  )
}
