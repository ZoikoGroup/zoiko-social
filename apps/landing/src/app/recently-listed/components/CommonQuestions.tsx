"use client";

import { useState } from "react";
import { C } from "./theme";

const faqs = [
  'What does "Recently Listed" mean?',
  "Are recently listed animals more urgent?",
  "Who can list animals here?",
  "Can a listing move back to the top when edited?",
  'What is the difference between "Listed" and "Updated"?',
  "Can I get alerts for new animals?",
  "Why did a recent listing disappear?",
  "Does Zoiko Social prioritize paid rescue listings?",
  "Can I browse without sharing exact location?",
];

const answers = [
  '“Recently Listed” shows active adoption listings ordered by their original public publication time.',
  "A recently published listing is not more urgent or deserving than another verified listing.",
  "Verified rescue and shelter organizations can list animals here.",
  "No. Editing a listing does not reset its original publication time.",
  '“Listed” is the original publication time. “Updated” marks a later material change.',
  "You can save a search to receive notifications about future listings.",
  "Listings can disappear when they become inactive or are removed by the source.",
  "No. Payment, Premium status, or popularity does not determine Recently Listed order.",
  "Yes. You can browse adoption listings without sharing your exact location.",
];

export default function CommonQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-transparent px-5 py-12 lg:px-0">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-20">
        {/* Heading */}
        <div className="flex w-full max-w-[640px] flex-col items-center">
          <h2
            className="text-center text-3xl font-extrabold leading-[48px]"
            style={{ color: C.cyan15 }}
          >
            Common questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="mt-8 flex w-full max-w-[736px] flex-col gap-2">
          {faqs.map((question, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={question}
                className="w-full overflow-hidden rounded-[12px] border bg-white"
                style={{ borderColor: C.cyan89 }}
              >
                {/* Question */}
                <button
                  type="button"
                  className="flex h-16 w-full items-center justify-between px-6 text-left"
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="pr-5 text-base font-bold leading-6"
                    style={{ color: C.cyan13 }}
                  >
                    {question}
                  </span>

                  {/* Plus */}
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: C.noticeBackground }}
                  >
                    <span className="relative block h-3.5 w-3.5">
                      {/* Horizontal */}
                      <span
                        className="absolute left-[2.91px] top-[6.35px] h-[1.28px] w-[8.18px]"
                        style={{
                          backgroundColor: C.cyan15,
                        }}
                      />

                      {/* Vertical */}
                      <span
                        className="absolute left-[6.35px] top-[2.91px] h-[8.18px] w-[1.28px] transition-transform duration-200"
                        style={{
                          backgroundColor: C.cyan15,
                          transform: isOpen
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </span>
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p
                      className="text-sm font-normal leading-6"
                      style={{ color: C.azure42 }}
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