import React from "react";
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Layers,
  Download,
  Lock,
  X,
  Send,
  UserCheck,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function TrackYourRequest() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Track your request
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            One place for status, next steps, messages and files.
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {/* Top Dark Header Bar */}
          <div className="bg-[#0A5C6F] px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base md:text-lg font-bold text-white">
                  Access my information
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 font-normal">
                  <span>
                    Reference{" "}
                    <code className="bg-black/20 px-1.5 py-0.5 rounded text-white font-mono">
                      &#123;&#123;reference_id&#125;&#125;
                    </code>
                  </span>
                  <span>•</span>
                  <span>
                    Submitted{" "}
                    <code className="bg-black/20 px-1.5 py-0.5 rounded text-white font-mono">
                      &#123;&#123;submitted_date&#125;&#125;
                    </code>
                  </span>
                  <span>•</span>
                  <span>
                    Region{" "}
                    <code className="bg-black/20 px-1.5 py-0.5 rounded text-white font-mono">
                      &#123;&#123;region&#125;&#125;
                    </code>
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#FDF8F0] border border-[#FBEAD4] text-[#9A6700] text-xs font-semibold px-3.5 py-1.5 rounded-full self-start md:self-auto shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              Identity check needed
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Progress & Messages */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Next Step Banner Card */}
              <div className="bg-[#F0F9FA] border border-[#E0F2F4] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#0A5C6F]/20 flex items-center justify-center text-[#0A5C6F] shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-[#111827]">
                      Next step: confirm it&apos;s you
                    </h4>
                    <p className="text-xs text-gray-500 font-normal">
                      A quick check before we share or change anything.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 bg-[#0A5C6F] hover:bg-[#074653] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm identity
                </button>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 shadow-2xs">
                <div className="relative flex items-center justify-between max-w-lg mx-auto w-full px-4">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0" />
                  <div className="absolute top-4 left-8 w-1/4 h-0.5 bg-[#0A5C6F] -z-0" />

                  {/* Step 1: Submitted */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-[#0A5C6F] text-white flex items-center justify-center shadow-2xs">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827]">
                      Submitted
                    </span>
                  </div>

                  {/* Step 2: Verify */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#D97706] text-[#D97706] flex items-center justify-center shadow-2xs">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#D97706]">
                      Verify
                    </span>
                  </div>

                  {/* Step 3: Processing */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      Processing
                    </span>
                  </div>

                  {/* Step 4: Info needed */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      Info needed
                    </span>
                  </div>

                  {/* Step 5: Decision */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      Decision
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Box */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <MessageSquare className="w-4 h-4 text-[#0A5C6F]" />
                  Messages
                </div>
                <p className="text-xs text-gray-500 font-normal">
                  Secure updates from the privacy team appear here.
                </p>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Response Due Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-[#0A5C6F]" />
                  Response due
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 font-mono">
                  &#123;&#123;due_date_from_regional_rule&#125;&#125;
                </div>
              </div>

              {/* Scope Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Layers className="w-3.5 h-3.5 text-[#0A5C6F]" />
                  Scope
                </div>
                <p className="text-xs text-gray-600 font-normal">All my data</p>
              </div>

              {/* Files Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Download className="w-3.5 h-3.5 text-[#0A5C6F]" />
                  Files
                </div>
                <p className="text-xs text-gray-500 font-normal">
                  Exports appear here when ready.
                </p>
              </div>

              {/* Who can see this Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Lock className="w-3.5 h-3.5 text-[#0A5C6F]" />
                  Who can see this
                </div>
                <p className="text-xs text-gray-600 font-normal">
                  You and the privacy team.
                </p>
              </div>

              {/* Withdraw Request Button */}
              <button
                type="button"
                className="w-full bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50/30 text-gray-700 hover:text-red-600 text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer mt-2"
              >
                <X className="w-4 h-4" />
                Withdraw request
              </button>
            </div>
          </div>
        </div>

        {/* Statuses You May See Legend Footer */}
        <div className="flex flex-col gap-3 pt-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Statuses you may see
          </h4>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Submitted */}
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs">
              <Send className="w-3.5 h-3.5 text-gray-500" />
              Submitted
            </div>

            {/* Identity check needed */}
            <div className="inline-flex items-center gap-1.5 bg-[#FEF6EE] border border-[#FBEAD4] rounded-full px-3 py-1.5 text-xs font-medium text-[#B45309] shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" />
              Identity check needed
            </div>

            {/* In progress */}
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FA] border border-[#E0F2F4] rounded-full px-3 py-1.5 text-xs font-medium text-[#0A5C6F] shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 text-[#0A5C6F]" />
              In progress
            </div>

            {/* More information needed */}
            <div className="inline-flex items-center gap-1.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-full px-3 py-1.5 text-xs font-medium text-[#A16207] shadow-2xs">
              <MessageSquare className="w-3.5 h-3.5 text-[#CA8A04]" />
              More information needed
            </div>

            {/* Ready to download */}
            <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full px-3 py-1.5 text-xs font-medium text-[#15803D] shadow-2xs">
              <Download className="w-3.5 h-3.5 text-[#16A34A]" />
              Ready to download
            </div>

            {/* Completed */}
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Completed
            </div>

            {/* Partially completed */}
            <div className="inline-flex items-center gap-1.5 bg-[#FEF6EE] border border-[#FBEAD4] rounded-full px-3 py-1.5 text-xs font-medium text-[#B45309] shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              Partially completed
            </div>

            {/* Unable to verify */}
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              Unable to verify
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
