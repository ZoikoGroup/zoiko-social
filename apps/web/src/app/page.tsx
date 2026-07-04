'use client'

import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { StoryBar } from '@/components/StoryBar'
import { CreatePostBox } from '@/components/CreatePostBox'
import { PostCard } from '@/components/PostCard'
import { MobileTabs } from '@/components/MobileTabs'

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
  const { loading, isAuthenticated } = useAuth()

  // Content-shaped skeleton while auth resolves — no spinners
  // v2: trigger fresh Vercel build with new env vars
  if (loading) {
    return <FeedSkeleton />
  }

  // Shouldn't reach here since middleware redirects, but guard anyway
  if (!isAuthenticated) {
    return <></>
  }

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center Column: Stories, Create Post, Feed */}
          <div className="lg:col-span-9 space-y-gutter pb-20">
            <StoryBar />
            <CreatePostBox />
            <PostCard />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="home" onNavigate={() => {}} />
    </>
  )
}
