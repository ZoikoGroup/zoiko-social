'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import { UserAvatar } from '@/components/UserAvatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UserPlus, Users, BadgeCheck, ChevronLeft, Bell, CheckCheck, Megaphone,
} from 'lucide-react'
import { SkeletonNotification } from '@/components/Skeletons'
import { notificationsApi, networkApi, type NotificationItem } from '@/lib/api'
import { useNotifications } from '@/hooks/use-notifications'

type NotificationTab = 'all' | 'followers' | 'requests' | 'system'

const TABS: { id: NotificationTab; label: string; Icon: typeof Bell; types: string[] }[] = [
  { id: 'all',       label: 'All',       Icon: Bell,      types: [] },
  { id: 'followers', label: 'Followers', Icon: Users,     types: ['new_follower', 'follow_request_accepted'] },
  { id: 'requests',  label: 'Requests',  Icon: UserPlus,  types: ['follow_request'] },
  { id: 'system',    label: 'System',    Icon: Megaphone, types: ['verification_approved', 'verification_rejected', 'system'] },
]

const TYPE_ICONS: Record<string, typeof Bell> = {
  new_follower: Users,
  follow_request: UserPlus,
  follow_request_accepted: CheckCheck,
  verification_approved: BadgeCheck,
  verification_rejected: BadgeCheck,
}

function typeGradient(type: string): string {
  const map: Record<string, string> = {
    new_follower: 'from-emerald-500 to-teal-400',
    follow_request: 'from-blue-500 to-cyan-400',
    follow_request_accepted: 'from-primary to-teal-400',
    verification_approved: 'from-amber-500 to-orange-400',
    verification_rejected: 'from-slate-500 to-gray-400',
  }
  return map[type] ?? 'from-primary to-secondary'
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationsPage(): React.JSX.Element {
  const router = useRouter()
  const { latest, markAllRead: markAllReadGlobal, markRead: markReadGlobal } = useNotifications()
  const [activeTab, setActiveTab] = useState<NotificationTab>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    notificationsApi.list(1, 50)
      .then((result) => { if (!cancelled) setNotifications(result.data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Local read-state overlay (applied at render — no effects needed)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [allRead, setAllRead] = useState(false)
  // Follow-request action overlays: accepted stays visible, declined disappears
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())
  const [declinedIds, setDeclinedIds] = useState<Set<string>>(new Set())
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  // Realtime arrivals merge in at render time (derived, not synced via effect)
  const merged = latest && !notifications.some((n) => n.id === latest.id)
    ? [latest, ...notifications]
    : notifications
  const withReadState = merged
    .filter((n) => !declinedIds.has(n.id))
    .map((n) => ({
      ...n,
      isRead: n.isRead || allRead || readIds.has(n.id),
    }))

  const activeTypes = TABS.find((t) => t.id === activeTab)?.types ?? []
  const filtered = activeTab === 'all'
    ? withReadState
    : withReadState.filter((n) => activeTypes.includes(n.type))

  const unreadCount = withReadState.filter((n) => !n.isRead).length

  async function handleMarkAllRead(): Promise<void> {
    setAllRead(true)
    await markAllReadGlobal().catch(() => {})
  }

  function handleClick(n: NotificationItem): void {
    if (!n.isRead) {
      setReadIds((prev) => new Set(prev).add(n.id))
      void markReadGlobal(n.id).catch(() => {})
    }
    // Navigate to the actor's profile when we know who it is
    const username = n.data?.username as string | undefined
    if (username) {
      router.push(`/profile/${username}`)
    }
  }

  /** Inline Accept/Decline on follow-request notifications (Instagram parity). */
  async function respondToRequest(n: NotificationItem, action: 'accept' | 'reject'): Promise<void> {
    const requestId = n.data?.requestId as string | undefined
    if (!requestId || busyIds.has(n.id)) return
    setBusyIds((prev) => new Set(prev).add(n.id))
    try {
      if (action === 'accept') {
        await networkApi.acceptRequest(requestId)
        setAcceptedIds((prev) => new Set(prev).add(n.id))
      } else {
        await networkApi.rejectRequest(requestId)
        setDeclinedIds((prev) => new Set(prev).add(n.id))
      }
      setReadIds((prev) => new Set(prev).add(n.id))
    } catch {
      // Request may already be processed elsewhere — refresh state silently
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(n.id)
        return next
      })
    }
  }

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
                  onClick={handleMarkAllRead}
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
                  const count = withReadState.filter((n) =>
                    !n.isRead && (tab.id === 'all' || tab.types.includes(n.type)),
                  ).length
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
            {loading ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-2 space-y-1">
                {Array.from({ length: 5 }, (_, i) => <SkeletonNotification key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-7 h-7 text-outline" />
                </div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">All caught up!</h3>
                <p className="text-label-sm text-outline max-w-xs mx-auto">
                  No {activeTab === 'all' ? '' : `${activeTab} `}notifications yet. When someone follows you or
                  interacts with your profile, it shows up here instantly.
                </p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-2 space-y-1">
                {filtered.map((n) => {
                  const Icon = TYPE_ICONS[n.type] ?? Bell
                  const actorUsername = n.data?.username as string | undefined
                  const requestStatus = n.data?.status as string | undefined
                  const isPendingRequest =
                    n.type === 'follow_request' &&
                    !!n.data?.requestId &&
                    requestStatus !== 'accepted' &&
                    !acceptedIds.has(n.id)
                  const isAcceptedRequest =
                    n.type === 'follow_request' &&
                    (requestStatus === 'accepted' || acceptedIds.has(n.id))
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                        n.isRead ? 'hover:bg-surface-container' : 'bg-primary-container/30 hover:bg-primary-container/50'
                      }`}
                    >
                      {/* Actor avatar + type badge */}
                      <div className={`relative flex-shrink-0 ${n.isRead ? 'opacity-80' : ''}`}>
                        <UserAvatar name={actorUsername ?? n.title} size="md" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${typeGradient(n.type)} flex items-center justify-center shadow-sm border-2 border-white`}>
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-label-sm leading-relaxed">
                          <span className="font-semibold text-on-surface">{n.title}</span>
                          {n.body && (
                            <>
                              <br />
                              <span className={n.isRead ? 'text-outline' : 'text-on-surface-variant'}>{n.body}</span>
                            </>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-outline">{timeAgo(n.createdAt)}</span>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                          {isAcceptedRequest && (
                            <span className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                              <CheckCheck className="w-3 h-3" />Accepted
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inline Accept / Decline — persists until acted on */}
                      {isPendingRequest && (
                        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => respondToRequest(n, 'accept')}
                            disabled={busyIds.has(n.id)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respondToRequest(n, 'reject')}
                            disabled={busyIds.has(n.id)}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
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
