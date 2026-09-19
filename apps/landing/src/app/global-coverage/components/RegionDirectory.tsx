import React from 'react';
import Image from 'next/image';

const regions = [
  {
    name: 'Africa',
    image: '/global-coverage/image_5.png', // Elephant
    depth: 'Broad source depth',
    desc: 'Wildlife conservation, rescue, and enforcement reporting across the continent.',
    tags: ['Conservation', 'Wildlife Crime'],
    time: 'Updated 3 hours ago',
  },
  {
    name: 'Asia-Pacific',
    image: '/global-coverage/image_3.png', // Monkey statue
    depth: 'Active source depth',
    desc: 'Animal welfare, trafficking enforcement, and biodiversity coverage across the region.',
    tags: ['Wildlife Crime', 'Conservation'],
    time: 'Updated 1 hour ago',
  },
  {
    name: 'Europe',
    image: '/global-coverage/image_7.png', // Sheep
    depth: 'Broad source depth',
    desc: 'Policy, welfare regulation, and cross-border enforcement reporting.',
    tags: ['Conservation Policy', 'Animal Welfare'],
    time: 'Updated 6 hours ago',
  },
  {
    name: 'Latin America & Caribbean',
    image: '/global-coverage/image_8.png', // Soldier
    depth: 'Active source depth',
    desc: 'Rainforest conservation, rescue coordination, and wildlife-trade reporting.',
    tags: ['Conservation', 'Rescue'],
    time: 'Updated 9 hours ago',
  },
  {
    name: 'Middle East & North Africa',
    image: '/global-coverage/image_9.png', // Desert rocks
    depth: 'Emerging source depth',
    desc: 'Coverage is currently based on a limited source set for this region.',
    tags: ['Wildlife Crime'],
    time: 'Updated 2 days ago',
  },
  {
    name: 'North America',
    image: '/global-coverage/image_10.png', // Redwoods
    depth: 'Broad source depth',
    desc: 'Rescue, adoption policy, and wildlife-corridor reporting.',
    tags: ['Animal Welfare', 'Conservation'],
    time: 'Updated 22 minutes ago',
  },
  {
    name: 'Oceania',
    image: '/global-coverage/image_11.png', // Coastline
    depth: 'Active source depth',
    desc: 'Marine conservation, coastal rescue, and biodiversity reporting across the Pacific.',
    tags: ['Marine Biology', 'Conservation'],
    time: 'Updated 4 hours ago',
  },
];

export default function RegionDirectory() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-2">Region directory</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        Each region card links to that region's discovery view.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region, idx) => (
          <div key={idx} className="bg-white rounded-[16px] border border-[#DCE5E8] overflow-hidden flex flex-col shadow-sm">
            <div className="relative w-full h-[180px]">
              <Image src={region.image} alt={region.name} fill className="object-cover" />
              <div className="absolute top-4 right-4 bg-[#102A32]/80 backdrop-blur-sm text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md">
                {region.depth}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-[15px] font-extrabold text-[#102A32] leading-snug mb-2">{region.name}</h3>
              <p className="text-[12.5px] text-[#5E7076] mb-4 leading-relaxed">{region.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {region.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="bg-[#F7F9FA] border border-[#DCE5E8] text-[#5E7076] text-[10.5px] font-semibold px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                <p className="text-[11px] text-[#5E7076] mb-3">{region.time}</p>
                <button className="bg-transparent border border-[#DCE5E8] hover:bg-[#F7F9FA] text-[#102A32] text-[12px] font-bold px-4 py-1.5 rounded-full transition w-max">
                  View region
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
