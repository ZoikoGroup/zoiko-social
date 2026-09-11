import React from "react";

export interface ProfessionalCommunityCardProps {
  id: string;
  title: string;
  description: string;
  role: string;
  roleName: string;
  tags: string[];
  status: string;
  primaryBtn: string;
  secondaryBtn: string;
  cover: string;
  avatar: string | null;
}

export default function CommunityCard({ card }: { card: ProfessionalCommunityCardProps }) {
  return (
    <div className="relative flex flex-col bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden h-full">
      {/* Cover Image */}
      <div className="h-28 w-full bg-slate-200 shrink-0 overflow-hidden">
        {card.cover && (
          <img className="w-full h-full object-cover" src={card.cover} alt={`${card.title} cover`} />
        )}
      </div>

      {/* Content Container */}
      <div className="relative flex flex-col flex-1 p-4 pt-0">
        {/* Avatar */}
        <div className="relative size-12 mt-[-24px] mb-2 bg-slate-100 rounded-2xl shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] border-[3px] border-white overflow-hidden shrink-0 z-10 box-border">
          {card.avatar && (
            <img className="w-full h-full object-cover" src={card.avatar} alt={`${card.roleName} avatar`} />
          )}
        </div>

        {/* Title */}
        <div className="text-teal-950 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-2">
          {card.title}
        </div>

        {/* Description */}
        <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5 mb-4">
          {card.description}
        </div>

        {/* Role & Role Name */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 bg-slate-100 rounded-md px-2 flex items-center justify-center shrink-0">
            <span className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-none">{card.role}</span>
          </div>
          <div className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-none truncate">
            {card.roleName}
          </div>
        </div>

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {card.tags.map(tag => (
              <div key={tag} className="h-6 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-200 px-2 flex items-center justify-center shrink-0">
                <span className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-none">{tag}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1"></div>

        {/* Status & Label Link */}
        <div className="flex flex-col gap-1 mb-4 mt-2">
          <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
            {card.status}
          </div>
          <div className="text-cyan-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] underline cursor-pointer">
            What this label means
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <button className="flex-1 h-8 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center text-teal-950 text-xs font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 transition-colors">
            {card.primaryBtn}
          </button>
          <button className="h-8 px-4 bg-cyan-800 rounded-[10px] flex items-center justify-center text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] hover:bg-cyan-700 transition-colors">
            {card.secondaryBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
