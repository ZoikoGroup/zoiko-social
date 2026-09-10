import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { C } from "./theme";

/** Centred section title with an optional supporting line. */
export function SectionHeading({
  title,
  subtitle,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center">
      <h2
        className="text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl lg:leading-[48px]"
        style={{ color: C.ink }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-base leading-6" style={{ color: C.muted }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Small rounded label. `tone` picks the neutral or the warm fill. */
export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warm" | "outline";
}) {
  const tones = {
    neutral: { background: C.chip, color: C.ink, border: "1px solid transparent" },
    warm: { background: C.chipWarm, color: C.warm, border: "1px solid transparent" },
    outline: { background: C.page, color: C.muted, border: `1px solid ${C.line}` },
  } as const;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold leading-4 tracking-tight"
      style={tones[tone]}
    >
      {children}
    </span>
  );
}

/** Teal text link with the trailing chevron used across every card. */
export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-base font-semibold transition hover:opacity-80"
      style={{ color: C.brand }}
    >
      {children}
      <ChevronRight size={14} strokeWidth={2.5} />
    </Link>
  );
}

/** Pill used by the filter rows above the community and news grids. */
export function FilterPill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className="inline-flex cursor-default items-center rounded-full px-4 pb-2 pt-1.5 text-xs font-semibold leading-5"
      style={
        active
          ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
          : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
      }
    >
      {children}
    </span>
  );
}
