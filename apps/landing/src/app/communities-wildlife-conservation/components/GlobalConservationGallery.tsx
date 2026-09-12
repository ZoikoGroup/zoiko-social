import React from "react";
import Image from "next/image";

const REGIONS = [
  { id: "forest", label: "Forest habitats", image: "/communities-wildlife-conservation/rainforest,canopy.png" },
  { id: "marine", label: "Marine & coastal", image: "/communities-wildlife-conservation/ocean,reef,fish.png" },
  { id: "grassland", label: "Grasslands & savanna", image: "/communities-wildlife-conservation/savanna,grassland.png" },
  { id: "polar", label: "Polar & alpine", image: "/communities-wildlife-conservation/arctic,snow,wildlife.png" },
];

export default function GlobalConservationGallery() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
          Communities around the world
        </div>
        <div className="max-w-[665px] text-gray-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
          Wildlife &amp; Conservation brings together communities across many
          regions, habitats, and species. Imagery below is illustrative only
          and does not represent specific projects, locations, or
          organizations.
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REGIONS.map((region) => (
          <div key={region.id} className="relative aspect-[297/223] rounded-2xl overflow-hidden">
            <Image src={region.image} alt={region.label} fill className="object-cover" />
            <div className="absolute left-2.5 bottom-2.5 h-[25px] px-2.5 bg-black/40 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans']">
                {region.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-gray-400 text-xs font-normal font-['Plus_Jakarta_Sans']">
        Photography is for illustrative purposes only and is not sourced from
        any specific community, sighting, or location shown on this page.
      </div>
    </div>
  );
}
