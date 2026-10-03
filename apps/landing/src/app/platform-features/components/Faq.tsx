import { C } from "./theme";

/*
 * The Figma frame ships only the collapsed question row for each item (a
 * "+" toggle with no expanded state), so the answers below are written to
 * match the page's own copy and are not pulled verbatim from the design —
 * see the page-level doc comment for this judgment call.
 */
const FAQS = [
  {
    question: "Is Zoiko Social free to use?",
    answer:
      "Yes. A free account gives you a profile, unlimited community membership, and the ability to host events. Premium unlocks advanced analytics, featured placement, and enhanced moderation tools.",
  },
  {
    question: "How do I host an event?",
    answer:
      "From your dashboard, create an event with its details, date, location, and capacity, then share it with your community. You can track RSVPs and coordinate logistics from the same place.",
  },
  {
    question: "What devices work with Zoiko?",
    answer:
      "Zoiko Social works in any modern web browser and through our mobile apps, so you can manage your community and events from your phone or desktop.",
  },
  {
    question: "Can I create my own community?",
    answer:
      "Free accounts can create one community; Premium members can create up to three, and Community Organizer accounts can create an unlimited number.",
  },
  {
    question: "Is my data private?",
    answer:
      "You control what you share and who can see it. Complete privacy settings are available for your profile and every post you make.",
  },
  {
    question: "How do I report a problem?",
    answer:
      "Use the report option on any post, profile, or community to flag it for our moderation team. Reports are reviewed promptly and safety concerns are prioritized.",
  },
];

/** "Frequently asked questions" — 6-item accordion matching Figma with + / − toggle. */
export default function Faq() {
  return (
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20 lg:px-20 lg:py-24" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[848px] flex-col items-center gap-8 lg:gap-12">
        <h2 className="text-center font-jakarta text-2xl font-extrabold sm:text-3xl lg:text-[32px]" style={{ color: C.ink }}>
          Frequently asked questions
        </h2>

        <div className="flex w-full flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group w-full overflow-hidden rounded-2xl border bg-white"
              style={{ borderColor: C.line }}
            >
              <summary className="flex min-h-[68px] w-full cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold sm:text-[15px]" style={{ color: C.ink }}>
                  {faq.question}
                </span>
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-base font-semibold leading-none select-none"
                  style={{ backgroundColor: C.chip, color: C.brand }}
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="px-6 pb-6 pt-1 text-sm leading-6" style={{ color: C.muted }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
