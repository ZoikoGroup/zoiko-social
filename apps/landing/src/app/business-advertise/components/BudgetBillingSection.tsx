"use client";

import React from "react";
import {
  SlidersHorizontal,
  Receipt,
  Coins,
  HelpCircle,
  PauseCircle,
  FileText,
} from "lucide-react";
import { C } from "./theme";

const BILLING_ITEMS = [
  {
    title: "You set the budget",
    description: "Choose a daily or total budget and a spending cap.",
    icon: SlidersHorizontal,
  },
  {
    title: "Taxes shown upfront",
    description: "Taxes and fees appear before you confirm.",
    icon: Receipt,
  },
  {
    title: "Your currency",
    description: "Billed in your account's currency, with no silent conversion.",
    icon: Coins,
  },
  {
    title: "Estimates are estimates",
    description: "Any delivery estimate is labeled as one, not a promise.",
    icon: HelpCircle,
  },
  {
    title: "Safe pausing",
    description: "If a payment fails, campaigns pause. No surprise charges.",
    icon: PauseCircle,
  },
  {
    title: "Clear billing policy",
    description: "Refunds and credits follow the advertising billing policy.",
    icon: FileText,
  },
];

export default function BudgetBillingSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Budget and billing
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            You stay in control of what you spend.
          </p>
        </div>

        {/* 6 Cards Grid (3 columns x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {BILLING_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[20px] bg-white border border-[#DCE5E8] p-6 flex flex-col justify-between hover:border-[#066879]/50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center text-[#066879] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-jakarta font-bold text-[17px] text-[#073B47] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-[13.5px] leading-relaxed text-[#5E7076]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
