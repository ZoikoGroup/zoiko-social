// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & Question text: Firefly
const MOSQUE_COLOR = "#066879";       // Toggle plus/minus: Mosque
const NEVADA_COLOR = "#646E73";       // Answer text: Nevada
const GEYSER_BORDER = "#DCEAEE";      // Row border: Geyser
const ICON_BG = "#F0F7F9";            // Toggle badge background: Black Squeeze
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray

const FAQS = [
  {
    question: "Can I try Premium before committing?",
    answer:
      "Yes — every new Premium membership starts with a 7-day free trial. You can cancel at any point during the trial and you won't be charged.",
  },
  {
    question: "What happens if I cancel Premium?",
    answer:
      "You keep full Premium access until the end of your current billing period. After that, your account returns to the free, ad-supported experience with core features.",
  },
  {
    question: "Is verification guaranteed if I upgrade?",
    answer:
      "Upgrade gives you access to the verification process and application tools. Approval still depends on reviewing your submitted professional or organizational credentials.",
  },
  {
    question: "Can I switch between monthly and annual billing?",
    answer:
      "Yes. You can switch at any time from your account settings — annual billing saves 20%, and changes apply from your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit and debit cards, and multiple regional payment options depending on your country. All payments are processed securely.",
  },
  {
    question: "Are there different Premium tiers?",
    answer:
      "There is a single Premium plan that includes all 8 capabilities, plus priority support. No feature is gated behind a second tier.",
  },
  {
    question: "How does fundraising payment processing work?",
    answer:
      "Donations made through the fundraising toolkit are processed by our payment partners and paid out to your verified organization account.",
  },
  {
    question: "Do I get access to beta features?",
    answer:
      "Yes — Premium members with Early Access can test new features before general release and share feedback directly with the product team.",
  },
];

/**
 * "Frequently asked questions" — 8-item accordion matching Figma with + toggle.
 */
export default function Faq() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-10">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Frequently asked questions
        </h2>

        {/* Accordion List */}
        <div className="flex w-full flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group w-full overflow-hidden rounded-[16px] bg-white shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)]"
              style={{ border: `1px solid ${GEYSER_BORDER}` }}
            >
              <summary className="flex min-h-16 w-full cursor-pointer list-none items-center justify-between px-6 py-4 transition-colors hover:bg-neutral-50/50 [&::-webkit-details-marker]:hidden">
                <span
                  className="text-sm font-bold sm:text-base"
                  style={{ color: INK_COLOR }}
                >
                  {faq.question}
                </span>

                {/* + / − toggle badge */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-semibold leading-none select-none"
                  style={{
                    backgroundColor: ICON_BG,
                    color: MOSQUE_COLOR,
                  }}
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>

              {/* Expanded Answer */}
              <p
                className="px-6 pb-6 pt-1 text-xs leading-5 sm:text-sm sm:leading-6"
                style={{ color: NEVADA_COLOR }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}