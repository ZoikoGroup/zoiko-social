import React from 'react';

const faqs = [
  "What is the Tier system (Tier 1 vs Tier 3)?",
  "How frequently is the coverage updated?",
  "How accurate are the translations?",
  "Can I submit a tip or correction?",
  "What defines a 'material' update?",
  "How are the conservation tags applied?",
  "Who manages the underlying data?"
];

export default function FAQSection() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-[#F7F9FA] py-16 rounded-[32px]">
      <h2 className="text-[22px] font-extrabold text-[#073B47] mb-8">Frequently asked questions</h2>
      
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="flex justify-between items-center py-4 border-b border-[#DCE5E8] cursor-pointer hover:bg-black/5 px-2 rounded transition">
            <span className="text-[13.5px] font-bold text-[#102A32]">{faq}</span>
            <span className="text-[#066879] text-xl font-bold">+</span>
          </div>
        ))}
      </div>
    </div>
  );
}
