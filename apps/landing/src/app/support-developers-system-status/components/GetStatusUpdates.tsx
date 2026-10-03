"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Mail, Bell, ShieldCheck, Layers } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";

export default function GetStatusUpdates() {
  const [updateType, setUpdateType] = useState<"email" | "rss">("email");
  const [serviceType, setServiceType] = useState<"all" | "choose">("all");
  const [email, setEmail] = useState<string>("");

  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Title & Image Card */}
        <div className="w-full lg:w-5/12 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-8">
            Get status updates
          </h2>

          <div className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6">
            <div className="absolute inset-0 z-0">
              <Image
                src="/system/2.png"
                alt="Cat getting status updates"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Top Right Floating Badge */}
            <div className="absolute top-6 right-6 z-10 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-md flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />
              <span className="text-xs font-bold text-[#111827]">
                No marketing
              </span>
            </div>

            {/* Floating Badges Bottom Left */}
            <div className="relative z-10 flex flex-col gap-2.5 items-start">
              <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0A5C6F]" />
                <span className="text-xs font-bold text-[#111827]">
                  Email or RSS
                </span>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0A5C6F]" />
                <span className="text-xs font-bold text-[#111827]">
                  Pick your services
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Subscription Form Card */}
        <div className="w-full lg:w-7/12 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
          {/* How do you want updates? */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#111827]">
              How do you want updates?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUpdateType("email")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  updateType === "email"
                    ? "border-[#0A5C6F] bg-[#F0F9FA]/40 ring-1 ring-[#0A5C6F]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    updateType === "email"
                      ? "border-[#0A5C6F] bg-[#0A5C6F]"
                      : "border-gray-300"
                  }`}
                >
                  {updateType === "email" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Mail className="w-4 h-4 text-[#0A5C6F]" />
                  Email
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUpdateType("rss")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  updateType === "rss"
                    ? "border-[#0A5C6F] bg-[#F0F9FA]/40 ring-1 ring-[#0A5C6F]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    updateType === "rss"
                      ? "border-[#0A5C6F] bg-[#0A5C6F]"
                      : "border-gray-300"
                  }`}
                >
                  {updateType === "rss" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Bell className="w-4 h-4 text-[#0A5C6F]" />
                  RSS feed
                </div>
              </button>
            </div>
          </div>

          {/* Which services? */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#111827]">
              Which services?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setServiceType("all")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  serviceType === "all"
                    ? "border-[#0A5C6F] bg-[#F0F9FA]/40 ring-1 ring-[#0A5C6F]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    serviceType === "all"
                      ? "border-[#0A5C6F] bg-[#0A5C6F]"
                      : "border-gray-300"
                  }`}
                >
                  {serviceType === "all" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  All services
                </span>
              </button>

              <button
                type="button"
                onClick={() => setServiceType("choose")}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  serviceType === "choose"
                    ? "border-[#0A5C6F] bg-[#F0F9FA]/40 ring-1 ring-[#0A5C6F]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    serviceType === "choose"
                      ? "border-[#0A5C6F] bg-[#0A5C6F]"
                      : "border-gray-300"
                  }`}
                >
                  {serviceType === "choose" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  Choose services
                </span>
              </button>
            </div>
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email-input"
              className="text-xs font-bold text-[#111827]"
            >
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
            />
            <span className="text-[11px] text-gray-400 font-normal">
              You&apos;ll get an email to confirm before updates start.
            </span>
          </div>

          {/* Privacy Note Box */}
          <div className="p-4 rounded-2xl bg-[#F0F9FA]/60 border-l-2 border-[#0A5C6F] text-xs text-gray-600 leading-relaxed">
            Status updates only. Your email is used to send incident and
            maintenance notices, and nothing else.{" "}
            <a href={APP_LINKS.privacy} className="text-[#0A5C6F] underline font-medium">
              How we handle your data
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full bg-[#0A5C6F] hover:bg-[#084A59] text-white font-medium py-3.5 px-6 rounded-2xl transition-colors text-sm shadow-sm"
          >
            Subscribe to status updates
          </button>
        </div>
      </div>
    </section>
  );
}
