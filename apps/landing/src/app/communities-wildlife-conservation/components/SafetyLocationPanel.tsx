import React from "react";
import Image from "next/image";

const ITEMS = [
  {
    id: "sensitive-location",
    icon: (
      <path d="M9 15.75C5.625 14.25 3 11.25 3 7.5V4.5L9 1.5L15 4.5V7.5C15 11.25 12.375 14.25 9 15.75Z" stroke="white" strokeWidth="1.5" />
    ),
    text: "Sensitive wildlife locations — nests, dens, breeding or roosting sites, migration stopovers — are coarsened or withheld, never shown precisely.",
  },
  {
    id: "no-encourage",
    icon: (
      <path d="M9 6.75V9.75M9 12.75H9.0075M7.7175 2.895L1.365 13.5C1.23403 13.7268 1.16473 13.984 1.16399 14.2459C1.16326 14.5078 1.23112 14.7653 1.36082 14.9929C1.49052 15.2204 1.67754 15.4101 1.90328 15.5429C2.12902 15.6757 2.3856 15.7471 2.6475 15.75H15.3525C15.6144 15.7471 15.871 15.6757 16.0967 15.5429C16.3225 15.4101 16.5095 15.2204 16.6392 14.9929C16.7689 14.7653 16.8367 14.5078 16.836 14.2459C16.8353 13.984 16.766 13.7268 16.635 13.5L10.2825 2.895C10.1488 2.67458 9.96054 2.49234 9.7359 2.36586C9.51125 2.23939 9.2578 2.17294 9 2.17294C8.7422 2.17294 8.48875 2.23939 8.2641 2.36586C8.03946 2.49234 7.8512 2.67458 7.7175 2.895Z" stroke="white" strokeWidth="1.5" />
    ),
    text: "No community content here encourages approaching, feeding, touching, baiting, capturing, or relocating wild animals.",
  },
  {
    id: "no-trade",
    icon: (
      <>
        <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z" stroke="white" strokeWidth="1.5" />
        <path d="M6 6L12 12" stroke="white" strokeWidth="1.5" />
        <path d="M12 6L6 12" stroke="white" strokeWidth="1.5" />
      </>
    ),
    text: "This page never facilitates buying, selling, trading, or transporting wildlife or wildlife products. Report suspected illegal trade immediately.",
  },
  {
    id: "not-emergency",
    icon: (
      <>
        <path d="M9 6V9L11.25 11.25" stroke="white" strokeWidth="1.5" />
        <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z" stroke="white" strokeWidth="1.5" />
      </>
    ),
    text: "This is not an emergency-dispatch service. An injured or distressed animal needs a local wildlife authority or veterinary service, not community discovery.",
  },
];

export default function SafetyLocationPanel() {
  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[420px] rounded-[32px] overflow-hidden">
      <Image
        src="/communities-wildlife-conservation/deer,forest,calm.png"
        alt="Calm forest with deer"
        fill
        sizes="(max-width: 1232px) 100vw, 1232px"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(100deg, rgba(7,59,71,0.94) 30%, rgba(7,59,71,0.62) 85%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-10">
        <div className="flex flex-col gap-2">
          <div className="text-white text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[34.5px]">
            Protecting wildlife comes before discovery.
          </div>
          <div className="max-w-[600px] text-[#eef6f7] text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[22px]">
            Community discussion is not the same as official authority,
            emergency response, or safe access to wildlife. These boundaries
            apply across every community shown on this page.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 outline outline-1 outline-offset-[-1px] outline-white/25 rounded-xl flex items-start gap-3 px-4 py-4"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5">
                {item.icon}
              </svg>
              <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[22px]">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
