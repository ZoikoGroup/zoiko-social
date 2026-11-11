import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";

/** Tilted orange "BLACK FRIDAY 30% off — Join free" ribbon pinned to section corners. */
export default function SaleSticker({
  className = "",
  rotate = "rotate-[14deg]",
}: {
  className?: string;
  rotate?: string;
}) {
  return (
    <Link
      href={APP_LINKS.signUp}
      aria-label="Black Friday: 30% off — join free"
      className={`absolute z-10 hidden md:flex flex-col items-center bg-[#E8892A] px-8 py-3 text-[#0F2B33] shadow-[0_12px_24px_rgba(232,137,42,0.35)] transition-transform hover:scale-105 ${rotate} ${className}`}
    >
      <span className="text-base font-extrabold tracking-wide whitespace-nowrap">
        BLACK FRIDAY 30%off
      </span>
      <span className="text-sm font-medium underline underline-offset-2">Join free</span>
    </Link>
  );
}
