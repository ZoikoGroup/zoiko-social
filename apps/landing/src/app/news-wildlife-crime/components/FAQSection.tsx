import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What counts as wildlife crime news?",
      answer:
        "Wildlife crime news covers documented cases and policy involving poaching, wildlife trafficking, illegal trade in animals or animal products, seizures and interdictions, and the prosecutions and enforcement actions that follow.",
    },
    {
      question: "How are sources rated?",
      answer:
        "Sources are labeled against Zoiko Social's published source standards. A rating describes the publisher, not every claim in every story. Statements from advocacy groups or organizations are always labeled as such, never presented as court or authority records.",
    },
    {
      question: "What does \"charged\" mean?",
      answer:
        "Charged means authorities have formally accused someone of a crime. It is not a finding of guilt. Each story shows its legal stage — such as investigation, arrest, charged, trial, or conviction — and people are presumed innocent unless convicted.",
    },
    {
      question: "Why are some locations withheld?",
      answer:
        "Precise locations can put animals, rangers, and investigations at risk. Sensitive sites such as nesting or denning areas, release sites, and active operations may be withheld or broadened to a wider region.",
    },
    {
      question: "How do corrections work?",
      answer:
        "If a story has a factual or sourcing problem, report it through Report an Inaccuracy. Our editorial team reviews it against the source, and confirmed corrections are added to the story with a visible correction note and date.",
    },
  ];

  return (
    <section className="w-full max-w-[1272px] mx-auto mt-10">
      <h2 className="text-[#073B47] font-extrabold text-[24px] leading-[36px] tracking-[-0.01em] mb-[20px]">
        Frequently asked questions
      </h2>

      <div className="flex flex-col gap-[10px]">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="bg-white border border-[#DCE5E8] rounded-[14px] hover:bg-gray-50 transition-colors group"
          >
            <summary className="min-h-[68px] px-6 py-3 flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-[#102A32] font-bold text-[14.5px] leading-[21.75px]">
                {faq.question}
              </h3>
              {/* Plus icon — turns into a cross when open */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform group-open:rotate-45">
                <path d="M6 1V11M1 6H11" stroke="#066879" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </summary>

            <p className="px-6 pb-5 text-[#5E7076] text-sm leading-6">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
