"use client";

import { useState } from "react";

const questions = [
  "What counts as conservation news?",
  "How does Zoiko Social rate sources?",
  "Why are some wildlife locations withheld?",
  "How are conservation actions and protections labeled?",
  "How do I report an inaccuracy or a safety concern?",
  "Does a source rating guarantee every claim is true?",
  "How is Conservation different from Animal Welfare and Wildlife Crime?",
];

const answers = [
  "Conservation news covers documented changes involving habitats, ecosystems, protected areas, species recovery, restoration, conservation policy, monitoring, and human-wildlife coexistence.",
  "Sources are labeled according to Zoiko Social's published source standards. A source rating describes the publisher and does not guarantee that every individual claim is true.",
  "Sensitive wildlife locations may be withheld or broadened to reduce risks to nesting, breeding, denning, release, reintroduction, or ranger operations.",
  "Conservation actions and protections are tracked using explicit status fields such as Planned, Approved / funded, Active / protected, Under review, and Completed.",
  "Story inaccuracies should be reported through the editorial reporting route. Active animal abuse or exploitation should go to the Safety Center, while suspected trafficking or poaching should use Wildlife Crime reporting.",
  "No. A source rating evaluates the publisher against the published standards; it is not a guarantee that every individual claim is true.",
  "Conservation focuses on ecosystems, habitats, species recovery, protected areas, restoration, and related actions. Animal Welfare concerns the treatment and wellbeing of animals, while Wildlife Crime concerns suspected criminal activity such as trafficking or poaching.",
];

export default function ConservationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-4 pb-14 pt-4 lg:px-0">

        {/* HEADING */}
        <div className="flex w-full flex-col items-start pb-2.5">
          <h2 className="text-2xl font-extrabold leading-9 text-[#073B47]">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="flex w-full flex-col gap-2.5">
          {questions.map((question, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={question}
                className="w-full overflow-hidden rounded-2xl border border-[#DCEAEE] bg-white"
              >
                {/* QUESTION */}
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={isOpen}
                  className="flex min-h-[62px] w-full items-center justify-between px-4 py-1 text-left"
                >
                  <span className="pr-6 text-base font-bold leading-6 text-[#066879]">
                    {question}
                  </span>

                  <span
                    className={`flex h-7 w-4 shrink-0 items-center justify-center text-2xl font-normal leading-8 text-[#066879] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* ANSWER */}
                {isOpen && (
                  <div className="border-t border-[#DCEAEE] px-4 pb-5 pt-4">
                    <p className="max-w-[1050px] text-sm font-normal leading-6 text-[#6B8790]">
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