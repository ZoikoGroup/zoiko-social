const FAQS = [
  {
    question: 'What does "verified" mean?',
    answer:
      "Identity and background verification required. We do not verify specific training methods, insurance, or licensing.",
  },
  {
    question: "How do I book a stay?",
    answer: "Contact the provider directly using the phone number or website listed on their profile.",
  },
  {
    question: "Can I share care instructions privately?",
    answer: "Yes. Direct contact with the provider protects your privacy and keeps details between you two.",
  },
  {
    question: "What if there's a problem?",
    answer: "Contact the provider directly. For animal welfare concerns, reach out to our support team.",
  },
  {
    question: "Is my pet's medical care covered?",
    answer: "Boarding and sitting are care services, not veterinary care. Consult your vet for medical needs.",
  },
];

/** Plus-icon chevron matching the Figma FAQ accordion toggle (node 658:774). */
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
 * Figma: desktop 637:12698 (centered, max-w 800px) — the toggle is a
 * circular `#eef8f9` badge holding a plus-icon SVG (node 658:774) that
 * rotates into an X on open; mobile 637:13127 (full width) — the toggle
 * is instead a plain "▼" glyph in bold `#102a32` text with no circular
 * background at all (confirmed via get_design_context on node
 * 637:13133/637:13139, which shows a literal text node, not an SVG/badge).
 * The two toggle treatments genuinely differ per breakpoint, so both are
 * reproduced explicitly rather than sharing one icon.
 */
export default function Faq() {
  return (
    <section className="w-full bg-[#f7f9fa] px-6 py-16 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-0 lg:gap-12 lg:px-6">
        <h2 className="text-center font-jakarta text-[28px] font-extrabold leading-[36px] text-[#102a32] lg:text-[32px] lg:leading-[51.2px]">
          Frequently asked questions
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
