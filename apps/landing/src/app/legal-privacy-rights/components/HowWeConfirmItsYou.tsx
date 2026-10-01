import React from "react";
import { User, Smartphone, ShieldCheck } from "lucide-react";

interface VerificationCard {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass?: string;
}

const verificationCards: VerificationCard[] = [
  {
    id: "signed-in",
    category: "Settings and simple fixes",
    title: "Signed in",
    description: "Your existing sign-in is usually enough.",
    icon: <User className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "extra-step",
    category: "Copies of your data",
    title: "A quick extra step",
    description: "A code or confirmation to your account.",
    icon: <Smartphone className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "additional-verification",
    category: "Deletion or sensitive data",
    title: "Additional verification",
    description:
      "Only what&apos;s needed to stop someone else acting as you.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
    bgClass: "bg-[#EEF8F9]",
  },
];

export default function HowWeConfirmItsYou() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            How we confirm it&apos;s you
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            The check matches the request. We don&apos;t ask for ID for every
            request.
          </p>
        </div>

        {/* 3-Column Container Card with Dividers */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 overflow-hidden">
          {verificationCards.map((item) => (
            <div
              key={item.id}
              className={`p-6 md:p-8 flex flex-col justify-between gap-8 ${
                item.bgClass || "bg-white"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0A5C6F] tracking-wide uppercase">
                  {item.category}
                </span>
                <h3 className="text-base md:text-lg font-bold text-[#111827]">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <p className="text-xs text-gray-400 font-normal text-center md:text-left">
          Anything you share to confirm your identity is kept separately and
          used only for this.
        </p>
      </div>
    </section>
  );
}
