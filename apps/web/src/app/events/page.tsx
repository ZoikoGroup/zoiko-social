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
  Calendar, ChevronLeft, Search, MapPin, Clock,
  Users, Plus, CheckCircle2, X,
  Heart, Share2, BadgeCheck,
} from 'lucide-react'

type EventTab = 'upcoming' | 'past' | 'hosting'

interface CalendarEvent {
  id: string
  title: string
  date: string
  month: string
  day: string
  time: string
  endTime: string
  location: string
  locationType: 'online' | 'in-person'
  description: string
  organizer: string
  organizerAvatar: string
  attendees: number
  maxAttendees: number
  category: string
  categoryColor: string
  image: string
  rsvp: 'going' | 'interested' | 'none'
  isHost: boolean
  featured: boolean
}

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1', title: 'Adoption Drive — Riverside Park', month: 'JUL', day: '12',
    date: 'Sun, 12 Jul 2026', time: '10:00 AM', endTime: '4:00 PM',
    location: 'Riverside Park, Sacramento, CA', locationType: 'in-person',
    description: 'A community adoption drive featuring 30+ rescue organizations. Meet adoptable dogs, cats, rabbits, and birds. Free microchipping and vaccination clinics available.',
    organizer: 'RescueMata Foundation', organizerAvatar: 'RM',
    attendees: 156, maxAttendees: 300, category: 'Adoption', categoryColor: 'text-primary',
    image: 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600&h=400&fit=crop',
    rsvp: 'going', isHost: false, featured: true,
  },
  {
    id: 'e2', title: 'Veterinary Webinar: Heat Season Preparedness', month: 'JUL', day: '15',
    date: 'Wed, 15 Jul 2026', time: '6:00 PM', endTime: '7:30 PM',
    location: 'Online — Zoom', locationType: 'online',
    description: 'Dr. Amara Osei presents essential strategies for managing pets during extreme heat. Covers hydration protocols, exercise scheduling, and emergency first aid for heatstroke.',
    organizer: 'ZoikoSocial Vet Network', organizerAvatar: 'ZV',
    attendees: 342, maxAttendees: 500, category: 'Webinar', categoryColor: 'text-secondary',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    rsvp: 'interested', isHost: false, featured: true,
  },
  {
    id: 'e3', title: 'Wildlife Photography Workshop', month: 'JUL', day: '19',
    date: 'Sun, 19 Jul 2026', time: '8:00 AM', endTime: '12:00 PM',
    location: 'Effie Yeaw Nature Center, Carmichael, CA', locationType: 'in-person',
    description: 'Learn wildlife photography techniques from professional nature photographers. Bring your camera for a guided walk through the nature preserve. All skill levels welcome.',
    organizer: 'Sacramento Bird Watchers', organizerAvatar: 'SB',
    attendees: 45, maxAttendees: 60, category: 'Workshop', categoryColor: 'text-tertiary',
    image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: true,
  },
  {
    id: 'e4', title: 'Pet CPR & First Aid Certification Course', month: 'JUL', day: '22',
    date: 'Wed, 22 Jul 2026', time: '9:00 AM', endTime: '5:00 PM',
    location: 'Sacramento Animal Care Center', locationType: 'in-person',
    description: 'Get certified in pet CPR and first aid. This all-day course covers rescue breathing, choking management, wound care, and emergency transportation techniques.',
    organizer: 'American Red Cross — Pet Safety', organizerAvatar: 'AR',
    attendees: 28, maxAttendees: 30, category: 'Training', categoryColor: 'text-primary',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
  {
    id: 'e5', title: 'Community TNR Workshop: Trap-Neuter-Return Basics', month: 'JUL', day: '26',
    date: 'Sun, 26 Jul 2026', time: '10:00 AM', endTime: '2:00 PM',
    location: 'Street Cat Rescue Network HQ, Oak Park', locationType: 'in-person',
    description: 'Learn the fundamentals of community cat TNR programs. Includes hands-on trap training, post-surgery care, and colony management best practices.',
    organizer: 'Street Cat Rescue Network', organizerAvatar: 'SC',
    attendees: 67, maxAttendees: 80, category: 'Workshop', categoryColor: 'text-secondary',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop',
    rsvp: 'going', isHost: false, featured: false,
  },
  {
    id: 'e6', title: 'Animal-Assisted Therapy Volunteer Orientation', month: 'AUG', day: '2',
    date: 'Sun, 2 Aug 2026', time: '1:00 PM', endTime: '3:00 PM',
    location: 'Online — Google Meet', locationType: 'online',
    description: 'Interested in volunteering with your pet for therapy visits? Join this orientation to learn about the certification process, screening requirements, and visit types.',
    organizer: 'Paws for Healing', organizerAvatar: 'PH',
    attendees: 89, maxAttendees: 150, category: 'Volunteer', categoryColor: 'text-tertiary',
    image: 'https://images.unsplash.com/photo-1559248120-6fa1f5c0c7c7?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
  {
    id: 'e7', title: 'Avian Care & Enrichment Meetup', month: 'AUG', day: '8',
    date: 'Sat, 8 Aug 2026', time: '11:00 AM', endTime: '1:00 PM',
    location: 'Bird Paradise, Roseville, CA', locationType: 'in-person',
    description: 'Monthly gathering for bird owners. Share enrichment ideas, discuss nutrition, and socialize your feathered friends in a safe, supervised environment.',
    organizer: 'Parrot Enrichment Guild', organizerAvatar: 'PG',
    attendees: 23, maxAttendees: 40, category: 'Meetup', categoryColor: 'text-primary',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
  // Past events
  {
    id: 'e8', title: 'Clear the Shelters Adoption Special', month: 'JUN', day: '22',
    date: 'Mon, 22 Jun 2026', time: '9:00 AM', endTime: '6:00 PM',
    location: 'Sacramento County Animal Shelter', locationType: 'in-person',
    description: 'A county-wide adoption fee waiver event that helped find homes for over 200 shelter animals. Participating shelters across the county.',
    organizer: 'Sacramento County Animal Services', organizerAvatar: 'SA',
    attendees: 220, maxAttendees: 500, category: 'Adoption', categoryColor: 'text-primary',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
  {
    id: 'e9', title: 'Ocean Cleanup: Coastal Beach Day', month: 'JUN', day: '15',
    date: 'Mon, 15 Jun 2026', time: '7:00 AM', endTime: '1:00 PM',
    location: 'Half Moon Bay State Beach', locationType: 'in-person',
    description: 'Over 400 volunteers collected 1,200+ lbs of debris from the shoreline. A successful community effort to protect marine life from plastic pollution.',
    organizer: 'Ocean Plastic Watch', organizerAvatar: 'OP',
    attendees: 412, maxAttendees: 500, category: 'Volunteer', categoryColor: 'text-secondary',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
  {
    id: 'e10', title: 'How to Read Your Pet\'s Blood Work Results', month: 'JUN', day: '10',
    date: 'Wed, 10 Jun 2026', time: '6:00 PM', endTime: '7:30 PM',
    location: 'Online — Zoom', locationType: 'online',
    description: 'Dr. Vetara Okonkwo DVM explained how to interpret common lab values, understand reference ranges, and ask the right questions at your next vet visit.',
    organizer: 'Veterinary Science Network', organizerAvatar: 'VS',
    attendees: 287, maxAttendees: 400, category: 'Webinar', categoryColor: 'text-tertiary',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    rsvp: 'none', isHost: false, featured: false,
  },
]

function EventDateBadge({ month, day }: { month: string; day: string }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center w-14 h-14 rounded-xl bg-surface-container border border-outline-variant/30 flex-shrink-0 overflow-hidden">
      <span className="w-full text-center text-[9px] font-bold text-primary bg-primary/5 uppercase tracking-wider py-0.5">{month}</span>
      <span className="w-full text-center text-label-md font-bold text-on-surface flex-1 flex items-center justify-center">{day}</span>
    </div>
  )
}

function RSVPButton({ status, onClick }: {
  status: 'going' | 'interested' | 'none'
  onClick: () => void
}): React.JSX.Element {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer ${
        status === 'going'
          ? 'bg-primary text-white shadow-sm shadow-primary/20'
          : status === 'interested'
            ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20'
            : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
      }`}
    >
      {status === 'going' ? 'Going ✓' : status === 'interested' ? 'Interested' : 'RSVP'}
    </button>
  )
}

export default function EventsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming')
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState(EVENTS)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  function updateRSVP(id: string, status: 'going' | 'interested' | 'none'): void {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, rsvp: status } : e))
  }

  const filtered = events.filter((e) => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.location.toLowerCase().includes(search.toLowerCase())) return false
    if (activeTab === 'upcoming') return !e.date.startsWith('Mon, 22 Jun') && !e.date.startsWith('Mon, 15 Jun') && !e.date.startsWith('Wed, 10 Jun') // simplistic check for "past"
    if (activeTab === 'past') return e.date.startsWith('Mon, 22 Jun') || e.date.startsWith('Mon, 15 Jun') || e.date.startsWith('Wed, 10 Jun')
    if (activeTab === 'hosting') return e.isHost
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
                <h1 className="text-headline-md font-bold text-on-surface">Events</h1>
                <p className="text-label-sm text-outline">Discover and join animal welfare events near you</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/20 active:scale-[0.97] cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, description, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50"
              />
            </div>

            {/* Tab bar */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-1 shadow-sm">
              <div className="flex gap-1">
                {(['upcoming', 'past', 'hosting'] as const).map((tab) => {
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-label-sm font-semibold transition-all duration-200 cursor-pointer capitalize ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      {tab}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">
                  {activeTab === 'upcoming' ? 'No upcoming events' : activeTab === 'past' ? 'No past events' : 'No hosted events'}
                </h3>
                <p className="text-label-sm text-outline mb-4">
                  {activeTab === 'hosting' ? 'Create an event to see it here' : 'Check back later or adjust your search'}
                </p>
                {activeTab === 'hosting' && (
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                    Create Event
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((event) => (
                  <article
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex">
                      {/* Image thumbnail */}
                      <div className="w-28 sm:w-36 flex-shrink-0 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                        {event.featured && (
                          <span className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider bg-secondary/90 text-white px-1.5 py-0.5 rounded-md">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Title and date */}
                          <div className="flex items-start gap-3">
                            <EventDateBadge month={event.month} day={event.day} />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-label-md font-bold text-on-surface mb-0.5 group-hover:text-primary transition-colors leading-snug">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-outline">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.time} – {event.endTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[160px]">{event.location}</span>
                                </span>
                                {event.locationType === 'online' && (
                                  <span className="text-primary font-medium">Online</span>
                                )}
                              </div>
                              <p className="text-[11px] text-outline mt-2 line-clamp-2 hidden sm:block">{event.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                              {event.organizerAvatar}
                            </div>
                            <span className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{event.organizer}</span>
                            <span className="text-[10px] text-outline/60 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {activeTab !== 'past' && (
                              <RSVPButton
                                status={event.rsvp}
                                onClick={() => updateRSVP(event.id, event.rsvp === 'going' ? 'none' : event.rsvp === 'interested' ? 'going' : 'interested')}
                              />
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation() }}
                              className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Load more */}
                {filtered.length >= 5 && (
                  <div className="text-center pt-2">
                    <button className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all duration-200 cursor-pointer">
                      Load More Events
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="events" />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-headline-md font-bold text-white mb-1">{selectedEvent.title}</h2>
                <div className="flex items-center gap-3 text-white/80 text-label-sm">
                  <span>{selectedEvent.date}</span>
                  <span>·</span>
                  <span>{selectedEvent.time} – {selectedEvent.endTime}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Quick info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Date</p>
                  <p className="text-label-sm font-semibold text-on-surface">{selectedEvent.date}</p>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Time</p>
                  <p className="text-label-sm font-semibold text-on-surface">{selectedEvent.time}</p>
                </div>
                <div className="bg-surface-container rounded-xl p-3 text-center">
                  <Users className="w-4 h-4 text-tertiary mx-auto mb-1" />
                  <p className="text-[10px] text-outline font-medium">Attendees</p>
                  <p className="text-label-sm font-semibold text-on-surface">{selectedEvent.attendees}/{selectedEvent.maxAttendees}</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">Location</h3>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-container">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{selectedEvent.location}</p>
                    <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      selectedEvent.locationType === 'online' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {selectedEvent.locationType === 'online' ? 'Online Event' : 'In-Person'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">About This Event</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Organizer */}
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-2">Organizer</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-label-sm font-bold text-primary">
                    {selectedEvent.organizerAvatar}
                  </div>
                  <div>
                    <p className="text-label-sm font-semibold text-on-surface">{selectedEvent.organizer}</p>
                    <p className="text-[10px] text-outline">{selectedEvent.category} Event</p>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-primary ml-auto" />
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-2">
                {activeTab !== 'past' && selectedEvent && (
                  <button
                    onClick={() => { updateRSVP(selectedEvent.id, 'going'); setSelectedEvent(null) }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-label-md font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer ${
                      selectedEvent.rsvp === 'going'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {selectedEvent.rsvp === 'going' ? 'Going' : 'RSVP — Going'}
                  </button>
                )}
                <button className="p-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
