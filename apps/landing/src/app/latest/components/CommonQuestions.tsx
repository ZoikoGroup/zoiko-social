"use client";

import { useState } from "react";
import { C } from "./theme";

const questions = [
  {
    question: "What is Latest?",
    answer:
      "Latest is Zoiko Social's feed for verified-source stories across animal welfare, conservation, rescue, wildlife crime, veterinary science, and policy.",
  },
  {
    question: "How are stories chosen and ordered?",
    answer:
      "Stories are selected after source eligibility, safety, duplication, and other distribution checks. Eligible stories are presented with their source and update context.",
  },
  {
    question: "What does a source rating mean?",
    answer:
      "A source rating reflects the publisher against Zoiko Social's published Source Standards. It does not guarantee every individual claim in a story.",
  },
  {
    question: "How is sensitive or graphic content handled?",
    answer:
      "Sensitive or graphic stories can be protected with content notices and controls so you can choose whether to reveal or skip the content.",
  },
  {
    question: "Can I set my region?",
    answer:
      "Yes. You can set a coarse region such as a country, state, or metro area to see relevant stories first. Exact GPS location is not required.",
  },
  {
    question: "How do corrections work?",
    answer:
      "When a published story needs a correction, the correction context is displayed with the story so readers can see what changed.",
  },
  {
    question: "How do I report an inaccuracy?",
    answer:
      "You can report an inaccuracy when you believe information in a story needs review.",
  },
  {
    question: "Is Latest a popularity feed?",
    answer:
      "No. Latest is focused on eligible, verified-source stories and their publication context rather than popularity ranking.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke={C.cyan15}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CommonQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[720px]
          lg:-translate-x-6
        "
      >
        {/* Heading */}
        <div className="flex w-full flex-col items-center pt-16">
          <h2
            className="
              text-center
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{
              color: C.cyan15,
            }}
          >
            Common questions
          </h2>
        </div>

        {/* Questions */}
        <div className="flex w-full flex-col pt-12 pb-16">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="w-full border-b"
                style={{
                  borderColor: C.line,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    py-4
                    text-left
                  "
                  aria-expanded={isOpen}
                >
                  <span
                    className="
                      pr-4
                      text-[17px]
                      font-medium
                      leading-6
                    "
                    style={{
                      color: C.cyan15,
                    }}
                  >
                    {item.question}
                  </span>

                  <ChevronIcon open={isOpen} />
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="pb-4 pr-8">
                    <p
                      className="
                        text-sm
                        font-normal
                        leading-6
                      "
                      style={{
                        color: C.azure42,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}