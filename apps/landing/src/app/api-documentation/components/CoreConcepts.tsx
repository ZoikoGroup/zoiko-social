import React from "react";
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  ListOrdered,
  Gauge,
  Repeat,
  Bell,
  Box,
} from "lucide-react";

interface ConceptItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const concepts: ConceptItem[] = [
  {
    title: "Authentication",
    description: "How requests prove who they are.",
    icon: <Lock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Permissions",
    description: "What each app is allowed to do.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Errors",
    description: "What went wrong, and how to recover.",
    icon: <AlertTriangle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Pagination",
    description: "Working through long lists.",
    icon: <ListOrdered className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Usage limits",
    description: "How much you can send.",
    icon: <Gauge className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Retries",
    description: "Sending again safely.",
    icon: <Repeat className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Events",
    description: "Being told when things change.",
    icon: <Bell className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Data model",
    description: "How objects relate.",
    icon: <Box className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function CoreConcepts() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Core concepts
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            The rules every request follows. Each guide appears once
            approved.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {concepts.map((concept, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {concept.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#111827]">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
