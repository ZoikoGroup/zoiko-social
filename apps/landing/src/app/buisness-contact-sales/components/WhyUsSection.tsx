import React from "react";
import Image from "next/image";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Scale,
  Globe2,
} from "lucide-react";
import { C } from "./theme";

const WHY_US_FEATURES = [
  {
    title: "Built for animal care",
    description: "Communities, professionals, organizations and news in one unified ecosystem.",
    icon: <HeartHandshake className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Verified identity",
    description: "Professional and organization verification ensures genuine representation.",
    icon: <ShieldCheck className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Responsible advertising",
    description: "Vetted, animal-aligned ads, clearly labeled and held to high welfare standards.",
    icon: <CheckCircle2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Real communities",
    description: "Connect with communities where your organization's mission actually matters.",
    icon: <Users2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Trust built in",
    description: "Moderation, welfare and reporting systems run independently from commercial interests.",
    icon: <Scale className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Global and local",
    description: "Designed for worldwide reach with local discovery, emergency tools and events.",
    icon: <Globe2 className="w-5 h-5 text-[#066879]" />,
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-8 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Why Zoiko Social for business
          </h2>
          <p
            className="font-jakarta font-normal text-[14px] sm:text-[17px] leading-[1.6] mt-2"
            style={{ color: C.nevada }}
          >
            A platform designed around animals, and the people and organizations who care for them.
          </p>
        </div>

        {/* 2-Column Split: 6 Feature Cards on Left, 2 Images on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* Left: 6 Feature Cards (approx 60% width) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
            {WHY_US_FEATURES.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-start p-5 sm:p-6 rounded-[20px] bg-white border transition-all duration-200 hover:shadow-md hover:border-gray-300"
                style={{ borderColor: C.geyser }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF8F9] flex items-center justify-center mb-3.5 shrink-0">
                  {item.icon}
                </div>
                <h3
                  className="font-jakarta font-bold text-[16px] sm:text-[17px] leading-snug mb-1.5"
                  style={{ color: C.tarawera }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-jakarta text-[13px] sm:text-[13.5px] leading-[1.5]"
                  style={{ color: C.nevada }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right: 2 Stacked Curated Visual Cards (approx 40% width) */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4.5 justify-between">
            {/* Top Image Card: Cat */}
            <div className="relative w-full sm:w-1/2 lg:w-full h-[210px] sm:h-[250px] lg:h-[265px] rounded-[22px] overflow-hidden border border-gray-200/80 shadow-xs group">
              <Image
                src="/buisness-contact-sales/whyus-cat.png"
                alt="Community care for animals"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom Image Card: Dog */}
            <div className="relative w-full sm:w-1/2 lg:w-full h-[210px] sm:h-[250px] lg:h-[265px] rounded-[22px] overflow-hidden border border-gray-200/80 shadow-xs group">
              <Image
                src="/buisness-contact-sales/whyus-dog.png"
                alt="Animal welfare focus"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
