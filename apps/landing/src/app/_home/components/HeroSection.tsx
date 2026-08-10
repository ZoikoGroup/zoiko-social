"use client";

import Link from "next/link";
import { CheckCircle, BadgeCheck, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative h-[810px] w-full overflow-hidden border-b border-zinc-100 bg-[#F7FDFF]"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative mx-auto flex h-full max-w-[1280px] items-center px-0">
        <div className="max-w-[600px]">
          <h1 className="font-montserrat text-5xl font-extrabold leading-[66px] text-white">
            Where the World
            <br />
            Comes Together for Animals
          </h1>

          <p className="mt-10 max-w-[452px] text-xl leading-8 text-white">
            Share moments, build communities, follow verified animal welfare
            news, and coordinate care safely, globally, and profanity-free.
          </p>

          <div className="mt-12 flex gap-4">
            <Link
              href="#"
              className="flex h-14 w-[300px] items-center justify-center rounded-xl bg-white text-lg font-bold text-[#066879] transition hover:bg-gray-100"
            >
              Join Free
            </Link>

            <Link
              href="#"
              className="flex h-14 w-[235px] items-center justify-center rounded-xl bg-white text-center text-lg font-bold text-[#066879] transition hover:bg-gray-100"
            >
              Explore Communities
            </Link>
          </div>

          <div className="mt-20 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-white" strokeWidth={2} />
              <span className="text-[13px] font-semibold tracking-wide text-white">
                Profanity-Free
              </span>
            </div>

            <div className="flex items-center gap-3">
              <BadgeCheck size={18} className="text-white" strokeWidth={2} />
              <span className="text-[13px] font-semibold tracking-wide text-white">
                Verified News Sources
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} className="text-white" strokeWidth={2} />
              <span className="text-[13px] font-semibold tracking-wide text-white">
                Institutional Moderation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}