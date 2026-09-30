import React from "react";
import { Wrench, Calendar, UserCheck, X } from "lucide-react";

interface MaintenanceItem {
  month: string;
  day: string;
  title: string;
  status: string;
  statusType: "in-progress" | "scheduled" | "canceled";
  description: string;
  dateTime: string;
  subTime: string;
  affectedService: string;
  isHighlighted?: boolean;
}

const maintenanceItems: MaintenanceItem[] = [
  {
    month: "SEP",
    day: "30",
    title: "Adoption listings upgrade",
    status: "In progress",
    statusType: "in-progress",
    description: "Listings can be viewed but not created or edited during the window.",
    dateTime: "Sep 30, 2026, 14:00–16:00 UTC",
    subTime: "Ends in 1 hr 39 min (planned)",
    affectedService: "Adoption listings",
    isHighlighted: true,
  },
  {
    month: "OCT",
    day: "4",
    title: "Sign-in service update",
    status: "Scheduled",
    statusType: "scheduled",
    description: "You may be asked to sign in again after the window ends.",
    dateTime: "Oct 4, 2026, 02:00–03:00 UTC",
    subTime: "Window length 1 hr",
    affectedService: "Sign-in and accounts",
    isHighlighted: false,
  },
  {
    month: "OCT",
    day: "2",
    title: "Events calendar update",
    status: "Canceled",
    statusType: "canceled",
    description: "Canceled on Sep 29, 2026. No work will take place in this window.",
    dateTime: "Oct 2, 2026, 04:00–05:00 UTC",
    subTime: "Window length 1 hr",
    affectedService: "Events",
    isHighlighted: false,
  },
];

export default function PlannedMaintenance() {
  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Planned maintenance
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Scheduled work and its expected impact. Times in UTC.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {maintenanceItems.map((item, index) => (
            <div
              key={index}
              className={`w-full rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all bg-white ${
                item.isHighlighted
                  ? "border-2 border-[#0A5C6F] shadow-sm"
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              {/* Top Section */}
              <div className="flex flex-col gap-6">
                {/* Date & Title / Status Row */}
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-16 rounded-2xl bg-[#EEF8F9] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#066879] tracking-wider">
                      {item.month}
                    </span>
                    <span className="text-xl font-bold text-[#111827]">
                      {item.day}
                    </span>
                  </div>

                  {/* Title & Status */}
                  <div className="flex flex-col items-start text-right gap-2">
                    <h3 className="text-base font-bold text-[#073B47]">
                      {item.title}
                    </h3>
                    {item.statusType === "in-progress" && (
                      <span className="inline-flex items-center gap-1 bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4] text-xs font-medium px-3 py-1 rounded-full">
                        <Wrench className="w-3 h-3" />
                        {item.status}
                      </span>
                    )}
                    {item.statusType === "scheduled" && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {item.status}
                      </span>
                    )}
                    {item.statusType === "canceled" && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
                        <X className="w-3 h-3" />
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Date/Time Details */}
                <div className="flex flex-col gap-1 pt-4 border-t border-gray-100">
                  <span className="text-sm font-bold text-[#111827]">
                    {item.dateTime}
                  </span>
                  <span className="text-xs text-gray-400 font-normal">
                    {item.subTime}
                  </span>
                </div>
              </div>

              {/* Affected Services Footer */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  Affected services
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4] text-xs font-medium px-3 py-1.5 rounded-full">
                  {index === 0 && <Wrench className="w-3.5 h-3.5" />}
                  {index === 1 && <UserCheck className="w-3.5 h-3.5" />}
                  {index === 2 && <Calendar className="w-3.5 h-3.5" />}
                  {item.affectedService}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}