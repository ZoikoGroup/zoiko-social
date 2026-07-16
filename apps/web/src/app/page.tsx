'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { HomeFeed } from '@/components/feed/HomeFeed'
import { MobileTabs } from '@/components/MobileTabs'
import { RightPanel } from '@/components/RightPanel'
import { SafetyBanner } from '@/components/SafetyBanner'

// StoryComposer is only rendered when the user explicitly opens it (shareRef state),
// so we defer loading its heavy subcomponents (MusicPicker, StickerLayer, etc.).
const StoryComposer = dynamic(
  () => import('@/components/stories/StoryComposer').then((mod) => mod.StoryComposer),
  { ssr: false },
)

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
          {/* Left column — profile, pets, shortcuts */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          {/* Center column — Live Animal Updates + feed */}
          <div className="col-span-12 lg:col-span-6 space-y-gutter pb-20">
            <HomeFeed onShareToStory={(refType, refId) => setShareRef({ refType, refId })} />
          </div>

          {/* Right column — alerts, people, trending, events, verify */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="home" onNavigate={() => {}} />

      {/* Story Composer overlay — opened when sharing a post to a story */}
      {shareRef && (
        <Suspense fallback={null}>
          <StoryComposer
            onClose={() => setShareRef(null)}
            refType={shareRef.refType}
            refId={shareRef.refId}
          />
        </Suspense>
      )}
    </>
  )
}
