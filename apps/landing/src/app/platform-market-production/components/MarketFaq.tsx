"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const faqs = [
  {
    question:
      'What does it mean when a provider is "verified" on Zoiko Market?',
    answer:
      "Providers are reviewed before being listed on Zoiko Market. Verification helps indicate that the provider has completed the applicable verification process for their category.",
  },
  {
    question: "How do I book an appointment or purchase services?",
    answer:
      "Select the provider or service you're interested in and follow the available booking or purchase instructions. Some services may direct you to an external provider.",
  },
  {
    question: "Can I trust the prices and product information listed?",
    answer:
      "Product and service information is provided for informational purposes. Review the provider's current pricing, terms, availability, and policies before making a purchase or booking.",
  },
  {
    question: "How is Zoiko Market different from pet insurance?",
    answer:
      "Zoiko Market connects you with animal-care providers, services, supplies, and related resources. Pet insurance is a separate type of coverage that may help with eligible veterinary expenses according to its policy terms.",
  },
  {
    question: "What should I do in a true emergency?",
    answer:
      "If your animal is experiencing a true emergency, contact your nearest emergency veterinary clinic immediately. Do not delay emergency care while using Zoiko Market.",
  },
];

export default function MarketFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className={`
        ${plusJakartaSans.className}
        w-full
        bg-[#F5F7F8]
        px-5
        pt-12
        pb-16
        sm:px-8
        sm:pt-16
        sm:pb-20
        lg:px-20
        lg:pt-20
        lg:pb-24
      `}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-center
          gap-12
          px-0
          sm:px-6
        "
      >
        {/* Heading */}
        <div className="flex w-full flex-col items-center justify-start">
          <h2
            className="
              w-full
              text-center
              text-3xl
              font-extrabold
              leading-[51.2px]
              text-[#123B45]
            "
          >
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
                <div
                  className="
                    w-full
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    outline
                    outline-1
                    outline-offset-[-1px]
                    outline-[#D9E5E8]
                  "
                >
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="
                      flex
                      min-h-16
                      w-full
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-4
                      text-left
                      sm:px-6
                    "
                  >
                    <span
                      className="
                        min-w-0
                        flex-1
                        text-base
                        font-bold
                        leading-6
                        text-[#123B45]
                      "
                    >
                      {faq.question}
                    </span>

                    {/* Plus / Minus */}
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F1F8F9]
                        text-[#087D8E]
                      "
                    >
                      <span
                        className="
                          text-xl
                          font-normal
                          leading-none
                        "
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </span>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div
                      className="
                        border-t
                        border-[#E6EEF0]
                        px-5
                        pb-5
                        pt-4
                        sm:px-6
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-normal
                          leading-6
                          text-[#52717A]
                        "
                      >
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