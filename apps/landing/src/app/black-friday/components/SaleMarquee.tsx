import { Sparkle } from "lucide-react";

/** Scrolling orange "BLACK FRIDAY SALE ✦" strip. The list is doubled so the loop is seamless. */
export default function SaleMarquee() {
  const items = Array.from({ length: 12 });
  return (
    <div className="overflow-hidden bg-[#E8892A] py-4" aria-label="Black Friday sale">
      <div className="flex w-max animate-[bf-marquee_40s_linear_infinite] motion-reduce:animate-none">
        {items.map((_, i) => (
          <span
            key={i}
            aria-hidden={i > 0}
            className="flex items-center gap-6 pr-6 text-lg font-bold uppercase tracking-wide text-white whitespace-nowrap"
          >
            Black Friday Sale
            <Sparkle className="h-6 w-6 fill-white/80 text-white/80" aria-hidden />
          </span>
        ))}
      </div>
      <style>{`@keyframes bf-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
