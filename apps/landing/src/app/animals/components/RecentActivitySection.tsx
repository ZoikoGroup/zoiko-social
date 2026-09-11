"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageSquare, Share2 } from "lucide-react";

interface FeedPost {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
}

const ACTIVITIES: FeedPost[] = [
  {
    id: "post-1",
    author: "Luna",
    timestamp: "2 hours ago",
    content:
      "Just finished our monthly meetup at the park — 40 goldens and their humans showed up! Swipe through for some of our favorite moments. 🐾",
    image: "/animal/a8.png",
    likesCount: 128,
    commentsCount: 24,
  },
  {
    id: "post-2",
    author: "Luna",
    timestamp: "6 days ago",
    content:
      'Learned a new trick this week — Luna can finally "shake" with both paws. Small wins! 🐶',
    likesCount: 86,
    commentsCount: 11,
  },
];

export default function RecentActivitySection() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (postId: string) => {
    setLikes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <section className="w-full max-w-7xl px-4 sm:px-64 py-16 text-left font-sans">
      <h2 className="text-base sm:text-lg font-bold text-[#0B2E2E] mb-4">
        Recent Activity
      </h2>

      <div className="flex flex-col gap-4">
        {ACTIVITIES.map((post) => {
          const isLiked = !!likes[post.id];
          const currentLikes = post.likesCount + (isLiked ? 1 : 0);

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold text-[#0B2E2E]">
                  {post.author}
                </span>
                <span className="text-[11px] sm:text-xs text-[#94A3B8]">
                  {post.timestamp}
                </span>
              </div>

              {/* Post Body Content */}
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Optional Post Image */}
              {post.image && (
                <div className="relative rounded-xl overflow-hidden w-full h-64 sm:h-80 mb-4 bg-[#F1F5F9]">
                  <Image
                    src={post.image}
                    alt="Post attachment"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 700px, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Action Bar (Likes, Comments, Share) */}
              <div className="flex items-center gap-6 text-xs text-[#64748B] pt-1">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLiked
                      ? "text-[#E11D48] font-semibold"
                      : "hover:text-[#0B5C66]"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? "fill-[#E11D48] text-[#E11D48]" : ""
                    }`}
                  />
                  <span>{currentLikes}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-[#0B5C66] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-[#0B5C66] transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
