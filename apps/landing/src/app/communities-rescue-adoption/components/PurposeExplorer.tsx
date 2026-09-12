import React from "react";

const PURPOSES = [
  {
    id: "fostering",
    title: "Fostering",
    description: "Communities coordinating temporary foster care for animals.",
    linkText: "Browse Fostering communities →",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3337 3.83337C16.0003 2.50004 13.8337 2.50004 12.5003 3.83337L10.0003 6.33337L7.50033 3.83337C6.16699 2.50004 4.00033 2.50004 2.66699 3.83337C1.33366 5.16671 1.33366 7.33337 2.66699 8.66671L10.0003 15.8334L17.3337 8.66671C18.667 7.33337 18.667 5.16671 17.3337 3.83337Z" stroke="#066879" strokeWidth="1.66667"/>
      </svg>
    ),
  },
  {
    id: "rescue",
    title: "Rescue",
    description: "Communities centered on rescue coordination and volunteer support.",
    linkText: "Browse Rescue communities →",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99967 17.5C6.24967 15.8333 3.33301 12.5 3.33301 8.33329V4.99996L9.99967 1.66663L16.6663 4.99996V8.33329C16.6663 12.5 13.7497 15.8333 9.99967 17.5Z" stroke="#066879" strokeWidth="1.66667"/>
      </svg>
    ),
  },
  {
    id: "adoption-support",
    title: "Adoption Support",
    description: "Communities supporting people through the adoption journey.",
    linkText: "Browse Adoption Support communities →",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.0003 10C11.8413 10 13.3337 8.50766 13.3337 6.66671C13.3337 4.82576 11.8413 3.33337 10.0003 3.33337C8.15938 3.33337 6.66699 4.82576 6.66699 6.66671C6.66699 8.50766 8.15938 10 10.0003 10Z" stroke="#066879" strokeWidth="1.66667"/>
        <path d="M3.33301 17.5C3.33301 14.1667 6.66634 12.5 9.99967 12.5C13.333 12.5 16.6663 14.1667 16.6663 17.5" stroke="#066879" strokeWidth="1.66667"/>
      </svg>
    ),
  },
];

export default function PurposeExplorer() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
        Browse by purpose
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PURPOSES.map((purpose) => (
          <div
            key={purpose.id}
            className="bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200 p-6 flex flex-col gap-5"
          >
            <div className="size-11 bg-cyan-50 rounded-xl flex items-center justify-center">
              {purpose.icon}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="text-teal-950 text-base font-bold font-['Plus_Jakarta_Sans']">
                {purpose.title}
              </div>
              <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                {purpose.description}
              </div>
            </div>
            <div className="text-cyan-800 text-xs font-bold font-['Plus_Jakarta_Sans'] cursor-pointer">
              {purpose.linkText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
