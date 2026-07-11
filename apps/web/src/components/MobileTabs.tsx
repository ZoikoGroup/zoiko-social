'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, Users, Plus, MessageSquare, User, X,
  Newspaper, Calendar, PawPrint, MapPin, ShoppingBag, HandHeart, Dna,
  Stethoscope, Activity, Heart, TriangleAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMessaging } from '@/hooks/use-messaging'

interface MobileTabsProps {
  currentPage: string
  onNavigate?: (page: string) => void
}

const TABS: { page: string; label: string; Icon: LucideIcon; href: string; accent?: boolean }[] = [
  { page: 'home',     label: 'Home',     Icon: Home,          href: '/'         },
  { page: 'rescue',   label: 'Rescue',   Icon: TriangleAlert, href: '/adoption', accent: true },
  { page: 'pets',     label: 'Pets',     Icon: Heart,         href: '/pet-care' },
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
  const { unreadCount } = useMessaging()

  return (
    <>
      {/* Slide-up module tray */}
      {trayOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setTrayOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 bg-surface-container-lowest border-t border-outline-variant rounded-t-2xl p-4 z-50"
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

      {/* Floating "+" — explore modules */}
      <button
        onClick={() => setTrayOpen((o) => !o)}
        className="md:hidden fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-xl shadow-primary/30 active:scale-95 transition-transform cursor-pointer"
        aria-label="Explore modules"
        aria-expanded={trayOpen}
      >
        {trayOpen ? <X className="w-6 h-6 text-white" /> : <Plus className="w-7 h-7 text-white" />}
      </button>

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/40 flex items-stretch justify-around px-2 z-50 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const isActive = currentPage === tab.page
          const color = tab.accent
            ? 'text-red-600'
            : isActive
              ? 'text-primary'
              : 'text-on-surface-variant'
          return (
            <Link
              key={tab.page}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer relative min-w-[52px] ${color}`}
            >
              <span className="relative">
                <tab.Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.3 : 1.9} />
                {tab.page === 'messages' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </span>
              <span className={`text-[10.5px] leading-none ${isActive || tab.accent ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
