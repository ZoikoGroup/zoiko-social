"use client";

import { useState } from "react";
import { C } from "./theme";

const faqs = [
  "What is a verified rescue or shelter on Zoiko Social?",
  "Does verified mean every adoption is guaranteed safe?",
  "How can I find verified rescues near me?",
  "Can I see animals from one rescue or shelter?",
  "How do rescues and shelters get verified?",
  "Can an organization pay to be verified?",
  "What if I have a concern about a verified organization?",
  "Why can’t I find a specific organization?",
  "Can I follow a rescue or shelter?",
];

const answers = [
  "A verified rescue or shelter is an organization that Zoiko Social has reviewed against its verification requirements. Verification is a trust signal and does not guarantee every listing, interaction, or adoption outcome.",
  "No. Verification is a trust signal, not a guarantee that every adoption or interaction will be safe. Users should follow adoption safety guidance and use the available reporting paths when needed.",
  "Use the verified rescues and shelters directory to browse organizations and filter by location, organization type, and other available criteria.",
  "Yes. When an organization publishes available animals, those listings can be viewed from its organization profile.",
  "Rescues and shelters are verified through Zoiko Social's verification process. Organizations must meet the applicable eligibility and verification requirements.",
  "No. Payment does not buy verification or directory placement.",
  "You can report a concern about any organization through Zoiko Social's reporting process. Reporting paths remain available regardless of verification status.",
  "An organization may not appear because it has not been verified, is not currently listed, has temporarily paused listings, or does not meet the directory's current requirements.",
  "Yes. Where following is available, you can follow a rescue or shelter to keep track of its updates.",
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          flex-col
          items-start
          gap-2.5
          px-5
          pt-4
          pb-12

          sm:px-8
          sm:pb-14

          lg:px-10
        "
      >
        {/* SECTION HEADING */}
        <div className="flex w-full flex-col items-start pb-2.5">
          <h2
            className="
              w-full
              text-2xl
              font-extrabold
              leading-9
            "
            style={{
              color: C.inkDeep,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="flex w-full flex-col gap-2.5">
          {faqs.map((question, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={question}
                className="
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                "
                style={{
                  borderColor: C.line,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="
                    flex
                    min-h-[64px]
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-1
                    text-left
                  "
                >
                  {/* QUESTION */}
                  <span
                    className="
                      text-sm
                      font-bold
                      leading-5
                    "
                    style={{
                      color: C.ink,
                    }}
                  >
                    {question}
                  </span>

                  {/* PLUS / MINUS */}
                  <span
                    className="
                      flex
                      h-7
                      w-3
                      shrink-0
                      items-center
                      justify-center
                      text-xl
                      font-normal
                      leading-8
                    "
                    style={{
                      color: C.brand,
                    }}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* ANSWER */}
                {isOpen && (
                  <div
                    className="
                      px-4
                      pb-4
                      pr-12
                    "
                  >
                    <p
                      className="
                        max-w-[900px]
                        text-sm
                        font-normal
                        leading-6
                      "
                      style={{
                        color: C.muted,
                      }}
                    >
                      {answers[index]}
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