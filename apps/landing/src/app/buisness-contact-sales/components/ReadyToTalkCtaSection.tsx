import React from "react";
import Link from "next/link";
import { Handshake, Send } from "lucide-react";
import { C } from "./theme";

export default function ReadyToTalkCtaSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div
          className="relative w-full rounded-[22px] sm:rounded-[28px] overflow-hidden p-7 sm:p-12 lg:p-14 text-center text-white"
          style={{
            background:
              "linear-gradient(164deg, rgba(6, 104, 121, 1) 0%, rgba(4, 83, 99, 1) 100%)",
          }}
        >
          <div className="relative z-10 max-w-[680px] mx-auto flex flex-col items-center">
            {/* Top Handshake Icon Badge */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.12] flex items-center justify-center text-white mb-4 sm:mb-5 shadow-xs">
              <Handshake className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Heading 2 */}
            <h2 className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] text-white">
              Ready to talk?
            </h2>

            {/* Subtitle */}
            <p
              className="font-jakarta font-normal text-[14px] sm:text-[16px] leading-[1.6] mt-2.5 sm:mt-3 mb-6 sm:mb-8 max-w-[500px]"
              style={{ color: C.botticelli }}
            >
              Tell us what your organization needs, and we&apos;ll route it to the right team.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="#contact-sales"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 rounded-xl font-jakarta font-semibold text-[14.5px] sm:text-[14px] text-white border border-white/45 bg-transparent hover:bg-white/10 transition-all duration-200 cursor-pointer text-center w-full sm:w-auto"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Contact Sales</span>
              </Link>

              <Link
                href="#right-route"
                className="inline-flex items-center justify-center px-5 py-3.5 sm:py-3 rounded-xl font-jakarta font-semibold text-[14.5px] sm:text-[14px] text-white border border-white/45 bg-transparent hover:bg-white/10 transition-all duration-200 cursor-pointer text-center w-full sm:w-auto"
              >
                <span>Find a faster route</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
