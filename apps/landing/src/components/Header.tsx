"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { APP_LINKS, NAV_LINKS } from "@/lib/app-links";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="h-20 border-b border-gray-200">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-12 px-4 xl:px-20">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/zoiko-social-logo.png"
              alt="Zoiko Social"
              width={150}
              height={42}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Search */}
          <div className="relative w-[600px] shrink-0">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder=""
              className="h-11 w-full rounded-full border border-gray-300 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-700"
            />
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href={APP_LINKS.home}
              className="flex h-10 w-28 items-center justify-center gap-2 rounded-xl bg-gray-100 font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <Plus size={18} />
              Create
            </Link>

            <Link
              href={APP_LINKS.signUp}
              className="flex h-10 w-28 items-center justify-center rounded-xl bg-cyan-800 font-bold text-white transition hover:bg-cyan-900"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="h-14">
        <div className="mx-auto flex h-full max-w-[1440px] px-6 xl:px-20">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`flex h-full flex-1 items-center justify-center border-b-2 text-base font-semibold transition-all ${
                  isActive
                    ? "border-cyan-800 bg-[#F6FDFF] text-cyan-800"
                    : "border-transparent text-gray-600 hover:border-cyan-800 hover:bg-[#F6FDFF] hover:text-cyan-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
