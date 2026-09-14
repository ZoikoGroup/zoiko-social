import React from "react";
import Image from "next/image";

export interface AnimalCardData {
  id: string;
  name: string;
  details: string; // e.g. "Dog · Labrador Mix · Adult"
  location: string;
  organization: string;
  listedTime: string;
  intentBadge: "Adoption" | "Foster";
  statusBadge: "Available" | "Application Pending" | "On Hold";
  cover: string | null;
}

interface AnimalCardProps {
  card: AnimalCardData;
}

export default function AnimalCard({ card }: AnimalCardProps) {
  const { name, details, location, organization, listedTime, intentBadge, statusBadge, cover } = card;

  return (
    <div className="w-full h-full bg-white rounded-[20px] border border-zinc-200 overflow-hidden flex flex-col">
      {/* Cover */}
      <div className="relative w-full aspect-[291/218] shrink-0 bg-gradient-to-br from-cyan-800 to-orange-500">
        {cover && (
          <Image src={cover} alt={name} fill className="object-cover" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 px-5 pt-5 pb-5 flex-1">
        <div className="text-cyan-950 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6 cursor-pointer hover:underline">
          {name}
        </div>

        <div className="text-gray-500 text-[12.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[18px]">
          {details}
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z" stroke="#5E7076" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10.5C6 10.5 10 8 10 5C10 3.93913 9.57857 2.92172 8.82843 2.17157C8.07828 1.42143 7.06087 1 6 1C4.93913 1 3.92172 1.42143 3.17157 2.17157C2.42143 2.92172 2 3.93913 2 5C2 8 6 10.5 6 10.5Z" stroke="#5E7076" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-500 text-[11.5px] font-normal font-['Plus_Jakarta_Sans']">{location}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#5E7076" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 4V8L10.6667 10.6667" stroke="#5E7076" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-500 text-[11.5px] font-normal font-['Plus_Jakarta_Sans']">{organization}</span>
          </div>
        </div>

        <div className="text-gray-500 text-[11.5px] font-normal font-['Plus_Jakarta_Sans'] mt-2">
          {listedTime}
        </div>

        <div className="flex-1" />

        <div className="flex gap-2 pt-2">
          <button className="flex-1 h-[38px] rounded-[9px] bg-cyan-800 hover:bg-cyan-900 flex items-center justify-center text-[12.5px] text-white font-bold font-['Plus_Jakarta_Sans'] cursor-pointer transition-colors">
            View Animal
          </button>
          <button aria-label="More options" className="w-[38px] rounded-[9px] bg-neutral-100 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors">
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
