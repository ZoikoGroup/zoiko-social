const FAQS = [
  {
    question: 'What does "verified" mean?',
    answer:
      "Professional has passed identity and background verification. We do not verify specific training methods, certifications, or licensing.",
  },
  {
    question: "How do I book a service?",
    answer: "Contact the professional directly through the contact info listed on their profile.",
  },
  {
    question: "Are they certified or licensed?",
    answer: "Certifications are not verified by Zoiko. Ask professionals directly about their credentials.",
  },
  {
    question: "Can they help with behavior problems?",
    answer: "Trainers offer behavioral training services. For medical or health-related behavior changes, consult a vet.",
  },
  {
    question: "What if I need emergency help?",
    answer: "Training and grooming are not emergency services. For urgent situations, contact an emergency vet.",
  },
];

/** Plus-icon chevron matching the Figma FAQ accordion toggle (node 658:1541). */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.99935 2.9165V11.0832M2.91602 6.99984H11.0827"
        stroke="#073B47"
        strokeWidth="1.28333"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * "Frequently asked questions" accordion list.
 *
 * Figma: desktop 637:14593 — section padded 80px each side, its heading and
 * question list ARE centered (`items-center`) within a 1280px content box,
 * matching the same 1440px total canvas width as every other section on
 * this page (80 gutter + 1280 content = 1440, vs. 105 + 1230 elsewhere) —
 * so it uses the same `mx-auto max-w-[…] px-[…]` single-element pattern as
 * the rest of the page rather than floating uncentered. The toggle is a
 * circular `#eef8f9` badge holding a plus-icon SVG (node 658:1541,
 * downloaded and inlined here) that rotates into an X on open.
 *
 * Mobile 637:15055 — NOT centered: the section has no horizontal padding of
 * its own, only the inner container's `px-[16px]`, and the heading is
 * left-aligned across two explicit lines ("Frequently asked" / "questions",
 * confirmed via get_design_context — two separate `<p>` nodes, not a wrap).
 * The toggle is a plain "▼" glyph in bold `#102a32` text with no circular
 * background (confirmed via get_metadata on node 637:15064/637:15065, a
 * literal text node, not an SVG/badge).
 */
export default function Faq() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-8 px-4 lg:items-center lg:gap-12 lg:px-[105px]">
        <h2 className="font-jakarta text-[32px] font-extrabold leading-[51.2px] text-[#102a32] lg:text-center">
          <span className="lg:hidden">
            Frequently asked
            <br />
            questions
          </span>
          <span className="hidden lg:inline">Frequently asked questions</span>
        </h2>

        <div className="flex w-full max-w-[800px] flex-col items-start gap-4">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group w-full rounded-2xl border border-[#dce5e8] bg-white">
              <summary className="flex min-h-[68px] w-full cursor-pointer list-none items-center justify-between px-6 py-4">
                <span className="font-jakarta text-[15px] font-bold leading-[22.5px] text-[#102a32]">
                  {faq.question}
                </span>
                <span className="font-jakarta text-[20px] font-bold leading-none text-[#102a32] lg:hidden">▼</span>
                <span className="hidden size-7 shrink-0 items-center justify-center rounded-lg bg-[#eef8f9] transition-transform group-open:rotate-45 lg:flex">
                  <PlusIcon />
                </span>
              </summary>
              <p className="px-6 pb-6 pt-1 font-jakarta text-[14px] leading-[22.4px] text-[#5e7076]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
