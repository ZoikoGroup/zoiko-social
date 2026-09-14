import React from "react";

const FAQS = [
  "Where can I find animals for adoption on Zoiko Social?",
  "Can I find animals that need foster homes?",
  "How does Zoiko Social verify rescues and shelters?",
  "Are all animals on Zoiko Social safe to adopt?",
  "How do I find animals near me?",
  "What should I do if an adoption listing looks suspicious?",
  "Do I need an account to browse?",
  "How can my rescue or shelter list animals?",
  "Does paying for Premium affect adoption listing trust or ranking?",
];

export default function FAQSection() {
  return (
    <div className="w-full max-w-[760px] mx-auto flex flex-col items-center gap-10 pt-10">
      <div className="text-cyan-950 text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] leading-[48px] text-center">
        Common questions
      </div>

      <div className="w-full flex flex-col gap-4">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="w-full bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors"
          >
            <div className="text-cyan-950 text-base font-bold font-['Plus_Jakarta_Sans']">
              {faq}
            </div>
            <div className="size-7 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2.91667V11.0833M2.91667 7H11.0833" stroke="#00808B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
