import React from 'react'
import { SlidersHorizontal, ArrowUp } from 'lucide-react'
import { 
  CommunityPostCard, 
  VerifiedNewsCard, 
  AdoptionCard, 
  EventCard, 
  AnimalProfileUpdateCard, 
  SensitiveContentCard, 
  CaughtUpState 
} from './_components/FeedCards'
import { 
  InterestsWidget, 
  SuggestedCommunitiesWidget, 
  TrendingWidget, 
  SafetyBannerWidget 
} from './_components/SupportRail'

export default function DiscoverForYouPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-20 font-inter pt-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-0 xl:pl-[105px]">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-[12.5px] font-bold text-[#5E7076] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Discover / For You
          </div>
          <h1 className="text-[32px] leading-tight font-bold text-teal-deep font-montserrat mb-2">For You</h1>
          <p className="text-[14px] text-[#64748B]">
            A feed tuned to the animals and communities you follow.<br />
            <span className="text-[13px] opacity-80">Shape what you see with follows, interests, and feed controls.</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Feed Column */}
          <div className="w-full max-w-[720px] flex flex-col gap-6">
            {/* Filter Pills & Buttons */}
            <div className="flex items-center gap-6 mb-4 w-full overflow-hidden">
              <button className="flex items-center justify-center gap-2 px-5 h-10 rounded-full bg-[#066879] text-white hover:bg-teal-mid transition-colors flex-shrink-0">
                <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="text-[14px] font-bold">Tune Feed</span>
              </button>
              
              <div 
                className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <button className="px-6 h-10 rounded-full text-[14px] font-bold bg-[#066879] text-white hover:bg-teal-mid transition-colors whitespace-nowrap flex-shrink-0">All</button>
                <button className="px-6 h-10 rounded-full text-[14px] font-bold text-teal-muted bg-white border border-teal-wash hover:bg-teal-pale transition-colors whitespace-nowrap flex-shrink-0">Following</button>
                <button className="px-6 h-10 rounded-full text-[14px] font-bold text-teal-muted bg-white border border-teal-wash hover:bg-teal-pale transition-colors whitespace-nowrap flex-shrink-0">Communities</button>
                <button className="px-6 h-10 rounded-full text-[14px] font-bold text-teal-muted bg-white border border-teal-wash hover:bg-teal-pale transition-colors whitespace-nowrap flex-shrink-0">News</button>
                <button className="px-6 h-10 rounded-full text-[14px] font-bold text-teal-muted bg-white border border-teal-wash hover:bg-teal-pale transition-colors whitespace-nowrap flex-shrink-0">Events</button>
              </div>

              <button className="flex items-center justify-center gap-1.5 px-5 h-10 bg-white border border-[#066879] text-[#066879] rounded-full hover:bg-teal-pale transition-colors flex-shrink-0 ml-2">
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[14px] font-bold whitespace-nowrap">3 new posts</span>
              </button>
            </div>

              {/* Feed Content */}
              <div className="flex flex-col gap-5">
                <CommunityPostCard />
                <VerifiedNewsCard />
                <AdoptionCard />
                <EventCard />
                <AnimalProfileUpdateCard />
                <SensitiveContentCard />
                <CaughtUpState />
              </div>
            </div>

            {/* Support Rail */}
            <div className="w-full max-w-[320px] flex flex-col gap-5 mt-8 lg:mt-[64px]">
              <InterestsWidget />
              <SuggestedCommunitiesWidget />
              <TrendingWidget />
              <SafetyBannerWidget />
            </div>
          </div>
      </div>
    </div>
  )
}
