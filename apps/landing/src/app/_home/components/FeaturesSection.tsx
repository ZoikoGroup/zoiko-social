import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    iconSrc: "/images/icon-post-share.png",
    title: "Post and Share",
    desc: "Share photos, videos, stories, reels, and go live with your animal community.",
    tag: "Real-time moderation",
    cta: "Start Sharing",
  },
  {
    iconSrc: "/images/icon-message.png",
    title: "Message and Call",
    desc: "Connect through DMs, group chats, and video calls with care coordination tools.",
    tag: "Privacy controls",
    cta: "Open Messages",
  },
  {
    iconSrc: "/images/icon-communities.png",
    title: "Build Communities",
    desc: "Create and moderate communities by species, location, rescue work, or specialty.",
    tag: "Moderation dashboard",
    cta: "Create Community",
  },
  {
    iconSrc: "/images/icon-news.png",
    title: "Follow Verified News",
    desc: "Stay informed with verified animal welfare, conservation, and rescue news.",
    tag: "Source verification",
    cta: "Browse News",
  },
  {
    iconSrc: "/images/icon-adopt.png",
    title: "Adopt and Foster",
    desc: "Find adoptable animals through verified rescues and shelters with safety protections.",
    tag: "Anti-trafficking detection",
    cta: "View Animals",
  },
  {
    iconSrc: "/images/icon-professionals.png",
    title: "Find Professionals",
    desc: "Connect with verified vets, trainers, groomers, and care specialists.",
    tag: "Professional verification",
    cta: "Browse Directory",
  },
];

export default function WhatYouCanDoHere() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <h2 className="font-montserrat text-[32px] font-extrabold text-center text-[#111827] mb-14">
          What You Can Do Here
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ iconSrc, title, desc, tag, cta }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F0FBFC] mb-6 flex items-center justify-center">
                <Image src={iconSrc} alt={title} width={24} height={24} className="object-contain" />
              </div>

              <h3 className="text-xl font-bold text-[#111827] mb-3">{title}</h3>
              
              <p className="text-sm font-normal leading-6 text-[#6B7280] mb-6 flex-1 pr-4">
                {desc}
              </p>
              
              <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-md px-2.5 py-1.5 mb-6 text-[13px] font-medium text-[#4B5563] self-start border border-gray-100">
                <CheckCircle2 size={14} className="text-[#10B981] shrink-0" strokeWidth={2} />
                {tag}
              </div>
              
              <button className="mt-auto text-[#066879] font-bold text-sm flex items-center gap-1.5 self-start transition hover:text-[#045260]">
                {cta} <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}