import Link from 'next/link'
import { ChevronLeft, Settings } from 'lucide-react'
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
          {/* Top row: back + settings (settings is the mobile entry point — the
              avatar menu that holds it on desktop doesn't exist on phones) */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Full-width profile header */}
          <div className="mb-gutter">
            <ProfileHeader />
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
