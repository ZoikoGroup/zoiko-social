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
  Heart, MessageSquare, UserPlus, AtSign,
  BadgeCheck, ChevronLeft, Bell,
  Calendar, Megaphone, Star, CheckCheck,
} from 'lucide-react'

type NotificationTab = 'all' | 'likes' | 'comments' | 'follows' | 'mentions'

const TABS: { id: NotificationTab; label: string; Icon: typeof Bell }[] = [
  { id: 'all',      label: 'All',      Icon: Bell },
  { id: 'likes',    label: 'Likes',    Icon: Heart },
  { id: 'comments', label: 'Comments', Icon: MessageSquare },
  { id: 'follows',  label: 'Follows',  Icon: UserPlus },
  { id: 'mentions', label: 'Mentions', Icon: AtSign },
]

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'badge' | 'event' | 'system' | 'milestone'
  initials: string
  gradient: string
  user: string
  action: string
  target: string
  time: string
  dateGroup: 'Today' | 'Yesterday' | 'This Week' | 'Earlier'
  read: boolean
  verified?: boolean
}

const NOTIFICATIONS: Notification[] = [
  // Today
  { id: 'n1',  type: 'like',     initials: 'SR', gradient: 'linear-gradient(135deg,#5C9E78,#2a6b4a)', user: 'Sara Renfeld',     action: 'liked your post',      target: '"Meet Cleo — a 2-year-old rescue"',         time: '12m ago', dateGroup: 'Today',    read: false, verified: true },
  { id: 'n2',  type: 'comment',  initials: 'DV', gradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)', user: 'Dr. Vetara Okonkwo DVM', action: 'commented on your post', target: '"Great advice on heat safety!"',            time: '24m ago', dateGroup: 'Today',    read: false, verified: true },
  { id: 'n3',  type: 'follow',   initials: 'MK', gradient: 'linear-gradient(135deg,#8C3D2A,#c4622a)', user: 'Marco Kutini',       action: 'started following you', target: '',                                                    time: '1h ago',  dateGroup: 'Today',    read: false },
  { id: 'n4',  type: 'like',     initials: 'AO', gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)', user: 'Amara Owusu',       action: 'liked your post',      target: '"Heat season reminder: pavement temperatures"', time: '2h ago', dateGroup: 'Today',  read: true },
  // Yesterday
  { id: 'n5',  type: 'badge',    initials: 'ZS', gradient: 'linear-gradient(135deg,#066879,#0A8A9A)', user: 'ZoikoSocial',      action: 'awarded you a badge',  target: 'Community Contributor badge for 50 helpful posts!', time: '18h ago', dateGroup: 'Yesterday', read: false },
  { id: 'n6',  type: 'mention',  initials: 'TL', gradient: 'linear-gradient(135deg,#7a5c2a,#b88a3a)', user: 'Tanya Lorence',     action: 'mentioned you in a comment', target: '"Thanks for the tip @username! 🐾"',      time: '20h ago', dateGroup: 'Yesterday', read: true },
  { id: 'n7',  type: 'comment',  initials: 'PW', gradient: 'linear-gradient(135deg,#a05c2a,#7a3e18)', user: 'PawsWild Rescue',   action: 'replied to your comment', target: '"We\'re updating the adoption process next week"', time: '1d ago', dateGroup: 'Yesterday', read: true },
  // This Week
  { id: 'n8',  type: 'event',    initials: 'RM', gradient: 'linear-gradient(135deg,#3a5c2a,#6a9c3a)', user: 'RescueMata Foundation', action: 'created an event',     target: 'Adoption Drive — 12 Jul 2026 at Riverside Park', time: '3d ago', dateGroup: 'This Week', read: true },
  { id: 'n9',  type: 'follow',   initials: 'CE', gradient: 'linear-gradient(135deg,#8C5C9E,#5a3a72)', user: 'ClimateEdu',        action: 'started following you', target: '',                                                    time: '4d ago', dateGroup: 'This Week', read: true },
  { id: 'n10', type: 'like',     initials: 'BH', gradient: 'linear-gradient(135deg,#9e7a5c,#6e5238)', user: 'BirdsHQ Community', action: 'liked your post',      target: '"The Sarus Crane pair at Keoladeo"',          time: '5d ago', dateGroup: 'This Week', read: true },
  // Earlier
  { id: 'n11', type: 'milestone', initials: 'ZS', gradient: 'linear-gradient(135deg,#066879,#0A8A9A)', user: 'ZoikoSocial',    action: 'milestone reached!', target: 'You reached 100 followers — congratulations! 🎉', time: '2w ago', dateGroup: 'Earlier', read: true },
  { id: 'n12', type: 'system',   initials: 'ZS', gradient: 'linear-gradient(135deg,#066879,#0A8A9A)', user: 'ZoikoSocial',      action: 'new feature available', target: 'Health Passport is now live — add your pet\'s records!', time: '3w ago', dateGroup: 'Earlier', read: true },
  { id: 'n13', type: 'mention',  initials: 'AN', gradient: 'linear-gradient(135deg,#4a5c6a,#2a3a4a)', user: 'AnimalNeuroscience', action: 'mentioned you in a post', target: '"New study on canine cognition — great input from @username"', time: '1mo ago', dateGroup: 'Earlier', read: true },
]

