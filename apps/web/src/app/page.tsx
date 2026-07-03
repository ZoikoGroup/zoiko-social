'use client'

import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { StoryBar } from '@/components/StoryBar'
import { CreatePostBox } from '@/components/CreatePostBox'
import { PostCard } from '@/components/PostCard'

import { MobileTabs } from '@/components/MobileTabs'

export default function HomePage(): React.JSX.Element {
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
