import React from "react";
import {
  ShieldCheck,
  Cookie,
  Users,
  ShieldAlert,
  Megaphone,
  FileText,
  ChevronRight,
} from "lucide-react";

interface PolicyCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}

const policies: PolicyCard[] = [
  {
    title: "Privacy Policy",
    description: "How we use personal data.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Privacy Policy",
    linkHref: "#",
  },
  {
    title: "Cookie Policy",
    description: "Cookies and your choices.",
    icon: <Cookie className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Cookie Policy",
    linkHref: "#",
  },
  {
    title: "Community Standards",
    description: "What's allowed on Zoiko Social.",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Community Standards",
    linkHref: "#",
  },
  {
    title: "Animal Welfare Policy",
    description: "How we protect animals.",
    icon: <ShieldAlert className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Animal Welfare Policy",
    linkHref: "#",
  },
  {
    title: "Advertising Standards",
    description: "Rules for advertisers.",
    icon: <Megaphone className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Advertising Standards",
    linkHref: "#",
  },
  {
    title: "Legal Notices",
    description: "Entity, IP and legal contact.",
    icon: <FileText className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Read Legal Notices",
    linkHref: "#",
  },
];

export default function RelatedPolicies() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Related policies
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            These are part of, or work alongside, the Terms.
          </p>
        </div>

        {/* Policies Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between gap-8 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col gap-4">
                {/* Policy Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0 shadow-sm">
                  {policy.icon}
                </div>

                {/* Policy Text Info */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-[#111827]">
                    {policy.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <a
                href={policy.linkHref}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0A5C6F] hover:underline"
              >
                {policy.linkText}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