const TYPE_ICONS: Record<string, typeof Heart> = {
  like: Heart,
  comment: MessageSquare,
  follow: UserPlus,
  mention: AtSign,
  badge: Star,
  event: Calendar,
  system: Megaphone,
  milestone: Star,
}

function getTypeGradient(type: string): string {
  const map: Record<string, string> = {
    like: 'from-pink-500 to-rose-400',
    comment: 'from-blue-500 to-cyan-400',
    follow: 'from-emerald-500 to-teal-400',
    mention: 'from-purple-500 to-violet-400',
    badge: 'from-amber-500 to-orange-400',
    event: 'from-indigo-500 to-blue-400',
    system: 'from-slate-500 to-gray-400',
    milestone: 'from-amber-500 to-yellow-400',
  }
  return map[type] ?? 'from-primary to-secondary'
}

export default function NotificationsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NotificationTab>('all')
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter((n) => {
        if (activeTab === 'likes') return n.type === 'like'
        if (activeTab === 'comments') return n.type === 'comment'
        if (activeTab === 'follows') return n.type === 'follow'
        if (activeTab === 'mentions') return n.type === 'mention'
        return true
      })

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead(): void {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markOneRead(id: string): void {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  // Group by date
  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    if (!acc[n.dateGroup]) acc[n.dateGroup] = []
    acc[n.dateGroup]!.push(n)
    return acc
  }, {})

  const DATE_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier']

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
            {/* Header with back button */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-headline-md font-bold text-on-surface">Notifications</h1>
                <p className="text-label-sm text-outline">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No new notifications'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
            </div>

            {/* Tab bar */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-1 shadow-sm overflow-x-auto no-scrollbar">
              <div className="flex gap-1">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  const count = tab.id === 'all'
                    ? unreadCount
                    : notifications.filter((n) => {
                        if (tab.id === 'likes') return n.type === 'like'
                        if (tab.id === 'comments') return n.type === 'comment'
                        if (tab.id === 'follows') return n.type === 'follow'
                        if (tab.id === 'mentions') return n.type === 'mention'
                        return false
                      }).filter((n) => !n.read).length

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-label-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <tab.Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notification list */}
            <div className="space-y-6">
              {Object.keys(grouped).length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-7 h-7 text-outline" />
                  </div>
                  <h3 className="text-label-md font-bold text-on-surface mb-1">All caught up!</h3>
                  <p className="text-label-sm text-outline max-w-xs mx-auto">
                    No {activeTab === 'all' ? '' : activeTab} notifications yet. We&apos;ll let you know when something arrives.
                  </p>
                </div>
              ) : (
                (DATE_ORDER as readonly string[]).map((dateGroup) => {
                  const items = grouped[dateGroup]
                  if (!items) return null
                  return (
                    <div key={dateGroup}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-label-sm font-bold text-outline uppercase tracking-wider">{dateGroup}</span>
                        <div className="flex-1 h-px bg-outline-variant/40" />
                      </div>
                      <div className="space-y-1">
                        {items.map((n) => {
                        const Icon = TYPE_ICONS[n.type] || Bell
                        const isUnread = !n.read

                        return (
                          <button
                            key={n.id}
                            onClick={() => markOneRead(n.id)}
                            className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                              isUnread
                                ? 'bg-primary-container/30 hover:bg-primary-container/50'
                                : 'hover:bg-surface-container'
                            }`}
                          >
                            {/* Type icon badge */}
                            <div className={`relative flex-shrink-0 ${isUnread ? '' : 'opacity-70'}`}>
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                style={{ background: n.gradient }}
                              >
                                {n.initials}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${getTypeGradient(n.type)} flex items-center justify-center shadow-sm border-2 border-white`}>
                                <Icon className="w-2.5 h-2.5 text-white" />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-label-sm leading-relaxed">
                                <span className="font-semibold text-on-surface">{n.user}</span>
                                {n.verified && (
                                  <BadgeCheck className="w-3.5 h-3.5 text-primary inline-block ml-0.5 -mt-0.5" />
                                )}
                                {' '}
                                <span className="text-on-surface-variant">{n.action}</span>
                                {n.target && (
                                  <>
                                    <br />
                                    <span className={`text-label-sm ${isUnread ? 'text-on-surface font-medium' : 'text-outline'}`}>
                                      {n.target}
                                    </span>
                                  </>
                                )}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-outline">{n.time}</span>
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* Read indicator on hover */}
                            {isUnread && (
                              <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                <span className="w-2 h-2 rounded-full bg-primary/50 flex-shrink-0 block" />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="notifications" />
    </>
  )
}
