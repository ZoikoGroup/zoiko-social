'use client'

import { useCallback, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import {
  LayoutDashboard, Users, ShieldAlert, BadgeCheck, Newspaper, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { OverviewSection } from './_sections/OverviewSection'
import { PeopleSection } from './_sections/PeopleSection'
import { ModerationSection } from './_sections/ModerationSection'
import { VerificationSection } from './_sections/VerificationSection'
import { NewsSection } from './_sections/NewsSection'

/**
 * The admin panel — one screen for the whole platform.
 *
 * Previously five separate pages, each re-implementing the same permission
 * check and the same chrome, and each requiring a full navigation to reach the
 * next. Moderating a report and then checking who reported it meant leaving the
 * queue and coming back to a reset filter.
 *
 * The section lives in the URL (`?s=people`) so a view stays linkable and
 * survives a reload — the thing a tabbed panel usually gives up.
 */

type SectionId = 'overview' | 'people' | 'moderation' | 'verification' | 'news'

interface Section {
  id: SectionId
  label: string
  Icon: LucideIcon
  /** Sections a moderator cannot use at all are hidden rather than shown broken. */
  adminOnly?: boolean
}

const SECTIONS: Section[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'people', label: 'People', Icon: Users },
  { id: 'moderation', label: 'Moderation', Icon: ShieldAlert },
  { id: 'verification', label: 'Verification', Icon: BadgeCheck },
  { id: 'news', label: 'News', Icon: Newspaper },
]

const IDS = new Set<string>(SECTIONS.map((s) => s.id))

export default function AdminPage(): React.JSX.Element {
  const { loading: authLoading, isAuthenticated, profile } = useAuth()

  // Seeded from the URL so a link to ?s=news opens there rather than flashing
  // Overview first.
  const [section, setSection] = useState<SectionId>(() => {
    if (typeof window === 'undefined') return 'overview'
    const s = new URLSearchParams(window.location.search).get('s')
    return s && IDS.has(s) ? (s as SectionId) : 'overview'
  })

  const go = useCallback((next: string) => {
    if (!IDS.has(next)) return
    setSection(next as SectionId)
    // replaceState, not push: flipping between sections should not fill the
    // back button with panel states the way five separate pages did.
    const url = new URL(window.location.href)
    url.searchParams.set('s', next)
    window.history.replaceState(null, '', url.toString())
  }, [])

  // The browser's back/forward buttons still move between sections that were
  // arrived at by a real navigation.
  useEffect(() => {
    const onPop = () => {
      const s = new URLSearchParams(window.location.search).get('s')
      setSection(s && IDS.has(s) ? (s as SectionId) : 'overview')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (authLoading) return <div className="min-h-screen bg-background" />

  const isStaff = profile && ['admin', 'moderator', 'super_admin'].includes(profile.role)
  const isAdmin = profile && ['admin', 'super_admin'].includes(profile.role)

  // One gate for the whole panel, instead of the same check copied into five
  // pages that could drift apart.
  if (!isAuthenticated || !isStaff) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-background flex items-center justify-center">
          <p className="text-outline">You don&apos;t have permission to view this page.</p>
        </main>
      </>
    )
  }

  const visible = SECTIONS.filter((s) => !s.adminOnly || isAdmin)

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-title-lg font-bold flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" /> Admin
            </h1>
            <span className="text-label-sm text-outline">
              {profile.displayName ?? profile.username} · <span className="capitalize">{profile.role.replace('_', ' ')}</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            {/*
              A rail on desktop, a scrolling strip on mobile. Same control either
              way — the panel is used on a laptop but a moderator dismissing a
              report from a phone should not get a different information layout.
            */}
            <nav className="md:w-52 md:flex-shrink-0">
              <ul className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible">
                {visible.map(({ id, label, Icon }) => (
                  <li key={id} className="flex-shrink-0">
                    <button
                      onClick={() => go(id)}
                      aria-current={section === id ? 'page' : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-label-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        section === id
                          ? 'bg-primary/10 text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex-1 min-w-0">
              {section === 'overview' && <OverviewSection onGo={go} />}
              {section === 'people' && <PeopleSection />}
              {section === 'moderation' && <ModerationSection />}
              {section === 'verification' && <VerificationSection />}
              {section === 'news' && <NewsSection />}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
