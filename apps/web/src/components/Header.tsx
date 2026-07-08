'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  PawPrint, Search, Home, Users, MessageSquare, Bell, ChevronDown,
  Newspaper, Calendar, MapPin,
  ShoppingBag, HandHeart, Stethoscope, Dna, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNotifications } from '@/hooks/use-notifications'
import { useMessaging } from '@/hooks/use-messaging'
import { UserAvatar } from './UserAvatar'

const MODULES: { name: string; Icon: LucideIcon; color: string; href: string }[] = [
  { name: 'Communities',       Icon: Users,       color: 'text-primary',   href: '/communities'    },
  { name: 'Verified News',     Icon: Newspaper,   color: 'text-primary',   href: '/news'           },
  { name: 'Events',            Icon: Calendar,    color: 'text-secondary', href: '/events'         },
  { name: 'Lost & Found',      Icon: MapPin,      color: 'text-secondary', href: '/lost-found'     },
  { name: 'Adoption & Rescue', Icon: PawPrint,    color: 'text-primary',   href: '/adoption'       },
  { name: 'Shop',              Icon: ShoppingBag, color: 'text-tertiary',  href: '/shop'           },
  { name: 'Pet Care',          Icon: HandHeart,   color: 'text-primary',   href: '/pet-care'       },
  { name: 'Vet Finder',        Icon: Stethoscope, color: 'text-secondary', href: '/vet-finder'     },
  { name: 'Breeding Match',    Icon: Dna,         color: 'text-tertiary',  href: '/breeding-match' },
  { name: 'Pet Diary',         Icon: PawPrint,    color: 'text-primary',   href: '/pet-diary'      },
  { name: 'Health Passport',   Icon: HandHeart,   color: 'text-secondary', href: '/health-passport'},
  { name: 'Settings',          Icon: PawPrint,    color: 'text-tertiary',  href: '/settings'       },
]

const MODULE_HREFS = MODULES.map((m) => m.href)

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
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()
  const { unreadCount: notifUnreadCount } = useNotifications()
  const { unreadCount: msgUnreadCount } = useMessaging()
  const [searchTerm, setSearchTerm] = useState('')

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isOnModulePage = MODULE_HREFS.some((href) => pathname.startsWith(href))

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
      <div className="flex items-center w-full px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">

        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/zoikosocial-logo.png" alt="ZoikoSocial" height={36} width={160} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden lg:flex relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="pl-10 pr-4 py-1.5 w-full bg-surface-container-low border border-transparent focus:border-primary focus:outline-none rounded-lg text-label-md transition-all placeholder:text-outline/60"
              placeholder="Search vets, rescues, pets, services, topics…"
              type="text"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
                  router.push(`/network?q=${encodeURIComponent(searchTerm.trim())}`)
                }
              }}
            />
          </div>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-1 md:gap-2 h-full">
          <Link
            className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors duration-200 ${
              isActive('/')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
            href="/"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </Link>
          <Link
            className={`hidden sm:flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors duration-200 ${
              isActive('/network')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
            href="/network"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Network</span>
          </Link>
          <Link
            className={`hidden sm:flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors duration-200 ${
              isActive('/messages')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
            href="/messages"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {msgUnreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {msgUnreadCount > 99 ? '99+' : msgUnreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Messaging</span>
          </Link>
          <Link
            className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer relative transition-colors duration-200 ${
              isActive('/notifications')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
            href="/notifications"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {notifUnreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifUnreadCount > 99 ? '99+' : notifUnreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Notifications</span>
          </Link>

          {/* 9-dot Apps Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex flex-col items-center justify-center min-w-[44px] h-16 transition-colors duration-200 cursor-pointer border-b-2 ${
                menuOpen || isOnModulePage
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant hover:text-primary border-transparent hover:border-primary/30'
              }`}
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
                  {MODULES.map((mod) => {
                    const modActive = isActive(mod.href)
                    return (
                      <Link
                        key={mod.name}
                        href={mod.href}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                          modActive ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-surface-container'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          modActive
                            ? 'bg-primary text-white shadow-sm shadow-primary/20'
                            : 'bg-surface-container-low group-hover:bg-primary/10'
                        }`}>
                          <mod.Icon className={`w-5 h-5 ${modActive ? 'text-white' : mod.color} group-hover:text-primary transition-colors`} />
                        </div>
                        <span className={`text-[10px] text-center leading-tight transition-colors ${
                          modActive ? 'text-primary font-semibold' : 'text-on-surface-variant group-hover:text-on-surface'
                        }`}>{mod.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: lost-pet pill + avatar */}
        <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
          {/* Lost pet nearby pill */}
          <Link
            href="/lost-found"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/50 text-secondary text-[12px] font-semibold hover:bg-secondary/5 transition-colors whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5" />
            Lost pet nearby
          </Link>

          <div className="h-8 w-[1px] bg-outline-variant mx-1 hidden sm:block"></div>
          <Link href="/profile" className="flex items-center gap-1 p-1 hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
            {profile ? (
              <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse border border-outline-variant" />
            )}
            <ChevronDown className="w-3.5 h-3.5 text-outline hidden sm:block" />
          </Link>
        </div>
      </div>
    </header>
  )
}
