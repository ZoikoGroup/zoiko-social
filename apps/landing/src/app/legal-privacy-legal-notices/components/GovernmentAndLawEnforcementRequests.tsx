import React from "react";
import {
  Building2,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Landmark,
} from "lucide-react";

interface GuidanceItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

const guidanceItems: GuidanceItem[] = [
  {
    id: "channel",
    text: "Submit through the dedicated official channel",
    icon: <Building2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "emergency",
    text: "Emergency requests follow a separate process",
    icon: <Clock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "policy",
    text: "Disclosure follows applicable law and policy",
    icon: <ShieldAlert className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "verified",
    text: "Requesting authority is verified",
    icon: <CheckCircle2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function GovernmentAndLawEnforcementRequests() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Government and law-enforcement requests
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            For verified officials only. Members should use the routes above.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-base md:text-lg font-bold text-[#111827]">
              Official request guidance
            </h3>
          </div>

          {/* Guidance List */}
          <div className="flex flex-col gap-3">
            {guidanceItems.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-300 transition-colors shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-xs md:text-sm font-semibold text-[#111827]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Sample Wording Callout Box */}
          <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] shrink-0 mt-0.5">
              <Landmark className="w-4 h-4" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
              <strong className="font-semibold text-[#111827]">
                Sample wording:
              </strong>{" "}
              Verified officials can submit requests at{" "}
              <span className="font-medium text-[#0A5C6F]">
                lawenforcement.zoikosocial.example
              </span>
              . Emergency requests: 24-hour line listed on the portal (sample).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
