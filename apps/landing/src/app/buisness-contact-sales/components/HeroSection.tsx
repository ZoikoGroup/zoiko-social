import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  Briefcase,
  Lock,
  Landmark,
  Search,
  Megaphone,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { C } from "./theme";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-0 lg:min-h-[550px]">
          
          {/* Left Column: Heading, intro & action buttons */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center gap-4 max-w-[600px]">
            {/* Tag / Eyebrow */}
            <div>
              <span
                className="font-jakarta font-bold text-xs uppercase tracking-[0.12em]"
                style={{ color: C.mosque }}
              >
                Contact Sales
              </span>
            </div>

            {/* H1 Heading */}
            <h1
              className="font-jakarta font-extrabold text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] tracking-[-0.02em]"
              style={{ color: C.tarawera }}
            >
              Talk with Zoiko Social about <br className="hidden sm:inline" />
              your business or <br className="hidden sm:inline" />
              organization needs.
            </h1>

            {/* Paragraph */}
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.55]"
              style={{ color: C.nevada }}
            >
              For organizations, professionals, advertisers, agencies and institutions with
              commercial, scale, rollout or managed-service needs. We&apos;ll route you to the
              right conversation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <Link
                href="#contact-sales"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 rounded-xl font-jakarta font-semibold text-[15px] leading-tight text-white transition-all duration-200 shadow-sm hover:opacity-95 hover:shadow-md cursor-pointer text-center"
                style={{ backgroundColor: C.mosque }}
              >
                <Send className="w-4 h-4 fill-white -rotate-12 translate-y-[-1px]" />
                <span>Contact Sales</span>
              </Link>

              <Link
                href="#use-cases"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 rounded-xl font-jakarta font-semibold text-[15px] leading-tight transition-all duration-200 border bg-white hover:bg-gray-50 cursor-pointer shadow-2xs text-center"
                style={{ borderColor: C.geyser, color: C.firefly }}
              >
                <Briefcase className="w-4 h-4 text-[#102A32]" />
                <span>Explore business options</span>
              </Link>
            </div>

            {/* Policy Disclaimer Banner */}
            <div
              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border mt-2 bg-white max-w-[540px]"
              style={{ borderColor: C.geyser }}
            >
              <div className="shrink-0 mt-0.5 text-[#066879]">
                <Lock className="w-4.5 h-4.5 text-[#066879]" />
              </div>
              <p
                className="font-jakarta text-[12.5px] sm:text-[13.5px] leading-[1.5]"
                style={{ color: C.nevada }}
              >
                Sales can&apos;t override verification, Advertising Standards, Campaign Review,
                moderation, animal-welfare, safety or editorial decisions.
              </p>
            </div>
          </div>

          {/* Right Column: Layered Fanned Cards Mockup with Mobile Responsive Scaling */}
          <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[390px] sm:h-[500px] lg:h-[550px] flex items-center justify-center overflow-hidden sm:overflow-visible">
            
            {/* Scaled canvas for mobile responsiveness */}
            <div className="relative w-full max-w-[560px] h-[480px] origin-center scale-[0.72] xs:scale-[0.82] sm:scale-100 transition-transform">
              
              {/* Floating Card 1: Riverbend Animal Rescue (Back, Left, rotated -6deg) */}
              <div
                className="absolute left-0 sm:left-2 top-2 sm:top-4 w-[280px] sm:w-[315px] bg-white rounded-[28px] border overflow-hidden transition-all duration-300 -rotate-6 hover:-rotate-2 hover:scale-[1.02] z-10 shadow-[0px_20px_48px_0px_rgba(7,59,71,0.15)] origin-bottom-left"
                style={{ borderColor: C.geyser }}
              >
                <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-white">
                  <h3
                    className="font-jakarta font-bold text-[14px] sm:text-[15px] leading-snug truncate"
                    style={{ color: C.tarawera }}
                  >
                    Riverbend Animal Rescue
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] sm:text-[13px] text-[#5E7076] font-jakarta">
                    <Landmark className="w-3.5 h-3.5 text-[#5E7076]" />
                    <span>Verified organization</span>
                  </div>
                </div>
                <div className="relative w-full h-[180px] sm:h-[205px] bg-[#EEF8F9] overflow-hidden">
                  <Image
                    src="/buisness-contact-sales/hero-rescue-card.png"
                    alt="Riverbend Animal Rescue"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 280px, 315px"
                    priority
                  />
                </div>
              </div>

              {/* Floating Card 2: Harbor Point Veterinary Clinic (Middle, shifted right, rotated +1deg) */}
              <div
                className="absolute left-[70px] sm:left-[95px] top-[60px] sm:top-[68px] w-[275px] sm:w-[305px] bg-white rounded-[28px] border overflow-hidden transition-all duration-300 rotate-1 hover:rotate-0 hover:scale-[1.02] z-20 shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] origin-center"
                style={{ borderColor: C.geyser }}
              >
                <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-white">
                  <h3
                    className="font-jakarta font-bold text-[14px] sm:text-[15px] leading-snug truncate"
                    style={{ color: C.tarawera }}
                  >
                    Harbor Point Veterinary Clinic
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] sm:text-[13px] text-[#5E7076] font-jakarta">
                    <Search className="w-3.5 h-3.5 text-[#5E7076]" />
                    <span>Listed in the Directory</span>
                  </div>
                </div>
                <div className="relative w-full h-[175px] sm:h-[195px] bg-[#EEF8F9] overflow-hidden">
                  <Image
                    src="/buisness-contact-sales/hero-clinic-card.png"
                    alt="Harbor Point Veterinary Clinic"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 275px, 305px"
                    priority
                  />
                </div>
              </div>

              {/* Floating Card 3: Spring adoption campaign (Front, Right, rotated +6deg) */}
              <div
                className="absolute right-0 sm:right-2 top-[125px] sm:top-[135px] w-[290px] sm:w-[325px] bg-white rounded-[28px] border overflow-hidden transition-all duration-300 rotate-6 hover:rotate-3 hover:scale-[1.02] z-30 shadow-[0px_24px_54px_0px_rgba(7,59,71,0.22)] origin-top-right"
                style={{ borderColor: C.geyser }}
              >
                <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-white">
                  <h3
                    className="font-jakarta font-bold text-[14px] sm:text-[15px] leading-snug truncate"
                    style={{ color: C.tarawera }}
                  >
                    Spring adoption campaign
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] sm:text-[13px] text-[#5E7076] font-jakarta">
                    <Megaphone className="w-3.5 h-3.5 text-[#5E7076]" />
                    <span>Advertising · 3 regions</span>
                  </div>
                </div>
                <div className="relative w-full h-[190px] sm:h-[215px] bg-[#EEF8F9] overflow-hidden">
                  <Image
                    src="/buisness-contact-sales/hero-shelter-card.png"
                    alt="Spring adoption campaign"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 290px, 325px"
                  />
                </div>
              </div>

              {/* Floating Pill Badge 1: "One conversation, routed right" (Top-Right) */}
              <div className="absolute right-1 sm:right-4 top-1 sm:top-2 z-40 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.12)] flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="font-jakarta font-bold text-[12px] sm:text-[13px] text-[#073B47] whitespace-nowrap">
                  One conversation, routed right
                </span>
              </div>

              {/* Floating Pill Badge 2: "Policies stay independent" (Bottom-Left) */}
              <div className="absolute left-4 sm:left-14 bottom-4 sm:bottom-6 z-40 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.12)] flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-jakarta font-bold text-[12px] sm:text-[13px] text-[#073B47] whitespace-nowrap">
                  Policies stay independent
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
