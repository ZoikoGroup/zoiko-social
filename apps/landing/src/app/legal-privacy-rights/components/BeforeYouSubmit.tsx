import React from "react";
import {
  User,
  Lock,
  ShieldCheck,
  Layers,
  Scale,
  ShieldAlert,
} from "lucide-react";

interface InfoCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const infoCards: InfoCard[] = [
  {
    id: "one-person",
    title: "One person per request",
    description: "Keep each request to one person or organization.",
    icon: <User className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "no-passwords",
    title: "No passwords, ever",
    description: "We never ask for passwords, codes or card numbers.",
    icon: <Lock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "proportionate-check",
    title: "A proportionate identity check",
    description: "Only what's needed to protect your data.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "choose-scope",
    title: "Choose your scope",
    description: "Everything, or a specific product or data type.",
    icon: <Layers className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "data-kept",
    title: "Some data may be kept",
    description: "If law or safety requires it, we'll explain why.",
    icon: <Scale className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "secure-messages",
    title: "Secure messages only",
    description: "Updates and files come through a secure channel.",
    icon: <ShieldAlert className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function BeforeYouSubmit() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Before you submit
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Six things worth knowing.
          </p>
        </div>

        {/* 3x2 Grid of Static Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((item) => (
            <div
              key={item.id}
              className="w-full bg-white rounded-2xl border border-gray-200 transition-all p-6 flex flex-col justify-between gap-6 shadow-2xs hover:border-gray-300"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-[#111827]">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
