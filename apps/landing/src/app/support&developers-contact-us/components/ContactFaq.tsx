import Image from "next/image";
import { C } from "./theme";

/*
 * The Figma frame ships only the collapsed question row for each item (a
 * "+" toggle with no expanded state), so the answers below are written to
 * match the page's own copy and are not pulled verbatim from the design —
 * same judgment call as support&developers-community-forums/components/ForumFaq.tsx.
 */
const FAQS = [
  {
    question: "How quickly will I hear back?",
    answer: "Most requests get a first reply within one business day. You'll see the stage change from Submitted to Received once the system confirms it, and again once a team picks it up.",
  },
  {
    question: "Is there phone or chat support?",
    answer: "Chat and phone availability vary by hours, language and whether you're signed in. Only approved, currently available channels are shown to you when you contact us.",
  },
  {
    question: "Do I need to sign in?",
    answer: "No — the web request works without signing in. Some channels, like live chat, do require a signed-in account so we can verify who we're talking to.",
  },
  {
    question: "Something isn't working. Should I contact you?",
    answer: "Check System Status first — if it's a wider issue it'll be posted there with timestamps. If it's just you, go ahead and start a request under \"Something isn't working.\"",
  },
  {
    question: "Can I send a screenshot?",
    answer: "Yes, screenshots are fine and often help. Just make sure any passwords, one-time codes, card numbers or API keys are hidden or cropped out before you attach one.",
  },
  {
    question: "Is this for emergencies?",
    answer: "No. Contact your local emergency services first for anything urgent. Use \"Report a concern\" for harmful content or behavior that needs the safety team's attention.",
  },
];

/** Section - 11 · FAQ — "Contact questions", a photo card + 6-item accordion. */
export default function ContactFaq() {
  return (
    <section className="w-full bg-white px-5 py-14 lg:px-[105px] lg:py-20">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
              Contact questions
            </h2>
            <p className="text-[17px] leading-[27.2px] lg:hidden" style={{ color: C.muted }}>
              Before you write in.
            </p>
          </div>
          <div className="relative hidden h-[317px] w-full overflow-hidden rounded-[28px] lg:block">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(133deg, ${C.brand} 0%, ${C.orange} 100%)` }}
            />
            <Image
              src="/support&developers-contact-us/faq-photo.webp"
              alt="Dog looking to the side outdoors"
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
                  <span
                    className="h-4 w-4"
                    style={{
                      backgroundColor: C.brandDeep,
                      WebkitMaskImage: `url(/support&developers-contact-us/icon-chat.webp)`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage: `url(/support&developers-contact-us/icon-chat.webp)`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  />
                </span>
                <span className="text-sm font-bold underline" style={{ color: C.brandDeep }}>
                  Start contact request
                </span>
              </div>
              <span
                className="h-4 w-4"
                style={{
                  backgroundColor: C.ink,
                  WebkitMaskImage: `url(/support&developers-contact-us/icon-chevron-right.webp)`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url(/support&developers-contact-us/icon-chevron-right.webp)`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
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
                    <Image src="/support&developers-contact-us/icon-plus.webp" alt="" width={16} height={16} />
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
