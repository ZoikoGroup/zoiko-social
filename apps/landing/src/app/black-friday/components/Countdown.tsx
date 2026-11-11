"use client";

import { pad, useCountdown } from "@/lib/use-countdown";

export default function Countdown({ target }: { target: string }) {
  const units = useCountdown(target);

  return (
    <div className="flex flex-wrap justify-center gap-3" role="timer" aria-label="Time until Black Friday">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex w-[124px] flex-col items-center gap-2 rounded-xl border border-white/50 bg-white/5 py-3 backdrop-blur-sm"
        >
          <div className="flex gap-1">
            {pad(value)
              .split("")
              .map((d, i) => (
                <span
                  key={i}
                  className="flex h-9 w-7 items-center justify-center rounded bg-white/25 text-2xl font-bold tabular-nums text-white"
                >
                  {d}
                </span>
              ))}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">{label}</span>
        </div>
      ))}
    </div>
  );
}
