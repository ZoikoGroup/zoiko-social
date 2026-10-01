import React from "react";
import { Trash2, Scale, Download, CheckCircle2 } from "lucide-react";

interface DataSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: string[];
}

const sections: DataSection[] = [
  {
    id: "deleted",
    title: "What's deleted",
    icon: <Trash2 className="w-4 h-4 text-[#0A5C6F]" />,
    iconBg: "bg-[#F0F9FA] border border-[#E0F2F4]",
    items: [
      "Your account and profile",
      "Your posts and media",
      "Qualifying personal data",
    ],
  },
  {
    id: "stay",
    title: "What may stay",
    icon: <Scale className="w-4 h-4 text-[#B45309]" />,
    iconBg: "bg-[#FEF6EE] border border-[#FBEAD4]",
    items: [
      "Records the law requires",
      "Safety and fraud records",
      "Content others shared, like messages they received",
    ],
  },
  {
    id: "before-you-go",
    title: "Before you go",
    icon: <Download className="w-4 h-4 text-[#0A5C6F]" />,
    iconBg: "bg-[#F0F9FA] border border-[#E0F2F4]",
    items: [
      "Download a copy first, if you like",
      "No survey or call required",
      "You'll confirm deliberately",
    ],
  },
];

export default function DeletingYourData() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Deleting your data
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Clear on what goes, what may stay, and what changes. As easy as
            signing up.
          </p>
        </div>

        {/* 3-Column Grid of Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col justify-between gap-8 transition-all hover:border-gray-300"
            >
              <div className="flex flex-col gap-6">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.iconBg}`}
                >
                  {section.icon}
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    {section.title}
                  </h3>

                  <ul className="flex flex-col gap-3">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0A5C6F] shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
