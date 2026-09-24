"use client";

import React from "react";

const moderationItems = [
  {
    title: "Inappropriate comment",
    reported: "Reported 2 hours ago by Alex Chen",
  },
  {
    title: "Spam post",
    reported: "Reported 4 hours ago by Morgan Davis",
  },
];

export default function ModerationDashboard() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-12">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Moderation dashboard
            </h2>
          </div>

          {/* Dashboard */}
          <div className="w-full rounded-3xl border border-[#D5E1E4] bg-[#F7F9FA] p-6 sm:p-8 lg:min-h-[463px]">
            {/* Dashboard Header */}
            <div className="flex w-full items-center justify-between border-b border-[#D5E1E4] pb-6">
              <h3 className="m-0 text-base font-bold leading-7 text-[#066879]">
                Moderation Queue
              </h3>

              <span className="text-xs font-normal leading-5 text-[#5E7076]">
                5 items pending review
              </span>
            </div>

            {/* Queue Items */}
            <div className="mt-10 flex w-full flex-col gap-6">
              {moderationItems.map((item) => (
                <div
                  key={item.title}
                  className="flex w-full flex-col items-start gap-6 rounded-[20px] border border-[#D5E1E4] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  {/* Item Information */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h4 className="m-0 text-sm font-bold leading-6 text-[#102A32]">
                      {item.title}
                    </h4>

                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {item.reported}
                    </p>

                    <span className="pt-1 text-xs font-semibold leading-5 text-[#F28C28]">
                      Review &amp; decide
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
                    <button
                      type="button"
                      className="flex min-h-9 flex-1 items-center justify-center rounded-xl border border-[#D5E1E4] bg-white px-4 py-2 text-xs font-bold leading-5 text-[#102A32] transition-colors duration-200 hover:bg-[#F7F9FA] sm:flex-none"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="flex min-h-9 flex-1 items-center justify-center rounded-xl border border-[#D5E1E4] bg-white px-4 py-2 text-xs font-bold leading-5 text-[#102A32] transition-colors duration-200 hover:bg-[#F7F9FA] sm:flex-none"
                    >
                      Remove
                    </button>

                    <button
                      type="button"
                      className="flex min-h-9 flex-1 items-center justify-center rounded-xl border border-[#D5E1E4] bg-white px-4 py-2 text-xs font-bold leading-5 text-[#102A32] transition-colors duration-200 hover:bg-[#F7F9FA] sm:flex-none"
                    >
                      More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}