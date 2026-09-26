import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS = [
  {
    q: "How do I apply for a job at Zoiko Social?",
    a: "You can apply directly through our open roles listings above. Click 'View Role' on any posting to see the full description, requirements, and application submission instructions on our secure applicant tracking system. You will receive a confirmation email once your application is received.",
  },
  {
    q: "Where does Zoiko Social hire?",
    a: "Zoiko Social operates globally with hubs in Sacramento, California and London, United Kingdom. We hire both on-site, hybrid, and fully remote team members depending on the specific role and team needs. Each job listing indicates eligible locations and work models.",
  },
  {
    q: "Does Zoiko Social offer remote jobs?",
    a: "Yes! Many of our engineering, product, data, content, and trust & safety roles offer remote flexibility. The eligibility countries and time zone expectations are clearly detailed in each specific role listing.",
  },
  {
    q: "What is the hiring timeline?",
    a: "Our standard hiring process typically takes between 2 to 4 weeks from initial application review to final offer. We aim to keep candidates updated at every stage and provide prompt feedback following each interview round.",
  },
  {
    q: "Can I request an accommodation?",
    a: "Absolutely. We are committed to an inclusive and accessible hiring process. If you require accommodations at any stage of application or interview, please let us know through our accommodation request link or email careers@zoikosocial.com. Your request will be kept strictly private.",
  },
  {
    q: "How is my application data used?",
    a: "Your personal details and resume are used solely for recruitment and hiring assessment within Zoiko Social. We do not sell or share candidate data with third-party advertisers or unauthorized external entities. Your information is securely handled in compliance with global privacy regulations.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-[1.3]"
            style={{ color: C.firefly }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group overflow-hidden rounded-[14px] sm:rounded-2xl bg-white border transition shadow-none hover:shadow-sm"
              style={{
                borderColor: C.geyser,
                background: C.white,
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-4 sm:px-6 py-4 sm:py-5 [&::-webkit-details-marker]:hidden select-none">
                <span
                  className="text-sm sm:text-[15px] font-bold leading-snug sm:leading-[22.5px]"
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
                className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm leading-relaxed sm:leading-[24px]"
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
