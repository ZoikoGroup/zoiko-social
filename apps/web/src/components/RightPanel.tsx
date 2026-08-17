'use client'

import { useState } from 'react'
import { useCachedValue } from '@/hooks/use-cache'
import Link from 'next/link'
import { useDateFormat } from '@/hooks/use-date-format'
import { Bell, AtSign, MapPin, TrendingUp, Calendar, ShieldCheck, ChevronRight, AlertTriangle, PawPrint, Info } from 'lucide-react'
import { LocationLink } from '@/components/LocationLink'
import { DocsHelpLink } from '@/components/DocsHelpLink'
import { UserAvatar } from './UserAvatar'
import { FollowButton, initialFollowState } from './FollowButton'
import { SkeletonWidget } from './Skeletons'
import { networkApi, hashtagsApi, eventsApi, lostFoundApi, type FollowSuggestion, type EventItem, type LostFoundReport } from '@/lib/api'
import { formatDateTime, formatDayLabel } from '@/lib/datetime'
import { useTranslations } from 'next-intl'
import { useProfessionalLabel } from '@/hooks/use-professional-label'

interface Trending { tag: string; postsCount: number }

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

function alertWhen(iso: string, locale: string): string {
  // formatDayLabel handles the today/yesterday wording per locale, so this no
  // longer hand-rolls the calendar comparison or the English words.
  return `${formatDayLabel(iso, locale)}  ·  ${formatDateTime(iso, locale, 'time')}`
}

