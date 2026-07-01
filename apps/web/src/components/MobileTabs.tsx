'use client'

import { useState } from 'react'
import {
  Home, Users, Plus, MessageSquare, User, X,
  Newspaper, Calendar, PawPrint, MapPin, ShoppingBag, HandHeart, Stethoscope, Dna,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MobileTabsProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const TABS: { page: string; label: string; Icon: LucideIcon; center?: boolean }[] = [
  { page: 'home',     label: 'Home',     Icon: Home           },
  { page: 'network',  label: 'Network',  Icon: Users          },
  { page: 'more',     label: '',         Icon: Plus, center: true },
  { page: 'messages', label: 'Messages', Icon: MessageSquare  },
  { page: 'profile',  label: 'Profile',  Icon: User           },
]

const TRAY_MODULES: { name: string; Icon: LucideIcon }[] = [
  { name: 'Verified News',     Icon: Newspaper   },
  { name: 'Events',            Icon: Calendar    },
  { name: 'Adoption & Rescue', Icon: PawPrint    },
  { name: 'Lost & Found',      Icon: MapPin      },
  { name: 'Shop',              Icon: ShoppingBag },
  { name: 'Pet Care Services', Icon: HandHeart   },
  { name: 'Vet Finder',        Icon: Stethoscope },
  { name: 'Breeding Match',    Icon: Dna         },
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
                <button
                  key={mod.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                  onClick={() => setTrayOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mod.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] text-on-surface-variant text-center leading-tight">{mod.name}</span>
                </button>
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
            <button
              key={tab.page}
              className={`flex flex-col items-center gap-1 cursor-pointer relative min-w-[44px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
            >
              <tab.Icon className="w-5 h-5" />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
              {tab.page === 'messages' && (
                <span className="absolute -top-0.5 right-0 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
