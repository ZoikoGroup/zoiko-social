import React from 'react';

const FAQSection = () => {
  const faqs = [
    { question: "What counts as wildlife crime news?" },
    { question: "How are sources rated?" },
    { question: "What does \"charged\" mean?" },
    { question: "Why are some locations withheld?" },
    { question: "How do corrections work?" }
  ];

  return (
    <section className="w-full max-w-[1272px] mx-auto mt-10">
      <h2 className="text-[#073B47] font-extrabold text-[24px] leading-[36px] tracking-[-0.01em] mb-[20px]">
        Frequently asked questions
      </h2>

      <div className="flex flex-col gap-[10px]">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-[#DCE5E8] rounded-[14px] h-[68px] px-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <h3 className="text-[#102A32] font-bold text-[14.5px] leading-[21.75px]">
              {faq.question}
            </h3>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="#066879" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
