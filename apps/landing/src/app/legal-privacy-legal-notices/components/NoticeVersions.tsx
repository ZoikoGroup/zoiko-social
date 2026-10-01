import React from "react";
import { CheckCircle2, FileText } from "lucide-react";

interface NoticeVersion {
  id: string;
  title: string;
  meta: string;
  isCurrent?: boolean;
}

const noticeVersions: NoticeVersion[] = [
  {
    id: "v1.2",
    title: "Current notices v1.2",
    meta: "Effective September 1, 2026 · Updated September 24, 2026",
    isCurrent: true,
  },
  {
    id: "v1.0",
    title: "Original notices v1.0",
    meta: "Published March 3, 2025 · Replaced June 15, 2026",
    isCurrent: false,
  },
  {
    id: "v1.1",
    title: "Previous notices v1.1",
    meta: "Effective June 15, 2026 · Replaced September 1, 2026",
    isCurrent: false,
  },
];

export default function NoticeVersions() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Notice versions
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            When these notices changed, and what changed.
          </p>
        </div>

        {/* Notice Versions List */}
        <div className="flex flex-col gap-4">
          {noticeVersions.map((version) => (
            <div
              key={version.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    version.isCurrent
                      ? "bg-[#F0F9FA] border-[#E0F2F4] text-[#0A5C6F]"
                      : "bg-[#F7F9FA] border-gray-200 text-gray-500"
                  }`}
                >
                  {version.isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm md:text-base font-bold text-[#111827]">
                    {version.title}
                  </span>
                  <span className="text-xs text-gray-400 font-normal">
                    {version.meta}
                  </span>
                </div>
              </div>

              {version.isCurrent ? (
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#F0F9FA] border border-[#E0F2F4] text-xs font-semibold text-[#0A5C6F] w-fit">
                  Current
                </span>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs md:text-sm font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer w-fit"
                >
                  Read archived version
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
