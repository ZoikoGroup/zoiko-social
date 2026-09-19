import React from 'react';

const translationTypes = [
  {
    type: 'Original',
    desc: 'Shown in its original language, with the source link preserved.',
  },
  {
    type: 'Human-translated',
    desc: 'Translated and reviewed under an approved editorial workflow.',
  },
  {
    type: 'Machine-assisted (reviewed)',
    desc: 'Machine-assisted translation that was reviewed before publication.',
  },
  {
    type: 'Summary only',
    desc: 'A translated summary exists; the full source remains in its original language.',
  },
  {
    type: 'Unavailable',
    desc: 'No translated summary yet — we link you to the original source instead of fabricating one.',
  },
  {
    type: 'Corrected translation',
    desc: 'A material translation correction was logged and propagated.',
  },
];

export default function LanguageAndTranslation() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-[#F7F9FA] py-16 rounded-[32px]">
      <h2 className="text-[22px] font-extrabold text-[#073B47] mb-2">Language & translation</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        We always show where a summary came from.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {translationTypes.map((item, index) => (
          <div key={index} className="bg-white border border-[#DCE5E8] rounded-[12px] p-6 h-full flex flex-col justify-start">
            <span className="inline-block bg-[#FFF5E8] text-[#C9701A] text-[11px] font-bold px-3 py-1 rounded-md self-start mb-4">
              {item.type}
            </span>
            <p className="text-[12.5px] text-[#5E7076]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
