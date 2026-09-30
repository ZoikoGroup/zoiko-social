"use client"
import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  Users,
  Globe,
  Lock,
  Send,
  Code,
  Edit3,
} from "lucide-react";

interface Incident {
  date: string;
  time: string;
  title: string;
  service: string;
  incidentId: string;
  correction?: string;
  icon: React.ReactNode;
}

const incidents: Incident[] = [
  {
    date: "Sep 26, 2026",
    time: "09:14–10:02 UTC",
    title: "Community pages loading slowly",
    service: "Communities",
    incidentId: "INC-2026-0918",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    date: "Sep 21, 2026",
    time: "07:52–09:30 UTC",
    title: "News articles not refreshing",
    service: "World Animal News",
    incidentId: "INC-2026-0907",
    correction:
      "Corrected. Start time corrected from 08:10 to 07:52 UTC on Sep 22, 2026.",
    icon: <Globe className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    date: "Sep 14, 2026",
    time: "18:20–19:05 UTC",
    title: "Sign-in errors for some accounts",
    service: "Sign-in and accounts",
    incidentId: "INC-2026-0889",
    icon: <Lock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    date: "Sep 3, 2026",
    time: "12:02–12:48 UTC",
    title: "Direct messages delayed",
    service: "Direct messages",
    incidentId: "INC-2026-0871",
    icon: <Send className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    date: "Aug 28, 2026",
    time: "21:10–22:40 UTC",
    title: "Developer API returning errors",
    service: "Developer API, Webhooks",
    incidentId: "INC-2026-0856",
    icon: <Code className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function IncidentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("All services");
  const [selectedRecord, setSelectedRecord] = useState("All records");
  const [selectedPeriod, setSelectedPeriod] = useState("All published");

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Incident history
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Resolved incidents, with any corrections shown.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
          {/* Search Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600">
              Search incidents
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by incident title"
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Service Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600">Service</label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-[#111827] appearance-none focus:outline-none focus:border-[#0A5C6F] transition-colors shadow-sm cursor-pointer"
              >
                <option>All services</option>
                <option>Communities</option>
                <option>World Animal News</option>
                <option>Sign-in and accounts</option>
                <option>Direct messages</option>
                <option>Developer API</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Record Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600">Record</label>
            <div className="relative">
              <select
                value={selectedRecord}
                onChange={(e) => setSelectedRecord(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-[#111827] appearance-none focus:outline-none focus:border-[#0A5C6F] transition-colors shadow-sm cursor-pointer"
              >
                <option>All records</option>
                <option>Incidents</option>
                <option>Maintenance</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600">Period</label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-[#111827] appearance-none focus:outline-none focus:border-[#0A5C6F] transition-colors shadow-sm cursor-pointer"
              >
                <option>All published</option>
                <option>Past 30 days</option>
                <option>Past 3 months</option>
                <option>Past year</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <span className="text-xs text-gray-500 font-normal">
          Showing 5 of 9 incidents
        </span>

        {/* Incidents Table / Container */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100">
          {incidents.map((incident, index) => (
            <div
              key={index}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
            >
              {/* Left: Date & Time */}
              <div className="flex items-start gap-4 md:w-56 shrink-0">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">
                    {incident.date}
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    {incident.time}
                  </span>
                </div>
              </div>

              {/* Middle: Icon, Title & Service */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0 mt-0.5">
                  {incident.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#111827]">
                    {incident.title}
                  </h3>
                  <span className="text-xs text-gray-500 font-normal">
                    {incident.service} · {incident.incidentId}
                  </span>
                  {incident.correction && (
                    <div className="flex items-start gap-1.5 mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2 rounded-xl">
                      <Edit3 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{incident.correction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Status & Details Button */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <span className="inline-flex items-center gap-1.5 bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4] text-xs font-medium px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolved
                </span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#111827] hover:bg-gray-50 transition-colors bg-white shadow-sm"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show Older Incidents Button */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="px-6 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-[#111827] hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            Show older incidents
          </button>
        </div>
      </div>
    </section>
  );
}
