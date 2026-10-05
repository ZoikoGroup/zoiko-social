import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C } from "./theme";

interface HelpCard {
  title: string;
  description: string;
  actionText: string;
  href: string;
  image: string;
}

const CARDS: HelpCard[] = [
  {
    title: "Expand your plan",
    description: "More teams, regions or services? Use the expansion request flow.",
    actionText: "Talk to Sales",
    href: "#contact-sales",
    image: "/buisness-contact-sales/already-expand-plan.png",
  },
  {
    title: "Billing or account help",
    description: "Invoices, payments or access issues.",
    actionText: "Help Center",
    href: "/support-developers-help-center",
    image: "/buisness-contact-sales/already-billing-help.png",
  },
  {
    title: "A campaign issue",
    description: "Rejected or under review? Campaign Review explains why.",
    actionText: "Campaign Review",
    href: "/campaign-review",
    image: "/buisness-contact-sales/already-campaign-issue.png",
  },
];

export default function AlreadyWorkingSection() {
  return (
    <section id="existing-customers" className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Already working with us?
          </h2>
          <p
            className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.6] mt-2.5"
            style={{ color: C.nevada }}
          >
            Some requests are faster through support or self-serve tools.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="flex flex-col bg-white rounded-[28px] border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group"
              style={{ borderColor: C.geyser }}
            >
              {/* Photo top header */}
              <div className="relative w-full h-[180px] bg-gray-100 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    className="font-jakarta font-bold text-[18px] sm:text-[19px] leading-snug mb-2"
                    style={{ color: C.tarawera }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="font-jakarta text-[13.5px] sm:text-[14px] leading-[1.5]"
                    style={{ color: C.nevada }}
                  >
                    {card.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 font-jakarta font-bold text-[14px] transition-colors group-hover:opacity-80"
                    style={{ color: C.mosque }}
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
