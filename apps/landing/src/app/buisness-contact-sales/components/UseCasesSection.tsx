import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users2,
  Stethoscope,
  Megaphone,
  GraduationCap,
  Plug,
  Receipt,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { C } from "./theme";

interface UseCase {
  title: string;
  description: string;
  image: string;
  gridSpan: string;
  icon: React.ReactNode;
}

const USE_CASES: UseCase[] = [
  {
    title: "Organization scale",
    description: "Multi-team communities, rollout and administration.",
    image: "/buisness-contact-sales/usecase-org-scale.png",
    gridSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
    icon: <Users2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Professional business",
    description: "Practice growth and multi-location presence.",
    image: "/buisness-contact-sales/usecase-professional.png",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-1",
    icon: <Stethoscope className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Managed advertising",
    description: "Multi-region or agency campaign planning.",
    image: "/buisness-contact-sales/usecase-managed-ads.png",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-1",
    icon: <Megaphone className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Institutions",
    description: "Education, research, nonprofits and associations.",
    image: "/buisness-contact-sales/usecase-institutions.png",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-1",
    icon: <GraduationCap className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Technology and integration",
    description: "API, identity and workflow requirements.",
    image: "/buisness-contact-sales/usecase-technology.png",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-1",
    icon: <Plug className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Procurement and billing",
    description: "Contracts, invoicing and multi-market buying.",
    image: "/buisness-contact-sales/usecase-procurement.png",
    gridSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
    icon: <Receipt className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Something else",
    description: "A business need that doesn't fit these.",
    image: "/buisness-contact-sales/usecase-something-else.png",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-1",
    icon: <HelpCircle className="w-5 h-5 text-[#066879]" />,
  },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading matching 2nd image */}
        <div className="max-w-[720px] mb-8 sm:mb-10">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            How businesses work with us
          </h2>
          <p
            className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.6] mt-2.5"
            style={{ color: C.nevada }}
          >
            Choose a use case to start your inquiry with it selected.
          </p>
        </div>

        {/* 4-Column Grid exactly matching Figma 1449:7733 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {USE_CASES.map((uc) => (
            <Link
              key={uc.title}
              href="#contact-sales"
              className={`${uc.gridSpan} group relative h-[250px] rounded-[24px] overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 block`}
            >
              {/* Background Image with Zoom on hover */}
              <Image
                src={uc.image}
                alt={uc.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Dark Gradient Overlay for optimal contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#073B47]/95 via-[#073B47]/65 to-[#073B47]/25 transition-opacity duration-300 group-hover:via-[#073B47]/75" />

              {/* Content overlay */}
              <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                {/* Top: Icon Badge */}
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {uc.icon}
                  </div>
                </div>

                {/* Bottom: Text and Action */}
                <div>
                  <h3 className="font-jakarta font-bold text-[17px] sm:text-[18px] leading-snug tracking-[-0.005em] text-white mb-1.5 group-hover:text-[#D8EEF1] transition-colors">
                    {uc.title}
                  </h3>

                  <p
                    className="font-jakarta text-[13px] sm:text-[13.5px] leading-[1.45] line-clamp-2 mb-3"
                    style={{ color: C.iceberg }}
                  >
                    {uc.description}
                  </p>

                  <div className="flex items-center gap-1 font-jakarta font-bold text-[13px] sm:text-[13.5px] text-white group-hover:text-[#D8EEF1] transition-colors">
                    <span>Start with this</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
