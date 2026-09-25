"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What if I accidentally break a rule?",
    answer:
      "If you accidentally violate a community standard, we encourage you to review the relevant policy and understand what went wrong. Depending on the severity and context, we may provide a warning, remove the content, or take another appropriate action.",
  },
  {
    question: "How do I know if something violates the standards?",
    answer:
      "Review the relevant community standard and consider the context, intent, and potential impact of the content. Our standards include examples to help explain what is and isn't allowed.",
  },
  {
    question: "Can I discuss politics / religion / controversial topics?",
    answer:
      "Yes. You can discuss politics, religion, and controversial topics as long as the discussion follows our community standards. Criticism, disagreement, and debate are allowed when they do not cross into prohibited harassment, threats, hate speech, or other restricted behavior.",
  },
  {
    question: "What's the difference between misinformation and opinion?",
    answer:
      "Opinions express personal views, interpretations, or beliefs. Misinformation refers to false or misleading claims presented as factual information. Context and intent can matter when we evaluate potentially misleading content.",
  },
  {
    question: "How do I appeal a decision?",
    answer:
      "If you believe an enforcement decision was incorrect or lacked important context, use the appeal option provided in your enforcement notice. Explain your situation clearly and include any relevant information that may have been missed.",
  },
  {
    question: "Are moderators human or AI?",
    answer:
      "Moderation can involve automated systems and human review. Automated systems may help identify potentially problematic content, while human reviewers can evaluate context and make or review enforcement decisions.",
  },
  {
    question: "Why was my account suspended if I never did anything?",
    answer:
      "An account may be restricted when activity associated with it appears to violate our standards or when additional review is needed. If you believe the suspension was incorrect, you can use the appeal process to request a review.",
  },
  {
    question: "Can you share why my content was removed?",
    answer:
      "Yes. When content is removed, we aim to provide information about the relevant standard and the reason for the action. You can also appeal the decision if you believe it was made in error.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 sm:gap-12">
        {/* Heading */}
        <h2 className="w-full text-center font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-[1.6] text-[#073B47]">
          Frequently asked questions
        </h2>

        {/* FAQ List */}
        <div className="flex w-full max-w-[800px] flex-col items-start">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="w-full py-2">
                <div className="w-full overflow-hidden rounded-2xl border border-[#D5E7EA] bg-white">
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold leading-6 text-[#073B47] sm:text-base">
                      {faq.question}
                    </span>

                    {/* Icon */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5F7F8] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute h-px w-3.5 bg-[#073B47]" />
                        <span className="absolute h-3.5 w-px bg-[#073B47]" />
                      </span>
                    </span>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div className="border-t border-[#D5E7EA] px-5 pb-5 pt-4 sm:px-6">
                      <p className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}