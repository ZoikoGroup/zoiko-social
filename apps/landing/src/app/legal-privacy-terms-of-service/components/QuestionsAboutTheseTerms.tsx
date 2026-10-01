import React from "react";
import { Mail, BookOpen } from "lucide-react";

export default function QuestionsAboutTheseTerms() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Main CTA Banner Card */}
        <div className="w-full bg-gradient-to-r from-[#066879] to-[#045363] rounded-3xl p-10 md:p-16 text-white flex flex-col items-center text-center gap-6 shadow-md relative overflow-hidden">
          {/* Top Mail Icon Badge */}
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-sm">
            <Mail className="w-5 h-5 text-white" />
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              Questions about these Terms?
            </h2>
            <p className="text-xs md:text-sm text-gray-200 font-normal leading-relaxed">
              Contact Legal for formal matters, or the Help Center for everyday
              account help.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#contact-legal"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-[#05353f] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors border border-white/10 shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Legal
            </a>
            <a
              href="#help-center"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors border border-white/20 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Help Center
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
