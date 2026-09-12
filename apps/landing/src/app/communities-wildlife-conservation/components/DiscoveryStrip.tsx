import React from "react";
import Image from "next/image";

const TOPICS = [
  { id: "habitat", label: "Habitat Conservation", image: "/communities-wildlife-conservation/forest,habitat.png" },
  { id: "species", label: "Species Monitoring", image: "/communities-wildlife-conservation/owl,wildlife.png" },
  { id: "community-science", label: "Community Science", image: "/communities-wildlife-conservation/birdwatching,binoculars.png" },
  { id: "policy", label: "Policy & Advocacy", image: "/communities-wildlife-conservation/elephant,savanna (1).png" },
  { id: "marine", label: "Marine & Coastal", image: "/communities-wildlife-conservation/coralreef,ocean (1).png" },
  { id: "pollinators", label: "Pollinators", image: "/communities-wildlife-conservation/bee,flower.png" },
  { id: "urban", label: "Urban Wildlife", image: "/communities-wildlife-conservation/fox,urban.png" },
];

export default function DiscoveryStrip() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[30px] tracking-[-0.2px]">
        Browse by conservation topic
      </div>

      <div className="flex flex-nowrap overflow-x-auto gap-x-[18px] pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
        {TOPICS.map((topic) => (
          <div key={topic.id} className="w-20 shrink-0 flex flex-col items-center gap-2 cursor-pointer">
            <div className="size-[76px] rounded-[18px] overflow-hidden outline outline-2 outline-offset-0 outline-zinc-200">
              <Image
                src={topic.image}
                alt={topic.label}
                width={76}
                height={76}
                className="size-full object-cover"
              />
            </div>
            <div className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] text-center leading-[15.6px]">
              {topic.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
