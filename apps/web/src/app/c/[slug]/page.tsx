'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Users, Lock, BadgeCheck, Globe, Mail, ScrollText, UsersRound, Settings, UserPlus } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { JoinButton } from '@/components/communities/JoinButton'
import { MembersModal } from '@/components/communities/MembersModal'
import { CommunitySettingsModal } from '@/components/communities/CommunitySettingsModal'
import { InviteModal } from '@/components/communities/InviteModal'
import { CommunityFeed } from '@/components/communities/CommunityFeed'
import { communitiesApi, ApiError, type Community } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

type Tab = 'posts' | 'about' | 'members'

const PRIVACY_ICON = { public: Globe, private: Lock, invite_only: Mail } as const

export default function CommunityPage({ params }: { params: Promise<{ slug: string }> }): React.JSX.Element {
  const { slug } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [community, setCommunity] = useState<Community | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [tab, setTab] = useState<Tab>('posts')
  const [membersOpen, setMembersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      try {
        // Invite-link landing: accept the code, then load fresh membership state
        const inviteCode = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('invite')
          : null
        if (inviteCode) {
          try {
            await communitiesApi.acceptInvite(inviteCode)
            // Clean the code from the URL
            const url = new URL(window.location.href)
            url.searchParams.delete('invite')
            window.history.replaceState({}, '', url.toString())
          } catch { /* invalid/expired/rules — page still loads, user can Join */ }
        }
        const c = await communitiesApi.get(slug)
        if (!cancelled) setCommunity(c)
      } catch (e) {
        if (!cancelled && e instanceof ApiError) setNotFound(true)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [slug])

  const isMember = community?.viewerStatus === 'active'
  const isPrivateLocked = community && community.privacy !== 'public' && !isMember
  const canManage = community?.viewerRole === 'owner' || community?.viewerRole === 'admin'
  const PrivacyIcon = community ? PRIVACY_ICON[community.privacy as keyof typeof PRIVACY_ICON] ?? Globe : Globe

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-0 py-gutter pb-24">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/communities" className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer" aria-label="Back">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>

          {notFound ? (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-16 text-center">
              <UsersRound className="w-10 h-10 text-outline mx-auto mb-4" />
              <h1 className="font-headline text-headline-md text-on-surface">Community not found</h1>
              <p className="text-label-md text-outline mt-2">This community doesn&apos;t exist or isn&apos;t available.</p>
              <Link href="/communities" className="inline-block mt-5 px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors">
                Browse communities
              </Link>
            </section>
          ) : !community ? (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="h-40 bg-surface-container animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-48 bg-surface-container rounded animate-pulse" />
                <div className="h-3 w-64 bg-surface-container rounded animate-pulse" />
              </div>
            </section>
          ) : (
            <>
              {/* Header card */}
              <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden mb-gutter">
                <div className="h-40 bg-gradient-to-br from-primary/40 via-primary/15 to-secondary/25 relative">
                  {community.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={community.coverUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="px-5 pb-5">
                  <div className="flex items-end justify-between -mt-8 mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 border-4 border-surface-container-lowest overflow-hidden flex items-center justify-center">
                      {community.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="mt-10 flex items-center gap-2">
                      {canManage && (
                        <>
                          <button
                            onClick={() => setInviteOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4" /><span className="hidden sm:inline">Invite</span>
                          </button>
                          <button
                            onClick={() => setSettingsOpen(true)}
                            className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                            aria-label="Community settings"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user && <JoinButton community={community} className="px-5 py-2" onChange={() => communitiesApi.get(slug).then(setCommunity).catch(() => {})} />}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-headline text-headline-lg text-on-surface">{community.name}</h1>
                    {community.isVerified && <BadgeCheck className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-label-sm text-outline">
                    <span className="flex items-center gap-1"><PrivacyIcon className="w-3.5 h-3.5" />{community.privacy.replace('_', ' ')}</span>
                    <button onClick={() => setMembersOpen(true)} className="flex items-center gap-1 hover:text-on-surface cursor-pointer">
                      <Users className="w-3.5 h-3.5" />{community.membersCount.toLocaleString()} members
                    </button>
                    {community.category && <span className="capitalize">{community.category.label}</span>}
                  </div>
                  {community.description && (
                    <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed">{community.description}</p>
                  )}
                  {community.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {community.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[11px] rounded-full">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Tabs */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm mb-gutter">
                <div className="flex">
                  {(['posts', 'about', 'members'] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 px-4 py-3.5 text-label-md font-semibold border-b-2 capitalize transition-colors cursor-pointer ${
                        tab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              {tab === 'posts' && (
                isPrivateLocked ? (
                  <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-outline-variant flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7 text-outline" />
                    </div>
                    <h2 className="text-label-md font-bold text-on-surface">This community is private</h2>
                    <p className="text-label-sm text-outline mt-1 max-w-xs mx-auto">
                      {community.viewerStatus === 'pending' ? 'Your join request is pending approval.' : 'Join to see posts and members.'}
                    </p>
                  </section>
                ) : (
                  <CommunityFeed communityId={community.id} isMember={isMember} />
                )
              )}

              {tab === 'about' && (
                <div className="space-y-gutter">
                  {community.description && (
                    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
                      <h3 className="text-label-md font-bold text-on-surface mb-2">About</h3>
                      <p className="text-body-md text-on-surface-variant leading-relaxed">{community.description}</p>
                    </section>
                  )}
                  {community.rules.length > 0 && (
                    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
                      <h3 className="flex items-center gap-2 text-label-md font-bold text-on-surface mb-4">
                        <ScrollText className="w-4 h-4 text-primary" />Rules
                      </h3>
                      <div className="space-y-3">
                        {community.rules.map((rule, i) => (
                          <div key={rule.id} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-label-sm font-bold flex items-center justify-center">{i + 1}</span>
                            <div>
                              <p className="font-semibold text-label-md text-on-surface">{rule.title}</p>
                              {rule.body && <p className="text-label-sm text-on-surface-variant mt-0.5">{rule.body}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {tab === 'members' && (
                isPrivateLocked ? (
                  <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-12 text-center">
                    <Lock className="w-8 h-8 text-outline mx-auto mb-3" />
                    <p className="text-label-md font-semibold text-on-surface">Members are private</p>
                    <p className="text-label-sm text-outline mt-1">Join to see who&apos;s here.</p>
                  </section>
                ) : (
                  <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 text-center">
                    <button onClick={() => setMembersOpen(true)} className="px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                      View all {community.membersCount.toLocaleString()} members
                    </button>
                  </section>
                )
              )}

              <MembersModal
                open={membersOpen}
                communityId={community.id}
                memberCount={community.membersCount}
                onClose={() => setMembersOpen(false)}
              />
              <CommunitySettingsModal
                open={settingsOpen}
                community={community}
                onClose={() => setSettingsOpen(false)}
                onSaved={(updated) => { setCommunity(updated); setSettingsOpen(false) }}
                onDeleted={() => router.push('/communities')}
              />
              <InviteModal
                open={inviteOpen}
                communityId={community.id}
                onClose={() => setInviteOpen(false)}
              />
            </>
          )}
        </div>
      </main>
      <MobileTabs currentPage="communities" />
    </>
  )
}
