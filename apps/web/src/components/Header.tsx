'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  PawPrint, Search, Home, Users, MessageSquare, Bell, ChevronDown,
  Newspaper, Calendar, MapPin,
  ShoppingBag, HandHeart, Stethoscope, Dna, LayoutDashboard,
  User, Settings, LogOut, Loader2, MoreHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNotifications } from '@/hooks/use-notifications'
import { useMessaging } from '@/hooks/use-messaging'
import { UserAvatar } from './UserAvatar'

const MODULES: { name: string; Icon: LucideIcon; color: string; href: string }[] = [
  { name: 'Dashboard',         Icon: LayoutDashboard, color: 'text-primary', href: '/dashboard'    },
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

// Primary top-nav: icon-above-label items (+ More menu)
const NAV_ITEMS: { name: string; Icon: LucideIcon; href: string; always?: boolean; badge?: 'alerts' | 'messages' }[] = [
  { name: 'Home',     Icon: Home,          href: '/',              always: true },
  { name: 'Network',  Icon: Users,         href: '/network'                     },
  { name: 'Messages', Icon: MessageSquare, href: '/messages',      badge: 'messages' },
  { name: 'Alerts',   Icon: Bell,          href: '/notifications', badge: 'alerts', always: true },
]

export function Header(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const [signingOut, setSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { profile, signOut } = useAuth()
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

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileMenuOpen])

  const handleSignOut = async (): Promise<void> => {
    if (signingOut) return
    setSigningOut(true)
    await signOut() // redirects to /login when done
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant/30 h-16">
      <div className="flex items-center w-full px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">

        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
          {/* Mobile: compact icon mark · Desktop: full wordmark + tagline */}
          <Link href="/" className="md:hidden flex-shrink-0" aria-label="Home">
            <Image src="/logo.svg" alt="ZoikoSocial" height={38} width={38} priority fetchPriority="high" className="h-[38px] w-[38px] rounded-xl object-contain" />
          </Link>
          <Link href="/" className="hidden md:flex flex-col items-start flex-shrink-0 gap-0.5">
            <Image src="/zoikosocial-logo.png" alt="ZoikoSocial" height={30} width={134} priority fetchPriority="high" className="h-[30px] w-auto object-contain" />
            <span className="hidden lg:block text-[7.5px] font-bold tracking-[0.28em] text-outline uppercase leading-none pl-0.5">
              Animal Welfare Network
            </span>
          </Link>
          <div className="flex relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="pl-11 pr-4 py-2.5 w-full bg-surface-container border border-transparent focus:border-primary/40 focus:bg-surface-container-lowest focus:shadow-sm focus:outline-none rounded-full text-label-md transition-all placeholder:text-outline/70 placeholder:font-normal"
              placeholder="Search pets, vets, rescues, services…"
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

        {/* Center: Primary navigation — icon above label (desktop; mobile uses the bottom tab bar) */}
        <nav className="hidden md:flex items-center justify-center gap-0.5 md:gap-2 lg:gap-4 h-full flex-shrink-0 mx-2 lg:mx-5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const badgeCount = item.badge === 'alerts' ? notifUnreadCount : item.badge === 'messages' ? msgUnreadCount : 0
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${item.always ? 'flex' : 'hidden sm:flex'} flex-col items-center justify-center gap-1 min-w-[52px] lg:min-w-[60px] h-full cursor-pointer transition-colors duration-200 ${
                  active
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="relative">
                  <item.Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 1.9} />
                  {item.badge && badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </span>
                <span className={`text-[10.5px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            )
          })}

          {/* More — apps menu */}
          <div className="relative h-full flex items-center" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[52px] lg:min-w-[60px] h-full transition-colors duration-200 cursor-pointer ${
                menuOpen || isOnModulePage
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-label="All modules"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="w-[22px] h-[22px]" strokeWidth={menuOpen || isOnModulePage ? 2.4 : 1.9} />
              <span className={`text-[10.5px] leading-none ${menuOpen || isOnModulePage ? 'font-bold' : 'font-medium'}`}>More</span>
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

        {/* Right: Rescue + alerts (mobile) / avatar menu (desktop) */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0 relative" ref={profileMenuRef}>
          {/* Emergency rescue CTA */}
          <Link
            href="/adoption"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-[13px] font-bold shadow-sm hover:bg-red-700 active:scale-[0.97] transition-all"
          >
            <span className="size-2 rounded-full bg-white/90 animate-pulse" />
            Rescue
          </Link>

          {/* Mobile: alerts bell (profile lives in the bottom tab bar) */}
          <Link
            href="/notifications"
            className="md:hidden relative flex items-center justify-center size-10 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.9} />
            {notifUnreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                {notifUnreadCount > 99 ? '99+' : notifUnreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="hidden md:flex items-center gap-1 p-1 hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            aria-label="Account menu"
            aria-expanded={profileMenuOpen}
          >
            <span className="rounded-full ring-2 ring-primary/60 ring-offset-1 ring-offset-surface-container-lowest flex">
              {profile ? (
                <UserAvatar name={profile.displayName} image={profile.avatarUrl ?? undefined} size="sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse border border-outline-variant" />
              )}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-outline hidden sm:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {profile && (
                <div className="px-4 py-2.5 border-b border-outline-variant/20">
                  <p className="text-[13.5px] font-bold text-on-surface truncate">{profile.displayName}</p>
                  <p className="text-[11.5px] text-outline truncate">@{profile.username}</p>
                </div>
              )}
              <Link
                href="/profile"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <User className="w-4 h-4 text-outline" />
                View Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <Settings className="w-4 h-4 text-outline" />
                Settings
              </Link>
              <div className="border-t border-outline-variant/20 my-1" />
              <button
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {signingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
