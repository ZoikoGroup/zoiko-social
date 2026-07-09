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

// Primary top-nav: Home · Network · Messaging · Alerts (+ More menu)
const NAV_ITEMS: { name: string; Icon: LucideIcon; href: string; always?: boolean; badge?: boolean }[] = [
  { name: 'Home',      Icon: Home,          href: '/',              always: true },
  { name: 'Network',   Icon: Users,         href: '/network'                     },
  { name: 'Messaging', Icon: MessageSquare, href: '/messages'                    },
  { name: 'Alerts',    Icon: Bell,          href: '/notifications', badge: true, always: true },
]

export function Header(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()
  const { unreadCount: notifUnreadCount } = useNotifications()
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
        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/zoikosocial-logo.png" alt="ZoikoSocial" height={36} width={160} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="pl-11 pr-4 py-2.5 w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none rounded-full text-label-md transition-all placeholder:text-outline/70"
              placeholder="Search pets, vets, rescues, services or welfare alerts"
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

        {/* Center: Primary navigation — text labels */}
        <nav className="flex items-center justify-center gap-1 md:gap-5 lg:gap-7 h-full flex-shrink-0 mx-2 lg:mx-6">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${item.always ? 'flex' : 'hidden sm:flex'} items-center justify-center h-full cursor-pointer transition-colors duration-200 border-b-[2.5px] text-label-md ${
                  active
                    ? 'text-on-surface font-semibold border-secondary'
                    : 'text-on-surface-variant hover:text-on-surface font-medium border-transparent'
                }`}
              >
                <span className="relative">
                  {item.name}
                  {item.badge && notifUnreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {notifUnreadCount > 99 ? '99+' : notifUnreadCount}
                    </span>
                  )}
                </span>
              </Link>
            )
          })}

          {/* More — apps menu */}
          <div className="relative h-full flex items-center" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center gap-1 h-full transition-colors duration-200 cursor-pointer border-b-[2.5px] text-label-md ${
                menuOpen || isOnModulePage
                  ? 'text-on-surface font-semibold border-secondary'
                  : 'text-on-surface-variant hover:text-on-surface font-medium border-transparent'
              }`}
              aria-label="All modules"
              aria-expanded={menuOpen}
            >
              More
              {menuOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

        {/* Right: avatar */}
        <div className="flex items-center gap-1 justify-end flex-shrink-0">
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
