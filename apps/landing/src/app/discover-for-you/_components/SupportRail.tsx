import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldAlert, ArrowRight } from 'lucide-react'

export function InterestsWidget() {
  const interests = ['Dogs', 'Rescue', 'Conservation', 'Wildlife', 'Adoption']

  return (
    <div className="bg-white border border-teal-wash/30 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[15px] text-[#102A32]">Your interests</h3>
        <button className="text-[13px] font-medium text-[#066879] hover:opacity-80 transition-opacity">
          Tune feed
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map(interest => (
          <span key={interest} className="px-3 h-[32px] flex items-center justify-center border border-[#DCE5E8] bg-[#EEF8F9] rounded-full text-[12px] font-semibold text-[#073B47] hover:brightness-95 transition-all cursor-pointer">
            {interest}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SuggestedCommunitiesWidget() {
  const communities = [
    {
      id: 1,
      name: 'Wildlife Photographers United',
      context: 'Related to Conservation',
      image: '/discover-for-you/community-wildlife.png'
    },
    {
      id: 2,
      name: 'Senior Dog Sanctuary Network',
      context: 'Popular in Rescue',
      image: '/discover-for-you/community-senior-dog.png'
    },
    {
      id: 3,
      name: 'Reptile & Exotic Pet Care',
      context: 'Related to your interests',
      image: '/discover-for-you/community-reptile.png'
    }
  ]

  return (
    <div className="bg-white border border-teal-wash/30 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[15px] text-teal-deep">Suggested communities</h3>
        <Link href="/communities" className="text-[13px] font-medium text-teal-light hover:text-teal-deep transition-colors">
          See all
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {communities.map(c => (
          <div key={c.id} className="flex items-center gap-3 group">
            <Image src={c.image} alt={c.name} width={42} height={42} className="rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[14px] text-teal-deep leading-tight line-clamp-2 group-hover:text-teal-light transition-colors cursor-pointer">
                {c.name}
              </h4>
              <p className="text-[12px] text-teal-muted truncate mt-0.5">
                {c.context}
              </p>
            </div>
            <button className="px-4 h-[32px] flex items-center justify-center text-[12px] font-semibold text-[#073B47] bg-[#EEF8F9] border border-[#DCE5E8] rounded-full hover:brightness-95 transition-all flex-shrink-0">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrendingWidget() {
  const trending = [
    {
      id: '01',
      title: 'New research on canine cognitive development',
      topic: 'Vet Science · United States'
    },
    {
      id: '02',
      title: 'Marine life rescue operation underway',
      topic: 'Rescue Response · Australia'
    },
    {
      id: '03',
      title: 'Animal shelter capacity initiative launched',
      topic: 'Welfare · United Kingdom'
    },
    {
      id: '04',
      title: 'Wildlife photographer captures rare snow leopard',
      topic: 'Conservation · Nepal'
    }
  ]

  return (
    <div className="bg-white border border-teal-wash/30 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[15px] text-teal-deep">Trending Now</h3>
        <button className="text-[13px] font-medium text-teal-light hover:text-teal-deep transition-colors">
          View all
        </button>
      </div>
      <div className="flex flex-col gap-5">
        {trending.map(item => (
          <div key={item.id} className="flex gap-3 group cursor-pointer">
            <span className="text-[13px] font-bold text-teal-deep w-4 flex-shrink-0 pt-0.5">{item.id}</span>
            <div className="flex-1">
              <h4 className="font-bold text-[14px] text-teal-deep leading-snug mb-1 group-hover:text-teal-light transition-colors">
                {item.title}
              </h4>
              <p className="text-[12px] text-teal-muted">
                {item.topic}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SafetyBannerWidget() {
  return (
    <div className="bg-[#EEF8F9] border border-teal-wash/30 rounded-2xl p-5 shadow-sm">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4">
        <ShieldAlert className="w-5 h-5 text-teal-deep" />
      </div>
      <h3 className="font-bold text-[16px] text-teal-deep leading-tight mb-2">
        Encountering something concerning?
      </h3>
      <p className="text-[13px] text-teal-muted mb-4">
        Learn how Zoiko Social handles safety and animal welfare reports.
      </p>
      <Link href="/safety" className="text-[14px] font-bold text-teal-light hover:text-teal-light/80 transition-colors flex items-center gap-1.5 w-fit">
        Visit Safety Center <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}


