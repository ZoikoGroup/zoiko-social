import ProviderCard, { type Provider } from "./ProviderCard";
import ProviderDetail from "./ProviderDetail";

const PROVIDERS: Provider[] = [
  {
    id: "happy-paws-boarding",
    name: "Happy Paws Boarding",
    careType: "Facility Boarding",
    location: "Hawthorne · 0.9 mi",
    tags: ["Outdoor time", "Group play", "Updates"],
    image: "/market-boarding-sitting-production/happy-paws-boarding-facility-dogs.webp",
    imageAlt: "Dogs playing at the Happy Paws Boarding facility",
  },
  {
    id: "prairie-view-pet-sitter",
    name: "Prairie View Pet Sitter",
    careType: "Home Sitting",
    location: "Eastside · 1.3 mi",
    tags: ["Drop-in visits", "Photos daily", "Special diet"],
    image: "/market-boarding-sitting-production/prairie-view-pet-sitter-room-dogs.webp",
    imageAlt: "Pet sitter with several dogs in a home living room",
  },
  {
    id: "riverside-boarding-wellness",
    name: "Riverside Boarding",
    careType: "Facility Boarding",
    location: "Sellwood · 2.1 mi",
    tags: ["Overnight care", "Medication support", "Transport"],
    image: "/market-boarding-sitting-production/riverside-boarding-daycare-playground.webp",
    imageAlt: "Dogs playing on ramps at the Riverside Boarding & Wellness daycare yard",
  },
];

/**
 * Results header + provider card grid + the featured provider detail card.
 *
 * Figma: desktop 637:12535 / 637:12623, mobile 637:12965 / 637:13052. The
 * results count copy genuinely differs between frames ("Showing 3
 * providers in Portland" on desktop vs. "Showing 5 providers in Portland,
 * OR" on mobile), so both strings are rendered per breakpoint rather than
 * picking one.
 */
export default function ProviderResults() {
  return (
    <div className="flex w-full flex-col items-start gap-8 lg:gap-12">
      <div className="flex w-full flex-col items-start gap-2 border-b border-[#dce5e8] pb-4">
        <p className="font-jakarta text-[16px] font-semibold leading-[25.6px] text-[#102a32] lg:hidden">
          Showing 5 providers in Portland, OR
        </p>
        <p className="hidden font-jakarta text-[16px] font-semibold leading-[25.6px] text-[#102a32] lg:block">
          Showing 3 providers in Portland
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:flex-wrap lg:gap-8">
        {PROVIDERS.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      <ProviderDetail />
    </div>
  );
}
