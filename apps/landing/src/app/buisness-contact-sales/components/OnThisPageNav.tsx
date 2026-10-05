"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { C } from "./theme";

const NAV_ITEMS = [
  { label: "Right route?", href: "#right-route" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Why us", href: "#why-us" },
  { label: "Sales can help", href: "#sales-can-help" },
  { label: "Sales can't override", href: "#sales-cant-override" },
  { label: "Contact Sales", href: "#contact-sales" },
  { label: "Existing customers", href: "#existing-customers" },
  { label: "FAQ", href: "#faq" },
];

export default function OnThisPageNav() {
  const [activeHash, setActiveHash] = useState<string>("#right-route");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        const id = item.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHash(item.href);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-y border-gray-200 shadow-xs">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <ul className="flex items-center gap-1.5 sm:gap-2 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={`inline-block px-3.5 py-1.5 rounded-full font-jakarta text-[13px] sm:text-[14px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#EEF8F9] text-[#066879] shadow-xs"
                      : "text-[#5E7076] hover:text-[#073B47] hover:bg-gray-100/80"
                  }`}
                  style={{
                    color: isActive ? C.mosque : undefined,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
