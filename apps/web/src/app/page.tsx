'use client'

import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { StoryBar } from '@/components/StoryBar'
import { CreatePostBox } from '@/components/CreatePostBox'
import { PostCard } from '@/components/PostCard'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'

export default function HomePage(): React.JSX.Element {
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

          {/* Center Column: Stories, Create Post, Feed */}
          <div className="lg:col-span-6 space-y-gutter pb-20">
            <StoryBar />
            <CreatePostBox />
            <PostCard />
          </div>

          {/* Right Column: Suggestions, Trending, Footer */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="home" onNavigate={() => {}} />
    </>
  )
}
