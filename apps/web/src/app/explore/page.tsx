'use client'

import { Compass } from 'lucide-react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import { ExploreFeed } from '@/components/feed/ExploreFeed'
import { useAuth } from '@/hooks/use-auth'

export default function ExplorePage(): React.JSX.Element {
  const { loading, isAuthenticated } = useAuth()

  if (loading) return <div className="min-h-screen bg-background" />
  if (!isAuthenticated) return <></>

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center: Explore feed */}
          <div className="lg:col-span-9 space-y-gutter pb-20 max-w-2xl">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-headline text-headline-md text-on-surface leading-tight">Explore</h1>
                <p className="text-label-sm text-outline">Public posts from across ZoikoSocial</p>
              </div>
            </div>
            <ExploreFeed />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="home" onNavigate={() => {}} />
    </>
  )
}
