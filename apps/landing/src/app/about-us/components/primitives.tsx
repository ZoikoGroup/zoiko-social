import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { C } from "./theme";

/** Small teal eyebrow pill above a section heading. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold leading-4"
      style={{ background: C.chip, color: C.brand, border: `1px solid ${C.line}` }}
    >
      {children}
    </span>
  );
}

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

/** Teal text link with the trailing chevron the comp uses throughout. */
export function ArrowLink({
  href,
  children,
  size = "base",
}: {
  href: string;
  children: React.ReactNode;
  size?: "base" | "sm";
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 font-semibold transition hover:opacity-80 ${
        size === "sm" ? "text-xs font-bold leading-5" : "text-base leading-6"
      }`}
      style={{ color: C.brand }}
    >
      {children}
      <ChevronRight size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
    </Link>
  );
}

/** Rounded tile holding a single icon, used by the two icon grids. */
export function IconTile({
  icon: Icon,
  tone = "neutral",
}: {
  icon: LucideIcon;
  tone?: "neutral" | "warm";
}) {
  return (
    <span
      className="flex size-12 items-center justify-center rounded-2xl"
      style={{ background: tone === "warm" ? C.chipWarm : C.chip }}
    >
      <Icon
        size={20}
        strokeWidth={1.9}
        style={{ color: tone === "warm" ? C.warm : C.ink }}
      />
    </span>
  );
}

/**
 * A centred icon / title / body column. Both the "What guides us" and
 * "Trust & responsibility" grids are this shape; only the trailing link
 * differs, so it is optional.
 */
export function IconFeature({
  icon,
  title,
  body,
  link,
}: {
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
  link?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <IconTile icon={icon} />
      <h3
        className="mt-4 text-base font-bold leading-6"
        style={{ color: C.inkDeep }}
      >
        {title}
      </h3>
      <p
        className="mt-2 max-w-[320px] text-sm leading-5"
        style={{ color: C.muted }}
      >
        {body}
      </p>
      {link ? (
        <div className="mt-3">
          <ArrowLink href={link.href} size="sm">
            {link.label}
          </ArrowLink>
        </div>
      ) : null}
    </div>
  );
}

/** White full-bleed band with the hairline rules above and below it. */
export function Band({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="bg-white py-12 sm:py-16 lg:py-20"
      style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">{children}</div>
    </section>
  );
}
