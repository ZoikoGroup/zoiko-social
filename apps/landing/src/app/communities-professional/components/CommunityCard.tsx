import React from "react";
import Image from "next/image";

/*
  Shape of one entry in PROFESSIONAL_COMMUNITIES (see ../page.tsx).
  The page maps over that array and passes each entry as `card`.
*/
interface CommunityCardData {
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

interface CommunityCardProps {
  card: CommunityCardData;
}

export default function CommunityCard({ card }: CommunityCardProps) {
  const {
    title,
    description,
    role: badgeText,
    roleName: orgName,
    tags = [],
    status,
    primaryBtn,
    secondaryBtn: actionText,
    cover: bannerImg,
    avatar: avatarImg,
  } = card;

  return (
    <div className="w-96 h-[396px] relative bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex-shrink-0">
      {/* Title */}
      <div className="w-[350px] h-6 left-[17px] top-[137px] absolute text-teal-950 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6 truncate">
        {title}
      </div>

      {/* Description */}
      <div className="w-[360px] h-9 left-[17px] top-[168.25px] absolute text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
        {description}
      </div>

      {/* Operator Badge (e.g. Vet, Trainer, Shelter) */}
      <div className="h-6 px-2.5 left-[17px] top-[213.25px] absolute bg-slate-100 rounded-md inline-flex items-center justify-center">
        <span className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-4">
          {badgeText}
        </span>
      </div>

      {/* Organization Name */}
      <div className="max-w-[260px] h-4 left-[79px] top-[215.50px] absolute text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4 truncate">
        {orgName}
      </div>

      {/* Category Tags (e.g. Dogs, Cats, etc.) */}
      <div className="absolute left-[17px] top-[242.75px] flex gap-2">
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

      {/* Status */}
      <div className="w-32 h-4 left-[17px] top-[274.25px] absolute text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
        {status}
      </div>

      {/* Label Meaning Link */}
      <div className="w-28 h-3.5 left-[17px] top-[299.25px] absolute text-cyan-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] underline cursor-pointer">
        What this label means
      </div>

      {/* View Community Button */}
      <div className="w-32 h-8 left-[17px] top-[329.25px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
        <span className="text-teal-950 text-xs font-semibold font-['Plus_Jakarta_Sans']">
          {primaryBtn}
        </span>
      </div>

      {/* Dynamic Action Button (Join / Request to Join) */}
      <div className="h-8 px-4 left-[157.86px] top-[329.25px] absolute bg-cyan-800 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-cyan-900 transition-colors">
        <span className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">
          {actionText}
        </span>
      </div>

      {/* Header Banner Background */}
      <div className="w-96 h-28 left-[1px] top-[1px] absolute relative bg-gradient-to-tr from-cyan-800 to-orange-500 overflow-hidden">
        {" "}
        <Image
          width={384}
          height={112}
          className="w-96 h-28 object-cover"
          src={bannerImg}
          alt={`${title} banner`}
        />
      </div>

      {/* Avatar Icon Container */}
      <div className="size-12 left-[16px] top-[80px] absolute bg-slate-100 rounded-2xl shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] outline outline-[3px] outline-offset-[-3px] outline-white overflow-hidden z-10">
        {avatarImg && (
          <Image
            width={40}
            height={40}
            className="size-10 left-[3px] top-[3px] absolute object-cover rounded-xl"
            src={avatarImg}
            alt={`${title} avatar`}
          />
        )}
      </div>
    </div>
  );
}
