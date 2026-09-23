import TrainerCard, { type Trainer } from "./TrainerCard";

const TRAINERS: Trainer[] = [
  {
    id: "jessica-martinez",
    name: "Jessica Martinez",
    location: "Pearl District · 0.8 mi",
    experience: "5 years experience",
    tags: ["Training", "Grooming", "Dogs"],
    desktopImage: "/trainers-groomers-production/jessica-martinez-trainer-square.webp",
    desktopImageAlt: "Jessica Martinez training a golden retriever with agility poles",
    mobileImage: null,
  },
  {
    id: "david-chen",
    name: "David Chen",
    location: "Downtown · 1.2 mi",
    experience: "8 years experience",
    tags: ["Training", "Dogs"],
    desktopImage: "/trainers-groomers-production/david-chen-trainer-square.webp",
    desktopImageAlt: "David Chen training a dog over agility equipment outdoors",
    mobileImage: "/trainers-groomers-production/david-chen-trainer-mobile-wide.webp",
    mobileImageAlt: "Close-up of a golden retriever puppy",
  },
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    location: "Waterfront · 2.1 mi",
    experience: "10 years experience",
    tags: ["Grooming", "Dogs"],
    desktopImage: "/trainers-groomers-production/sarah-kim-groomer-square.webp",
    desktopImageAlt: "Sarah Kim grooming a dog outdoors",
    mobileImage: "/trainers-groomers-production/sarah-kim-groomer-mobile-wide.webp",
    mobileImageAlt: "An orange tabby cat",
  },
];

/**
 * Results header + trainer/groomer card list + "Load more" button.
 *
 * Figma: desktop 637:14405, mobile 637:14867. The results count copy is
 * identical between breakpoints here ("Showing 6 professionals in Portland,
 * OR"), unlike some sibling pages' divergent counts, so it's rendered once.
 */
export default function TrainerResults() {
  return (
    <div className="flex w-full flex-col items-start gap-6 lg:gap-8">
      <div className="flex w-full flex-col items-start justify-between gap-3 border-b border-[#dce5e8] pb-4 lg:flex-row lg:items-center lg:gap-0">
        <p className="font-jakarta text-[14px] font-semibold leading-[22.4px] text-[#5e7076]">
          Showing 6 professionals in Portland, OR
        </p>
        <button
          type="button"
          className="flex items-center justify-start rounded-lg border border-[#dce5e8] bg-white px-4 py-[10.5px] font-jakarta text-[13px] font-normal leading-[15px] text-[#102a32]"
        >
          Relevance
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-6 lg:gap-6">
        {TRAINERS.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>

      <div className="flex w-full items-center justify-center pt-2">
        <button
          type="button"
          className="flex min-h-[40px] items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879]"
        >
          Load more professionals
        </button>
      </div>
    </div>
  );
}
