import React from "react";

const FAQS = [
  "What are Training & Behavior communities on Zoiko Social?",
  "Is advice in these communities professional advice?",
  "Can I find communities for a specific animal?",
  "Can these communities diagnose a behavior or medical problem?",
  "How does Zoiko Social handle harmful training advice?",
  "Where can I find professionally run communities?",
];

export default function FAQSection() {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-[-0.32px] text-center">
        Common questions
      </div>

      <div className="w-full max-w-[760px] flex flex-col gap-3.5">
        {FAQS.map((question) => (
          <div
            key={question}
            className="w-full px-6 py-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
          >
            <span className="text-teal-950 text-[15px] font-bold font-['Plus_Jakarta_Sans'] leading-[22.5px]">
              {question}
            </span>
            <div className="size-7 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.99935 2.91602V11.0827M2.91602 6.99935H11.0827" stroke="#073B47" strokeWidth="1.28333" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
