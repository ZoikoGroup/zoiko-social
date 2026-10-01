import React from "react";

const FAQS = [
  {
    question: "What are Training & Behavior communities on Zoiko Social?",
    answer:
      "They are communities where owners, handlers, and trainers share experiences and ideas about obedience, socialization, enrichment, and behavior challenges. They are spaces for discussion and peer support.",
  },
  {
    question: "Is advice in these communities professional advice?",
    answer:
      "Not usually. Most advice comes from other members sharing their own experience. Even when a trainer or vet takes part, community posts are general guidance — not a professional assessment of your animal.",
  },
  {
    question: "Can I find communities for a specific animal?",
    answer:
      "Yes. Use the species filter or search to find communities focused on dogs, cats, horses, birds, and more. You can also browse By Species to see every community for a particular animal.",
  },
  {
    question: "Can these communities diagnose a behavior or medical problem?",
    answer:
      "No. Sudden or serious behavior changes can have medical causes. If you are worried, speak to your vet or a qualified behaviorist who can assess your animal in person.",
  },
  {
    question: "How does Zoiko Social handle harmful training advice?",
    answer:
      "Advice that promotes pain, fear, or intimidation, or that puts an animal's welfare at risk, breaks our Community Standards. You can report it, and moderators can remove content and act against repeat offenders.",
  },
  {
    question: "Where can I find professionally run communities?",
    answer:
      "Visit Professional Communities to find communities run by, or associated with, vets, trainers, and shelters. Professional status is shown separately from a community's Training & Behavior purpose.",
  },
];

export default function FAQSection() {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-[-0.32px] text-center">
        Common questions
      </div>

      <div className="w-full max-w-[760px] flex flex-col gap-3.5">
        {FAQS.map(({ question, answer }) => (
          <details
            key={question}
            className="w-full bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 hover:bg-zinc-50 transition-colors group"
          >
            <summary className="w-full px-6 py-5 flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-teal-950 text-[15px] font-bold font-['Plus_Jakarta_Sans'] leading-[22.5px]">
                {question}
              </span>
              {/* Plus icon — turns into a cross when open */}
              <div className="size-7 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.99935 2.91602V11.0827M2.91602 6.99935H11.0827" stroke="#073B47" strokeWidth="1.28333" strokeLinecap="round"/>
                </svg>
              </div>
            </summary>

            <p className="px-6 pb-5 -mt-1 text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-6">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
