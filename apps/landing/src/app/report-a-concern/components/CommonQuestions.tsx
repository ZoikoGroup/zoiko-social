"use client";

import { useState } from "react";
import { C } from "./theme";

const FAQS = [
  "What can I report to Zoiko Social?",
  "What if an animal or person is in immediate danger?",
  "Do I need an account to report?",
  "Will the person or organization know I reported them?",
  "What evidence should I include?",
  "Can I report a verified rescue or shelter?",
  "Does a report automatically remove a listing?",
  "Can I check the status of my report?",
  "Can I add more information later?",
  "Can I report a scam or suspicious payment?",
  "What happens after I report?",
];

export default function CommonQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
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
          max-w-[1240px]
          flex-col
          items-center
          px-5
          pb-20
          sm:px-8
          lg:px-10
          lg:pb-24
        "
      >
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div
          className="
            w-full
            max-w-[640px]
            pt-8
            text-center
          "
        >
          <h2
            className="
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{ color: C.ink }}
          >
            Common questions
          </h2>
        </div>

        {/* =====================================================
            FAQ LIST
        ====================================================== */}
        <div
          className="
            w-full
            max-w-[760px]
            pt-16
            pb-4
          "
        >
          <div className="flex w-full flex-col gap-4">
            {FAQS.map((question, index) => {
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
                  {/* =================================================
                      QUESTION ROW
                  ================================================= */}
                  <button
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    className="
                      relative
                      flex
                      h-16
                      w-full
                      items-center
                      justify-between
                      px-6
                      text-left
                    "
                    aria-expanded={isOpen}
                  >
                    {/* QUESTION */}
                    <span
                      className="
                        pr-12
                        text-base
                        font-bold
                        leading-6
                      "
                      style={{
                        color: C.ink,
                      }}
                    >
                      {question}
                    </span>

                    {/* =================================================
                        PLUS / MINUS BUTTON
                    ================================================= */}
                    <span
                      className="
                        absolute
                        right-6
                        top-1/2
                        flex
                        size-7
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                      "
                      style={{
                        backgroundColor: C.chip,
                      }}
                    >
                      <PlusMinusIcon open={isOpen} />
                    </span>
                  </button>

                  {/* =================================================
                      ANSWER
                  ================================================= */}
                  {isOpen && (
                    <div
                      className="
                        border-t
                        px-6
                        pb-5
                        pt-4
                      "
                      style={{
                        borderColor: C.line,
                      }}
                    >
                      <p
                        className="
                          text-sm
                          font-normal
                          leading-5
                        "
                        style={{
                          color: C.muted,
                        }}
                      >
                        Please provide the relevant details so our team can
                        review your report and determine the appropriate next
                        steps.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PLUS / MINUS ICON
========================================================= */

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Horizontal line */}
      <path
        d="M3.5 7H10.5"
        stroke={C.ink}
        strokeWidth="1.28"
        strokeLinecap="round"
      />

      {/* Vertical line */}
      {!open && (
        <path
          d="M7 3.5V10.5"
          stroke={C.ink}
          strokeWidth="1.28"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}