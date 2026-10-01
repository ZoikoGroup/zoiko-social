import React from "react";
import { GitBranch, Clock, CheckCircle2, FileText } from "lucide-react";

interface VersionItem {
  version: string;
  status: "Scheduled" | "Current" | "Superseded";
  effective: string;
  appliesTo: string;
  whatChanged: string;
  reAcceptance: string;
  actionText: string;
  isCurrent?: boolean;
}

const versions: VersionItem[] = [
  {
    version: "v3.0",
    status: "Scheduled",
    effective: "October 15, 2026",
    appliesTo: "Global",
    whatChanged: "Clearer Market seller rules; new Events fundraising terms.",
    reAcceptance: "Notice sent Sep 30, 2026",
    actionText: "Preview",
  },
  {
    version: "v2.4",
    status: "Current",
    effective: "September 1, 2026",
    appliesTo: "Global",
    whatChanged: "Added Adopt and Foster safety terms; clarified appeals.",
    reAcceptance: "Not required",
    actionText: "You are here",
    isCurrent: true,
  },
  {
    version: "v2.3",
    status: "Superseded",
    effective: "March 3, 2026",
    appliesTo: "Global",
    whatChanged: "Updated Premium renewal and cancellation terms.",
    reAcceptance: "Required for Premium members",
    actionText: "Read",
  },
  {
    version: "v2.0",
    status: "Superseded",
    effective: "January 10, 2025",
    appliesTo: "Global",
    whatChanged: "Full rewrite in plain language.",
    reAcceptance: "Required for all members",
    actionText: "Read",
  },
];

export default function VersionHistory() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shadow-sm">
            <GitBranch className="w-5 h-5 text-[#0A5C6F]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
              Version history
            </h2>
            <p className="text-sm text-gray-500 font-normal">
              Every public version, what changed, and whether re-acceptance was
              needed.
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F7F9FA] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Version</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Effective</th>
                <th className="py-4 px-6">Applies to</th>
                <th className="py-4 px-6">What changed</th>
                <th className="py-4 px-6">Re-acceptance</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs md:text-sm">
              {versions.map((row, index) => (
                <tr
                  key={index}
                  className={`transition-colors hover:bg-gray-50/50 ${
                    row.isCurrent ? "bg-[#F0F9FA]/20" : ""
                  }`}
                >
                  <td className="py-5 px-6 font-bold text-[#111827]">
                    {row.version}
                  </td>
                  <td className="py-5 px-6">
                    {row.status === "Scheduled" && (
                      <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-[#111827] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        Scheduled
                      </span>
                    )}
                    {row.status === "Current" && (
                      <span className="inline-flex items-center gap-1.5 bg-[#F0F9FA] border border-[#E0F2F4] text-[#0A5C6F] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A5C6F]" />
                        Current
                      </span>
                    )}
                    {row.status === "Superseded" && (
                      <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        Superseded
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6 text-gray-600 font-normal">
                    {row.effective}
                  </td>
                  <td className="py-5 px-6 text-gray-600 font-normal">
                    {row.appliesTo}
                  </td>
                  <td className="py-5 px-6 text-gray-700 font-normal max-w-xs leading-relaxed">
                    {row.whatChanged}
                  </td>
                  <td className="py-5 px-6 text-gray-600 font-normal">
                    {row.reAcceptance}
                  </td>
                  <td className="py-5 px-6 text-right font-bold">
                    {row.isCurrent ? (
                      <span className="text-xs text-gray-400 font-medium">
                        You are here
                      </span>
                    ) : (
                      <a
                        href="#"
                        className="text-xs font-bold text-[#0A5C6F] hover:underline"
                      >
                        {row.actionText}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
