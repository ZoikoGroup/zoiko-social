import React from "react";

export default function TrustAndIdentityExplainer() {
  return (
    <div className="w-[1232px] h-96 relative bg-cyan-50 rounded-[32px] p-10 overflow-hidden">
      {/* Header Title */}
      <div className="w-80 h-8 left-[40px] top-[36px] absolute text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
        Know who runs the community.
      </div>

      {/* Subtitle / Description */}
      <div className="w-[630.68px] h-16 left-[40px] top-[78px] absolute text-gray-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
        Professional community labels help people understand the operator
        context associated with a community. Displayed identity information comes from
        approved Zoiko Social product records.
      </div>

      {/* Left Column: What this label can tell you */}
      <div className="w-56 h-5 left-[40px] top-[177.54px] absolute text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase leading-5 tracking-tight">
        What this label can tell you
      </div>

      <div className="w-[562px] h-20 left-[40px] top-[207.04px] absolute space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-cyan-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✓
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            The operator type associated with a community (Vet, Trainer, or
            Shelter)
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-cyan-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✓
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            The named organization or operator associated with the community,
            when on record
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-cyan-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✓
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Any explicitly governed status field Zoiko Social has separately
            confirmed
          </span>
        </div>
      </div>

      {/* Right Column: What this label cannot imply */}
      <div className="w-56 h-5 left-[630px] top-[177.54px] absolute text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase leading-5 tracking-tight">
        What this label cannot imply
      </div>

      <div className="w-[562px] h-20 left-[630px] top-[207.04px] absolute space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✕
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Zoiko Social endorsement of the operator or their advice
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✕
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Guaranteed expertise, licensing validity, or credential verification
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
            ✕
          </span>
          <span className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Emergency availability or a professional-client relationship
          </span>
        </div>
      </div>

      {/* Bottom Alert Banner */}
      <div className="w-[1152px] h-12 left-[40px] top-[303.79px] absolute bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-amber-600 flex items-center px-4">
        <div className="size-4 relative flex items-center justify-center mr-3 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
        </div>
        <div className="text-amber-600 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Urgent animal health or safety concerns should go to a local
          veterinarian or emergency service directly — not through community
          discovery or discussion.
        </div>
      </div>
    </div>
  );
}
