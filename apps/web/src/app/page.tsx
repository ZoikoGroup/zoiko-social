'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { HomeFeed } from '@/components/feed/HomeFeed'
import { MobileTabs } from '@/components/MobileTabs'
import { RightPanel } from '@/components/RightPanel'
import { SafetyBanner } from '@/components/SafetyBanner'
import { StoryTray } from '@/components/stories/StoryTray'
import { StoryViewer } from '@/components/stories/StoryViewer'
import { StoryComposer } from '@/components/stories/StoryComposer'

function FeedSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-container-max mx-auto px-2 md:px-5 flex flex-col lg:grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-4 hidden lg:block">
          <div className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
          <div className="h-40 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
        </div>
        <div className="lg:col-span-9 space-y-4">
          <div className="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
          <div className="h-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
          <div className="h-96 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage(): React.JSX.Element {
  const [viewerAuthorId, setViewerAuthorId] = useState<string | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [shareRef, setShareRef] = useState<{ refType: string; refId: string } | null>(null)
  const { loading, isAuthenticated } = useAuth()

  // Fallback client redirect: if the server let us through but the client has no
  // session (e.g. cookie/session desync), go to login instead of a blank screen.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.replace('/login')
    }
  }, [loading, isAuthenticated])

  // Content-shaped skeleton while auth resolves (or during the redirect above) — never a blank page
  if (loading || !isAuthenticated) {
    return <FeedSkeleton />
  }

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        {/* Full-width safety/welfare banner */}
        <SafetyBanner />

        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left column — profile, pets, groups, explore */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center column — Field Updates + composer + feed */}
          <div className="col-span-12 lg:col-span-6 space-y-gutter pb-20">
            <StoryTray
              onOpenRing={(authorId) => setViewerAuthorId(authorId)}
              onOpenComposer={() => setComposerOpen(true)}
            />
            <HomeFeed onShareToStory={(refType, refId) => setShareRef({ refType, refId })} />
          </div>

          {/* Right column — alerts, people, trending, events, verify */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {/* Story Viewer overlay */}
      {viewerAuthorId && (
        <StoryViewer
          initialAuthorId={viewerAuthorId}
          onClose={() => setViewerAuthorId(null)}
        />
      )}

      {/* Story Composer overlay */}
      {(composerOpen || shareRef) && (
        <StoryComposer
          onClose={() => { setComposerOpen(false); setShareRef(null) }}
          {...(shareRef ? { refType: shareRef.refType, refId: shareRef.refId } : {})}
        />
      )}
    </>
  )
}
