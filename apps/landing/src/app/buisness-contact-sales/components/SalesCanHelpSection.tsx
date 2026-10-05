import React from "react";
import Image from "next/image";
import { Check, CheckCircle2 } from "lucide-react";
import { C } from "./theme";

const SALES_HELP_ITEMS = [
  {
    title: "Business fit",
    description: "Whether Zoiko Social has the right tools, scale and model for what you want to achieve.",
  },
  {
    title: "Commercial options",
    description: "Current plans, services, advertising arrangements and rollout structures.",
  },
  {
    title: "Scope and rollout",
    description: "Scale, regions, teams and implementation timing.",
  },
  {
    title: "Advertising support",
    description: "Managed or complex campaigns. Policies still apply.",
  },
  {
    title: "Technical needs",
    description: "Routing to the right product or technical contact.",
  },
  {
    title: "Procurement",
    description: "Contracts, legal review and invoicing requirements.",
  },
  {
    title: "The right next step",
    description: "Pointing you to Verification, Directory or self-serve tools if that's faster.",
  },
];

export default function SalesCanHelpSection() {
  return (
    <section id="sales-can-help" className="w-full bg-[#F7F9FA] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-8 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            What Sales can help with
          </h2>
          <p
            className="font-jakarta font-normal text-[14px] sm:text-[17px] leading-[1.6] mt-2"
            style={{ color: C.nevada }}
          >
            Clear scope, so expectations stay realistic from the first message.
          </p>
        </div>

        {/* 2-Column Split: Image with floating badge on Left, 7 Items on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Image with floating badge */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[460px] lg:h-[620px] rounded-[24px] overflow-hidden border border-gray-200/80 shadow-md">
            <Image
              src="/buisness-contact-sales/sales-expect-dog.png"
              alt="Zoiko Social team conversation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            
            {/* Soft gradient bottom scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating Badge at bottom */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-gray-200/80 shadow-lg flex items-center gap-2.5 sm:gap-3 z-10">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#066879] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              </div>
              <span className="font-jakarta font-bold text-[13.5px] sm:text-[15px] text-[#073B47]">
                A conversation, not a sales script
              </span>
            </div>
          </div>

          {/* Right Column: 7 Structured items */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
            {SALES_HELP_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4.5 rounded-xl bg-white border transition-all duration-200 hover:border-gray-300 hover:shadow-xs"
                style={{ borderColor: C.geyser }}
              >
                <div className="w-6 h-6 rounded-full bg-[#EEF8F9] flex items-center justify-center shrink-0 mt-0.5 text-[#066879]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    className="font-jakarta font-bold text-[14.5px] sm:text-[16px] leading-snug"
                    style={{ color: C.tarawera }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="font-jakarta text-[12.5px] sm:text-[13.5px] leading-[1.5] mt-0.5"
                    style={{ color: C.nevada }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
