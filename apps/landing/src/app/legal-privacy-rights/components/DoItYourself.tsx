import React from "react";
import {
  Download,
  Trash2,
  Edit3,
  Cookie,
  Mail,
  MapPin,
  Volume2,
  Briefcase,
  ChevronRight,
} from "lucide-react";

interface ActionItem {
  title: string;
  descriptionLocation: string;
  formalRequestText: string;
  icon: React.ReactNode;
}

const actionItems: ActionItem[] = [
  {
    title: "Download your data",
    descriptionLocation: "In Account privacy settings",
    formalRequestText: "or make a formal request",
    icon: <Download className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Delete your account",
    descriptionLocation: "In Account settings",
    formalRequestText: "or make a formal request",
    icon: <Trash2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Edit profile details",
    descriptionLocation: "In Profile settings",
    formalRequestText: "or make a formal request",
    icon: <Edit3 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Cookie choices",
    descriptionLocation: "In Cookie preferences",
    formalRequestText: "or make a formal request",
    icon: <Cookie className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Marketing emails",
    descriptionLocation: "In Email preferences",
    formalRequestText: "or make a formal request",
    icon: <Mail className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Location and visibility",
    descriptionLocation: "In Privacy controls",
    formalRequestText: "or make a formal request",
    icon: <MapPin className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Ad choices",
    descriptionLocation: "In Ad privacy controls",
    formalRequestText: "or make a formal request",
    icon: <Volume2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Close a business profile",
    descriptionLocation: "In Business settings",
    formalRequestText: "or make a formal request",
    icon: <Briefcase className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function DoItYourself() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Do it yourself, right now
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Many changes are instant in your settings. A formal request is
            always still available.
          </p>
        </div>

        {/* Two-Column Grid of Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionItems.map((item, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4 shadow-2xs hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-bold text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    {item.descriptionLocation} ·{" "}
                    <a
                      href="#"
                      className="text-[#0A5C6F] underline hover:text-[#074653]"
                    >
                      {item.formalRequestText}
                    </a>
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 text-[#111827] border border-gray-200 text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-2xs"
              >
                Open
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
