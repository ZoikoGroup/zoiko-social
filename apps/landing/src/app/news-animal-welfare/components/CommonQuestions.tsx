"use client";

import { useState } from "react";
import { C } from "./theme";

const questions = [
  "What is Animal Welfare on Zoiko Social News?",
  "How are stories chosen and ranked?",
  "What does a source rating mean?",
  'What does a policy status like "Proposed" or "In effect" mean?',
  "How is sensitive or graphic content handled?",
  "How do corrections and policy-status changes work?",
  "What's the difference between reporting an inaccuracy and reporting a welfare concern?",
  "Is Animal Welfare a popularity feed?",
];

export default function CommonQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      {/* =========================================
          HEADING
      ========================================= */}
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          justify-center
          px-4
          pt-12
          sm:px-6
          lg:px-0
        "
      >
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

      {/* =========================================
          QUESTIONS
      ========================================= */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-4
          pt-4
          pb-14
          sm:px-6
          lg:px-0
        "
      >
        <div className="flex w-full flex-col gap-2.5">
          {questions.map((question, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={`${question}-${index}`}
                className="
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                "
                style={{
                  borderColor: C.cyan89,
                }}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={isOpen}
                  className="
                    flex
                    min-h-[64px]
                    w-full
                    items-center
                    justify-between
                    px-5
                    py-1
                    text-left
                    sm:px-6
                  "
                >
                  <span
                    className="
                      pr-6
                      text-sm
                      font-bold
                      leading-5
                      sm:text-base
                      sm:leading-6
                    "
                    style={{
                      color: C.cyan13,
                    }}
                  >
                    {question}
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
                      text-xl
                      font-normal
                      leading-8
                    "
                    style={{
                      color: C.cyan25,
                    }}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div
                    className="
                      border-t
                      px-5
                      py-4
                      sm:px-6
                    "
                    style={{
                      borderColor: C.cyan89,
                    }}
                  >
                    <p
                      className="
                        text-sm
                        leading-6
                      "
                      style={{
                        color: C.azure42,
                      }}
                    >
                      More information about this topic will be available
                      here.
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