function Section({
  title,
  href,
  icon,
  children,
}: {
  title: string
  href?: string
  icon?: React.ReactNode
  children: React.ReactNode
}): React.JSX.Element {
  const t = useTranslations('panel')
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-1.5 text-label-md font-bold text-on-surface">{icon}{title}</h3>
        {href && (
          <Link href={href} className="text-[11px] text-primary hover:underline font-medium">
            {t('viewAll')}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function eventDate(iso: string, locale: string): { mon: string; day: string } {
  const d = new Date(iso)
  return { mon: formatDateTime(d, locale, 'month').toUpperCase(), day: String(d.getDate()) }
}
function eventWhen(iso: string, locale: string): string {
  return formatDateTime(iso, locale, 'weekdayDayMonthTime')
}

type BottomTab = 'today' | 'trending' | 'trust'

export function RightPanel(): React.JSX.Element {
  const profLabel = useProfessionalLabel()
  const t = useTranslations('panel')
  const tm = useTranslations('modules')
  const { locale } = useDateFormat()
  const { data, isLoading: loading } = useCachedValue<{
    suggestions: FollowSuggestion[]; trending: Trending[]; events: EventItem[]; alerts: LostFoundReport[]
  }>('rightpanel', async () => {
    const [sug, trend, ev, lf] = await Promise.allSettled([
      networkApi.getSuggestions(), hashtagsApi.trending(), eventsApi.upcoming(null, 3), lostFoundApi.browse({}, null, 4),
    ])
    return {
      suggestions: sug.status === 'fulfilled' ? sug.value.slice(0, 4) : [],
      trending: trend.status === 'fulfilled' ? trend.value.slice(0, 5) : [],
      events: ev.status === 'fulfilled' ? ev.value.data.slice(0, 3) : [],
      alerts: lf.status === 'fulfilled' ? lf.value.data.slice(0, 4) : [],
    }
  })
  const suggestions = data?.suggestions ?? []
  const trending = data?.trending ?? []
  const events = data?.events ?? []
  const alerts = data?.alerts ?? []
  const [tab, setTab] = useState<BottomTab>('today')

  return (
    <div className="space-y-gutter">
      {/* Local Alerts — recent lost & found reports */}
      <Section title={t('localAlerts')} href="/lost-found" icon={<Bell className="w-4 h-4 text-on-surface-variant" />}>
        {loading ? (
          <SkeletonWidget />
        ) : alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-label-sm text-outline py-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{t('noAlerts')}</span>
          </div>
        ) : (
          <div className="space-y-3.5">
            {alerts.map((a) => {
              const lost = a.kind === 'lost'
              return (
                <Link key={a.id} href={`/lost-found/${a.id}`} className="flex items-start gap-3 group">
                  <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${lost ? 'bg-secondary/15' : 'bg-emerald-500/15'}`}>
                    {lost ? <AlertTriangle className="w-4 h-4 text-secondary" /> : <PawPrint className="w-4 h-4 text-emerald-600" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {lost ? t('reportedLost', { name: a.petName ?? a.species }) : t('reportedFound', { name: a.petName ?? a.species })}
                    </p>
                    {a.lastSeenLocation && <LocationLink location={a.lastSeenLocation} showIcon={false} className="text-[11px] text-outline max-w-full" />}
                    <p className="text-[11px] text-outline">{alertWhen(a.createdAt, locale)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Section>

      {/* People & Orgs to Follow — real network suggestions */}
      <Section title={t('peopleToFollow')} href="/network">
        {loading ? (
          <SkeletonWidget />
        ) : suggestions.length === 0 ? (
          <p className="text-label-sm text-outline py-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {t('noSuggestions')}
          </p>
        ) : (
          <div className="space-y-3.5">
            {suggestions.map((person) => {
              const categoryLabel = person.professionalCategory
                ? profLabel(person.professionalCategory)
                : null
              return (
                <div key={person.id} className="flex items-center gap-3">
                  <Link href={`/profile/${person.username}`}>
                    <UserAvatar name={person.displayName} image={person.avatarUrl ?? undefined} size="md" verified={person.isVerified} />
                  </Link>
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link href={`/profile/${person.username}`} className="text-label-sm font-semibold truncate hover:underline">
                      {person.displayName}
                    </Link>
                    <span className="text-[11px] text-outline leading-tight truncate">
                      {categoryLabel ?? (
                        <span className="flex items-center gap-0.5"><AtSign className="w-2.5 h-2.5" />{person.username}</span>
                      )}
                    </span>
                  </div>
                  <FollowButton
                    userId={person.id}
                    initialState={initialFollowState(person)}
                    followsViewer={!!person.followsViewer}
                    className="px-3 py-1 text-[12px] flex-shrink-0"
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Today / Trending / Trust tabbed widget */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="flex items-center gap-5 px-4 pt-3 border-b border-outline-variant/30">
          {([['today', t('today')], ['trending', t('trending')], ['trust', t('trust')]] as [BottomTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2.5 -mb-px text-label-sm font-semibold border-b-[2.5px] transition-colors cursor-pointer ${
                tab === key ? 'text-on-surface border-secondary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'today' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-label-md font-bold text-on-surface">{tm('events')}</h4>
                <Link href="/events" className="text-[11px] text-primary hover:underline font-medium">{t('viewAll')}</Link>
              </div>
              {loading ? (
                <SkeletonWidget />
              ) : events.length === 0 ? (
                <div className="flex items-center gap-2 text-label-sm text-outline py-2">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{t('noEvents')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((e) => {
                    const d = eventDate(e.startsAt, locale)
                    return (
                      <Link key={e.id} href="/events" className="flex items-center gap-3 group">
                        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-primary/10 flex-shrink-0">
                          <span className="text-[9px] font-bold text-primary leading-none">{d.mon}</span>
                          <span className="text-label-md font-bold text-primary leading-tight">{d.day}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{e.title}</p>
                          <p className="text-[11px] text-outline truncate">{eventWhen(e.startsAt, locale)}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'trending' && (
            loading ? (
              <SkeletonWidget />
            ) : trending.length === 0 ? (
              <div className="flex items-center gap-2 text-label-sm text-outline py-2">
                <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{t('nothingTrending')}</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {trending.map((t) => (
                  <Link key={t.tag} href={`/explore/tags/${encodeURIComponent(t.tag)}`} className="flex items-center justify-between group">
                    <span className="flex items-center gap-1.5 text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      #{t.tag}
                    </span>
                    <span className="text-[11px] text-outline flex-shrink-0">{formatCount(t.postsCount)} posts</span>
                  </Link>
                ))}
              </div>
            )
          )}

          {tab === 'trust' && (
            <div>
              <div className="flex items-start gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-label-md font-bold text-on-surface leading-tight">{t('buildTrust')}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">{t('buildTrustBody')}</p>
                  <DocsHelpLink href="/docs/profile-and-pets#professional-verification" label={t('learnMore')} className="mt-1" />
                </div>
              </div>
              <Link
                href="/settings"
                className="flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {t('verifyProfile')}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap gap-x-3 gap-y-1.5 px-2 text-[11px] text-outline">
        <Link href="/docs/getting-started" className="hover:text-primary hover:underline">{t('about')}</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">{t('accessibility')}</Link>
        <Link href="/docs" className="hover:text-primary hover:underline">{tm('helpCenter')}</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">{t('privacyTerms')}</Link>
        <Link href="/settings" className="hover:text-primary hover:underline">{t('adChoices')}</Link>
        <Link href="/docs/safety-and-trust" className="hover:text-primary hover:underline">{t('guidelines')}</Link>
        <p className="mt-1.5 w-full">&copy; 2026 ZoikoSocial. All rights reserved.</p>
      </footer>
    </div>
  )
}
