'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, Users, Plus, MessageSquare, User, X,
  Newspaper, Calendar, PawPrint, MapPin, ShoppingBag, HandHeart, Dna,
  Stethoscope, Activity, Heart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MobileTabsProps {
  currentPage: string
  onNavigate?: (page: string) => void
}

const TABS: { page: string; label: string; Icon: LucideIcon; href: string; center?: boolean }[] = [
  { page: 'home',     label: 'Home',     Icon: Home,          href: '/'         },
  { page: 'network',  label: 'Network',  Icon: Users,         href: '/network'  },
  { page: 'more',     label: '',         Icon: Plus,          href: '#', center: true },
  { page: 'messages', label: 'Messages', Icon: MessageSquare, href: '/messages' },
  { page: 'profile',  label: 'Profile',  Icon: User,          href: '/profile'  },
]

const TRAY_MODULES: { name: string; Icon: LucideIcon; href: string }[] = [
  { name: 'Communities',       Icon: Users,        href: '/communities'    },
  { name: 'Verified News',     Icon: Newspaper,    href: '/news'           },
  { name: 'Events',            Icon: Calendar,     href: '/events'         },
  { name: 'Adoption & Rescue', Icon: PawPrint,     href: '/adoption'       },
  { name: 'Lost & Found',      Icon: MapPin,       href: '/lost-found'     },
  { name: 'Pet Diary',         Icon: Heart,        href: '/pet-diary'      },
  { name: 'Shop',              Icon: ShoppingBag,  href: '/shop'           },
  { name: 'Pet Care Services', Icon: HandHeart,    href: '/pet-care'       },
  { name: 'Vet Finder',        Icon: Stethoscope,  href: '/vet-finder'     },
  { name: 'Breeding Match',    Icon: Dna,          href: '/breeding-match' },
  { name: 'Health Passport',   Icon: Activity,     href: '/health-passport'},
]

export function MobileTabs({ currentPage }: MobileTabsProps): React.JSX.Element {
  const [trayOpen, setTrayOpen] = useState(false)

  return (
    <>
      {/* Slide-up module tray */}
      {trayOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setTrayOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-16 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant rounded-t-2xl p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md font-bold">Explore ZoikoSocial</span>
              <button onClick={() => setTrayOpen(false)} className="text-outline hover:text-on-surface p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {TRAY_MODULES.map((mod) => (
                <Link
                  key={mod.name}
                  href={mod.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                  onClick={() => setTrayOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mod.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] text-on-surface-variant text-center leading-tight">{mod.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-4 z-50">
        {TABS.map((tab) => {
          const isActive = currentPage === tab.page
          if (tab.center) {
            return (
              <button
                key={tab.page}
                onClick={() => setTrayOpen((o) => !o)}
                className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg active:scale-95 transition-transform cursor-pointer -mt-4"
                aria-label="Explore modules"
              >
                {trayOpen ? <X className="w-5 h-5 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </button>
            )
          }
          return (
            <Link
              key={tab.page}
              href={tab.href}
              className={`flex flex-col items-center gap-1 cursor-pointer relative min-w-[44px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
            >
              <tab.Icon className="w-5 h-5" />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
              {tab.page === 'messages' && (
                <span className="absolute -top-0.5 right-0 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
