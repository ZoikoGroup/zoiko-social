"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Grid,
  ListFilter,
  Building2,
  CheckCircle2,
  Bookmark,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { C } from "./theme";

const NAV_ITEMS = [
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "categories", label: "Categories", icon: Grid },
  { id: "results", label: "Results", icon: ListFilter },
  { id: "practices", label: "Practices", icon: Building2 },
  { id: "how-we-verify", label: "How we verify", icon: CheckCircle2 },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "for-professionals", label: "For professionals", icon: Briefcase },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

export default function StickyNavSection() {
  const [activeSection, setActiveSection] = useState<string>("verification");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        borderColor: C.geyser,
      }}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <ul className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-jakarta text-[13.5px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#EEF8F9] text-[#066879] shadow-xs"
                      : "text-[#5E7076] hover:text-[#102A32] hover:bg-gray-100/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#066879]" : "text-[#8A9BA1]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
