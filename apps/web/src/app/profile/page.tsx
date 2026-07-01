import { Header } from '@/components/Header'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileTabs } from '@/components/ProfileTabs'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'

export default function ProfilePage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          {/* Full-width profile header */}
          <div className="mb-gutter">
            <ProfileHeader isOwnProfile={true} />
          </div>

          {/* 3-col grid below */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
            {/* Left: pets + communities */}
            <div className="lg:col-span-3 space-y-gutter hidden lg:block">
              <MyPetsWidget />
              <CommunitiesWidget />
            </div>

            {/* Center: tabs + content */}
            <div className="lg:col-span-6 pb-20">
              <ProfileTabs />
            </div>

            {/* Right: suggestions */}
            <div className="lg:col-span-3 space-y-gutter hidden xl:block">
              <RightPanel />
            </div>
          </div>
        </div>
      </main>
      <MobileTabs currentPage="profile" />
    </>
  )
}
