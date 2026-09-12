import React from "react";
import Image from "next/image";

export interface CommunityCardData {
  id: string;
  title: string;
  purpose: "Fostering" | "Rescue" | "Adoption Support";
  description: string;
  tags: string[];
  orgName?: string;
  status: "Open to join" | "Request required";
  primaryBtn: string;
  secondaryBtn: string;
  cover: string;
  avatar: string | null;
}

interface CommunityCardProps {
  card: CommunityCardData;
}

export default function CommunityCard({ card }: CommunityCardProps) {
  const {
    title,
    purpose,
    description,
    tags = [],
    orgName,
    status,
    primaryBtn,
    secondaryBtn: actionText,
    cover: bannerImg,
    avatar: avatarImg,
  } = card;

  return (
    <div className="w-full h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex flex-col">
      {/* Header Banner */}
      <div className="relative w-full h-28 bg-gradient-to-tr from-cyan-800 to-orange-500 shrink-0">
        <Image
          width={396}
          height={112}
          className="w-full h-28 object-cover"
          src={bannerImg}
          alt={`${title} banner`}
        />

        {/* Avatar Icon */}
        {avatarImg && (
          <div className="absolute left-4 -bottom-6 size-12 bg-slate-100 rounded-2xl shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] outline outline-[3px] outline-offset-[-3px] outline-white overflow-hidden">
            <Image
              width={40}
              height={40}
              className="size-10 m-0.5 object-cover rounded-xl"
              src={avatarImg}
              alt={`${title} avatar`}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-3 px-4 pb-4 flex-1 ${avatarImg ? "pt-8" : "pt-4"}`}>
        <div className="text-teal-950 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">
          {title}
        </div>

        <div className="h-6 px-2.5 bg-slate-100 rounded-md inline-flex items-center justify-center self-start">
          <span className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-4">
            {purpose}
          </span>
        </div>

        <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
          {description}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="h-6 px-2.5 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center"
            >
              <span className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">
                {tag}
              </span>
            </div>
          ))}
        </div>

        {orgName && (
          <div className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4 truncate">
            {orgName}
          </div>
        )}

        <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
          {status}
        </div>

        <div className="text-cyan-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] underline cursor-pointer">
          What this community can help with
        </div>

        <div className="flex-1" />

        <div className="flex gap-2">
          <div className="h-8 px-4 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
            <span className="text-teal-950 text-xs font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">
              {primaryBtn}
            </span>
          </div>

          <div className="h-8 px-4 bg-cyan-800 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-cyan-900 transition-colors">
            <span className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">
              {actionText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
