import React from "react";

const ITEMS = [
  {
    id: "community-rules",
    title: "Community rules",
    description:
      "Each community publishes its own rules and moderation approach. Review them before you post or join.",
    link: "View rules examples",
    icon: (
      <>
        <path d="M3.33398 4.16602H16.6673V12.4993H6.66732L3.33398 15.8327V4.16602Z" stroke="#073B47" strokeWidth="1.66667" strokeLinejoin="round" />
        <path d="M5.83398 7.5H14.1673M5.83398 10H10.834" stroke="#073B47" strokeWidth="1.66667" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "report-a-concern",
    title: "Report a concern",
    description:
      "Every community and post here can be reported. Reports are reviewed against our Community Standards and welfare policy.",
    link: "Report a concern",
    icon: (
      <path d="M9.99935 2.5L15.8327 5V10C15.8327 14.1667 12.9993 17 9.99935 17.5C6.99935 17 4.16602 14.1667 4.16602 10V5L9.99935 2.5Z" stroke="#073B47" strokeWidth="1.66667" strokeLinejoin="round" />
    ),
  },
  {
    id: "corrections",
    title: "Corrections",
    description:
      "If information here is inaccurate or a community's status has changed, you can flag it for review.",
    link: "Flag a correction",
    icon: (
      <path d="M4.16602 10.834L7.49935 14.1673L15.8327 5.83398" stroke="#073B47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function TrustModeration() {
  return (
    <div className="w-full flex flex-col items-center gap-14">
      <div className="max-w-[640px] flex flex-col items-center gap-3 text-center">
        <div className="text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-[-0.32px]">
          Trust &amp; moderation
        </div>
        <div className="text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          How community rules, reporting, and corrections work here.
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-10">
        {ITEMS.map((item) => (
          <div key={item.id} className="flex flex-col gap-4">
            <div className="size-11 bg-cyan-50 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                {item.icon}
              </svg>
            </div>
            <div className="text-teal-950 text-[14.5px] font-bold font-['Plus_Jakarta_Sans'] leading-[21.75px]">
              {item.title}
            </div>
            <div className="text-gray-500 text-[12.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[18.75px]">
              {item.description}
            </div>
            <div className="flex items-center gap-1.5 text-cyan-800 text-base font-semibold font-['Plus_Jakarta_Sans'] cursor-pointer">
              {item.link}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="#066879" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
