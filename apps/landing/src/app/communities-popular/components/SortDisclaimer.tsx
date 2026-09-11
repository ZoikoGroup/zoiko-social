import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function SortDisclaimer() {
  return (
    <div
      className={`w-full max-w-[1232px] flex flex-col justify-start items-start ${plusJakartaSans.className}`}
    >
      <p className="text-slate-600 text-xs font-normal leading-5">
        Order reflects current source-defined activity signals and will not
        rearrange while you are reading.
      </p>
    </div>
  );
}
