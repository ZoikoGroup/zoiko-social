import React from "react";
import Image from "next/image";

export interface CommunityCardData {
  id: string;
  title: string;
  description: string;
  species: string;
  topics: string;
  rulesAvailable?: boolean;
  badges?: string[];
  actionLabel: "Join" | "Request to Join";
  cover: string | null;
}

interface CommunityCardProps {
  card: CommunityCardData;
}

export default function CommunityCard({ card }: CommunityCardProps) {
  const { title, description, species, topics, rulesAvailable, badges = [], actionLabel, cover } = card;

  return (
    <div className="w-full h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex flex-col">
      {/* Cover */}
      <div className="relative w-full aspect-[396/223] shrink-0 bg-gradient-to-br from-cyan-800 to-orange-500">
        {cover && (
          <Image src={cover} alt={title} fill className="object-cover" />
        )}

        {badges.length > 0 && (
          <div className="absolute left-2.5 top-2.5 flex gap-1.5">
            {badges.map((badge) => (
              <div
                key={badge}
                className={`h-6 px-2.5 rounded-full flex items-center justify-center ${
                  badge === "Verified Community" ? "bg-white/95" : "bg-[#071e24]/75"
                }`}
              >
                <span
                  className={`text-[10.5px] font-bold font-['Plus_Jakarta_Sans'] whitespace-nowrap ${
                    badge === "Verified Community" ? "text-cyan-950" : "text-white"
                  }`}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          aria-label={`Save ${title}`}
          className="absolute right-2.5 top-2.5 size-8 bg-white/90 rounded-[9px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 1.875H11.25V13.125L7.5 10.625L3.75 13.125V1.875Z" stroke="#5E7076" strokeWidth="1.25" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 px-5 pt-5 pb-5 flex-1">
        <div className="text-cyan-950 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">
          {title}
        </div>

        <div className="text-gray-500 text-[12.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[18px]">
          {description}
        </div>

        <div className="text-gray-500 text-[11.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[17px]">
          {species} &middot; {topics}
          {rulesAvailable && (
            <>
              <span className="opacity-60"> &middot; </span>
              Rules &amp; moderation available
            </>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex gap-2 pt-2">
          <button
            className={`flex-1 h-9 rounded-[9px] flex items-center justify-center text-[12.5px] font-bold font-['Plus_Jakarta_Sans'] cursor-pointer transition-colors ${
              actionLabel === "Join"
                ? "bg-cyan-800 text-white hover:bg-cyan-900"
                : "bg-white text-cyan-950 outline outline-1 outline-offset-[-1px] outline-cyan-800 hover:bg-cyan-50"
            }`}
          >
            {actionLabel}
          </button>
          <button
            aria-label="More options"
            className="w-8 rounded-md bg-neutral-100 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3.33" cy="8" r="1.33" fill="#102A32" />
              <circle cx="8" cy="8" r="1.33" fill="#102A32" />
              <circle cx="12.67" cy="8" r="1.33" fill="#102A32" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
