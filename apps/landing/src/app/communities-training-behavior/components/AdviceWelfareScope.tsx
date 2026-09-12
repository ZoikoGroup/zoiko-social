import React from "react";

const CARDS = [
  {
    id: "community-advice",
    title: "Community advice, not clinical guidance",
    description:
      "Members may share experiences and advice. Zoiko Social does not present these discussions as universal, professional, or clinically validated guidance.",
    warn: false,
    icon: (
      <path d="M3 3.75H15V11.25H6L3 14.25V3.75Z" stroke="#073B47" strokeWidth="1.35" strokeLinejoin="round" />
    ),
  },
  {
    id: "when-to-see-a-vet",
    title: "When to see a vet",
    description:
      "Sudden behavior change, pain, neurologic signs, ingestion/toxin concerns, injury, or other health symptoms may require veterinary assessment.",
    warn: false,
    icon: (
      <path d="M9.00066 15.7507C9.00066 15.7507 3.75066 12.3757 1.87566 9.00066C1.27893 8.05583 1.08196 6.91264 1.3281 5.82259C1.57425 4.73253 2.24333 3.7849 3.18816 3.18816C4.133 2.59143 5.27619 2.39446 6.36624 2.6406C7.4563 2.88675 8.40393 3.55583 9.00066 4.50066C9.5974 3.55583 10.545 2.88675 11.6351 2.6406C12.7251 2.39446 13.8683 2.59143 14.8132 3.18816C15.758 3.7849 16.4271 4.73253 16.6732 5.82259C16.9194 6.91264 16.7224 8.05583 16.1257 9.00066C14.2507 12.3757 9.00066 15.7507 9.00066 15.7507Z" stroke="#073B47" strokeWidth="1.35" />
    ),
  },
  {
    id: "in-an-emergency",
    title: "In an emergency",
    description:
      'Situations involving imminent risk of serious injury to people or animals need appropriate local professional or emergency help right away — not a wait for a community reply.',
    warn: true,
    icon: (
      <path d="M6.66667 0.833333L12.5 3.33333V8.33333C12.5 12.5 9.66667 15.3333 6.66667 15.8333C3.66667 15.3333 0.833333 12.5 0.833333 8.33333V3.33333L6.66667 0.833333Z" stroke="#C9701A" strokeWidth="1.5" strokeLinejoin="round" transform="translate(2.33 1.08)" />
    ),
  },
  {
    id: "welfare-boundary",
    title: "Welfare boundary",
    description:
      "Content that promotes cruelty, severe fear, pain, deprivation, unsafe restraint, or intentional harm can be reported and is governed by our animal-welfare policy.",
    link: "Report harmful advice",
    warn: false,
    icon: (
      <>
        <path d="M9 2.25L16.5 15.75H1.5L9 2.25Z" stroke="#073B47" strokeWidth="1.35" strokeLinejoin="round" />
        <path d="M9 7.5V10.5M9 12.75H9.0075" stroke="#073B47" strokeWidth="1.35" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "not-automatically-professional",
    title: "Not automatically professional",
    description:
      "A Training & Behavior community is not automatically professional or credentialed. Professional status is shown separately, only when governed and approved.",
    link: "Find Professional communities",
    warn: false,
    icon: (
      <>
        <path d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z" stroke="#073B47" strokeWidth="1.35" />
        <path d="M3 15C3 12 5.7 10.5 9 10.5C12.3 10.5 15 12 15 15" stroke="#073B47" strokeWidth="1.35" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "no-certified-best-method",
    title: 'No certified "best method"',
    description:
      'Zoiko Social does not certify or rank training philosophies or methods. We don\'t badge communities as "best method" or "trainer endorsed."',
    warn: false,
    icon: (
      <path d="M9 1.5L10.8 2.925L13.05 2.475L13.725 4.725L15.75 5.85L15 8.1L15.75 10.35L13.725 11.475L13.05 13.725L10.8 13.275L9 16.5L7.2 15.075L4.95 15.525L4.275 13.275L2.25 12.15L3 9.9L2.25 7.65L4.275 6.525L4.95 4.275L7.2 4.725L9 1.5Z" stroke="#073B47" strokeWidth="1.35" strokeLinejoin="round" />
    ),
  },
];

export default function AdviceWelfareScope() {
  return (
    <div className="w-full bg-cyan-50 outline outline-1 outline-offset-[-1px] outline-zinc-200 rounded-[28px] p-6 sm:p-10 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9C7.24264 9 8.25 7.99264 8.25 6.75C8.25 5.50736 7.24264 4.5 6 4.5C4.75736 4.5 3.75 5.50736 3.75 6.75C3.75 7.99264 4.75736 9 6 9Z" stroke="#073B47" strokeWidth="1.35"/>
          <path d="M12.7492 9.29922C13.7433 9.29922 14.5492 8.49333 14.5492 7.49922C14.5492 6.50511 13.7433 5.69922 12.7492 5.69922C11.7551 5.69922 10.9492 6.50511 10.9492 7.49922C10.9492 8.49333 11.7551 9.29922 12.7492 9.29922Z" stroke="#073B47" strokeWidth="1.35"/>
          <path d="M2.25 14.25C2.25 12 4.125 10.5 6 10.5C7.875 10.5 9.75 12 9.75 14.25" stroke="#073B47" strokeWidth="1.35" strokeLinecap="round"/>
        </svg>
        <div className="text-cyan-950 text-lg font-extrabold font-['Plus_Jakarta_Sans'] leading-[28.5px]">
          Advice, welfare &amp; scope
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className={`rounded-[20px] p-5 flex flex-col gap-4 ${
              card.warn
                ? "bg-orange-50 outline outline-1 outline-offset-[-1px] outline-orange-500"
                : "bg-white outline outline-1 outline-offset-[-1px] outline-zinc-200"
            }`}
          >
            <div
              className={`size-9 rounded-[10px] flex items-center justify-center ${
                card.warn ? "bg-white" : "bg-cyan-50"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                {card.icon}
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-teal-950 text-[13.5px] font-bold font-['Plus_Jakarta_Sans'] leading-5">
                {card.title}
              </div>
              <div className="text-gray-500 text-[12.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[19.4px]">
                {card.description}
              </div>
            </div>
            {card.link && (
              <div className="text-cyan-800 text-xs font-bold font-['Plus_Jakarta_Sans'] cursor-pointer">
                {card.link} &gt;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
