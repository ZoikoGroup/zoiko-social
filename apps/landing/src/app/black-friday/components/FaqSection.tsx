import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "What is Zoiko Social?",
    a: "Zoiko Social is a social network built for animal lovers. You can find, follow and join communities around species, rescue, training, wildlife and more — with moderation and safety tools built in.",
  },
  {
    q: "Is it free to join?",
    a: "Yes. Joining and taking part in communities is always free. Only optional Creator and Business tools are paid.",
  },
  {
    q: "What communities are there?",
    a: "Communities cover pets and companions, rescue and adoption, training and behavior, wildlife and conservation, experts and vets, creators, and memorial and support spaces.",
  },
  {
    q: "Can I find communities by species?",
    a: "Yes. Browse by species to find communities for dogs, cats, birds, reptiles, aquatic life and many more animals.",
  },
  {
    q: "How do you handle moderation and reporting?",
    a: "Every community follows the same Community Standards. You can report a concern on any community or post, and moderation is handled separately from community owners.",
  },
  {
    q: "Are there Black Friday offers?",
    a: "Yes. For Black Friday, eligible paid Creator and Business tools are 30% off for the first year on new upgrades, where those tiers are live. Joining the community stays free.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-[#F6F8F9]">
      <div className="mx-auto max-w-[800px] px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-[#0F2B33] sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-12 flex flex-col gap-4">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-[#0F2B33]">{q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-50">
                  <Plus className="h-4 w-4 text-[#0F2B33] transition-transform group-open:rotate-45" aria-hidden />
                </span>
              </summary>
              <p className="-mt-2 px-6 pb-6 leading-relaxed text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
