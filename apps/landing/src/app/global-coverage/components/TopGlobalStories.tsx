import React from 'react';
import Image from 'next/image';

const stories = [
  {
    id: 1,
    regionTag: 'North America',
    image: '/global-coverage/image_3.png',
    tiers: ['Pacific Conservation Trust · Tier 1', 'Conservation'],
    title: 'Regional wildlife corridor moves to active protection',
    time: 'Updated 34 min ago',
    followLabel: 'Follow North America'
  },
  {
    id: 2,
    regionTag: 'Asia-Pacific',
    image: '/global-coverage/image_2.png',
    tiers: ['Regional Customs Enforcement Bureau · Tier 1', 'Wildlife Crime'],
    title: 'Multi-country ivory trafficking network dismantled',
    time: 'Updated 22 min ago',
    followLabel: 'Follow Asia-Pacific'
  },
  {
    id: 3,
    regionTag: 'Europe',
    image: '/global-coverage/image_3.png',
    tiers: ['European Policy Desk · Tier 2', 'Animal Welfare'],
    title: 'New shelter funding policy proposed across member states',
    translation: 'Human-translated',
    time: 'Published 1 day ago',
    followLabel: 'Follow Europe'
  },
  {
    id: 4,
    regionTag: 'Africa',
    image: '/global-coverage/image_3.png',
    tiers: ['National Park Enforcement Authority · Tier 1', 'Conservation'],
    title: 'Anti-poaching patrol reports quarterly decline in incidents',
    time: 'Published 4 days ago',
    followLabel: 'Follow Africa'
  },
  {
    id: 5,
    regionTag: 'Latin America & Caribbean',
    image: '/global-coverage/image_3.png',
    tiers: ['Amazonia Wildlife Watch · Tier 2', 'Rescue'],
    title: 'Rainforest rescue network expands foster coordination',
    translation: 'Machine-assisted (reviewed)',
    time: 'Published 2 days ago',
    followLabel: 'Follow Latin America'
  },
  {
    id: 6,
    regionTag: 'Oceania',
    image: '/global-coverage/image_4.png',
    correction: 'Corrected: Corrected figures for the surveyed reef area.',
    tiers: ['Marine Ecology Review · Tier 1', 'Conservation'],
    title: 'Reef monitoring shows mixed recovery signals after correction',
    time: 'Updated 5 hours ago',
    followLabel: 'Follow Oceania'
  },
];

export default function TopGlobalStories() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-2">Top global stories</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        A fresh, cross-region mix — no single region dominates this rail.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-[16px] border border-[#DCE5E8] overflow-hidden flex flex-col shadow-sm">
            <div className="relative w-full h-[220px]">
              <Image 
                src={story.image} 
                alt={story.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#102A32]/80 backdrop-blur-sm text-white text-[10.5px] font-bold px-2 py-1 rounded-md">
                {story.regionTag}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              {story.correction && (
                <div className="bg-[#EEF8F9] text-[#066879] text-[11px] font-bold px-3 py-2 rounded-md mb-3">
                  {story.correction}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-3">
                {story.tiers.map((tier, idx) => (
                  <span key={idx} className="bg-[#F7F9FA] border border-[#DCE5E8] text-[#102A32] text-[10.5px] font-bold px-2 py-1 rounded-md">
                    {tier}
                  </span>
                ))}
              </div>
              
              <h3 className="text-[15px] font-extrabold text-[#102A32] leading-snug mb-2">
                {story.title}
              </h3>
              
              {story.translation && (
                <div className="mb-2">
                  <span className="bg-[#FFF5E8] text-[#C9701A] text-[10.5px] font-bold px-2 py-1 rounded-md">
                    {story.translation}
                  </span>
                </div>
              )}
              
              <p className="text-[11px] text-[#5E7076] mb-4">{story.time}</p>
              
              <div className="mt-auto">
                <div className="flex gap-2 mb-4">
                  <button className="bg-[#066879] hover:bg-[#073B47] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full transition">
                    Read Story
                  </button>
                  <button className="bg-transparent border border-[#DCE5E8] hover:bg-[#F7F9FA] text-[#102A32] text-[12px] font-semibold px-4 py-1.5 rounded-full transition">
                    Save
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#5E7076] font-medium">
                  <button className="hover:text-[#102A32] transition">Share</button>
                  <button className="hover:text-[#102A32] transition">{story.followLabel}</button>
                  <button className="hover:text-[#102A32] transition">Report an inaccuracy</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
