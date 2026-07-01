'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  PawPrint, Search, Home, Users, MessageSquare, Bell,
  Newspaper, Calendar, MapPin,
  ShoppingBag, HandHeart, Stethoscope, Dna, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const MODULES: { name: string; Icon: LucideIcon; color: string }[] = [
  { name: 'Verified News',     Icon: Newspaper,   color: 'text-primary' },
  { name: 'Events',            Icon: Calendar,    color: 'text-secondary' },
  { name: 'Adoption & Rescue', Icon: PawPrint,     color: 'text-primary' },
  { name: 'Lost & Found',      Icon: MapPin,      color: 'text-secondary' },
  { name: 'Shop',              Icon: ShoppingBag, color: 'text-tertiary' },
  { name: 'Pet Care',          Icon: HandHeart,   color: 'text-primary' },
  { name: 'Vet Finder',        Icon: Stethoscope, color: 'text-secondary' },
  { name: 'Breeding Match',    Icon: Dna,         color: 'text-tertiary' },
]

function NineDotIcon(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <circle cx="3"  cy="3"  r="1.6"/>
      <circle cx="9"  cy="3"  r="1.6"/>
      <circle cx="15" cy="3"  r="1.6"/>
      <circle cx="3"  cy="9"  r="1.6"/>
      <circle cx="9"  cy="9"  r="1.6"/>
      <circle cx="15" cy="9"  r="1.6"/>
      <circle cx="3"  cy="15" r="1.6"/>
      <circle cx="9"  cy="15" r="1.6"/>
      <circle cx="15" cy="15" r="1.6"/>
    </svg>
  )
}

export function Header(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant/30 h-16">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">

        {/* Left: Logo + Search */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="ZoikoSocial" width={32} height={32} priority />
            <span className="hidden md:block font-headline text-primary font-bold tracking-tight text-headline-md">ZoikoSocial</span>
          </div>
          <div className="hidden lg:flex relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="pl-10 pr-4 py-1.5 w-full bg-surface-container-low border border-transparent focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/60"
              placeholder="Search professional network"
              type="text"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-1 md:gap-2 h-full">
          <a className="flex flex-col items-center justify-center min-w-[56px] h-full text-primary border-b-2 border-primary cursor-pointer" href="#">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </a>
          <a className="hidden sm:flex flex-col items-center justify-center min-w-[56px] h-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Network</span>
          </a>
          <a className="hidden sm:flex flex-col items-center justify-center min-w-[56px] h-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Messaging</span>
          </a>
          <a className="flex flex-col items-center justify-center min-w-[56px] h-full text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer" href="#">
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </div>
            <span className="text-[10px] mt-0.5">Notifications</span>
          </a>

          {/* 9-dot Apps Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex flex-col items-center justify-center min-w-[44px] h-16 transition-colors cursor-pointer ${menuOpen ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
              aria-label="All modules"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <NineDotIcon />}
              <span className="text-[10px] mt-0.5">More</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+4px)] w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant/20">
                  <p className="text-label-md font-bold text-on-surface">Explore ZoikoSocial</p>
                  <p className="text-[11px] text-outline mt-0.5">All platform modules</p>
                </div>
                <div className="grid grid-cols-3 gap-1 p-3">
                  {MODULES.map((mod) => (
                    <button
                      key={mod.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <mod.Icon className={`w-5 h-5 ${mod.color} group-hover:text-primary transition-colors`} />
                      </div>
                      <span className="text-[10px] text-on-surface-variant text-center leading-tight group-hover:text-on-surface transition-colors">{mod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-outline-variant mx-1 hidden sm:block"></div>
          <button className="flex items-center gap-2 p-1.5 hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-outline-variant">
              AR
            </div>
            <span className="hidden xl:block text-label-md font-semibold">Me</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
