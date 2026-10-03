import React from "react";
import { Building, RefreshCw, Bell, FileText } from "lucide-react";

interface ChangeCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const changeCards: ChangeCard[] = [
  {
    id: "entity",
    title: "Entity record updated",
    description: "Corporate Legal approves the details.",
    icon: <Building className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "notices",
    title: "Notices refreshed",
    description: "All legal pages update together.",
    icon: <RefreshCw className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "explained",
    title: "Change explained",
    description: "Material changes are summarized below.",
    icon: <Bell className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "archive",
    title: "Archive kept",
    description: "Earlier versions stay available.",
    icon: <FileText className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function CorporateChanges() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Corporate changes
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            If the operating entity or brand changes, these notices change with
            it.
          </p>
        </div>

        {/* 4-Column Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {changeCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between gap-8 transition-all hover:border-gray-300"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                {card.icon}
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm md:text-base font-bold text-[#111827]">
                  {card.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
