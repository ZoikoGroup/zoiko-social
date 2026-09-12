import React from "react";
import Image from "next/image";

export interface CommunityCardData {
  id: string;
  title: string;
  topic: "Habitat Conservation" | "Species Monitoring" | "Community Science" | "Policy & Advocacy";
  description: string;
  tag: string;
  location: string;
  locationSensitive?: boolean;
  orgName?: string;
  status: "Open to join" | "Request required";
  primaryBtn: string;
  secondaryBtn: string;
  cover: string;
  icon: string;
}

interface CommunityCardProps {
  card: CommunityCardData;
}

export default function CommunityCard({ card }: CommunityCardProps) {
  const {
    title,
    topic,
    description,
    tag,
    location,
    locationSensitive,
    orgName,
    status,
    primaryBtn,
    secondaryBtn: actionText,
    cover: bannerImg,
    icon: avatarImg,
  } = card;

  return (
    <div className="w-full h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex flex-col">
      {/* Header Banner */}
      <div className="relative w-full h-[120px] bg-gradient-to-tr from-cyan-800 to-orange-500 shrink-0">
        <Image
          width={396}
          height={120}
          className="w-full h-[120px] object-cover"
          src={bannerImg}
          alt={`${title} banner`}
        />

        {/* Avatar Icon */}
        <div className="absolute left-4 -bottom-6 size-12 bg-cyan-50 rounded-2xl shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] outline outline-[3px] outline-offset-[-3px] outline-white overflow-hidden">
          <Image
            width={40}
            height={40}
            className="size-10 m-0.5 object-cover rounded-xl"
            src={avatarImg}
            alt={`${title} icon`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-8 flex-1">
        <div className="text-teal-950 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">
          {title}
        </div>

        <div className="h-6 px-2.5 bg-cyan-50 rounded-md inline-flex items-center justify-center self-start">
          <span className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-4">
            {topic}
          </span>
        </div>

        <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
          {description}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-6 px-2.5 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">
              {tag}
            </span>
          </div>
        </div>

        {/* Location / geography field */}
        <div className="flex items-center gap-2">
          {locationSensitive ? (
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M7.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V4.5C0.5 5.05228 0.947715 5.5 1.5 5.5H7.5C8.05228 5.5 8.5 5.05228 8.5 4.5V1.5C8.5 0.947715 8.05228 0.5 7.5 0.5Z" stroke="#C9701A"/>
            </svg>
          ) : (
            <svg width="9" height="11" viewBox="0 0 9 10.6062" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M4.5 10.059C2.25 9.05902 0.5 7.05902 0.5 4.55902V2.55902L4.5 0.559017L8.5 2.55902V4.55902C8.5 7.05902 6.75 9.05902 4.5 10.059Z" stroke="#5E7076"/>
            </svg>
          )}
          <span
            className={`text-xs font-normal font-['Plus_Jakarta_Sans'] leading-[18px] ${
              locationSensitive ? "text-amber-600 font-semibold" : "text-gray-500"
            }`}
          >
            {location}
          </span>
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
