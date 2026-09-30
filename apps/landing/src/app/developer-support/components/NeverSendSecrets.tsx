import React from "react";
import {
  Lock,
  Key,
  Shield,
  Hash,
  FileText,
  CheckCircle2,
  ChevronRight,
  EyeOff,
} from "lucide-react";

interface SecretCard {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconBg: string;
  borderColor?: string;
}

const secretCards: SecretCard[] = [
  {
    title: "Passwords",
    icon: <Lock className="w-5 h-5 text-amber-700" />,
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    title: "API keys",
    description: "and client secrets",
    icon: <Key className="w-5 h-5 text-amber-700" />,
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    title: "Access tokens",
    description: "or refresh tokens",
    icon: <Shield className="w-5 h-5 text-amber-700" />,
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    title: "One-time codes",
    icon: <Hash className="w-5 h-5 text-amber-700" />,
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    title: "Private keys",
    icon: <FileText className="w-5 h-5 text-amber-700" />,
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    title: "Request IDs are fine",
    description: "if shown in your error",
    icon: <CheckCircle2 className="w-5 h-5 text-[#0A5C6F]" />,
    iconBg: "bg-[#F0F9FA] border-[#E0F2F4]",
    borderColor: "border-[#E0F2F4]",
  },
];

export default function NeverSendSecrets() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Header & Description */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-sm">
            <EyeOff className="w-6 h-6 text-amber-700" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">
              Never send secrets
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed">
              Support never needs your credentials. Remove them from
              descriptions, logs and screenshots before you send anything.
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-[#0A5C6F] hover:underline pt-1"
          >
            How we handle support data
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Right Side: Grid of Cards */}
        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {secretCards.map((card, index) => (
            <div
              key={index}
              className={`w-full bg-white rounded-3xl border p-6 flex flex-col items-center text-center justify-center gap-4 shadow-sm hover:border-gray-300 transition-colors ${
                card.borderColor || "border-gray-200"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${card.iconBg}`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-[#111827]">
                  {card.title}
                </span>
                {card.description && (
                  <span className="text-xs text-gray-500 font-normal">
                    {card.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
