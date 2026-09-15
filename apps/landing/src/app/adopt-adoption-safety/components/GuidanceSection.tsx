import { type LucideIcon } from "lucide-react";
import { C } from "./theme";
import type { GuidanceCard } from "./guidance";

/**
 * A centred heading over a grid of guidance cards. Cards marked `caution`
 * are drawn in the warm palette, as the comp does for the risk cards.
 */
export default function GuidanceSection({
  title,
  subtitle,
  cards,
  icons,
}: {
  title: string;
  subtitle: string;
  cards: GuidanceCard[];
  /** One icon per card, in order. */
  icons: LucideIcon[];
}) {
  return (
    <section className="pt-16">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 text-center">
        <h2
          className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
          style={{ color: C.ink }}
        >
          {title}
        </h2>
        <p className="text-base leading-6" style={{ color: C.muted }}>
          {subtitle}
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = icons[i];
          const caution = card.caution === true;
          return (
            <article
              key={card.title}
              className="flex flex-col gap-1.5 rounded-[20px] px-5 pb-7 pt-5"
              style={
                caution
                  ? { background: C.warnFill, border: `1px solid ${C.warnLine}` }
                  : { background: "#fff", border: `1px solid ${C.line}` }
              }
            >
              <span
                className="flex size-9 items-center justify-center rounded-[10px]"
                style={{ background: caution ? "#fff" : C.chip }}
              >
                {Icon ? (
                  <Icon size={16} strokeWidth={1.8} style={{ color: caution ? C.warnInk : C.ink }} />
                ) : null}
              </span>
              <h3 className="pt-1.5 text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                {card.title}
              </h3>
              {card.body ? (
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {card.body}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
