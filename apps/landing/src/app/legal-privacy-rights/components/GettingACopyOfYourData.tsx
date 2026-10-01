import React from "react";
import {
  User,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Sliders,
  FileText,
  Loader2,
  Download,
  Clock,
} from "lucide-react";

interface ExportItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const exportItems: ExportItem[] = [
  {
    id: "account-profile",
    title: "Account and profile",
    icon: <User className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "posts-media",
    title: "Posts and media",
    icon: <ImageIcon className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "messages",
    title: "Messages, where included",
    icon: <MessageSquare className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "communities-follows",
    title: "Communities and follows",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "settings-choices",
    title: "Settings and choices",
    icon: <Sliders className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "readme",
    title: "A readme explaining it",
    icon: <FileText className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function GettingACopyOfYourData() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Getting a copy of your data
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            What your export includes, and how it&apos;s delivered safely.
          </p>
        </div>

        {/* 2-Column Grid of Export Included Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportItems.map((item) => (
            <div
              key={item.id}
              className="w-full bg-white rounded-2xl border border-gray-200 transition-all p-5 flex items-center gap-4 shadow-2xs hover:border-gray-300"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-[#111827]">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* Status Badges Footer */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Preparing */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs">
            <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
            Preparing
          </div>

          {/* Ready to download */}
          <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full px-3.5 py-1.5 text-xs font-medium text-[#15803D] shadow-2xs">
            <Download className="w-3.5 h-3.5 text-[#16A34A]" />
            Ready to download
          </div>

          {/* Link expired */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-gray-400 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Link expired
          </div>
        </div>
      </div>
    </section>
  );
}
