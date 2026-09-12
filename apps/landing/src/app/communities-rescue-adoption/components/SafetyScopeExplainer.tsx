import React from "react";

const CAN_TELL_YOU = [
  "The community's purpose — fostering, rescue, or adoption support",
  "Species and topics the community is relevant to",
  "Access rules and any source-governed organization context",
];

const CANNOT_GUARANTEE = [
  "Guaranteed rescue response, dispatch, or pickup time",
  "Animal availability, adoption approval, or successful placement",
  "Veterinary care, legal ownership validity, or organization verification",
];

export default function SafetyScopeExplainer() {
  return (
    <div className="w-full bg-cyan-50 rounded-[32px] p-6 sm:p-10 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
          Know what the community can help coordinate.
        </div>
        <div className="max-w-[635px] text-gray-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[22px]">
          Rescue &amp; Adoption communities can support discussion,
          coordination, fostering, rescue, and adoption-related participation
          according to each community&apos;s purpose and rules. Displayed
          scope comes from approved Zoiko Social product records.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase leading-5 tracking-tight">
            What this can tell you
          </div>
          <div className="flex flex-col gap-2">
            {CAN_TELL_YOU.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-cyan-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
                  ✓
                </span>
                <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase leading-5 tracking-tight">
            What this cannot guarantee
          </div>
          <div className="flex flex-col gap-2">
            {CANNOT_GUARANTEE.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-amber-600 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
                  ✕
                </span>
                <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adopt destination banner */}
      <div className="w-full bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-3 px-4 py-3.5">
        <div className="size-[17px] shrink-0">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.50033 8.5C10.0651 8.5 11.3337 7.23148 11.3337 5.66667C11.3337 4.10186 10.0651 2.83334 8.50033 2.83334C6.93552 2.83334 5.66699 4.10186 5.66699 5.66667C5.66699 7.23148 6.93552 8.5 8.50033 8.5Z" stroke="#C9701A" strokeWidth="1.41667"/>
            <path d="M2.83301 14.875C2.83301 12.0417 5.66634 10.625 8.49967 10.625C11.333 10.625 14.1663 12.0417 14.1663 14.875" stroke="#C9701A" strokeWidth="1.41667"/>
          </svg>
        </div>
        <div className="text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[22px] text-teal-950">
          Looking to browse animals available for adoption? Use the separate{" "}
          <span className="text-cyan-800 font-semibold underline cursor-pointer">
            Go to Adopt
          </span>{" "}
          destination — this Communities page is for discussion and
          coordination, not an animal listing directory.
        </div>
      </div>

      {/* Emergency banner */}
      <div className="w-full bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-3 px-4 py-3.5">
        <div className="size-[18px] shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6.75V9.75M9 12.75H9.0075M7.7175 2.895L1.365 13.5C1.23403 13.7268 1.16473 13.984 1.16399 14.2459C1.16326 14.5078 1.23112 14.7653 1.36082 14.9929C1.49052 15.2204 1.67754 15.4101 1.90328 15.5429C2.12902 15.6757 2.3856 15.7471 2.6475 15.75H15.3525C15.6144 15.7471 15.871 15.6757 16.0967 15.5429C16.3225 15.4101 16.5095 15.2204 16.6392 14.9929C16.7689 14.7653 16.8367 14.5078 16.836 14.2459C16.8353 13.984 16.766 13.7268 16.635 13.5L10.2825 2.895C10.1488 2.67458 9.96054 2.49234 9.7359 2.36586C9.51125 2.23939 9.2578 2.17294 9 2.17294C8.7422 2.17294 8.48875 2.23939 8.2641 2.36586C8.03946 2.49234 7.8512 2.67458 7.7175 2.895Z" stroke="#C9701A" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[22px] text-teal-950">
          Immediate threats to animal or human safety need a local emergency,
          animal-welfare, or veterinary channel — not community discovery.
          This page is not an emergency-dispatch service.
        </div>
      </div>
    </div>
  );
}
