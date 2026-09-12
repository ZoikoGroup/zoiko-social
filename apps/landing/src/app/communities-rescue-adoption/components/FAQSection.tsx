import React from "react";

const FAQS = [
  "What are Rescue & Adoption communities?",
  "How is this different from the Adopt destination?",
  "Can I get emergency help for an animal here?",
  "What do Fostering, Rescue, and Adoption Support mean?",
  "How do I join a community?",
  "What if I see a scam, unsafe transfer, or misleading rescue claim?",
];

export default function FAQSection() {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="text-cyan-950 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9 pb-2">
        Frequently asked questions
      </div>

      {FAQS.map((question) => (
        <div
          key={question}
          className="w-full px-5 py-4 min-h-16 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <span className="text-teal-950 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {question}
          </span>
          <span className="text-cyan-800 text-xl font-normal font-['Plus_Jakarta_Sans'] leading-8 shrink-0">
            +
          </span>
        </div>
      ))}
    </div>
  );
}
