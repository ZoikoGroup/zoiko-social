import Image from "next/image";
import { C } from "./theme";

/*
 * The Figma frame ships only the collapsed question row for each item (a
 * "+" toggle with no expanded state), so the answers below are written to
 * match the page's own copy and are not pulled verbatim from the design —
 * same judgment call as platform-features/components/Faq.tsx.
 */
const FAQS = [
  {
    question: "Are forum answers official?",
    answer:
      "No. Forum posts are peer advice from community members. Replies labeled \"Official reference\" or \"Verified role\" link back to Zoiko Social's own docs or a verified team member, but everything else is community opinion.",
  },
  {
    question: "Who can read my posts?",
    answer: "Everything you post in the forums is public. Anyone with a link can read it, so never include passwords, codes, addresses or private support details.",
  },
  {
    question: "Can I get help with my account here?",
    answer: "The forums are for peer discussion, not account support. For help with your account, contact our support team directly rather than posting account details publicly.",
  },
  {
    question: "Is something down?",
    answer: "Check System Status for real-time uptime and incident updates instead of asking in the forums — it's the fastest way to confirm whether an issue is on our end.",
  },
  {
    question: "How do I report a post?",
    answer: "Use the report option on any post or reply to flag it for our safety team. Please report concerns directly rather than asking the community to investigate.",
  },
  {
    question: "Can developers ask questions here?",
    answer: "Yes. The Developers topic is the place to discuss integrations, webhooks and API usage with other builders. For anything account-specific, use Developer Support instead.",
  },
];

/** Section - 12 · FAQ — "Forum questions", a photo card + 6-item accordion. */
export default function ForumFaq() {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Forum questions
          </h2>
          <div className="relative h-[220px] w-full overflow-hidden rounded-[28px] sm:h-[280px] lg:h-[317px]">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(133deg, ${C.brand} 0%, ${C.orange} 100%)` }}
            />
            <Image
              src="/support&developers-community-forums/faq-photo.webp"
              alt="Dog looking to the side outdoors"
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
                  <Image src="/support&developers-community-forums/icon-edit.webp" alt="" width={16} height={16} />
                </span>
                <span className="text-sm font-bold underline" style={{ color: C.brandDeep }}>
                  Start a discussion
                </span>
              </div>
              <Image src="/support&developers-community-forums/icon-chevron-right.webp" alt="" width={16} height={16} />
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
                <span className="text-base font-bold sm:text-[17px]" style={{ color: C.brandDeep }}>
                  {faq.question}
                </span>
                <span
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border"
                  style={{ borderColor: C.line }}
                >
                  <span className="group-open:hidden">
                    <Image src="/support&developers-community-forums/icon-plus.webp" alt="" width={16} height={16} />
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
