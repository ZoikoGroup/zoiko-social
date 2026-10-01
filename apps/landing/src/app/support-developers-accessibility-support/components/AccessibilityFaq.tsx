import Image from "next/image";
import { C } from "./theme";

/*
 * The Figma frame ships only the collapsed question row for each item (a
 * "+" toggle with no expanded state), so the answers below are written to
 * match the page's own copy and are not pulled verbatim from the design —
 * same judgment call as ForumFaq.tsx and ContactFaq.tsx.
 */
const FAQS = [
  {
    question: "Do I need to tell you about a disability?",
    answer: "No. You can report a barrier or ask for help without disclosing any diagnosis or condition — we focus on what got in your way, not why.",
  },
  {
    question: "Does Zoiko Social work with my assistive technology?",
    answer: "The web app and mobile apps are built to work with common screen readers, voice control and keyboard navigation. See \"What's been tested\" for the specific results we've checked.",
  },
  {
    question: "What happens after I report a barrier?",
    answer: "Your report goes to the accessibility team, who triage it against known issues. You'll hear back if we need more detail, and fixes are tracked in Known issues and workarounds.",
  },
  {
    question: "The report form is hard for me to use. What else can I do?",
    answer: "Contact Us works too — you don't have to use the report form. Tell the support team what you were trying to do and they'll route it to the right place.",
  },
  {
    question: "Is a known issue affecting everyone?",
    answer: "Check Known issues and workarounds first — it lists problems we already know about, their status, and what to try in the meantime, so you don't need to report it again.",
  },
  {
    question: "Where are formal accessibility reports?",
    answer: "Our VPAT® conformance reports are listed in Accessibility reports, published only once approved, with exactly what each version covers.",
  },
];

/** Section - 11 · FAQ — "Accessibility questions", a photo card (desktop only) + 6-item accordion. */
export default function AccessibilityFaq() {
  return (
    <section className="w-full px-5 py-10 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Accessibility questions
          </h2>
          <p className="text-base leading-[27.2px] lg:hidden" style={{ color: C.muted }}>
            Quick answers.
          </p>

          <div className="relative hidden h-[317px] w-full overflow-hidden rounded-[28px] lg:block">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(133deg, ${C.brand} 0%, ${C.orange} 100%)` }}
            />
            <Image
              src="/support&developers-accessibility-support/faq-photo.webp"
              alt="Accessibility support team at their desks"
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
                  <Image src="/support&developers-accessibility-support/icon-flag-faq.webp" alt="" width={16} height={16} />
                </span>
                <span className="text-sm font-bold underline" style={{ color: C.brandDeep }}>
                  Report a barrier
                </span>
              </div>
              <Image src="/support&developers-accessibility-support/icon-chevron-right-faq.webp" alt="" width={16} height={16} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {FAQS.map((faq, i) => (
            <details
              key={faq.question}
              className="group w-full border-t py-1"
              style={{ borderColor: C.line, borderBottomWidth: i === FAQS.length - 1 ? 1 : 0 }}
            >
              <summary className="flex min-h-[78px] w-full cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-bold lg:text-[17px]" style={{ color: C.brandDeep }}>
                  {faq.question}
                </span>
                <span
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border"
                  style={{ borderColor: C.line }}
                >
                  <span className="group-open:hidden">
                    <Image src="/support&developers-accessibility-support/icon-plus.webp" alt="" width={16} height={16} />
                  </span>
                  <span className="hidden text-lg leading-none group-open:inline" style={{ color: C.brand }}>
                    &minus;
                  </span>
                </span>
              </summary>
              <p className="pb-5 text-sm leading-6" style={{ color: C.muted }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
