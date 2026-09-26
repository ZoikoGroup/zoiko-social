"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How many times can I appeal the same decision?",
    answer:
      "You can generally submit one appeal for each enforcement decision. If you have new evidence or meaningful new information, additional review may be available depending on the circumstances.",
  },
  {
    question: "Will my moderator see my appeal?",
    answer:
      "Your appeal is reviewed by a separate review team rather than the moderator who made the original decision. This helps provide a fresh review of your case.",
  },
  {
    question: "What if I submit an appeal but then change my mind?",
    answer:
      "If you change your mind after submitting an appeal, contact support as soon as possible. Depending on the review status, they can explain what options are available.",
  },
  {
    question: "Are appeals really reviewed by humans?",
    answer:
      "Yes. Appeals are reviewed by a review team that evaluates the original decision, the content involved, and the information you provide in your appeal.",
  },
  {
    question: "What happens if I appeal but my account is still suspended?",
    answer:
      "Your account remains subject to the original enforcement while the appeal is being reviewed. If the decision is overturned, the applicable restriction will be reversed.",
  },
  {
    question: "Can I appeal an appeal decision?",
    answer:
      "A second appeal may be available when you have new evidence or information that was not considered during the original appeal review.",
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
        <div className="flex w-full flex-col items-center">
          <h2 className="text-center font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-tight text-[#073B47] sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex w-full max-w-[800px] flex-col items-start">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="flex w-full flex-col items-start py-2"
              >
                <div className="w-full overflow-hidden rounded-2xl border border-[#D5E7EA] bg-white">
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-base font-bold leading-6 text-[#073B47]">
                      {faq.question}
                    </span>

                    {/* Plus / Minus */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F2F5F6] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <span className="relative h-3.5 w-3.5">
                        <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 bg-[#073B47]" />
                        <span className="absolute left-1/2 top-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-[#073B47]" />
                      </span>
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#E5EFF1] px-5 pb-5 pt-4 sm:px-6">
                        <p className="font-['Plus_Jakarta_Sans'] text-sm leading-6 text-[#46636A]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}