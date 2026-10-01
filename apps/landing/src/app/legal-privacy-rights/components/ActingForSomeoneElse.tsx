import React from "react";
import { Award, User, Building2, ChevronRight } from "lucide-react";

interface AgentCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const agentCards: AgentCard[] = [
  {
    id: "authorized-agent",
    title: "Authorized agent",
    description:
      "We'll confirm both your identity and your authority.",
    icon: <Award className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "parent-guardian",
    title: "Parent or guardian",
    description:
      "For a child's account, following child-safety rules.",
    icon: <User className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "organization-representative",
    title: "Organization representative",
    description: "For business or organization data only.",
    icon: <Building2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function ActingForSomeoneElse() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Acting for someone else
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Where permitted, you can make a request for another person or
            organization.
          </p>
        </div>

        {/* 3-Column Grid of Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agentCards.map((card) => (
            <div
              key={card.id}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col justify-between gap-8 transition-all hover:border-gray-300"
            >
              <div className="flex flex-col gap-6">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {card.icon}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-[#0A5C6F] hover:text-[#074653] transition-colors cursor-pointer w-fit"
              >
                Start this route
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
