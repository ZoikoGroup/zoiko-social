'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Link2, PawPrint, BookOpen, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { PostCard } from './PostCard'

type Tab = 'posts' | 'about' | 'pets' | 'media'

const TABS: { id: Tab; label: string }[] = [
  { id: 'posts',  label: 'Posts'  },
  { id: 'about',  label: 'About'  },
  { id: 'pets',   label: 'Pets'   },
  { id: 'media',  label: 'Media'  },
]

const MEDIA_IMAGES = [
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&h=300&fit=crop',
]

const PETS = [
  { name: 'Luna',  species: 'Cat · Domestic Shorthair', initials: 'LU', color: 'bg-primary/10 text-primary' },
  { name: 'Bruno', species: 'Dog · Labrador Mix',       initials: 'BR', color: 'bg-secondary/10 text-secondary' },
]

function AboutTab(): React.JSX.Element {
  return (
    <div className="space-y-gutter">
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
        <h3 className="text-label-md font-bold text-on-surface mb-4">Overview</h3>
        <div className="space-y-3 text-label-md text-on-surface-variant">
          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-outline flex-shrink-0" />San Francisco, CA</div>
          <div className="flex items-center gap-3"><Link2 className="w-4 h-4 text-outline flex-shrink-0" />alexrivera.pets</div>
          <div className="flex items-center gap-3"><Stethoscope className="w-4 h-4 text-outline flex-shrink-0" />Pet Nutrition Specialist · 8 years experience</div>
          <div className="flex items-center gap-3"><Users className="w-4 h-4 text-outline flex-shrink-0" />Member of Emergency Rescuers, Holistic Pet Nutrition</div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
        <h3 className="text-label-md font-bold text-on-surface mb-4">Expertise & Species</h3>
        <div className="flex flex-wrap gap-2">
          {['Cats', 'Dogs', 'Small Mammals', 'Holistic Nutrition', 'Rescue Rehabilitation', 'Foster Care', 'Animal Welfare Policy'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant text-label-sm rounded-full border border-outline-variant/30">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
        <h3 className="text-label-md font-bold text-on-surface mb-4">Communities</h3>
        <div className="space-y-3">
          {['Emergency Rescuers', 'Holistic Pet Nutrition', 'Veterinary Insights'].map((c) => (
            <div key={c} className="flex items-center justify-between">
              <span className="text-label-md text-on-surface">{c}</span>
              <span className="text-label-sm text-outline">Member</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function PetsTab(): React.JSX.Element {
  return (
    <div className="space-y-3">
      {PETS.map((pet) => (
        <div key={pet.name} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${pet.color} flex items-center justify-center font-bold text-sm border border-outline-variant`}>
            {pet.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-label-md text-on-surface">{pet.name}</p>
            <p className="text-label-sm text-outline">{pet.species}</p>
            <div className="flex gap-4 mt-2">
              <Link href="/pet-diary" className="flex items-center gap-1 text-label-sm text-primary hover:underline">
                <BookOpen className="w-3.5 h-3.5" />Diary
              </Link>
              <Link href="/health-passport" className="flex items-center gap-1 text-label-sm text-primary hover:underline">
                <ShieldCheck className="w-3.5 h-3.5" />Health Passport
              </Link>
            </div>
          </div>
          <PawPrint className="w-5 h-5 text-outline/40 flex-shrink-0" />
        </div>
      ))}
      <button className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant text-outline hover:border-primary hover:text-primary transition-colors text-label-md cursor-pointer">
        + Add a pet
      </button>
    </div>
  )
}

function MediaTab(): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="grid grid-cols-3 gap-0.5">
        {MEDIA_IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Media ${i + 1}`}
            className="w-full aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}

export function ProfileTabs(): React.JSX.Element {
  const [active, setActive] = useState<Tab>('posts')

  return (
    <div className="space-y-gutter">
      {/* Tab bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-shrink-0 px-5 py-3.5 text-label-md font-semibold border-b-2 transition-colors cursor-pointer ${
                active === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {active === 'posts'  && <PostCard />}
      {active === 'about'  && <AboutTab />}
      {active === 'pets'   && <PetsTab />}
      {active === 'media'  && <MediaTab />}
    </div>
  )
}
