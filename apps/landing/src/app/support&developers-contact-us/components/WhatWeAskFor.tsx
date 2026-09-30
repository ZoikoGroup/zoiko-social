import Image from "next/image";
import { C } from "./theme";

const NEVER_INCLUDE = [
  { icon: "icon-lock", title: "Passwords", fill: C.orangeFill },
  { icon: "icon-hash", title: "One-time codes", fill: C.orangeFill },
  { icon: "icon-card", title: "Card numbers", fill: C.orangeFill },
  { icon: "icon-key", title: "API keys", small: "or tokens", fill: C.orangeFill },
  { icon: "icon-check", title: "Screenshots are fine", small: "with private info hidden", fill: C.chip },
];

/** Section - 08 · WHAT WE ASK FOR — "Keep private details out", a 5-item card row. */
export default function WhatWeAskFor() {
  return (
    <section className="w-full px-5 py-10 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Keep private details out
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Leave these out of any request or attachment.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3.5 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:justify-center">
          {NEVER_INCLUDE.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2.5 rounded-[20px] border bg-white px-4 py-[22px] text-center lg:w-[235px] lg:shrink-0"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-[52px] items-center justify-center rounded-2xl" style={{ backgroundColor: item.fill }}>
                <Image src={`/support&developers-contact-us/${item.icon}.webp`} alt="" width={24} height={24} />
              </span>
              <p className="text-[14.5px] font-bold leading-[23.2px]" style={{ color: C.brandDeep }}>
                {item.title}
              </p>
              {item.small && (
                <p className="text-[12.5px] font-medium leading-5" style={{ color: C.muted }}>
                  {item.small}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
