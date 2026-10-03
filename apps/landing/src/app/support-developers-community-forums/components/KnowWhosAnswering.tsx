import Image from "next/image";
import { C } from "./theme";

const CARDS = [
  {
    tag: "Community",
    icon: "icon-users",
    tagBg: C.panel,
    tagText: C.ink,
    borderColor: "transparent",
    title: "Community post",
    body: "Peer advice from members. Helpful, but not official.",
  },
  {
    tag: "Official reference",
    icon: "icon-book",
    tagBg: C.chip,
    tagText: C.brandDeep,
    borderColor: C.brand,
    title: "Official reference",
    body: "A link to Help Center, API Documentation or System Status.",
  },
  {
    tag: "Verified role",
    icon: "icon-badge",
    tagBg: C.orangeFill,
    tagText: C.orangeTextDark,
    borderColor: C.orange,
    title: "Verified role",
    badge: "Only if approved",
    body: "Shown only for roles Zoiko Social has verified.",
  },
];

/** Section - 06 · HOW POSTS ARE LABELED — "Know who's answering", 3 label-preview cards. */
export default function KnowWhosAnswering() {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Know who&apos;s answering
          </h2>
          <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
            Every post shows where it comes from.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-1 flex-col overflow-hidden rounded-[28px] border"
              style={{ borderColor: C.line }}
            >
              <div className="flex min-h-[150px] flex-col items-start justify-center p-[22px]" style={{ backgroundColor: C.panel }}>
                <div
                  className="flex w-full flex-col gap-2 rounded-2xl border bg-white p-3.5"
                  style={{ borderColor: card.borderColor === "transparent" ? C.line : C.line, borderLeftWidth: card.borderColor !== "transparent" ? 4 : 1, borderLeftColor: card.borderColor }}
                >
                  <span
                    className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: card.tagBg, color: card.tagText }}
                  >
                    <Image src={`/support&developers-community-forums/${card.icon}.webp`} alt="" width={16} height={16} />
                    {card.tag}
                  </span>
                  <span className="h-2 w-full rounded" style={{ backgroundColor: C.line }} />
                  <span className="h-2 w-3/5 rounded" style={{ backgroundColor: C.line }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 p-[22px]">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold tracking-[-0.09px]" style={{ color: C.brandDeep }}>
                    {card.title}
                  </h3>
                  {card.badge && (
                    <span
                      className="rounded-full border border-dashed px-2.5 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: C.orangeFill, borderColor: C.orange, color: C.orangeTextDark }}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-[15px]" style={{ color: C.muted }}>
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
