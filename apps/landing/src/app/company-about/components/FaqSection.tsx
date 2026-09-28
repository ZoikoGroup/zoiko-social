import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS = [
  {
    q: "What is Zoiko Social?",
    a: "Zoiko Social is a global social platform purpose-built for animal life, communities, welfare, and verified information. It connects animal lovers, professionals, and organizations in a safe, governed environment designed specifically for animal care and responsible stewardship.",
  },
  {
    q: "Who is Zoiko Social for?",
    a: "Zoiko Social serves three key audiences: individuals who want to share their lives with animals and connect with local communities; professionals (vets, trainers, groomers, specialists) building verified practices; and organizations (rescues, shelters, nonprofits) coordinating animal welfare at scale.",
  },
  {
    q: "How is Zoiko Social different from general social networks?",
    a: "Unlike general-purpose social networks, Zoiko Social is built from the ground up for animals. It prioritizes purpose and welfare over generic engagement, enforces a profanity-free family-friendly standard, provides tiered verification for professional advice, and implements strict anti-trafficking safeguards.",
  },
  {
    q: "Is Zoiko Social free?",
    a: "Yes, joining Zoiko Social is completely free for individuals and pet owners. You can share stories, join communities, discover events, and browse verified rescue listings without subscription fees. Optional premium organizational and verified professional features are also available.",
  },
  {
    q: "How does Zoiko Social handle safety?",
    a: "Safety is built into our core architecture. We employ dual automated and human moderation to ensure a respectful, profanity-free experience. Identity and jurisdiction-aware controls protect animals against illegal trade or exploitation, and sensitive medical or welfare content is verified by certified specialists.",
  },
  {
    q: "Is Zoiko Social available globally?",
    a: "Yes! Zoiko Social operates globally across regions and time zones with multi-language support, while respecting local compliance laws, regional moderation needs, and local community discovery.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl font-extrabold leading-[1.3] sm:text-3xl lg:text-[32px]"
            style={{ color: C.firefly }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group overflow-hidden rounded-[14px] sm:rounded-[16px] bg-white border transition shadow-none hover:shadow-sm"
              style={{
                borderColor: C.geyser,
                background: C.white,
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-4 sm:px-6 py-4 sm:py-5 min-h-[48px] [&::-webkit-details-marker]:hidden select-none">
                <span
                  className="text-sm font-bold leading-snug sm:text-[15px] sm:leading-[22.5px]"
                  style={{ color: C.firefly }}
                >
                  {q}
                </span>
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-open:rotate-45"
                  style={{ background: C.blackSqueeze }}
                >
                  <Plus size={14} strokeWidth={2.2} style={{ color: C.mosque }} />
                </span>
              </summary>
              <p
                className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm font-normal leading-relaxed sm:leading-[24px]"
                style={{ color: C.nevada }}
              >
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
