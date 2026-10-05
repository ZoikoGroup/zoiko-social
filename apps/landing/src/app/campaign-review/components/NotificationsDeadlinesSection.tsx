"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bell,
  Mail,
  Smartphone,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function NotificationsDeadlinesSection() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [copyTeam, setCopyTeam] = useState(false);

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            Notifications and deadlines
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            Know when something needs you, before it&apos;s due.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 items-start">
          {/* Left: Your alerts settings toggles */}
          <div className="rounded-[24px] bg-[#F7F9FA] border border-[#DCE5E8] p-6 sm:p-7 shadow-2xs">
            <h3 className="font-jakarta font-bold text-[17px] text-[#073B47] mb-5 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-[#066879]" />
              <span>Your alerts</span>
            </h3>

            <div className="space-y-4">
              {/* Row 1: Email */}
              <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5 text-[#066879]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta font-bold text-[14.5px] text-[#073B47]">
                      Email
                    </h4>
                    <p className="font-jakarta text-[12px] text-[#5E7076]">
                      Decisions and action requests
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    emailAlerts ? "bg-[#066879]" : "bg-[#DCE5E8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      emailAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Row 2: In-app */}
              <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                    <Smartphone className="w-4.5 h-4.5 text-[#066879]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta font-bold text-[14.5px] text-[#073B47]">
                      In-app
                    </h4>
                    <p className="font-jakarta text-[12px] text-[#5E7076]">
                      Status changes in Ads Manager
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInAppAlerts(!inAppAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    inAppAlerts ? "bg-[#066879]" : "bg-[#DCE5E8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      inAppAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Row 3: Deadline reminders */}
              <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-[#066879]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta font-bold text-[14.5px] text-[#073B47]">
                      Deadline reminders
                    </h4>
                    <p className="font-jakarta text-[12px] text-[#5E7076]">
                      3 days and 1 day before
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeadlineReminders(!deadlineReminders)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    deadlineReminders ? "bg-[#066879]" : "bg-[#DCE5E8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      deadlineReminders ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Row 4: Copy my team */}
              <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                    <Users className="w-4.5 h-4.5 text-[#066879]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta font-bold text-[14.5px] text-[#073B47]">
                      Copy my team
                    </h4>
                    <p className="font-jakarta text-[12px] text-[#5E7076]">
                      Owners and editors on this account
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCopyTeam(!copyTeam)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    copyTeam ? "bg-[#066879]" : "bg-[#DCE5E8]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      copyTeam ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Upcoming Deadlines & Photo */}
          <div className="flex flex-col gap-3.5 w-full">
            {/* Reminder Item 1 */}
            <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 hover:border-[#E88924] transition-colors shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#E88924]" />
                <span className="font-jakarta font-bold text-[13px] text-[#E88924]">
                  Due Oct 5, 2026
                </span>
              </div>
              <p className="font-jakarta text-[13.5px] text-[#102A32] font-medium">
                Senior Dog Food Launch · Provide vet claim evidence
              </p>
            </div>

            {/* Reminder Item 2 */}
            <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 hover:border-[#E88924] transition-colors shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#E88924]" />
                <span className="font-jakarta font-bold text-[13px] text-[#E88924]">
                  Due Oct 8, 2026
                </span>
              </div>
              <p className="font-jakarta text-[13.5px] text-[#102A32] font-medium">
                Spring Adoption Week · Fix 2 issues to keep the launch date
              </p>
            </div>

            {/* Reminder Item 3 */}
            <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 hover:border-[#066879] transition-colors shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#066879]" />
                <span className="font-jakarta font-bold text-[13px] text-[#066879]">
                  No deadline
                </span>
              </div>
              <p className="font-jakarta text-[13.5px] text-[#102A32] font-medium">
                Holiday Pet Insurance · Accept restrictions whenever you&apos;re ready
              </p>
            </div>

            {/* Bottom Banner Photo */}
            <div className="relative w-full h-[150px] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924] p-0.5 shadow-xs">
              <div className="relative w-full h-full rounded-[18px] overflow-hidden">
                <Image
                  src="/campaign-review/deadline-reminder-dog.png"
                  alt="Companion reminder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
